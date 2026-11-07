import type { GuideCatalog } from '@/patient-guide/types'
import { previewFaqs } from '@/patient-guide/content'
import data from './data.json'
import { visitGuides } from './visit-guides'

// Adapt the same snapshot the directories use, keeping identities and appointment handoffs aligned.
export const demoPatientGuide: GuideCatalog = {
  preview: true,
  doctors: data.clinicians.map((doctor) => ({
    id: doctor.publicId, name: doctor.details.name,
    specialties: doctor.details.specialties, profileHref: doctor.canonicalPath,
  })),
  services: data.services.filter((service) => !visitGuides[service.publicId]).map((service) => ({
    id: service.publicId, name: service.name, description: service.sections.scope.join(' '),
  })),
  faqs: previewFaqs,
}
