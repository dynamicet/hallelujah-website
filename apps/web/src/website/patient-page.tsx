import { InterfaceLink as Link } from '@/website/interface-language'
import type { ReactNode } from 'react'
import { SiteShell } from '@/design-system/components'
import { demoShell } from '@/demo/site'
import styles from './patient-page.module.css'
import { CarePageImage, type CarePageImageSource } from './care-page-image'
import { CareBrandArtwork } from './care-brand-artwork'

export { styles as patientPageStyles }

export type PatientPageVariant = 'care-detail' | 'practical-guide' | 'document' | 'recruitment' | 'task'
export type PatientSectionContext = 'default' | 'quiet' | 'preparation' | 'story' | 'assistance'

export function PatientPage({ title, description, current, action, children, variant, image: suppliedImage }: {
  title: string; description?: string; current: string; image?: CarePageImageSource
  action?: { href: string; label: string }; children: ReactNode; variant: PatientPageVariant
}) {
  const image = suppliedImage
  return <SiteShell {...demoShell(current)} breadcrumbs={{ label: 'Breadcrumb', items: [
    { href: '/', label: 'Home' },
    ...(current.startsWith('/services/') ? [{ href: '/services', label: 'Services' }] : []),
    ...(current.startsWith('/health-topics/') ? [{ href: '/health-topics', label: 'Health & care topics' }] : []),
    { href: current, label: title, current: true },
  ] }}>
    <div className={styles.page} data-patient-page={current} data-page-variant={variant}>
      <section className={styles.hero} aria-labelledby="patient-page-title">
        <div className={styles.heroCopy}>
          <h1 id="patient-page-title" data-reveal="0">{title}</h1>
          {description ? <p data-reveal="1">{description}</p> : null}
          {action ? action.href.startsWith('#') ? <a className="solid-button blue-button" data-reveal="2" href={action.href}>{action.label}<span aria-hidden="true">→</span></a>
            : <Link className="solid-button blue-button" data-reveal="2" href={action.href}>{action.label}<span aria-hidden="true">→</span></Link> : null}
          {variant === 'care-detail' ? <div className={styles.heroArtwork}><CareBrandArtwork /></div> : null}
        </div>
        {image ? <CarePageImage image={image} /> : null}
      </section>
      {children}
    </div>
  </SiteShell>
}

export function PatientSection({ id, title, children, context = 'default' }: {
  id: string; title: string; children: ReactNode; context?: PatientSectionContext
}) {
  return <section id={id} tabIndex={-1} className={styles.section} data-section-context={context} aria-labelledby={`${id}-title`}>
    <h2 id={`${id}-title`} data-reveal="0">{title}</h2>
    <div className={styles.sectionBody} data-reveal="1">{children}</div>
  </section>
}
