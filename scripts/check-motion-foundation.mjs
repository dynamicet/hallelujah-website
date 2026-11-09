import assert from 'node:assert/strict'
import { writeFile } from 'node:fs/promises'
import { runVisualCheck } from './lib/visual-check.mjs'

const baseUrl = process.env.HH_PREVIEW_URL || 'http://localhost:3000'
const pause = (page, ms = 350) => page.eval(`new Promise(r => setTimeout(r, ${ms}))`)
const geometry = (page, selector) => page.eval(`(() => {
  const e = document.querySelector(${JSON.stringify(selector)}), b = e.getBoundingClientRect()
  return { x: b.x, y: b.y, width: b.width, height: b.height, open: e.parentElement.open,
    focused: document.activeElement === e, focusVisible: e.matches(':focus-visible'), bodyHeight: e.parentElement.getBoundingClientRect().height }
})()`)
async function activate(page, key = 'Enter') {
  const code = key === 'Enter' ? 13 : 32
  await page.send('Input.dispatchKeyEvent', { type: 'keyDown', text: key === 'Enter' ? '\r' : ' ', key, code: key === 'Enter' ? 'Enter' : 'Space', windowsVirtualKeyCode: code })
  await page.send('Input.dispatchKeyEvent', { type: 'keyUp', key, code: key === 'Enter' ? 'Enter' : 'Space', windowsVirtualKeyCode: code })
}

await runVisualCheck('motion-foundation', baseUrl, async ({ browser, output }) => {
  const records = []
  for (const width of [390, 768, 1440]) {
    const page = await browser.newPage({ width, height: 1000, mobile: width < 600 })
    await page.goto(baseUrl)
    assert.ok(['240ms', '.24s', '0.24s'].includes(await page.eval(`getComputedStyle(document.documentElement).getPropertyValue('--motion-change').trim()`)), 'current foundation must be served')
    await page.eval(`document.querySelector('.visit-questions details:first-child summary').focus()`)
    await activate(page)
    await pause(page)
    assert.equal(await page.eval(`document.querySelector('.visit-questions details:first-child').open`), true)
    const checks = []
    for (const [name, selector] of [
      ['visit', '.visit-questions details:nth-child(2) summary'],
      ['story', '.everyday-account summary'],
    ]) {
      await page.eval(`document.querySelector(${JSON.stringify(selector)}).scrollIntoView({behavior:'instant', block:'center'})`)
      await pause(page, 700)
      await page.eval(`document.querySelector(${JSON.stringify(selector)}).focus()`)
      const before = await geometry(page, selector)
      await activate(page)
      await pause(page, 60)
      const during = await geometry(page, selector)
      await pause(page)
      const after = await geometry(page, selector)
      assert.equal(after.open, true, name + ': Enter opens')
      assert.ok(during.bodyHeight > before.bodyHeight && during.bodyHeight < after.bodyHeight, name + ': body grows through an intermediate height')
      assert.equal(after.focused, true)
      assert.equal(after.focusVisible, true)
      if (name === 'visit') assert.ok(Math.abs(after.x - before.x) < 1 && Math.abs(after.y - before.y) < 1, name + ': trigger stays anchored')
      else assert.ok(after.y >= 0 && after.y + after.height <= 1000, 'story reading keeps its focused trigger in view')
      if (name === 'visit') assert.equal(await page.eval(`document.querySelector('.visit-questions details').open`), true, 'previous answer stays available')
      await page.screenshot({ path: `${output}/${name}-open-${width}.png` })
      await activate(page, ' ')
      await pause(page, 60)
      const closing = await geometry(page, selector)
      assert.ok(closing.bodyHeight > before.bodyHeight && closing.bodyHeight < after.bodyHeight, name + ': body shrinks through an intermediate height')
      await pause(page)
      assert.equal((await geometry(page, selector)).open, false, 'Space closes')
      // A quick reversal must settle to the final requested state.
      await activate(page)
      await pause(page, 40)
      await activate(page)
      await pause(page)
      assert.equal((await geometry(page, selector)).open, false)
      checks.push({ name, before, after, during })
    }
    await activate(page)
    await page.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] })
    await pause(page, 50)
    assert.equal(await page.eval('document.getAnimations().length'), 0, 'live reduced motion settles immediately')
    assert.equal(await page.eval(`[...document.querySelectorAll('video')].filter(v=>!v.paused).length`), 0)
    assert.equal(await page.eval('document.documentElement.scrollWidth > innerWidth'), false)
    assert.deepEqual(page.consoleErrors, [])
    records.push({ width, checks })
    await writeFile(output + '/observations.json', JSON.stringify(records, null, 2) + '\n')
    await page.close()
    console.log(`PASS ${width}px: anchored controls, keyboard open/close, rapid reversal, live reduced motion`)
  }
  const page = await browser.newPage({ width: 390, height: 844 })
  await page.send('Emulation.setScriptExecutionDisabled', { value: true })
  await page.goto(baseUrl)
  await page.eval(`document.querySelector('.visit-questions details summary').focus()`)
  await activate(page)
  assert.equal(await page.eval(`document.querySelector('.visit-questions details').open`), true)
  await page.close()
  console.log('PASS native visit disclosure without JavaScript; story cinema is covered separately')
})
