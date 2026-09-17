export const institutionalTypes = ['narrative', 'mission', 'leadership', 'milestone', 'fact', 'relationship'] as const
export type InstitutionalType = typeof institutionalTypes[number]
export type InstitutionalBlock = Readonly<{
  identityKey: string; type: InstitutionalType
  disposition: 'include' | 'unavailable' | 'defer' | 'omit'; dispositionReason: string
  localized: Partial<Record<'en' | 'am', Readonly<{ title: string; body: string | null }>>>
  evidence: Readonly<{
    source: string; definition: string; limitations: string; asOf: string
    reviewAt: string; expiresAt: string; reviewer: string | null; reviewedAt: string | null
  }> | null
  leadership: Readonly<{ name: string; role: string }> | null
  relationship: Readonly<{ name: string; meaning: 'partner' | 'insurer'; coverage: 'withheld' }> | null
}>
function object(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown> : null
}
function text(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0 && value.length <= 10000
}
function only(value: Record<string, unknown>, keys: readonly string[]): boolean {
  return Object.keys(value).every((key) => keys.includes(key))
}
function instant(value: unknown): value is string {
  return typeof value === 'string' && /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\dZ$/.test(value)
    && Number.isFinite(Date.parse(value)) && new Date(value).toISOString().replace('.000Z', 'Z') === value
}
export function validateInstitutionalBlock(input: unknown): Readonly<{
  ok: boolean; issues: readonly string[]; block?: InstitutionalBlock
}> {
  const raw = object(input)
  if (!raw) return { ok: false, issues: ['institutional block must be an object'] }
  const issues: string[] = []
  if (!only(raw, ['identityKey', 'type', 'disposition', 'dispositionReason', 'localized',
    'evidence', 'leadership', 'relationship'])) issues.push('institutional block contains unsupported fields')
  if (typeof raw.identityKey !== 'string' || !/^ins_[a-z0-9]{12,32}$/.test(raw.identityKey)) issues.push('institutional block requires an opaque identityKey')
  if (!institutionalTypes.includes(raw.type as InstitutionalType)) issues.push('institutional block type is unsupported')
  if (!['include', 'unavailable', 'defer', 'omit'].includes(raw.disposition as string)
    || !text(raw.dispositionReason)) issues.push('institutional block requires disposition and reason')
  const locales = object(raw.localized)
  if (!locales?.en) issues.push('institutional block requires English details')
  for (const [locale, value] of Object.entries(locales ?? {})) {
    const details = object(value)
    if (!['en', 'am'].includes(locale) || !details || !only(details, ['title', 'body'])
      || !text(details.title)) { issues.push('institutional block requires supported localized titles'); continue }
    if (raw.disposition === 'include' ? !text(details.body) : details.body !== null) {
      issues.push('included institutional blocks require body text; unavailable/deferred/omitted text must be null')
    }
  }
  const evidence = object(raw.evidence)
  if (raw.disposition === 'include') {
    if (!evidence || !only(evidence, ['source', 'definition', 'limitations', 'asOf', 'reviewAt',
      'expiresAt', 'reviewer', 'reviewedAt']) || !text(evidence.source) || !text(evidence.definition)
      || !text(evidence.limitations) || !instant(evidence.asOf) || !instant(evidence.reviewAt)
      || !instant(evidence.expiresAt) || Date.parse(evidence.asOf) >= Date.parse(evidence.reviewAt)
      || Date.parse(evidence.asOf) >= Date.parse(evidence.expiresAt)
      || (evidence.reviewer === null) !== (evidence.reviewedAt === null)
      || evidence.reviewer !== null && (typeof evidence.reviewer !== 'string'
        || !/^cms:[1-9]\d*$/.test(evidence.reviewer) || !instant(evidence.reviewedAt))) {
      issues.push('institutional claims require source, definition, limitations, as-of/review/expiry instants and paired review stamps')
    }
  } else if (raw.evidence !== null || raw.leadership !== null || raw.relationship !== null) {
    issues.push('non-included institutional blocks must withhold evidence, leadership and relationships')
  }
  const leadership = object(raw.leadership)
  if (raw.disposition === 'include' && raw.type === 'leadership') {
    if (!leadership || !only(leadership, ['name', 'role']) || !text(leadership.name)
      || !text(leadership.role)) issues.push('leadership requires an explicit name and role')
  } else if (raw.leadership !== null) issues.push('leadership is only allowed on included leadership blocks')
  const relationship = object(raw.relationship)
  if (raw.disposition === 'include' && raw.type === 'relationship') {
    if (!relationship || !only(relationship, ['name', 'meaning', 'coverage']) || !text(relationship.name)
      || !['partner', 'insurer'].includes(relationship.meaning as string)
      || relationship.coverage !== 'withheld') issues.push('relationship requires name, patient-relevant meaning and withheld coverage')
  } else if (raw.relationship !== null) issues.push('relationship is only allowed on included relationship blocks')
  return issues.length ? { ok: false, issues } : { ok: true, issues: [], block: raw as unknown as InstitutionalBlock }
}
export function institutionalReadiness(block: InstitutionalBlock, now: Date): readonly string[] {
  const evidence = block.evidence
  if (block.disposition !== 'include') return ['institutional disposition excludes publication']
  if (!evidence?.reviewer || !evidence.reviewedAt || !Number.isFinite(now.getTime())
    || Date.parse(evidence.asOf) > now.getTime() || Date.parse(evidence.reviewedAt) > now.getTime()
    || Date.parse(evidence.reviewAt) <= now.getTime() || Date.parse(evidence.expiresAt) <= now.getTime()) {
    return ['institutional evidence is unreviewed, future, review-due or expired']
  }
  return []
}
export function clearInstitutionalReview(block: InstitutionalBlock): InstitutionalBlock {
  return { ...block, evidence: block.evidence ? { ...block.evidence, reviewer: null, reviewedAt: null } : null }
}
export function reviewInstitutionalBlock(block: InstitutionalBlock, actor: string, at: string): InstitutionalBlock {
  return { ...block, evidence: block.evidence ? { ...block.evidence, reviewer: actor, reviewedAt: at } : null }
}
