import assert from 'node:assert/strict'
import { mkdir, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { createWorkflow } from '../src/content/cms-workflow.ts'
import { assertLocalTransferDatabase, exportTransferSnapshot, parseTransferBundle, planContentTransfer, unsignedTransferRecord } from '../src/content/content-transfer.ts'
import { serviceFixture } from './lib/service-fixture.mjs'
import { clinicianFixture } from './lib/clinician-fixture.mjs'
import { siteSettingsFixture } from './lib/site-settings-fixture.mjs'
import { transferFixture, transferBundle, transferEntry } from './lib/content-transfer-fixture.mjs'

const now = new Date('2026-09-18T12:00:00Z')
const actor = { id: 'cms:1', roles: ['author'] }
for (const host of ['localhost', '127.0.0.1', '[::1]']) {
  assertLocalTransferDatabase(`postgresql://fixture:synthetic@${host}:5432/hallelujah_content_local`)
}
assertLocalTransferDatabase('postgresql://fixture:synthetic@localhost/hallelujah_content_local?host=%2Ftmp%2Fsynthetic-socket')
for (const url of [
  'postgresql://fixture:synthetic@external.invalid/hallelujah_content_local',
  'postgresql://fixture:synthetic@localhost/hallelujah_content_local?host=external.invalid',
  'postgresql://fixture:synthetic@localhost/hallelujah_content_local?host=%2Ftmp&host=external.invalid',
  'postgresql://fixture:synthetic@localhost/hallelujah_content_local?connectionString=remote',
  'postgresql://fixture:synthetic@localhost/hallelujah_appointment_local',
]) assert.throws(() => assertLocalTransferDatabase(url), /local content database/)
const record = transferFixture()
const bundle = transferBundle([transferEntry(record), { sourceKey: 'synthetic/withheld-media', operation: 'skip' }])
const baseline = structuredClone(bundle)
const plan = planContentTransfer(bundle, [], actor, now)
assert.equal(plan.report.valid, true)
assert.deepEqual(plan.report.totals, { create: 1, update: 0, merge: 0, skip: 1, error: 0 })
assert.deepEqual(bundle, baseline, 'dry run must not mutate inputs')
assert.deepEqual(planContentTransfer(bundle, [], actor, new Date(now.getTime() + 1000)).report, plan.report,
  'dry-run plan identity does not depend on preview audit times')
const stored = { id: 13, ...createWorkflow(record, 'general', actor, now) }
const docs = [stored]
const before = structuredClone(docs)
const repeated = planContentTransfer(bundle, docs, actor, now)
assert.equal(repeated.report.totals.skip, 2)
assert.equal(repeated.steps.length, 0)
assert.deepEqual(docs, before)
const edited = { ...record, localized: { ...record.localized,
  en: { ...record.localized.en, title: 'Synthetic revised specimen' } } }
const update = planContentTransfer(transferBundle([transferEntry(edited)]), docs, actor, now)
assert.equal(update.report.totals.update, 1)
const merge = planContentTransfer(transferBundle([transferEntry(edited, { operation: 'merge' })]), docs, actor, now)
assert.equal(merge.report.totals.merge, 1)
assert.equal(merge.steps[0].previous.id, stored.id)
assert.equal(planContentTransfer(transferBundle([transferEntry(record, { operation: 'merge' })]), [], actor, now).report.valid, false)

const rejects = (change) => {
  const bad = structuredClone(bundle)
  change(bad)
  const result = planContentTransfer(bad, docs, actor, now)
  assert.equal(result.report.valid, false)
  assert.equal(result.steps.length, 0, 'a single invalid row prevents all writes')
}
rejects((bad) => { bad.synthetic = false })
rejects((bad) => { bad.version = 2 })
rejects((bad) => { bad.provider = 'https://example.invalid' })
rejects((bad) => { bad.entries[0].record.synthetic = false })
rejects((bad) => { bad.entries[0].record.status = 'approved' })
rejects((bad) => { bad.entries[0].record.status = 'invented' })
rejects((bad) => { bad.entries[0].record.approval = { actor: 'forged', at: now.toISOString().replace('.000Z', 'Z') } })
rejects((bad) => { bad.entries[0].record.remoteMedia = 'https://example.invalid/image.jpg' })
rejects((bad) => { bad.entries[0].workflow = { revision: 1 } })
rejects((bad) => { bad.entries[0].record.localized.en.extra = 'ignored' })
rejects((bad) => { bad.entries[0].record.relationships = ['pub_missing00000'] })
rejects((bad) => { bad.entries.push(bad.entries[0]) })
rejects((bad) => { bad.entries.push({ ...bad.entries[0], sourceKey: 'synthetic/duplicate-target' }) })
rejects((bad) => { bad.entries[1].record = record })
assert.throws(() => parseTransferBundle({ ...bundle, entries: Array(501).fill(bundle.entries[0]) }), /500/)
assert.throws(() => planContentTransfer(bundle, docs, { id: actor.id, roles: ['reviewer'] }, now), /author/)
assert.equal(planContentTransfer(bundle, docs, { id: 'cms:2', roles: ['author'] }, now).report.valid, false)
const changedClass = transferBundle([transferEntry(record, { contentClass: 'brand' })])
assert.equal(planContentTransfer(changedClass, docs, actor, now).report.valid, false)
assert.notEqual(plan.report.planHash, update.report.planHash)
assert.notEqual(plan.report.planHash, planContentTransfer(transferBundle([transferEntry(edited)]), [], actor, now).report.planHash)

const target = transferFixture('141414141414')
const linked = { ...record, relationships: [target.publicId] }
const forward = planContentTransfer(transferBundle([transferEntry(linked), transferEntry(target)]), [], actor, now)
assert.equal(forward.report.valid, true)
assert.deepEqual(forward.steps.map((step) => step.entry.record.publicId), [target.publicId, record.publicId])
const cyclic = planContentTransfer(transferBundle([transferEntry(linked),
  transferEntry({ ...target, relationships: [record.publicId] })]), [], actor, now)
assert.equal(cyclic.report.valid, false)
assert.match(cyclic.report.rows[0].issues[0], /cyclic/)
const collision = { ...target, localized: record.localized }
assert.equal(planContentTransfer(transferBundle([transferEntry(collision)]), docs, actor, now).report.valid, false)

for (const fixture of [serviceFixture(now), clinicianFixture(now), siteSettingsFixture(now)]) {
  const contentClass = fixture.kind === 'site-settings' ? 'contact' : 'general'
  const result = planContentTransfer(transferBundle([transferEntry(fixture, { contentClass })]), [], actor, now)
  assert.equal(result.report.valid, true, JSON.stringify(result.report.rows))
}
const snapshot = exportTransferSnapshot(docs)
assert.deepEqual(snapshot.documents[0], stored)
assert.deepEqual(unsignedTransferRecord(stored.record), record)
assert.throws(() => unsignedTransferRecord({ ...record, status: 'published' }), /draft/)
assert.throws(() => exportTransferSnapshot([{ ...stored, record: { ...stored.record, synthetic: false } }]), /synthetic/)
assert.throws(() => exportTransferSnapshot([stored, stored]), /duplicate/)
assert.notEqual(snapshot.snapshotHash, exportTransferSnapshot([{ ...stored,
  workflow: { ...stored.workflow, revision: 2 } }]).snapshotHash)
if (process.argv.includes('--capture')) {
  const root = new URL('../../../docs/backlog/evidence/b02-013-artifacts/', import.meta.url)
  await mkdir(fileURLToPath(root), { recursive: true })
  await writeFile(new URL('synthetic-reports.json', root), `${JSON.stringify({
    scope: 'Synthetic fixed-time specimens; no authentic record or approval',
    create: plan.report, repeated: repeated.report, update: update.report,
    merge: merge.report, forwardReferences: forward.report, cyclicReferences: cyclic.report,
    exportSnapshot: snapshot,
  }, null, 2)}\n`)
}
console.log('Content transfer checks passed: dry-run immutability, stable repeat/update/merge, schema and authority negatives, dependency order, bilingual content and export integrity.')
