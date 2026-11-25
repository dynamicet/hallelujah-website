import Link from 'next/link'
import { requireLocalDemo } from '@/demo/site'
import { PartnershipEnquiry } from '@/website/partnership-enquiry'
import styles from '@/website/partnerships.module.css'

export const metadata = {
  title: 'Work with Hallelujah | Hallelujah Hospital',
  description: 'Explore ways to collaborate with Hallelujah General Hospital in Gotera, Addis Ababa.',
}

export default function PartnershipsPage() {
  requireLocalDemo()

  return <div className="page-frame">
    <header className={styles.intro}>
      <h1>Work with Hallelujah</h1>
      <p>We welcome enquiries from employers, healthcare providers, academic institutions, and community organizations.</p>
    </header>
    <div className={styles.layout}>
      <PartnershipEnquiry />
      <Link className="text-link" href="/contact">Patient enquiries and directions <span aria-hidden="true">→</span></Link>
    </div>
  </div>
}
