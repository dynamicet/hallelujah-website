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
    copy: 'No cached clinician details are shown as current. Try again or return to the directory.',
    heading: 'The clinician profile could not load',
  },
  gone: {
    copy: 'This clinician profile is no longer available.',
    heading: 'This clinician profile is no longer available',
  },
  unavailable: {
    copy: 'Please return home to continue browsing.',
    heading: 'The clinician profile is unavailable',
  },
}

function UnavailableProfile({ state }: {
  readonly state: Exclude<ClinicianProfileReviewState, 'appointment-unavailable' | 'ready'>
}) {
  const content = unavailableCopy[state]
  return (
    <>
      <section aria-labelledby="clinician-profile-state-title" className={styles.statePanel} data-profile-section="P1">
        <h1 id="clinician-profile-state-title">{content.heading}</h1>
        <p>{content.copy}</p>
      </section>
      <section aria-labelledby="clinician-profile-recovery-title" className={styles.support} data-profile-section="P7" id="profile-support">
        <h2 id="clinician-profile-recovery-title">Continue browsing</h2>

        <Link className="ds-touch-target" href="/">Return to home</Link>
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
                <h1 id="clinician-profile-title">{clinician.details.name}</h1>
                {clinician.details.professionalTitle ? <p className={styles.professionalTitle}>{clinician.details.professionalTitle}</p> : null}
                <ul aria-label="Specialties" className={styles.specialties}>
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
                <span></span>
              </div>
            </section>

            <div className={styles.contentLayout} data-profile-content-layout>
              <div className={styles.editorialColumn}>
                {clinician.details.interests.length ? (
                  <section aria-labelledby="clinician-profile-care-title" className={styles.section} data-profile-section="P2">
                    <h2 id="clinician-profile-care-title">Areas of care</h2>
                    <ul className={styles.plainList}>
                      {clinician.details.interests.map((interest) => <li key={interest}>{interest}</li>)}
                    </ul>
                  </section>
                ) : null}

                {clinician.details.credentials.length || clinician.details.languages.length ? (
                  <section aria-labelledby="clinician-profile-about-title" className={styles.section} data-profile-section="P3">
                    <h2 id="clinician-profile-about-title">About this clinician</h2>
                    {clinician.details.credentials.length ? (
                      <div className={styles.detailGroup}>
                        <h3>Credentials</h3>
                        <ul className={styles.plainList}>
                          {clinician.details.credentials.map((credential) => <li key={credential}>{credential}</li>)}
                        </ul>
                      </div>
                    ) : null}
                    {clinician.details.languages.length ? (
                      <div className={styles.detailGroup}>
                        <h3>Languages</h3>
                        <ul className={styles.inlineList}>
                          {clinician.details.languages.map((language) => <li key={language}>{language}</li>)}
                        </ul>
                      </div>
                    ) : null}
                  </section>
                ) : null}
              </div>

              <aside aria-label="Care request information" className={styles.requestRail}>
                <section aria-labelledby="clinician-profile-request-title" className={`${styles.section} ${styles.requestPanel}`} data-profile-section="P4">
                  <h2 id="clinician-profile-request-title">Where and how to request care</h2>
                  {profile.locations.length ? (
                    <div className={styles.detailGroup}>
                      <h3>Location</h3>
                      <ul className={styles.plainList}>
                        {profile.locations.map((location) => (
                          <li data-location-public-id={location.publicId} key={location.publicId}>{location.title}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                  <p>Online appointment requests and staffed telephone guidance are unavailable.</p>
                  {state === 'appointment-unavailable' ? (
                    <p className={styles.stateMessage} role="status">The appointment route is unavailable. No request was started.</p>
                  ) : null}
                  <span aria-disabled="true" className={styles.disabledAction}>Appointment requests unavailable</span>
                </section>
              </aside>
            </div>

            {profile.relatedServices.length ? (
              <section aria-labelledby="clinician-profile-services-title" className={`${styles.section} ${styles.relatedServices}`} data-profile-section="P5">
                <h2 id="clinician-profile-services-title">Related services</h2>
                <ul className={styles.serviceList}>
                  {profile.relatedServices.map((service) => (
                    <li data-canonical-path={service.canonicalPath} data-service-public-id={service.publicId} key={service.publicId}>
                      <strong>{service.name}</strong>
                      <span>Service route unavailable</span>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            <section aria-labelledby="clinician-profile-support-title" className={styles.support} data-profile-section="P7" id="profile-support">
              <h2 id="clinician-profile-support-title">Need help choosing?</h2>

              <Link className="ds-touch-target" href="/">Return to home</Link>
            </section>
          </>
        )}
      </article>
    </SiteShell>
  )
}
