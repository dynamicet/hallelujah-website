import assert from 'node:assert/strict'
import { cp, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

import { loadReconciliation, reconcile, reconciliationRoot } from './lib/content-reconciliation.mjs'

const { sources, register } = await loadReconciliation()
const mutate = (change, expected) => {
  const altered = structuredClone(register)
  change(altered)
  assert.throws(() => reconcile(sources, altered), expected)
}
const baseline = reconcile(sources, register)
assert.equal(baseline.unaccountedSourceUnits, 0)
assert.equal(baseline.approvedFacts, 0)
assert.equal(baseline.rawSnapshotAvailable, false)
mutate((draft) => draft.entries.pop(), /Every source unit/u)
mutate((draft) => draft.entries.push(draft.entries[0]), /Duplicate disposition/u)
mutate((draft) => { draft.entries[0].sourceKey = 'unavailable.json#/0' }, /Unknown source/u)
mutate((draft) => { draft.entries[0].fingerprint = 'changed' }, /Stale disposition/u)
mutate((draft) => { draft.entries[0].disposition = 'approve' }, /Hospital approval/u)
mutate((draft) => { draft.entries[0].canonicalId = 'invented' }, /canonical identity/u)
mutate((draft) => { draft.entries[0].approved = true }, /Unexpected fields/u)
mutate((draft) => { draft.entries[0].namedOwner = 'unconfirmed person' }, /unassigned/u)
mutate((draft) => { draft.entries[0].gates = [] }, /gates are required/u)
mutate((draft) => { draft.entries[0].gates.push('MADE-UP') }, /Unknown approval gate/u)
mutate((draft) => { draft.entries.find((entry) => entry.disposition === 'merge').mergeInto = 'missing' }, /Merge target/u)
mutate((draft) => {
  const alias = draft.entries.find((entry) => entry.disposition === 'merge')
  alias.mergeInto = alias.sourceKey
}, /Merge target/u)
mutate((draft) => {
  const alias = draft.entries.find((entry) => entry.disposition === 'merge')
  alias.mergeInto = draft.entries.find((entry) => entry.sourceKey === 'data/doctors.json#/0').sourceKey
}, /extraction parent/u)
mutate((draft) => { draft.entries[0].issues = [] }, /Missing extracted defect/u)
mutate((draft) => { draft.issues[0].sourceKeys = ['missing'] }, /available evidence/u)
mutate((draft) => { draft.issues[0].state = 'resolved' }, /open/u)
mutate((draft) => { draft.issues.pop() }, /Missing bidirectional issue link|required review gap/iu)
mutate((draft) => { draft.entries.find((entry) => entry.sourceKey === 'data/doctors.json#/17').disposition = 'omit' }, /Profile-only/u)
mutate((draft) => { draft.entries.find((entry) => entry.sourceKey === 'data/media-manifest.json#/0').disposition = 'correct' }, /cleared binaries/u)
const changedMetadata = structuredClone(sources)
changedMetadata['data/metadata.json'].doctor_record_count += 1
assert.throws(() => reconcile(changedMetadata, register), /Doctor inventory mismatch/u)
const changedSource = structuredClone(sources)
changedSource['data/services.json'][0].title = 'Changed source title'
assert.throws(() => reconcile(changedSource, register), /Stale disposition/u)
const temporaryRoot = await mkdtemp(path.join(os.tmpdir(), 'b02-012-integrity-'))
try {
  await cp(reconciliationRoot, temporaryRoot, { recursive: true })
  const sourcePath = path.join(temporaryRoot, 'sources/data/doctors.json')
  const bytes = await readFile(sourcePath)
  const changedBytes = Buffer.from(bytes)
  changedBytes[changedBytes.indexOf('ABEL')] = 'X'.charCodeAt(0)
  await writeFile(sourcePath, changedBytes)
  await assert.rejects(loadReconciliation(temporaryRoot), /Source fingerprint changed/u)
  await writeFile(sourcePath, bytes)
  const manifestPath = path.join(temporaryRoot, 'source-manifest.json')
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'))
  manifest.files.pop()
  await writeFile(manifestPath, JSON.stringify(manifest))
  await assert.rejects(loadReconciliation(temporaryRoot), /entire available bundle/u)
} finally {
  await rm(temporaryRoot, { recursive: true, force: true })
}
console.log('Content reconciliation negative checks passed (coverage, drift, approval, owners, merge targets, defects and inventory).')
