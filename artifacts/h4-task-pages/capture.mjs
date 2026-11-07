import { Browser, sleep } from '/home/befikadusata/.codex/skills/design-taste-frontend/scripts/lib/cdp.mjs'
import { mkdirSync, writeFileSync } from 'node:fs'

const phase = process.argv[2] ?? 'after'
const out = new URL(`./${phase}/`, import.meta.url).pathname
mkdirSync(out, { recursive: true })
const browser = await Browser.launch({ extraArgs: ['--no-sandbox', '--disable-dev-shm-usage'] })
const page = await browser.newPage()
const routes = process.argv.length > 3 ? process.argv.slice(3) : [
  '/', '/feedback', '/referrals', '/patients-visitors',
  '/services/synthetic-service-111111111111/', '/health-topics/diabetes',
  '/news-resources', '/news-resources/make-room-for-your-questions',
  '/news-resources/understanding-medical-breakthroughs', '/news-resources/a-conversation-about-care',
  '/news-resources/keep-your-visit-information-together',
]
const results = []
try {
  for (const width of [1440, 768, 390]) {
    await page.setViewport({ width, height: width === 768 ? 1024 : width === 390 ? 844 : 900, mobile: width === 390 })
    for (const route of routes) {
      await page.goto(`http://localhost:3000${route}`, { settleMs: 600 })
      const pageHeight = await page.eval(() => document.documentElement.scrollHeight)
      await page.wheel(pageHeight, { step: 750, pauseMs: 15 })
      await sleep(250)
      const record = await page.eval(() => ({
        title: document.querySelector('h1')?.textContent,
        height: document.documentElement.scrollHeight,
        overflow: document.documentElement.scrollWidth > innerWidth,
        images: [...document.querySelectorAll('main img')].map(img => ({
          src: img.getAttribute('src'), currentSrc: new URL(img.currentSrc || img.src, location.href).pathname,
          alt: img.alt, loaded: img.complete && img.naturalWidth > 0,
        })),
      }))
      results.push({ width, route, ...record })
      const name = route === '/' ? 'home' : route.split('/').filter(Boolean).join('-')
      await page.screenshot({ path: `${out}${name}-${width}-full.jpg`, fullPage: true })
      await page.eval(() => scrollTo(0, 0))
      await sleep(350)
      await page.screenshot({ path: `${out}${name}-${width}-fold.jpg` })
      console.log(phase, width, route, record.height, record.overflow ? 'OVERFLOW' : '')
    }
  }
  writeFileSync(`${out}measurements.json`, JSON.stringify(results, null, 2) + '\n')
} finally {
  await browser.close()
}
