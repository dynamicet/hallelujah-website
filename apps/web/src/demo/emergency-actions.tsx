'use client'

import { useEffect, useState } from 'react'

export function EmergencyContactAction({ label }: { readonly label: string }) {
  const [message, setMessage] = useState('')

  return <div>
    <button className="ds-touch-target" onClick={() => setMessage(`${label} selected. This illustrative number cannot open a call.`)} type="button">
      Review {label.toLowerCase()}
    </button>
    <p aria-live="polite" role="status">{message}</p>
  </div>
}

export function EmergencyDemoMap({ scenario }: { readonly scenario: 'ready' | 'map-failed' | 'map-blocked' | 'call-handoff-unsupported' }) {
  const [state, setState] = useState<'idle' | 'loading' | 'failed' | 'blocked'>(
    scenario === 'map-failed' ? 'failed' : scenario === 'map-blocked' ? 'blocked' : 'idle',
  )

  useEffect(() => {
    if (state !== 'loading') return
    const timeout = window.setTimeout(() => setState('failed'), 450)
    return () => window.clearTimeout(timeout)
  }, [state])

  return <div data-demo-map-state={state}>
    <p>Written directions above remain available throughout this optional map example. No map provider or location request is connected.</p>
    {state === 'idle' ? <button className="ds-touch-target" onClick={() => setState('loading')} type="button">Try example map</button> : null}
    {state === 'loading' ? <p aria-busy="true" role="status">Checking the example map…</p> : null}
    {state === 'failed' ? <div>
      <p role="status">The example map could not load. Use the complete written directions above.</p>
      <button className="ds-touch-target" onClick={() => setState('loading')} type="button">Retry example map</button>
    </div> : null}
    {state === 'blocked' ? <p>Interactive map access is unavailable in this example. Use the complete written directions above.</p> : null}
  </div>
}
