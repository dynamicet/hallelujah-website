import type { CollectionConfig } from 'payload'
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
  const issues = validateRecordSet([...checkedPeers, record])
  if (issues.length > 0) throw new Error(`Governed record set rejected: ${issues.join('; ')}`)
  return record
}

const deny = () => false

export const governedRecordsCollection: CollectionConfig = {
  slug: 'governed-records',
  admin: { useAsTitle: 'publicId' },
  access: { admin: deny, create: deny, delete: deny, read: deny, update: deny },
  endpoints: false,
  graphQL: false,
  disableBulkDelete: true,
  disableBulkEdit: true,
  disableDuplicate: true,
  fields: [
    { name: 'publicId', type: 'text', required: true, unique: true, index: true },
    { name: 'record', type: 'json', required: true },
  ],
  hooks: {
    beforeChange: [async ({ data, originalDoc, req }) => {
      const candidate = data.record ?? originalDoc?.record
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
      const peers = result.docs.filter((doc) => doc.id !== originalDoc?.id).map((doc) => doc.record)
      const record = validateStoredRecordChange(candidate, originalDoc?.record, peers)
      return { ...data, publicId: record.publicId, record }
    }],
    beforeDelete: [() => { throw new Error('Governed records must be withdrawn, not deleted') }],
  },
}
