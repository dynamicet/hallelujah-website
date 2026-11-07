import assert from 'node:assert/strict'
import { runVisualCheck } from './lib/visual-check.mjs'
import { hospitalContact } from '../apps/web/src/website/hospital-contact.ts'

const baseUrl = process.env.HH_PREVIEW_URL || 'http://localhost:3000'

await runVisualCheck('home-hero', baseUrl, async ({ browser, output }) => {
 for (const [width, height] of [[320, 640], [390, 844], [768, 1024], [1024, 768], [1100, 900], [1440, 900], [1920, 1080]]) {
  const page = await browser.newPage({ width, height, reducedMotion: true, mobile: width < 600 })
  await page.goto(baseUrl)
  await page.eval('document.fonts.ready')
  const layout = await page.eval(() => {
   const hero = document.querySelector('.welcome-story').getBoundingClientRect()
   const media = document.querySelector('.welcome-media').getBoundingClientRect()
   const title = document.querySelector('.welcome h1')
   const titleBox = title.getBoundingClientRect()
   const links = [...document.querySelectorAll('.welcome-actions a')]
   const boxes = [...document.querySelectorAll('.welcome-actions a, .welcome-actions button')].map(action => action.getBoundingClientRect())
   return {
    width: innerWidth, viewportWidth: document.documentElement.clientWidth, heroLeft: hero.left, heroWidth: hero.width,
    mediaLeft: media.left, mediaWidth: media.width, mediaTop: media.top,
    heroTop: hero.top, mediaBottom: media.bottom, heroBottom: hero.bottom,
    lines: Math.round(titleBox.height / parseFloat(getComputedStyle(title).lineHeight)),
    actionBottom: boxes[0].bottom,
    lastActionBottom: Math.max(...boxes.map(box => box.bottom)),
    targets: boxes.every(box => box.height >= 44),
    links: links.map(link => link.getAttribute('href')),
    callHref: document.querySelector('.welcome-call')?.getAttribute('href'),
    overlap: boxes.some((a, i) => boxes.some((b, j) => i < j && a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top)),
    clipped: boxes.some(box => box.left < 0 || box.right > innerWidth || box.bottom > hero.bottom),
    overflow: document.documentElement.scrollWidth > innerWidth,
    photoReady: document.querySelector('.welcome-photo').naturalWidth > 0,
   }
  })
  assert.equal(layout.heroLeft, 0)
  assert.equal(layout.heroWidth, layout.viewportWidth, 'hero must fill the content viewport, excluding the scrollbar')
  assert.equal(layout.mediaLeft, 0)
  assert.equal(layout.mediaWidth, layout.viewportWidth, 'photo must never become a separate right column')
  assert.equal(layout.mediaTop, layout.heroTop)
  assert.equal(layout.mediaBottom, layout.heroBottom, 'photo stage and copy belong to one composition')
  assert.ok(layout.lines <= 2)
  assert.equal(layout.targets, true)
  assert.equal(layout.overlap, false)
  assert.equal(layout.clipped, false)
  assert.equal(layout.overflow, false)
  assert.equal(layout.photoReady, true)
  assert.deepEqual(layout.links, ['/appointment', '/doctors', hospitalContact.phoneHref])
  assert.equal(layout.callHref, hospitalContact.phoneHref, 'reception uses the published hospital contact')
  assert.ok(layout.actionBottom <= height, 'primary action visible in the first screen')
  if (width === 320) assert.ok(layout.lastActionBottom <= height, 'small-phone reception action visible in the first screen')
  await page.screenshot({ path: `${output}/hero-${width}.jpg` })
  await page.eval(`document.querySelector('.welcome-appointment').focus()`)
  assert.equal(await page.eval(`getComputedStyle(document.activeElement).outlineStyle`), 'solid')
  assert.deepEqual(page.consoleErrors, [])
  await page.close()
  console.log(`PASS ${width}×${height}: unified scene, readable title, visible actions, no overflow`)
 }
 const fallback = await browser.newPage({ width: 390, height: 844, reducedMotion: true })
 await fallback.send('Network.enable')
 await fallback.send('Network.setBlockedURLs', { urls: ['*hero-care-*'] })
 await fallback.send('Emulation.setScriptExecutionDisabled', { value: true })
 await fallback.goto(baseUrl)
 assert.equal(await fallback.eval(`getComputedStyle(document.querySelector('.welcome-copy')).color`), 'rgb(255, 255, 255)')
 const fallbackContrast = await fallback.eval(() => {
  const color = getComputedStyle(document.querySelector('.welcome-story')).backgroundColor
  const channels = color.match(/[\d.]+/g).slice(0, 3).map(Number).map(value => value / 255)
  const linear = channels.map(value => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4)
  return 1.05 / (.2126 * linear[0] + .7152 * linear[1] + .0722 * linear[2] + .05)
 })
 assert.ok(fallbackContrast >= 4.5, 'white hero copy remains legible on the current brand fallback')
 assert.equal(await fallback.eval(`document.querySelector('.welcome-appointment').getAttribute('href')`), '/appointment')
 assert.equal(await fallback.eval('document.getAnimations().length'), 0)
 await fallback.screenshot({ path: `${output}/media-failure-no-js.jpg` })
 await fallback.send('Emulation.setEmulatedMedia', { features: [{ name: 'forced-colors', value: 'active' }] })
 await fallback.screenshot({ path: `${output}/forced-colors.jpg` })
 assert.equal(await fallback.eval(`getComputedStyle(document.querySelector('.welcome-media')).visibility`), 'hidden')
 assert.equal(await fallback.eval('document.documentElement.scrollWidth > innerWidth'), false)
 await fallback.close()
 console.log('PASS image-failure, no-JavaScript, reduced-motion and forced-color fallbacks')
})
