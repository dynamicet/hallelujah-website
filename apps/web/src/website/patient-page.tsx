import type { ReactNode } from 'react'
import { PageContent, PageIntro } from './page-patterns'
import styles from './patient-page.module.css'
import Image from 'next/image'
import { CareBrandArtwork } from './care-brand-artwork'

export { styles as patientPageStyles }

export type PatientPageVariant = 'care-detail' | 'practical-guide' | 'document' | 'recruitment' | 'task'
export type PatientSectionContext = 'default' | 'quiet' | 'preparation' | 'story' | 'assistance'

export function PatientPage({ title, description, current, action, secondaryAction, children, variant, imageSrc }: {
  title: string; description?: string; current: string; imageSrc?: string
  action?: { href: string; label: string }; secondaryAction?: { href: string; label: string }; children: ReactNode; variant: PatientPageVariant
}) {
  return <PageContent breadcrumbs={{ label: 'Breadcrumb', items: [
    { href: '/', label: 'Home' },
    ...(current.startsWith('/services/') ? [{ href: '/services', label: 'Services' }] : []),
    { href: current, label: title, current: true },
  ] }}>
    <div className={styles.page} data-patient-page={current} data-page-variant={variant}>
      <PageIntro title={title} description={description} action={action} secondaryAction={secondaryAction}
        artwork={variant === 'care-detail' ? <div className={styles.heroArtwork}><CareBrandArtwork /></div> : undefined}
        visual={imageSrc ? <figure className="care-page-image" data-reveal="2">
          <Image src={imageSrc} alt="" width={640} height={480} sizes="(max-width: 599px) 90vw, 40vw" loading="eager" />
        </figure> : undefined} />
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
