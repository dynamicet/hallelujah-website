import type { CmsActor, CmsRole } from './cms-identity.ts'
import { type GovernedRecord, validateGovernedRecord } from './governed-record.ts'

export const contentClasses = ['general', 'emergency', 'contact', 'privacy', 'brand'] as const
export type ContentClass = typeof contentClasses[number]
type Review = Readonly<{ actor: string; at: string; reference: string }>
export type CmsWorkflow = Readonly<{
  revision: number
  author: string
  contentClass: ContentClass
  reviews: Partial<Record<CmsRole, Review>>
  verification: Review | null
}>
export type WorkflowDocument = Readonly<{ record: GovernedRecord; workflow: CmsWorkflow }>
export type WorkflowCommand = Readonly<{
  action: 'edit' | 'submit' | 'request-changes' | 'review-domain' | 'approve' | 'schedule'
    | 'publish' | 'expire' | 'withdraw' | 'verify-publication'
  expectedRevision: number
  domain?: CmsRole
  reference?: string
  reason?: string
}>

const domains: Record<GovernedRecord['kind'], CmsRole> = {
  doctor: 'medical', service: 'clinical', location: 'operations',
  vacancy: 'human-resources', page: 'content',
}

export function requiredDomains(record: GovernedRecord, contentClass: ContentClass): CmsRole[] {
  const extra: CmsRole[] = contentClass === 'contact' || contentClass === 'emergency'
    ? ['operations'] : contentClass === 'privacy' ? ['privacy']
      : contentClass === 'brand' ? ['brand'] : []
  return [...new Set([domains[record.kind], ...extra])]
}

export function canonical(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`
  if (value !== null && typeof value === 'object') {
    return `{${Object.entries(value).sort(([a], [b]) => a.localeCompare(b))
      .map(([key, entry]) => `${JSON.stringify(key)}:${canonical(entry)}`).join(',')}}`
  }
  return JSON.stringify(value)
}

function requireRole(actor: CmsActor, role: CmsRole) {
  if (!actor.roles.includes(role)) throw new Error(`CMS action requires ${role} role`)
}

function reference(value: string | undefined): string {
  if (!value?.trim() || value.length > 500) throw new Error('A bounded review reference or reason is required')
  return value.trim()
}

function checked(value: unknown): GovernedRecord {
  const result = validateGovernedRecord(value)
  if (!result.ok) throw new Error(`Workflow record rejected: ${result.issues.join('; ')}`)
  if (!result.record.synthetic) throw new Error('Authentic CMS content remains disabled')
  return result.record
}

export function createWorkflow(
  input: unknown, contentClass: ContentClass, actor: CmsActor, now: Date,
): WorkflowDocument {
  requireRole(actor, 'author')
  if (!contentClasses.includes(contentClass)) throw new Error('An explicit content class is required')
  const record = checked(input)
  if (record.status !== 'draft' || record.approval || record.domainApproval || record.audit.length
    || record.owner || record.reviewer || record.withdrawal) {
    throw new Error('New content must be an unsigned draft without supplied audit or identities')
  }
  return {
    record: checked({ ...record, owner: actor.id,
      audit: [{ actor: actor.id, at: now.toISOString().replace(/\.\d{3}Z$/, 'Z'), change: 'draft created' }] }),
    workflow: { revision: 1, author: actor.id, contentClass, reviews: {}, verification: null },
  }
}

export function applyWorkflow(
  previous: WorkflowDocument, input: unknown | undefined, command: WorkflowCommand,
  actor: CmsActor, now: Date,
): WorkflowDocument {
  if (!command || command.expectedRevision !== previous.workflow.revision) {
    throw new Error('Stale or missing workflow revision')
  }
  const old = checked(previous.record)
  let record = old
  let reviews = { ...previous.workflow.reviews }
  let verification = previous.workflow.verification
  const isAuthor = actor.id === previous.workflow.author
  const safety = ['emergency', 'contact'].includes(previous.workflow.contentClass)
  // Audit instants remain strictly increasing even for rapid local actions.
  const at = new Date(Math.max(Math.floor(now.getTime() / 1000) * 1000,
    Date.parse(old.audit.at(-1)!.at) + 1000)).toISOString().replace('.000Z', 'Z')
  const review = { actor: actor.id, at, reference: command.reference?.trim() ?? '' }
  if (command.action !== 'edit' && input !== undefined && canonical(input) !== canonical(old)) {
    throw new Error('Content cannot change during a workflow action')
  }
  switch (command.action) {
    case 'edit': {
      requireRole(actor, 'author')
      if (!isAuthor || old.status !== 'draft') throw new Error('Only the owning author may edit a draft')
      const candidate = checked(input)
      for (const key of ['publicId', 'kind', 'synthetic', 'status', 'owner', 'reviewer',
        'approval', 'domainApproval', 'audit', 'withdrawal'] as const) {
        if (canonical(candidate[key]) !== canonical(old[key])) throw new Error('Server governance fields cannot be edited')
      }
      record = candidate
      reviews = {}
      verification = null
      break
    }
    case 'submit':
      requireRole(actor, 'author')
      if (!isAuthor || old.status !== 'draft') throw new Error('Only the owning author may submit a draft')
      record = { ...old, status: 'review' }
      break
    case 'request-changes':
      requireRole(actor, 'reviewer')
      if (isAuthor || !['review', 'approved', 'scheduled'].includes(old.status)) {
        throw new Error('Changes require an independent reviewer and reviewable content')
      }
      // Approved/scheduled content returns via review, preserving the shared transition contract.
      record = { ...old, status: old.status === 'review' ? 'draft' : 'review',
        approval: null, domainApproval: null, reviewer: null }
      reviews = {}
      verification = null
      reference(command.reason)
      break
    case 'review-domain': {
      if (old.status !== 'review' || isAuthor || !command.domain
        || !requiredDomains(old, previous.workflow.contentClass).includes(command.domain)) {
        throw new Error('Domain review requires an independent matching reviewer in review state')
      }
      requireRole(actor, command.domain)
      review.reference = reference(command.reference)
      reviews[command.domain] = review
      break
    }
    case 'approve': {
      requireRole(actor, 'reviewer')
      if (isAuthor || old.status !== 'review') throw new Error('Author cannot self-approve; content must be in review')
      const required = requiredDomains(old, previous.workflow.contentClass)
      if (required.some((domain) => !reviews[domain])) throw new Error('All matching domain reviews are required')
      if (safety && reviews.operations?.actor === actor.id) throw new Error('Safety content requires two distinct approval people')
      record = { ...old, status: 'approved', reviewer: actor.id,
        approval: { actor: actor.id, at },
        domainApproval: { ...reviews[domains[old.kind]]!, domain: domains[old.kind] } }
      // Approval itself must satisfy the complete publishable contract.
      checked({ ...record, status: 'scheduled' })
      break
    }
    case 'schedule':
    case 'publish': {
      requireRole(actor, 'publisher')
      if (isAuthor || !old.approval || !['approved', 'scheduled'].includes(old.status)) {
        throw new Error('Publication requires independent publisher and approved content')
      }
      if (!old.publishAt || !old.reviewAt || !old.expiresAt
        || Date.parse(old.reviewAt) <= now.getTime() || Date.parse(old.expiresAt) <= now.getTime()) {
        throw new Error('Publication dates are missing, expired or due for review')
      }
      if (command.action === 'schedule' && Date.parse(old.publishAt) <= now.getTime()) {
        throw new Error('Scheduling requires a future UTC instant')
      }
      if (command.action === 'publish' && Date.parse(old.publishAt) > now.getTime()) {
        throw new Error('Scheduled publication is not effective yet')
      }
      record = { ...old, status: command.action === 'schedule' ? 'scheduled' : 'published' }
      verification = null
      break
    }
    case 'verify-publication':
      requireRole(actor, 'operations')
      if (!safety || old.status !== 'published' || isAuthor) throw new Error('Verification requires published safety content and independent operations')
      verification = { ...review, reference: reference(command.reference) }
      break
    case 'expire':
    case 'withdraw':
      requireRole(actor, 'publisher')
      if (command.action === 'expire' && (old.status !== 'published'
        || !old.expiresAt || Date.parse(old.expiresAt) > now.getTime())) {
        throw new Error('Expiry requires a published record past its expiry instant')
      }
      if (old.status === 'withdrawn') throw new Error('Withdrawn content is immutable')
      record = { ...old, status: command.action === 'expire' ? 'expired' : 'withdrawn',
        withdrawal: { reason: reference(command.reason), successorPublicId: null } }
      break
    default:
      throw new Error('Unsupported workflow action')
  }
  return {
    record: checked({ ...record, audit: [...old.audit,
      { actor: actor.id, at, change: command.action }] }),
    workflow: { ...previous.workflow, revision: previous.workflow.revision + 1, reviews, verification },
  }
}
