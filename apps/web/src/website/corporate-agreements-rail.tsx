'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

export function CorporateAgreementsRail({ children }: { children: ReactNode }) {
  const rail = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ previous: false, next: false })

  useEffect(() => {
    const viewport = rail.current
    if (!viewport) return
    const update = () => {
      const previous = viewport.scrollLeft > 1
      const next = viewport.scrollLeft < viewport.scrollWidth - viewport.clientWidth - 1
      setPosition((current) => current.previous === previous && current.next === next ? current : { previous, next })
    }
    const observer = new ResizeObserver(update)
    observer.observe(viewport)
    viewport.addEventListener('scroll', update, { passive: true })
    update()
    return () => {
      observer.disconnect()
      viewport.removeEventListener('scroll', update)
    }
  }, [])

  const browse = (direction: -1 | 1) => {
    if (direction === -1 ? !position.previous : !position.next) return
    const viewport = rail.current
    if (viewport) viewport.scrollBy({ left: direction * viewport.clientWidth * .85 })
  }

  return (
    <>
      <div className="corporate-agreements-heading">
        <h2 id="corporate-agreements-title">Corporate healthcare agreements</h2>
        {(position.previous || position.next) && (
          <div className="corporate-agreements-controls" role="group" aria-label="Browse organizations">
            {([-1, 1] as const).map((direction) => (
              <button key={direction} type="button" aria-controls="corporate-organizations"
                aria-label={direction === -1 ? 'Previous organizations' : 'Next organizations'}
                aria-disabled={direction === -1 ? !position.previous : !position.next}
                onClick={() => browse(direction)}>
                <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7">
                  <path d={direction === -1 ? 'm15 6-6 6 6 6' : 'm9 6 6 6-6 6'} />
                </svg>
              </button>
            ))}
          </div>
        )}
      </div>
      <p>Check with your employer or the hospital before your visit to confirm eligibility.</p>
      <div className="corporate-agreements-rail" id="corporate-organizations" ref={rail}
        tabIndex={0} role="region" aria-label="Organizations">
        {children}
      </div>
    </>
  )
}
