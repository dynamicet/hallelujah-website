'use client'

import { useState } from 'react'
import Link from 'next/link'

import styles from './study.module.css'

interface Capture {
  readonly id: string
  readonly title: string
  readonly detail: string
  readonly height: number
  readonly captureWidth: number
  readonly variants: readonly { version: string; width: number; height: number; captureWidth: number }[]
}

export function CompositionStudy({ captures }: { readonly captures: readonly Capture[] }) {
  const [width, setWidth] = useState<1440 | 390>(1440)
  const [group, setGroup] = useState<'all' | 'home' | 'shared'>('all')
  const shown = captures.filter((_, index) => group === 'all' || (group === 'home' ? index < 16 : index >= 16))

  return <main className={styles.study}>
    <header className={styles.opening}>
      <div className={styles.topline}><Link href="/">Hallelujah · website preview</Link><Link href="/component-library">Open the live component gallery ↗</Link></div>
      <h1>One identity.<br /><em>More life.</em></h1>
      <div className={styles.argument}>
        <p>Blue leads. Warmth, contrast and detail bring it to life.</p>
        <p>Compare the previous implementation with the revised composition across all 16 homepage areas and {captures.length - 16} shared-component groups. Captures show the implemented designs with existing content and imagery. Newly added specimens compare the previous and revised component styles.</p>
      </div>
      <div className={styles.palette} aria-label="Composition palette">
        {['Deep blue', 'Primary blue', 'Blue mist', 'White', 'Paper', 'Orange', 'Magenta'].map((label, index) => <span key={label}><i className={styles['swatch' + index]} aria-hidden="true" />{label}</span>)}
      </div>
    </header>
    <section className={styles.controls} aria-label="Comparison controls">
      <div role="group" aria-label="Capture size">
        <button type="button" aria-pressed={width === 1440} onClick={() => setWidth(1440)}>Desktop · 1440px</button>
        <button type="button" aria-pressed={width === 390} onClick={() => setWidth(390)}>Phone · 390px</button>
      </div>
      <div role="group" aria-label="Component category">
        {(['all', 'home', 'shared'] as const).map((value) => <button key={value} type="button" aria-pressed={group === value} onClick={() => setGroup(value)}>{value === 'all' ? 'All comparisons' : value === 'home' ? 'Homepage' : 'Shared components'}</button>)}
      </div>
      <p>Open a comparison to inspect it. Select an image for the full-size capture. Use the live previews to test interactions.</p>
    </section>
    <nav className={styles.index} aria-label="Jump to a comparison">
      {shown.map(({ id, title }) => <a key={id} href={'#compare-' + id}>{title}</a>)}
    </nav>
    <div className={styles.comparisons}>
      {shown.map(({ id, title, detail, variants }, index) => <details key={id} id={'compare-' + id} className={styles.comparison} open={index < 4}>
        <summary><h2>{title}</h2><span aria-hidden="true">+</span></summary>
        <p className={styles.rationale}>{detail}</p>
        <div className={styles.pair} data-capture-size={width}>
          {(['before', 'after'] as const).map((version) => {
            const dimensions = variants.find((variant) => variant.version === version && variant.width === width)
            return <figure key={version}>
            <figcaption><strong>{version === 'before' ? 'Previous' : 'Revised · implemented'}</strong><span>{width}px capture</span></figcaption>
            <a href={'/composition-study/captures/' + version + '-' + id + '-' + width + '.jpg'} target="_blank" rel="noreferrer" aria-label={'Open full-size ' + version + ' capture of ' + title}>
              {/* Captured browser evidence is displayed at its original ratio. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={'/composition-study/captures/' + version + '-' + id + '-' + width + '.jpg'} alt={title + ': ' + (version === 'before' ? 'previous composition' : detail)} loading="lazy" width={dimensions?.captureWidth} height={dimensions?.height} />
            </a>
          </figure>})}
        </div>
      </details>)}
    </div>
    <section className={styles.next} aria-labelledby="detail-coverage">
      <h2 id="detail-coverage">The details are part of the system.</h2>
      <div>
        <p>The revised gallery separates surface tone from accent and edge treatment. It includes primary, secondary and text actions; nested surfaces; task cards; fields, choices and validation; pending, disabled and result feedback; notices and urgent access.</p>
        <p>Further live specimens cover search, filters, applied filters, pagination, text areas, error recovery, loading, empty, offline, unavailable and expired states. These newly added specimens extend the comparison coverage and are available in the gallery.</p>
      </div>
      <Link href="/component-library">Explore every live state <span aria-hidden="true">→</span></Link>
      <p className={styles.note}>Development design study. Existing fictional stories, illustrative statistics and generated imagery retain their preview labels. Captures are visual evidence; they do not establish complete accessibility compliance.</p>
    </section>
  </main>
}
