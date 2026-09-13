import {
  EnvironmentConfigurationError,
  loadServerEnvironment,
} from '../src/server/environment.ts'

try {
  const environment = loadServerEnvironment()

  console.log(
    `Server environment configuration passed (${environment.deployment}; personal data ${environment.personalDataCollection}; external services ${environment.externalServices}).`,
  )
} catch (error) {
  if (error instanceof EnvironmentConfigurationError) {
    console.error(error.message)
  } else {
    console.error('Server environment configuration failed without exposing configuration values.')
  }
  process.exitCode = 1
}
