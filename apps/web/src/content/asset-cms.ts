import {
  commitTransaction, createLocalReq, initTransaction, killTransaction,
  type CollectionConfig, type Payload, type PayloadRequest, type TypedUser,
} from 'payload'
import { cmsActor, lockCmsWrites, roleAccess } from './cms-identity.ts'
import { canonical, requiredDomains, type CmsWorkflow, type WorkflowDocument } from './cms-workflow.ts'
import { controlledDiscovery } from './governed-discovery.ts'
import { validateGovernedRecord } from './governed-record.ts'
import { controlledDiscoveryCache } from './discovery-cache.ts'
import { ControlledAssetStore, type AssetScanner } from './asset-intake.ts'
import {
  applyAssetCommand, assetCurrent, assetHash, assetReviewRoles, assetRoute,
  type AssetCommand, type AssetLocale, type AssetRecord, type AssetScope,
} from './asset-record.ts'

// Only this module can stage intake receipts. overrideAccess cannot bypass hooks.
const stagedIntakes = new WeakMap<PayloadRequest, AssetRecord>()
const stagedLifecycle = new WeakSet<PayloadRequest>()
const lifecycleReason = 'Controlled lifecycle ended; derivative and content references removed'
const deny = () => false
type AssetSnapshot = Readonly<{ assetId: string; version: number; synthetic: true;
  alternative: NonNullable<AssetRecord['input']['localized'][AssetLocale]>;
  outputs: AssetRecord['outputs']; validUntil: number; fixtureOnlyScan: boolean; delivery?: { mime: string; bytes: Uint8Array } }>
const controlledConsumers = new Map<string, Set<string>>()
export function evictControlledAsset(assetKey: string): void {
  controlledConsumers.delete(assetKey)
  controlledDiscoveryCache.invalidate()
}
export function controlledAssetReferenceCount(assetKey: string): number {
  return controlledConsumers.get(assetKey)?.size ?? 0
}
const keyOf = (record: AssetRecord) => `${record.input.assetId}:${record.input.version}`

export const governedAssetsCollection: CollectionConfig = {
  slug: 'governed-assets', endpoints: false, graphQL: false,
  admin: { hidden: true }, disableBulkDelete: true, disableBulkEdit: true, disableDuplicate: true,
  access: { admin: deny, create: roleAccess('author'), read: roleAccess('author', 'brand', 'privacy', 'accessibility', 'publisher'),
    update: roleAccess('brand', 'privacy', 'accessibility', 'publisher'), delete: deny },
  fields: [
    { name: 'assetKey', type: 'text', required: true, unique: true, index: true },
    { name: 'record', type: 'json', required: true, admin: { readOnly: true } },
    { name: 'command', type: 'json', virtual: true },
  ],
  hooks: {
    beforeDelete: [() => { throw new Error('Asset original and audit provenance must be retained; withdraw instead') }],
    beforeChange: [async ({ operation, data, originalDoc, req }) => {
      let actor = await cmsActor(req)
      if (!actor) throw new Error('Asset writes require an active persisted local identity')
      await lockCmsWrites(req)
      actor = await cmsActor(req)
      if (!actor) throw new Error('Asset identity is no longer active')
      let record: AssetRecord
      if (operation === 'create') {
        const staged = stagedIntakes.get(req)
        if (!actor.roles.includes('author') || !staged || staged.author !== actor.id
          || data.command || canonical(data.record) !== canonical(staged)) throw new Error('Asset creation requires server-owned scanned intake receipts')
        record = staged
        stagedIntakes.delete(req)
        const peers = await req.payload.find({ collection: 'governed-assets', overrideAccess: true,
          pagination: false, limit: 1000, req })
        if (peers.totalDocs > peers.docs.length) throw new Error('Asset versions require the complete local set')
        const versions = peers.docs.map((doc) => doc.record as AssetRecord)
          .filter((peer) => peer.input.assetId === record.input.assetId)
        if (record.input.version !== Math.max(0, ...versions.map((peer) => peer.input.version)) + 1
          || versions.some((peer) => peer.input.kind !== record.input.kind)) throw new Error('Asset versions must be sequential with immutable kind')
      } else {
        const latest = await req.payload.findByID({ collection: 'governed-assets', id: originalDoc.id,
          overrideAccess: true, depth: 0, req })
        if (data.record !== undefined && canonical(data.record) !== canonical(originalDoc.record)) throw new Error('Asset originals, governance, scan/output receipts and audit are immutable; ingest a successor version')
        const command = data.command as AssetCommand
        if (command?.action === 'attach' && (!command.scope
          || !(await currentAssetConsumer(req.payload, req, command.scope)))) throw new Error('Asset attachment requires a current matching governed content consumer')
        const previous = latest.record as AssetRecord
        const ended = previous.state === 'withdrawn' || Date.now() >= Math.min(
          Date.parse(previous.input.reviewAt), Date.parse(previous.input.expiresAt), Date.parse(previous.input.rights.expiresAt))
        const lifecycle = stagedLifecycle.has(req) && ended && command.action === 'withdraw' && command.reference === lifecycleReason
        record = applyAssetCommand(previous, command, lifecycle
          ? { id: 'system:asset-lifecycle', roles: ['publisher'] } : actor, new Date())
        if (record.state === 'approved' && !(await liveAssetReviews(req.payload, req, record))) throw new Error('Asset approval identity is inactive or no longer has its matching role')
      }
      if (data.assetKey !== undefined && data.assetKey !== keyOf(record)) throw new Error('Asset stable ID/version key is immutable')
      return { assetKey: keyOf(record), record }
    }],
    // Empty eviction is safe even if the enclosing transaction subsequently rolls back.
    afterChange: [({ doc }) => { evictControlledAsset(doc.assetKey); return doc }],
  },
}

export async function ingestCmsAsset(payload: Payload, user: TypedUser | undefined,
  store: ControlledAssetStore, input: unknown, bytes: Buffer, mime: string, scanner?: AssetScanner) {
  const req = await createLocalReq({ user }, payload)
  const actor = await cmsActor(req)
  if (!actor?.roles.includes('author')) throw new Error('Asset intake requires an active local author')
  const record = await store.intake(input, bytes, mime, actor.id, scanner)
  try {
    await initTransaction(req)
    stagedIntakes.set(req, record)
    const doc = await payload.create({ collection: 'governed-assets', user, overrideAccess: false,
      data: { assetKey: keyOf(record), record }, req })
    await commitTransaction(req)
    return doc
  } catch (error) {
    await killTransaction(req)
    await store.discard(record)
    throw error
  } finally { stagedIntakes.delete(req) }
}

async function liveAssetReviews(payload: Payload, req: PayloadRequest, record: AssetRecord): Promise<boolean> {
  for (const role of assetReviewRoles) {
    const review = record.reviews[role]
    if (!review || !/^cms:[1-9]\d*$/.test(review.actor)) return false
    const identity = await payload.findByID({ collection: 'users', id: Number(review.actor.slice(4)),
      overrideAccess: true, depth: 0, req }).catch(() => null)
    if (!identity?.active || identity.synthetic !== true || !identity.roles.includes(role)) return false
  }
  return true
}

/** Controlled reference only. No browser URL, request or publication authority. */
export async function resolveCmsAsset(payload: Payload, user: TypedUser | undefined, store: ControlledAssetStore,
  assetKey: string, scope: { route: string; channel: string; territory: string; locale: AssetLocale; consumer: string },
  mode?: 'controlled-fixture', deliveryKey?: string): Promise<AssetSnapshot | null> {
  if (!/^asset_[a-z0-9]{12,32}:[1-9]\d{0,6}$/.test(assetKey) || !assetRoute(scope.route)
    || !['en', 'am'].includes(scope.locale) || !/^pub_[a-f0-9]{12}$/.test(scope.consumer)) throw new Error('Asset resolution scope is invalid')
  const req = await createLocalReq({ user }, payload)
  await initTransaction(req)
  try {
    await lockCmsWrites(req)
    const actor = await cmsActor(req)
    if (!actor?.roles.some((role) => ['brand', 'privacy', 'accessibility', 'publisher'].includes(role))) throw new Error('Asset resolution requires an active review identity')
    const result = await payload.find({ collection: 'governed-assets', where: { assetKey: { equals: assetKey } },
      limit: 1, overrideAccess: false, depth: 0, user, req })
    const record = result.docs[0]?.record as AssetRecord | undefined
    if (!record) { evictControlledAsset(assetKey); await commitTransaction(req); return null }
    const boundary = Math.min(Date.parse(record.input.reviewAt), Date.parse(record.input.expiresAt), Date.parse(record.input.rights.expiresAt))
    const ended = record.state === 'withdrawn' || Date.now() >= boundary
    if (ended) {
      evictControlledAsset(assetKey)
      await store.removeOutputs(record)
      await clearEndedReferences(payload, req, result.docs[0], record, user)
      await commitTransaction(req)
      return null
    }
    if (!assetCurrent(record, new Date()) || !(await liveAssetReviews(payload, req, record))) {
      evictControlledAsset(assetKey); await commitTransaction(req); return null
    }
    const rights = record.input.rights
    if (mode !== 'controlled-fixture' || !rights.routes.includes(scope.route)
      || !rights.channels.includes(scope.channel) || !rights.territories.includes(scope.territory)
      || !record.input.localized[scope.locale]) { await commitTransaction(req); return null }
    if (deliveryKey && (!(record.references ?? []).some((entry) => canonical(entry.scope) === canonical(scope))
      || !(await currentAssetConsumer(payload, req, scope)))) { evictControlledAsset(assetKey); await commitTransaction(req); return null }
    // A cached reference cannot authorize changed bytes.
    if (assetHash(await store.read(record.original.key)) !== record.original.sha256) throw new Error('Original asset fingerprint mismatch')
    let delivery: AssetSnapshot['delivery']
    for (const output of record.outputs) {
      const bytes = await store.read(output.key)
      if (assetHash(bytes) !== output.sha256) throw new Error('Asset derivative fingerprint mismatch')
      if (output.key === deliveryKey) delivery = { mime: output.mime, bytes }
    }
    if (deliveryKey && !delivery) throw new Error('Delivery key is not an approved derivative')
    if (Date.now() >= boundary) {
      evictControlledAsset(assetKey)
      await store.removeOutputs(record)
      await clearEndedReferences(payload, req, result.docs[0], record, user)
      await commitTransaction(req)
      return null
    }
    const snapshot: AssetSnapshot = { assetId: record.input.assetId, version: record.input.version, synthetic: true,
      alternative: structuredClone(record.input.localized[scope.locale]!), outputs: structuredClone(record.outputs),
      validUntil: boundary, fixtureOnlyScan: record.scan.fixtureOnly, ...(delivery ? { delivery } : {}) }
    // Consumer IDs carry no asset data. Register before commit while the write lock is held;
    // rollback evicts them, and a subsequent withdrawal cannot race a post-commit insertion.
    if (controlledConsumers.size >= 1000) controlledConsumers.clear()
    const consumers = controlledConsumers.get(assetKey) ?? new Set<string>()
    if (consumers.size >= 1000) consumers.clear()
    consumers.add(scope.consumer)
    controlledConsumers.set(assetKey, consumers)
    await commitTransaction(req)
    return structuredClone(snapshot)
  } catch (error) {
    evictControlledAsset(assetKey)
    await killTransaction(req)
    throw error
  }
}

/** Explicit local maintenance; originals/audit remain, no production scheduler. */
export async function sweepCmsAssets(payload: Payload, user: TypedUser | undefined, store: ControlledAssetStore): Promise<number> {
  const req = await createLocalReq({ user }, payload)
  await initTransaction(req)
  try {
    await lockCmsWrites(req)
    if (!(await cmsActor(req))?.roles.includes('publisher')) throw new Error('Asset cleanup requires an active publisher')
    const result = await payload.find({ collection: 'governed-assets', limit: 1000, pagination: false,
      overrideAccess: true, depth: 0, req })
    if (result.totalDocs > result.docs.length) throw new Error('Asset cleanup requires the complete local set')
    let removed = 0
    for (const doc of result.docs) {
      const record = doc.record as AssetRecord
      const due = Math.min(Date.parse(record.input.reviewAt), Date.parse(record.input.expiresAt), Date.parse(record.input.rights.expiresAt))
      if (record.state === 'withdrawn' || Date.now() >= due) {
        evictControlledAsset(doc.assetKey)
        await store.removeOutputs(record)
        await clearEndedReferences(payload, req, doc, record, user)
        removed += 1
      }
    }
    await commitTransaction(req)
    return removed
  } catch (error) { await killTransaction(req); throw error }
}


async function currentAssetConsumer(payload: Payload, req: PayloadRequest, scope: AssetScope): Promise<boolean> {
  const result = await payload.find({ collection: 'governed-records', limit: 1000, pagination: false,
    overrideAccess: true, depth: 0, req })
  if (result.totalDocs > result.docs.length) throw new Error('Asset references require the complete local content set')
  const documents: WorkflowDocument[] = []
  for (const doc of result.docs) {
    const parsed = validateGovernedRecord(doc.record)
    if (!parsed.ok) return false
    const record = parsed.record
    const workflow = doc.workflow as CmsWorkflow
    let live = true
    if (record.status === 'published') for (const [id, role] of [
      [record.approval?.actor, 'reviewer'],
      ...requiredDomains(record, workflow.contentClass).map((role) => [workflow.reviews[role]?.actor, role]),
      ...(['contact', 'emergency'].includes(workflow.contentClass) ? [[workflow.verification?.actor, 'operations']] : []),
    ]) {
      const identity = id && /^cms:[1-9]\d*$/.test(id) ? await payload.findByID({ collection: 'users',
        id: Number(id.slice(4)), overrideAccess: true, depth: 0, req }).catch(() => null) : null
      if (!identity?.active || !identity.synthetic || !(identity.roles as readonly string[]).includes(role!)) { live = false; break }
    }
    documents.push({ record, workflow: live ? workflow : { ...workflow, reviews: {} } })
  }
  return controlledDiscovery(documents, req.origin ?? '', new Date(), 'controlled-fixture').entries
    .some((entry) => entry.publicId === scope.consumer && entry.locale === scope.locale && entry.path === scope.route)
}

async function clearEndedReferences(payload: Payload, req: PayloadRequest,
  doc: { id: string | number }, record: AssetRecord, user: TypedUser | undefined) {
  if (!(record.references ?? []).length) return
  // The server stages this one cleanup command only after physical removal under the lock.
  stagedLifecycle.add(req)
  try { await payload.update({ collection: 'governed-assets', id: doc.id, user, overrideAccess: false, req,
    data: { command: { action: 'withdraw', expectedRevision: record.revision, reference: lifecycleReason } } })
  } finally { stagedLifecycle.delete(req) }
}

/** Private byte consumption, reauthorized and read while the CMS write lock is held. */
export async function readCmsAssetBytes(payload: Payload, user: TypedUser | undefined, store: ControlledAssetStore,
  assetKey: string, scope: AssetScope, key: string, mode?: 'controlled-fixture') {
  const resolved = await resolveCmsAsset(payload, user, store, assetKey, scope, mode, key)
  return resolved?.delivery ? { mime: resolved.delivery.mime, bytes: Buffer.from(resolved.delivery.bytes),
    headers: { 'Cache-Control': 'private, no-store', 'X-Robots-Tag': 'noindex, nofollow',
      'X-Content-Type-Options': 'nosniff', 'Content-Security-Policy': "default-src 'none'; base-uri 'none'; form-action 'none'" },
    synthetic: true, fixtureOnlyScan: resolved.fixtureOnlyScan } : null
}
