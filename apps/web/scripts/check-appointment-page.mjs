import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { readFile } from 'node:fs/promises'

import { appointmentPageFixture, appointmentPageFixtureStates } from './lib/appointment-page-fixture.mjs'
import { appointmentPagePreviewDocument } from './lib/appointment-page-preview-server.mjs'
import { appointmentPageStyles, renderAppointmentPage } from './lib/appointment-page-renderer.mjs'

let cases = 0
for (const state of appointmentPageFixtureStates) {
  const html = appointmentPagePreviewDocument(state)
  const unavailable = state === 'workflow-unavailable'
  assert.equal((html.match(/<main\b/gu) ?? []).length, 1, state)
  assert.equal((html.match(/<h1\b/gu) ?? []).length, 1, state)
  assert.match(html, /<main id="main-content" tabindex="-1">/u, state)
  assert.match(html, /noindex,nofollow/u, state)
  assert.match(html, /synthetic-inert-b03-017/u, state)
  assert.match(html, new RegExp(`data-appointment-preview-state="${state}"`, 'u'), state)
  assert.doesNotMatch(html, /href="(?:tel:|mailto:|https?:)|<iframe\b|<video\b|<img\b/iu, state)
  assert.equal((html.match(/data-experience-level="0"/gu) ?? []).length >= 2, true, state)
  assert.match(html, /Patient Experience Team — synthetic recipient label/u, state)
  assert.match(html, /Approved Amharic appointment wording is unavailable/u, state)
  assert.doesNotMatch(html, /WhatsApp|Telegram|response within|we will call/iu, state)

  const sections = [...html.matchAll(/data-appointment-section="(A\d)"/gu)]
    .map((match) => match[1])
  assert.deepEqual(
    sections,
    unavailable ? ['A1', 'A2', 'A3', 'A7'] : ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7'],
    state,
  )

  const targets = new Set([...html.matchAll(/\bid="([^"]+)"/gu)].map((match) => match[1]))
  for (const match of html.matchAll(/\bhref="#([^"]+)"/gu)) {
    assert.ok(targets.has(match[1]), `${state}: no dead destination anchor #${match[1]}`)
  }

  if (unavailable) {
    assert.doesNotMatch(html, /<form\b|<input\b|<select\b/u, state)
    assert.match(html, /operating workflow is not approved/iu, state)
  } else {
    assert.equal((html.match(/<form\b/gu) ?? []).length, 1, state)
    assert.match(html, /action="\/controlled-appointment-submission-disabled"/u, state)
    assert.match(html, /No notes or medical information are collected/u, state)
    assert.doesNotMatch(html, /<textarea\b|name="(?:notes|diagnosis|symptoms|medical_history)"/iu, state)
    assert.equal((html.match(/name="care_route"/gu) ?? []).length, 3, state)
    assert.equal((html.match(/name="privacy_acknowledged"/gu) ?? []).length, 1, state)
    assert.match(html, /data-appointment-state-panel="receipt"[\s\S]*data-authoritative-acceptance="true"/u, state)
    assert.match(html, /data-appointment-state-panel="delivery-warning"[\s\S]*CONTROLLED-REQUEST-001/u, state)
  }

  if (state === 'validation') {
    assert.match(html, /id="appointment-error-summary"[^>]*role="alert"/u, state)
    assert.doesNotMatch(html, /id="appointment-error-summary"[^>]*hidden/u, state)
    assert.match(html, /<input(?=[^>]*id="phone")(?=[^>]*aria-invalid="true")[^>]*>/u, state)
    assert.match(html, /<input(?=[^>]*id="privacy-acknowledged")(?=[^>]*aria-invalid="true")[^>]*>/u, state)
    assert.match(html, /value="TEST PATIENT"/u, state)
  }
  if (state === 'receipt') {
    assert.match(html, /data-appointment-state="receipt"/u, state)
    assert.match(html, /database-authoritative acceptance response/iu, state)
    assert.match(html, /does not confirm a booking/iu, state)
  }
  if (state === 'delivery-warning') {
    assert.match(html, /notification delivery failed/iu, state)
    assert.match(html, /Do not resubmit/iu, state)
  }
  if (state === 'unknown') {
    assert.match(html, /outcome is not known/iu, state)
    assert.match(html, /Reconcile the original intent/iu, state)
  }
  cases++
}

for (const field of ['description', 'eyebrow', 'recipientLabel', 'title', 'warning']) {
  const props = appointmentPageFixture()
  props[field] = '<script>appointment-hostile-copy</script>'
  const html = renderAppointmentPage(props)
  assert.match(html, /&lt;script&gt;appointment-hostile-copy&lt;\/script&gt;/u, field)
  assert.doesNotMatch(html, /<script>appointment-hostile-copy/u, field)
  cases++
}

const hostileOptions = appointmentPageFixture()
hostileOptions.doctorOptions[1].label = '<img src=x onerror=appointment-hostile-option>'
assert.doesNotMatch(renderAppointmentPage(hostileOptions), /<img src=x/u)
cases++

assert.throws(() => appointmentPageFixture('invalid-state'), /Unsupported/u)
cases++

const source = await readFile(new URL('../src/design-system/templates/appointment-template.tsx', import.meta.url), 'utf8')
assert.doesNotMatch(source, /use client|process\.env|fetch\(|dangerouslySetInnerHTML|href=.*(?:tel:|mailto:)/u)
assert.match(source, /privacy_acknowledged/u)
assert.match(source, /data-appointment-form-controller/u)
assert.doesNotMatch(source, /appointment-preview\.js/u)
assert.equal(existsSync(new URL('../src/app/appointments', import.meta.url)), false)
assert.equal(existsSync(new URL('../public/appointment-preview.js', import.meta.url)), false)
cases++

const previewScript = await readFile(new URL('./fixtures/appointment-preview.js', import.meta.url), 'utf8')
assert.doesNotMatch(previewScript, /fetch\(|XMLHttpRequest|sendBeacon|WebSocket|localStorage|sessionStorage|document\.cookie/u)
assert.match(previewScript, /event\.preventDefault\(\)/u)
assert.match(previewScript, /summary\.focus\(\)/u)
assert.match(previewScript, /showPanel\('known-failure', true\)/u)
cases++

const css = appointmentPageStyles()
const declarations = new Set([...css.matchAll(/(--[\w-]+)\s*:/gu)].map((match) => match[1]))
for (const match of css.matchAll(/var\((--[\w-]+)\)/gu)) {
  assert.ok(declarations.has(match[1]), `Undefined token ${match[1]}`)
}
cases++

console.log(`Appointment page contract passed: ${cases} controlled SSR, state, isolation, escaping and token cases.`)
