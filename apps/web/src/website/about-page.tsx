import Image from 'next/image'
import { InterfaceLink as Link } from '@/website/interface-language'
import { SiteShell } from '@/design-system/components'
import { demoShell } from '@/demo/site'
import { hospitalContact } from './hospital-contact'
import { hospitalFounder, hospitalLeadership } from './hospital-leadership'
import styles from './about-page.module.css'

// Institutional copy condensed from docs/content-reconciliation/sources/hospital-profile.json.
const milestones = [
  { year: '2006', text: 'Hallelujah Center for Internal Medicine and Chest Disease was established.' },
  { year: '2007', text: 'The center began welcoming patients on Bole Road.' },
  { year: '2010', text: 'The center became Hallelujah Higher Medical Clinic.' },
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

      <nav className={styles.chapters} aria-label="Explore About Hallelujah">
        <a href="#our-story">Our story <Arrow /></a>
        <a href="#founding-vision">Our founder <Arrow /></a>
        <a href="#our-values">Our values <Arrow /></a>
        <a href="#mission-and-vision">Mission &amp; vision <Arrow /></a>
        <a href="#leadership">Leadership <Arrow /></a>
      </nav>

      <section className={styles.chapter} id="our-story" aria-labelledby="about-story-title">
        <div className={styles.chapterIntro}>
          <h2 id="about-story-title">Our story</h2>
          <p>From a specialist center to a general hospital, Hallelujah’s story began with internal medicine and chest disease care.</p>
          <p>Established in 2006, the center grew into a clinic and later a general hospital, opening its doors in May 2017. That specialist beginning remains part of our identity today.</p>
        </div>
        <ol className={styles.timeline}>
          {milestones.map((milestone) => <li key={milestone.year}><span className={styles.year}>{milestone.year}</span><p>{milestone.text}</p></li>)}
        </ol>
      </section>

      <section className={styles.founder} id="founding-vision" aria-labelledby="about-founder-title">
        <figure className={styles.founderPortrait}>
          <div className={styles.portraitCrop} data-framing={hospitalFounder.framing}><Image src={hospitalFounder.portrait} alt={hospitalFounder.name} width={hospitalFounder.width} height={hospitalFounder.height} sizes="(max-width: 699px) 123vw, 62vw" /></div>
          <figcaption>{hospitalFounder.name}<span>Founder &amp; Chief Executive Officer</span></figcaption>
        </figure>
        <div className={styles.founderCopy}>
          <h2 id="about-founder-title">The founding vision</h2>
          {/* Replaceable editorial draft. No invented first-person quotation or biography. */}
          <p className={styles.founderLead}>Behind a hospital is a human story.</p>
          <p>For Hallelujah, that story includes Mrs. Yetnayet Eshetu, founder and Chief Executive Officer. Her place in the hospital’s beginning is a distinct part of the story we share today.</p>
          <p>From the first specialist center to the hospital it has become, Hallelujah’s journey brings together a founding commitment and the work of many people: clinicians, nurses, colleagues, and the community they serve.</p>
          <a className="text-link" href="#hospital-film">See Hallelujah in motion <Arrow /></a>
        </div>
      </section>

      <section className={styles.filmChapter} id="hospital-film" aria-labelledby="about-film-title">
        <div className={styles.filmIntro}>
          <h2 id="about-film-title">A closer look</h2>
          <p>A glimpse of care at Hallelujah.<span>18 seconds · Silent film</span></p>
        </div>
        {/* Current concept montage; replace with the founder interview when produced.
            Native controls support sound/captions for that future asset without
            coupling the story page to the homepage's muted montage controller. */}
        <video className={styles.film} controls playsInline preload="none" poster="/editorial/hallelujah-home-loop-poster.webp" aria-label="Care in every detail: silent hospital care montage">
          <source src="/editorial/hallelujah-home-loop.webm" type="video/webm" />
          <source src="/editorial/hallelujah-home-loop.mp4" type="video/mp4" />
          Your browser does not support embedded video.
        </video>
      </section>

      <section className={`${styles.chapter} ${styles.valuesChapter}`} id="our-values" aria-labelledby="about-values-title">
        <div className={styles.chapterIntro}>
          <h2 id="about-values-title">What guides our care</h2>
          <p>These values shape how we care for patients, support our people and serve our community.</p>
        </div>
        <dl className={styles.values}>
          {values.map((value) => <div key={value.name}><dt>{value.name}</dt><dd>{value.text}</dd></div>)}
        </dl>
      </section>

      <section className={styles.purpose} id="mission-and-vision" aria-label="Mission and vision">
        {/* Edited for readability from https://hallelujahhospital.com/about/. */}
        <div>
          <h2>Our mission</h2>
          <p>To be the first choice for patients seeking high-quality specialist care, offering trusted diagnosis and treatment at competitive prices.</p>
          <p>Through research and training, we strengthen our services and complement the preventive healthcare provided by the Government of Ethiopia.</p>
        </div>
        <div>
          <h2>Our vision</h2>
          <p>To become a leading healthcare provider in the Horn of Africa through strong organization and advanced technology.</p>
          <p>We aspire to deliver excellent medical care with close attention to clinical standards, hospitality and compassion, earning the satisfaction of the people we serve.</p>
        </div>
      </section>

      <section className={styles.leadership} id="leadership" aria-labelledby="about-leadership-title">
        <div className={styles.leadershipIntro}>
          <h2 id="about-leadership-title">Leadership today</h2>
          <p>The people leading Hallelujah’s management and clinical teams.</p>
        </div>
        <ul className={styles.leaders}>
          {hospitalLeadership.map((person) => <li key={person.name}>
            <div className={styles.leaderPortrait} data-framing={person.framing}><Image src={person.portrait} alt={person.name} width={person.width} height={person.height} sizes={person === hospitalFounder ? "(max-width: 359px) 142px, (max-width: 599px) 59vw, (max-width: 999px) 60vw, 30vw" : "(max-width: 359px) 104px, (max-width: 599px) 43vw, (max-width: 999px) 44vw, 22vw"} /></div>
            <h3>{person.name}</h3>
            <p>{person.role}</p>
            {person === hospitalFounder && <a href="#founding-vision">Meet our founder <Arrow /></a>}
          </li>)}
        </ul>
      </section>

      <section className={`${styles.chapter} ${styles.visit}`} aria-labelledby="about-visit-title">
        <h2 id="about-visit-title">Visit Hallelujah</h2>
        <div>
          <address><strong>{hospitalContact.name}</strong><span>{hospitalContact.address}</span></address>
          <div className={styles.actions}>
            <Link className="solid-button blue-button" href="/patients-visitors">Plan your visit <Arrow /></Link>
            <Link className="text-link" href="/contact">Contact &amp; directions <Arrow /></Link>
          </div>
        </div>
      </section>
    </div>
  </SiteShell>
}
