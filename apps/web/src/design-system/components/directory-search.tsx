'use client'

import { InterfaceCopy } from '@/website/interface-language'

import Form from 'next/form'
import { useEffect, useLayoutEffect, useRef, type ReactNode } from 'react'
import { useFormStatus } from 'react-dom'

import styles from './search-controls.module.css'

/** Preserve controls, focus and scroll while the server resolves a GET search. */
export function DirectorySearchForm({ action, children, label, resultKey }: {
  readonly action: string
  readonly children: ReactNode
  readonly label: string
  readonly resultKey: string
}) {
  const form = useRef<HTMLFormElement>(null)
  const previous = useRef(resultKey)
  useLayoutEffect(() => {
    if (previous.current === resultKey) return
    previous.current = resultKey
    // React updates default values from the server, but dirty native inputs
    // retain their edits. Restore those defaults on committed history changes
    // without replacing controls or taking keyboard focus away.
    form.current?.reset()
  }, [resultKey])
  return <InterfaceCopy><Form ref={form} action={action} scroll={false} aria-label={label}
    className={styles.form} data-search-controls-form role="search">
    {children}
  </Form></InterfaceCopy>
}

export function DirectoryResultCount({ children, id, resultKey }: {
  readonly children: ReactNode
  readonly id: string
  readonly resultKey: string
}) {
  const { pending } = useFormStatus()
  const count = useRef<HTMLParagraphElement>(null)
  const previous = useRef(resultKey)

  useEffect(() => {
    if (pending || previous.current === resultKey) return
    previous.current = resultKey
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (reduced.matches || !count.current) return
    // A single color acknowledgment, never a delayed or moving result list.
    const animation = count.current.animate([
      { backgroundColor: 'var(--site-pale)' },
      { backgroundColor: 'transparent' },
    ], { duration: 480, easing: 'ease-out' })
    const settle = () => { if (reduced.matches) animation.cancel() }
    reduced.addEventListener('change', settle)
    return () => {
      animation.cancel()
      reduced.removeEventListener('change', settle)
    }
  }, [pending, resultKey])

  return <InterfaceCopy><p ref={count} id={id} className={`${styles.resultCount} ${styles.directoryCount}`}
    data-result-count data-search-pending={pending || undefined}
    role="status" aria-live="polite" aria-atomic="true">
    {pending ? 'Updating results…' : children}
  </p></InterfaceCopy>
}
