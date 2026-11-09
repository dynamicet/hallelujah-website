import assert from 'node:assert/strict'
import { setTimeout as delay } from 'node:timers/promises'
import { runVisualCheck } from './lib/visual-check.mjs'

const base = process.env.HH_PREVIEW_URL || 'http://localhost:3000'
const enter = async (page) => {
  await page.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13, text: '\r' })
  await page.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 })
}
await runVisualCheck('header-return', base, async ({ browser, output }) => {
  for (const width of [390, 768, 1440]) {
    const page = await browser.newPage({ width, height: 1000, mobile: width < 600 })
    for (const reduced of [false, true]) {
      await page.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: reduced ? 'reduce' : 'no-preference' }] })
      await page.goto(base)
      await page.eval("window.headerTestDocument = document; window.headerTestHistory = history.length; scrollTo({top:1200,behavior:'instant'}); document.querySelector('[data-shell-identity]').focus({preventScroll:true})")
      assert.ok(await page.eval('scrollY > 0'))
      await enter(page)
      await delay(1000)
      assert.equal(await page.eval('scrollY'), 0)
      assert.ok(await page.eval('document === window.headerTestDocument && history.length === window.headerTestHistory'))
      // The logo must still navigate home from another page.
      await page.goto(base + '/doctors')
      await page.eval("window.headerTestDocument = document; scrollTo({top:700,behavior:'instant'})")
      if (width < 1024) {
        await page.eval("document.querySelector('[data-menu-trigger]').click()")
        await delay(200)
      }
      await page.eval("document.querySelector('[data-primary-navigation] a[href=\"/doctors\"]').focus({preventScroll:true})")
      await enter(page)
      await delay(1000)
      assert.equal(await page.eval('scrollY'), 0)
      assert.equal(await page.eval('location.pathname'), '/doctors')
      assert.ok(await page.eval('document === window.headerTestDocument'))
      if (width < 1024) {
        assert.equal(await page.eval("document.querySelector('[data-navigation-panel]').matches(':popover-open')"), false)
        assert.ok(await page.eval("document.activeElement.matches('[data-menu-trigger]')"))
      } else {
        assert.ok(await page.eval("document.activeElement.matches('[data-primary-navigation] a[href=\"/doctors\"]')"))
      }
      await page.screenshot({ path: `${output}/doctors-${width}-${reduced}.png` })
      await page.eval("document.querySelector('[data-shell-identity]').click()")
      for (let attempt = 0; attempt < 100 && !(await page.eval("location.pathname === '/'")); attempt++) await delay(100)
      assert.equal(await page.eval('location.pathname'), '/')
    }
    assert.deepEqual(page.consoleErrors, [])
    await page.close()
    console.log(`PASS ${width}: logo, current link, keyboard focus, menu close, document reuse, reduced motion, return home`)
  }
})
