import Image from 'next/image'
import { hospitalContact } from './hospital-contact'
import styles from './contact-directions.module.css'

export function HospitalLocationMap() {
  return <div className={styles.map}>
    <Image src="/maps/gotera-location.webp" alt="Street map showing the hospital’s location in Gotera, Addis Ababa." width={768} height={440} unoptimized />
    <div className={styles.mapPin} aria-hidden="true"><span>{hospitalContact.name}</span><b>H</b></div>
    <a className={styles.mapCredit} href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">© OpenStreetMap contributors</a>
  </div>
}
