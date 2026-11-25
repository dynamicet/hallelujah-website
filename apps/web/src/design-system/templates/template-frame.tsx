import type { ReactNode } from 'react'
import { SiteContent, SiteShell, type SiteShellProps } from '../components'

// Standalone review fixtures can supply a shell. Application routes inherit it
// from the public layout and render only their content and breadcrumb trail.
export function TemplateFrame({ shell, breadcrumbs, children }: {
  readonly shell?: Omit<SiteShellProps, 'children'>
  readonly breadcrumbs?: SiteShellProps['breadcrumbs']
  readonly children: ReactNode
}) {
  if (shell) return <SiteShell {...shell} breadcrumbs={breadcrumbs ?? shell.breadcrumbs}>{children}</SiteShell>
  return <SiteContent breadcrumbs={breadcrumbs}>{children}</SiteContent>
}
