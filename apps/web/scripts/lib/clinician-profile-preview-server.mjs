import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { gzipSync } from 'node:zlib'

import { clinicianProfileFixture, clinicianProfileFixtureStates } from './clinician-profile-fixture.mjs'
import { clinicianProfileStyles, renderClinicianProfile, resolveClinicianProfile } from './clinician-profile-renderer.mjs'

const appRoot = new URL('../../', import.meta.url)
const shellScript = new URL('public/shell-navigation.js', appRoot)

function routeState(pathname) {
  const candidate = pathname === '/' ? 'controlled' : pathname.slice(1)
  return clinicianProfileFixtureStates.includes(candidate) ? candidate : null
}

function reviewState(state) {
  if (state === 'failure') return 'failure'
  if (state === 'gone') return 'gone'
  if (state === 'unapproved') return 'unavailable'
  if (state === 'appointment-unavailable') return 'appointment-unavailable'
  return 'ready'
}

export function clinicianProfilePreviewDocument(state = 'controlled') {
  const fixture = clinicianProfileFixture(state)
  const profile = resolveClinicianProfile(fixture)
  const body = renderClinicianProfile({ profile, state: reviewState(state) })
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Clinician profile — Hallelujah Hospital</title><link rel="stylesheet" href="/clinician-profile.css"></head><body data-clinician-profile-preview="synthetic-inert-b04-009" data-clinician-profile-preview-state="${state}">${body}<script defer src="/shell-navigation.js"></script></body></html>`
}

export async function createClinicianProfilePreviewServer({ port = 0 } = {}) {
  const requestLog = []
  const samples = {}
  const server = createServer(async (request, response) => {
    const finish = (status, type, body, extra = {}) => {
      response.writeHead(status, {
        'Content-Type': type,
        'Cache-Control': 'no-store',
        'X-Robots-Tag': 'noindex, nofollow, noarchive',
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'no-referrer',
        'Content-Security-Policy': "default-src 'none'; script-src 'self'; style-src 'self'; connect-src 'none'; form-action 'none'; base-uri 'none'; frame-ancestors 'none'",
        ...extra,
      })
      response.end(request.method === 'HEAD' ? undefined : body)
    }
    try {
      if (!/^127\.0\.0\.1:\d+$/u.test(request.headers.host ?? '')) return finish(403, 'text/plain', 'Loopback host required.')
      if (!['GET', 'HEAD'].includes(request.method)) return finish(405, 'text/plain', 'Read-only preview.')
      if (!request.url?.startsWith('/') || request.url.startsWith('//')) return finish(404, 'text/plain', 'No preview route.')
      const url = new URL(request.url, 'http://127.0.0.1')
      if ([...url.searchParams.keys()].length) return finish(400, 'text/plain', 'Queries are not accepted by this preview.')
      requestLog.push(url.pathname)
      if (url.pathname === '/clinician-profile.css') return finish(200, 'text/css', clinicianProfileStyles())
      if (url.pathname === '/shell-navigation.js') return finish(200, 'text/javascript', await readFile(shellScript))
      const state = routeState(url.pathname)
      if (!state) return finish(404, 'text/plain', 'No preview route.')
      const fixture = clinicianProfileFixture(state)
      const profile = resolveClinicianProfile(fixture)
      if (state === 'redirect') {
        if (profile.outcome !== 'redirect') return finish(500, 'text/plain', 'Controlled successor resolution failed.')
        return finish(302, 'text/plain', 'Controlled successor redirect.', { Location: '/' })
      }
      const html = clinicianProfilePreviewDocument(state)
      const css = clinicianProfileStyles()
      const shell = await readFile(shellScript)
      samples[state] = {
        externalRequests: 0,
        initialGzipBytes: gzipSync(html).byteLength + gzipSync(css).byteLength + gzipSync(shell).byteLength,
        initialRequests: 3,
        javascriptGzipBytes: gzipSync(shell).byteLength,
        mediaBytes: 0,
      }
      const status = state === 'failure' ? 503 : state === 'gone' ? 410 : state === 'unapproved' ? 404 : 200
      return finish(status, 'text/html; charset=utf-8', html)
    } catch {
      return finish(500, 'text/plain', 'Controlled clinician-profile preview unavailable.')
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
