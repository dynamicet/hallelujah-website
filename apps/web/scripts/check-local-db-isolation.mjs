import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'

const host = process.env.B02_001_PGHOST
const port = process.env.B02_001_PGPORT
if (!host?.startsWith('/tmp/hallelujah-b02-001-pg.') || !/^\d{2,5}$/.test(port ?? '')
  || process.env.PGPASSWORD) {
  process.stderr.write('Use a disposable /tmp/hallelujah-b02-001-pg.* Unix socket and port, without PGPASSWORD.\n')
  process.exit(2)
}

function query(role, database, sql) {
  return spawnSync('psql', [
    '-X', '-w', '-v', 'ON_ERROR_STOP=1', '-h', host, '-p', port,
    '-U', role, '-d', database, '-tAc', sql,
  ], { encoding: 'utf8', timeout: 10000 })
}

const content = 'hallelujah_content_local'
const appointment = 'hallelujah_appointment_local'
assert.equal(query(content, content, 'SELECT label FROM controlled_content_fixture').stdout.trim(),
  'synthetic-content')
assert.equal(query(appointment, appointment,
  'SELECT label FROM controlled_appointment_fixture').stdout.trim(), 'synthetic-appointment')

for (const [role, database] of [[content, appointment], [appointment, content]]) {
  const read = query(role, database, 'SELECT current_database()')
  assert.notEqual(read.status, 0, `${role} unexpectedly connected to ${database}`)
  assert.match(read.stderr, /permission denied for database/)
  const mutate = query(role, database, 'CREATE TABLE unauthorized_fixture (id integer)')
  assert.notEqual(mutate.status, 0, `${role} unexpectedly mutated ${database}`)
  assert.match(mutate.stderr, /permission denied for database/)
}

assert.equal(query(content, content, 'SHOW listen_addresses').stdout.trim(), '',
  'disposable PostgreSQL must not listen on a public network address')
process.stdout.write('Local PostgreSQL cross-role denial checks passed.\n')
