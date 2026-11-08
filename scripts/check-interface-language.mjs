import assert from 'node:assert/strict'
import path from 'node:path'
import { writeFile } from 'node:fs/promises'
import { runVisualCheck } from './lib/visual-check.mjs'

const baseUrl = process.env.HH_PREVIEW_URL || 'http://localhost:3000'
const pause = ms => new Promise(resolve => setTimeout(resolve, ms))
async function waitFor(page, expression) {
  for (let i = 0; i < 100; i++) { if (await page.eval(expression)) return; await pause(100) }
  console.log(await page.eval(() => ({ active: document.activeElement?.outerHTML, header: document.querySelector('header')?.innerText, errors: document.querySelector('nextjs-portal')?.shadowRoot?.textContent?.slice(-1500) })), page.consoleErrors)
  throw new Error(`Timed out: ${expression}`)
}
async function switchLanguage(page, language) {
  await page.eval(() => document.querySelector('[data-language-switcher] summary').focus())
  for (const key of ['Enter', 'Tab', 'Enter']) {
    await page.send('Input.dispatchKeyEvent', { type: 'keyDown', key, code: key, ...(key === 'Enter' ? { text: '\r' } : {}), windowsVirtualKeyCode: key === 'Enter' ? 13 : 9 })
    await page.send('Input.dispatchKeyEvent', { type: 'keyUp', key, code: key, windowsVirtualKeyCode: key === 'Enter' ? 13 : 9 })
  }
  await waitFor(page, `document.querySelector('[data-select-interface-language="${language === 'am' ? 'en' : 'am'}"]') !== null`)
  assert.equal(await page.eval(() => document.activeElement?.matches('[data-language-switcher] summary')), true, 'Language control retains keyboard focus')
}

await runVisualCheck('interface-language', baseUrl, async ({ browser, output }) => {
  const measurements = []
  for (const width of [390, 768, 1440]) {
    const page = await browser.newPage({ width, height: 1000, mobile: width < 600, reducedMotion: true })
    try {
      await page.goto(`${baseUrl}/doctors?q=heart#directory-search-title`)
      await page.eval(() => { localStorage.removeItem('hh-interface-language'); window.dispatchEvent(new Event('storage')) })
      await waitFor(page, '!!document.querySelector("[data-select-interface-language=am]")')
      const before = await page.eval(() => ({ url: location.href, title: document.querySelector('h1').textContent, query: document.querySelector('[name=q]').value }))
      await switchLanguage(page, 'am')
      assert.match(await page.eval(() => document.querySelector('[data-site-header]').textContent), /ሐኪም ይፈልጉ/u)
      assert.equal(await page.eval(() => document.querySelector('[data-search-box] label').textContent.trim()), 'ስም፣ ልዩ ሙያ፣ የጤና ችግር ወይም አገልግሎት')
      assert.deepEqual(await page.eval(() => ({ url: location.href, title: document.querySelector('h1').textContent, query: document.querySelector('[name=q]').value })), before, 'Switch preserves page, query, hash and editorial heading')
      await page.goto(`${baseUrl}/doctors?q=heart`)
      await waitFor(page, '!!document.querySelector("[data-select-interface-language=en]")')
      assert.equal(await page.eval(() => document.querySelector('[data-search-box] button').textContent.trim()), 'ፈልግ', 'Reload retains language')
      await page.eval(() => document.querySelector('[data-site-footer] a[href="/services"]').click())
      await waitFor(page, 'location.pathname === "/services" && !!document.querySelector("[data-service-directory-template]")')
      assert.equal(await page.eval(() => document.querySelector('[data-search-box] button').textContent.trim()), 'ፈልግ', 'Client navigation retains language')
      for (const [index, route] of ['/', '/doctors', '/services', '/appointment'].entries()) {
        await page.goto(`${baseUrl}${route}`)
        await waitFor(page, '!!document.querySelector("[data-select-interface-language=en]")')
        await page.eval('Promise.all([...document.images].map(image => { image.loading = "eager"; return image.decode().catch(() => {}) }))')
        const layout = await page.eval(() => ({ overflow: document.documentElement.scrollWidth > innerWidth, brokenImages: [...document.images].filter(image => !image.naturalWidth).map(image => image.src), amharicControls: document.querySelectorAll('[lang="am"]').length }))
        assert.equal(layout.overflow, false, `${route} at ${width}: overflow`)
        assert.deepEqual(layout.brokenImages, [])
        assert.ok(layout.amharicControls > 5, `${route}: translated controls`)
        if (route === '/') assert.equal(await page.eval(() => document.querySelector('.welcome-call').textContent.trim()), 'ወደ መቀበያ ይደውሉ')
        if (route === '/services') assert.equal(await page.eval(() => document.querySelector('[data-filter-disclosure] button').textContent.trim()), 'ምድቦችን ተግብር')
        await page.screenshot({ path: path.join(output, `am-${index}-${width}.png`), fullPage: true })
        measurements.push({ route, width, ...layout })
      }
      await page.eval(() => document.querySelector('input[value="not_sure"]').click())
      await page.eval(() => document.querySelector('[data-journey-next]').click())
      await waitFor(page, 'document.querySelector("[data-appointment-template]").dataset.journeyStep === "1"')
      await page.eval(() => document.querySelector('[data-journey-next]').click())
      assert.equal(await page.eval(() => document.querySelector('#full-name').getAttribute('aria-invalid')), 'true')
      assert.match(await page.eval(() => document.querySelector('#full-name-error').textContent), /ስም/u)
      await page.eval(() => { const input = document.querySelector('#full-name'); input.value = 'DEMO NAME'; input.dispatchEvent(new Event('input', { bubbles: true })) })
      await switchLanguage(page, 'en')
      await pause(150)
      assert.equal(await page.eval(() => document.querySelector('#full-name').value), 'DEMO NAME', 'Switch retains entered values')
      assert.equal(await page.eval(() => document.querySelector('[data-appointment-template]').dataset.journeyStep), '1', 'Switch retains current form step')
      assert.equal(await page.eval(() => document.querySelector('label[for="full-name"] span').textContent), 'Full name')
      await switchLanguage(page, 'am')
      await pause(150)
      assert.equal(await page.eval(() => document.querySelector('label[for="full-name"] span').textContent), 'ሙሉ ስም')
      await page.eval(() => document.querySelector('[data-open-patient-guide]').click())
      await waitFor(page, '!!document.querySelector("[data-guide-input]")')
      assert.equal(await page.eval(() => document.querySelector('[data-guide-input]').placeholder), 'ምን ማግኘት ይፈልጋሉ?')
      await page.eval(() => document.querySelector('[data-patient-guide]').close())
      await page.goto(`${baseUrl}/feedback`)
      await page.eval(() => {
        const input = document.querySelector('#feedback-message')
        Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value').set.call(input, 'Search')
        input.dispatchEvent(new Event('input', { bubbles: true }))
      })
      await page.eval(() => document.querySelector('#feedback-message').closest('form').requestSubmit())
      await waitFor(page, '!!document.querySelector("blockquote[data-interface-content]")')
      assert.equal(await page.eval(() => document.querySelector('blockquote[data-interface-content]').textContent), 'Search', 'User-entered text is never translated')
      assert.equal(await page.eval(() => document.querySelector('#feedback-category option').value), 'Compliment', 'Canonical option values are preserved')
      assert.deepEqual(page.consoleErrors, [], 'No browser errors')
      console.log(`PASS language switching, persistence, navigation, forms and reduced motion at ${width}px`)
    } finally { await page.close() }
  }
  // Normal motion and storage-denied browsers also retain a working switch.
  const page = await browser.newPage({ width: 1440, height: 1000 })
  try {
    await page.send('Page.addScriptToEvaluateOnNewDocument', { source: 'Storage.prototype.getItem = Storage.prototype.setItem = () => { throw new Error("Storage disabled") }' })
    await page.goto(baseUrl)
    await switchLanguage(page, 'am')
    assert.match(await page.eval(() => document.querySelector('[data-site-header]').textContent), /ሐኪም ይፈልጉ/u)
    await switchLanguage(page, 'en')
    assert.deepEqual(page.consoleErrors, [])
  } finally { await page.close() }
  await writeFile(path.join(output, 'measurements.json'), `${JSON.stringify(measurements, null, 2)}\n`)
})
