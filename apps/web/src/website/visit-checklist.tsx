'use client'

import { InterfaceText } from '@/website/interface-language'

import { useState, useSyncExternalStore } from 'react'
import styles from './patient-page.module.css'

const preparationSteps = [
  'Confirm the appointment, department and arrival time.',
  'Confirm the address, entrance and where to check in.',
  'Ask which identification and referral documents to bring.',
  'Gather relevant earlier results and a list of medicines.',
  'Write down your questions and what matters most to you.',
  'Ask about a companion, language support or step-free access if needed.',
  'Confirm any preparation instructions with the care team.',
]

const subscribe = () => () => {}
const clientSnapshot = () => true
const serverSnapshot = () => false

export function PrintButton({ label = 'Print your checklist' }: { label?: string }) {
  return <><button className={styles.printButton} onClick={() => window.print()} type="button"><InterfaceText>{label}</InterfaceText></button><noscript><p>Use your browser’s Print command to keep a copy.</p></noscript></>
}

export function VisitChecklist() {
  const hydrated = useSyncExternalStore(subscribe, clientSnapshot, serverSnapshot)
  const [checked, setChecked] = useState<Set<number>>(() => new Set())
  const complete = checked.size === preparationSteps.length

  return <div className={styles.checklist}>
    <p>Check off each item as you prepare. Print a copy to keep.</p>
    {hydrated ? <div className={styles.checklistProgress} data-complete={complete}>
      <p role="status" aria-live="polite" aria-atomic="true">
        <strong>{checked.size} of {preparationSteps.length} preparation steps checked</strong>
        <span>{complete ? 'Checklist complete. Keep a copy for your visit.' : 'Take it one step at a time, in any order.'}</span>
      </p>
      <div className={styles.checklistSteps} aria-hidden="true">
        {preparationSteps.map((item, index) => <span key={item} data-checked={index < checked.size} />)}
      </div>
    </div> : null}
    <fieldset><legend>Before you set off</legend>{preparationSteps.map((item, index) => <label key={item} htmlFor={`visit-check-${index}`}>
      <input id={`visit-check-${index}`} type="checkbox" onChange={event => {
        const isChecked = event.currentTarget.checked
        setChecked(previous => {
          const next = new Set(previous)
          if (isChecked) next.add(index)
          else next.delete(index)
          return next
        })
      }} /><span>{item}</span>
    </label>)}</fieldset>
    <PrintButton />
  </div>
}
