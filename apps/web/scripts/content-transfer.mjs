import { open } from 'node:fs/promises'
import { constants } from 'node:fs'
import { getPayload } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { loadServerEnvironment } from '../src/server/environment.ts'
import { cmsContentTransfer } from '../src/content/content-transfer-cms.ts'

// Credentials belong in the ignored local environment, never argv or reports.
const [action, inputPath, expectedPlanHash, ...extra] = process.argv.slice(2)
if (!['export', 'dry-run', 'import'].includes(action) || extra.length
  || action === 'export' && (inputPath || expectedPlanHash)
  || action !== 'export' && !inputPath
  || action === 'dry-run' && expectedPlanHash
  || action === 'import' && !/^[a-f0-9]{64}$/.test(expectedPlanHash ?? '')) {
  throw new Error('Usage: content-transfer export | dry-run <bundle.json> | import <bundle.json> <dry-run-plan-hash>')
}
const environment = loadServerEnvironment()
if (environment.deployment !== 'local' || process.env.PERSONAL_DATA_COLLECTION !== 'disabled'
  || process.env.EXTERNAL_SERVICES !== 'disabled') throw new Error('Content transfer requires local deployment with collection/providers disabled')
const email = process.env.LOCAL_CONTENT_TRANSFER_EMAIL
const password = process.env.LOCAL_CONTENT_TRANSFER_PASSWORD
if (!/^fixture-[a-z0-9-]+@cms\.invalid$/.test(email ?? '') || !password) throw new Error('Configure an existing synthetic local transfer identity in the ignored environment')
let bundle
if (inputPath) {
  const file = await open(inputPath, constants.O_RDONLY | constants.O_NOFOLLOW | constants.O_NONBLOCK)
  try {
    const stat = await file.stat()
    if (!stat.isFile() || stat.size > 4 * 1024 * 1024) throw new Error('Transfer input must be a regular JSON file of at most 4 MiB')
    const bytes = Buffer.alloc(4 * 1024 * 1024 + 1)
    let length = 0
    while (length < bytes.length) {
      const { bytesRead } = await file.read(bytes, length, bytes.length - length, length)
      if (!bytesRead) break
      length += bytesRead
    }
    if (length > 4 * 1024 * 1024) throw new Error('Transfer input exceeds 4 MiB')
    try { bundle = JSON.parse(bytes.subarray(0, length).toString('utf8')) } catch { throw new Error('Transfer input is not valid JSON') }
  } finally { await file.close() }
}
let payload
try {
  const { default: baseConfig } = await import('../src/payload.config.ts')
  // Operator dry runs never push schema, and stdout is reserved for versioned JSON.
  const config = { ...await baseConfig, logger: { options: { enabled: false } },
    db: postgresAdapter({ pool: { connectionString: environment.databaseUrl }, push: false }) }
  payload = await getPayload({ config })
  const login = await payload.login({ collection: 'users', data: { email, password } })
  const result = await cmsContentTransfer(payload, { ...login.user, collection: 'users' },
    { action, bundle, expectedPlanHash })
  await new Promise((resolve) => process.stdout.write(`${JSON.stringify(result, null, 2)}\n`, resolve))
  if ('report' in result && result.report && !result.report.valid) process.exitCode = 1
} catch {
  // Do not serialize provider/driver/login exceptions or authored values.
  await new Promise((resolve) => process.stderr.write('Local content transfer failed; verify identity, bundle and current dry-run plan. No partial batch was committed.\n', resolve))
  process.exitCode = 1
} finally {
  // The installed adapter retains a reconnect client. Commits and output are already
  // awaited; bound pool shutdown so this one-shot operator command reliably exits.
  if (payload) await Promise.race([payload.destroy().catch(() => {}),
    new Promise((resolve) => setTimeout(resolve, 1000))])
}
process.exit(process.exitCode ?? 0)
