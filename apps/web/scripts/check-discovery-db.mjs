import assert from 'node:assert/strict'
import { createLocalReq, initTransaction, killTransaction } from 'payload'
import { clinicianFixture } from './lib/clinician-fixture.mjs'
import { cmsDiscovery } from '../src/content/discovery-cms.ts'
import { governedPath } from '../src/content/governed-discovery.ts'
import { controlledDiscoveryResponse } from '../src/content/discovery-response.ts'

export async function checkDiscoveryDb(payload, { identity, command, denied, fixtureSuffix }) {
  const author = await identity('discovery-author', ['author'])
  const medical = await identity('discovery-medical', ['medical'])
  const reviewer = await identity('discovery-reviewer', ['reviewer'])
  const publisher = await identity('discovery-publisher', ['publisher'])
  const manager = await identity('discovery-manager', ['identity-manager'])
  const origin = 'http://127.0.0.1:43101'
  const mode = 'controlled-fixture'
  const read = (user = publisher, now = new Date(Date.now() + 60000)) => cmsDiscovery(payload, user, origin, now, mode)
  async function publish(input) {
    let doc = await payload.create({ collection: 'governed-records', user: author, overrideAccess: false,
      data: { record: input, contentClass: 'general' } })
    doc = await command(doc, author, 'submit')
    doc = await command(doc, medical, 'review-domain', { domain: 'medical', reference: 'Synthetic persisted discovery review' })
    doc = await command(doc, reviewer, 'approve')
    return command(doc, publisher, 'publish')
  }
  const input = clinicianFixture(new Date(), `${fixtureSuffix}d81`)
  let doc = await publish(input)
  await denied(() => cmsDiscovery(payload, undefined, origin, new Date(), mode), /authenticated/)
  await denied(() => read(author), /authenticated/)
  assert.equal((await cmsDiscovery(payload, publisher, origin, new Date())).state, 'withheld')
  const find = (snapshot) => snapshot.entries.find((entry) => entry.publicId === doc.publicId)
  assert.ok(find(await read()))
  assert.ok((await read()).sitemap.includes(governedPath(doc.record, 'en')))
  // Approval revocation must defeat an already populated cache, including transitive dependents.
  const dependentInput = clinicianFixture(new Date(), `${fixtureSuffix}d82`)
  dependentInput.relationships = [doc.publicId]
  const dependent = await publish(dependentInput)
  assert.ok((await read()).entries.some((entry) => entry.publicId === dependent.publicId))
  await payload.update({ collection: 'users', id: medical.id, user: manager, overrideAccess: false, data: { roles: ['content'] } })
  assert.equal(find(await read()), undefined)
  assert.ok(!(await read()).entries.some((entry) => entry.publicId === dependent.publicId))
  await payload.update({ collection: 'users', id: medical.id, user: manager, overrideAccess: false, data: { roles: ['medical'] } })
  assert.ok(find(await read()))
  await payload.update({ collection: 'users', id: reviewer.id, user: manager, overrideAccess: false, data: { active: false } })
  assert.equal(find(await read()), undefined)
  await payload.update({ collection: 'users', id: reviewer.id, user: manager, overrideAccess: false, data: { active: true } })
  assert.ok(find(await read()))
  // A failed write and an explicitly rolled-back valid write preserve committed cache output.
  await denied(() => command(doc, author, 'edit', {}, { record: { ...doc.record, localized: { en: { ...doc.record.localized.en, slug: 'renamed-published' } } } }), /owning author|draft/)
  assert.ok(find(await read()))
  const req = await createLocalReq({ user: publisher }, payload)
  await initTransaction(req)
  try {
    await payload.update({ collection: 'governed-records', id: dependent.id, overrideAccess: false, req,
      data: { command: { action: 'withdraw', expectedRevision: dependent.workflow.revision, reason: 'Synthetic rollback-only removal' } } })
  } finally { await killTransaction(req) }
  assert.ok((await read()).entries.some((entry) => entry.publicId === dependent.publicId))
  // Remove the dependency before retiring its referenced source; no broken relationship is stored.
  await command(dependent, publisher, 'withdraw', { reason: 'Synthetic dependent retirement' })
  // The governed-set contract intentionally rejects references to retired peers. Use an isolated
  // successor exercise with no remaining reference to this source.
  const standalone = await publish(clinicianFixture(new Date(), `${fixtureSuffix}d83`))
  const successor = await publish(clinicianFixture(new Date(), `${fixtureSuffix}d84`))
  const retired = await command(standalone, publisher, 'withdraw', { reason: 'Synthetic real successor decision', successorPublicId: successor.publicId })
  const after = await read()
  assert.ok(!after.entries.some((entry) => entry.publicId === retired.publicId))
  assert.ok(after.entries.some((entry) => entry.publicId === successor.publicId))
  assert.ok(!after.sitemap.includes(governedPath(retired.record, 'en')))
  const persisted = await payload.findByID({ collection: 'governed-records', id: retired.id, user: publisher, overrideAccess: false })
  assert.equal(controlledDiscoveryResponse([persisted, successor], origin, new Date(Date.now() + 60000), governedPath(persisted.record, 'en'), mode).status, 308)
  assert.equal(find(await read(publisher, new Date(Date.parse(doc.record.reviewAt)))), undefined)
  assert.equal(find(await read(publisher, new Date(Date.parse(doc.record.expiresAt)))), undefined)
  await payload.update({ collection: 'users', id: publisher.id, user: manager, overrideAccess: false, data: { active: false } })
  await denied(() => read(), /authenticated|active/)
  await payload.update({ collection: 'users', id: publisher.id, user: manager, overrideAccess: false, data: { active: true } })
  const timedInput = clinicianFixture(new Date(), `${fixtureSuffix}d85`)
  timedInput.reviewAt = new Date(Date.now() + 20000).toISOString().replace(/\.\d{3}Z$/, 'Z')
  timedInput.expiresAt = new Date(Date.now() + 25000).toISOString().replace(/\.\d{3}Z$/, 'Z')
  const timed = await publish(timedInput)
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, Math.max(0, ms)))
  await delay(Date.parse(timed.record.audit.at(-1).at) - Date.now() + 50)
  assert.ok((await read(publisher, new Date())).entries.some((entry) => entry.publicId === timed.publicId))
  await delay(Date.parse(timed.record.reviewAt) - Date.now() + 50)
  assert.ok(!(await read(publisher, new Date())).entries.some((entry) => entry.publicId === timed.publicId))
  await delay(Date.parse(timed.record.expiresAt) - Date.now() + 50)
  const elapsed = await payload.findByID({ collection: 'governed-records', id: timed.id, user: publisher, overrideAccess: false })
  assert.equal(elapsed.record.status, 'published', 'elapsed removal must not depend on a scheduler/write')
  assert.equal(controlledDiscoveryResponse([elapsed], origin, new Date(), governedPath(elapsed.record, 'en'), mode).status, 410)
  process.stdout.write('Discovery PostgreSQL authenticated reads, live-role/cache revocation, rollback, dependency removal and successor HTTP integration passed.\n')
}
