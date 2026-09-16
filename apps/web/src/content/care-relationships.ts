import type { CmsActor, CmsRole } from './cms-identity.ts'
import { canonical } from './cms-workflow.ts'
import { clinicianReadiness } from './clinician.ts'
import { serviceReadiness } from './service.ts'
import { validateGovernedRecord, validateRecordSet, type GovernedRecord } from './governed-record.ts'

export const careDomains = ['medical', 'clinical', 'operations'] as const
export type CareDomain = typeof careDomains[number]
export type CareDefinition = Readonly<{
  publicId: string; synthetic: true
  doctorPublicId: string; servicePublicId: string; locationPublicId: string
  source: string; reviewAt: string; expiresAt: string
}>
type Stamp = Readonly<{ actor: string; at: string; reference: string }>
export type CareRelationship = Readonly<{
  definition: CareDefinition; revision: number; author: string
  state: 'draft' | 'review' | 'approved' | 'withdrawn'
  endpointSnapshot: string
  reviews: Partial<Record<CareDomain, Stamp>>
  approval: Stamp | null
  audit: readonly Readonly<{ actor: string; at: string; change: string }>[]
}>
export type CareCommand = Readonly<{
  action: 'edit' | 'submit' | 'request-changes' | 'review-domain' | 'approve' | 'withdraw'
  expectedRevision: number; domain?: CareDomain; reference?: string; reason?: string
}>

function object(input: unknown): Record<string, unknown> {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('Care contract requires an object')
  return input as Record<string, unknown>
}
function exactKeys(value: Record<string, unknown>, allowed: readonly string[]) {
  if (Object.keys(value).some((key) => !allowed.includes(key))) throw new Error('Care contract has unsupported fields')
}
function label(value: unknown): string {
  if (typeof value !== 'string' || !value.trim() || value.length > 500) throw new Error('Care evidence requires a bounded reference or reason')
  return value.trim()
}
function instant(value: unknown): string {
  if (typeof value !== 'string' || !/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\dZ$/.test(value)
    || !Number.isFinite(Date.parse(value)) || new Date(value).toISOString().replace('.000Z', 'Z') !== value) {
    throw new Error('Care dates require valid UTC instants')
  }
  return value
}
export function careDefinition(input: unknown): CareDefinition {
  const value = object(input)
  exactKeys(value, ['publicId', 'synthetic', 'doctorPublicId', 'servicePublicId', 'locationPublicId', 'source', 'reviewAt', 'expiresAt'])
  if (typeof value.publicId !== 'string' || !/^lnk_[a-z0-9]{12,32}$/.test(value.publicId)) throw new Error('Care link requires an opaque stable ID')
  const ids = [value.doctorPublicId, value.servicePublicId, value.locationPublicId]
  if (ids.some((id) => typeof id !== 'string' || !/^pub_[a-z0-9]{12,32}$/.test(id))
    || new Set(ids).size !== 3) throw new Error('Care endpoints require three distinct stable public IDs')
  if (value.synthetic !== true) throw new Error('Authentic care relationships remain disabled')
  return { publicId: value.publicId, synthetic: true, doctorPublicId: ids[0] as string,
    servicePublicId: ids[1] as string, locationPublicId: ids[2] as string, source: label(value.source),
    reviewAt: instant(value.reviewAt), expiresAt: instant(value.expiresAt) }
}
function stamp(input: unknown): Stamp {
  const value = object(input)
  exactKeys(value, ['actor', 'at', 'reference'])
  if (typeof value.actor !== 'string' || !/^cms:[1-9]\d*$/.test(value.actor)) throw new Error('Care review requires CMS identity')
  return { actor: value.actor, at: instant(value.at), reference: label(value.reference) }
}
export function careRelationship(input: unknown): CareRelationship {
  const value = object(input)
  exactKeys(value, ['definition', 'revision', 'author', 'state', 'endpointSnapshot', 'reviews', 'approval', 'audit'])
  const definition = careDefinition(value.definition)
  if (!Number.isSafeInteger(value.revision) || Number(value.revision) < 1
    || typeof value.author !== 'string' || !/^cms:[1-9]\d*$/.test(value.author)
    || !['draft', 'review', 'approved', 'withdrawn'].includes(value.state as string)
    || typeof value.endpointSnapshot !== 'string') throw new Error('Care workflow metadata is invalid')
  const rawReviews = object(value.reviews)
  exactKeys(rawReviews, careDomains)
  const reviews: Partial<Record<CareDomain, Stamp>> = {}
  for (const domain of careDomains) {
    if (rawReviews[domain] !== undefined) {
      const review = stamp(rawReviews[domain])
      if (review.actor === value.author) throw new Error('Care review must be independent of author')
      reviews[domain] = review
    }
  }
  const approval = value.approval === null ? null : stamp(value.approval)
  if (approval?.actor === value.author) throw new Error('Care approval must be independent of author')
  if (value.state === 'approved' && (!approval || careDomains.some((domain) => !reviews[domain])
    || !value.endpointSnapshot)) throw new Error('Care approval requires all independent domain reviews')
  if (value.state === 'draft' && (approval || Object.keys(reviews).length || value.endpointSnapshot)
    || value.state === 'review' && approval) throw new Error('Care draft/review cannot retain approval')
  if (!Array.isArray(value.audit) || !value.audit.length) throw new Error('Care audit is required')
  const audit = value.audit.map((input) => {
    const entry = object(input)
    exactKeys(entry, ['actor', 'at', 'change'])
    const checked = stamp({ actor: entry.actor, at: entry.at, reference: entry.change })
    return { actor: checked.actor, at: checked.at, change: checked.reference }
  })
  if (audit.some((entry, index) => index > 0 && Date.parse(entry.at) <= Date.parse(audit[index - 1].at))) {
    throw new Error('Care audit must be strictly increasing')
  }
  return { definition, revision: value.revision as number, author: value.author,
    state: value.state as CareRelationship['state'], endpointSnapshot: value.endpointSnapshot,
    reviews, approval, audit }
}
export function checkedCareRecords(inputs: readonly unknown[]): readonly GovernedRecord[] {
  const records = inputs.map((input) => {
    const result = validateGovernedRecord(input)
    if (!result.ok) throw new Error('Care endpoint record is invalid')
    return result.record
  })
  if (validateRecordSet(records).length) throw new Error('Care endpoint set is invalid')
  return records
}
export function currentCareEndpoint(record: GovernedRecord, now: Date, published = false): boolean {
  return Number.isFinite(now.getTime()) && record.synthetic
    && (published ? record.status === 'published' : ['approved', 'scheduled', 'published'].includes(record.status))
    && !!record.approval && !!record.domainApproval && !!record.owner && !!record.reviewer
    && !!record.publishAt && Date.parse(record.publishAt) <= now.getTime()
    && !!record.reviewAt && Date.parse(record.reviewAt) > now.getTime()
    && !!record.expiresAt && Date.parse(record.expiresAt) > now.getTime()
    && (!record.clinician || !clinicianReadiness(record.clinician, now).length)
    && (!record.service || !serviceReadiness(record.service, now).length)
}
export function careEndpointSnapshot(
  definition: CareDefinition, records: readonly GovernedRecord[], now: Date, published = false,
): string {
  if (!Number.isFinite(now.getTime()) || Date.parse(definition.reviewAt) <= now.getTime()
    || Date.parse(definition.expiresAt) <= now.getTime()) throw new Error('Care relationship is due for review or expired')
  const endpoints = [
    [definition.doctorPublicId, 'doctor'], [definition.servicePublicId, 'service'], [definition.locationPublicId, 'location'],
  ].map(([id, kind]) => {
    const record = records.find((entry) => entry.publicId === id)
    if (!record || record.kind !== kind || !currentCareEndpoint(record, now, published)) {
      throw new Error('Care endpoints must resolve to approved/current matching records')
    }
    return record
  })
  if (!endpoints[0].clinician?.locationPublicIds.includes(definition.locationPublicId)
    || !endpoints[1].service?.locationPublicIds.includes(definition.locationPublicId)) {
    throw new Error('Care location must be explicitly listed by doctor and service')
  }
  return canonical(endpoints)
}
export function validateCareSet(links: readonly CareRelationship[]) {
  const ids = new Set<string>()
  const tuples = new Set<string>()
  for (const link of links) {
    if (ids.has(link.definition.publicId)) throw new Error('Duplicate care relationship ID')
    ids.add(link.definition.publicId)
    if (link.state === 'withdrawn') continue
    const key = canonical([link.definition.doctorPublicId, link.definition.servicePublicId, link.definition.locationPublicId])
    if (tuples.has(key)) throw new Error('Duplicate current care relationship tuple')
    tuples.add(key)
  }
}
function requireRole(actor: CmsActor, role: CmsRole) {
  if (!actor.roles.includes(role)) throw new Error(`Care action requires ${role} role`)
}
export function createCareRelationship(input: unknown, inputs: readonly unknown[], actor: CmsActor, now: Date): CareRelationship {
  requireRole(actor, 'author')
  const definition = careDefinition(input)
  careEndpointSnapshot(definition, checkedCareRecords(inputs), now)
  const at = new Date(Math.floor(now.getTime() / 1000) * 1000).toISOString().replace('.000Z', 'Z')
  return careRelationship({ definition, state: 'draft', revision: 1, author: actor.id,
    endpointSnapshot: '', reviews: {}, approval: null, audit: [{ actor: actor.id, at, change: 'draft created' }] })
}
export function applyCareCommand(
  input: unknown, definitionInput: unknown | undefined, command: CareCommand,
  inputs: readonly unknown[], actor: CmsActor, now: Date,
): CareRelationship {
  const old = careRelationship(input)
  if (!command || command.expectedRevision !== old.revision) throw new Error('Stale or missing care revision')
  exactKeys(object(command), ['action', 'expectedRevision', 'domain', 'reference', 'reason'])
  if (!Number.isFinite(now.getTime())) throw new Error('Care command requires valid time')
  if (definitionInput !== undefined && command.action !== 'edit'
    && canonical(careDefinition(definitionInput)) !== canonical(old.definition)) throw new Error('Care content cannot change during review')
  const at = new Date(Math.max(Math.floor(now.getTime() / 1000) * 1000,
    Date.parse(old.audit.at(-1)!.at) + 1000)).toISOString().replace('.000Z', 'Z')
  let next = { ...old, revision: old.revision + 1 }
  const independent = actor.id !== old.author
  switch (command.action) {
    case 'edit': {
      requireRole(actor, 'author')
      if (actor.id !== old.author || old.state !== 'draft') throw new Error('Only owning author may edit a care draft')
      const definition = careDefinition(definitionInput)
      if (definition.publicId !== old.definition.publicId) throw new Error('Care relationship identity is immutable')
      careEndpointSnapshot(definition, checkedCareRecords(inputs), now)
      next = { ...next, definition, reviews: {}, approval: null, endpointSnapshot: '' }
      break
    }
    case 'submit':
      requireRole(actor, 'author')
      if (actor.id !== old.author || old.state !== 'draft') throw new Error('Only owning author may submit a care draft')
      next = { ...next, state: 'review', endpointSnapshot: careEndpointSnapshot(old.definition, checkedCareRecords(inputs), now) }
      break
    case 'request-changes':
      requireRole(actor, 'reviewer')
      if (!independent || !['review', 'approved'].includes(old.state)) throw new Error('Care changes require independent reviewer')
      label(command.reason)
      next = { ...next, state: 'draft', reviews: {}, approval: null, endpointSnapshot: '' }
      break
    case 'review-domain':
    case 'approve': {
      if (!independent || old.state !== 'review') throw new Error('Care review requires independent actor in review state')
      const snapshot = careEndpointSnapshot(old.definition, checkedCareRecords(inputs), now)
      if (snapshot !== old.endpointSnapshot) throw new Error('Care endpoint changed; fresh submission and reviews are required')
      if (command.action === 'review-domain') {
        if (!careDomains.includes(command.domain as CareDomain)) throw new Error('Unsupported care review domain')
        requireRole(actor, command.domain!)
        next = { ...next, reviews: { ...old.reviews,
          [command.domain!]: { actor: actor.id, at, reference: label(command.reference) } } }
      } else {
        requireRole(actor, 'reviewer')
        if (careDomains.some((domain) => !old.reviews[domain])) throw new Error('Care approval requires all domain reviews')
        next = { ...next, state: 'approved', approval: { actor: actor.id, at, reference: label(command.reference) } }
      }
      break
    }
    case 'withdraw':
      requireRole(actor, 'publisher')
      if (old.state === 'withdrawn') throw new Error('Care relationship already withdrawn')
      label(command.reason)
      next = { ...next, state: 'withdrawn' }
      break
    default: throw new Error('Unsupported care workflow action')
  }
  return careRelationship({ ...next, audit: [...old.audit, { actor: actor.id, at,
    change: `${command.action}: ${command.reference?.trim() ?? command.reason?.trim() ?? ''}`.trim() }] })
}
