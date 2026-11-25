import assert from 'node:assert/strict'
import { runVisualCheck } from './lib/visual-check.mjs'

const baseUrl = process.env.HH_PREVIEW_URL || 'http://localhost:3000'
const frame = (page) => page.eval('new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))')

await runVisualCheck('home-scroll-scenes', baseUrl, async ({ browser, output }) => {
  for (const width of [390, 768, 1440]) {
    const page = await browser.newPage({ width, height: 900, mobile: width < 600 })
    await page.goto(baseUrl)
    for (const [section, target] of [['medical-technology', 'picture'], ['about-hallelujah', 'figure img']]) {
      const scene = 'document.querySelector(' + JSON.stringify('#' + section + ' figure') + ')'
      const effect = 'document.querySelector(' + JSON.stringify('#' + section + ' ' + target) + ').getAnimations()[0]'
      async function sample(fraction) {
        await page.eval(`scrollBy({top: ${scene}.getBoundingClientRect().top - innerHeight + ${scene}.offsetHeight * ${fraction}, behavior:'instant'})`)
        await frame(page)
        return page.eval(`${effect}?.effect.getComputedTiming().progress`)
      }
      const start = await sample(.22)
      const middle = await sample(.65)
      assert.ok(middle > start && middle < 1, section + ' advances with scroll')
      await page.screenshot({ path: output + '/' + section + '-' + width + '.jpg' })
      assert.ok(await sample(1.1) >= .99)
      assert.ok(Math.abs(await sample(.22) - start) < .02, section + ' reverses with scroll')
    }
    await page.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] })
    await frame(page)
    assert.equal(await page.eval("document.querySelector('#about-hallelujah').getAnimations({subtree:true}).length"), 0)
    assert.equal(await page.eval("document.querySelector('#medical-technology picture').getAnimations().length"), 0)
    assert.deepEqual(page.consoleErrors, [])
    await page.close()
    console.log('PASS scroll progress, reverse and reduced motion at ' + width + 'px')
  }
})
