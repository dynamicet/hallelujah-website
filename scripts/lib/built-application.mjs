import { spawn } from 'node:child_process'
import { randomBytes } from 'node:crypto'

import { repositoryRoot } from './repository-files.mjs'

export async function withBuiltApplication(callback) {
  const host = '127.0.0.1'
  const port = 22_000 + (randomBytes(2).readUInt16BE(0) % 20_000)
  const origin = `http://${host}:${port}`
  const usesProcessGroup = process.platform !== 'win32'
  const server = spawn(
    'pnpm',
    ['--dir', 'apps/web', 'start', '--hostname', host, '--port', String(port)],
    {
      cwd: repositoryRoot,
      detached: usesProcessGroup,
      env: {
        ...process.env,
        APP_ENVIRONMENT: 'local',
        EXTERNAL_SERVICES: 'disabled',
        LOCAL_DATABASE_URL: `postgresql://content_local:${randomBytes(18).toString('hex')}@127.0.0.1:5432/hallelujah_content_local`,
        LOCAL_PAYLOAD_SECRET: randomBytes(32).toString('base64url'),
        NEXT_TELEMETRY_DISABLED: '1',
        PERSONAL_DATA_COLLECTION: 'disabled',
      },
      stdio: ['ignore', 'pipe', 'pipe'],
    },
  )
  let output = ''
  server.stdout.on('data', (chunk) => { output += chunk.toString() })
  server.stderr.on('data', (chunk) => { output += chunk.toString() })

  try {
    await waitForServer(server, `${origin}/health`)
    return await callback(origin)
  } catch (error) {
    if (output.trim()) error.message += '; built application output was captured without values'
    throw error
  } finally {
    stopProcess(server, usesProcessGroup, 'SIGTERM')
    await Promise.race([
      new Promise((resolve) => server.once('exit', resolve)),
      pause(2000),
    ])
    stopProcess(server, usesProcessGroup, 'SIGKILL')
  }
}

async function waitForServer(server, healthUrl) {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    if (server.exitCode !== null) throw new Error('built application exited before becoming ready')
    try {
      const response = await fetch(healthUrl, { signal: AbortSignal.timeout(500) })
      if (response.ok) return
    } catch {
      // The bounded loopback process is still starting.
    }
    await pause(250)
  }
  throw new Error('built application did not become ready within 15 seconds')
}

function stopProcess(server, usesProcessGroup, signal) {
  try {
    if (usesProcessGroup && server.pid) process.kill(-server.pid, signal)
    else server.kill(signal)
  } catch (error) {
    if (error.code !== 'ESRCH') throw error
  }
}

function pause(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds))
}
