import { requestAppointmentLabel } from '@/appointment/copy'
import Link from 'next/link'
import { requireLocalDemo } from '@/demo/site'
import { PatientPage, PatientSection } from '@/website/patient-page'
import { FeedbackComposer } from '@/website/feedback-composer'

export const metadata = { title: 'Patient Feedback | Hallelujah Hospital',
  description: 'Find out whom to speak to about a compliment, suggestion or concern about your hospital experience.'
}

export default function FeedbackPage() {
  requireLocalDemo()
  return <PatientPage variant="task" title="Patient feedback" description="To share a compliment, suggestion or concern, ask reception to put you in touch with the right team. If you’re at the hospital, you can also speak with your care team."
    current="/feedback" action={{ href: '/contact', label: 'Contact & directions' }}>
    <PatientSection id="share" title="Prepare your feedback">
      <details>
        <summary>Draft a message for your conversation</summary>
        <p>This optional draft stays in your browser. The hospital does not receive it.</p>
        <FeedbackComposer />
      </details>
    </PatientSection>
    <PatientSection id="feedback-help" title="Looking for care?">
      <p>Feedback cannot provide medical advice, arrange an appointment, or respond to an emergency.</p>
      <p><Link href="/appointment">{requestAppointmentLabel}</Link> or <Link href="/emergency">read emergency information</Link>.</p>
    </PatientSection>
  </PatientPage>
}
