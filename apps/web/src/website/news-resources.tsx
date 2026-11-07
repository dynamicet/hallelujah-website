import Link from 'next/link'
import { EditorialReturnFocus } from './editorial-return-focus'
import { editorialDate, eventStatus, latestEditorial, type EditorialEntry } from '@/demo/editorial'
import styles from './news-resources.module.css'

const Arrow = () => <span aria-hidden="true">→</span>

export function EditorialCard({ entry, featured = false, eagerImage = false, motionStep, returnTo = '/', groupedMetadata = false }: { entry: EditorialEntry; featured?: boolean; eagerImage?: boolean; motionStep?: number; returnTo?: string; groupedMetadata?: boolean }) {
  const date = <span className={styles.date}><time aria-label={`${entry.event ? 'Event date' : 'Published'} ${editorialDate(entry.event?.startsAt ?? entry.publishedAt)}`} dateTime={entry.event?.startsAt ?? entry.publishedAt}>{editorialDate(entry.event?.startsAt ?? entry.publishedAt)}</time></span>
  return <article id={`editorial-${entry.slug}`} tabIndex={-1} data-editorial-card data-motion="card" data-reveal={motionStep} className={`${styles.card} ${featured ? styles.featured : ''} ${entry.image ? '' : styles.textOnly}`}>
    {entry.image && <figure className={styles.image} data-motion="image" data-reveal={motionStep === undefined ? "0" : undefined}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img alt={entry.image.alt} src={entry.image.src} width={entry.image.width} height={entry.image.height} loading={eagerImage ? 'eager' : 'lazy'} />
    </figure>}
    <div className={styles.cardBody}>
      <h3 data-reveal={motionStep === undefined ? "1" : undefined}><Link className={styles.storyLink} href={`/news-resources/${entry.slug}?from=${encodeURIComponent(returnTo)}`}>{entry.title}</Link></h3>
      <div className={`${styles.meta} ${groupedMetadata ? styles.groupedMeta : ''}`}><span>{entry.category}</span><span>{entry.event ? eventStatus(entry.event.startsAt) : `${entry.readingMinutes} min read`}</span>{groupedMetadata ? date : null}</div>
      <p>{entry.summary}</p>
      <div className={`${styles.cardFooter} ${groupedMetadata ? styles.groupedFooter : ''}`}>{!groupedMetadata ? date : null}<span className={styles.readMore} aria-hidden="true">{entry.event ? 'View event details' : 'Read the article'} <Arrow /></span></div>
    </div>
  </article>
}

export function NewsResources({ entries }: { entries: readonly EditorialEntry[] }) {
  const latest = latestEditorial(entries)
    .filter((entry) => !entry.event || eventStatus(entry.event.startsAt) === 'Upcoming event')
    .slice(0, 3)
  if (!latest.length) return null
  return <section aria-labelledby="news-resources-title" className={styles.section} id="news-resources" data-motion-section="updates">
    <div className="page-frame"><EditorialReturnFocus />
    <div className={styles.heading}>
      <div><h2 id="news-resources-title" data-motion="heading" data-reveal="0">News and resources</h2></div>
      <Link className="text-link" href="/news-resources">All news and resources <Arrow /></Link>
    </div>
    <div className={styles.stories}>{latest.map((entry, index) => <EditorialCard motionStep={index} featured={index === 0} entry={entry} key={entry.slug} groupedMetadata />)}</div>
    </div>
  </section>
}
