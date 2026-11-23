import Image from 'next/image'
import { InterfaceLink as Link } from './interface-language'
import styles from './hospital-introduction.module.css'

export function HospitalIntroduction() {
  return <section className={styles.section} id="about-hallelujah" aria-labelledby="hospital-introduction-title">
    <div className="page-frame">
      <div className={styles.panel}>
        <div className={styles.copy}>
          <h2 id="hospital-introduction-title">From Gotera, caring for Addis Ababa.</h2>
          <p>Hallelujah General Hospital began as a specialist center for internal medicine and chest disease. Today, we provide general hospital care in Gotera.</p>
          <Link className={`solid-button ${styles.action}`} href="/about">Learn more about us <span aria-hidden="true">→</span></Link>
        </div>
        <figure className={styles.still}>
          <Image src="/editorial/hallelujah-reception-illustration.webp" alt="" width={1200} height={900} sizes="(max-width: 699px) 100vw, (max-width: 1440px) 40vw, 512px" />
          <figcaption className={styles.caption}>Illustrative image</figcaption>
        </figure>
      </div>
    </div>
  </section>
}
