import Link from 'next/link'
import { requireLocalDemo } from '@/demo/site'
import { PatientPage, PatientSection, patientPageStyles as styles } from '@/website/patient-page'
import { VisitChecklist } from '@/website/visit-checklist'
import { hospitalContact } from '@/website/hospital-contact'
import { ConsultationPrompts } from '@/website/consultation-prompts'

export const metadata = { title: 'Patients & Visitors | Hallelujah Hospital' }

export default function PatientsVisitorsPage() {
  requireLocalDemo()
  return <PatientPage variant="practical-guide" title="Patients & Visitors" description="Prepare your documents, plan your arrival and know what to ask before going home."
    current="/patients-visitors"
    action={{ href: '#before', label: 'Prepare for your visit' }}>
    <nav className={styles.jumpLinks} aria-label="Visit guide sections">
      <a href="#before">Before your visit</a><a href="#checklist">Your checklist</a><a href="#arrival">Getting here</a><a href="#visit-times">Hours & arrival time</a><a href="#during">During your visit</a><a href="#accessibility">Support & access</a><a href="#after">Going home</a><a href="#your-experience">Feedback</a>
    </nav>
    <PatientSection id="before" title="Before your visit">
      <p>Choose your care, add your details, and review your request.</p>
      <Link className="text-link" href="/appointment">Request an appointment <span aria-hidden="true">→</span></Link>
      <p><Link href="/faq">Find answers to common questions</Link> about appointments and your visit.</p>
    </PatientSection>
    <PatientSection context="preparation" id="checklist" title="Your visit checklist">
      <VisitChecklist />
    </PatientSection>
    <PatientSection id="arrival" title="Getting here">
      <p><strong>{hospitalContact.name}</strong><br />{hospitalContact.address}</p>
      <p>Call before travelling to confirm your department and entrance.</p>
      <a className="text-link" href={hospitalContact.directionsHref} target="_blank" rel="noopener noreferrer">Get directions in Google Maps <span aria-hidden="true">↗</span></a>
      <h3>Confirm your arrival plan</h3>
      <ul><li>Ask about parking, drop-off and the route from the entrance.</li><li>Check whether you need help with steps or moving between departments.</li></ul>
      <p>Call <a href={hospitalContact.phoneHref}>{hospitalContact.phone}</a> for arrival questions, or <Link href="/#home-directions">view contact &amp; directions</Link>.</p>
    </PatientSection>
    <PatientSection id="visit-times" title="Hours & arrival time">
      <p>Call before travelling to confirm department opening hours and ward visiting times.</p>
      <dl className={styles.arrivalTimes}>
        <div><dt>For an appointment</dt><dd>Confirm the date, arrival time and department reception. Ask how much time to allow for registration.</dd></div>
        <div><dt>For a test or procedure</dt><dd>Confirm when to arrive and any preparation instructions with the care team.</dd></div>
        <div><dt>For visiting someone</dt><dd>Check ward visiting times, companion arrangements and any visitor requirements.</dd></div>
      </dl>
      <a className="solid-button blue-button" href={hospitalContact.phoneHref}>Call to confirm your visit <span aria-hidden="true">→</span></a>
      <p>For urgent care, use <Link href="/emergency">emergency information</Link>.</p>
    </PatientSection>
    <PatientSection id="during" title="During your visit">
      <h3>At your consultation</h3><p>Bring your questions into the conversation. Ask the team to explain anything that is unclear, including the next step in your care.</p>
      <ConsultationPrompts />
      <p><Link href="/health-topics">Browse health topics and preparation questions</Link> before your conversation.</p>
      <h3>Family & visitors</h3><p>Check ward visiting times and whether a companion can join you.</p>
      <h3>A planned hospital stay</h3><p>Ask the team to confirm your admission, what to pack, and whom your family can contact.</p>
      <Link className="text-link" href="/services?q=Admission%20guidance">View admission guidance <span aria-hidden="true">→</span></Link>
    </PatientSection>
    <PatientSection id="accessibility" title="Support & access">
      <p>Before travelling, ask about:</p>
      <ul><li>Accessible entrances and support with moving around.</li><li>Language or interpretation support for your conversation.</li><li>Whether a companion can join your appointment.</li></ul>
      <p>Confirm the support you need with the hospital before your visit.</p>
    </PatientSection>
    <PatientSection id="after" title="Before you go home">
      <ul><li>Ask for an explanation of your discharge or visit instructions.</li><li>Clarify any instructions about medicines with your clinician.</li><li>Ask what changes to watch for and whom to contact if you are concerned.</li><li>Confirm whether another appointment is needed and how it will be arranged.</li></ul>
      <p>Follow the instructions your care team gives you.</p>
    </PatientSection>
    <PatientSection id="your-experience" title="Patient feedback">
      <p><Link href="/patient-rights">Read your patient rights & responsibilities</Link>, including privacy, communication and taking part in decisions.</p>
      <Link className="text-link" href="/feedback">Patient feedback <span aria-hidden="true">→</span></Link>
      <p>For urgent care needs, use <Link href="/emergency">emergency information</Link>. Feedback is not an emergency channel.</p>
    </PatientSection>
  </PatientPage>
}
