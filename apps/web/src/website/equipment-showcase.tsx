import { InterfaceLink as Link } from '@/website/interface-language'
import styles from './equipment-showcase.module.css'
import { EquipmentChapterNav } from './equipment-chapter-nav'

// Presentation selection from hospital-profile.json#/technology_as_published.
// Generic generated images are temporary illustrations, not manufacturer/model photos.
// Do not add scarcity, availability, performance or outcome claims without evidence.
const equipment = [
  {
    id: 'c-arm',
    name: 'C-arm imaging',
    navigationLabel: 'C-arm imaging',
    statement: 'A clearer view. As care happens.',
    description: 'Moving X-ray images help a surgical team see the area being treated during a procedure.',
    image: 'equipment-c-arm',
    alt: 'Illustration of a mobile C-arm X-ray system and its imaging workstation',
    capability: 'The curved imaging arm can be positioned around the treatment area, giving the team different views without moving the patient between separate scans.',
    preparation: 'Ask whether imaging is part of your procedure and what preparation your care team recommends.',
    referral: 'Confirm the procedure, imaging requirements and relevant prior studies with the receiving clinical team.',
  },
  {
    id: 'laboratory',
    name: 'Laboratory analyser',
    navigationLabel: 'Laboratory',
    statement: 'Small samples. Valuable insights.',
    description: 'Processes samples for different types of laboratory tests.',
    image: 'equipment-laboratory',
    alt: 'Illustration of an integrated laboratory chemistry and immunoassay analyser',
    capability: 'An integrated analyser processes samples for different types of laboratory investigation. The tests requested depend on the clinical question.',
    preparation: 'Ask which tests have been requested, whether fasting is needed and how you will receive your results.',
    referral: 'Confirm the test menu, sample requirements and reporting arrangements before sending a sample or referring a patient.',
  },
  {
    id: 'dental',
    name: 'Panoramic dental imaging',
    navigationLabel: 'Dental imaging',
    statement: 'See the bigger picture.',
    description: 'A broad view of the teeth and jaws helps dental teams assess concerns and plan treatment.',
    image: 'equipment-dental',
    alt: 'Illustration of a standing panoramic dental X-ray imaging system',
    capability: 'Panoramic imaging brings the teeth and surrounding jaw structures together in one image. Your dental clinician decides when this view is appropriate.',
    preparation: 'Bring any previous dental images and tell your dental team about anything that could affect the examination.',
    referral: 'Confirm the clinical question, requested views and image-sharing arrangements with the dental team.',
  },
] as const

type Equipment = typeof equipment[number]

function EquipmentImage({ item }: { item: Equipment }) {
  const sizes = '(min-width: 900px) 55vw, (min-width: 700px) 40vw, 100vw'
  return <figure className={styles.image} data-signature-frame="equipment">
    <picture>
      <source type="image/avif" srcSet={`/editorial/${item.image}-640.avif 640w, /editorial/${item.image}-1440.avif 1440w`} sizes={sizes} />
      <img src={`/editorial/${item.image}-1440.webp`} srcSet={`/editorial/${item.image}-640.webp 640w, /editorial/${item.image}-1440.webp 1440w`} sizes={sizes} alt={item.alt} width="1440" height="960" loading="lazy" />
    </picture>
  </figure>
}

function CloserLook({ item }: { item: Equipment }) {
  return <details className={styles.details}>
    <summary>Uses & preparation<span aria-hidden="true" className={styles.plus}>+</span></summary>
    <div className={styles.expanded}>
      <p>{item.capability}</p>
      <div className={styles.audiences}>
        <div><h4>For patients</h4><p>{item.preparation}</p><Link href="/appointment">Plan your care<span aria-hidden="true">→</span></Link></div>
        <div><h4>For referring clinicians</h4><p>{item.referral}</p><Link href="/referrals">Referral information<span aria-hidden="true">→</span></Link></div>
      </div>
    </div>
  </details>
}

export function EquipmentShowcase() {
  const careLinks = {
    'c-arm': { href: '/services/synthetic-service-252525252525/', label: 'Explore bones & joints' },
    laboratory: { href: '/services/synthetic-service-141414141414/', label: 'Explore general medicine' },
    dental: { href: '/appointment', label: 'Ask about dental care' },
  }
  return <section className={styles.section} aria-labelledby="equipment-title" id="medical-technology" data-signature-scene="equipment" data-motion-section="technology" data-motion-chapter>
    <div className="page-frame">
      <div className={styles.introduction}>
        <h2 id="equipment-title" data-motion="heading" data-reveal="0">Technology behind your care</h2>
        <EquipmentChapterNav chapters={equipment.map((item) => ({ id: `equipment-${item.id}-scene`, label: item.navigationLabel, name: item.name, device: item.id }))} />
      </div>
      <div className={`${styles.supporting} equipment-chapters`}>
        {equipment.map((item, index) => <article id={`equipment-${item.id}-scene`} tabIndex={-1} data-equipment-stop data-motion="card" data-reveal={index} className={`${styles.product} equipment-chapter`} key={item.id} aria-labelledby={`equipment-${item.id}`}>
          <EquipmentImage item={item} />
          <div className={`${styles.productCopy} equipment-chapter-copy`}><h3 id={`equipment-${item.id}`}>{item.name}</h3><p className={styles.productDescription}>{item.description}</p><Link className={styles.serviceLink} href={careLinks[item.id].href}>{careLinks[item.id].label} <span aria-hidden="true">→</span></Link></div>
          <CloserLook item={item} />
        </article>)}
      </div>
      <div className={styles.footer}>
        <Link href="/services">Explore services<span aria-hidden="true">→</span></Link>
      </div>
    </div>
  </section>
}
