import path from 'node:path'

import {
  collectRepositoryFiles,
  repositoryRelative,
  repositoryRoot,
} from './lib/repository-files.mjs'

const applicationRoot = path.join(repositoryRoot, 'apps')
const applicationFiles = await collectRepositoryFiles({
  include: (file) => file.startsWith(`${applicationRoot}${path.sep}`),
})
const migrationFiles = applicationFiles.filter((file) =>
  repositoryRelative(file).split('/').includes('migrations'),
)
const authorizedMigrationFiles = new Set([
  'apps/web/migrations/appointment/0001_b03_015_foundation.sql',
  'apps/web/migrations/appointment/README.md',
])
const unauthorizedMigrationFiles = migrationFiles.filter(
  (file) => !authorizedMigrationFiles.has(repositoryRelative(file)),
)
const containerFiles = applicationFiles.filter((file) => {
  const name = path.basename(file).toLowerCase()
  return name === 'dockerfile' || name.startsWith('dockerfile.') || /^(?:docker-)?compose.*\.ya?ml$/u.test(name)
})
const failures = []

if (unauthorizedMigrationFiles.length > 0) {
  failures.push(
    `database migration material was introduced before B00-008/B00-009 authorization: ${unauthorizedMigrationFiles.map(repositoryRelative).join(', ')}`,
  )
}

if (containerFiles.length > 0) {
  failures.push(
    `container material was introduced before an approved image-scanning implementation: ${containerFiles.map(repositoryRelative).join(', ')}`,
  )
}

if (failures.length > 0) {
  console.error('Migration/container introduction gate failed:')
  failures.forEach((failure) => console.error(`- ${failure}`))
  process.exitCode = 1
} else {
  console.log(
    'Migration/container introduction gate passed (only the authorized B03-015 appointment migration exists; containers remain fail-closed).',
  )
}
