import { visitorPurposes } from '../../src/content/visitor-topic.ts'

/** Synthetic task decisions only; no hospital policy, operational advice or reviewed translation. */
export function visitorTopicFixture(now = new Date('2026-09-17T12:00:00Z'), suffix = '070707070707', purpose = 'what-to-bring') {
  const instant = (offset) => new Date(now.getTime() + offset).toISOString().replace(/\.\d{3}Z$/, 'Z')
  const title = `Synthetic visitor topic ${suffix}`
  return {
    publicId: `pub_${suffix}`, kind: 'visitor-topic', status: 'draft', synthetic: true,
    localized: { en: { slug: `synthetic-visitor-${suffix}`, title } },
    source: { reference: 'synthetic-visitor-fixture', recordedAt: instant(-86400000) },
    owner: null, reviewer: null, approval: null, domainApproval: null, relationships: [],
    publishAt: instant(-3600000), reviewAt: instant(86400000 * 30), expiresAt: instant(86400000 * 60),
    withdrawal: null, audit: [],
    visitorTopic: { identityKey: `vst_${suffix}`, purpose, phase: 'before', taskOrder: 10,
      disposition: 'include', dispositionReason: 'Synthetic task only', temporary: false,
      localized: { en: { title, body: `Synthetic guidance ${suffix} — no hospital advice represented.` } },
      fallback: { state: 'withheld', reason: 'SAFE-01/SAFE-03 remain unresolved; no real contact represented.' } },
  }
}
export function visitorDecisionInventory(now) {
  return visitorPurposes.map((purpose, index) => {
    const fixture = visitorTopicFixture(now, `07${String(index).padStart(10, '0')}`, purpose)
    fixture.visitorTopic.disposition = 'unavailable'
    fixture.visitorTopic.dispositionReason = 'ACCESS-01 unresolved; hospital-authored guidance unavailable.'
    fixture.visitorTopic.localized.en.body = null
    fixture.visitorTopic.phase = index < 7 ? 'before' : index < 12 ? 'during' : 'after'
    return fixture
  })
}
