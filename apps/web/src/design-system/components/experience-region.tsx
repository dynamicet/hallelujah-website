import type { ReactNode } from 'react'

import {
  resolveExperienceLevel,
  type ExperienceArea,
  type ExpressiveLevel,
  type ProtectedExperienceContext,
} from '../contracts'

import styles from './experience-region.module.css'

export interface ExperienceRegionProps {
  readonly area: ExperienceArea
  readonly children: ReactNode
  readonly className?: string
  readonly protectedContext?: ProtectedExperienceContext
  readonly requestedLevel: ExpressiveLevel
}

export function ExperienceRegion({
  area,
  children,
  className,
  protectedContext,
  requestedLevel,
}: ExperienceRegionProps) {
  const level = resolveExperienceLevel(area, requestedLevel, protectedContext)

  return (
    <div
      className={[styles.region, className].filter(Boolean).join(' ')}
      data-experience-area={area}
      data-experience-level={level}
      data-protected-context={protectedContext}
    >
      {children}
    </div>
  )
}
