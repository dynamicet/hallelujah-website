import { Suspense } from 'react'
import { DemoInteractions } from '@/demo/appointment-interactions'
import { demoClinicianPortraits } from '@/demo/clinician-portraits'
import { AppointmentDoctorIdentity } from '@/website/appointment-doctor-identity'
import { AppointmentTemplate } from '@/design-system/templates'
import { clinicians, services, demoShell, requireLocalDemo, type DemoSearchParams } from '@/demo/site'
import { demoScenario } from '@/demo/scenarios'
import { isRequestableCare, resolveCareSelection } from '@/demo/care-model'
import { AppointmentVisitType } from '@/website/appointment-visit-type'

export const metadata = { title: 'Appointment information | Hallelujah Hospital' }

export default async function AppointmentPage({ searchParams }: { searchParams: DemoSearchParams }) {
  requireLocalDemo()
  const parameters = await searchParams
  const scenario = demoScenario(parameters.demo, ['editing', 'validation', 'pending', 'known-failure',
    'unknown', 'duplicate', 'receipt', 'delivery-warning', 'workflow-unavailable'] as const, 'editing')
  const runScenario = parameters.start === 'editing' && ['known-failure', 'unknown', 'duplicate', 'delivery-warning'].includes(scenario)
  const selection = resolveCareSelection({
    doctorId: typeof parameters.doctor === 'string' ? parameters.doctor : undefined,
    serviceId: typeof parameters.service === 'string' ? parameters.service : undefined,
  })
  const selected = clinicians.find((entry) => entry.publicId === selection.doctorId)
  const careServices = services.filter((service) => isRequestableCare(service.publicId))
  const selectedService = careServices.find((entry) => entry.publicId === selection.serviceId)
  const doctors = clinicians
  const serviceChoices = careServices
  return <><AppointmentTemplate
    doctorIdentity={<AppointmentDoctorIdentity doctors={clinicians.map((entry) => ({ publicId: entry.publicId, name: entry.details.name, specialties: entry.details.specialties, portraitSrc: demoClinicianPortraits[entry.publicId] }))} initialDoctorId={selected?.publicId} services={careServices.map(({ publicId, name, canonicalPath }) => ({ publicId, name, canonicalPath }))} serviceContext={selected && selectedService ? { doctorId: selected.publicId, name: selectedService.name, href: selectedService.canonicalPath } : undefined} />}
    visitType={<AppointmentVisitType />}
    doctorOptions={[{ label: 'No doctor preference', value: '' }, ...doctors.map((entry) => ({ label: entry.details.name, value: entry.publicId }))]}
    eyebrow="Appointment information"
    privacyDisclosure={null}
    recipientLabel="Patient Experience Team"
    serviceOptions={[{ label: 'No specialty or service preference', value: '' }, ...serviceChoices.map((entry) => ({ label: entry.name, value: entry.publicId }))]}
    shell={demoShell('/appointment')}
    state={{ interactive: true, localSimulation: true, kind: runScenario ? 'editing' : scenario, outcome: runScenario ? scenario : undefined,
      selectedCareRoute: selected ? 'doctor' : selectedService ? 'service' : 'not_sure',
      selectedDoctorId: selection.doctorId, selectedServiceId: selection.serviceId, selectionNotice: selection.notice,
      errors: scenario === 'validation' ? ['phone', 'privacy-acknowledged'] : [], specimenReference: 'HH-1042' }}
    title="Request an appointment"
    warning="Online appointment requests cannot provide emergency help."
  /><Suspense fallback={null}><DemoInteractions /></Suspense></>
}
