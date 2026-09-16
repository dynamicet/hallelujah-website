import { clinicianFixture } from './clinician-fixture.mjs'
import { serviceFixture } from './service-fixture.mjs'

/** Explicit fictional affiliations only. Amharic is an unreviewed shaping fixture. */
export function careFixtures(now = new Date('2026-09-16T12:00:00Z'), suffix = '060606060606', bilingual = false) {
  const doctor = clinicianFixture(now, `${suffix}01`)
  const service = serviceFixture(now, `${suffix}02`)
  const location = { ...clinicianFixture(now, `${suffix}03`), kind: 'location' }
  delete location.clinician
  location.localized.en = { slug: `synthetic-location-${suffix}`, title: 'Synthetic location — no arrival facts' }
  doctor.relationships = [location.publicId]
  doctor.clinician.locationPublicIds = [location.publicId]
  service.relationships = [location.publicId]
  service.service.locationPublicIds = [location.publicId]
  service.service.claims[0].evidence.locationPublicIds = [location.publicId]
  if (bilingual) {
    doctor.localized.am = { slug: `synthetic-doctor-am-${suffix}`, title: 'የቁጥጥር ሐኪም ምሳሌ' }
    doctor.clinician.localized.am = { ...doctor.clinician.localized.en, name: doctor.localized.am.title }
    service.localized.am = { slug: `synthetic-service-am-${suffix}`, title: 'የቁጥጥር አገልግሎት ምሳሌ' }
    service.service.localized.am = { name: service.localized.am.title, synonyms: [] }
    service.service.group.localized.am = 'የቡድን ምሳሌ'
    service.service.claims[0].localized.am = 'የቁጥጥር ጽሑፍ ምሳሌ'
    location.localized.am = { slug: `synthetic-location-am-${suffix}`, title: 'የቦታ ምሳሌ' }
  }
  return { doctor, service, location, definition: {
    publicId: `lnk_${suffix}`, synthetic: true, doctorPublicId: doctor.publicId,
    servicePublicId: service.publicId, locationPublicId: location.publicId, source: 'Synthetic explicit affiliation only',
    reviewAt: doctor.reviewAt, expiresAt: doctor.expiresAt,
  } }
}
