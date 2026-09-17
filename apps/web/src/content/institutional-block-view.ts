import { createElement } from 'react'
import { canonical, requiredDomains, type WorkflowDocument } from './cms-workflow.ts'
import { validateGovernedRecord, validateRecordSet, type GovernedLocale } from './governed-record.ts'
import { institutionalReadiness, type InstitutionalBlock } from './institutional-block.ts'

export type InstitutionalView = Readonly<{
  state: 'unavailable' | 'controlled-fixture'
  blocks: readonly Readonly<{ publicId: string; title: string; body: string; block: InstitutionalBlock }>[]
}>
const empty = (): InstitutionalView => ({ state: 'unavailable', blocks: [] })
/** Internal specimen only. Missing or expired blocks leave no empty sections. */
export function controlledInstitutionalView(
  inputs: readonly WorkflowDocument[], locale: GovernedLocale, now: Date, mode?: 'controlled-fixture',
): InstitutionalView {
  if (mode !== 'controlled-fixture' || !['en', 'am'].includes(locale) || !Number.isFinite(now.getTime())) return empty()
  try {
    const parsed = inputs.map((input) => validateGovernedRecord(input.record))
    if (parsed.some((result) => !result.ok)) return empty()
    const records = parsed.flatMap((result) => result.ok ? [result.record] : [])
    if (validateRecordSet(records).length) return empty()
    const blocks: InstitutionalView['blocks'][number][] = []
    for (const [index, record] of records.entries()) {
      const block = record.institutionalBlock
      const details = block?.localized[locale]
      const workflow = inputs[index].workflow
      if (record.kind !== 'institutional-block' || !record.synthetic || record.status !== 'published'
        || !block || !details?.body || !record.localized[locale] || institutionalReadiness(block, now).length
        || !record.publishAt || Date.parse(record.publishAt) > now.getTime()
        || !record.reviewAt || Date.parse(record.reviewAt) <= now.getTime()
        || !record.expiresAt || Date.parse(record.expiresAt) <= now.getTime()
        || !record.approval || !record.domainApproval || record.owner !== workflow.author
        || record.approval.actor !== record.reviewer || record.approval.actor === workflow.author
        || !/^cms:[1-9]\d*$/.test(record.approval.actor)
        || !Number.isInteger(workflow.revision) || workflow.revision < 1
        || Date.parse(record.approval.at) > now.getTime()
        || block.evidence?.reviewedAt !== workflow.reviews.content?.at
        || canonical(record.domainApproval) !== canonical({ ...workflow.reviews.content, domain: 'content' })
        || requiredDomains(record, workflow.contentClass).some((domain) => {
          const review = workflow.reviews[domain]
          return !review || !/^cms:[1-9]\d*$/.test(review.actor) || review.actor === workflow.author
            || !review.reference?.trim() || !Number.isFinite(Date.parse(review.at))
            || Date.parse(review.at) > now.getTime() || Date.parse(review.at) > Date.parse(record.approval!.at)
        })) continue
      blocks.push({ publicId: record.publicId, title: details.title, body: details.body, block })
    }
    blocks.sort((a, b) => a.block.type.localeCompare(b.block.type) || a.publicId.localeCompare(b.publicId))
    return blocks.length ? { state: 'controlled-fixture', blocks } : empty()
  } catch { return empty() }
}
export function ControlledInstitutionalView(props: Readonly<{
  documents: readonly WorkflowDocument[]; locale: GovernedLocale; now: Date; mode?: 'controlled-fixture'
}>) {
  const view = controlledInstitutionalView(props.documents, props.locale, props.now, props.mode)
  if (view.state === 'unavailable') return createElement('p', { lang: 'en' }, 'Institutional information is unavailable pending approval.')
  return createElement('section', { lang: props.locale },
    createElement('p', { lang: 'en' }, 'Synthetic institutional fixture — no real hospital claims or relationships.'),
    props.locale === 'am' ? createElement('p', { lang: 'en' }, 'Unreviewed Amharic shaping fixture.') : null,
    ...view.blocks.map(({ publicId, title, body, block }) => createElement('article', { key: publicId },
      createElement('h2', null, title), createElement('p', null, body),
      block.leadership ? createElement('p', null, block.leadership.name, ' — ', block.leadership.role) : null,
      block.relationship ? createElement('p', { lang: 'en' }, block.relationship.name, ': ',
        block.relationship.meaning, '. Insurance coverage is unverified; no coverage is represented.') : null,
      createElement('p', { lang: 'en' }, 'Defined scope: ', block.evidence!.definition),
      createElement('p', { lang: 'en' }, 'Limitations: ', block.evidence!.limitations),
      createElement('p', { lang: 'en' }, 'As of: ', createElement('time', { dateTime: block.evidence!.asOf }, block.evidence!.asOf.slice(0, 10))))))
}
