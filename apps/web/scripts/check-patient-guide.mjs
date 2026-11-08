import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import ts from 'typescript'

async function load(relative, transform = (value) => value) {
  const source = transform(readFileSync(new URL(relative, import.meta.url), 'utf8'))
  const { outputText } = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } })
  return import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`)
}
const { answerGuide: answer, normalizeQuestion } = await load('../src/patient-guide/engine.ts')
const { hospitalContact } = await load('../src/website/hospital-contact.ts')
const { previewFaqs, guideTopics } = await load('../src/patient-guide/content.ts', (source) => source.replace("import { hospitalContact } from '@/website/hospital-contact'", `const hospitalContact = ${JSON.stringify(hospitalContact)}`))
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
for (const query of ['hello', 'HI!', 'hey', 'Thanks.', 'thank you']) {
  assert.match(answer(query, catalog).text, /What would you like help finding/, query)
}
for (const [query, faqId] of [
  ['hello visiting hours', 'hours'],
  ['thanks where is the hospital', 'directions'],
  ['hey I need an appointment', 'appointment'],
  ['thank you, how can I prepare for my visit?', 'visit'],
]) {
  assert.equal(answer(query, catalog).text, catalog.faqs.find((faq) => faq.id === faqId).answer, query)
}
assert.equal(answer('hello completely unlisted question', catalog).kind, 'fallback', 'unknown intent with a greeting still receives recovery options')
assert.match(answer('request an appointment', catalog).text, /no request is sent or saved and no appointment is booked/, 'appointment preview cannot imply a live request')
assert.equal(answer('unlisted surgery', catalog).kind, 'fallback')
assert.equal(answer('<script>alert(1)</script>', catalog).kind, 'fallback')
assert.equal(answer('Which medication should I take?', catalog).kind, 'answer')
assert.match(answer('Which medication should I take?', catalog).text, /cannot assess/)
for (const query of ['emergency', 'I have chest pain', 'cannot breathe', 'urgent appointment', 'overdose']) {
  assert.equal(answer(query, catalog).kind, 'emergency', query)
  assert.equal(answer(query, catalog).actions[0].href, '/emergency')
}
for (const query of ['hello, I have chest pain', 'thanks, urgent appointment', 'thank you, cannot breathe']) {
  assert.equal(answer(query, catalog).kind, 'emergency', `safety precedes greeting: ${query}`)
}
assert.match(answer('hello, which medication should I take?', catalog).text, /cannot assess/, 'medical boundary precedes greeting')
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

// Real questions, ambiguity and public-record continuity across multiple turns.
for (const query of ['visitting hours', 'visting hours', 'hello, apointment please']) {
  assert.equal(answer(query, catalog).text, catalog.faqs.find((faq) => faq.id === (query.includes('hours') ? 'hours' : 'appointment')).answer, query)
}
assert.equal(answer('I need a physician', catalog).kind, 'directory')
assert.equal(answer('show clinics', catalog).kind, 'directory')
assert.equal(answer('where can I get my test results?', catalog).text, catalog.faqs.find((faq) => faq.id === 'results').answer)
const spelling = answer('Find Dr Astre', catalog)
assert.equal(spelling.kind, 'clarification', 'near names require confirmation')
assert.equal(answer(spelling.actions[0].query, catalog, spelling.actions[0].context).cards[0].id, catalog.doctors[0].id)
const ambiguous = answer('opening hours and prices', catalog)
assert.equal(ambiguous.kind, 'clarification')
assert.ok(ambiguous.actions.some((action) => action.query === catalog.faqs.find((faq) => faq.id === 'hours').question))
assert.ok(ambiguous.actions.some((action) => action.query === catalog.faqs.find((faq) => faq.id === 'fees').question))
const secondTopic = answer('the second one', catalog, ambiguous.context)
assert.equal(secondTopic.text, catalog.faqs.find((faq) => faq.id === 'fees').answer)
const doctorTurn = answer(`Find ${catalog.doctors[0].name}`, catalog)
const bookDoctor = answer('can I book with them?', catalog, doctorTurn.context)
assert.equal(bookDoctor.actions[0].href, `/appointment?doctor=${catalog.doctors[0].id}`)
assert.match(bookDoctor.text, /no request is sent/i)
assert.ok(bookDoctor.text.includes(catalog.doctors[0].name))
assert.equal(answer(`appointment with ${catalog.doctors[1].name}`, catalog, doctorTurn.context).actions[0].href, `/appointment?doctor=${catalog.doctors[1].id}`, 'explicit new name replaces prior care')
const serviceTurn = answer(catalog.services[0].name, catalog, doctorTurn.context)
assert.equal(answer('book this', catalog, serviceTurn.context).actions[0].href, `/appointment?service=${catalog.services[0].id}`, 'switching services clears the previous doctor')
const multipleDoctors = answer('cardiologist', catalog)
assert.equal(answer('book with them', catalog, multipleDoctors.context).kind, 'clarification', 'never book the first displayed profile by assumption')
assert.equal(answer('the second one', catalog, multipleDoctors.context).cards[0].id, multipleDoctors.cards[1].id)
assert.equal(answer('book this', catalog).kind, 'clarification', 'no context requires a choice')
assert.equal(answer('book this', empty, doctorTurn.context).kind, 'clarification', 'removed records cannot be reused')
const afterPrivacy = answer('privacy', catalog, doctorTurn.context)
assert.equal(answer('book this', catalog, afterPrivacy.context).kind, 'clarification', 'unrelated topic clears care context')
const sameName = { ...catalog, doctors: [
  { ...catalog.doctors[0], name: 'Dr Aster Alemu' },
  { ...catalog.doctors[1], name: 'Dr Aster Bekele' },
] }
assert.equal(answer('Aster', sameName).kind, 'clarification')
assert.equal(answer('Aster Alemu', sameName).cards[0].id, sameName.doctors[0].id)
const nameChoices = answer('Aster', sameName)
const chosen = nameChoices.actions[1]
assert.equal(answer(chosen.query, sameName, chosen.context).cards[0].id, sameName.doctors[1].id, 'choice identifies record rather than re-matching a shared name')
const fallback = answer('qwertyxyz', catalog, doctorTurn.context)
assert.equal(fallback.kind, 'fallback')
assert.ok(fallback.actions.some((action) => action.href === hospitalContact.phoneHref))
assert.ok(fallback.actions.some((action) => action.href === `mailto:${hospitalContact.email}`))
assert.ok(fallback.actions.length <= 4)
assert.match(answer('another unlisted question', catalog, fallback.context).text, /still couldn’t match/)
assert.equal(answer('emergncy', catalog, ambiguous.context).kind, 'emergency', 'common safety typo precedes clarification')
assert.equal(answer('tell me more about chest pain', catalog, doctorTurn.context).kind, 'emergency')
assert.match(answer('medicaton', catalog, doctorTurn.context).text, /cannot assess/)
assert.equal(answer('Dr Astre chest pain', catalog).kind, 'emergency', 'safety precedes name confirmation')
assert.equal(answer('emergency', catalog, doctorTurn.context).context, undefined, 'emergency does not preserve a booking selection')

assert.equal(answer('I would like to book with them please', catalog, multipleDoctors.context).kind, 'clarification')
assert.equal(answer('book an appointment with Dr Unlisted', catalog, doctorTurn.context).kind, 'clarification', 'unknown named care cannot silently reuse an earlier doctor')
assert.equal(answer('appointment for that department', catalog, serviceTurn.context).actions[0].href, `/appointment?service=${catalog.services[0].id}`)

console.log('Frontend guide improvements passed: spelling confirmation, synonyms, ambiguous choices, contextual follow-ups, care replacement, direct contact and safety precedence.')
