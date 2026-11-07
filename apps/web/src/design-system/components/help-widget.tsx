'use client'

import Link from 'next/link'
import { lazy, Suspense, useEffect, useId, useRef, useState, type ReactNode } from 'react'
import type { GuideCatalog } from '@/patient-guide/types'
const PatientGuide = lazy(() => import('./patient-guide').then((module) => ({ default: module.PatientGuide })))

import styles from './help-widget.module.css'

function HelpIcon({ children }: { readonly children: ReactNode }) {
  return (
    <svg aria-hidden="true" fill="none" focusable="false" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" viewBox="0 0 24 24">
      {children}
    </svg>
  )
}

export function HelpWidget({ guide }: { readonly guide?: GuideCatalog }) {
  const [guideRequested, setGuideRequested] = useState(false)
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
    // Keep the small launcher near its usual corner. If there is no clear space
    // within 144px, collapse it until the reader scrolls past that content.
    function place() {
      frame = 0
      if (!root || !button) return
      const active = document.activeElement
      const editing = window.matchMedia('(max-width: 719px)').matches && active instanceof HTMLElement
        && !root.contains(active) && active.matches('input, textarea, select, [contenteditable="true"]')
      const keyboard = !!window.visualViewport && window.visualViewport.height < window.innerHeight * .75
      const navigationOpen = !!document.querySelector('[data-navigation-panel]:popover-open')
      root.toggleAttribute('data-help-hidden', editing || keyboard || navigationOpen)
      if (editing || keyboard || navigationOpen || panel.current?.matches(':popover-open') || root.contains(active)) return
      const current = button.getBoundingClientRect()
      const previousLift = Number.parseFloat(root.style.getPropertyValue('--help-lift')) || 0
      const baseBottom = current.bottom + previousLift
      const obstacles = Array.from(document.querySelectorAll('main :is(h1, h2, h3, p, li, label, blockquote, dt, dd, figure, img, video, a, button, input, select, textarea, summary, [role="alert"]), [data-site-footer] a'))
        .filter((node) => node.getClientRects().length && getComputedStyle(node).visibility !== 'hidden')
        .flatMap((node) => Array.from(node.getClientRects()))
        .filter((rect) => rect.width && rect.height && rect.left < current.right + 8 && rect.right > current.left - 8)
      let bottom = baseBottom
      for (let attempt = 0; attempt <= obstacles.length; attempt++) {
        const collisions = obstacles.filter((rect) => rect.top < bottom + 8 && rect.bottom > bottom - current.height - 8)
        if (!collisions.length) break
        bottom = Math.min(...collisions.map((rect) => rect.top)) - 8
      }
      const lift = baseBottom - bottom
      root.style.setProperty('--help-lift', `${Math.min(lift, 144)}px`)
      root.toggleAttribute('data-help-hidden', lift > 144 || bottom - current.height < 8)
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

  function close() {
    panel.current?.hidePopover()
  }

  // The native popover supplies expanded state and Escape dismissal even without JavaScript.
  return (
    <div
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
            <Link className={`${styles.action} ${styles.appointment}`} href="/appointment" onClick={close}>
              <span className={styles.label}><strong>Request an appointment</strong></span>
              <span className={styles.actionIcon}><HelpIcon><rect x="3.5" y="5" width="17" height="16" rx="2" /><path d="M7.5 3v4M16.5 3v4M3.5 10.5h17M8 15h3M8 18h6" /></HelpIcon></span>
            </Link>
          </li>
          <li>
            <button className={styles.action} data-open-patient-guide disabled={!guide} onClick={() => { guideReturnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null; close(); setGuideRequested(true); dialog.current?.showModal() }} type="button">
              <span className={styles.label}><strong>Chat with our guide</strong><small>{guide ? 'Automated · Find your next step' : 'Automated · Coming soon'}</small></span>
              <span className={styles.actionIcon}><HelpIcon><path d="M20.5 11.5a8.5 8.5 0 0 1-8.5 8.5 9 9 0 0 1-3.5-.7L3 21l1.7-5.5a9 9 0 0 1-.7-3.5 8.5 8.5 0 0 1 16.5-.5Z" /><path d="M8 12h.01M12 12h.01M16 12h.01" /></HelpIcon></span>
            </button>
          </li>
        </ul>
        <noscript><p className={styles.noScript}>Chat needs JavaScript. You can still <Link href="/doctors">find a doctor</Link>, <Link href="/services">explore services</Link> or use the appointment link above.</p></noscript>
      </div>
      {guide && guideRequested ? <Suspense fallback={<p role="status">Opening the care guide… <Link href="/appointment">Appointment options</Link></p>}><PatientGuide openOnMount catalog={guide} dialogRef={dialog} onClose={() => { const origin = guideReturnFocus.current; if (origin?.isConnected && !widget.current?.contains(origin)) origin.focus(); else trigger.current?.focus() }} /></Suspense> : null}
    </div>
  )
}
