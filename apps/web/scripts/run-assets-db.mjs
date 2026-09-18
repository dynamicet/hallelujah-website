import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { mkdtemp, rm } from 'node:fs/promises'
import { randomBytes } from 'node:crypto'
import path from 'node:path'
import { tmpdir } from 'node:os'

const execute = promisify(execFile)
const root = await mkdtemp(path.join(tmpdir(), 'hallelujah-b02-001-pg.'))
const bin = process.env.ASSET_POSTGRES_BIN ?? '/usr/lib/postgresql/18/bin'
const port = String(20000 + randomBytes(2).readUInt16BE() % 30000)
const data = path.join(root, 'data')
const env = { ...process.env, B02_001_PGHOST: root, B02_001_PGPORT: port }
let started = false
async function run(command, args, extra = {}) {
  const operation = execute(command, args, { env, timeout: 180000, maxBuffer: 8 * 1024 * 1024, ...extra })
  operation.child.stdout.on('data', (chunk) => process.stdout.write(chunk))
  operation.child.stderr.on('data', (chunk) => process.stderr.write(chunk))
  const result = await operation.catch(() => { throw new Error('Scoped database command failed; see sanitized output above') })
  return result
}
const query = (database, sql) => run(path.join(bin, 'psql'), ['-X', '-w', '-v', 'ON_ERROR_STOP=1', '-h', root, '-p', port, '-d', database, '-c', sql])
try {
  await run(path.join(bin, 'initdb'), ['-D', data, '--auth-local=trust', '--auth-host=reject', '--no-instructions'])
  await run(path.join(bin, 'pg_ctl'), ['-D', data, '-l', path.join(root, 'postgres.log'), '-o', `-k ${root} -p ${port} -c listen_addresses='' -c max_connections=30`, '-w', 'start'])
  started = true
  for (const lane of ['content', 'appointment']) {
    const role = `hallelujah_${lane}_local`
    await query('postgres', `CREATE ROLE ${role} LOGIN PASSWORD 'synthetic-placeholder';`)
    await query('postgres', `CREATE DATABASE ${role} OWNER ${role};`)
    await query('postgres', `REVOKE ALL ON DATABASE ${role} FROM PUBLIC; GRANT CONNECT, TEMPORARY ON DATABASE ${role} TO ${role};`)
    await query(role, `SET ROLE ${role}; CREATE TABLE controlled_${lane}_fixture (label text NOT NULL); INSERT INTO controlled_${lane}_fixture VALUES ('synthetic-${lane}');`)
  }
  await run('pnpm', ['local-db-isolation:check'])
  await query('hallelujah_content_local', 'DROP TABLE controlled_content_fixture;')
  await run('pnpm', [process.argv.includes('--transfer-only') ? 'content-transfer:db-smoke'
    : process.argv.includes('--full') ? 'governed-records:db-smoke' : 'assets:db-smoke'], { timeout: 300000 })
} finally {
  if (started) await run(path.join(bin, 'pg_ctl'), ['-D', data, '-m', 'fast', '-w', 'stop'])
  await rm(root, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 })
}
