import Link from 'next/link'
import { EditorialReturnFocus } from '@/website/editorial-return-focus'
import { SiteShell } from '@/design-system/components'
import { demoShell, requireLocalDemo, type DemoSearchParams } from '@/demo/site'
import { editorialEntries, latestEditorial } from '@/demo/editorial'
import { EditorialCard } from '@/website/news-resources'
import styles from '@/website/news-resources.module.css'

export const metadata = {
  title: 'News, Events & Resources | Hallelujah Hospital',
  description: 'Explore health stories, educational reading, and community events.',
}

const categories = ['All', 'News', 'Events', 'Resources'] as const

export default async function NewsResourcesPage({ searchParams }: { searchParams: DemoSearchParams }) {
  requireLocalDemo()
  const query = (await searchParams).category
  const selected = categories.find((category) => category.toLowerCase() === query) ?? 'All'
  const entries = latestEditorial(editorialEntries).filter((entry) => selected === 'All' || entry.category === selected)
  return <SiteShell {...demoShell('/news-resources')}>
    <div className={`${styles.archive} page-frame`}><EditorialReturnFocus />
      <header className={styles.archiveHeader}><h1 data-reveal="0">News &amp; resources</h1></header>
      <nav className={styles.filters} aria-label="Story categories">{categories.map((category) => <Link
        aria-current={category === selected ? 'page' : undefined}
        href={category === 'All' ? '/news-resources' : `/news-resources?category=${category.toLowerCase()}`}
        key={category}
      >{category}<span>{category === 'All' ? editorialEntries.length : editorialEntries.filter((entry) => entry.category === category).length}</span></Link>)}</nav>
      <p className={styles.resultCount}>{entries.length} {entries.length === 1 ? 'story' : 'stories'} · Newest published first</p>
      {entries.length ? <div className={styles.archiveGrid}>{entries.map((entry) => <EditorialCard returnTo={selected === 'All' ? '/news-resources' : `/news-resources?category=${selected.toLowerCase()}`} entry={entry} key={entry.slug} />)}</div>
        : <div className={styles.empty}><h2>More stories soon.</h2><p>There are no published stories in this category yet.</p><Link className="text-link" href="/news-resources">View all stories <span aria-hidden="true">→</span></Link></div>}
    </div>
  </SiteShell>
}
