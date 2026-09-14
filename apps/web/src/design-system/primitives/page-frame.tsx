import type { ReactNode } from 'react'

export interface PageFrameProps {
  readonly children: ReactNode
}

export function PageFrame({ children }: PageFrameProps) {
  return (
    <main id="main-content" tabIndex={-1}>
      {children}
    </main>
  )
}
