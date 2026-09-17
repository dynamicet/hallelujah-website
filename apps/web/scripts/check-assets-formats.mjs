import assert from 'node:assert/strict'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { mkdir, mkdtemp, readdir, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import sharp from 'sharp'
import { ControlledAssetStore } from '../src/content/asset-intake.ts'
import { assetHash, assetCurrent, applyAssetCommand } from '../src/content/asset-record.ts'
import { requireAssetCaptions } from '../src/content/asset-formats.ts'
import { assetFixture, fixtureAssetScanner } from './lib/asset-fixture.mjs'
import { assetFont, assetPdf, assetSvg, assetVideo, assetVtt } from './lib/asset-format-fixture.mjs'

const execute = promisify(execFile)
const temporary = await mkdtemp(path.join(tmpdir(), 'hallelujah-asset-format-fixtures-'))
const store = await ControlledAssetStore.create(process.env.ASSET_TEST_TEMP_PARENT ?? '/tmp', { python: process.env.ASSET_FORMAT_PYTHON ?? 'python3' })
const inputs = { icon: assetFixture('asset_222222222222', 'icon'), font: assetFixture('asset_333333333333', 'font'),
  document: assetFixture('asset_444444444444', 'document'), video: assetFixture('asset_555555555555', 'video') }
inputs.font.localized.am = { ...inputs.font.localized.en, alt: 'ምሳሌ' }
inputs.document.localized.en.transcript = 'Synthetic complete readable document'
inputs.video.localized.en.caption = assetVtt
inputs.video.localized.en.transcript = 'Synthetic silent blue frame'
inputs.video.localized.en.audioDescription = 'The complete transcript describes the silent static frame; no additional audio track is required in this synthetic fixture'
const ingest = (input, bytes, mime) => store.intake(input, bytes, mime, 'cms:1', fixtureAssetScanner)
try {
  const records = [await ingest(inputs.icon, assetSvg, 'image/svg+xml'),
    await ingest(inputs.font, await assetFont(temporary), 'font/woff2'),
    await ingest(inputs.document, assetPdf(), 'application/pdf'),
    await ingest(inputs.video, await assetVideo(temporary), 'video/mp4')]
  assert.deepEqual(records.map((record) => record.outputs.length), [2, 2, 2, 3])
  for (let record of records) {
    assert.equal(record.state, 'review')
    for (const role of ['brand', 'privacy', 'accessibility']) record = applyAssetCommand(record,
      { action: 'review', role, expectedRevision: record.revision, reference: 'Synthetic processor and accessible equivalent review' },
      { id: `cms:${role === 'brand' ? 2 : role === 'privacy' ? 3 : 4}`, roles: [role] }, new Date())
    assert.equal(assetCurrent(record, new Date()), true)
    for (const output of record.outputs) {
      const bytes = await store.read(output.key)
      assert.equal(assetHash(bytes), output.sha256)
      assert.equal(bytes.length, output.bytes)
      if (output.mime === 'image/png') {
        const metadata = await sharp(bytes).metadata()
        assert.equal(metadata.exif, undefined); assert.equal(metadata.icc, undefined); assert.equal(metadata.xmp, undefined)
        assert.equal(output.width, metadata.width); assert.equal(output.height, metadata.height)
      }
    }
    const files = await readdir(path.join(store.root, record.original.key.split('/')[0]))
    assert.deepEqual(files.sort(), ['original', ...record.outputs.map((output) => output.key.split('/')[1])].sort(), 'decoded intermediates must not survive intake')
  }
  const vector = await store.read(records[0].outputs.find((output) => output.purpose === 'vector').key)
  assert.ok(!vector.toString().includes('metadata') && !vector.toString().includes('synthetic-private-source'))
  const fonts = records[1].outputs
  assert.equal(fonts[0].weight, 400)
  assert.ok(fonts.find((output) => output.locale === 'en').coverage.includes(65))
  assert.ok(fonts.find((output) => output.locale === 'am').coverage.includes(0x1200))
  assert.ok(fonts.every((output) => output.bytes < records[1].original.bytes), 'justified language subsets reduce source bytes')
  const html = (await store.read(records[2].outputs.find((output) => output.purpose === 'document-text').key)).toString()
  assert.ok(html.includes(inputs.document.localized.en.transcript))
  assert.ok(!html.includes('JavaScript') && !html.includes('app.alert') && !html.includes('OpenAction'))
  const escaped = { ...inputs.document, assetId: 'asset_666666666666', localized: { en: { ...inputs.document.localized.en, transcript: 'Synthetic <script>private & text</script>' } } }
  const safe = await ingest(escaped, assetPdf(escaped.localized.en.transcript), 'application/pdf')
  const escapedHtml = (await store.read(safe.outputs.find((output) => output.purpose === 'document-text').key)).toString()
  assert.ok(escapedHtml.includes('&lt;script&gt;') && !escapedHtml.includes('<script>'))
  const movie = records[3].outputs.find((output) => output.purpose === 'video')
  assert.ok(movie.width <= 160 && movie.height <= 90 && movie.duration <= 1.05)
  const { stdout: info } = await execute('ffprobe', ['-v', 'error', '-show_format', '-of', 'json', path.join(store.root, movie.key)])
  assert.ok(!info.includes('synthetic-private-video-title'))
  const caption = await store.read(records[3].outputs.find((output) => output.purpose === 'captions').key)
  assert.equal(caption.toString(), assetVtt)
  const before = (await readdir(store.root)).sort()
  for (const unsafe of [
    '<svg width="24" height="24" viewBox="0 0 24 24"><script>alert(1)</script></svg>',
    '<svg width="24" height="24" viewBox="0 0 24 24"><image href="https://example.invalid/private"/></svg>',
    '<svg width="24" height="24" viewBox="0 0 24 24" onload="alert(1)"/>',
    '<svg width="24" height="24" viewBox="0 0 24 24"><path style="fill:url(https://example.invalid/)"/></svg>',
    '<svg width="24" height="24" viewBox="0 0 24 24"><foreignObject/></svg>',
    '<?xml version="1.0"?><!DOCTYPE svg [<!ENTITY x SYSTEM "file:///etc/passwd">]><svg/>',
  ]) await assert.rejects(() => ingest(inputs.icon, Buffer.from(unsafe), 'image/svg+xml'))
  const latin = await assetFont(temporary, true)
  await assert.rejects(() => ingest(inputs.font, latin, 'font/woff2'), /language coverage/)
  await assert.rejects(() => ingest(inputs.font, Buffer.from('wOF2malformed'), 'font/woff2'), /Font|font/)
  await assert.rejects(() => ingest(inputs.document, assetPdf('Different readable text'), 'application/pdf'), /matching accessible transcript/)
  await assert.rejects(() => ingest({ ...inputs.document, localized: { en: { ...inputs.document.localized.en, transcript: null } } }, assetPdf(), 'application/pdf'), /accessible transcript/)
  await assert.rejects(() => ingest(inputs.document, Buffer.from('%PDF-malformed'), 'application/pdf'))
  await assert.rejects(() => ingest(inputs.video, Buffer.from('0000ftypisommalformed'), 'video/mp4'))
  for (const caption of ['plain caption', 'WEBVTT\n\n00:00:00.000 --> 00:00:04.000\nOutside duration',
    'WEBVTT\n\n00:00:00.000 --> 00:00:00.900\n<script>bad</script>',
    'WEBVTT\n\n00:00:00.500 --> 00:00:00.100\nReversed']) assert.throws(() => requireAssetCaptions(caption, 1))
  assert.deepEqual((await readdir(store.root)).sort(), before, 'all malformed format intake must leave no staged residue')
  const recovered = await ControlledAssetStore.reopen(store.root, { python: process.env.ASSET_FORMAT_PYTHON ?? 'python3' })
  for (const record of records) for (const output of record.outputs) assert.equal(assetHash(await recovered.read(output.key)), output.sha256)
  await assert.rejects(() => ControlledAssetStore.reopen('/var/tmp'), /Recovery/)
  const recovery = await recovered.inspectRecovery(records)
  assert.ok(recovery.integrity.every((entry) => entry.status === 'verified'))
  assert.ok(recovery.orphanTokens.includes(safe.original.key.split('/')[0]), 'unreferenced original remains private and is reported')
  const lost = records[0].outputs[0]
  const saved = await store.read(lost.key)
  await writeFile(path.join(store.root, lost.key), Buffer.from('synthetic corrupted recovered output'))
  assert.equal((await recovered.inspectRecovery([records[0]])).integrity[0].status, 'unavailable')
  await writeFile(path.join(store.root, lost.key), saved)
  for (const record of records) {
    await recovered.removeOutputs(record); await recovered.removeOutputs(record)
    for (const output of record.outputs) await assert.rejects(() => store.read(output.key), /ENOENT/)
    assert.equal(assetHash(await recovered.read(record.original.key)), record.original.sha256)
  }
  if (process.argv.includes('--capture')) {
    const target = new URL('../../../docs/backlog/evidence/b02-011-artifacts/', import.meta.url)
    await mkdir(target, { recursive: true })
    await writeFile(new URL('format-report.json', target), JSON.stringify({ synthetic: true, fixtureOnlyScan: true,
      realMalwareClearance: false, publication: 'disabled', fonttools: '4.65.0', brotli: '1.2.0',
      records: records.map((record) => ({ kind: record.input.kind, outputs: record.outputs.map(({ mime, bytes, width, height, purpose, locale, duration, coverage, weight, sha256 }) =>
        ({ mime, bytes, width, height, purpose, locale, duration, coverageCount: coverage?.length, weight, sha256 })) })) }, null, 2) + '\n')
  }
  process.stdout.write('Local font coverage/subsetting, strict SVG sanitization/decode, readable escaped document equivalents/previews, bounded video transcode/poster/captions, format negatives, intermediate cleanup and restart recovery passed.\n')
} finally { await store.destroy(); await rm(temporary, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 }) }
