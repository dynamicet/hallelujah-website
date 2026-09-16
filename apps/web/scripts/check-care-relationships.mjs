import assert from 'node:assert/strict'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { applyWorkflow, createWorkflow } from '../src/content/cms-workflow.ts'
import {
  applyCareCommand, careDefinition, careRelationship, createCareRelationship, validateCareSet,
} from '../src/content/care-relationships.ts'
import { ControlledCareDoctor, ControlledCareService, controlledCareGraph, controlledCareHandoff } from '../src/content/care-relationship-view.ts'
import { careFixtures } from './lib/care-relationship-fixture.mjs'

const now = new Date('2026-09-16T12:00:00Z')
const author = { id: 'cms:1', roles: ['author', 'reviewer', 'medical', 'clinical', 'operations', 'publisher'] }
const medical = { id: 'cms:2', roles: ['medical'] }
const clinical = { id: 'cms:3', roles: ['clinical'] }
const operations = { id: 'cms:4', roles: ['operations'] }
const reviewer = { id: 'cms:5', roles: ['reviewer'] }
const publisher = { id: 'cms:6', roles: ['publisher'] }
function publish(input, domain) {
  let doc = createWorkflow(input, 'general', author, now)
  const act = (actor, action, extra = {}) => {
    doc = applyWorkflow(doc, undefined, { action, expectedRevision: doc.workflow.revision, ...extra }, actor, now)
  }
  act(author, 'submit')
  act(domain, 'review-domain', { domain: domain.roles[0], reference: 'Synthetic endpoint review' })
  act(reviewer, 'approve')
  act(publisher, 'publish')
  return doc.record
}
const fixtures = careFixtures(now, '060606060606', true)
const records = [publish(fixtures.location, operations), publish(fixtures.doctor, medical), publish(fixtures.service, clinical)]
function act(link, actor, action, extra = {}, input, inputs = records, time = now) {
  return applyCareCommand(link, input, { action, expectedRevision: link.revision, ...extra }, inputs, actor, time)
}
const draft = createCareRelationship(fixtures.definition, records, author, now)
const submitted = act(draft, author, 'submit')
let reviewed = submitted
for (const actor of [medical, clinical, operations]) reviewed = act(reviewed, actor, 'review-domain',
  { domain: actor.roles[0], reference: 'Explicit synthetic affiliation review' })
const approved = act(reviewed, reviewer, 'approve', { reference: 'Synthetic association approval' })
assert.equal(careRelationship(approved).state, 'approved')
assert.deepEqual(approved.audit.slice(0, draft.audit.length), draft.audit)
for (const key of ['publicId', 'doctorPublicId', 'servicePublicId', 'locationPublicId', 'source', 'reviewAt', 'expiresAt']) {
  assert.throws(() => careDefinition({ ...fixtures.definition, [key]: undefined }))
}
for (const change of [{ synthetic: false }, { doctorPublicId: 'cms:1' }, { reviewAt: '2026-02-30T12:00:00Z' },
  { source: ' ' }, { endpointApproval: 'forged' }, { locationPublicId: fixtures.definition.doctorPublicId }]) {
  assert.throws(() => createCareRelationship({ ...fixtures.definition, ...change }, records, author, now))
}
assert.throws(() => createCareRelationship(fixtures.definition, records, reviewer, now), /author role/)
for (const inputs of [records.slice(1), [null], [...records, records[0]],
  records.map((record) => record.kind === 'service' ? { ...record, status: 'draft' } : record),
  records.map((record) => record.kind === 'location' ? { ...record, reviewAt: '2026-09-16T11:00:00Z' } : record),
  records.map((record) => record.kind === 'doctor' ? { ...record, clinician: { ...record.clinician, locationPublicIds: [] } } : record),
  records.map((record) => record.kind === 'doctor' ? { ...record, synthetic: false } : record)]) {
  assert.throws(() => createCareRelationship(fixtures.definition, inputs, author, now))
}
assert.throws(() => act(submitted, author, 'review-domain', { domain: 'medical', reference: 'Self-review' }), /independent/)
assert.throws(() => act(submitted, clinical, 'review-domain', { domain: 'medical', reference: 'Wrong role' }), /medical role/)
assert.throws(() => act(submitted, medical, 'review-domain', { domain: 'privacy', reference: 'Wrong domain' }), /Unsupported/)
assert.throws(() => act(submitted, medical, 'review-domain', { domain: 'medical', reference: ' ' }), /bounded/)
assert.throws(() => act(submitted, reviewer, 'approve', { reference: 'Missing domains' }), /domain reviews/)
assert.throws(() => act(reviewed, author, 'approve', { reference: 'Self approval' }), /independent/)
assert.throws(() => applyCareCommand(draft, undefined, { action: 'submit', expectedRevision: 0 }, records, author, now), /Stale/)
assert.throws(() => act(reviewed, reviewer, 'approve', { reference: 'Changed content' },
  { ...fixtures.definition, source: 'Changed after reviews' }), /cannot change/)
const changed = records.map((record) => record.kind === 'location'
  ? { ...record, source: { ...record.source, reference: 'Changed endpoint evidence' } } : record)
assert.throws(() => act(reviewed, reviewer, 'approve', { reference: 'Stale endpoint' }, undefined, changed), /endpoint changed/)
assert.throws(() => act(reviewed, reviewer, 'approve', { reference: 'Expired link' }, undefined, records,
  new Date('2026-11-30T12:00:00Z')), /due for review|expired/)
assert.throws(() => act(draft, author, 'edit', {}, { ...fixtures.definition, publicId: 'lnk_999999999999' }), /immutable/)
assert.throws(() => act(draft, reviewer, 'withdraw', { reason: 'Wrong role' }), /publisher role/)
assert.throws(() => act(draft, author, 'no-such-action'), /Unsupported/)
assert.throws(() => careRelationship({ ...approved, reviews: {}, approval: null }), /domain reviews/)
assert.throws(() => careRelationship({ ...approved, approval: { ...approved.approval, actor: author.id } }), /independent/)
assert.throws(() => careRelationship({ ...approved, audit: [approved.audit[0], approved.audit[0]] }), /increasing/)
const duplicate = { ...approved, definition: { ...approved.definition, publicId: 'lnk_999999999999' } }
assert.throws(() => validateCareSet([approved, duplicate]), /Duplicate current/)
assert.throws(() => validateCareSet([approved, approved]), /Duplicate care relationship ID/)
const graph = controlledCareGraph(records, [approved], 'en', now, 'controlled-fixture')
const candidate = { doctorPublicId: fixtures.doctor.publicId, servicePublicId: fixtures.service.publicId,
  locationPublicId: fixtures.location.publicId }
assert.deepEqual(graph.handoffs, [candidate])
assert.deepEqual(graph.doctors[0].relationships, graph.services[0].relationships)
assert.deepEqual(controlledCareHandoff(records, [approved], candidate, 'en', now, 'controlled-fixture'), candidate)
assert.deepEqual(Object.keys(graph.handoffs[0]).sort(), ['doctorPublicId', 'locationPublicId', 'servicePublicId'])
assert.equal(controlledCareHandoff(records, [approved], { ...candidate, email: 'fixture@invalid' },
  'en', now, 'controlled-fixture'), null)
assert.equal(controlledCareHandoff(records, [approved], { ...candidate, doctorPublicId: 'pub_999999999999' },
  'en', now, 'controlled-fixture'), null)
assert.equal(controlledCareHandoff(records, [approved], candidate, 'en', now), null)
assert.equal(controlledCareGraph(records, [approved], 'am', now, 'controlled-fixture').handoffs.length, 1)
for (const [inputs, links, locale, time, mode] of [
  [records, [approved], 'en', now, undefined], [records, [approved], 'fr', now, 'controlled-fixture'],
  [records, [approved], 'en', new Date('invalid'), 'controlled-fixture'],
  [records, [draft], 'en', now, 'controlled-fixture'], [records, [submitted], 'en', now, 'controlled-fixture'],
  [changed, [approved], 'en', now, 'controlled-fixture'], [records, [approved, duplicate], 'en', now, 'controlled-fixture'],
  [records, [approved], 'en', new Date('2026-11-30T12:00:00Z'), 'controlled-fixture'],
  [records.map((record) => ({ ...record, localized: { en: record.localized.en },
    ...(record.clinician ? { clinician: { ...record.clinician, localized: { en: record.clinician.localized.en } } } : {}),
    ...(record.service ? { service: { ...record.service, localized: { en: record.service.localized.en },
      group: { ...record.service.group, localized: { en: record.service.group.localized.en } } } } : {}) })),
  [approved], 'am', now, 'controlled-fixture'],
]) assert.deepEqual(controlledCareGraph(inputs, links, locale, time, mode).handoffs, [])
for (const kind of ['doctor', 'service', 'location']) {
  for (const change of [{ status: 'draft' }, { status: 'approved' }, { synthetic: false },
    { publishAt: '2026-09-17T12:00:00Z' }, { reviewAt: '2026-09-16T11:00:00Z' },
    { expiresAt: '2026-09-16T11:00:00Z' },
    { status: 'withdrawn', withdrawal: { reason: 'Synthetic retirement', successorPublicId: null } }]) {
    const inputs = records.map((record) => record.kind === kind ? { ...record, ...change } : record)
    assert.deepEqual(controlledCareGraph(inputs, [approved], 'en', now, 'controlled-fixture').handoffs, [])
    assert.equal(controlledCareHandoff(inputs, [approved], candidate, 'en', now, 'controlled-fixture'), null)
  }
}
const returned = act(approved, reviewer, 'request-changes', { reason: 'Synthetic correction' })
assert.equal(returned.state, 'draft')
assert.deepEqual(returned.reviews, {})
assert.equal(returned.approval, null)
assert.equal(returned.endpointSnapshot, '')
const edited = act(returned, author, 'edit', {}, { ...fixtures.definition, source: 'Revised synthetic source' })
assert.equal(edited.definition.publicId, draft.definition.publicId)
const withdrawn = act(approved, publisher, 'withdraw', { reason: 'Synthetic affiliation retired' })
assert.deepEqual(withdrawn.audit.slice(0, -1), approved.audit)
assert.deepEqual(controlledCareGraph(records, [withdrawn], 'en', now, 'controlled-fixture').handoffs, [])
validateCareSet([withdrawn, duplicate])
// Generic links alone never create doctor/service affiliations.
assert.deepEqual(controlledCareGraph(records, [], 'en', now, 'controlled-fixture').handoffs, [])
process.stdout.write('Controlled care affiliation schema, independent role reviews, stale/expired/duplicate negatives, bilingual bidirectional graph and inert stable-ID handoffs passed.\n')

const doctorHtml = renderToStaticMarkup(createElement(ControlledCareDoctor, {
  records, links: [approved], publicId: fixtures.doctor.publicId, locale: 'en', now, mode: 'controlled-fixture',
}))
const serviceHtml = renderToStaticMarkup(createElement(ControlledCareService, {
  records, links: [approved], publicId: fixtures.service.publicId, locale: 'en', now, mode: 'controlled-fixture',
}))
assert.ok(doctorHtml.includes(fixtures.service.localized.en.title))
assert.ok(serviceHtml.includes(fixtures.doctor.localized.en.title))
for (const html of [doctorHtml, serviceHtml]) {
  assert.match(html, /Synthetic care relationship fixture/)
  assert.match(html, /<li>/)
  assert.doesNotMatch(html, /<a\b|<img\b|<script\b|<button\b|<form\b|<input\b/)
}
const retiredHtml = renderToStaticMarkup(createElement(ControlledCareDoctor, {
  records, links: [withdrawn], publicId: fixtures.doctor.publicId, locale: 'en', now, mode: 'controlled-fixture',
}))
assert.match(retiredHtml, /Affiliations are withheld/)
assert.ok(!retiredHtml.includes(fixtures.service.localized.en.title))
const shapingHtml = renderToStaticMarkup(createElement(ControlledCareService, {
  records, links: [approved], publicId: fixtures.service.publicId, locale: 'am', now, mode: 'controlled-fixture',
}))
assert.match(shapingHtml, /lang="am"/)
assert.match(shapingHtml, /lang="en">Unreviewed Amharic/)
process.stdout.write('Inert English/Amharic doctor and service affiliation specimens consume the same graph and omit withdrawn links.\n')
