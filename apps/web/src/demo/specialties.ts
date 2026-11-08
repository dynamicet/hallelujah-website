import type { ServiceView } from '@/content/service-view'

// Homepage presentation labels. Destinations remain local demonstration service records.
export const featuredSpecialties = [
  {
    servicePublicId: 'pub_151515151515',
    label: 'Heart care', specialty: 'Cardiology',
    description: 'Heart care and specialist consultations.',
    action: 'Explore heart care',
  },
  {
    servicePublicId: 'pub_232323232323',
    label: 'Brain & nerve care', specialty: 'Neurology',
    description: 'Care for the brain and nervous system.',
    action: 'Explore brain & nerve care',
  },
  {
    servicePublicId: 'pub_242424242424',
    label: 'Kidney care', specialty: 'Nephrology',
    description: 'Kidney care and specialist guidance.',
    action: 'Explore kidney care',
  },
  {
    servicePublicId: 'pub_252525252525',
    label: 'Bones & joints', specialty: 'Orthopedics',
    description: 'Care for bones, joints and movement.',
    action: 'Explore bone & joint care',
  },
] as const

// Additional local examples for the new care paths; generated data.json stays untouched.
// Names match specialties in the reconciled source, without importing its clinical claims.
export const specialtyServiceExamples: readonly ServiceView[] = featuredSpecialties
  .filter((care) => care.servicePublicId !== 'pub_151515151515')
  .map((care) => ({
    publicId: care.servicePublicId,
    canonicalPath: `/services/synthetic-service-${care.servicePublicId.slice(4)}/`,
    locale: 'en', name: care.label, synonyms: [care.specialty],
    group: care.servicePublicId === 'pub_252525252525'
      ? { publicId: 'grp_303030303030', name: 'Specialty and rehabilitation' }
      : { publicId: 'grp_202020202020', name: 'Medicine' },
    sections: { scope: [care.description] },
    locationPublicIds: [], reviewer: 'Illustrative presentation copy', reviewedAt: '2026-11-03T00:00:00Z',
    appointment: { state: 'withheld', servicePublicId: care.servicePublicId },
  }))

const additionalExamples: readonly ServiceView[] = [
  { publicId: 'pub_262626262626', name: 'Pediatrics' },
  { publicId: 'pub_272727272727', name: 'Echocardiography' },
].map((entry) => ({ ...entry, canonicalPath: `/services/synthetic-service-${entry.publicId.slice(4)}/`, locale: 'en' as const, synonyms: [],
  group: { publicId: 'grp_202020202020', name: 'Medicine' }, sections: {}, locationPublicIds: [], reviewer: 'Frontend fixture', reviewedAt: '2026-11-08T00:00:00Z',
  appointment: { state: 'withheld' as const, servicePublicId: entry.publicId } }))
export { additionalExamples }
