import { controlledCareGraph } from './care-relationship-view.ts'
import { checkedCareRecords } from './care-relationships.ts'
import {
  controlledClinicianIndex,
  controlledClinicianResolution,
  type ClinicianView,
} from './clinician-view.ts'
import type { GovernedLocale } from './governed-record.ts'

export type ClinicianProfileOutcome = 'gone' | 'profile' | 'redirect' | 'unavailable'

export interface ClinicianProfileLocation {
  readonly publicId: string
  readonly title: string
}

export interface ClinicianProfileService {
  readonly canonicalPath: string
  readonly name: string
  readonly publicId: string
}

export interface ControlledClinicianProfile {
  readonly canonicalPath: string | null
  readonly clinician: ClinicianView | null
  readonly locations: readonly ClinicianProfileLocation[]
  readonly outcome: ClinicianProfileOutcome
  readonly relatedServices: readonly ClinicianProfileService[]
}

const empty = (
  outcome: Exclude<ClinicianProfileOutcome, 'profile'>,
  canonicalPath: string | null = null,
): ControlledClinicianProfile => Object.freeze({
  canonicalPath,
  clinician: null,
  locations: Object.freeze([]),
  outcome,
  relatedServices: Object.freeze([]),
})

/**
 * Synthetic controlled-profile projection only. The result cannot mount a route, enable an
 * appointment action, publish a portrait/schedule, or make authentic records eligible.
 */
export function controlledClinicianProfile(input: Readonly<{
  links: readonly unknown[]
  locale: GovernedLocale
  mode?: 'controlled-fixture'
  now: Date
  publicId: string
  records: readonly unknown[]
}>): ControlledClinicianProfile {
  const resolution = controlledClinicianResolution(
    input.records,
    input.publicId,
    input.locale,
    input.now,
    input.mode,
  )
  if (resolution.state !== 'profile') return empty(resolution.state, resolution.canonicalPath)

  const clinician = controlledClinicianIndex(
    input.records,
    input.locale,
    input.now,
    input.mode,
  ).find((entry) => entry.publicId === input.publicId)
  if (!clinician) return empty('unavailable')

  const graph = controlledCareGraph(
    input.records,
    input.links,
    input.locale,
    input.now,
    input.mode,
  )
  const doctor = graph.doctors.find((entry) => entry.doctor.publicId === input.publicId)
  if (!doctor) {
    return Object.freeze({
      canonicalPath: clinician.canonicalPath,
      clinician,
      locations: Object.freeze([]),
      outcome: 'profile' as const,
      relatedServices: Object.freeze([]),
    })
  }

  try {
    const records = checkedCareRecords(input.records)
    const relatedServices = doctor.relationships.flatMap((relationship) => {
      const service = graph.services.find((entry) =>
        entry.service.publicId === relationship.servicePublicId)?.service
      return service ? [{
        canonicalPath: service.canonicalPath,
        name: service.name,
        publicId: service.publicId,
      }] : []
    })
    const uniqueServices = [...new Map(relatedServices.map((service) => [service.publicId, service])).values()]
    const locationIds = [...new Set(doctor.relationships.map((entry) => entry.locationPublicId))]
    const locations = locationIds.flatMap((publicId) => {
      const record = records.find((entry) => entry.publicId === publicId && entry.kind === 'location')
      const localized = record?.localized[input.locale]
      return localized ? [{ publicId, title: localized.title }] : []
    })
    return Object.freeze({
      canonicalPath: clinician.canonicalPath,
      clinician,
      locations: Object.freeze(locations),
      outcome: 'profile' as const,
      relatedServices: Object.freeze(uniqueServices),
    })
  } catch {
    return Object.freeze({
      canonicalPath: clinician.canonicalPath,
      clinician,
      locations: Object.freeze([]),
      outcome: 'profile' as const,
      relatedServices: Object.freeze([]),
    })
  }
}
