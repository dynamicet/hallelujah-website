// Reproduce with Node 22+ and the design-taste-frontend skill installed.
import assert from 'node:assert/strict'
import { writeFile } from 'node:fs/promises'
import { Browser, sleep } from '/home/befikadusata/.codex/skills/design-taste-frontend/scripts/lib/cdp.mjs'

const origin = 'http://localhost:3000'
const browser = await Browser.launch()
const results = []
async function until(page, expression) {
  for (let n = 0; n < 100; n++) {
    if (await page.eval(expression)) return
    await sleep(100)
  }
  throw new Error(`Timed out: ${expression}`)
}
try {
  for (const [width, height] of [[1440, 900], [768, 1024], [390, 844], [320, 844]]) {
    const page = await browser.newPage({ width, height, mobile: width < 600 })
    await page.goto(origin)
    await until(page, "document.documentElement.dataset.hydration === 'ready'")
    const measurements = await page.eval(() => ({
      width: innerWidth, height: document.documentElement.scrollHeight,
      overflow: document.documentElement.scrollWidth > innerWidth,
      sections: [...document.querySelector('.hospital-home').children].map(el => ({
        heading: el.querySelector('h1,h2')?.textContent,
        top: Math.round(el.getBoundingClientRect().top + scrollY),
      })),
      arrivalTop: Math.round(document.querySelector('#home-directions').getBoundingClientRect().top + scrollY),
      contactTop: Math.round(document.querySelector('#home-call').getBoundingClientRect().top + scrollY),
      brokenAnchors: [...document.querySelectorAll('a[href]')].map(a => new URL(a.href)).filter(u => u.pathname === '/' && u.hash && !document.getElementById(decodeURIComponent(u.hash.slice(1)))).map(u => u.hash),
      bodySize: getComputedStyle(document.querySelector('.welcome-copy p')).fontSize,
    }))
    assert.equal(measurements.overflow, false)
    assert.deepEqual(measurements.brokenAnchors, [])
    assert.equal(await page.eval("document.querySelector('.home-campaign,.life-story,.hospital-spaces') === null"), true)
    assert.equal(await page.eval("document.querySelector('#home-directions').closest('#visit-guide') !== null"), true)
    for (let index = 0; index < 3; index++) {
      await page.eval(i => document.querySelectorAll('.navigator-choice')[i].click(), index)
      await sleep(100)
      assert.equal(await page.eval(i => document.querySelectorAll('.navigator-choice')[i].getAttribute('aria-pressed'), index), 'true')
      const href = await page.eval("document.querySelector('#care-navigator-result a').getAttribute('href')")
      assert.equal(href, ['/appointment', '/doctors', '/services'][index])
      assert.equal((await fetch(origin + href)).status, 200)
    }
    for (let index = 0; index < 3; index++) {
      await page.eval(i => document.querySelectorAll('.care-spotlight-choice')[i].click(), index)
      await sleep(100)
      assert.equal(await page.eval(i => document.querySelectorAll('.care-spotlight-choice')[i].getAttribute('aria-pressed'), index), 'true')
      const href = await page.eval("document.querySelector('#care-spotlight-result a').getAttribute('href')")
      assert.equal((await fetch(origin + href)).status, 200)
    }
    await page.eval("document.querySelector('#health-topic-search').focus()")
    await page.send('Input.insertText', { text: 'blood sugar' })
    await until(page, "!!document.querySelector('[data-health-topic=diabetes]')")
    await page.eval("document.querySelector('[data-health-topic=diabetes]').click()")
    await until(page, "document.activeElement.id === 'health-topic-reader'")
    assert.equal(await page.eval("document.querySelector('#health-topic-reader a[href=\"/health-topics/diabetes\"]') !== null"), true)
    assert.equal(await page.eval("document.querySelector('#health-topic-reader a[href*=\"service=pub_141414141414\"]') !== null"), true)
    await page.eval("document.querySelector('#health-topic-reader button').click()")
    await until(page, "document.activeElement.dataset.healthTopic === 'diabetes'")
    // Native keyboard interaction opens/closes each FAQ, including support moved from visit tabs.
    await page.send('Page.bringToFront')
    for (let index = 0; index < 4; index++) {
      await page.eval(i => document.querySelectorAll('.visit-questions summary')[i].focus(), index)
      assert.equal(await page.eval(i => document.activeElement === document.querySelectorAll('.visit-questions summary')[i], index), true)
      await page.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13, text: '\r' })
      await page.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 })
      await sleep(100)
      assert.equal(await page.eval(i => document.querySelectorAll('.visit-questions details')[i].open, index), true, `FAQ ${index} at ${width}`)
    }
    await page.eval("document.querySelector('.visit-questions details[open]').open = false")
    await page.eval("document.querySelector('.partners-toggle').click()")
    await sleep(100)
    assert.equal(await page.eval("document.querySelector('#partners-list').dataset.view"), 'all')
    await page.eval("document.querySelector('.partners-toggle').click()")
    assert.equal(await page.eval("document.querySelector('#partners-list').dataset.view"), 'row')
    await page.eval("document.querySelector('#home-directions').focus(); document.querySelector('#home-directions').scrollIntoView({block:'start',behavior:'instant'})")
    await sleep(500)
    await page.screenshot({ path: `artifacts/h1-homepage/visit-${width}.jpg` })
    assert.equal(await page.eval("document.activeElement.id"), 'home-directions')
    assert.match(await page.eval("document.querySelector('#home-call').textContent"), /not available in this preview/)
    assert.equal(await page.eval("document.querySelector('#home-call a[href^=tel]')"), null)
    // Submit both direct searches and verify their real destinations and parameters.
    for (const [selector, query, route] of [['#home-doctor-search', 'Aster', '/doctors'], ['#home-service-search', 'General medicine', '/services']]) {
      await page.goto(origin)
      await page.eval(({ selector, query }) => { const input = document.querySelector(selector); input.value = query; input.form.requestSubmit() }, { selector, query })
      await until(page, `location.pathname === '${route}'`)
      assert.equal(await page.eval("new URLSearchParams(location.search).get('q')"), query)
    }
    results.push(measurements)
    console.log(`Passed homepage interactions at ${width}px`)
    await page.close()
  }
  const fallback = await browser.newPage({ width: 390, height: 844, mobile: true })
  await fallback.send('Emulation.setScriptExecutionDisabled', { value: true })
  await fallback.goto(origin)
  assert.equal(await fallback.eval("document.querySelector('#care-navigator-result a').getAttribute('href')"), '/appointment')
  assert.equal(await fallback.eval("getComputedStyle(document.querySelector('.navigator-fallback')).display !== 'none'"), true)
  assert.equal(await fallback.eval("getComputedStyle(document.querySelector('#home-call')).visibility"), 'visible')
  await fallback.screenshot({ path: 'artifacts/h1-homepage/no-js-390.jpg' })
  await fallback.close()
  const reduced = await browser.newPage({ width: 390, height: 844, reducedMotion: true })
  await reduced.goto(origin)
  await reduced.eval("document.querySelector('#about-hallelujah').scrollIntoView({behavior:'instant'})")
  await sleep(300)
  assert.equal(await reduced.eval("getComputedStyle(document.querySelector('.consultation-copy')).opacity"), '1')
  await reduced.screenshot({ path: 'artifacts/h1-homepage/reduced-motion-390.jpg' })
  await reduced.close()
  await writeFile('artifacts/h1-homepage/interactions.json', JSON.stringify({ results, noJavaScript: 'passed', reducedMotion: 'passed' }, null, 2) + '\n')
} finally {
  await browser.close()
}
