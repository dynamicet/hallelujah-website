import { requestAppointmentLabel } from '@/appointment/copy'
import { Icon, SiteContent } from '@/design-system/components'
import { InterfaceLink as Link } from './interface-language'
import { hospitalContact } from './hospital-contact'
import { HospitalLocationMap } from './hospital-location-map'
import styles from './contact-page.module.css'

export function ContactPage() {
  return <SiteContent>
    <div className={styles.page} data-hospital-contact lang="en">
      <Link className={styles.backLink} href="/#home-directions"><Icon name="arrow-right" />Back to contact overview</Link>
      <header className={styles.introduction}>
        <h1>Contact &amp; directions</h1>
        <p>Speak with our team or plan your visit to Hallelujah General Hospital in Gotera, Addis Ababa.</p>
        <nav className={styles.shortcuts} aria-label="Contact and arrival options">
          <a href={hospitalContact.phoneHref}>Call the hospital<Icon name="phone" /></a>
          <a href={hospitalContact.directionsHref}>Get directions<Icon name="directions" /></a>
          <a href="#before-you-travel">Before you arrive<Icon name="arrow-right" /></a>
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
          <Link className="text-link" href="/appointment">{requestAppointmentLabel} <Icon name="arrow-right" /></Link>
        </section>

        <section className={styles.location} id="directions" tabIndex={-1} aria-labelledby="contact-location-title">
          <h2 id="contact-location-title">Find us in Gotera</h2>
          <address data-help-clearance><strong>{hospitalContact.name}</strong><span>Around Gotera Condominium</span><span>Addis Ababa, Ethiopia</span></address>
          <a className="solid-button" href={hospitalContact.directionsHref}>Get directions <Icon name="directions" /></a>
          <HospitalLocationMap />
        </section>
      </div>

      <section className={styles.preparation} id="before-you-travel" tabIndex={-1} aria-labelledby="contact-visit-title">
        <h2 id="contact-visit-title">Before you arrive</h2>
        <div className={styles.visitDetails}>
          <div>
            <h3>Arrival and visiting</h3>
            <p>Reception can help with where to check in, ward visiting hours, and step-free access.</p>
            <a className="text-link" href={hospitalContact.phoneHref}>Call reception <Icon name="phone" /></a>
          </div>
          <div id="what-to-bring" tabIndex={-1} role="group" aria-labelledby="what-to-bring-title">
            <h3 id="what-to-bring-title">What to bring</h3>
            <p>If you have a referral letter, relevant test results, or a list of your current medicines, bring them with you.</p>
          </div>
        </div>
      </section>

      <section className={styles.partnerships} aria-labelledby="contact-partnerships-title">
        <h2 id="contact-partnerships-title">Work with us</h2>
        <p>Have an idea for community outreach, education, or care? We’d like to hear it.</p>
        <Link className="text-link" href="/partnerships">Discuss your idea <Icon name="arrow-right" /></Link>
      </section>

      <aside className={styles.urgent} aria-labelledby="contact-urgent-title">
        <div><h2 id="contact-urgent-title">Need urgent help?</h2><p>For emergency or ambulance assistance, use the hospital’s emergency contact.</p></div>
        <Link href="/emergency">Emergency information <Icon name="arrow-right" /></Link>
      </aside>
    </div>
  </SiteContent>
}
