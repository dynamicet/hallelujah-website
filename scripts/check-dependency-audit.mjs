import { execFileSync } from 'node:child_process'

import { repositoryRoot } from './lib/repository-files.mjs'

let output
let commandStatus = 0

try {
  output = execFileSync('pnpm', ['audit', '--audit-level', 'moderate', '--json'], {
    cwd: repositoryRoot,
    encoding: 'utf8',
    maxBuffer: 32 * 1024 * 1024,
  })
} catch (error) {
  output = typeof error.stdout === 'string' ? error.stdout : undefined
  commandStatus = error.status ?? 1
}

let report
try {
  report = JSON.parse(output ?? '')
} catch {
  console.error('Dependency audit failed: the registry did not return a complete JSON audit report.')
  process.exit(1)
}

const counts = report.metadata?.vulnerabilities
const severities = ['info', 'low', 'moderate', 'high', 'critical']
if (!counts || severities.some((severity) => !Number.isInteger(counts[severity]))) {
  console.error('Dependency audit failed: the registry response did not contain vulnerability counts.')
  process.exit(1)
}

const blocking = counts.moderate + counts.high + counts.critical
// pnpm 10.27 returns from its JSON branch before applying --audit-level.
// Exit 1 is expected for a complete report containing only low/info findings.
const advisories = Object.values(report.advisories ?? {})
const advisoryExit = commandStatus === 1 && counts.low + counts.info > 0
  && advisories.length === counts.low + counts.info
  && advisories.every(advisory => advisory.severity === 'low' || advisory.severity === 'info')
if ((commandStatus !== 0 && !advisoryExit) || blocking > 0 || report.error) {
  console.error(
    `Dependency audit failed: ${counts.moderate} moderate, ${counts.high} high, and ${counts.critical} critical known vulnerabilities.`,
  )
  process.exit(1)
}

console.log(
  `Dependency audit passed (${report.metadata.totalDependencies} dependencies; zero moderate, high, or critical known vulnerabilities; ${counts.low} low and ${counts.info} informational advisories).`,
)
