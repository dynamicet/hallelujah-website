import assert from 'node:assert/strict'
import { setTimeout as delay } from 'node:timers/promises'
import { runVisualCheck } from './lib/visual-check.mjs'

const base = process.env.HH_PREVIEW_URL || 'http://localhost:3000'
async function enter(page) {
  await page.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13, text: '\r' })
  await page.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 })
}
async function waitFor(page, expression) {
  for (let attempt = 0; attempt < 100; attempt++) {
    if (await page.eval(expression)) return
    await delay(100)
  }
  assert.fail('Timed out: ' + expression)
}

await runVisualCheck('home-distill', base, async ({ browser, output }) => {
  for (const width of [390, 768, 1440]) {
    for (const reducedMotion of [false, true]) {
      const page = await browser.newPage({ width, height: 1000, mobile: width < 600, reducedMotion })
      try {
        await page.goto(base)
        assert.equal(await page.eval("document.querySelector('#health-library input') === null"), true)
        assert.equal(await page.eval("getComputedStyle(document.querySelector('.team-next-step')).backgroundColor"), 'rgba(0, 0, 0, 0)')
        await page.eval("document.querySelector('#health-library a').scrollIntoView({block:'center',behavior:'instant'}); document.querySelector('#health-library a').focus({preventScroll:true})")
        assert.equal(await page.eval("getComputedStyle(document.activeElement).outlineStyle"), 'solid')
        await page.screenshot({ path: `${output}/health-invitation-${width}-${reducedMotion ? 'reduced' : 'normal'}.png` })
        await enter(page)
        await waitFor(page, "location.pathname === '/health-topics' && Boolean(document.querySelector('#health-topic-search'))")
        assert.equal(await page.eval("document.querySelectorAll('[aria-label=\"Find topics by first letter\"] button').length"), 26)
        await page.eval("document.querySelector('#health-topic-search').value = 'back pain'; document.querySelector('#health-topic-search').dispatchEvent(new Event('input', {bubbles:true}))")
        assert.equal(await page.eval('document.documentElement.scrollWidth > innerWidth'), false)
        assert.deepEqual(page.consoleErrors, [])
      } finally { await page.close() }
    }
    console.log(`PASS ${width}: keyboard health-topic entry, focus styling, full topic browser, normal/reduced motion`)
  }
  const page = await browser.newPage({ width: 390, height: 1000, mobile: true, reducedMotion: true })
  try {
    await page.send('Emulation.setScriptExecutionDisabled', { value: true })
    await page.goto(base)
    assert.equal(await page.eval("document.querySelector('#health-library a').getAttribute('href')"), '/health-topics')
  } finally { await page.close() }
  console.log('PASS health-topic destination remains available without JavaScript')
})
