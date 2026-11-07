'use client'

import { useState } from 'react'
import { ClinicianMonogram } from './clinician-monogram'

/** A portrait is supplied explicitly; absent or failed assets keep the name's initials. */
export function ClinicianPortrait({ name, src, className, transitionName }: {
  readonly name: string; readonly src?: string; readonly className?: string; readonly transitionName?: string
}) {
  const [failedSource, setFailedSource] = useState<string>()
  if (!src || failedSource === src) return <ClinicianMonogram name={name} className={className} transitionName={transitionName} />
  // The adjacent clinician name labels the identity; the image adds recognition without repeating it.
  // eslint-disable-next-line @next/next/no-img-element
  return <img alt="" className={className} data-clinician-portrait height={512} loading="lazy" onError={() => setFailedSource(src)} src={src} style={{ viewTransitionName: transitionName }} width={512} />
}
