import assert from 'node:assert/strict'

import { serviceDirectoryFixture, serviceDirectoryTime } from './lib/service-directory-fixture.mjs'
import { renderServiceDirectory, resolveServiceDirectory } from './lib/service-directory-renderer.mjs'

const { controlledServiceIndex, controlledServiceResolution } = await import('../src/content/service-view.ts')
const { serviceDirectoryUrl } = await import('../src/content/service-directory.ts')
const fixture = serviceDirectoryFixture()
const now = new Date(serviceDirectoryTime.getTime() + 60_000)
let cases = 0
const ids = (view) => view.groups.flatMap((group) => group.services.map((service) => service.publicId))

// Literal approved fixture vocabulary; spelling mistakes must not infer a care recommendation.
for (const [query, suffix] of [
  ['admission', '111111111111'], ['HEART', '151515151515'],
  ['  mobility   term  ', '171717171717'], ['communication term', '181818181818'],
  ['follow-up', '212121212121'],
]) {
  assert.deepEqual(ids(resolveServiceDirectory(fixture, new URLSearchParams({ q: query }))), [`pub_${suffix}`])
  cases++
}
for (const query of ['haert', 'unapproved diagnosis', 'retired synthetic term']) {
  assert.equal(resolveServiceDirectory(fixture, new URLSearchParams({ q: query })).resultCount, 0)
  cases++
}
const all = [1, 2, 3].flatMap((page) => ids(resolveServiceDirectory(fixture, new URLSearchParams({ page: String(page) }))))
assert.equal(all.length, 10)
assert.equal(new Set(all).size, 10)
const index = controlledServiceIndex(fixture.records, 'en', now, 'controlled-fixture')
assert.deepEqual([...all].sort(), index.map((view) => view.publicId).sort())
assert.equal(new Set(index.map((view) => view.canonicalPath)).size, 10)
for (const view of index) {
  assert.equal(controlledServiceResolution(fixture.records, view.publicId, 'en', now, 'controlled-fixture').canonicalPath, view.canonicalPath)
}
cases++

const allowed = fixture.filters.map((filter) => filter.value)
const url = serviceDirectoryUrl('/', { query: 'heart', groups: ['synthetic-medicine', 'synthetic-medicine', 'invalid'], page: 2 }, allowed)
assert.equal(url, '/?q=heart&group=synthetic-medicine&page=2')
const roundTrip = resolveServiceDirectory(fixture, new URL(url, 'http://127.0.0.1').searchParams)
assert.deepEqual(ids(roundTrip), ['pub_151515151515'])
assert.equal(roundTrip.state.page, 1)
assert.equal(serviceDirectoryUrl('/', { query: '', groups: [], page: 1 }, allowed), '/')
cases++

for (const key of ['reviewAt', 'expiresAt']) {
  const boundary = new Date(fixture.records[0][key])
  // Isolate this boundary from the other lifecycle deadline.
  const records = fixture.records.map((record) => ({ ...record, [key === 'reviewAt' ? 'expiresAt' : 'reviewAt']: '2027-01-01T00:00:00Z' }))
  assert.equal(resolveServiceDirectory({ ...fixture, records }, undefined, new Date(boundary.getTime() - 1)).resultCount, 10)
  assert.equal(resolveServiceDirectory({ ...fixture, records }, undefined, boundary).resultCount, 0)
  assert.equal(controlledServiceIndex(records, 'en', boundary, 'controlled-fixture').length, 0)
  cases++
}
for (const status of ['draft', 'review', 'withdrawn']) {
  const records = fixture.records.map((record) => record.publicId === 'pub_111111111111' ? { ...record, status } : record)
  const directory = resolveServiceDirectory({ ...fixture, records })
  assert.ok(!ids(directory).includes('pub_111111111111'), status)
  assert.ok(!controlledServiceIndex(records, 'en', now, 'controlled-fixture').some((view) => view.publicId === 'pub_111111111111'), status)
  cases++
}
// Duplicate canonical records fail closed rather than creating copied search/card entries.
assert.equal(resolveServiceDirectory({ ...fixture, records: [...fixture.records, fixture.records[0]] }).resultCount, 0)
cases++
const heart = resolveServiceDirectory(fixture, new URLSearchParams({ q: 'heart' }))
assert.equal(heart.resultCount, 1)
const html = renderServiceDirectory({ directory: heart })
assert.doesNotMatch(html, /Synthetic high-consequence statement|tests-treatments|href="[^"#]*services\//u)
assert.equal(index.find((view) => view.publicId === 'pub_151515151515').appointment.state, 'withheld')
cases++
for (const [query, expected] of [[' SYNTHETIC URGENT REVIEW ', true], ['synthetic urgent review phrase', false], ['urgent', false]]) {
  assert.equal(resolveServiceDirectory(fixture, new URLSearchParams({ q: query })).state.urgent, expected)
  cases++
}
console.log(`Service-directory validation passed: ${cases} navigational tasks, canonicality, URL, lifecycle, withholding and urgent-boundary cases.`)
