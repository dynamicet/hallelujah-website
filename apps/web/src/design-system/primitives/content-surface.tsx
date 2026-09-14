import type { ReactNode } from 'react'

export interface ContentSurfaceProps {
  readonly labelledBy: string
  readonly children: ReactNode
}

export function ContentSurface({ labelledBy, children }: ContentSurfaceProps) {
  return <section aria-labelledby={labelledBy}>{children}</section>
}
