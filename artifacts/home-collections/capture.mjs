import { Browser, sleep } from '/home/befikadusata/.codex/skills/design-taste-frontend/scripts/lib/cdp.mjs'
import { writeFile } from 'node:fs/promises'
const browser = await Browser.launch()
const results = []
try {
  for (const width of [1440, 768, 390, 320]) {
    const page = await browser.newPage({ width, height: 1000, mobile: width < 600 })
    await page.goto('http://localhost:3000')
    await page.eval('document.fonts.ready')
    for (let y = 0; y < await page.eval('document.documentElement.scrollHeight'); y += 700) {
      await page.eval(y => scrollTo({ top: y, behavior: 'instant' }), y)
      await sleep(70)
    }
    await sleep(600)
    const sections = await page.eval(() => {
      const box = el => { const r = el.getBoundingClientRect(); const s = getComputedStyle(el); return { x: Math.round(r.x), y: Math.round(r.y + scrollY), width: Math.round(r.width), height: Math.round(r.height), display: s.display, columns: s.gridTemplateColumns } }
      return [...document.querySelector('.hospital-home').children, document.querySelector('footer')].map(el => ({
        heading: el.querySelector('h1,h2')?.textContent, ...box(el),
        items: [...el.querySelectorAll('.team-person,.patient-story,article,.welcome-search,.navigator-choice,.care-spotlight-choice')].map(i => ({ text: i.textContent.trim().replace(/\s+/g, ' ').slice(0,90), ...box(i) })),
      }))
    })
    results.push({ width, height: await page.eval('document.documentElement.scrollHeight'), sections })
    for (const [name, selector] of [['doctors', '.team-guide'], ['stories', '.patient-testimonials'], ['news', '#news-resources'], ['care', '.care-areas']]) {
      await page.eval(s => document.querySelector(s).scrollIntoView({ block: 'start', behavior: 'instant' }), selector)
      await sleep(350)
      await page.screenshot({ path: `artifacts/home-collections/${name}-${width}.jpg`, quality: 85 })
    }
    if (width === 1440) {
      await page.eval("document.querySelector('.navigator-choice:nth-child(2)').click()")
      await page.eval("document.querySelector('.care-spotlight-choice:nth-child(2)').click()")
      await page.eval("document.querySelector('.visit-questions summary').click()")
      await page.eval("document.querySelector('.patient-story summary').click()")
      results.push({ interactions: await page.eval(() => ({ navigator: document.querySelector('#care-navigator-result').innerText, care: document.querySelector('#care-spotlight-result').innerText, faqOpen: document.querySelector('.visit-questions details').open, storyOpen: document.querySelector('.patient-story details').open })) })
    }
    await page.close()
  }
  await writeFile('artifacts/home-collections/measurements.json', JSON.stringify(results, null, 2) + '\n')
  console.log(JSON.stringify(results.map(r => ({ width: r.width, height: r.height, sections: r.sections?.map(s => ({ heading: s.heading, height: s.height })), interactions: r.interactions })), null, 2))
} finally { await browser.close() }
