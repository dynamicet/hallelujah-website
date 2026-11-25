'use client'

import { useEffect, useRef } from 'react'

/** Bind the featured story controls as the section approaches. */
export function HomeScenes() {
  const marker = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const root = marker.current?.closest('.enhanced-home')
    let disposed = false
    let stopStories: (() => void) | undefined
    const stories = root?.querySelector<HTMLElement>('.everyday-stories')
    const storyObserver = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || !stories) return
      storyObserver.disconnect()
      void import('./story-playback').then(({ startStories }) => {
        if (!disposed) stopStories = startStories(stories)
      }).catch(() => { /* Native video controls and transcript remain available. */ })
    }, { rootMargin: '600px' })
    if (stories) storyObserver.observe(stories)
    return () => {
      disposed = true
      storyObserver.disconnect()
      stopStories?.()
    }
  }, [])
  return <span hidden ref={marker} />
}
