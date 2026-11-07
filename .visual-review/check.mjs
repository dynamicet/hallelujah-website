import { chromium } from '/home/befikadusata/.npm/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs'
import { writeFile } from 'node:fs/promises'

const out = new URL('./', import.meta.url)
const browser = await chromium.launch({ executablePath: '/snap/chromium/current/usr/lib/chromium-browser/chrome', args: ['--no-sandbox'], headless: true })
const context = await browser.newContext({ reducedMotion: 'reduce' })
const page = await context.newPage()
const errors = []
page.on('pageerror', error => errors.push(error.message))
const paths = ['/', '/doctors', '/services', '/appointment', '/emergency', '/patients-visitors', '/health-topics', '/news-resources', '/referrals', '/feedback']
for (const path of ['/doctors', '/services']) {
  await page.goto(`http://localhost:3000${path}`, { waitUntil: 'networkidle' })
  const detail = await page.locator(`a[href^="${path}/"]`).first().getAttribute('href')
  if (detail) paths.push(detail)
}
paths.push('/health-topics/back-pain', '/news-resources/make-room-for-your-questions')
const results = []
for (const width of [1440, 390]) {
  await page.setViewportSize({ width, height: 960 })
  for (let index = 0; index < paths.length; index++) {
    const path = paths[index]
    const response = await page.goto(`http://localhost:3000${path}`, { waitUntil: 'networkidle' })
    await page.evaluate(async () => {
      await document.fonts.ready
      for (let y = 0; y < document.body.scrollHeight; y += 800) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 35)) }
      window.scrollTo(0, 0)
    })
    const metrics = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth > innerWidth,
      h1: [...document.querySelectorAll('h1')].map(x => x.textContent),
      brokenImages: [...document.images].filter(x => x.getBoundingClientRect().height > 0 && x.complete && !x.naturalWidth).map(x => x.src),
      title: document.title,
      overflowingElements: [...document.querySelectorAll('main *')].filter(x => { const r = x.getBoundingClientRect(); return r.width && (r.left < -1 || r.right > innerWidth + 1) }).slice(0, 8).map(x => ({ tag: x.tagName, class: x.className })),
    }))
    const name = `${width}-${index}`
    await page.screenshot({ path: new URL(`${name}.png`, out).pathname, fullPage: true })
    results.push({ path, width, status: response.status(), screenshot: `${name}.png`, ...metrics })
    console.log(JSON.stringify({ path, width, status: response.status(), overflow: metrics.overflow, brokenImages: metrics.brokenImages.length, h1: metrics.h1.length }))
  }
}
await writeFile(new URL('results.json', out), JSON.stringify({ results, errors }, null, 2))
// Render contact sheets locally, using only the screenshots from this review.
await page.goto('about:blank')
for (const width of [1440, 390]) {
  const group = results.filter(r => r.width === width)
  for (let offset = 0; offset < group.length; offset += 4) {
    const batch = group.slice(offset, offset + 4)
    const html = `<html><body style="margin:0;background:#ddd;font:16px sans-serif;display:grid;grid-template-columns:repeat(4,360px);gap:8px">${batch.map(r => `<section><h3 style="height:48px;margin:10px;overflow-wrap:anywhere">${r.path}</h3><img src="data:image/png;base64,IMAGE_${r.screenshot}" style="width:360px;display:block"></section>`).join('')}</body></html>`
    const { readFile } = await import('node:fs/promises')
    let rendered = html
    for (const r of batch) rendered = rendered.replace(`IMAGE_${r.screenshot}`, (await readFile(new URL(r.screenshot, out))).toString('base64'))
    await page.setViewportSize({ width: 1472, height: width === 1440 ? 2200 : 3200 })
    await page.setContent(rendered)
    await page.evaluate(() => Promise.all([...document.images].map(i => i.decode())))
    await page.screenshot({ path: new URL(`sheet-${width}-${offset}.png`, out).pathname })
  }
}
await browser.close()
