import { healthTopics } from './health-topics'
import { relatedCareIds } from './care-model'
import { searchHealthTopics } from '../website/health-search'
import type { ClinicianView } from '../content/clinician-view'
import type { ServiceView } from '../content/service-view'

// Preview relationships only; reuse existing affiliations, never infer a clinical capability.
export function doctorSearchTerms(query: string, clinicians: readonly ClinicianView[], services: readonly ServiceView[]) {
  const normalizedQuery = query.normalize('NFC').replaceAll(/[\u0000-\u001f\u007f]/gu, '').replaceAll(/\s+/gu, ' ').trim().slice(0, 80)
  const topics = searchHealthTopics(healthTopics, normalizedQuery).map(({ topic }) => topic)
  return clinicians.flatMap((clinician) => {
    const ids = relatedCareIds(clinician.publicId)
    const related = services.filter((service) => ids.includes(service.publicId))
    const matchedTopics = topics.filter((topic) => topic.servicePublicId && ids.includes(topic.servicePublicId))
    if (!related.length) return []
    return [{
      clinicianPublicId: clinician.publicId,
      terms: [...related.map((service) => service.name), ...(matchedTopics.length ? [normalizedQuery] : [])],
      explanation: `Related care: ${matchedTopics[0]?.serviceName ?? related.map((service) => service.name).join(' · ')}.`,
    }]
  })
}
