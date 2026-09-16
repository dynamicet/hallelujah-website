import { createElement } from 'react'
import { serviceReadiness, serviceSections, type ServiceSection } from './service.ts'
import { validateGovernedRecord, validateRecordSet, type GovernedLocale, type GovernedRecord } from './governed-record.ts'

export type ServiceView = Readonly<{
  publicId: string; canonicalPath: string; locale: GovernedLocale; name: string
  synonyms: readonly string[]; group: Readonly<{ publicId: string; name: string }>
  sections: Partial<Record<ServiceSection, readonly string[]>>; locationPublicIds: readonly string[]
  reviewer: string; reviewedAt: string
  appointment: Readonly<{ state: 'withheld'; servicePublicId: string }>
}>
function checkedSet(inputs: readonly unknown[]): readonly GovernedRecord[] | null {
  const parsed = inputs.map(validateGovernedRecord)
  if (parsed.some((result) => !result.ok)) return null
  const records = parsed.flatMap((result) => result.ok ? [result.record] : [])
  return validateRecordSet(records).length ? null : records
}
function effective(record: GovernedRecord, now: Date): boolean {
  return record.synthetic && record.status === 'published' && !!record.publishAt
    && Date.parse(record.publishAt) <= now.getTime() && !!record.reviewAt
    && Date.parse(record.reviewAt) > now.getTime() && !!record.expiresAt && Date.parse(record.expiresAt) > now.getTime()
}

/** Synthetic-only, single source of internal directory, selector and search vocabulary candidates. */
export function controlledServiceIndex(
  inputs: readonly unknown[], locale: GovernedLocale, now: Date, mode?: 'controlled-fixture',
): readonly ServiceView[] {
  if (mode !== 'controlled-fixture' || !['en', 'am'].includes(locale) || !Number.isFinite(now.getTime())) return []
  const records = checkedSet(inputs)
  if (!records) return []
  return records.flatMap((record) => {
    const service = record.service
    const details = service?.localized[locale]
    const entry = record.localized[locale]
    const group = service?.group.localized[locale]
    if (record.kind !== 'service' || !service || !details || !entry || !group
      || !effective(record, now) || serviceReadiness(service, now).length) return []
    if (service.locationPublicIds.some((id) => {
      const location = records.find((peer) => peer.publicId === id)
      return !location || location.kind !== 'location' || !effective(location, now)
    })) return []
    const sections: Partial<Record<ServiceSection, readonly string[]>> = {}
    for (const section of serviceSections) {
      const texts = service.claims.filter((claim) => claim.section === section && claim.state === 'approved')
        .flatMap((claim) => claim.localized[locale] ? [claim.localized[locale]!] : [])
      if (texts.length) sections[section] = texts
    }
    // A language without a reviewed scope cannot create an empty service candidate.
    if (!sections.scope) return []
    const scope = service.claims.find((claim) => claim.section === 'scope' && claim.state === 'approved')!
    return [{ publicId: record.publicId, canonicalPath: `${locale === 'am' ? '/am' : ''}/services/${entry.slug}/`,
      locale, name: details.name, synonyms: details.synonyms, group: { publicId: service.group.publicId, name: group },
      sections, locationPublicIds: service.locationPublicIds, reviewer: scope.evidence!.reviewer!,
      reviewedAt: scope.evidence!.reviewedAt!, appointment: { state: 'withheld' as const, servicePublicId: record.publicId } }]
  })
}
export function controlledServiceTaxonomy(
  inputs: readonly unknown[], locale: GovernedLocale, now: Date, mode?: 'controlled-fixture',
): readonly Readonly<{ publicId: string; name: string; services: readonly Readonly<{ publicId: string; name: string; vocabulary: readonly string[] }>[] }>[] {
  const groups = new Map<string, { publicId: string; name: string; services: { publicId: string; name: string; vocabulary: readonly string[] }[] }>()
  for (const view of controlledServiceIndex(inputs, locale, now, mode)) {
    const group = groups.get(view.group.publicId) ?? { ...view.group, services: [] }
    group.services.push({ publicId: view.publicId, name: view.name, vocabulary: [view.name, ...view.synonyms] })
    groups.set(group.publicId, group)
  }
  return [...groups.values()]
}
/** Internal lifecycle outcome only; no route, HTTP status, provider or redirect is mounted. */
export function controlledServiceResolution(
  inputs: readonly unknown[], publicId: string, locale: GovernedLocale, now: Date, mode?: 'controlled-fixture',
): Readonly<{ state: 'unavailable' | 'gone' | 'service' | 'redirect'; canonicalPath: string | null }> {
  const unavailable = { state: 'unavailable' as const, canonicalPath: null }
  if (mode !== 'controlled-fixture' || !['en', 'am'].includes(locale) || !Number.isFinite(now.getTime())) return unavailable
  const records = checkedSet(inputs)
  const record = records?.find((entry) => entry.publicId === publicId && entry.kind === 'service' && entry.synthetic)
  if (!records || !record) return unavailable
  const index = controlledServiceIndex(records, locale, now, mode)
  const service = index.find((view) => view.publicId === publicId)
  if (service) return { state: 'service', canonicalPath: service.canonicalPath }
  if (['expired', 'withdrawn'].includes(record.status)) {
    const successor = index.find((view) => view.publicId === record.withdrawal?.successorPublicId)
    return successor ? { state: 'redirect', canonicalPath: successor.canonicalPath } : { state: 'gone', canonicalPath: null }
  }
  return unavailable
}
export function ControlledServiceDetails(props: Readonly<{
  records: readonly unknown[]; publicId: string; locale: GovernedLocale; now: Date; mode?: 'controlled-fixture'
}>) {
  const view = controlledServiceIndex(props.records, props.locale, props.now, props.mode)
    .find((entry) => entry.publicId === props.publicId)
  if (!view) return createElement('p', { lang: 'en' }, 'Service details are withheld pending approval.')
  return createElement('section', { lang: props.locale, 'data-service-state': 'controlled-fixture' },
    createElement('p', { lang: 'en' }, 'Synthetic service fixture — no real care or availability is represented.'),
    props.locale === 'am' ? createElement('p', { lang: 'en' }, 'Unreviewed Amharic shaping fixture.') : null,
    createElement('h2', null, view.name),
    ...serviceSections.flatMap((section) => (view.sections[section] ?? [])
      .map((text, index) => createElement('p', { key: `${section}-${index}`, 'data-service-section': section }, text))),
    createElement('p', { lang: 'en' }, 'Appointment actions, authentic locations and hours are withheld.'))
}
