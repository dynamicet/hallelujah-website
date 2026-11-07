import assert from 'node:assert/strict'
import { writeFileSync } from 'node:fs'
import { Browser, sleep } from '/home/befikadusata/.codex/skills/design-taste-frontend/scripts/lib/cdp.mjs'

const browser = await Browser.launch({ extraArgs: ['--no-sandbox', '--disable-dev-shm-usage'] })
const page = await browser.newPage()
const results = []
try {
  for (const width of [1440, 768, 390, 320]) {
    await page.setViewport({ width, height: width === 768 ? 1024 : 900, mobile: width < 600 })
    await page.goto('http://localhost:3000', { settleMs: 500 })
    for (const [index, heading, query] of [[0, 'General medicine.', 'General medicine'], [1, 'Heart medicine.', 'Heart medicine'], [2, 'Rehabilitation care.', 'Rehabilitation care']]) {
      await page.eval(i => document.querySelectorAll('.care-spotlight-choice')[i].click(), index)
      await sleep(150)
      const selected = await page.eval(() => ({
        heading: document.querySelector('#care-spotlight-result h3').textContent,
        pressed: [...document.querySelectorAll('.care-spotlight-choice')].map(b => b.getAttribute('aria-pressed')),
        href: document.querySelector('#care-spotlight-result a').getAttribute('href'),
        questions: document.querySelectorAll('#care-spotlight-result li').length,
        images: document.querySelectorAll('.care-spotlight img').length,
      }))
      assert.equal(selected.heading, heading)
      assert.equal(selected.pressed[index], 'true')
      assert.equal(selected.pressed.filter(x => x === 'true').length, 1)
      assert.equal(new URL(selected.href, 'http://localhost').searchParams.get('q'), query)
      assert.equal(selected.questions, 2)
      assert.equal(selected.images, 0)
    }
    const sources = await page.eval(() => [...document.querySelectorAll('main img[src^="/editorial/"]')].map(img => img.getAttribute('src')))
    assert.equal(sources.length, new Set(sources).size, 'No repeated editorial images within homepage')
    assert.equal(await page.eval(() => document.documentElement.scrollWidth > innerWidth), false)
    await page.eval(() => document.querySelector('.care-spotlight-choice').focus())
    await page.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 })
    await page.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 })
    assert.equal(await page.eval(() => document.activeElement === document.querySelectorAll('.care-spotlight-choice')[1]), true)
    await page.goto('http://localhost:3000/feedback', { settleMs: 500 })
    assert.equal(await page.eval(() => document.querySelectorAll('main img[src^="/editorial/"]').length), 0)
    await page.eval(() => {
      const input = document.querySelector('#feedback-message')
      Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value').set.call(input, 'Sample layout review')
      input.dispatchEvent(new Event('input', { bubbles: true }))
    })
    await sleep(100)
    await page.eval(() => document.querySelector('form button[type="submit"]').click())
    await sleep(200)
    assert.equal(await page.eval(() => document.querySelector('#feedback-review-title')?.textContent), 'Review your sample')
    assert.equal(await page.eval(() => document.activeElement?.getAttribute('aria-labelledby')), 'feedback-review-title')
    results.push({ width, serviceChoices: 3, keyboardTab: 'passed', duplicateHomepagePhotos: 0, feedbackReviewFocus: 'passed', overflow: false })
  }
  for (const mode of ['no-javascript', 'reduced-motion']) {
    await page.send('Emulation.setScriptExecutionDisabled', { value: mode === 'no-javascript' })
    await page.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: mode === 'reduced-motion' ? 'reduce' : 'no-preference' }] })
    await page.goto('http://localhost:3000', { settleMs: 600 })
    assert.equal(await page.eval(() => document.querySelectorAll('.care-spotlight noscript a').length), mode === 'no-javascript' ? 3 : 0)
    assert.equal(await page.eval(() => document.querySelector('.consultation-image img').getAttribute('src')), '/editorial/family-care.webp')
    results.push({ mode, consultationImage: 'family-care', noScriptServiceLinks: mode === 'no-javascript' ? 3 : 0 })
  }
  writeFileSync(new URL('./interactions.json', import.meta.url), JSON.stringify(results, null, 2) + '\n')
  console.log(JSON.stringify(results, null, 2))
} finally {
  await browser.close()
}
