import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { homeFixture, homeFixtureStates } from './lib/home-fixture.mjs'
import { homePreviewDocument } from './lib/home-preview-server.mjs'
import { homeStyles, renderHome } from './lib/home-renderer.mjs'

let cases = 0
for (const state of homeFixtureStates) {
  const html = homePreviewDocument(state)
  assert.equal((html.match(/<main\b/gu) ?? []).length, 1)
  assert.equal((html.match(/<h1\b/gu) ?? []).length, 1)
  assert.match(html, /<main id="main-content" tabindex="-1">/u)
  assert.match(html, /noindex,nofollow/u)
  const targets = new Set([...html.matchAll(/\bid="([^"]+)"/gu)].map((match) => match[1]))
  for (const match of html.matchAll(/\bhref="#([^"]+)"/gu)) assert.ok(targets.has(match[1]), 'No dead destination anchors')
  assert.equal((html.match(/data-primary-navigation=/gu) ?? []).length, 1)
  assert.ok(!/<(?:form|input|iframe)\b|href="(?:tel:|mailto:)|https?:\/\//u.test(html))
  assert.ok(!/autoplay|<source\b|<video\b[^>]*\bsrc=/u.test(html))
  assert.ok(!/data-home-section="H[4567]"/u.test(html), 'Unapproved record modules must be omitted')
  const sectionIds = [...html.matchAll(/data-home-section="(H\d)"/gu)].map((match) => match[1])
  assert.deepEqual(sectionIds, state === 'story' ? ['H1', 'H2', 'H3', 'H8'] : ['H1', 'H2', 'H3'])
  assert.equal(html.includes('<video'), ['hero', 'story', 'media-failure'].includes(state))
  assert.match(html, /Online appointment requests are unavailable/u)
  assert.match(html, /Hospital telephone contacts are withheld/u)
  assert.match(html, /An approved Amharic Home page is not available/u)
  cases++
}
for (const field of ['title', 'description', 'eyebrow', 'tasksHeading', 'searchHeading', 'searchDescription']) {
  const props = homeFixture()
  props[field] = '<script>home-hostile-copy</script>'
  const html = renderHome(props)
  assert.ok(html.includes('&lt;script&gt;home-hostile-copy&lt;/script&gt;'))
  assert.ok(!html.includes('<script>home-hostile-copy'))
  cases++
}
const hostile = homeFixture()
hostile.tasks.doctor.label = '<img src=x onerror=home-hostile-label>'
assert.ok(!renderHome(hostile).includes('<img src=x'))
cases++
assert.throws(() => homeFixture('unknown'), /Unsupported/u)
cases++
const source = await readFile(new URL('../src/design-system/templates/home-template.tsx', import.meta.url), 'utf8')
assert.ok(!/use client|process\.env|fetch\(|dangerouslySetInnerHTML/u.test(source))
assert.ok(!/<ExperienceRegion[^>]*>[\s\S]*<EmergencyAction/u.test(source), 'Safety cannot inherit expressive choreography')
const css = homeStyles()
const declarations = new Set([...css.matchAll(/(--[\w-]+)\s*:/gu)].map((match) => match[1]))
for (const match of css.matchAll(/var\((--[\w-]+)\)/gu)) assert.ok(declarations.has(match[1]), `Undefined token ${match[1]}`)
cases++
console.log(`Home contract passed: ${cases} controlled SSR, omission, safety, escaping and token cases.`)
