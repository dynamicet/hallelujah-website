import { carePageImages } from '@/website/care-page-image'
import { visitGuides } from '@/demo/visit-guides'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ClinicianPortrait } from '@/design-system/components'
import { demoClinicianPortraits } from '@/demo/clinician-portraits'
import { serviceDirectoryFromViews, serviceDirectoryUrl } from '@/content/service-directory'
import { clinicians, data, requireLocalDemo, services, type DemoSearchParams } from '@/demo/site'
import { serviceVisitQuestions } from '@/demo/service-details'
import { careContent } from '@/demo/care-content'
import { appointmentHref, careEntry, carePathWithDoctor, isRequestableCare, relatedDoctorIds } from '@/demo/care-model'
import { healthTopics } from '@/demo/health-topics'
import { PatientPage, PatientSection, patientPageStyles as styles } from '@/website/patient-page'
import serviceStyles from '@/website/service-page.module.css'

async function resolveService(params: Promise<{ slug: string }>) {
  requireLocalDemo()
  const { slug } = await params
  const service = services.find((entry) => entry.canonicalPath === `/services/${slug}/`)
  if (!service) notFound()
  return service
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const service = await resolveService(params)
  return { title: `${visitGuides[service.publicId]?.title ?? service.name} | Hallelujah Hospital` }
}

export default async function ServicePage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: DemoSearchParams }) {
  const service = await resolveService(params)
  const parameters = await searchParams
  let directoryHref = '/services'
  if (typeof parameters.from === 'string' && parameters.from.startsWith('/services')) {
    const source = new URL(parameters.from, 'https://local.invalid')
    if (source.origin === 'https://local.invalid' && source.pathname === '/services') {
      const directory = serviceDirectoryFromViews({ entries: services.filter((entry) => !visitGuides[entry.publicId]),
        filters: data.serviceFilters, locale: 'en', pageSize: 6, searchParameters: source.searchParams })
      directoryHref = serviceDirectoryUrl('/services', directory.state, data.serviceFilters.map((filter) => filter.value))
    }
  }
  const guide = visitGuides[service.publicId]
  if (guide) return <PatientPage variant="document" title={guide.title} description={service.sections.scope?.join(' ') ?? 'Prepare questions for your visit.'} current={service.canonicalPath} action={{ href: '#prepare', label: guide.action }}>
    <PatientSection id="prepare" title="Questions to bring" context="preparation">
      <ul>{serviceVisitQuestions[service.publicId]?.map((question) => <li key={question}>{question}</li>)}</ul>
      <p>Keep your referral, earlier reports and current medicine list together. Follow the preparation instructions provided by your care team and contact reception if you need help planning your arrival.</p>
      <Link href="/patients-visitors#checklist">Make your visit checklist</Link>
    </PatientSection>
    <PatientSection id="care-options" title="Find care for your visit" context="assistance">
      <p><Link href="/services">View specialties &amp; services</Link></p>
      <p><Link href="/appointment">Help choosing care</Link></p>
      <p>Online requests do not provide emergency help. <Link href="/emergency">Read emergency information</Link>.</p>
    </PatientSection>
  </PatientPage>
  const care = careEntry(service.publicId)
  const copy = careContent[service.publicId]
  const specialty = care?.kind === 'specialty'
  const related = clinicians.filter((doctor) => relatedDoctorIds(service.publicId).includes(doctor.publicId))
  const requestedDoctor = typeof parameters.doctor === 'string' ? parameters.doctor : undefined
  const selectedDoctor = isRequestableCare(service.publicId) ? related.find((doctor) => doctor.publicId === requestedDoctor) : undefined
  const contextUnavailable = parameters.doctor !== undefined && !selectedDoctor
  const requestHref = appointmentHref({ serviceId: service.publicId, doctorId: selectedDoctor?.publicId })
  const action = care?.access === 'appointment' ? { href: requestHref, label: 'Request an appointment' }
    : care?.access === 'referral' ? { href: '/referrals', label: 'Referral & admission guidance' }
    : care?.access === 'emergency' ? { href: '/emergency', label: 'Emergency information' }
    : { href: '/#home-call', label: 'Contact reception' }
  const connectedCare = services.filter((entry) => specialty
    ? careEntry(entry.publicId)?.specialtyIds.includes(service.publicId)
    : care?.specialtyIds.includes(entry.publicId))
  const topics = healthTopics.filter((topic) => topic.servicePublicId === service.publicId)
  return <PatientPage variant="care-detail" image={/heart|cardio/i.test(service.name) ? carePageImages.heart : /rehab|physio/i.test(service.name) ? carePageImages.recovery : carePageImages.general} title={service.name} description={service.sections.scope?.join(' ') ?? 'Explore this area of care and prepare for your visit.'}
    current={service.canonicalPath}
    action={action}>
    <Link className={serviceStyles.backLink} href={directoryHref}><span aria-hidden="true">←</span> Back to service results</Link>
    {selectedDoctor ? <aside className={serviceStyles.selectionContext} aria-label="Doctor preference">
      <p>Exploring {service.name} with <strong>{selectedDoctor.details.name}</strong>. Your doctor preference will continue into the appointment request.</p>
      <Link href={service.canonicalPath}>Explore without a doctor preference</Link>
    </aside> : contextUnavailable ? <aside className={serviceStyles.selectionContext} aria-label="Doctor preference unavailable">
      <p>That doctor preference does not apply to this care. Explore the care team below or continue with this care option.</p>
    </aside> : null}
    <nav className={styles.jumpLinks} aria-label="On this service page">
      <a href="#your-care">{specialty ? 'About this specialty' : 'About this service'}</a>{connectedCare.length ? <a href="#related-care">{specialty ? 'Tests & treatments' : 'Related specialties'}</a> : null}<a href="#prepare">Preparation</a><a href="#care-team">{related.length ? 'Care team & appointments' : 'Arrange care'}</a>
    </nav>
    <dl className={serviceStyles.overview} aria-label="Service at a glance">
      <div><dt>Area of care</dt><dd>{service.group.name}</dd></div>
      <div><dt>Explore the team</dt><dd><a href="#care-team">{related.length ? `${related.length} ${related.length === 1 ? 'doctor' : 'doctors'}` : 'Care team support'} <span aria-hidden="true">↓</span></a></dd></div>
      <div><dt>Arrange care</dt><dd>{care?.access === 'appointment' ? 'Appointment request' : care?.access === 'referral' ? 'Referral & admission' : care?.access === 'emergency' ? 'Emergency information' : 'Contact the team'}</dd></div>
    </dl>
    <PatientSection id="your-care" title={specialty ? 'Your consultation' : 'About your care'}>
      <p>{copy?.about ?? service.sections.scope?.join(' ')}</p>
      {service.sections['common-needs']?.map((text) => <p key={text}>{text}</p>)}
      <h3>Questions to bring</h3>
      <ul>{(serviceVisitQuestions[service.publicId] ?? ['Which previous reports or referral details should I bring?', 'What should I expect at my first visit?']).map((question) => <li key={question}>{question}</li>)}</ul>
    </PatientSection>
    {connectedCare.length ? <PatientSection id="related-care" title={specialty ? 'Tests & treatments' : 'Related specialties'}>
      <p>{specialty ? 'Your doctor may discuss these services as part of your care plan. Each has its own team and arrangements.' : 'Explore the specialties connected with this service.'}</p>
      <ul>{connectedCare.map((entry) => <li key={entry.publicId}><Link href={carePathWithDoctor(entry, selectedDoctor?.publicId)}>{entry.name}</Link></li>)}</ul>
    </PatientSection> : null}
    <PatientSection id="prepare" title="Before your visit" context="preparation">
      {topics.length ? <><h3>Questions about a concern?</h3><ul>{topics.map((topic) => <li key={topic.id}><Link href={`/health-topics/${topic.id}`}>{topic.name}: prepare for a conversation</Link></li>)}</ul></> : null}
      {(service.sections.preparation ?? [copy?.preparation ?? 'Bring earlier reports and any referral letter. Follow the preparation instructions provided by your care team.']).map((text) => <p key={text}>{text}</p>)}
      <Link className="text-link" href="/patients-visitors#before">Read the visit guide <span aria-hidden="true">→</span></Link>
    </PatientSection>
    <PatientSection id="care-team" title={related.length ? 'Meet the care team' : care?.access === 'contact' ? 'Arrange an assessment' : care?.access === 'referral' ? 'Plan your admission' : 'Your care team'}>
      {related.length ? <><p>{specialty ? 'Meet doctors in this specialty and explore their areas of care.' : 'These doctors provide this service. View a profile to learn more or carry your care choice into an appointment request.'}</p><ul className={serviceStyles.careTeam}>{related.map((doctor) => <li key={doctor.publicId}>
        <Link href={`${doctor.canonicalPath}?service=${encodeURIComponent(service.publicId)}`} aria-label={`View profile for ${doctor.details.name}`}>
          <ClinicianPortrait name={doctor.details.name} src={demoClinicianPortraits[doctor.publicId]} />
          <span className={serviceStyles.doctorDetails}><strong>{doctor.details.name}</strong><span>{doctor.details.specialties.join(' · ')}</span><span className={serviceStyles.profileAction}>View profile <span aria-hidden="true">→</span></span></span>
        </Link>
      </li>)}</ul><h3>Arrange your visit</h3></> : null}
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
