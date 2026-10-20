import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { readFile, readdir } from 'node:fs/promises'

import {
  emergencyFixture,
  emergencyFixtureStates,
  emergencySourceFixture,
  resolveEmergencyFixture,
} from './lib/emergency-fixture.mjs'
import { emergencyPreviewDocument } from './lib/emergency-preview-server.mjs'
import { emergencyStyles, renderEmergency } from './lib/emergency-renderer.mjs'

const failClosedStates = new Set([
  'required-arrival-unavailable',
  'required-content-expired',
  'required-content-withheld',
])
const handoffStates = new Set([
  'call-handoff-unsupported',
  'call-handoff-unsupported-injected',
])
let cases = 0

for (const state of emergencyFixtureStates) {
  const html = emergencyPreviewDocument(state)
  const failClosed = failClosedStates.has(state)
  assert.equal((html.match(/<main\b/gu) ?? []).length, 1, state)
  assert.equal((html.match(/<h1\b/gu) ?? []).length, 1, state)
  assert.match(html, /<main id="main-content" tabindex="-1">/u, state)
  assert.match(html, /noindex,nofollow/u, state)
  assert.match(html, /synthetic-inert-b03-009/u, state)
  assert.match(html, new RegExp(`data-emergency-preview-state="${state}"`, 'u'), state)
  assert.doesNotMatch(html, /href="(?:tel:|mailto:|https?:)|<iframe\b|<video\b|<img\b|<form\b|<input\b/iu, state)
  assert.equal((html.match(/data-experience-level="0"/gu) ?? []).length >= 2, true, state)

  const expectedSections = failClosed
    ? ['E1', 'E8']
    : ['E1', 'E2', 'E3', 'E4', 'E5', 'E6', 'E7', 'E8']
  assert.deepEqual(
    [...html.matchAll(/data-emergency-section="(E\d)"/gu)].map((match) => match[1]),
    expectedSections,
    state,
  )
  const targets = new Set([...html.matchAll(/\bid="([^"]+)"/gu)].map((match) => match[1]))
  for (const match of html.matchAll(/\bhref="#([^"]+)"/gu)) {
    assert.ok(targets.has(match[1]), `${state}: no dead destination anchor #${match[1]}`)
  }
  for (const match of html.matchAll(/\bhref="([^"]+)"/gu)) {
    assert.ok(match[1].startsWith('#') || match[1] === '/emergency.css', state)
  }

  if (failClosed) {
    assert.match(html, /Emergency contact and arrival information is unavailable/u, state)
    assert.match(html, /Contact information/u, state)
    assert.doesNotMatch(html, /INVALID TEST VALUE|Synthetic Emergency Entrance|How the routes differ/u, state)
    assert.equal((html.match(/data-inert-call-choice="true"/gu) ?? []).length, 0, state)
    assert.equal((html.match(/data-call-action=/gu) ?? []).length, 0, state)
  } else {
    assert.doesNotMatch(html, />\s*Controlled preview only/u, state)
    assert.match(html, /INVALID TEST VALUE/u, state)
    assert.match(html, /Do not use the contact or arrival details on this page for emergency care/u, state)
    assert.match(html, /Map unavailable/u, state)
    assert.equal((html.match(/data-inert-call-choice="true"/gu) ?? []).length, 2, state)
    assert.equal((html.match(/data-call-action=/gu) ?? []).length, 2, state)
  }

  if (handoffStates.has(state)) {
    assert.equal((html.match(/data-call-action="unsupported"/gu) ?? []).length, 2, state)
    assert.match(html, /does not claim a call or service failed/u, state)
  }
  if (state === 'call-handoff-unsupported-injected') {
    assert.equal((html.match(/data-state-announcement="pending-injection"/gu) ?? []).length, 1, state)
    assert.match(html, /<script src="\/emergency-state-announcement\.js"><\/script>/u, state)
  }
  assert.doesNotMatch(html, /\b(?:aria-live|aria-atomic|role="alert"|role="status")=/u, state)
  if (state === 'required-content-expired') {
    assert.match(html, /data-emergency-state="expired"/u, state)
    assert.match(html, /data-emergency-state-reason="required-content-expired"/u, state)
    assert.doesNotMatch(html, /unsupported|map failed/iu, state)
  }
  if (state === 'required-arrival-unavailable') {
    assert.match(html, /No map or generic direction substitutes/u, state)
  }
  if (state === 'optional-map-failed' || state === 'optional-map-blocked') {
    assert.match(html, /Directions[\s\S]*data-map-state=/u, state)
    assert.match(html, /Complete text directions/u, state)
  }
  cases++
}

for (const field of ['description', 'eyebrow', 'title', 'warning']) {
  const record = emergencySourceFixture()
  record[field] = '<script>emergency-hostile-copy</script>'
  const html = renderEmergency(resolveEmergencyFixture(record))
  assert.match(html, /&lt;script&gt;emergency-hostile-copy&lt;\/script&gt;/u)
  assert.doesNotMatch(html, /<script>emergency-hostile-copy/u)
  cases++
}

for (const [group, field] of [
  ['hospitalChoice', 'displayValue'],
  ['publicChoice', 'purpose'],
  ['arrival', 'entrance'],
  ['scope', 'summary'],
]) {
  const record = emergencySourceFixture()
  record[group][field] = '<img src=x onerror=emergency-hostile-field>'
  assert.doesNotMatch(renderEmergency(resolveEmergencyFixture(record)), /<img src=x/u)
  cases++
}

const requiredPaths = [
  'arrival.accessibleEntrance',
  'arrival.address',
  'arrival.entrance',
  'arrival.parking',
  'arrival.publicTransport',
  'arrival.steps',
  'description',
  'eyebrow',
  'hospitalChoice.audience',
  'hospitalChoice.displayValue',
  'hospitalChoice.hours',
  'hospitalChoice.label',
  'hospitalChoice.limitations',
  'hospitalChoice.purpose',
  'publicChoice.audience',
  'publicChoice.displayValue',
  'publicChoice.hours',
  'publicChoice.label',
  'publicChoice.limitations',
  'publicChoice.purpose',
  'scope.availability',
  'scope.limitations',
  'scope.owner',
  'scope.reviewedLabel',
  'scope.reviewedOn',
  'scope.summary',
  'support',
  'title',
  'warning',
]
for (const path of requiredPaths) {
  const record = emergencySourceFixture()
  const keys = path.split('.')
  const target = keys.slice(0, -1).reduce((current, key) => current[key], record)
  target[keys.at(-1)] = keys.at(-1) === 'steps' ? [] : '   '
  const resolved = resolveEmergencyFixture(record, { handoff: 'unsupported', map: 'failed' })
  const html = renderEmergency(resolved)
  assert.equal(resolved.state.kind, 'unavailable', path)
  assert.doesNotMatch(html, /INVALID TEST VALUE|Synthetic Emergency Entrance|data-call-action=/u, path)
  cases++
}

const precedenceRecord = emergencySourceFixture()
precedenceRecord.approval = 'withheld'
precedenceRecord.arrival.entrance = ''
precedenceRecord.lifecycle.expiresOn = '2026-09-22T12:00:00+03:00'
const precedence = resolveEmergencyFixture(precedenceRecord, { handoff: 'unsupported', map: 'failed' })
assert.equal(precedence.state.kind, 'expired')
assert.equal(precedence.state.reason, 'required-content-expired')
assert.doesNotMatch(renderEmergency(precedence), /INVALID TEST VALUE|data-call-action=|map failed/iu)
cases++

const staleRecord = emergencySourceFixture()
staleRecord.approval = 'withheld'
staleRecord.hospitalChoice.displayValue = 'STALE-CONTACT-SENTINEL'
staleRecord.publicChoice.purpose = 'STALE-DISTINCTION-SENTINEL'
staleRecord.scope.summary = 'STALE-SCOPE-SENTINEL'
staleRecord.arrival.address = 'STALE-ARRIVAL-SENTINEL'
const staleHtml = renderEmergency(resolveEmergencyFixture(staleRecord))
assert.doesNotMatch(staleHtml, /STALE-(?:CONTACT|DISTINCTION|SCOPE|ARRIVAL)-SENTINEL/u)
cases++

assert.throws(() => emergencyFixture('unknown'), /Unsupported/u)
cases++

const source = await readFile(new URL('../src/design-system/templates/emergency-template.tsx', import.meta.url), 'utf8')
assert.doesNotMatch(source, /use client|process\.env|fetch\(|dangerouslySetInnerHTML|href=.*tel:/u)
assert.match(source, /data-experience-level="0"/u)
cases++

const css = emergencyStyles()
const declarations = new Set([...css.matchAll(/(--[\w-]+)\s*:/gu)].map((match) => match[1]))
for (const match of css.matchAll(/var\((--[\w-]+)\)/gu)) {
  assert.ok(declarations.has(match[1]), `Undefined token ${match[1]}`)
}
const emergencyCssSource = await readFile(new URL('../src/design-system/templates/emergency-template.module.css', import.meta.url), 'utf8')
assert.doesNotMatch(emergencyCssSource, /@keyframes|animation\s*:|transition\s*:/u)
assert.doesNotMatch(emergencyCssSource, /(?:#[\da-f]{3,8}\b|\brgba?\()/iu)
cases++

const appRoot = new URL('../src/app/', import.meta.url)
assert.equal(existsSync(new URL('emergency/', appRoot)), false, 'Deployable /emergency route must remain absent')
const appSources = await collectSources(appRoot)
for (const file of appSources) {
  const content = await readFile(file, 'utf8')
  assert.doesNotMatch(content, /emergency-(?:fixture|renderer|preview-server)/u, file.pathname)
}
cases++

console.log(`Emergency contract passed: ${cases} fail-closed lifecycle, controlled SSR, isolation, escaping, announcement, static-motion and token cases.`)

async function collectSources(directory) {
  const files = []
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const child = new URL(`${entry.name}${entry.isDirectory() ? '/' : ''}`, directory)
    if (entry.isDirectory()) files.push(...await collectSources(child))
    else if (/\.(?:ts|tsx)$/u.test(entry.name)) files.push(child)
  }
  return files
}
