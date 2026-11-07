import assert from 'node:assert/strict'
import { mkdirSync, writeFileSync } from 'node:fs'
import { Browser, sleep } from '/home/befikadusata/.codex/skills/design-taste-frontend/scripts/lib/cdp.mjs'
const out = new URL('./verification/', import.meta.url).pathname
mkdirSync(out, { recursive: true })
const b = await Browser.launch({ extraArgs: ['--no-sandbox', '--disable-dev-shm-usage'] })
const p = await b.newPage()
const results = []
const go = route => p.goto('http://localhost:3000' + route, { settleMs: 600 })
const key = async (key, code = key, shift = false) => {
  const params = { key, code, modifiers: shift ? 8 : 0, windowsVirtualKeyCode: key === 'Tab' ? 9 : key === 'Enter' ? 13 : key === ' ' ? 32 : undefined }
  await p.send('Input.dispatchKeyEvent', { ...params, type: 'keyDown', text: key === 'Enter' ? '\r' : key === ' ' ? ' ' : undefined })
  await p.send('Input.dispatchKeyEvent', { ...params, type: 'keyUp' })
}
const input = async (selector, value) => {
  await p.eval(({ selector, value }) => {
    const el = document.querySelector(selector)
    const proto = el.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype
    Object.getOwnPropertyDescriptor(proto, 'value').set.call(el, value)
    el.dispatchEvent(new Event('input', { bubbles: true }))
    el.dispatchEvent(new Event('change', { bubbles: true }))
  }, { selector, value })
  await sleep(150)
}
const focusCheck = async (selector, label, width, mode) => {
  await sleep(350)
  const data = await p.eval(selector => {
    const el = document.querySelector(selector), r = el.getBoundingClientRect()
    return { focused: document.activeElement === el, top: r.top, bottom: r.bottom, height: innerHeight,
      headerHeight: document.querySelector('[data-site-header]').offsetHeight, step: document.querySelector('[data-journey-step][aria-current="step"]')?.dataset.journeyStep }
  }, selector)
  assert.ok(data.focused, `${label}: focus`)
  assert.ok(data.top >= data.headerHeight, `${label}: header clearance ${JSON.stringify(data)}`)
  assert.ok(data.bottom < data.height, `${label}: visible heading`)
  await p.screenshot({ path: `${out}${mode}-${width}-${label}.jpg` })
  results.push({ width, mode, label, ...data })
}
try {
  for (const mode of ['standard', 'reduced']) {
    await p.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: mode === 'reduced' ? 'reduce' : 'no-preference' }] })
    for (const width of [1440, 768, 390]) {
      await p.setViewport({ width, height: width === 768 ? 1024 : width === 390 ? 844 : 900, mobile: width === 390 })
      for (const route of (process.argv.includes('--stages') ? [] : ['/feedback', '/referrals', '/patients-visitors', '/services/synthetic-service-111111111111/', '/health-topics/diabetes'])) {
        await go(route)
        const entry = await p.eval(() => ({ route: location.pathname, width: innerWidth,
          overflow: document.documentElement.scrollWidth > innerWidth,
          firstTaskY: document.querySelector('main section[id]')?.getBoundingClientRect().top,
          fieldY: document.querySelector('#feedback-category')?.getBoundingClientRect().top,
          introImages: document.querySelectorAll('main img').length,
          action: [...document.querySelectorAll('main a')].find(a => a.classList.contains('solid-button'))?.textContent,
        }))
        assert.equal(entry.overflow, false)
        console.log(mode, width, route)
        const links = await p.eval(() => [...document.querySelectorAll('main a[href^="#"]')].map(a => a.getAttribute('href')))
        for (const href of [...new Set(links)]) {
          await p.eval(href => { document.querySelector(`main a[href="${href}"]`).focus() }, href)
          await sleep(1100)
          await key('Enter')
          await sleep(1600)
          const landing = await p.eval(href => { const el = document.querySelector(href); const r = el.getBoundingClientRect(); return { top: r.top, height: innerHeight, header: document.querySelector('[data-site-header]').offsetHeight, hash: location.hash, outline: getComputedStyle(document.activeElement).outlineStyle } }, href)
          assert.equal(landing.hash, href)
          assert.ok(landing.top >= landing.header - 2 && landing.top < landing.height - 40, `${route} ${href}: anchor landing ${JSON.stringify(landing)}`)
        }
        if (route === '/patients-visitors') {
          await p.eval(() => document.querySelector('#visit-check-0').focus())
          await key(' ', 'Space')
          assert.equal(await p.eval(() => document.querySelector('#visit-check-0').checked), true)
          await key('Tab'); await key('Tab', 'Tab', true)
          assert.equal(await p.eval(() => document.activeElement.id), 'visit-check-0')
        }
        if (route === '/feedback') {
          await input('#feedback-message', 'Sample layout review')
          await p.eval(() => document.querySelector('form button[type="submit"]').focus())
          await key('Enter'); await sleep(200)
          assert.equal(await p.eval(() => document.activeElement.getAttribute('aria-labelledby')), 'feedback-review-title')
          await p.eval(() => [...document.querySelectorAll('button')].find(b => b.textContent === 'Edit message').click())
          await sleep(200)
          assert.equal(await p.eval(() => document.activeElement.id), 'feedback-message')
          assert.equal(await p.eval(() => document.querySelector('#feedback-message').value), 'Sample layout review')
          await p.eval(() => document.querySelector('form button[type="submit"]').click()); await sleep(150)
          await p.eval(() => [...document.querySelectorAll('button')].find(b => b.textContent === 'Clear & start again').click()); await sleep(150)
          assert.equal(await p.eval(() => document.querySelector('#feedback-message').value), '')
        }
        results.push({ mode, ...entry, anchorCount: new Set(links).size, interactions: 'passed' })
      }
      await go('/appointment')
      assert.equal(await p.eval(() => document.querySelector('[data-journey-progress]').hidden), false)
      const initial = await p.eval(() => ({ firstTaskY: document.querySelector('[data-journey-title]').getBoundingClientRect().top, formY: document.querySelector('#appointment-request-form').getBoundingClientRect().top, imageY: document.querySelector('main figure').getBoundingClientRect().top, imageLoaded: document.querySelector('main figure img').naturalWidth > 0 }))
      assert.equal(initial.imageLoaded, true)
      if (width === 390) assert.ok(initial.formY < initial.imageY)
      await p.eval(() => document.querySelector('[data-journey-next]').focus())
      await key('Enter')
      await focusCheck('[data-journey-title]', 'details', width, mode)
      await input('#full-name', 'TEST PATIENT'); await input('#phone', '+0 000 000 0000')
      await p.eval(() => document.querySelector('#privacy-acknowledged').focus()); await key(' ', 'Space')
      await p.eval(() => document.querySelector('[data-journey-next]').focus()); await key('Enter')
      await focusCheck('#appointment-submit-title', 'review', width, mode)
      await p.eval(() => document.querySelector('[data-journey-back]').focus()); await key('Enter')
      await focusCheck('[data-journey-title]', 'back-details', width, mode)
      assert.equal(await p.eval(() => document.querySelector('#full-name').value), 'TEST PATIENT')
      await p.eval(() => document.querySelector('[data-journey-step="0"]').focus()); await key('Enter')
      await focusCheck('[data-journey-title]', 'back-care', width, mode)
      // A required doctor choice must still produce a reachable error summary.
      await p.eval(() => document.querySelector('input[name="care_route"][value="doctor"]').click())
      await p.eval(() => document.querySelector('[data-journey-next]').focus()); await key('Enter'); await sleep(200)
      assert.equal(await p.eval(() => document.activeElement.id), 'appointment-error-summary')
      results.push({ width, mode, appointmentEntry: initial, stageKeyboardAndValidation: 'passed', submitted: false })
      if (mode === 'reduced') assert.equal(await p.eval(() => document.getAnimations().filter(a => a.playState === 'running').length), 0)
    }
  }
  await p.send('Emulation.setScriptExecutionDisabled', { value: true })
  for (const route of ['/feedback', '/referrals', '/patients-visitors', '/services/synthetic-service-111111111111/', '/health-topics/diabetes', '/appointment']) {
    await go(route)
    const fallback = await p.eval(() => ({ route: location.pathname, h1: document.querySelector('h1')?.textContent, noScript: [...document.querySelectorAll('noscript')].map(n => n.textContent), overflow: document.documentElement.scrollWidth > innerWidth }))
    assert.ok(fallback.h1); assert.equal(fallback.overflow, false)
    if (route === '/feedback' || route === '/appointment') assert.ok(fallback.noScript.some(t => t.includes('JavaScript')))
    results.push({ mode: 'no-javascript', ...fallback })
  }
  writeFileSync(`${out}${process.argv.includes('--stages') ? 'stages' : 'results'}.json`, JSON.stringify(results, null, 2) + '\n')
  console.log(`Passed ${results.length} task-page, stage-focus and fallback records; no request submitted.`)
} finally { writeFileSync(`${out}${process.argv.includes('--stages') ? 'stages' : 'results'}.json`, JSON.stringify(results, null, 2) + '\n'); await b.close() }
