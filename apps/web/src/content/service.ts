export const serviceSections = ['scope', 'common-needs', 'tests-treatments', 'preparation',
  'referral', 'urgent-exceptions', 'hours', 'next-steps'] as const
export type ServiceSection = typeof serviceSections[number]
type Locale = 'en' | 'am'
export type ServiceEvidence = Readonly<{
  source: string; scope: string; eligibility: string; limitations: string; availability: string; location: string
  locationPublicIds: readonly string[]; owner: string; reviewReference: string
  reviewer: string | null; reviewedAt: string | null; expiresAt: string
}>
export type ServiceClaim = Readonly<{
  claimId: string; section: ServiceSection; state: 'withheld' | 'review' | 'approved'
  localized: Partial<Record<Locale, string>>; evidence: ServiceEvidence | null
  withholdingReason: string | null
}>
export type Service = Readonly<{
  identityKey: string; launchDisposition: 'include' | 'omit' | 'defer'; dispositionReason: string
  group: Readonly<{ publicId: string; localized: Partial<Record<Locale, string>> }>
  localized: Partial<Record<Locale, Readonly<{ name: string; synonyms: readonly string[] }>>>
  claims: readonly ServiceClaim[]; omittedSections: Partial<Record<ServiceSection, string>>
  locationPublicIds: readonly string[]
  appointment: Readonly<{ state: 'withheld'; reason: string }>
}>

function object(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown> : null
}
function label(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0 && value.length <= 2000
}
export function serviceTextKey(value: string): string {
  return value.trim().normalize('NFKC').toLowerCase().replace(/\s+/g, ' ')
}
function instant(value: unknown): value is string {
  return typeof value === 'string' && /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\dZ$/.test(value)
    && Number.isFinite(Date.parse(value)) && new Date(value).toISOString().replace('.000Z', 'Z') === value
}
function ids(value: unknown): value is readonly string[] {
  return Array.isArray(value) && value.length <= 100 && value.every((id) => typeof id === 'string'
    && /^pub_[a-z0-9]{12,32}$/.test(id)) && new Set(value).size === value.length
}
function only(raw: Record<string, unknown>, keys: readonly string[]): boolean {
  return Object.keys(raw).every((key) => keys.includes(key))
}

/** Explicit sections and claim evidence prevent free-text capability or availability bypasses. */
export function validateService(input: unknown): Readonly<{ ok: boolean; issues: readonly string[]; service?: Service }> {
  const raw = object(input)
  if (!raw) return { ok: false, issues: ['service must be an object'] }
  const issues: string[] = []
  if (!only(raw, ['identityKey', 'launchDisposition', 'dispositionReason', 'group', 'localized',
    'claims', 'omittedSections', 'locationPublicIds', 'appointment'])) issues.push('service contains unsupported fields')
  if (typeof raw.identityKey !== 'string' || !/^svc_[a-z0-9]{12,32}$/.test(raw.identityKey)) issues.push('service requires an opaque identityKey')
  if (!['include', 'omit', 'defer'].includes(raw.launchDisposition as string)
    || !label(raw.dispositionReason)) issues.push('service launch disposition and reason are required')
  const localized = object(raw.localized)
  const group = object(raw.group)
  const groupLocales = object(group?.localized)
  if (!group || !only(group, ['publicId', 'localized']) || typeof group.publicId !== 'string'
    || !/^grp_[a-z0-9]{12,32}$/.test(group.publicId) || !groupLocales) issues.push('service group requires stable identity and localized labels')
  if (!localized?.en) issues.push('service requires English details')
  for (const [locale, value] of Object.entries(localized ?? {})) {
    const details = object(value)
    if (!['en', 'am'].includes(locale) || !details || !only(details, ['name', 'synonyms']) || !label(details.name)) {
      issues.push('service localized details require supported locale and name'); continue
    }
    const synonyms = details.synonyms
    if (!Array.isArray(synonyms) || synonyms.length > 50 || synonyms.some((entry) => !label(entry))
      || new Set([details.name, ...synonyms].map((entry) => typeof entry === 'string' ? serviceTextKey(entry) : entry)).size !== synonyms.length + 1) {
      issues.push('service synonyms require unique labels distinct from the name')
    }
    if (!label(groupLocales?.[locale])) issues.push('service group labels must match service locales')
  }
  if (Object.keys(groupLocales ?? {}).some((locale) => !localized?.[locale])) issues.push('service group contains unmatched locales')
  if (!ids(raw.locationPublicIds)) issues.push('service locations require unique stable public IDs')
  const appointment = object(raw.appointment)
  if (!appointment || !only(appointment, ['state', 'reason']) || appointment.state !== 'withheld'
    || !label(appointment.reason)) issues.push('service appointment remains withheld')
  const omissions = object(raw.omittedSections)
  if (!omissions || Object.entries(omissions).some(([section, reason]) => section === 'scope'
    || !serviceSections.includes(section as ServiceSection) || !label(reason))) issues.push('service omissions require supported optional sections and reasons')
  const claims = raw.claims
  if (!Array.isArray(claims) || claims.length > 100) issues.push('service claims must be a bounded array')
  const claimIds = new Set<string>()
  const claimTexts = new Set<string>()
  const present = new Set<string>()
  for (const inputClaim of Array.isArray(claims) ? claims : []) {
    const claim = object(inputClaim)
    if (!claim || !only(claim, ['claimId', 'section', 'state', 'localized', 'evidence', 'withholdingReason'])) {
      issues.push('service claim contains unsupported fields'); continue
    }
    if (typeof claim.claimId !== 'string' || !/^clm_[a-z0-9]{12,32}$/.test(claim.claimId)
      || claimIds.has(claim.claimId)) issues.push('service claim requires a unique opaque claimId')
    claimIds.add(claim.claimId as string)
    if (!serviceSections.includes(claim.section as ServiceSection)) issues.push('service claim section is unsupported')
    present.add(claim.section as string)
    const texts = object(claim.localized)
    if (!texts?.en || Object.entries(texts ?? {}).some(([locale, text]) => !localized?.[locale] || !label(text))) {
      issues.push('service claim requires English text and matching supported locales')
    }
    for (const [locale, text] of Object.entries(texts ?? {})) {
      if (!label(text)) continue
      const key = `${locale}:${serviceTextKey(text)}`
      if (claimTexts.has(key)) issues.push('service contains copied or duplicate claim text')
      claimTexts.add(key)
    }
    if (!['withheld', 'review', 'approved'].includes(claim.state as string)) issues.push('service claim state is unsupported')
    if (claim.state === 'withheld') {
      if (!label(claim.withholdingReason) || claim.evidence !== null) issues.push('withheld service claim requires reason and no approval evidence')
      if (claim.section === 'scope') issues.push('service scope cannot be withheld; omit or defer the entire service')
      continue
    }
    if (claim.withholdingReason !== null) issues.push('reviewable service claim cannot carry a withholding reason')
    const evidence = object(claim.evidence)
    if (!evidence || !only(evidence, ['source', 'scope', 'eligibility', 'limitations', 'availability',
      'location', 'locationPublicIds', 'owner', 'reviewReference', 'reviewer', 'reviewedAt', 'expiresAt'])
      || ['source', 'scope', 'eligibility', 'limitations', 'availability', 'location', 'owner', 'reviewReference'].some((key) => !label(evidence[key]))
      || !ids(evidence.locationPublicIds) || !instant(evidence.expiresAt)
      || evidence.locationPublicIds.some((id) => !Array.isArray(raw.locationPublicIds) || !raw.locationPublicIds.includes(id))) {
      issues.push('service claim requires source, scope, eligibility, limitations, availability, locations, owner and lifecycle evidence'); continue
    }
    if (claim.state === 'approved') {
      if (typeof evidence.reviewer !== 'string' || !/^cms:\d+$/.test(evidence.reviewer)
        || !instant(evidence.reviewedAt) || Date.parse(evidence.expiresAt) <= Date.parse(evidence.reviewedAt)) {
        issues.push('approved service claim requires a CMS clinical reviewer and valid review/expiry instants')
      }
    } else if (evidence.reviewer !== null || evidence.reviewedAt !== null) issues.push('unapproved service claim cannot supply reviewer or review time')
  }
  for (const section of serviceSections) {
    if (!present.has(section) && !omissions?.[section]) issues.push(`service section ${section} requires claims or explicit omission`)
    if (present.has(section) && omissions?.[section]) issues.push('service section cannot be both claimed and omitted')
  }
  return issues.length ? { ok: false, issues } : { ok: true, issues: [], service: raw as unknown as Service }
}

export function serviceReadiness(service: Service, now: Date): readonly string[] {
  const issues: string[] = []
  if (!Number.isFinite(now.getTime())) issues.push('service readiness requires a valid clock')
  if (service.launchDisposition !== 'include') issues.push('service launch subset excludes this record')
  for (const claim of service.claims) {
    if (claim.state === 'withheld') continue
    if (claim.state !== 'approved' || !claim.evidence?.reviewedAt
      || Date.parse(claim.evidence.reviewedAt) > now.getTime()
      || Date.parse(claim.evidence.expiresAt) <= now.getTime()) issues.push('service claim approval evidence is not current')
  }
  return issues
}

/** Workflow stamps independent clinical identity/time; authors cannot approve individual claims. */
export function reviewServiceClaims(service: Service, actor: string, at: string): Service {
  return { ...service, claims: service.claims.map((claim) => claim.state === 'withheld' ? claim : {
    ...claim, state: 'approved', evidence: { ...claim.evidence!, reviewer: actor, reviewedAt: at },
  }) }
}
export function clearServiceReviews(service: Service): Service {
  return { ...service, claims: service.claims.map((claim) => claim.state === 'withheld' ? claim : {
    ...claim, state: 'review', evidence: { ...claim.evidence!, reviewer: null, reviewedAt: null },
  }) }
}
