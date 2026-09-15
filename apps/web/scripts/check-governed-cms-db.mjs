import assert from 'node:assert/strict'
import { randomBytes } from 'node:crypto'
import { getPayload } from 'payload'
import { publicEligibility } from '../src/content/governed-record.ts'

const host = process.env.B02_001_PGHOST
const port = process.env.B02_001_PGPORT
if (!host?.startsWith('/tmp/hallelujah-b02-001-pg.') || !/^\d{2,5}$/.test(port ?? '')
  || process.env.LOCAL_DATABASE_URL || process.env.PGPASSWORD) {
  throw new Error('Use a disposable B02-001 Unix socket without supplied database credentials')
}

process.env.APP_ENVIRONMENT = 'local'
process.env.PERSONAL_DATA_COLLECTION = 'disabled'
process.env.EXTERNAL_SERVICES = 'disabled'
process.env.LOCAL_PAYLOAD_SECRET = 'controlled-local-cms-fixture-secret-only'
process.env.LOCAL_DATABASE_URL = `postgresql://hallelujah_content_local:synthetic-placeholder@localhost:${port}/hallelujah_content_local?host=${encodeURIComponent(host)}`

const { default: config } = await import('../src/payload.config.ts')
const payload = await getPayload({ config })
process.stdout.write('Disposable Payload initialized.\n')

const fixtureSuffix = randomBytes(6).toString('hex')

const fixture = {
  publicId: `pub_${fixtureSuffix}`,
  kind: 'service',
  status: 'published',
  synthetic: true,
  localized: { en: { slug: `controlled-cms-${fixtureSuffix}`, title: 'Synthetic CMS fixture' } },
  source: { reference: 'synthetic-cms-smoke', recordedAt: '2026-09-15T09:00:00Z' },
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

try {
  const created = await payload.create({
    collection: 'governed-records',
    data: { publicId: fixture.publicId, record: fixture },
    overrideAccess: true,
  })
  process.stdout.write('Synthetic governed record created.\n')
  assert.equal(created.publicId, fixture.publicId)
  assert.equal(publicEligibility(created.record, new Date('2026-09-16T00:00:00Z')).eligible,
    false)

  const retired = {
    ...fixture,
    status: 'expired',
    withdrawal: { reason: 'synthetic retirement', successorPublicId: null },
    audit: [...fixture.audit, {
      actor: 'Temporary content role', at: '2026-09-16T09:00:00Z', change: 'fixture retired',
    }],
  }
  const updated = await payload.update({
    collection: 'governed-records', id: created.id,
    data: { record: retired }, overrideAccess: true,
  })
  process.stdout.write('Synthetic governed record retired.\n')
  assert.equal(updated.record.status, 'expired')
  process.stdout.write('Disposable Payload/PostgreSQL governed-record integration passed.\n')
} catch (error) {
  process.stderr.write(`Disposable CMS smoke failed: ${error.message}\n`)
  process.exitCode = 1
}

// The installed Payload PostgreSQL adapter retains one reconnect client. This
// one-shot smoke command ends the process after the assertions finish.
await new Promise((resolve) => process.stdout.write('Disposable CMS smoke finished.\n', resolve))
process.exit(process.exitCode ?? 0)
