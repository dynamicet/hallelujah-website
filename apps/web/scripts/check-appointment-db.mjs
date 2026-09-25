import assert from 'node:assert/strict'
import { randomBytes, randomUUID } from 'node:crypto'
import { spawnSync } from 'node:child_process'

import { createAppointmentPostHandler } from '../src/appointment/handler.ts'
import { PostgresAppointmentRepository } from '../src/appointment/postgres.ts'
import {
  deriveAppointmentAbuseKey,
  deriveAppointmentIntentMaterial,
} from '../src/appointment/security.ts'

const host = process.env.B03_016_PGHOST
const port = process.env.B03_016_PGPORT
const runtimeRole = 'hallelujah_appointment_runtime_local'
const migrationRole = 'hallelujah_appointment_migration_local'
const database = 'hallelujah_appointment_local'
if (!/^\/(?:var\/)?tmp\/hallelujah-b03-016-pg\.[a-zA-Z0-9]+$/u.test(host ?? '')
  || !/^\d{2,5}$/u.test(port ?? '') || process.env.PGPASSWORD || process.env.LOCAL_DATABASE_URL) {
  throw new Error('Use a disposable B03-016 Unix socket without supplied database credentials')
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
const abuseSecret = 'synthetic-local-abuse-key-not-for-any-remote-environment'
const idempotencySecret = 'synthetic-local-idempotency-key-not-for-remote-use'
const handler = createAppointmentPostHandler({
  collectionEnabled: true,
  repository,
  audit: { record: (event) => events.push(event) },
  noticeVersion: 'synthetic-notice-v1',
  abuseSecret,
  idempotencySecret,
  now: () => new Date(),
})

function request(
  body,
  suppliedToken = token,
  suppliedIntent = randomBytes(32).toString('base64url'),
) {
  return new Request('http://appointment.test/api/appointment-requests', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'content-type': 'application/json',
      cookie: `__Host-appointment-csrf=${suppliedToken}`,
      'idempotency-key': suppliedIntent,
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
  const directIntentRead = query(runtimeRole, database,
    'SELECT intent_key_hash FROM appointment.request_intents')
  assert.notEqual(directIntentRead.status, 0)
  assert.match(directIntentRead.stderr, /permission denied/u)

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

  const rolledBackToken = randomBytes(32).toString('base64url')
  const rolledBackIntent = randomBytes(32).toString('base64url')
  const rolledBackSubmission = {
    careRoute: 'not_sure',
    fullName: syntheticBase.full_name,
    phone: syntheticBase.phone,
    privacyAcknowledged: true,
  }
  const rolledBackMaterial = deriveAppointmentIntentMaterial(
    rolledBackIntent,
    rolledBackSubmission,
    'synthetic-notice-v1',
    idempotencySecret,
  )
  const rolledBackAttempt = query(runtimeRole, database, `
    BEGIN;
    SELECT outcome FROM appointment.submit_request(
      'Synthetic Database Requester', '+00000000000', 'not_sure', NULL, NULL, NULL,
      'synthetic-notice-v1', true,
      '${deriveAppointmentAbuseKey(rolledBackToken, abuseSecret)}',
      '${randomUUID()}', true,
      '${rolledBackMaterial.intentKeyHash}', '${rolledBackMaterial.payloadFingerprint}'
    );
    ROLLBACK;
  `)
  assert.equal(rolledBackAttempt.status, 0)
  assert.match(rolledBackAttempt.stdout, /accepted/u)
  const rolledBackRetry = await handler(request(
    { ...syntheticBase, care_route: 'not_sure' },
    rolledBackToken,
    rolledBackIntent,
  ))
  assert.equal(rolledBackRetry.status, 201)

  const retryIntent = randomBytes(32).toString('base64url')
  const retryBody = { ...syntheticBase, care_route: 'not_sure' }
  const firstAttempt = await handler(request(retryBody, randomBytes(32).toString('base64url'), retryIntent))
  assert.equal(firstAttempt.status, 201)
  const firstResult = await firstAttempt.json()
  const reconciledAttempt = await handler(request(
    retryBody,
    randomBytes(32).toString('base64url'),
    retryIntent,
  ))
  assert.equal(reconciledAttempt.status, 200)
  assert.deepEqual(await reconciledAttempt.json(), {
    status: 'reconciled',
    reference: firstResult.reference,
  })
  const conflictAttempt = await handler(request(
    { ...retryBody, full_name: 'Synthetic Conflicting Requester' },
    randomBytes(32).toString('base64url'),
    retryIntent,
  ))
  assert.equal(conflictAttempt.status, 409)
  assert.deepEqual(await conflictAttempt.json(), { status: 'conflict' })

  const concurrentIntent = randomBytes(32).toString('base64url')
  const concurrentResponses = await Promise.all([
    handler(request(retryBody, randomBytes(32).toString('base64url'), concurrentIntent)),
    handler(request(retryBody, randomBytes(32).toString('base64url'), concurrentIntent)),
  ])
  assert.deepEqual(concurrentResponses.map((response) => response.status).sort(), [200, 201])
  const concurrentResults = await Promise.all(concurrentResponses.map((response) => response.json()))
  assert.equal(concurrentResults[0].reference, concurrentResults[1].reference)

  const rateToken = randomBytes(32).toString('base64url')
  for (let attempt = 1; attempt <= 6; attempt += 1) {
    const response = await handler(request({ ...syntheticBase, care_route: 'not_sure' }, rateToken))
    assert.equal(response.status, attempt <= 5 ? 201 : 429)
  }

  const deliveryUpdate = query(migrationRole, database,
    `UPDATE appointment.requests SET delivery_status = 'failed' WHERE public_reference = '${firstResult.reference}'`)
  assert.equal(deliveryUpdate.status, 0)
  const deliveryRetry = await handler(request(
    retryBody,
    randomBytes(32).toString('base64url'),
    retryIntent,
  ))
  assert.equal(deliveryRetry.status, 200)
  assert.equal((await deliveryRetry.json()).reference, firstResult.reference)

  const lifecycleIntent = randomBytes(32).toString('base64url')
  const lifecycleResponse = await handler(request(
    retryBody,
    randomBytes(32).toString('base64url'),
    lifecycleIntent,
  ))
  const lifecycleReference = (await lifecycleResponse.json()).reference
  assert.equal(lifecycleResponse.status, 201)
  const lifecycleBefore = query(migrationRole, database,
    `SELECT count(*) FROM appointment.request_intents AS intents JOIN appointment.requests AS requests ON requests.id = intents.request_id WHERE requests.public_reference = '${lifecycleReference}'`)
  assert.equal(lifecycleBefore.stdout.trim(), '1')
  const lifecycleDelete = query(migrationRole, database,
    `DELETE FROM appointment.requests WHERE public_reference = '${lifecycleReference}'`)
  assert.equal(lifecycleDelete.status, 0)
  const lifecycleAfter = query(migrationRole, database,
    `SELECT count(*) FROM appointment.request_intents AS intents JOIN appointment.requests AS requests ON requests.id = intents.request_id WHERE requests.public_reference = '${lifecycleReference}'`)
  assert.equal(lifecycleAfter.stdout.trim(), '0')

  const counts = query(migrationRole, database,
    "SELECT (SELECT count(*) FROM appointment.requests) || ':' || (SELECT count(*) FROM appointment.request_intents) || ':' || (SELECT count(*) FROM appointment.audit_events)")
  assert.equal(counts.status, 0)
  assert.equal(counts.stdout.trim(), '11:11:18')

  const auditText = query(migrationRole, database,
    "SELECT string_agg(row_to_json(event)::text, '') FROM appointment.audit_events event")
  assert.equal(auditText.status, 0)
  for (const forbidden of [
    'Synthetic Database Requester',
    '+00000000000',
    'synthetic-notice-v1',
    retryIntent,
    firstResult.reference,
    abuseSecret,
    idempotencySecret,
    rolledBackMaterial.intentKeyHash,
    rolledBackMaterial.payloadFingerprint,
  ]) {
    assert.doesNotMatch(auditText.stdout, new RegExp(forbidden.replace(/[+]/gu, '\\+'), 'u'))
  }
  assert.ok(events.every((event) => Object.keys(event).sort().join(',') === 'correlationId,event,outcome'))
  process.stdout.write('Appointment database atomicity, reconciliation, lifecycle, denial, rate and audit checks passed.\n')
} finally {
  await repository.close()
}
