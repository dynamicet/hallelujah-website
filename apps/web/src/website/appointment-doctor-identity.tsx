'use client'

import { InterfaceLink as Link } from '@/website/interface-language'
import { useEffect, useState } from 'react'
import { ClinicianPortrait } from '@/design-system/components/clinician-portrait'
import styles from './appointment-doctor-identity.module.css'

export type AppointmentDoctorIdentity = Readonly<{
  publicId: string; name: string; specialties: readonly string[]; portraitSrc?: string
}>

/** The local preview's identity follows the actual form selection, including route changes. */
export function AppointmentDoctorIdentity({ doctors, initialDoctorId, serviceContext }: {
  readonly doctors: readonly AppointmentDoctorIdentity[]; readonly initialDoctorId?: string
  readonly serviceContext?: { readonly doctorId: string; readonly name: string; readonly href: string }
}) {
  const [selectedId, setSelectedId] = useState(initialDoctorId)
  useEffect(() => {
    const form = document.querySelector<HTMLFormElement>('#appointment-request-form')
    if (!form) return
    const sync = () => {
      const route = form.querySelector<HTMLInputElement>('input[name="care_route"]:checked')?.value
      setSelectedId(route === 'doctor' ? form.querySelector<HTMLSelectElement>('#doctor-id')?.value : undefined)
    }
    sync()
    form.addEventListener('change', sync)
    return () => form.removeEventListener('change', sync)
  }, [])
  const doctor = doctors.find((entry) => entry.publicId === selectedId)
  return <div className={styles.identity} data-appointment-doctor-identity hidden={!doctor} data-clinician-identity-id={doctor?.publicId}>
    {doctor ? <>
      <ClinicianPortrait key={doctor.publicId} name={doctor.name} src={doctor.portraitSrc} />
      <div><p className={styles.name}>{doctor.name}</p><p>{doctor.specialties.join(' · ')}</p>
        {!doctor.portraitSrc ? <p className={styles.disclosure}>Portrait unavailable</p> : null}
      </div>
      {serviceContext?.doctorId === doctor.publicId ? <div className={styles.serviceContext} data-appointment-service-context>
        <p>Service you explored</p><p><strong>{serviceContext.name}</strong></p>
        <Link href={`${serviceContext.href}#care-team`}>Back to service details</Link>
      </div> : null}
    </> : null}
  </div>
}
