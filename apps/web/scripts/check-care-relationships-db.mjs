import assert from 'node:assert/strict'
import { careFixtures } from './lib/care-relationship-fixture.mjs'
import { cmsCareGraph } from '../src/content/care-relationship-collection.ts'

export async function checkCareRelationshipsDb(payload, { identity, command, denied, fixtureSuffix }) {
  const author = await identity('care-author', ['author', 'medical', 'clinical', 'operations', 'reviewer'])
  const other = await identity('care-other', ['author'])
  const medical = await identity('care-medical', ['medical'])
  const clinical = await identity('care-clinical', ['clinical'])
  const operations = await identity('care-operations', ['operations'])
  const reviewer = await identity('care-reviewer', ['reviewer'])
  const publisher = await identity('care-publisher', ['publisher'])
  const manager = await identity('care-manager', ['identity-manager'])
  const fixtures = careFixtures(new Date(), `${fixtureSuffix}14`, true)
  async function publish(input, domain) {
    let doc = await payload.create({ collection: 'governed-records', user: author, overrideAccess: false,
      data: { record: input, contentClass: 'general' } })
    doc = await command(doc, author, 'submit')
    doc = await command(doc, domain, 'review-domain', { domain: domain.roles[0], reference: 'Synthetic persisted endpoint review' })
    doc = await command(doc, reviewer, 'approve')
    return command(doc, publisher, 'publish')
  }
  const location = await publish(fixtures.location, operations)
  const doctor = await publish(fixtures.doctor, medical)
  const service = await publish(fixtures.service, clinical)
  const create = (definition, user = author, data = {}) => payload.create({
    collection: 'care-relationships', user, overrideAccess: false, data: { definition, ...data },
  })
  const act = (doc, user, action, extra = {}, definition) => payload.update({
    collection: 'care-relationships', id: doc.id, user, overrideAccess: false,
    data: { ...(definition ? { definition } : {}), command: { action, expectedRevision: doc.relationship.revision, ...extra } },
  })
  const read = (doc) => payload.findByID({ collection: 'care-relationships', id: doc.id, user: reviewer, overrideAccess: false })
  const graph = (time = new Date(), locale = 'en') => cmsCareGraph(payload, reviewer, locale, time, 'controlled-fixture')
  await denied(() => payload.create({ collection: 'care-relationships', overrideAccess: true,
    data: { definition: fixtures.definition } }), /persisted CMS identity/)
  await denied(() => create(fixtures.definition, author, { relationship: { state: 'approved' } }), /metadata/)
  await denied(() => create({ ...fixtures.definition, doctorPublicId: location.publicId }), /distinct|matching/)
  let doc = await create(fixtures.definition)
  assert.deepEqual((await read(doc)).relationship.definition, fixtures.definition)
  await denied(() => payload.findByID({ collection: 'care-relationships', id: doc.id, user: other, overrideAccess: false }),
    /not allowed|Forbidden|Not Found/i)
  await denied(() => cmsCareGraph(payload, undefined, 'en', new Date(), 'controlled-fixture'), /authenticated/)
  await denied(() => cmsCareGraph(payload, other, 'en', new Date(), 'controlled-fixture'), /authenticated/)
  // The fixture author has review roles but must not gain approval powers over their own association.
  await denied(() => act(doc, other, 'submit'), /owning author/)
  await denied(() => create({ ...fixtures.definition, publicId: `lnk_${fixtureSuffix}15` }), /Duplicate current/)
  assert.equal((await graph()).handoffs.length, 0)
  const concurrent = await Promise.allSettled([
    act(doc, author, 'edit', {}, { ...fixtures.definition, source: 'Synthetic concurrent affiliation A' }),
    act(doc, author, 'edit', {}, { ...fixtures.definition, source: 'Synthetic concurrent affiliation B' }),
  ])
  assert.equal(concurrent.filter((result) => result.status === 'fulfilled').length, 1)
  assert.match(concurrent.find((result) => result.status === 'rejected').reason.message, /Stale/)
  doc = concurrent.find((result) => result.status === 'fulfilled').value
  await denied(() => act(doc, author, 'edit', {}, { ...doc.relationship.definition, publicId: `lnk_${fixtureSuffix}16` }), /immutable/)
  doc = await act(doc, author, 'submit')
  await denied(() => act(doc, author, 'review-domain', { domain: 'medical', reference: 'Self review' }), /independent/)
  await denied(() => act(doc, clinical, 'review-domain', { domain: 'medical', reference: 'Wrong role' }), /medical role/)
  await denied(() => act(doc, reviewer, 'approve', { reference: 'Missing domains' }), /domain reviews/)
  for (const user of [medical, clinical, operations]) {
    doc = await act(doc, user, 'review-domain', { domain: user.roles[0], reference: 'Synthetic explicit care affiliation' })
  }
  const beforeDenied = await read(doc)
  await payload.update({ collection: 'users', id: clinical.id, user: manager, overrideAccess: false, data: { roles: ['medical'] } })
  await denied(() => act(doc, reviewer, 'approve', { reference: 'Revoked clinical review' }), /inactive|matching role/)
  assert.deepEqual((await read(doc)).relationship, beforeDenied.relationship, 'failed approval must roll back revision and audit')
  await payload.update({ collection: 'users', id: clinical.id, user: manager, overrideAccess: false, data: { roles: ['clinical'] } })
  await denied(() => act(doc, reviewer, 'approve', { reference: 'Changed content' },
    { ...doc.relationship.definition, source: 'Forged changed source' }), /cannot change/)
  doc = await act(doc, reviewer, 'approve', { reference: 'Synthetic independent association acceptance' })
  const candidate = { doctorPublicId: doctor.publicId, servicePublicId: service.publicId, locationPublicId: location.publicId }
  assert.deepEqual((await graph()).handoffs, [candidate])
  assert.deepEqual((await graph(new Date(), 'am')).handoffs, [candidate])
  const approvedGraph = await graph()
  assert.deepEqual(approvedGraph.doctors.find((view) => view.doctor.publicId === doctor.publicId).relationships,
    approvedGraph.services.find((view) => view.service.publicId === service.publicId).relationships)
  assert.deepEqual((await cmsCareGraph(payload, reviewer, 'en', new Date())).handoffs, [])
  assert.deepEqual((await graph(new Date(doc.relationship.definition.reviewAt))).handoffs, [])
  // Revocation after approval also removes both read paths; restoring the role restores valid evidence.
  await payload.update({ collection: 'users', id: medical.id, user: manager, overrideAccess: false, data: { active: false } })
  assert.deepEqual((await graph()).handoffs, [])
  await payload.update({ collection: 'users', id: medical.id, user: manager, overrideAccess: false, data: { active: true } })
  await payload.update({ collection: 'users', id: reviewer.id, user: manager, overrideAccess: false, data: { roles: ['operations'] } })
  assert.deepEqual((await cmsCareGraph(payload, publisher, 'en', new Date(), 'controlled-fixture')).handoffs, [])
  await payload.update({ collection: 'users', id: reviewer.id, user: manager, overrideAccess: false, data: { roles: ['reviewer'] } })
  const audit = doc.relationship.audit
  doc = await act(doc, reviewer, 'request-changes', { reason: 'Synthetic reauthoring' })
  assert.deepEqual((await graph()).handoffs, [])
  assert.deepEqual(doc.relationship.reviews, {})
  assert.equal(doc.relationship.approval, null)
  assert.deepEqual(doc.relationship.audit.slice(0, -1), audit)
  doc = await act(doc, author, 'edit', {}, { ...doc.relationship.definition, source: 'Synthetic revised association evidence' })
  doc = await act(doc, author, 'submit')
  for (const user of [medical, clinical, operations]) doc = await act(doc, user, 'review-domain',
    { domain: user.roles[0], reference: 'Synthetic revised affiliation review' })
  doc = await act(doc, reviewer, 'approve', { reference: 'Synthetic revised independent acceptance' })
  assert.deepEqual((await graph()).handoffs, [candidate])
  await command(doctor, publisher, 'withdraw', { reason: 'Synthetic doctor retired' })
  assert.deepEqual((await graph()).handoffs, [])
  const retired = await act(doc, publisher, 'withdraw', { reason: 'Synthetic association retired' })
  assert.equal(retired.publicId, fixtures.definition.publicId)
  assert.deepEqual(retired.relationship.audit.slice(0, -1), doc.relationship.audit)
  await denied(() => payload.delete({ collection: 'care-relationships', id: doc.id, overrideAccess: true }), /withdrawn/)
  await denied(() => create({ ...fixtures.definition, publicId: `lnk_${fixtureSuffix}17` }), /approved\/current/)
  process.stdout.write('Care PostgreSQL persistence, concurrent stale-write denial, duplicate/role/metadata negatives, approval rollback, live revocation, bilingual symmetric reads, expiry and endpoint retirement passed.\n')
}
