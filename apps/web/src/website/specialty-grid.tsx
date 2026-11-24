import { ServiceCard } from '@/design-system/components'
import { servicePresentation } from './service-presentation'
import { InterfaceLink as Link } from '@/website/interface-language'
import { featuredSpecialties } from '@/demo/specialties'
import { services } from '@/demo/site'
import { CareBrandArtwork } from './care-brand-artwork'
import styles from './specialty-grid.module.css'

export function SpecialtyGrid() {
  return <section className="care-areas" aria-labelledby="care-areas-title" id="specialized-care" data-motion-section="care">
    <div className="page-frame">
      <div className={styles.introduction}>
        <h2 data-record-entry data-reveal="0" data-motion="heading" id="care-areas-title">Specialized care, close to you</h2>
        <div className={styles.artwork}><CareBrandArtwork /></div>
      </div>
      <ul data-ui-part="grid" className={styles.grid}>
        {featuredSpecialties.flatMap((care, index) => {
          const service = services.find((entry) => entry.publicId === care.servicePublicId)
          return service ? [<li data-reveal={index} data-motion="card" key={care.servicePublicId}>
            <ServiceCard href={service.canonicalPath} name={care.label} {...servicePresentation(care.servicePublicId)} />
          </li>] : []
        })}
      </ul>
      <div data-ui-part="footer" className={styles.footer}>
        <a className="signature-link" href="#home-doctors">Meet our specialists<span aria-hidden="true">↓</span></a>
        <Link className="text-link" href="/services">View specialties &amp; services<span aria-hidden="true">→</span></Link>
      </div>
    </div>
  </section>
}
