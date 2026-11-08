'use client'

import { InterfaceText, InterfaceCopy, InterfaceLink as Link } from '@/website/interface-language'

import { useState } from 'react'
import styles from './patient-page.module.css'

export function AppointmentVisitType() {
  const [visit, setVisit] = useState('first')
  return <InterfaceCopy><div className={styles.visitType}>
    <fieldset><legend><InterfaceText>First visit or follow-up?</InterfaceText></legend>
      <label><input checked={visit === 'first'} name="visit_type" onChange={() => setVisit('first')} type="radio" value="first" /><span><InterfaceText>First visit</InterfaceText></span></label>
      <label><input checked={visit === 'follow-up'} name="visit_type" onChange={() => setVisit('follow-up')} type="radio" value="follow-up" /><span><InterfaceText>Follow-up visit</InterfaceText></span></label>
    </fieldset>
    <p aria-live="polite">{visit === 'first' ? '' : 'Choose your previous doctor or service if listed.'}</p>
    <p><Link href="/referrals">Referring a patient?</Link></p>
  </div></InterfaceCopy>
}
