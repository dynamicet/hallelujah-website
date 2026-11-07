import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { gzipSync } from 'node:zlib'

import { serviceDirectoryFixture, serviceDirectoryFixtureStates } from './service-directory-fixture.mjs'
import { serviceDirectoryStyles, renderServiceDirectory, resolveServiceDirectory } from './service-directory-renderer.mjs'

const appRoot = new URL('../../', import.meta.url)
const shellScript = new URL('public/shell-navigation.js', appRoot)
const searchControlsScript = new URL('public/search-controls.js', appRoot)
const allowedKeys = new Set(['group', 'page', 'q'])

function routeState(pathname) {
  const candidate = pathname === '/' ? 'controlled' : pathname.slice(1)
  return serviceDirectoryFixtureStates.includes(candidate) ? candidate : null
}

export function serviceDirectoryPreviewDocument(state = 'controlled', searchParameters = new URLSearchParams()) {
  const fixture = serviceDirectoryFixture(state)
  const directory = resolveServiceDirectory(fixture, searchParameters)
  const viewState = ['loading', 'failure', 'offline', 'empty'].includes(state) ? state : 'ready'
  const pathname = state === 'controlled' ? '/' : `/${state}`
  const body = renderServiceDirectory({ directory, pathname, state: viewState })
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Service directory — Hallelujah Hospital</title><link rel="stylesheet" href="/service-directory.css"><script defer src="/search-controls.js"></script></head><body data-service-directory-preview="synthetic-inert-b04-011" data-service-directory-preview-state="${state}">${body}<script defer src="/shell-navigation.js"></script></body></html>`
}

export async function createServiceDirectoryPreviewServer({ port = 0 } = {}) {
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
      if (url.pathname === '/service-directory.css') return finish(200, 'text/css', serviceDirectoryStyles())
      if (url.pathname === '/shell-navigation.js') return finish(200, 'text/javascript', await readFile(shellScript))
      if (url.pathname === '/search-controls.js') {
        return finish(200, 'text/javascript', await readFile(searchControlsScript))
      }
      const state = routeState(url.pathname)
      if (!state) return finish(404, 'text/plain', 'No preview route.')
      const html = serviceDirectoryPreviewDocument(state, url.searchParams)
      const css = serviceDirectoryStyles()
      const shell = await readFile(shellScript)
      const searchControls = await readFile(searchControlsScript)
      samples[state] = {
        externalRequests: 0,
        initialGzipBytes: gzipSync(html).byteLength + gzipSync(css).byteLength
          + gzipSync(shell).byteLength + gzipSync(searchControls).byteLength,
        initialRequests: 4,
        javascriptGzipBytes: gzipSync(shell).byteLength + gzipSync(searchControls).byteLength,
        mediaBytes: 0,
      }
      return finish(200, 'text/html; charset=utf-8', html)
    } catch {
      return finish(500, 'text/plain', 'Controlled service-directory preview unavailable.')
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
