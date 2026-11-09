import assert from 'node:assert/strict'
import { setTimeout as delay } from 'node:timers/promises'
import { runVisualCheck } from './lib/visual-check.mjs'

const base = process.env.HH_PREVIEW_URL || 'http://localhost:3000'
async function waitFor(page, expression) {
  for (let i = 0; i < 200; i++) {
    if (await page.eval(expression)) return
    await delay(50)
  }
  throw new Error(`Timed out: ${expression}`)
}
async function enter(page) {
  await page.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13, text: '\r' })
  await page.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 })
}
await runVisualCheck('directory-feedback', base, async ({ browser, output }) => {
  for (const width of [390, 768, 1440]) {
    for (const route of ['doctors', 'services']) {
      const page = await browser.newPage({ width, height: 1000, mobile: width < 600 })
      await page.goto(`${base}/${route}`)
      const input = route === 'doctors' ? '#clinician-search-query' : '#service-search-query'
      await page.eval(`window.directoryDocument = true; document.querySelector('${input}').focus()`)
      // Use a currently indexed care label; the former heart synonym is not in the doctor search index.
      await page.send('Input.insertText', { text: 'cardiology' })
      await page.send('Network.emulateNetworkConditions', { offline: false, latency: 700, downloadThroughput: -1, uploadThroughput: -1 })
      await enter(page)
      await waitFor(page, `Boolean(document.querySelector('[data-search-pending]'))`)
      assert.equal(await page.eval(`document.querySelector('[data-result-count]').textContent`), 'Updating results…')
      await page.eval(`document.querySelector('[data-result-count]').scrollIntoView({block:'center',behavior:'instant'})`)
      await page.screenshot({ path: `${output}/${route}-pending-${width}.png` })
      await waitFor(page, `location.search.includes('q=cardiology') && !document.querySelector('[data-search-pending]')`)
      assert.equal(await page.eval('window.directoryDocument'), true, 'Search should retain the document')
      assert.equal(await page.eval(`document.activeElement.matches('${input}')`), true, 'Search input retains keyboard focus')
      assert.equal(await page.eval(`document.querySelector('${input}').value`), 'cardiology')
      assert.ok(await page.eval(`parseInt(document.querySelector('[data-result-count]').textContent) > 0`))
      assert.ok(await page.eval(`document.querySelector('[data-result-count]').getAnimations().some(a => a.effect.getTiming().duration === 480)`), 'Updated count receives its bounded acknowledgment')
      await page.screenshot({ path: `${output}/${route}-results-${width}.png` })
      // A second keyboard submission must acknowledge an empty result as well.
      await page.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] })
      await page.eval(`(() => { const field=document.querySelector('${input}'); field.focus({preventScroll:true}); field.select() })()`)
      await page.send('Input.insertText', { text: 'zznomatchzz' })
      await enter(page)
      await waitFor(page, `Boolean(document.querySelector('[data-search-pending]'))`)
      assert.equal(await page.eval(`getComputedStyle(document.querySelector('[data-result-count]'),'::after').transitionDuration`), '0s')
      await waitFor(page, `location.search.includes('zznomatchzz') && !document.querySelector('[data-search-pending]')`)
      assert.ok(await page.eval(`Boolean(document.querySelector('[data-directory-empty]'))`))
      assert.equal(await page.eval(`document.querySelector('[data-result-count]').getAnimations().length`), 0)
      await page.screenshot({ path: `${output}/${route}-empty-reduced-${width}.png` })
      // Repeated filtering remains a GET navigation with selected controls intact.
      await page.eval(`(() => { const field=document.querySelector('${input}'); field.focus({preventScroll:true}); field.select() })()`)
      await page.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Backspace', code: 'Backspace', windowsVirtualKeyCode: 8 })
      await page.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Backspace', code: 'Backspace', windowsVirtualKeyCode: 8 })
      await page.eval(`document.querySelector('[data-filter-disclosure]').open=true; document.querySelector('[data-filter-group] input').click(); document.querySelector('[data-filter-disclosure] button').focus()`)
      const selected = await page.eval(`document.querySelector('[data-filter-group] input').value`)
      await enter(page)
      await waitFor(page, `!location.search.includes('zznomatchzz') && location.search.includes('${encodeURIComponent(selected)}') && !document.querySelector('[data-search-pending]')`)
      assert.equal(await page.eval(`document.querySelector('[data-filter-group] input').checked`), true)
      assert.equal(await page.eval(`document.activeElement.matches('[data-filter-disclosure] button')`), true)
      await page.eval('history.back()')
      await waitFor(page, `location.search.includes('zznomatchzz') && Boolean(document.querySelector('[data-directory-empty]'))`)
      assert.equal(await page.eval(`document.querySelector('${input}').value`), 'zznomatchzz', 'Back restores the visible query')
      assert.equal(await page.eval(`document.querySelector('[data-filter-group] input').checked`), false, 'Back restores the visible filter')
      assert.equal(await page.eval('document.documentElement.scrollWidth > innerWidth'), false)
      assert.deepEqual(page.consoleErrors, [])
      await page.close()
      console.log(`PASS /${route} ${width}: pending feedback, keyboard focus, repeated search, empty results, reduced motion, applied filter`)
    }
  }
  for (const route of ['doctors', 'services']) {
    const page = await browser.newPage({ width: 390, height: 1000, mobile: true })
    await page.send('Emulation.setScriptExecutionDisabled', { value: true })
    await page.goto(`${base}/${route}`)
    await page.eval(`document.querySelector('[data-search-controls-form] input[type=search]').focus()`)
    await page.send('Input.insertText', { text: 'cardiology' })
    await enter(page)
    await waitFor(page, `location.search.includes('q=cardiology') && document.readyState==='complete'`)
    assert.ok(await page.eval(`parseInt(document.querySelector('[data-result-count]').textContent) > 0`))
    await page.close()
  }
  console.log('PASS native GET search without JavaScript on both directories')
})
