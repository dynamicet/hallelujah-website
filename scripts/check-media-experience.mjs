import assert from 'node:assert/strict'
import { setTimeout as delay } from 'node:timers/promises'
import { runVisualCheck } from './lib/visual-check.mjs'
const base = process.env.HH_PREVIEW_URL || 'http://localhost:3000'
async function waitFor(page, expression) {
  for (let i = 0; i < 100; i++) { if (await page.eval(expression)) return; await delay(100) }
  assert.fail('Timed out: ' + expression)
}
async function enter(page) {
  await page.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13, text: '\r' })
  await page.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 })
}
await runVisualCheck('media-experience', base, async ({ browser, output }) => {
  for (const width of [390, 768, 1440]) {
    const page = await browser.newPage({ width, height: 1000, mobile: width < 600 })
    await page.goto(base)
    assert.equal(await page.eval("document.querySelector('.care-background-film') === null"), true)
    await page.goto(base + '/about')
    assert.equal(await page.eval("document.querySelector('#hospital-film video').preload"), 'none')
    assert.equal(await page.eval("document.querySelector('#hospital-film video').controls"), true)
    assert.equal(await page.eval("document.querySelector('#hospital-film video').autoplay"), false)
    assert.equal(await page.eval("document.querySelector('#hospital-film video').loop"), false)
    await page.eval("document.querySelector('#hospital-film').scrollIntoView({block:'center',behavior:'instant'})")
    await page.screenshot({ path: output + '/about-poster-' + width + '.png' })
    await page.goto(base)
    await page.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] })
    await page.eval("document.querySelector('.everyday-film > summary').scrollIntoView({block:'center',behavior:'instant'}); document.querySelector('.everyday-film > summary').focus()")
    await delay(500)
    await page.screenshot({ path: output + '/portrait-' + width + '.png' })
    await enter(page)
    await delay(500)
    assert.equal(await page.eval("document.querySelector('.story-cinema[open]') !== null"), true)
    assert.equal(await page.eval("document.activeElement === document.querySelector('.story-cinema[open] .story-cinema-close')"), true)
    assert.equal(await page.eval("getComputedStyle(document.querySelector('.story-cinema[open] .story-film-player')).animationName"), 'none')
    await page.eval("document.querySelector('.story-cinema[open] video').scrollIntoView({block:'center',behavior:'instant'}); document.querySelector('.story-cinema[open] video').play()")
    await waitFor(page, "document.querySelector('.story-cinema[open] .story-film-state').textContent.includes('Now playing')")
    await page.screenshot({ path: output + '/story-' + width + '.png' })
    await page.eval("document.querySelector('.story-cinema[open] video').pause()")
    assert.equal(await page.eval("document.querySelector('.story-cinema[open] video').paused"), true)
    await page.eval("document.querySelector('.story-cinema[open] video').scrollIntoView({block:'center',behavior:'instant'}); const storyPlayer=document.querySelector('.story-cinema[open] video'); storyPlayer.currentTime=storyPlayer.duration-.1; storyPlayer.play()")
    await waitFor(page, "document.querySelector('.story-cinema[open] .story-film-continue').dataset.ended === 'true'")
    await page.eval("document.querySelector('.story-cinema[open] .everyday-transcript > summary').focus()")
    await enter(page)
    assert.equal(await page.eval("document.querySelector('.story-cinema[open] .everyday-transcript').open"), true)
    assert.equal(await page.eval("document.activeElement === document.querySelector('.story-cinema[open] .everyday-transcript > summary')"), true)
    assert.ok(await page.eval("document.activeElement.getBoundingClientRect().top > 100"))
    await page.screenshot({ path: output + '/transcript-' + width + '.png' })
    await page.eval("document.querySelector('.story-cinema[open]').close()")
    assert.equal(await page.eval("document.documentElement.scrollWidth > innerWidth"), false)
    assert.deepEqual(page.consoleErrors, [])
    await page.close()
    console.log('PASS ' + width + ': About native poster/controls, no autoplay/loop, reduced-motion story keyboard/playback/transcript')
  }
  const page = await browser.newPage({ width: 390, height: 1000, mobile: true })
  await page.send('Emulation.setScriptExecutionDisabled', { value: true })
  await page.goto(base + '/about')
  assert.equal(await page.eval("document.querySelector('#hospital-film video').controls"), true)
  assert.equal(await page.eval("document.querySelector('#hospital-film video').preload"), 'none')
  await page.close()
  console.log('PASS no-JavaScript native About film controls')
})
