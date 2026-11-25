'use client'

import type { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { SiteShell } from '@/design-system/components/global-shell'
import { hospitalShell } from './site-shell'

// Only the chrome reads the live pathname. Page bodies remain server components.
export function PublicShell({ children }: {
  readonly children: ReactNode
}) {
  const pathname = usePathname()
  return <SiteShell {...hospitalShell(pathname)}>{children}</SiteShell>
}
