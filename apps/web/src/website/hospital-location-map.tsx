import { hospitalContact } from './hospital-contact'
import styles from './contact-directions.module.css'

export function HospitalLocationMap() {
  return <div className={styles.map}>
    {/* eslint-disable-next-line @next/next/no-img-element -- Already sized and compressed local map. */}
    <img loading="lazy" decoding="async" src="/maps/gotera-location.webp" alt="Street map showing the hospital’s location in Gotera, Addis Ababa." width={768} height={440} />
    <div className={styles.mapPin} aria-hidden="true"><span>{hospitalContact.name}</span><b data-record-entry>H</b></div>
    <a className={styles.mapCredit} data-map-credit href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">© OpenStreetMap contributors</a>
  </div>
}
