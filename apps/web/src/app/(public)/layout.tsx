import type { ReactNode } from 'react'
import { PublicShell } from '@/website/public-shell'

export default function PublicLayout({ children }: { readonly children: ReactNode }) {
  return <PublicShell>{children}</PublicShell>
}
