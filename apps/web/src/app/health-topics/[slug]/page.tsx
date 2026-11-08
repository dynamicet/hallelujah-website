import Link from 'next/link'
import { notFound } from 'next/navigation'
import { healthTopics } from '@/demo/health-topics'
import { clinicians, requireLocalDemo } from '@/demo/site'
import { relatedCareIds } from '@/demo/care-model'
import { PatientPage, PatientSection, patientPageStyles as styles } from '@/website/patient-page'
import { PrintButton } from '@/website/visit-checklist'

async function resolveTopic(params: Promise<{ slug: string }>) {
  requireLocalDemo()
  const { slug } = await params
  const topic = healthTopics.find((entry) => entry.id === slug)
  if (!topic) notFound()
  return topic
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const topic = await resolveTopic(params)
  return { title: `${topic.name} | Health & care | Hallelujah Hospital`, description: topic.summary }
}

export default async function HealthTopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const topic = await resolveTopic(params)
  const doctors = clinicians.filter((doctor) => topic.servicePublicId && relatedCareIds(doctor.publicId).includes(topic.servicePublicId))
  return <PatientPage title={topic.name} description={topic.summary} current={`/health-topics/${topic.id}`}
    action={{ href: '#care-options', label: 'View care options' }}>
    <nav className={styles.jumpLinks} aria-label="Health topic sections">
      <a href="#care-options">Care options</a><a href="#prepare">Prepare for care</a><a href="#review">About this guide</a>
    </nav>
    <PatientSection id="care-options" title="Care options" tone>
      <p>{topic.nextStep}</p>
      {topic.servicePath ? <p><Link className="text-link" href={topic.servicePath}>View {topic.serviceName} details <span aria-hidden="true">→</span></Link></p> : <p>A service connection has not been verified for this topic. Choose help finding care in the appointment preview.</p>}
      <Link className="solid-button blue-button" href={topic.appointmentHref ?? '/appointment'}>{topic.appointmentHref ? 'Request an appointment' : 'Ask for help choosing care'} <span aria-hidden="true">→</span></Link>
      <h3>Doctors connected to this care</h3>
      {doctors.length ? <><p>These illustrative profiles share the service connection shown above. Confirm suitability with the hospital.</p>
        <ul className={styles.people}>{doctors.map((doctor) => <li key={doctor.publicId}><Link href={doctor.canonicalPath}><strong>{doctor.details.name}</strong><span>{doctor.details.specialties.join(' · ')} →</span></Link></li>)}</ul></>
        : <p>No doctor is currently linked to this topic. You can still explore the service or ask for help choosing care.</p>}
      <p><Link href={`/doctors?q=${encodeURIComponent(topic.name)}`}>Search the doctor directory for {topic.name.toLowerCase()}</Link></p>
    </PatientSection>
    <PatientSection id="prepare" title="Prepare for a conversation">
      <ul>{topic.preparation.map((question) => <li key={question}>{question}</li>)}</ul>
      <p>Confirm any appointment-specific preparation with the care team.</p>
      <p><Link className="text-link" href="/patients-visitors#checklist">Make your visit checklist <span aria-hidden="true">→</span></Link></p>
      <PrintButton label="Print this guide" />
    </PatientSection>
    <PatientSection id="review" title="Review status" tone>
      <p id="understand">This guide helps you prepare questions; it cannot diagnose a condition or provide a treatment plan.</p>
      <dl><dt>Medical review</dt><dd>Pending hospital review</dd><dt>Last medically reviewed</dt><dd>Not yet reviewed</dd></dl>
      <p>This is illustrative navigation and preparation content for the website preview. Topics, service connections and doctor profiles need hospital approval before publication.</p>
      <p>Online requests do not provide emergency help. <Link href="/emergency">Read emergency information</Link>.</p>
      <Link href="/health-topics">Browse all health topics</Link>
    </PatientSection>
  </PatientPage>
}
