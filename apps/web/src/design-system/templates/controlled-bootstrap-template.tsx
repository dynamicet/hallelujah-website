import type { ReactNode } from 'react'

import { StatusSummary, type StatusSummaryItem } from '../components'
import { ContentSurface, PageFrame } from '../primitives'

import styles from './controlled-bootstrap-template.module.css'

export interface ControlledBootstrapTemplateProps {
  readonly children?: ReactNode
  readonly description: string
  readonly eyebrow: string
  readonly statuses: readonly StatusSummaryItem[]
  readonly title: string
  readonly withinShell?: boolean
}

export function ControlledBootstrapTemplate({
  children,
  description,
  eyebrow,
  statuses,
  title,
  withinShell = false,
}: ControlledBootstrapTemplateProps) {
  const titleId = 'bootstrap-title'
  const content = (
    <div className={styles.frame}>
      <div className={styles.surface}>
        <ContentSurface labelledBy={titleId}>
          <p className={styles.eyebrow}>{eyebrow}</p>
          <h1 className={styles.title} id={titleId}>
            {title}
          </h1>
          <p className={styles.description}>{description}</p>
          <div className={styles.statusSummary}>
            <StatusSummary items={statuses} />
          </div>
          {children}
        </ContentSurface>
      </div>
    </div>
  )

  return withinShell ? content : <PageFrame>{content}</PageFrame>
}
