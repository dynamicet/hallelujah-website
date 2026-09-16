import assert from 'node:assert/strict'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { serviceFixture } from './lib/service-fixture.mjs'
import { validateGovernedRecord, publicEligibility, validateRecordSet } from '../src/content/governed-record.ts'
import { validateStoredRecordChange } from '../src/content/governed-collection.ts'
import { applyWorkflow, createWorkflow } from '../src/content/cms-workflow.ts'
import { ControlledServiceDetails, controlledServiceIndex, controlledServiceResolution, controlledServiceTaxonomy } from '../src/content/service-view.ts'

const now = new Date('2026-09-16T12:00:00Z')
const fixture = serviceFixture(now)
const author = { id: 'cms:1', roles: ['author', 'clinical', 'reviewer', 'publisher'] }
const clinical = { id: 'cms:2', roles: ['clinical'] }
const reviewer = { id: 'cms:3', roles: ['reviewer'] }
const publisher = { id: 'cms:4', roles: ['publisher'] }
function action(doc, actor, name, extra = {}, input, time = now) {
  return applyWorkflow(doc, input, { action: name, expectedRevision: doc.workflow.revision, ...extra }, actor, time)
}
function reviewed(input) {
  return action(action(createWorkflow(input, 'general', author, now), author, 'submit'), clinical,
    'review-domain', { domain: 'clinical', reference: 'Synthetic service clinical review' })
}
function published(input) {
  return action(action(reviewed(input), reviewer, 'approve'), publisher, 'publish').record
}
function rejects(input, pattern) {
  const result = validateGovernedRecord(input)
  assert.equal(result.ok, false)
  assert.match(result.issues.join('; '), pattern)
}
function changeService(change) { return { ...fixture, service: { ...fixture.service, ...change } } }
const record = published(fixture)
const approved = action(reviewed(fixture), reviewer, 'approve')
assert.equal(validateGovernedRecord(record).ok, true)
assert.equal(record.service.claims[0].evidence.reviewer, clinical.id)
assert.equal(record.service.claims[0].evidence.reviewedAt, now.toISOString().replace('.000Z', 'Z'))
assert.deepEqual(controlledServiceIndex([record], 'en', now), [])
assert.deepEqual(controlledServiceTaxonomy([record], 'en', now), [])
assert.deepEqual(publicEligibility({ ...record, synthetic: false }, now), { eligible: false, reason: 'care-gated' })
assert.throws(() => createWorkflow({ ...fixture, synthetic: false }, 'general', author, now), /Authentic/)
assert.throws(() => createWorkflow({ ...fixture, service: record.service }, 'general', author, now), /cannot supply clinical approval/)
rejects({ ...fixture, service: undefined }, /service must/)
rejects({ ...fixture, kind: 'page' }, /only allowed on service/)
for (const field of ['identityKey', 'launchDisposition', 'dispositionReason', 'group', 'localized',
  'claims', 'omittedSections', 'locationPublicIds', 'appointment']) rejects(changeService({ [field]: undefined }), /service/)
rejects(changeService({ identityKey: 'internal-1' }), /identityKey/)
rejects(changeService({ unsafeClaim: 'fake surgery claim' }), /unsupported fields/)
rejects(changeService({ appointment: { ...fixture.service.appointment, href: '/appointments/' } }), /remains withheld/)
rejects({ ...fixture, localized: { en: { ...fixture.localized.en, title: 'Divergent title' } } }, /canonical localized/)
rejects(changeService({ localized: { en: { ...fixture.service.localized.en,
  synonyms: ['Synthetic synonym', ' synthetic   synonym '] } } }), /unique labels/)
rejects(changeService({ group: { publicId: 'grp_050505050505', localized: { am: 'የቁጥጥር ምሳሌ' } } }), /match service locales/)
rejects(changeService({ omittedSections: { ...fixture.service.omittedSections, scope: 'Missing scope' } }), /optional sections|both claimed/)
rejects(changeService({ claims: [] }), /section scope/)
rejects(changeService({ claims: [{ ...fixture.service.claims[0], section: 'diagnosis' }] }), /section is unsupported/)
rejects(changeService({ claims: [fixture.service.claims[0], fixture.service.claims[0]] }), /unique opaque|duplicate claim/)
for (const field of ['source', 'scope', 'eligibility', 'limitations', 'availability', 'location', 'owner',
  'reviewReference', 'locationPublicIds', 'expiresAt']) {
  rejects(changeService({ claims: [{ ...fixture.service.claims[0],
    evidence: { ...fixture.service.claims[0].evidence, [field]: undefined } }] }), /evidence/)
}
rejects(changeService({ claims: [{ ...fixture.service.claims[0],
  evidence: { ...fixture.service.claims[0].evidence, reviewedAt: now.toISOString().replace('.000Z', 'Z') } }] }), /cannot supply reviewer/)
rejects(changeService({ claims: [{ ...fixture.service.claims[0],
  evidence: { ...fixture.service.claims[0].evidence, expiresAt: '2026-02-30T00:00:00Z' } }] }), /evidence/)
const submitted = action(createWorkflow(fixture, 'general', author, now), author, 'submit')
assert.throws(() => action(submitted, author, 'review-domain', { domain: 'clinical', reference: 'self-review' }), /independent/)
assert.throws(() => action(submitted, { id: 'cms:5', roles: ['medical'] }, 'review-domain',
  { domain: 'clinical', reference: 'wrong-role' }), /clinical role/)
assert.throws(() => action(submitted, reviewer, 'approve'), /not current|domain reviews/)
for (const launchDisposition of ['omit', 'defer']) {
  assert.throws(() => action(reviewed(changeService({ launchDisposition })), reviewer, 'approve'), /launch subset/)
}
const staleClaim = structuredClone(fixture)
staleClaim.service.claims[0].evidence.expiresAt = '2026-09-16T11:00:00Z'
assert.throws(() => reviewed(staleClaim), /review\/expiry/)
assert.throws(() => action(approved, publisher, 'publish', {}, undefined, new Date('2026-11-16T12:00:00Z')), /not current|due for review/)
assert.throws(() => action(approved, publisher, 'publish', {}, { ...approved.record,
  service: { ...approved.record.service, dispositionReason: 'Changed after approval' } }), /Content cannot change/)
const returned = action(action(approved, reviewer, 'request-changes', { reason: 'Synthetic correction' }),
  reviewer, 'request-changes', { reason: 'Return to draft' })
assert.equal(returned.record.service.claims[0].state, 'review')
assert.equal(returned.record.service.claims[0].evidence.reviewer, null)
assert.equal(returned.record.approval, null)
assert.deepEqual(returned.workflow.reviews, {})
assert.throws(() => action(returned, author, 'edit', {}, { ...returned.record, service: record.service }), /cannot supply service claim approval/)
const edited = action(returned, author, 'edit', {}, { ...returned.record,
  service: { ...returned.record.service, dispositionReason: 'Synthetic correction only' } })
assert.deepEqual(edited.record.audit.slice(0, -1), returned.record.audit)
assert.throws(() => validateStoredRecordChange({ ...edited.record,
  service: { ...edited.record.service, identityKey: 'svc_999999999999' } }, returned.record, []), /service identity cannot change/)

const second = published(serviceFixture(now, '060606060606'))
assert.deepEqual(validateRecordSet([record, second]), [])
const duplicateIdentity = { ...second, service: { ...second.service, identityKey: record.service.identityKey } }
assert.ok(validateRecordSet([record, duplicateIdentity]).includes('duplicate service identity'))
const overlapping = { ...second, service: { ...second.service, localized: { en: {
  ...second.service.localized.en, synonyms: [record.service.localized.en.name] } } } }
assert.ok(validateRecordSet([record, overlapping]).some((issue) => issue.includes('overlapping')))
assert.deepEqual(controlledServiceIndex([record, overlapping], 'en', now, 'controlled-fixture'), [])
const copied = { ...second, service: { ...second.service, claims: [{ ...second.service.claims[0],
  localized: record.service.claims[0].localized }] } }
assert.ok(validateRecordSet([record, copied]).some((issue) => issue.includes('copied cross-service')))
const conflictingGroup = { ...second, service: { ...second.service, group: { ...second.service.group,
  localized: { en: 'Different synthetic group label' } } } }
assert.ok(validateRecordSet([record, conflictingGroup]).some((issue) => issue.includes('conflicting')))
const duplicateGroup = { ...second, service: { ...second.service, group: { ...second.service.group, publicId: 'grp_999999999999' } } }
assert.ok(validateRecordSet([record, duplicateGroup]).some((issue) => issue.includes('duplicate service group')))
const forgedReviewer = structuredClone(record)
forgedReviewer.service.claims[0].evidence.reviewer = 'cms:9'
rejects(forgedReviewer, /match independent clinical approval/)
const withLocation = { ...record, relationships: [second.publicId],
  service: { ...record.service, locationPublicIds: [second.publicId] } }
assert.ok(validateRecordSet([withLocation, second]).some((issue) => issue.includes('location record')))
const location = { ...second, kind: 'location', service: undefined,
  domainApproval: { ...second.domainApproval, domain: 'operations' } }
assert.equal(controlledServiceIndex([withLocation, location], 'en', now, 'controlled-fixture').length, 1)
assert.equal(controlledServiceIndex([withLocation, { ...location, reviewAt: '2026-09-16T11:00:00Z' }], 'en', now, 'controlled-fixture').length, 0)
assert.ok(validateRecordSet([withLocation, { ...location, status: 'draft' }]).some((issue) => issue.includes('approved and current')))

const view = controlledServiceIndex([record], 'en', now, 'controlled-fixture')[0]
assert.equal(view.canonicalPath, `/services/${fixture.localized.en.slug}/`)
assert.deepEqual(view.appointment, { state: 'withheld', servicePublicId: record.publicId })
assert.equal(view.sections.hours, undefined)
assert.deepEqual(controlledServiceTaxonomy([record, second], 'en', now, 'controlled-fixture')[0].services
  .map((entry) => entry.vocabulary), [[record.service.localized.en.name, ...record.service.localized.en.synonyms],
    [second.service.localized.en.name, ...second.service.localized.en.synonyms]])
for (const input of [fixture, { ...record, synthetic: false }, { ...record, publishAt: '2026-09-17T00:00:00Z' },
  { ...record, reviewAt: '2026-09-16T11:00:00Z' }, { ...record, expiresAt: '2026-09-16T11:00:00Z' }, null]) {
  assert.deepEqual(controlledServiceIndex([input], 'en', now, 'controlled-fixture'), [])
}
assert.deepEqual(controlledServiceIndex([record], 'am', now, 'controlled-fixture'), [])
assert.deepEqual(controlledServiceIndex([record], 'fr', now, 'controlled-fixture'), [])
assert.deepEqual(controlledServiceIndex([record], 'en', new Date('invalid'), 'controlled-fixture'), [])
const bilingualInput = structuredClone(fixture)
bilingualInput.localized.am = { slug: 'synthetic-shaping-am', title: 'የቁጥጥር ምሳሌ' }
bilingualInput.service.localized.am = { name: 'የቁጥጥር ምሳሌ', synonyms: [] }
bilingualInput.service.group.localized.am = 'የቡድን ምሳሌ'
bilingualInput.service.claims[0].localized.am = 'የቁጥጥር ጽሑፍ ምሳሌ'
const bilingual = published(bilingualInput)
assert.equal(controlledServiceIndex([bilingual], 'am', now, 'controlled-fixture')[0].canonicalPath, '/am/services/synthetic-shaping-am/')
const untranslatedScope = structuredClone(bilingual)
delete untranslatedScope.service.claims[0].localized.am
assert.deepEqual(controlledServiceIndex([untranslatedScope], 'am', now, 'controlled-fixture'), [])
const withheldInput = structuredClone(fixture)
delete withheldInput.service.omittedSections['tests-treatments']
withheldInput.service.claims.push({ claimId: 'clm_070707070707', section: 'tests-treatments', state: 'withheld',
  localized: { en: 'Synthetic high-consequence claim — must be withheld' }, evidence: null, withholdingReason: 'CARE-05 unresolved' })
const withheld = published(withheldInput)
assert.equal(controlledServiceIndex([withheld], 'en', now, 'controlled-fixture')[0].sections['tests-treatments'], undefined)
const claimExpires = structuredClone(fixture)
claimExpires.service.claims[0].evidence.expiresAt = '2026-09-17T12:00:00Z'
const expiringApproved = action(reviewed(claimExpires), reviewer, 'approve')
assert.throws(() => action(expiringApproved, publisher, 'publish', {}, undefined, new Date('2026-09-18T12:00:00Z')), /claim approval evidence/)
assert.deepEqual(controlledServiceIndex([published(claimExpires)], 'en', new Date('2026-09-18T12:00:00Z'), 'controlled-fixture'), [])
const future = { ...fixture, publishAt: '2026-09-17T12:00:00Z' }
const scheduled = action(action(reviewed(future), reviewer, 'approve'), publisher, 'schedule')
assert.equal(scheduled.record.status, 'scheduled')
assert.deepEqual(controlledServiceIndex([scheduled.record], 'en', now, 'controlled-fixture'), [])
assert.throws(() => action(scheduled, publisher, 'publish'), /not effective/)
assert.equal(action(scheduled, publisher, 'publish', {}, undefined, new Date('2026-09-17T12:00:00Z')).record.status, 'published')

const withdrawn = action({ record, workflow: approved.workflow }, publisher, 'withdraw',
  { reason: 'Synthetic successor decision', successorPublicId: second.publicId }).record
assert.equal(validateStoredRecordChange(withdrawn, record, [second]).service.identityKey, fixture.service.identityKey)
assert.deepEqual(controlledServiceIndex([withdrawn, second], 'en', now, 'controlled-fixture').map((entry) => entry.publicId), [second.publicId])
assert.equal(controlledServiceResolution([withdrawn, second], record.publicId, 'en', now, 'controlled-fixture').state, 'redirect')
assert.equal(controlledServiceResolution([record], record.publicId, 'en', now).state, 'unavailable')
assert.equal(controlledServiceResolution([record], record.publicId, 'en', now, 'controlled-fixture').state, 'service')
const gone = { ...withdrawn, withdrawal: { ...withdrawn.withdrawal, successorPublicId: null } }
assert.equal(controlledServiceResolution([gone], record.publicId, 'en', now, 'controlled-fixture').state, 'gone')
assert.throws(() => validateStoredRecordChange(withdrawn, record, []), /redirect successor/)
assert.throws(() => validateStoredRecordChange(withdrawn, record, [{ ...second, status: 'draft' }]), /successor must be approved/)
const html = renderToStaticMarkup(createElement(ControlledServiceDetails,
  { records: [withheld], publicId: record.publicId, locale: 'en', now, mode: 'controlled-fixture' }))
assert.match(html, /Synthetic service fixture/)
assert.match(html, /<h2>/)
assert.doesNotMatch(html, /<a\b|<img\b|<script\b|<button\b|<form\b|<input\b|<p><\/p>|Synthetic high-consequence/)
const shaping = renderToStaticMarkup(createElement(ControlledServiceDetails,
  { records: [bilingual], publicId: record.publicId, locale: 'am', now, mode: 'controlled-fixture' }))
assert.match(shaping, /lang="am"/)
assert.match(shaping, /lang="en">Unreviewed Amharic/)
const escaped = structuredClone(record)
escaped.service.claims[0].localized.en = '<script>synthetic</script>'
const escapedHtml = renderToStaticMarkup(createElement(ControlledServiceDetails,
  { records: [escaped], publicId: record.publicId, locale: 'en', now, mode: 'controlled-fixture' }))
assert.match(escapedHtml, /&lt;script&gt;/)
assert.doesNotMatch(escapedHtml, /<script>/)
process.stdout.write('Controlled service taxonomy, claim approvals, withheld/expired evidence, duplicate/copy/location negatives, bilingual inert rendering and retirement checks passed.\n')
