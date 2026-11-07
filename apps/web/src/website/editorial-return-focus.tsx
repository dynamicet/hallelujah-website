'use client'

import { useEffect } from 'react'

/** Restore a named editorial destination after the router finishes mounting it. */
export function EditorialReturnFocus() {
  useEffect(() => {
    let frame = 0
    const restore = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        frame = requestAnimationFrame(() => {
          if (!location.hash.startsWith('#editorial-')) return
          const target = document.getElementById(location.hash.slice(1))
          if (!target?.hasAttribute('data-editorial-card')) return
          target.focus({ preventScroll: true })
          target.scrollIntoView({ block: 'start', behavior: 'instant' })
        })
      })
    }
    restore()
    window.addEventListener('hashchange', restore)
    return () => { cancelAnimationFrame(frame); window.removeEventListener('hashchange', restore) }
  }, [])
  return null
}
