'use client'

import { InterfaceLink as Link } from '@/website/interface-language'
import { useRouter } from 'next/navigation'
import { useRef, type ReactNode } from 'react'

let activeTransition: ViewTransition | undefined

/** Reuse the hydrated shell instead of restarting Next.js during playback. */
export function ClinicianProfileLink({ href, publicId, className, label, children }: {
  readonly href: string
  readonly publicId: string
  readonly className: string
  readonly label: string
  readonly children: ReactNode
}) {
  const router = useRouter()
  const link = useRef<HTMLAnchorElement>(null)
  return <Link ref={link} href={href} className={className} aria-label={label} onNavigate={event => {
    if (!document.startViewTransition || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    event.preventDefault()
    activeTransition?.skipTransition()
    const root = document.documentElement
    const card = link.current?.closest('[data-clinician-public-id]')
    card?.setAttribute('data-selected-care-transition', '')
    root.setAttribute('data-care-profile-transition', '')
    // Keyboard focus may have started a smooth scroll on the source page.
    // Cancel it before rendering is suppressed, so it cannot resume on arrival.
    window.scrollTo({ top: scrollY, left: scrollX, behavior: 'instant' })
    const transition = document.startViewTransition(async () => {
      // The router does not return a commit promise. Observe the destination,
      // with a short deadline so a slow or failed route never traps its snapshot.
      await new Promise<void>(resolve => {
        const finish = () => { clearTimeout(deadline); clearTimeout(cleanupDeadline); observer.disconnect(); resolve() }
        const observer = new MutationObserver(() => {
          const profile = document.querySelector<HTMLElement>('[data-clinician-profile-template]')
          if (profile && location.pathname === new URL(href, location.href).pathname.replace(/\/$/, '')) finish()
        })
        const deadline = setTimeout(() => transition.skipTransition(), 1200)
        // After skipping a slow transition, still settle scroll/focus when its
        // route arrives; also bound observation if the destination never mounts.
        const cleanupDeadline = setTimeout(finish, 10000)
        observer.observe(document.body, { childList: true, subtree: true })
        router.push(href, { scroll: false })
      })
      const profile = document.querySelector<HTMLElement>('[data-clinician-profile-template]')
      if (profile?.dataset.clinicianIdentityId !== publicId) return
      // Keep image decoding out of the animated interval. The source already
      // displayed this asset, so the browser normally has its decoded pixels.
      await Promise.all([...profile.querySelectorAll('img')].map(image => image.decode().catch(() => {})))
      // Route passive effects can still be queued after the DOM commit. Give
      // them an idle turn before releasing the snapshot into visible motion.
      await new Promise<void>(resolve => {
        if ('requestIdleCallback' in window) window.requestIdleCallback(() => resolve(), { timeout: 150 })
        else setTimeout(resolve, 0)
      })
      // The shared shell can remain visible at the old directory scroll offset,
      // which makes Next's automatic scroll heuristic retain that offset.
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    })
    activeTransition = transition
    void transition.ready.catch(() => { /* Skipping still completes navigation. */ })
    const settle = () => {
      card?.removeAttribute('data-selected-care-transition')
      if (activeTransition !== transition) return
      activeTransition = undefined
      root.removeAttribute('data-care-profile-transition')
      // Focus after snapshot cleanup so its outline is not split across the
      // moving heading and the stationary page snapshot.
      const profile = document.querySelector<HTMLElement>('[data-clinician-profile-template]')
      if (profile?.dataset.clinicianIdentityId === publicId) {
        document.getElementById('clinician-profile-title')?.focus({ preventScroll: true })
      }
    }
    void transition.finished.then(settle, settle)
  }}>{children}</Link>
}
