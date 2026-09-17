import assert from 'node:assert/strict'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { applyWorkflow, createWorkflow, requiredDomains } from '../src/content/cms-workflow.ts'
import { validateStoredRecordChange } from '../src/content/governed-collection.ts'
import { publicEligibility, validateGovernedRecord, validateRecordSet } from '../src/content/governed-record.ts'
import { institutionalTypes } from '../src/content/institutional-block.ts'
import { controlledInstitutionalView, ControlledInstitutionalView } from '../src/content/institutional-block-view.ts'
import { institutionalBlockFixture } from './lib/institutional-block-fixture.mjs'

const at = new Date('2026-09-17T12:00:00Z')
const now = new Date(at.getTime() + 60000)
const author = { id: 'cms:1', roles: ['author', 'reviewer', 'content', 'brand', 'legal'] }
const reviewer = { id: 'cms:2', roles: ['reviewer'] }
const publisher = { id: 'cms:3', roles: ['publisher'] }
const actors = { content: { id: 'cms:4', roles: ['content'] }, brand: { id: 'cms:5', roles: ['brand'] }, legal: { id: 'cms:6', roles: ['legal'] } }
const fixture = institutionalBlockFixture(at)
const action = (doc, actor, type, extra = {}, input, clock = at) => applyWorkflow(doc, input,
  { action: type, expectedRevision: doc.workflow.revision, ...extra }, actor, clock)
function reviewed(input = fixture) {
  let doc = action(createWorkflow(input, 'general', author, at), author, 'submit')
  for (const [domain, actor] of Object.entries(actors)) doc = action(doc, actor, 'review-domain', { domain, reference: 'Synthetic review' })
  return doc
}
function published(input = fixture) {
  return action(action(reviewed(input), reviewer, 'approve'), publisher, 'publish')
}
function rejects(block, pattern) {
  const result = validateGovernedRecord({ ...fixture, institutionalBlock: { ...fixture.institutionalBlock, ...block } })
  assert.equal(result.ok, false)
  assert.match(result.issues.join('; '), pattern)
}
const doc = published()
assert.equal(validateGovernedRecord(doc.record).ok, true)
assert.deepEqual(requiredDomains(fixture, 'general'), ['content', 'brand', 'legal'])
assert.equal(controlledInstitutionalView([doc], 'en', now).state, 'unavailable')
assert.equal(publicEligibility({ ...doc.record, synthetic: false }, now).reason, 'institution-gated')
for (const type of institutionalTypes) {
  const item = published(institutionalBlockFixture(at, `18${String(institutionalTypes.indexOf(type)).padStart(10, '0')}`, type))
  assert.equal(controlledInstitutionalView([item], 'en', now, 'controlled-fixture').blocks.length, 1)
}
for (const field of ['identityKey', 'type', 'disposition', 'dispositionReason', 'localized', 'evidence', 'leadership', 'relationship']) {
  rejects({ [field]: undefined }, /institutional|leadership|relationship/)
}
rejects({ unexpected: true }, /unsupported/)
rejects({ type: 'coverage' }, /type/)
rejects({ localized: { en: { title: fixture.localized.en.title, body: '' } } }, /body text/)
for (const field of ['source', 'definition', 'limitations', 'asOf', 'reviewAt', 'expiresAt', 'reviewer', 'reviewedAt']) {
  rejects({ evidence: { ...fixture.institutionalBlock.evidence, [field]: undefined } }, /claims require/)
}
rejects({ evidence: { ...fixture.institutionalBlock.evidence, asOf: '2026-02-30T12:00:00Z' } }, /claims require/)
rejects({ evidence: { ...fixture.institutionalBlock.evidence, reviewer: 'cms:4' } }, /paired review stamps/)
const forged = structuredClone(fixture)
forged.institutionalBlock.evidence.reviewer = 'cms:4'
forged.institutionalBlock.evidence.reviewedAt = at.toISOString().replace('.000Z', 'Z')
assert.throws(() => createWorkflow(forged, 'general', author, at), /supply review stamps/)
const draft = createWorkflow(fixture, 'general', author, at)
assert.throws(() => action(draft, author, 'edit', {}, { ...draft.record, institutionalBlock: forged.institutionalBlock }), /supply institutional review/)
const submitted = action(draft, author, 'submit')
for (const domain of Object.keys(actors)) {
  assert.throws(() => action(submitted, author, 'review-domain', { domain, reference: 'self' }), /independent/)
  assert.throws(() => action(submitted, reviewer, 'review-domain', { domain, reference: 'wrong role' }), /role/)
  let incomplete = submitted
  for (const [other, actor] of Object.entries(actors).filter(([other]) => other !== domain)) incomplete = action(incomplete, actor, 'review-domain', { domain: other, reference: 'incomplete' })
  assert.throws(() => action(incomplete, reviewer, 'approve'), /domain reviews|Institutional evidence/)
}
assert.throws(() => action(submitted, author, 'approve'), /self-approve/)
assert.throws(() => applyWorkflow(submitted, undefined, { action: 'approve', expectedRevision: 0 }, reviewer, at), /Stale/)
for (const disposition of ['unavailable', 'defer', 'omit']) {
  const decision = structuredClone(fixture)
  Object.assign(decision.institutionalBlock, { disposition, evidence: null, localized: { en: { title: fixture.localized.en.title, body: null } } })
  assert.equal(validateGovernedRecord(decision).ok, true)
  assert.throws(() => action(reviewed(decision), reviewer, 'approve'), /Institutional evidence/)
}
const mission = institutionalBlockFixture(at, '191919191919', 'mission')
const competing = institutionalBlockFixture(at, '202020202020', 'mission')
assert.ok(validateRecordSet([mission, competing]).includes('competing current mission text requires reconciliation'))
assert.ok(validateRecordSet([fixture, { ...competing, institutionalBlock: { ...competing.institutionalBlock, identityKey: fixture.institutionalBlock.identityKey } }]).includes('duplicate institutional identity'))
const approved = action(reviewed(), reviewer, 'approve')
const returned = action(action(approved, reviewer, 'request-changes', { reason: 'Synthetic correction' }), reviewer, 'request-changes', { reason: 'Return to draft' })
assert.equal(returned.record.institutionalBlock.evidence.reviewer, null)
assert.deepEqual(returned.workflow.reviews, {})
const edited = action(returned, author, 'edit', {}, returned.record)
for (const fields of [{ identityKey: 'ins_212121212121' }, { type: 'mission' }]) {
  assert.throws(() => validateStoredRecordChange({ ...edited.record, institutionalBlock: { ...edited.record.institutionalBlock, ...fields } }, returned.record, []), /identity and type cannot change/)
}
for (const field of ['asOf', 'reviewAt', 'expiresAt']) {
  const stale = structuredClone(doc)
  stale.record.institutionalBlock.evidence[field] = field === 'asOf' ? '2026-09-18T12:00:00Z' : now.toISOString().replace('.000Z', 'Z')
  assert.equal(controlledInstitutionalView([stale], 'en', now, 'controlled-fixture').blocks.length, 0)
}
for (const field of ['reviewAt', 'expiresAt']) {
  assert.equal(controlledInstitutionalView([doc], 'en', new Date(doc.record.institutionalBlock.evidence[field]), 'controlled-fixture').state, 'unavailable')
}
for (const domain of Object.keys(actors)) {
  const missing = structuredClone(doc)
  delete missing.workflow.reviews[domain]
  assert.equal(controlledInstitutionalView([missing], 'en', now, 'controlled-fixture').state, 'unavailable')
}
const relationship = institutionalBlockFixture(at, '222222222222', 'relationship')
const badCoverage = structuredClone(relationship)
badCoverage.institutionalBlock.relationship.coverage = 'accepted'
assert.equal(validateGovernedRecord(badCoverage).ok, false)
const relationshipHtml = renderToStaticMarkup(createElement(ControlledInstitutionalView, { documents: [published(relationship)], locale: 'en', now, mode: 'controlled-fixture' }))
assert.match(relationshipHtml, /Insurance coverage is unverified/)
assert.match(relationshipHtml, /As of:/)
const bilingual = structuredClone(fixture)
bilingual.localized.am = { slug: 'synthetic-institution-am', title: 'የቁጥጥር ምሳሌ' }
bilingual.institutionalBlock.localized.am = { title: bilingual.localized.am.title, body: 'የቁጥጥር ጽሑፍ ምሳሌ' }
assert.equal(controlledInstitutionalView([doc], 'am', now, 'controlled-fixture').state, 'unavailable')
const shaping = renderToStaticMarkup(createElement(ControlledInstitutionalView, { documents: [published(bilingual)], locale: 'am', now, mode: 'controlled-fixture' }))
assert.match(shaping, /lang="am"/)
assert.match(shaping, /Unreviewed Amharic/)
const escaped = structuredClone(fixture)
escaped.institutionalBlock.localized.en.body = '<script>synthetic</script>'
const html = renderToStaticMarkup(createElement(ControlledInstitutionalView, { documents: [published(escaped)], locale: 'en', now, mode: 'controlled-fixture' }))
assert.match(html, /&lt;script&gt;/)
assert.doesNotMatch(html, /<a\b|<img\b|<script\b|<form\b|<button\b/)
const withdrawn = action(doc, publisher, 'withdraw', { reason: 'Synthetic retirement' })
assert.equal(validateStoredRecordChange(withdrawn.record, doc.record, []).publicId, doc.record.publicId)
assert.equal(controlledInstitutionalView([withdrawn], 'en', now, 'controlled-fixture').state, 'unavailable')
process.stdout.write('Institutional strict schema, claim evidence, mission conflicts, independent reviews, immutable identity, default deny, expiry, bilingual omission and inert rendering passed.\n')
