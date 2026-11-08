import { carePageImages } from '@/website/care-page-image'
import { visitGuides } from '@/demo/visit-guides'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ClinicianPortrait } from '@/design-system/components'
import { demoClinicianPortraits } from '@/demo/clinician-portraits'
import { serviceDirectoryFromViews, serviceDirectoryUrl } from '@/content/service-directory'
import { clinicians, data, requireLocalDemo, services, type DemoSearchParams } from '@/demo/site'
import { relatedServiceIds, serviceVisitQuestions } from '@/demo/service-details'
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
  if (guide) return <PatientPage title={guide.title} description={service.sections.scope?.join(' ') ?? 'Prepare questions for your visit.'} current={service.canonicalPath} action={{ href: '#prepare', label: guide.action }}>
    <PatientSection id="prepare" title="Questions to bring">
      <ul>{serviceVisitQuestions[service.publicId]?.map((question) => <li key={question}>{question}</li>)}</ul>
      <p>Preparation and service availability need hospital confirmation. These questions are illustrative and do not provide treatment instructions.</p>
      <Link href="/patients-visitors#checklist">Make your visit checklist</Link>
    </PatientSection>
    <PatientSection id="care-options" title="Find care for your visit" tone>
      <p><Link href="/services">View all services</Link></p>
      <p><Link href="/appointment">Help choosing care</Link></p>
      <p>Online requests do not provide emergency help. <Link href="/emergency">Read emergency information</Link>.</p>
    </PatientSection>
  </PatientPage>
  const related = clinicians.filter((doctor) => relatedServiceIds(doctor.details.specialties).includes(service.publicId))
  const topics = healthTopics.filter((topic) => topic.servicePublicId === service.publicId)
  return <PatientPage image={/heart|cardio/i.test(service.name) ? carePageImages.heart : /rehab|physio/i.test(service.name) ? carePageImages.recovery : carePageImages.general} title={service.name} description={service.sections.scope?.join(' ') ?? 'Explore this area of care and prepare for your visit.'}
    current={service.canonicalPath}
    action={{ href: `/appointment?service=${encodeURIComponent(service.publicId)}`, label: 'Request an appointment' }}>
    <Link className={serviceStyles.backLink} href={directoryHref}><span aria-hidden="true">←</span> Back to service results</Link>
    <nav className={styles.jumpLinks} aria-label="On this service page">
      <a href="#your-care">About this service</a><a href="#prepare">Preparation</a><a href="#referrals">Referrals</a><a href="#care-team">Care team</a>
    </nav>
    <dl className={serviceStyles.overview} aria-label="Service at a glance">
      <div><dt>Area of care</dt><dd>{service.group.name}</dd></div>
      <div><dt>Explore the team</dt><dd><a href="#care-team">{related.length ? `${related.length} sample ${related.length === 1 ? 'profile' : 'profiles'}` : 'Help finding a doctor'} <span aria-hidden="true">↓</span></a></dd></div>
      <div><dt>Your next step</dt><dd><a href={`/appointment?service=${encodeURIComponent(service.publicId)}`}>Continue with this service <span aria-hidden="true">→</span></a></dd></div>
    </dl>
    <PatientSection id="your-care" title="Questions about this service">
      <ul>{(serviceVisitQuestions[service.publicId] ?? ['Who can help me understand the next step?']).map((question) => <li key={question}>{question}</li>)}</ul>
      <p>Service descriptions and care teams are illustrative in this preview. Confirm the care available for your needs before arranging a visit.</p>
    </PatientSection>
    <PatientSection id="prepare" title="Before your visit" tone>
      {topics.length ? <><h3>Questions about a concern?</h3><ul>{topics.map((topic) => <li key={topic.id}><Link href={`/health-topics/${topic.id}`}>{topic.name}: prepare for a conversation</Link></li>)}</ul></> : null}
      <p>Ask which documents and earlier results are needed for this service.</p>
      <p>Preparation depends on your appointment. Confirm any instructions with the care team; this page does not provide instructions about fasting or changing medicines.</p>
      <Link className="text-link" href="/patients-visitors#before">Read the visit guide <span aria-hidden="true">→</span></Link>
    </PatientSection>
    <PatientSection id="referrals" title="Referrals & appointments">
      <p>Referral requirements and clinic hours have not been verified for this preview. Ask whether a referral is needed and which team should receive it.</p>
      <p>You can explore an appointment request with this service selected. A request does not confirm a booking; no request is sent or saved in this preview.</p>
      <Link className="text-link" href={`/appointment?service=${encodeURIComponent(service.publicId)}`}>Request an appointment for {service.name} <span aria-hidden="true">→</span></Link>
    </PatientSection>
    <PatientSection id="care-team" title="Meet the care team">
      {related.length ? <><p>Sample profiles linked to this service.</p><ul className={serviceStyles.careTeam}>{related.map((doctor) => <li key={doctor.publicId}>
        <Link href={`${doctor.canonicalPath}?service=${encodeURIComponent(service.publicId)}`} aria-label={`View profile for ${doctor.details.name}`}>
          <ClinicianPortrait name={doctor.details.name} src={demoClinicianPortraits[doctor.publicId]} />
          <span className={serviceStyles.doctorDetails}><strong>{doctor.details.name}</strong><span>{doctor.details.specialties.join(' · ')}</span><span className={serviceStyles.profileAction}>View profile <span aria-hidden="true">→</span></span></span>
        </Link>
      </li>)}</ul></> : <><p>A care team has not yet been listed for this service. You can browse the doctor directory or choose help finding care in the appointment journey.</p><Link className="text-link" href="/doctors">Find a doctor <span aria-hidden="true">→</span></Link></>}
    </PatientSection>
    <PatientSection id="service-help" title="Need help planning?" tone>
      <Link className="text-link" href="/patients-visitors">Plan your visit <span aria-hidden="true">→</span></Link>
      <p>Online requests are not an emergency channel. <Link href="/emergency">Read emergency information.</Link></p>
    </PatientSection>
  </PatientPage>
}
