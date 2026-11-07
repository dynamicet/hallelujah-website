import { chromium } from '/home/befikadusata/.npm/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs'
import { readFile, writeFile } from 'node:fs/promises'
import assert from 'node:assert/strict'
const out = new URL('./', import.meta.url)
const { results } = JSON.parse(await readFile(new URL('results.json', out)))
const b = await chromium.launch({ executablePath: '/snap/chromium/current/usr/lib/chromium-browser/chrome', headless: true, args: ['--no-sandbox'] })
const sheet = await b.newPage()
for (const width of [1440, 390]) {
  const group = results.filter(r => r.width === width)
  for (let offset = 0; offset < group.length; offset += 4) {
    const batch = group.slice(offset, offset + 4)
    const cards = await Promise.all(batch.map(async r => `<section><h3 style="height:48px;margin:8px;overflow-wrap:anywhere">${r.path}</h3><img src="data:image/png;base64,${(await readFile(new URL(r.screenshot, out))).toString('base64')}" style="width:360px;display:block"></section>`))
    await sheet.setViewportSize({ width: 1472, height: 2600 })
    await sheet.setContent(`<body style="margin:0;background:#ddd;font:14px sans-serif;display:grid;grid-template-columns:repeat(4,360px);gap:8px">${cards.join('')}</body>`)
    await sheet.evaluate(() => Promise.all([...document.images].map(i => i.decode())))
    await sheet.screenshot({ path: new URL(`sheet-${width}-${offset}.png`, out).pathname })
  }
}
const p = await b.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' })
await p.goto('http://localhost:3000/feedback', { waitUntil: 'networkidle' })
await p.getByLabel('Your sample message').fill('Sample feedback for visual review.')
await p.getByRole('button', { name: 'Review sample feedback' }).click()
await p.getByRole('heading', { name: 'Review your sample' }).waitFor()
await p.screenshot({ path: new URL('feedback-review-390.png', out).pathname, fullPage: true })
await p.getByRole('button', { name: 'Edit message' }).click()
assert.equal(await p.getByLabel('Your sample message').inputValue(), 'Sample feedback for visual review.')
await p.goto('http://localhost:3000/health-topics', { waitUntil: 'networkidle' })
await p.getByLabel('Search health and care topics', { exact: true }).fill('back pain')
await p.locator('[data-health-topic="back-pain"]').click()
await p.getByRole('heading', { name: 'Back pain', exact: true }).waitFor()
await p.screenshot({ path: new URL('topic-reader-390.png', out).pathname, fullPage: true })
await p.getByRole('button', { name: 'Back to matches' }).click()
assert.equal(await p.locator('[data-health-topic="back-pain"]').evaluate(e => e === document.activeElement), true)
await p.goto('http://localhost:3000/', { waitUntil: 'networkidle' })
await p.getByRole('link', { name: /Contact & directions Speak/ }).click()
await p.waitForTimeout(300)
const anchor = await p.locator('#home-directions').evaluate(e => ({ top: e.getBoundingClientRect().top, header: document.querySelector('[data-site-header]').getBoundingClientRect().bottom }))
assert.ok(anchor.top >= anchor.header - 2, JSON.stringify(anchor))
const nojs = await b.newContext({ javaScriptEnabled: false })
const n = await nojs.newPage()
await n.goto('http://localhost:3000/health-topics')
assert.equal(await n.getByRole('link', { name: 'find contact information' }).getAttribute('href'), '/#home-call')
await n.getByRole('link', { name: 'find contact information' }).click()
assert.equal(new URL(n.url()).hash, '#home-call')
assert.equal(await n.locator('#home-call').count(), 1)
const profile = results.find(r => r.path.startsWith('/doctors/'))
await p.goto(`http://localhost:3000${profile.path}`, { waitUntil: 'networkidle' })
assert.ok((await p.title()).includes((await p.locator('h1').innerText()).trim()))
const responsive = []
for (const width of [320, 768, 1024]) {
  await p.setViewportSize({ width, height: 900 })
  for (const path of ['/', '/doctors', '/services', '/appointment', '/emergency', '/news-resources']) {
    await p.goto(`http://localhost:3000${path}`, { waitUntil: 'networkidle' })
    const overflow = await p.evaluate(() => document.documentElement.scrollWidth > innerWidth)
    responsive.push({ width, path, overflow })
    assert.equal(overflow, false, `${width} ${path}`)
  }
}
await writeFile(new URL('followup-results.json', out), JSON.stringify({ feedback: 'passed', topicSearchAndFocus: 'passed', contactAnchor: anchor, noJavaScriptContactLink: 'passed', profileTitle: 'passed', responsive }, null, 2))
console.log('Interaction checks and 18 additional responsive checks passed.')
await b.close()
