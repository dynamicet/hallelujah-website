import { execFileSync } from 'node:child_process'
import { readFile } from 'node:fs/promises'
import path from 'node:path'

import {
  collectRepositoryFiles,
  repositoryRelative,
  repositoryRoot,
} from './lib/repository-files.mjs'

const inspectExtensions = new Set([
  '.css',
  '.env',
  '.html',
  '.js',
  '.json',
  '.jsx',
  '.md',
  '.mjs',
  '.npmrc',
  '.ts',
  '.tsx',
  '.txt',
  '.yaml',
  '.yml',
])
const signatureRules = [
  ['private key', /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/gu],
  ['GitHub access token', /(?:gh[opusr]_[A-Za-z0-9]{36,}|github_pat_[A-Za-z0-9_]{50,})/gu],
  ['AWS access key', /(?:AKIA|ASIA)[A-Z0-9]{16}/gu],
  ['Google API key', /AIza[A-Za-z0-9_-]{35}/gu],
  ['Slack token', /xox[baprs]-[A-Za-z0-9-]{20,}/gu],
  ['Stripe live key', /(?:sk|rk)_live_[A-Za-z0-9]{16,}/gu],
]
const files = await collectRepositoryFiles({
  include: (file) => {
    const basename = path.basename(file)
    return inspectExtensions.has(path.extname(file)) || basename.startsWith('.env') || basename === '.npmrc'
  },
})
const failures = []

function inspect(label, contents) {
  for (const [rule, pattern] of signatureRules) {
    pattern.lastIndex = 0
    if (pattern.test(contents)) failures.push(`${label}: ${rule} signature detected`)
  }
}

for (const file of files) {
  const contents = await readFile(file, 'utf8')
  inspect(repositoryRelative(file), contents)

  if (path.basename(file).startsWith('.env') && path.basename(file) !== '.env.example') {
    failures.push(`${repositoryRelative(file)}: tracked environment file is prohibited`)
  }
}

if (process.argv.includes('--history')) {
  let history
  try {
    history = execFileSync(
      'git',
      ['log', '--all', '--full-history', '--no-ext-diff', '--format=commit:%H', '-p', '--unified=0'],
      { cwd: repositoryRoot, encoding: 'utf8', maxBuffer: 128 * 1024 * 1024 },
    )
  } catch (error) {
    // Some controlled sandboxes report EPERM after a read-only child process
    // exits successfully. Accept its complete stdout only when status is zero.
    if (error.status === 0 && typeof error.stdout === 'string') history = error.stdout
    else failures.push(`Git history: unable to inspect (${error.code ?? 'command failed'})`)
  }
  if (history !== undefined) inspect('Git history', history)
}

if (failures.length > 0) {
  console.error('Secret scan failed (matched values are intentionally redacted):')
  failures.forEach((failure) => console.error(`- ${failure}`))
  process.exitCode = 1
} else {
  const historyLabel = process.argv.includes('--history') ? ' plus reachable Git history' : ''
  console.log(`Secret scan passed (${files.length} current text files${historyLabel}; matched values would be redacted).`)
}
