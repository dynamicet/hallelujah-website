/** Canonical operations facts. Verification metadata is evidence, never CMS authority. */
export const siteFactKeys = [
  'identity', 'emergencyPhone', 'publicPhone', 'switchboardPhone', 'ambulancePhone',
  'email', 'address', 'hours', 'emergencyEntrance', 'publicEntrance',
  'accessibleEntrance', 'staffedFallback',
] as const
export type SiteFactKey = typeof siteFactKeys[number]
export type SiteFact = Readonly<{
  label: Readonly<Partial<Record<'en' | 'am', string>>>
  value: string | null
  state: 'withheld' | 'unverified' | 'conflict' | 'verified'
  source: string
  owner: string
  verifier: string | null
  checkedAt: string | null
  reviewAt: string | null
  expiresAt: string | null
  note: string | null
}>
export type SiteSettings = Readonly<Record<SiteFactKey, SiteFact>>

function object(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown> : null
}
function label(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0 && value.length <= 2000
    && !/[\u0000-\u001f\u007f]/u.test(value)
}
function instant(value: unknown): value is string {
  return typeof value === 'string' && /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\dZ$/u.test(value)
    && Number.isFinite(Date.parse(value)) && new Date(value).toISOString().replace('.000Z', 'Z') === value
}
export function canonicalPhone(display: string): string | null {
  const normalized = display.replace(/[\s().-]/gu, '')
  return /^\+[1-9]\d{6,14}$/u.test(normalized) ? normalized : null
}
export function factTarget(key: SiteFactKey, value: string): string | null {
  if (key.endsWith('Phone')) {
    const number = canonicalPhone(value)
    return number ? `tel:${number}` : null
  }
  if (key === 'email') {
    return /^[a-z0-9._+-]+@[a-z0-9-]+(?:\.[a-z0-9-]+)+$/iu.test(value)
      ? `mailto:${value}` : null
  }
  return null
}

export function validateSiteSettings(input: unknown): Readonly<{
  ok: boolean; settings: SiteSettings | null; issues: readonly string[]
}> {
  const raw = object(input)
  const issues: string[] = []
  const settings: Partial<Record<SiteFactKey, SiteFact>> = {}
  if (!raw) return { ok: false, settings: null, issues: ['siteSettings must be an object'] }
  if (Object.keys(raw).some((key) => !siteFactKeys.includes(key as SiteFactKey))) {
    issues.push('siteSettings contains unsupported facts')
  }
  for (const key of siteFactKeys) {
    const fact = object(raw[key])
    const labels = object(fact?.label)
    if (!fact || !labels || !label(labels.en)
      || Object.entries(labels).some(([locale, text]) => !['en', 'am'].includes(locale) || !label(text))
      || !['withheld', 'unverified', 'conflict', 'verified'].includes(fact.state as string)
      || !label(fact.source) || !label(fact.owner)
      || fact.value !== null && !label(fact.value)
      || fact.note !== null && !label(fact.note)
      || fact.verifier !== null && !label(fact.verifier)
      || ['checkedAt', 'reviewAt', 'expiresAt'].some((field) => fact[field] !== null && !instant(fact[field]))
      || Object.keys(fact).some((field) => !['label', 'value', 'state', 'source', 'owner',
        'verifier', 'checkedAt', 'reviewAt', 'expiresAt', 'note'].includes(field))) {
      issues.push(`siteSettings.${key} requires labeled value/state and explicit verification metadata`)
      continue
    }
    if ((fact.state === 'withheld') !== (fact.value === null)
      || ['withheld', 'conflict'].includes(fact.state as string) && !label(fact.note)) {
      issues.push(`siteSettings.${key} requires an explicit withholding/conflict decision`)
    }
    if (typeof fact.value === 'string' && (key.endsWith('Phone') || key === 'email')
      && !factTarget(key, fact.value)) issues.push(`siteSettings.${key} has an invalid contact value`)
    if (fact.state === 'verified' && (!label(fact.verifier) || !instant(fact.checkedAt)
      || !instant(fact.reviewAt) || !instant(fact.expiresAt)
      || Date.parse(fact.checkedAt as string) >= Date.parse(fact.reviewAt as string)
      || Date.parse(fact.checkedAt as string) >= Date.parse(fact.expiresAt as string))) {
      issues.push(`siteSettings.${key} verified facts require verifier and ordered UTC dates`)
    }
    settings[key] = fact as unknown as SiteFact
  }
  const purposes = Object.values(settings).map((fact) => fact.label.en?.trim().toLowerCase())
  if (new Set(purposes).size !== purposes.length) issues.push('siteSettings requires distinct purpose labels')
  return issues.length ? { ok: false, settings: null, issues }
    : { ok: true, settings: settings as SiteSettings, issues: [] }
}

/** Every required fact must be reconciled before controlled approval/publication. */
export function siteSettingsReadiness(settings: SiteSettings, now: Date): readonly string[] {
  if (!Number.isFinite(now.getTime())) return ['siteSettings readiness requires a valid time']
  return siteFactKeys.filter((key) => {
    const fact = settings[key]
    return fact.state !== 'verified' || fact.value === null || !fact.checkedAt
      || Date.parse(fact.checkedAt) > now.getTime() || !fact.reviewAt || !fact.expiresAt
      || Date.parse(fact.reviewAt) <= now.getTime() || Date.parse(fact.expiresAt) <= now.getTime()
  }).map((key) => `siteSettings.${key} is unresolved or no longer current`)
}
