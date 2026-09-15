import assert from 'node:assert/strict'
import {
  canTransition,
  publicEligibility,
  validateGovernedRecord,
  validateRecordSet,
} from '../src/content/governed-record.ts'

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

process.stdout.write('Governed-record controlled contract checks passed.\n')
