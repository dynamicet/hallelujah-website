'use client'

import { InterfaceLink as Link } from '@/website/interface-language'
import { useState } from 'react'

const choices = [
  { id: 'unsure', label: 'I’m unsure where to start', heading: 'Help choosing care.', description: 'You can begin an appointment request without choosing a doctor or service. Choose “Help me choose”. A request is not a confirmed appointment.', action: 'Request an appointment', href: '/appointment' },
  { id: 'doctor', label: 'I know the doctor', heading: 'Find their profile.', description: 'Use the doctor directory to search by name and check specialties and languages before choosing a clinician.', action: 'Find a doctor', href: '/doctors' },
  { id: 'service', label: 'I know the service', heading: 'Check its scope.', description: 'Use the service directory to read what an area of care covers and what to ask before requesting an appointment.', action: 'View all services', href: '/services' },
] as const

export function CareNavigator() {
  const [selected, setSelected] = useState<string>('unsure')
  const choice = choices.find((item) => item.id === selected) ?? choices[0]
  return <div className="care-navigator" data-ui>
    <div aria-label="What do you already know?" className="navigator-choices" role="group">
      {choices.map((item) => <button aria-pressed={selected === item.id} aria-controls="care-navigator-result" className="navigator-choice" key={item.id} onClick={() => setSelected(item.id)} type="button">{item.label}</button>)}
    </div>
    <div className="navigator-result" id="care-navigator-result" aria-atomic="true" aria-live="polite">
      <h3>{choice.heading}</h3><p>{choice.description}</p><Link className="text-link" href={choice.href}>{choice.action}<span aria-hidden="true">→</span></Link>
    </div>
    <noscript><p className="navigator-fallback">Know the doctor? <Link href="/doctors">Find their profile</Link>. Know the service? <Link href="/services">Check its scope</Link>.</p></noscript>
  </div>
}
