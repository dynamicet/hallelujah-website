/** Synthetic policies only, outside application source. */
export function utilityStatementFixture(now = new Date('2026-09-17T12:00:00Z'), suffix = '909090909090', type = 'privacy') {
  const instant = (offset) => new Date(now.getTime() + offset).toISOString().replace(/\.\d{3}Z$/, 'Z')
  const title = `Synthetic ${type} statement ${suffix}`
  return {
    publicId: `pub_${suffix}`, kind: 'utility-statement', status: 'draft', synthetic: true,
    localized: { en: { slug: `synthetic-${type}-${suffix}-v1`, title } },
    source: { reference: 'synthetic-statement-fixture', recordedAt: instant(-86400000) },
    owner: null, reviewer: null, approval: null, domainApproval: null, relationships: [],
    publishAt: instant(-3600000), reviewAt: instant(86400000 * 30), expiresAt: instant(86400000 * 60),
    withdrawal: null, audit: [],
    utilityStatement: {
      identityKey: `stmt_${suffix}`, type, version: 1, supersedesPublicId: null,
      effectiveAt: instant(-3600000), reviewedAt: null, reviewAt: instant(86400000 * 30), expiresAt: instant(86400000 * 60),
      localized: { en: { title, sections: [
        { key: 'scope', heading: 'Synthetic scope', body: 'Synthetic statement specimen; no hospital policy represented.' },
        { key: 'limitations', heading: 'Known limitations', body: 'No hospital legal approval, reviewed translation or operational support.' },
      ] } },
      contact: { state: 'unavailable', settingsPublicId: null, fact: null, purpose: `Synthetic ${type} contact`, operationsReference: null },
      servicePublicIds: [],
      inventory: type === 'privacy' ? { revision: `inv_${suffix}`, flows: ['appointment', 'search', 'accessibility-support'].map((feature) => ({
        feature, state: 'disabled', purpose: 'Synthetic purpose only', categories: 'No data collected',
        recipients: 'No active recipient', access: 'No collection access', transport: 'No submission transport',
        retention: 'No request retained', deletion: 'No collected request exists', choices: 'Collection disabled', providers: [],
      })) } : null,
      testing: type === 'accessibility' ? { testedAt: instant(-86400000), scope: 'Synthetic fixture only; no public hospital route',
        methods: ['Synthetic keyboard specimen'], limitations: ['No screen-reader or hospital support acceptance'],
        evidenceReference: 'Synthetic QA ledger', claim: 'limited-testing-only' } : null,
    },
  }
}
