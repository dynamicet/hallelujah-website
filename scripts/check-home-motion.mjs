import assert from 'node:assert/strict'
import { runVisualCheck } from './lib/visual-check.mjs'

const baseUrl = process.env.HH_PREVIEW_URL || 'http://localhost:3000'

await runVisualCheck('home-motion', baseUrl, async ({ browser, output }) => {
 for (const width of [390, 1440]) {
  const page = await browser.newPage({ width, height: 1000, mobile: width < 600 })
  // Slow the browser animation clock so short entrances can be inspected reliably.
  await page.send('Animation.enable')
  await page.send('Animation.setPlaybackRate', { playbackRate: .05 })
  await page.goto(baseUrl)
  await page.eval('document.fonts.ready')
  const hero = await page.eval(`({
   moving: document.querySelector('h1').getAnimations().length > 0,
   readable: Number(getComputedStyle(document.querySelector('h1')).opacity) >= .8,
   actionReady: getComputedStyle(document.querySelector('.welcome-appointment')).opacity === '1' && document.querySelector('.welcome-appointment').getAnimations().length === 0,
   overflow: document.documentElement.scrollWidth > innerWidth
  })`)
  assert.deepEqual(hero, { moving: true, readable: true, actionReady: true, overflow: false })
  await page.screenshot({ path: `${output}/hero-moving-${width}.jpg` })
  await page.eval(`document.querySelector('#team-title').scrollIntoView({behavior:'instant', block:'center'})`)
  await page.eval('new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))')
  assert.equal(await page.eval(`document.querySelector('#team-title').getAnimations().length > 0`), true)
  await page.eval(`document.querySelector('.home-care-card').focus()`)
  await page.eval('new Promise(resolve => requestAnimationFrame(resolve))')
  assert.equal(await page.eval(`document.activeElement.matches('.home-care-card:focus-visible')`), true)
  assert.equal(await page.eval(`document.activeElement.getAttribute('href').startsWith('/services/')`), true)

  // Changing the OS preference mid-animation must immediately settle every layer.
  await page.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] })
  await page.eval('new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))')
  assert.equal(await page.eval('document.getAnimations().length'), 0)
  assert.equal(await page.eval(`getComputedStyle(document.querySelector('h1')).opacity`), '1')
  assert.equal(await page.eval(`getComputedStyle(document.querySelector('.welcome-photo')).opacity`), '1')
  await page.screenshot({ path: `${output}/service-settled-${width}.jpg` })
  await page.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] })
  await page.eval(`scrollTo({top:0,behavior:'instant'})`)
  await page.eval('new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))')
  await page.eval(`document.querySelector('#team-title').scrollIntoView({behavior:'instant',block:'center'})`)
  await page.eval('new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))')
  assert.equal(await page.eval(`document.querySelector('#team-title').getAnimations().length`), 0, 'section entrance must not replay')
  assert.deepEqual(page.consoleErrors, [])
  await page.close()
  console.log(`PASS ${width}px: readable entrance, immediate CTA, care link focus, live reduced motion, one-time reveal`)
 }
 const staticPage = await browser.newPage({ width: 390, height: 844, reducedMotion: true })
 await staticPage.send('Emulation.setScriptExecutionDisabled', { value: true })
 await staticPage.goto(baseUrl)
 assert.equal(await staticPage.eval(`getComputedStyle(document.querySelector('h1')).opacity`), '1')
 assert.equal(await staticPage.eval(`document.querySelector('.welcome-appointment').getAttribute('href')`), '/appointment')
 assert.equal(await staticPage.eval('document.getAnimations().length'), 0)
 await staticPage.close()
 console.log('PASS no-JavaScript and reduced-motion fallback')
})
