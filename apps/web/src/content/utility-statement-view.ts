import { serviceReadiness } from './service.ts'
import { createElement } from 'react'
import { canonical, requiredDomains, type WorkflowDocument } from './cms-workflow.ts'
import { validateGovernedRecord, validateRecordSet, type GovernedLocale, type GovernedRecord } from './governed-record.ts'
import { statementReadiness, validateProcessingInventory, type CollectionFeature, type ProcessingInventory, type StatementType, type UtilityStatement } from './utility-statement.ts'
import { siteSettingsReadiness } from './site-settings.ts'

export type StatementView = Readonly<{
  state: 'unavailable' | 'controlled-fixture'
  publicId: string | null; owner: string | null; statement: UtilityStatement | null
  contact: Readonly<{ state: 'unavailable' | 'controlled-fixture'; value: string | null }>
}>
const empty = (): StatementView => ({ state: 'unavailable', publicId: null, owner: null,
  statement: null, contact: { state: 'unavailable', value: null } })

export function statementDependencies(
  record: GovernedRecord, records: readonly GovernedRecord[], now: Date,
): readonly string[] {
  const statement = record.utilityStatement
  if (!statement) return []
  const issues: string[] = []
  for (const id of [...statement.servicePublicIds, ...(statement.contact.settingsPublicId ? [statement.contact.settingsPublicId] : [])]) {
    const peer = records.find((item) => item.publicId === id)
    if (!peer || !validateGovernedRecord(peer).ok || !peer.synthetic || peer.status !== 'published'
      || !peer.approval || !peer.publishAt || Date.parse(peer.publishAt) > now.getTime()
      || Date.parse(peer.approval.at) > now.getTime() || !peer.reviewAt || Date.parse(peer.reviewAt) <= now.getTime()
      || !peer.expiresAt || Date.parse(peer.expiresAt) <= now.getTime()
      || peer.kind === 'service' && (!peer.service || serviceReadiness(peer.service, now).length)
      || peer.kind === 'site-settings' && (!peer.siteSettings || siteSettingsReadiness(peer.siteSettings, now).length)) {
      issues.push('statement dependency is missing, unapproved or no longer current')
    }
  }
  return issues
}
function signed(doc: WorkflowDocument, now: Date): boolean {
  const { record, workflow } = doc
  return Boolean(record.owner === workflow.author && record.approval
    && record.reviewer === record.approval.actor && record.approval.actor !== workflow.author
    && /^cms:[1-9]\d*$/.test(record.approval.actor)
    && Date.parse(record.approval.at) <= now.getTime()
    && Number.isSafeInteger(workflow.revision) && workflow.revision > 0
    && canonical(record.domainApproval) === canonical({ ...workflow.reviews.content, domain: 'content' })
    && record.utilityStatement?.reviewedAt === workflow.reviews.content?.at
    && requiredDomains(record, workflow.contentClass).every((domain) => {
      const review = workflow.reviews[domain]
      return review && /^cms:[1-9]\d*$/.test(review.actor) && review.actor !== workflow.author
        && review.reference.trim() && Number.isFinite(Date.parse(review.at))
        && Date.parse(review.at) <= Date.parse(record.approval!.at) && Date.parse(review.at) <= now.getTime()
    }))
}
/** Internal, non-collecting specimen. Production use remains denied. */
export function controlledStatementView(
  inputs: readonly WorkflowDocument[], type: StatementType, locale: GovernedLocale, now: Date,
  mode?: 'controlled-fixture',
): StatementView {
  if (mode !== 'controlled-fixture' || !['privacy', 'accessibility'].includes(type)
    || !['en', 'am'].includes(locale) || !Number.isFinite(now.getTime())) return empty()
  try {
    const parsed = inputs.map((input) => validateGovernedRecord(input.record))
    if (parsed.some((result) => !result.ok)) return empty()
    const records = parsed.flatMap((result) => result.ok ? [result.record] : [])
    if (validateRecordSet(records).length) return empty()
    const matches = inputs.filter((doc) => doc.record.utilityStatement?.type === type
      && doc.record.status === 'published')
    if (matches.length !== 1) return empty()
    const doc = matches[0]
    const record = doc.record
    const statement = record.utilityStatement!
    if (!record.synthetic || !record.localized[locale] || !statement.localized[locale]
      || statementReadiness(statement, now, true).length || !signed(doc, now)) return empty()
    // A dependency failure withholds contact/service information but keeps the approved notice readable.
    const contact = statement.contact
    const settings = records.find((item) => item.publicId === contact.settingsPublicId)
    const fact = contact.fact && settings?.siteSettings?.[contact.fact]
    const contactCurrent = contact.state === 'bound' && fact && !statementDependencies(
      { ...record, utilityStatement: { ...statement, servicePublicIds: [] } }, records, now).length
    return { state: 'controlled-fixture', publicId: record.publicId, owner: record.owner, statement,
      contact: contactCurrent ? { state: 'controlled-fixture', value: fact.value }
        : { state: 'unavailable', value: null } }
  } catch { return empty() }
}
export type CollectionContractDecision = Readonly<{
  enabled: false; contractMatches: boolean
  reason: 'policy-unavailable' | 'version-mismatch' | 'inventory-mismatch' | 'feature-disabled' | 'dependency-unavailable' | 'controlled-only'
}>
/** Evaluates the notice contract only; it never authorizes or enables collection. */
export function controlledCollectionContract(
  inputs: readonly WorkflowDocument[], expectedPublicId: string, feature: CollectionFeature,
  inventory: ProcessingInventory, now: Date, mode?: 'controlled-fixture',
): CollectionContractDecision {
  const deny = (reason: CollectionContractDecision['reason']): CollectionContractDecision =>
    ({ enabled: false, contractMatches: false, reason })
  const view = controlledStatementView(inputs, 'privacy', 'en', now, mode)
  if (!view.statement || view.state !== 'controlled-fixture') return deny('policy-unavailable')
  if (view.publicId !== expectedPublicId) return deny('version-mismatch')
  if (!validateProcessingInventory(inventory) || canonical(inventory) !== canonical(view.statement.inventory)) return deny('inventory-mismatch')
  if (inventory.flows.find((flow) => flow.feature === feature)?.state !== 'planned') return deny('feature-disabled')
  const record = inputs.find((doc) => doc.record.publicId === view.publicId)!.record
  if (view.contact.state !== 'controlled-fixture'
    || statementDependencies(record, inputs.map((doc) => doc.record), now).length) return deny('dependency-unavailable')
  return { enabled: false, contractMatches: true, reason: 'controlled-only' }
}
export function ControlledStatementDetails(props: Readonly<{
  documents: readonly WorkflowDocument[]; type: StatementType; locale: GovernedLocale
  now: Date; mode?: 'controlled-fixture'
}>) {
  const view = controlledStatementView(props.documents, props.type, props.locale, props.now, props.mode)
  if (!view.statement) return createElement('p', { lang: 'en' }, 'Statement unavailable pending approval.')
  const statement = view.statement
  const details = statement.localized[props.locale]!
  const instant = (label: string, at: string) => createElement('p', { lang: 'en' }, label,
    createElement('time', { dateTime: at }, at.slice(0, 10)))
  return createElement('article', { lang: props.locale },
    createElement('p', { lang: 'en' }, 'Synthetic statement fixture — no hospital policy, certification or collection authority.'),
    props.locale === 'am' ? createElement('p', { lang: 'en' }, 'Unreviewed Amharic shaping fixture.') : null,
    createElement('h1', null, details.title),
    createElement('p', { lang: 'en' }, 'Version: ', statement.version, '. Accountable owner: ', view.owner),
    instant('Effective: ', statement.effectiveAt), instant('Reviewed: ', statement.reviewedAt!),
    instant('Review due: ', statement.reviewAt),
    createElement('nav', { 'aria-label': 'Statement sections' }, ...details.sections.map((section) =>
      createElement('a', { key: section.key, href: `#statement-${statement.type}-${section.key}` }, section.heading))),
    ...details.sections.map((section) => createElement('section', { key: section.key },
      createElement('h2', { id: `statement-${statement.type}-${section.key}` }, section.heading),
      createElement('p', null, section.body))),
    createElement('p', { lang: 'en' }, view.contact.value
      ? `Synthetic canonical contact (${statement.contact.purpose}): ${view.contact.value}`
      : 'Contact unavailable. No request or reporting channel is enabled.'),
    statement.inventory ? createElement('section', { lang: 'en' },
      createElement('h2', null, 'Synthetic processing inventory'),
      createElement('p', null, 'Personal-data collection and optional providers remain disabled.'),
      ...statement.inventory.flows.map((flow) => createElement('section', { key: flow.feature },
        createElement('h3', null, flow.feature), createElement('p', null, 'Contract state: ', flow.state),
        createElement('dl', null, ...(['purpose', 'categories', 'recipients', 'access', 'transport',
          'retention', 'deletion', 'choices'] as const).map((key) => createElement('div', { key },
          createElement('dt', null, key), createElement('dd', null, flow[key]))))))) : null,
    statement.testing ? createElement('section', { lang: 'en' },
      createElement('h2', null, 'Testing basis and known limitations'),
      instant('Tested: ', statement.testing.testedAt), createElement('p', null, statement.testing.scope),
      createElement('p', null, 'Limited testing only; no conformance certification.'),
      createElement('ul', null, ...statement.testing.methods.map((method) => createElement('li', { key: method }, method))),
      createElement('ul', null, ...statement.testing.limitations.map((limitation) => createElement('li', { key: limitation }, limitation)))) : null)
}
