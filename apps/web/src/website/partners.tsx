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
  const billingIds = new Set(billing.map((partner) => partner.id))
  const collaborations = partners.filter((partner) => eligible(partner) && !billingIds.has(partner.id))

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
      duration = distance / 24 * 1000
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
          <h2 id="partners-billing-title">Insurance &amp; corporate billing</h2>
          <p className="partners-copy">Confirm payment arrangements with the hospital before your visit.</p>
        </div>
        <div>
          <ul className="partners-billing-list" id="partners-billing-list">{billing.slice(0, 6).map((partner) => <PartnerMark partner={partner} named key={partner.id} />)}</ul>
          {billing.length > 6 ? <details className="partners-billing-more">
            <summary><span className="partners-more-closed">View all organizations ({billing.length})</span><span className="partners-more-open">Show fewer</span></summary>
            <ul className="partners-billing-list">{billing.slice(6).map((partner) => <PartnerMark partner={partner} named key={partner.id} />)}</ul>
            <button className="partners-billing-collapse" type="button" onClick={(event) => {
              const details = event.currentTarget.closest('details')
              const summary = details?.querySelector('summary')
              if (!details || !summary) return
              details.open = false
              summary.focus({ preventScroll: true })
              summary.scrollIntoView({ block: 'nearest', behavior: 'instant' })
            }}>Show fewer</button>
          </details> : null}
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
