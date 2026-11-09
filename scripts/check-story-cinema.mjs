import assert from 'node:assert/strict'
import { setTimeout as pause } from 'node:timers/promises'
import { runVisualCheck } from './lib/visual-check.mjs'

const base = process.env.HH_PREVIEW_URL || 'http://localhost:3000'
const key = async (page, value, modifiers = 0) => {
  await page.send('Input.dispatchKeyEvent', { type: 'keyDown', key: value, code: value, modifiers, windowsVirtualKeyCode: {Enter:13,Tab:9,Escape:27}[value], ...(value === 'Enter' ? { text: '\r' } : {}) })
  await page.send('Input.dispatchKeyEvent', { type: 'keyUp', key: value, code: value, modifiers })
}
await runVisualCheck('story-cinema', base, async ({ browser, output }) => {
  for (const [width, height] of [[320, 800], [390, 844], [768, 1000], [1440, 1000], [844, 390]]) {
    const page = await browser.newPage({ width, height, mobile: width < 600 })
    await page.goto(base)
    await page.eval(() => document.querySelector('.everyday-stories').scrollIntoView({ block: 'start', behavior: 'instant' }))
    await pause(1000)
    const before = await page.eval(() => ({ y: scrollY, overflow: document.body.style.overflow, padding: document.body.style.paddingRight, width: document.querySelector('.everyday-feature').getBoundingClientRect().width }))
    await page.eval(() => document.querySelector('.everyday-film > summary').focus({ preventScroll: true }))
    await key(page, 'Enter')
    await pause(300)
    assert.ok(await page.eval(() => document.querySelector('.story-cinema[open]')?.matches(':modal')))
    assert.ok(await page.eval(() => document.activeElement.matches('.story-cinema-close')))
    assert.ok(await page.eval(() => document.querySelector('.story-cinema[open] video').paused), 'opening is opt-in; playback remains manual')
    assert.equal(await page.eval(() => document.querySelector('.everyday-film').open), false)
    const rect = await page.eval(() => { const r = document.querySelector('.story-cinema[open]').getBoundingClientRect(); return { x: r.x, y: r.y, right: r.right, bottom: r.bottom } })
    assert.ok(rect.x >= 0 && rect.y >= 0 && rect.right <= width && rect.bottom <= height + 1)
    assert.equal(await page.eval(() => document.documentElement.scrollWidth > innerWidth), false)
    await page.screenshot({ path: `${output}/open-${width}.png` })
    for (let i = 0; i < 14; i++) {
      await key(page, 'Tab', i > 9 ? 8 : 0)
      // Chromium may report body while focus traverses browser chrome; background controls must remain inert.
      assert.ok(await page.eval(() => document.activeElement === document.body || document.querySelector('.story-cinema[open]').contains(document.activeElement)), 'Tab never reaches background controls')
    }
    await page.eval(() => document.querySelector('.story-cinema[open] .everyday-transcript > summary').focus())
    await key(page, 'Enter')
    await pause(300)
    assert.ok(await page.eval(() => document.querySelector('.story-cinema[open] .everyday-transcript').open))
    assert.ok(await page.eval(() => document.activeElement.matches('.everyday-transcript > summary')))
    const close = await page.eval(() => { const r = document.querySelector('.story-cinema[open] .story-cinema-close').getBoundingClientRect(); return { top: r.top, bottom: r.bottom } })
    assert.ok(close.top >= 0 && close.bottom <= height, 'Close remains visible while reading')
    await page.screenshot({ path: `${output}/transcript-${width}.png` })
    await key(page, 'Escape')
    await pause(100)
    assert.equal(await page.eval(() => document.querySelectorAll('.story-cinema[open]').length), 0)
    assert.ok(await page.eval(() => document.activeElement === document.querySelector('.everyday-film > summary')))
    const after = await page.eval(() => ({ y: scrollY, overflow: document.body.style.overflow, padding: document.body.style.paddingRight, width: document.querySelector('.everyday-feature').getBoundingClientRect().width }))
    assert.deepEqual(after, before, 'closing restores page position, scroll styles and layout')
    const storyTitles = await page.eval(() => [...document.querySelectorAll('.everyday-film > summary')].map(summary => summary.closest('.everyday-feature').querySelector('h3').textContent))
    assert.ok(storyTitles.length > 0, 'the homepage retains its featured story')
    for (const [index, title] of storyTitles.entries()) {
      await page.eval(`document.querySelectorAll('.everyday-film > summary')[${index}].click()`)
      assert.equal(await page.eval(() => document.querySelector('.story-cinema[open] .story-cinema-title').textContent), title)
      await page.eval(() => document.querySelector('.story-cinema[open] .story-cinema-close').click())
      await pause(100)
      assert.ok(await page.eval(`document.activeElement === document.querySelectorAll('.everyday-film > summary')[${index}]`))
    }
    await page.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] })
    await page.eval(() => document.querySelector('.everyday-film > summary').click())
    assert.equal(await page.eval(() => getComputedStyle(document.querySelector('.story-cinema[open]')).animationName), 'none')
    await page.screenshot({ path: `${output}/reduced-${width}.png` })
    await page.send('Input.dispatchMouseEvent', { type: 'mousePressed', x: 4, y: 4, button: 'left', clickCount: 1 })
    await page.send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: 4, y: 4, button: 'left', clickCount: 1 })
    await pause(100)
    assert.equal(await page.eval(() => document.querySelectorAll('.story-cinema[open]').length), 0, 'backdrop dismisses')
    assert.deepEqual(page.consoleErrors, [])
    await page.close()
    console.log(`PASS ${width}×${height}: dialog, focus containment/return, transcript, Escape/Close/backdrop, stable page, reduced motion`)
  }
  const page = await browser.newPage({ width: 390, height: 844, mobile: true })
  await page.send('Emulation.setScriptExecutionDisabled', { value: true })
  await page.goto(base)
  await page.eval(() => { const s = document.querySelector('.everyday-film > summary'); s.scrollIntoView({ block: 'start', behavior: 'instant' }); s.click() })
  await pause(600)
  assert.ok(await page.eval(() => document.querySelector('.everyday-film').open))
  assert.ok(await page.eval(() => document.querySelector('.everyday-film video').getBoundingClientRect().height >= 100))
  await page.screenshot({ path: `${output}/no-js-390.png` })
  await page.close()
  console.log('PASS native inline film fallback without JavaScript')
})
