import type { ReactNode } from 'react'

import styles from './brand-surface.module.css'

export const brandSurfaceTones = ['paper', 'white', 'mist', 'inverse', 'supporting', 'expressive'] as const
export type BrandSurfaceTone = (typeof brandSurfaceTones)[number]
export type BrandAccent = 'none' | 'blue' | 'orange' | 'magenta'
export type BrandDetail = 'rule' | 'corner' | 'frame'

export interface BrandSurfaceProps {
  readonly children: ReactNode
  readonly id?: string
  readonly labelledBy: string
  readonly tone?: BrandSurfaceTone
  readonly accent?: BrandAccent
  readonly detail?: BrandDetail
}

/** A section field; nested surfaces reset their own action and focus context. */
export function BrandSurface({ children, id, labelledBy, tone = 'paper', accent = 'none', detail = 'rule' }: BrandSurfaceProps) {
  return (
    <section aria-labelledby={labelledBy} className={styles.surface} data-brand-tone={tone} data-brand-accent={accent} data-brand-detail={detail} id={id}>
      {children}
    </section>
  )
}

/** Editorial content only. Use TaskCard for a single linked destination. */
export function BrandCard({ children, id, labelledBy, tone = 'white', accent = 'none', detail = 'rule' }: BrandSurfaceProps) {
  return (
    <article aria-labelledby={labelledBy} className={`${styles.surface} ${styles.card}`} data-brand-tone={tone} data-brand-accent={accent} data-brand-detail={detail} id={id}>
      {children}
    </article>
  )
}
