import assert from 'node:assert/strict'
import { readdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import {
  controlledAssetReferenceCount, ingestCmsAsset, resolveCmsAsset, sweepCmsAssets, readCmsAssetBytes,
} from '../src/content/asset-cms.ts'
import { ControlledAssetStore } from '../src/content/asset-intake.ts'
import { assetHash } from '../src/content/asset-record.ts'
import { assetFont, assetPdf, assetSvg, assetVideo, assetVtt } from './lib/asset-format-fixture.mjs'
import { assetFixture, assetPixels, fixtureAssetScanner } from './lib/asset-fixture.mjs'

export async function checkAssetsDb(payload, { identity, denied, fixtureSuffix }) {
  const store = await ControlledAssetStore.create(process.env.ASSET_TEST_TEMP_PARENT ?? '/tmp', { python: process.env.ASSET_FORMAT_PYTHON ?? 'python3' })
  const bytes = await assetPixels()
  const author = await identity('asset-author', ['author', 'brand', 'publisher'])
  const brand = await identity('asset-brand', ['brand'])
  const privacy = await identity('asset-privacy', ['privacy'])
  const accessibility = await identity('asset-accessibility', ['accessibility'])
  const publisher = await identity('asset-publisher', ['publisher'])
  const manager = await identity('asset-manager', ['identity-manager'])
  const content = await identity('asset-content', ['content'])
  const reviewer = await identity('asset-reviewer', ['reviewer'])
  const actors = { brand, privacy, accessibility }
  const input = assetFixture(`asset_${fixtureSuffix}`)
  const scope = { route: '/about/', channel: 'controlled-review', territory: 'local-fixture', locale: 'en', consumer: `pub_${fixtureSuffix}` }
  const resolve = (doc, extra = {}, mode = 'controlled-fixture', user = publisher) =>
    resolveCmsAsset(payload, user, store, doc.assetKey, { ...scope, ...extra }, mode)
  const command = (doc, user, action, extra = {}) => payload.update({
    collection: 'governed-assets', id: doc.id, user, overrideAccess: false,
    data: { command: { action, expectedRevision: doc.record.revision, reference: 'Synthetic asset review/withdrawal', ...extra } },
  })
  async function approved(doc) {
    for (const role of ['brand', 'privacy', 'accessibility']) if (!doc.record.reviews[role]) doc = await command(doc, actors[role], 'review', { role })
    assert.equal(doc.record.state, 'approved')
    return doc
  }
  try {
    await denied(() => ingestCmsAsset(payload, undefined, store, input, bytes, 'image/png', fixtureAssetScanner), /active local author/)
    await denied(() => payload.create({ collection: 'governed-assets', user: author, overrideAccess: true,
      data: { assetKey: `${input.assetId}:1`, record: input } }), /server-owned scanned/)
    let doc = await ingestCmsAsset(payload, author, store, input, bytes, 'image/png', fixtureAssetScanner)
    assert.equal(doc.assetKey, `${input.assetId}:1`)
    assert.equal(doc.record.author, `cms:${author.id}`)
    assert.equal(doc.record.scan.fixtureOnly, true)
    assert.equal(doc.record.original.sha256, assetHash(bytes))
    assert.equal(await resolve(doc), null)
    await denied(() => command(doc, author, 'review', { role: 'brand' }), /independent/)
    await denied(() => command(doc, brand, 'review', { role: 'privacy' }), /matching role/)
    await denied(() => payload.update({ collection: 'governed-assets', id: doc.id, user: brand, overrideAccess: true,
      data: { record: { ...doc.record, state: 'approved' }, command: { action: 'review', role: 'brand', expectedRevision: 1, reference: 'forged' } } }), /immutable/)
    await denied(() => payload.update({ collection: 'governed-assets', id: doc.id, user: brand, overrideAccess: true,
      data: { assetKey: 'asset_000000000000:1', command: { action: 'review', role: 'brand', expectedRevision: 1, reference: 'forged key' } } }), /immutable/)
    await denied(() => payload.delete({ collection: 'governed-assets', id: doc.id, user: publisher, overrideAccess: true }), /retained/)
    const concurrent = await Promise.allSettled([
      command(doc, brand, 'review', { role: 'brand' }), command(doc, privacy, 'review', { role: 'privacy' }),
    ])
    assert.equal(concurrent.filter((result) => result.status === 'fulfilled').length, 1)
    assert.match(concurrent.find((result) => result.status === 'rejected').reason.message, /Stale asset revision/)
    doc = await payload.findByID({ collection: 'governed-assets', id: doc.id, user: publisher, overrideAccess: false })
    doc = await approved(doc)
    const snapshot = await resolve(doc)
    assert.equal(snapshot.synthetic, true)
    assert.equal(snapshot.fixtureOnlyScan, true)
    assert.equal(snapshot.alternative.alt, input.localized.en.alt)
    snapshot.outputs[0].bytes = 0
    assert.ok((await resolve(doc)).outputs[0].bytes > 0)
    assert.equal(controlledAssetReferenceCount(doc.assetKey), 1)
    assert.equal(await resolveCmsAsset(payload, publisher, store, doc.assetKey, scope), null, 'default mode withholds all references')
    for (const extra of [{ route: '/contact/' }, { channel: 'public' }, { territory: 'worldwide' }, { locale: 'am' }]) assert.equal(await resolve(doc, extra), null)
    await denied(() => resolveCmsAsset(payload, undefined, store, doc.assetKey, scope, 'controlled-fixture'), /active review identity/)
    await payload.update({ collection: 'users', id: brand.id, user: manager, overrideAccess: false, data: { roles: ['author'] } })
    assert.equal(await resolve(doc), null, 'persisted role revocation must remove eligibility despite cached user claims')
    assert.equal(controlledAssetReferenceCount(doc.assetKey), 0)
    await payload.update({ collection: 'users', id: brand.id, user: manager, overrideAccess: false, data: { roles: ['brand'] } })
    assert.ok(await resolve(doc))
    // Persist a real governed content consumer rather than accepting an arbitrary public ID.
    const record = {
      publicId: 'pub_a11111111111', kind: 'page', status: 'draft', synthetic: true,
      localized: { en: { slug: 'home', title: 'Synthetic asset consumer' } },
      source: { reference: 'Synthetic asset consumer fixture', recordedAt: new Date(Date.now() - 60000).toISOString().replace(/\.\d{3}Z$/, 'Z') },
      owner: null, reviewer: null, approval: null, domainApproval: null, relationships: [],
      publishAt: new Date(Date.now() - 30000).toISOString().replace(/\.\d{3}Z$/, 'Z'),
      reviewAt: new Date(Date.now() + 86400000).toISOString().replace(/\.\d{3}Z$/, 'Z'),
      expiresAt: new Date(Date.now() + 172800000).toISOString().replace(/\.\d{3}Z$/, 'Z'), withdrawal: null, audit: [],
    }
    // The complete integration may already own /home/. Select an unused permitted static route.
    const existing = await payload.find({ collection: 'governed-records', pagination: false, user: publisher, overrideAccess: false })
    const slug = ['home', 'doctors', 'services'].find((value) => !existing.docs.some((doc) => doc.record.kind === 'page' && doc.record.localized.en?.slug === value))
    assert.ok(slug, 'synthetic asset consumer needs an unused canonical page')
    record.localized.en.slug = slug
    const consumerScope = { ...scope, consumer: record.publicId, route: slug === 'home' ? '/' : `/${slug}/` }
    const linkedInput = { ...input, assetId: 'asset_a11111111111', rights: { ...input.rights, routes: [consumerScope.route] } }
    let linked = await approved(await ingestCmsAsset(payload, author, store, linkedInput, bytes, 'image/png', fixtureAssetScanner))
    const attach = () => command(linked, publisher, 'attach', { scope: consumerScope })
    await denied(attach, /current matching governed content consumer/)
    let consumer = await payload.create({ collection: 'governed-records', user: author, overrideAccess: false,
      data: { publicId: record.publicId, record, contentClass: 'general' } })
    async function contentCommand(user, action, extra = {}) {
      consumer = await payload.update({ collection: 'governed-records', id: consumer.id, user, overrideAccess: false,
        data: { command: { action, expectedRevision: consumer.workflow.revision, ...extra } } })
    }
    await contentCommand(author, 'submit')
    await contentCommand(content, 'review-domain', { domain: 'content', reference: 'Synthetic content review' })
    await contentCommand(reviewer, 'approve')
    await contentCommand(publisher, 'publish')
    await new Promise((resolve) => setTimeout(resolve, Math.max(0, Date.parse(consumer.record.approval.at) - Date.now() + 25)))
    linked = await attach()
    assert.equal(linked.record.references.length, 1)
    const key = linked.record.outputs[0].key
    const deliver = (user = publisher, mode = 'controlled-fixture', selected = key) =>
      readCmsAssetBytes(payload, user, store, linked.assetKey, consumerScope, selected, mode)
    const delivered = await deliver()
    assert.equal(delivered.mime, 'image/webp')
    assert.equal(assetHash(delivered.bytes), linked.record.outputs[0].sha256)
    assert.equal(delivered.headers['Cache-Control'], 'private, no-store')
    assert.equal(await readCmsAssetBytes(payload, publisher, store, linked.assetKey, consumerScope, key), null)
    await denied(() => deliver(publisher, 'controlled-fixture', linked.record.original.key), /approved derivative/)
    await denied(() => command(linked, brand, 'attach', { scope: consumerScope }), /publisher/)
    const reopened = await ControlledAssetStore.reopen(store.root, { python: process.env.ASSET_FORMAT_PYTHON ?? 'python3' })
    assert.equal(assetHash((await readCmsAssetBytes(payload, publisher, reopened, linked.assetKey, consumerScope, key, 'controlled-fixture')).bytes), linked.record.outputs[0].sha256)
    await payload.update({ collection: 'users', id: content.id, user: manager, overrideAccess: false, data: { roles: ['author'] } })
    assert.equal(await deliver(), null, 'content role revocation immediately blocks previously linked delivery')
    await payload.update({ collection: 'users', id: content.id, user: manager, overrideAccess: false, data: { roles: ['content'] } })
    assert.ok(await deliver())
    const timedLinkedInput = { ...linkedInput, assetId: 'asset_a22222222222',
      rights: { ...linkedInput.rights, expiresAt: new Date(Date.now() + 2500).toISOString() } }
    let timedLinked = await approved(await ingestCmsAsset(payload, author, store, timedLinkedInput, bytes, 'image/png', fixtureAssetScanner))
    timedLinked = await command(timedLinked, publisher, 'attach', { scope: consumerScope })
    assert.ok(await readCmsAssetBytes(payload, publisher, store, timedLinked.assetKey, consumerScope, timedLinked.record.outputs[0].key, 'controlled-fixture'))
    await new Promise((resolve) => setTimeout(resolve, Math.max(0, Date.parse(timedLinkedInput.rights.expiresAt) - Date.now() + 25)))
    assert.equal(await readCmsAssetBytes(payload, brand, store, timedLinked.assetKey, consumerScope, timedLinked.record.outputs[0].key, 'controlled-fixture'), null)
    const cleaned = await payload.findByID({ collection: 'governed-assets', id: timedLinked.id, user: publisher, overrideAccess: false })
    assert.deepEqual(cleaned.record.references, [])
    assert.equal(cleaned.record.state, 'withdrawn')
    assert.equal(cleaned.record.audit.at(-1).actor, 'system:asset-lifecycle')
    for (const output of cleaned.record.outputs) await denied(() => store.read(output.key), /ENOENT/)
    assert.equal(assetHash(await store.read(cleaned.record.original.key)), cleaned.record.original.sha256)

    await contentCommand(publisher, 'withdraw', { reason: 'Synthetic content consumer withdrawn', successorPublicId: null })
    assert.equal(await deliver(), null, 'content withdrawal immediately blocks linked bytes')
    linked = await command(linked, publisher, 'withdraw')
    assert.deepEqual(linked.record.references, [])
    assert.equal(await deliver(), null)
    assert.equal(assetHash(await reopened.read(linked.record.original.key)), linked.record.original.sha256)

    const directoryBefore = (await readdir(store.root)).sort()
    await denied(() => ingestCmsAsset(payload, author, store, { ...input, version: 3 }, bytes, 'image/png', fixtureAssetScanner), /sequential/)
    assert.deepEqual((await readdir(store.root)).sort(), directoryBefore, 'failed persistence must discard all newly staged files')
    const next = await ingestCmsAsset(payload, author, store, { ...input, version: 2 }, bytes, 'image/png', fixtureAssetScanner)
    assert.equal(next.record.reviews.brand, undefined)
    assert.equal(await resolve(next), null)
    await denied(() => ingestCmsAsset(payload, author, store, { ...input, kind: 'logo', version: 3, crop: { ...input.crop, ratios: [] } }, bytes, 'image/png', fixtureAssetScanner), /immutable kind/)
    const originalDerivative = await store.read(doc.record.outputs[0].key)
    await writeFile(path.join(store.root, doc.record.outputs[0].key), Buffer.from('tampered-private-output'))
    await denied(() => resolve(doc), /derivative fingerprint mismatch/)
    assert.equal(controlledAssetReferenceCount(doc.assetKey), 0)
    await writeFile(path.join(store.root, doc.record.outputs[0].key), originalDerivative)
    assert.ok(await resolve(doc))
    const audit = structuredClone(doc.record.audit)
    doc = await command(doc, publisher, 'withdraw')
    assert.equal(controlledAssetReferenceCount(doc.assetKey), 0)
    assert.equal(await resolve(doc), null)
    assert.deepEqual(doc.record.audit.slice(0, -1), audit)
    for (const output of doc.record.outputs) await denied(() => store.read(output.key), /ENOENT/)
    assert.equal(assetHash(await store.read(doc.record.original.key)), doc.record.original.sha256)
    const quarantinedStore = await ControlledAssetStore.reopen(store.root)
    const held = await ingestCmsAsset(payload, author, quarantinedStore,
      { ...assetFixture('asset_fafafafafafa', 'document'), provenance: { ...input.provenance, originalName: 'synthetic.pdf' } },
      Buffer.from('%PDF-1.7 quarantined synthetic fixture only'), 'application/pdf', fixtureAssetScanner)
    await denied(() => command(held, brand, 'review', { role: 'brand' }), /Quarantined/)
    assert.equal(await resolve(held), null)

    // Every non-raster processor also persists, receives independent live reviews,
    // resolves by physical receipts and withdraws through the actual database adapter.
    const fontInput = assetFixture('asset_a33333333333', 'font')
    fontInput.localized.am = { ...fontInput.localized.en, alt: 'ምሳሌ' }
    const documentInput = assetFixture('asset_a44444444444', 'document')
    documentInput.localized.en.transcript = 'Synthetic complete readable document'
    const videoInput = assetFixture('asset_a55555555555', 'video')
    videoInput.localized.en.caption = assetVtt
    videoInput.localized.en.transcript = 'Synthetic silent blue frame'
    for (const [value, data, mime] of [
      [assetFixture('asset_a66666666666', 'icon'), assetSvg, 'image/svg+xml'],
      [fontInput, await assetFont(store.root), 'font/woff2'],
      [documentInput, assetPdf(), 'application/pdf'],
      [videoInput, await assetVideo(store.root), 'video/mp4'],
    ]) {
      let processed = await approved(await ingestCmsAsset(payload, author, store, value, data, mime, fixtureAssetScanner))
      assert.ok((await resolve(processed)).outputs.length > 0)
      if (value.kind === 'font') assert.ok((await resolve(processed, { locale: 'am' })).outputs.some((output) => output.locale === 'am'))
      processed = await command(processed, publisher, 'withdraw')
      assert.equal(await resolve(processed), null)
      for (const output of processed.record.outputs) await denied(() => store.read(output.key), /ENOENT/)
      assert.equal(assetHash(await store.read(processed.record.original.key)), processed.record.original.sha256)
    }

    // Actual timed boundary, not a forged record or virtual clock. Review/rights expiry independently apply.
    for (const boundary of ['reviewAt', 'rights']) {
      const timed = assetFixture(boundary === 'reviewAt' ? 'asset_fbbbbbbbbbbb' : 'asset_fccccccccccc')
      const due = new Date(Date.now() + 2500).toISOString()
      if (boundary === 'rights') timed.rights.expiresAt = due
      else timed.reviewAt = due
      const current = await approved(await ingestCmsAsset(payload, author, store, timed, bytes, 'image/png', fixtureAssetScanner))
      assert.ok(await resolve(current))
      await new Promise((resolve) => setTimeout(resolve, Math.max(0, Date.parse(due) - Date.now() + 25)))
      assert.equal(await resolve(current), null)
      assert.equal(controlledAssetReferenceCount(current.assetKey), 0)
      for (const output of current.record.outputs) await denied(() => store.read(output.key), /ENOENT/)
      assert.equal(assetHash(await store.read(current.record.original.key)), current.record.original.sha256)
    }
    await denied(() => sweepCmsAssets(payload, brand, store), /active publisher/)
    assert.ok(await sweepCmsAssets(payload, publisher, store) >= 3)
    process.stdout.write('Asset PostgreSQL authenticated intake, server-receipt forgery denials, concurrent revisions, live-role revocation, scope/default/language denial, file fingerprints, sequential versions, rollback cleanup and real review/consent expiry passed.\n')
  } finally { await store.destroy() }
}
