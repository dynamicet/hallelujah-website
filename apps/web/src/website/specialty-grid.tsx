import { InterfaceLink as Link } from '@/website/interface-language'
import { featuredSpecialties } from '@/demo/specialties'
import { services } from '@/demo/site'
import styles from './specialty-grid.module.css'

export function SpecialtyGrid() {
  return <section className="care-areas" aria-labelledby="care-areas-title" id="specialized-care" data-motion-section="care" data-motion-chapter>
    <div className="page-frame">
      <div className={styles.introduction}>
        <h2 data-reveal="0" data-motion="heading" id="care-areas-title">Specialized care, <span className="home-heading-accent">close to you</span></h2>
      </div>
      <ul className={styles.grid}>
        {featuredSpecialties.flatMap((care, index) => {
          const service = services.find((entry) => entry.publicId === care.servicePublicId)
          return service ? [<li data-reveal={index} data-motion="card" key={care.servicePublicId}>
            <Link className={`${styles.card} home-care-card`} href={service.canonicalPath} aria-labelledby={`specialty-${care.servicePublicId}`} aria-describedby={`specialty-description-${care.servicePublicId}`}>
              <div>
                <h3 id={`specialty-${care.servicePublicId}`}>{care.label}</h3>
                <p className={styles.specialty}>{care.specialty}</p>
              </div>
              <div className={styles.details}>
                <p className={styles.description} id={`specialty-description-${care.servicePublicId}`}>{care.description}</p>
                <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12h16m-6-6 6 6-6 6" /></svg>
              </div>
            </Link>
          </li>] : []
        })}
      </ul>
      <div className={styles.footer}>
        <a className="signature-link" href="#home-doctors">Meet our specialists<span aria-hidden="true">↓</span></a>
        <Link className="text-link" href="/services">View all services<span aria-hidden="true">→</span></Link>
      </div>
    </div>
  </section>
}
