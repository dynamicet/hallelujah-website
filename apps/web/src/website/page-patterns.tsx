import { InterfaceLink as Link } from './interface-language'
import styles from './patient-page.module.css'
import type { ReactNode } from 'react'
// Optional composition pieces never render a header, footer, or main.
export { SiteContent as PageContent } from '@/design-system/components'

export function PageFrame({ children, className }: {
  readonly children: ReactNode
  readonly className?: string
}) {
  return <div className={['page-frame', className].filter(Boolean).join(' ')}>{children}</div>
}

// A standard introduction is optional; bespoke heroes can supply their own markup.
export function PageIntro({ title, description, action, secondaryAction, visual, artwork }: {
  readonly title: string
  readonly description?: string
  readonly action?: { readonly href: string; readonly label: string }
  readonly artwork?: ReactNode
  readonly secondaryAction?: { readonly href: string; readonly label: string }
  readonly visual?: ReactNode
}) {
  return <section className={styles.hero} aria-labelledby="patient-page-title">
    <div className={styles.heroCopy}>
      <h1 id="patient-page-title" data-reveal="0">{title}</h1>
      {description ? <p data-reveal="1">{description}</p> : null}
      {action || secondaryAction ? <div className={styles.actions}>
        {action ? (action.href.startsWith('#')
          ? <a className="solid-button blue-button" data-reveal="2" href={action.href}>{action.label}<span aria-hidden="true">→</span></a>
          : <Link className="solid-button blue-button" data-reveal="2" href={action.href}>{action.label}<span aria-hidden="true">→</span></Link>) : null}
        {secondaryAction ? (secondaryAction.href.startsWith('#')
          ? <a className="text-link" href={secondaryAction.href}>{secondaryAction.label}</a>
          : <Link className="text-link" href={secondaryAction.href}>{secondaryAction.label}</Link>) : null}
      </div> : null}
      {artwork}
    </div>
    {visual}
  </section>
}

export function ContentSection({ id, title, children, tone = false }: {
  id: string; title: string; children: ReactNode; tone?: boolean
}) {
  return <section id={id} tabIndex={-1} className={`${styles.section} ${tone ? styles.tone : ''}`} aria-labelledby={`${id}-title`}>
    <h2 id={`${id}-title`} data-reveal="0">{title}</h2>
    <div className={styles.sectionBody} data-reveal="1">{children}</div>
  </section>
}

export function PageActionLink({ href, children }: {
  readonly href: string; readonly children: ReactNode
}) {
  return <Link className="text-link" href={href}>{children}<span aria-hidden="true">→</span></Link>
}
