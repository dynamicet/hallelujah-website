import { createElement } from 'react'
import { clinicianReadiness, type ClinicianDetails } from './clinician.ts'
import { validateGovernedRecord, validateRecordSet, type GovernedLocale, type GovernedRecord } from './governed-record.ts'

export type ClinicianView = Readonly<{
  publicId: string; canonicalPath: string; locale: GovernedLocale; details: ClinicianDetails
  locationPublicIds: readonly string[]; reviewAt: string
  portrait: null; schedule: null; appointment: Readonly<{ state: 'withheld'; doctorPublicId: string }>
}>

function current(record: GovernedRecord, now: Date): boolean {
  return record.kind === 'doctor' && record.synthetic && record.status === 'published'
    && !!record.clinician && !clinicianReadiness(record.clinician, now).length
    && !!record.publishAt && Date.parse(record.publishAt) <= now.getTime()
    && !!record.reviewAt && Date.parse(record.reviewAt) > now.getTime()
    && !!record.expiresAt && Date.parse(record.expiresAt) > now.getTime()
}

function checkedSet(inputs: readonly unknown[]): readonly GovernedRecord[] | null {
  const parsed = inputs.map(validateGovernedRecord)
  if (parsed.some((result) => !result.ok)) return null
  const records = parsed.flatMap((result) => result.ok ? [result.record] : [])
  return validateRecordSet(records).length ? null : records
}

/** A single projection supplies internal directory/search/sitemap candidates; default output is empty. */
export function controlledClinicianIndex(
  inputs: readonly unknown[], locale: GovernedLocale, now: Date, mode?: 'controlled-fixture',
): readonly ClinicianView[] {
  if (mode !== 'controlled-fixture' || !['en', 'am'].includes(locale) || !Number.isFinite(now.getTime())) return []
  const records = checkedSet(inputs)
  if (!records) return []
  return records.flatMap((record) => {
    const entry = record.localized[locale]
    const details = record.clinician?.localized[locale]
    if (!current(record, now) || !entry || !details) return []
    const locations = record.clinician!.locationPublicIds
    if (locations.some((id) => {
      const location = records.find((peer) => peer.publicId === id)
      return !location?.synthetic || location.status !== 'published' || !location.publishAt
        || Date.parse(location.publishAt) > now.getTime() || !location.reviewAt || Date.parse(location.reviewAt) <= now.getTime()
        || !location.expiresAt || Date.parse(location.expiresAt) <= now.getTime()
    })) return []
    return [{ publicId: record.publicId, canonicalPath: `${locale === 'am' ? '/am' : ''}/doctors/${entry.slug}/`,
      locale, details, locationPublicIds: locations, reviewAt: record.reviewAt!, portrait: null, schedule: null,
      appointment: { state: 'withheld' as const, doctorPublicId: record.publicId } }]
  })
}

/** Internal outcome contract only: does not mount routes or emit HTTP redirects. */
export function controlledClinicianResolution(
  inputs: readonly unknown[], publicId: string, locale: GovernedLocale, now: Date, mode?: 'controlled-fixture',
): Readonly<{ state: 'unavailable' | 'gone' | 'profile' | 'redirect'; canonicalPath: string | null }> {
  const unavailable = { state: 'unavailable' as const, canonicalPath: null }
  if (mode !== 'controlled-fixture' || !['en', 'am'].includes(locale) || !Number.isFinite(now.getTime())) return unavailable
  const records = checkedSet(inputs)
  const record = records?.find((entry) => entry.publicId === publicId && entry.kind === 'doctor' && entry.synthetic)
  if (!record || !records) return unavailable
  const index = controlledClinicianIndex(records, locale, now, mode)
  const profile = index.find((entry) => entry.publicId === publicId)
  if (profile) return { state: 'profile', canonicalPath: profile.canonicalPath }
  if (['expired', 'withdrawn'].includes(record.status)) {
    const successor = index.find((entry) => entry.publicId === record.withdrawal?.successorPublicId)
    return successor ? { state: 'redirect', canonicalPath: successor.canonicalPath } : { state: 'gone', canonicalPath: null }
  }
  return unavailable
}

/** Inert semantic specimen with optional omissions and escaped text, outside all application routes. */
export function ControlledClinicianDetails(props: Readonly<{
  records: readonly unknown[]; publicId: string; locale: GovernedLocale; now: Date; mode?: 'controlled-fixture'
}>) {
  const view = controlledClinicianIndex(props.records, props.locale, props.now, props.mode)
    .find((entry) => entry.publicId === props.publicId)
  if (!view) return createElement('p', { lang: 'en' }, 'Clinician details are withheld pending approval.')
  const details = view.details
  const optional = [details.professionalTitle, ...details.credentials, ...details.interests,
    ...details.languages, details.availabilityGuidance].filter(Boolean)
  return createElement('section', { lang: props.locale, 'data-clinician-state': 'controlled-fixture' },
    createElement('p', { lang: 'en' }, 'Synthetic clinician fixture — no real clinician or availability is represented.'),
    props.locale === 'am' ? createElement('p', { lang: 'en' }, 'Unreviewed Amharic shaping fixture.') : null,
    createElement('h2', null, details.name),
    ...details.specialties.map((value, index) => createElement('p', { key: `specialty-${index}` }, value)),
    ...optional.map((value, index) => createElement('p', { key: `optional-${index}` }, value)),
    createElement('p', { lang: 'en' }, 'Schedules, portraits and appointment actions are withheld.'))
}
