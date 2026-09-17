import assert from 'node:assert/strict'
import { visitorTopicFixture, visitorDecisionInventory } from './lib/visitor-topic-fixture.mjs'
import { cmsVisitorHub } from '../src/content/visitor-topic-cms.ts'
import { publicEligibility } from '../src/content/governed-record.ts'

export async function checkVisitorTopicsDb(payload, { identity, command, denied, fixtureSuffix }) {
  const author = await identity('visitor-author', ['author', 'reviewer', 'operations', 'privacy', 'legal'])
  const other = await identity('visitor-other', ['author'])
  const reviewer = await identity('visitor-reviewer', ['reviewer'])
  const publisher = await identity('visitor-publisher', ['publisher'])
  const manager = await identity('visitor-manager', ['identity-manager'])
  const operations = await identity('visitor-operations', ['operations'])
  const privacy = await identity('visitor-privacy', ['privacy'])
  const legal = await identity('visitor-legal', ['legal'])
  const actors = { operations, privacy, legal }
  const input = visitorTopicFixture(new Date(), `${fixtureSuffix}70`)
  input.localized.am = { slug: `synthetic-visitor-am-${fixtureSuffix}`, title: 'የቁጥጥር ምሳሌ' }
  input.visitorTopic.localized.am = { title: 'የቁጥጥር ምሳሌ', body: 'የቁጥጥር ጽሑፍ ምሳሌ' }
  const create = (record, user = author) => payload.create({ collection: 'governed-records',
    user, overrideAccess: false, data: { record, contentClass: 'general' } })
  const read = (doc) => payload.findByID({ collection: 'governed-records', id: doc.id,
    user: reviewer, overrideAccess: false })
  // The shared workflow guarantees monotonically increasing whole-second audit instants.
  // A fixed read clock just after those instants avoids confusing synthetic audit ordering
  // with a real production timer. Actual elapsed expiry is separately exercised below.
  const clock = () => new Date(Date.now() + 60000)
  const hub = (locale = 'en', user = reviewer, mode = 'controlled-fixture', now = clock()) =>
    cmsVisitorHub(payload, user, locale, now, mode)
  await denied(() => payload.create({ collection: 'governed-records', overrideAccess: true,
    data: { record: input, contentClass: 'general' } }), /persisted CMS identity/)
  let doc = await create(input)
  assert.deepEqual((await read(doc)).record.visitorTopic, input.visitorTopic)
  assert.equal((await hub()).state, 'unavailable')
  await denied(() => cmsVisitorHub(payload, undefined, 'en', clock(), 'controlled-fixture'), /authenticated review/)
  await denied(() => hub('en', other), /authenticated review/)
  await denied(() => payload.findByID({ collection: 'governed-records', id: doc.id,
    user: other, overrideAccess: false }), /not allowed|Forbidden|Not Found/i)
  const duplicate = visitorTopicFixture(new Date(), `${fixtureSuffix}71`)
  await denied(() => create(duplicate, other), /duplicate current visitor topic purpose/)
  duplicate.visitorTopic.purpose = 'arrival'
  duplicate.visitorTopic.identityKey = input.visitorTopic.identityKey
  await denied(() => create(duplicate, other), /duplicate visitor topic identity/)
  await denied(() => command(doc, author, 'edit', {}, { record: { ...doc.record,
    visitorTopic: { ...doc.record.visitorTopic, identityKey: `vst_${fixtureSuffix}99` } } }), /identity and purpose cannot change/)
  const concurrent = await Promise.allSettled([1, 2].map((taskOrder) => command(doc, author, 'edit', {},
    { record: { ...doc.record, visitorTopic: { ...doc.record.visitorTopic, taskOrder } } })))
  assert.equal(concurrent.filter((result) => result.status === 'fulfilled').length, 1)
  assert.match(concurrent.find((result) => result.status === 'rejected').reason.message, /Stale/)
  doc = concurrent.find((result) => result.status === 'fulfilled').value
  doc = await command(doc, author, 'submit')
  await denied(() => command(doc, author, 'review-domain', { domain: 'legal', reference: 'self review' }), /independent/)
  await denied(() => command(doc, reviewer, 'review-domain', { domain: 'legal', reference: 'wrong role' }), /legal role/)
  await denied(() => command(doc, { ...reviewer, roles: ['legal'] }, 'review-domain',
    { domain: 'legal', reference: 'forged request role' }), /legal role/)
  for (const domain of ['operations', 'privacy']) doc = await command(doc, actors[domain], 'review-domain',
    { domain, reference: `Synthetic persisted ${domain} review` })
  const incomplete = await read(doc)
  await denied(() => command(doc, reviewer, 'approve'), /domain reviews/)
  assert.deepEqual((await read(doc)).workflow, incomplete.workflow)
  assert.deepEqual((await read(doc)).record.audit, incomplete.record.audit)
  doc = await command(doc, legal, 'review-domain', { domain: 'legal', reference: 'Synthetic persisted legal review' })
  doc = await command(doc, reviewer, 'approve')
  await denied(() => command(doc, publisher, 'publish', {}, { record: { ...doc.record,
    visitorTopic: { ...doc.record.visitorTopic, dispositionReason: 'Changed after approval' } } }), /Content cannot change/)
  await payload.update({ collection: 'users', id: legal.id, user: manager, overrideAccess: false, data: { roles: ['privacy'] } })
  const before = await read(doc)
  await denied(() => command(doc, publisher, 'publish'), /Domain approval identity is inactive/)
  assert.deepEqual((await read(doc)).record, before.record)
  assert.deepEqual((await read(doc)).workflow, before.workflow)
  await payload.update({ collection: 'users', id: legal.id, user: manager, overrideAccess: false, data: { roles: ['legal'] } })
  doc = await command(doc, publisher, 'publish')
  assert.equal((await hub()).groups[0].topics[0].publicId, doc.publicId)
  assert.equal((await hub('am')).groups[0].topics[0].title, input.localized.am.title)
  assert.equal((await cmsVisitorHub(payload, reviewer, 'en', clock())).state, 'unavailable')
  assert.equal(publicEligibility({ ...doc.record, synthetic: false }, clock()).reason, 'access-gated')
  for (const domain of ['operations', 'privacy', 'legal']) {
    await payload.update({ collection: 'users', id: actors[domain].id, user: manager,
      overrideAccess: false, data: { active: false } })
    assert.equal((await hub()).state, 'unavailable')
    await payload.update({ collection: 'users', id: actors[domain].id, user: manager,
      overrideAccess: false, data: { active: true } })
  }
  await payload.update({ collection: 'users', id: reviewer.id, user: manager,
    overrideAccess: false, data: { roles: ['operations'] } })
  assert.equal((await hub('en', publisher)).state, 'unavailable')
  await payload.update({ collection: 'users', id: reviewer.id, user: manager,
    overrideAccess: false, data: { roles: ['reviewer'] } })
  assert.equal((await hub('en', reviewer, 'controlled-fixture', new Date(doc.record.reviewAt))).state, 'unavailable')
  assert.equal((await hub('en', reviewer, 'controlled-fixture', new Date(doc.record.expiresAt))).state, 'unavailable')
  const audit = doc.record.audit
  doc = await command(doc, publisher, 'withdraw', { reason: 'Synthetic visitor topic retirement' })
  assert.equal((await hub()).state, 'unavailable')
  assert.equal(doc.publicId, input.publicId)
  assert.deepEqual(doc.record.audit.slice(0, -1), audit)
  await denied(() => payload.delete({ collection: 'governed-records', id: doc.id, overrideAccess: true }), /withdrawn/)

  const inventory = visitorDecisionInventory(new Date())
  for (const decision of inventory) {
    // Unique test identities; the complete purpose inventory remains persisted but unavailable.
    decision.publicId = `pub_${fixtureSuffix}${decision.publicId.slice(-2)}a`
    decision.visitorTopic.identityKey = `vst_${fixtureSuffix}${decision.publicId.slice(-3)}`
    decision.localized.en.slug = `synthetic-decision-${decision.publicId.slice(4)}`
    const saved = await create(decision)
    assert.equal(saved.record.visitorTopic.localized.en.body, null)
  }
  assert.equal((await hub()).state, 'unavailable')
  // Replace an unavailable decision through its owning draft; approvals must be fresh.
  const result = await payload.find({ collection: 'governed-records', user: reviewer, overrideAccess: false,
    pagination: false, limit: 1000 })
  let timed = result.docs.find((entry) => entry.record.visitorTopic?.purpose === 'what-to-bring'
    && entry.record.status === 'draft')
  timed = await command(timed, author, 'edit', {}, { record: { ...timed.record,
    visitorTopic: { ...timed.record.visitorTopic, disposition: 'include', temporary: true,
      localized: { en: { ...timed.record.visitorTopic.localized.en, body: 'Synthetic temporary guidance — no real advice.' } } } } })
  timed = await command(timed, author, 'submit')
  for (const [domain, actor] of Object.entries(actors)) timed = await command(timed, actor, 'review-domain',
    { domain, reference: `Synthetic temporary ${domain} review` })
  timed = await command(timed, reviewer, 'approve')
  timed = await command(timed, reviewer, 'request-changes', { reason: 'Synthetic expiry amendment' })
  timed = await command(timed, reviewer, 'request-changes', { reason: 'Return temporary topic to draft' })
  assert.deepEqual(timed.workflow.reviews, {})
  assert.equal(timed.record.approval, null)
  // Allow enough real time for the monotonic audit chain before the brief actual expiry.
  const expiry = new Date(Date.now() + 20000).toISOString().replace(/\.\d{3}Z$/, 'Z')
  timed = await command(timed, author, 'edit', {}, { record: { ...timed.record, expiresAt: expiry } })
  timed = await command(timed, author, 'submit')
  for (const [domain, actor] of Object.entries(actors)) timed = await command(timed, actor, 'review-domain',
    { domain, reference: `Synthetic refreshed ${domain} review` })
  timed = await command(timed, reviewer, 'approve')
  timed = await command(timed, publisher, 'publish')
  await new Promise((resolve) => setTimeout(resolve, Math.max(0, Date.parse(timed.record.approval.at) - Date.now() + 100)))
  assert.equal((await hub('en', reviewer, 'controlled-fixture', new Date())).state, 'controlled-fixture')
  await new Promise((resolve) => setTimeout(resolve, Math.max(0, Date.parse(expiry) - Date.now() + 100)))
  assert.equal((await hub('en', reviewer, 'controlled-fixture', new Date())).state, 'unavailable')
  assert.equal((await read(timed)).record.status, 'published')
  timed = await command(timed, publisher, 'expire', { reason: 'Synthetic temporary expiry reached' })
  assert.equal(timed.record.status, 'expired')
  process.stdout.write('Visitor topics PostgreSQL persistence, complete unavailable inventory, concurrency/rollback, live operations/privacy/legal/approver revocation, bilingual authenticated reads, edit reset and real elapsed temporary expiry passed.\n')
}
