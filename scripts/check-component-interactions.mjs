import assert from 'node:assert/strict'
import { setTimeout as delay } from 'node:timers/promises'
import { runVisualCheck } from './lib/visual-check.mjs'
const base = process.env.HH_PREVIEW_URL || 'http://localhost:3000'
const key = async (page, value, code = value, number = 13) => {
  await page.send('Input.dispatchKeyEvent', { type: 'keyDown', key: value, code, windowsVirtualKeyCode: number, ...(value === 'Enter' ? { text: '\r' } : {}) })
  await page.send('Input.dispatchKeyEvent', { type: 'keyUp', key: value, code, windowsVirtualKeyCode: number })
}
await runVisualCheck('component-interactions', base, async ({ browser, output }) => {
  for (const width of [390, 768, 1440]) {
    const page = await browser.newPage({ width, height: 1000, mobile: width < 600 })
    await page.goto(base)
    assert.ok(await page.eval("Boolean(document.querySelector('[data-public-shell]'))"))
    await page.eval("document.querySelector('#care-query').focus()")
    await page.send('Input.insertText', { text: 'heart' })
    await page.eval("document.querySelector('.care-mode-select[value=doctors]').focus()")
    await key(page, 'ArrowRight', 'ArrowRight', 39)
    await delay(300)
    assert.equal(await page.eval("document.querySelector('.care-mode-select:checked').value"), 'services')
    assert.equal(await page.eval("document.querySelector('#care-query').value"), 'heart')
    assert.ok(await page.eval("document.querySelector('.care-search-panel form').action.endsWith('/services')"))
    assert.equal(await page.eval("document.activeElement.value"), 'services')
    await page.screenshot({ path: output + '/care-' + width + '.png' })
    const agreements = '#corporate-organizations'
    await page.eval("document.querySelector('#corporate-agreements').scrollIntoView({block:'center',behavior:'instant'})")
    await delay(300)
    assert.equal(await page.eval(`document.querySelectorAll('${agreements} .organization-list > li > span').length`), 19)
    assert.equal(await page.eval(`document.querySelector('${agreements}').scrollLeft`), 0)
    await page.screenshot({ path: `${output}/corporate-agreements-${width}.png` })
    await page.eval("document.querySelector('[aria-label=\"Next organizations\"]').focus()")
    await key(page, 'Enter')
    await delay(700)
    assert.ok(await page.eval(`document.querySelector('${agreements}').scrollLeft > 0`))
    assert.equal(await page.eval('document.activeElement.getAttribute("aria-label")'), 'Next organizations')
    await page.eval("document.querySelector('[aria-label=\"Previous organizations\"]').focus()")
    await key(page, 'Enter')
    await delay(700)
    assert.equal(await page.eval(`document.querySelector('${agreements}').scrollLeft`), 0)

    // Fit the final tile fully inside the rail and leave keyboard focus on the end control.
    await page.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] })
    const nextOrganization = '[aria-label="Next organizations"]'
    await page.eval(`document.querySelector('${nextOrganization}').focus()`)
    for (let step = 0; step < 19; step++) {
      if (await page.eval(`document.querySelector('${nextOrganization}').getAttribute('aria-disabled') === 'true'`)) break
      await key(page, 'Enter')
      await page.eval('new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))')
    }
    assert.ok(await page.eval(`document.activeElement.matches('${nextOrganization}[aria-disabled="true"]')`))
    assert.ok(await page.eval(`(() => {
      const viewport = document.querySelector('${agreements}').getBoundingClientRect()
      const tile = document.querySelector('${agreements} li:last-child').getBoundingClientRect()
      return tile.left >= viewport.left && tile.right <= viewport.right + 1
    })()`))
    await page.screenshot({ path: `${output}/corporate-end-${width}.png` })
    await page.send('Emulation.setEmulatedMedia', { features: [] })

    await page.eval("document.querySelector('#partners').scrollIntoView({block:'center',behavior:'instant'})")
    await page.eval("Promise.all([...document.querySelectorAll('#partners img')].map(image => { image.loading = 'eager'; return image.decode() }))")
    const track = '.partner-ribbon-track'
    assert.equal(await page.eval(`document.querySelector('${track}').children.length`), 2)
    assert.deepEqual(await page.eval(`[...document.querySelector('${track}').children].map(list => [...list.children].map(item => item.dataset.partner))`).then(([first, duplicate]) => [first.length, duplicate.join() === first.join()]), [10, true])
    assert.ok(await page.eval(`document.querySelector('${track} > ul').offsetWidth >= document.querySelector('.partner-ribbon').clientWidth`))
    assert.equal(await page.eval(`document.querySelector('${track}').getAnimations()[0]?.playState`), 'running')
    await page.eval("document.querySelector('.partner-motion-control').focus({preventScroll:true})")
    await key(page, ' ', 'Space', 32)
    assert.equal(await page.eval(`document.querySelector('${track}').getAnimations()[0]?.playState`), 'paused')
    assert.ok(await page.eval("document.activeElement.matches('.partner-motion-control:focus-visible')"))
    await page.screenshot({ path: `${output}/partner-ribbon-${width}.png` })
    const point = await page.eval(`(() => {
      const { x, y, width, height } = document.querySelector('.partner-ribbon').getBoundingClientRect()
      return { x: x + width / 2, y: y + height / 2 }
    })()`)
    await page.send('Input.dispatchMouseEvent', { type: 'mousePressed', button: 'left', clickCount: 1, ...point })
    await page.send('Input.dispatchMouseEvent', { type: 'mouseReleased', button: 'left', clickCount: 1, ...point })
    assert.equal(await page.eval(`document.querySelector('${track}').getAnimations()[0]?.playState`), 'running')
    await key(page, ' ', 'Space', 32)
    assert.equal(await page.eval(`document.querySelector('${track}').getAnimations()[0]?.playState`), 'paused')
    await key(page, ' ', 'Space', 32)
    assert.equal(await page.eval(`document.querySelector('${track}').getAnimations()[0]?.playState`), 'running')
    await page.eval("document.querySelector('#specialized-care [data-ui-part=grid] a').scrollIntoView({block:'center',behavior:'instant'}); document.querySelector('#specialized-care [data-ui-part=grid] a').focus({preventScroll:true})")
    await delay(800)
    await page.screenshot({ path: output + '/card-' + width + '.png' })
    if (width < 1024) {
      await page.eval("scrollTo({top:0,behavior:'instant'}); document.querySelector('[data-menu-trigger]').focus()")
      await key(page, 'Enter')
      await delay(300)
      assert.ok(await page.eval("document.querySelector('[data-navigation-panel]').matches(':popover-open')"))
      await page.screenshot({ path: output + '/menu-' + width + '.png' })
      await page.eval("document.querySelector('[data-navigation-panel] a').focus()")
      await key(page, 'Escape', 'Escape', 27)
      await delay(300)
      assert.equal(await page.eval("document.activeElement.hasAttribute('data-menu-trigger')"), true)
      assert.equal(await page.eval("document.querySelector('[data-navigation-panel]').matches(':popover-open')"), false)
      // Fast close/reopen must finish in the requested state.
      await key(page, 'Enter')
      await key(page, 'Enter')
      await key(page, 'Enter')
      await delay(300)
      assert.ok(await page.eval("document.querySelector('[data-navigation-panel]').matches(':popover-open')"))
      await key(page, 'Escape', 'Escape', 27)
    }
    await page.eval("document.querySelector('#partners').scrollIntoView({block:'center',behavior:'instant'})")
    await page.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] })
    await delay(150)
    assert.equal(await page.eval("document.querySelector('#partners').getAnimations({subtree:true}).filter(a=>a.playState==='running').length"), 0)
    assert.equal(await page.eval("document.querySelector('#partners [aria-hidden=true]').getClientRects().length"), 0)
    assert.equal(await page.eval("document.querySelector('.partner-motion-control').getClientRects().length"), 0)
    await page.screenshot({ path: `${output}/partner-static-${width}.png` })
    assert.equal(await page.eval("getComputedStyle(document.querySelector('.care-mode-options'),'::after').transitionDuration"), '0s')
    assert.equal(await page.eval("document.documentElement.scrollWidth > innerWidth"), false)
    assert.deepEqual(page.consoleErrors, [])
    await page.close()
    console.log('PASS ' + width + ': keyboard care switch/query retention, partner loop and keyboard pause, manual organization browsing/focus, menu/Escape, reduced motion, overflow')
  }
  const page = await browser.newPage({ width: 390, height: 1000, mobile: true })
  await page.send('Emulation.setScriptExecutionDisabled', { value: true })
  await page.goto(base)
  assert.ok(await page.eval("Boolean(document.querySelector('form[action=\"/services\"]'))"))
  assert.equal(await page.eval("document.querySelectorAll('#corporate-organizations .organization-list > li').length"), 19)
  assert.ok(await page.eval("document.querySelector('#corporate-organizations').scrollWidth > document.querySelector('#corporate-organizations').clientWidth"))
  await page.eval("document.querySelector('.partner-motion-control').click()")
  assert.equal(await page.eval("getComputedStyle(document.querySelector('.partner-ribbon-track')).animationPlayState"), 'paused')
  await page.eval("document.querySelector('[data-menu-trigger]').click()")
  await delay(300)
  assert.ok(await page.eval("document.querySelector('[data-navigation-panel]').matches(':popover-open')"))
  await page.close()
  console.log('PASS no-JavaScript care fallback, partners and native menu')
})
