import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import ts from 'typescript'

async function load(relative, transform = (value) => value) {
  const source = transform(readFileSync(new URL(relative, import.meta.url), 'utf8'))
  const { outputText } = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } })
  return import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`)
}
const { answerGuide: answer, normalizeQuestion } = await load('../src/patient-guide/engine.ts')
const { previewFaqs, guideTopics } = await load('../src/patient-guide/content.ts')
const data = JSON.parse(readFileSync(new URL('../src/demo/data.json', import.meta.url), 'utf8'))
const { visitGuides } = await load('../src/demo/visit-guides.ts')
const { demoPatientGuide: catalog } = await load('../src/demo/patient-guide.ts', (source) => source
  .replace("import { visitGuides } from './visit-guides'", `const visitGuides = ${JSON.stringify(visitGuides)}`)
  .replace("import data from './data.json'", `const data = ${JSON.stringify(data)}`)
  .replace("import { previewFaqs } from '@/patient-guide/content'", `const previewFaqs = ${JSON.stringify(previewFaqs)}`))

assert.ok(catalog.services.every((service) => !visitGuides[service.id]), 'Preparation guides must not become appointment service choices')

assert.equal(normalizeQuestion('  VISITING—Hours?! '), 'visiting hours')
for (const faq of catalog.faqs) {
  assert.equal(answer(faq.question, catalog).text, faq.answer, faq.id)
}
for (const topic of guideTopics) assert.notEqual(answer(topic.query, catalog).kind, 'fallback', topic.label)
assert.equal(answer('  ', catalog).kind, 'fallback')
assert.equal(answer('this is unrelated', catalog).kind, 'fallback', 'no substring greeting match')
assert.equal(answer('unlisted surgery', catalog).kind, 'fallback')
assert.equal(answer('<script>alert(1)</script>', catalog).kind, 'fallback')
assert.equal(answer('Which medication should I take?', catalog).kind, 'answer')
assert.match(answer('Which medication should I take?', catalog).text, /cannot assess/)
for (const query of ['emergency', 'I have chest pain', 'cannot breathe', 'urgent appointment', 'overdose']) {
  assert.equal(answer(query, catalog).kind, 'emergency', query)
  assert.equal(answer(query, catalog).actions[0].href, '/emergency')
}
const heart = answer('I need a cardiologist', catalog)
assert.equal(heart.cards.length, 3)
assert.ok(heart.cards.every((card) => card.description === 'Heart care'))
assert.equal(answer('heart services', catalog).cards[0].title, 'Heart medicine', 'service intent does not become a doctor search')
assert.equal(answer('rehabilitation', catalog).cards[0].title, 'Rehabilitation care', 'service keyword search')
assert.equal(answer('heart', catalog).cards, undefined, 'ambiguous care query offers a choice')
for (const doctor of catalog.doctors) {
  const match = answer(`Find ${doctor.name}`, catalog)
  assert.equal(match.cards[0].id, doctor.id)
  assert.equal(match.cards[0].actions[0].href, doctor.profileHref)
  assert.equal(match.cards[0].actions[1].href, `/appointment?doctor=${doctor.id}`)
}
for (const service of catalog.services) {
  const match = answer(service.name, catalog)
  assert.equal(match.cards[0].id, service.id)
  assert.equal(match.cards[0].actions[0].href, `/appointment?service=${service.id}`)
}
assert.match(answer('What is the phone number?', catalog).text, /\+251 11 470 4242/)
assert.match(answer('How much does it cost?', catalog).text, /not available/)
assert.match(answer('Can I cancel my appointment?', catalog).text, /Contact the hospital.*change or cancel/)
assert.equal(answer('Can I cancel my appointment?', catalog).actions[0].href, '/#home-call')
assert.equal(answer('አማርኛ', catalog).text, catalog.faqs.find((faq) => faq.id === 'language').answer)
const empty = { ...catalog, doctors: [], services: [] }
assert.equal(answer('Find a doctor', empty).cards, undefined)
assert.match(answer('Explore services', empty).text, /not available/)
assert.equal(answer('Dr Aster', empty).cards, undefined)
assert.equal(answer('x'.repeat(5000), catalog).kind, 'fallback')
console.log('Patient guide passed: FAQ coverage, guided flows, whole-word matching, specialties, record identity, appointment handoffs, missing data, language, medical boundaries and emergency routing.')
