'use client'

import { useEffect, useRef } from 'react'
import { startCareFilm } from './care-film-playback'
import { startStories } from './story-playback'

/** Bind the opt-in film controls as the chapter approaches; no media is requested. */
export function HomeScenes() {
  const marker = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const root = marker.current?.closest('.enhanced-home')
    let stopFilm: (() => void) | undefined
    let stopStories: (() => void) | undefined
    const stories = root?.querySelector<HTMLElement>('.everyday-stories')
    const storyObserver = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || !stories) return
      storyObserver.disconnect()
      stopStories = startStories(stories)
    }, { rootMargin: '600px' })
    if (stories) storyObserver.observe(stories)
    const player = root?.querySelector<HTMLVideoElement>('.care-background-film video')
    const control = root?.querySelector<HTMLButtonElement>('.care-film-control')
    const filmObserver = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || !player || !control) return
      filmObserver.disconnect()
      stopFilm = startCareFilm(player, control)
    }, { rootMargin: '200px' })
    if (player) filmObserver.observe(player)
    return () => {
      filmObserver.disconnect()
      storyObserver.disconnect()
      stopFilm?.()
      stopStories?.()
    }
  // The live-refresh regression retained old handlers without this dependency.
  // eslint-disable-next-line react-hooks/exhaustive-deps -- Rebind when Fast Refresh replaces the imported function.
  }, [startCareFilm, startStories])
  return <span hidden ref={marker} />
}
