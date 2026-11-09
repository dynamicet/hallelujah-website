'use client'

import { usePathname } from 'next/navigation'
import { InterfaceCopy, InterfaceLink as Link } from '@/website/interface-language'
import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import type { GuideCatalog } from '@/patient-guide/types'
type GuideComponent = typeof import('./patient-guide')['PatientGuide']

import styles from './help-widget.module.css'

function HelpIcon({ children }: { readonly children: ReactNode }) {
  return (
    <svg aria-hidden="true" fill="none" focusable="false" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" viewBox="0 0 24 24">
      {children}
    </svg>
  )
}

export function HelpWidget({ guide }: { readonly guide?: GuideCatalog }) {
  const pathname = usePathname()
  const [guideRequested, setGuideRequested] = useState(false)
  const [Guide, setGuide] = useState<GuideComponent | null>(null)
  const [guideLoading, setGuideLoading] = useState(false)
  const [guideError, setGuideError] = useState(false)
  const [appointmentHref, setAppointmentHref] = useState('/appointment')
  const loadRequest = useRef(0)
  const panelId = useId()
  const panel = useRef<HTMLDivElement>(null)
  const dialog = useRef<HTMLDialogElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const guideReturnFocus = useRef<HTMLElement | null>(null)
  const widget = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = widget.current
    const button = trigger.current
    if (!root || !button) return
    let frame = 0
    // Keep a predictable corner anchor and yield to controls, arrival information and document reading.
    function updateVisibility() {
      frame = 0
      if (!root || !button) return
      const active = document.activeElement
      const editing = window.matchMedia('(max-width: 719px)').matches && active instanceof HTMLElement
        && !root.contains(active) && active.matches('input, textarea, select, [contenteditable="true"]')
      const keyboard = !!window.visualViewport && window.visualViewport.height < window.innerHeight * .75
      const navigationOpen = !!document.querySelector('[data-navigation-panel]:popover-open')
      const control = button.getBoundingClientRect()
      const focused = active instanceof HTMLElement && !root.contains(active)
        && active.matches('a[href], button, input, select, textarea, summary, [tabindex], [contenteditable="true"]')
        ? active.getBoundingClientRect() : null
      const obscuresFocus = !!focused && focused.width > 0 && focused.height > 0
        && focused.left < control.right && focused.right > control.left
        && focused.top < control.bottom && focused.bottom > control.top
      const obscuresPageControl = [...document.querySelectorAll<HTMLElement>('main input, main select, main textarea, main button, main a[href], main summary, main [contenteditable="true"], main [data-help-clearance], [data-site-footer] a[href], main [data-page-variant="document"] :is(p, li, h2, h3), main [data-page-variant="task"] :is(p, li, h2, h3)')].some((element) => {
        if (!element.getClientRects().length) return false
        const bounds = element.getBoundingClientRect()
        return bounds.width > 0 && bounds.height > 0 && bounds.left < control.right && bounds.right > control.left
          && bounds.top < control.bottom && bounds.bottom > control.top
      })
      root.toggleAttribute('data-help-hidden', editing || keyboard || navigationOpen || obscuresFocus || obscuresPageControl)
    }
    function schedule() {
      if (!frame) frame = requestAnimationFrame(updateVisibility)
    }
    window.addEventListener('resize', schedule)
    window.addEventListener('scroll', schedule, { passive: true })
    const main = document.querySelector('main')
    const observer = new ResizeObserver(schedule)
    if (main) observer.observe(main)
    document.addEventListener('focusin', schedule)
    document.addEventListener('focusout', schedule)
    document.addEventListener('toggle', schedule, true)
    window.visualViewport?.addEventListener('resize', schedule)
    schedule()
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', schedule)
      window.removeEventListener('scroll', schedule)
      observer.disconnect()
      document.removeEventListener('focusin', schedule)
      document.removeEventListener('focusout', schedule)
      document.removeEventListener('toggle', schedule, true)
      window.visualViewport?.removeEventListener('resize', schedule)
    }
  }, [pathname])

  function close() {
    panel.current?.hidePopover()
  }

  function updateAppointmentContext() {
    // Reuse the page's own care action; never infer a selection from a directory.
    if (!/^\/(doctors|services)\/[^/]+\/?$/u.test(location.pathname)) {
      setAppointmentHref('/appointment')
      return
    }
    const action = document.querySelector<HTMLAnchorElement>('main a[href^="/appointment?"]')
    if (!action) { setAppointmentHref('/appointment'); return }
    const destination = new URL(action.href, location.href)
    const context = new URLSearchParams()
    if (destination.origin === location.origin && destination.pathname === '/appointment') {
      for (const key of ['doctor', 'service']) {
        const value = destination.searchParams.get(key)
        if (value) context.set(key, value)
      }
    }
    setAppointmentHref(context.size ? `/appointment?${context}` : '/appointment')
  }

  async function openGuide() {
    if (!guide || guideLoading) return
    guideReturnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
    if (Guide) {
      close()
      setGuideRequested(true)
      dialog.current?.showModal()
      return
    }
    panel.current?.showPopover()
    const request = ++loadRequest.current
    setGuideLoading(true)
    setGuideError(false)
    try {
      const loaded = await import('./patient-guide')
      setGuide(() => loaded.PatientGuide)
      if (request !== loadRequest.current) return
      setGuideLoading(false)
      close()
      setGuideRequested(true)
    } catch {
      if (request !== loadRequest.current) return
      setGuideLoading(false)
      setGuideError(true)
    }
  }

  // The native popover supplies expanded state and Escape dismissal even without JavaScript.
  return (
    <InterfaceCopy><div
      className={styles.widget}
      data-help-widget
      ref={widget}
      onBlur={(event) => {
        if (event.relatedTarget instanceof Node && !event.currentTarget.contains(event.relatedTarget)) close()
      }}
    >
      <button
        aria-label="Help"
        aria-controls={panelId}
        className={styles.trigger}
        data-help-trigger
        popoverTarget={panelId}
        popoverTargetAction="toggle"
        type="button"
        ref={trigger}
      >
        <span className={styles.helpGlyph}>
          <HelpIcon><circle cx="12" cy="12" r="9" /><path d="M9.6 9a2.5 2.5 0 0 1 4.8 1c0 1.8-2.4 2-2.4 3.5" /><path d="M12 16.8h.01" /></HelpIcon>
        </span>
        <span className={styles.triggerLabel}>Help</span>
        <span className={styles.closeGlyph}>
          <HelpIcon><path d="m6 6 12 12M18 6 6 18" /></HelpIcon>
        </span>
      </button>

      <div
        aria-label="Help options"
        className={styles.panel}
        data-help-panel
        id={panelId}
        popover="auto"
        onToggle={() => {
          if (panel.current?.matches(':popover-open')) updateAppointmentContext()
          else { loadRequest.current++; setGuideLoading(false) }
        }}
        ref={panel}
        role="region"
      >
        <div className={styles.panelHeader}>
          <strong>Help</strong>
          <button aria-label="Close help options" className={styles.dismiss} onClick={() => trigger.current?.focus()} popoverTarget={panelId} popoverTargetAction="hide" type="button">
            <HelpIcon><path d="m6 6 12 12M18 6 6 18" /></HelpIcon>
          </button>
        </div>
        <ul aria-label="Ways we can help" className={styles.actions}>
          <li>
            <button aria-disabled={guideLoading || undefined} className={`${styles.action} ${styles.guide}`} data-open-patient-guide disabled={!guide} onClick={openGuide} type="button">
              <span className={styles.actionIcon}><HelpIcon><path d="M20.5 11.5a8.5 8.5 0 0 1-8.5 8.5 9 9 0 0 1-3.5-.7L3 21l1.7-5.5a9 9 0 0 1-.7-3.5 8.5 8.5 0 0 1 16.5-.5Z" /><path d="M8 12h.01M12 12h.01M16 12h.01" /></HelpIcon></span>
              <span className={styles.label}><strong>Ask the Patient Guide</strong><small>{guide ? 'Prepared answers · Website help' : 'Website guide · Coming soon'}</small></span>
            </button>
          </li>
          <li>
            <Link className={`${styles.action} ${styles.appointment}`} href={appointmentHref} onClick={close}>
              <span className={styles.actionIcon}><HelpIcon><rect x="3.5" y="5" width="17" height="16" rx="2" /><path d="M7.5 3v4M16.5 3v4M3.5 10.5h17M8 15h3M8 18h6" /></HelpIcon></span>
              <span className={styles.label}><strong>Request an appointment</strong><small>Explore appointment options</small></span>
            </Link>
          </li>
        </ul>
        <div aria-live="polite" aria-atomic="true" className={styles.status}>
          {guideLoading ? <p>Opening the Patient Guide…</p> : null}
          {guideError ? <><p>The guide could not open. Please try again.</p><button className={styles.retry} onClick={openGuide} type="button">Try again</button><Link href="/doctors" onClick={close}>Find a doctor</Link></> : null}
        </div>
        <noscript><p className={styles.noScript}>Chat needs JavaScript. You can still <Link href="/doctors">find a doctor</Link>, <Link href="/services">explore services</Link> or use the appointment link above.</p></noscript>
      </div>
      {guide && Guide && guideRequested ? <Guide openOnMount catalog={guide} dialogRef={dialog} onClose={() => { const origin = guideReturnFocus.current; if (origin?.isConnected && !widget.current?.contains(origin)) origin.focus(); else trigger.current?.focus() }} /> : null}
    </div>
    </InterfaceCopy>
  )
}
