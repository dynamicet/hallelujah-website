import assert from 'node:assert/strict'

import {
  clinicianDirectoryFilters,
  clinicianDirectoryFixture,
  clinicianDirectoryTime,
} from './lib/clinician-directory-fixture.mjs'
import {
  renderClinicianDirectory,
  resolveClinicianDirectory,
} from './lib/clinician-directory-renderer.mjs'
import {
  clinicianDirectoryPreviewDocument,
  createClinicianDirectoryPreviewServer,
} from './lib/clinician-directory-preview-server.mjs'

const { clinicianDirectoryUrl } = await import('../src/content/clinician-directory.ts')

let cases = 0
const fixture = clinicianDirectoryFixture()
const allowedFilters = clinicianDirectoryFilters.map((filter) => filter.value)

const relevanceCases = [
  { label: 'case-insensitive name', parameters: { q: 'aster' }, count: 1, names: ['Dr Synthetic Aster'] },
  { label: 'full name', parameters: { q: 'Dr Synthetic Aster' }, count: 1, names: ['Dr Synthetic Aster'] },
  { label: 'normalized spacing', parameters: { q: '  Synthetic   child care ' }, count: 3 },
  { label: 'specialty', parameters: { q: 'heart care' }, count: 3 },
  { label: 'name and matching filter', parameters: { q: 'ASTER', type: 'synthetic-family' }, count: 1 },
  { label: 'name and excluding filter', parameters: { q: 'ASTER', type: 'synthetic-child' }, count: 0 },
  { label: 'explicit typo has no inferred match', parameters: { q: 'Asterr' }, count: 0 },
]

for (const specimen of relevanceCases) {
  const directory = resolveClinicianDirectory(fixture, new URLSearchParams(specimen.parameters))
  assert.equal(directory.resultCount, specimen.count, specimen.label)
  if (specimen.names) assert.deepEqual(directory.results.map((record) => record.details.name), specimen.names)
  cases++
}

const combinedFilters = resolveClinicianDirectory(
  fixture,
  new URLSearchParams('type=synthetic-family&type=synthetic-child&type=synthetic-family'),
)
assert.deepEqual(combinedFilters.state.filters, ['synthetic-family', 'synthetic-child'])
assert.equal(combinedFilters.resultCount, 6)
assert.ok(combinedFilters.results.every((record) => record.details.specialties.some((specialty) =>
  ['Synthetic family care', 'Synthetic child care'].includes(specialty))))
cases++

const canonicalUrl = clinicianDirectoryUrl('/doctors/', {
  filters: ['not-approved', 'synthetic-child', 'synthetic-child', 'synthetic-family'],
  page: 2,
  query: '  Aster\u0000  ',
}, allowedFilters)
assert.equal(canonicalUrl, '/doctors/?q=Aster&type=synthetic-child&type=synthetic-family&page=2')
assert.equal(clinicianDirectoryUrl('/doctors/', {
  filters: [],
  page: 1,
  query: '',
}, allowedFilters), '/doctors/')
cases += 2

const permutationA = resolveClinicianDirectory(
  fixture,
  new URLSearchParams('q=Synthetic&type=synthetic-child&page=1'),
)
const permutationB = resolveClinicianDirectory(
  fixture,
  new URLSearchParams('page=1&type=synthetic-child&q=Synthetic'),
)
assert.deepEqual(permutationA, permutationB)
cases++

const publicIds = new Set()
const canonicalPaths = new Set()
const firstPage = resolveClinicianDirectory(fixture)
for (let page = 1; page <= firstPage.pageCount; page++) {
  const directory = resolveClinicianDirectory(fixture, new URLSearchParams({ page: String(page) }))
  for (const record of directory.results) {
    assert.equal(publicIds.has(record.publicId), false, `Duplicate public ID ${record.publicId}`)
    assert.equal(canonicalPaths.has(record.canonicalPath), false, `Duplicate canonical path ${record.canonicalPath}`)
    publicIds.add(record.publicId)
    canonicalPaths.add(record.canonicalPath)
  }
}
assert.equal(publicIds.size, 9)
assert.equal(canonicalPaths.size, 9)
cases++

const longDocument = clinicianDirectoryPreviewDocument('long-content')
assert.doesNotMatch(longDocument, />\s*undefined\s*</u)
assert.doesNotMatch(longDocument, /<h2>\s*<\/h2>|<li>\s*<\/li>/u)
assert.match(longDocument, /deliberately expanded fictional name/u)
cases++

const resultDocument = clinicianDirectoryPreviewDocument(
  'controlled',
  new URLSearchParams('q=Aster&type=synthetic-family'),
)
assert.equal((resultDocument.match(/role="status"/gu) ?? []).length, 1)
assert.equal((resultDocument.match(/aria-live="polite"/gu) ?? []).length, 1)
assert.equal((resultDocument.match(/aria-atomic="true"/gu) ?? []).length, 1)
assert.match(resultDocument, /<ol aria-labelledby="clinician-result-count"/u)
assert.match(resultDocument, /1 clinician/u)
cases++

const lifecycleDeadline = new Date(clinicianDirectoryTime.getTime() + 60 * 86_400_000)
const beforeDeadline = resolveClinicianDirectory(
  fixture,
  new URLSearchParams(),
  new Date(clinicianDirectoryTime.getTime() + 29 * 86_400_000),
)
const atReviewDeadline = resolveClinicianDirectory(
  fixture,
  new URLSearchParams(),
  new Date(clinicianDirectoryTime.getTime() + 30 * 86_400_000),
)
const atExpiryDeadline = resolveClinicianDirectory(fixture, new URLSearchParams(), lifecycleDeadline)
assert.equal(beforeDeadline.resultCount, 9)
assert.equal(atReviewDeadline.resultCount, 0)
assert.equal(atExpiryDeadline.resultCount, 0)
assert.equal((renderClinicianDirectory({ directory: atExpiryDeadline }).match(/data-clinician-public-id/gu) ?? []).length, 0)
cases++

const server = await createClinicianDirectoryPreviewServer()
try {
  for (const path of [
    '/?q=Aster',
    '/?type=synthetic-family&q=Aster',
    '/?q=Aster&type=synthetic-family',
    '/?page=3',
    '/long-content',
    '/failure',
    '/offline',
    '/empty',
  ]) {
    const response = await fetch(`${server.origin}${path}`)
    assert.equal(response.status, 200, path)
    assert.equal(response.headers.get('x-robots-tag'), 'noindex, nofollow, noarchive', path)
    assert.match(response.headers.get('cache-control') ?? '', /no-store/u, path)
    assert.match(await response.text(), /<meta name="robots" content="noindex,nofollow">/u, path)
    cases++
  }
  const head = await fetch(`${server.origin}/?q=Aster`, { method: 'HEAD' })
  assert.equal(head.status, 200)
  assert.equal(await head.text(), '')
  cases++
} finally {
  await server.close()
}

console.log(`Clinician-directory validation passed: ${cases} relevance, URL, lifecycle, canonicality, semantics and resilience cases.`)
