import { canonicalContactView, type ContactView } from './canonical-contact-view.ts'
import { canonical, type WorkflowDocument } from './cms-workflow.ts'
import { discoveryDocuments } from './governed-discovery.ts'
import type { GovernedLocale } from './governed-record.ts'

/** Internal synthetic projection only. No cache or public safety authorization. */
export function homeContactView(
  inputs: readonly WorkflowDocument[], locale: GovernedLocale, now: Date,
  mode?: 'controlled-fixture',
): ContactView {
  const unavailable: ContactView = { state: 'unavailable', facts: [] }
  if (mode !== 'controlled-fixture' || !['en', 'am'].includes(locale)
    || !Number.isFinite(now.getTime())) return unavailable
  try {
    const documents = discoveryDocuments(inputs)
    const matches = documents?.filter((doc) => doc.record.kind === 'site-settings'
      && !['expired', 'withdrawn'].includes(doc.record.status))
    if (matches?.length !== 1) return unavailable
    const { record, workflow } = matches[0]
    const review = workflow.reviews.operations
    const verification = workflow.verification
    const publish = [...record.audit].reverse().find((entry) => entry.change === 'publish')
    const beforeNow = (at: string | null | undefined) => !!at
      && Number.isFinite(Date.parse(at)) && Date.parse(at) <= now.getTime()
    if (!record.synthetic || record.status !== 'published' || !record.localized[locale]
      || !record.publishAt || !beforeNow(record.publishAt) || !record.reviewAt
      || Date.parse(record.reviewAt) <= now.getTime() || !record.expiresAt
      || Date.parse(record.expiresAt) <= now.getTime() || workflow.contentClass !== 'contact'
      || !Number.isSafeInteger(workflow.revision) || workflow.revision <= 0
      || record.owner !== workflow.author || !/^cms:[1-9]\d*$/u.test(workflow.author)
      || !record.approval || record.reviewer !== record.approval.actor
      || !/^cms:[1-9]\d*$/u.test(record.approval.actor)
      || record.approval.actor === workflow.author || !beforeNow(record.approval.at)
      || !review || !/^cms:[1-9]\d*$/u.test(review.actor)
      || review.actor === workflow.author || review.actor === record.approval.actor
      || !review.reference.trim() || !beforeNow(review.at)
      || Date.parse(review.at) > Date.parse(record.approval.at)
      || canonical(record.domainApproval) !== canonical({ ...review, domain: 'operations' })
      || !verification || !/^cms:[1-9]\d*$/u.test(verification.actor)
      || verification.actor === workflow.author || !verification.reference.trim()
      || !beforeNow(verification.at) || !publish || !beforeNow(publish.at)
      || Date.parse(verification.at) < Date.parse(publish.at)) return unavailable
    const view = canonicalContactView(record, locale, now, mode)
    // A partially translated contact set must not make arrival/purpose meaning ambiguous.
    return view.facts.length === Object.keys(record.siteSettings ?? {}).length ? view : unavailable
  } catch { return unavailable }
}
