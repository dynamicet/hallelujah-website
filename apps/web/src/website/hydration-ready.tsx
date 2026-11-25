'use client'

import { useEffect } from 'react'

// Standalone previews enhance immediately; React pages wait until hydration commits.
export function HydrationReady() {
  useEffect(() => {
    document.documentElement.dataset.hydration = 'ready'
    document.dispatchEvent(new Event('site:hydrated'))
  }, [])
  return null
}
