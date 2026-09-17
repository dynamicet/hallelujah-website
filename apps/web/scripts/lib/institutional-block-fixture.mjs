/** Synthetic fixtures only: no hospital narrative, leadership or insurance facts. */
export function institutionalBlockFixture(now = new Date('2026-09-17T12:00:00Z'), suffix = '181818181818', type = 'fact') {
  const instant = (offset) => new Date(now.getTime() + offset).toISOString().replace(/\.\d{3}Z$/, 'Z')
  const title = `Synthetic institutional ${type} ${suffix}`
  return {
    publicId: `pub_${suffix}`, kind: 'institutional-block', status: 'draft', synthetic: true,
    localized: { en: { slug: `synthetic-institution-${suffix}`, title } },
    source: { reference: 'synthetic-institution-fixture', recordedAt: instant(-86400000) },
    owner: null, reviewer: null, approval: null, domainApproval: null, relationships: [],
    publishAt: instant(-3600000), reviewAt: instant(86400000 * 30), expiresAt: instant(86400000 * 60),
    withdrawal: null, audit: [],
    institutionalBlock: { identityKey: `ins_${suffix}`, type, disposition: 'include',
      dispositionReason: 'Synthetic specimen only',
      localized: { en: { title, body: `Synthetic ${type} specimen ${suffix} — no hospital fact represented.` } },
      evidence: { source: 'Synthetic claim ledger entry', definition: 'Synthetic scope and measurement definition',
        limitations: 'No hospital capacity, quality, leadership or coverage claim', asOf: instant(-86400000),
        reviewAt: instant(86400000 * 10), expiresAt: instant(86400000 * 20), reviewer: null, reviewedAt: null },
      leadership: type === 'leadership' ? { name: 'Synthetic person', role: 'Synthetic role' } : null,
      relationship: type === 'relationship' ? { name: 'Synthetic organization', meaning: 'insurer', coverage: 'withheld' } : null },
  }
}
