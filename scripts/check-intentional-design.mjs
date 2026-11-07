import assert from 'node:assert/strict'
import { runVisualCheck } from './lib/visual-check.mjs'

const baseUrl = process.env.HH_PREVIEW_URL || 'http://localhost:3000'

await runVisualCheck('intentional-design', baseUrl, async ({ browser, output }) => {
 const page = await browser.newPage({ width: 1440, height: 1000 })
 for (const route of ['/', '/doctors', '/services', '/appointment', '/patients-visitors', '/emergency']) {
  for (const width of [390, 768, 1440]) {
   await page.setViewport({ width, height: 1000, mobile: width < 600 })
   await page.goto(baseUrl + route)
   await page.eval('document.fonts.ready')
   await page.eval('Promise.all([...document.images].map(image => { image.loading = "eager"; return image.decode().catch(() => {}) }))')
   assert.equal(await page.eval('document.documentElement.scrollWidth > innerWidth'), false, route + ' overflow ' + width)
   assert.equal(await page.eval('document.querySelectorAll("h1").length'), 1, route + ' title')
   await page.screenshot({ path: `${output}/${route.replaceAll('/', '') || 'home'}-${width}.jpg`, fullPage: true })
  }
  console.log('PASS responsive route', route)
 }
 await page.goto(baseUrl)
 const careHref = await page.eval('document.querySelector(".home-care-card").getAttribute("href")')
 assert.equal(careHref.startsWith('/services/'), true)
 await page.eval('document.querySelector(".home-care-card").focus()')
 assert.equal(await page.eval('document.activeElement.matches(":focus-visible")'), true)
 await page.setViewport({width:390,height:844,mobile:true})
 await page.goto(baseUrl)
 await page.eval('document.querySelector("[popovertarget]").click()')
 assert.equal(await page.eval('Boolean(document.querySelector(":popover-open"))'), true)
 console.log('PASS care discovery link focus and mobile navigation')
 const reduced = await browser.newPage({width:390,height:844,reducedMotion:true})
 await reduced.goto(baseUrl)
 assert.equal(await reduced.eval('document.getAnimations().length'),0)
 assert.equal(await reduced.eval('getComputedStyle(document.querySelector("h1")).opacity'), '1')
 console.log('PASS reduced motion: content visible, no active animations')
 assert.deepEqual(page.consoleErrors, [])
 assert.deepEqual(reduced.consoleErrors, [])
 await reduced.close()
 await page.close()
})
