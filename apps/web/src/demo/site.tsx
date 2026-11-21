import { isLocalDemo } from '@/server/environment'
import { notFound } from 'next/navigation'
import type { ClinicianView } from '@/content/clinician-view'
import type { ServiceView } from '@/content/service-view'
import data from './data.json'
import { specialtyServiceExamples, additionalExamples } from './specialties'
import { careEntry, doctorSpecialties } from './care-model'

// Frozen, fictional presentation data. No credentials, workflow documents, or runtime fixture imports.
export const clinicians = data.clinicians.map((entry): ClinicianView => ({
  ...entry, locale: 'en', portrait: null, schedule: null,
  details: {
    ...entry.details,
    specialties: doctorSpecialties(entry.publicId),
    availabilityGuidance: 'The team will discuss available appointment times with you.',
    languages: entry.publicId === 'pub_101010101010'
      ? [...entry.details.languages, 'French']
      : entry.details.languages,
  },
  appointment: { state: 'withheld', doctorPublicId: entry.publicId },
}))
export const clinicianBiographies = new Map(data.clinicians.map((entry) => [entry.publicId, entry.biography]))
export const services = [...data.services, ...specialtyServiceExamples, ...additionalExamples].map((entry): ServiceView => ({
  ...entry, locale: 'en',
  name: careEntry(entry.publicId)?.name ?? entry.name,
  synonyms: [...new Set([...entry.synonyms, ...(careEntry(entry.publicId)?.synonyms ?? [])])],
  sections: { ...entry.sections, scope: [careEntry(entry.publicId)?.scope ?? 'Discuss your care needs and prepare your questions before visiting.'] },
  appointment: { state: 'withheld', servicePublicId: entry.publicId },
}))
export { data }
export type DemoSearchParams = Promise<Record<string, string | string[] | undefined>>

export function requireLocalDemo() {
  if (!isLocalDemo()) notFound()
}

// Frozen preview data shares the public navigation and footer configuration.
export { hospitalShell as demoShell } from '@/website/site-shell'
