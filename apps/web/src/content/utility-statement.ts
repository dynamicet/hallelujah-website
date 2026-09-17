export const statementTypes = ['privacy', 'accessibility'] as const
export type StatementType = typeof statementTypes[number]
export const collectionFeatures = ['appointment', 'search', 'accessibility-support'] as const
export type CollectionFeature = typeof collectionFeatures[number]
export type ProcessingInventory = Readonly<{
  revision: string
  flows: readonly Readonly<{
    feature: CollectionFeature; state: 'disabled' | 'planned'
    purpose: string; categories: string; recipients: string; access: string
    transport: string; retention: string; deletion: string; choices: string
    providers: readonly never[]
  }>[]
}>
export type UtilityStatement = Readonly<{
  identityKey: string; type: StatementType; version: number; supersedesPublicId: string | null
  effectiveAt: string; reviewedAt: string | null; reviewAt: string; expiresAt: string
  localized: Partial<Record<'en' | 'am', Readonly<{
    title: string; sections: readonly Readonly<{ key: string; heading: string; body: string }>[]
  }>>>
  contact: Readonly<{
    state: 'unavailable' | 'bound'; settingsPublicId: string | null
    fact: 'email' | 'publicPhone' | null; purpose: string; operationsReference: string | null
  }>
  servicePublicIds: readonly string[]
  inventory: ProcessingInventory | null
  testing: Readonly<{
    testedAt: string; scope: string; methods: readonly string[]; limitations: readonly string[]
    evidenceReference: string; claim: 'limited-testing-only'
  }> | null
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
export function statementInstant(value: unknown): value is string {
  return typeof value === 'string' && /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\dZ$/.test(value)
    && Number.isFinite(Date.parse(value)) && new Date(value).toISOString().replace('.000Z', 'Z') === value
}
function publicId(value: unknown): value is string {
  return typeof value === 'string' && /^pub_[a-z0-9]{12,32}$/.test(value)
}
export function validateProcessingInventory(input: unknown): input is ProcessingInventory {
  const raw = object(input)
  if (!raw || !only(raw, ['revision', 'flows']) || typeof raw.revision !== 'string'
    || !/^inv_[a-z0-9]{12,32}$/.test(raw.revision) || !Array.isArray(raw.flows)
    || raw.flows.length !== collectionFeatures.length) return false
  const seen = new Set<string>()
  for (const value of raw.flows) {
    const flow = object(value)
    if (!flow || !only(flow, ['feature', 'state', 'purpose', 'categories', 'recipients',
      'access', 'transport', 'retention', 'deletion', 'choices', 'providers'])
      || !collectionFeatures.includes(flow.feature as CollectionFeature)
      || seen.has(flow.feature as string) || !['disabled', 'planned'].includes(flow.state as string)
      || ['purpose', 'categories', 'recipients', 'access', 'transport', 'retention', 'deletion', 'choices']
        .some((key) => !text(flow[key])) || !Array.isArray(flow.providers) || flow.providers.length) return false
    seen.add(flow.feature as string)
  }
  return true
}
export function validateUtilityStatement(input: unknown): Readonly<{
  ok: boolean; issues: readonly string[]; statement?: UtilityStatement
}> {
  const raw = object(input)
  if (!raw) return { ok: false, issues: ['utility statement must be an object'] }
  const issues: string[] = []
  if (!only(raw, ['identityKey', 'type', 'version', 'supersedesPublicId', 'effectiveAt',
    'reviewedAt', 'reviewAt', 'expiresAt', 'localized', 'contact', 'servicePublicIds', 'inventory', 'testing'])) {
    issues.push('utility statement contains unsupported fields')
  }
  if (typeof raw.identityKey !== 'string' || !/^stmt_[a-z0-9]{12,32}$/.test(raw.identityKey)
    || !statementTypes.includes(raw.type as StatementType) || !Number.isSafeInteger(raw.version)
    || (raw.version as number) < 1 || (raw.version === 1 ? raw.supersedesPublicId !== null : !publicId(raw.supersedesPublicId))) {
    issues.push('statement requires opaque series identity, supported type, positive version and predecessor')
  }
  if (!statementInstant(raw.effectiveAt) || !statementInstant(raw.reviewAt) || !statementInstant(raw.expiresAt)
    || Date.parse(raw.effectiveAt) >= Date.parse(raw.reviewAt) || Date.parse(raw.effectiveAt) >= Date.parse(raw.expiresAt)
    || raw.reviewedAt !== null && !statementInstant(raw.reviewedAt)) issues.push('statement requires ordered effective/review/expiry dates and explicit review stamp')
  const locales = object(raw.localized)
  if (!locales?.en) issues.push('statement requires English text')
  for (const [locale, value] of Object.entries(locales ?? {})) {
    const details = object(value)
    const keys = new Set<string>()
    if (!['en', 'am'].includes(locale) || !details || !only(details, ['title', 'sections'])
      || !text(details.title) || !Array.isArray(details.sections) || !details.sections.length
      || details.sections.length > 30) { issues.push('statement requires supported localized title and sections'); continue }
    for (const value of details.sections) {
      const section = object(value)
      if (!section || !only(section, ['key', 'heading', 'body']) || typeof section.key !== 'string'
        || !/^[a-z][a-z0-9-]{0,63}$/.test(section.key) || keys.has(section.key)
        || !text(section.heading) || !text(section.body)) issues.push('statement sections require unique keys, headings and text')
      else keys.add(section.key)
    }
  }
  const contact = object(raw.contact)
  if (!contact || !only(contact, ['state', 'settingsPublicId', 'fact', 'purpose', 'operationsReference'])
    || !text(contact.purpose) || !['unavailable', 'bound'].includes(contact.state as string)
    || (contact.state === 'unavailable' ? contact.settingsPublicId !== null || contact.fact !== null
      || contact.operationsReference !== null : !publicId(contact.settingsPublicId)
      || !['email', 'publicPhone'].includes(contact.fact as string) || !text(contact.operationsReference))) {
    issues.push('statement contact requires an explicit unavailable or operations-approved canonical binding')
  }
  if (!Array.isArray(raw.servicePublicIds) || raw.servicePublicIds.some((id) => !publicId(id))
    || new Set(raw.servicePublicIds).size !== raw.servicePublicIds.length) issues.push('statement service dependencies require unique public IDs')
  if (raw.type === 'privacy') {
    if (!validateProcessingInventory(raw.inventory) || raw.testing !== null) issues.push('privacy requires a complete disabled/planned processing inventory without providers or testing claims')
  } else if (raw.type === 'accessibility') {
    const test = object(raw.testing)
    if (raw.inventory !== null || !test || !only(test, ['testedAt', 'scope', 'methods', 'limitations', 'evidenceReference', 'claim'])
      || !statementInstant(test.testedAt) || !text(test.scope) || !text(test.evidenceReference)
      || test.claim !== 'limited-testing-only' || ['methods', 'limitations'].some((key) =>
        !Array.isArray(test[key]) || !(test[key] as unknown[]).length || (test[key] as unknown[]).some((entry) => !text(entry)))) {
      issues.push('accessibility requires tested date/scope/methods, known limitations and evidence; certification claims are withheld')
    }
  }
  return issues.length ? { ok: false, issues } : { ok: true, issues: [], statement: raw as unknown as UtilityStatement }
}
export function statementReadiness(statement: UtilityStatement, now: Date, requireEffective = false): readonly string[] {
  if (!Number.isFinite(now.getTime()) || !statement.reviewedAt || Date.parse(statement.reviewedAt) > now.getTime()
    || Date.parse(statement.reviewAt) <= now.getTime() || Date.parse(statement.expiresAt) <= now.getTime()
    || requireEffective && Date.parse(statement.effectiveAt) > now.getTime()
    || statement.testing && Date.parse(statement.testing.testedAt) > now.getTime()) return ['statement is unreviewed, future, review-due or expired']
  return []
}
