import assert from 'node:assert/strict'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { clinicianFixture } from './lib/clinician-fixture.mjs'
import { validateGovernedRecord, publicEligibility, validateRecordSet } from '../src/content/governed-record.ts'
import { validateStoredRecordChange } from '../src/content/governed-collection.ts'
import { applyWorkflow, createWorkflow } from '../src/content/cms-workflow.ts'
import { ControlledClinicianDetails, controlledClinicianIndex, controlledClinicianResolution } from '../src/content/clinician-view.ts'

const now = new Date('2026-09-16T12:00:00Z')
const fixture = clinicianFixture(now)
const author = { id: 'cms:1', roles: ['author', 'medical', 'reviewer', 'publisher'] }
const medical = { id: 'cms:2', roles: ['medical'] }
const reviewer = { id: 'cms:3', roles: ['reviewer'] }
const publisher = { id: 'cms:4', roles: ['publisher'] }
function action(doc, actor, name, extra = {}, input, time = now) {
  return applyWorkflow(doc, input, { action: name, expectedRevision: doc.workflow.revision, ...extra }, actor, time)
}
function reviewed(input) {
  const created = createWorkflow(input, 'general', author, now)
  return action(action(created, author, 'submit'), medical, 'review-domain', { domain: 'medical', reference: 'Synthetic medical review' })
}
function published(input) {
  return action(action(reviewed(input), reviewer, 'approve'), publisher, 'publish').record
}
function rejects(input, pattern) {
  const result = validateGovernedRecord(input)
  assert.equal(result.ok, false)
  assert.match(result.issues.join('; '), pattern)
}
const record = published(fixture)
assert.equal(validateGovernedRecord(record).ok, true)
assert.deepEqual(controlledClinicianIndex([record], 'en', now), [])
assert.deepEqual(publicEligibility({ ...record, synthetic: false }, now), { eligible: false, reason: 'care-gated' })
assert.throws(() => createWorkflow({ ...fixture, synthetic: false }, 'general', author, now), /Authentic/)
rejects({ ...fixture, clinician: undefined }, /clinician must/)
rejects({ ...fixture, kind: 'service' }, /only allowed on doctor/)
rejects({ ...fixture, clinician: { ...fixture.clinician, identityKey: 'internal-1' } }, /identityKey/)
rejects({ ...fixture, clinician: { ...fixture.clinician, rosterStatus: undefined } }, /rosterStatus/)
rejects({ ...fixture, clinician: { ...fixture.clinician, unsafeClaim: 'invented' } }, /unsupported fields/)
for (const field of ['name', 'professionalTitle', 'credentials', 'specialties', 'interests', 'languages', 'availabilityGuidance']) {
  const value = { ...fixture.clinician.localized.en, [field]: undefined }
  rejects({ ...fixture, clinician: { ...fixture.clinician, localized: { en: value } } }, /clinician/)
}
rejects({ ...fixture, clinician: { ...fixture.clinician, localized: { am: fixture.clinician.localized.en } } }, /English/)
rejects({ ...fixture, localized: { en: { ...fixture.localized.en, title: 'Divergent name' } } }, /canonical localized title/)
rejects({ ...fixture, clinician: { ...fixture.clinician, localized: { en: { ...fixture.clinician.localized.en,
  specialties: ['Synthetic specialty', ' synthetic specialty '], pronouns: 'inferred' } } } }, /unique labels|unsupported/)
for (const schedule of [{ state: 'enabled', reason: 'fake approval', entries: [] },
  { ...fixture.clinician.schedule, entries: [{ day: 'Saturday', time: 'LT' }] },
  { ...fixture.clinician.schedule, governanceEnabled: true }]) {
  rejects({ ...fixture, clinician: { ...fixture.clinician, schedule } }, /schedule remains withheld/)
}
rejects({ ...fixture, clinician: { ...fixture.clinician, appointment: { ...fixture.clinician.appointment,
  href: '/appointments/' } } }, /appointment remains withheld/)
rejects({ ...fixture, clinician: { ...fixture.clinician, portrait: { src: 'https://unapproved.invalid/photo' } } }, /portrait/)
rejects({ ...fixture, clinician: { ...fixture.clinician, locationPublicIds: ['pub_999999999999'] } }, /explicit governed/)
for (const rosterStatus of ['unverified', 'former']) {
  assert.throws(() => action(reviewed({ ...fixture, clinician: { ...fixture.clinician, rosterStatus } }), reviewer, 'approve'), /roster/)
  rejects({ ...record, clinician: { ...record.clinician, rosterStatus } }, /roster/)
}
const submitted = action(createWorkflow(fixture, 'general', author, now), author, 'submit')
assert.throws(() => action(submitted, author, 'review-domain', { domain: 'medical', reference: 'self-review' }), /independent/)
assert.throws(() => action(submitted, { id: 'cms:5', roles: ['clinical'] }, 'review-domain',
  { domain: 'medical', reference: 'wrong-role' }), /medical role/)
assert.throws(() => action(submitted, reviewer, 'approve'), /domain reviews/)
const approved = action(reviewed(fixture), reviewer, 'approve')
assert.throws(() => action(approved, publisher, 'publish', {}, { ...approved.record,
  clinician: { ...approved.record.clinician, rosterStatus: 'former' } }), /Content cannot change/)
assert.throws(() => action(approved, publisher, 'publish', {}, undefined, new Date('2026-10-17T00:00:00Z')), /due for review/)
const returned = action(action(approved, reviewer, 'request-changes', { reason: 'Synthetic correction' }),
  reviewer, 'request-changes', { reason: 'Return to draft' })
const edited = action(returned, author, 'edit', {}, { ...returned.record,
  clinician: { ...returned.record.clinician, localized: { en: { ...returned.record.clinician.localized.en, credentials: ['Synthetic credential'] } } } })
assert.deepEqual(edited.workflow.reviews, {})
assert.equal(edited.record.approval, null)
assert.deepEqual(edited.record.audit.slice(0, -1), returned.record.audit)
assert.throws(() => validateStoredRecordChange({ ...edited.record,
  clinician: { ...edited.record.clinician, identityKey: 'clin_999999999999' } }, returned.record, []), /roster identity cannot change/)

const second = published(clinicianFixture(now, '050505050505'))
assert.deepEqual(validateRecordSet([record, second]), [])
assert.ok(validateRecordSet([record, { ...second, clinician: { ...second.clinician,
  identityKey: record.clinician.identityKey } }]).includes('duplicate clinician roster identity'))
const duplicateName = { ...second, localized: { en: { ...second.localized.en, title: record.localized.en.title } },
  clinician: { ...second.clinician, localized: record.clinician.localized } }
assert.ok(validateRecordSet([record, duplicateName]).some((issue) => issue.includes('duplicate current clinician name')))
assert.deepEqual(controlledClinicianIndex([record, duplicateName], 'en', now, 'controlled-fixture'), [])
const withLocations = { ...record, relationships: [second.publicId],
  clinician: { ...record.clinician, locationPublicIds: [second.publicId] } }
assert.ok(validateRecordSet([withLocations, second]).some((issue) => issue.includes('location record')))
const location = { ...second, kind: 'location', clinician: undefined,
  domainApproval: { ...second.domainApproval, domain: 'operations' } }
assert.equal(validateGovernedRecord(location).ok, true)
assert.equal(controlledClinicianIndex([withLocations, location], 'en', now, 'controlled-fixture').length, 1)
assert.equal(controlledClinicianIndex([withLocations, { ...location, reviewAt: '2026-09-16T11:00:00Z' }], 'en', now, 'controlled-fixture').length, 0)

const view = controlledClinicianIndex([record], 'en', now, 'controlled-fixture')[0]
assert.equal(view.canonicalPath, `/doctors/${fixture.localized.en.slug}/`)
assert.equal(view.appointment.doctorPublicId, record.publicId)
assert.equal(view.appointment.state, 'withheld')
assert.equal(view.portrait, null)
assert.equal(view.schedule, null)
for (const input of [fixture, { ...record, synthetic: false }, { ...record, publishAt: '2026-09-17T00:00:00Z' },
  { ...record, reviewAt: '2026-09-16T11:00:00Z' }, { ...record, expiresAt: '2026-09-16T11:00:00Z' }, null]) {
  assert.deepEqual(controlledClinicianIndex([input], 'en', now, 'controlled-fixture'), [])
}
assert.deepEqual(controlledClinicianIndex([record], 'am', now, 'controlled-fixture'), [])
assert.deepEqual(controlledClinicianIndex([record], 'fr', now, 'controlled-fixture'), [])
assert.deepEqual(controlledClinicianIndex([record], 'en', new Date('invalid'), 'controlled-fixture'), [])
const bilingual = { ...record, localized: { ...record.localized, am: { slug: 'synthetic-shaping-am', title: 'የቁጥጥር ምሳሌ' } },
  clinician: { ...record.clinician, localized: { ...record.clinician.localized,
    am: { ...record.clinician.localized.en, name: 'የቁጥጥር ምሳሌ', specialties: ['የቁጥጥር ምሳሌ'] } } } }
assert.equal(controlledClinicianIndex([bilingual], 'am', now, 'controlled-fixture')[0].canonicalPath, '/am/doctors/synthetic-shaping-am/')
const portrait = { assetPublicId: 'asset_040404040404', source: 'synthetic portrait source', rightsReference: 'synthetic rights',
  consentReference: 'synthetic consent', reviewedAt: '2026-09-16T10:00:00Z', expiresAt: '2026-10-16T10:00:00Z' }
assert.equal(controlledClinicianIndex([{ ...record, clinician: { ...record.clinician, portrait } }], 'en', now, 'controlled-fixture')[0].portrait, null)
assert.throws(() => action(reviewed({ ...fixture, clinician: { ...fixture.clinician,
  portrait: { ...portrait, expiresAt: '2026-09-16T11:00:00Z' } } }), reviewer, 'approve'), /portrait evidence/)
rejects({ ...fixture, clinician: { ...fixture.clinician, portrait: { ...portrait, reviewedAt: '2026-02-30T10:00:00Z' } } }, /portrait/)
const withdrawn = action({ record, workflow: approved.workflow }, publisher, 'withdraw',
  { reason: 'Synthetic genuine successor decision', successorPublicId: second.publicId }).record
assert.equal(validateStoredRecordChange(withdrawn, record, [second]).publicId, record.publicId)
assert.deepEqual(controlledClinicianIndex([withdrawn, second], 'en', now, 'controlled-fixture').map((entry) => entry.publicId), [second.publicId])
assert.deepEqual(controlledClinicianResolution([withdrawn, second], record.publicId, 'en', now, 'controlled-fixture'),
  { state: 'redirect', canonicalPath: `/doctors/${second.localized.en.slug}/` })
const gone = { ...withdrawn, withdrawal: { ...withdrawn.withdrawal, successorPublicId: null } }
assert.equal(controlledClinicianResolution([gone], record.publicId, 'en', now, 'controlled-fixture').state, 'gone')
assert.equal(controlledClinicianResolution([record], record.publicId, 'en', now, 'controlled-fixture').state, 'profile')
assert.equal(controlledClinicianResolution([record], record.publicId, 'en', now).state, 'unavailable')
assert.throws(() => validateStoredRecordChange(withdrawn, record, []), /redirect successor/)
assert.throws(() => validateStoredRecordChange(withdrawn, record, [{ ...second, status: 'draft' }]), /successor must be approved/)
assert.throws(() => action(approved, publisher, 'publish', { successorPublicId: second.publicId }), /only allowed during withdrawal/)

const html = renderToStaticMarkup(createElement(ControlledClinicianDetails,
  { records: [record], publicId: record.publicId, locale: 'en', now, mode: 'controlled-fixture' }))
assert.match(html, /Synthetic clinician fixture/)
assert.match(html, /<h2>/)
assert.doesNotMatch(html, /<a\b|<img\b|<script\b|<button\b|<form\b|<input\b/)
assert.doesNotMatch(html, /Synthetic credential|<p><\/p>/)
const shaping = renderToStaticMarkup(createElement(ControlledClinicianDetails,
  { records: [bilingual], publicId: record.publicId, locale: 'am', now, mode: 'controlled-fixture' }))
assert.match(shaping, /lang="am"/)
assert.match(shaping, /lang="en">Unreviewed Amharic/)
const escaped = structuredClone(record)
escaped.localized.en.title = '<script>synthetic</script>'
escaped.clinician.localized.en.name = escaped.localized.en.title
const escapedHtml = renderToStaticMarkup(createElement(ControlledClinicianDetails,
  { records: [escaped], publicId: record.publicId, locale: 'en', now, mode: 'controlled-fixture' }))
assert.match(escapedHtml, /&lt;script&gt;/)
assert.doesNotMatch(escapedHtml, /<script>/)
process.stdout.write('Controlled clinician schema, medical approval, duplicates, canonical projection, bilingual omission, inert render and retirement checks passed.\n')
