import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import { LogoReveal } from '../design-system/components/logo-reveal'

import './styles.css'

export const metadata: Metadata = {
  description: 'Find care and visitor information at Hallelujah Hospital.',
  robots: {
    follow: false,
    index: false,
  },
  title: 'Hallelujah Hospital',
}

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script defer blocking="render" src="/logo-entry.js" />
      </head>
      <body><LogoReveal overlay /><div data-home-entry-content>{children}</div></body>
    </html>
  )
}
