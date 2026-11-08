'use client'

import { useEffect, useRef } from 'react'
import { startStories } from './story-playback'

/** Bind the featured story controls as the section approaches. */
export function HomeScenes() {
  const marker = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const root = marker.current?.closest('.enhanced-home')
    let stopStories: (() => void) | undefined
    const stories = root?.querySelector<HTMLElement>('.everyday-stories')
    const storyObserver = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || !stories) return
      storyObserver.disconnect()
      stopStories = startStories(stories)
    }, { rootMargin: '600px' })
    if (stories) storyObserver.observe(stories)
    return () => {
      storyObserver.disconnect()
      stopStories?.()
    }
  // The live-refresh regression retained old handlers without this dependency.
  // eslint-disable-next-line react-hooks/exhaustive-deps -- Rebind when Fast Refresh replaces the imported function.
  }, [startStories])
  return <span hidden ref={marker} />
}
