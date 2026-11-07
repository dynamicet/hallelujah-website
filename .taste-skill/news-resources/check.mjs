import assert from 'node:assert/strict'
import { mkdir, writeFile } from 'node:fs/promises'
import { Browser } from '/home/befikadusata/.codex/skills/design-taste-frontend/scripts/lib/cdp.mjs'

const out = 'artifacts/news-resources'
await mkdir(out, { recursive: true })
const browser = await Browser.launch()
const origin = 'http://127.0.0.1:3000'
try {
  for (const width of [1440, 768, 390, 320]) {
    const page = await browser.newPage({ width, height: 1000, reducedMotion: true })
    await page.goto(origin)
    await page.eval('document.fonts.ready')
    await page.eval(`document.querySelector('#news-resources').scrollIntoView({block:'start',behavior:'instant'})`)
    await page.eval(`Promise.all([...document.querySelectorAll('#news-resources img')].map(i=>i.decode()))`)
    const home = await page.eval(`(() => {
      const section = document.querySelector('#news-resources');
      return {cards: section.querySelectorAll('article').length, overflow:document.documentElement.scrollWidth > innerWidth,
        hrefs:[...section.querySelectorAll('article a')].map(a=>a.getAttribute('href')),
        rect: (()=>{const r=section.getBoundingClientRect();return {x:0,y:r.top+scrollY,width:innerWidth,height:r.height,scale:1}})()};
    })()`)
    assert.equal(home.cards, 3)
    assert.equal(home.overflow, false, `Homepage overflow at ${width}`)
    const capture = await page.send('Page.captureScreenshot', { format: 'jpeg', quality: 85, captureBeyondViewport: true, clip: home.rect })
    await writeFile(`${out}/home-${width}.jpg`, Buffer.from(capture.data, 'base64'))
    await page.goto(origin + '/news-resources')
    assert.equal(await page.eval('document.querySelectorAll("main article").length'), 4)
    assert.equal(await page.eval('document.documentElement.scrollWidth > innerWidth'), false, `Archive overflow at ${width}`)
    await page.screenshot({ path: `${out}/archive-${width}.jpg`, fullPage: true })
    for (const href of home.hrefs) {
      await page.goto(origin + href)
      assert.equal(await page.eval('document.querySelectorAll("main h1").length'), 1)
      assert.equal(await page.eval('document.documentElement.scrollWidth > innerWidth'), false, `Article overflow ${href} at ${width}`)
    }
    await page.screenshot({ path: `${out}/event-${width}.jpg`, fullPage: true })
    await page.close()
    console.log(`PASS ${width}: homepage cards, archive, all three destinations, no overflow`)
  }
  const page = await browser.newPage({ width: 1440, height: 1000 })
  await page.send('Emulation.setScriptExecutionDisabled', { value: true })
  for (const [category, count] of [['news',1], ['events',1], ['resources',2], ['unknown',4]]) {
    await page.goto(`${origin}/news-resources?category=${category}`)
    assert.equal(await page.eval('document.querySelectorAll("main article").length'), count)
  }
  await page.goto(`${origin}/news-resources?category=events`)
  assert.equal(await page.eval('document.querySelector("main nav a[aria-current=page]").textContent'), 'Events1')
  await page.eval('document.querySelector("main article a").focus()')
  assert.ok(await page.eval('getComputedStyle(document.querySelector("main article")).outlineStyle !== "none"'))
  await page.screenshot({ path: `${out}/keyboard-focus.jpg`, fullPage: true })
  await page.goto(`${origin}/news-resources/missing-story`)
  assert.ok(await page.eval('document.body.textContent.includes("404") || document.body.textContent.toLowerCase().includes("not found")'))
  console.log('PASS filters and story links without JavaScript, visible keyboard focus, unknown story 404')
} finally { await browser.close() }
