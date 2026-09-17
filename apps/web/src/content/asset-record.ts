import { createHash } from 'node:crypto'
import { canonical } from './cms-workflow.ts'

export const assetKinds = ['logo', 'image', 'icon', 'font', 'document', 'video'] as const
export type AssetKind = typeof assetKinds[number]
export type AssetLocale = 'en' | 'am'
export type AssetInput = Readonly<{
  assetId: string; version: number; kind: AssetKind; synthetic: true
  provenance: { reference: string; originalName: string; recordedAt: string }
  owner: string; removalOwner: string; fallback: 'omit' | 'neutral'
  rights: { license: string; consent: string; routes: readonly string[]; channels: readonly string[];
    territories: readonly string[]; restrictions: string; expiresAt: string }
  authenticity: { description: string; claimLimitations: string; bakedText: false }
  localized: Partial<Record<AssetLocale, { purpose: 'informative' | 'decorative'; alt: string;
    caption: string | null; transcript: string | null; audioDescription: string | null }>>
  crop: { focalPoint: { x: number; y: number }; ratios: readonly number[]; landmarks: string } | null
  publishAt: string; reviewAt: string; expiresAt: string
}>
export type AssetOutput = Readonly<{ key: string; sha256: string; mime: string; bytes: number;
  width: number; height: number; ratio: number | null; colorProfile: 'sRGB' | null; metadata: 'stripped';
  purpose?: 'font' | 'vector' | 'document-text' | 'document-preview' | 'video' | 'poster' | 'captions';
  locale?: AssetLocale; duration?: number; coverage?: readonly number[]; weight?: number }>
export type AssetScope = Readonly<{ route: string; channel: string; territory: string; locale: AssetLocale; consumer: string }>
export type AssetReference = Readonly<{ scope: AssetScope; actor: string; at: string }>
export type AssetReviewRole = 'brand' | 'privacy' | 'accessibility'
export const assetReviewRoles: readonly AssetReviewRole[] = ['brand', 'privacy', 'accessibility']
export type AssetRecord = Readonly<{
  input: AssetInput; revision: number; author: string; state: 'quarantined' | 'review' | 'approved' | 'withdrawn'
  original: { key: string; sha256: string; mime: string; bytes: number }
  scan: { sha256: string; engine: string; signatures: string; at: string; fixtureOnly: boolean }
  outputs: readonly AssetOutput[]
  references?: readonly AssetReference[]
  reviews: Partial<Record<AssetReviewRole, { actor: string; at: string; digest: string; reference: string }>>
  audit: readonly { actor: string; at: string; action: string; reason: string }[]
}>

const text = (value: unknown): value is string => typeof value === 'string'
  && value.trim().length > 0 && value.length <= 4096 && !/[\u0000-\u0008\u000b-\u001f]/u.test(value)
const instant = (value: unknown): value is string => typeof value === 'string'
  && /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{3}Z$/.test(value)
  && Number.isFinite(Date.parse(value)) && new Date(value).toISOString() === value
const object = (value: unknown): value is Record<string, unknown> => value !== null
  && typeof value === 'object' && !Array.isArray(value)
const exact = (value: unknown, keys: readonly string[]) => object(value)
  && Object.keys(value).length === keys.length && keys.every((key) => Object.hasOwn(value, key))
const strings = (value: unknown) => Array.isArray(value) && value.length > 0 && value.length <= 50
  && value.every(text) && new Set(value).size === value.length
export const assetRoute = (value: unknown): value is string => typeof value === 'string'
  && /^\/(?:[a-z0-9-]+\/)*$/.test(value) && value.length <= 256
export const assetHash = (bytes: Uint8Array) => createHash('sha256').update(bytes).digest('hex')
export const assetDigest = (record: Pick<AssetRecord, 'input' | 'original' | 'scan' | 'outputs'>) =>
  assetHash(Buffer.from(canonical(record)))

/** Strict authoring contract. No scan, output, approval or storage receipts can be authored. */
export function requireAssetInput(value: unknown): AssetInput {
  if (!exact(value, ['assetId', 'version', 'kind', 'synthetic', 'provenance', 'owner', 'removalOwner',
    'fallback', 'rights', 'authenticity', 'localized', 'crop', 'publishAt', 'reviewAt', 'expiresAt'])) {
    throw new Error('Asset input has missing or unsupported fields')
  }
  const raw = value as Record<string, unknown>
  if (typeof raw.assetId !== 'string' || !/^asset_[a-z0-9]{12,32}$/.test(raw.assetId)
    || !Number.isSafeInteger(raw.version) || Number(raw.version) < 1 || Number(raw.version) > 1000000
    || !assetKinds.includes(raw.kind as AssetKind) || raw.synthetic !== true) throw new Error('Asset stable identity, kind or synthetic boundary is invalid')
  if (!text(raw.owner) || !text(raw.removalOwner) || !['omit', 'neutral'].includes(String(raw.fallback))) throw new Error('Asset ownership and fallback are required')
  if (!exact(raw.provenance, ['reference', 'originalName', 'recordedAt'])) throw new Error('Asset provenance is required')
  const provenance = raw.provenance as Record<string, unknown>
  if (!text(provenance.reference) || !text(provenance.originalName)
    || /[\\/]/.test(provenance.originalName) || !instant(provenance.recordedAt)) throw new Error('Asset original provenance is invalid')
  if (!exact(raw.rights, ['license', 'consent', 'routes', 'channels', 'territories', 'restrictions', 'expiresAt'])) throw new Error('Asset rights and consent are required')
  const rights = raw.rights as Record<string, unknown>
  if (!text(rights.license) || !text(rights.consent) || !text(rights.restrictions) || !strings(rights.routes)
    || !(rights.routes as unknown[]).every(assetRoute) || !strings(rights.channels)
    || !strings(rights.territories) || !instant(rights.expiresAt)) throw new Error('Asset permitted use or rights expiry is invalid')
  if (!exact(raw.authenticity, ['description', 'claimLimitations', 'bakedText'])) throw new Error('Asset authenticity review is required')
  const authenticity = raw.authenticity as Record<string, unknown>
  if (!text(authenticity.description) || !text(authenticity.claimLimitations) || authenticity.bakedText !== false) throw new Error('Asset claims and no baked text decision are required')
  if (!object(raw.localized) || !Object.keys(raw.localized).length
    || Object.keys(raw.localized).some((locale) => !['en', 'am'].includes(locale))) throw new Error('Asset language alternatives are invalid')
  for (const alternative of Object.values(raw.localized)) {
    if (!exact(alternative, ['purpose', 'alt', 'caption', 'transcript', 'audioDescription'])) throw new Error('Asset accessibility fields are required')
    const entry = alternative as Record<string, unknown>
    if (!['informative', 'decorative'].includes(String(entry.purpose))
      || (entry.purpose === 'informative' ? !text(entry.alt) : entry.alt !== '')
      || ['caption', 'transcript', 'audioDescription'].some((key) => entry[key] !== null && !text(entry[key]))) throw new Error('Asset alternative purpose or text is invalid')
    if (raw.kind === 'video' && entry.purpose === 'informative'
      && (!text(entry.caption) || !text(entry.transcript) || !text(entry.audioDescription))) throw new Error('Informative video requires caption, transcript and audio description decision')
  }
  const raster = ['logo', 'image', 'icon'].includes(String(raw.kind))
  if (raster) {
    if (!exact(raw.crop, ['focalPoint', 'ratios', 'landmarks'])) throw new Error('Raster assets require crop governance')
    const crop = raw.crop as Record<string, unknown>
    if (!exact(crop.focalPoint, ['x', 'y']) || !text(crop.landmarks)
      || !Array.isArray(crop.ratios) || crop.ratios.length > 4 || new Set(crop.ratios).size !== crop.ratios.length
      || !crop.ratios.every((ratio) => typeof ratio === 'number' && Number.isFinite(ratio) && ratio >= 0.25 && ratio <= 4)) throw new Error('Raster crop ratios or landmarks are invalid')
    if (!Object.values(crop.focalPoint as Record<string, unknown>).every((point) => typeof point === 'number' && Number.isFinite(point) && point >= 0 && point <= 1)) throw new Error('Raster focal point is invalid')
    if (raw.kind !== 'image' && crop.ratios.length) throw new Error('Logos and icons cannot be cropped')
  } else if (raw.crop !== null) throw new Error('Non-raster crop must be null')
  if (![raw.publishAt, raw.reviewAt, raw.expiresAt].every(instant)
    || Date.parse(String(raw.publishAt)) >= Date.parse(String(raw.reviewAt))
    || Date.parse(String(raw.reviewAt)) > Date.parse(String(raw.expiresAt))
    || Date.parse(String(raw.publishAt)) >= Date.parse(String(rights.expiresAt))
    || Date.parse(String(provenance.recordedAt)) > Date.parse(String(raw.publishAt))) throw new Error('Asset lifecycle dates are invalid')
  return structuredClone(raw) as unknown as AssetInput
}

export function assetCurrent(record: AssetRecord, now: Date): boolean {
  const at = now.getTime()
  return Number.isFinite(at) && record.state === 'approved'
    && record.outputs.length > 0 && record.scan.sha256 === record.original.sha256
    && at >= Date.parse(record.input.publishAt) && at >= Date.parse(record.scan.at)
    && at < Math.min(Date.parse(record.input.reviewAt), Date.parse(record.input.expiresAt), Date.parse(record.input.rights.expiresAt))
    && assetReviewRoles.every((role) => {
      const review = record.reviews[role]
      return review && review.actor !== record.author && Date.parse(review.at) <= at
        && review.digest === assetDigest({ input: record.input, original: record.original, scan: record.scan, outputs: record.outputs })
    })
}

export type AssetCommand = Readonly<{ action: 'review' | 'withdraw' | 'attach' | 'detach'; expectedRevision: number;
  role?: AssetReviewRole; reference: string; scope?: AssetScope }>

export function applyAssetCommand(record: AssetRecord, command: AssetCommand,
  actor: { id: string; roles: readonly string[] }, now: Date): AssetRecord {
  if (!exact(command, command.action === 'review'
    ? ['action', 'expectedRevision', 'role', 'reference']
    : ['attach', 'detach'].includes(command.action) ? ['action', 'expectedRevision', 'reference', 'scope']
      : ['action', 'expectedRevision', 'reference'])
    || !text(command.reference)) throw new Error('Asset command is invalid')
  if (command.expectedRevision !== record.revision) throw new Error('Stale asset revision')
  if (!Number.isFinite(now.getTime()) || now.getTime() < Date.parse(record.audit.at(-1)!.at)) throw new Error('Asset audit time cannot move backwards')
  let state = record.state
  let references = structuredClone([...(record.references ?? [])])
  const reviews = structuredClone(record.reviews)
  if (command.action === 'withdraw') {
    if (!actor.roles.includes('publisher')) throw new Error('Asset withdrawal requires publisher role')
    state = 'withdrawn'
    references = []
  } else if (command.action === 'attach' || command.action === 'detach') {
    if (!actor.roles.includes('publisher')) throw new Error('Asset references require publisher role')
    const scope = command.scope
    if (!exact(scope, ['route', 'channel', 'territory', 'locale', 'consumer']) || !scope
      || !assetRoute(scope.route) || !['en', 'am'].includes(scope.locale)
      || !/^pub_[a-f0-9]{12}$/.test(scope.consumer) || !text(scope.channel) || !text(scope.territory)) throw new Error('Invalid asset reference scope')
    references = references.filter((entry) => canonical(entry.scope) !== canonical(scope))
    if (command.action === 'attach') {
      if (!assetCurrent(record, now) || !record.input.rights.routes.includes(scope.route)
        || !record.input.rights.channels.includes(scope.channel) || !record.input.rights.territories.includes(scope.territory)
        || !record.input.localized[scope.locale] || references.length >= 1000) throw new Error('Asset reference is unavailable or outside approved scope')
      references.push({ scope: structuredClone(scope), actor: actor.id, at: now.toISOString() })
    }
  } else if (command.action === 'review') {
    const role = command.role
    if (!role || !assetReviewRoles.includes(role) || !actor.roles.includes(role)) throw new Error('Asset review requires its matching role')
    if (now.getTime() >= Math.min(Date.parse(record.input.reviewAt), Date.parse(record.input.expiresAt), Date.parse(record.input.rights.expiresAt))) throw new Error('Asset rights/content review is due or expired')
    if (actor.id === record.author) throw new Error('Asset review must be independent of its author')
    if (!['review', 'approved'].includes(record.state) || !record.outputs.length) throw new Error('Quarantined or withdrawn assets cannot be approved')
    const digest = assetDigest({ input: record.input, original: record.original, scan: record.scan, outputs: record.outputs })
    reviews[role] = { actor: actor.id, at: now.toISOString(), digest, reference: command.reference }
    state = assetReviewRoles.every((required) => reviews[required]?.digest === digest) ? 'approved' : 'review'
  } else throw new Error('Unsupported asset command')
  return { ...record, state, reviews, references, revision: record.revision + 1,
    audit: [...record.audit, { actor: actor.id, at: now.toISOString(), action: command.action, reason: command.reference }] }
}
