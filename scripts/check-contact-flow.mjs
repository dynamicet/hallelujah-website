import assert from 'node:assert/strict'
import { writeFile } from 'node:fs/promises'
import { runVisualCheck } from './lib/visual-check.mjs'
const base = process.env.HH_PREVIEW_URL || 'http://localhost:3000'
const key = async (p, key, number = 13) => {
  await p.send('Input.dispatchKeyEvent', { type: 'keyDown', key, code: key, windowsVirtualKeyCode: number, ...(key === 'Enter' ? { text: '\r' } : {}) })
  await p.send('Input.dispatchKeyEvent', { type: 'keyUp', key, code: key, windowsVirtualKeyCode: number })
}
const wait = async (p, expression) => {
  for (let i = 0; i < 150; i++) {
    if (await p.eval(expression)) return
    await new Promise(resolve => setTimeout(resolve, 100))
  }
  throw new Error(expression.toString() + ' ' + JSON.stringify(await p.eval(() => ({ active: document.activeElement.outerHTML.slice(0,300), top: document.activeElement.getBoundingClientRect().top, header: document.querySelector('[data-site-header]').getBoundingClientRect().bottom, url: location.href }))))
}
const activate = async (p, selector) => {
  await p.eval(`document.querySelector(${JSON.stringify(selector)}).focus()`)
  await key(p, 'Enter')
}
const landed = (p, id) => wait(p, `document.activeElement.id === ${JSON.stringify(id)} && document.activeElement.getBoundingClientRect().top >= document.querySelector('[data-site-header]').getBoundingClientRect().bottom && document.activeElement.getBoundingClientRect().top < innerHeight`)
await runVisualCheck('contact-polish', base, async ({ browser, output }) => {
  const redirect = await fetch(base + '/patients-visitors', { redirect: 'manual' })
  assert.equal(redirect.status, 308)
  assert.equal(new URL(redirect.headers.get('location'), base).href, base + '/contact#before-you-travel')
  const results = []
  for (const width of [320, 390, 768, 1440]) {
    const p = await browser.newPage({ width, height: 900, mobile: width < 600, reducedMotion: true })
    await p.goto(base)
    if (width < 1024) {
      await activate(p, '[data-menu-trigger]')
      await wait(p, 'document.querySelector("[data-navigation-panel]").matches(":popover-open")')
      await p.screenshot({ path: `${output}/header-menu-${width}.png` })
      await activate(p, '[data-navigation-panel] a[href="/contact"]')
    } else await activate(p, '[data-top-bar] a[href="/contact"]')
    await wait(p, 'location.pathname === "/contact" && !!document.querySelector("[data-hospital-contact]")')
    await wait(p, '!document.querySelector("[data-navigation-panel]").matches(":popover-open")')
    assert.equal(await p.eval(() => !!document.querySelector('[data-site-header] a[href="/contact"][aria-current="page"]')), true)
    for (const id of ['directions', 'contact-reception', 'before-you-travel']) {
      await activate(p, `[aria-label="On this page"] a[href="#${id}"]`)
      await landed(p, id)
      assert.equal(await p.eval('getComputedStyle(document.activeElement).outlineStyle'), 'solid')
      await p.screenshot({ path: `${output}/${id}-focus-${width}.png` })
    }
    const targets = await p.eval(() => ({
      overflow: document.documentElement.scrollWidth > innerWidth,
      phone: document.querySelector('main a[href^="tel:"]').getAttribute('href'),
      email: document.querySelector('main a[href^="mailto:"]').getAttribute('href'),
      directions: document.querySelector('main a[href*="/maps/dir/"]').getAttribute('href'),
      shortLinks: [...document.querySelectorAll('main a')].filter(a => a.getBoundingClientRect().height < 44).map(a => a.textContent),
      runningAnimations: document.getAnimations().filter(a => a.playState === 'running').length,
    }))
    assert.equal(targets.overflow, false)
    assert.equal(targets.phone, 'tel:+251114704242')
    assert.equal(targets.email, 'mailto:info@hallelujahhospital.com')
    assert.match(targets.directions, /destination=8.9861882%2C38.7590401/)
    assert.deepEqual(targets.shortLinks, [])
    assert.equal(targets.runningAnimations, 0)
    assert.equal(await p.eval(() => document.querySelectorAll('a[href^="/patients-visitors"], #before-you-travel input, #before-you-travel button').length), 0)
    await p.eval(() => document.querySelector('[data-map-credit]').focus())
    assert.equal(await p.eval('getComputedStyle(document.activeElement).outlineStyle'), 'solid')
    assert.ok(Number.parseFloat(await p.eval('getComputedStyle(document.activeElement).outlineOffset')) < 0, 'Map attribution focus stays inside the clipped map')
    await activate(p, 'main a[href="/#home-directions"]')
    await wait(p, 'location.pathname === "/" && !!document.querySelector("#home-directions")')
    await landed(p, 'home-directions')
    await p.goto(base)
    await activate(p, '.home-quick-access a[href="#home-directions"]')
    await landed(p, 'home-directions')
    await p.screenshot({ path: `${output}/section-arrival-${width}.png` })
    await activate(p, '#home-directions a[href="/contact"]')
    await wait(p, 'location.pathname === "/contact" && !!document.querySelector("[data-hospital-contact]")')
    await activate(p, 'main a[href="/#home-directions"]')
    await wait(p, 'location.pathname === "/" && !!document.querySelector("#home-directions")')
    await landed(p, 'home-directions')
    await activate(p, '#home-directions a[href="/contact#before-you-travel"]')
    await wait(p, 'location.pathname === "/contact" && !!document.querySelector("#before-you-travel")')
    await landed(p, 'before-you-travel')
    await p.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] })
    await activate(p, '[aria-label="On this page"] a[href="#directions"]')
    await landed(p, 'directions')
    assert.deepEqual(p.consoleErrors, [])
    results.push({ width, ...targets, headerToContact: 'passed', homepageShortcut: 'passed', preparationDeepLink: 'passed', normalMotion: 'passed' })
    await p.close()
    console.log(`PASS header → Contact page, homepage shortcut, return, focus and reduced/normal motion at ${width}px`)
  }
  const p = await browser.newPage({ width: 390, height: 900, mobile: true, reducedMotion: true })
  await p.goto(base + '/contact')
  await key(p, 'Tab', 9)
  assert.equal(await p.eval('document.activeElement.hasAttribute("data-skip-link")'), true)
  await key(p, 'Enter')
  assert.equal(await p.eval('document.activeElement.id'), 'main-content')
  const point = await p.eval(() => {
    const r = document.querySelector('nav[aria-label="On this page"] a[href="#directions"]').getBoundingClientRect()
    return { x: r.x + r.width / 2, y: r.y + r.height / 2 }
  })
  await p.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [point] })
  await p.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
  await landed(p, 'directions')
  await p.goto(base + '/appointment')
  await activate(p, '#appointment-call a[href="/contact"]')
  await wait(p, 'location.pathname === "/contact" && !!document.querySelector("#what-to-bring")')
  assert.equal(await p.eval(() => document.querySelector('#what-to-bring-title').textContent), 'What to bring')
  await p.send('Emulation.setScriptExecutionDisabled', { value: true })
  await p.goto(base + '/patients-visitors#checklist')
  await wait(p, 'location.pathname === "/contact" && location.hash === "#before-you-travel"')
  assert.equal(await p.eval(() => document.querySelector('#what-to-bring-title').textContent), 'What to bring')
  await p.goto(base + '/contact')
  await activate(p, 'nav[aria-label="On this page"] a[href="#directions"]')
  await landed(p, 'directions')
  assert.equal(await p.eval(() => document.querySelector('main a[href^="tel:"]').getAttribute('href')), 'tel:+251114704242')
  await p.screenshot({ path: `${output}/native-directions-390.png` })
  await p.close()
  await writeFile(`${output}/measurements.json`, JSON.stringify(results, null, 2) + '\n')
  console.log('PASS skip navigation, touch shortcut, appointment handoff to Contact & directions, legacy bookmark and no-JavaScript directions')
})
