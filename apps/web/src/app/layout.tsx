import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import './styles.css'

export const metadata: Metadata = {
  description: 'Controlled local application bootstrap. Not approved for publication.',
  robots: {
    follow: false,
    index: false,
  },
  title: 'Controlled local bootstrap',
}

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
