'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'

export function ArticleReadingGuide({ chapters }: { chapters: readonly { id: string; label: string }[] }) {
  const nav = useRef<HTMLElement>(null)
  const [active, setActive] = useState<string | null>(null)
  useEffect(() => {
    const article = nav.current?.closest('article')
    if (!article) return
    const visible = new Map<Element, number>()
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) visible.set(entry.target, entry.intersectionRatio)
        else visible.delete(entry.target)
      })
      const current = [...visible].sort((a, b) => b[1] - a[1])[0]?.[0]
      setActive(current?.id ?? null)
    }, { rootMargin: '-20% 0px -35% 0px', threshold: [0, .2, .5, 1] })
    article.querySelectorAll('[data-reading-section]').forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])
  const index = chapters.findIndex((chapter) => chapter.id === active)
  return <nav className="article-reading-guide" ref={nav} aria-label="In this story"
    data-active={index >= 0} style={{ '--reading-index': Math.max(index, 0), '--reading-count': chapters.length } as CSSProperties}>
    <p>In this story</p>
    <div>{chapters.map((chapter, position) => <a key={chapter.id} href={`#${chapter.id}`} aria-current={active === chapter.id ? 'location' : undefined}>
      <span aria-hidden="true">{String(position + 1).padStart(2, '0')}</span>{chapter.label}
    </a>)}</div>
  </nav>
}
