import assert from 'node:assert/strict'
import { writeFile } from 'node:fs/promises'
import { runVisualCheck } from './lib/visual-check.mjs'

const base = process.env.HH_PREVIEW_URL || 'http://localhost:3000'
const routes = ['/', '/about', '/doctors', '/services', '/appointment', '/contact', '/emergency',
  '/referrals', '/feedback', '/news-resources', '/services/synthetic-service-171717171717',
  '/news-resources/make-room-for-your-questions', '/news-resources/a-conversation-about-care',
  '/doctors/synthetic-clinician-121212121212/', '/services/synthetic-service-151515151515/',
  '/services/synthetic-service-111111111111/']
const waitFor = async (page, expression) => {
  for (let attempt = 0; attempt < 100; attempt++) {
    if (await page.eval(expression)) return
    await new Promise(resolve => setTimeout(resolve, 100))
  }
  throw new Error(`Timed out: ${expression}`)
}
const key = async (page, key, code = key, number = 13) => {
  await page.send('Input.dispatchKeyEvent', { type: 'keyDown', key, code, windowsVirtualKeyCode: number, ...(key === 'Enter' ? { text: '\r' } : {}) })
  await page.send('Input.dispatchKeyEvent', { type: 'keyUp', key, code, windowsVirtualKeyCode: number })
}
const activate = async (page, selector) => {
  await page.eval(`document.querySelector(${JSON.stringify(selector)}).focus()`)
  await key(page, 'Enter')
}
const settled = page => page.eval('new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))')

await runVisualCheck('site-quality', base, async ({ browser, output }) => {
  const inventory = []
  const page = await browser.newPage({ width: 390, height: 1000, mobile: true, reducedMotion: true })
  for (const route of routes) {
    await page.goto(base + route)
    const result = await page.eval(() => {
      const visible = element => !!element.getClientRects().length && getComputedStyle(element).visibility !== 'hidden'
      const ids = [...document.querySelectorAll('[id]')].map(element => element.id)
      return { ids, duplicates: ids.filter((id, index) => ids.indexOf(id) !== index),
        links: [...document.querySelectorAll('a[href]')].filter(visible).map(element => element.getAttribute('href')),
        unnamed: [...document.querySelectorAll('button,a[href],input:not([type=hidden]),select,textarea')].filter(visible)
          .filter(element => !element.getAttribute('aria-label') && !element.getAttribute('aria-labelledby') && !element.textContent.trim() && !element.labels?.length && !element.querySelector('img[alt]'))
          .map(element => element.outerHTML.slice(0, 200)),
        runningAnimations: document.getAnimations().filter(animation => animation.playState === 'running').length }
    })
    inventory.push({ route, ...result })
    if (route !== '/') {
      const description = await page.eval('document.querySelector("meta[name=description]")?.content')
      assert.ok(description?.trim(), `${route}: missing page description`)
      assert.notEqual(description, 'Find care and visitor information at Hallelujah Hospital.', `${route}: inherited generic description`)
    }
    if (route === '/' || route === '/news-resources') {
      const levels = await page.eval('[...document.querySelectorAll("[data-editorial-card]")].map(card => card.querySelector("h2,h3")?.tagName)')
      assert.ok(levels.length > 0)
      assert.ok(levels.every(level => level === (route === '/' ? 'H3' : 'H2')), `${route}: editorial heading context`)
    }
    if (route === '/services/synthetic-service-111111111111/') {
      const actions = await page.eval('[...document.querySelectorAll("#care-team a, #referrals a")].map(link => link.getBoundingClientRect().height)')
      assert.equal(actions.length, 3)
      assert.ok(actions.every(height => height >= 44), 'Admission next steps use accessible shared action targets')
    }
    assert.deepEqual(result.duplicates, [], `${route}: duplicate IDs`)
    assert.deepEqual(result.unnamed, [], `${route}: unnamed visible controls`)
    assert.equal(result.runningAnimations, 0, `${route}: reduced motion`)
    await key(page, 'Tab', 'Tab', 9)
    assert.equal(await page.eval('document.activeElement.hasAttribute("data-skip-link")'), true, `${route}: first Tab reaches skip link`)
    await key(page, 'Enter')
    assert.equal(await page.eval('document.activeElement.id'), 'main-content', `${route}: skip link focus`)
    assert.deepEqual(page.consoleErrors, [])
  }
  for (const source of inventory) for (const href of source.links) {
    if (!href.startsWith('/') && !href.startsWith('#')) continue
    const url = new URL(href, base + source.route)
    const destination = inventory.find(entry => entry.route.replace(/\/$/u, '') === url.pathname.replace(/\/$/u, ''))
    if (destination && url.hash) assert.equal(destination.ids.includes(decodeURIComponent(url.hash.slice(1))), true, `${source.route}: missing target ${href}`)
  }
  await writeFile(`${output}/inventory.json`, `${JSON.stringify(inventory, null, 2)}\n`)
  await page.close()
  console.log(`PASS ${routes.length} page samples: skip links, visible control names, duplicate IDs, fragment targets, reduced motion, browser errors`)

  for (const width of [390, 768, 1440]) {
    const page = await browser.newPage({ width, height: 1000, mobile: width < 600, reducedMotion: true })
    for (const [route, target] of [['/contact', 'before-you-travel']]) {
      await page.goto(base + route)
      await activate(page, `main a[href="#${target}"]`)
      await settled(page)
      assert.equal(await page.eval('document.activeElement.id'), target)
      assert.equal(await page.eval('getComputedStyle(document.activeElement).outlineStyle'), 'solid')
      assert.equal(await page.eval('document.activeElement.getBoundingClientRect().top >= document.querySelector("[data-site-header]").getBoundingClientRect().bottom'), true)
    }
    await page.goto(base + '/referrals')
    assert.equal(await page.eval(() => document.querySelector('main a.solid-button').getAttribute('href')), 'tel:+251114704242')
    await page.goto(base + '/feedback')
    assert.equal(await page.eval('document.querySelector("[data-page-variant=task] h1").textContent'), 'Patient feedback')
    assert.equal(await page.eval(() => document.querySelector('main a.solid-button').getAttribute('href')), '/contact')
    await activate(page, '#share summary')
    await page.eval('document.querySelector("#share select").focus()')
    assert.equal(await page.eval('document.activeElement.closest("section").id'), 'share', 'feedback form is keyboard reachable')
    await waitFor(page, '!document.querySelector("#feedback-message").disabled')
    await page.eval(() => document.querySelector('#feedback-message').focus())
    await page.send('Input.insertText', { text: 'SAMPLE FEEDBACK: clearer arrival signs would help.' })
    await activate(page, 'form button[type=submit]')
    await waitFor(page, 'document.activeElement.getAttribute("aria-labelledby") === "feedback-review-title"')
    assert.equal(await page.eval('getComputedStyle(document.querySelector("button.text-link")).backgroundColor'), 'rgba(0, 0, 0, 0)')
    await page.eval(() => document.activeElement.scrollIntoView({ block: 'center', behavior: 'instant' }))
    await page.screenshot({ path: `${output}/feedback-review-${width}.png` })
    await activate(page, 'button.solid-button[type=button]')
    assert.equal(await page.eval('document.activeElement.id'), 'feedback-message')
    assert.match(await page.eval('document.activeElement.value'), /SAMPLE FEEDBACK/u)
    await activate(page, 'form button[type=submit]')
    await waitFor(page, '!!document.querySelector("button.text-link")')
    await activate(page, 'button.text-link')
    assert.equal(await page.eval('document.activeElement.id'), 'feedback-message')
    assert.equal(await page.eval('document.activeElement.value'), '')

    await page.goto(base + '/')
    assert.equal(await page.eval(() => document.querySelector('a[href^="/health-topics"]')), null)
    if (width < 1024) {
      await activate(page, '[data-menu-trigger]')
      await waitFor(page, 'document.querySelector("[data-navigation-panel]").matches(":popover-open")')
      await page.eval(() => document.querySelector('[data-navigation-panel] a').focus())
      await key(page, 'Escape', 'Escape', 27)
      await waitFor(page, 'document.activeElement.hasAttribute("data-menu-trigger") && document.activeElement.getAttribute("aria-expanded") === "false"')
    }
    await page.eval(() => document.querySelector('[data-site-footer]').scrollIntoView({ block: 'end', behavior: 'instant' }))
    await settled(page)
    assert.equal(await page.eval('document.querySelector("[data-call-trigger]").getAttribute("href")'), 'tel:9975')
    await page.eval(() => document.querySelector('[data-call-trigger]').focus())
    assert.equal(await page.eval('document.activeElement.hasAttribute("data-call-trigger")'), true)
    assert.equal(await page.eval('document.documentElement.scrollWidth > innerWidth'), false)
    assert.equal(await page.eval('document.getAnimations().filter(animation => animation.playState === "running").length'), 0)
    assert.deepEqual(page.consoleErrors, [])
    if (width === 390) {
      await page.eval(() => document.querySelector('[data-site-footer]').scrollIntoView({ block: 'end', behavior: 'instant' }))
      await page.screenshot({ path: `${output}/home-footer-390.png` })
      for (const [route, selector] of [['/careers', '#apply p'], ['/partnerships', 'main textarea']]) {
        await page.goto(base + route)
        await page.eval(`(() => {
          const target = document.querySelector('${selector}').getBoundingClientRect()
          const call = document.querySelector('[data-call-trigger]').getBoundingClientRect()
          scrollBy({ top: target.top + target.height / 2 - call.top - call.height / 2, behavior: 'instant' })
        })()`)
        await waitFor(page, 'getComputedStyle(document.querySelector("[data-call-trigger]")).pointerEvents === "none"')
        await page.screenshot({ path: `${output}/clear-${route.slice(1)}-390.png` })
        await page.eval("scrollTo({top: document.documentElement.scrollHeight, behavior: 'instant'})")
        await waitFor(page, 'getComputedStyle(document.querySelector("[data-call-trigger]")).opacity === "1"')
      }
    }
    for (const directory of ['doctors', 'services']) {
      await page.goto(`${base}/${directory}?q=zzzznomatch`)
      assert.equal(await page.eval('!!document.querySelector("[data-directory-empty]")'), true)
      await activate(page, '[data-directory-empty] a')
      await waitFor(page, '!location.search && !document.querySelector("[data-directory-empty]") && !!document.querySelector("input[type=search]")')
      assert.equal(await page.eval('document.querySelector("input[type=search]").value'), '')
      assert.deepEqual(page.consoleErrors, [])
    }
    await page.close()
    console.log(`PASS ${width}px: section jumps, feedback review/edit/reset, navigation dismissal, hotline focus, no-results recovery`)
  }
})
