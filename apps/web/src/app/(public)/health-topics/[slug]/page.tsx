import { requestAppointmentLabel } from '@/appointment/copy'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { healthTopics } from '@/demo/health-topics'
import { requireLocalDemo } from '@/demo/site'
import { PatientPage, PatientSection, patientPageStyles as styles } from '@/website/patient-page'
import { PageActionLink } from '@/website/page-patterns'

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
  return <PatientPage variant="document" title={topic.name} description={topic.summary} current={`/health-topics/${topic.id}`}>
    <PatientSection id="care-options" title="Where to start">
      <p>{topic.nextStep}</p>
      <div className={styles.actions}>
        <Link className="solid-button blue-button" href={topic.appointmentHref ?? '/contact#contact-reception'}>
          {topic.appointmentHref ? requestAppointmentLabel : 'Contact the hospital'} <span aria-hidden="true">→</span>
        </Link>
        {topic.servicePath ? <PageActionLink href={topic.servicePath}>View {topic.serviceName} details</PageActionLink> : null}
      </div>
    </PatientSection>
    <PatientSection context="preparation" id="prepare" title="What you can discuss">
      <ul>{topic.preparation.map(question => <li key={question}>{question}</li>)}</ul>
    </PatientSection>
  </PatientPage>
}
