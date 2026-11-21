import type { ReactNode } from 'react'
import { PageContent, PageIntro } from './page-patterns'
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
  return <PageContent breadcrumbs={{ label: 'Breadcrumb', items: [
    { href: '/', label: 'Home' },
    ...(current.startsWith('/services/') ? [{ href: '/services', label: 'Services' }] : []),
    ...(current.startsWith('/health-topics/') ? [{ href: '/health-topics', label: 'Health & care topics' }] : []),
    { href: current, label: title, current: true },
  ] }}>
    <div className={styles.page} data-patient-page={current} data-page-variant={variant}>
      <PageIntro title={title} description={description} action={action}
        artwork={variant === 'care-detail' ? <div className={styles.heroArtwork}><CareBrandArtwork /></div> : undefined}
        visual={image ? <CarePageImage image={image} /> : undefined} />
      {children}
    </div>
  </PageContent>
}

export function PatientSection({ id, title, children, context = 'default' }: {
  id: string; title: string; children: ReactNode; context?: PatientSectionContext
}) {
  return <section id={id} tabIndex={-1} className={styles.section} data-section-context={context} aria-labelledby={`${id}-title`}>
    <h2 id={`${id}-title`} data-reveal="0">{title}</h2>
    <div className={styles.sectionBody} data-reveal="1">{children}</div>
  </section>
}
