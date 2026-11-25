import { getImageProps } from 'next/image'
import { InterfaceLink as Link } from './interface-language'
import styles from './hospital-introduction.module.css'

export function HospitalIntroduction() {
  const { props: image } = getImageProps({
    src: '/editorial/hallelujah-reception-illustration.webp', alt: '', width: 1200, height: 900,
    sizes: '(max-width: 699px) 100vw, (max-width: 1440px) 40vw, 512px',
  })
  return <section className={styles.section} id="about-hallelujah" data-motion-section="introduction" aria-labelledby="hospital-introduction-title">
    <div className="page-frame">
      <div className={styles.panel}>
        <div className={styles.copy}>
          <h2 id="hospital-introduction-title" data-reveal="0" data-motion="heading">From <span className={styles.place}>Gotera</span>, caring for Addis Ababa.</h2>
          <p>We welcomed our first patients on Bole Road in 2007. Today, we care for patients here in Gotera.</p>
          <div className={styles.actions}>
            <Link className={`solid-button ${styles.action}`} href="/about#our-story">Read our story <span aria-hidden="true">→</span></Link>
            <Link className={styles.connect} href="/partnerships">Connect with us <span aria-hidden="true">→</span></Link>
          </div>
        </div>
        <figure className={styles.still}>
          {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text -- Optimized responsive attributes and alt are generated on the server. */}
          <img {...image} />
        </figure>
      </div>
    </div>
  </section>
}
