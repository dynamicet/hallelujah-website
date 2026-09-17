import type { Metadata } from 'next'
import { canonical, contentClasses, requiredDomains, type WorkflowDocument } from './cms-workflow.ts'
import { validateGovernedRecord, validateRecordSet, type GovernedLocale, type GovernedRecord } from './governed-record.ts'
import { controlledClinicianIndex } from './clinician-view.ts'
import { controlledServiceIndex } from './service-view.ts'
import { controlledVisitorHub } from './visitor-topic-view.ts'
import { controlledInstitutionalView } from './institutional-block-view.ts'
import { controlledStatementView } from './utility-statement-view.ts'
import { clinicianReadiness } from './clinician.ts'
import { serviceReadiness } from './service.ts'
import { institutionalReadiness } from './institutional-block.ts'
import { visitorTopicReadiness } from './visitor-topic.ts'
import { statementReadiness } from './utility-statement.ts'
import { siteSettingsReadiness } from './site-settings.ts'

const pageSlugs = ['home', 'emergency', 'doctors', 'services', 'appointments', 'patient-information', 'contact', 'about'] as const
export type DiscoveryEntry = Readonly<{
  publicId: string; locale: GovernedLocale; path: string; url: string; title: string
  alternates: Partial<Record<GovernedLocale, string>>; lastModified: string
  metadata: Metadata; structuredData: Readonly<Record<string, string>>
}>
export type DiscoverySnapshot = Readonly<{
  state: 'withheld' | 'controlled-fixture'; entries: readonly DiscoveryEntry[]
  sitemap: string; robots: string; validUntil: number
}>
const xmlStart = '<?xml version="1.0" encoding="UTF-8"?>'
const sitemapNamespace = 'http://www.sitemaps.org/schemas/sitemap/0.9'
const alternateNamespace = 'http://www.w3.org/1999/xhtml'
const schemaContext = 'https://schema.org'
const robots = 'User-agent: *\nDisallow: /\n'
const emptySitemap = `${xmlStart}<urlset xmlns="${sitemapNamespace}"/>`
const empty = (): DiscoverySnapshot => ({ state: 'withheld', entries: [], sitemap: emptySitemap, robots, validUntil: 0 })

/** Fixture URLs have no production-origin authority and never make network requests. */
export function controlledOrigin(input: string): string | null {
  try {
    const url = new URL(input)
    return ['http:', 'https:'].includes(url.protocol) && ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)
      && !url.username && !url.password && url.pathname === '/' && !url.search && !url.hash
      ? url.origin : null
  } catch { return null }
}

/** Block/topic/settings records supply their hub; they never acquire independent URLs. */
export function governedPath(record: GovernedRecord, locale: GovernedLocale): string | null {
  const entry = record.localized[locale]
  if (!entry) return null
  const prefix = locale === 'am' ? '/am' : ''
  if (record.kind === 'doctor') return `${prefix}/doctors/${entry.slug}/`
  if (record.kind === 'service') return `${prefix}/services/${entry.slug}/`
  if (record.kind === 'utility-statement' && record.utilityStatement) return `${prefix}/${record.utilityStatement.type}/`
  // Static page identity is the English inventory slug, independent of translated labels.
  const slug = record.localized.en?.slug
  return record.kind === 'page' && pageSlugs.includes(slug as typeof pageSlugs[number])
    ? `${prefix}/${slug === 'home' ? '' : `${slug}/`}` : null
}

function current(doc: WorkflowDocument, now: Date): boolean {
  const { record, workflow } = doc
  return Boolean(record.synthetic && record.status === 'published' && record.owner === workflow.author
    && /^cms:[1-9]\d*$/.test(workflow.author) && contentClasses.includes(workflow.contentClass)
    && (record.kind !== 'site-settings' || workflow.contentClass === 'contact')
    && (!record.utilityStatement || workflow.contentClass === (record.utilityStatement.type === 'privacy' ? 'privacy' : 'general'))
    && (record.kind !== 'page' || !['contact', 'emergency'].includes(record.localized.en!.slug)
      || workflow.contentClass === record.localized.en!.slug)
    && record.approval && record.reviewer === record.approval.actor && record.approval.actor !== workflow.author
    && /^cms:[1-9]\d*$/.test(record.approval.actor) && Number.isSafeInteger(workflow.revision) && workflow.revision > 0
    && record.publishAt && Date.parse(record.publishAt) <= now.getTime()
    && Date.parse(record.approval.at) <= now.getTime()
    && record.reviewAt && Date.parse(record.reviewAt) > now.getTime()
    && record.expiresAt && Date.parse(record.expiresAt) > now.getTime()
    && record.domainApproval && canonical(record.domainApproval) === canonical({
      ...workflow.reviews[record.domainApproval.domain as keyof typeof workflow.reviews], domain: record.domainApproval.domain,
    }) && requiredDomains(record, workflow.contentClass).every((domain) => {
      const review = workflow.reviews[domain]
      return review && /^cms:[1-9]\d*$/.test(review.actor) && review.actor !== workflow.author
        && review.reference.trim() && Date.parse(review.at) <= Date.parse(record.approval!.at)
    }) && (!['contact', 'emergency'].includes(workflow.contentClass)
      || workflow.verification && workflow.verification.actor !== workflow.author
        && /^cms:[1-9]\d*$/.test(workflow.verification.actor) && workflow.verification.reference.trim()
        && workflow.reviews.operations?.actor !== record.approval.actor
        && Date.parse(workflow.verification.at) <= now.getTime()
        && Date.parse(workflow.verification.at) >= Date.parse([...record.audit].reverse().find((audit) => audit.change === 'publish')?.at ?? '')))
}

export function discoveryDocuments(inputs: readonly WorkflowDocument[]): readonly WorkflowDocument[] | null {
  try {
    const parsed = inputs.map((doc) => validateGovernedRecord(doc.record))
    if (parsed.some((item) => !item.ok)) return null
    const documents = inputs.map((doc, index) => ({ record: parsed[index].ok ? parsed[index].record : doc.record, workflow: doc.workflow }))
    return validateRecordSet(documents.map((doc) => doc.record)).length ? null : documents
  } catch { return null }
}

export function escapeXml(input: string): string {
  return input.replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[character]!)
}
export function serializeStructuredData(input: Readonly<Record<string, string>>): string {
  return JSON.stringify(input).replace(/</g, '\\u003c').replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029')
}

/** One synthetic projection, always noindex, for every internal discovery surface. */
export function controlledDiscovery(
  inputs: readonly WorkflowDocument[], inputOrigin: string, now: Date, mode?: 'controlled-fixture',
): DiscoverySnapshot {
  const origin = controlledOrigin(inputOrigin)
  if (mode !== 'controlled-fixture' || !origin || !Number.isFinite(now.getTime())) return empty()
  const documents = discoveryDocuments(inputs)
  if (!documents) return empty()
  try {
    const records = documents.map((doc) => doc.record)
    const usable = new Map<string, boolean>()
    const checking = new Set<string>()
    function eligible(id: string): boolean {
      if (usable.has(id)) return usable.get(id)!
      // Bidirectional care associations may form cycles; every member is checked independently.
      if (checking.has(id)) return true
      const doc = documents!.find((item) => item.record.publicId === id)
      if (!doc || !current(doc, now)) { usable.set(id, false); return false }
      checking.add(id)
      const dependencies = [...doc.record.relationships, ...(doc.record.clinician?.locationPublicIds ?? []),
        ...(doc.record.service?.locationPublicIds ?? [])]
      const record = doc.record
      const ready = (!record.siteSettings || !siteSettingsReadiness(record.siteSettings, now).length)
        && (!record.clinician || !clinicianReadiness(record.clinician, now).length)
        && (!record.service || !serviceReadiness(record.service, now).length)
        && (!record.visitorTopic || !visitorTopicReadiness(record.visitorTopic).length)
        && (!record.institutionalBlock || !institutionalReadiness(record.institutionalBlock, now).length)
        && (!record.utilityStatement || !statementReadiness(record.utilityStatement, now, true).length)
      const result = ready && dependencies.every(eligible)
      checking.delete(id)
      usable.set(id, result)
      return result
    }
    // Repeat after graph traversal so a rejected cycle member cannot leave its peer eligible.
    for (const record of records) eligible(record.publicId)
    let changed = true
    while (changed) {
      changed = false
      for (const record of records) {
        const ids = [...record.relationships, ...(record.clinician?.locationPublicIds ?? []), ...(record.service?.locationPublicIds ?? [])]
        if (usable.get(record.publicId) && ids.some((id) => !usable.get(id))) { usable.set(record.publicId, false); changed = true }
      }
    }
    const entries: DiscoveryEntry[] = []
    for (const locale of ['en', 'am'] as const) {
      const doctors = controlledClinicianIndex(records, locale, now, mode)
      const services = controlledServiceIndex(records, locale, now, mode)
      const topics = controlledVisitorHub(documents, locale, now, mode).groups.flatMap((group) => group.topics)
      const blocks = controlledInstitutionalView(documents, locale, now, mode).blocks
      for (const doc of documents) {
        const record = doc.record
        const path = governedPath(record, locale)
        if (!path || !usable.get(record.publicId)) continue
        if (record.kind === 'doctor' && !doctors.some((item) => item.publicId === record.publicId)) continue
        if (record.kind === 'service' && !services.some((item) => item.publicId === record.publicId)) continue
        if (record.utilityStatement && controlledStatementView(documents, record.utilityStatement.type, locale, now, mode).publicId !== record.publicId) continue
        const page = record.kind === 'page' ? record.localized.en!.slug : null
        if (page === 'patient-information' && !topics.some((topic) => usable.get(topic.publicId))) continue
        if (page === 'about' && !blocks.some((block) => usable.get(block.publicId))) continue
        if (page && ['emergency', 'contact'].includes(page) && !records.some((peer) => peer.kind === 'site-settings' && usable.get(peer.publicId))) continue
        // An appointment page cannot imply collection authority in controlled development.
        if (page === 'appointments') continue
        const title = record.localized[locale]!.title
        const url = origin + path
        entries.push({ publicId: record.publicId, locale, path, url, title, alternates: {},
          lastModified: record.audit.at(-1)!.at,
          metadata: { title, description: 'Synthetic discovery fixture. Not approved for publication.',
            robots: { index: false, follow: false, noarchive: true }, alternates: { canonical: url } },
          structuredData: { '@context': schemaContext, '@type': 'WebPage', '@id': url, url, name: title, inLanguage: locale } })
      }
    }
    if (new Set(entries.map((entry) => entry.path)).size !== entries.length) return empty()
    const paired = entries.map((entry) => {
      const alternates = Object.fromEntries(entries.filter((peer) => peer.publicId === entry.publicId)
        .map((peer) => [peer.locale, peer.url])) as DiscoveryEntry['alternates']
      return { ...entry, alternates, metadata: { ...entry.metadata, alternates: { canonical: entry.url, languages: alternates } } }
    }).sort((a, b) => a.path.localeCompare(b.path))
    // A candidate may appear or disappear without a CMS write. Recompute at every temporal boundary.
    const boundaries: number[] = []
    function instants(value: unknown) {
      if (typeof value === 'string' && /^\d{4}-\d\d-\d\dT/.test(value) && Date.parse(value) > now.getTime()) boundaries.push(Date.parse(value))
      else if (value && typeof value === 'object') for (const child of Object.values(value)) instants(child)
    }
    instants(documents)
    const sitemap = `${xmlStart}<urlset xmlns="${sitemapNamespace}" xmlns:xhtml="${alternateNamespace}">${paired.map((entry) =>
      `<url><loc>${escapeXml(entry.url)}</loc><lastmod>${escapeXml(entry.lastModified)}</lastmod>${Object.entries(entry.alternates).map(([locale, url]) =>
        `<xhtml:link rel="alternate" hreflang="${locale}" href="${escapeXml(url)}"/>`).join('')}</url>`).join('')}</urlset>`
    return { state: 'controlled-fixture', entries: paired, sitemap, robots,
      validUntil: boundaries.length ? Math.min(...boundaries) : Number.POSITIVE_INFINITY }
  } catch { return empty() }
}

export function discoveryLanguageTarget(snapshot: DiscoverySnapshot, publicId: string, locale: GovernedLocale): string | null {
  return snapshot.entries.find((entry) => entry.publicId === publicId && entry.locale === locale)?.path ?? null
}
