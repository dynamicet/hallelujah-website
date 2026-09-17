import { validateInstitutionalBlock, institutionalReadiness, type InstitutionalBlock } from './institutional-block.ts'
import { validateVisitorTopic, visitorTopicReadiness, type VisitorTopic } from './visitor-topic.ts'
import { siteSettingsReadiness, validateSiteSettings, type SiteSettings } from './site-settings.ts'
import { clinicianReadiness, validateClinician, type Clinician } from './clinician.ts'
import { serviceReadiness, serviceTextKey, validateService, type Service } from './service.ts'

export const governedKinds = ['doctor', 'service', 'location', 'vacancy', 'page', 'site-settings', 'visitor-topic', 'institutional-block'] as const
export const governedStatuses = [
  'draft', 'review', 'approved', 'scheduled', 'published', 'expired', 'withdrawn',
] as const
export const governedLocales = ['en', 'am'] as const

export type GovernedKind = (typeof governedKinds)[number]
export type GovernedStatus = (typeof governedStatuses)[number]
export type GovernedLocale = (typeof governedLocales)[number]

const governanceDomain: Record<GovernedKind, string> = {
  doctor: 'medical',
  service: 'clinical',
  location: 'operations',
  vacancy: 'human-resources',
  page: 'content',
  'site-settings': 'operations',
  'visitor-topic': 'operations',
  'institutional-block': 'content',
}

export type GovernedRecord = Readonly<{
  publicId: string
  kind: GovernedKind
  status: GovernedStatus
  synthetic: boolean
  localized: Partial<Record<GovernedLocale, Readonly<{ slug: string; title: string }>>>
  source: Readonly<{ reference: string; recordedAt: string }>
  owner: string | null
  reviewer: string | null
  approval: Readonly<{ actor: string; at: string }> | null
  domainApproval: Readonly<{ domain: string; actor: string; at: string; reference: string }> | null
  relationships: readonly string[]
  publishAt: string | null
  reviewAt: string | null
  expiresAt: string | null
  withdrawal: Readonly<{
    reason: string
    successorPublicId: string | null
  }> | null
  audit: readonly Readonly<{ actor: string; at: string; change: string }>[]
  siteSettings?: SiteSettings
  clinician?: Clinician
  service?: Service
  visitorTopic?: VisitorTopic
  institutionalBlock?: InstitutionalBlock
}>

export type ValidationResult =
  | Readonly<{ ok: true; record: GovernedRecord }>
  | Readonly<{ ok: false; issues: readonly string[] }>

const publicIdPattern = /^pub_[a-z0-9]{12,32}$/
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const consequentialKinds: readonly GovernedKind[] = ['doctor', 'service', 'location', 'vacancy']

function object(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown>
    : null
}

function nonempty(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

function instant(value: unknown): value is string {
  return typeof value === 'string' && /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\dZ$/.test(value)
    && Number.isFinite(Date.parse(value))
    && new Date(value).toISOString().replace('.000Z', 'Z') === value
}

function nullableInstant(value: unknown, path: string, issues: string[]): string | null {
  if (value === null) return null
  if (!instant(value)) issues.push(`${path} must be a valid UTC instant or null`)
  return instant(value) ? value : null
}

function nullableLabel(value: unknown, path: string, issues: string[]): string | null {
  if (value === null) return null
  if (!nonempty(value)) issues.push(`${path} must be a nonempty label or null`)
  return nonempty(value) ? value.trim() : null
}

export function validateGovernedRecord(input: unknown): ValidationResult {
  const issues: string[] = []
  const raw = object(input)
  if (!raw) return { ok: false, issues: ['record must be an object'] }

  const publicId = raw.publicId
  if (!nonempty(publicId) || !publicIdPattern.test(publicId)) {
    issues.push('publicId must be an opaque stable public identifier')
  }
  const kind = raw.kind
  if (!governedKinds.includes(kind as GovernedKind)) issues.push('kind is unsupported')
  const status = raw.status
  if (!governedStatuses.includes(status as GovernedStatus)) issues.push('status is unsupported')
  if (typeof raw.synthetic !== 'boolean') issues.push('synthetic must be explicit')

  const localizedRaw = object(raw.localized)
  const localized: Partial<Record<GovernedLocale, { slug: string; title: string }>> = {}
  if (!localizedRaw) {
    issues.push('localized must be an object')
  } else {
    for (const locale of governedLocales) {
      const entry = localizedRaw[locale]
      if (entry === undefined) continue
      const value = object(entry)
      if (!value || !nonempty(value.slug) || !slugPattern.test(value.slug)
        || !nonempty(value.title)) {
        issues.push(`localized.${locale} requires a canonical slug and title`)
      } else {
        localized[locale] = { slug: value.slug, title: value.title.trim() }
      }
    }
    if (Object.keys(localized).length === 0) issues.push('at least one locale is required')
    for (const key of Object.keys(localizedRaw)) {
      if (!governedLocales.includes(key as GovernedLocale)) issues.push('localized contains an unsupported locale')
    }
  }

  const sourceRaw = object(raw.source)
  if (!sourceRaw || !nonempty(sourceRaw.reference) || !instant(sourceRaw.recordedAt)) {
    issues.push('source requires a reference and recordedAt UTC instant')
  }
  const owner = nullableLabel(raw.owner, 'owner', issues)
  const reviewer = nullableLabel(raw.reviewer, 'reviewer', issues)
  const approvalRaw = raw.approval === null ? null : object(raw.approval)
  if (raw.approval !== null && (!approvalRaw || !nonempty(approvalRaw.actor)
    || !instant(approvalRaw.at))) issues.push('approval requires actor and at UTC instant')

  const domainApprovalRaw = raw.domainApproval === null ? null : object(raw.domainApproval)
  if (raw.domainApproval !== null && (!domainApprovalRaw
    || !nonempty(domainApprovalRaw.actor) || !instant(domainApprovalRaw.at)
    || !nonempty(domainApprovalRaw.reference)
    || domainApprovalRaw.domain !== governanceDomain[kind as GovernedKind])) {
    issues.push('domainApproval must match the record kind and identify actor, time, and source')
  }

  const relationshipsRaw = raw.relationships
  const relationships = Array.isArray(relationshipsRaw) ? relationshipsRaw : []
  if (!Array.isArray(relationshipsRaw) || relationships.some((id) =>
    typeof id !== 'string' || !publicIdPattern.test(id))
    || new Set(relationships).size !== relationships.length
    || relationships.includes(publicId)) {
    issues.push('relationships must contain unique, distinct public IDs')
  }

  const publishAt = nullableInstant(raw.publishAt, 'publishAt', issues)
  const reviewAt = nullableInstant(raw.reviewAt, 'reviewAt', issues)
  const expiresAt = nullableInstant(raw.expiresAt, 'expiresAt', issues)
  if (publishAt && reviewAt && Date.parse(reviewAt) <= Date.parse(publishAt)) {
    issues.push('reviewAt must follow publishAt')
  }
  if (publishAt && expiresAt && Date.parse(expiresAt) <= Date.parse(publishAt)) {
    issues.push('expiresAt must follow publishAt')
  }

  const withdrawalRaw = raw.withdrawal === null ? null : object(raw.withdrawal)
  if (raw.withdrawal !== null && (!withdrawalRaw || !nonempty(withdrawalRaw.reason)
    || (withdrawalRaw.successorPublicId !== null &&
      (typeof withdrawalRaw.successorPublicId !== 'string'
        || !publicIdPattern.test(withdrawalRaw.successorPublicId)
        || withdrawalRaw.successorPublicId === publicId)))) {
    issues.push('withdrawal requires a reason and a distinct public successor ID or null')
  }

  const auditRaw = raw.audit
  const audit = Array.isArray(auditRaw) ? auditRaw : []
  if (!Array.isArray(auditRaw) || audit.some((entry) => {
    const value = object(entry)
    return !value || !nonempty(value.actor) || !instant(value.at) || !nonempty(value.change)
  })) issues.push('audit must contain actor, at, and change entries')

  if (status === 'published' || status === 'scheduled') {
    if (!owner || !reviewer || !approvalRaw || !publishAt || !reviewAt || !expiresAt
      || !sourceRaw || !domainApprovalRaw || audit.length === 0) {
      issues.push('publishable status requires owner, reviewer, approval, domainApproval, source, dates, and audit')
    }
    if (consequentialKinds.includes(kind as GovernedKind) && !localized.en) {
      issues.push('consequential publishable records require an English canonical entry')
    }
  }
  if ((status === 'expired' || status === 'withdrawn') && !withdrawalRaw) {
    issues.push('retired status requires a withdrawal decision')
  }
  if (status !== 'expired' && status !== 'withdrawn' && withdrawalRaw) {
    issues.push('withdrawal is only valid for a retired status')
  }

  const settings = kind === 'site-settings' ? validateSiteSettings(raw.siteSettings) : null
  if (settings && !settings.ok) issues.push(...settings.issues)
  if (settings?.settings && ['scheduled', 'published'].includes(status as string) && publishAt) {
    issues.push(...siteSettingsReadiness(settings.settings, new Date(publishAt)))
  }
  if (kind !== 'site-settings' && raw.siteSettings !== undefined) {
    issues.push('siteSettings is only allowed on its canonical record kind')
  }
  if (kind === 'site-settings' && !localized.en) issues.push('siteSettings requires an English canonical entry')
  const clinician = kind === 'doctor' ? validateClinician(raw.clinician) : null
  if (clinician && !clinician.ok) issues.push(...clinician.issues)
  if (kind !== 'doctor' && raw.clinician !== undefined) issues.push('clinician is only allowed on doctor records')
  if (clinician?.clinician) {
    for (const [locale, details] of Object.entries(clinician.clinician.localized)) {
      if (!localized[locale as GovernedLocale] || localized[locale as GovernedLocale]?.title !== details.name) {
        issues.push('clinician name must match its canonical localized title')
      }
    }
    for (const locale of Object.keys(localized)) {
      if (!clinician.clinician.localized[locale as GovernedLocale]) issues.push('clinician details must match canonical locales')
    }
    if (clinician.clinician.locationPublicIds.some((id) => !relationships.includes(id))) {
      issues.push('clinician locations must be explicit governed relationships')
    }
    if (['scheduled', 'published'].includes(status as string) && publishAt) {
      issues.push(...clinicianReadiness(clinician.clinician, new Date(publishAt)))
    }
  }
  const service = kind === 'service' ? validateService(raw.service) : null
  if (service && !service.ok) issues.push(...service.issues)
  if (kind !== 'service' && raw.service !== undefined) issues.push('service is only allowed on service records')
  if (service?.service) {
    for (const locale of new Set([...Object.keys(localized), ...Object.keys(service.service.localized)])) {
      if (!localized[locale as GovernedLocale] || localized[locale as GovernedLocale]?.title
        !== service.service.localized[locale as GovernedLocale]?.name) issues.push('service name must match canonical localized title and locales')
    }
    if (service.service.locationPublicIds.some((id) => !relationships.includes(id))) issues.push('service locations must be explicit governed relationships')
    if (['approved', 'scheduled', 'published'].includes(status as string)) {
      if (service.service.claims.some((claim) => claim.state === 'approved'
        && claim.evidence?.reviewer !== domainApprovalRaw?.actor)) issues.push('service claim reviewer must match independent clinical approval')
    }
    if (['scheduled', 'published'].includes(status as string) && publishAt) {
      const effective = Math.max(Date.parse(publishAt), Date.parse(domainApprovalRaw?.at as string) || 0)
      issues.push(...serviceReadiness(service.service, new Date(effective)))
    }
  }
  const visitorTopic = kind === 'visitor-topic' ? validateVisitorTopic(raw.visitorTopic) : null
  if (visitorTopic && !visitorTopic.ok) issues.push(...visitorTopic.issues)
  if (kind !== 'visitor-topic' && raw.visitorTopic !== undefined) issues.push('visitorTopic is only allowed on visitor-topic records')
  if (visitorTopic?.topic) {
    for (const locale of new Set([...Object.keys(localized), ...Object.keys(visitorTopic.topic.localized)])) {
      if (!localized[locale as GovernedLocale] || localized[locale as GovernedLocale]?.title
        !== visitorTopic.topic.localized[locale as GovernedLocale]?.title) issues.push('visitor topic title must match canonical localized title and locales')
    }
    if (['approved', 'scheduled', 'published'].includes(status as string)) issues.push(...visitorTopicReadiness(visitorTopic.topic))
  }
  const institutional = kind === 'institutional-block' ? validateInstitutionalBlock(raw.institutionalBlock) : null
  if (institutional && !institutional.ok) issues.push(...institutional.issues)
  if (kind !== 'institutional-block' && raw.institutionalBlock !== undefined) issues.push('institutionalBlock is only allowed on institutional-block records')
  if (institutional?.block) {
    const block = institutional.block
    for (const locale of new Set([...Object.keys(localized), ...Object.keys(block.localized)])) {
      if (!localized[locale as GovernedLocale] || localized[locale as GovernedLocale]?.title
        !== block.localized[locale as GovernedLocale]?.title) issues.push('institutional title must match canonical localized title and locales')
    }
    if (['approved', 'scheduled', 'published'].includes(status as string)) {
      if (block.evidence?.reviewer !== domainApprovalRaw?.actor) issues.push('institutional evidence reviewer must match independent content approval')
      const effective = Math.max(Date.parse(publishAt ?? ''), Date.parse(approvalRaw?.at as string))
      issues.push(...institutionalReadiness(block, new Date(effective)))
    }
  }
  if (issues.length > 0) return { ok: false, issues: Object.freeze(issues) }
  return {
    ok: true,
    record: {
      publicId: publicId as string,
      kind: kind as GovernedKind,
      status: status as GovernedStatus,
      synthetic: raw.synthetic as boolean,
      localized,
      source: { reference: sourceRaw!.reference as string, recordedAt: sourceRaw!.recordedAt as string },
      owner,
      reviewer,
      approval: approvalRaw ? { actor: approvalRaw.actor as string, at: approvalRaw.at as string } : null,
      domainApproval: domainApprovalRaw ? {
        domain: domainApprovalRaw.domain as string,
        actor: domainApprovalRaw.actor as string,
        at: domainApprovalRaw.at as string,
        reference: domainApprovalRaw.reference as string,
      } : null,
      relationships: relationships as string[],
      publishAt,
      reviewAt,
      expiresAt,
      withdrawal: withdrawalRaw ? {
        reason: withdrawalRaw.reason as string,
        successorPublicId: withdrawalRaw.successorPublicId as string | null,
      } : null,
      audit: audit as GovernedRecord['audit'],
      ...(settings?.settings ? { siteSettings: settings.settings } : {}),
      ...(clinician?.clinician ? { clinician: clinician.clinician } : {}),
      ...(service?.service ? { service: service.service } : {}),
      ...(visitorTopic?.topic ? { visitorTopic: visitorTopic.topic } : {}),
      ...(institutional?.block ? { institutionalBlock: institutional.block } : {}),
    },
  }
}

const transitions: Record<GovernedStatus, readonly GovernedStatus[]> = {
  draft: ['review', 'withdrawn'],
  review: ['draft', 'approved', 'withdrawn'],
  approved: ['review', 'scheduled', 'published', 'withdrawn'],
  scheduled: ['approved', 'published', 'withdrawn'],
  published: ['expired', 'withdrawn'],
  expired: ['draft', 'withdrawn'],
  withdrawn: [],
}

export function canTransition(from: GovernedStatus, to: GovernedStatus): boolean {
  return transitions[from]?.includes(to) ?? false
}

export function publicEligibility(input: unknown, now: Date): Readonly<{
  eligible: boolean
  reason: 'invalid' | 'synthetic' | 'safety-gated' | 'care-gated' | 'access-gated' | 'institution-gated' | 'status' | 'not-effective' | 'review-due' | 'expired' | 'eligible'
}> {
  const validated = validateGovernedRecord(input)
  if (!validated.ok || !Number.isFinite(now.getTime())) {
    return { eligible: false, reason: 'invalid' }
  }
  const record = validated.record
  if (record.synthetic) return { eligible: false, reason: 'synthetic' }
  if (record.kind === 'institutional-block') return { eligible: false, reason: 'institution-gated' }
  if (record.kind === 'visitor-topic') return { eligible: false, reason: 'access-gated' }
  if (record.kind === 'site-settings') return { eligible: false, reason: 'safety-gated' }
  if (record.kind === 'doctor' || record.kind === 'service') return { eligible: false, reason: 'care-gated' }
  if (record.status !== 'published' || !record.approval || !record.owner || !record.reviewer) {
    return { eligible: false, reason: 'status' }
  }
  const time = now.getTime()
  if (!record.publishAt || Date.parse(record.publishAt) > time) {
    return { eligible: false, reason: 'not-effective' }
  }
  if (!record.reviewAt || Date.parse(record.reviewAt) <= time) {
    return { eligible: false, reason: 'review-due' }
  }
  if (!record.expiresAt || Date.parse(record.expiresAt) <= time) {
    return { eligible: false, reason: 'expired' }
  }
  return { eligible: true, reason: 'eligible' }
}

export function validateRecordSet(records: readonly GovernedRecord[]): readonly string[] {
  const issues: string[] = []
  if (records.filter((record) => record.kind === 'site-settings'
    && !['expired', 'withdrawn'].includes(record.status)).length > 1) {
    issues.push('only one current canonical site-settings record is allowed')
  }
  const ids = new Map<string, GovernedRecord>()
  const paths = new Set<string>()
  const institutionalIdentities = new Set<string>()
  let currentMission = false
  const visitorIdentities = new Set<string>()
  const visitorPurposes = new Set<string>()
  const clinicianIdentities = new Set<string>()
  const clinicianNames = new Set<string>()
  const serviceIdentities = new Set<string>()
  const serviceNames = new Set<string>()
  const serviceCopies = new Map<string, string>()
  const serviceGroups = new Map<string, string>()
  const groupNames = new Map<string, string>()
  for (const record of records) {
    if (ids.has(record.publicId)) issues.push('duplicate publicId')
    ids.set(record.publicId, record)
    if (record.institutionalBlock) {
      const block = record.institutionalBlock
      if (institutionalIdentities.has(block.identityKey)) issues.push('duplicate institutional identity')
      institutionalIdentities.add(block.identityKey)
      if (block.type === 'mission' && !['expired', 'withdrawn'].includes(record.status)) {
        if (currentMission) issues.push('competing current mission text requires reconciliation')
        currentMission = true
      }
    }
    if (record.visitorTopic) {
      if (visitorIdentities.has(record.visitorTopic.identityKey)) issues.push('duplicate visitor topic identity')
      visitorIdentities.add(record.visitorTopic.identityKey)
      if (!['expired', 'withdrawn'].includes(record.status)) {
        if (visitorPurposes.has(record.visitorTopic.purpose)) issues.push('duplicate current visitor topic purpose')
        visitorPurposes.add(record.visitorTopic.purpose)
      }
    }
    if (record.service) {
      const service = record.service
      if (serviceIdentities.has(service.identityKey)) issues.push('duplicate service identity')
      serviceIdentities.add(service.identityKey)
      if (!['expired', 'withdrawn'].includes(record.status)) {
        for (const [locale, details] of Object.entries(service.localized)) {
          for (const name of [details.name, ...details.synonyms]) {
            const key = `${locale}:${serviceTextKey(name)}`
            if (serviceNames.has(key)) issues.push('overlapping service names or synonyms require taxonomy reconciliation')
            serviceNames.add(key)
          }
        }
        for (const [locale, name] of Object.entries(service.group.localized)) {
          const key = `${service.group.publicId}:${locale}`
          const normalized = serviceTextKey(name)
          if (serviceGroups.has(key) && serviceGroups.get(key) !== normalized) issues.push('service group has conflicting localized labels')
          serviceGroups.set(key, normalized)
          const labelKey = `${locale}:${normalized}`
          if (groupNames.has(labelKey) && groupNames.get(labelKey) !== service.group.publicId) issues.push('duplicate service group labels require taxonomy reconciliation')
          groupNames.set(labelKey, service.group.publicId)
        }
        for (const claim of service.claims) {
          for (const [locale, text] of Object.entries(claim.localized)) {
            const key = `${locale}:${serviceTextKey(text)}`
            if (serviceCopies.has(key) && serviceCopies.get(key) !== record.publicId) issues.push('copied cross-service claim text requires editorial reconciliation')
            serviceCopies.set(key, record.publicId)
          }
        }
      }
    }
    if (record.clinician) {
      if (clinicianIdentities.has(record.clinician.identityKey)) issues.push('duplicate clinician roster identity')
      clinicianIdentities.add(record.clinician.identityKey)
      if (!['expired', 'withdrawn'].includes(record.status)) {
        const name = record.clinician.localized.en!.name.trim().normalize('NFKC').toLowerCase().replace(/\s+/g, ' ')
        if (clinicianNames.has(name)) issues.push('duplicate current clinician name requires roster reconciliation')
        clinicianNames.add(name)
      }
    }
    for (const [locale, entry] of Object.entries(record.localized)) {
      const key = `${record.kind}:${locale}:${entry.slug}`
      if (paths.has(key)) issues.push('duplicate canonical slug')
      paths.add(key)
    }
  }
  for (const record of records) {
    for (const id of record.service?.locationPublicIds ?? []) {
      const location = ids.get(id)
      if (!location || location.kind !== 'location') issues.push('service location must resolve to a location record')
      else if (['approved', 'scheduled', 'published'].includes(record.status)
        && (!['approved', 'scheduled', 'published'].includes(location.status)
          || !location.reviewAt || !location.expiresAt || !record.publishAt
          || Date.parse(location.reviewAt) <= Date.parse(record.publishAt)
          || Date.parse(location.expiresAt) <= Date.parse(record.publishAt))) issues.push('approved service location must be approved and current')
    }
    for (const id of record.clinician?.locationPublicIds ?? []) {
      const location = ids.get(id)
      if (!location || location.kind !== 'location') issues.push('clinician location must resolve to a location record')
      else if (['approved', 'scheduled', 'published'].includes(record.status)
        && !['approved', 'scheduled', 'published'].includes(location.status)) {
        issues.push('approved clinician location must be approved and current')
      }
    }
    for (const relatedId of record.relationships) {
      const related = ids.get(relatedId)
      if (!related) issues.push('relationship has no matching public record')
      else if (related.status === 'expired' || related.status === 'withdrawn') {
        issues.push('relationship points to a retired public record')
      }
    }
    const successorId = record.withdrawal?.successorPublicId
    if (successorId) {
      const successor = ids.get(successorId)
      if (!successor || successor.kind !== record.kind
        || successor.status === 'expired' || successor.status === 'withdrawn') {
        issues.push('redirect successor must be a current record of the same kind')
      }
    }
  }
  return Object.freeze(issues)
}
