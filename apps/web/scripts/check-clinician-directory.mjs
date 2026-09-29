import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { readFile, readdir } from 'node:fs/promises'

import {
  clinicianDirectoryFixture,
  clinicianDirectoryFixtureStates,
} from './lib/clinician-directory-fixture.mjs'
import {
  clinicianDirectoryStyles,
  renderClinicianDirectory,
  resolveClinicianDirectory,
} from './lib/clinician-directory-renderer.mjs'
import { clinicianDirectoryPreviewDocument, createClinicianDirectoryPreviewServer } from './lib/clinician-directory-preview-server.mjs'

let cases = 0
const fixture = clinicianDirectoryFixture()

const initial = resolveClinicianDirectory(fixture)
assert.equal(initial.resultCount, 9)
assert.equal(initial.results.length, 4)
assert.equal(initial.pageCount, 3)
assert.equal(initial.results.some((record) => record.details.name.includes('Retired')), false)
assert.deepEqual(initial.results.map((record) => record.details.name), [...initial.results.map((record) => record.details.name)].sort())
cases++

const searched = resolveClinicianDirectory(fixture, new URLSearchParams({ q: '  ASTER\u0000  ' }))
assert.equal(searched.state.query, 'ASTER')
assert.equal(searched.resultCount, 1)
assert.match(searched.results[0].details.name, /Aster/u)
cases++

const filtered = resolveClinicianDirectory(fixture, new URLSearchParams('type=synthetic-child&page=2'))
assert.deepEqual(filtered.state.filters, ['synthetic-child'])
assert.equal(filtered.resultCount, 3)
assert.equal(filtered.state.page, 1)
assert.ok(filtered.results.every((record) => record.details.specialties.includes('Synthetic child care')))
cases++

const paged = resolveClinicianDirectory(fixture, new URLSearchParams('page=3'))
assert.equal(paged.state.page, 3)
assert.equal(paged.results.length, 1)
cases++

const bounded = resolveClinicianDirectory(fixture, new URLSearchParams({
  page: '9999999999999999999999999',
  q: 'x'.repeat(500),
  type: 'not-approved',
}))
assert.equal(bounded.state.query.length, 80)
assert.equal(bounded.state.page, 1)
assert.deepEqual(bounded.state.filters, [])
cases++

for (const state of clinicianDirectoryFixtureStates) {
  const html = clinicianDirectoryPreviewDocument(state)
  const unavailable = ['failure', 'offline', 'empty'].includes(state)
  assert.equal((html.match(/<main\b/gu) ?? []).length, 1, state)
  assert.equal((html.match(/<h1\b/gu) ?? []).length, 1, state)
  assert.match(html, /<main id="main-content" tabindex="-1">/u, state)
  assert.match(html, /noindex,nofollow/u, state)
  assert.match(html, /synthetic-inert-b04-007/u, state)
  assert.match(html, /Controlled preview only/u, state)
  assert.match(html, /Approved Amharic directory wording is unavailable/u, state)
  assert.doesNotMatch(html, /href="(?:tel:|mailto:|https?:)|<iframe\b|<video\b|<img\b|<textarea\b/iu, state)
  assert.doesNotMatch(html, /book now|available today|accepting patients/iu, state)
  assert.equal((html.match(/data-site-header/gu) ?? []).length, 1, state)
  assert.deepEqual([...html.matchAll(/data-directory-section="(D\d)"/gu)].map((match) => match[1]),
    unavailable ? ['D1', 'D2', 'D3', 'D5', 'D6'] : ['D1', 'D2', 'D3', 'D4', 'D6'], state)
  assert.equal((html.match(/<form\b/gu) ?? []).length, 1, state)
  assert.match(html, /method="get"/u, state)
  if (unavailable) assert.equal((html.match(/data-clinician-public-id/gu) ?? []).length, 0, state)
  else assert.equal((html.match(/data-clinician-public-id/gu) ?? []).length, 4, state)
  cases++
}

const noMatchHtml = clinicianDirectoryPreviewDocument('controlled', new URLSearchParams({ q: 'no synthetic match' }))
assert.match(noMatchHtml, /No synthetic clinicians match/u)
assert.equal((noMatchHtml.match(/data-clinician-public-id/gu) ?? []).length, 0)
assert.deepEqual([...noMatchHtml.matchAll(/data-directory-section="(D\d)"/gu)].map((match) => match[1]),
  ['D1', 'D2', 'D3', 'D5', 'D6'])
cases++

const hostileDirectory = {
  ...initial,
  results: [{ ...initial.results[0], details: { ...initial.results[0].details,
    name: '<script>directory-hostile</script>', specialties: ['<img src=x onerror=hostile>'] } }],
}
const escaped = renderClinicianDirectory({ directory: hostileDirectory, pathname: '/', state: 'ready' })
assert.match(escaped, /&lt;script&gt;directory-hostile&lt;\/script&gt;/u)
assert.doesNotMatch(escaped, /<script>directory-hostile|<img src=x/u)
cases++

const css = clinicianDirectoryStyles()
const declarations = new Set([...css.matchAll(/(--[\w-]+)\s*:/gu)].map((match) => match[1]))
for (const match of css.matchAll(/var\((--[\w-]+)\)/gu)) {
  assert.ok(declarations.has(match[1]), `Undefined token ${match[1]}`)
}
const templateCss = await readFile(new URL('../src/design-system/templates/clinician-directory-template.module.css', import.meta.url), 'utf8')
assert.doesNotMatch(templateCss, /(?:#[\da-f]{3,8}\b|\brgba?\()/iu)
assert.doesNotMatch(templateCss, /@keyframes|animation\s*:/u)
cases++

const appRoot = new URL('../src/app/', import.meta.url)
assert.equal(existsSync(new URL('doctors/', appRoot)), false, 'Deployable /doctors route must remain absent')
const appSources = await collectSources(appRoot)
for (const file of appSources) {
  const content = await readFile(file, 'utf8')
  assert.doesNotMatch(content, /clinician-directory-(?:fixture|renderer|preview-server)/u, file.pathname)
}
cases++

const server = await createClinicianDirectoryPreviewServer()
try {
  const response = await fetch(`${server.origin}/?q=Aster&type=synthetic-family`)
  assert.equal(response.status, 200)
  assert.equal(response.headers.get('x-robots-tag'), 'noindex, nofollow, noarchive')
  assert.equal(response.headers.get('referrer-policy'), 'no-referrer')
  assert.match(response.headers.get('content-security-policy') ?? '', /connect-src 'none'/u)
  assert.match(response.headers.get('content-security-policy') ?? '', /form-action 'self'/u)
  assert.match(await response.text(), /Dr Synthetic Aster/u)
  assert.equal((await fetch(`${server.origin}/?unexpected=value`)).status, 400)
  assert.equal((await fetch(server.origin, { method: 'POST' })).status, 405)
  assert.equal((await fetch(`${server.origin}/missing`)).status, 404)
  cases += 4
} finally {
  await server.close()
}

console.log(`Clinician-directory contract passed: ${cases} projection, query, SSR, isolation, escaping, lifecycle and header cases.`)

async function collectSources(directory) {
  const files = []
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const child = new URL(`${entry.name}${entry.isDirectory() ? '/' : ''}`, directory)
    if (entry.isDirectory()) files.push(...await collectSources(child))
    else if (/\.(?:ts|tsx)$/u.test(entry.name)) files.push(child)
  }
  return files
}
