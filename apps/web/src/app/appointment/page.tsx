import { Suspense } from 'react'
import { DemoInteractions } from '@/demo/appointment-interactions'
import { visitGuides } from '@/demo/visit-guides'
import { demoClinicianPortraits } from '@/demo/clinician-portraits'
import { AppointmentDoctorIdentity } from '@/website/appointment-doctor-identity'
import { AppointmentTemplate } from '@/design-system/templates'
import { clinicians, services, demoShell, requireLocalDemo, type DemoSearchParams } from '@/demo/site'
import { demoScenario } from '@/demo/scenarios'
import { relatedServiceIds } from '@/demo/service-details'
import { AppointmentVisitType } from '@/website/appointment-visit-type'

export const metadata = { title: 'Appointment information | Hallelujah Hospital' }

export default async function AppointmentPage({ searchParams }: { searchParams: DemoSearchParams }) {
  requireLocalDemo()
  const parameters = await searchParams
  const scenario = demoScenario(parameters.demo, ['editing', 'validation', 'pending', 'known-failure',
    'unknown', 'duplicate', 'receipt', 'delivery-warning', 'workflow-unavailable'] as const, 'editing')
  const runScenario = parameters.start === 'editing' && ['known-failure', 'unknown', 'duplicate', 'delivery-warning'].includes(scenario)
  const selected = clinicians.find((entry) => entry.publicId === parameters.doctor)
  const careServices = services.filter((service) => !visitGuides[service.publicId])
  const selectedService = careServices.find((entry) => entry.publicId === parameters.service &&
    (!selected || relatedServiceIds(selected.details.specialties).includes(entry.publicId)))
  const doctors = selected ? [selected, ...clinicians.filter((entry) => entry !== selected)] : clinicians
  const serviceChoices = selectedService ? [selectedService, ...careServices.filter((entry) => entry !== selectedService)] : careServices
  return <><AppointmentTemplate
    doctorIdentity={<AppointmentDoctorIdentity doctors={clinicians.map((entry) => ({ publicId: entry.publicId, name: entry.details.name, specialties: entry.details.specialties, portraitSrc: demoClinicianPortraits[entry.publicId] }))} initialDoctorId={selected?.publicId} serviceContext={selected && selectedService ? { doctorId: selected.publicId, name: selectedService.name, href: selectedService.canonicalPath } : undefined} />}
    visitType={<AppointmentVisitType />}
    doctorOptions={[{ disabled: true, label: 'Choose a doctor', value: '' }, ...doctors.map((entry) => ({ label: entry.details.name, value: entry.publicId }))]}
    eyebrow="Appointment information"
    privacyDisclosure={null}
    recipientLabel="Patient Experience Team"
    serviceOptions={[{ disabled: true, label: 'Choose a service', value: '' }, ...serviceChoices.map((entry) => ({ label: entry.name, value: entry.publicId }))]}
    shell={demoShell('/appointment')}
    state={{ interactive: true, localSimulation: true, kind: runScenario ? 'editing' : scenario, outcome: runScenario ? scenario : undefined,
      selectedCareRoute: selected ? 'doctor' : selectedService ? 'service' : 'not_sure',
      errors: scenario === 'validation' ? ['phone', 'privacy-acknowledged'] : [], specimenReference: 'HH-1042' }}
    title="Request an appointment"
    warning="Online appointment requests cannot provide emergency help."
  /><Suspense fallback={null}><DemoInteractions /></Suspense></>
}
