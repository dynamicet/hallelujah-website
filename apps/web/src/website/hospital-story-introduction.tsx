import Image from 'next/image'
import { InterfaceLink as Link } from './interface-language'
import { hospitalFounder } from './hospital-leadership'
import styles from './hospital-story-introduction.module.css'

export function HospitalStoryIntroduction() {
  return <div className={`page-frame ${styles.introduction}`}>
    <div>
      <h2 id="hospital-story-title">The story behind Hallelujah</h2>
      <p>From a specialist center to a general hospital. Discover our beginnings and the people who helped shape them.</p>
      <Link className="text-link" href="/about#our-story">Explore our story <span aria-hidden="true">→</span></Link>
    </div>
    <Link className={styles.founder} href="/about#founding-vision">
      <span className={styles.portrait}><Image src={hospitalFounder.portrait} alt="" width={786} height={786} sizes="100px" /></span>
      <span className={styles.person}><strong>{hospitalFounder.name}</strong><span>Founder &amp; CEO</span><span className={styles.invitation}>Meet our founder <span aria-hidden="true">→</span></span></span>
    </Link>
  </div>
}
