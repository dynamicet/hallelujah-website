'use client'

import { InterfaceCopy, InterfaceText, InterfaceLink as Link } from '@/website/interface-language'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { HealthTopic } from '@/demo/health-topics'
import styles from './health-library.module.css'
import { normalizeHealthQuery, searchHealthTopics } from './health-search'

const resultBatchSize = 6
const alphabet = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ']
const routeLabels = { appointment: 'Appointment options', guidance: 'Start with a conversation' }
const Arrow = () => <span aria-hidden="true">→</span>

export function HealthLibrary({ topics, title = 'Find health topics', standalone = false }: { readonly topics: readonly HealthTopic[]; readonly title?: string; readonly standalone?: boolean }) {
  const [query, setQuery] = useState('')
  const [letter, setLetter] = useState('')
  const [browseAll, setBrowseAll] = useState(false)
  const [visibleCount, setVisibleCount] = useState(resultBatchSize)
  const [lastRead, setLastRead] = useState<string | null>(null)
  const sourceScroll = useRef(0)
  const [selected, setSelected] = useState<HealthTopic | null>(null)
  const root = useRef<HTMLElement>(null)
  const reader = useRef<HTMLElement>(null)
  const input = useRef<HTMLInputElement>(null)
  const resultButtons = useRef(new Map<string, HTMLButtonElement>())
  const expansionFocus = useRef<string | null>(null)
  const returnFocus = useRef<string | null>(null)
  const term = normalizeHealthQuery(query)
  const active = Boolean(term || letter || browseAll)
  const matches = browseAll ? [...topics].sort((a, b) => a.name.localeCompare(b.name)).map((topic) => ({ topic, explanation: undefined })) : searchHealthTopics(topics, query, letter)
  const results = matches.slice(0, visibleCount)


  useLayoutEffect(() => {
    if (selected) {
      reader.current?.focus({ preventScroll: true })
      reader.current?.scrollIntoView({ block: 'start', behavior: 'instant' })
    } else if (returnFocus.current) {
      window.scrollTo({ top: sourceScroll.current, behavior: 'instant' })
      resultButtons.current.get(returnFocus.current)?.focus({ preventScroll: true })
      returnFocus.current = null
    }
  }, [selected])

  useEffect(() => {
    if (expansionFocus.current) {
      resultButtons.current.get(expansionFocus.current)?.focus({ preventScroll: true })
      expansionFocus.current = null
    }
  }, [visibleCount])

  function reset() {
    setQuery(''); setLetter(''); setSelected(null); setBrowseAll(false); setVisibleCount(resultBatchSize)
    input.current?.focus()
  }
  function showAll() {
    setQuery(''); setLetter(''); setSelected(null); setBrowseAll(true); setVisibleCount(resultBatchSize)
  }
  return <section aria-labelledby="health-library-title" className={`page-frame ${styles.root} ${standalone ? '' : styles.home}`} data-health-library data-motion-section={standalone ? undefined : "health"} id="health-library" ref={root}>
    <div className={styles.controls}>
      <div className={`${styles.opening} ${standalone ? styles.standalone : ''}`}>
        <div className={standalone ? styles.srOnly : styles.titleBlock}><h2 data-reveal={standalone ? undefined : "0"} data-motion="heading" className={styles.title} id="health-library-title">{title}</h2></div>
        <InterfaceCopy><form className={styles.searchForm} role="search" aria-label="Health and care topics" onSubmit={(event) => { event.preventDefault(); if (matchMedia('(max-width: 700px)').matches) input.current?.blur() }}>
          <label className={standalone ? undefined : styles.srOnly} htmlFor="health-topic-search">Search topics</label>
          <div className={styles.searchBox}>
            <svg aria-hidden="true" width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></svg>
            <input autoComplete="off" enterKeyHint="search" id="health-topic-search" maxLength={80} onChange={(event) => { setQuery(event.target.value); setLetter(''); setSelected(null); setBrowseAll(false); setVisibleCount(resultBatchSize) }} placeholder={standalone ? 'Try “back pain”' : 'Search health topics'} ref={input} type="search" value={query} />
            {standalone ? <button aria-label="Search health topics" type="submit"><Arrow /></button> : null}
          </div>
        </form></InterfaceCopy>
      </div>
      {standalone && !active ? <div className={styles.examples} aria-label="Suggested topics"><span>Try:</span>{topics.slice(0, 3).map((topic) => <button key={topic.id} type="button" onClick={() => { setQuery(topic.name); setLetter(''); setBrowseAll(false); setVisibleCount(resultBatchSize) }}>{topic.name}</button>)}</div> : null}
      {standalone ? <InterfaceCopy><div className={styles.browseHeading}><h3>Browse by first letter</h3><button aria-controls="health-topic-matches" aria-expanded={active} onClick={active ? reset : showAll} type="button">{active ? 'Clear results' : 'View all topics'}</button></div></InterfaceCopy> : null}
      <div aria-label="Find topics by first letter" className={styles.alphabet} role="group">
        {alphabet.map((value) => <button aria-controls="health-topic-matches" aria-label={`Topics beginning with ${value}`} aria-pressed={letter === value} disabled={!topics.some((topic) => topic.name.startsWith(value))} key={value} onClick={() => { setLetter(value); setQuery(''); setSelected(null); setBrowseAll(false); setVisibleCount(resultBatchSize) }} type="button">{value}</button>)}
      </div>
      {!standalone && active ? <button aria-controls="health-topic-matches" className={styles.homeClear} onClick={reset} type="button"><InterfaceText>Clear results</InterfaceText></button> : null}
    </div>
    {standalone && !active ? <p className={styles.prompt}>Dimmed letters have no topics.</p> : null}
    <p aria-atomic="true" aria-live="polite" className={styles.srOnly} role="status">{active ? `${matches.length} ${matches.length === 1 ? 'topic' : 'topics'}${letter ? ` beginning with ${letter}` : term ? ` for ${query.trim()}` : ' available'}. Showing ${results.length}.` : ''}</p>
    <div id="health-topic-matches">
    {active && !selected ? <div aria-labelledby="health-matches-title" className={styles.matches}>
      <div className={styles.matchesHeading}>{letter ? <span aria-hidden="true" className={styles.resultLetter}>{letter}</span> : null}<h3 id="health-matches-title">{letter ? `Topics beginning with ${letter}` : term ? 'Matching topics' : 'All topics'}</h3><p>{matches.length} {matches.length === 1 ? 'topic' : 'topics'}{term ? ` for “${query.trim()}”` : ''}</p></div>
      <div className={styles.results}>
        {results.map(({ topic, explanation }) => <button aria-controls="health-topic-reader" className={styles.topic} data-health-topic={topic.id} data-last-read={lastRead === topic.id || undefined} key={topic.id} onClick={() => { sourceScroll.current = window.scrollY; setLastRead(topic.id); setSelected(topic) }} ref={(element) => { if (element) resultButtons.current.set(topic.id, element); else resultButtons.current.delete(topic.id) }} type="button"><span><span><span className={styles.topicTitle}>{topic.name}</span>{lastRead === topic.id ? <small className={styles.lastRead}>Last opened</small> : null}{explanation ? <small className={styles.matchReason}>{explanation}</small> : null}</span><small>{topic.serviceName ?? routeLabels[topic.route]}</small></span><Arrow /></button>)}
        {!matches.length ? <div className={styles.empty}><h3>No matching topics</h3><p>Try another word, choose a letter, or <Link href="/appointment">ask for help choosing a service</Link>.</p><button onClick={showAll} type="button"><InterfaceText>View all topics</InterfaceText></button></div> : null}
      </div>
      {matches.length > resultBatchSize ? <div className={styles.pagination}><p>Showing {results.length} of {matches.length} topics</p><button disabled={results.length === matches.length} onClick={() => { expansionFocus.current = matches[visibleCount]?.topic.id ?? null; setVisibleCount((count) => count + resultBatchSize) }} type="button"><InterfaceText>{results.length === matches.length ? 'All topics shown' : 'Show more topics'}</InterfaceText></button></div> : null}
    </div> : null}
    {selected ? <section aria-labelledby="health-selected-title" className={styles.reader} id="health-topic-reader" ref={reader} tabIndex={-1}>
      <button className={styles.back} onClick={() => { returnFocus.current = selected.id; setSelected(null) }} type="button"><InterfaceText>← Back to matches</InterfaceText></button>
      <h3 className={styles.readerTitle} id="health-selected-title">{selected.name}</h3>
      <p className={styles.summary}>{selected.summary}</p>
      <div className={styles.care}>
        <h4><Arrow /> Your next step</h4>
        <p>{selected.nextStep}</p>
        <Link className={styles.primary} href={selected.appointmentHref ?? '/appointment'}>{selected.route === 'appointment' ? 'Request an appointment' : 'Request appointment guidance'} <Arrow /></Link>
        {selected.route === 'appointment' ? <div className={styles.secondary}><span>Unsure where to start?</span><Link href="/appointment">Request appointment guidance <Arrow /></Link></div> : null}
      </div>
      <Link className={styles.readMore} href={`/health-topics/${selected.id}`}>Prepare for a conversation about {selected.name.toLowerCase()} <Arrow /></Link>
      <p className={styles.readerNote}>These guides help you prepare questions; they cannot diagnose a condition.</p>
    </section> : null}
    </div>
    <noscript><p className={styles.fallback}>You can <Link href="/services">explore hospital services</Link>, <Link href="/appointment">request an appointment</Link> or <Link href="/#home-call">find contact information</Link>.</p></noscript>

  </section>
}
