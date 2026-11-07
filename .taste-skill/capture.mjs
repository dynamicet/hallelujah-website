import { Browser } from '/home/befikadusata/.codex/skills/design-taste-frontend/scripts/lib/cdp.mjs'
import { mkdir } from 'node:fs/promises'

await mkdir('.taste-skill/journeys', { recursive: true })
const browser = await Browser.launch()
try {
  for (const [route, label] of [['/doctors', 'doctors'], ['/services', 'services'], ['/appointment', 'appointment'], ['/emergency', 'emergency'], ['/doctors/synthetic-clinician-101010101010/', 'profile']]) {
    const page = await browser.newPage({ width: 1440, height: 1000 })
    await page.goto('http://localhost:3000' + route)
    await page.eval('document.fonts.ready')
    await page.screenshot({ path: `.taste-skill/journeys/${label}.jpg`, fullPage: true })
    await page.setViewport({ width: 390, height: 844, mobile: true })
    await page.screenshot({ path: `.taste-skill/journeys/${label}-mobile.jpg`, fullPage: true })
    console.log(label, JSON.stringify(await page.eval('({overflow:document.documentElement.scrollWidth > innerWidth,errors:[...document.images].filter(i=>!i.complete||!i.naturalWidth).length})')))
    await page.close()
  }
  const page = await browser.newPage({ width: 390, height: 844, reducedMotion: true })
  await page.goto('http://localhost:3000')
  await page.eval('window.scrollTo(0, document.body.scrollHeight)')
  await page.eval('Promise.all([...document.images].map(image => image.decode().catch(() => {})))')
  await page.eval('window.scrollTo(0, 0)')
  await page.screenshot({ path: '.taste-skill/journeys/home-reduced-motion.jpg', fullPage: true })
  console.log('Reduced motion animations:', await page.eval('document.getAnimations().length'))
} finally { await browser.close() }
