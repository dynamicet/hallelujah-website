import assert from 'node:assert/strict'
import { randomBytes } from 'node:crypto'
import { register } from '../src/instrumentation.ts'
import { loadServerEnvironment } from '../src/server/environment.ts'

const secretValue = () => randomBytes(32).toString('base64url')
const databaseUrl = (deployment) =>
  `postgresql://content_${deployment}:${randomBytes(18).toString('hex')}@127.0.0.1:5432/hallelujah_content_${deployment}`

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

expectInvalid({}, [/APP_ENVIRONMENT is required/u, /PERSONAL_DATA_COLLECTION/u, /EXTERNAL_SERVICES/u])

expectInvalid(
  { ...validEnvironment('local'), APP_ENVIRONMENT: 'review' },
  [/APP_ENVIRONMENT must be local, staging, or production/u],
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
  'STAGING_DATABASE_URL',
  'STAGING_PAYLOAD_SECRET',
  'PRODUCTION_DATABASE_URL',
  'PRODUCTION_PAYLOAD_SECRET',
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
