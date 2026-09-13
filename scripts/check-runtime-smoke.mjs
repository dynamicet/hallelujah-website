import { spawn } from 'node:child_process'
import { randomBytes } from 'node:crypto'

import { repositoryRoot } from './lib/repository-files.mjs'

const host = '127.0.0.1'
const port = 3211
const origin = `http://${host}:${port}`
const environment = {
  ...process.env,
  APP_ENVIRONMENT: 'local',
  EXTERNAL_SERVICES: 'disabled',
  LOCAL_DATABASE_URL: `postgresql://content_local:${randomBytes(18).toString('hex')}@127.0.0.1:5432/hallelujah_content_local`,
  LOCAL_PAYLOAD_SECRET: randomBytes(32).toString('base64url'),
  NEXT_TELEMETRY_DISABLED: '1',
  PERSONAL_DATA_COLLECTION: 'disabled',
}
const usesProcessGroup = process.platform !== 'win32'
const server = spawn(
  'pnpm',
  ['--dir', 'apps/web', 'start', '--hostname', host, '--port', String(port)],
  {
    cwd: repositoryRoot,
    detached: usesProcessGroup,
    env: environment,
    stdio: ['ignore', 'pipe', 'pipe'],
  },
)
let output = ''
server.stdout.on('data', (chunk) => { output += chunk.toString() })
server.stderr.on('data', (chunk) => { output += chunk.toString() })

async function waitForServer() {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    if (server.exitCode !== null) throw new Error('server exited before becoming ready')
    try {
      const response = await fetch(`${origin}/health`, { signal: AbortSignal.timeout(500) })
      if (response.ok) return
    } catch {
      // The process is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 250))
  }
  throw new Error('server did not become ready within 15 seconds')
}

function expectHeader(response, name, expected) {
  const actual = response.headers.get(name)
  if (actual !== expected) throw new Error(`${name}: expected ${expected}, received ${actual ?? 'missing'}`)
}

function signalServer(signal) {
  try {
    if (usesProcessGroup && server.pid) process.kill(-server.pid, signal)
    else server.kill(signal)
  } catch (error) {
    if (error.code !== 'ESRCH') throw error
  }
}

async function expectServerStopped() {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    try {
      await fetch(`${origin}/health`, { signal: AbortSignal.timeout(100) })
    } catch {
      return
    }
    await new Promise((resolve) => setTimeout(resolve, 100))
  }
  throw new Error('runtime smoke left a loopback server listening after cleanup')
}

try {
  await waitForServer()
  const health = await fetch(`${origin}/health`)
  const payload = await health.json()
  if (health.status !== 200 || payload.scope !== 'local-bootstrap' || payload.status !== 'ok') {
    throw new Error('health endpoint returned an unexpected status or body')
  }

  const home = await fetch(origin)
  const body = await home.text()
  if (home.status !== 200 || !body.includes('<main id="main-content">')) {
    throw new Error('bootstrap page did not return its main content')
  }
  expectHeader(home, 'content-security-policy', "default-src 'self'; base-uri 'self'; form-action 'none'; frame-ancestors 'none'; object-src 'none'")
  expectHeader(home, 'referrer-policy', 'no-referrer')
  expectHeader(home, 'x-content-type-options', 'nosniff')
  if (home.headers.has('x-powered-by')) throw new Error('x-powered-by must remain disabled')

  console.log('Runtime smoke passed (loopback health, bootstrap HTML, and fail-closed security headers).')
} catch (error) {
  console.error(`Runtime smoke failed: ${error.message}`)
  if (output.trim()) console.error('Server output was captured without environment values.')
  process.exitCode = 1
} finally {
  signalServer('SIGTERM')
  await Promise.race([
    new Promise((resolve) => server.once('exit', resolve)),
    new Promise((resolve) => setTimeout(resolve, 2000)),
  ])
  signalServer('SIGKILL')
  await expectServerStopped()
}
