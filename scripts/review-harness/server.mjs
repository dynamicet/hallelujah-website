import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { gzipSync } from 'node:zlib'
import path from 'node:path'

import { repositoryRoot } from '../lib/repository-files.mjs'
import { reviewCapabilities, reviewGroups, reviewLanguages } from './manifest.mjs'
import { protectedExperienceContexts, resolveExperienceLevel } from '../../apps/web/src/design-system/contracts/experience.ts'

const shapingSample = 'እንኳን ደህና መጡ የሙከራ ንቅናቄ'
const reviewStyles = `
.review-harness { padding: var(--semantic-space-section-compact, 1.5rem); border-block-end: 2px solid currentColor; }
.review-harness nav ul { display: flex; flex-wrap: wrap; gap: 1rem; padding: 0; list-style: none; }
.review-harness a { display: inline-flex; align-items: center; min-block-size: 44px; overflow-wrap: anywhere; }
.review-harness td, .review-harness th { padding: .5rem; text-align: start; vertical-align: top; overflow-wrap: anywhere; }
.review-harness table { inline-size: 100%; table-layout: fixed; border-collapse: collapse; }
.review-harness details summary { min-block-size: 44px; cursor: pointer; }
.review-harness { overflow-wrap: anywhere; }
@media print { .review-harness nav { display: none; } }
`

export function prepareReviewDocument(source, language = 'en') {
  if (!reviewLanguages.includes(language)) throw new Error('unsupported review language')
  // The specimen is static SSR plus the existing first-party enhancements. Next hydration
  // would conflict with review-only stress text; neither Next scripts nor flight data ship here.
  let html = source.replace(/<script\b([^>]*)>[\s\S]*?<\/script>/giu, (script, attributes) => {
    const src = attributes.match(/\bsrc="([^"]+)"/u)?.[1]
    return src && !src.startsWith('/_next/') ? script : ''
  }).replace(/<link\b[^>]*\bhref="\/_next\/[^"\s]+\.js[^"\s]*"[^>]*>/giu, '')
  if (language === 'am') {
    html = addShapingText(html)
    html = html.replace(/href="(\/\?[^"<>]*)"/gu, (_, href) => `href="${href}&amp;review-language=am"`)
    html = html.replace(/(<form\b[^>]*data-search-controls-form[^>]*>)/u, '$1<input type="hidden" name="review-language" value="am"/>')
  }
  const links = reviewGroups.map(({ id, ticket }) => `<li><a href="#${id}">${ticket}</a></li>`).join('')
  const inventory = reviewGroups.map(({ ticket, components, states }) =>
    `<tr><th scope="row">${ticket}</th><td>${components.join(', ')}</td><td>${states.join(', ')}</td></tr>`).join('')
  const panel = `<aside class="review-harness ds-flow" aria-label="Component review harness" data-review-harness data-review-language="${language}">
<h2>B01-013 component review</h2>
<p>Controlled, visibly synthetic fixtures only. Amharic mode repeats unreviewed Ethiopic shaping text alongside English source meaning; it is not an approved translation. No real information, appointment, provider or publication is enabled.</p>
<nav aria-label="Review language"><ul><li><a href="/?review-language=en" ${language === 'en' ? 'aria-current="page"' : ''}>English fixture</a></li><li><a href="/?review-language=am" ${language === 'am' ? 'aria-current="page"' : ''}><span lang="am">አማርኛ</span> shaping and mixed-script stress</a></li></ul></nav>
<nav aria-label="Component specimens"><ul>${links}</ul></nav>
<details><summary>Component and state inventory</summary><table><caption>Controlled review coverage</caption><thead><tr><th scope="col">Ticket</th><th scope="col">Components</th><th scope="col">States</th></tr></thead><tbody>${inventory}</tbody></table></details>
<p>Capability checks: ${reviewCapabilities.join(', ')}. <a href="/review-report.json">Open byte and coverage report</a>.</p>
<details><summary>Protected motion contract</summary><p>Every context resolves a requested Level 3 to Level 0: ${protectedExperienceContexts.map((context) => `${context} (${resolveExperienceLevel('home-hero', 3, context)})`).join(', ')}. Unknown-outcome workflow behavior remains gated to its appointment ticket.</p></details>
</aside>`
  html = html.replace('</head>', '<link rel="stylesheet" href="/review-harness.css"/></head>')
  return html.replace(/<body([^>]*)>/u, `<body$1>${panel}`)
}

function addShapingText(html) {
  const stack = []
  const skip = new Set(['script', 'style', 'title', 'textarea', 'option', 'time', 'svg'])
  return html.split(/(<[^>]*>)/u).map((token) => {
    if (token.startsWith('<')) {
      const close = token.match(/^<\/([a-z][\w-]*)/iu)?.[1]?.toLowerCase()
      if (close) {
        const index = stack.lastIndexOf(close)
        if (index >= 0) stack.splice(index)
      } else {
        const open = token.match(/^<([a-z][\w-]*)/iu)?.[1]?.toLowerCase()
        if (open && !/\/>$/u.test(token) && !['meta', 'link', 'input', 'br', 'hr', 'img', 'source', 'track'].includes(open)) stack.push(open)
      }
      return token
    }
    if (!stack.includes('body') || stack.some((tag) => skip.has(tag)) || !token.trim()) return token
    return `<span lang="am" data-review-shaping>${shapingSample}</span> ${token}`
  }).join('')
}

export async function createReviewHarnessServer({ upstreamOrigin, port = 0 }) {
  const upstream = new URL(upstreamOrigin)
  if (upstream.hostname !== '127.0.0.1' || upstream.protocol !== 'http:') {
    throw new Error('review upstream must be HTTP loopback')
  }
  const assets = new Set(['/motion-media.js', '/optional-map.js', '/form-primitives.js', '/search-controls.js', '/global-shell.js', '/fixtures/b01-012-abstract-motion.webm', '/fixtures/b01-012-abstract-motion.vtt'])
  const samples = new Map()
  const server = createServer(async (request, response) => {
    const finish = (status, contentType, body) => {
      response.writeHead(status, {
        'Content-Type': contentType, 'Cache-Control': 'no-store',
        'X-Robots-Tag': 'noindex, nofollow, noarchive', 'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'no-referrer',
        'Content-Security-Policy': "default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self'; media-src 'self'; font-src 'self'; connect-src 'none'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'",
      })
      response.end(request.method === 'HEAD' ? undefined : body)
    }
    try {
      if (!['GET', 'HEAD'].includes(request.method)) return finish(405, 'text/plain', 'Review collection is disabled.')
      if (!/^127\.0\.0\.1:\d+$/u.test(request.headers.host ?? '')) return finish(403, 'text/plain', 'Loopback host required.')
      if (!request.url.startsWith('/') || request.url.startsWith('//')) return finish(404, 'text/plain', 'No review route.')
      const url = new URL(request.url, 'http://127.0.0.1')
      if (url.pathname === '/review-harness.css') return finish(200, 'text/css', reviewStyles)
      if (url.pathname === '/review-report.json') {
        const media = await readFile(path.join(repositoryRoot, 'apps/web/public/fixtures/b01-012-abstract-motion.webm'))
        const codec = media.includes(Buffer.from('V_VP9')) ? 'WebM/VP9'
          : media.includes(Buffer.from('V_VP8')) ? 'WebM/VP8' : 'WebM/unknown'
        const captions = await readFile(path.join(repositoryRoot, 'apps/web/public/fixtures/b01-012-abstract-motion.vtt'))
        const motion = await readFile(path.join(repositoryRoot, 'apps/web/public/motion-media.js'))
        return finish(200, 'application/json', JSON.stringify({
          ticket: 'B01-013', environment: 'local T0', groups: reviewGroups,
          capabilities: reviewCapabilities, languages: reviewLanguages,
          protectedContexts: protectedExperienceContexts.map((context) => ({ context, requestedLevel: 3, resolvedLevel: resolveExperienceLevel('home-hero', 3, context) })),
          samples: Object.fromEntries(samples),
          motionRuntime: { bytes: motion.byteLength, gzipBytes: gzipSync(motion).byteLength, externalRuntimeBytes: 0 },
          activatedMedia: { bytes: media.byteLength, codec, durationSeconds: 2, captions: 'WebVTT', captionBytes: captions.byteLength, posterAssetBytes: 0, poster: 'server-rendered written still', provider: 'none', initialVideoBytes: 0 },
        }, null, 2) + '\n')
      }
      if (url.pathname !== '/' && url.pathname !== '/health' && !assets.has(url.pathname)) {
        return finish(404, 'text/plain', 'No review route.')
      }
      const target = new URL(url.pathname, upstream)
      if (url.pathname === '/') {
        const allowed = new Set(['review-language', 'q', 'type', 'page'])
        for (const [key, value] of url.searchParams) {
          if (!allowed.has(key) || url.searchParams.getAll(key).length !== 1 || value.length > 80) {
            return finish(400, 'text/plain', 'Unsupported review state.')
          }
          if (key !== 'review-language') target.searchParams.set(key, value)
        }
      }
      const language = url.searchParams.get('review-language') ?? 'en'
      if (!reviewLanguages.includes(language)) return finish(400, 'text/plain', 'Unsupported review language.')
      const result = await fetch(target, { redirect: 'error', signal: AbortSignal.timeout(15_000) })
      const body = Buffer.from(await result.arrayBuffer())
      const type = result.headers.get('content-type') ?? 'application/octet-stream'
      if (url.pathname === '/' && result.ok) {
        const source = body.toString('utf8')
        for (const match of source.matchAll(/\b(?:href|src)="(\/[^"?#]+)(?:[^"\s]*)"/gu)) {
          if (match[1].startsWith('/_next/static/') && /\.(?:css|js)$/u.test(match[1])) assets.add(match[1])
          if (/^\/[\w-]+\.js$/u.test(match[1])) assets.add(match[1])
        }
        const html = prepareReviewDocument(source, language)
        const paths = [...new Set([...html.matchAll(/<(?:script|link)\b[^>]*\b(?:href|src)="(\/[^"?#]+)"/gu)].map((match) => match[1]))]
        let javascriptGzipBytes = 0
        let initialGzipBytes = gzipSync(html).byteLength
        for (const asset of paths) {
          const content = asset === '/review-harness.css' ? Buffer.from(reviewStyles)
            : Buffer.from(await (await fetch(new URL(asset, upstream), { redirect: 'error', signal: AbortSignal.timeout(15_000) })).arrayBuffer())
          const bytes = gzipSync(content).byteLength
          initialGzipBytes += bytes
          if (asset.endsWith('.js')) javascriptGzipBytes += bytes
        }
        if (!samples.has(language) || initialGzipBytes > samples.get(language).initialGzipBytes) {
          samples.set(language, { htmlGzipBytes: gzipSync(html).byteLength, javascriptGzipBytes, initialGzipBytes, initialRequests: paths.length + 1, externalOrigins: 0, basis: 'largest initial specimen observed for this language' })
        }
        return finish(200, 'text/html; charset=utf-8', html)
      }
      return finish(result.status, type, body)
    } catch {
      finish(502, 'text/plain', 'Local review specimen unavailable. No collection or provider was enabled.')
    }
  })
  await new Promise((resolve, reject) => {
    server.once('error', reject)
    server.listen(port, '127.0.0.1', resolve)
  })
  return {
    origin: `http://127.0.0.1:${server.address().port}`,
    close: () => new Promise((resolve) => { server.close(resolve); server.closeAllConnections() }),
  }
}
