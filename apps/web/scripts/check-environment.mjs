import assert from 'node:assert/strict'
import { randomBytes } from 'node:crypto'
import { register } from '../src/instrumentation.ts'
import { loadServerEnvironment } from '../src/server/environment.ts'

const secretValue = () => randomBytes(32).toString('base64url')
const databaseUrl = (deployment) =>
  `postgresql://content_${deployment}:${randomBytes(18).toString('hex')}@127.0.0.1:5432/hallelujah_content_${deployment}`
const appointmentDatabaseUrl = (deployment, host = '127.0.0.1') => {
  const role = `hallelujah_appointment_runtime_${deployment}`
  const transport = deployment === 'local'
    ? `host=${encodeURIComponent('/tmp/hallelujah-b03-015-pg.fixture')}`
    : 'sslmode=verify-full'
  return `postgresql://${role}:${randomBytes(18).toString('hex')}@${host}:5432/hallelujah_appointment_${deployment}?${transport}`
}

const variablePrefix = {
  local: 'LOCAL',
  production: 'PRODUCTION',
  staging: 'STAGING',
}

function validEnvironment(deployment) {
  const prefix = variablePrefix[deployment]
  return {
    APP_ENVIRONMENT: deployment,
    EXTERNAL_SERVICES: 'disabled',
    PERSONAL_DATA_COLLECTION: 'disabled',
    [`${prefix}_DATABASE_URL`]: databaseUrl(deployment),
    [`${prefix}_PAYLOAD_SECRET`]: secretValue(),
  }
}

function expectInvalid(source, expectedIssues, sensitiveValues = []) {
  assert.throws(
    () => loadServerEnvironment(source),
    (error) => {
      assert.equal(error.name, 'EnvironmentConfigurationError')
      for (const issue of expectedIssues) assert.match(error.message, issue)
      for (const value of sensitiveValues) assert.doesNotMatch(error.message, new RegExp(value, 'u'))
      return true
    },
  )
}

for (const deployment of ['local', 'staging', 'production']) {
  const source = validEnvironment(deployment)
  const result = loadServerEnvironment(source)
  assert.equal(result.deployment, deployment)
  assert.equal(result.personalDataCollection, 'disabled')
  assert.equal(result.externalServices, 'disabled')
  assert.ok(Object.isFrozen(result))
}

{
  const source = {
    ...validEnvironment('local'),
    LOCAL_APPOINTMENT_DATABASE_URL: appointmentDatabaseUrl('local'),
    LOCAL_APPOINTMENT_ABUSE_SECRET: secretValue(),
    LOCAL_APPOINTMENT_IDEMPOTENCY_SECRET: secretValue(),
    APPOINTMENT_NOTICE_VERSION: 'synthetic-notice-v1',
  }
  const result = loadServerEnvironment(source)
  assert.equal(result.appointment.databaseUrl, source.LOCAL_APPOINTMENT_DATABASE_URL)
  assert.equal(
    result.appointment.idempotencySecret,
    source.LOCAL_APPOINTMENT_IDEMPOTENCY_SECRET,
  )
  assert.equal(result.appointment.noticeVersion, 'synthetic-notice-v1')
  assert.ok(Object.isFrozen(result.appointment))
}

expectInvalid({}, [/APP_ENVIRONMENT is required/u, /PERSONAL_DATA_COLLECTION/u, /EXTERNAL_SERVICES/u])

{
  const source = { HH_DEMO_MODE: 'true', APP_ENVIRONMENT: 'staging' }
  const result = loadServerEnvironment(source)
  assert.equal(result.deployment, 'staging')
  assert.equal(result.personalDataCollection, 'disabled')
  assert.equal(result.externalServices, 'disabled')
  assert.equal(result.appointment, undefined)
  assert.ok(Buffer.byteLength(result.payloadSecret) >= 32)
  expectInvalid({ ...source, APP_ENVIRONMENT: 'production' }, [/HH_DEMO_MODE requires/u])
  expectInvalid({ ...source, PERSONAL_DATA_COLLECTION: 'enabled' }, [/Hosted demo requires/u])
  expectInvalid({ ...source, EXTERNAL_SERVICES: 'enabled' }, [/Hosted demo requires/u])
}

expectInvalid(
  { ...validEnvironment('local'), APP_ENVIRONMENT: 'review' },
  [/APP_ENVIRONMENT must be local, staging, or production/u],
)

const crossScopeAppointmentUrl = appointmentDatabaseUrl('production')
const crossScopeAbuseSecret = secretValue()
const crossScopeIdempotencySecret = secretValue()
expectInvalid(
  {
    ...validEnvironment('local'),
    PRODUCTION_APPOINTMENT_DATABASE_URL: crossScopeAppointmentUrl,
    PRODUCTION_APPOINTMENT_ABUSE_SECRET: crossScopeAbuseSecret,
    PRODUCTION_APPOINTMENT_IDEMPOTENCY_SECRET: crossScopeIdempotencySecret,
  },
  [
    /PRODUCTION_APPOINTMENT_DATABASE_URL must not be present/u,
    /PRODUCTION_APPOINTMENT_ABUSE_SECRET must not be present/u,
    /PRODUCTION_APPOINTMENT_IDEMPOTENCY_SECRET must not be present/u,
  ],
  [crossScopeAppointmentUrl, crossScopeAbuseSecret, crossScopeIdempotencySecret],
)

expectInvalid(
  {
    ...validEnvironment('local'),
    LOCAL_APPOINTMENT_DATABASE_URL: appointmentDatabaseUrl('local').replace(/\?.*$/u, ''),
    LOCAL_APPOINTMENT_ABUSE_SECRET: secretValue(),
    LOCAL_APPOINTMENT_IDEMPOTENCY_SECRET: secretValue(),
    APPOINTMENT_NOTICE_VERSION: 'synthetic-notice-v1',
  },
  [/LOCAL_APPOINTMENT_DATABASE_URL must use a disposable/u],
)

expectInvalid(
  { ...validEnvironment('local'), LOCAL_APPOINTMENT_DATABASE_URL: appointmentDatabaseUrl('local') },
  [
    /LOCAL_APPOINTMENT_ABUSE_SECRET is required/u,
    /LOCAL_APPOINTMENT_IDEMPOTENCY_SECRET is required/u,
    /APPOINTMENT_NOTICE_VERSION is required/u,
  ],
)

{
  const reusedSecret = secretValue()
  expectInvalid(
    {
      ...validEnvironment('local'),
      LOCAL_APPOINTMENT_DATABASE_URL: appointmentDatabaseUrl('local'),
      LOCAL_APPOINTMENT_ABUSE_SECRET: reusedSecret,
      LOCAL_APPOINTMENT_IDEMPOTENCY_SECRET: reusedSecret,
      APPOINTMENT_NOTICE_VERSION: 'synthetic-notice-v1',
    },
    [/Appointment abuse and idempotency secrets must be independently generated/u],
    [reusedSecret],
  )
}

const remoteLocalAppointmentUrl = appointmentDatabaseUrl('local', 'database.internal')
expectInvalid(
  {
    ...validEnvironment('local'),
    LOCAL_APPOINTMENT_DATABASE_URL: remoteLocalAppointmentUrl,
    LOCAL_APPOINTMENT_ABUSE_SECRET: secretValue(),
    LOCAL_APPOINTMENT_IDEMPOTENCY_SECRET: secretValue(),
    APPOINTMENT_NOTICE_VERSION: 'synthetic-notice-v1',
  },
  [/LOCAL_APPOINTMENT_DATABASE_URL must use a disposable/u],
  [remoteLocalAppointmentUrl],
)

const productionUrl = databaseUrl('production')
const productionSecret = secretValue()
expectInvalid(
  {
    ...validEnvironment('local'),
    PRODUCTION_DATABASE_URL: productionUrl,
    PRODUCTION_PAYLOAD_SECRET: productionSecret,
  },
  [/PRODUCTION_DATABASE_URL must not be present/u, /PRODUCTION_PAYLOAD_SECRET must not be present/u],
  [productionUrl, productionSecret],
)

const wrongDatabaseUrl = databaseUrl('production')
expectInvalid(
  { ...validEnvironment('staging'), STAGING_DATABASE_URL: wrongDatabaseUrl },
  [/STAGING_DATABASE_URL must select the hallelujah_content_staging database/u],
  [wrongDatabaseUrl],
)

const wrongProtocolUrl = 'https://content_local:hidden@127.0.0.1/hallelujah_content_local'
expectInvalid(
  { ...validEnvironment('local'), LOCAL_DATABASE_URL: wrongProtocolUrl },
  [/LOCAL_DATABASE_URL must use the postgresql protocol/u],
  [wrongProtocolUrl],
)

const credentiallessUrl = 'postgresql://127.0.0.1:5432/hallelujah_content_local'
expectInvalid(
  { ...validEnvironment('local'), LOCAL_DATABASE_URL: credentiallessUrl },
  [/LOCAL_DATABASE_URL must contain environment-specific credentials/u],
  [credentiallessUrl],
)

expectInvalid(
  { ...validEnvironment('local'), PERSONAL_DATA_COLLECTION: 'enabled' },
  [/PERSONAL_DATA_COLLECTION must be disabled/u],
)

expectInvalid(
  { ...validEnvironment('local'), EXTERNAL_SERVICES: 'enabled' },
  [/EXTERNAL_SERVICES must be disabled/u],
)

const shortSecret = 'too-short'
expectInvalid(
  { ...validEnvironment('local'), LOCAL_PAYLOAD_SECRET: shortSecret },
  [/LOCAL_PAYLOAD_SECRET must contain at least 32 bytes/u],
  [shortSecret],
)

const runtimeNames = [
  'APP_ENVIRONMENT',
  'PERSONAL_DATA_COLLECTION',
  'EXTERNAL_SERVICES',
  'LOCAL_DATABASE_URL',
  'LOCAL_PAYLOAD_SECRET',
  'LOCAL_APPOINTMENT_DATABASE_URL',
  'LOCAL_APPOINTMENT_ABUSE_SECRET',
  'LOCAL_APPOINTMENT_IDEMPOTENCY_SECRET',
  'STAGING_DATABASE_URL',
  'STAGING_PAYLOAD_SECRET',
  'STAGING_APPOINTMENT_DATABASE_URL',
  'STAGING_APPOINTMENT_ABUSE_SECRET',
  'STAGING_APPOINTMENT_IDEMPOTENCY_SECRET',
  'PRODUCTION_DATABASE_URL',
  'PRODUCTION_PAYLOAD_SECRET',
  'PRODUCTION_APPOINTMENT_DATABASE_URL',
  'PRODUCTION_APPOINTMENT_ABUSE_SECRET',
  'PRODUCTION_APPOINTMENT_IDEMPOTENCY_SECRET',
  'APPOINTMENT_NOTICE_VERSION',
  'NEXT_RUNTIME',
]
const originalRuntime = Object.fromEntries(runtimeNames.map((name) => [name, process.env[name]]))

try {
  for (const name of runtimeNames) delete process.env[name]
  process.env.NEXT_RUNTIME = 'nodejs'
  await assert.rejects(register, /APP_ENVIRONMENT is required/u)

  Object.assign(process.env, validEnvironment('local'))
  await register()
} finally {
  for (const name of runtimeNames) {
    const originalValue = originalRuntime[name]
    if (originalValue === undefined) delete process.env[name]
    else process.env[name] = originalValue
  }
}

console.log('Environment contract check passed (valid, missing, cross-scope, gated, redaction, and startup cases).')
