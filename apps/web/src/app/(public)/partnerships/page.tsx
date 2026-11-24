import Link from 'next/link'
import { requireLocalDemo } from '@/demo/site'
import { PartnershipEnquiry } from '@/website/partnership-enquiry'
import styles from '@/website/partnerships.module.css'

export const metadata = {
  title: 'Work with Hallelujah | Hallelujah Hospital',
  description: 'Explore ways for organizations to collaborate with Hallelujah General Hospital in Gotera, Addis Ababa.',
}

export default function PartnershipsPage() {
  requireLocalDemo()

  return <div className="page-frame">
    <header className={styles.intro}>
      <h1>Work with Hallelujah</h1>
      <p>We welcome ideas from organizations interested in community outreach, education and care.</p>
    </header>
    <div className={styles.layout}>
      <PartnershipEnquiry />
      <section className={styles.context} aria-labelledby="partnership-opportunities">
        <h2 id="partnership-opportunities">Ways we could work together</h2>
        <ul>
          <li><strong>Organizational partnerships</strong><span>Explore a collaboration with your company or institution.</span></li>
          <li><strong>Community outreach</strong><span>Share an idea for a program or event that supports the community.</span></li>
          <li><strong>Education and training</strong><span>Tell us about an opportunity to learn or share expertise together.</span></li>
        </ul>
        <Link className="text-link" href="/contact">Patient enquiries and directions <span aria-hidden="true">→</span></Link>
      </section>
    </div>
  </div>
}
