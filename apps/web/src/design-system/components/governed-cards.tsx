import type { GovernedKind, GovernedLocale, GovernedRecord } from '../../content/governed-record'
import { publicEligibility, validateGovernedRecord } from '../../content/governed-record'
import Image from 'next/image'

import styles from './governed-cards.module.css'

type CardKind = Exclude<GovernedKind, 'page' | 'site-settings' | 'visitor-topic'>

export type GovernedCardContent =
  | Readonly<{
      kind: 'doctor'
      specialty: string
      credentials?: string
      location?: string
      language?: string
      portrait?: Readonly<{ src: string; rightsApproved: true }>
    }>
  | Readonly<{
      kind: 'service'
      summary: string
      group?: string
      synonym?: string
    }>
  | Readonly<{
      kind: 'location'
      contact: Readonly<{ purpose: string; value: string }>
      address: string
      hours?: string
    }>
  | Readonly<{
      kind: 'vacancy'
      team: string
      location: string
      employmentType: string
      closesAt: Readonly<{ dateTime: string; label: string }>
      responsibilities: string
      criteria: string
      applicationProcess: string
      privacyHref: string
      privacyApproved?: true
      applyHref?: string
      applicationApproved?: true
    }>

export interface GovernedCardReview {
  readonly authorized: true
  readonly reviewer: string
  readonly reviewedAt: Readonly<{ dateTime: string; label: string }>
}

export interface GovernedCardProps {
  readonly content: GovernedCardContent
  readonly href: string
  readonly locale: GovernedLocale
  readonly mode?: 'controlled-fixture'
  readonly now: Date
  readonly record: GovernedRecord
  readonly review?: GovernedCardReview
}

function nonempty(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

function safeHref(href: string, fixture: boolean): boolean {
  return fixture ? /^#[a-z][a-z0-9-]*$/u.test(href) : /^\/(?!\/)[^?#\s]*\/?$/u.test(href)
}

function complete(content: GovernedCardContent, fixture: boolean): boolean {
  switch (content.kind) {
    case 'doctor': return nonempty(content.specialty)
    case 'service': return nonempty(content.summary)
    case 'location': return nonempty(content.contact?.purpose)
      && nonempty(content.contact?.value) && nonempty(content.address)
    case 'vacancy': return [
      content.team, content.location, content.employmentType, content.closesAt?.label,
      content.responsibilities, content.criteria, content.applicationProcess,
    ].every(nonempty) && Number.isFinite(Date.parse(content.closesAt?.dateTime ?? ''))
      && safeHref(content.privacyHref, fixture)
      && (fixture || (content.privacyApproved === true
        && content.applicationApproved === true
        && nonempty(content.applyHref) && safeHref(content.applyHref, false)))
  }
}

/** The public default fails closed; only visibly synthetic fixtures may show unavailable specimens. */
export function GovernedCard({
  content, href, locale, mode, now, record, review,
}: GovernedCardProps) {
  const validated = validateGovernedRecord(record)
  if (!validated.ok || content.kind !== record.kind || !Number.isFinite(now.getTime())) return null
  const title = validated.record.localized[locale]?.title
  if (!nonempty(title)) return null

  if (mode === 'controlled-fixture' && !record.synthetic) return null
  const fixture = mode === 'controlled-fixture'
  const retired = record.status === 'expired' || record.status === 'withdrawn'
    || (record.expiresAt !== null && Date.parse(record.expiresAt) <= now.getTime())
  const current = fixture
    ? record.status === 'published' && !retired
    : publicEligibility(record, now).eligible

  if (!fixture && !current) return null
  if (!fixture && (!complete(content, false) || !safeHref(href, false))) return null

  const available = current && complete(content, fixture) && safeHref(href, fixture)
    && (content.kind !== 'vacancy'
      || Date.parse(content.closesAt.dateTime) > now.getTime())
  const state = available ? 'current' : retired ? 'expired' : 'unavailable'
  const action = content.kind === 'location' ? 'Text directions'
    : content.kind === 'vacancy' ? 'Vacancy details'
      : content.kind === 'doctor' ? 'Profile' : 'Service details'

  return (
    <article className={styles.card} data-card-kind={content.kind} data-card-state={state}
      data-controlled-fixture={fixture ? 'true' : undefined}>
      {fixture ? <p className={styles.fixture}>Synthetic, non-public specimen</p> : null}
      <h3 className={styles.title} lang={locale}>
        {available ? <a className={styles.titleLink} href={href}>{title}</a> : title}
      </h3>
      {!available ? (
        <p className={styles.state} data-card-retired>{retired ? 'Expired or withdrawn' : 'Unavailable'}. No action is available.</p>
      ) : (
        <>
          {content.kind === 'doctor' ? (
            <>
              <div className={styles.neutralMedia} aria-hidden="true">
                {content.portrait?.rightsApproved && safeHref(content.portrait.src, false)
                  ? <Image alt="" height={96} src={content.portrait.src} width={128} />
                  : <span>Portrait withheld</span>}
              </div>
              <p className={styles.primary}>{content.specialty}</p>
              <OptionalFacts facts={[
                ['Credentials', content.credentials], ['Location', content.location],
                ['Language', content.language],
              ]} />
            </>
          ) : null}
          {content.kind === 'service' ? (
            <>
              <p className={styles.primary}>{content.summary}</p>
              <OptionalFacts facts={[
                ['Group', content.group], ['Also known as', content.synonym],
              ]} />
            </>
          ) : null}
          {content.kind === 'location' ? (
            <>
              <p className={styles.primary}>{content.contact.purpose}: {content.contact.value}</p>
              <p>{content.address}</p>
              <OptionalFacts facts={[["Hours", content.hours]]} />
            </>
          ) : null}
          {content.kind === 'vacancy' ? (
            <>
              <OptionalFacts facts={[
                ['Team', content.team], ['Location', content.location],
                ['Employment type', content.employmentType],
              ]} />
              <p>Closes: <time dateTime={content.closesAt.dateTime}>{content.closesAt.label}</time></p>
              <p>Responsibilities: {content.responsibilities}</p>
              <p>Criteria: {content.criteria}</p>
              <p>Application process: {content.applicationProcess}</p>
              <p><a href={content.privacyHref}>Recruitment privacy information</a></p>
              {!fixture && content.privacyApproved === true
                && content.applicationApproved === true && content.applyHref
                && safeHref(content.applyHref, false)
                ? <p><a href={content.applyHref}>Apply through the approved route</a></p> : null}
            </>
          ) : null}
          <p className={styles.destination} aria-hidden="true">{action} →</p>
          {review?.authorized && nonempty(review.reviewer)
            && Number.isFinite(Date.parse(review.reviewedAt.dateTime))
            && Date.parse(review.reviewedAt.dateTime) <= now.getTime() ? (
              <p className={styles.review} data-card-review>
                {fixture ? 'Synthetic review specimen'
                  : content.kind === 'doctor' || content.kind === 'service'
                    ? 'Medically reviewed' : 'Information last checked'} by {review.reviewer} on{' '}
                <time dateTime={review.reviewedAt.dateTime}>{review.reviewedAt.label}</time>.
              </p>
            ) : null}
          {record.reviewAt ? <p className={styles.review}>Review due: <time dateTime={record.reviewAt}>{record.reviewAt.slice(0, 10)}</time></p> : null}
        </>
      )}
    </article>
  )
}

function OptionalFacts({ facts }: { readonly facts: readonly (readonly [string, string | undefined])[] }) {
  const present = facts.filter(([, value]) => nonempty(value))
  if (present.length === 0) return null
  return <dl className={styles.facts}>{present.map(([label, value]) => (
    <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
  ))}</dl>
}

export type GovernedCardKind = CardKind
