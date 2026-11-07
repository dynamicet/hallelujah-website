'use client'

import Link from 'next/link'
import { useState } from 'react'

type SpecialtyPresentation = Readonly<{
  id: 'general' | 'heart' | 'recovery'
  label: string
  summary: string
  action: string
  href: string
}>

const careHighlights: readonly SpecialtyPresentation[] = [
  {
    id: 'general', label: 'General medicine',
    summary: 'A starting point for everyday health concerns.',
    action: 'Find general medicine services', href: '/services?q=General%20medicine',
  },
  {
    id: 'heart', label: 'Heart care',
    summary: 'Information for your next heart-care conversation.',
    action: 'Find heart medicine services', href: '/services?q=Heart%20medicine',
  },
  {
    id: 'recovery', label: 'Recovery',
    summary: 'Explore support for your recovery goals.',
    action: 'Find rehabilitation services', href: '/services?q=Rehabilitation%20care',
  },
]

export function CareSpotlight() {
  const [selected, setSelected] = useState(0)
  const care = careHighlights[selected]

  return <div className="care-spotlight" data-ui>
    <div className="care-spotlight-feature" data-reveal="0">
      <div className="specialty-images">{careHighlights.map((item, index) => <picture key={item.id} data-selected={index === selected}><source type="image/avif" srcSet={`/editorial/specialty-${item.id}-640.avif 640w, /editorial/specialty-${item.id}-1100.avif 1100w`} sizes="(min-width: 900px) 55vw, 100vw" /><img src={`/editorial/specialty-${item.id}-1100.webp`} srcSet={`/editorial/specialty-${item.id}-640.webp 640w, /editorial/specialty-${item.id}-1100.webp 1100w`} sizes="(min-width: 900px) 55vw, 100vw" alt={index === selected ? `${item.label} conversation` : ''} width="1100" height="825" loading="lazy" /></picture>)}</div>
    </div>
    <div className="care-spotlight-navigation">
      <div aria-label="Selected areas of care" className="care-spotlight-options" role="group">
        {careHighlights.map((item, index) => <button
          aria-controls="care-spotlight-result"
          aria-pressed={index === selected}
          className="care-spotlight-choice"
          key={item.id}
          onClick={() => setSelected(index)}
          type="button"
        >
          <span className="care-spotlight-label">{item.label}</span>

          <span aria-hidden="true" className="care-spotlight-arrow">{index === selected ? '−' : '+'}</span>
        </button>)}
      </div>
      <div aria-live="polite" aria-atomic="true" className="care-spotlight-copy" id="care-spotlight-result"><div className="care-spotlight-answer" key={care.id}><p>{care.summary}</p><Link className="text-link" href={care.href}>{care.action}<span aria-hidden="true">→</span></Link></div></div>
      <Link className="text-link care-spotlight-all" href="/services">View all services<span aria-hidden="true">→</span></Link>
    </div>
    <noscript><ul>{careHighlights.map((item) => <li key={item.id}><a href={item.href}>{item.action}</a></li>)}</ul></noscript>
  </div>
}

// Personal-care storytelling now gives visitors usable consultation prompts.
// These are questions to ask, not claims about facilities or available support.
export function ConsultationConversation() {
  return <section aria-labelledby="consultation-title" className="consultation-conversation" id="about-hallelujah">
    <div className="page-frame consultation-layout">
      <figure className="consultation-image" data-reveal="0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt="Mother and child talking with a clinician" height="1280" loading="lazy" src="/editorial/family-care.webp" width="1024" />
      </figure>
      <div className="consultation-copy" data-reveal="1">
        <h2 id="consultation-title">Your consultation.</h2>
        <p>Your questions and preferences belong in the conversation. These prompts can help you explain what matters to you.</p>
        <div className="consultation-prompts">
          <div><h3>What matters to you?</h3><p>Describe how your concern affects daily life and what you hope to discuss. Say if something is difficult to explain.</p></div>
          <div><h3>What happens next?</h3><p>Ask for an explanation of anything unclear, what the next step involves, and who to contact with questions afterwards.</p></div>
        </div>
      </div>
    </div>
  </section>
}
