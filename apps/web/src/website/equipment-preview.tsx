import { InterfaceLink as Link } from './interface-language'
import styles from './equipment-preview.module.css'

export function EquipmentPreview() {
  return <section className={styles.section} id="medical-technology" aria-labelledby="equipment-title">
    <div className={`page-frame ${styles.composition}`}>
      <figure className={styles.image}>
        <picture>
          <source type="image/avif" srcSet="/editorial/equipment-c-arm-640.avif 640w, /editorial/equipment-c-arm-1440.avif 1440w" sizes="(min-width: 900px) 48vw, 100vw" />
          <img src="/editorial/equipment-c-arm-1440.webp" srcSet="/editorial/equipment-c-arm-640.webp 640w, /editorial/equipment-c-arm-1440.webp 1440w" sizes="(min-width: 900px) 48vw, 100vw" alt="Illustration of a mobile C-arm X-ray system and its imaging workstation" width="1440" height="960" loading="lazy" />
        </picture>
      </figure>
      <div className={styles.copy}>
        <h2 id="equipment-title">Technology behind your care</h2>
        <p>C-arm imaging, laboratory analysis and panoramic dental imaging.</p>
        <Link className="text-link" href="/about#medical-technology">Explore technology &amp; preparation <span aria-hidden="true">→</span></Link>
      </div>
    </div>
  </section>
}
