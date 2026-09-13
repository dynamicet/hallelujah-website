import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const applicationRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const inspectedRoots = ['src', 'next.config.ts']
const allowedExtensions = new Set(['.css', '.js', '.mjs', '.ts', '.tsx'])
const prohibited = [
  { label: 'external URL', pattern: /https?:\/\//u },
  { label: 'prototype runtime reference', pattern: /docs\/visual-design|prototype\.js|PROTO-ONLY/u },
  { label: 'legacy WordPress reference', pattern: /wp-content|wp-config|wordpress/iu },
  { label: 'browser-exposed environment value', pattern: /NEXT_PUBLIC_/u },
  { label: 'embedded private key', pattern: /BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY/u },
]

async function collect(relativePath) {
  const absolutePath = path.join(applicationRoot, relativePath)

  if (path.extname(relativePath)) return [absolutePath]

  const entries = await readdir(absolutePath, { withFileTypes: true })
  const nested = await Promise.all(
    entries.map((entry) => collect(path.join(relativePath, entry.name))),
  )

  return nested.flat()
}

const files = (await Promise.all(inspectedRoots.map(collect)))
  .flat()
  .filter((file) => allowedExtensions.has(path.extname(file)))

const failures = []

for (const file of files) {
  const contents = await readFile(file, 'utf8')
  const relativeFile = path.relative(applicationRoot, file)

  for (const rule of prohibited) {
    if (rule.pattern.test(contents)) {
      failures.push(`${relativeFile}: ${rule.label}`)
    }
  }

  const environmentReaders = new Set([
    path.join('src', 'instrumentation.ts'),
    path.join('src', 'server', 'environment.ts'),
  ])
  if (!environmentReaders.has(relativeFile) && /process\.env/u.test(contents)) {
    failures.push(`${relativeFile}: environment access must use the server environment contract`)
  }
}

const exampleEnvironment = await readFile(path.join(applicationRoot, '.env.example'), 'utf8')
const exampleAssignments = exampleEnvironment
  .split(/\r?\n/u)
  .filter((line) => line.trim() && !line.trimStart().startsWith('#'))

for (const assignment of exampleAssignments) {
  if (!/^[A-Z][A-Z0-9_]*=$/u.test(assignment)) {
    failures.push('.env.example: assignments must contain names only')
  }
}

const requiredEnvironmentNames = [
  'APP_ENVIRONMENT',
  'PERSONAL_DATA_COLLECTION',
  'EXTERNAL_SERVICES',
  'LOCAL_DATABASE_URL',
  'LOCAL_PAYLOAD_SECRET',
  'STAGING_DATABASE_URL',
  'STAGING_PAYLOAD_SECRET',
  'PRODUCTION_DATABASE_URL',
  'PRODUCTION_PAYLOAD_SECRET',
]

const exampleNames = exampleAssignments.map((assignment) => assignment.slice(0, -1))
assertSameMembers(exampleNames, requiredEnvironmentNames, '.env.example')

if (failures.length > 0) {
  console.error('Bootstrap boundary check failed:')
  failures.forEach((failure) => console.error(`- ${failure}`))
  process.exitCode = 1
} else {
  console.log(`Bootstrap boundary check passed (${files.length} source/config files inspected).`)
}

function assertSameMembers(actual, expected, label) {
  const actualSorted = [...actual].sort()
  const expectedSorted = [...expected].sort()

  if (JSON.stringify(actualSorted) !== JSON.stringify(expectedSorted)) {
    failures.push(`${label}: environment names do not match the server contract`)
  }
}
