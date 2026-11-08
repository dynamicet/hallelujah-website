'use client'

import { InterfaceLink as Link } from '@/website/interface-language'
import { useEffect, useState } from 'react'
import { carePathWithDoctor } from '@/demo/care-model'
import { ClinicianPortrait } from '@/design-system/components/clinician-portrait'
import styles from './appointment-doctor-identity.module.css'

export type AppointmentDoctorIdentity = Readonly<{
  publicId: string; name: string; specialties: readonly string[]; portraitSrc?: string
}>

/** The local preview's identity follows the actual form selection, including route changes. */
export function AppointmentDoctorIdentity({ doctors, initialDoctorId, serviceContext, services = [] }: {
  readonly doctors: readonly AppointmentDoctorIdentity[]; readonly initialDoctorId?: string
  readonly services?: readonly { publicId: string; name: string; canonicalPath: string }[]
  readonly serviceContext?: { readonly doctorId: string; readonly name: string; readonly href: string }
}) {
  const [selectedId, setSelectedId] = useState(initialDoctorId)
  const [serviceId, setServiceId] = useState<string>()
  useEffect(() => {
    const form = document.querySelector<HTMLFormElement>('#appointment-request-form')
    if (!form) return
    const sync = () => {
      const route = form.querySelector<HTMLInputElement>('input[name="care_route"]:checked')?.value
      setSelectedId(route !== 'not_sure' ? form.querySelector<HTMLSelectElement>('#doctor-id')?.value : undefined)
      setServiceId(route !== 'not_sure' ? form.querySelector<HTMLSelectElement>('#service-id')?.value : undefined)
    }
    sync()
    form.addEventListener('change', sync)
    form.addEventListener('appointment-selection-change', sync)
    return () => { form.removeEventListener('change', sync); form.removeEventListener('appointment-selection-change', sync) }
  }, [])
  const selectedService = services.find((entry) => entry.publicId === serviceId)
  const context = selectedService ? { doctorId: selectedId, name: selectedService.name, href: carePathWithDoctor(selectedService, selectedId) } : services.length ? undefined : serviceContext
  const doctor = doctors.find((entry) => entry.publicId === selectedId)
  return <div className={styles.identity} data-appointment-doctor-identity hidden={!doctor} data-clinician-identity-id={doctor?.publicId}>
    {doctor ? <>
      <ClinicianPortrait key={doctor.publicId} name={doctor.name} src={doctor.portraitSrc} />
      <div><p className={styles.name}>{doctor.name}</p><p>{doctor.specialties.join(' · ')}</p>
        {!doctor.portraitSrc ? <p className={styles.disclosure}>Portrait unavailable</p> : null}
      </div>
      {context?.doctorId === doctor.publicId ? <div className={styles.serviceContext} data-appointment-service-context>
        <p>Selected specialty or service</p><p><strong>{context.name}</strong></p>
        <Link href={`${context.href}#care-team`}>Back to care details</Link>
      </div> : null}
    </> : null}
  </div>
}
