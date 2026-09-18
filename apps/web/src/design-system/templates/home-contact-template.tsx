import { homeContactView } from '../../content/home-contact-view'
import type { WorkflowDocument } from '../../content/cms-workflow'
import type { GovernedLocale } from '../../content/governed-record'
import type { ContactView } from '../../content/canonical-contact-view'
import { HomeTemplate, type HomeTemplateProps } from './home-template'

import styles from './home-contact-template.module.css'

export interface HomeContactTemplateProps extends Omit<HomeTemplateProps, 'contactDetails'> {
  readonly documents: readonly WorkflowDocument[]
  readonly locale: GovernedLocale
  readonly now: Date
  readonly mode?: 'controlled-fixture'
}

const groups = [
  { id: 'emergency', heading: 'Emergency contact information',
    keys: ['emergencyPhone', 'ambulancePhone', 'emergencyEntrance'],
    withheld: 'Verified emergency guidance and contacts are withheld pending hospital approval. This preview provides no urgent advice.' },
  { id: 'call', heading: 'Call and contact information',
    keys: ['publicPhone', 'switchboardPhone', 'email', 'hours', 'staffedFallback'],
    withheld: 'Hospital telephone contacts are withheld pending verification. No telephone link is active.' },
  { id: 'directions', heading: 'Locations and text directions',
    keys: ['address', 'publicEntrance', 'accessibleEntrance'],
    withheld: 'Verified address, entrance and text directions are withheld pending hospital approval. No map or geolocation is enabled.' },
] as const

function ContactDetails({ view, locale }: { readonly view: ContactView; readonly locale: GovernedLocale }) {
  return (
    <div className="ds-flow" data-home-contact-state={view.state}>
      <p lang="en">{view.state === 'controlled-fixture'
        ? 'Synthetic contact fixture — not hospital contact or arrival information. Calls, email and maps are disabled.'
        : 'Contact and arrival information is withheld pending verification.'}</p>
      {view.state === 'controlled-fixture' && locale === 'am' ? (
        <p lang="en">Unreviewed Amharic shaping fixture. No approved Amharic guidance is available.</p>
      ) : null}
      {groups.map((group) => (
        <section className="ds-flow" data-experience-level="0" data-protected-context="contact-directions"
          id={`home-${group.id}`} key={group.id} tabIndex={-1} aria-labelledby={`home-${group.id}-title`}>
          <h2 id={`home-${group.id}-title`} lang="en">{group.heading}</h2>
          {view.state === 'controlled-fixture' ? (
            <dl className={styles.contactFacts} lang={locale}>
              {view.facts.filter((fact) => (group.keys as readonly string[]).includes(fact.key)).map((fact) => (
                <div data-home-contact-fact={fact.key} key={fact.key}>
                  <dt>{fact.label}</dt>
                  <dd lang="en">{fact.value}</dd>
                </div>
              ))}
            </dl>
          ) : <p lang="en">{group.withheld}</p>}
        </section>
      ))}
    </div>
  )
}

// Canonical data is projected anew for every server render. Fixture contact targets stay inert.
export function HomeContactTemplate({ documents, locale, now, mode, tasks, ...props }: HomeContactTemplateProps) {
  const view = homeContactView(documents, locale, now, mode)
  return <HomeTemplate {...props} tasks={{ ...tasks,
    call: { label: tasks.call.label, href: '#home-call' },
    directions: { label: tasks.directions.label, href: '#home-directions' },
    emergency: { label: tasks.emergency.label, href: '#home-emergency' },
  }} contactDetails={<ContactDetails view={view} locale={locale} />} />
}
