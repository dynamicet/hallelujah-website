'use client'

import { useState } from 'react'

export function CopyArrivalDirections({ text }: { readonly text: string }) {
  const [message, setMessage] = useState('')

  async function copy() {
    try {
      await navigator.clipboard.writeText(text)
      setMessage('Illustrative directions copied.')
    } catch {
      setMessage('Copy unavailable. Select the written directions above instead.')
    }
  }

  return <>
    <button onClick={copy} type="button">Copy example directions</button>
    <span aria-live="polite" role="status">{message}</span>
  </>
}
