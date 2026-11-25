import Link from 'next/link'
import { getImageProps } from 'next/image'
import styles from './service-card.module.css'

export interface ServiceCardPresentation {
  readonly imageSrc: string
  readonly specialty?: string
}

interface ServiceCardProps extends ServiceCardPresentation {
  readonly compactOnMobile?: boolean
  readonly href: string
  readonly name: string
  readonly summary?: string
}

/** One link and one visual contract for featured and directory care cards. */
export function ServiceCard({ href, name, summary, imageSrc, specialty, compactOnMobile }: ServiceCardProps) {
  const { props: image } = getImageProps({
    src: imageSrc, alt: '', width: 640, height: 480,
    sizes: compactOnMobile ? '(max-width: 1199px) 50vw, 25vw' : '(max-width: 599px) 100vw, (max-width: 1199px) 50vw, 33vw',
  })
  return <Link href={href} className={styles.card} data-service-card data-compact-mobile={compactOnMobile || undefined}>
    <div className={styles.media}>
      {/* The adjacent name supplies the accessible label; artwork is illustrative. */}
      {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text -- Optimized responsive attributes and alt are generated on the server. */}
      <img {...image} />
    </div>
    <div className={styles.content}>
      <h3>{name}</h3>
      {specialty ? <p className={styles.specialty}>{specialty}</p> : null}
      {summary ? <p className={styles.summary}>{summary}</p> : null}
      <span className={styles.action}><span className={styles.actionLabel}>Explore service</span> <span aria-hidden="true">↗</span></span>
    </div>
  </Link>
}
