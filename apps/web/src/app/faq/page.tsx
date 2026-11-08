import { InterfaceLink as Link } from '@/website/interface-language'
import { requireLocalDemo } from '@/demo/site'
import { PatientPage, PatientSection, patientPageStyles as styles } from '@/website/patient-page'
import { hospitalContact } from '@/website/hospital-contact'
import informationStyles from '@/website/information-pages.module.css'
import type { ReactNode } from 'react'

export const metadata = { title: 'Frequently Asked Questions | Hallelujah Hospital', description: 'Answers about appointments, finding the hospital, preparing for a visit, companions and patient support.' }

function Question({ question, children }: { question: string; children: ReactNode }) {
  return <details className={informationStyles.disclosure}><summary>{question}</summary><div className={informationStyles.answer}>{children}</div></details>
}

export default function FaqPage() {
  requireLocalDemo()
  return <PatientPage title="A little clarity before your visit." description="Find answers to common questions about appointments, arriving at the hospital and getting the support you need."
    current="/faq" action={{ href: '#appointments', label: 'Find an answer' }}>
    <nav className={styles.jumpLinks} aria-label="Frequently asked question categories"><a href="#appointments">Appointments</a><a href="#your-visit">Your visit</a><a href="#support">Support & questions</a></nav>
    <PatientSection id="appointments" title="Appointments & finding care">
      <div className={informationStyles.disclosures}>
        <Question question="How do I arrange an appointment?"><p>Call <a href={hospitalContact.phoneHref}>{hospitalContact.phone}</a> to discuss the service or doctor you need and confirm an available time. You can <Link href="/appointment">prepare your appointment details</Link> on the website; preparing details does not send a request or confirm a booking.</p></Question>
        <Question question="Can I come without an appointment?"><p>Call before travelling to check whether the relevant department can see walk-in patients and what registration arrangements apply. For urgent care, use <Link href="/emergency">emergency information</Link>.</p></Question>
        <Question question="How do I choose a doctor or service?"><p>Browse <Link href="/doctors">our doctors</Link> or <Link href="/services">specialties & services</Link>. If you are unsure where to start, call the hospital and describe the kind of appointment you are looking for.</p></Question>
        <Question question="How do I change an appointment?"><p>Contact the hospital with your appointment details and ask the team to confirm the change. Changing details on the website does not change an existing booking.</p></Question>
      </div>
    </PatientSection>
    <PatientSection id="your-visit" title="Planning your arrival">
      <div className={informationStyles.disclosures}>
        <Question question="Where is the hospital?"><p>Hallelujah General Hospital is around Gotera Condominium in Addis Ababa. <Link href="/contact#directions">See the map and directions</Link>, and confirm the correct entrance with the hospital before travelling.</p></Question>
        <Question question="What are the opening and visiting hours?"><p>Department opening times and ward visiting arrangements can differ. Call the hospital to confirm the hours for your specific visit and how early to arrive for registration.</p></Question>
        <Question question="What should I bring?"><p>Ask which identification and referral documents your visit requires. Bring relevant previous reports, a list of medicines and allergies, and any questions you want to ask. Use the <Link href="/patients-visitors#checklist">visit checklist</Link> to prepare.</p></Question>
        <Question question="How should I prepare for a test or procedure?"><p>Ask the treating team for instructions specific to your appointment. Confirm preparation, arrival time and whether someone should accompany you. Check with the team before changing medicines or eating and drinking arrangements.</p></Question>
      </div>
    </PatientSection>
    <PatientSection id="support" title="Support & peace of mind">
      <div className={informationStyles.disclosures}>
        <Question question="Can a family member or companion come with me?"><p>Ask the department about companion and ward visiting arrangements. Tell the team if you need a support person to help with communication or moving around.</p></Question>
        <Question question="Can I get language or accessibility support?"><p>Tell the hospital what support you need before travelling. Ask about language assistance, accessible entrances and help moving between departments so the team can confirm available arrangements.</p></Question>
        <Question question="How can I raise a concern about my care?"><p>Speak with your nurse or treating clinician first. Ask reception for the appropriate contact if you need further help. Read <Link href="/patient-rights">patient rights & responsibilities</Link> and <Link href="/feedback">feedback guidance</Link>.</p></Question>
        <Question question="What happens to information I enter on the website?"><p>The current appointment and feedback interactions let you prepare information locally without sending it to the hospital. Read the <Link href="/privacy">privacy notice</Link> for details about forms, browser preferences and external links.</p></Question>
      </div>
      <h3>Still need help?</h3><p>Call <a href={hospitalContact.phoneHref}>{hospitalContact.phone}</a> or <Link href="/contact">view hospital contact information</Link>.</p>
    </PatientSection>
  </PatientPage>
}
