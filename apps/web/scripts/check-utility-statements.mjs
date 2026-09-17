import assert from 'node:assert/strict'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { applyWorkflow, createWorkflow, requiredDomains } from '../src/content/cms-workflow.ts'
import { validateStoredRecordChange } from '../src/content/governed-collection.ts'
import { publicEligibility, validateGovernedRecord, validateRecordSet } from '../src/content/governed-record.ts'
import { controlledStatementView, controlledCollectionContract, ControlledStatementDetails } from '../src/content/utility-statement-view.ts'
import { utilityStatementFixture } from './lib/utility-statement-fixture.mjs'
import { siteSettingsFixture } from './lib/site-settings-fixture.mjs'

const at = new Date('2026-09-17T12:00:00Z')
const now = new Date(at.getTime() + 60000)
const author = { id: 'cms:1', roles: ['author', 'reviewer', 'content', 'privacy', 'legal', 'accessibility', 'operations'] }
const reviewer = { id: 'cms:2', roles: ['reviewer'] }
const publisher = { id: 'cms:3', roles: ['publisher'] }
const actors = Object.fromEntries(['content', 'privacy', 'legal', 'accessibility', 'operations'].map((role, index) =>
  [role, { id: `cms:${index + 4}`, roles: [role] }]))
const fixture = utilityStatementFixture(at)
const action = (doc, actor, type, extra = {}, input, clock = at) => applyWorkflow(doc, input,
  { action: type, expectedRevision: doc.workflow.revision, ...extra }, actor, clock)
const contentClass = (input) => input.kind === 'site-settings' ? 'contact'
  : input.utilityStatement.type === 'privacy' ? 'privacy' : 'general'
function reviewed(input = fixture) {
  let doc = action(createWorkflow(input, contentClass(input), author, at), author, 'submit')
  for (const domain of requiredDomains(input, contentClass(input))) doc = action(doc, actors[domain], 'review-domain', { domain, reference: 'Synthetic statement review' })
  return doc
}
function published(input = fixture) {
  return action(action(reviewed(input), reviewer, 'approve'), publisher, 'publish')
}
function rejects(fields, pattern) {
  const result = validateGovernedRecord({ ...fixture, utilityStatement: { ...fixture.utilityStatement, ...fields } })
  assert.equal(result.ok, false)
  assert.match(result.issues.join('; '), pattern)
}
const doc = published()
assert.deepEqual(requiredDomains(fixture, 'privacy'), ['content', 'privacy', 'legal'])
assert.deepEqual(requiredDomains(utilityStatementFixture(at, '919191919191', 'accessibility'), 'general'), ['content', 'accessibility'])
assert.equal(controlledStatementView([doc], 'privacy', 'en', now).state, 'unavailable')
assert.equal(publicEligibility({ ...doc.record, synthetic: false }, now).reason, 'policy-gated')
assert.equal(controlledStatementView([doc], 'privacy', 'en', now, 'controlled-fixture').state, 'controlled-fixture')
assert.equal(controlledStatementView([doc], 'privacy', 'am', now, 'controlled-fixture').state, 'unavailable')
assert.equal(controlledCollectionContract([doc], doc.record.publicId, 'appointment', fixture.utilityStatement.inventory, now, 'controlled-fixture').reason, 'feature-disabled')
for (const field of Object.keys(fixture.utilityStatement)) rejects({ [field]: undefined }, /statement|privacy/)
rejects({ unknown: true }, /unsupported/)
rejects({ version: 0 }, /positive version/)
rejects({ version: 2 }, /predecessor/)
rejects({ effectiveAt: '2026-02-30T12:00:00Z' }, /dates/)
rejects({ contact: { ...fixture.utilityStatement.contact, value: 'invented contact' } }, /contact/)
rejects({ inventory: { ...fixture.utilityStatement.inventory, flows: [] } }, /processing inventory/)
for (const field of Object.keys(fixture.utilityStatement.inventory.flows[0])) {
  const inventory = structuredClone(fixture.utilityStatement.inventory)
  inventory.flows[0][field] = undefined
  rejects({ inventory }, /processing inventory/)
}
for (const mutate of [
  (inventory) => { inventory.flows[0].state = 'enabled' },
  (inventory) => { inventory.flows[0].providers = ['provider'] },
  (inventory) => { inventory.flows[0].feature = 'health-data' },
  (inventory) => { inventory.flows[1].feature = inventory.flows[0].feature },
]) {
  const inventory = structuredClone(fixture.utilityStatement.inventory)
  mutate(inventory)
  rejects({ inventory }, /processing inventory/)
}
const forged = structuredClone(fixture)
forged.utilityStatement.reviewedAt = at.toISOString().replace('.000Z', 'Z')
assert.throws(() => createWorkflow(forged, 'privacy', author, at), /supply review stamps/)
assert.throws(() => createWorkflow(fixture, 'general', author, at), /matching controlled content class/)
const draft = createWorkflow(fixture, 'privacy', author, at)
assert.throws(() => action(draft, author, 'edit', {}, { ...draft.record, utilityStatement: forged.utilityStatement }), /supply statement review/)
const submitted = action(draft, author, 'submit')
for (const domain of ['content', 'privacy', 'legal']) {
  assert.throws(() => action(submitted, author, 'review-domain', { domain, reference: 'self' }), /independent/)
  assert.throws(() => action(submitted, reviewer, 'review-domain', { domain, reference: 'wrong role' }), /role/)
  let incomplete = submitted
  for (const other of ['content', 'privacy', 'legal'].filter((value) => value !== domain)) incomplete = action(incomplete, actors[other], 'review-domain', { domain: other, reference: 'incomplete' })
  assert.throws(() => action(incomplete, reviewer, 'approve'), /domain reviews|Statement/)
}
assert.throws(() => action(submitted, author, 'approve'), /self-approve/)
assert.throws(() => applyWorkflow(submitted, undefined, { action: 'approve', expectedRevision: 0 }, reviewer, at), /Stale/)
const approved = action(reviewed(), reviewer, 'approve')
const returned = action(action(approved, reviewer, 'request-changes', { reason: 'Review again' }), reviewer, 'request-changes', { reason: 'Return to draft' })
assert.equal(returned.record.utilityStatement.reviewedAt, null)
assert.deepEqual(returned.workflow.reviews, {})
const edited = action(returned, author, 'edit', {}, returned.record)
for (const fields of [{ identityKey: 'stmt_929292929292' }, { version: 2, supersedesPublicId: 'pub_939393939393' }]) {
  assert.throws(() => validateStoredRecordChange({ ...edited.record, utilityStatement: { ...edited.record.utilityStatement, ...fields } }, returned.record, []), /cannot change/)
}
const retired = action(doc, publisher, 'withdraw', { reason: 'Synthetic successor preparation' })
assert.equal(validateStoredRecordChange(retired.record, doc.record, []).publicId, doc.record.publicId)
const successorInput = utilityStatementFixture(new Date(at.getTime() + 1000), '949494949494')
Object.assign(successorInput.utilityStatement, { identityKey: fixture.utilityStatement.identityKey, version: 2, supersedesPublicId: doc.record.publicId })
const successor = published(successorInput)
assert.ok(validateRecordSet([doc.record, successor.record]).some((issue) => /retire|competing/.test(issue)))
assert.deepEqual(validateRecordSet([retired.record, successor.record]), [])
assert.ok(validateRecordSet([successor.record]).some((issue) => /predecessor/.test(issue)))
assert.equal(controlledStatementView([retired, successor], 'privacy', 'en', now, 'controlled-fixture').publicId, successor.record.publicId)
assert.equal(controlledCollectionContract([retired, successor], doc.record.publicId, 'appointment', fixture.utilityStatement.inventory, now, 'controlled-fixture').reason, 'version-mismatch')
assert.throws(() => validateStoredRecordChange({ ...retired.record, status: 'withdrawn',
  utilityStatement: { ...retired.record.utilityStatement, contact: { ...retired.record.utilityStatement.contact, purpose: 'tampered' } },
  audit: [...retired.record.audit, { actor: publisher.id, at: now.toISOString().replace('.000Z', 'Z'), change: 'tampered' }] }, retired.record, []), /historical statement content is immutable/)
const settings = published(siteSettingsFixture(at))
const bound = structuredClone(fixture)
bound.publicId = 'pub_959595959595'
bound.utilityStatement.identityKey = 'stmt_959595959595'
bound.relationships = [settings.record.publicId]
bound.utilityStatement.contact = { state: 'bound', settingsPublicId: settings.record.publicId,
  fact: 'email', purpose: 'Synthetic rights contact', operationsReference: 'Synthetic operations scope verification' }
bound.utilityStatement.inventory.flows[0].state = 'planned'
const boundDoc = published(bound)
const inventory = bound.utilityStatement.inventory
const evaluate = (documents = [settings, boundDoc], expected = boundDoc.record.publicId, processing = inventory, clock = now) =>
  controlledCollectionContract(documents, expected, 'appointment', processing, clock, 'controlled-fixture')
assert.deepEqual(evaluate(), { enabled: false, contractMatches: true, reason: 'controlled-only' })
assert.equal(controlledCollectionContract([settings, boundDoc], boundDoc.record.publicId, 'appointment', inventory, now).enabled, false)
const mismatch = structuredClone(inventory)
mismatch.flows[0].retention = 'Materially changed retention'
assert.equal(evaluate(undefined, undefined, mismatch).reason, 'inventory-mismatch')
for (const field of ['effectiveAt', 'reviewAt', 'expiresAt']) {
  const stale = structuredClone(boundDoc)
  if (field === 'effectiveAt') stale.record.publishAt = stale.record.utilityStatement.effectiveAt = '2026-09-18T12:00:00Z'
  else stale.record[field] = stale.record.utilityStatement[field] = now.toISOString().replace('.000Z', 'Z')
  assert.equal(evaluate([settings, stale]).contractMatches, false)
}
const dueSettings = structuredClone(settings)
dueSettings.record.siteSettings.email.expiresAt = now.toISOString().replace('.000Z', 'Z')
assert.equal(evaluate([dueSettings, boundDoc]).reason, 'dependency-unavailable')
assert.equal(controlledStatementView([dueSettings, boundDoc], 'privacy', 'en', now, 'controlled-fixture').contact.value, null)
const retiredSettings = action(settings, publisher, 'withdraw', { reason: 'Synthetic support unavailable' })
assert.deepEqual(validateRecordSet([retiredSettings.record, boundDoc.record]), [])
assert.equal(evaluate([retiredSettings, boundDoc]).reason, 'dependency-unavailable')
assert.equal(controlledStatementView([retiredSettings, boundDoc], 'privacy', 'en', now, 'controlled-fixture').contact.state, 'unavailable')
const missingReview = structuredClone(boundDoc)
delete missingReview.workflow.reviews.privacy
assert.equal(evaluate([settings, missingReview]).reason, 'policy-unavailable')
const accessInput = utilityStatementFixture(at, '969696969696', 'accessibility')
const access = published(accessInput)
for (const field of Object.keys(accessInput.utilityStatement.testing)) {
  const invalid = structuredClone(accessInput)
  invalid.utilityStatement.testing[field] = undefined
  assert.equal(validateGovernedRecord(invalid).ok, false)
}
const certification = structuredClone(accessInput)
certification.utilityStatement.testing.claim = 'fully-compliant'
assert.equal(validateGovernedRecord(certification).ok, false)
const futureTest = structuredClone(accessInput)
futureTest.utilityStatement.testing.testedAt = '2026-09-18T12:00:00Z'
assert.throws(() => published(futureTest), /Statement/)
const bilingual = structuredClone(accessInput)
bilingual.localized.am = { slug: 'synthetic-accessibility-am', title: 'የቁጥጥር ምሳሌ' }
bilingual.utilityStatement.localized.am = { title: bilingual.localized.am.title,
  sections: [{ key: 'scope', heading: 'የቁጥጥር ምሳሌ', body: 'የቁጥጥር ጽሑፍ ምሳሌ' }] }
const shaping = renderToStaticMarkup(createElement(ControlledStatementDetails, {
  documents: [published(bilingual)], type: 'accessibility', locale: 'am', now, mode: 'controlled-fixture' }))
assert.match(shaping, /lang="am"/)
assert.match(shaping, /Unreviewed Amharic/)
const escaped = structuredClone(accessInput)
escaped.utilityStatement.localized.en.sections[0].body = '<script>synthetic</script>'
const html = renderToStaticMarkup(createElement(ControlledStatementDetails, {
  documents: [published(escaped)], type: 'accessibility', locale: 'en', now, mode: 'controlled-fixture' }))
assert.match(html, /&lt;script&gt;/)
assert.match(html, /Known limitations|known limitations/)
assert.match(html, /no conformance certification/)
assert.match(html, /href="#statement-accessibility-scope"/)
assert.doesNotMatch(html, /<img\b|<script\b|<form\b|<button\b|href="(?:https?:|mailto:|tel:)/)
assert.equal(controlledStatementView([access], 'privacy', 'en', now, 'controlled-fixture').state, 'unavailable')
process.stdout.write('Versioned statement schema, independent privacy/legal/accessibility reviews, immutable history, predecessor conflicts, exact inventory/version matching, default-denied collection, contact expiry and inert bilingual rendering passed.\n')
