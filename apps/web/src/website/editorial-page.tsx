import Link from 'next/link'
import { notFound } from 'next/navigation'
import { SiteShell } from '@/design-system/components'
import { demoShell, requireLocalDemo } from '@/demo/site'
import { editorialDate, editorialEntries, eventStatus } from '@/demo/editorial'
import { ArticleReadingGuide } from '@/website/article-reading-guide'
import styles from '@/website/news-resources.module.css'

async function resolveEntry(params: Promise<{ slug: string }>) {
  requireLocalDemo()
  const { slug } = await params
  const entry = editorialEntries.find((item) => item.slug === slug)
  if (!entry) notFound()
  return entry
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const entry = await resolveEntry(params)
  return { title: `${entry.title} | Hallelujah Hospital`, description: entry.summary }
}

export default async function EditorialPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ from?: string }> }) {
  const entry = await resolveEntry(params)
  const path = `/news-resources/${entry.slug}`
  const { from } = await searchParams
  const sources = ['/', '/news-resources', '/news-resources?category=news', '/news-resources?category=events', '/news-resources?category=resources']
  const source = from && sources.includes(from) ? from : '/news-resources'
  const returnHref = `${source}#editorial-${entry.slug}`
  const returnLabel = source === '/' ? 'Back to homepage stories' : 'Back to your stories'
  const chapters = entry.sections.map((section, index) => ({ id: `reading-${index + 1}`, label: section.title }))
  return <SiteShell {...demoShell(path)} breadcrumbs={{ label: 'Breadcrumb', items: [
    { href: '/', label: 'Home' }, { href: '/news-resources', label: 'News, Events & Resources' },
    { href: path, label: entry.title, current: true },
  ] }}>
    <article data-editorial-reader className={`${styles.article} page-frame`}>
      <Link data-editorial-return className={styles.back} href={returnHref}><span aria-hidden="true">←</span> {returnLabel}</Link>
      <header className={styles.articleHeader}>

        <h1>{entry.title}</h1><p>{entry.summary}</p>
        <div className={styles.articleMeta}><span>{entry.category} · {entry.readingMinutes} minute read</span><span>Published <time dateTime={entry.publishedAt}>{editorialDate(entry.publishedAt)}</time></span></div>
      </header>
      <div className={styles.articleLayout}>
        <div className={styles.readingAside}>{chapters.length >= 3 ? <ArticleReadingGuide chapters={chapters} /> : null}<aside className={styles.aside} aria-labelledby="editorial-next-step"><h2 id="editorial-next-step">Visit preparation</h2><Link className="text-link" href="/patients-visitors#checklist">Make a visit checklist <span aria-hidden="true">→</span></Link><Link className="text-link" href="/health-topics">View health & care topics <span aria-hidden="true">→</span></Link></aside></div>
        <div className={styles.articleBody}>
          {entry.event ? <dl className={styles.eventDetails}>
            <dt>{eventStatus(entry.event.startsAt)}</dt><dd><time dateTime={entry.event.startsAt}>{editorialDate(entry.event.startsAt)} · {new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Addis_Ababa' }).format(new Date(entry.event.startsAt))} (Addis Ababa, UTC+3)</time></dd>
            <dt>Location</dt><dd>{entry.event.location}</dd><dt>Attendance</dt><dd>Registration is not open.</dd>
          </dl> : null}
      {entry.image && <figure className={styles.articleImage}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={entry.image.src} alt={entry.image.alt} width={entry.image.width} height={entry.image.height} fetchPriority="high" />
      </figure>}

          {entry.sections.map((section, index) => <section data-reading-section id={chapters[index].id} tabIndex={-1} key={section.title}><h2>{section.title}</h2><p>{section.text}</p></section>)}
          <footer className={styles.readingEnd}><p>Keep exploring</p><Link data-editorial-return className="text-link" href={returnHref}>{returnLabel} <span aria-hidden="true">↗</span></Link><Link className="text-link" href="/news-resources">All news and resources <span aria-hidden="true">→</span></Link></footer>
        </div>

      </div>
    </article>
  </SiteShell>
}
