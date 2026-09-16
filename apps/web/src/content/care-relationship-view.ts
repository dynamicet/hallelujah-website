import { createElement } from 'react'
import { controlledClinicianIndex, type ClinicianView } from './clinician-view.ts'
import { controlledServiceIndex, type ServiceView } from './service-view.ts'
import type { GovernedLocale } from './governed-record.ts'
import { careRelationship, careEndpointSnapshot, checkedCareRecords, validateCareSet } from './care-relationships.ts'

export type CareHandoff = Readonly<{ doctorPublicId: string; servicePublicId: string; locationPublicId: string }>
export type ControlledCareGraph = Readonly<{
  doctors: readonly Readonly<{ doctor: ClinicianView; relationships: readonly CareHandoff[] }>[]
  services: readonly Readonly<{ service: ServiceView; relationships: readonly CareHandoff[] }>[]
  handoffs: readonly CareHandoff[]
}>
/** A single explicit association drives both internal render paths. No route or collection is enabled. */
export function controlledCareGraph(
  inputs: readonly unknown[], linkInputs: readonly unknown[], locale: GovernedLocale,
  now: Date, mode?: 'controlled-fixture',
): ControlledCareGraph {
  const empty = { doctors: [], services: [], handoffs: [] }
  if (mode !== 'controlled-fixture' || !['en', 'am'].includes(locale) || !Number.isFinite(now.getTime())) return empty
  try {
    const records = checkedCareRecords(inputs)
    const links = linkInputs.map(careRelationship)
    validateCareSet(links)
    const doctors = controlledClinicianIndex(records, locale, now, mode)
    const services = controlledServiceIndex(records, locale, now, mode)
    const handoffs: CareHandoff[] = []
    for (const link of links) {
      if (link.state !== 'approved') continue
      try {
        const definition = link.definition
        if (careEndpointSnapshot(definition, records, now, true) !== link.endpointSnapshot
          || !doctors.some((view) => view.publicId === definition.doctorPublicId)
          || !services.some((view) => view.publicId === definition.servicePublicId)
          || !records.find((entry) => entry.publicId === definition.locationPublicId)?.localized[locale]) continue
        handoffs.push({ doctorPublicId: definition.doctorPublicId,
          servicePublicId: definition.servicePublicId, locationPublicId: definition.locationPublicId })
      } catch { /* An expired or changed endpoint removes its affiliation from both paths. */ }
    }
    return {
      doctors: doctors.map((doctor) => ({ doctor, relationships: handoffs.filter((link) => link.doctorPublicId === doctor.publicId) })),
      services: services.map((service) => ({ service, relationships: handoffs.filter((link) => link.servicePublicId === service.publicId) })),
      handoffs,
    }
  } catch { return empty }
}
/** Reject stale or arbitrary triples using the same graph used by both care consumers. */
export function controlledCareHandoff(
  inputs: readonly unknown[], links: readonly unknown[], candidate: unknown,
  locale: GovernedLocale, now: Date, mode?: 'controlled-fixture',
): CareHandoff | null {
  if (!candidate || typeof candidate !== 'object' || Array.isArray(candidate)) return null
  const value = candidate as Record<string, unknown>
  if (Object.keys(value).length !== 3 || Object.keys(value)
    .some((key) => !['doctorPublicId', 'servicePublicId', 'locationPublicId'].includes(key))) return null
  return controlledCareGraph(inputs, links, locale, now, mode).handoffs.find((link) =>
    link.doctorPublicId === value.doctorPublicId && link.servicePublicId === value.servicePublicId
    && link.locationPublicId === value.locationPublicId) ?? null
}

type SpecimenProps = Readonly<{
  records: readonly unknown[]; links: readonly unknown[]; publicId: string
  locale: GovernedLocale; now: Date; mode?: 'controlled-fixture'
}>
/** Inert specimens demonstrate that both render paths consume the same association graph. */
function careSpecimen(props: SpecimenProps, kind: 'doctor' | 'service') {
  const graph = controlledCareGraph(props.records, props.links, props.locale, props.now, props.mode)
  const doctor = graph.doctors.find((view) => view.doctor.publicId === props.publicId)
  const service = graph.services.find((view) => view.service.publicId === props.publicId)
  const selected = kind === 'doctor' ? doctor : service
  if (!selected) return createElement('p', { lang: 'en' }, 'Care relationship details are withheld.')
  const title = kind === 'doctor' ? doctor!.doctor.details.name : service!.service.name
  const entries = selected.relationships.map((link) => {
    const related = kind === 'doctor'
      ? graph.services.find((view) => view.service.publicId === link.servicePublicId)?.service.name
      : graph.doctors.find((view) => view.doctor.publicId === link.doctorPublicId)?.doctor.details.name
    const location = checkedCareRecords(props.records).find((record) => record.publicId === link.locationPublicId)!
    return createElement('li', { key: `${link.doctorPublicId}:${link.servicePublicId}:${link.locationPublicId}` },
      `${related} — ${location.localized[props.locale]!.title}`)
  })
  return createElement('section', { lang: props.locale, 'data-care-state': 'controlled-fixture' },
    createElement('p', { lang: 'en' }, 'Synthetic care relationship fixture — no real affiliation or appointment availability.'),
    props.locale === 'am' ? createElement('p', { lang: 'en' }, 'Unreviewed Amharic shaping fixture.') : null,
    createElement('h2', null, title),
    entries.length ? createElement('ul', null, ...entries)
      : createElement('p', { lang: 'en' }, 'Affiliations are withheld.'),
    createElement('p', { lang: 'en' }, 'Appointment actions remain disabled.'))
}
export function ControlledCareDoctor(props: SpecimenProps) { return careSpecimen(props, 'doctor') }
export function ControlledCareService(props: SpecimenProps) { return careSpecimen(props, 'service') }
