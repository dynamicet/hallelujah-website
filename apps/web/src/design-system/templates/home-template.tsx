import type { ReactNode } from 'react'

import {
  ActionGroup,
  ActionLink,
  EmergencyAction,
  ExperienceRegion,
  MotionAccent,
  OptInMedia,
  SiteShell,
  type NavigationItem,
  type OptInMediaProps,
  type SiteShellProps,
} from '../components'

import styles from './home-template.module.css'

export interface HomeTaskLinks {
  readonly appointment: NavigationItem
  readonly call: NavigationItem
  readonly directions: NavigationItem
  readonly doctor: NavigationItem
  readonly emergency: NavigationItem
  readonly service: NavigationItem
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
  media,
  shell,
  tasks,
  tasksHeading,
  title,
  searchDescription,
  searchHeading,
}: HomeTemplateProps) {
  const routineTasks = [tasks.doctor, tasks.service, tasks.appointment, tasks.call, tasks.directions]

  return (
    <SiteShell {...shell}>
      <div className={styles.frame} data-home-template>
        <section aria-labelledby="home-title" className={styles.introduction} data-home-section="H1">
          <div className="ds-flow ds-reading">
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
          <ExperienceRegion area="home-hero" requestedLevel={3}>
            <MotionAccent level={3} />
          </ExperienceRegion>
          {media?.placement === 'hero' ? (
            <div className={styles.media} data-home-media="hero">
              <OptInMedia {...media.presentation} />
              <noscript><p>Video playback requires JavaScript. The written still and transcript remain available.</p></noscript>
            </div>
          ) : null}
        </section>

        <section aria-labelledby="home-tasks-title" className={styles.section} data-home-section="H2">
          <h2 id="home-tasks-title">{tasksHeading}</h2>
          <ul className={styles.tasks}>
            {routineTasks.map((task) => (
              <li key={`${task.href}-${task.label}`}>
                <ActionLink href={task.href} label={task.label} variant="secondary" />
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="home-search-title" className={styles.section} data-home-section="H3">
          <div className="ds-flow ds-reading">
            <h2 id="home-search-title">{searchHeading}</h2>
            <p>{searchDescription}</p>
            <ActionLink href={tasks.search.href} label={tasks.search.label} variant="tertiary" />
          </div>
        </section>

        {media?.placement === 'story' ? (
          <section aria-label={media.presentation.heading} className={styles.section} data-home-section="H8">
            <div className={styles.media} data-home-media="story">
              <OptInMedia {...media.presentation} />
              <noscript><p>Video playback requires JavaScript. The written still and transcript remain available.</p></noscript>
            </div>
          </section>
        ) : null}
        {contactDetails ? (
          <div className={styles.section} data-home-section="H9" data-experience-level="0">
            {contactDetails}
          </div>
        ) : null}
      </div>
      <script data-motion-media-script defer src="/motion-media.js" />
    </SiteShell>
  )
}
