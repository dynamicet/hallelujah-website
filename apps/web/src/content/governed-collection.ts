import { statementDependencies } from './utility-statement-view.ts'
import type { CollectionConfig } from 'payload'
import { cmsActor, lockCmsWrites, roleAccess, type CmsRole } from './cms-identity.ts'
import {
  applyWorkflow, canonical, createWorkflow, requiredDomains,
  type CmsWorkflow, type ContentClass, type WorkflowCommand,
} from './cms-workflow.ts'
import {
  canTransition,
  type GovernedRecord,
  validateGovernedRecord,
  validateRecordSet,
} from './governed-record.ts'

function requireRecord(value: unknown): GovernedRecord {
  const result = validateGovernedRecord(value)
  if (!result.ok) throw new Error(`Governed record rejected: ${result.issues.join('; ')}`)
  return result.record
}

export function validateStoredRecordChange(
  input: unknown,
  previous: unknown,
  peers: readonly unknown[],
): GovernedRecord {
  const record = requireRecord(input)
  if (!record.synthetic) throw new Error('Authentic governed records require production governance approval')

  if (previous !== undefined) {
    const old = requireRecord(previous)
    if (record.publicId !== old.publicId || record.kind !== old.kind) {
      throw new Error('Stable public ID and record kind cannot change')
    }
    if (record.utilityStatement?.identityKey !== old.utilityStatement?.identityKey
      || record.utilityStatement?.type !== old.utilityStatement?.type
      || record.utilityStatement?.version !== old.utilityStatement?.version
      || record.utilityStatement?.supersedesPublicId !== old.utilityStatement?.supersedesPublicId) throw new Error('Statement series, type, version and predecessor cannot change')
    if (old.utilityStatement && ['published', 'expired', 'withdrawn'].includes(old.status)
      && canonical(old.utilityStatement) !== canonical(record.utilityStatement)) throw new Error('Published and historical statement content is immutable; create a successor version')
    if (old.utilityStatement && old.status === 'expired' && record.status === 'draft') throw new Error('Historical statement versions cannot be reopened')
    if (record.institutionalBlock?.identityKey !== old.institutionalBlock?.identityKey
      || record.institutionalBlock?.type !== old.institutionalBlock?.type) {
      throw new Error('Stable institutional identity and type cannot change')
    }
    if (record.visitorTopic?.identityKey !== old.visitorTopic?.identityKey
      || record.visitorTopic?.purpose !== old.visitorTopic?.purpose) {
      throw new Error('Stable visitor topic identity and purpose cannot change')
    }
    if (record.clinician?.identityKey !== old.clinician?.identityKey) {
      throw new Error('Stable clinician roster identity cannot change')
    }
    if (record.service?.identityKey !== old.service?.identityKey) {
      throw new Error('Stable service identity cannot change')
    }
    if (record.status !== old.status && !canTransition(old.status, record.status)) {
      throw new Error('Governed status transition is not allowed')
    }
    if (record.audit.length !== old.audit.length + 1
      || old.audit.some((entry, index) => entry.actor !== record.audit[index]?.actor
        || entry.at !== record.audit[index]?.at
        || entry.change !== record.audit[index]?.change)
      || Date.parse(record.audit.at(-1)!.at) <= Date.parse(old.audit.at(-1)?.at ?? old.source.recordedAt)) {
      throw new Error('Each update must append one later audit entry without rewriting history')
    }
  } else if (record.audit.length === 0) {
    throw new Error('A new governed record requires an initial audit entry')
  }

  const checkedPeers = peers.map(requireRecord)
  const issues = [...validateRecordSet([...checkedPeers, record])]
  const successor = record.withdrawal?.successorPublicId
    && checkedPeers.find((peer) => peer.publicId === record.withdrawal?.successorPublicId)
  if (['doctor', 'service'].includes(record.kind) && successor && !['approved', 'scheduled', 'published'].includes(successor.status)) {
    issues.push(`${record.kind === 'doctor' ? 'clinician' : 'service'} successor must be approved and current`)
  }
  if (issues.length > 0) throw new Error(`Governed record set rejected: ${issues.join('; ')}`)
  return record
}

const deny = () => false

export const governedRecordsCollection: CollectionConfig = {
  slug: 'governed-records',
  admin: { useAsTitle: 'publicId' },
  access: {
    admin: deny, create: roleAccess('author'), delete: deny,
    read: async ({ req }) => {
      const actor = await cmsActor(req)
      if (!actor) return false
      return actor.roles.some((role) => role !== 'author' && role !== 'identity-manager')
        ? true : actor.roles.includes('author') ? { authorId: { equals: actor.id } } : false
    },
    update: roleAccess('author', 'reviewer', 'publisher', 'medical', 'clinical',
      'operations', 'human-resources', 'content', 'privacy', 'legal', 'brand', 'accessibility'),
  },
  endpoints: false,
  graphQL: false,
  disableBulkDelete: true,
  disableBulkEdit: true,
  disableDuplicate: true,
  fields: [
    { name: 'publicId', type: 'text', required: true, unique: true, index: true },
    { name: 'record', type: 'json', required: true },
    { name: 'authorId', type: 'text', required: true, index: true, admin: { readOnly: true } },
    { name: 'contentClass', type: 'select', required: true,
      options: ['general', 'emergency', 'contact', 'privacy', 'brand'] },
    { name: 'workflow', type: 'json', required: true, admin: { readOnly: true } },
    { name: 'command', type: 'json', virtual: true },
  ],
  hooks: {
    beforeChange: [async ({ data, operation, originalDoc, req }) => {
      let actor = await cmsActor(req)
      if (!actor) throw new Error('Governed writes require an active persisted CMS identity')
      // Serialize the complete local record set: uniqueness/relationship checks and revision
      // validation must see committed state, including another writer's latest approval.
      await lockCmsWrites(req)
      actor = await cmsActor(req)
      if (!actor) throw new Error('Governed writes require an active persisted CMS identity')
      const stored = operation === 'update' ? await req.payload.findByID({
        collection: 'governed-records', id: originalDoc.id, overrideAccess: true, req,
      }) : undefined
      if (!stored && data.command) throw new Error('A new draft cannot run a workflow command')
      if (stored && (data.command as WorkflowCommand)?.expectedRevision !== (stored.workflow as CmsWorkflow).revision) {
        throw new Error('Stale or missing workflow revision')
      }
      if (data.workflow !== undefined && canonical(data.workflow) !== canonical(stored?.workflow)
        || data.authorId !== undefined && data.authorId !== stored?.authorId
        || stored && data.contentClass !== undefined && data.contentClass !== stored.contentClass) {
        throw new Error('Workflow metadata and content class cannot be supplied or changed')
      }
      const change = stored ? applyWorkflow({
        record: requireRecord(stored.record), workflow: stored.workflow as CmsWorkflow,
      }, data.record, data.command as WorkflowCommand, actor, new Date())
        : createWorkflow(data.record, data.contentClass as ContentClass, actor, new Date())
      if (stored && ['approve', 'schedule', 'publish'].includes((data.command as WorkflowCommand)?.action)) {
        for (const domain of requiredDomains(change.record, change.workflow.contentClass)) {
          const review = change.workflow.reviews[domain]
          const reviewer = review && await req.payload.findByID({
            collection: 'users', id: Number(review.actor.slice(4)), overrideAccess: true, req,
          }).catch(() => null)
          if (!reviewer?.active || !reviewer.synthetic || !reviewer.roles.includes(domain)) {
            throw new Error('Domain approval identity is inactive or no longer has its matching role')
          }
        }
        if (change.record.approval) {
          const approver = await req.payload.findByID({ collection: 'users',
            id: Number(change.record.approval.actor.slice(4)), overrideAccess: true, req,
          }).catch(() => null)
          if (!approver?.active || !approver.synthetic || !approver.roles.includes('reviewer')) {
            throw new Error('Approval identity is inactive or no longer a reviewer')
          }
        }
      }
      const candidate = change.record
      if (data.publicId !== undefined && data.publicId !== (
        candidate as { publicId?: unknown } | undefined
      )?.publicId) {
        throw new Error('Stored public ID must match the governed record')
      }
      const result = await req.payload.find({
        collection: 'governed-records',
        limit: 1000,
        pagination: false,
        overrideAccess: true,
        req,
      })
      if (result.totalDocs > result.docs.length) {
        throw new Error('Governed record validation requires the complete local record set')
      }
      const peers = result.docs.filter((doc) => doc.id !== stored?.id).map((doc) => doc.record)
      const record = validateStoredRecordChange(candidate, stored?.record, peers)
      if (record.utilityStatement && ['approve', 'schedule', 'publish'].includes((data.command as WorkflowCommand)?.action)) {
        const effective = new Date(Math.max(Date.now(), Date.parse(record.approval?.at ?? ''),
          Date.parse(record.publishAt ?? '')))
        const issues = statementDependencies(record, peers.map(requireRecord), effective)
        if (issues.length) throw new Error(issues.join('; '))
        for (const dependency of peers.map(requireRecord).filter((peer) => record.relationships.includes(peer.publicId))) {
          const dependencyDoc = result.docs.find((doc) => doc.publicId === dependency.publicId)!
          const workflow = dependencyDoc.workflow as CmsWorkflow
          const roles = requiredDomains(dependency, workflow.contentClass)
          const approvals: readonly [string | undefined, CmsRole][] = [[dependency.approval?.actor, 'reviewer'],
            ...roles.map((role): [string | undefined, CmsRole] => [workflow.reviews[role]?.actor, role])]
          for (const [id, role] of approvals) {
            const identity = typeof id === 'string' && /^cms:[1-9]\d*$/.test(id)
              ? await req.payload.findByID({ collection: 'users', id: Number(id.slice(4)), overrideAccess: true, req }).catch(() => null) : null
            if (!identity?.active || !identity.synthetic || !identity.roles.includes(role)) throw new Error('Statement dependency approval identity is inactive or has lost its role')
          }
        }
      }
      return { ...data, publicId: record.publicId, record, authorId: change.workflow.author,
        contentClass: change.workflow.contentClass, workflow: change.workflow, command: null }
    }],
    beforeDelete: [() => { throw new Error('Governed records must be withdrawn, not deleted') }],
  },
}
