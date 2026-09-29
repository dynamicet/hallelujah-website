import Link from 'next/link'
import type { SiteShellProps } from '../components'
import { SiteShell } from '../components'
import type { ControlledClinicianProfile } from '../../content/clinician-profile.ts'

import styles from './clinician-profile-template.module.css'

export type ClinicianProfileReviewState =
  | 'appointment-unavailable'
  | 'failure'
  | 'gone'
  | 'ready'
  | 'unavailable'

export interface ClinicianProfileTemplateProps {
  readonly profile: ControlledClinicianProfile
  readonly shell: Omit<SiteShellProps, 'children'>
  readonly state: ClinicianProfileReviewState
}

const unavailableCopy: Readonly<Record<Exclude<ClinicianProfileReviewState, 'appointment-unavailable' | 'ready'>, {
  copy: string
  heading: string
}>> = {
  failure: {
    copy: 'No cached clinician details are shown as current. Retry the local review or return to the synthetic directory.',
    heading: 'The controlled clinician profile could not load',
  },
  gone: {
    copy: 'This synthetic record has been retired without an approved successor. No stale profile details are shown.',
    heading: 'This controlled clinician profile is no longer available',
  },
  unavailable: {
    copy: 'The requested synthetic record is missing, unapproved or outside its review period. No profile details are shown.',
    heading: 'The controlled clinician profile is unavailable',
  },
}

function UnavailableProfile({ state }: {
  readonly state: Exclude<ClinicianProfileReviewState, 'appointment-unavailable' | 'ready'>
}) {
  const content = unavailableCopy[state]
  return (
    <>
      <section aria-labelledby="clinician-profile-state-title" className={styles.statePanel} data-profile-section="P1">
        <p className={styles.eyebrow}>Controlled clinician-profile preview</p>
        <h1 id="clinician-profile-state-title">{content.heading}</h1>
        <p>{content.copy}</p>
      </section>
      <section aria-labelledby="clinician-profile-recovery-title" className={styles.support} data-profile-section="P7" id="profile-support">
        <h2 id="clinician-profile-recovery-title">Continue this controlled review</h2>
        <p>No staffed contact, recommendation or appointment action is approved for this preview.</p>
        <Link className="ds-touch-target" href="/">Return to the synthetic clinician profile</Link>
      </section>
    </>
  )
}

export function ClinicianProfileTemplate({ profile, shell, state }: ClinicianProfileTemplateProps) {
  const unavailable = state === 'failure' || state === 'gone' || state === 'unavailable'
  const clinician = profile.clinician

  return (
    <SiteShell {...shell}>
      <article className={styles.frame} data-clinician-profile-state={state} data-clinician-profile-template data-profile-section="P0">
        {unavailable || !clinician ? (
          <UnavailableProfile state={unavailable ? state : 'unavailable'} />
        ) : (
          <>
            <section aria-labelledby="clinician-profile-title" className={styles.introduction} data-profile-section="P1">
              <div className={styles.identity}>
                <p className={styles.eyebrow}>Controlled clinician-profile preview</p>
                <h1 id="clinician-profile-title">{clinician.details.name}</h1>
                {clinician.details.professionalTitle ? <p className={styles.professionalTitle}>{clinician.details.professionalTitle}</p> : null}
                <ul aria-label="Synthetic specialties" className={styles.specialties}>
                  {clinician.details.specialties.map((specialty) => <li key={specialty}>{specialty}</li>)}
                </ul>
                <span
                  aria-disabled="true"
                  className={styles.disabledAction}
                  data-appointment-doctor-public-id={clinician.publicId}
                >
                  Appointment requests unavailable
                </span>
              </div>
              <div aria-hidden="true" className={styles.portraitFallback} data-portrait-omitted>
                <span>Portrait withheld</span>
              </div>
              <p className={styles.fixtureNotice}>
                Fictional record for local review only. It represents no clinician, portrait,
                care details or appointment access.
              </p>
            </section>

            {clinician.details.interests.length ? (
              <section aria-labelledby="clinician-profile-care-title" className={styles.section} data-profile-section="P2">
                <h2 id="clinician-profile-care-title">Synthetic areas of care</h2>
                <ul className={styles.plainList}>
                  {clinician.details.interests.map((interest) => <li key={interest}>{interest}</li>)}
                </ul>
              </section>
            ) : null}

            {clinician.details.credentials.length || clinician.details.languages.length ? (
              <section aria-labelledby="clinician-profile-about-title" className={styles.section} data-profile-section="P3">
                <h2 id="clinician-profile-about-title">About this synthetic record</h2>
                {clinician.details.credentials.length ? (
                  <div className={styles.detailGroup}>
                    <h3>Controlled credentials</h3>
                    <ul className={styles.plainList}>
                      {clinician.details.credentials.map((credential) => <li key={credential}>{credential}</li>)}
                    </ul>
                  </div>
                ) : null}
                {clinician.details.languages.length ? (
                  <div className={styles.detailGroup}>
                    <h3>Fixture languages</h3>
                    <ul className={styles.inlineList}>
                      {clinician.details.languages.map((language) => <li key={language}>{language}</li>)}
                    </ul>
                  </div>
                ) : null}
              </section>
            ) : null}

            <section aria-labelledby="clinician-profile-request-title" className={`${styles.section} ${styles.requestPanel}`} data-profile-section="P4">
              <h2 id="clinician-profile-request-title">Where and how to request care</h2>
              {profile.locations.length ? (
                <div className={styles.detailGroup}>
                  <h3>Controlled location</h3>
                  <ul className={styles.plainList}>
                    {profile.locations.map((location) => (
                      <li data-location-public-id={location.publicId} key={location.publicId}>{location.title}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
              <p>Online appointment requests and staffed telephone guidance are unavailable in this preview.</p>
              {state === 'appointment-unavailable' ? (
                <p className={styles.stateMessage} role="status">The controlled appointment route is unavailable. No request was started.</p>
              ) : null}
              <span aria-disabled="true" className={styles.disabledAction}>Request action withheld</span>
            </section>

            {profile.relatedServices.length ? (
              <section aria-labelledby="clinician-profile-services-title" className={styles.section} data-profile-section="P5">
                <h2 id="clinician-profile-services-title">Related synthetic services</h2>
                <ul className={styles.serviceList}>
                  {profile.relatedServices.map((service) => (
                    <li data-canonical-path={service.canonicalPath} data-service-public-id={service.publicId} key={service.publicId}>
                      <strong>{service.name}</strong>
                      <span>Service route unavailable in controlled preview</span>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            <section aria-labelledby="clinician-profile-review-title" className={styles.review} data-profile-section="P6">
              <h2 id="clinician-profile-review-title">Controlled review metadata</h2>
              <p>Fixture review due <time dateTime={clinician.reviewAt}>{clinician.reviewAt.slice(0, 10)}</time>.</p>
              <p>This date does not approve hospital content or identify a medical reviewer.</p>
            </section>

            <section aria-labelledby="clinician-profile-support-title" className={styles.support} data-profile-section="P7" id="profile-support">
              <h2 id="clinician-profile-support-title">Need help choosing?</h2>
              <p>No recommendation, staffed contact or appointment action is approved for this controlled preview.</p>
              <Link className="ds-touch-target" href="/">Return to the synthetic clinician profile</Link>
            </section>
          </>
        )}
      </article>
    </SiteShell>
  )
}
