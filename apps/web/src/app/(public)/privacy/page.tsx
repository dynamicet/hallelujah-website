import { InterfaceLink as Link } from '@/website/interface-language'
import { requireLocalDemo } from '@/demo/site'
import { PatientPage, PatientSection, patientPageStyles as styles } from '@/website/patient-page'
import { hospitalContact } from '@/website/hospital-contact'

export const metadata = { title: 'Privacy Notice | Hallelujah Hospital', description: 'Understand information entered on this website, language preferences, external links, and how to ask a privacy question.' }

export default function PrivacyPage() {
  requireLocalDemo()
  return <PatientPage variant="document" title="Privacy notice" description="Understand what happens to information you enter on this website and how to ask for help."
    current="/privacy">
    <nav className={styles.jumpLinks} aria-label="Privacy notice sections"><a href="#website-information">Website forms</a><a href="#preferences">Preferences & links</a><a href="#privacy-help">Ask a question</a></nav>
    <PatientSection id="website-information" title="Information you enter">
      <h3>Appointment information</h3>
      <p>The appointment page lets you choose care and prepare contact details for review. In the current website, this interaction runs in your browser and does not send an appointment request to the hospital. A prepared request is not a confirmed booking.</p>
      <p>Call the hospital to arrange care. Do not enter medical histories, test results or other sensitive documents into the appointment page.</p>
      <h3>Feedback</h3>
      <p>The feedback composer holds your category and message in the current page’s memory so you can review them. It does not send feedback. Clear the message or reload the page to remove it from the composer.</p>
      <p>Use sample feedback without names, patient numbers, contact details or medical information.</p>
      <h3>Careers</h3>
      <p>The Careers page does not collect applications or accept document uploads. Confirm the application process with the hospital before sharing a CV or supporting documents.</p>
    </PatientSection>
    <PatientSection id="preferences" title="Your browser & external links">
      <p>Your interface language choice is saved in this browser using local storage under <strong>hh-interface-language</strong>. This lets the website remember your choice when you return. You can remove it through your browser’s site-data settings.</p>
      <p>Opening a website sends technical information, such as your IP address and browser information, to the server providing it. This notice does not describe the hospital’s clinical-record system.</p>
      <p>Directions links open Google Maps. Telephone and email links open your chosen calling or email application. Information you share through those services is handled under their own privacy terms.</p>
    </PatientSection>
    <PatientSection id="privacy-help" title="Questions about your information">
      <p>Contact {hospitalContact.name} in Gotera, Addis Ababa, to ask how information provided directly to the hospital is handled, or to discuss access, correction or another privacy concern.</p>
      <p>Start with a general enquiry. Please do not include medical records or identity documents in an ordinary email; ask the team for the appropriate way to share them.</p>
      <p><a href={hospitalContact.phoneHref}>{hospitalContact.phone}</a><br /><a href={`mailto:${hospitalContact.email}`}>{hospitalContact.email}</a></p>
      <p><Link href="/patient-rights">Read patient rights & responsibilities</Link> or <Link href="/contact">find contact & directions</Link>.</p>
    </PatientSection>
  </PatientPage>
}
