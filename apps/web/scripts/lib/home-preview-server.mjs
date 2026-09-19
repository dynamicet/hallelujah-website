import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { gzipSync } from 'node:zlib'
import { homeDestinationDescriptions, homeFixture, homeFixtureStates } from './home-fixture.mjs'
import { homeContactFixture, homeContactFixtureStates } from './home-contact-fixture.mjs'
import { homeGovernedFixture, homeGovernedFixtureStates } from './home-governed-fixture.mjs'
import { homeStyles, renderHome } from './home-renderer.mjs'

export function homePreviewDocument(state) {
  const contacts = homeContactFixtureStates.includes(state)
  const governed = homeGovernedFixtureStates.includes(state)
  const destinations = Object.entries(homeDestinationDescriptions)
    .filter(([id]) => !(contacts || governed) || !['emergency', 'call', 'directions'].includes(id))
    .map(([id, [heading, description]]) =>
    `<section class="ds-flow ds-section" id="home-${id}" tabindex="-1" data-experience-level="0" data-protected-context="unavailable-expired"><h2>${heading}</h2><p>${description}</p><a class="ds-touch-target" href="#main-content">Return to Home tasks</a></section>`).join('')
  const body = renderHome(governed ? homeGovernedFixture(state)
    : contacts ? homeContactFixture(state) : homeFixture(state)).replace('</main>',
    `<aside class="ds-container" aria-label="Controlled destination review" data-home-destinations>${destinations}<section class="ds-section" id="home-transcript"><h2>Abstract test film transcript</h2><p>A finite abstract animation. No people, hospital, speech or unique care information appears.</p></section></aside></main>`)
  const ticket = governed ? 'B03-006 governed omissions' : contacts ? 'B03-005 contacts' : 'B03-004 hierarchy'
  const fixture = governed ? 'synthetic-home-governed-omissions-fixture'
    : contacts ? 'synthetic-home-canonical-contacts-fixture' : 'synthetic-home-hierarchy-fixture'
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Home — controlled ${ticket} preview</title><link rel="stylesheet" href="/home.css"></head><body data-home-preview-fixture="${fixture}">${body}</body></html>`
}

export async function createHomePreviewServer({ port = 0 } = {}) {
  const requestLog = []
  const samples = {}
  const assets = new Map([
    ['/shell-navigation.js', ['text/javascript', new URL('../../public/shell-navigation.js', import.meta.url)]],
    ['/motion-media.js', ['text/javascript', new URL('../../public/motion-media.js', import.meta.url)]],
    ['/fixtures/b01-012-abstract-motion.webm', ['video/webm', new URL('../../public/fixtures/b01-012-abstract-motion.webm', import.meta.url)]],
    ['/fixtures/b01-012-abstract-motion.vtt', ['text/vtt', new URL('../../public/fixtures/b01-012-abstract-motion.vtt', import.meta.url)]],
  ])
  const server = createServer(async (request, response) => {
    const finish = (status, type, body) => {
      response.writeHead(status, {
        'Content-Type': type, 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow, noarchive',
        'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'no-referrer',
        'Content-Security-Policy': "default-src 'none'; script-src 'self'; style-src 'self'; media-src 'self'; img-src 'self'; connect-src 'none'; form-action 'none'; base-uri 'none'; frame-ancestors 'none'",
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
      if (url.pathname === '/home.css') return finish(200, 'text/css', homeStyles())
      if (assets.has(url.pathname)) {
        const [type, source] = assets.get(url.pathname)
        return finish(200, type, await readFile(source))
      }
      const state = url.pathname === '/' ? 'static' : url.pathname.slice(1)
      if (![...homeFixtureStates, ...homeContactFixtureStates, ...homeGovernedFixtureStates].includes(state)) return finish(404, 'text/plain', 'No preview route.')
      const html = homePreviewDocument(state)
      const initialAssets = ['/home.css', '/shell-navigation.js', '/motion-media.js']
      let initialBytes = gzipSync(html).byteLength
      let javascriptBytes = 0
      for (const asset of initialAssets) {
        const body = asset === '/home.css' ? homeStyles() : await readFile(assets.get(asset)[1])
        const bytes = gzipSync(body).byteLength
        initialBytes += bytes
        if (asset.endsWith('.js')) javascriptBytes += bytes
      }
      samples[state] = { initialGzipBytes: initialBytes, javascriptGzipBytes: javascriptBytes,
        initialRequests: 4, initialMediaBytes: 0, posterAssetBytes: 0, externalRuntimeBytes: 0 }
      return finish(200, 'text/html; charset=utf-8', html)
    } catch {
      return finish(500, 'text/plain', 'Controlled Home preview unavailable.')
    }
  })
  await new Promise((resolve, reject) => {
    server.once('error', reject)
    server.listen(port, '127.0.0.1', resolve)
  })
  return { origin: `http://127.0.0.1:${server.address().port}`, requestLog, samples,
    close: () => new Promise((resolve) => { server.close(resolve); server.closeAllConnections() }) }
}
