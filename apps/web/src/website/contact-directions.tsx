import { InterfaceText, InterfaceLink as Link } from '@/website/interface-language'
import { Icon } from '@/design-system/components'

import { hospitalContact } from './hospital-contact'
import { HospitalLocationMap } from './hospital-location-map'
import styles from './contact-directions.module.css'

export function ContactDirections() {
  return <section className={styles.section} id="home-directions" data-motion-section="arrival" tabIndex={-1} aria-labelledby="contact-directions-title">
    <div className="page-frame">
      <div className={styles.intro} data-motion="heading" data-reveal="0">
        <h2 id="contact-directions-title">Contact &amp; directions</h2>
        <Link className={styles.pageLink} href="/contact">All contact details <Icon name="arrow-right" /></Link>
      </div>
      <div className={styles.columns}>
        <section className={styles.location} aria-label="Hospital location">
          <address className={styles.address} data-help-clearance>
            <strong>{hospitalContact.name}</strong>
            <span>Around Gotera Condominium</span>
            <span>Addis Ababa, Ethiopia</span>
          </address>
          <div className={styles.locationActions}>
            <a className="solid-button" href={hospitalContact.directionsHref} target="_blank" rel="noopener noreferrer"><InterfaceText>Get directions</InterfaceText> <Icon name="directions" /></a>
            <a className={styles.callAction} href={hospitalContact.phoneHref}><InterfaceText>Call the hospital</InterfaceText> <Icon name="phone" /></a>
          </div>
          <HospitalLocationMap />
        </section>
        <section className={styles.contact} id="home-call" tabIndex={-1} aria-labelledby="contact-phone-title">
          <h3 id="contact-phone-title">Call the hospital</h3>
          <a className={styles.phone} href={hospitalContact.phoneHref}>{hospitalContact.phone}</a>
          <dl className={styles.otherContacts}>
            <div><dt>Alternative number</dt><dd><a href={hospitalContact.alternatePhoneHref}>{hospitalContact.alternatePhone}</a></dd></div>
            <div><dt>General enquiries</dt><dd><a href={`mailto:${hospitalContact.email}`}>{hospitalContact.email}</a></dd></div>
          </dl>
          <p className={styles.emailNote} data-help-clearance>For time-sensitive questions, please call. Email is not an emergency channel.</p>
        </section>
      </div>
      <div className={styles.support}>
        <div className={styles.arrivalAdvice}>
          <p>Confirm your department, entrance and access needs before travelling.</p>
          <Link className="text-link" href="/contact#before-you-travel">Arrival guidance <Icon name="arrow-right" /></Link>
        </div>
        <aside className={styles.urgent} aria-label="Urgent help">
          <p>Need urgent help?</p>
          <Link href="/emergency">Emergency information <Icon name="arrow-right" /></Link>
        </aside>
      </div>
    </div>
  </section>
}
