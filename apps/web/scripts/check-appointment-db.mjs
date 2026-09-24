import assert from 'node:assert/strict'
import { randomBytes } from 'node:crypto'
import { spawnSync } from 'node:child_process'

import { createAppointmentPostHandler } from '../src/appointment/handler.ts'
import { PostgresAppointmentRepository } from '../src/appointment/postgres.ts'

const host = process.env.B03_015_PGHOST
const port = process.env.B03_015_PGPORT
const runtimeRole = 'hallelujah_appointment_runtime_local'
const migrationRole = 'hallelujah_appointment_migration_local'
const database = 'hallelujah_appointment_local'
if (!/^\/(?:var\/)?tmp\/hallelujah-b03-015-pg\.[a-zA-Z0-9]+$/u.test(host ?? '')
  || !/^\d{2,5}$/u.test(port ?? '') || process.env.PGPASSWORD || process.env.LOCAL_DATABASE_URL) {
  throw new Error('Use a disposable B03-015 Unix socket without supplied database credentials')
}

function query(role, selectedDatabase, sql) {
  return spawnSync('psql', [
    '-X', '-w', '-v', 'ON_ERROR_STOP=1', '-h', host, '-p', port,
    '-U', role, '-d', selectedDatabase, '-tAc', sql,
  ], { encoding: 'utf8', timeout: 10_000 })
}

const connectionString = `postgresql://${runtimeRole}:synthetic-placeholder@localhost:${port}/${database}?host=${encodeURIComponent(host)}`
const repository = new PostgresAppointmentRepository({ connectionString, mode: 'synthetic' })
const events = []
const token = randomBytes(32).toString('base64url')
const handler = createAppointmentPostHandler({
  collectionEnabled: true,
  repository,
  audit: { record: (event) => events.push(event) },
  noticeVersion: 'synthetic-notice-v1',
  abuseSecret: 'synthetic-local-abuse-key-not-for-any-remote-environment',
  now: () => new Date(),
})

function request(body, suppliedToken = token) {
  return new Request('http://appointment.test/api/appointment-requests', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'content-type': 'application/json',
      cookie: `__Host-appointment-csrf=${suppliedToken}`,
      origin: 'http://appointment.test',
      'sec-fetch-site': 'same-origin',
      'x-csrf-token': suppliedToken,
    },
  })
}

const syntheticBase = {
  full_name: 'Synthetic Database Requester',
  phone: '+00000000000',
  privacy_acknowledged: true,
}

try {
  const directRead = query(runtimeRole, database, 'SELECT full_name FROM appointment.requests')
  assert.notEqual(directRead.status, 0)
  assert.match(directRead.stderr, /permission denied/u)
  const directWrite = query(runtimeRole, database,
    "INSERT INTO appointment.requests (care_route, full_name, phone, privacy_notice_version, privacy_acknowledged_at, synthetic) VALUES ('not_sure', 'Synthetic bypass', '+00000000000', 'synthetic-notice-v1', now(), true)")
  assert.notEqual(directWrite.status, 0)
  assert.match(directWrite.stderr, /permission denied/u)

  for (const body of [
    { ...syntheticBase, care_route: 'doctor', doctor_id: 'doc_synthetic_fixture_0001' },
    { ...syntheticBase, care_route: 'service', service_id: 'svc_synthetic_fixture_0001' },
    { ...syntheticBase, care_route: 'not_sure' },
  ]) {
    const response = await handler(request(body, randomBytes(32).toString('base64url')))
    assert.equal(response.status, 201)
    const result = await response.json()
    assert.match(result.reference, /^[a-f0-9-]{36}$/u)
  }

  const invalidSelector = await handler(request({
    ...syntheticBase,
    care_route: 'doctor',
    doctor_id: 'doc_synthetic_missing_0001',
  }, randomBytes(32).toString('base64url')))
  assert.equal(invalidSelector.status, 422)

  const rateToken = randomBytes(32).toString('base64url')
  for (let attempt = 1; attempt <= 6; attempt += 1) {
    const response = await handler(request({ ...syntheticBase, care_route: 'not_sure' }, rateToken))
    assert.equal(response.status, attempt <= 5 ? 201 : 429)
  }

  const counts = query(migrationRole, database,
    "SELECT (SELECT count(*) FROM appointment.requests) || ':' || (SELECT count(*) FROM appointment.audit_events)")
  assert.equal(counts.status, 0)
  assert.equal(counts.stdout.trim(), '8:10')

  const auditText = query(migrationRole, database,
    "SELECT string_agg(row_to_json(event)::text, '') FROM appointment.audit_events event")
  assert.equal(auditText.status, 0)
  for (const forbidden of ['Synthetic Database Requester', '+00000000000', 'synthetic-notice-v1']) {
    assert.doesNotMatch(auditText.stdout, new RegExp(forbidden.replace(/[+]/gu, '\\+'), 'u'))
  }
  assert.ok(events.every((event) => Object.keys(event).sort().join(',') === 'correlationId,event,outcome'))
  process.stdout.write('Appointment database persistence, denial, selector, rate and audit checks passed.\n')
} finally {
  await repository.close()
}
