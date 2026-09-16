import assert from 'node:assert/strict'
import { cmsActor, cmsUsersCollection } from '../src/content/cms-identity.ts'
import { applyWorkflow, createWorkflow } from '../src/content/cms-workflow.ts'
import { cmsPreview } from '../src/content/cms-preview.ts'
import { governedRecordsCollection } from '../src/content/governed-collection.ts'
import { publicEligibility } from '../src/content/governed-record.ts'

process.env.APP_ENVIRONMENT = 'local'
process.env.PERSONAL_DATA_COLLECTION = 'disabled'
process.env.EXTERNAL_SERVICES = 'disabled'
process.env.LOCAL_PAYLOAD_SECRET = 'controlled-local-cms-fixture-secret-only'
process.env.LOCAL_DATABASE_URL = 'postgresql://synthetic:placeholder@localhost:5432/hallelujah_content_local'

export const draftFixture = {
  publicId: 'pub_020202020202', kind: 'service', status: 'draft', synthetic: true,
  localized: { en: { slug: 'synthetic-workflow', title: 'Synthetic workflow fixture' } },
  source: { reference: 'synthetic-workflow-check', recordedAt: '2026-09-16T00:00:00Z' },
  owner: null, reviewer: null, approval: null, domainApproval: null, relationships: [],
  publishAt: '2026-09-16T09:00:00Z', reviewAt: '2026-10-16T09:00:00Z',
  expiresAt: '2026-11-16T09:00:00Z', withdrawal: null, audit: [],
}

const author = { id: 'cms:1', roles: ['author', 'reviewer', 'clinical', 'operations', 'publisher'] }
const reviewer = { id: 'cms:2', roles: ['reviewer'] }
const domain = { id: 'cms:3', roles: ['clinical', 'operations'] }
const publisher = { id: 'cms:4', roles: ['publisher'] }
const now = new Date('2026-09-16T12:00:00Z')
const created = createWorkflow(draftFixture, 'general', author, now)
function action(previous, actor, name, extra = {}, input, time = now) {
  return applyWorkflow(previous, input,
    { action: name, expectedRevision: previous.workflow.revision, ...extra }, actor, time)
}
function rejects(previous, actor, name, pattern, extra = {}, input, time = now) {
  assert.throws(() => action(previous, actor, name, extra, input, time), pattern)
}

assert.equal(created.record.owner, author.id)
assert.equal(created.record.audit[0].actor, author.id)
assert.throws(() => createWorkflow({ ...draftFixture, status: 'approved' }, 'general', author, now), /unsigned draft/)
assert.throws(() => createWorkflow({ ...draftFixture, synthetic: false }, 'general', author, now), /Authentic/)
assert.throws(() => createWorkflow(draftFixture, 'general', reviewer, now), /author role/)
assert.throws(() => createWorkflow(draftFixture, 'unknown', author, now), /explicit content class/)
rejects(created, reviewer, 'edit', /author role/, {}, created.record)
rejects(created, { ...author, id: 'cms:5' }, 'edit', /owning author/, {}, created.record)
rejects(created, author, 'edit', /governance fields/, {}, { ...created.record, owner: 'spoofed' })
rejects(created, author, 'publish', /approved content/)
rejects(created, author, 'submit', /Stale/, { expectedRevision: 0 })
rejects(created, author, 'invented-action', /Unsupported/)

const submitted = action(created, author, 'submit')
rejects(submitted, author, 'approve', /self-approve/)
rejects(submitted, author, 'review-domain', /independent/, { domain: 'clinical', reference: 'test' })
rejects(submitted, reviewer, 'review-domain', /clinical role/, { domain: 'clinical', reference: 'test' })
rejects(submitted, domain, 'review-domain', /matching reviewer/, { domain: 'operations', reference: 'test' })
rejects(submitted, domain, 'review-domain', /reference/, { domain: 'clinical', reference: '' })
rejects(submitted, reviewer, 'approve', /matching domain reviews/)
rejects(submitted, author, 'edit', /draft/, {}, submitted.record)

const reviewed = action(submitted, domain, 'review-domain', { domain: 'clinical', reference: 'synthetic clinical review' })
const approved = action(reviewed, reviewer, 'approve')
assert.equal(approved.record.status, 'approved')
assert.equal(approved.record.approval.actor, reviewer.id)
assert.equal(approved.record.domainApproval.actor, domain.id)
rejects(approved, publisher, 'publish', /Content cannot change/, {}, {
  ...approved.record, localized: { en: { slug: 'changed-after-review', title: 'Changed' } },
})
rejects(approved, author, 'publish', /independent publisher/)
rejects(approved, reviewer, 'publish', /publisher role/)
rejects(approved, publisher, 'schedule', /future UTC/)
rejects(approved, publisher, 'publish', /due for review/, {}, undefined, new Date('2026-10-17T00:00:00Z'))
const published = action(approved, publisher, 'publish')
assert.equal(published.record.status, 'published')
assert.equal(publicEligibility(published.record, now).eligible, false)
rejects(published, publisher, 'expire', /past its expiry/)
const expired = action(published, publisher, 'expire', { reason: 'synthetic expiry' }, undefined,
  new Date('2026-11-17T00:00:00Z'))
assert.equal(expired.record.status, 'expired')
const withdrawn = action(published, publisher, 'withdraw', { reason: 'synthetic withdrawal' })
assert.equal(withdrawn.record.status, 'withdrawn')
rejects(withdrawn, publisher, 'withdraw', /immutable/, { reason: 'test' })
rejects(published, publisher, 'withdraw', /reference or reason/)

const returned = action(approved, reviewer, 'request-changes', { reason: 'synthetic correction' })
assert.equal(returned.record.status, 'review')
assert.equal(returned.record.approval, null)
assert.deepEqual(returned.workflow.reviews, {})
const drafting = action(returned, reviewer, 'request-changes', { reason: 'return to author' })
const edited = action(drafting, author, 'edit', {}, {
  ...drafting.record, localized: { en: { slug: 'synthetic-workflow', title: 'Synthetic corrected fixture' } },
})
assert.equal(edited.record.status, 'draft')
assert.equal(edited.record.audit.at(-1).actor, author.id)
assert.deepEqual(edited.record.audit.slice(0, -1), drafting.record.audit)
assert.ok(Date.parse(edited.record.audit.at(-1).at) > Date.parse(drafting.record.audit.at(-1).at))

const future = createWorkflow({ ...draftFixture, publishAt: '2026-09-17T09:00:00Z' }, 'general', author, now)
const futureApproved = action(action(action(future, author, 'submit'), domain, 'review-domain',
  { domain: 'clinical', reference: 'future synthetic review' }), reviewer, 'approve')
rejects(futureApproved, publisher, 'publish', /not effective/)
const scheduled = action(futureApproved, publisher, 'schedule')
assert.equal(scheduled.record.status, 'scheduled')
rejects(scheduled, publisher, 'publish', /not effective/)
assert.equal(action(scheduled, publisher, 'publish', {}, undefined,
  new Date('2026-09-17T10:00:00Z')).record.status, 'published')
assert.throws(() => createWorkflow({ ...draftFixture, publishAt: '2026-09-17T12:00:00+03:00' },
  'general', author, now), /UTC instant/)

for (const contentClass of ['contact', 'emergency']) {
  const safety = action(createWorkflow(draftFixture, contentClass, author, now), author, 'submit')
  const clinical = action(safety, domain, 'review-domain', { domain: 'clinical', reference: 'safety clinical review' })
  rejects(clinical, reviewer, 'approve', /domain reviews/)
  const operations = action(clinical, domain, 'review-domain', { domain: 'operations', reference: 'safety operations review' })
  rejects(operations, { ...domain, roles: [...domain.roles, 'reviewer'] }, 'approve', /two distinct/)
  const safetyPublished = action(action(operations, reviewer, 'approve'), publisher, 'publish')
  assert.equal(safetyPublished.workflow.verification, null)
  rejects(safetyPublished, publisher, 'verify-publication', /operations role/, { reference: 'test' })
  rejects(safetyPublished, author, 'verify-publication', /independent operations/, { reference: 'test' })
  const verified = action(safetyPublished, domain, 'verify-publication', { reference: 'synthetic post-publish check' })
  assert.equal(verified.workflow.verification.actor, domain.id)
}
for (const contentClass of ['privacy', 'brand']) {
  const pending = action(createWorkflow({ ...draftFixture, kind: 'page' }, contentClass, author, now), author, 'submit')
  const content = action(pending, { id: 'cms:6', roles: ['content'] }, 'review-domain',
    { domain: 'content', reference: 'synthetic content review' })
  rejects(content, reviewer, 'approve', /domain reviews/)
  rejects(content, domain, 'review-domain', new RegExp(`${contentClass} role`),
    { domain: contentClass, reference: 'test' })
  const specialized = action(content, { id: 'cms:7', roles: [contentClass] }, 'review-domain',
    { domain: contentClass, reference: 'synthetic specialist review' })
  assert.equal(action(specialized, reviewer, 'approve').record.status, 'approved')
}

const persisted = { id: 1, synthetic: true, active: true, roles: ['author'] }
const request = { user: { id: 1, collection: 'users', roles: ['publisher'] }, payload: {
  findByID: async () => persisted,
} }
assert.deepEqual(await cmsActor(request), { id: 'cms:1', roles: ['author'] })
assert.equal(await governedRecordsCollection.access.create({ req: request }), true)
assert.deepEqual(await governedRecordsCollection.access.read({ req: request }), { authorId: { equals: 'cms:1' } })
persisted.active = false
assert.equal(await cmsActor(request), null)
assert.equal(await governedRecordsCollection.access.update({ req: request }), false)
persisted.active = true
assert.equal(await cmsActor({ ...request, user: { id: 1, collection: 'untrusted' } }), null)
const write = governedRecordsCollection.hooks.beforeChange[0]
await assert.rejects(() => write({ data: { record: draftFixture }, req: { payload: {} } }), /persisted CMS identity/)
await assert.rejects(() => write({ data: { record: draftFixture }, req: request }), /PostgreSQL transaction/)
await assert.rejects(() => cmsUsersCollection.hooks.beforeChange[0]({
  data: { roles: ['publisher'] }, operation: 'update', originalDoc: { ...persisted, email: 'fixture-author@cms.invalid' }, req: request,
}), /separate identity manager/)
assert.equal(cmsUsersCollection.access.create(), false)
assert.equal(cmsUsersCollection.access.admin(), false)
assert.equal(cmsUsersCollection.endpoints, false)
assert.equal(governedRecordsCollection.endpoints, false)
assert.equal(governedRecordsCollection.graphQL, false)
const preview = await cmsPreview({ findByID: async (args) => {
  assert.equal(args.overrideAccess, false)
  assert.equal(args.user, request.user)
  return { record: draftFixture }
} }, request.user, 1)
assert.equal(preview.headers['X-Robots-Tag'], 'noindex, nofollow, noarchive')
assert.equal(preview.headers['Cache-Control'], 'private, no-store')
process.stdout.write('Controlled CMS role, workflow, safety, scheduling and preview checks passed.\n')
