import type { WorkflowDocument } from '../../content/cms-workflow'
import {
  controlledHomeGovernedView,
  type HomeFeatureSelection,
} from '../../content/home-governed-view'
import type { GovernedLocale } from '../../content/governed-record'
import { ActionLink, GovernedCard } from '../components'

import styles from './home-governed-content.module.css'

export interface HomeGovernedContentProps {
  readonly institutionalDocuments: readonly WorkflowDocument[]
  readonly locale: GovernedLocale
  readonly mode?: 'controlled-fixture'
  readonly now: Date
  readonly records: readonly unknown[]
  readonly relationships: readonly unknown[]
  readonly selection: HomeFeatureSelection
  readonly scope?: 'all' | 'care' | 'institutional'
}

/** Whole optional sections disappear when their governed projection has no eligible records. */
export function HomeGovernedContent(props: HomeGovernedContentProps) {
  const view = controlledHomeGovernedView(
    props.records,
    props.relationships,
    props.institutionalDocuments,
    props.selection,
    props.locale,
    props.now,
    props.mode,
  )
  const scope = props.scope ?? 'all'
  const showCare = scope !== 'institutional'
  const showInstitutional = scope !== 'care'

  return (
    <>
      {showCare && view.services.length ? (
        <section aria-labelledby="home-services-title" className={styles.collection}
          data-home-section="H4" data-home-governed-section="services">
          <div className={styles.headingGroup}>
            <h2 id="home-services-title">Browse care by need</h2>
          </div>
          <div className={styles.grid}>
            {view.services.map((service) => (
              <GovernedCard content={{ kind: 'service', summary: service.summary, group: service.group }}
                controlledDestination="canonical-path" href={service.canonicalPath} key={service.publicId}
                locale={props.locale} mode={props.mode} now={props.now} record={service.record} />
            ))}
            <article className={`${styles.directoryCard} ${styles.card}`}>
              <h3>View all services</h3>
              <p>Browse the service directory.</p>
              <ActionLink href="#home-service" label="View all services" variant="tertiary" />
            </article>
          </div>
        </section>
      ) : null}

      {showCare && view.doctors.length ? (
        <section aria-labelledby="home-doctors-title" className={styles.collection}
          data-home-section="H5" data-home-governed-section="doctors">
          <div className={styles.headingGroup}>
            <h2 id="home-doctors-title">Find a doctor</h2>
          </div>
          <div className={styles.grid}>
            {view.doctors.map((doctor) => (
              <GovernedCard content={{ kind: 'doctor', specialty: doctor.specialty,
                ...(doctor.credentials ? { credentials: doctor.credentials } : {}) }}
                controlledDestination="canonical-path" href={doctor.canonicalPath} key={doctor.publicId}
                locale={props.locale} mode={props.mode} now={props.now} record={doctor.record} />
            ))}
            <article className={`${styles.directoryCard} ${styles.card}`}>
              <h3>View all doctors</h3>
              <p>Browse the clinician directory.</p>
              <ActionLink href="#home-doctor" label="Find a doctor" variant="tertiary" />
            </article>
          </div>
        </section>
      ) : null}

      {showInstitutional && view.institutions.length ? (
        <section aria-labelledby="home-institution-title" className={`${styles.collection} ${styles.editorial}`}
          data-home-section="H8" data-home-governed-section="institutional">
          <div className={styles.headingGroup}>
            <h2 id="home-institution-title">About the hospital</h2>
          </div>
          <div className={styles.editorialGrid}>
            {view.institutions.map((institution) => (
              <article className={styles.institution} data-institution-type={institution.type}
                key={institution.publicId} lang={props.locale}>
                <h3>{institution.title}</h3>
                <p>{institution.body}</p>
                <p className={styles.metadata} lang="en">Limitations: {institution.limitations}</p>
                <p className={styles.metadata} lang="en">Evidence as of:{' '}
                  <time dateTime={institution.asOf}>{institution.asOf.slice(0, 10)}</time>
                </p>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </>
  )
}
