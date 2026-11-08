import assert from 'node:assert/strict'
import { setTimeout as delay } from 'node:timers/promises'
import { runVisualCheck } from './lib/visual-check.mjs'

const base = process.env.HH_PREVIEW_URL || 'http://localhost:3000'
const waitFor = async (page, expression) => {
  for (let attempt = 0; attempt < 150; attempt++) {
    if (await page.eval(expression)) return
    await delay(100)
  }
  throw new Error(`Language state did not settle: ${expression}`)
}
const choose = async (page, language) => {
  await page.eval(`document.querySelector('[data-select-interface-language="${language}"]').closest('details').open = true; document.querySelector('[data-select-interface-language="${language}"]').focus()`)
  await page.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Enter', code: 'Enter', text: '\r', windowsVirtualKeyCode: 13 })
  await page.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 })
}
await runVisualCheck('interface-language-loading', base, async ({ browser, output }) => {
  for (const width of [390, 768, 1440]) {
    const page = await browser.newPage({ width, height: 1000, mobile: width < 600, reducedMotion: true })
    try {
      await page.goto(base)
      await page.eval("localStorage.removeItem('hh-interface-language')")
      await page.goto(base)
      const title = await page.eval('document.querySelector("h1").textContent')
      await choose(page, 'am')
      await waitFor(page, "!!document.querySelector('[data-select-interface-language=en]')")
      assert.equal(await page.eval("localStorage.getItem('hh-interface-language')"), 'am')
      assert.equal(await page.eval('document.querySelector("h1").textContent'), title)
      assert.equal(await page.eval("document.activeElement.matches('[data-language-switcher] summary')"), true)
      assert.ok(await page.eval("/\\p{Script=Ethiopic}/u.test(document.querySelector('[data-primary-navigation] a[href=\"/doctors\"]').textContent)"))
      await page.screenshot({ path: `${output}/amharic-${width}.png` })
      await page.goto(base)
      await waitFor(page, "!!document.querySelector('[data-select-interface-language=en]')")
      await choose(page, 'en')
      await waitFor(page, "!!document.querySelector('[data-select-interface-language=am]')")
      assert.equal(await page.eval("localStorage.getItem('hh-interface-language')"), 'en')
      assert.deepEqual(page.consoleErrors, [])
      console.log(`PASS language selection, focus return, reload persistence, editorial preservation at ${width}px`)
    } finally { await page.close() }
  }
  const page = await browser.newPage({ width: 1440, height: 1000 })
  try {
    await page.goto(base)
    await page.send('Network.setBlockedURLs', { urls: ['*/_next/static/chunks/*'] })
    await choose(page, 'am')
    await waitFor(page, "document.querySelector('[data-language-switcher] [role=status]')?.textContent.includes('Try again')")
    assert.equal(await page.eval("localStorage.getItem('hh-interface-language')"), 'en')
    await page.send('Network.setBlockedURLs', { urls: [] })
    await choose(page, 'am')
    await waitFor(page, "!!document.querySelector('[data-select-interface-language=en]')")
    assert.equal(await page.eval("document.querySelector('[data-language-switcher] [role=status]')"), null)
    console.log('PASS failed message download preserves English and supports retry')
    await choose(page, 'en')
  } finally { await page.close() }
})
