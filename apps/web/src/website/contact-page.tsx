import { Icon, SiteShell } from '@/design-system/components'
import { demoShell } from '@/demo/site'
import { InterfaceLink as Link } from './interface-language'
import { hospitalContact } from './hospital-contact'
import { HospitalLocationMap } from './hospital-location-map'
import styles from './contact-page.module.css'

export function ContactPage() {
  return <SiteShell {...demoShell('/contact')}>
    <div className={styles.page} data-hospital-contact lang="en">
      <Link className={styles.backLink} href="/#home-directions"><Icon name="arrow-right" />Back to contact overview</Link>
      <header className={styles.introduction}>
        <h1>Contact &amp; directions</h1>
        <p>Speak with our team or plan your visit to Hallelujah General Hospital in Gotera, Addis Ababa.</p>
        <nav className={styles.shortcuts} aria-label="On this page">
          <a href="#contact-reception">Call the hospital<Icon name="phone" /></a>
          <a href="#directions">Find us in Gotera<Icon name="directions" /></a>
          <a href="#before-you-travel">Before you travel<Icon name="arrow-right" /></a>
        </nav>
      </header>

      <div className={styles.contacts}>
        <section className={styles.reception} id="contact-reception" tabIndex={-1} aria-labelledby="contact-reception-title">
          <h2 id="contact-reception-title">Call the hospital</h2>
          <p>For appointments, department enquiries and help planning your visit.</p>
          <a className={styles.phone} href={hospitalContact.phoneHref}><Icon name="phone" />{hospitalContact.phone}</a>
          <dl className={styles.otherContacts}>
            <div><dt>Alternative number</dt><dd><a href={hospitalContact.alternatePhoneHref}>{hospitalContact.alternatePhone}</a></dd></div>
            <div><dt>General enquiries</dt><dd><a href={`mailto:${hospitalContact.email}`}>{hospitalContact.email}</a></dd></div>
          </dl>
          <p className={styles.note} data-help-clearance>For time-sensitive questions, please call. Email is not an emergency channel.</p>
          <Link className="text-link" href="/appointment">Prepare an appointment request <Icon name="arrow-right" /></Link>
        </section>

        <section className={styles.location} id="directions" tabIndex={-1} aria-labelledby="contact-location-title">
          <h2 id="contact-location-title">Find us in Gotera</h2>
          <address data-help-clearance><strong>{hospitalContact.name}</strong><span>Around Gotera Condominium</span><span>Addis Ababa, Ethiopia</span></address>
          <a className="solid-button" href={hospitalContact.directionsHref} target="_blank" rel="noopener noreferrer">Get directions <Icon name="directions" /></a>
          <HospitalLocationMap />
          <p className={styles.note} data-help-clearance>The pin marks the hospital location. Call to confirm your department and entrance before travelling.</p>
        </section>
      </div>

      <section className={styles.preparation} id="before-you-travel" tabIndex={-1} aria-labelledby="contact-visit-title">
        <h2 id="contact-visit-title">Before you travel</h2>
        <div className={styles.advice}>
          <h3>Confirm your visit</h3>
          <div><p data-help-clearance>Ask the team about your department’s opening times, appointment arrangements and any documents to bring.</p><Link className="text-link" href="/patients-visitors#arrival">Read arrival guidance <Icon name="arrow-right" /></Link></div>
        </div>
        <div className={styles.advice}>
          <h3>Plan your arrival</h3>
          <p data-help-clearance>For step-free access, parking or drop-off guidance, tell the team what support you need and confirm arrangements before setting out.</p>
        </div>
      </section>

      <aside className={styles.urgent} aria-labelledby="contact-urgent-title">
        <div><h2 id="contact-urgent-title">Need urgent help?</h2><p>For emergency or ambulance assistance, use the hospital’s emergency contact.</p></div>
        <Link href="/emergency">Emergency information <Icon name="arrow-right" /></Link>
      </aside>
    </div>
  </SiteShell>
}
