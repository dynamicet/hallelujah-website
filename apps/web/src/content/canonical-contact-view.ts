import { createElement } from 'react'
import { validateGovernedRecord, type GovernedLocale } from './governed-record.ts'
import { factTarget, siteFactKeys, siteSettingsReadiness } from './site-settings.ts'

export type ContactView = Readonly<{
  state: 'unavailable' | 'controlled-fixture'
  facts: readonly Readonly<{ key: string; label: string; value: string; target: string | null }>[]
}>

/** Public consumption stays withheld while SAFE-01/SAFE-03 are unresolved. */
export function canonicalContactView(
  input: unknown, locale: GovernedLocale, now: Date, mode?: 'controlled-fixture',
): ContactView {
  const unavailable: ContactView = { state: 'unavailable', facts: [] }
  const result = validateGovernedRecord(input)
  if (!result.ok || !['en', 'am'].includes(locale) || mode !== 'controlled-fixture'
    || !result.record.synthetic || result.record.kind !== 'site-settings'
    || ['expired', 'withdrawn'].includes(result.record.status) || !result.record.siteSettings
    || siteSettingsReadiness(result.record.siteSettings, now).length) return unavailable
  const settings = result.record.siteSettings
  return {
    state: 'controlled-fixture',
    facts: siteFactKeys.flatMap((key) => {
      const fact = settings[key]
      const text = fact.label[locale]
      return text && fact.value ? [{ key, label: text, value: fact.value,
        target: factTarget(key, fact.value) }] : []
    }),
  }
}

/** Server-rendered text specimen; no calls, email, directions, script or HTTP route. */
export function CanonicalContactDetails(props: Readonly<{
  record: unknown; locale: GovernedLocale; now: Date; mode?: 'controlled-fixture'
}>) {
  const view = canonicalContactView(props.record, props.locale, props.now, props.mode)
  if (view.state === 'unavailable') return createElement('p', { lang: 'en', 'data-contact-state': 'unavailable' },
    'Contact details are withheld pending verification.')
  return createElement('section', { lang: props.locale, 'data-contact-state': view.state },
    createElement('p', { lang: 'en' }, 'Synthetic contact fixture — not hospital contact or arrival information.'),
    props.locale === 'am' ? createElement('p', { lang: 'en' }, 'Unreviewed Amharic shaping fixture.') : null,
    createElement('dl', null, ...view.facts.map((fact) => createElement('div', { key: fact.key,
      'data-contact-fact': fact.key }, createElement('dt', null, fact.label),
    createElement('dd', { lang: 'en' }, fact.value)))))
}
