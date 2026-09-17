import { controlledDiscovery, discoveryDocuments, escapeXml, governedPath, serializeStructuredData } from './governed-discovery.ts'
import type { WorkflowDocument } from './cms-workflow.ts'

/** Native HTTP adapter for internal/loopback review. No application route is mounted. */
export function controlledDiscoveryResponse(
  documents: readonly WorkflowDocument[], origin: string, now: Date, pathname: string,
  mode?: 'controlled-fixture', method: string = 'GET',
): Response {
  const headers = { 'Cache-Control': 'private, no-store', 'X-Robots-Tag': 'noindex, nofollow, noarchive',
    'Content-Type': 'text/html; charset=utf-8', 'Referrer-Policy': 'no-referrer',
    'Content-Security-Policy': "default-src 'none'; base-uri 'none'; frame-ancestors 'none'" }
  const reply = (status: number, text: string, extra: Record<string, string> = {}) => new Response(
    method === 'HEAD' ? null : text, { status, headers: { ...headers, ...extra } })
  if (!['GET', 'HEAD'].includes(method)) return reply(405, 'Method unavailable.', { Allow: 'GET, HEAD' })
  if (mode !== 'controlled-fixture') return reply(404, 'Content unavailable.')
  const snapshot = controlledDiscovery(documents, origin, now, mode)
  if (snapshot.state !== 'controlled-fixture') return reply(503, 'Content temporarily unavailable.', { 'Retry-After': '60' })
  if (pathname === '/robots.txt') return reply(200, snapshot.robots, { 'Content-Type': 'text/plain; charset=utf-8' })
  if (pathname === '/sitemap.xml') return reply(200, snapshot.sitemap, { 'Content-Type': 'application/xml; charset=utf-8' })
  // No query, fragment, encoded alias or personal state can enter the redirect target.
  if (!/^\/(?:[a-z0-9-]+\/)*[a-z0-9-]*\/?$/.test(pathname) || pathname.startsWith('//')) return reply(404, 'Content unavailable.')
  const path = pathname.endsWith('/') ? pathname : `${pathname}/`
  const entry = snapshot.entries.find((candidate) => candidate.path === path)
  if (entry) {
    if (path !== pathname) return reply(308, '', { Location: path })
    const alternates = Object.entries(entry.alternates).map(([locale, url]) =>
      `<link rel="alternate" hreflang="${locale}" href="${escapeXml(url)}">`).join('')
    const html = `<!doctype html><html lang="${entry.locale}"><head><meta charset="utf-8"><title>${escapeXml(entry.title)}</title><meta name="robots" content="noindex,nofollow,noarchive"><link rel="canonical" href="${escapeXml(entry.url)}">${alternates}<script type="application/ld+json">${serializeStructuredData(entry.structuredData)}</script></head><body><main><p lang="en">Synthetic discovery fixture — no hospital facts or publication authority.</p>${entry.locale === 'am' ? '<p lang="en">Unreviewed Amharic shaping fixture.</p>' : ''}<h1>${escapeXml(entry.title)}</h1></main></body></html>`
    return reply(200, html)
  }
  const checked = discoveryDocuments(documents)!
  const locale = path.startsWith('/am/') ? 'am' : 'en'
  const doc = checked.find((candidate) => candidate.record.synthetic && governedPath(candidate.record, locale) === path)
  if (!doc) return reply(404, 'Content unavailable.')
  const record = doc.record
  const previouslyPublished = record.audit.some((audit) => audit.change === 'publish')
  if (!previouslyPublished && record.status !== 'published') return reply(404, 'Content unavailable.')
  const retired = ['expired', 'withdrawn'].includes(record.status)
    || previouslyPublished && !!record.expiresAt && Date.parse(record.expiresAt) <= now.getTime()
  if (retired) {
    const successor = snapshot.entries.find((candidate) => candidate.publicId === record.withdrawal?.successorPublicId && candidate.locale === locale)
    const successorRecord = checked.find((candidate) => candidate.record.publicId === successor?.publicId)?.record
    if (successor && successorRecord?.kind === record.kind && successor.path !== path) return reply(308, '', { Location: successor.path })
    return reply(410, 'Content has been removed.')
  }
  if (record.status !== 'published' || record.publishAt && Date.parse(record.publishAt) > now.getTime()) return reply(404, 'Content unavailable.')
  return reply(503, 'Content temporarily unavailable.', { 'Retry-After': '60' })
}
