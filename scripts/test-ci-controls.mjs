import { execFileSync } from 'node:child_process'
import { cp, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { closeSync, openSync, readFileSync, rmSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'

import { repositoryRoot } from './lib/repository-files.mjs'

const fixtureRoot = await mkdtemp(path.join(os.tmpdir(), 'b00-011-controls-'))
const exclusions = new Set(['.git', '.next', 'node_modules', 'tsconfig.tsbuildinfo'])
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

  const workflowPath = path.join(fixtureRoot, '.github/workflows/toolchain-policy.yml')
  const workflow = await readFile(workflowPath, 'utf8')
  await writeFile(workflowPath, workflow.replace('contents: read', 'contents: read\n  issues: write'))
  expectFailure('scripts/check-ci-policy.mjs', 'workflow token permissions must remain read-only')
  await writeFile(workflowPath, workflow)
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

  const migrationDirectory = path.join(fixtureRoot, 'apps/web/migrations')
  await mkdir(migrationDirectory, { recursive: true })
  await writeFile(path.join(migrationDirectory, 'unauthorized.ts'), 'export {}\n')
  expectFailure('scripts/check-introduction-gates.mjs', 'database migration material was introduced')
  completed += 1

  console.log(`CI control negative tests passed (${completed} fail-closed mutations, including secret-output redaction).`)
} finally {
  await rm(fixtureRoot, { recursive: true, force: true })
}
