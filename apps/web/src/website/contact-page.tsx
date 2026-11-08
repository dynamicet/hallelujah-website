import { SiteShell } from '@/design-system/components'
import { demoShell } from '@/demo/site'
import { InterfaceLink as Link } from './interface-language'
import { hospitalContact } from './hospital-contact'
import { HospitalLocationMap } from './hospital-location-map'
import styles from './contact-page.module.css'

const Arrow = () => <span aria-hidden="true">↗</span>

export function ContactPage() {
  return <SiteShell {...demoShell('/contact')}>
    <div className={styles.page} data-hospital-contact lang="en">
      <header className={styles.introduction}>
        <h1>Contact &amp; directions</h1>
        <p>Speak with our team or plan your visit to Hallelujah General Hospital in Gotera, Addis Ababa.</p>
      </header>

      <div className={styles.contacts}>
        <section className={styles.reception} aria-labelledby="contact-reception-title">
          <h2 id="contact-reception-title">Call the hospital</h2>
          <p>For appointments, department enquiries and help planning your visit.</p>
          <a className={styles.phone} href={hospitalContact.phoneHref}>{hospitalContact.phone}<Arrow /></a>
          <dl className={styles.otherContacts}>
            <div><dt>Alternative number</dt><dd><a href={hospitalContact.alternatePhoneHref}>{hospitalContact.alternatePhone}<Arrow /></a></dd></div>
            <div><dt>General enquiries</dt><dd><a href={`mailto:${hospitalContact.email}`}>{hospitalContact.email}<Arrow /></a></dd></div>
          </dl>
          <p className={styles.note}>For time-sensitive questions, please call. Email is not an emergency channel.</p>
          <Link className="text-link" href="/appointment">Prepare an appointment request <span aria-hidden="true">→</span></Link>
        </section>

        <section className={styles.location} id="directions" tabIndex={-1} aria-labelledby="contact-location-title">
          <h2 id="contact-location-title">Find us in Gotera</h2>
          <address><strong>{hospitalContact.name}</strong><span>Around Gotera Condominium</span><span>Addis Ababa, Ethiopia</span></address>
          <a className="solid-button" href={hospitalContact.directionsHref} target="_blank" rel="noopener noreferrer">Get directions <Arrow /></a>
          <HospitalLocationMap />
          <p className={styles.note}>The pin marks the hospital location. Call to confirm your department and entrance before travelling.</p>
        </section>
      </div>

      <section className={styles.preparation} aria-labelledby="contact-visit-title">
        <h2 id="contact-visit-title">Before you travel</h2>
        <div className={styles.advice}>
          <h3>Confirm your visit</h3>
          <div><p>Ask the team about your department’s opening times, appointment arrangements and any documents to bring.</p><Link className="text-link" href="/patients-visitors#arrival">Read arrival guidance <span aria-hidden="true">→</span></Link></div>
        </div>
        <div className={styles.advice}>
          <h3>Plan your arrival</h3>
          <p>For step-free access, parking or drop-off guidance, tell the team what support you need and confirm arrangements before setting out.</p>
        </div>
      </section>

      <aside className={styles.urgent} aria-labelledby="contact-urgent-title">
        <div><h2 id="contact-urgent-title">Need urgent help?</h2><p>For emergency or ambulance assistance, use the hospital’s emergency contact.</p></div>
        <Link href="/emergency">Emergency information <span aria-hidden="true">→</span></Link>
      </aside>
    </div>
  </SiteShell>
}
