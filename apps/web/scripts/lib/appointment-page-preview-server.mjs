import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { gzipSync } from 'node:zlib'

import { appointmentPageFixture, appointmentPageFixtureStates } from './appointment-page-fixture.mjs'
import { appointmentPageStyles, renderAppointmentPage } from './appointment-page-renderer.mjs'

const appRoot = new URL('../../', import.meta.url)
const shellScript = new URL('public/shell-navigation.js', appRoot)
const appointmentScript = new URL('scripts/fixtures/appointment-preview.js', appRoot)

export function appointmentPagePreviewDocument(state = 'controlled') {
  const body = renderAppointmentPage(appointmentPageFixture(state))
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Appointment — controlled B03-017 preview</title><link rel="stylesheet" href="/appointment.css"></head><body data-appointment-preview-fixture="synthetic-inert-b03-017" data-appointment-preview-state="${state}">${body}<script data-appointment-preview-script src="/appointment-preview.js"></script></body></html>`
}

export async function createAppointmentPagePreviewServer({ port = 0 } = {}) {
  const requestLog = []
  const samples = {}
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
      if (url.pathname === '/appointment.css') return finish(200, 'text/css', appointmentPageStyles())
      if (url.pathname === '/shell-navigation.js') return finish(200, 'text/javascript', await readFile(shellScript))
      if (url.pathname === '/appointment-preview.js') return finish(200, 'text/javascript', await readFile(appointmentScript))
      const state = url.pathname === '/' ? 'controlled' : url.pathname.slice(1)
      if (!appointmentPageFixtureStates.includes(state)) return finish(404, 'text/plain', 'No preview route.')
      const html = appointmentPagePreviewDocument(state)
      const css = appointmentPageStyles()
      const shell = await readFile(shellScript)
      const appointment = await readFile(appointmentScript)
      samples[state] = {
        externalRequests: 0,
        initialGzipBytes: gzipSync(html).byteLength + gzipSync(css).byteLength
          + gzipSync(shell).byteLength + gzipSync(appointment).byteLength,
        initialRequests: 4,
        javascriptGzipBytes: gzipSync(shell).byteLength + gzipSync(appointment).byteLength,
        mediaBytes: 0,
      }
      return finish(200, 'text/html; charset=utf-8', html)
    } catch {
      return finish(500, 'text/plain', 'Controlled Appointment preview unavailable.')
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
