'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function WebsiteMotion() {
  const pathname = usePathname()
  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const header = document.querySelector<HTMLElement>('[data-site-header]')
    const measureHeader = () => {
      document.documentElement.style.setProperty('--site-header-height', `${header?.offsetHeight ?? 0}px`)
    }
    const resizeObserver = new ResizeObserver(measureHeader)
    if (header) resizeObserver.observe(header)
    measureHeader()

    const seen = new WeakSet<HTMLElement>()
    const active = new Map<HTMLElement, Animation[]>()
    const settle = (element: HTMLElement) => {
      const animations = active.get(element)
      active.delete(element)
      exits.unobserve(element)
      animations?.forEach((animation) => animation.cancel())
      element.classList.remove('website-entered')
      element.style.removeProperty('--motion-step')
    }
    // Fast scrolling settles entrances that leave the viewport, rather than
    // leaving a delayed animation waiting for the visitor to scroll back.
    const exits = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) settle(entry.target as HTMLElement)
      })
    })
    const chapters = new Set<HTMLElement>()
    const chapterObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle('motion-chapter-active', entry.isIntersecting)
      })
    }, { rootMargin: '-10% 0px -20% 0px' })
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        const element = entry.target as HTMLElement
        observer.unobserve(element)
        // Focus and essential actions must never wait for an entrance.
        if (reducedMotion.matches || element.matches(':focus-within')) return
        const step = Number(element.dataset.reveal) || 0
        element.style.setProperty('--motion-step', String(Math.min(3, Math.max(0, step))))
        element.classList.add('website-entered')
        const entrances = element.getAnimations().filter((animation) =>
          animation instanceof CSSAnimation && animation.animationName.startsWith('website-'))
        active.set(element, entrances)
        exits.observe(element)
        void Promise.allSettled(entrances.map((animation) => animation.finished)).then(() => {
          // A completed effect from an old route must not clear a new effect.
          if (active.get(element) === entrances) settle(element)
        })
      })
    }, { threshold: .08, rootMargin: '0px 0px -5% 0px' })
    const register = (root: ParentNode) => {
      const chapterElements = [...root.querySelectorAll<HTMLElement>('.enhanced-home [data-motion-chapter]')]
      if (root instanceof HTMLElement && root.matches('.enhanced-home [data-motion-chapter]')) chapterElements.push(root)
      chapterElements.forEach((element) => {
        if (chapters.has(element)) return
        chapters.add(element)
        element.classList.add('motion-chapter-ready')
        chapterObserver.observe(element)
      })
      const elements = [...root.querySelectorAll<HTMLElement>('[data-reveal]')]
      if (root instanceof HTMLElement && root.matches('[data-reveal]')) elements.push(root)
      elements.forEach((element) => {
        if (seen.has(element)) return
        seen.add(element)
        observer.observe(element)
      })
    }
    register(document)
    // Also register streamed or conditionally rendered content, once per mount.
    const mutations = new MutationObserver((records) => {
      records.forEach((record) => record.addedNodes.forEach((node) => {
        if (node instanceof HTMLElement) register(node)
      }))
      active.forEach((_, element) => { if (!element.isConnected) settle(element) })
    })
    mutations.observe(document.body, { childList: true, subtree: true })
    const onMotionPreferenceChange = () => {
      if (reducedMotion.matches) active.forEach((_, element) => settle(element))
    }
    const onFocus = (event: FocusEvent) => {
      if (!(event.target instanceof Element)) return
      const target = event.target
      active.forEach((_, element) => { if (element.contains(target)) settle(element) })
    }
    reducedMotion.addEventListener('change', onMotionPreferenceChange)
    document.addEventListener('focusin', onFocus)
    return () => {
      observer.disconnect()
      exits.disconnect()
      chapterObserver.disconnect()
      chapters.forEach((element) => element.classList.remove('motion-chapter-ready', 'motion-chapter-active'))
      mutations.disconnect()
      resizeObserver.disconnect()
      document.documentElement.style.removeProperty('--site-header-height')
      reducedMotion.removeEventListener('change', onMotionPreferenceChange)
      document.removeEventListener('focusin', onFocus)
      active.forEach((_, element) => settle(element))
    }
  }, [pathname])
  return null
}
