import assert from 'node:assert/strict'
import { readFile, readdir } from 'node:fs/promises'

import {
  serviceDirectoryFixture,
  serviceDirectoryFixtureStates,
} from './lib/service-directory-fixture.mjs'
import {
  renderServiceDirectory,
  resolveServiceDirectory,
  serviceDirectoryStyles,
} from './lib/service-directory-renderer.mjs'
import {
  createServiceDirectoryPreviewServer,
  serviceDirectoryPreviewDocument,
} from './lib/service-directory-preview-server.mjs'

let cases = 0
const fixture = serviceDirectoryFixture()

const initial = resolveServiceDirectory(fixture)
assert.equal(initial.resultCount, 10)
assert.equal(initial.groups.flatMap((group) => group.services).length, 4)
assert.equal(initial.pageCount, 3)
assert.equal(initial.groups.some((group) => group.services.some((service) => service.name.includes('Retired'))), false)
assert.deepEqual(initial.groups.map((group) => group.name), [...initial.groups.map((group) => group.name)].sort())
cases++

const searched = resolveServiceDirectory(fixture, new URLSearchParams({ q: '  HEART\u0000  ' }))
assert.equal(searched.state.query, 'HEART')
assert.equal(searched.resultCount, 1)
assert.match(searched.groups[0].services[0].name, /heart/u)
cases++

const synonym = resolveServiceDirectory(fixture, new URLSearchParams({ q: 'mobility term' }))
assert.equal(synonym.resultCount, 1)
assert.match(synonym.groups[0].services[0].name, /rehabilitation/u)
cases++

const filtered = resolveServiceDirectory(fixture, new URLSearchParams('group=synthetic-access&page=2'))
assert.deepEqual(filtered.state.groups, ['synthetic-access'])
assert.equal(filtered.resultCount, 3)
assert.equal(filtered.state.page, 1)
assert.ok(filtered.groups.every((group) => group.name.includes('access')))
cases++

const paged = resolveServiceDirectory(fixture, new URLSearchParams('page=3'))
assert.equal(paged.state.page, 3)
assert.equal(paged.groups.flatMap((group) => group.services).length, 2)
cases++

const urgent = resolveServiceDirectory(fixture, new URLSearchParams({ q: 'synthetic urgent review' }))
assert.equal(urgent.state.urgent, true)
assert.equal(urgent.resultCount, 0)
assert.equal(resolveServiceDirectory(fixture, new URLSearchParams({ q: 'synthetic urgent review phrase' })).state.urgent, false)
cases++

const bounded = resolveServiceDirectory(fixture, new URLSearchParams({
  group: 'not-approved',
  page: '9999999999999999999999999',
  q: 'x'.repeat(500),
}))
assert.equal(bounded.state.query.length, 80)
assert.equal(bounded.state.page, 1)
assert.deepEqual(bounded.state.groups, [])
cases++

for (const state of serviceDirectoryFixtureStates) {
  const html = serviceDirectoryPreviewDocument(state)
  const unavailable = ['failure', 'offline', 'empty'].includes(state)
  const loading = state === 'loading'
  assert.equal((html.match(/<main\b/gu) ?? []).length, 1, state)
  assert.equal((html.match(/<h1\b/gu) ?? []).length, 1, state)
  assert.match(html, /<main id="main-content" tabindex="-1">/u, state)
  assert.match(html, /noindex,nofollow/u, state)
  assert.match(html, /synthetic-inert-b04-011/u, state)
  assert.doesNotMatch(html, />\s*Controlled preview only/u, state)
  assert.match(html, /This page is unavailable in Amharic/u, state)
  assert.doesNotMatch(html, /href="(?:tel:|mailto:|https?:)|<iframe\b|<video\b|<img\b|<textarea\b/iu, state)
  assert.doesNotMatch(html, /book now|available today|recommended treatment|you have/iu, state)
  assert.doesNotMatch(html, /Synthetic high-consequence statement that must never render/u, state)
  assert.equal((html.match(/data-site-header/gu) ?? []).length, 1, state)
  assert.deepEqual([...html.matchAll(/data-directory-section="(S\d)"/gu)].map((match) => match[1]),
    unavailable ? ['S1', 'S3', 'S4', 'S6', 'S7']
      : loading ? ['S1', 'S3', 'S4', 'S5', 'S7'] : ['S1', 'S3', 'S4', 'S5', 'S7'], state)
  assert.equal((html.match(/<form\b/gu) ?? []).length, 1, state)
  // Next Form uses the browser's implicit GET method in its native fallback.
  assert.equal(html.match(/<form\b[^>]*>/u)?.[0].match(/\bmethod="([^"]*)"/u)?.[1] ?? 'get', 'get', state)
  if (unavailable || loading) assert.equal((html.match(/data-service-public-id/gu) ?? []).length, 0, state)
  else assert.equal((html.match(/data-service-public-id/gu) ?? []).length, 4, state)
  cases++
}

const noMatchHtml = serviceDirectoryPreviewDocument('controlled', new URLSearchParams({ q: 'no synthetic match' }))
assert.match(noMatchHtml, /No services match/u)
assert.equal((noMatchHtml.match(/data-service-public-id/gu) ?? []).length, 0)
assert.deepEqual([...noMatchHtml.matchAll(/data-directory-section="(S\d)"/gu)].map((match) => match[1]),
  ['S1', 'S3', 'S4', 'S6', 'S7'])
cases++

const urgentHtml = serviceDirectoryPreviewDocument('controlled', new URLSearchParams({ q: 'synthetic urgent review' }))
assert.match(urgentHtml, /Emergency information/u)
assert.match(urgentHtml, /does not assess medical urgency/u)
assert.deepEqual([...urgentHtml.matchAll(/data-directory-section="(S\d)"/gu)].map((match) => match[1]),
  ['S1', 'S2', 'S3', 'S4', 'S6', 'S7'])
cases++

const hostileDirectory = {
  ...initial,
  groups: [{ ...initial.groups[0], name: '<script>group-hostile</script>', services: [{
    ...initial.groups[0].services[0],
    name: '<img src=x onerror=hostile>',
    sections: { scope: ['<script>scope-hostile</script>'] },
  }] }],
}
const escaped = renderServiceDirectory({ directory: hostileDirectory, pathname: '/', state: 'ready' })
assert.match(escaped, /&lt;script&gt;group-hostile&lt;\/script&gt;/u)
assert.match(escaped, /&lt;img src=x onerror=hostile&gt;/u)
assert.doesNotMatch(escaped, /<script>group-hostile|<img src=x/u)
cases++

const css = serviceDirectoryStyles()
const declarations = new Set([...css.matchAll(/(--[\w-]+)\s*:/gu)].map((match) => match[1]))
for (const match of css.matchAll(/var\((--[\w-]+)\)/gu)) {
  assert.ok(declarations.has(match[1]), `Undefined token ${match[1]}`)
}
const templateCss = await readFile(new URL('../src/design-system/templates/service-directory-template.module.css', import.meta.url), 'utf8')
assert.doesNotMatch(templateCss, /(?:#[\da-f]{3,8}\b|\brgba?\()/iu)
assert.doesNotMatch(templateCss, /@keyframes|animation\s*:/u)
cases++

const appRoot = new URL('../src/app/', import.meta.url)
assert.match(await readFile(new URL('services/page.tsx', appRoot), 'utf8'), /requireLocalDemo\(\)/u)
const appSources = await collectSources(appRoot)
for (const file of appSources) {
  const content = await readFile(file, 'utf8')
  assert.doesNotMatch(content, /service-directory-(?:fixture|renderer|preview-server)/u, file.pathname)
}
cases++

const server = await createServiceDirectoryPreviewServer()
try {
  const response = await fetch(`${server.origin}/?q=heart&group=synthetic-medicine`)
  assert.equal(response.status, 200)
  assert.equal(response.headers.get('x-robots-tag'), 'noindex, nofollow, noarchive')
  assert.equal(response.headers.get('referrer-policy'), 'no-referrer')
  assert.match(response.headers.get('content-security-policy') ?? '', /connect-src 'none'/u)
  assert.match(response.headers.get('content-security-policy') ?? '', /form-action 'self'/u)
  assert.match(await response.text(), /Synthetic heart medicine/u)
  assert.equal((await fetch(`${server.origin}/?unexpected=value`)).status, 400)
  assert.equal((await fetch(server.origin, { method: 'POST' })).status, 405)
  assert.equal((await fetch(`${server.origin}/missing`)).status, 404)
  cases += 4
} finally {
  await server.close()
}

console.log(`Service-directory contract passed: ${cases} projection, query, SSR, safety, isolation, escaping, lifecycle and header cases.`)

async function collectSources(directory) {
  const files = []
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const child = new URL(`${entry.name}${entry.isDirectory() ? '/' : ''}`, directory)
    if (entry.isDirectory()) files.push(...await collectSources(child))
    else if (/\.(?:ts|tsx)$/u.test(entry.name)) files.push(child)
  }
  return files
}
