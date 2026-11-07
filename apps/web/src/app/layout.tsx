import type { Metadata } from 'next'
import { Suspense, type ReactNode } from 'react'

import { HydrationReady } from '@/design-system/templates'
import { MotionMediaInteractions, ShellInteractions } from '@/demo/interactions'
import { WebsiteMotion } from '@/website/reveal'

import './styles.css'
import './website.css'
import './home-enhancement.css'
import './care-pages.css'
import './intentional.css'
import './everyday-stories.css'
import './home-composition.css'
import './usability-refinements.css'
import './motion.css'
import './signature-motion.css'
import './interaction-motion.css'
import './reading-motion.css'
import './media-experience.css'

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
    <html lang="en" data-hydration="pending" data-scroll-behavior="smooth">
      <body>{children}<HydrationReady /><WebsiteMotion /><Suspense fallback={null}><ShellInteractions /><MotionMediaInteractions /></Suspense></body>
    </html>
  )
}
