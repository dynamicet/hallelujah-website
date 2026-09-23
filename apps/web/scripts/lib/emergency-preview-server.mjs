import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { gzipSync } from 'node:zlib'

import { emergencyFixture, emergencyFixtureStates } from './emergency-fixture.mjs'
import { emergencyStyles, renderEmergency } from './emergency-renderer.mjs'

const announcementScript = `(() => {
  const target = document.querySelector('[data-state-announcement="pending-injection"]')
  if (!target) return
  target.dataset.stateAnnouncement = 'injected'
  target.setAttribute('role', 'status')
  target.setAttribute('aria-live', 'polite')
  target.setAttribute('aria-atomic', 'true')
})()`

export function emergencyPreviewDocument(state = 'controlled') {
  const body = renderEmergency(emergencyFixture(state))
  const injectedState = state === 'call-handoff-unsupported-injected'
    ? '<script src="/emergency-state-announcement.js"></script>'
    : ''
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Emergency — controlled B03-009 preview</title><link rel="stylesheet" href="/emergency.css"></head><body data-emergency-preview-fixture="synthetic-inert-b03-009" data-emergency-preview-state="${state}">${body}${injectedState}</body></html>`
}

export async function createEmergencyPreviewServer({ port = 0 } = {}) {
  const requestLog = []
  const samples = {}
  const shellScript = new URL('../../public/shell-navigation.js', import.meta.url)
  const server = createServer(async (request, response) => {
    const finish = (status, type, body) => {
      response.writeHead(status, {
        'Content-Type': type,
        'Cache-Control': 'no-store',
        'X-Robots-Tag': 'noindex, nofollow, noarchive',
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'no-referrer',
        'Content-Security-Policy': "default-src 'none'; script-src 'self'; style-src 'self'; connect-src 'none'; form-action 'none'; base-uri 'none'; frame-ancestors 'none'",
      })
      response.end(request.method === 'HEAD' ? undefined : body)
    }
    try {
      if (!/^127\.0\.0\.1:\d+$/u.test(request.headers.host ?? '')) return finish(403, 'text/plain', 'Loopback host required.')
      if (!['GET', 'HEAD'].includes(request.method)) return finish(405, 'text/plain', 'Collection is disabled.')
      if (!request.url?.startsWith('/') || request.url.startsWith('//')) return finish(404, 'text/plain', 'No preview route.')
      const url = new URL(request.url, 'http://127.0.0.1')
      if (url.search) return finish(400, 'text/plain', 'Preview accepts no query state.')
      requestLog.push(url.pathname)
      if (url.pathname === '/emergency.css') return finish(200, 'text/css', emergencyStyles())
      if (url.pathname === '/shell-navigation.js') return finish(200, 'text/javascript', await readFile(shellScript))
      if (url.pathname === '/emergency-state-announcement.js') {
        return finish(200, 'text/javascript', announcementScript)
      }
      const state = url.pathname === '/' ? 'controlled' : url.pathname.slice(1)
      if (!emergencyFixtureStates.includes(state)) return finish(404, 'text/plain', 'No preview route.')
      const html = emergencyPreviewDocument(state)
      const css = emergencyStyles()
      const script = await readFile(shellScript)
      const injectedState = state === 'call-handoff-unsupported-injected'
      samples[state] = {
        initialGzipBytes: gzipSync(html).byteLength + gzipSync(css).byteLength
          + gzipSync(script).byteLength + (injectedState ? gzipSync(announcementScript).byteLength : 0),
        initialRequests: injectedState ? 4 : 3,
        javascriptGzipBytes: gzipSync(script).byteLength
          + (injectedState ? gzipSync(announcementScript).byteLength : 0),
        externalRequests: 0,
        mediaBytes: 0,
      }
      return finish(200, 'text/html; charset=utf-8', html)
    } catch {
      return finish(500, 'text/plain', 'Controlled Emergency preview unavailable.')
    }
  })
  await new Promise((resolve, reject) => {
    server.once('error', reject)
    server.listen(port, '127.0.0.1', resolve)
  })
  return {
    close: () => new Promise((resolve) => { server.close(resolve); server.closeAllConnections() }),
    origin: `http://127.0.0.1:${server.address().port}`,
    requestLog,
    samples,
  }
}
