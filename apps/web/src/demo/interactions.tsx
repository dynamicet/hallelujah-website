'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

// Bind once per rendered route, including same-route scenario and query transitions.
export function ShellInteractions() {
  const pathname = usePathname()
  const search = useSearchParams().toString()
  useEffect(() => {
    const controller = new AbortController()
    const { signal } = controller
    const panel = document.querySelector<HTMLElement>('[data-navigation-panel]')
    const trigger = document.querySelector<HTMLButtonElement>('[data-menu-trigger]')
    let restoreMenuFocus = false
    panel?.addEventListener('beforetoggle', (event) => {
      if ((event as ToggleEvent).newState === 'closed') restoreMenuFocus = panel.contains(document.activeElement)
    }, { signal })
    panel?.addEventListener('toggle', () => {
      const open = panel.matches(':popover-open')
      trigger?.setAttribute('aria-expanded', String(open))
      if (!open && restoreMenuFocus) trigger?.focus()
      restoreMenuFocus = false
    }, { signal })
    panel?.addEventListener('click', (event) => {
      if (event.target instanceof Element && event.target.closest('a[href]') && panel.matches(':popover-open')) {
        restoreMenuFocus = false
        panel.hidePopover()
      }
    }, { signal })
    const language = document.querySelector<HTMLDetailsElement>('[data-language-switcher]')
    language?.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && language.open) {
        event.preventDefault()
        event.stopPropagation()
        language.open = false
        language.querySelector('summary')?.focus()
      }
    }, { signal })
    document.addEventListener('click', (event) => {
      if (language && event.target instanceof Node && !language.contains(event.target)) language.open = false
    }, { signal })
    const compact = window.matchMedia('(max-width: 63.999rem)')
    const disclosures = document.querySelectorAll<HTMLDetailsElement>('[data-filter-disclosure]')
    const resize = () => disclosures.forEach((element) => {
      element.open = !compact.matches || Boolean(element.querySelector('input:checked'))
    })
    resize()
    compact.addEventListener('change', resize, { signal })
    disclosures.forEach((element) => element.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        element.open = false
        element.querySelector('summary')?.focus()
      }
    }, { signal }))
    return () => controller.abort()
  }, [pathname, search])
  return null
}

// This local example validates in memory and never submits or persists form values.
// Connected pages rebind media and decorative motion after each client transition.
// Controlled standalone previews keep their static motion-media.js enhancement.
export function MotionMediaInteractions() {
  const pathname = usePathname()
  const search = useSearchParams().toString()
  useEffect(() => {
    if (!document.querySelector('[data-motion-accent], [data-media-state]')) return
    let disposed = false
    let stop: (() => void) | undefined
    void import('./motion-media-controller').then(({ bindMotionMedia }) => {
      if (!disposed) stop = bindMotionMedia()
    }).catch(() => { /* Static media posters and the core route remain available. */ })
    return () => { disposed = true; stop?.() }
  }, [pathname, search])
  return null
}
