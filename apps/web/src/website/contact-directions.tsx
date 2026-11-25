import { InterfaceText, InterfaceLink as Link } from '@/website/interface-language'
import { Icon } from '@/design-system/components/icon'

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
      <div className={styles.columns} data-reveal-group>
        <section className={styles.location} aria-label="Hospital location">
          <address className={styles.address} data-help-clearance>
            <strong>{hospitalContact.name}</strong>
            <span>Around Gotera Condominium</span>
            <span>Addis Ababa, Ethiopia</span>
          </address>
          <div className={styles.locationActions}>
            <a className="solid-button" href={hospitalContact.directionsHref}><InterfaceText>Get directions</InterfaceText> <Icon name="directions" /></a>
          </div>
          <div id="home-call" tabIndex={-1}>
            <h3>Reception</h3>
            <a className={styles.phone} href={hospitalContact.phoneHref}>{hospitalContact.phone}</a>
          </div>
        </section>
        <HospitalLocationMap />
      </div>
    </div>
  </section>
}
