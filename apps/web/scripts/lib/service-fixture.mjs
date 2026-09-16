/** Fictional care wording only; no legacy service or approved translation is imported. */
export function serviceFixture(now = new Date('2026-09-16T12:00:00Z'), suffix = '050505050505') {
  const instant = (offset) => new Date(now.getTime() + offset).toISOString().replace(/\.\d{3}Z$/, 'Z')
  const name = `Synthetic service ${suffix}`
  return {
    publicId: `pub_${suffix}`, kind: 'service', status: 'draft', synthetic: true,
    localized: { en: { slug: `synthetic-service-${suffix}`, title: name } },
    source: { reference: 'synthetic-service-fixture', recordedAt: instant(-86400000) },
    owner: null, reviewer: null, approval: null, domainApproval: null, relationships: [],
    publishAt: instant(-3600000), reviewAt: instant(86400000 * 30), expiresAt: instant(86400000 * 60),
    withdrawal: null, audit: [],
    service: {
      identityKey: `svc_${suffix}`, launchDisposition: 'include', dispositionReason: 'Synthetic local subset only',
      group: { publicId: 'grp_050505050505', localized: { en: 'Synthetic care group' } },
      localized: { en: { name, synonyms: [`Synthetic synonym ${suffix}`] } },
      claims: [{ claimId: `clm_${suffix}`, section: 'scope', state: 'review',
        localized: { en: `Synthetic scope ${suffix} — no hospital capability claim.` },
        withholdingReason: null,
        evidence: { source: 'synthetic-source', scope: 'synthetic-only', eligibility: 'No real patient eligibility',
          limitations: 'No care represented', availability: 'No real availability', location: 'No real location',
          locationPublicIds: [], owner: 'Synthetic claim owner', reviewReference: 'synthetic-claim-review',
          reviewer: null, reviewedAt: null, expiresAt: instant(86400000 * 60) } }],
      omittedSections: Object.fromEntries(['common-needs', 'tests-treatments', 'preparation',
        'referral', 'urgent-exceptions', 'hours', 'next-steps'].map((section) => [section, 'Synthetic optional section withheld'])),
      locationPublicIds: [], appointment: { state: 'withheld', reason: 'No appointment route or collection enabled' },
    },
  }
}
