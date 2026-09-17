import assert from 'node:assert/strict'
import { cmsInstitutionalView } from '../src/content/institutional-block-cms.ts'
import { institutionalBlockFixture } from './lib/institutional-block-fixture.mjs'

export async function checkInstitutionalBlocksDb(payload, { identity, command, denied, fixtureSuffix }) {
  const author = await identity('institution-author', ['author', 'reviewer', 'content', 'brand', 'legal'])
  const other = await identity('institution-other', ['author'])
  const reviewer = await identity('institution-reviewer', ['reviewer'])
  const publisher = await identity('institution-publisher', ['publisher'])
  const manager = await identity('institution-manager', ['identity-manager'])
  const actors = { content: await identity('institution-content', ['content']),
    brand: await identity('institution-brand', ['brand']), legal: await identity('institution-legal', ['legal']) }
  const create = (record, user = author) => payload.create({ collection: 'governed-records',
    user, overrideAccess: false, data: { record, contentClass: 'general' } })
  const read = (doc) => payload.findByID({ collection: 'governed-records', id: doc.id, user: reviewer, overrideAccess: false })
  const clock = () => new Date(Date.now() + 60000)
  const view = (locale = 'en', user = reviewer, mode = 'controlled-fixture', now = clock()) =>
    cmsInstitutionalView(payload, user, locale, now, mode)
  async function review(doc) {
    doc = await command(doc, author, 'submit')
    for (const [domain, actor] of Object.entries(actors)) doc = await command(doc, actor, 'review-domain', { domain, reference: 'Synthetic persisted institutional review' })
    return command(doc, reviewer, 'approve')
  }
  const input = institutionalBlockFixture(new Date(), `${fixtureSuffix}80`, 'mission')
  input.localized.am = { slug: `synthetic-institution-am-${fixtureSuffix}`, title: 'የቁጥጥር ምሳሌ' }
  input.institutionalBlock.localized.am = { title: input.localized.am.title, body: 'የቁጥጥር ጽሑፍ ምሳሌ' }
  await denied(() => cmsInstitutionalView(payload, undefined, 'en', clock(), 'controlled-fixture'), /authenticated review/)
  await denied(() => view('en', other), /authenticated review/)
  let doc = await create(input)
  assert.deepEqual((await read(doc)).record.institutionalBlock, input.institutionalBlock)
  await denied(() => create(institutionalBlockFixture(new Date(), `${fixtureSuffix}81`, 'mission'), other), /competing current mission/)
  const duplicate = institutionalBlockFixture(new Date(), `${fixtureSuffix}82`)
  duplicate.institutionalBlock.identityKey = input.institutionalBlock.identityKey
  await denied(() => create(duplicate), /duplicate institutional identity/)
  await denied(() => command(doc, author, 'edit', {}, { record: { ...doc.record,
    institutionalBlock: { ...doc.record.institutionalBlock, type: 'fact' } } }), /identity and type cannot change/)
  const concurrent = await Promise.allSettled([1, 2].map((n) => command(doc, author, 'edit', {},
    { record: { ...doc.record, institutionalBlock: { ...doc.record.institutionalBlock, dispositionReason: `Synthetic edit ${n}` } } })))
  assert.equal(concurrent.filter((result) => result.status === 'fulfilled').length, 1)
  assert.match(concurrent.find((result) => result.status === 'rejected').reason.message, /Stale/)
  doc = concurrent.find((result) => result.status === 'fulfilled').value
  doc = await command(doc, author, 'submit')
  await denied(() => command(doc, author, 'review-domain', { domain: 'content', reference: 'self' }), /independent/)
  await denied(() => command(doc, { ...reviewer, roles: ['content'] }, 'review-domain', { domain: 'content', reference: 'forged role' }), /content role/)
  doc = await command(doc, actors.content, 'review-domain', { domain: 'content', reference: 'Synthetic content evidence' })
  const incomplete = await read(doc)
  await denied(() => command(doc, reviewer, 'approve'), /domain reviews/)
  assert.deepEqual((await read(doc)).record, incomplete.record)
  assert.deepEqual((await read(doc)).workflow, incomplete.workflow)
  for (const domain of ['brand', 'legal']) doc = await command(doc, actors[domain], 'review-domain', { domain, reference: 'Synthetic independent review' })
  doc = await command(doc, reviewer, 'approve')
  await payload.update({ collection: 'users', id: actors.legal.id, user: manager, overrideAccess: false, data: { active: false } })
  const before = await read(doc)
  await denied(() => command(doc, publisher, 'publish'), /Domain approval identity is inactive/)
  assert.deepEqual((await read(doc)).record, before.record)
  assert.deepEqual((await read(doc)).workflow, before.workflow)
  await payload.update({ collection: 'users', id: actors.legal.id, user: manager, overrideAccess: false, data: { active: true } })
  doc = await command(doc, publisher, 'publish')
  assert.equal((await view()).blocks[0].publicId, doc.publicId)
  assert.equal((await view('am')).blocks[0].title, input.localized.am.title)
  assert.equal((await cmsInstitutionalView(payload, reviewer, 'en', clock())).state, 'unavailable')
  for (const [domain, actor] of Object.entries(actors)) {
    await payload.update({ collection: 'users', id: actor.id, user: manager, overrideAccess: false, data: { roles: ['privacy'] } })
    assert.equal((await view()).state, 'unavailable', domain)
    await payload.update({ collection: 'users', id: actor.id, user: manager, overrideAccess: false, data: { roles: [domain] } })
  }
  await payload.update({ collection: 'users', id: reviewer.id, user: manager, overrideAccess: false, data: { active: false } })
  assert.equal((await view('en', publisher)).state, 'unavailable')
  await payload.update({ collection: 'users', id: reviewer.id, user: manager, overrideAccess: false, data: { active: true } })
  for (const field of ['reviewAt', 'expiresAt']) assert.equal((await view('en', reviewer, 'controlled-fixture',
    new Date(doc.record.institutionalBlock.evidence[field]))).state, 'unavailable')
  const audit = doc.record.audit
  doc = await command(doc, publisher, 'withdraw', { reason: 'Synthetic mission retirement' })
  assert.equal(doc.publicId, input.publicId)
  assert.deepEqual(doc.record.audit.slice(0, -1), audit)
  assert.equal((await view()).state, 'unavailable')

  // Independent blocks omit separately: expiry must not remove the still-current narrative.
  const narrativeInput = institutionalBlockFixture(new Date(), `${fixtureSuffix}83`, 'narrative')
  narrativeInput.institutionalBlock.evidence.reviewAt = new Date(Date.now() + 86400000 * 25).toISOString().replace(/\.\d{3}Z$/, 'Z')
  narrativeInput.institutionalBlock.evidence.expiresAt = new Date(Date.now() + 86400000 * 30).toISOString().replace(/\.\d{3}Z$/, 'Z')
  let narrative = await create(narrativeInput)
  narrative = await command(await review(narrative), publisher, 'publish')
  let relationship = await create(institutionalBlockFixture(new Date(), `${fixtureSuffix}84`, 'relationship'))
  relationship = await command(await review(relationship), publisher, 'publish')
  assert.equal((await view()).blocks.length, 2)
  assert.equal((await view('am')).blocks.length, 0)
  const expiryAt = new Date(relationship.record.institutionalBlock.evidence.expiresAt)
  // Relationship expiry removes only that block; the narrative remains current.
  const viewAtExpiry = await view('en', reviewer, 'controlled-fixture', expiryAt)
  assert.deepEqual(viewAtExpiry.blocks.map((block) => block.publicId), [narrative.publicId])
  await command(narrative, publisher, 'withdraw', { reason: 'Synthetic narrative retirement' })
  await command(relationship, publisher, 'withdraw', { reason: 'Synthetic relationship retirement' })

  let timed = await create(institutionalBlockFixture(new Date(), `${fixtureSuffix}85`, 'leadership'))
  timed = await review(timed)
  timed = await command(timed, reviewer, 'request-changes', { reason: 'Refresh synthetic evidence expiry' })
  timed = await command(timed, reviewer, 'request-changes', { reason: 'Return to draft' })
  assert.equal(timed.record.institutionalBlock.evidence.reviewer, null)
  assert.deepEqual(timed.workflow.reviews, {})
  const expiry = new Date(Date.now() + 20000).toISOString().replace(/\.\d{3}Z$/, 'Z')
  timed = await command(timed, author, 'edit', {}, { record: { ...timed.record,
    institutionalBlock: { ...timed.record.institutionalBlock, evidence: { ...timed.record.institutionalBlock.evidence, expiresAt: expiry } } } })
  timed = await command(await review(timed), publisher, 'publish')
  await new Promise((resolve) => setTimeout(resolve, Math.max(0, Date.parse(timed.record.approval.at) - Date.now() + 100)))
  assert.equal((await view('en', reviewer, 'controlled-fixture', new Date())).blocks[0].publicId, timed.publicId)
  await new Promise((resolve) => setTimeout(resolve, Math.max(0, Date.parse(expiry) - Date.now() + 100)))
  assert.equal((await view('en', reviewer, 'controlled-fixture', new Date())).state, 'unavailable')
  assert.equal((await read(timed)).record.status, 'published')
  await command(timed, publisher, 'withdraw', { reason: 'Synthetic leadership evidence expired' })
  process.stdout.write('Institutional PostgreSQL persistence, mission conflict, concurrency/rollback, live content/brand/legal/approver revocation, bilingual reads, edit reset and actual elapsed leadership evidence expiry passed.\n')
}
