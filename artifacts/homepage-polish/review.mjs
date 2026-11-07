import assert from 'node:assert/strict'
import { mkdir, writeFile } from 'node:fs/promises'
import { Browser, sleep } from '/home/befikadusata/.codex/skills/design-taste-frontend/scripts/lib/cdp.mjs'

const phase = process.argv[2] ?? 'before'
const output = `artifacts/homepage-polish/${phase}`
await mkdir(output, { recursive: true })
const browser = await Browser.launch()
const measurements = []
try {
  for (const width of [1440, 1200, 1024, 900, 768, 700, 600, 390, 320]) {
    const page = await browser.newPage({ width, height: 1000, reducedMotion: true })
    await page.goto('http://localhost:3000')
    await page.eval('document.fonts.ready')
    const result = { width, sections: {} }
    for (const id of ['patient-testimonials', 'news-resources', 'partners']) {
      await page.eval(`document.getElementById('${id}').scrollIntoView({behavior:'instant',block:'start'})`)
      await sleep(300)
      result.sections[id] = await page.eval((id) => {
        const section = document.getElementById(id)
        const box = el => { const r = el.getBoundingClientRect(); return { x: r.x, y: r.y + scrollY, width: r.width, height: r.height } }
        return { box: box(section), heading: box(section.querySelector('h2')),
          articles: [...section.querySelectorAll('article')].map(el => ({ box: box(el), title: box(el.querySelector('h3')), text: el.querySelector('h3').textContent, image: box(el.querySelector('img')), paragraphs: [...el.querySelectorAll('p')].map(p => ({ text: p.textContent, box: box(p) })), footer: el.querySelector('[class*=cardFooter]') ? box(el.querySelector('[class*=cardFooter]')) : null, meta: el.querySelector('[class*=meta]') ? box(el.querySelector('[class*=meta]')) : null })),
          imagesLoaded: [...section.querySelectorAll('img')].every(img => img.complete && img.naturalWidth > 0),
        }
      }, id)
      if (phase === 'after' && id === 'news-resources') {
        const articles = result.sections[id].articles
        assert.equal(articles.length, 3)
        const aligned = width >= 1024 ? articles : width >= 600 ? articles.slice(1) : []
        for (const field of ['title', 'meta', 'footer']) {
          assert.ok(aligned.every(article => Math.abs(article[field].y - aligned[0][field].y) < 1), `${field} alignment at ${width}`)
        }
        if (width >= 600 && width < 1024) {
          assert.ok(articles[0].box.width > articles[1].box.width * 1.9, `Tablet lead spans both columns at ${width}`)
          assert.ok(Math.abs(articles[1].box.y - articles[2].box.y) < 1, `Tablet pair shares a row at ${width}`)
        }
      }
      if ([1440, 900, 768, 600, 390, 320].includes(width)) {
        const { data } = await page.send('Page.captureScreenshot', { format: 'jpeg', quality: 85, captureBeyondViewport: true, clip: { ...result.sections[id].box, scale: 1 } })
        await writeFile(`${output}/${id}-${width}.jpg`, Buffer.from(data, 'base64'))
      }
    }
    if (phase === 'after' && [1440, 768, 390].includes(width)) {
      const reading = await page.eval(() => {
        const stories = [...document.querySelectorAll('.patient-story')]
        const before = stories.map(story => story.getBoundingClientRect().height)
        stories[0].querySelector('summary').click()
        return { before, after: stories.map(story => story.getBoundingClientRect().height), open: stories[0].querySelector('details').open }
      })
      assert.ok(reading.open && reading.after[0] > reading.before[0] + 100, 'Written story expands')
      assert.ok(Math.abs(reading.after[1] - reading.before[1]) < 1, 'Other story keeps its natural height')
      await page.eval("document.querySelector('.patient-story summary').click()")
      await page.eval("document.querySelector('#news-resources .text-link').focus()")
      await page.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 })
      await page.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 })
      assert.ok(await page.eval(() => document.activeElement.matches('#news-resources h3 a:focus-visible') && getComputedStyle(document.activeElement.closest('article')).outlineStyle !== 'none'), 'News link has visible keyboard focus')
      await page.screenshot({ path: `${output}/news-focus-${width}.jpg`, quality: 85 })
      if (width === 1440) {
        const links = await page.eval(() => [...document.querySelectorAll('#news-resources a')].map(link => link.href))
        for (const link of links) assert.equal((await fetch(link)).status, 200, link)
      }
      await page.eval("document.querySelector('.partners').scrollIntoView({behavior:'instant',block:'start'})")
      assert.ok(await page.eval("document.querySelector('[aria-label=\"Previous partners\"]').disabled"))
      await page.eval("document.querySelector('[aria-label=\"Next partners\"]').click()")
      await sleep(150)
      assert.ok(await page.eval("document.querySelector('.partners-list').scrollLeft > 0 && !document.querySelector('[aria-label=\"Previous partners\"]').disabled"), 'Next partners advances the manual rail')
      for (let step = 0; step < 12; step++) {
        if (await page.eval("document.querySelector('[aria-label=\"Next partners\"]').disabled")) break
        await page.eval("document.querySelector('[aria-label=\"Next partners\"]').click()")
        await sleep(100)
      }
      assert.ok(await page.eval("document.querySelector('[aria-label=\"Next partners\"]').disabled"), 'Partner rail reaches its end')
      result.interactions = { storyExpansion: reading, newsKeyboardFocus: true, partnerRail: true }
    }
    await page.eval("document.querySelector('.partners-toggle').click()")
    await sleep(200)
    assert.equal(await page.eval("document.querySelectorAll('.partner').length"), 19)
    if ([1440, 390].includes(width)) {
      const clip = await page.eval(() => { const r = document.querySelector('.partners').getBoundingClientRect(); return { x: r.x, y: r.y + scrollY, width: r.width, height: r.height, scale: 1 } })
      const { data } = await page.send('Page.captureScreenshot', { format: 'jpeg', quality: 85, captureBeyondViewport: true, clip })
      await writeFile(`${output}/partners-all-${width}.jpg`, Buffer.from(data, 'base64'))
    }
    assert.equal(await page.eval('document.documentElement.scrollWidth > innerWidth'), false, `Page overflow at ${width}`)
    measurements.push(result)
    await page.close()
    console.log(`${phase}: captured ${width}px`)
  }
  if (phase === 'after') {
    const page = await browser.newPage({ width: 390, height: 844 })
    await page.send('Emulation.setScriptExecutionDisabled', { value: true })
    await page.goto('http://localhost:3000')
    assert.equal(await page.eval("document.querySelectorAll('.patient-story').length"), 2)
    assert.equal(await page.eval("document.querySelectorAll('#news-resources article').length"), 3)
    assert.equal(await page.eval("document.querySelectorAll('.partner').length"), 19)
    assert.equal(await page.eval("getComputedStyle(document.querySelector('.partners-toggle')).display"), 'none')
    await page.close()
    console.log('Story expansion, natural article heights, news keyboard focus and destinations, partner rail and no-JavaScript content passed.')
  }
  await writeFile(`${output}/measurements.json`, JSON.stringify(measurements, null, 2) + '\n')
} finally { await browser.close() }
