import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { cp, mkdtemp, readFile, rm } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const cleanRoot = await mkdtemp(path.join(os.tmpdir(), 'b00-005-clean-'))
// Local browser profiles may contain sockets and are not rebuild inputs.
const exclusions = new Set(['.git', '.next', 'node_modules', 'tsconfig.tsbuildinfo', 'artifacts', '.taste-skill', '.visual-review'])

function run(command, args, cwd, options = {}) {
  return execFileSync(command, args, {
    cwd,
    encoding: 'utf8',
    env: { ...process.env, CI: 'true', NEXT_TELEMETRY_DISABLED: '1' },
    maxBuffer: 64 * 1024 * 1024,
    stdio: options.capture ? ['ignore', 'pipe', 'pipe'] : 'inherit',
  })
}

function canonicalize(value) {
  if (Array.isArray(value)) return value.map(canonicalize)
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([key]) => key !== 'path')
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, nested]) => [key, canonicalize(nested)]),
    )
  }
  return value
}

function hash(value) {
  return createHash('sha256').update(value).digest('hex')
}

try {
  await cp(repositoryRoot, cleanRoot, {
    recursive: true,
    filter: (source) => {
      const relative = path.relative(repositoryRoot, source)
      return relative === '' || !relative.split(path.sep).some((part) => exclusions.has(part))
    },
  })

  const sourceLockHash = hash(await readFile(path.join(repositoryRoot, 'pnpm-lock.yaml')))
  run('pnpm', ['install', '--frozen-lockfile', '--reporter=append-only'], cleanRoot)

  const cleanLockHash = hash(await readFile(path.join(cleanRoot, 'pnpm-lock.yaml')))
  if (sourceLockHash !== cleanLockHash) throw new Error('frozen install changed pnpm-lock.yaml')

  // The frozen lockfile hash covers the complete transitive graph. This smaller
  // importer graph comparison independently proves that each workspace links
  // the same direct versions without materializing a recursively duplicated tree.
  const graphArgs = ['list', '--recursive', '--depth', '0', '--json']
  const sourceGraph = canonicalize(JSON.parse(run('pnpm', graphArgs, repositoryRoot, { capture: true })))
  const cleanGraph = canonicalize(JSON.parse(run('pnpm', graphArgs, cleanRoot, { capture: true })))
  const sourceGraphHash = hash(JSON.stringify(sourceGraph))
  const cleanGraphHash = hash(JSON.stringify(cleanGraph))

  if (sourceGraphHash !== cleanGraphHash) {
    throw new Error(`workspace importer drift: source ${sourceGraphHash}, clean ${cleanGraphHash}`)
  }

  // CI runs the complete source and browser suite before this independent
  // reconstruction. Recheck the clean build and its output without replaying
  // those suites; installation and graph comparisons above still fail closed.
  for (const command of ['build', 'content-build:check', 'accessibility:smoke', 'budgets:smoke', 'runtime:smoke']) {
    run('pnpm', [command], cleanRoot)
  }
  console.log(`Clean rebuild passed; full lockfile graph sha256 ${sourceLockHash}; workspace importer graph sha256 ${cleanGraphHash}.`)
} finally {
  await rm(cleanRoot, { recursive: true, force: true })
}
