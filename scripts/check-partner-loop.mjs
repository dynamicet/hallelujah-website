import assert from 'node:assert/strict'
import { setTimeout as delay } from 'node:timers/promises'
import { runVisualCheck } from './lib/visual-check.mjs'

const base = process.env.HH_PREVIEW_URL || 'http://localhost:3000'
await runVisualCheck('partner-loop', base, async ({ browser, output }) => {
  for (const width of [390, 768, 1440]) {
    const page = await browser.newPage({ width, height: 1000, mobile: width < 600 })
    await page.goto(base)
    await page.eval("document.querySelector('.partners-collaboration-band').scrollIntoView({block:'center',behavior:'instant'})")
    await delay(500)
    assert.equal(await page.eval("document.querySelectorAll('.partners-collaboration-list:not(.partners-rail-clone) > li').length"), 10)
    assert.equal(await page.eval("document.querySelectorAll('.partners-rail-clone > li').length"), 10)
    assert.equal(await page.eval("document.querySelector('.partners-rail').dataset.motionState"), 'running')
    const position = await page.eval("document.querySelector('.partners-rail-track').getAnimations()[0].currentTime")
    await delay(500)
    assert.ok(await page.eval(`document.querySelector('.partners-rail-track').getAnimations()[0].currentTime > ${position + 300}`))
    const loop = await page.eval(() => {
      const track = document.querySelector('.partners-rail-track')
      const animation = track.getAnimations()[0]
      const timing = animation.effect.getTiming()
      const list = track.firstElementChild
      const distance = list.scrollWidth + parseFloat(getComputedStyle(track).columnGap)
      animation.pause()
      animation.currentTime = timing.duration - 50
      return { duration: timing.duration, infinite: timing.iterations === Infinity, easing: timing.easing, distance, viewport: track.parentElement.clientWidth }
    })
    assert.equal(loop.infinite, true)
    assert.equal(loop.easing, 'linear')
    assert.ok(loop.distance > loop.viewport, 'The repeated sequence must fill the viewport at the loop boundary')
    assert.ok(Math.abs(loop.distance / (loop.duration / 1000) - 18) < .01)
    await page.eval('new Promise(requestAnimationFrame)')
    const before = await page.eval("document.querySelector('.partners-rail-clone li').getBoundingClientRect().left")
    await page.screenshot({ path: `${output}/loop-before-${width}.png` })
    await page.eval(`document.querySelector('.partners-rail-track').getAnimations()[0].currentTime = ${loop.duration + 50}`)
    await page.eval('new Promise(requestAnimationFrame)')
    const after = await page.eval("document.querySelector('.partners-collaboration-list li').getBoundingClientRect().left")
    assert.ok(Math.abs(before - after - 1.8) < 1, 'Matching logos must cross the seam without a jump or gap')
    await page.screenshot({ path: `${output}/loop-after-${width}.png` })
    await page.eval("document.querySelector('.partners-rail-track').getAnimations()[0].play(); document.querySelector('.partners-rail').focus({preventScroll:true})")
    await delay(100)
    assert.equal(await page.eval("document.querySelector('.partners-rail').dataset.paused"), 'true')
    await page.screenshot({ path: `${output}/keyboard-pause-${width}.png` })
    await page.eval("document.querySelector('.partners-motion-toggle').focus({preventScroll:true})")
    await page.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13, text: '\r' })
    await page.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 })
    await delay(150)
    assert.equal(await page.eval("document.querySelector('.partners-rail').dataset.motionState"), 'running')
    await page.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] })
    await delay(150)
    assert.equal(await page.eval("document.querySelector('.partners-rail').dataset.motionState"), 'static')
    assert.equal(await page.eval("document.querySelectorAll('.partners-rail-clone').length"), 0)
    assert.equal(await page.eval("document.querySelector('.partners-rail-track').getAnimations().length"), 0)
    await page.eval("document.querySelector('.partners-collaboration-band').scrollIntoView({block:'center',behavior:'instant'})")
    await page.screenshot({ path: `${output}/reduced-motion-${width}.png` })
    assert.equal(await page.eval('document.documentElement.scrollWidth > innerWidth'), false)
    assert.deepEqual(page.consoleErrors, [])
    await page.close()
    console.log(`PASS ${width}: continuous 18px/s loop, seam continuity, keyboard pause/resume, live reduced motion, no overflow or browser errors`)
  }
})
