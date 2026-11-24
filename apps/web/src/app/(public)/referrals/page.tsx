import { hospitalContact } from '@/website/hospital-contact'
import Link from 'next/link'
import { requireLocalDemo } from '@/demo/site'
import { PatientPage, PatientSection } from '@/website/patient-page'

export const metadata = { title: 'Refer a patient | Hallelujah Hospital',
  description: 'Contact reception to reach the receiving team and arrange a patient referral.'
}

export default function ReferralsPage() {
  requireLocalDemo()
  return <PatientPage variant="document" title="Refer a patient" description="Call reception and ask for the team that handles referrals for the service your patient needs."
    current="/referrals" action={{ href: hospitalContact.phoneHref, label: `Call reception · ${hospitalContact.phone}` }}
    secondaryAction={{ href: '/services', label: 'Find a service' }}>
    <PatientSection context="preparation" id="prepare" title="When you call">
      <p>Tell reception which service you need. The receiving team can explain which documents to share, how to send them securely and how the patient’s appointment will be confirmed.</p>
    </PatientSection>
    <PatientSection id="process" title="Other ways to reach us">
      <p><Link href="/contact">Contact &amp; directions</Link></p>
      <p>For urgent care, use the <Link href="/emergency">emergency and ambulance number</Link>.</p>
    </PatientSection>
  </PatientPage>
}
