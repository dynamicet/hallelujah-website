export type ClinicianDetails = Readonly<{
  name: string
  professionalTitle: string | null
  credentials: readonly string[]
  specialties: readonly string[]
  interests: readonly string[]
  languages: readonly string[]
  availabilityGuidance: string | null
}>

export type Clinician = Readonly<{
  identityKey: string
  rosterStatus: 'unverified' | 'current' | 'former'
  localized: Partial<Record<'en' | 'am', ClinicianDetails>>
  locationPublicIds: readonly string[]
  portrait: Readonly<{
    assetPublicId: string; source: string; rightsReference: string; consentReference: string
    reviewedAt: string; expiresAt: string
  }> | null
  schedule: Readonly<{ state: 'withheld'; reason: string; entries: readonly never[] }>
  appointment: Readonly<{ state: 'withheld'; reason: string }>
}>

function object(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown> : null
}
function label(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0 && value.length <= 500
}
function instant(value: unknown): value is string {
  return typeof value === 'string' && /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\dZ$/.test(value)
    && Number.isFinite(Date.parse(value))
    && new Date(value).toISOString().replace('.000Z', 'Z') === value
}

/** CARE-03/APPT gates have no caller-supplied enable switch. */
export function validateClinician(input: unknown): Readonly<{
  ok: boolean; issues: readonly string[]; clinician?: Clinician
}> {
  const raw = object(input)
  if (!raw) return { ok: false, issues: ['clinician must be an object'] }
  const issues: string[] = []
  const keys = ['identityKey', 'rosterStatus', 'localized', 'locationPublicIds', 'portrait', 'schedule', 'appointment']
  if (Object.keys(raw).some((key) => !keys.includes(key))) issues.push('clinician contains unsupported fields')
  if (typeof raw.identityKey !== 'string' || !/^clin_[a-z0-9]{12,32}$/.test(raw.identityKey)) {
    issues.push('clinician.identityKey requires a stable opaque roster identity')
  }
  if (!['unverified', 'current', 'former'].includes(raw.rosterStatus as string)) issues.push('clinician.rosterStatus is required')
  const localizedRaw = object(raw.localized)
  const localized: Partial<Record<'en' | 'am', ClinicianDetails>> = {}
  if (!localizedRaw || !localizedRaw.en) issues.push('clinician requires English details')
  for (const [locale, inputDetails] of Object.entries(localizedRaw ?? {})) {
    if (locale !== 'en' && locale !== 'am') { issues.push('clinician locale is unsupported'); continue }
    const details = object(inputDetails)
    if (!details) { issues.push('clinician details must be an object'); continue }
    const detailKeys = ['name', 'professionalTitle', 'credentials', 'specialties', 'interests', 'languages', 'availabilityGuidance']
    if (Object.keys(details).some((key) => !detailKeys.includes(key))) issues.push('clinician details contain unsupported fields')
    if (!label(details.name)) issues.push('clinician name is required')
    for (const key of ['professionalTitle', 'availabilityGuidance']) {
      if (details[key] !== null && !label(details[key])) issues.push(`clinician ${key} must be a label or null`)
    }
    for (const key of ['credentials', 'specialties', 'interests', 'languages']) {
      const values = details[key]
      if (!Array.isArray(values) || values.length > 50 || values.some((value) => !label(value))
        || new Set(values.map((value) => typeof value === 'string' ? value.trim().normalize('NFKC').toLowerCase() : value)).size !== values.length
        || key === 'specialties' && values.length === 0) issues.push(`clinician ${key} requires unique labels`)
    }
    localized[locale] = details as unknown as ClinicianDetails
  }
  const locations = raw.locationPublicIds
  if (!Array.isArray(locations) || locations.some((id) => typeof id !== 'string' || !/^pub_[a-z0-9]{12,32}$/.test(id))
    || new Set(locations).size !== locations.length) issues.push('clinician locations require unique stable public IDs')
  for (const key of ['schedule', 'appointment']) {
    const value = object(raw[key])
    const allowed = key === 'schedule' ? ['state', 'reason', 'entries'] : ['state', 'reason']
    if (!value || value.state !== 'withheld' || !label(value.reason)
      || Object.keys(value).some((field) => !allowed.includes(field))
      || key === 'schedule' && (!Array.isArray(value.entries) || value.entries.length !== 0)) {
      issues.push(`clinician ${key} remains withheld pending governance`)
    }
  }
  const portrait = raw.portrait === null ? null : object(raw.portrait)
  const portraitKeys = ['assetPublicId', 'source', 'rightsReference', 'consentReference', 'reviewedAt', 'expiresAt']
  if (raw.portrait !== null && (!portrait
    || Object.keys(portrait).some((key) => !portraitKeys.includes(key))
    || typeof portrait.assetPublicId !== 'string' || !/^asset_[a-z0-9]{12,32}$/.test(portrait.assetPublicId)
    || !label(portrait.source) || !label(portrait.rightsReference) || !label(portrait.consentReference)
    || !instant(portrait.reviewedAt) || !instant(portrait.expiresAt)
    || Date.parse(portrait.expiresAt) <= Date.parse(portrait.reviewedAt))) {
    issues.push('clinician portrait requires governed asset identity, source, rights, consent and lifecycle')
  }
  if (issues.length) return { ok: false, issues }
  return { ok: true, issues: [], clinician: { ...raw, localized } as unknown as Clinician }
}

export function clinicianReadiness(clinician: Clinician, now: Date): readonly string[] {
  const issues: string[] = []
  if (!Number.isFinite(now.getTime())) issues.push('clinician readiness requires a valid clock')
  if (clinician.rosterStatus !== 'current') issues.push('clinician roster must be current')
  if (clinician.portrait && (Date.parse(clinician.portrait.reviewedAt) > now.getTime()
    || Date.parse(clinician.portrait.expiresAt) <= now.getTime())) issues.push('clinician portrait evidence is not current')
  return issues
}
