'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import styles from './equipment-showcase.module.css'

type Chapter = Readonly<{ id: string; label: string; name: string; device: 'c-arm' | 'laboratory' | 'dental' }>

export function EquipmentChapterNav({ chapters }: { chapters: readonly Chapter[] }) {
  const nav = useRef<HTMLElement>(null)
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    const section = nav.current?.closest('section')
    if (!section) return
    const visible = new Map<Element, number>()
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) visible.set(entry.target, entry.intersectionRatio)
        else visible.delete(entry.target)
      })
      const current = [...visible].sort((a, b) => b[1] - a[1])[0]?.[0]
      if (current) setActive(current.id)
    }, { rootMargin: '-25% 0px -40% 0px', threshold: [0, .15, .35, .65, 1] })
    section.querySelectorAll('[data-equipment-stop]').forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [])

  return <nav className={`equipment-chapter-nav ${styles.lineup}`} aria-label="Jump to equipment" ref={nav}>
    {chapters.map((chapter) => <a key={chapter.id} href={`#${chapter.id}`}
      aria-label={`Jump to ${chapter.name}`} className={styles.lineupLink}
      aria-current={active === chapter.id ? 'location' : undefined}>
      <span className={styles.lineupObject} data-device={chapter.device}>
        <Image src={`/editorial/equipment-${chapter.device}-cutout-v1.webp`} alt="" fill unoptimized sizes="(min-width: 900px) 18vw, 30vw" />
      </span>
      <span className={styles.lineupLabel}>{chapter.label}</span>
    </a>)}
  </nav>
}
