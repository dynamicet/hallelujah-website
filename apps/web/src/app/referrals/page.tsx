import Link from 'next/link'
import { requireLocalDemo } from '@/demo/site'
import { PatientPage, PatientSection, patientPageStyles as styles } from '@/website/patient-page'

export const metadata = { title: 'Refer a patient | Hallelujah Hospital' }

export default function ReferralsPage() {
  requireLocalDemo()
  return <PatientPage title="Refer a patient" description="Referral submission is unavailable in this preview."
    current="/referrals"
    action={{ href: '#prepare', label: 'Prepare a referral' }}>
    <nav className={styles.jumpLinks} aria-label="Referral guide sections"><a href="#prepare">Prepare a referral</a><a href="#process">How to proceed</a></nav>
    <PatientSection id="prepare" title="Before referring">
      <p>A referral recipient, secure submission channel and response times have not yet been verified. This preview does not accept referrals or medical documents.</p>
      <p>Confirm the required service and receiving team before referring.</p>
      <ul><li>Identify the relevant service and reason for referral.</li><li>Ask which referral letter, relevant results and earlier care notes the receiving team requires.</li><li>Confirm how the patient will be contacted and how an appointment will be confirmed.</li><li>Ask the hospital for its approved secure method before sharing patient information.</li></ul>
    </PatientSection>
    <PatientSection id="process" title="How to proceed" tone>
      <p>The appointment preview does not submit clinical referrals.</p>
      <p><Link className="text-link" href="/services">View all services <span aria-hidden="true">→</span></Link></p>
      <p><Link href="/patients-visitors#checklist">Help your patient prepare for a visit</Link></p>
      <p>For urgent care, use <Link href="/emergency">emergency information</Link>.</p>
    </PatientSection>
  </PatientPage>
}
