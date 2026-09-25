import assert from 'node:assert/strict'
import { randomBytes } from 'node:crypto'
import { readFile } from 'node:fs/promises'

import { createAppointmentPostHandler } from '../src/appointment/handler.ts'
import { parseAppointmentSubmission } from '../src/appointment/schema.ts'

const now = new Date('2026-09-23T09:00:00Z')
const csrfToken = randomBytes(32).toString('base64url')
const intentKey = randomBytes(32).toString('base64url')
const reference = '11111111-2222-4333-8444-555555555555'
const validBody = {
  care_route: 'doctor',
  doctor_id: 'doc_synthetic_fixture_0001',
  full_name: '  Synthetic   Requester  ',
  phone: '+00000000000',
  preferred_date: '2026-09-24',
  privacy_acknowledged: true,
}

function request(body = validBody, overrides = {}) {
  return new Request('http://appointment.test/api/appointment-requests', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cookie': `__Host-appointment-csrf=${csrfToken}`,
      'idempotency-key': intentKey,
      'origin': 'http://appointment.test',
      'sec-fetch-site': 'same-origin',
      'x-csrf-token': csrfToken,
      ...overrides,
    },
  })
}

function harness(outcome = { status: 'accepted', reference }) {
  const commands = []
  const events = []
  const repository = {
    async create(command) {
      commands.push(command)
      if (outcome instanceof Error) throw outcome
      return outcome
    },
  }
  const handler = createAppointmentPostHandler({
    collectionEnabled: true,
    repository,
    audit: { record: (event) => events.push(event) },
    noticeVersion: 'synthetic-notice-v1',
    abuseSecret: 'synthetic-abuse-secret-that-is-long-enough-for-testing',
    idempotencySecret: 'synthetic-idempotency-secret-long-enough-for-testing',
    now: () => now,
  })
  return { commands, events, handler }
}

const accepted = parseAppointmentSubmission(validBody, { now })
assert.equal(accepted.ok, true)
assert.equal(accepted.value.fullName, 'Synthetic Requester')
assert.equal(accepted.value.phone, '+00000000000')
assert.ok(Object.isFrozen(accepted.value))

for (const [body, field, code] of [
  [{ ...validBody, notes: 'excluded' }, 'body', 'unexpected'],
  [{ ...validBody, privacy_acknowledged: false }, 'privacy_acknowledged', 'required'],
  [{ ...validBody, service_id: 'svc_synthetic_fixture_0001' }, 'service_id', 'unexpected'],
  [{ ...validBody, doctor_id: undefined }, 'doctor_id', 'required'],
  [{ ...validBody, preferred_date: '2026-02-30' }, 'preferred_date', 'invalid'],
  [{ ...validBody, preferred_date: '2027-09-24' }, 'preferred_date', 'out_of_range'],
  [{ ...validBody, phone: '+251-ABC' }, 'phone', 'invalid'],
]) {
  const result = parseAppointmentSubmission(body, { now })
  assert.equal(result.ok, false)
  assert.ok(result.issues.some((issue) => issue.field === field && issue.code === code))
}

assert.equal(parseAppointmentSubmission(null).ok, false)
assert.equal(parseAppointmentSubmission([]).ok, false)

{
  let called = false
  const events = []
  const disabled = createAppointmentPostHandler({
    collectionEnabled: false,
    repository: { async create() { called = true; return { status: 'accepted', reference } } },
    audit: { record: (event) => events.push(event) },
  })
  const response = await disabled(request())
  assert.equal(response.status, 503)
  assert.equal(called, false)
  assert.equal(events[0].outcome, 'collection_disabled')
}

for (const [candidate, expectedStatus, expectedOutcome] of [
  [new Request('http://appointment.test/api/appointment-requests', {
    method: 'POST', body: JSON.stringify(validBody), headers: { 'content-type': 'application/json' },
  }), 403, 'csrf_rejected'],
  [request(validBody, { origin: 'http://cross-site.invalid' }), 403, 'csrf_rejected'],
  [request(validBody, { 'content-type': 'text/plain' }), 415, 'unsupported_media'],
  [request(validBody, { 'idempotency-key': '' }), 400, 'invalid_intent'],
  [request(validBody, { 'idempotency-key': 'not-random' }), 400, 'invalid_intent'],
  [request(validBody, { 'content-length': '4097' }), 413, 'oversized_body'],
  [new Request('http://appointment.test/api/appointment-requests', {
    method: 'POST', body: '{', headers: {
      'content-type': 'application/json', cookie: `__Host-appointment-csrf=${csrfToken}`,
      'idempotency-key': intentKey, origin: 'http://appointment.test', 'x-csrf-token': csrfToken,
    },
  }), 400, 'malformed_body'],
]) {
  const current = harness()
  const response = await current.handler(candidate)
  assert.equal(response.status, expectedStatus)
  assert.equal(current.commands.length, 0)
  assert.equal(current.events.at(-1).outcome, expectedOutcome)
}

{
  const current = harness()
  const response = await current.handler(request({ ...validBody, notes: 'must be rejected' }))
  assert.equal(response.status, 400)
  assert.equal(current.commands.length, 0)
  assert.deepEqual((await response.json()).issues, [{ field: 'body', code: 'unexpected' }])
}

{
  const current = harness()
  const response = await current.handler(request())
  assert.equal(response.status, 201)
  assert.deepEqual(await response.json(), { status: 'accepted', reference })
  assert.equal(current.commands[0].submission.fullName, 'Synthetic Requester')
  assert.equal(current.commands[0].noticeVersion, 'synthetic-notice-v1')
  assert.match(current.commands[0].abuseKey, /^[a-f0-9]{64}$/u)
  assert.match(current.commands[0].correlationId, /^[a-f0-9-]{36}$/u)
  assert.match(current.commands[0].intentKeyHash, /^[a-f0-9]{64}$/u)
  assert.match(current.commands[0].payloadFingerprint, /^[a-f0-9]{64}$/u)
  const recorded = JSON.stringify(current.events)
  for (const forbidden of [
    'Synthetic Requester',
    '+00000000000',
    csrfToken,
    intentKey,
    reference,
    current.commands[0].intentKeyHash,
    current.commands[0].payloadFingerprint,
  ]) {
    assert.doesNotMatch(recorded, new RegExp(forbidden.replace(/[+]/gu, '\\+'), 'u'))
  }
}

for (const [outcome, status, expectedOutcome] of [
  [{ status: 'reconciled', reference }, 200, 'reconciled'],
  [{ status: 'idempotency_conflict' }, 409, 'idempotency_conflict'],
  [{ status: 'invalid_selector' }, 422, 'invalid_selector'],
  [{ status: 'rate_limited' }, 429, 'rate_limited'],
  [new Error('database detail containing submitted values'), 503, 'internal_failure'],
]) {
  const current = harness(outcome)
  const response = await current.handler(request())
  assert.equal(response.status, status)
  assert.equal(current.events.at(-1).outcome, expectedOutcome)
  assert.doesNotMatch(await response.text(), /database|submitted|detail/iu)
}

{
  const commands = []
  let attempt = 0
  const beforeCommit = createAppointmentPostHandler({
    collectionEnabled: true,
    repository: {
      async create(command) {
        commands.push(command)
        attempt += 1
        if (attempt === 1) throw new Error('synthetic timeout before commit')
        return { status: 'accepted', reference }
      },
    },
    audit: { record() {} },
    noticeVersion: 'synthetic-notice-v1',
    abuseSecret: 'synthetic-abuse-secret-that-is-long-enough-for-testing',
    idempotencySecret: 'synthetic-idempotency-secret-long-enough-for-testing',
    now: () => now,
  })
  assert.equal((await beforeCommit(request())).status, 503)
  assert.equal((await beforeCommit(request())).status, 201)
  assert.equal(commands[0].intentKeyHash, commands[1].intentKeyHash)
  assert.equal(commands[0].payloadFingerprint, commands[1].payloadFingerprint)
}

{
  const commands = []
  let stored = false
  const afterCommit = createAppointmentPostHandler({
    collectionEnabled: true,
    repository: {
      async create(command) {
        commands.push(command)
        if (!stored) {
          stored = true
          throw new Error('synthetic response lost after commit')
        }
        return { status: 'reconciled', reference }
      },
    },
    audit: { record() {} },
    noticeVersion: 'synthetic-notice-v1',
    abuseSecret: 'synthetic-abuse-secret-that-is-long-enough-for-testing',
    idempotencySecret: 'synthetic-idempotency-secret-long-enough-for-testing',
    now: () => now,
  })
  assert.equal((await afterCommit(request())).status, 503)
  const retry = await afterCommit(request())
  assert.equal(retry.status, 200)
  assert.deepEqual(await retry.json(), { status: 'reconciled', reference })
  assert.equal(commands[0].intentKeyHash, commands[1].intentKeyHash)
  assert.equal(commands[0].payloadFingerprint, commands[1].payloadFingerprint)
}

const migration = await readFile(
  new URL('../migrations/appointment/0002_b03_016_idempotency.sql', import.meta.url),
  'utf8',
)
for (const required of [
  'SECURITY DEFINER',
  'CREATE TABLE appointment.request_intents',
  'ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED',
  'GRANT EXECUTE ON FUNCTION appointment.submit_request',
  'personal-data activation is not authorized',
]) assert.match(migration, new RegExp(required.replace(/[()]/gu, '\\$&'), 'u'))

console.log('Appointment contract check passed (schema, gate, CSRF, idempotency, safe retry, and migration policy).')
