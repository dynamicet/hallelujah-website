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
  readonly showJourneyGuidance?: boolean
  readonly showSupportBand?: boolean
}

export function HomeVisitGuidance() {
  const stages = [
    ['Before', 'Prepare for your visit', 'Review what to bring and how to prepare.'],
    ['During', 'Navigate your visit', 'Understand arrival and on-site support.'],
    ['After', 'Understand next steps', 'Find follow-up and continuing-care guidance.'],
  ] as const

  return (
    <section aria-labelledby="home-visit-title" className={`${styles.section} ${styles.visit}`} data-home-section="H6">
      <div className={styles.sectionHeading}>
        <p className={styles.eyebrow}>Patient journey guidance</p>
        <h2 id="home-visit-title">Plan your visit</h2>
      </div>
      <div className={styles.visitGrid}>
        {stages.map(([stage, heading, description]) => (
          <article className={styles.visitCard} key={stage}>
            <p className={styles.stage}>{stage}</p>
            <h3>{heading}</h3>
            <p>{description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export function HomeSupportBand({ href }: { readonly href: string }) {
  return (
    <section aria-labelledby="home-support-title" className={styles.supportBand} data-home-section="H9">
      <div>
        <h2 id="home-support-title">Need help choosing?</h2>
        <p>Use the hospital contact route for staffed guidance.</p>
      </div>
      <ActionLink href={href} label="Contact the hospital" variant="secondary" />
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
  governedContent,
  institutionalContent,
  media,
  shell,
  tasks,
  tasksHeading,
  title,
  searchDescription,
  searchHeading,
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
          {media?.placement === 'hero' ? (
            <div className={styles.media} data-home-media="hero">
              <OptInMedia {...media.presentation} />
              <noscript><p>Video playback requires JavaScript. The written still and transcript remain available.</p></noscript>
            </div>
          ) : null}
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
          <div className="ds-flow ds-reading">
            <h2 id="home-search-title">{searchHeading}</h2>
            <p>{searchDescription}</p>
            <ActionLink href={tasks.search.href} label={tasks.search.label} variant="tertiary" />
          </div>
        </section>

        {careContent ?? governedContent}

        {showJourneyGuidance ? <HomeVisitGuidance /> : null}

        {contactDetails ? (
          <section aria-label="Contact and arrival information" className={`${styles.section} ${styles.contact}`} data-home-section="H7" data-experience-level="0">
            <div className={styles.contactContent}>{contactDetails}</div>
            <div aria-hidden="true" className={styles.arrivalPlane} />
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
      <script data-motion-media-script defer src="/motion-media.js" />
    </SiteShell>
  )
}
