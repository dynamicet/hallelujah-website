import type { Metadata } from 'next'
import type { ReactNode } from 'react'

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
      <body>{children}</body>
    </html>
  )
}
