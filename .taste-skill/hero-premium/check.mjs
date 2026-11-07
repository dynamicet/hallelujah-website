import assert from 'node:assert/strict'
import { writeFile } from 'node:fs/promises'
import { Browser, sleep } from '/home/befikadusata/.codex/skills/design-taste-frontend/scripts/lib/cdp.mjs'

const out = '.taste-skill/hero-premium'
const browser = await Browser.launch()
const results = []
try {
  const page = await browser.newPage({ width: 1440, height: 900 })
  for (const width of [320, 360, 390, 599, 600, 699, 700, 768, 900, 1024, 1199, 1440, 1920]) {
    await page.setViewport({ width, height: width < 600 ? 844 : 1000, mobile: width < 600 })
    await page.goto('http://localhost:3000', { settleMs: 1250 })
    await page.eval('document.fonts.ready')
    const result = await page.eval(() => {
      const hero = document.querySelector('.welcome')
      const title = hero.querySelector('h1')
      const button = hero.querySelector('.welcome-appointment')
      const r = button.getBoundingClientRect()
      const t = title.getBoundingClientRect()
      const range = document.createRange()
      range.selectNodeContents(title)
      const text = range.getBoundingClientRect()
      return {
        width: innerWidth,
        overflow: document.documentElement.scrollWidth > innerWidth,
        lines: Math.round(t.height / parseFloat(getComputedStyle(title).lineHeight)),
        titleFits: text.left >= 0 && text.right <= innerWidth,
        appointmentVisible: r.top > 0 && r.bottom < innerHeight && r.left >= 0 && r.right <= innerWidth,
        buttonHeight: r.height,
        searchWidth: hero.querySelector('input').getBoundingClientRect().width,
        brokenImages: [...hero.querySelectorAll('img')].filter(i => !i.complete || !i.naturalWidth).length,
      }
    })
    assert.equal(result.overflow, false, `Overflow at ${width}`)
    assert.equal(result.lines, 2, `Title lines at ${width}`)
    assert.equal(result.titleFits, true, `Title fits at ${width}`)
    assert.equal(result.appointmentVisible, true, `Appointment visible at ${width}`)
    assert.ok(result.buttonHeight >= 44)
    assert.ok(result.searchWidth >= 130, `Search field at ${width}`)
    assert.equal(result.brokenImages, 0)
    if ([320, 600, 1024, 1920].includes(width)) await page.screenshot({ path: `${out}/hero-${width}.jpg` })
    results.push(result)
  }
  await page.goto('http://localhost:3000')
  await page.eval(() => {
    document.querySelector('.welcome-search input').value = 'Heart & care'
    document.querySelector('.welcome-search').requestSubmit()
  })
  await sleep(1800)
  assert.equal(await page.eval('location.pathname'), '/doctors')
  assert.equal(await page.eval('new URL(location.href).searchParams.get("q")'), 'Heart & care')
  console.log('Doctor search submits and preserves encoded input.')

  await page.goto('http://localhost:3000')
  await page.eval('document.querySelector(".welcome-appointment").click()')
  await sleep(1800)
  assert.equal(await page.eval('location.pathname'), '/appointment')
  console.log('Appointment action opens the appointment journey.')

  const reduced = await browser.newPage({ width: 390, height: 844, reducedMotion: true })
  await reduced.goto('http://localhost:3000')
  assert.equal(await reduced.eval('document.getAnimations().length'), 0)
  await reduced.screenshot({ path: `${out}/reduced-motion.jpg` })
  const plain = await browser.newPage({ width: 390, height: 844 })
  await plain.send('Emulation.setScriptExecutionDisabled', { value: true })
  await plain.goto('http://localhost:3000')
  await plain.eval('document.fonts.ready')
  console.log('No-JavaScript visibility:', await plain.eval('Array.from(document.querySelectorAll(".welcome h1,.welcome-appointment"),e=>({text:e.innerText,opacity:getComputedStyle(e).opacity,visibility:getComputedStyle(e).visibility,font:getComputedStyle(e).fontFamily}))'))
  assert.equal(await plain.eval('document.querySelector("h1").innerText.replace(/\\s+/g," ")'), 'Care begins with you.')
  assert.equal(await plain.eval('document.querySelector(".welcome-search").getAttribute("action")'), '/doctors')
  await plain.screenshot({ path: `${out}/no-javascript.jpg` })
  assert.deepEqual(page.consoleErrors, [])
  assert.deepEqual(reduced.consoleErrors, [])
  await writeFile(`${out}/measurements.json`, JSON.stringify(results, null, 2))
  console.log('PASS: 13 widths, visible appointment action, two-line title, no overflow, working search and appointment links, reduced motion and no-JavaScript fallback.')
} finally { await browser.close() }
