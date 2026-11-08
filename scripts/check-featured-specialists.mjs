import assert from 'node:assert/strict'
import { setTimeout as delay } from 'node:timers/promises'
import { runVisualCheck } from './lib/visual-check.mjs'

const base = process.env.HH_PREVIEW_URL || 'http://localhost:3000'
const key = async (page, value, number) => {
  await page.send('Input.dispatchKeyEvent', { type: 'keyDown', key: value, code: value, windowsVirtualKeyCode: number, ...(value === 'Enter' ? { text: '\r' } : {}) })
  await page.send('Input.dispatchKeyEvent', { type: 'keyUp', key: value, code: value, windowsVirtualKeyCode: number })
}
const visible = () => [...document.querySelectorAll('#featured-specialists .team-person')].filter(card => card.getClientRects().length).length
const atEnd = () => {
  const rail = document.querySelector('#featured-specialists')
  return Math.abs(rail.scrollWidth - rail.clientWidth - rail.scrollLeft) < 2
}
const capture = async (page, output, name) => {
  await delay(250)
  // Keep the real viewport: beyond-viewport clips can mispaint scrolled text.
  await page.screenshot({ path: `${output}/${name}.png` })
}

await runVisualCheck('featured-specialists', base, async ({ browser, output }) => {
  for (const width of [390, 768, 1440]) {
    const page = await browser.newPage({ width, height: 1500, mobile: width < 600, reducedMotion: true })
    try {
      await page.goto(base)
      // Confirms that this preview serves the new six-profile implementation.
      assert.equal(await page.eval("document.querySelectorAll('#featured-specialists .team-person').length"), 6)
      assert.equal(await page.eval(visible), width < 768 ? 3 : 6)
      assert.equal(await page.eval("document.querySelector('#featured-specialists').lastElementChild.querySelector('a').getAttribute('href')"), '/doctors')
      await page.eval("document.querySelector('#home-doctors').scrollIntoView({block:'start',behavior:'instant'})")
      await capture(page, output, `initial-${width}`)
      if (width >= 768) {
        assert.equal(await page.eval("document.querySelector('[aria-label=\"Previous specialists\"]').getAttribute('aria-disabled')"), 'true')
        const tops = await page.eval("[...document.querySelectorAll('#featured-specialists .team-person')].map(card=>Math.round(card.getBoundingClientRect().top))")
        assert.equal(new Set(tops).size, 1, 'All specialists stay in one row')
        await page.eval("document.querySelector('[aria-label=\"Next specialists\"]').focus()")
        await key(page, 'Enter', 13)
        await delay(150)
        assert.ok(await page.eval("document.querySelector('#featured-specialists').scrollLeft > 0"))
        await capture(page, output, `more-${width}`)
        await page.eval("document.querySelector('[aria-label=\"Next specialists\"]').focus()")
        await key(page, 'Enter', 13)
        await delay(150)
        assert.ok(await page.eval(atEnd))
        assert.equal(await page.eval("document.activeElement.getAttribute('aria-label')"), 'Next specialists', 'End state retains keyboard focus')
        assert.equal(await page.eval("document.activeElement.getAttribute('aria-disabled')"), 'true')
        await capture(page, output, `directory-${width}`)
        await page.eval("document.querySelector('[aria-label=\"Previous specialists\"]').click(); document.querySelector('[aria-label=\"Previous specialists\"]').click()")
        await delay(150)
        assert.ok(await page.eval("document.querySelector('#featured-specialists').scrollLeft < 2"))
        // Native Tab navigation must reveal every offscreen profile and the directory.
        await page.eval("document.querySelector('#featured-specialists .team-person').focus()")
        for (let i = 1; i < 6; i++) {
          await key(page, 'Tab', 9)
          assert.equal(await page.eval(`document.activeElement === document.querySelectorAll('#featured-specialists .team-person')[${i}]`), true)
          assert.ok(await page.eval(() => {
            const rail = document.querySelector('#featured-specialists').getBoundingClientRect()
            const focused = document.activeElement.getBoundingClientRect()
            return focused.left >= rail.left - 2 && focused.right <= rail.right + 2
          }), 'Focused profile is fully visible')
        }
        await key(page, 'Tab', 9)
        assert.equal(await page.eval("document.activeElement.getAttribute('href')"), '/doctors')
        await page.eval("document.querySelectorAll('#featured-specialists .team-person')[5].focus()")
        await page.setViewport({ width: 390, height: 1500, mobile: true })
        await delay(150)
        assert.equal(await page.eval(visible), 3)
        assert.equal(await page.eval("document.activeElement === document.querySelector('#featured-specialists').lastElementChild.querySelector('a')"), true)
        await page.setViewport({ width, height: 1500 })
        await delay(150)
        assert.equal(await page.eval("document.activeElement.getAttribute('href')"), '/doctors')
        await page.eval("document.querySelector('[aria-label=\"Previous specialists\"]').focus(); document.querySelector('#featured-specialists').scrollTo({left:0,behavior:'instant'})")
        await delay(100)
        // Toggle reduced motion during an actual smooth browse.
        await page.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] })
        await page.eval("document.querySelector('[aria-label=\"Next specialists\"]').click()")
        await delay(80)
        await page.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] })
        await delay(100)
        const position = await page.eval("document.querySelector('#featured-specialists').scrollLeft")
        await delay(150)
        assert.equal(await page.eval("document.querySelector('#featured-specialists').scrollLeft"), position, 'Live reduced motion stops travel')
        await page.eval("document.querySelector('[aria-label=\"Next specialists\"]').click()")
        await delay(100)
        assert.ok(await page.eval("document.querySelector('#featured-specialists').scrollLeft") > position, 'Browsing remains usable after motion preference changes')
        await page.eval("document.querySelector('[aria-label=\"Next specialists\"]').click()")
        await delay(100)
        assert.ok(await page.eval(atEnd))
      } else {
        assert.equal(await page.eval("document.querySelector('[aria-label=\"Browse featured specialists\"]') === null"), true)
        await page.eval("document.querySelectorAll('#featured-specialists .team-person')[2].focus()")
        await key(page, 'Tab', 9)
        assert.equal(await page.eval("document.activeElement === document.querySelector('#featured-specialists').lastElementChild.querySelector('a')"), true)
        await page.screenshot({ path: `${output}/mobile-directory.png` })
      }
      assert.equal(await page.eval('document.documentElement.scrollWidth > innerWidth'), false)
      assert.deepEqual(page.consoleErrors, [])
    } finally { await page.close() }
    console.log(`PASS ${width}: featured layout, directory link, keyboard navigation${width >= 768 ? ', row controls, resize and live reduced motion' : ''}`)
  }
  for (const width of [390, 1440]) {
    const page = await browser.newPage({ width, height: 1500, mobile: width < 600, reducedMotion: true })
    try {
      await page.send('Emulation.setScriptExecutionDisabled', { value: true })
      await page.goto(base)
      await page.eval("document.querySelector('#home-doctors').scrollIntoView({block:'start',behavior:'instant'})")
      assert.equal(await page.eval(visible), width < 768 ? 3 : 6)
      assert.equal(await page.eval("document.querySelector('[aria-label=\"Browse featured specialists\"]') === null"), true)
      if (width >= 768) {
        await page.eval("document.querySelector('#featured-specialists').scrollLeft = 100000")
        assert.ok(await page.eval(atEnd))
      }
      await capture(page, output, `no-script-${width}`)
    } finally { await page.close() }
  }
  console.log('PASS no-JavaScript mobile directory and native desktop scrolling')
})
