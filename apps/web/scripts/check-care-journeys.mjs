import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import ts from 'typescript'

async function load(relative, transform = (source) => source) {
  const source = transform(readFileSync(new URL(relative, import.meta.url), 'utf8'))
  const { outputText } = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } })
  return import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`)
}
const { careEntry, relatedCareIds } = await import('../src/demo/care-model.ts')
const { doctorSearchTerms } = await import('../src/demo/care-discovery.ts')
const data = JSON.parse(readFileSync(new URL('../src/demo/data.json', import.meta.url), 'utf8'))
const { clinicianDirectoryFromViews: directory } = await load('../src/content/clinician-directory.ts', (source) => source.replace(/^import .*clinician-view.*$/mu, ''))
function search(query, filters = {}) {
  return directory({ entries: data.clinicians, filters: data.clinicianFilters, locale: 'en', pageSize: 4,
    searchParameters: { q: query, ...filters }, searchTerms: doctorSearchTerms(query, data.clinicians, data.services) })
}
data.services = data.services.map((entry) => ({ ...entry, name: careEntry(entry.publicId)?.name ?? entry.name }))
const sugar = search('blood sugar')
assert.ok(sugar.resultCount > 0)
assert.ok(sugar.results.every((doctor) => relatedCareIds(doctor.publicId).includes('pub_141414141414')))
assert.ok(Object.values(sugar.matchReasons).every((reason) => reason.includes('Family medicine')))
assert.deepEqual(search('  BLOOD   SUGAR  ').results, sugar.results)
assert.equal(search('backache').resultCount, 0, 'no invented rehabilitation doctor affiliation')
assert.equal(search('unlisted procedure').resultCount, 0)
assert.equal(search('<script>alert(1)</script>').resultCount, 0)
assert.ok(search('Cardiology').resultCount > 0, 'service names connect to affiliated doctors')
assert.equal(search('aching hurts').resultCount, 0, 'aliases cannot assemble unrelated query words')
assert.ok(search('Dr Aster').results.some((doctor) => doctor.details.name.includes('Aster')))
assert.equal(search('blood sugar', { page: '99' }).state.page, sugar.pageCount)
const firstDoctor = data.clinicians[0]
const input = { entries: [firstDoctor], filters: [], locale: 'en', searchParameters: { q: 'invented procedure' } }
assert.equal(directory(input).resultCount, 0, 'default directory never infers a care relationship')
assert.equal(directory({ ...input, searchTerms: [{ clinicianPublicId: 'missing', terms: ['invented procedure'], explanation: 'Missing' }] }).resultCount, 0)
assert.deepEqual(search('Diabetes').results, sugar.results)
assert.equal(search('headache').resultCount, 0, 'guidance-only searches do not imply an affiliation')
console.log('Care journeys passed: aliases, explicit doctor affiliations, missing relationships, service search, pagination and direct-name search.')
