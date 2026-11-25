'use client'

import { useEffect, useRef, useState } from 'react'
import type { CarePreference } from './appointment-request-form'
import styles from './appointment-request.module.css'

type Props = {
  doctors: readonly CarePreference[]
  services: readonly CarePreference[]
  value?: CarePreference
  error?: string
  onChange: (value?: CarePreference) => void
}

export function CarePreferencePicker({ doctors, services, value, error, onChange }: Props) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(-1)
  const container = useRef<HTMLDivElement>(null)
  const matches = (option: CarePreference) => option.label.toLowerCase().includes(query.trim().toLowerCase())
  const groups = [
    { label: 'Doctors', items: doctors.filter(matches) },
    { label: 'Services', items: services.filter(matches) },
  ]
  const choices: (CarePreference | undefined)[] = query.trim() ? [] : [undefined]
  for (const group of groups) choices.push(...group.items)
  const optionId = (item?: CarePreference) => 'preference-option-' + (item?.id ?? 'none')

  function close() {
    setOpen(false)
    setQuery('')
    setActive(-1)
  }

  function choose(item?: CarePreference) {
    onChange(item)
    close()
  }

  useEffect(() => {
    if (!open) return
    function outside(event: PointerEvent) {
      if (!container.current?.contains(event.target as Node)) close()
    }
    document.addEventListener('pointerdown', outside)
    return () => document.removeEventListener('pointerdown', outside)
  }, [open])

  useEffect(() => {
    if (open && active >= 0) container.current?.querySelector('[data-active="true"]')?.scrollIntoView({ block: 'nearest' })
  }, [active, open])

  function option(item?: CarePreference) {
    const id = optionId(item)
    return <div key={id} id={id} role="option" aria-selected={value?.id === item?.id}
      data-active={active >= 0 && choices[active] === item} className={styles.pickerOption}
      onMouseDown={event => event.preventDefault()} onClick={() => choose(item)}>
      {item?.label ?? 'No preference'}
    </div>
  }

  return <div ref={container} className={styles.picker}>
    <label htmlFor="care-preference">Preferred doctor or service <small>(optional)</small></label>
    <div className={styles.pickerControl}>
      <input id="care-preference" role="combobox" autoComplete="off" aria-autocomplete="list"
        aria-expanded={open} aria-controls="care-options" aria-invalid={Boolean(error) || undefined}
        aria-describedby={error ? 'care-preference-error' : undefined}
        aria-activedescendant={open && active >= 0 ? optionId(choices[active]) : undefined}
        placeholder={open ? 'Search by name' : 'No preference'} value={open ? query : value?.label ?? ''}
        onFocus={event => event.target.select()} onBlur={close} onClick={() => setOpen(true)}
        onChange={event => { setQuery(event.target.value); setActive(-1); setOpen(true) }}
        onKeyDown={event => {
          if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault()
            setOpen(true)
            if (!choices.length) return
            const next = event.key === 'ArrowDown' ? active + 1 : active - 1
            setActive(next < 0 ? choices.length - 1 : next % choices.length)
          } else if (event.key === 'Enter') {
            event.preventDefault()
            if (!open) setOpen(true)
            else if (active >= 0) choose(choices[active])
            else if (choices.length === 1) choose(choices[0])
          } else if (event.key === 'Escape' && open) {
            event.preventDefault()
            close()
          }
        }} />
      <span aria-hidden="true" className={styles.chevron}>⌄</span>
    </div>
    <div id="care-options" role="listbox" aria-label="Care preferences" hidden={!open} className={styles.pickerList}>
      {!query.trim() && option()}
      {groups.map(group => group.items.length > 0 && <div key={group.label} role="group" aria-label={group.label}>
        <strong aria-hidden="true">{group.label}</strong>
        {group.items.map(option)}
      </div>)}
    </div>
    {open && !choices.length && <small role="status">No matches. Try another name.</small>}
  </div>
}
