// Loopback-only component specimens; the application root remains the controlled Home page.
import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
// Reuse the local template/CSS loader and stylesheet registry; no application import is added.
import { homeStyles } from './home-renderer.mjs'

const { EssentialActionsFixtureTemplate } = await import('../../src/design-system/templates/index.ts')
const statuses = [
  { description: 'Disabled', term: 'Personal-data collection' },
  { description: 'Disabled', term: 'External providers' },
  { description: 'Not mounted', term: 'CMS routes and content models' },
]
const assets = new Map([
  ['/brand/hallelujah-emblem.png', ['image/png', new URL('../../public/brand/hallelujah-emblem.png', import.meta.url)]],
  ...['shell-navigation', 'global-shell', 'search-controls', 'form-primitives', 'motion-media', 'optional-map', 'logo-reveal']
    .map(name => [`/${name}.js`, ['text/javascript', new URL(`../../public/${name}.js`, import.meta.url)]]),
  ['/fixtures/b01-012-abstract-motion.webm', ['video/webm', new URL('../../public/fixtures/b01-012-abstract-motion.webm', import.meta.url)]],
  ['/fixtures/b01-012-abstract-motion.vtt', ['text/vtt', new URL('../../public/fixtures/b01-012-abstract-motion.vtt', import.meta.url)]],
])

export async function createFoundationsPreviewServer({ port = 0 } = {}) {
  const server = createServer(async (request, response) => {
    const finish = (status, type, body) => {
      response.writeHead(status, {
        'Content-Type': type, 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow, noarchive',
        'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'no-referrer',
        'Content-Security-Policy': "default-src 'none'; script-src 'self'; style-src 'self'; media-src 'self'; img-src 'self'; connect-src 'none'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'",
      })
      response.end(request.method === 'HEAD' ? undefined : body)
    }
    try {
      if (!/^127\.0\.0\.1:\d+$/u.test(request.headers.host ?? '')) return finish(403, 'text/plain', 'Loopback host required.')
      if (!['GET', 'HEAD'].includes(request.method)) return finish(405, 'text/plain', 'Collection is disabled.')
      if (!request.url?.startsWith('/') || request.url.startsWith('//')) return finish(404, 'text/plain', 'No preview route.')
      const url = new URL(request.url, 'http://127.0.0.1')
      if (url.pathname === '/health') return finish(200, 'application/json', '{"status":"ok"}')
      if (url.pathname === '/foundations.css') return finish(200, 'text/css', homeStyles())
      if (assets.has(url.pathname)) {
        const [type, source] = assets.get(url.pathname)
        return finish(200, type, await readFile(source))
      }
      if (url.pathname !== '/') return finish(404, 'text/plain', 'No preview route.')
      const searchParameters = Object.fromEntries([...new Set(url.searchParams.keys())]
        .map(key => [key, url.searchParams.getAll(key)]))
      const body = renderToStaticMarkup(createElement(EssentialActionsFixtureTemplate, { searchParameters, statuses }))
      return finish(200, 'text/html; charset=utf-8', `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Controlled component specimens</title><link rel="stylesheet" href="/foundations.css"></head><body>${body}</body></html>`)
    } catch {
      return finish(500, 'text/plain', 'Controlled component preview unavailable.')
    }
  })
  await new Promise((resolve, reject) => { server.once('error', reject); server.listen(port, '127.0.0.1', resolve) })
  return { origin: `http://127.0.0.1:${server.address().port}`,
    close: () => new Promise(resolve => { server.close(resolve); server.closeAllConnections() }) }
}
