import assert from 'node:assert/strict'
import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

import { loadReconciliation, reconcile, reconciliationRoot, renderReviewQueue } from './lib/content-reconciliation.mjs'

assert(process.argv.slice(2).every((argument) => argument === '--write-report'), 'Unknown reconciliation argument')
const { sources, register } = await loadReconciliation()
const report = `${JSON.stringify(reconcile(sources, register), null, 2)}\n`
for (const [name, expected] of [['report.json', report], ['review-queue.md', renderReviewQueue(register)]]) {
  const artifactPath = path.join(reconciliationRoot, name)
  if (process.argv.includes('--write-report')) await writeFile(artifactPath, expected)
  else assert.equal(await readFile(artifactPath, 'utf8'), expected, `Reconciliation ${name} is stale; inspect changes before --write-report`)
}
console.log(`Content reconciliation passed: ${register.entries.length} source units accounted for; no hospital approval or migration.`)
