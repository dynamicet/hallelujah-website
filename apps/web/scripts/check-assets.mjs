import assert from 'node:assert/strict'
import { chmod, mkdir, readdir, writeFile, symlink, rm, readFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'
import { assetCurrent, assetDigest, assetHash, applyAssetCommand, requireAssetInput } from '../src/content/asset-record.ts'
import { clamAvScanner, ControlledAssetStore } from '../src/content/asset-intake.ts'
import { assetFixture, assetPixels, fixtureAssetScanner } from './lib/asset-fixture.mjs'

assert.equal(sharp.versions.sharp, '0.35.4')
const store = await ControlledAssetStore.create(process.env.ASSET_TEST_TEMP_PARENT ?? '/tmp')
const input = assetFixture()
const bytes = await assetPixels()
const intake = (value = input, data = bytes, mime = 'image/png', scanner = fixtureAssetScanner) =>
  store.intake(value, data, mime, 'cms:1', scanner)
try {
  for (const field of Object.keys(input)) {
    const invalid = structuredClone(input)
    delete invalid[field]
    assert.throws(() => requireAssetInput(invalid), /Asset|Raster/)
  }
  for (const change of [{ synthetic: false }, { version: 0 }, { kind: 'script' }, { scan: {} },
    { assetId: '../original' }, { reviewAt: '2026-02-30T12:00:00.000Z' }]) {
    assert.throws(() => requireAssetInput({ ...input, ...change }))
  }
  for (const routes of [['/about/?q=private'], ['/../'], ['//evil/'], ['/about/', '/about/']]) {
    assert.throws(() => requireAssetInput({ ...input, rights: { ...input.rights, routes } }), /permitted use/)
  }
  for (const [key, value] of Object.entries({ license: '', consent: '', territories: [], channels: [], restrictions: '', expiresAt: input.publishAt })) {
    assert.throws(() => requireAssetInput({ ...input, rights: { ...input.rights, [key]: value } }))
  }
  for (const point of [NaN, Infinity, -1, 1.1, '0.5']) {
    assert.throws(() => requireAssetInput({ ...input, crop: { ...input.crop, focalPoint: { x: point, y: 0.5 } } }), /focal point/)
  }
  assert.throws(() => requireAssetInput({ ...input, localized: { en: { ...input.localized.en, purpose: 'decorative' } } }), /alternative/)
  assert.throws(() => requireAssetInput({ ...input, authenticity: { ...input.authenticity, bakedText: true } }), /baked text/)
  assert.throws(() => requireAssetInput({ ...input, kind: 'logo' }), /cannot be cropped/)
  const record = await intake()
  assert.equal(record.scan.fixtureOnly, true)
  assert.equal(record.scan.sha256, record.original.sha256)
  assert.equal(record.original.sha256, assetHash(bytes))
  assert.ok((await sharp(await store.read(record.original.key)).metadata()).exif)
  assert.equal(record.state, 'review')
  assert.equal(record.outputs.length, 10)
  for (const output of record.outputs) {
    const data = await store.read(output.key)
    const metadata = await sharp(data).metadata()
    assert.equal(output.bytes, data.length)
    assert.equal(output.sha256, assetHash(data))
    assert.equal(output.width, metadata.width)
    assert.equal(output.height, metadata.height)
    assert.ok(output.width <= 800 && output.height <= 400)
    assert.equal(metadata.exif, undefined)
    assert.equal(metadata.icc, undefined)
    assert.equal(metadata.xmp, undefined)
    if (output.ratio === 1) {
      assert.equal(output.width, output.height)
      const { data: pixels } = await sharp(data).raw().toBuffer({ resolveWithObject: true })
      assert.ok(pixels[0] > 240 && pixels[2] < 15, 'focal crop must retain red right-hand region')
    }
  }
  const small = await intake(input, await assetPixels(64, 32))
  assert.ok(small.outputs.every((output) => output.width <= 64 && output.height <= 32))
  const beforeFailures = (await readdir(store.root)).sort()
  await assert.rejects(() => intake(input, Buffer.alloc(0)), /byte policy/)
  await assert.rejects(() => intake(input, Buffer.alloc(33 * 1024 * 1024)), /byte policy/)
  await assert.rejects(() => intake(input, bytes, 'image/jpeg'), /MIME/)
  await assert.rejects(() => intake(input, Buffer.from('<script>bad</script>')), /MIME/)
  await assert.rejects(() => intake(input, bytes.subarray(0, 12)), /Input|png|image|buffer/i)
  await assert.rejects(() => intake(input, bytes, 'image/png', async () => { throw new Error('infected fixture') }), /infected/)
  for (const change of [{ sha256: '0'.repeat(64) }, { signatures: '' }, { engine: '' }, { fixtureOnly: undefined },
    { at: new Date(Date.now() - 120000).toISOString() }, { at: new Date(Date.now() + 120000).toISOString() }, { extra: 'forged' }]) {
    await assert.rejects(() => intake(input, bytes, 'image/png', async (file, hash) => ({ ...await fixtureAssetScanner(file, hash), ...change })), /scan receipt/)
  }
  await assert.rejects(() => intake(input, bytes, 'image/png', async (file, hash) => {
    const receipt = await fixtureAssetScanner(file, hash)
    await writeFile(file, Buffer.from('changed-after-scan'))
    return receipt
  }), /original bytes/)
  assert.deepEqual((await readdir(store.root)).sort(), beforeFailures, 'failed intake must leave no original or output residue')
  await assert.rejects(() => store.read('../original'), /private asset key/)
  const foreign = path.join(store.root, 'synthetic-foreign-cleanup')
  await mkdir(foreign)
  await writeFile(path.join(foreign, 'native-320.png'), Buffer.from('must-survive-symlink-cleanup'))
  const linkToken = 'deadbeefdeadbeefdeadbeef'
  await symlink(foreign, path.join(store.root, linkToken))
  const linkedRecord = { ...record, original: { ...record.original, key: `${linkToken}/original` },
    outputs: [{ ...record.outputs[0], key: `${linkToken}/native-320.png` }] }
  await assert.rejects(() => store.read(linkedRecord.outputs[0].key), /symbolic link/)
  await assert.rejects(() => store.removeOutputs(linkedRecord), /symbolic link/)
  assert.equal((await readFile(path.join(foreign, 'native-320.png'))).toString(), 'must-survive-symlink-cleanup')
  await rm(path.join(store.root, linkToken))
  await rm(foreign, { recursive: true })
  for (const [kind, mime, data] of [
    ['font', 'font/woff2', Buffer.from('wOF2synthetic-quarantine-only')],
    ['document', 'application/pdf', Buffer.from('%PDF-1.7 synthetic-quarantine-only')],
    ['video', 'video/mp4', Buffer.from([0, 0, 0, 20, ...Buffer.from('ftypisomsynthetic')])],
    ['icon', 'image/svg+xml', Buffer.from('<svg><script>never render</script></svg>')],
  ]) {
    const fixture = assetFixture(input.assetId, kind)
    if (kind === 'video') fixture.localized.en.caption = 'Synthetic caption fixture'
    const held = await intake(fixture, data, mime)
    assert.equal(held.state, 'quarantined')
    assert.equal(held.outputs.length, 0)
    assert.throws(() => applyAssetCommand(held, { action: 'review', expectedRevision: 1, role: 'brand', reference: 'synthetic' },
      { id: 'cms:2', roles: ['brand'] }, new Date()), /Quarantined/)
  }
  let reviewed = record
  const review = (doc, role, actor = { id: 'cms:2', roles: [role] }, clock = new Date()) =>
    applyAssetCommand(doc, { action: 'review', expectedRevision: doc.revision, role, reference: 'Synthetic independent review' }, actor, clock)
  assert.throws(() => review(record, 'brand', { id: 'cms:1', roles: ['brand'] }), /independent/)
  assert.throws(() => review(record, 'privacy', { id: 'cms:2', roles: ['brand'] }), /matching role/)
  assert.throws(() => applyAssetCommand(record, { action: 'review', role: 'brand', expectedRevision: 0, reference: 'stale' }, { id: 'cms:2', roles: ['brand'] }, new Date()), /Stale/)
  for (const role of ['brand', 'privacy', 'accessibility']) reviewed = review(reviewed, role)
  assert.equal(reviewed.state, 'approved')
  assert.equal(assetCurrent(reviewed, new Date()), true)
  for (const date of [reviewed.input.reviewAt, reviewed.input.expiresAt, reviewed.input.rights.expiresAt]) {
    assert.equal(assetCurrent(reviewed, new Date(date)), false)
    assert.throws(() => review(reviewed, 'brand', { id: 'cms:2', roles: ['brand'] }, new Date(date)), /due or expired/)
  }
  assert.equal(assetCurrent(reviewed, new Date('invalid')), false)
  assert.equal(assetCurrent({ ...reviewed, input: { ...input, owner: 'Changed' } }, new Date()), false)
  assert.notEqual(assetDigest({ input, original: record.original, scan: record.scan, outputs: record.outputs }),
    assetDigest({ input: { ...input, owner: 'Changed' }, original: record.original, scan: record.scan, outputs: record.outputs }))
  if (process.argv.includes('--capture')) {
    const target = new URL('../../../docs/backlog/evidence/b02-011-artifacts/', import.meta.url)
    await mkdir(target, { recursive: true })
    const report = { synthetic: true, fixtureOnlyScan: record.scan.fixtureOnly,
      engine: record.scan.engine, realMalwareClearance: false, publication: 'disabled',
      originalMetadataRetained: true, derivativeMetadata: 'stripped',
      outputs: record.outputs.map(({ mime, bytes, width, height, ratio, sha256 }) => ({ mime, bytes, width, height, ratio, sha256 })) }
    await writeFile(new URL('raster-report.json', target), JSON.stringify(report, null, 2) + '\n')
    for (const [name, ratio] of [['native-320.png', null], ['focal-crop-320.png', 1]]) {
      const specimen = record.outputs.find((output) => output.mime === 'image/png' && output.width === 320 && output.ratio === ratio)
      await writeFile(new URL(name, target), await store.read(specimen.key))
    }
  }
  const withdrawn = applyAssetCommand(reviewed, { action: 'withdraw', expectedRevision: reviewed.revision, reference: 'Synthetic consent withdrawal' }, { id: 'cms:3', roles: ['publisher'] }, new Date())
  assert.equal(assetCurrent(withdrawn, new Date()), false)
  assert.deepEqual(withdrawn.audit.slice(0, -1), reviewed.audit)
  await store.removeOutputs(withdrawn)
  await store.removeOutputs(withdrawn)
  for (const output of withdrawn.outputs) await assert.rejects(() => store.read(output.key), /ENOENT/)
  assert.equal(assetHash(await store.read(withdrawn.original.key)), withdrawn.original.sha256)

  // A local executable shim verifies actual execFile exits, missing engine, stale signatures,
  // timeout-independent errors and no shell interpolation. It is NOT the real ClamAV engine.
  const bin = path.join(store.root, 'scanner-bin')
  await mkdir(bin)
  const previousPath = process.env.PATH
  process.env.PATH = bin
  try {
    await assert.rejects(() => clamAvScanner('/synthetic/file', 'hash'), /ENOENT/)
    const shim = path.join(bin, 'clamscan')
    async function commandShim(version, exit) {
      await writeFile(shim, `#!${process.execPath}\nif (process.argv.includes('--version')) process.stdout.write(${JSON.stringify(version)}); else process.exit(${exit});\n`)
      await chmod(shim, 0o700)
    }
    await commandShim(`ClamAV 1.4.0/123/${new Date().toUTCString()}\n`, 0)
    assert.equal((await clamAvScanner('/synthetic/$(never-execute)', 'hash')).fixtureOnly, false)
    for (const exit of [1, 2]) {
      await commandShim(`ClamAV 1.4.0/123/${new Date().toUTCString()}\n`, exit)
      await assert.rejects(() => clamAvScanner('/synthetic/file', 'hash'))
    }
    await commandShim('ClamAV 1.4.0/123/Mon, 01 Jan 2024 12:00:00 GMT\n', 0)
    await assert.rejects(() => clamAvScanner('/synthetic/file', 'hash'), /stale/)
    await commandShim('ClamAV 1.4.0\n', 0)
    await assert.rejects(() => clamAvScanner('/synthetic/file', 'hash'), /signatures/)
  } finally { process.env.PATH = previousPath }
  process.stdout.write('Asset governance, scanner byte binding/failures, private residue cleanup, MIME, metadata stripping, non-upscaled responsive focal crops, quarantine, independent review and expiry checks passed. No real malware clearance claimed.\n')
} finally { await store.destroy() }
