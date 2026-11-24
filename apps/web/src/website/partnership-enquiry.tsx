'use client'

import { useState, useSyncExternalStore, type FormEvent } from 'react'
import styles from './partnerships.module.css'

const subscribe = () => () => {}
const clientReady = () => true
const serverReady = () => false

export function PartnershipEnquiry() {
  const ready = useSyncExternalStore(subscribe, clientReady, serverReady)
  const [replyMethod, setReplyMethod] = useState<'email' | 'phone'>('email')
  const [checked, setChecked] = useState(false)

  function preview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setChecked(true)
  }

  return <section className={styles.enquiry} aria-labelledby="partnership-enquiry-title">
    <h2 id="partnership-enquiry-title">Tell us how you’d like to work with us</h2>
    <p id="partnership-preview">Try the form using sample details. This preview does not send or save enquiries.</p>
    <noscript><p>Enable JavaScript to try the form preview.</p></noscript>
    <form onSubmit={preview} method="post" onChange={() => setChecked(false)} aria-describedby="partnership-preview">
      <fieldset className={styles.fields} disabled={!ready}>
        <label>Full name<input name="name" required maxLength={100} autoComplete="off" /></label>
        <label>Organization<input name="organization" required maxLength={120} autoComplete="off" /></label>
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
          <legend>How should we reply?</legend>
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
        <button className="solid-button" type="submit">Check sample enquiry <span aria-hidden="true">→</span></button>
      </fieldset>
      <p role="status" className={styles.status}>{checked ? 'Sample details checked. No enquiry was sent or saved.' : ''}</p>
    </form>
  </section>
}
