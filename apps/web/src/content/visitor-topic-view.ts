import { createElement } from 'react'
import { canonical, type WorkflowDocument } from './cms-workflow.ts'
import { validateGovernedRecord, validateRecordSet, type GovernedLocale } from './governed-record.ts'
import { visitorPhases, type VisitorPhase, type VisitorPurpose } from './visitor-topic.ts'

export type VisitorTopicView = Readonly<{
  publicId: string; purpose: VisitorPurpose; title: string; body: string
  phase: VisitorPhase; taskOrder: number; temporary: boolean; reviewAt: string; expiresAt: string
}>
export type VisitorHub = Readonly<{
  state: 'unavailable' | 'controlled-fixture'
  groups: readonly Readonly<{ phase: VisitorPhase; topics: readonly VisitorTopicView[] }>[]
  fallback: Readonly<{ state: 'withheld'; reason: string }>
}>
const empty = (): VisitorHub => ({ state: 'unavailable', groups: [],
  fallback: { state: 'withheld', reason: 'Staffed contact details await canonical safety approval.' } })
/** Only complete synthetic persisted workflows supply internal guidance. No public route is mounted. */
export function controlledVisitorHub(
  inputs: readonly WorkflowDocument[], locale: GovernedLocale, now: Date, mode?: 'controlled-fixture',
): VisitorHub {
  if (mode !== 'controlled-fixture' || !['en', 'am'].includes(locale) || !Number.isFinite(now.getTime())) return empty()
  try {
    const parsed = inputs.map((input) => validateGovernedRecord(input.record))
    if (parsed.some((result) => !result.ok)) return empty()
    const records = parsed.flatMap((result) => result.ok ? [result.record] : [])
    if (validateRecordSet(records).length) return empty()
    const topics: VisitorTopicView[] = []
    for (const [index, record] of records.entries()) {
      const topic = record.visitorTopic
      const details = topic?.localized[locale]
      const workflow = inputs[index].workflow
      if (record.kind !== 'visitor-topic' || !record.synthetic || record.status !== 'published'
        || !topic || topic.disposition !== 'include' || !details?.body || !record.localized[locale]
        || !record.publishAt || Date.parse(record.publishAt) > now.getTime()
        || !record.reviewAt || Date.parse(record.reviewAt) <= now.getTime()
        || !record.expiresAt || Date.parse(record.expiresAt) <= now.getTime()
        || !record.approval || !record.domainApproval || record.owner !== workflow.author
        || record.approval.actor !== record.reviewer || record.approval.actor === workflow.author
        || !Number.isInteger(workflow.revision) || workflow.revision < 1
        || Date.parse(record.approval.at) > now.getTime()) continue
      const reviews = workflow.reviews
      if (canonical(record.domainApproval) !== canonical({ ...reviews.operations, domain: 'operations' })
        || ['operations', 'privacy', 'legal'].some((domain) => {
          const review = reviews[domain as keyof typeof reviews]
          return !review || !/^cms:[1-9]\d*$/.test(review.actor) || review.actor === workflow.author
            || !review.reference?.trim() || !Number.isFinite(Date.parse(review.at))
            || Date.parse(review.at) > now.getTime() || Date.parse(review.at) > Date.parse(record.approval!.at)
        })) continue
      topics.push({ publicId: record.publicId, purpose: topic.purpose, phase: topic.phase,
        title: details.title, body: details.body, taskOrder: topic.taskOrder,
        temporary: topic.temporary, reviewAt: record.reviewAt, expiresAt: record.expiresAt })
    }
    const groups = visitorPhases.flatMap((phase) => {
      const entries = topics.filter((topic) => topic.phase === phase)
        .sort((a, b) => a.taskOrder - b.taskOrder || a.publicId.localeCompare(b.publicId))
      return entries.length ? [{ phase, topics: entries }] : []
    })
    return groups.length ? { ...empty(), state: 'controlled-fixture', groups } : empty()
  } catch { return empty() }
}
/** Inert semantic specimen: no links, contact actions, forms, media or scripts. */
export function ControlledVisitorHub(props: Readonly<{
  documents: readonly WorkflowDocument[]; locale: GovernedLocale; now: Date; mode?: 'controlled-fixture'
}>) {
  const hub = controlledVisitorHub(props.documents, props.locale, props.now, props.mode)
  if (hub.state === 'unavailable') return createElement('p', { lang: 'en' }, 'Visitor guidance is unavailable pending approval. Staffed contact details are withheld.')
  const groups = hub.groups.map((group) => {
    const articles = group.topics.map((topic) => createElement('article', { key: topic.publicId },
      createElement('h3', null, topic.title), createElement('p', null, topic.body),
      createElement('p', { lang: 'en' }, 'Review due: ', createElement('time', { dateTime: topic.reviewAt }, topic.reviewAt.slice(0, 10))),
      createElement('p', { lang: 'en' }, 'Expires: ', createElement('time', { dateTime: topic.expiresAt }, topic.expiresAt.slice(0, 10)))))
    return createElement('section', { key: group.phase, 'data-visitor-phase': group.phase },
      createElement('h2', { lang: 'en' }, { before: 'Before a visit', during: 'During a visit', after: 'After a visit' }[group.phase]),
      ...articles)
  })
  return createElement('section', { lang: props.locale, 'data-visitor-state': 'controlled-fixture' },
    createElement('p', { lang: 'en' }, 'Synthetic visitor guidance fixture — no real hospital policy or advice.'),
    props.locale === 'am' ? createElement('p', { lang: 'en' }, 'Unreviewed Amharic shaping fixture.') : null,
    ...groups, createElement('p', { lang: 'en' }, hub.fallback.reason))
}
