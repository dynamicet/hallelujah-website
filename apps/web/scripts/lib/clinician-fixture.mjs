/** Fictional names/claims only; not an extracted roster or an approved translation. */
export function clinicianFixture(now = new Date('2026-09-16T12:00:00Z'), suffix = '040404040404') {
  const instant = (offset) => new Date(now.getTime() + offset).toISOString().replace(/\.\d{3}Z$/, 'Z')
  return {
    publicId: `pub_${suffix}`, kind: 'doctor', status: 'draft', synthetic: true,
    localized: { en: { slug: `synthetic-clinician-${suffix}`, title: `Synthetic clinician ${suffix}` } },
    source: { reference: 'synthetic-clinician-fixture', recordedAt: instant(-86400000) },
    owner: null, reviewer: null, approval: null, domainApproval: null, relationships: [],
    publishAt: instant(-3600000), reviewAt: instant(86400000 * 30), expiresAt: instant(86400000 * 60),
    withdrawal: null, audit: [],
    clinician: {
      identityKey: `clin_${suffix}`, rosterStatus: 'current',
      localized: { en: { name: `Synthetic clinician ${suffix}`, professionalTitle: null,
        credentials: [], specialties: ['Synthetic specialty — no capability claim'], interests: [], languages: [], availabilityGuidance: null } },
      locationPublicIds: [], portrait: null,
      schedule: { state: 'withheld', reason: 'CARE-03 unresolved; no real schedule', entries: [] },
      appointment: { state: 'withheld', reason: 'No appointment route or collection is enabled' },
    },
  }
}
