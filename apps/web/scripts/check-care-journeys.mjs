import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import ts from 'typescript'

async function load(relative, transform = (source) => source) {
  const source = transform(readFileSync(new URL(relative, import.meta.url), 'utf8'))
  const { outputText } = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } })
  return import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`)
}
const data = JSON.parse(readFileSync(new URL('../src/demo/data.json', import.meta.url), 'utf8'))
const { healthTopics } = await load('../src/demo/health-topics.ts', (source) => source.replace("import data from './data.json'", `const data = ${JSON.stringify(data)}`))
const { searchHealthTopics } = await load('../src/website/health-search.ts')
const { relatedServiceIds } = await load('../src/demo/service-details.ts')
const { doctorSearchTerms } = await load('../src/demo/care-discovery.ts', (source) => source
  .replace("import { healthTopics } from './health-topics'", `const healthTopics = ${JSON.stringify(healthTopics)}`)
  .replace("import { relatedServiceIds } from './service-details'", `const relatedServiceIds = ${relatedServiceIds.toString()}`)
  .replace("import { searchHealthTopics } from '../website/health-search'", `const searchHealthTopics = ${searchHealthTopics.toString()}`)
  // The search function references its normalizer in its module scope.
  .replace('const searchHealthTopics =', "const normalizeHealthQuery = (text) => text.normalize('NFKC').toLocaleLowerCase('en').replaceAll(/[^\\p{L}\\p{N}]+/gu, ' ').trim(); const searchHealthTopics ="))
const { clinicianDirectoryFromViews: directory } = await load('../src/content/clinician-directory.ts', (source) => source.replace(/^import .*clinician-view.*$/mu, ''))
function search(query, filters = {}) {
  return directory({ entries: data.clinicians, filters: data.clinicianFilters, locale: 'en', pageSize: 4,
    searchParameters: { q: query, ...filters }, searchTerms: doctorSearchTerms(query, data.clinicians, data.services) })
}
const sugar = search('blood sugar')
assert.ok(sugar.resultCount > 0)
assert.ok(sugar.results.every((doctor) => relatedServiceIds(doctor.details.specialties).includes(healthTopics.find((topic) => topic.id === 'diabetes').servicePublicId)))
assert.ok(Object.values(sugar.matchReasons).every((reason) => reason.includes('General medicine')))
assert.deepEqual(search('  BLOOD   SUGAR  ').results, sugar.results)
assert.equal(search('backache').resultCount, 0, 'no invented rehabilitation doctor affiliation')
assert.equal(search('unlisted procedure').resultCount, 0)
assert.equal(search('<script>alert(1)</script>').resultCount, 0)
assert.ok(search('Heart medicine').resultCount > 0, 'service names connect to affiliated doctors')
assert.equal(search('aching hurts').resultCount, 0, 'aliases cannot assemble unrelated query words')
assert.ok(search('Dr Aster').results.some((doctor) => doctor.details.name.includes('Aster')))
assert.equal(search('blood sugar', { page: '99' }).state.page, sugar.pageCount)
const firstDoctor = data.clinicians[0]
const input = { entries: [firstDoctor], filters: [], locale: 'en', searchParameters: { q: 'invented procedure' } }
assert.equal(directory(input).resultCount, 0, 'default directory never infers a topic relationship')
assert.equal(directory({ ...input, searchTerms: [{ clinicianPublicId: 'missing', terms: ['invented procedure'], explanation: 'Missing' }] }).resultCount, 0)
for (const topic of healthTopics) {
  if (topic.servicePublicId) {
    const service = data.services.find((entry) => entry.publicId === topic.servicePublicId)
    assert.equal(topic.servicePath, service.canonicalPath)
    assert.equal(topic.appointmentHref, `/appointment?service=${service.publicId}`)
  }
}
console.log('Care journeys passed: aliases, explicit doctor affiliations, missing relationships, service search, pagination, direct-name search and stable topic handoffs.')
