import assert from 'node:assert/strict'
import { writeFile } from 'node:fs/promises'
import { setTimeout as delay } from 'node:timers/promises'
import { runVisualCheck } from './lib/visual-check.mjs'

const baseUrl = process.env.HH_PREVIEW_URL || 'http://localhost:3000'
const key = async (page, key, code, windowsVirtualKeyCode) => {
  await page.send('Input.dispatchKeyEvent', { type: 'keyDown', key, code, windowsVirtualKeyCode, ...(key === 'Enter' ? { text: '\r' } : {}) })
  await page.send('Input.dispatchKeyEvent', { type: 'keyUp', key, code, windowsVirtualKeyCode })
}

await runVisualCheck('site-navigation', baseUrl, async ({ browser, output }) => {
  let canonical
  const results = []
  for (const route of ['/', '/about', '/doctors', '/doctors/synthetic-clinician-101010101010/', '/?demo=partial', '/?demo=empty', '/?demo=unavailable', '/emergency']) {
    for (const width of [390, 768, 1440]) {
      const page = await browser.newPage({ width, height: 1000, mobile: width < 600, reducedMotion: true })
      try {
        await page.goto(new URL(route, baseUrl).href)
        if (route === '/' || route.startsWith('/?')) {
          assert.ok(await page.eval("Boolean(document.querySelector('.hospital-home.enhanced-home'))"), 'All homepage URLs use the standard design')
          assert.equal(await page.eval('document.querySelector("h1").textContent'), 'Care for your whole life.')
          assert.equal(await page.eval("Boolean(document.querySelector('[data-home-template]'))"), false)
          assert.equal(await page.eval("document.querySelectorAll('.team-person').length"), 6, 'Preserve the newer six-doctor browsing section')
          assert.equal(await page.eval("document.querySelector('#about-hallelujah h2').textContent"), 'From Gotera, caring for Addis Ababa.', 'Show the hospital introduction')
          assert.ok(await page.eval("Boolean(document.querySelector('#health-library a[href=\"/health-topics\"]'))"), 'Preserve the concise health-topic introduction')
          assert.equal(await page.eval("document.querySelectorAll('[data-care-guide], [data-patient-guide], [data-help-widget]').length"), 0)
          assert.equal(await page.eval("document.querySelector('[data-call-widget] a').getAttribute('href')"), 'tel:9975')

        }
        assert.equal(await page.eval("document.querySelectorAll('[data-site-header]').length"), 1, 'One inherited header')
        assert.equal(await page.eval("document.querySelectorAll('[data-site-footer]').length"), 1, 'One inherited footer')
        assert.equal(await page.eval("document.querySelectorAll('main').length"), 1, 'One main landmark')
        assert.equal(await page.eval("document.querySelectorAll('[data-skip-link]').length"), 1, 'One skip link')
        assert.equal(await page.eval("document.querySelector('[data-site-footer]').dataset.footerVariant"), route === '/' || route.startsWith('/?') ? 'full' : 'compact')
        if (route === '/emergency') assert.equal(await page.eval("document.querySelectorAll('[data-call-widget]').length"), 0, 'Emergency retains its dedicated call action')
        const links = await page.eval(() => [...document.querySelectorAll('[data-primary-navigation] a')].map(a => ({ label: a.textContent.trim(), href: a.getAttribute('href') })))
        canonical ??= links
        assert.deepEqual(links, canonical, 'All page states share the same menu')
        assert.equal(links.find(a => a.label === 'About Us')?.href, '/about')
        assert.equal(await page.eval("document.querySelector('[data-site-footer] a[href=\"/about\"]').textContent"), 'About Us')
        assert.equal(await page.eval("document.querySelector('[data-primary-navigation] [aria-current=page]')?.getAttribute('href') ?? null"), route === '/about' ? '/about' : route.startsWith('/doctors') ? '/doctors' : null)
        if (route === '/about') {
          assert.equal(await page.eval('document.querySelector("h1").textContent'), 'About Us')
          assert.equal(await page.eval('document.title'), 'About Us | Hallelujah Hospital')
        }
        const compact = await page.eval("getComputedStyle(document.querySelector('[data-menu-trigger]')).display !== 'none'")
        if (compact) {
          await page.eval("document.querySelector('[data-menu-trigger]').focus()")
          await key(page, 'Enter', 'Enter', 13)
          await delay(200)
          assert.ok(await page.eval("document.querySelector('[data-navigation-panel]').matches(':popover-open')"))
        }
        await key(page, 'Tab', 'Tab', 9)
        await page.eval("document.querySelector('[data-primary-navigation] a[href=\"/about\"]').focus()")
        assert.ok(await page.eval("document.activeElement.matches(':focus-visible')"))
        assert.notEqual(await page.eval('getComputedStyle(document.activeElement).outlineStyle'), 'none')
        assert.equal(await page.eval("matchMedia('(prefers-reduced-motion: reduce)').matches"), true)
        assert.equal(await page.eval("getComputedStyle(document.activeElement).transitionDuration"), '0s')
        if (route === '/about') await page.screenshot({ path: `${output}/about-menu-${width}.png` })
        if (compact) {
          await key(page, 'Escape', 'Escape', 27)
          await delay(200)
          assert.ok(await page.eval("document.activeElement.matches('[data-menu-trigger]')"))
          assert.equal(await page.eval("document.querySelector('[data-navigation-panel]').matches(':popover-open')"), false)
        }
        assert.deepEqual(page.consoleErrors, [])
        results.push({ route, width, compact, links })
        console.log(`PASS ${route} at ${width}px: shared menu, current state, focus, reduced motion${compact ? ', menu/Escape' : ''}`)
      } finally { await page.close() }
    }
  }
  // App Router navigation should reuse chrome while updating active state.
  const page = await browser.newPage({ width: 1440, height: 1000, reducedMotion: true })
  try {
    await page.goto(new URL('/about', baseUrl).href)
    await page.eval("window.__publicHeader = document.querySelector('[data-site-header]'); document.querySelector('[data-primary-navigation] a[href=\"/doctors\"]').click()")
    let arrived = false
    for (let attempt = 0; attempt < 100; attempt++) {
      arrived = await page.eval("location.pathname === '/doctors' && Boolean(document.querySelector('[data-clinician-directory-template]'))")
      if (arrived) break
      await delay(100)
    }
    assert.ok(arrived, 'Client navigation reaches the directory')
    assert.ok(await page.eval("window.__publicHeader === document.querySelector('[data-site-header]')"), 'Header persists during client navigation')
    assert.equal(await page.eval("document.querySelector('[data-primary-navigation] [aria-current=page]').getAttribute('href')"), '/doctors')
    assert.deepEqual(page.consoleErrors, [])
    console.log('PASS client navigation: inherited header persists and current menu updates')
  } finally { await page.close() }
  await writeFile(`${output}/measurements.json`, JSON.stringify(results, null, 2))
})
