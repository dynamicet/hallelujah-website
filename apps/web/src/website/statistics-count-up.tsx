'use client'

import { useEffect, useRef } from 'react'

/** Enhance the server-rendered final values; the animated text is decorative. */
export function StatisticsCountUp() {
  const marker = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const section = marker.current?.closest<HTMLElement>('.hospital-statistics')
    const list = section?.querySelector('.hospital-statistics-list')
    if (!section || !list) return
    const root = section

    const number = new Intl.NumberFormat('en')
    const reduced = matchMedia('(prefers-reduced-motion: reduce)')
    const entries = [...section.querySelectorAll<HTMLElement>('[data-count-to]')].flatMap((element) => {
      const overlay = element.querySelector<HTMLElement>('.statistics-count-overlay')
      const target = Number(element.dataset.countTo)
      return overlay && Number.isFinite(target) ? [{ element, overlay, target }] : []
    })
    let frame = 0
    let disposed = false

    function finish() {
      cancelAnimationFrame(frame)
      entries.forEach(({ element, overlay }) => {
        overlay.hidden = true
        delete element.dataset.counting
      })
      root.dataset.countState = 'complete'
    }

    function start() {
      if (disposed || started.current || reduced.matches) return
      started.current = true
      observer.disconnect()
      root.dataset.countState = 'running'
      entries.forEach(({ element, overlay }) => {
        overlay.textContent = '0'
        overlay.hidden = false
        element.dataset.counting = 'true'
      })
      const beginning = performance.now()
      function tick(now: number) {
        if (disposed) return
        if (reduced.matches) { finish(); return }
        let pending = false
        entries.forEach(({ element, overlay, target }, index) => {
          const progress = Math.min(1, Math.max(0, (now - beginning - index * 60) / 900))
          overlay.textContent = number.format(Math.round(target * (1 - (1 - progress) ** 3)))
          if (progress === 1) {
            overlay.hidden = true
            delete element.dataset.counting
          } else pending = true
        })
        if (pending) frame = requestAnimationFrame(tick)
        else finish()
      }
      frame = requestAnimationFrame(tick)
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) start()
    }, { threshold: .35, rootMargin: '0px 0px -10% 0px' })
    function preference() {
      if (reduced.matches) {
        started.current = true
        observer.disconnect()
        finish()
      }
    }
    reduced.addEventListener('change', preference)
    if (started.current || reduced.matches) {
      started.current = true
      finish()
    } else {
      section.dataset.countState = 'ready'
      observer.observe(list)
    }

    return () => {
      disposed = true
      observer.disconnect()
      reduced.removeEventListener('change', preference)
      finish()
    }
  }, [])

  return <span hidden ref={marker} />
}
