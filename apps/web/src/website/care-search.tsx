'use client'

import { InterfaceText, InterfaceCopy, InterfaceLink as Link } from '@/website/interface-language'

import { useState } from 'react'

/** Native GET remains usable before hydration; the entered query survives changing directories. */
export function CareSearch() {
  const [mode, setMode] = useState('doctors')
  const [query, setQuery] = useState('')
  const doctor = mode === 'doctors'
  return <InterfaceCopy><div className="care-search-panel" data-ui>
    <form action={`/${mode}`} method="get" role="search" aria-label="Find care">
      <fieldset className="care-search-mode"><legend><InterfaceText>Find care</InterfaceText></legend>
        <div className="care-mode-options">{['doctors', 'services'].map((value) => <label key={value}><input className="care-mode-select" type="radio" name="care-mode" value={value} checked={mode === value} onChange={() => setMode(value)} />{value === 'doctors' ? 'Doctors' : 'Services'}</label>)}</div>
      </fieldset>
      <div className="care-query">
        <label htmlFor="care-query">{doctor ? 'Doctor name, specialty or condition' : 'Specialty, service or area of care'}</label>
        <div className="care-query-field"><input id="care-query" name="q" type="search" maxLength={doctor ? 80 : 100} enterKeyHint="search" placeholder={doctor ? 'Search doctors' : 'Search services'} value={query} onChange={(event) => setQuery(event.target.value)} /><button type="submit"><InterfaceText>Search</InterfaceText> <span aria-hidden="true">→</span></button></div>
      </div>
    </form>
    <div className="care-search-links"><Link href={`/${mode}`}>{doctor ? 'View all doctors' : 'View specialties & services'} <span aria-hidden="true">→</span></Link><button type="button" data-care-guide onClick={() => document.querySelector<HTMLButtonElement>('[data-open-patient-guide]')?.click()}><InterfaceText>Ask the Patient Guide</InterfaceText> <span aria-hidden="true">+</span></button></div>
    <noscript><style>{`.care-search-mode, [data-care-guide] { display: none !important; }`}</style><form action="/services" method="get" aria-label="Service directory"><label htmlFor="care-service-fallback"><InterfaceText>Find a service</InterfaceText></label><div className="care-query-field"><input id="care-service-fallback" name="q" type="search" maxLength={100} /><button type="submit"><InterfaceText>Search services</InterfaceText></button></div></form><p><Link href="/services">Explore care options</Link>.</p></noscript>
  </div></InterfaceCopy>
}
