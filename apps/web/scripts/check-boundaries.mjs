import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const applicationRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const inspectedRoots = ['src', 'next.config.ts']
const allowedExtensions = new Set(['.css', '.js', '.mjs', '.ts', '.tsx'])
const prohibited = [
  { label: 'external URL', pattern: /https?:\/\//u },
  { label: 'prototype runtime reference', pattern: /docs\/visual-design|prototype\.js|PROTO-ONLY/u },
  { label: 'reviewer control', pattern: /reviewer[-_ ]?(?:toolbar|control)/iu },
  { label: 'fixture query control', pattern: /fixture[-_ ]?query|query[-_ ]?fixture/iu },
  { label: 'simulated outcome', pattern: /simulated[-_ ]?outcome/iu },
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

const designSystemLayers = [
  { name: 'contracts', root: path.join('src', 'design-system', 'contracts') },
  { name: 'primitives', root: path.join('src', 'design-system', 'primitives') },
  { name: 'components', root: path.join('src', 'design-system', 'components') },
  { name: 'templates', root: path.join('src', 'design-system', 'templates') },
]

const allowedLayerDependencies = new Map([
  ['contracts', new Set()],
  ['primitives', new Set(['contracts'])],
  ['components', new Set(['contracts', 'primitives'])],
  ['templates', new Set(['components', 'contracts', 'primitives'])],
])

for (const file of files) {
  const contents = await readFile(file, 'utf8')
  const relativeFile = path.relative(applicationRoot, file)

  for (const rule of prohibited) {
    // Only the three exact static namespace declarations are exempted, never URL prefixes.
    const namespaces = new Set([
      "const schemaContext = 'https://schema.org'",
      "const sitemapNamespace = 'http://www.sitemaps.org/schemas/sitemap/0.9'",
      "const alternateNamespace = 'http://www.w3.org/1999/xhtml'",
    ])
    const inspected = rule.label === 'external URL'
      && relativeFile === path.join('src', 'content', 'governed-discovery.ts')
      ? contents.split('\n').filter((line) => !namespaces.has(line)).join('\n') : contents
    if (rule.pattern.test(inspected)) {
      failures.push(`${relativeFile}: ${rule.label}`)
    }
  }

  failures.push(...findArchitectureFailures(relativeFile, contents))

  const environmentReaders = new Set([
    path.join('src', 'instrumentation.ts'),
    path.join('src', 'server', 'environment.ts'),
  ])
  if (!environmentReaders.has(relativeFile) && /process\.env/u.test(contents)) {
    failures.push(`${relativeFile}: environment access must use the server environment contract`)
  }
}

const architectureControlCases = [
  {
    expected: 'application routes may consume only the templates public API',
    file: path.join('src', 'app', 'control.tsx'),
    source: "import { Example } from '@/design-system/components'",
  },
  {
    expected: 'components may not depend on templates',
    file: path.join('src', 'design-system', 'components', 'control.tsx'),
    source: "import { Example } from '../templates'",
  },
  {
    expected: 'cross-layer imports must use the public API',
    file: path.join('src', 'design-system', 'templates', 'control.tsx'),
    source: "import { Example } from '../components/status-summary'",
  },
  {
    expected: 'template CSS must be colocated and share the template basename',
    file: path.join('src', 'design-system', 'templates', 'control.tsx'),
    source: "import styles from './another-template.module.css'",
  },
]

for (const controlCase of architectureControlCases) {
  const results = findArchitectureFailures(controlCase.file, controlCase.source)
  if (!results.some((result) => result.includes(controlCase.expected))) {
    failures.push(`architecture control regression: ${controlCase.expected}`)
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
  'LOCAL_APPOINTMENT_DATABASE_URL',
  'LOCAL_APPOINTMENT_ABUSE_SECRET',
  'STAGING_DATABASE_URL',
  'STAGING_PAYLOAD_SECRET',
  'STAGING_APPOINTMENT_DATABASE_URL',
  'STAGING_APPOINTMENT_ABUSE_SECRET',
  'PRODUCTION_DATABASE_URL',
  'PRODUCTION_PAYLOAD_SECRET',
  'PRODUCTION_APPOINTMENT_DATABASE_URL',
  'PRODUCTION_APPOINTMENT_ABUSE_SECRET',
  'APPOINTMENT_NOTICE_VERSION',
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

function findArchitectureFailures(relativeFile, contents) {
  const findings = []
  const sourceLayer = findLayer(relativeFile)
  const isApplicationRoute = isWithin(relativeFile, path.join('src', 'app'))

  for (const specifier of extractImportSpecifiers(contents)) {
    const target = resolveLocalSpecifier(relativeFile, specifier)
    if (!target) continue

    const targetLayer = findLayer(target)
    if (!targetLayer) continue

    if (isApplicationRoute && targetLayer.name !== 'templates') {
      findings.push(
        `${relativeFile}: application routes may consume only the templates public API`,
      )
      continue
    }

    if (isApplicationRoute && target !== targetLayer.root) {
      findings.push(`${relativeFile}: cross-layer imports must use the public API`)
      continue
    }

    if (!sourceLayer || sourceLayer.name === targetLayer.name) continue

    if (!allowedLayerDependencies.get(sourceLayer.name).has(targetLayer.name)) {
      findings.push(
        `${relativeFile}: ${sourceLayer.name} may not depend on ${targetLayer.name}`,
      )
      continue
    }

    if (target !== targetLayer.root) {
      findings.push(`${relativeFile}: cross-layer imports must use the public API`)
    }
  }

  if (sourceLayer?.name === 'templates') {
    for (const stylesheet of extractStylesheetSpecifiers(contents)) {
      const expected = `./${path.basename(relativeFile, path.extname(relativeFile))}.module.css`
      if (stylesheet !== expected) {
        findings.push(
          `${relativeFile}: template CSS must be colocated and share the template basename`,
        )
      }
    }
  }

  return findings
}

function extractImportSpecifiers(contents) {
  const statementPattern =
    /(?:^|\n)(?:import|export)\s+(?:type\s+)?(?:[\s\S]*?\sfrom\s+)?['"]([^'"]+)['"]/gu
  const dynamicPattern = /import\(\s*['"]([^'"]+)['"]\s*\)/gu

  return [
    ...[...contents.matchAll(statementPattern)].map((match) => match[1]),
    ...[...contents.matchAll(dynamicPattern)].map((match) => match[1]),
  ]
}

function extractStylesheetSpecifiers(contents) {
  return extractImportSpecifiers(contents).filter((specifier) => specifier.endsWith('.css'))
}

function resolveLocalSpecifier(relativeFile, specifier) {
  if (specifier.startsWith('@/')) {
    return path.normalize(path.join('src', specifier.slice(2)))
  }

  if (specifier.startsWith('.')) {
    return path.normalize(path.join(path.dirname(relativeFile), specifier))
  }

  return undefined
}

function findLayer(relativePath) {
  return designSystemLayers.find((layer) => isWithin(relativePath, layer.root))
}

function isWithin(candidate, root) {
  return candidate === root || candidate.startsWith(`${root}${path.sep}`)
}
