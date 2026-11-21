import { InterfaceLink as Link } from '@/website/interface-language'
import { requireLocalDemo } from '@/demo/site'
import { PatientPage, PatientSection, patientPageStyles as styles } from '@/website/patient-page'
import { hospitalContact } from '@/website/hospital-contact'

export const metadata = { title: 'Patient Rights & Responsibilities | Hallelujah Hospital', description: 'Respect, clear communication, involvement in care, privacy, and the part patients and companions play in a hospital visit.' }

export default function PatientRightsPage() {
  requireLocalDemo()
  return <PatientPage variant="document" title="Patient rights & responsibilities" description="Good care begins with respect, clear communication and decisions you understand."
    current="/patient-rights">
    <nav className={styles.jumpLinks} aria-label="Patient rights sections"><a href="#your-rights">Your rights</a><a href="#your-part">Your responsibilities</a><a href="#speak-up">Raise a concern</a></nav>
    <PatientSection id="your-rights" title="Your rights as a patient">
      <h3>Respect & dignity</h3><p>Receive considerate care that respects your dignity, beliefs and personal circumstances. Tell the team about cultural, communication or access needs that affect your care.</p>
      <h3>Understand your care</h3><p>Ask who is caring for you and request an explanation of your condition, proposed treatment, alternatives and expected costs. Ask about benefits and risks before making a decision.</p>
      <h3>Take part in decisions</h3><p>Ask questions before agreeing to a test or treatment. If you do not understand or wish to decline, discuss this with your clinician, including the possible consequences and next steps. Ask how a parent, guardian or chosen support person can be involved when appropriate.</p>
      <h3>Privacy & confidentiality</h3><p>Ask for privacy during examinations and conversations. Discuss who may receive information about your care and ask how your information is protected and shared.</p>
      <h3>Communication & support</h3><p>Ask for information in words you understand. Tell the team if you need language support, assistance moving around or help involving a companion. Confirm available arrangements before travelling.</p>
    </PatientSection>
    <PatientSection id="your-part" title="Your part in safe care">
      <ul><li>Give your care team accurate information about symptoms, medicines, allergies and previous treatment, to the best of your knowledge.</li><li>Say when an explanation or instruction is unclear, and discuss any difficulty following your agreed care plan.</li><li>Confirm appointment arrangements and let the hospital know if your plans change.</li><li>Respect staff, other patients and visitors, including their privacy. Ask permission before taking photographs or recording.</li><li>Follow the team’s guidance on hygiene, visiting and safe use of hospital spaces.</li><li>Ask about charges and payment arrangements before planned care when possible.</li></ul>
    </PatientSection>
    <PatientSection id="speak-up" title="Speak up about your care">
      <p>If something feels wrong or you need an explanation, speak with your nurse or treating clinician. If the concern remains, ask reception who can help you raise it with the appropriate hospital team.</p>
      <p>For help finding the right person, call <a href={hospitalContact.phoneHref}>{hospitalContact.phone}</a>. You can also <Link href="/feedback">read the patient feedback guidance</Link>.</p>
      <p>For urgent care, use <Link href="/emergency">emergency information</Link>.</p>
      <p><Link href="/privacy">Website privacy notice</Link> · <Link href="/patients-visitors">Plan your visit</Link></p>
    </PatientSection>
  </PatientPage>
}
