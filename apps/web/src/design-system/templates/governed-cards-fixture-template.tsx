import type { GovernedKind, GovernedRecord, GovernedStatus } from '../../content/governed-record'
import { GovernedCard } from '../components'

import styles from './governed-cards-fixture-template.module.css'

const now = new Date('2026-09-16T09:00:00Z')

function syntheticRecord(kind: Exclude<GovernedKind, 'site-settings'>, status: GovernedStatus, suffix: string): GovernedRecord {
  const domain = {
    doctor: 'medical', service: 'clinical', location: 'operations',
    vacancy: 'human-resources', page: 'content',
  }[kind]
  return {
    publicId: `pub_${suffix.padEnd(12, '0')}`,
    kind,
    status,
    synthetic: true,
    localized: {
      en: { slug: `synthetic-${kind}-${suffix}`, title: `Synthetic ${kind} specimen` },
    },
    source: { reference: 'CONTROLLED-FIXTURE-ONLY', recordedAt: '2026-09-15T09:00:00Z' },
    owner: 'Synthetic fixture owner',
    reviewer: 'Synthetic fixture reviewer',
    approval: { actor: 'Synthetic fixture approver', at: '2026-09-15T10:00:00Z' },
    domainApproval: {
      domain, actor: 'Synthetic domain approver', at: '2026-09-15T10:30:00Z',
      reference: 'CONTROLLED-FIXTURE-ONLY',
    },
    relationships: [],
    publishAt: '2026-09-16T08:00:00Z',
    reviewAt: '2026-10-16T08:00:00Z',
    expiresAt: '2026-11-16T08:00:00Z',
    withdrawal: status === 'expired' || status === 'withdrawn'
      ? { reason: 'Synthetic retirement specimen', successorPublicId: null } : null,
    audit: [{ actor: 'Synthetic fixture author', at: '2026-09-15T09:00:00Z', change: 'Created specimen' }],
  }
}

export function GovernedCardsFixtureTemplate() {
  return (
    <section aria-labelledby="governed-cards-evidence-title" className="ds-flow ds-section"
      data-governed-cards-fixture id="governed-cards-evidence">
      <div className="ds-flow ds-reading">
        <h2 id="governed-cards-evidence-title">Governed card evidence fixture</h2>
        <p>
          All records below are synthetic, non-public specimens. No hospital person, service,
          location, vacancy, contact, application route, or image is represented as approved content.
        </p>
        <p>
          Missing optional data leaves no empty label. The Ethiopic text{' '}
          <span lang="am">የሙከራ ካርድ</span> checks shaping only and is not an approved translation.
        </p>
      </div>
      <div className={styles.grid} data-current-card-fixtures>
        <GovernedCard content={{ kind: 'doctor', specialty: 'Synthetic specialty only' }}
          href="#governed-cards-evidence-title" locale="en" mode="controlled-fixture" now={now}
          record={syntheticRecord('doctor', 'published', 'doc01')} />
        <GovernedCard content={{ kind: 'service', summary: 'Synthetic service summary only.' }}
          href="#governed-cards-evidence-title" locale="en" mode="controlled-fixture" now={now}
          review={{ authorized: true, reviewer: 'Synthetic clinical reviewer',
            reviewedAt: { dateTime: '2026-09-15T10:30:00Z', label: '15 September 2026 — specimen' } }}
          record={syntheticRecord('service', 'published', 'svc01')} />
        <GovernedCard content={{ kind: 'location', contact: {
          purpose: 'Specimen information line', value: 'No staffed contact is provided',
        }, address: 'Synthetic location summary only.' }}
          href="#governed-cards-evidence-title" locale="en" mode="controlled-fixture" now={now}
          record={syntheticRecord('location', 'published', 'loc01')} />
        <GovernedCard content={{ kind: 'vacancy', team: 'Synthetic team',
          location: 'Synthetic location', employmentType: 'Controlled specimen',
          closesAt: { dateTime: '2026-10-16T09:00:00Z', label: '16 October 2026, 09:00 UTC — specimen' },
          responsibilities: 'No real duties are advertised.', criteria: 'No real criteria are advertised.',
          applicationProcess: 'No application is collected in this fixture.',
          privacyHref: '#governed-cards-evidence-title',
        }} href="#governed-cards-evidence-title" locale="en" mode="controlled-fixture" now={now}
          record={syntheticRecord('vacancy', 'published', 'vac01')} />
      </div>
      <div className={styles.grid} data-retired-card-fixtures>
        <GovernedCard content={{ kind: 'doctor', specialty: 'Withheld synthetic field' }}
          href="#governed-cards-evidence-title" locale="en" mode="controlled-fixture" now={now}
          record={syntheticRecord('doctor', 'expired', 'doc02')} />
        <GovernedCard content={{ kind: 'service', summary: 'Withheld synthetic field' }}
          href="#governed-cards-evidence-title" locale="en" mode="controlled-fixture" now={now}
          record={syntheticRecord('service', 'draft', 'svc02')} />
        <GovernedCard content={{ kind: 'location', contact: {
          purpose: '', value: '',
        }, address: '' }} href="#governed-cards-evidence-title" locale="en"
          mode="controlled-fixture" now={now}
          record={syntheticRecord('location', 'published', 'loc02')} />
      </div>
      <div data-public-gate-fixture>
        <GovernedCard content={{ kind: 'doctor', specialty: 'Must never render publicly' }}
          href="/doctors/synthetic-doctor/" locale="en" now={now}
          record={syntheticRecord('doctor', 'published', 'doc03')} />
      </div>
    </section>
  )
}
