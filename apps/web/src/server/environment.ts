type DeploymentEnvironment = 'local' | 'staging' | 'production'

type EnvironmentVariableName =
  | 'LOCAL_DATABASE_URL'
  | 'LOCAL_PAYLOAD_SECRET'
  | 'STAGING_DATABASE_URL'
  | 'STAGING_PAYLOAD_SECRET'
  | 'PRODUCTION_DATABASE_URL'
  | 'PRODUCTION_PAYLOAD_SECRET'

type EnvironmentVariables = NodeJS.ProcessEnv &
  Partial<Record<EnvironmentVariableName, string>>

type ScopedVariableNames = {
  databaseUrl: EnvironmentVariableName
  payloadSecret: EnvironmentVariableName
}

export type ServerEnvironment = Readonly<{
  deployment: DeploymentEnvironment
  databaseUrl: string
  payloadSecret: string
  personalDataCollection: 'disabled'
  externalServices: 'disabled'
}>

const environments: readonly DeploymentEnvironment[] = [
  'local',
  'staging',
  'production',
]

const scopedVariables: Record<DeploymentEnvironment, ScopedVariableNames> = {
  local: {
    databaseUrl: 'LOCAL_DATABASE_URL',
    payloadSecret: 'LOCAL_PAYLOAD_SECRET',
  },
  staging: {
    databaseUrl: 'STAGING_DATABASE_URL',
    payloadSecret: 'STAGING_PAYLOAD_SECRET',
  },
  production: {
    databaseUrl: 'PRODUCTION_DATABASE_URL',
    payloadSecret: 'PRODUCTION_PAYLOAD_SECRET',
  },
}

export class EnvironmentConfigurationError extends Error {
  readonly issues: readonly string[]

  constructor(issues: readonly string[]) {
    super(`Invalid server environment configuration:\n${issues.map((issue) => `- ${issue}`).join('\n')}`)
    this.name = 'EnvironmentConfigurationError'
    this.issues = Object.freeze([...issues])
  }
}

function hasValue(value: string | undefined): value is string {
  return value !== undefined && value.trim().length > 0
}

function parseDeployment(value: string | undefined, issues: string[]) {
  if (!hasValue(value)) {
    issues.push('APP_ENVIRONMENT is required')
    return undefined
  }

  if (!environments.includes(value as DeploymentEnvironment)) {
    issues.push('APP_ENVIRONMENT must be local, staging, or production')
    return undefined
  }

  return value as DeploymentEnvironment
}

function validateDisabledGate(
  source: EnvironmentVariables,
  name: 'PERSONAL_DATA_COLLECTION' | 'EXTERNAL_SERVICES',
  issues: string[],
) {
  if (!hasValue(source[name])) {
    issues.push(`${name} is required and must be disabled`)
  } else if (source[name] !== 'disabled') {
    issues.push(`${name} must be disabled`)
  }
}

function validateDatabaseUrl(
  value: string,
  variableName: EnvironmentVariableName,
  deployment: DeploymentEnvironment,
  issues: string[],
) {
  let parsed: URL

  try {
    parsed = new URL(value)
  } catch {
    issues.push(`${variableName} must be a valid PostgreSQL URL`)
    return
  }

  if (!['postgres:', 'postgresql:'].includes(parsed.protocol)) {
    issues.push(`${variableName} must use the postgresql protocol`)
  }

  if (!parsed.username || !parsed.password) {
    issues.push(`${variableName} must contain environment-specific credentials`)
  }

  const expectedDatabase = `hallelujah_content_${deployment}`
  if (parsed.pathname !== `/${expectedDatabase}`) {
    issues.push(`${variableName} must select the ${expectedDatabase} database`)
  }
}

function validatePayloadSecret(
  value: string,
  variableName: EnvironmentVariableName,
  issues: string[],
) {
  if (Buffer.byteLength(value, 'utf8') < 32) {
    issues.push(`${variableName} must contain at least 32 bytes`)
  }
}

export function loadServerEnvironment(
  source: EnvironmentVariables = process.env,
): ServerEnvironment {
  const issues: string[] = []
  const deployment = parseDeployment(source.APP_ENVIRONMENT, issues)

  validateDisabledGate(source, 'PERSONAL_DATA_COLLECTION', issues)
  validateDisabledGate(source, 'EXTERNAL_SERVICES', issues)

  if (!deployment) {
    throw new EnvironmentConfigurationError(issues)
  }

  const selected = scopedVariables[deployment]

  for (const candidate of environments) {
    if (candidate === deployment) continue

    const unselected = scopedVariables[candidate]
    for (const variableName of [unselected.databaseUrl, unselected.payloadSecret]) {
      if (hasValue(source[variableName])) {
        issues.push(`${variableName} must not be present in the ${deployment} environment`)
      }
    }
  }

  const databaseUrl = source[selected.databaseUrl]
  const payloadSecret = source[selected.payloadSecret]

  if (!hasValue(databaseUrl)) {
    issues.push(`${selected.databaseUrl} is required`)
  } else {
    validateDatabaseUrl(databaseUrl, selected.databaseUrl, deployment, issues)
  }

  if (!hasValue(payloadSecret)) {
    issues.push(`${selected.payloadSecret} is required`)
  } else {
    validatePayloadSecret(payloadSecret, selected.payloadSecret, issues)
  }

  if (issues.length > 0 || !hasValue(databaseUrl) || !hasValue(payloadSecret)) {
    throw new EnvironmentConfigurationError(issues)
  }

  return Object.freeze({
    databaseUrl,
    deployment,
    externalServices: 'disabled',
    payloadSecret,
    personalDataCollection: 'disabled',
  })
}
