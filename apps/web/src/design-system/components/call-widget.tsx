'use client'

import { useEffect, useRef } from 'react'
import styles from './call-widget.module.css'

// Inspect only the small viewport area occupied by the shortcut. Hit testing
// includes elements underneath it, so the result is stable when it disappears.
function coversMobileContent(corner: DOMRect) {
  const readingOrAction = 'p, li, dt, dd, h1, h2, h3, h4, blockquote, a, button, summary, label, input, textarea, select'
  for (const x of [corner.left + 2, corner.left + corner.width / 2, corner.right - 2]) {
    for (const y of [corner.top + 2, corner.top + corner.height / 2, corner.bottom - 2]) {
      if (document.elementsFromPoint(x, y).some(element =>
        !element.closest('[data-call-widget]') && element.closest(readingOrAction))) return true
    }
  }
  return false
}

export function CallWidget({ phoneHref, phone }: { readonly phoneHref: string; readonly phone: string }) {
  const trigger = useRef<HTMLAnchorElement>(null)
  const widget = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = widget.current
    const button = trigger.current
    if (!root || !button) return
    let frame = 0
    const narrow = window.matchMedia('(max-width: 899px)')
    function place() {
      frame = 0
      if (!root || !button) return
      const active = document.activeElement
      const outsideFocus = active instanceof HTMLElement && !root.contains(active) && active !== document.body
      const editing = outsideFocus && narrow.matches
        && active.matches('input, textarea, select, [contenteditable="true"]')
      const keyboard = !!window.visualViewport && window.visualViewport.height < window.innerHeight * .75
      const navigationOpen = !!document.querySelector('[data-navigation-panel]:popover-open')
      const corner = button.getBoundingClientRect()
      const focused = outsideFocus ? active.getBoundingClientRect() : null
      const overlapsFocus = focused && focused.left < corner.right + 8 && focused.right > corner.left - 8
        && focused.top < corner.bottom + 8 && focused.bottom > corner.top - 8
      root.toggleAttribute('data-call-hidden', !!(editing || keyboard || navigationOpen || overlapsFocus))
      root.toggleAttribute('data-call-obscures-content', narrow.matches && coversMobileContent(corner))
    }
    function schedule() {
      if (!frame) frame = requestAnimationFrame(place)
    }
    const resize = new ResizeObserver(schedule)
    resize.observe(document.body)
    const changes = new MutationObserver(schedule)
    const main = document.querySelector('main')
    if (main) changes.observe(main, { childList: true, subtree: true, attributes: true, attributeFilter: ['open', 'hidden', 'aria-invalid'] })
    window.addEventListener('scroll', schedule, { passive: true, capture: true })
    window.addEventListener('resize', schedule)
    document.addEventListener('focusin', schedule)
    document.addEventListener('focusout', schedule)
    document.addEventListener('toggle', schedule, true)
    window.visualViewport?.addEventListener('resize', schedule)
    schedule()
    return () => {
      cancelAnimationFrame(frame)
      resize.disconnect()
      changes.disconnect()
      window.removeEventListener('scroll', schedule, true)
      window.removeEventListener('resize', schedule)
      document.removeEventListener('focusin', schedule)
      document.removeEventListener('focusout', schedule)
      document.removeEventListener('toggle', schedule, true)
      window.visualViewport?.removeEventListener('resize', schedule)
    }
  }, [])

  return (
    <div className={styles.widget} data-call-widget ref={widget}>
      <a aria-label={`Call hospital: ${phone}`} className={styles.trigger} data-call-trigger href={phoneHref} ref={trigger} title={`Call hospital: ${phone}`}>
        <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.8 2.1Z" />
        </svg>
      </a>
    </div>
  )
}
