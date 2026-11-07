'use client'

import { useEffect, useRef, useState, useSyncExternalStore, type FormEvent } from 'react'
import styles from './patient-page.module.css'

const categories = ['Compliment', 'Suggestion', 'Concern or complaint'] as const
const subscribe = () => () => {}
const clientReady = () => true
const serverReady = () => false

export function FeedbackComposer() {
  const [category, setCategory] = useState<string>(categories[0])
  const [message, setMessage] = useState('')
  const [reviewing, setReviewing] = useState(false)
  const ready = useSyncExternalStore(subscribe, clientReady, serverReady)
  const review = useRef<HTMLDivElement>(null)
  const messageInput = useRef<HTMLTextAreaElement>(null)
  const restoreMessageFocus = useRef(false)
  useEffect(() => {
    if (reviewing) review.current?.focus()
    else if (restoreMessageFocus.current) {
      messageInput.current?.focus()
      restoreMessageFocus.current = false
    }
  }, [reviewing])
  function showReview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!message.trim()) {
      messageInput.current?.setCustomValidity('Write a sample message before reviewing.')
      messageInput.current?.reportValidity()
      return
    }
    setReviewing(true)
  }
  return <>
    <p id="feedback-privacy">Use a sample message without names, contact details, patient numbers, or medical information. It stays in this page’s memory; clear it with “Clear & start again” or reload.</p>
    <noscript><p>The feedback preview needs JavaScript. Sending feedback is unavailable here. Read the contact and handling information below for what still needs confirmation.</p></noscript>
    <form className={styles.form} onSubmit={showReview} aria-describedby="feedback-privacy" autoComplete="off" hidden={reviewing}>
      <div className={styles.field}><label htmlFor="feedback-category">What would you like to share?</label>
        <select id="feedback-category" disabled={!ready} value={category} onChange={(event) => setCategory(event.target.value)}>{categories.map((item) => <option key={item}>{item}</option>)}</select>
      </div>
      <div className={styles.field}><label htmlFor="feedback-message">Your sample message</label>
        <p id="feedback-message-hint">What went well, or what would you like to be different? Up to 2,000 characters.</p>
        <textarea ref={messageInput} id="feedback-message" disabled={!ready} aria-describedby="feedback-message-hint" value={message} required maxLength={2000} onChange={(event) => { event.target.setCustomValidity(''); setMessage(event.target.value) }} />
      </div>
      <button type="submit" disabled={!ready} className="solid-button blue-button">Review sample feedback</button>
    </form>
    {reviewing ? <div className={styles.review} ref={review} tabIndex={-1} aria-labelledby="feedback-review-title">
      <h3 id="feedback-review-title">Review your sample</h3><p><strong>{category}</strong></p><blockquote>{message}</blockquote>
      <p role="status">Nothing has been sent. Feedback submission is unavailable in this preview.</p>
      <div className={styles.reviewActions}>
        <button className="solid-button blue-button" type="button" onClick={() => { restoreMessageFocus.current = true; setReviewing(false) }}>Edit message</button>
        <button type="button" disabled>Sending unavailable</button>
        <button className="text-link" type="button" onClick={() => { restoreMessageFocus.current = true; setMessage(''); setCategory(categories[0]); setReviewing(false) }}>Clear & start again</button>
      </div>
    </div> : null}
  </>
}
