'use client'

import { useEffect, useState } from 'react'
import styles from './information-pages.module.css'

export function RoleReference({ reference }: { reference: string }) {
  const [message, setMessage] = useState('')
  useEffect(() => {
    if (!message) return
    const timer = window.setTimeout(() => setMessage(''), 4000)
    return () => window.clearTimeout(timer)
  }, [message])

  async function copyReference() {
    try {
      await navigator.clipboard.writeText(reference)
      setMessage('✓ Copied')
    } catch {
      setMessage('Select the reference to copy it manually.')
    }
  }

  return <div className={styles.reference}>
    <strong>Role reference:</strong> <span>{reference}</span>
    <button type="button" aria-label={`Copy ${reference}`} onClick={copyReference}>Copy</button>
    <span role="status">{message}</span>
  </div>
}
