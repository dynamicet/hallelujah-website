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
        assert.equal(await page.eval("document.querySelector('#visit-guide, #health-library') === null"), true)
        assert.deepEqual(await page.eval(() => [...document.querySelectorAll('.home-quick-access a')].map(link => link.getAttribute('href'))), ['/services', '#home-directions', '/emergency'])
        assert.equal(await page.eval("document.querySelector('.home-quick-access a strong').textContent.trim()"), 'Explore services')
        assert.equal(await page.eval("getComputedStyle(document.querySelector('.team-next-step')).backgroundColor"), 'rgb(245, 200, 45)', 'approved X assistance uses a bounded yellow field')
        assert.equal(await page.eval("getComputedStyle(document.querySelector('.team-care-help')).color"), 'rgb(23, 49, 61)', 'yellow assistance destination uses readable ink')
        await page.eval(() => {
          document.querySelector('.home-quick-access').scrollIntoView({ block: 'center', behavior: 'instant' })
          document.querySelector('.home-quick-access a').focus({ preventScroll: true })
        })
        assert.equal(await page.eval("document.activeElement.matches(':focus-visible') && getComputedStyle(document.activeElement).outlineStyle === 'solid'"), true)
        if (reducedMotion) {
          assert.equal(await page.eval("getComputedStyle(document.activeElement.lastElementChild).transitionDuration"), '0s')
        }
        await page.screenshot({ path: `${output}/quick-access-${width}-${reducedMotion ? 'reduced' : 'normal'}.png` })
        await enter(page)
        await waitFor(page, "location.pathname === '/services' && Boolean(document.querySelector('[data-service-directory-template]'))")
        await page.goto(base)
        assert.equal(await page.eval(() => document.querySelector('a[href^="/health-topics"]')), null)
        await page.eval("document.querySelector('#medical-technology a').scrollIntoView({block:'center',behavior:'instant'}); document.querySelector('#medical-technology a').focus({preventScroll:true})")
        await enter(page)
        await waitFor(page, "location.pathname === '/services' && location.hash === '#medical-technology' && document.querySelectorAll('#medical-technology article').length === 3")
        await waitFor(page, "document.activeElement.id === 'medical-technology'")
        await page.eval("document.querySelector('#medical-technology summary').focus()")
        await enter(page)
        assert.equal(await page.eval("document.querySelector('#medical-technology details').open"), true)
        assert.equal(await page.eval("getComputedStyle(document.activeElement).outlineStyle"), 'solid')
        await page.eval("document.querySelector('#medical-technology').scrollIntoView({block:'start',behavior:'instant'})")
        await page.screenshot({ path: `${output}/equipment-details-${width}-${reducedMotion ? 'reduced' : 'normal'}.png` })
        await enter(page)
        assert.equal(await page.eval("document.querySelector('#medical-technology details').open"), false)
        for (const id of ['our-story', 'founding-vision', 'our-values', 'mission-and-vision', 'leadership']) {
          await page.eval(`(() => {
            const link = document.querySelector('main a[href="#${id}"]')
            link.scrollIntoView({ block: 'center', behavior: 'instant' })
            link.focus({ preventScroll: true })
          })()`)
          await enter(page)
          await waitFor(page, `location.hash === "#${id}" && document.activeElement.id === "${id}"`)
          await waitFor(page, `(() => {
            const top = document.activeElement.getBoundingClientRect().top
            return top > document.querySelector('[data-site-header]').getBoundingClientRect().bottom && top < innerHeight
          })()`)
          assert.equal(await page.eval('getComputedStyle(document.activeElement).outlineStyle'), 'solid')
        }
        await page.screenshot({ path: `${output}/about-focus-${width}-${reducedMotion ? 'reduced' : 'normal'}.png` })
        assert.equal(await page.eval('document.documentElement.scrollWidth > innerWidth'), false)
        assert.deepEqual(page.consoleErrors, [])
      } finally { await page.close() }
    }
    console.log(`PASS ${width}: services shortcut, retired topic links, equipment disclosure, About section focus, normal/reduced motion`)
  }
  const page = await browser.newPage({ width: 390, height: 1000, mobile: true, reducedMotion: true })
  try {
    await page.send('Emulation.setScriptExecutionDisabled', { value: true })
    await page.goto(base)
    assert.equal(await page.eval("document.querySelector('.home-quick-access a').getAttribute('href')"), '/services')
    assert.equal(await page.eval("document.querySelector('#medical-technology a').getAttribute('href')"), '/services#medical-technology')
  } finally { await page.close() }
  console.log('PASS native services and equipment links without JavaScript')
})
