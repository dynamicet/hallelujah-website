export function transferFixture(suffix = '131313131313') {
  return { publicId: `pub_${suffix}`, kind: 'page', status: 'draft', synthetic: true,
    localized: { en: { slug: `synthetic-transfer-${suffix}`, title: 'Synthetic transfer specimen' },
      am: { slug: `synthetic-am-${suffix}`, title: 'የቁጥጥር ምሳሌ' } },
    source: { reference: 'synthetic-transfer-specimen', recordedAt: '2026-09-17T12:00:00Z' },
    owner: null, reviewer: null, approval: null, domainApproval: null, relationships: [],
    publishAt: null, reviewAt: null, expiresAt: null, withdrawal: null, audit: [] }
}
export const transferBundle = (entries) => ({ version: 1, synthetic: true, entries })
export const transferEntry = (record, extra = {}) => ({ sourceKey: `synthetic/${record.publicId}`,
  operation: 'upsert', contentClass: 'general', record, ...extra })
