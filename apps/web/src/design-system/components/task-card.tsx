import { useId } from 'react'

import { Icon, type IconName } from './icon'
import styles from './task-card.module.css'

export interface TaskCardProps {
  readonly href: string
  readonly label: string
  readonly description: string
  readonly icon: IconName
}

export function TaskCard({ href, label, description, icon }: TaskCardProps) {
  const descriptionId = useId()

  return (
    <a aria-label={label} aria-describedby={descriptionId} className={styles.card} data-action-link data-task-card href={href}>
      <span className={styles.symbol}><Icon name={icon} /></span>
      <span className={styles.title}>{label}</span>
      <span className={styles.description} id={descriptionId}>{description}</span>
      <span className={styles.cue}><Icon name="arrow-right" /></span>
    </a>
  )
}
