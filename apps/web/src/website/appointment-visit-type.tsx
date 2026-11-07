'use client'

import { useState } from 'react'
import Link from 'next/link'
import styles from './patient-page.module.css'

export function AppointmentVisitType() {
  const [visit, setVisit] = useState('first')
  return <div className={styles.visitType}>
    <fieldset><legend>First visit or follow-up?</legend>
      <label><input checked={visit === 'first'} name="visit_type" onChange={() => setVisit('first')} type="radio" value="first" /><span>First visit</span></label>
      <label><input checked={visit === 'follow-up'} name="visit_type" onChange={() => setVisit('follow-up')} type="radio" value="follow-up" /><span>Follow-up visit</span></label>
    </fieldset>
    <p aria-live="polite">{visit === 'first' ? '' : 'Choose your previous doctor or service if listed.'}</p>
    <p><Link href="/referrals">Referring a patient?</Link></p>
  </div>
}
