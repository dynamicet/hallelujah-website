import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

import { emergencyFixture, emergencyFixtureStates } from './lib/emergency-fixture.mjs'
import { emergencyPreviewDocument } from './lib/emergency-preview-server.mjs'
import { emergencyStyles, renderEmergency } from './lib/emergency-renderer.mjs'

let cases = 0

for (const state of emergencyFixtureStates) {
  const html = emergencyPreviewDocument(state)
  assert.equal((html.match(/<main\b/gu) ?? []).length, 1)
  assert.equal((html.match(/<h1\b/gu) ?? []).length, 1)
  assert.match(html, /<main id="main-content" tabindex="-1">/u)
  assert.match(html, /noindex,nofollow/u)
  assert.match(html, /synthetic-inert-b03-008/u)
  assert.match(html, /Controlled preview only/u)
  assert.match(html, /INVALID TEST VALUE/u)
  assert.match(html, /This page provides no emergency advice/u)
  assert.match(html, /No map, coordinates, geolocation, external link or provider request is enabled/u)
  assert.doesNotMatch(html, /href="(?:tel:|mailto:)|<iframe\b|<video\b|<img\b|<form\b|<input\b/u)
  assert.doesNotMatch(html, /\b(?:autoplay|aria-live|role="alert")\b/u)
  assert.equal((html.match(/data-inert-call-choice="true"/gu) ?? []).length, 2)
  assert.equal((html.match(/data-call-action="withheld"/gu) ?? []).length, 2)
  assert.equal((html.match(/data-experience-level="0"/gu) ?? []).length >= 2, true)
  assert.deepEqual(
    [...html.matchAll(/data-emergency-section="(E\d)"/gu)].map((match) => match[1]),
    ['E1', 'E2', 'E3', 'E4', 'E5', 'E6', 'E7', 'E8'],
  )
  const targets = new Set([...html.matchAll(/\bid="([^"]+)"/gu)].map((match) => match[1]))
  for (const match of html.matchAll(/\bhref="#([^"]+)"/gu)) {
    assert.ok(targets.has(match[1]), `No dead destination anchor: #${match[1]}`)
  }
  for (const match of html.matchAll(/\bhref="([^"]+)"/gu)) {
    assert.ok(match[1].startsWith('#') || match[1] === '/emergency.css')
  }
  cases++
}

for (const field of ['description', 'eyebrow', 'title', 'warning']) {
  const props = emergencyFixture()
  props[field] = '<script>emergency-hostile-copy</script>'
  const html = renderEmergency(props)
  assert.match(html, /&lt;script&gt;emergency-hostile-copy&lt;\/script&gt;/u)
  assert.doesNotMatch(html, /<script>emergency-hostile-copy/u)
  cases++
}

for (const [group, field] of [['hospitalChoice', 'displayValue'], ['publicChoice', 'purpose'],
  ['arrival', 'entrance'], ['scope', 'summary']]) {
  const props = emergencyFixture()
  props[group][field] = '<img src=x onerror=emergency-hostile-field>'
  assert.doesNotMatch(renderEmergency(props), /<img src=x/u)
  cases++
}

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
cases++

console.log(`Emergency contract passed: ${cases} controlled SSR, isolation, escaping, static-motion and token cases.`)
