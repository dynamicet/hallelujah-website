import assert from 'node:assert/strict'
import { writeFile } from 'node:fs/promises'
import { setTimeout as delay } from 'node:timers/promises'
import { runVisualCheck } from './lib/visual-check.mjs'

const base = process.env.HH_PREVIEW_URL || 'http://localhost:3000'
async function key(page, value = 'Enter') {
  const space = value === ' '
  await page.send('Input.dispatchKeyEvent', { type: 'keyDown', key: value, code: space ? 'Space' : 'Enter', windowsVirtualKeyCode: space ? 32 : 13, text: space ? ' ' : '\r' })
  await page.send('Input.dispatchKeyEvent', { type: 'keyUp', key: value, code: space ? 'Space' : 'Enter', windowsVirtualKeyCode: space ? 32 : 13 })
}
async function waitFor(page, expression) {
  for (let attempt = 0; attempt < 100; attempt++) {
    if (await page.eval(expression)) return
    await delay(50)
  }
  assert.fail('Timed out: ' + expression)
}

await runVisualCheck('home-visit', base, async ({ browser, output }) => {
  const measurements = []
  for (const width of [390, 768, 1440]) {
    for (const reducedMotion of [false, true]) {
      const page = await browser.newPage({ width, height: 1000, mobile: width < 600, reducedMotion })
      const variant = `${width}-${reducedMotion ? 'reduced' : 'normal'}`
      try {
        await page.goto(base)
        assert.deepEqual(await page.eval("[...document.querySelectorAll('.visit-checklist li')].map(item => item.textContent)"), ['Your questions and medicine list', 'Referral letter, if you have one', 'Relevant previous results'])
        assert.equal(await page.eval("document.querySelector('.visit-checklist').closest('details') === null"), true)
        assert.equal(await page.eval("document.querySelector('.visit-brand-artwork') === null"), true)
        assert.equal(await page.eval("document.querySelectorAll('.visit-questions details').length"), 2)
        const colors = await page.eval(() => ({ foreground: getComputedStyle(document.querySelector('.visit-checklist p')).color, background: getComputedStyle(document.querySelector('#visit-guide')).backgroundColor }))
        const luminance = color => color.match(/[\d.]+/gu).slice(0, 3).map(Number).map(value => value / 255).map(value => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4).reduce((sum, value, index) => sum + value * [.2126, .7152, .0722][index], 0)
        const values = [luminance(colors.foreground), luminance(colors.background)].sort((a, b) => a - b)
        const contrast = (values[1] + .05) / (values[0] + .05)
        assert.ok(contrast >= 4.5, 'checklist confirmation text meets normal-text contrast')
        measurements.push({ width, reducedMotion, ...colors, contrast })
        await writeFile(`${output}/measurements.json`, JSON.stringify(measurements, null, 2) + '\n')
        await page.eval("document.querySelector('#visit-guide').scrollIntoView({block:'start',behavior:'instant'})")
        await page.screenshot({ path: `${output}/visit-collapsed-${variant}.png` })
        for (const index of [1, 2]) {
          const selector = `.visit-questions details:nth-child(${index})`
          await page.eval(`document.querySelector('${selector} summary').focus()`)
          await key(page)
          await waitFor(page, `document.querySelector('${selector}').open && document.querySelector('${selector}').getAnimations({subtree:true}).every(animation => animation.playState !== 'running')`)
          assert.equal(await page.eval(`document.activeElement === document.querySelector('${selector} summary')`), true)
          assert.equal(await page.eval('getComputedStyle(document.activeElement).outlineStyle'), 'solid')
          if (index === 2) assert.equal(await page.eval("document.querySelector('.visit-questions details').open"), true, 'opening support keeps arrival guidance available')
          await page.eval(`document.querySelector('${selector} summary').scrollIntoView({block:'start',behavior:'instant'})`)
          await page.screenshot({ path: `${output}/visit-open-${index}-${variant}.png` })
        }
        await page.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] })
        await waitFor(page, "document.querySelector('#visit-guide').getAnimations({subtree:true}).every(animation => animation.playState !== 'running')")
        await key(page, ' ')
        await waitFor(page, "!document.querySelector('.visit-questions details:nth-child(2)').open")
        assert.equal(await page.eval("document.querySelector('.visit-questions details a').getAttribute('href')"), '/patients-visitors#visit-times')
        await page.eval("document.querySelector('.visit-preparation > a').focus()")
        await key(page)
        await waitFor(page, "location.pathname === '/patients-visitors' && Boolean(document.querySelector('#patient-page-title'))")
        assert.equal(await page.eval("document.querySelector('#patient-page-title').textContent"), 'Patients & Visitors')
        assert.equal(await page.eval('document.documentElement.scrollWidth > innerWidth'), false)
        assert.deepEqual(page.consoleErrors, [])
      } finally { await page.close() }
    }
    console.log(`PASS ${width}: visible checklist, two keyboard disclosures, retained guidance/focus, normal/live reduced motion, full-guide destination`)
  }
  const page = await browser.newPage({ width: 390, height: 1000, mobile: true, reducedMotion: true })
  try {
    await page.send('Emulation.setScriptExecutionDisabled', { value: true })
    await page.goto(base)
    await page.eval("document.querySelector('.visit-questions summary').focus()")
    await key(page)
    assert.equal(await page.eval("document.querySelector('.visit-questions details').open"), true)
    assert.equal(await page.eval("document.querySelector('.visit-preparation > a').getAttribute('href')"), '/patients-visitors')
  } finally { await page.close() }
  console.log('PASS native visit disclosure and guide link without JavaScript')
})
