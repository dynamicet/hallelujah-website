import assert from 'node:assert/strict'
import { randomBytes } from 'node:crypto'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { mkdtemp, rm, writeFile, symlink } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { cmsContentTransfer } from '../src/content/content-transfer-cms.ts'
import { transferFixture, transferBundle, transferEntry } from './lib/content-transfer-fixture.mjs'

/** Fault injection belongs only to the disposable smoke configuration. */
export function installTransferFailureFixture(config) {
  const collection = config.collections.find((entry) => entry.slug === 'governed-records')
  collection.hooks.afterChange.push(({ doc }) => {
    if (doc.record.source.reference === 'synthetic-transfer-db-failure') throw new Error('Synthetic transfer persistence failure')
    return doc
  })
}

export async function checkContentTransferDb(payload, { identity, denied, fixtureSuffix }) {
  const author = await identity('transfer-author', ['author'])
  const reviewer = await identity('transfer-reviewer', ['reviewer', 'content'])
  const manager = await identity('transfer-manager', ['identity-manager'])
  const other = await identity('transfer-other', ['author'])
  const publisher = await identity('transfer-publisher', ['publisher'])
  const execute = (user, action, bundle, expectedPlanHash) => cmsContentTransfer(payload, user,
    { action, bundle, expectedPlanHash })
  const snapshot = async () => (await execute(reviewer, 'export')).snapshot
  const instant = (offset) => new Date(Date.now() + offset).toISOString().replace(/\.\d{3}Z$/, 'Z')
  const approvedRecord = { ...transferFixture(`${fixtureSuffix}1304`),
    publishAt: instant(-3600000), reviewAt: instant(86400000 * 30), expiresAt: instant(86400000 * 60) }
  let approved = await payload.create({ collection: 'governed-records', user: other, overrideAccess: false,
    data: { publicId: approvedRecord.publicId, record: approvedRecord, contentClass: 'general' } })
  for (const [user, action, extra] of [[other, 'submit', {}],
    [reviewer, 'review-domain', { domain: 'content', reference: 'Synthetic transfer approval preservation' }],
    [reviewer, 'approve', {}], [publisher, 'publish', {}]]) {
    approved = await payload.update({ collection: 'governed-records', id: approved.id, user, overrideAccess: false,
      data: { command: { action, expectedRevision: approved.workflow.revision, ...extra } } })
  }
  const first = transferFixture(`${fixtureSuffix}1301`)
  const second = { ...transferFixture(`${fixtureSuffix}1302`), relationships: [first.publicId] }
  const bundle = transferBundle([transferEntry(second), transferEntry(first),
    { sourceKey: 'synthetic/remote-media-withheld', operation: 'skip' }])
  await denied(() => execute(undefined, 'export'), /active persisted/)
  await denied(() => execute(reviewer, 'dry-run', bundle), /active persisted/)
  const initial = await snapshot()
  assert.deepEqual(initial.documents.find((doc) => doc.record.publicId === approvedRecord.publicId).record.approval, approved.record.approval)
  const dry = await execute(author, 'dry-run', bundle)
  assert.equal(dry.report.valid, true)
  assert.equal(dry.report.totals.create, 2)
  assert.deepEqual(await snapshot(), initial, 'dry run cannot mutate workflow or audit')
  await denied(() => execute(author, 'import', bundle), /matching dry-run/)
  const result = await execute(author, 'import', bundle, dry.report.planHash)
  assert.equal(result.changed, true)
  assert.equal(result.snapshot.documents.find((doc) => doc.record.publicId === first.publicId).record.owner, `cms:${author.id}`)
  const after = await snapshot()
  await denied(() => execute(author, 'import', bundle, dry.report.planHash), /stale|changed/)
  const repeat = await execute(author, 'dry-run', bundle)
  assert.equal(repeat.report.totals.skip, 3)
  const noOp = await execute(author, 'import', bundle, repeat.report.planHash)
  assert.equal(noOp.changed, false)
  assert.deepEqual(await snapshot(), after, 'repeat import preserves all IDs, revisions, approvals and audit')
  await denied(() => execute(author, 'export'), /Complete export/)
  assert.equal((await execute(other, 'dry-run', bundle)).report.valid, false)

  const changed = { ...first, localized: { ...first.localized,
    en: { ...first.localized.en, title: 'Synthetic transfer edited title' } } }
  const updateBundle = transferBundle([transferEntry(changed)])
  const updateDry = await execute(author, 'dry-run', updateBundle)
  assert.equal(updateDry.report.totals.update, 1)
  const concurrent = await Promise.allSettled([
    execute(author, 'import', updateBundle, updateDry.report.planHash),
    execute(author, 'import', updateBundle, updateDry.report.planHash),
  ])
  assert.equal(concurrent.filter((value) => value.status === 'fulfilled').length, 1)
  assert.match(concurrent.find((value) => value.status === 'rejected').reason.message, /stale|changed/)
  const edited = (await snapshot()).documents.find((doc) => doc.record.publicId === first.publicId)
  const original = after.documents.find((doc) => doc.record.publicId === first.publicId)
  assert.equal(edited.id, original.id)
  assert.equal(edited.workflow.revision, original.workflow.revision + 1)
  assert.deepEqual(edited.record.audit.slice(0, -1), original.record.audit)

  const merged = { ...changed, source: { ...changed.source, reference: 'synthetic-explicit-merge-evidence' } }
  const mergeBundle = transferBundle([transferEntry(merged, { operation: 'merge' })])
  const mergeDry = await execute(author, 'dry-run', mergeBundle)
  assert.equal(mergeDry.report.totals.merge, 1)
  await execute(author, 'import', mergeBundle, mergeDry.report.planHash)

  // The first write succeeds inside the transaction; the second hook then fails.
  // Rollback must restore pre-batch records, approval metadata and revision/audit, with no new ID.
  const failing = transferFixture(`${fixtureSuffix}1303`)
  failing.source.reference = 'synthetic-transfer-db-failure'
  const rollbackBundle = transferBundle([
    transferEntry({ ...merged, localized: { ...merged.localized,
      en: { ...merged.localized.en, title: 'Synthetic rolled-back edit' } } }, { sourceKey: 'a/edit' }),
    transferEntry(failing, { sourceKey: 'z/failure' }),
  ])
  const beforeRollback = await snapshot()
  const rollbackDry = await execute(author, 'dry-run', rollbackBundle)
  assert.equal(rollbackDry.report.valid, true)
  await denied(() => execute(author, 'import', rollbackBundle, rollbackDry.report.planHash), /persistence failure/)
  assert.deepEqual(await snapshot(), beforeRollback, 'late failure must roll back the whole persisted batch')
  const invalid = transferBundle([transferEntry({ ...first, synthetic: false })])
  assert.equal((await execute(author, 'dry-run', invalid)).report.valid, false)
  assert.deepEqual(await snapshot(), beforeRollback)
  const directory = await mkdtemp(path.join(tmpdir(), 'b02-013-cli-'))
  try {
    const password = randomBytes(24).toString('hex')
    const email = `fixture-transfer-cli-${fixtureSuffix}@cms.invalid`
    await payload.create({ collection: 'users', overrideAccess: true,
      data: { email, password, roles: ['author', 'reviewer'], synthetic: true, active: true } })
    const script = fileURLToPath(new URL('./content-transfer.mjs', import.meta.url))
    const env = { ...process.env, LOCAL_CONTENT_TRANSFER_EMAIL: email, LOCAL_CONTENT_TRANSFER_PASSWORD: password }
    const run = (args, environment = env) => promisify(execFile)(process.execPath, [script, ...args],
      { env: environment, timeout: 30000, maxBuffer: 4 * 1024 * 1024 })
    const cliFixture = transferFixture(`${fixtureSuffix}1305`)
    const inputPath = path.join(directory, 'synthetic-bundle.json')
    await writeFile(inputPath, JSON.stringify(transferBundle([transferEntry(cliFixture)])))
    const dryOutput = await run(['dry-run', inputPath])
    const dryRun = JSON.parse(dryOutput.stdout)
    assert.equal(dryRun.report.totals.create, 1)
    const imported = JSON.parse((await run(['import', inputPath, dryRun.report.planHash])).stdout)
    assert.equal(imported.changed, true)
    const exported = JSON.parse((await run(['export'])).stdout)
    assert.ok(exported.snapshot.documents.find((doc) => doc.record.publicId === cliFixture.publicId))
    assert.ok(!JSON.stringify(exported).includes(password))
    const deniedLogin = await run(['export'], { ...env, LOCAL_CONTENT_TRANSFER_PASSWORD: 'synthetic-invalid-login' }).catch((error) => error)
    assert.equal(deniedLogin.code, 1)
    assert.equal(deniedLogin.stdout, '')
    assert.match(deniedLogin.stderr, /Local content transfer failed/)
    const symlinkPath = path.join(directory, 'bundle-link.json')
    await symlink(inputPath, symlinkPath)
    await assert.rejects(run(['dry-run', symlinkPath]))
    await assert.rejects(run(['import', inputPath, 'invalid-plan']))
    const remote = await run(['export'], { ...env,
      LOCAL_DATABASE_URL: 'postgresql://fixture:synthetic@external.invalid/hallelujah_content_local' }).catch((error) => error)
    assert.equal(remote.code, 1)
    assert.equal(remote.stdout, '')
    assert.match(remote.stderr, /loopback or Unix-socket/)
    console.log('Local transfer CLI passed: JSON export/dry-run/import, credential-safe login failure, symlink and malformed-plan denial.')
  } finally { await rm(directory, { recursive: true, force: true }) }

  const beforeRevoke = await snapshot()
  const revokeDry = await execute(author, 'dry-run', mergeBundle)
  await payload.update({ collection: 'users', id: author.id, user: manager,
    overrideAccess: false, data: { active: false } })
  await denied(() => execute(author, 'import', mergeBundle, revokeDry.report.planHash), /active persisted/)
  assert.deepEqual(await snapshot(), beforeRevoke)
  console.log('Disposable content transfer persistence passed: dry-run/no-op, forward references, owned updates/merges, concurrent stale-plan denial, late rollback and live identity revocation.')
}
