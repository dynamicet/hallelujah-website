import { execFileSync } from 'node:child_process'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const includeContainerTools = process.argv.includes('--include-container-tools')
const failures = []

async function readJson(relativePath) {
  return JSON.parse(await readFile(path.join(repositoryRoot, relativePath), 'utf8'))
}

function expectEqual(label, actual, expected) {
  if (actual !== expected) failures.push(`${label}: expected ${expected}, received ${actual ?? 'missing'}`)
}

function expectIncludes(label, contents, expected) {
  if (!contents.includes(expected)) failures.push(`${label}: missing ${expected}`)
}

function commandVersion(command, args, pattern) {
  try {
    const output = execFileSync(command, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim()
    return output.match(pattern)?.[1]
  } catch (error) {
    failures.push(`${command}: unavailable (${error.code ?? 'command failed'})`)
    return undefined
  }
}

function ensureSupported(label, supportUntil) {
  const end = new Date(`${supportUntil}T23:59:59Z`)
  if (Number.isNaN(end.getTime())) {
    failures.push(`${label}: invalid supportUntil date ${supportUntil}`)
  } else if (end < new Date()) {
    failures.push(`${label}: selected release became unsupported on ${supportUntil}`)
  }
}

function ensureReviewCurrent(reviewDue) {
  const deadline = new Date(`${reviewDue}T23:59:59Z`)
  if (Number.isNaN(deadline.getTime())) {
    failures.push(`toolchain review: invalid reviewDue date ${reviewDue}`)
  } else if (deadline < new Date()) {
    failures.push(`toolchain review: overdue since ${reviewDue}`)
  }
}

function ensureExactDependencies(manifest) {
  for (const section of ['dependencies', 'devDependencies']) {
    for (const [name, version] of Object.entries(manifest[section] ?? {})) {
      if (!/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/u.test(version)) {
        failures.push(`apps/web ${section}.${name}: dependency must use an exact version, received ${version}`)
      }
    }
  }
}

const policy = await readJson('toolchain-versions.json')
const rootManifest = await readJson('package.json')
const webManifest = await readJson('apps/web/package.json')
const nvmVersion = (await readFile(path.join(repositoryRoot, '.nvmrc'), 'utf8')).trim()
const lockfile = await readFile(path.join(repositoryRoot, 'pnpm-lock.yaml'), 'utf8')
const workflow = await readFile(path.join(repositoryRoot, '.github/workflows/toolchain-policy.yml'), 'utf8')

expectEqual('toolchain policy schema', policy.schemaVersion, 1)
expectEqual('.nvmrc Node.js version', nvmVersion, policy.runtime.node.version)
expectEqual('root packageManager', rootManifest.packageManager, `pnpm@${policy.runtime.pnpm.version}`)
expectEqual('Node.js engine release line', policy.runtime.node.engineRange, `${policy.runtime.node.releaseLine}.x`)
expectEqual('root Node.js engine', rootManifest.engines?.node, policy.runtime.node.engineRange)
expectEqual('web Node.js engine', webManifest.engines?.node, policy.runtime.node.engineRange)
expectEqual('root pnpm engine', rootManifest.engines?.pnpm, policy.runtime.pnpm.version)
expectEqual('web pnpm engine', webManifest.engines?.pnpm, policy.runtime.pnpm.version)
expectEqual('Next.js version', webManifest.dependencies?.next, policy.application.next)
expectEqual('Payload version', webManifest.dependencies?.payload, policy.application.payload)
expectEqual('@payloadcms/next version', webManifest.dependencies?.['@payloadcms/next'], policy.application.payload)
expectEqual('@payloadcms/db-postgres version', webManifest.dependencies?.['@payloadcms/db-postgres'], policy.application.payload)
expectEqual('Sharp version', webManifest.dependencies?.sharp, policy.application.sharp)
expectEqual('TypeScript version', webManifest.devDependencies?.typescript, policy.application.typescript)
expectEqual('eslint-config-next version', webManifest.devDependencies?.['eslint-config-next'], policy.application.next)

for (const [selector, version] of Object.entries(policy.securityOverrides)) {
  expectEqual(`pnpm override ${selector}`, rootManifest.pnpm?.overrides?.[selector], version)
}

const assetRequirements = await readFile(path.join(repositoryRoot, 'apps/web/scripts/lib/asset-format-requirements.txt'), 'utf8')
const assetWorker = await readFile(path.join(repositoryRoot, 'apps/web/scripts/lib/asset-format-worker.py'), 'utf8')
expectIncludes('asset fontTools pin', assetRequirements, `fonttools==${policy.assetProcessors.fontTools}`)
expectIncludes('asset Brotli pin', assetRequirements, `brotli==${policy.assetProcessors.brotli}`)
expectIncludes('asset dependency hashes', assetRequirements, '--require-hashes')
expectIncludes('asset fontTools runtime enforcement', assetWorker, `fontTools.version != "${policy.assetProcessors.fontTools}"`)
expectIncludes('asset Brotli runtime enforcement', assetWorker, `brotli.__version__ != "${policy.assetProcessors.brotli}"`)
expectIncludes('hosted asset processors', workflow, 'pip" install -r apps/web/scripts/lib/asset-format-requirements.txt')

ensureExactDependencies(webManifest)
ensureSupported('Node.js', policy.runtime.node.supportUntil)
ensureSupported('PostgreSQL', policy.database.postgresql.supportUntil)
ensureReviewCurrent(policy.reviewDue)

expectIncludes('lockfile version', lockfile, "lockfileVersion: '9.0'")
expectIncludes('lockfile Next.js specifier', lockfile, `next:\n        specifier: ${policy.application.next}`)
expectIncludes('lockfile Payload specifier', lockfile, `payload:\n        specifier: ${policy.application.payload}`)
expectIncludes('lockfile Sharp specifier', lockfile, `sharp:\n        specifier: ${policy.application.sharp}`)
expectIncludes('lockfile TypeScript specifier', lockfile, `typescript:\n        specifier: ${policy.application.typescript}`)
expectIncludes('lockfile DOMPurify override', lockfile, `dompurify@${policy.securityOverrides.dompurify}:`)
expectIncludes('lockfile scoped esbuild override', lockfile, `esbuild@${policy.securityOverrides['@esbuild-kit/core-utils>esbuild']}:`)

const digestPattern = /^[a-z0-9./-]+:\d+\.\d+(?:\.\d+)?-[a-z0-9-]+@sha256:[a-f0-9]{64}$/u
for (const [name, image] of Object.entries(policy.images)) {
  if (!digestPattern.test(image)) failures.push(`${name} image: tag and immutable sha256 digest are required`)
}
expectIncludes('Node.js image/runtime parity', policy.images.node, `node:${policy.runtime.node.version}-`)
expectIncludes(
  'PostgreSQL image/server parity',
  policy.images.postgresql,
  `postgres:${policy.database.postgresql.version}-`,
)

expectIncludes('workflow Node.js pin', workflow, `node-version: '${policy.runtime.node.version}'`)
expectIncludes('workflow pnpm pin', workflow, `corepack prepare pnpm@${policy.runtime.pnpm.version} --activate`)
expectIncludes('workflow frozen install', workflow, 'pnpm install --frozen-lockfile')
expectIncludes('workflow clean rebuild', workflow, 'pnpm rebuild:verify')

expectEqual('active Node.js runtime', process.versions.node, policy.runtime.node.version)
expectEqual(
  'active pnpm runtime',
  process.env.npm_config_user_agent?.match(/\bpnpm\/(\S+)/u)?.[1],
  policy.runtime.pnpm.version,
)

if (includeContainerTools) {
  const dockerClient = commandVersion('docker', ['--version'], /Docker version (\d+\.\d+\.\d+)/u)
  const dockerEngine = commandVersion(
    'docker',
    ['version', '--format', '{{.Server.Version}}'],
    /^(\d+\.\d+\.\d+)$/u,
  )
  const postgresqlClient = commandVersion(
    'psql',
    ['--version'],
    /psql \(PostgreSQL\) (\d+\.\d+)/u,
  )

  if (dockerClient) expectEqual('Docker CLI version', dockerClient, policy.runtime.docker.version)
  if (dockerEngine) expectEqual('Docker Engine version', dockerEngine, policy.runtime.docker.version)
  if (postgresqlClient) {
    expectEqual('PostgreSQL client version', postgresqlClient, policy.database.postgresql.version)
  }
}

if (failures.length > 0) {
  console.error('Toolchain policy check failed:')
  failures.forEach((failure) => console.error(`- ${failure}`))
  process.exitCode = 1
} else {
  const suffix = includeContainerTools ? ', Docker, and PostgreSQL' : ' and repository pins'
  console.log(`Toolchain policy check passed for Node.js ${policy.runtime.node.version}, pnpm ${policy.runtime.pnpm.version}${suffix}.`)
}
