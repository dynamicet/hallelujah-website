import type { ExpressiveLevel } from '../contracts'

import styles from './experience-region.module.css'

export interface MotionAccentProps {
  readonly level: Extract<ExpressiveLevel, 2 | 3>
}

export function MotionAccent({ level }: MotionAccentProps) {
  return (
    <span
      aria-hidden="true"
      className={styles.accent}
      data-motion-accent
      data-motion-enabled="false"
      data-motion-level={level}
    />
  )
}
