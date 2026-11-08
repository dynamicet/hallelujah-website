'use client'

import { InterfaceCopy, InterfaceLink as Link } from '@/website/interface-language'
import { useEffect, useId, useRef, useState, type RefObject, type ReactNode, type FormEvent } from 'react'
import { answerGuide, maxGuideQuestionLength } from '@/patient-guide/engine'
import { guideTopics } from '@/patient-guide/content'
import type { GuideAction, GuideCatalog, GuideContext, GuideReply } from '@/patient-guide/types'
import styles from './patient-guide.module.css'

interface Turn { readonly id: number; readonly question: string; readonly reply: GuideReply }

function Icon({ children }: { readonly children: ReactNode }) {
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{children}</svg>
}

const topicIcons = [
  <><circle key="head" cx="12" cy="7" r="3" /><path key="body" d="M5 21v-3a7 7 0 0 1 14 0v3M9 17h6m-3-3v6" /></>,
  <><rect key="box" x="4" y="5" width="16" height="16" rx="2" /><path key="cross" d="M9 5V3h6v2m-3 5v6m-3-3h6" /></>,
  <><path key="bag" d="M5 8h14v13H5zM9 8V4h6v4m-6 5h6m-6 4h4" /></>,
  <><path key="pin" d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" /><circle key="center" cx="12" cy="10" r="2.5" /></>,
]

const startingTopics = [guideTopics[0], guideTopics[1], guideTopics[3], guideTopics[5]]

export function PatientGuide({ catalog, dialogRef, onClose, openOnMount = false }: {
  readonly openOnMount?: boolean
  readonly catalog: GuideCatalog
  readonly dialogRef: RefObject<HTMLDialogElement | null>
  readonly onClose: () => void
}) {
  const titleId = useId()
  const inputId = useId()
  const hintId = useId()
  const [question, setQuestion] = useState('')
  const [turns, setTurns] = useState<readonly Turn[]>([])
  const [announcement, setAnnouncement] = useState('')
  const input = useRef<HTMLInputElement>(null)
  const transcript = useRef<HTMLDivElement>(null)
  const nextId = useRef(0)
  const context = useRef<GuideContext>({})
  const latest = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (openOnMount && !dialogRef.current?.open) dialogRef.current?.showModal()
  }, [dialogRef, openOnMount])

  useEffect(() => {
    if (turns.length && latest.current && transcript.current) {
      if (getComputedStyle(transcript.current).overflowY === 'visible') {
        latest.current.scrollIntoView({ block: 'start' })
      } else {
        transcript.current.scrollTop += latest.current.getBoundingClientRect().top - transcript.current.getBoundingClientRect().top - 16
      }
    }
  }, [turns])

  function ask(value: string, selectedContext?: GuideContext) {
    const clean = value.trim().slice(0, maxGuideQuestionLength)
    if (!clean) return
    const reply = answerGuide(clean, catalog, selectedContext ?? context.current)
    context.current = reply.context ?? {}
    const id = nextId.current++
    setTurns((previous) => [...previous.slice(-19), { id, question: clean, reply }])
    setQuestion('')
    setAnnouncement(`Reply ${id + 1}. ${reply.text}${reply.cards?.map((card) => ` ${card.title}. ${card.description}`).join('') ?? ''}`)
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    ask(question)
    input.current?.focus()
  }

  function reset() {
    setTurns([])
    context.current = {}
    setQuestion('')
    setAnnouncement('Conversation cleared. Choose a topic to start again.')
    if (transcript.current) transcript.current.scrollTop = 0
    input.current?.focus()
  }

  function action(item: GuideAction, index: number) {
    return item.href
      ? <Link className={styles.answerLink} href={item.href} key={`${item.label}-${index}`} onClick={() => dialogRef.current?.close()}>{item.label}<span aria-hidden="true">→</span></Link>
      : <button className={styles.suggestion} key={`${item.label}-${index}`} onClick={() => { if (item.query) ask(item.query, item.context) }} type="button">{item.label}<span aria-hidden="true">›</span></button>
  }

  return (
    <InterfaceCopy><dialog aria-labelledby={titleId} className={styles.dialog} data-patient-guide ref={dialogRef} onClose={onClose}>
      <div className={styles.frame} data-ui>
        <header className={styles.header}>
          <div className={styles.identity}>
            <span className={styles.mark} aria-hidden="true"><Icon><path d="M10 3h4v7h7v4h-7v7h-4v-7H3v-4h7Z" /></Icon></span>
            <div><h2 id={titleId}>Hallelujah Patient Guide</h2><p>Prepared answers · Website help</p></div>
          </div>
          <button aria-label="Close patient guide" className={styles.iconButton} onClick={() => dialogRef.current?.close()} type="button"><Icon><path d="m6 6 12 12M18 6 6 18" /></Icon></button>
        </header>
        <div className={styles.sheet}>
          <div className={styles.toolbar}>
            <span>{catalog.preview ? 'Preview · Sample information' : 'Hospital information'}</span>
            <button disabled={!turns.length && !question} onClick={reset} type="button">Start over <Icon><path d="M3 10a9 9 0 1 1 2 8M3 4v6h6" /></Icon></button>
          </div>
          <div aria-label="Conversation" className={styles.transcript} data-guide-transcript ref={transcript} role="region" tabIndex={0}>
            <div className={styles.welcome}>
              <p className={styles.greeting}>How can we help?</p>
              <p>Choose a topic or ask a short question about the hospital.</p>
              <div aria-label="Choose a topic" className={styles.topics}>
                {startingTopics.map((topic, index) => <button key={topic.label} onClick={() => ask(topic.query)} type="button"><Icon>{topicIcons[index]}</Icon><span>{topic.label}</span></button>)}
              </div>
              <p className={styles.try}>Try “visiting hours” or a doctor’s name.</p>
            </div>
            {turns.map((turn, index) => (
              <div data-interface-content lang="en" className={styles.turn} data-guide-turn key={turn.id} ref={index === turns.length - 1 ? latest : undefined}>
                <div className={styles.question}><span className={styles.srOnly}>You: </span>{turn.question}</div>
                <div className={styles.reply} data-guide-reply data-kind={turn.reply.kind}>
                  <span className={styles.speaker}>Patient Guide</span>
                  <p>{turn.reply.text}</p>
                  {turn.reply.cards?.length ? <ul className={styles.cards}>{turn.reply.cards.map((card) => <li key={card.id}><strong>{card.title}</strong><p>{card.description}</p><div className={styles.cardActions}>{card.actions.map(action)}</div></li>)}</ul> : null}
                  {turn.reply.actions?.length ? <div aria-label="Suggested next steps" className={styles.nextSteps}>{turn.reply.actions.map(action)}</div> : null}
                </div>
              </div>
            ))}
          </div>
          <div aria-live="polite" aria-atomic="true" className={styles.srOnly} role="status">{announcement}</div>
          <form className={styles.composer} onSubmit={submit}>
            <label htmlFor={inputId}>Ask the Patient Guide</label>
            <div className={styles.inputRow}>
              <input aria-describedby={hintId} autoComplete="off" data-guide-input enterKeyHint="send" id={inputId} maxLength={maxGuideQuestionLength} onChange={(event) => setQuestion(event.target.value)} placeholder="What would you like to find?" ref={input} type="text" value={question} />
              <button aria-label="Send question" disabled={!question.trim()} type="submit"><Icon><path d="M12 19V5m-6 6 6-6 6 6" /></Icon></button>
            </div>
            <p id={hintId}>Please leave out personal and medical details.</p>
          </form>
        </div>
        <footer className={styles.footer}><span>Website guidance · No medical advice</span><Link href="/emergency" onClick={() => dialogRef.current?.close()}>Emergency help →</Link></footer>
      </div>
    </dialog></InterfaceCopy>
  )
}
