import Link from 'next/link'
import { requireLocalDemo } from '@/demo/site'
import { PatientPage, PatientSection } from '@/website/patient-page'
import { FeedbackComposer } from '@/website/feedback-composer'

export const metadata = { title: 'Patient Feedback | Hallelujah Hospital' }

export default function FeedbackPage() {
  requireLocalDemo()
  return <PatientPage title="Patient feedback" description="Compliments, suggestions and concerns about your hospital experience."
    current="/feedback"
    action={{ href: '#share', label: 'Try the feedback form' }}>
    <PatientSection id="share" title="Prepare your feedback">
      <p>The feedback recipient is awaiting confirmation. You can prepare and review a sample here; nothing can be sent.</p>
      <FeedbackComposer />
    </PatientSection>
    <PatientSection id="feedback-handling" title="What happens next?" tone>
      <p>Feedback handling and response times are awaiting hospital confirmation.</p>
      <p>If you are currently receiving care, ask your care team whom to speak with about your experience.</p>
      <Link className="text-link" href="/#home-call">Hospital contact information <span aria-hidden="true">→</span></Link>
    </PatientSection>
    <PatientSection id="feedback-help" title="Looking for care?">
      <p>Feedback cannot provide medical advice, arrange an appointment, or respond to an emergency.</p>
      <p><Link href="/appointment">Request an appointment</Link>, <Link href="/patients-visitors">plan your visit</Link>, or <Link href="/emergency">read emergency information</Link>.</p>
    </PatientSection>
  </PatientPage>
}
