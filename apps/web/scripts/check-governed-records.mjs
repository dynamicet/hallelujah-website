import assert from 'node:assert/strict'
import {
  canTransition,
  publicEligibility,
  validateGovernedRecord,
  validateRecordSet,
} from '../src/content/governed-record.ts'
import {
  governedRecordsCollection,
  validateStoredRecordChange,
} from '../src/content/governed-collection.ts'

const syntheticRecord = {
  publicId: 'pub_0123456789ab',
  kind: 'service',
  status: 'published',
  synthetic: true,
  localized: {
    en: { slug: 'controlled-service', title: 'Controlled service fixture' },
    am: { slug: 'controlled-amharic', title: 'የቁጥጥር ምሳሌ' },
  },
  source: { reference: 'synthetic-fixture', recordedAt: '2026-09-15T09:00:00Z' },
  owner: 'Temporary content role',
  reviewer: 'Temporary review role',
  approval: { actor: 'Temporary acceptance role', at: '2026-09-15T10:00:00Z' },
  domainApproval: {
    domain: 'clinical', actor: 'Temporary clinical role',
    at: '2026-09-15T10:00:00Z', reference: 'synthetic-domain-review',
  },
  relationships: [],
  publishAt: '2026-09-15T11:00:00Z',
  reviewAt: '2026-10-15T11:00:00Z',
  expiresAt: '2026-11-15T11:00:00Z',
  withdrawal: null,
  audit: [{ actor: 'Temporary content role', at: '2026-09-15T09:00:00Z', change: 'fixture created' }],
}

function accepted(value) {
  const result = validateGovernedRecord(value)
  assert.equal(result.ok, true, result.ok ? '' : result.issues.join(', '))
  return result.record
}

function rejected(value, expectedIssue) {
  const result = validateGovernedRecord(value)
  assert.equal(result.ok, false)
  assert.ok(result.issues.some((issue) => issue.includes(expectedIssue)), result.issues.join(', '))
}

const record = accepted(syntheticRecord)
assert.deepEqual(publicEligibility(record, new Date('2026-09-16T00:00:00Z')),
  { eligible: false, reason: 'synthetic' })
assert.deepEqual(publicEligibility({ ...syntheticRecord, approval: null },
  new Date('2026-09-16T00:00:00Z')), { eligible: false, reason: 'invalid' })

rejected({ ...syntheticRecord, publicId: 'internal-12' }, 'publicId')
rejected({ ...syntheticRecord, source: null }, 'source')
rejected({ ...syntheticRecord, owner: null }, 'publishable status')
rejected({ ...syntheticRecord, approval: null }, 'publishable status')
rejected({ ...syntheticRecord, domainApproval: null }, 'domainApproval')
rejected({ ...syntheticRecord, domainApproval: {
  ...syntheticRecord.domainApproval, domain: 'operations',
} }, 'domainApproval')
rejected({ ...syntheticRecord, localized: { am: syntheticRecord.localized.am } }, 'English')
rejected({ ...syntheticRecord, reviewAt: '2026-09-15T10:00:00Z' }, 'reviewAt')
rejected({ ...syntheticRecord, expiresAt: '2026-09-15T10:00:00Z' }, 'expiresAt')
rejected({ ...syntheticRecord, publishAt: '2026-02-30T11:00:00Z' }, 'publishAt')
rejected({ ...syntheticRecord, relationships: [syntheticRecord.publicId] }, 'relationships')
rejected({ ...syntheticRecord, status: 'withdrawn' }, 'withdrawal')
rejected({ ...syntheticRecord, withdrawal: { reason: 'retired', successorPublicId: null } }, 'withdrawal')

assert.equal(canTransition('draft', 'review'), true)
assert.equal(canTransition('draft', 'published'), false)
assert.equal(canTransition('withdrawn', 'published'), false)

const productionShape = accepted({ ...syntheticRecord, synthetic: false })
assert.deepEqual(publicEligibility(productionShape, new Date('2026-09-16T00:00:00Z')),
  { eligible: true, reason: 'eligible' })
assert.equal(publicEligibility(productionShape, new Date('2026-10-16T00:00:00Z')).reason, 'review-due')
assert.equal(publicEligibility({ ...productionShape, reviewAt: '2026-12-01T00:00:00Z' },
  new Date('2026-11-16T00:00:00Z')).reason, 'expired')

assert.deepEqual(validateRecordSet([record, record]), ['duplicate publicId',
  'duplicate canonical slug', 'duplicate canonical slug'])
const missingRelationship = accepted({
  ...syntheticRecord,
  relationships: ['pub_aaaaaaaaaaaa'],
})
assert.deepEqual(validateRecordSet([missingRelationship]), ['relationship has no matching public record'])
const retiredWithMissingSuccessor = accepted({
  ...syntheticRecord,
  status: 'withdrawn',
  withdrawal: { reason: 'synthetic retirement', successorPublicId: 'pub_aaaaaaaaaaaa' },
})
assert.deepEqual(validateRecordSet([retiredWithMissingSuccessor]), [
  'redirect successor must be a current record of the same kind',
])
const linkedRetired = accepted({
  ...syntheticRecord,
  publicId: 'pub_bbbbbbbbbbbb',
  localized: { en: { slug: 'linked-retired', title: 'Linked retired fixture' } },
  relationships: [retiredWithMissingSuccessor.publicId],
})
assert.ok(validateRecordSet([linkedRetired, retiredWithMissingSuccessor]).includes(
  'relationship points to a retired public record'))

assert.equal(governedRecordsCollection.endpoints, false)
assert.equal(await governedRecordsCollection.access.read({ req: {} }), false)
assert.equal(await governedRecordsCollection.access.create({ req: {} }), false)
assert.equal(await governedRecordsCollection.access.update({ req: {} }), false)
assert.equal(governedRecordsCollection.access.delete(), false)
accepted(validateStoredRecordChange(syntheticRecord, undefined, []))
assert.throws(() => validateStoredRecordChange(productionShape, undefined, []), /Authentic/)
assert.throws(() => validateStoredRecordChange(syntheticRecord, undefined, [record]), /duplicate/)
assert.throws(() => validateStoredRecordChange(missingRelationship, undefined, []), /relationship/)

const updated = {
  ...syntheticRecord,
  status: 'expired',
  withdrawal: { reason: 'synthetic retirement', successorPublicId: null },
  audit: [...syntheticRecord.audit, {
    actor: 'Temporary content role', at: '2026-09-16T09:00:00Z', change: 'fixture retired',
  }],
}
assert.equal(validateStoredRecordChange(updated, syntheticRecord, []).status, 'expired')
assert.throws(() => validateStoredRecordChange({ ...updated, publicId: 'pub_aaaaaaaaaaaa' },
  syntheticRecord, []), /Stable public ID/)
assert.throws(() => validateStoredRecordChange({ ...updated, audit: syntheticRecord.audit },
  syntheticRecord, []), /append one later audit/)
assert.throws(() => validateStoredRecordChange({ ...updated, status: 'draft', withdrawal: null },
  syntheticRecord, []), /status transition/)

const beforeChange = governedRecordsCollection.hooks.beforeChange[0]
await assert.rejects(() => beforeChange({
  data: { record: syntheticRecord }, req: { payload: {} },
}), /active persisted CMS identity/)
assert.throws(() => governedRecordsCollection.hooks.beforeDelete[0](), /withdrawn/)

process.stdout.write('Governed-record controlled contract checks passed.\n')
