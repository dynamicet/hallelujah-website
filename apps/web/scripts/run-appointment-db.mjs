import { execFile, execFileSync } from 'node:child_process'
import { randomBytes } from 'node:crypto'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'

const execute = promisify(execFile)
const applicationRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const root = await mkdtemp(path.join(tmpdir(), 'hallelujah-b03-016-pg.'))
const bin = process.env.APPOINTMENT_POSTGRES_BIN
  ?? execFileSync('pg_config', ['--bindir'], { encoding: 'utf8' }).trim()
const port = String(20_000 + randomBytes(2).readUInt16BE() % 30_000)
const data = path.join(root, 'data')
const dump = path.join(root, 'appointment.dump')
const env = { ...process.env, B03_016_PGHOST: root, B03_016_PGPORT: port }
const migrationRole = 'hallelujah_appointment_migration_local'
const runtimeRole = 'hallelujah_appointment_runtime_local'
const contentRole = 'hallelujah_content_local'
const appointmentDatabase = 'hallelujah_appointment_local'
const contentDatabase = 'hallelujah_content_local'
const restoreDatabase = 'hallelujah_appointment_restore_local'
let started = false

async function run(command, args, extra = {}) {
  const operation = execute(command, args, {
    env,
    timeout: 180_000,
    maxBuffer: 8 * 1024 * 1024,
    ...extra,
  })
  operation.child.stdout.on('data', (chunk) => process.stdout.write(chunk))
  operation.child.stderr.on('data', (chunk) => process.stderr.write(chunk))
  return operation.catch(() => {
    throw new Error('Scoped appointment database command failed; see sanitized output above')
  })
}

const psql = (role, database, args) => run(path.join(bin, 'psql'), [
  '-X', '-w', '-v', 'ON_ERROR_STOP=1', '-h', root, '-p', port,
  '-U', role, '-d', database, ...args,
])

try {
  await run(path.join(bin, 'initdb'), [
    '-D', data, '--username=postgres', '--auth-local=trust', '--auth-host=reject', '--no-instructions',
  ])
  await run(path.join(bin, 'pg_ctl'), [
    '-D', data,
    '-l', path.join(root, 'postgres.log'),
    '-o', `-k ${root} -p ${port} -c listen_addresses='' -c max_connections=20`,
    '-w', 'start',
  ])
  started = true

  for (const role of [contentRole, migrationRole, runtimeRole]) {
    await psql('postgres', 'postgres', ['-c', `CREATE ROLE ${role} LOGIN PASSWORD 'synthetic-placeholder';`])
  }
  await psql('postgres', 'postgres', ['-c', `CREATE DATABASE ${contentDatabase} OWNER ${contentRole};`])
  await psql('postgres', 'postgres', ['-c', `CREATE DATABASE ${appointmentDatabase} OWNER ${migrationRole};`])
  for (const database of [contentDatabase, appointmentDatabase]) {
    await psql('postgres', 'postgres', ['-c', `REVOKE ALL ON DATABASE ${database} FROM PUBLIC;`])
  }
  await psql('postgres', 'postgres', ['-c', `GRANT CONNECT ON DATABASE ${contentDatabase} TO ${contentRole};`])
  await psql('postgres', 'postgres', ['-c', `GRANT CONNECT ON DATABASE ${appointmentDatabase} TO ${migrationRole}, ${runtimeRole};`])
  await psql(contentRole, contentDatabase, ['-c',
    "CREATE TABLE controlled_content_fixture (label text NOT NULL); INSERT INTO controlled_content_fixture VALUES ('synthetic-content');"])

  await psql(migrationRole, appointmentDatabase, [
    '-v', `appointment_runtime_role=${runtimeRole}`,
    '-f', path.join(applicationRoot, 'migrations/appointment/0001_b03_015_foundation.sql'),
  ])
  await psql(migrationRole, appointmentDatabase, [
    '-v', `appointment_runtime_role=${runtimeRole}`,
    '-f', path.join(applicationRoot, 'migrations/appointment/0002_b03_016_idempotency.sql'),
  ])
  await psql(migrationRole, appointmentDatabase, ['-c', `
    INSERT INTO appointment.privacy_notices (version, enabled, synthetic)
    VALUES ('synthetic-notice-v1', true, true);
    INSERT INTO appointment.care_catalog (public_id, kind, active, synthetic) VALUES
      ('doc_synthetic_fixture_0001', 'doctor', true, true),
      ('svc_synthetic_fixture_0001', 'service', true, true);
  `])

  const crossContent = await psql(runtimeRole, contentDatabase, ['-c', 'SELECT current_database()'])
    .then(() => true, () => false)
  if (crossContent) throw new Error('Appointment runtime unexpectedly connected to content database')
  const crossAppointment = await psql(contentRole, appointmentDatabase, ['-c', 'SELECT current_database()'])
    .then(() => true, () => false)
  if (crossAppointment) throw new Error('Content role unexpectedly connected to appointment database')

  await run('pnpm', ['appointment:db-smoke'], { cwd: applicationRoot, timeout: 300_000 })

  await run(path.join(bin, 'pg_dump'), [
    '-Fc', '-h', root, '-p', port, '-U', migrationRole, '-d', appointmentDatabase, '-f', dump,
  ])
  await psql('postgres', 'postgres', ['-c', `CREATE DATABASE ${restoreDatabase} OWNER ${migrationRole};`])
  await psql('postgres', 'postgres', ['-c', `REVOKE ALL ON DATABASE ${restoreDatabase} FROM PUBLIC;`])
  await run(path.join(bin, 'pg_restore'), [
    '-h', root, '-p', port, '-U', migrationRole, '-d', restoreDatabase, '--exit-on-error', dump,
  ])
  const restored = await psql(migrationRole, restoreDatabase, ['-tAc', `
    SELECT (SELECT count(*) FROM appointment.requests) || ':' ||
      (SELECT count(*) FROM appointment.schema_migrations) || ':' ||
      (to_regclass('public.controlled_content_fixture') IS NULL)::text;
  `])
  if (restored.stdout.trim() !== '11:2:true') {
    throw new Error('Independent appointment restore did not preserve the expected synthetic set')
  }
  process.stdout.write('Independent synthetic appointment backup and restore passed.\n')
} finally {
  if (started) {
    await run(path.join(bin, 'pg_ctl'), ['-D', data, '-m', 'fast', '-w', 'stop'])
  }
  await rm(root, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 })
}
