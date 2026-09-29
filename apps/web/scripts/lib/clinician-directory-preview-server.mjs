import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { gzipSync } from 'node:zlib'

import { clinicianDirectoryFixture, clinicianDirectoryFixtureStates } from './clinician-directory-fixture.mjs'
import { clinicianDirectoryStyles, renderClinicianDirectory, resolveClinicianDirectory } from './clinician-directory-renderer.mjs'

const appRoot = new URL('../../', import.meta.url)
const shellScript = new URL('public/shell-navigation.js', appRoot)
const allowedKeys = new Set(['page', 'q', 'type'])

function routeState(pathname) {
  const candidate = pathname === '/' ? 'controlled' : pathname.slice(1)
  return clinicianDirectoryFixtureStates.includes(candidate) ? candidate : null
}

export function clinicianDirectoryPreviewDocument(state = 'controlled', searchParameters = new URLSearchParams()) {
  const fixture = clinicianDirectoryFixture(state)
  const directory = resolveClinicianDirectory(fixture, searchParameters)
  const viewState = ['failure', 'offline', 'empty'].includes(state) ? state : 'ready'
  const pathname = state === 'controlled' ? '/' : `/${state}`
  const body = renderClinicianDirectory({ directory, pathname, state: viewState })
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Clinician directory — controlled B04-007 preview</title><link rel="stylesheet" href="/clinician-directory.css"></head><body data-clinician-directory-preview="synthetic-inert-b04-007" data-clinician-directory-preview-state="${state}">${body}</body></html>`
}

export async function createClinicianDirectoryPreviewServer({ port = 0 } = {}) {
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
        'Content-Security-Policy': "default-src 'none'; script-src 'self'; style-src 'self'; connect-src 'none'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'",
        ...extra,
      })
      response.end(request.method === 'HEAD' ? undefined : body)
    }
    try {
      if (!/^127\.0\.0\.1:\d+$/u.test(request.headers.host ?? '')) return finish(403, 'text/plain', 'Loopback host required.')
      if (!['GET', 'HEAD'].includes(request.method)) return finish(405, 'text/plain', 'Read-only preview.')
      if (!request.url?.startsWith('/') || request.url.startsWith('//')) return finish(404, 'text/plain', 'No preview route.')
      const url = new URL(request.url, 'http://127.0.0.1')
      if ([...url.searchParams.keys()].some((key) => !allowedKeys.has(key))) {
        return finish(400, 'text/plain', 'Unsupported directory query key.')
      }
      requestLog.push(`${url.pathname}${url.search}`)
      if (url.pathname === '/clinician-directory.css') return finish(200, 'text/css', clinicianDirectoryStyles())
      if (url.pathname === '/shell-navigation.js') return finish(200, 'text/javascript', await readFile(shellScript))
      const state = routeState(url.pathname)
      if (!state) return finish(404, 'text/plain', 'No preview route.')
      const html = clinicianDirectoryPreviewDocument(state, url.searchParams)
      const css = clinicianDirectoryStyles()
      const shell = await readFile(shellScript)
      samples[state] = {
        externalRequests: 0,
        initialGzipBytes: gzipSync(html).byteLength + gzipSync(css).byteLength + gzipSync(shell).byteLength,
        initialRequests: 3,
        javascriptGzipBytes: gzipSync(shell).byteLength,
        mediaBytes: 0,
      }
      return finish(200, 'text/html; charset=utf-8', html)
    } catch {
      return finish(500, 'text/plain', 'Controlled clinician-directory preview unavailable.')
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
