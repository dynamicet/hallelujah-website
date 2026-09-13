import { readFile } from 'node:fs/promises'
import path from 'node:path'

import { repositoryRoot } from './lib/repository-files.mjs'

const workflowPath = path.join(repositoryRoot, '.github/workflows/toolchain-policy.yml')
const workflow = await readFile(workflowPath, 'utf8')
const failures = []
const requireText = (label, value) => {
  if (!workflow.includes(value)) failures.push(`${label}: missing ${value}`)
}

requireText('pull-request trigger', 'pull_request:')
requireText('protected-branch trigger', 'branches:\n      - main')
requireText('least-privilege token', 'permissions:\n  contents: read')
requireText('bounded execution', 'timeout-minutes: 30')
requireText('frozen install', 'pnpm install --frozen-lockfile')
requireText('repository verification', 'pnpm verify')
requireText('CI control negative tests', 'pnpm ci:controls:test')
requireText('history-aware secret scan', 'pnpm secrets:check --history')
requireText('dependency audit', 'pnpm audit:dependencies')
requireText('clean reconstruction', 'pnpm rebuild:verify')

for (const match of workflow.matchAll(/^\s*uses:\s*([^\s#]+)(?:\s+#.*)?$/gmu)) {
  const action = match[1]
  const actionName = action.split('@')[0]
  const revision = action.split('@')[1]
  if (!['actions/checkout', 'actions/setup-node'].includes(actionName)) {
    failures.push(`unapproved external action: ${actionName}`)
  }
  if (!/^[a-f0-9]{40}$/u.test(revision ?? '')) {
    failures.push(`${actionName}: action must be pinned to a full commit SHA`)
  }
}

if (/pull_request_target:|workflow_run:|\bsecrets\s*\./u.test(workflow)) {
  failures.push('workflow must not use privileged triggers or repository secrets')
}

if (/permissions:\s*write-all/u.test(workflow) || /^\s+[A-Za-z-]+:\s*(?:write|admin)\s*$/gmu.test(workflow)) {
  failures.push('workflow token permissions must remain read-only')
}

if (failures.length > 0) {
  console.error('CI policy check failed:')
  failures.forEach((failure) => console.error(`- ${failure}`))
  process.exitCode = 1
} else {
  console.log('CI policy check passed (bounded triggers, read-only token, immutable actions, and required gates).')
}
