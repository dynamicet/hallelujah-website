import { requestAppointmentLabel } from '@/appointment/copy'
import { carePageImages } from '@/website/care-page-image'
import { directoryServices, serviceDirectorySource } from '@/demo/service-directory-return'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ServiceCareTeam } from './service-care-team'
import { demoClinicianPortraits } from '@/demo/clinician-portraits'
import { clinicians, requireLocalDemo, type DemoSearchParams } from '@/demo/site'
import { serviceVisitQuestions } from '@/demo/service-details'
import { careContent } from '@/demo/care-content'
import { appointmentHref, careEntry, carePathWithDoctor, isRequestableCare, relatedDoctorIds } from '@/demo/care-model'
import { PatientPage, PatientSection, patientPageStyles as styles } from '@/website/patient-page'
import serviceStyles from '@/website/service-page.module.css'

async function resolveService(params: Promise<{ slug: string }>) {
  requireLocalDemo()
  const { slug } = await params
  const service = directoryServices.find((entry) => entry.canonicalPath === `/services/${slug}/`)
  if (!service) notFound()
  return service
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const service = await resolveService(params)
  return { title: `${service.name} | Hallelujah Hospital`,
    description: service.sections.scope?.join(' ') || `Explore ${service.name.toLowerCase()} information and prepare questions for your visit to Hallelujah Hospital.` }
}

export default async function ServicePage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: DemoSearchParams }) {
  const service = await resolveService(params)
  const parameters = await searchParams
  const directoryHref = serviceDirectorySource(parameters.from)
  const directoryLabel = directoryHref ? 'Back to service results' : 'View all services'
  if (service.publicId === 'pub_111111111111') {
    return <PatientPage variant="document" title="Admission guidance" description="Information for patients and families arranging a planned hospital stay." current={service.canonicalPath}>
      <Link className={serviceStyles.backLink} href={directoryHref ?? '/services'}>{directoryHref ? <span aria-hidden="true">←</span> : null}{directoryLabel}</Link>
      <PatientSection id="care-team" title="Arranging a hospital stay">
        <p>Reception can connect you with the admissions team for questions about check-in and visits from family. If you already have admission instructions, follow the arrangements from your care team.</p>
        <div className={styles.actions}>
          <Link className="solid-button blue-button" href="/contact#contact-reception">Contact reception <span aria-hidden="true">→</span></Link>
          <Link className="text-link" href="/contact#what-to-bring">What to bring</Link>
        </div>
      </PatientSection>
      <PatientSection id="referrals" title="Referring a patient?">
        <Link className="text-link" href="/referrals">Referral information <span aria-hidden="true">→</span></Link>
      </PatientSection>
    </PatientPage>
  }
  const care = careEntry(service.publicId)
  const copy = careContent[service.publicId]
  const specialty = care?.kind === 'specialty'
  const related = clinicians.filter((doctor) => relatedDoctorIds(service.publicId).includes(doctor.publicId))
  const requestedDoctor = typeof parameters.doctor === 'string' ? parameters.doctor : undefined
  const selectedDoctor = isRequestableCare(service.publicId) ? related.find((doctor) => doctor.publicId === requestedDoctor) : undefined
  const contextUnavailable = parameters.doctor !== undefined && !selectedDoctor
  const requestHref = appointmentHref({ serviceId: service.publicId, doctorId: selectedDoctor?.publicId }, directoryHref)
  const action = care?.access === 'appointment' ? { href: requestHref, label: requestAppointmentLabel }
    : care?.access === 'referral' ? { href: '/referrals', label: 'Referral & admission guidance' }
    : care?.access === 'emergency' ? { href: '/emergency', label: 'Emergency information' }
    : { href: '/contact#contact-reception', label: 'Contact reception' }
  const connectedCare = directoryServices.filter((entry) => specialty
    ? careEntry(entry.publicId)?.specialtyIds.includes(service.publicId)
    : care?.specialtyIds.includes(entry.publicId))
  const preparation = service.sections.preparation ?? (copy?.preparation ? [copy.preparation] : [])
  const questions = serviceVisitQuestions[service.publicId] ?? []
  const hasPreparation = preparation.length > 0 || questions.length > 0
  return <PatientPage variant="care-detail" image={/heart|cardio/i.test(service.name) ? carePageImages.heart : /rehab|physio/i.test(service.name) ? carePageImages.recovery : carePageImages.general} title={service.name} description={service.sections.scope?.join(' ') ?? 'Explore this area of care and prepare for your visit.'}
    current={service.canonicalPath}
    action={action} secondaryAction={related.length ? { href: '#care-team', label: 'Meet the care team' } : undefined}>
    <Link className={serviceStyles.backLink} href={directoryHref ?? '/services'}>{directoryHref ? <span aria-hidden="true">←</span> : null}{directoryLabel}</Link>
    {selectedDoctor ? <aside className={serviceStyles.selectionContext} aria-label="Doctor preference">
      <p>Exploring {service.name} with <strong>{selectedDoctor.details.name}</strong>. Your doctor preference will continue into the appointment request.</p>
      <Link href={carePathWithDoctor(service, undefined, directoryHref)}>Explore without a doctor preference</Link>
    </aside> : contextUnavailable ? <aside className={serviceStyles.selectionContext} aria-label="Doctor preference unavailable">
      <p>That doctor preference does not apply to this care. Explore the care team below or continue with this care option.</p>
    </aside> : null}
    <PatientSection id="your-care" title={specialty ? 'Your consultation' : 'About your care'}>
      <p>{copy?.about ?? service.sections.scope?.join(' ')}</p>
      {service.sections['common-needs']?.map((text) => <p key={text}>{text}</p>)}
    </PatientSection>
    {connectedCare.length ? <PatientSection id="related-care" title={specialty ? 'Tests & treatments' : 'Related specialties'}>
      <p>{specialty ? 'Your doctor may discuss these services as part of your care plan. Each has its own team and arrangements.' : 'Explore the specialties connected with this service.'}</p>
      <ul>{connectedCare.map((entry) => <li key={entry.publicId}><Link href={carePathWithDoctor(entry, selectedDoctor?.publicId, directoryHref)}>{entry.name}</Link></li>)}</ul>
    </PatientSection> : null}
    {hasPreparation ? <PatientSection id="prepare" title="Before your visit" context="preparation">
      {preparation.map(text => <p key={text}>{text}</p>)}
      {!preparation.length && questions.length ? <ul>{questions.map(question => <li key={question}>{question}</li>)}</ul> : null}
    </PatientSection> : null}
    <PatientSection id="care-team" title={related.length ? 'Meet the care team' : 'Arrange care'}>
      {related.length ? <><p>{specialty ? 'Meet doctors in this specialty and explore their areas of care.' : 'These doctors provide this service. View a profile to learn more or carry your care choice into an appointment request.'}</p><ServiceCareTeam doctors={related.map(doctor => ({ publicId: doctor.publicId, name: doctor.details.name, specialties: doctor.details.specialties,
        portraitSrc: demoClinicianPortraits[doctor.publicId], href: `${doctor.canonicalPath}?${new URLSearchParams({
          service: service.publicId,
          ...(directoryHref ? { from: directoryHref } : {}),
        })}` }))} /><h3>Arrange your visit</h3></> : null}
      <div id="referrals" tabIndex={-1}>
        {(service.sections.referral ?? [!related.length && copy?.team ? copy.team
          : care?.access === 'referral' ? 'Coordinate your planned admission with your referring clinician and the admissions team.'
          : care?.access === 'contact' ? 'Contact reception to reach the care team and arrange an initial assessment.'
          : related.length ? 'Choose a listed doctor or request this care with no doctor preference. The team will confirm your visit arrangements.'
          : `Request ${service.name} without choosing an individual doctor. The care team will discuss your needs and confirm your visit arrangements.`]).map((text) => <p key={text}>{text}</p>)}
        <Link className="text-link" href={action.href}>{action.label} <span aria-hidden="true">→</span></Link>
        <p>Need urgent help? <Link href="/emergency">Read emergency information.</Link></p>
      </div>
    </PatientSection>
  </PatientPage>
}
