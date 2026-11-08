import Image from 'next/image'
import { InterfaceLink as Link } from '@/website/interface-language'
import { SiteShell } from '@/design-system/components'
import { demoShell } from '@/demo/site'
import { hospitalContact } from './hospital-contact'
import styles from './about-page.module.css'

// Institutional copy condensed from docs/content-reconciliation/sources/hospital-profile.json.
const milestones = [
  { year: '2006', text: 'Hallelujah Center for Internal Medicine and Chest Disease was established.' },
  { year: '2007', text: 'The center began welcoming patients on Bole Road.' },
  { year: '2017', text: 'Hallelujah General Hospital became fully operational.' },
]

const values = [
  { name: 'Human dignity', text: 'Respect for patients and their families, with attention to physical, emotional and spiritual needs.' },
  { name: 'Excellence', text: 'A commitment to high standards in medical care and service.' },
  { name: 'Compassion', text: 'Personal attention to the people who come to us for care.' },
  { name: 'Social responsibility', text: 'Thoughtful use of resources to serve people and the wider community.' },
  { name: 'Staff empowerment', text: 'A workplace where people are valued, respected and supported to grow.' },
]

const Arrow = () => <span aria-hidden="true">→</span>

export function AboutPage() {
  return <SiteShell {...demoShell('/about')} breadcrumbs={{ label: 'Breadcrumb', items: [
    { href: '/', label: 'Home' }, { href: '/about', label: 'About Hallelujah', current: true },
  ] }}>
    <div className={`page-frame ${styles.page}`}>
      <header className={styles.hero}>
        <figure className={styles.scene}>
          <Image src="/editorial/human-care-1600.webp" alt="Two care professionals in conversation in a bright corridor" width={1600} height={1000} sizes="(max-width: 700px) calc(100vw - 40px), (max-width: 1440px) calc(100vw - 112px), 1280px" preload />
        </figure>
        <div className={styles.opening}>
          <p className={styles.identity}>{hospitalContact.name}<span>Gotera · Addis Ababa, Ethiopia</span></p>
          <div>
            <h1>About Hallelujah</h1>
            <p className={styles.intro}>A general hospital in Addis Ababa, with roots in internal medicine and chest care.</p>
            <Link className="solid-button blue-button" href="/services">Explore our care <Arrow /></Link>
          </div>
        </div>
      </header>

      <section className={styles.chapter} aria-labelledby="about-story-title">
        <div className={styles.chapterIntro}>
          <h2 id="about-story-title">Our story</h2>
          <p>From a specialist center to a general hospital, Hallelujah’s story began with internal medicine and chest disease care.</p>
        </div>
        <ol className={styles.timeline}>
          {milestones.map((milestone) => <li key={milestone.year}><span className={styles.year}>{milestone.year}</span><p>{milestone.text}</p></li>)}
        </ol>
      </section>

      <section className={`${styles.chapter} ${styles.valuesChapter}`} aria-labelledby="about-values-title">
        <div className={styles.chapterIntro}>
          <h2 id="about-values-title">What guides our care</h2>
          <p>Our mission brings specialized diagnosis and treatment together with trusted, compassionate care.</p>
        </div>
        <dl className={styles.values}>
          {values.map((value) => <div key={value.name}><dt>{value.name}</dt><dd>{value.text}</dd></div>)}
        </dl>
      </section>

      <section className={`${styles.chapter} ${styles.visit}`} aria-labelledby="about-visit-title">
        <h2 id="about-visit-title">Visit Hallelujah</h2>
        <div>
          <address><strong>{hospitalContact.name}</strong><span>{hospitalContact.address}</span></address>
          <div className={styles.actions}>
            <Link className="solid-button blue-button" href="/patients-visitors">Plan your visit <Arrow /></Link>
            <Link className="text-link" href="/#home-directions">Contact &amp; directions <Arrow /></Link>
          </div>
        </div>
      </section>
    </div>
  </SiteShell>
}
