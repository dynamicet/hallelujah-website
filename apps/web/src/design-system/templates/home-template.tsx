import { InterfaceText } from '@/website/interface-language'
import type { ReactNode } from 'react'

import {
  ActionGroup,
  ActionLink,
  EmergencyAction,
  ExperienceRegion,
  MotionAccent,
  OptInMedia,
  SiteShell,
  TaskCard,
  type IconName,
  type NavigationItem,
  type OptInMediaProps,
  type SiteShellProps,
} from '../components'

import styles from './home-template.module.css'

export interface HomeTaskLink extends NavigationItem {
  readonly description?: string
}

export interface HomeTaskLinks {
  readonly appointment: HomeTaskLink
  readonly call: HomeTaskLink
  readonly directions: HomeTaskLink
  readonly doctor: HomeTaskLink
  readonly emergency: NavigationItem
  readonly service: HomeTaskLink
  readonly search: NavigationItem
}

export interface HomeTemplateProps {
  readonly careContent?: ReactNode
  readonly contactDetails?: ReactNode
  readonly description: string
  readonly eyebrow: string
  readonly heroArtwork?: ReactNode
  readonly media?: {
    readonly placement: 'hero' | 'story'
    readonly presentation: OptInMediaProps
  }
  /** @deprecated Use careContent and institutionalContent so H4-H9 stay in source order. */
  readonly governedContent?: ReactNode
  readonly institutionalContent?: ReactNode
  readonly shell: Omit<SiteShellProps, 'breadcrumbs' | 'children'>
  readonly tasks: HomeTaskLinks
  readonly tasksHeading: string
  readonly title: string
  readonly searchDescription: string
  readonly searchHeading: string
  readonly searchAction?: string
  readonly showArrivalArtwork?: boolean
  readonly showJourneyGuidance?: boolean
  readonly showSupportBand?: boolean
}

export function HomeVisitGuidance({ appointmentHref, directionsHref }: { readonly appointmentHref: string; readonly directionsHref: string }) {
  const stages = [
    ['Before', 'Prepare for your visit', 'Check the appointment details you have, note questions to ask, and bring any records you have been asked to share.'],
    ['During', 'Navigate your visit', 'Use the arrival information below to identify the example entrance. Ask the reception team where to go for your visit.'],
    ['After', 'Understand next steps', 'Keep the instructions given during your visit and check whom to contact if a follow-up is needed.'],
  ] as const

  return (
    <section aria-labelledby="home-visit-title" className={`${styles.section} ${styles.visit}`} data-home-section="H6">
      <div className={styles.sectionHeading}>
        <p className={styles.eyebrow}>Patient journey guidance</p>
        <h2 id="home-visit-title">A more comfortable visit.</h2>
      </div>
      <div className={styles.visitGrid}>
        {stages.map(([stage, heading, description]) => (
          <article className={styles.visitCard} key={stage}>
            <p className={styles.stage}>{stage}</p>
            <h3>{heading}</h3>
            <p>{description}</p>
            <a href={stage === 'Before' ? appointmentHref : directionsHref}>
              {stage === 'Before' ? 'Review the request journey' : 'Review arrival information'}
            </a>
          </article>
        ))}
      </div>
    </section>
  )
}

export function HomeSupportBand({ href }: { readonly href: string }) {
  return (
    <section aria-labelledby="home-support-title" className={`${styles.supportBand} ds-support-band`} data-home-section="H9">
      <div>
        <h2 id="home-support-title">Let’s make the first conversation easier.</h2>
        <p>Review contact and arrival information before choosing your next step.</p>
      </div>
      <ActionLink href={href} label="Review contact information" variant="secondary" />
    </section>
  )
}

// Content adapters own approval and destination availability. This composition performs
// no data fetch, contact substitution, feature selection, or publication decision.
export function HomeTemplate({
  careContent,
  contactDetails,
  description,
  eyebrow,
  heroArtwork,
  governedContent,
  institutionalContent,
  media,
  shell,
  tasks,
  tasksHeading,
  title,
  searchDescription,
  searchHeading,
  searchAction,
  showArrivalArtwork = false,
  showJourneyGuidance = false,
  showSupportBand = false,
}: HomeTemplateProps) {
  const routineTasks: readonly { link: HomeTaskLink; icon: IconName; description: string }[] = [
    { link: tasks.doctor, icon: 'person', description: 'Browse clinician information' },
    { link: tasks.service, icon: 'care', description: 'Browse service information' },
    { link: tasks.appointment, icon: 'calendar', description: 'Review how to request care' },
    { link: tasks.call, icon: 'phone', description: 'Review contact information' },
    { link: tasks.directions, icon: 'directions', description: 'Review arrival information' },
  ]

  return (
    <SiteShell {...shell}>
      <div className={styles.frame} data-home-template>
        <section aria-labelledby="home-title" className={styles.introduction} data-home-section="H1">
          <div className={`ds-flow ${styles.heroCopy}`}>
            <div className={styles.wayfinding}>
              <ExperienceRegion area="home-hero" requestedLevel={3}>
                <MotionAccent level={3} />
              </ExperienceRegion>
            </div>
            <p className={styles.eyebrow}>{eyebrow}</p>
            <h1 id="home-title">{title}</h1>
            <p className={styles.description}>{description}</p>
            <ActionGroup>
              <ActionLink href={tasks.appointment.href} label={tasks.appointment.label} />
              <ActionLink href={tasks.doctor.href} label={tasks.doctor.label} variant="secondary" />
            </ActionGroup>
            <div data-experience-level="0" data-protected-context="emergency">
              <EmergencyAction compact href={tasks.emergency.href} label={tasks.emergency.label} />
            </div>
          </div>
          {heroArtwork ?? (media?.placement === 'hero' ? (
            <div className={styles.media} data-home-media="hero">
              <OptInMedia {...media.presentation} />
              <noscript><p>Video playback requires JavaScript. The written still and transcript remain available.</p></noscript>
            </div>
          ) : null)}
        </section>

        <section aria-labelledby="home-tasks-title" className={`${styles.section} ${styles.taskSection}`} data-home-section="H2">
          <h2 id="home-tasks-title">{tasksHeading}</h2>
          <ul className={styles.tasks}>
            {routineTasks.map(({ link, icon, description }) => (
              <li key={`${link.href}-${link.label}`}>
                <TaskCard href={link.href} label={link.label} icon={icon}
                  description={link.description ?? description} />
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="home-search-title" className={`${styles.section} ${styles.search}`} data-home-section="H3">
          <div className={styles.searchIntroduction}>
            <h2 id="home-search-title">{searchHeading}</h2>
            <p>{searchDescription}</p>
          </div>
          {searchAction ? (
            <form action={searchAction} className={styles.searchForm} method="get" role="search">
              <div className={styles.searchField}>
                <label htmlFor="home-search-query">Search doctors by name or area of care</label>
                <input aria-describedby="home-search-hint" autoComplete="off" id="home-search-query"
                  maxLength={120} name="q" type="search" />
                <p id="home-search-hint">Use a care term or doctor name. Do not enter personal or medical details.</p>
              </div>
              <button className="ds-touch-target" type="submit"><InterfaceText>Search doctors</InterfaceText></button>
            </form>
          ) : <ActionLink href={tasks.search.href} label={tasks.search.label} variant="tertiary" />}
        </section>

        {careContent ?? governedContent}

        {showJourneyGuidance ? <HomeVisitGuidance appointmentHref={tasks.appointment.href} directionsHref={tasks.directions.href} /> : null}

        {contactDetails ? (
          <section aria-label="Contact and arrival information" className={`${styles.section} ${styles.contact}`} data-home-section="H7" data-experience-level="0">
            <div className={styles.contactContent}>{contactDetails}</div>
            {showArrivalArtwork ? <div aria-hidden="true" className={styles.arrivalPlane} data-home-arrival-artwork>
              <span className={styles.arrivalRoute} />
              <span className={`${styles.arrivalStation} ${styles.arrivalStationFirst}`}>Plan</span>
              <span className={`${styles.arrivalStation} ${styles.arrivalStationSecond}`}>Arrive</span>
              <span className={`${styles.arrivalStation} ${styles.arrivalStationThird}`}>Ask</span>
            </div> : null}
          </section>
        ) : null}

        {institutionalContent}

        {media?.placement === 'story' ? (
          <section aria-label={media.presentation.heading} className={`${styles.section} ${styles.story}`} data-home-section="H8">
            <div className={styles.media} data-home-media="story">
              <OptInMedia {...media.presentation} />
              <noscript><p>Video playback requires JavaScript. The written still and transcript remain available.</p></noscript>
            </div>
          </section>
        ) : null}
        {showSupportBand ? <HomeSupportBand href={tasks.call.href} /> : null}
      </div>
    </SiteShell>
  )
}
