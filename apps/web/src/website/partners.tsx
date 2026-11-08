'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'

export type Partner = Readonly<{
  id: string
  name: string
  logo: Readonly<{ src: string; width: number; height: number }>
}>

const eligible = (partner: Partner) => partner.name.trim() && partner.logo.src.trim() && partner.logo.width > 0 && partner.logo.height > 0

function PartnerMark({ partner, named = false, clone = false }: { partner: Partner; named?: boolean; clone?: boolean }) {
  return <li className="partner" data-partner={partner.id}>
    <figure>
      <div className="partner-logo">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={partner.logo.src} alt={named || clone ? '' : partner.name} width={partner.logo.width} height={partner.logo.height} loading="lazy" decoding="async" />
      </div>
      {named ? <figcaption>{partner.name}</figcaption> : null}
    </figure>
  </li>
}

export function Partners({ partners, billingPartners = [] }: { partners: readonly Partner[]; billingPartners?: readonly Partner[] }) {
  const billingViewport = useRef<HTMLDivElement>(null)
  const [billingRange, setBillingRange] = useState({ start: 1, end: 6, previous: false, next: true })
  const rail = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const originals = useRef<HTMLUListElement>(null)
  const animation = useRef<Animation | null>(null)
  const shouldRun = useRef(false)
  const [motionAllowed, setMotionAllowed] = useState(false)
  const [paused, setPaused] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [inView, setInView] = useState(false)
  const [pageVisible, setPageVisible] = useState(true)
  const billing = billingPartners.filter(eligible)
  const updateBillingRange = () => {
    const viewport = billingViewport.current
    if (!viewport) return
    const bounds = viewport.getBoundingClientRect()
    const items = [...viewport.querySelectorAll<HTMLElement>('.partner')]
    const visible = items.flatMap((item, index) => {
      const rect = item.getBoundingClientRect()
      return rect.left >= bounds.left - 2 && rect.right <= bounds.right + 2 ? [index + 1] : []
    })
    setBillingRange({ start: visible[0] ?? 1, end: visible.at(-1) ?? 1, previous: viewport.scrollLeft > 2, next: viewport.scrollLeft + viewport.clientWidth < viewport.scrollWidth - 2 })
  }
  const moveBilling = (direction: -1 | 1) => {
    const viewport = billingViewport.current
    const item = viewport?.querySelector<HTMLElement>('.partner')
    if (!viewport || !item) return
    const count = Number(getComputedStyle(viewport).getPropertyValue('--billing-visible')) || 2
    const gap = parseFloat(getComputedStyle(item.parentElement!).columnGap) || 0
    viewport.scrollBy({ left: direction * count * (item.getBoundingClientRect().width + gap), behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
  }
  useEffect(() => {
    const viewport = billingViewport.current
    if (!viewport) return
    const observer = new ResizeObserver(updateBillingRange)
    observer.observe(viewport)
    updateBillingRange()
    return () => observer.disconnect()
  }, [billing.length])
  const collaborations = partners.filter(eligible)

  useEffect(() => {
    const preference = matchMedia('(prefers-reduced-motion: reduce)')
    const updatePreference = () => setMotionAllowed(!preference.matches)
    const updateVisibility = () => setPageVisible(!document.hidden)
    updatePreference()
    updateVisibility()
    preference.addEventListener('change', updatePreference)
    document.addEventListener('visibilitychange', updateVisibility)
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting))
    if (rail.current) observer.observe(rail.current)
    return () => {
      preference.removeEventListener('change', updatePreference)
      document.removeEventListener('visibilitychange', updateVisibility)
      observer.disconnect()
    }
  }, [])

  useLayoutEffect(() => {
    const viewport = rail.current
    const belt = track.current
    const list = originals.current
    if (!motionAllowed || paused || !viewport || !belt || !list || !collaborations.length) return
    let movement: Animation | undefined
    let distance = 0
    let duration = 0
    const offset = () => movement && duration ? ((Number(movement.currentTime) || 0) % duration) / duration * distance : viewport.scrollLeft
    const start = () => {
      const position = offset()
      movement?.cancel()
      distance = list.scrollWidth + (parseFloat(getComputedStyle(belt).columnGap) || 0)
      if (!distance) return
      duration = distance / 18 * 1000
      viewport.scrollLeft = 0
      movement = belt.animate([{ transform: 'translateX(0)' }, { transform: `translateX(-${distance}px)` }], { duration, iterations: Infinity, easing: 'linear' })
      movement.currentTime = position / distance * duration
      movement.pause()
      animation.current = movement
      if (shouldRun.current) movement.play()
    }
    start()
    const observer = new ResizeObserver(start)
    observer.observe(viewport)
    observer.observe(list)
    return () => {
      const position = offset()
      observer.disconnect()
      movement?.cancel()
      animation.current = null
      viewport.scrollLeft = position
    }
  }, [motionAllowed, paused, collaborations.length])

  useEffect(() => {
    shouldRun.current = motionAllowed && !paused && !hovered && inView && pageVisible
    if (shouldRun.current) animation.current?.play()
    else animation.current?.pause()
  }, [motionAllowed, paused, hovered, inView, pageVisible])

  if (!collaborations.length && !billing.length) return null
  const moving = motionAllowed && !paused && !hovered && inView && pageVisible
  return <section className="partners" id="partners" aria-label="Hospital organizations">
    <div className="page-frame partners-bands">
      {billing.length ? <section className="partners-band partners-billing-band" aria-labelledby="partners-billing-title">
        <div className="partners-heading">
          <h2 id="partners-billing-title">Corporate healthcare agreements</h2>
          <p className="partners-copy">We work with companies to provide employee healthcare through agreed credit and health service arrangements. Contact your employer or the hospital to confirm your eligibility and requirements.</p>
          <a className="partners-contact" href="#home-call">Confirm your arrangement <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" /></svg></a>
        </div>
        <div className="partners-directory">
          <div className="partners-directory-heading">
            <p>Find your company</p>
            <span className="partners-total">{billing.length} organizations</span>
            <div className="partners-pagination">
              <p role="status" aria-live="polite" aria-atomic="true"><span className="ds-visually-hidden">Companies </span>{billingRange.start}–{Math.min(billingRange.end, billing.length)} of {billing.length}</p>
              <div className="partners-page-controls">
                <button type="button" aria-label="Previous companies" aria-controls="partners-billing-list" aria-disabled={!billingRange.previous} onClick={() => { if (billingRange.previous) moveBilling(-1) }}><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M19 12H5m6-6-6 6 6 6" /></svg></button>
                <button type="button" aria-label="Next companies" aria-controls="partners-billing-list" aria-disabled={!billingRange.next} onClick={() => { if (billingRange.next) moveBilling(1) }}><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" /></svg></button>
              </div>
            </div>
          </div>
          <div className="partners-billing-viewport" id="partners-billing-list" ref={billingViewport} tabIndex={0} role="region" aria-label="Companies with healthcare agreements; scroll horizontally to browse" onScroll={updateBillingRange}>
            <ul className="partners-billing-list" aria-label="Companies with healthcare agreements">
              {billing.map((partner) => <PartnerMark partner={partner} named key={partner.id} />)}
            </ul>
          </div>
        </div>
      </section> : null}
      {collaborations.length ? <section className="partners-band partners-collaboration-band" aria-labelledby="partners-title">
        <div className="partners-heading">
          <h2 id="partners-title">Our partners</h2>
          {motionAllowed ? <button className="partners-motion-toggle" type="button" aria-controls="partners-rail" aria-pressed={paused} onClick={() => setPaused((value) => !value)}>{paused ? 'Resume' : 'Pause'}</button> : null}
        </div>
        <div className="partners-rail" id="partners-rail" ref={rail} data-motion-state={!motionAllowed ? 'static' : moving ? 'running' : 'paused'} data-paused={paused}
          tabIndex={motionAllowed ? 0 : undefined} role="region" aria-label="Partner logos" onFocus={() => setPaused(true)} onPointerDown={() => setPaused(true)}
          onPointerEnter={(event) => { if (event.pointerType === 'mouse') setHovered(true) }} onPointerLeave={() => setHovered(false)}>
          <div className="partners-rail-track" ref={track}>
            <ul className="partners-collaboration-list" ref={originals}>{collaborations.map((partner) => <PartnerMark partner={partner} key={partner.id} />)}</ul>
            {motionAllowed ? <ul className="partners-collaboration-list partners-rail-clone" aria-hidden="true">{collaborations.map((partner) => <PartnerMark partner={partner} clone key={partner.id} />)}</ul> : null}
          </div>
        </div>
      </section> : null}
    </div>
  </section>
}
