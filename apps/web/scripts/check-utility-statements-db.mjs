import assert from 'node:assert/strict'
import { cmsStatementView, cmsCollectionContract } from '../src/content/utility-statement-cms.ts'
import { utilityStatementFixture } from './lib/utility-statement-fixture.mjs'
import { siteSettingsFixture } from './lib/site-settings-fixture.mjs'

export async function checkUtilityStatementsDb(payload, { identity, command, denied, fixtureSuffix, serviceSuccessor }) {
  const author = await identity('statement-author', ['author', 'reviewer', 'content', 'privacy', 'legal', 'accessibility', 'operations'])
  const other = await identity('statement-other', ['author'])
  const reviewer = await identity('statement-reviewer', ['reviewer'])
  const publisher = await identity('statement-publisher', ['publisher'])
  const manager = await identity('statement-manager', ['identity-manager'])
  const actors = {}
  for (const domain of ['content', 'privacy', 'legal', 'accessibility', 'operations']) actors[domain] = await identity(`statement-${domain}`, [domain])
  const create = (record, user = author) => payload.create({ collection: 'governed-records',
    user, overrideAccess: false, data: { record, contentClass: record.kind === 'site-settings' ? 'contact' : record.utilityStatement.type === 'privacy' ? 'privacy' : 'general' } })
  const read = (doc) => payload.findByID({ collection: 'governed-records', id: doc.id, user: reviewer, overrideAccess: false })
  const clock = () => new Date(Date.now() + 60000)
  const view = (type = 'privacy', locale = 'en', user = reviewer, mode = 'controlled-fixture', now = clock()) =>
    cmsStatementView(payload, user, type, locale, now, mode)
  async function domains(doc) {
    const required = doc.record.kind === 'site-settings' ? ['operations'] : ['content',
      ...(doc.record.utilityStatement.type === 'privacy' ? ['privacy', 'legal'] : ['accessibility']),
      ...(doc.record.utilityStatement.contact.state === 'bound' ? ['operations'] : [])]
    for (const domain of required) doc = await command(doc, actors[domain], 'review-domain', { domain, reference: 'Synthetic persisted statement scope review' })
    return doc
  }
  const approve = async (doc) => command(await domains(await command(doc, author, 'submit')), reviewer, 'approve')
  await denied(() => cmsStatementView(payload, undefined, 'privacy', 'en', clock(), 'controlled-fixture'), /authenticated review/)
  await denied(() => view('privacy', 'en', other), /authenticated review/)
  const settingsInput = siteSettingsFixture(new Date())
  settingsInput.publicId = `pub_${fixtureSuffix}90`
  settingsInput.localized.en.slug = `synthetic-statement-contact-${fixtureSuffix}`
  settingsInput.localized.am.slug = `synthetic-statement-contact-am-${fixtureSuffix}`
  let settings = await create(settingsInput)
  settings = await command(await approve(settings), publisher, 'publish')
  settings = await command(settings, actors.operations, 'verify-publication', { reference: 'Synthetic canonical contact read verification' })
  const input = utilityStatementFixture(new Date(), `${fixtureSuffix}91`)
  input.utilityStatement.contact = { state: 'bound', settingsPublicId: settings.publicId, fact: 'email',
    purpose: 'Synthetic rights enquiries only', operationsReference: 'Synthetic purpose-specific contact approval' }
  input.utilityStatement.inventory.flows[0].state = 'planned'
  input.relationships = [settings.publicId, serviceSuccessor.publicId]
  input.utilityStatement.servicePublicIds = [serviceSuccessor.publicId]
  input.localized.am = { slug: `synthetic-privacy-am-${fixtureSuffix}`, title: 'የቁጥጥር ምሳሌ' }
  input.utilityStatement.localized.am = { title: input.localized.am.title,
    sections: [{ key: 'scope', heading: 'የቁጥጥር ምሳሌ', body: 'የቁጥጥር ጽሑፍ ምሳሌ' }] }
  let doc = await create(input)
  assert.deepEqual((await read(doc)).record.utilityStatement, input.utilityStatement)
  const duplicate = utilityStatementFixture(new Date(), `${fixtureSuffix}92`)
  duplicate.utilityStatement.identityKey = input.utilityStatement.identityKey
  await denied(() => create(duplicate), /duplicate statement series version/)
  await denied(() => command(doc, author, 'edit', {}, { record: { ...doc.record,
    utilityStatement: { ...doc.record.utilityStatement, identityKey: `stmt_${fixtureSuffix}92` } } }), /cannot change/)
  const concurrent = await Promise.allSettled([1, 2].map((n) => command(doc, author, 'edit', {}, { record: { ...doc.record,
    utilityStatement: { ...doc.record.utilityStatement, contact: { ...doc.record.utilityStatement.contact, purpose: `Synthetic purpose ${n}` } } } })))
  assert.equal(concurrent.filter((result) => result.status === 'fulfilled').length, 1)
  assert.match(concurrent.find((result) => result.status === 'rejected').reason.message, /Stale/)
  doc = concurrent.find((result) => result.status === 'fulfilled').value
  doc = await command(doc, author, 'submit')
  await denied(() => command(doc, author, 'review-domain', { domain: 'privacy', reference: 'self' }), /independent/)
  await denied(() => command(doc, { ...reviewer, roles: ['privacy'] }, 'review-domain', { domain: 'privacy', reference: 'forged role' }), /privacy role/)
  doc = await command(doc, actors.content, 'review-domain', { domain: 'content', reference: 'Synthetic statement text review' })
  const before = await read(doc)
  await denied(() => command(doc, reviewer, 'approve'), /domain reviews/)
  assert.deepEqual((await read(doc)).record, before.record)
  assert.deepEqual((await read(doc)).workflow, before.workflow)
  doc = await domains(doc)
  doc = await command(doc, reviewer, 'approve')
  await payload.update({ collection: 'users', id: actors.legal.id, user: manager, overrideAccess: false, data: { active: false } })
  await denied(() => command(doc, publisher, 'publish'), /Domain approval identity is inactive/)
  assert.equal((await read(doc)).record.status, 'approved')
  await payload.update({ collection: 'users', id: actors.legal.id, user: manager, overrideAccess: false, data: { active: true } })
  const clinicalId = Number(serviceSuccessor.workflow.reviews.clinical.actor.slice(4))
  const clinicalIdentity = await payload.findByID({ collection: 'users', id: clinicalId, overrideAccess: true })
  await payload.update({ collection: 'users', id: clinicalId, user: manager, overrideAccess: false, data: { active: false } })
  const beforeDependencyDenial = await read(doc)
  await denied(() => command(doc, publisher, 'publish'), /Statement dependency approval identity is inactive/)
  assert.deepEqual((await read(doc)).record, beforeDependencyDenial.record)
  assert.deepEqual((await read(doc)).workflow, beforeDependencyDenial.workflow)
  await payload.update({ collection: 'users', id: clinicalId, user: manager, overrideAccess: false, data: { active: true } })
  doc = await command(doc, publisher, 'publish')
  assert.equal((await view()).publicId, doc.publicId)
  assert.equal((await view('privacy', 'am')).statement.localized.am.title, input.localized.am.title)
  assert.equal((await cmsStatementView(payload, reviewer, 'privacy', 'en', clock())).state, 'unavailable')
  const evaluate = (version = doc.publicId, inventory = doc.record.utilityStatement.inventory, now = clock()) =>
    cmsCollectionContract(payload, reviewer, version, 'appointment', inventory, now, 'controlled-fixture')
  assert.deepEqual(await evaluate(), { enabled: false, contractMatches: true, reason: 'controlled-only' })
  await payload.update({ collection: 'users', id: clinicalId, user: manager, overrideAccess: false, data: { roles: ['medical'] } })
  assert.equal((await evaluate()).contractMatches, false)
  await payload.update({ collection: 'users', id: clinicalId, user: manager, overrideAccess: false, data: { roles: clinicalIdentity.roles } })
  const inventory = structuredClone(doc.record.utilityStatement.inventory)
  inventory.flows[0].recipients = 'Materially changed recipient'
  assert.equal((await evaluate(undefined, inventory)).reason, 'inventory-mismatch')
  assert.equal((await evaluate(settings.publicId)).reason, 'version-mismatch')
  for (const domain of ['content', 'privacy', 'legal', 'operations']) {
    await payload.update({ collection: 'users', id: actors[domain].id, user: manager, overrideAccess: false, data: { roles: ['brand'] } })
    assert.equal((await view()).state, 'unavailable', domain)
    assert.equal((await evaluate()).contractMatches, false)
    await payload.update({ collection: 'users', id: actors[domain].id, user: manager, overrideAccess: false, data: { roles: [domain] } })
  }
  await payload.update({ collection: 'users', id: reviewer.id, user: manager, overrideAccess: false, data: { active: false } })
  assert.equal((await view('privacy', 'en', publisher)).state, 'unavailable')
  await payload.update({ collection: 'users', id: reviewer.id, user: manager, overrideAccess: false, data: { active: true } })
  const contactExpiry = new Date(settings.record.siteSettings.email.expiresAt)
  assert.equal((await view('privacy', 'en', reviewer, 'controlled-fixture', contactExpiry)).contact.state, 'unavailable')
  assert.equal((await evaluate(undefined, undefined, contactExpiry)).reason, 'dependency-unavailable')

  const successorInput = utilityStatementFixture(new Date(Date.now() + 1000), `${fixtureSuffix}93`)
  Object.assign(successorInput.utilityStatement, { identityKey: input.utilityStatement.identityKey,
    version: 2, supersedesPublicId: doc.publicId })
  let successor = await create(successorInput)
  successor = await domains(await command(successor, author, 'submit'))
  const beforeSuccessor = await read(successor)
  await denied(() => command(successor, reviewer, 'approve'), /retire|competing/)
  assert.deepEqual((await read(successor)).workflow, beforeSuccessor.workflow)
  const historical = structuredClone(doc.record.utilityStatement)
  const audit = structuredClone(doc.record.audit)
  doc = await command(doc, publisher, 'withdraw', { reason: 'Synthetic policy replacement' })
  assert.deepEqual(doc.record.utilityStatement, historical)
  assert.deepEqual(doc.record.audit.slice(0, -1), audit)
  await denied(() => payload.delete({ collection: 'governed-records', id: doc.id, overrideAccess: true }), /withdrawn/)
  successor = await command(successor, reviewer, 'approve')
  successor = await command(successor, publisher, 'publish')
  assert.equal((await view()).publicId, successor.publicId)
  assert.equal((await evaluate(doc.publicId, historical.inventory)).reason, 'version-mismatch')
  assert.deepEqual((await read(doc)).record.utilityStatement, historical)
  await command(successor, publisher, 'withdraw', { reason: 'Synthetic successor retirement' })

  let access = await create(utilityStatementFixture(new Date(), `${fixtureSuffix}94`, 'accessibility'))
  access = await approve(access)
  access = await command(access, reviewer, 'request-changes', { reason: 'Synthetic test refresh' })
  access = await command(access, reviewer, 'request-changes', { reason: 'Return to draft' })
  assert.equal(access.record.utilityStatement.reviewedAt, null)
  assert.deepEqual(access.workflow.reviews, {})
  const expiry = new Date(Date.now() + 20000).toISOString().replace(/\.\d{3}Z$/, 'Z')
  access = await command(access, author, 'edit', {}, { record: { ...access.record, expiresAt: expiry,
    utilityStatement: { ...access.record.utilityStatement, expiresAt: expiry } } })
  access = await command(await approve(access), publisher, 'publish')
  await new Promise((resolve) => setTimeout(resolve, Math.max(0, Date.parse(access.record.approval.at) - Date.now() + 100)))
  assert.equal((await view('accessibility', 'en', reviewer, 'controlled-fixture', new Date())).publicId, access.publicId)
  await payload.update({ collection: 'users', id: actors.accessibility.id, user: manager, overrideAccess: false, data: { roles: ['brand'] } })
  assert.equal((await view('accessibility', 'en')).state, 'unavailable')
  await payload.update({ collection: 'users', id: actors.accessibility.id, user: manager, overrideAccess: false, data: { roles: ['accessibility'] } })
  await new Promise((resolve) => setTimeout(resolve, Math.max(0, Date.parse(expiry) - Date.now() + 100)))
  assert.equal((await view('accessibility', 'en', reviewer, 'controlled-fixture', new Date())).state, 'unavailable')
  assert.equal((await read(access)).record.status, 'published')
  access = await command(access, publisher, 'expire', { reason: 'Synthetic expiry' })
  await denied(() => command(access, author, 'edit', {}, { record: access.record }), /owning author may edit a draft/)
  await command(settings, publisher, 'withdraw', { reason: 'Synthetic statement contact retirement' })
  process.stdout.write('Statement PostgreSQL persistence, concurrency/rollback, current-version conflicts, retained historical content, exact inventory/version negatives, live matching-role revocation, bilingual reads and actual elapsed expiry passed.\n')
}
