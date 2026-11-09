import { execFileSync, spawnSync } from 'node:child_process'
import { cp, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { closeSync, openSync, readFileSync, rmSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'

import { repositoryRoot } from './lib/repository-files.mjs'

const fixtureRoot = await mkdtemp(path.join(os.tmpdir(), 'b00-011-controls-'))
const exclusions = new Set(['.git', '.next', 'node_modules', 'tsconfig.tsbuildinfo', 'artifacts', '.taste-skill', '.visual-review'])
let completed = 0

function expectFailure(script, expectedMessage) {
  const diagnosticPath = path.join(fixtureRoot, '.ci-control-diagnostic')
  const diagnostic = openSync(diagnosticPath, 'w')
  try {
    execFileSync(process.execPath, [script], {
      cwd: fixtureRoot,
      encoding: 'utf8',
      maxBuffer: 16 * 1024 * 1024,
      stdio: ['ignore', diagnostic, diagnostic],
    })
  } catch {
    // The diagnostic below distinguishes an expected fail-closed result from
    // a child-process or controlled-sandbox execution failure.
  } finally {
    closeSync(diagnostic)
  }

  try {
    const output = readFileSync(diagnosticPath, 'utf8')
    if (!output.includes(expectedMessage)) {
      throw new Error(`${script}: did not fail with the expected redacted diagnostic`)
    }
    return output
  } finally {
    rmSync(diagnosticPath, { force: true })
  }
}

try {
  await cp(repositoryRoot, fixtureRoot, {
    recursive: true,
    filter: (source) => {
      const relative = path.relative(repositoryRoot, source)
      return relative === '' || !relative.split(path.sep).some((part) => exclusions.has(part))
    },
  })

  execFileSync('git', ['init', '--quiet'], { cwd: fixtureRoot, stdio: 'pipe' })

  const workflowPath = path.join(fixtureRoot, '.github/workflows/toolchain-policy.yml')
  const workflow = await readFile(workflowPath, 'utf8')
  await writeFile(workflowPath, workflow.replace('contents: read', 'contents: read\n  issues: write'))
  expectFailure('scripts/check-ci-policy.mjs', 'workflow token permissions must remain read-only')
  await writeFile(workflowPath, workflow)
  completed += 1

  const contributingPath = path.join(fixtureRoot, 'CONTRIBUTING.md')
  const contributing = await readFile(contributingPath, 'utf8')
  await writeFile(
    contributingPath,
    contributing.replace("pull request's current head commit", "an earlier pull-request commit"),
  )
  expectFailure('scripts/check-ci-policy.mjs', 'merge procedure: missing')
  await writeFile(contributingPath, contributing)
  completed += 1

  const secretPath = path.join(fixtureRoot, 'synthetic-secret-fixture.txt')
  const syntheticToken = ['ghp', '_', 'A'.repeat(40)].join('')
  await writeFile(secretPath, `${syntheticToken}\n`)
  const secretOutput = expectFailure('scripts/check-secrets.mjs', 'matched values are intentionally redacted')
  if (secretOutput.includes(syntheticToken)) throw new Error('secret scan disclosed its matched value')
  await rm(secretPath)
  completed += 1

  const linkPath = path.join(fixtureRoot, 'synthetic-link-fixture.md')
  await writeFile(linkPath, '[Missing](missing-controlled-fixture.md)\n')
  expectFailure('scripts/check-local-links.mjs', 'missing missing-controlled-fixture.md')
  await rm(linkPath)
  completed += 1

  const formatPath = path.join(fixtureRoot, 'synthetic-format-fixture.json')
  await writeFile(formatPath, '{invalid}\n')
  expectFailure('scripts/check-format.mjs', 'invalid JSON')
  await rm(formatPath)
  completed += 1

  // Match B00-011's moderate-or-higher gate without accepting registry failures.
  const auditBin = path.join(fixtureRoot, 'audit-bin')
  await mkdir(auditBin)
  await writeFile(path.join(auditBin, 'pnpm'), `#!/usr/bin/env node
if (JSON.stringify(process.argv.slice(2)) !== JSON.stringify(['audit', '--audit-level', 'moderate', '--json'])) process.exit(9)
process.stdout.write(process.env.HH_AUDIT_REPORT)
process.exit(Number(process.env.HH_AUDIT_EXIT))
`, { mode: 0o755 })
  const counts = { info: 0, low: 0, moderate: 0, high: 0, critical: 0 }
  const auditCases = [
    { counts, exit: 0, pass: true },
    { counts: { ...counts, low: 1 }, exit: 0, pass: true },
    { counts: { ...counts, low: 1 }, advisories: { low: { severity: 'low' } }, exit: 1, pass: true },
    { counts: { ...counts, low: 1 }, exit: 1, pass: false },
    ...['moderate', 'high', 'critical'].map(severity => ({ counts: { ...counts, [severity]: 1 }, exit: 1, pass: false })),
    { counts, exit: 1, pass: false },
    { raw: '{}', exit: 0, pass: false },
    { raw: 'registry unavailable', exit: 1, pass: false },
  ]
  for (const test of auditCases) {
    const result = spawnSync(process.execPath, ['scripts/check-dependency-audit.mjs'], {
      cwd: fixtureRoot,
      encoding: 'utf8',
      env: {
        ...process.env,
        PATH: `${auditBin}${path.delimiter}${process.env.PATH}`,
        HH_AUDIT_REPORT: test.raw ?? JSON.stringify({ metadata: { vulnerabilities: test.counts, totalDependencies: 1 }, advisories: test.advisories }),
        HH_AUDIT_EXIT: String(test.exit),
      },
    })
    if ((result.status === 0) !== test.pass || result.error) throw new Error('dependency audit control regression')
    completed += 1
  }

  const migrationDirectory = path.join(fixtureRoot, 'apps/web/migrations')
  await mkdir(migrationDirectory, { recursive: true })
  await writeFile(path.join(migrationDirectory, 'unauthorized.ts'), 'export {}\n')
  expectFailure('scripts/check-introduction-gates.mjs', 'database migration material was introduced')
  completed += 1

  console.log(`CI control negative tests passed (${completed} fail-closed mutations, including secret-output redaction).`)
} finally {
  await rm(fixtureRoot, { recursive: true, force: true })
}
