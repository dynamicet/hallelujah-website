export const visitorPhases = ['before', 'during', 'after'] as const
export type VisitorPhase = typeof visitorPhases[number]
export const visitorPurposes = ['appointment-status', 'what-to-bring', 'preparation', 'arrival',
  'payment-insurance', 'accessibility', 'admission', 'reception-navigation', 'visiting',
  'rights', 'language-support', 'safeguarding', 'discharge', 'results-follow-up',
  'medicines', 'feedback-complaints', 'urgent-escalation', 'staffed-fallback'] as const
export type VisitorPurpose = typeof visitorPurposes[number]
export type VisitorTopic = Readonly<{
  identityKey: string; purpose: VisitorPurpose; phase: VisitorPhase; taskOrder: number
  disposition: 'include' | 'unavailable' | 'defer' | 'omit'; dispositionReason: string; temporary: boolean
  localized: Partial<Record<'en' | 'am', Readonly<{ title: string; body: string | null }>>>
  fallback: Readonly<{ state: 'withheld'; reason: string }>
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
export function validateVisitorTopic(input: unknown): Readonly<{
  ok: boolean; issues: readonly string[]; topic?: VisitorTopic
}> {
  const raw = object(input)
  if (!raw) return { ok: false, issues: ['visitor topic must be an object'] }
  const issues: string[] = []
  if (!only(raw, ['identityKey', 'purpose', 'phase', 'taskOrder', 'disposition',
    'dispositionReason', 'temporary', 'localized', 'fallback'])) issues.push('visitor topic contains unsupported fields')
  if (typeof raw.identityKey !== 'string' || !/^vst_[a-z0-9]{12,32}$/.test(raw.identityKey)) issues.push('visitor topic requires an opaque identityKey')
  if (!visitorPurposes.includes(raw.purpose as VisitorPurpose)) issues.push('visitor topic purpose is unsupported')
  if (!visitorPhases.includes(raw.phase as VisitorPhase)) issues.push('visitor topic phase is unsupported')
  if (!Number.isInteger(raw.taskOrder) || (raw.taskOrder as number) < 0
    || (raw.taskOrder as number) > 999) issues.push('visitor topic task order must be an integer from 0 to 999')
  if (!['include', 'unavailable', 'defer', 'omit'].includes(raw.disposition as string)
    || !text(raw.dispositionReason)) issues.push('visitor topic requires a disposition and reason')
  if (typeof raw.temporary !== 'boolean') issues.push('visitor topic temporary flag must be explicit')
  const locales = object(raw.localized)
  if (!locales?.en) issues.push('visitor topic requires English details')
  for (const [locale, value] of Object.entries(locales ?? {})) {
    const details = object(value)
    if (!['en', 'am'].includes(locale) || !details || !only(details, ['title', 'body'])
      || !text(details.title)) {
      issues.push('visitor topic requires supported localized titles'); continue
    }
    if (raw.disposition === 'include' ? !text(details.body) : details.body !== null) {
      issues.push('included visitor topics require useful body text; unavailable/deferred/omitted guidance must be null')
    }
  }
  const fallback = object(raw.fallback)
  if (!fallback || !only(fallback, ['state', 'reason']) || fallback.state !== 'withheld'
    || !text(fallback.reason)) issues.push('visitor topic staffed fallback remains withheld')
  return issues.length ? { ok: false, issues } : { ok: true, issues: [], topic: raw as unknown as VisitorTopic }
}
export function visitorTopicReadiness(topic: VisitorTopic): readonly string[] {
  return topic.disposition === 'include' ? [] : ['visitor topic disposition excludes publication']
}
