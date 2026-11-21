import assert from 'node:assert/strict'
import { setTimeout as delay } from 'node:timers/promises'
import { runVisualCheck } from './lib/visual-check.mjs'

const base = process.env.HH_PREVIEW_URL || 'http://localhost:3000'
await runVisualCheck('service-cards', base, async ({ browser, output }) => {
  for (const width of [1440, 768, 390]) {
    const page = await browser.newPage({ width, height: 1000, mobile: width < 600 })
    let checkedHover = false
    for (const route of ['/', '/services']) {
      await page.goto(`${base}${route}`)
      const selector = route === '/' ? '#specialized-care [data-service-card]' : '[data-service-card]'
      assert.ok(await page.eval(`document.querySelectorAll('${selector}').length > 0`))
      await page.eval(`document.querySelector('${selector}').scrollIntoView({block:'center',behavior:'instant'})`)
      await delay(600)
      const card = await page.eval(`(() => { const card=document.querySelector('${selector}'); return { href:card.getAttribute('href'), links:card.querySelectorAll('a,button').length, image:card.querySelector('img').naturalWidth, name:card.querySelector('h3').textContent }; })()`)
      assert.ok(card.href.startsWith('/services/'))
      assert.equal(card.links, 0, 'Card must contain no nested interactive elements')
      assert.ok(card.image > 0)
      await page.eval(`document.querySelector('${selector}').focus()`)
      await page.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9, modifiers: 8 })
      await page.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9, modifiers: 8 })
      await page.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 })
      await page.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 })
      assert.ok(await page.eval(`document.activeElement.matches('${selector}')`), 'Card is keyboard reachable')
      assert.ok(await page.eval(`parseFloat(getComputedStyle(document.activeElement).outlineWidth) >= 3`))
      if (width === 1440 && await page.eval("matchMedia('(hover: hover) and (pointer: fine)').matches")) {
        checkedHover = true
        await page.eval(`document.querySelector('${selector}').scrollIntoView({block:'center',behavior:'instant'})`)
        await delay(1200)
        for (let attempt=0; attempt<10; attempt++) {
          const point = await page.eval(`(() => {const r=document.querySelector('${selector}').getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+50}})()`)
          await page.send('Input.dispatchMouseEvent', { type:'mouseMoved', ...point })
          await delay(150)
          if (await page.eval(`document.querySelector('${selector}').matches(':hover')`)) break
        }
        await delay(400)
        assert.notEqual(await page.eval(`getComputedStyle(document.querySelector('${selector} img')).transform`), 'none')
      }
      await page.send('Emulation.setEmulatedMedia', { features: [{ name:'prefers-reduced-motion', value:'reduce' }] })
      assert.equal(await page.eval(`getComputedStyle(document.querySelector('${selector} img')).transitionDuration`), '0s')
      await page.screenshot({ path: `${output}/${route === '/' ? 'home' : 'services'}-${width}.png` })
      await page.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13, text:'\r' })
      await page.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 })
      for (let i=0;i<120;i++) {
        if (await page.eval('location.pathname.startsWith("/services/") && Boolean(document.querySelector("h1"))')) break
        await delay(50)
      }
      assert.ok(await page.eval('location.pathname.startsWith("/services/")'))
      assert.deepEqual(page.consoleErrors, [])
      await page.send('Emulation.setEmulatedMedia', { features: [{ name:'prefers-reduced-motion', value:'no-preference' }] })
    }
    await page.close()
    console.log(`PASS service cards ${width}: imagery, single link, keyboard focus/activation, reduced motion${checkedHover ? ', hover zoom' : ', hover unavailable on this input device'}`)
  }
})
