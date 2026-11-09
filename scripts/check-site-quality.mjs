import assert from 'node:assert/strict'
import { writeFile } from 'node:fs/promises'
import { runVisualCheck } from './lib/visual-check.mjs'

const base = process.env.HH_PREVIEW_URL || 'http://localhost:3000'
const routes = ['/', '/doctors', '/services', '/appointment', '/patients-visitors', '/emergency',
  '/referrals', '/feedback', '/health-topics', '/news-resources', '/health-topics/back-pain',
  '/news-resources/make-room-for-your-questions', '/news-resources/a-conversation-about-care',
  '/doctors/synthetic-clinician-121212121212/', '/services/synthetic-service-151515151515/',
  '/services/synthetic-service-121212121212/']
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
    for (const [route, target] of [['/referrals', 'prepare']]) {
      await page.goto(base + route)
      await activate(page, `main a[href="#${target}"]`)
      await settled(page)
      assert.equal(await page.eval('document.activeElement.id'), target)
      assert.equal(await page.eval('getComputedStyle(document.activeElement).outlineStyle'), 'solid')
      assert.equal(await page.eval('document.activeElement.getBoundingClientRect().top >= document.querySelector("[data-site-header]").getBoundingClientRect().bottom'), true)
    }
    await page.goto(base + '/feedback')
    assert.equal(await page.eval('document.querySelector("[data-page-variant=task] h1").textContent'), 'Patient feedback')
    assert.equal(await page.eval('Boolean(document.querySelector("#share form"))'), true, 'feedback opens directly into its task')
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
    await activate(page, 'main a[href="/health-topics"]')
    await waitFor(page, 'location.pathname === "/health-topics" && !!document.querySelector("#health-topic-search")')
    for (const route of ['/health-topics']) {
      await page.goto(base + route)
      await activate(page, '[aria-controls="health-topic-matches"]')
      await waitFor(page, '!!document.querySelector("[data-health-topic]")')
      const selected = await page.eval('document.querySelector("[data-health-topic]").dataset.healthTopic')
      await activate(page, '[data-health-topic]')
      await waitFor(page, 'document.activeElement.id === "health-topic-reader"')
      assert.equal(await page.eval('getComputedStyle(document.activeElement).outlineStyle'), 'solid')
      await page.eval(() => document.activeElement.scrollIntoView({ block: 'center', behavior: 'instant' }))
      await page.screenshot({ path: `${output}/${route === '/' ? 'home' : 'health'}-reader-${width}.png` })
      await activate(page, '#health-topic-reader button')
      assert.equal(await page.eval('document.activeElement.dataset.healthTopic'), selected)
    }
    await page.eval(() => document.querySelector('#health-topic-search').focus())
    await page.send('Input.insertText', { text: 'zzzznomatch' })
    await waitFor(page, 'document.querySelector("#health-topic-matches h3")?.textContent === "Matching topics" && !!document.querySelector("#health-topic-matches button")')
    assert.equal(await page.eval('document.querySelectorAll("[data-health-topic]").length'), 0)
    await activate(page, '#health-topic-matches button')
    await waitFor(page, 'document.querySelectorAll("[data-health-topic]").length > 0')
    if (width < 1024) {
      await activate(page, '[data-menu-trigger]')
      await waitFor(page, 'document.querySelector("[data-navigation-panel]").matches(":popover-open")')
      await page.eval(() => document.querySelector('[data-navigation-panel] a').focus())
      await key(page, 'Escape', 'Escape', 27)
      await waitFor(page, 'document.activeElement.hasAttribute("data-menu-trigger") && document.activeElement.getAttribute("aria-expanded") === "false"')
    }
    await page.eval(() => document.querySelector('[data-site-footer]').scrollIntoView({ block: 'end', behavior: 'instant' }))
    await settled(page)
    await activate(page, '[data-help-trigger]')
    await waitFor(page, 'document.querySelector("[data-help-panel]").matches(":popover-open")')
    await activate(page, '[aria-label="Close help options"]')
    assert.equal(await page.eval('document.activeElement.hasAttribute("data-help-trigger")'), true)
    assert.equal(await page.eval('document.documentElement.scrollWidth > innerWidth'), false)
    assert.equal(await page.eval('document.getAnimations().filter(animation => animation.playState === "running").length'), 0)
    assert.deepEqual(page.consoleErrors, [])
    if (width === 390) {
      await page.eval(() => document.querySelector('[data-site-footer]').scrollIntoView({ block: 'end', behavior: 'instant' }))
      await page.screenshot({ path: `${output}/home-footer-390.png` })
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
    console.log(`PASS ${width}px: section jumps, feedback review/edit/reset, health reader focus/return, navigation dismissal, help dismissal, no-results recovery`)
  }
})
