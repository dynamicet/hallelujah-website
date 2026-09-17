import assert from 'node:assert/strict'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createWorkflow, applyWorkflow, requiredDomains } from '../src/content/cms-workflow.ts'
import { validateStoredRecordChange } from '../src/content/governed-collection.ts'
import { publicEligibility, validateGovernedRecord, validateRecordSet } from '../src/content/governed-record.ts'
import { controlledVisitorHub, ControlledVisitorHub } from '../src/content/visitor-topic-view.ts'
import { visitorPurposes } from '../src/content/visitor-topic.ts'
import { visitorTopicFixture, visitorDecisionInventory } from './lib/visitor-topic-fixture.mjs'

const at = new Date('2026-09-17T12:00:00Z')
const now = new Date(at.getTime() + 60000)
const author = { id: 'cms:1', roles: ['author', 'reviewer', 'operations', 'privacy', 'legal'] }
const reviewer = { id: 'cms:2', roles: ['reviewer'] }
const publisher = { id: 'cms:3', roles: ['publisher'] }
const domains = { operations: { id: 'cms:4', roles: ['operations'] },
  privacy: { id: 'cms:5', roles: ['privacy'] }, legal: { id: 'cms:6', roles: ['legal'] } }
const fixture = visitorTopicFixture(at)
const action = (doc, actor, type, extra = {}, input, clock = at) => applyWorkflow(doc, input,
  { action: type, expectedRevision: doc.workflow.revision, ...extra }, actor, clock)
function reviewed(input = fixture) {
  let doc = action(createWorkflow(input, 'general', author, at), author, 'submit')
  for (const [domain, actor] of Object.entries(domains)) doc = action(doc, actor, 'review-domain',
    { domain, reference: `Synthetic ${domain} evidence` })
  return doc
}
function published(input = fixture) {
  return action(action(reviewed(input), reviewer, 'approve'), publisher, 'publish')
}
function rejects(input, pattern) {
  const result = validateGovernedRecord(input)
  assert.equal(result.ok, false)
  assert.match(result.issues.join('; '), pattern)
}
const change = (fields) => ({ ...fixture, visitorTopic: { ...fixture.visitorTopic, ...fields } })
const doc = published()
assert.equal(validateGovernedRecord(doc.record).ok, true)
assert.deepEqual(requiredDomains(fixture, 'general'), ['operations', 'privacy', 'legal'])
assert.deepEqual(controlledVisitorHub([doc], 'en', now).groups, [])
assert.equal(publicEligibility({ ...doc.record, synthetic: false }, now).reason, 'access-gated')
for (const field of ['identityKey', 'purpose', 'phase', 'taskOrder', 'disposition',
  'dispositionReason', 'temporary', 'localized', 'fallback']) rejects(change({ [field]: undefined }), /visitor topic|visitor topics/)
rejects(change({ internalNotes: 'unsupported' }), /unsupported fields/)
rejects(change({ purpose: 'diagnosis' }), /purpose/)
rejects(change({ phase: 'unknown' }), /phase/)
for (const taskOrder of [-1, 1000, 1.5, '10', NaN]) rejects(change({ taskOrder }), /task order/)
rejects(change({ fallback: { state: 'enabled', reason: 'Unapproved contact', href: 'tel:123' } }), /fallback remains withheld/)
rejects(change({ localized: { en: { title: fixture.localized.en.title, body: '' } } }), /useful body/)
rejects({ ...fixture, localized: { en: { ...fixture.localized.en, title: 'Divergent title' } } }, /canonical localized/)
rejects({ ...fixture, kind: 'page' }, /only allowed/)
for (const disposition of ['unavailable', 'defer', 'omit']) {
  rejects(change({ disposition }), /guidance must be null/)
  const decision = change({ disposition, localized: { en: { title: fixture.localized.en.title, body: null } } })
  assert.equal(validateGovernedRecord(decision).ok, true)
  assert.throws(() => action(reviewed(decision), reviewer, 'approve'), /excludes publication/)
  assert.deepEqual(controlledVisitorHub([createWorkflow(decision, 'general', author, at)], 'en', now, 'controlled-fixture').groups, [])
}
const inventory = visitorDecisionInventory(at)
assert.equal(inventory.length, visitorPurposes.length)
assert.deepEqual(new Set(inventory.map((record) => record.visitorTopic.purpose)), new Set(visitorPurposes))
assert.deepEqual(validateRecordSet(inventory), [])
assert.ok(inventory.every((record) => validateGovernedRecord(record).ok))
assert.deepEqual(controlledVisitorHub(inventory.map((record) => createWorkflow(record, 'general', author, at)), 'en', now, 'controlled-fixture').groups, [])
const submitted = action(createWorkflow(fixture, 'general', author, at), author, 'submit')
for (const domain of Object.keys(domains)) {
  assert.throws(() => action(submitted, author, 'review-domain', { domain, reference: 'self review' }), /independent/)
  assert.throws(() => action(submitted, reviewer, 'review-domain', { domain, reference: 'wrong role' }), /role/)
  let incomplete = submitted
  for (const [other, actor] of Object.entries(domains).filter(([other]) => other !== domain)) incomplete = action(incomplete, actor, 'review-domain', { domain: other, reference: 'synthetic incomplete' })
  assert.throws(() => action(incomplete, reviewer, 'approve'), /domain reviews/)
}
assert.throws(() => action(submitted, author, 'approve'), /self-approve/)
assert.throws(() => applyWorkflow(submitted, undefined, { action: 'approve', expectedRevision: 0 }, reviewer, at), /Stale/)
const approved = action(reviewed(), reviewer, 'approve')
assert.throws(() => action(approved, publisher, 'publish', {}, change({ dispositionReason: 'changed' })), /Content cannot change/)
const returned = action(action(approved, reviewer, 'request-changes', { reason: 'Synthetic correction' }),
  reviewer, 'request-changes', { reason: 'Return to draft' })
assert.equal(returned.record.approval, null)
assert.deepEqual(returned.workflow.reviews, {})
const edited = action(returned, author, 'edit', {}, { ...returned.record,
  visitorTopic: { ...returned.record.visitorTopic, taskOrder: 1 } })
assert.deepEqual(edited.record.audit.slice(0, -1), returned.record.audit)
for (const fields of [{ identityKey: 'vst_999999999999' }, { purpose: 'arrival' }]) {
  assert.throws(() => validateStoredRecordChange({ ...edited.record, visitorTopic: { ...edited.record.visitorTopic, ...fields } },
    returned.record, []), /identity and purpose cannot change/)
}
const other = published(visitorTopicFixture(at, '080808080808', 'arrival'))
assert.ok(validateRecordSet([doc.record, { ...other.record, visitorTopic: { ...other.record.visitorTopic,
  identityKey: doc.record.visitorTopic.identityKey } }]).includes('duplicate visitor topic identity'))
assert.ok(validateRecordSet([doc.record, { ...other.record, visitorTopic: { ...other.record.visitorTopic,
  purpose: doc.record.visitorTopic.purpose } }]).includes('duplicate current visitor topic purpose'))
const topic = (suffix, purpose, phase, taskOrder) => {
  const input = visitorTopicFixture(at, suffix, purpose)
  input.visitorTopic.phase = phase
  input.visitorTopic.taskOrder = taskOrder
  return published(input)
}
const during = topic('090909090909', 'visiting', 'during', 0)
const after = topic('101010101010', 'discharge', 'after', 0)
const hub = controlledVisitorHub([after, doc, during, other], 'en', now, 'controlled-fixture')
assert.deepEqual(hub.groups.map((group) => group.phase), ['before', 'during', 'after'])
assert.deepEqual(hub.groups[0].topics.map((entry) => entry.publicId), [doc.record.publicId, other.record.publicId])
const first = structuredClone(other)
first.record.visitorTopic.taskOrder = 1
assert.equal(controlledVisitorHub([doc, first], 'en', now, 'controlled-fixture').groups[0].topics[0].publicId, other.record.publicId)
for (const field of ['publishAt', 'reviewAt', 'expiresAt']) {
  const stale = structuredClone(doc)
  stale.record[field] = field === 'publishAt' ? '2026-09-18T12:00:00Z' : now.toISOString().replace('.000Z', 'Z')
  assert.equal(controlledVisitorHub([stale], 'en', now, 'controlled-fixture').state, 'unavailable')
}
for (const domain of ['operations', 'privacy', 'legal']) {
  const missing = structuredClone(doc)
  delete missing.workflow.reviews[domain]
  assert.equal(controlledVisitorHub([missing], 'en', now, 'controlled-fixture').state, 'unavailable')
  const self = structuredClone(doc)
  self.workflow.reviews[domain].actor = author.id
  assert.equal(controlledVisitorHub([self], 'en', now, 'controlled-fixture').state, 'unavailable')
  const future = structuredClone(doc)
  future.workflow.reviews[domain].at = '2026-09-18T12:00:00Z'
  assert.equal(controlledVisitorHub([future], 'en', now, 'controlled-fixture').state, 'unavailable')
}
for (const input of [null, {}, { ...doc, record: { ...doc.record, synthetic: false } }, submitted, returned,
  { ...doc, workflow: { ...doc.workflow, author: 'cms:99' } }]) {
  assert.equal(controlledVisitorHub([input], 'en', now, 'controlled-fixture').state, 'unavailable')
}
assert.equal(controlledVisitorHub([doc], 'fr', now, 'controlled-fixture').state, 'unavailable')
assert.equal(controlledVisitorHub([doc], 'en', new Date('invalid'), 'controlled-fixture').state, 'unavailable')
assert.equal(controlledVisitorHub([doc], 'am', now, 'controlled-fixture').state, 'unavailable')
const bilingualInput = structuredClone(fixture)
bilingualInput.localized.am = { slug: 'synthetic-visitor-am', title: 'የቁጥጥር ምሳሌ' }
bilingualInput.visitorTopic.localized.am = { title: 'የቁጥጥር ምሳሌ', body: 'የቁጥጥር ጽሑፍ ምሳሌ' }
const bilingual = published(bilingualInput)
assert.equal(controlledVisitorHub([bilingual], 'am', now, 'controlled-fixture').groups.length, 1)
const temporary = structuredClone(fixture)
temporary.visitorTopic.temporary = true
temporary.reviewAt = '2026-09-18T12:00:00Z'
temporary.expiresAt = '2026-09-19T12:00:00Z'
const timed = published(temporary)
for (const boundary of [temporary.reviewAt, temporary.expiresAt]) {
  assert.equal(controlledVisitorHub([timed], 'en', new Date(boundary), 'controlled-fixture').state, 'unavailable')
}
const withdrawn = action(doc, publisher, 'withdraw', { reason: 'Synthetic retirement' })
assert.equal(validateStoredRecordChange(withdrawn.record, doc.record, []).publicId, doc.record.publicId)
assert.equal(controlledVisitorHub([withdrawn], 'en', now, 'controlled-fixture').state, 'unavailable')
const html = renderToStaticMarkup(createElement(ControlledVisitorHub,
  { documents: [doc], locale: 'en', now, mode: 'controlled-fixture' }))
assert.match(html, /Synthetic visitor guidance fixture/)
assert.match(html, /<h2[^>]*>Before a visit/)
assert.match(html, /<h3>/)
assert.doesNotMatch(html, /<a\b|<img\b|<script\b|<form\b|<button\b|<input\b|During a visit|After a visit/)
const shaping = renderToStaticMarkup(createElement(ControlledVisitorHub,
  { documents: [bilingual], locale: 'am', now, mode: 'controlled-fixture' }))
assert.match(shaping, /lang="am"/)
assert.match(shaping, /Unreviewed Amharic shaping fixture/)
const escaped = structuredClone(doc)
escaped.record.visitorTopic.localized.en.body = '<script>synthetic</script>'
const escapedHtml = renderToStaticMarkup(createElement(ControlledVisitorHub,
  { documents: [escaped], locale: 'en', now, mode: 'controlled-fixture' }))
assert.match(escapedHtml, /&lt;script&gt;/)
assert.doesNotMatch(escapedHtml, /<script>/)
const unavailableHtml = renderToStaticMarkup(createElement(ControlledVisitorHub,
  { documents: [timed], locale: 'en', now: new Date(temporary.expiresAt), mode: 'controlled-fixture' }))
assert.match(unavailableHtml, /unavailable pending approval/)
assert.doesNotMatch(unavailableHtml, /Synthetic guidance/)
process.stdout.write('Visitor topic inventory, strict schema, independent operations/privacy/legal workflow, task ordering, default deny, expiry, bilingual inert rendering and retirement checks passed.\n')
