import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import ts from 'typescript'

async function load(relative, transform = (source) => source) {
  const source = transform(readFileSync(new URL(relative, import.meta.url), 'utf8'))
  const { outputText } = ts.transpileModule(source, { compilerOptions: {
    target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext,
  } })
  return import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`)
}
const careModel = await import('../src/demo/care-model.ts')
const careMetadata = Object.fromEntries(['pub_141414141414', 'pub_171717171717'].map((id) => [id, careModel.careEntry(id)]))
const data = JSON.parse(readFileSync(new URL('../src/demo/data.json', import.meta.url), 'utf8'))
const { healthTopics } = await load('../src/demo/health-topics.ts', (source) =>
  source.replace("import data from './data.json'", `const data = ${JSON.stringify(data)}`).replace("import { careEntry } from './care-model'", `const entriesById = ${JSON.stringify(careMetadata)}; const careEntry = (id) => entriesById[id]`))
const { searchHealthTopics: search } = await load('../src/website/health-search.ts')
const names = (query, letter) => search(healthTopics, query, letter).map(({ topic }) => topic.name)

assert.deepEqual(names(''), [])
assert.deepEqual(names('', 'H'), ['Headaches', 'High blood pressure'])
assert.deepEqual(names('pain'), ['Back pain', 'Joint pain', 'Digestive concerns', 'Headaches'])
assert.deepEqual(names('  BLOOD   SUGAR ', 'H'), ['Diabetes'])
assert.deepEqual(names('sugar blood'), ['Diabetes'])
assert.deepEqual(names('self-care'), ['Everyday wellbeing'])
assert.deepEqual(names('back hurts'), ['Back pain'])
assert.deepEqual(names('lower back'), ['Back pain'])
assert.equal(search(healthTopics, 'hypertension')[0].explanation, 'Matches “hypertension”')
assert.equal(search(healthTopics, 'back pain')[0].explanation, undefined)
const base = healthTopics[0]
assert.deepEqual(search([
  { ...base, name: 'Other concern', aliases: ['back pain'] },
  { ...base, name: 'Back pain follow-up', aliases: [] },
  { ...base, name: 'Back pain', aliases: [] },
], 'back pain').map(({ topic }) => topic.name), ['Back pain', 'Other concern', 'Back pain follow-up'])
assert.deepEqual(names('aching hurts'), []) // Cannot assemble a match across unrelated aliases.
assert.deepEqual(names('art'), []) // Cannot match a fragment in the middle of a word.
assert.deepEqual(names('<script>alert(1)</script>'), [])
assert.deepEqual(names('unlisted condition'), [])
for (const topic of healthTopics) {
  assert.ok(topic.summary && topic.nextStep && topic.preparation.length >= 2)
  assert.equal(names(topic.name)[0], topic.name)
  if (topic.route === 'appointment') {
    const service = data.services.find((entry) => entry.publicId === topic.servicePublicId)
    assert.ok(service)
    assert.equal(topic.appointmentHref, `/appointment?service=${service.publicId}`)
  } else {
    assert.equal(topic.appointmentHref, undefined)
  }
}
assert.equal(healthTopics.find((topic) => topic.id === 'everyday-wellbeing').route, 'guidance')
console.log('Health finder passed: cross-letter keywords, ranking, aliases, multiword matching, empty results and explicit topic-to-service paths.')
