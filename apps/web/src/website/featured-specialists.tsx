'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { InterfaceLink as Link } from './interface-language'
import styles from './featured-specialists.module.css'

export function FeaturedSpecialists({ children }: { children: ReactNode }) {
  const rail = useRef<HTMLDivElement>(null)
  const directory = useRef<HTMLDivElement>(null)
  const [navigation, setNavigation] = useState({ visible: false, previous: false, next: false })

  useEffect(() => {
    const viewport = rail.current
    if (!viewport) return
    const wide = matchMedia('(min-width: 768px)')
    const reduced = matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => {
      const maximum = viewport.scrollWidth - viewport.clientWidth
      setNavigation({ visible: wide.matches && maximum > 1, previous: viewport.scrollLeft > 1, next: viewport.scrollLeft < maximum - 1 })
    }
    const resize = () => {
      if (!wide.matches) {
        // A focused later profile becomes hidden when switching to the compact list.
        const focused = document.activeElement
        if (focused instanceof HTMLElement && viewport.contains(focused) && !focused.getClientRects().length) {
          directory.current?.querySelector('a')?.focus({ preventScroll: true })
        }
        viewport.scrollTo({ left: 0, behavior: 'instant' })
      }
      update()
    }
    const stopMotion = () => {
      if (reduced.matches) viewport.scrollTo({ left: viewport.scrollLeft, behavior: 'instant' })
    }
    const observer = new ResizeObserver(resize)
    observer.observe(viewport)
    wide.addEventListener('change', resize)
    reduced.addEventListener('change', stopMotion)
    viewport.addEventListener('scroll', update, { passive: true })
    resize()
    return () => {
      observer.disconnect()
      wide.removeEventListener('change', resize)
      reduced.removeEventListener('change', stopMotion)
      viewport.removeEventListener('scroll', update)
    }
  }, [])

  const browse = (direction: -1 | 1) => {
    const viewport = rail.current
    if (!viewport || (direction < 0 ? !navigation.previous : !navigation.next)) return
    const first = viewport.firstElementChild
    const second = first?.nextElementSibling
    if (!first || !second) return
    const step = second.getBoundingClientRect().left - first.getBoundingClientRect().left
    viewport.scrollBy({ left: direction * step * 3, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
  }

  return <div className={styles.browser}>
    <div className={`team-list ${styles.rail}`} id="featured-specialists" ref={rail} role="region" aria-label="Featured specialists" tabIndex={navigation.visible ? 0 : undefined} data-enhanced={navigation.visible || undefined}>
      {children}
      <div className={styles.directory} ref={directory}>
        <Link className={styles.directoryLink} href="/doctors"><span>View all doctors</span><span className={styles.directoryArrow} aria-hidden="true">→</span></Link>
      </div>
    </div>
    {navigation.visible && <div className={styles.controls} role="group" aria-label="Browse featured specialists">
      <button className={styles.control} type="button" aria-label="Previous specialists" aria-controls="featured-specialists" aria-disabled={!navigation.previous} onClick={() => browse(-1)}><span aria-hidden="true">‹</span></button>
      <button className={styles.control} type="button" aria-label="Next specialists" aria-controls="featured-specialists" aria-disabled={!navigation.next} onClick={() => browse(1)}><span aria-hidden="true">›</span></button>
    </div>}
  </div>
}
