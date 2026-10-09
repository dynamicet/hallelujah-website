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
  readonly contactDetails?: ReactNode
  readonly description: string
  readonly eyebrow: string
  readonly media?: {
    readonly placement: 'hero' | 'story'
    readonly presentation: OptInMediaProps
  }
  readonly governedContent?: ReactNode
  readonly shell: Omit<SiteShellProps, 'breadcrumbs' | 'children'>
  readonly tasks: HomeTaskLinks
  readonly tasksHeading: string
  readonly title: string
  readonly searchDescription: string
  readonly searchHeading: string
}

// Content adapters own approval and destination availability. This composition performs
// no data fetch, contact substitution, feature selection, or publication decision.
export function HomeTemplate({
  contactDetails,
  description,
  eyebrow,
  governedContent,
  media,
  shell,
  tasks,
  tasksHeading,
  title,
  searchDescription,
  searchHeading,
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
              <EmergencyAction href={tasks.emergency.href} label={tasks.emergency.label} />
            </div>
          </div>
          {media?.placement === 'hero' ? (
            <div className={styles.media} data-home-media="hero">
              <OptInMedia {...media.presentation} />
              <noscript><p>Video playback requires JavaScript. The written still and transcript remain available.</p></noscript>
            </div>
          ) : (
            <div aria-hidden="true" className={styles.orientation} data-home-abstract-plane />
          )}
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

        {governedContent}

        {media?.placement === 'story' ? (
          <section aria-label={media.presentation.heading} className={`${styles.section} ${styles.story}`} data-home-section="H8">
            <div className={styles.media} data-home-media="story">
              <OptInMedia {...media.presentation} />
              <noscript><p>Video playback requires JavaScript. The written still and transcript remain available.</p></noscript>
            </div>
          </section>
        ) : null}
        {contactDetails ? (
          <div className={`${styles.section} ${styles.support}`} data-home-section="H9" data-experience-level="0">
            {contactDetails}
          </div>
        ) : null}
      </div>
      <script data-motion-media-script defer src="/motion-media.js" />
    </SiteShell>
  )
}
