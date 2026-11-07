import assert from 'node:assert/strict'
import { mkdir } from 'node:fs/promises'
import { Browser } from '/home/befikadusata/.codex/skills/design-taste-frontend/scripts/lib/cdp.mjs'

const evidence = '.taste-skill/redesign-journeys'
await mkdir(evidence, { recursive: true })
const browser = await Browser.launch()
try {
  const page = await browser.newPage({ width: 1440, height: 900 })
  await page.goto('http://localhost:3000')
  await page.eval('window.scrollTo({top:1000,behavior:"instant"})')
  await new Promise((resolve) => setTimeout(resolve, 350))
  assert.equal(await page.eval('document.querySelector("[data-site-header]").dataset.scrollDirection'), 'down')
  await page.eval('window.scrollTo({top:700,behavior:"instant"})')
  await new Promise((resolve) => setTimeout(resolve, 350))
  assert.equal(await page.eval('document.querySelector("[data-site-header]").dataset.scrollDirection'), 'up')
  console.log('Header hides on downward scroll and returns on upward scroll.')

  for (const width of [320, 360, 390, 768, 1024, 1440]) {
    await page.setViewport({ width, height: 900, mobile: width < 600 })
    await page.goto('http://localhost:3000')
    assert.equal(await page.eval('document.documentElement.scrollWidth > innerWidth'), false, `Home overflow at ${width}px`)
    const titleFits = await page.eval('(() => { const h=document.querySelector("h1");const r=document.createRange();r.selectNodeContents(h);return r.getBoundingClientRect().right <= innerWidth })()')
    assert.equal(titleFits, true, `Homepage title fits at ${width}px`)
  }
  console.log('Homepage reflow and title visibility pass at 320, 360, 390, 768, 1024 and 1440px.')

  for (const [route, label] of [['/doctors', 'doctors'], ['/services', 'services'], ['/appointment', 'appointment'], ['/emergency', 'emergency'], ['/doctors/synthetic-clinician-101010101010/', 'profile']]) {
    for (const width of [1440, 390]) {
      await page.setViewport({ width, height: 1000, mobile: width < 600 })
      await page.goto('http://localhost:3000' + route)
      await page.eval('document.fonts.ready')
      assert.equal(await page.eval('document.documentElement.scrollWidth > innerWidth'), false, `${route} at ${width}px`)
      await page.screenshot({ path: `${evidence}/${label}-${width}.jpg`, fullPage: true })
    }
  }

  const reduced = await browser.newPage({ width: 390, height: 844, reducedMotion: true })
  await reduced.goto('http://localhost:3000')
  await reduced.eval('window.scrollTo({top:document.body.scrollHeight,behavior:"instant"})')
  await reduced.eval('Promise.all([...document.images].map(image => { image.loading="eager";return image.decode().catch(()=>{}) }))')
  await reduced.eval('window.scrollTo({top:0,behavior:"instant"})')
  assert.equal(await reduced.eval('document.getAnimations().length'), 0)
  assert.equal(await reduced.eval('Array.from(document.querySelectorAll("[data-reveal]"),e=>getComputedStyle(e).opacity).every(o=>o==="1")'), true)
  await reduced.screenshot({ path: `${evidence}/home-reduced-motion.jpg`, fullPage: true })
  console.log('Reduced motion: zero active animations; all content remains visible.')
  assert.deepEqual(page.consoleErrors, [])
  assert.deepEqual(reduced.consoleErrors, [])
  console.log('Connected journeys captured on desktop and mobile with no browser exceptions.')
} finally {
  await browser.close()
}
