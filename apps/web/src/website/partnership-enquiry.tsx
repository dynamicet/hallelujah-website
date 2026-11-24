'use client'

import { useEffect, useRef, useState, useSyncExternalStore, type FormEvent } from 'react'
import { hospitalContact } from './hospital-contact'
import styles from './partnerships.module.css'

const subscribe = () => () => {}
const clientReady = () => true
const serverReady = () => false

export function PartnershipEnquiry() {
  const ready = useSyncExternalStore(subscribe, clientReady, serverReady)
  const [replyMethod, setReplyMethod] = useState<'email' | 'phone'>('email')
  const [draft, setDraft] = useState('')
  const [copyStatus, setCopyStatus] = useState('')
  const reviewHeading = useRef<HTMLHeadingElement>(null)
  const nameInput = useRef<HTMLInputElement>(null)
  const draftText = useRef<HTMLTextAreaElement>(null)
  const editingAgain = useRef(false)

  useEffect(() => {
    if (draft) reviewHeading.current?.focus()
    else if (editingAgain.current) nameInput.current?.focus()
  }, [draft])

  function review(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const organization = String(data.get('organization') ?? '').trim()
    setCopyStatus('')
    setDraft([
      String(data.get('interest')),
      String(data.get('message')).trim(),
      [data.get('name'), organization].filter(Boolean).join(', '),
      String(data.get(replyMethod)),
    ].join('\n\n'))
  }

  async function copyDraft() {
    try {
      await navigator.clipboard.writeText(draft)
      setCopyStatus('Enquiry copied.')
    } catch {
      draftText.current?.focus()
      draftText.current?.select()
      setCopyStatus('Use your device’s Copy command to copy the selected text.')
    }
  }

  return <section className={styles.enquiry} aria-labelledby="partnership-enquiry-title">
    <h2 id="partnership-enquiry-title">Talk to us about your idea</h2>
    <p><a className="text-link" href={hospitalContact.phoneHref}>Call reception about collaboration · {hospitalContact.phone}</a></p>
    <p id="partnership-draft-note">Online submission is unavailable. You can prepare an enquiry here and copy it for your conversation with reception.</p>
    <noscript><p>Enable JavaScript to prepare a draft.</p></noscript>
    <form hidden={Boolean(draft)} onSubmit={review} method="post" aria-describedby="partnership-draft-note">
      <fieldset className={styles.fields} disabled={!ready}>
        <label>Full name<input ref={nameInput} name="name" required maxLength={100} autoComplete="off" /></label>
        <label>Organization (optional)<input name="organization" maxLength={120} autoComplete="off" /></label>
        <label>What would you like to work on?
          <select name="interest" required defaultValue="">
            <option value="" disabled>Choose an area</option>
            <option>Organizational partnership</option>
            <option>Community outreach</option>
            <option>Education and training</option>
            <option>Something else</option>
          </select>
        </label>
        <fieldset className={styles.reply}>
          <legend>Preferred contact method</legend>
          <label><input type="radio" name="replyMethod" value="email" checked={replyMethod === 'email'} onChange={() => setReplyMethod('email')} /> Email</label>
          <label><input type="radio" name="replyMethod" value="phone" checked={replyMethod === 'phone'} onChange={() => setReplyMethod('phone')} /> Phone</label>
        </fieldset>
        <label hidden={replyMethod !== 'email'}>Email address
          <input name="email" type="email" maxLength={254} autoComplete="off" disabled={replyMethod !== 'email'} required={replyMethod === 'email'} />
        </label>
        <label hidden={replyMethod !== 'phone'}>Phone number
          <input name="phone" type="tel" maxLength={30} autoComplete="off" disabled={replyMethod !== 'phone'} required={replyMethod === 'phone'} pattern={String.raw`[+]?(?:[ \(\).\-]*[0-9]){7,15}[ \(\).\-]*`} title="Enter 7 to 15 digits. Spaces, parentheses, and hyphens are allowed." />
        </label>
        <label>Tell us about your idea
          <textarea name="message" required rows={4} maxLength={1500} aria-describedby="partnership-message-hint" />
        </label>
        <p id="partnership-message-hint" className={styles.hint}>Please leave out patient information.</p>
        <button className="solid-button" type="submit">Review enquiry <span aria-hidden="true">→</span></button>
      </fieldset>
    </form>
    {draft && <div className={styles.review}>
      <h3 ref={reviewHeading} tabIndex={-1}>Review your enquiry</h3>
      <textarea aria-label="Enquiry draft" ref={draftText} readOnly value={draft} rows={8} />
      <div className={styles.reviewActions}>
        <button className="solid-button" type="button" onClick={copyDraft}>Copy enquiry</button>
        <button className={styles.edit} type="button" onClick={() => {
          editingAgain.current = true
          setDraft('')
        }}>Edit enquiry</button>
      </div>
      <p role="status" className={styles.status}>{copyStatus}</p>
    </div>}
  </section>
}
