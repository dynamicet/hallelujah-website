import { InterfaceLink as Link } from '@/website/interface-language'
import type { SiteShellProps } from '../components'
import { SiteShell } from '../components'
import type { ControlledClinicianProfile } from '../../content/clinician-profile.ts'

import styles from './clinician-profile-template.module.css'
import { ClinicianPortrait } from '../components'
import { ClinicianTransition, clinicianTransitionName } from '../components'

export type ClinicianProfileReviewState =
  | 'appointment-unavailable'
  | 'failure'
  | 'gone'
  | 'ready'
  | 'unavailable'

export interface ClinicianProfileTemplateProps {
  readonly serviceContext?: { readonly name: string; readonly href: string }
  readonly portraitSrc?: string
  readonly portraitDisclosure?: string
  readonly relatedTopics?: readonly { name: string; href: string }[]
  readonly appointmentHref?: string
  readonly biography?: string
  readonly directoryHref?: string
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

function UnavailableProfile({ directoryHref, retryHref, state }: {
  readonly directoryHref: string
  readonly retryHref?: string
  readonly state: Exclude<ClinicianProfileReviewState, 'appointment-unavailable' | 'ready'>
}) {
  const content = unavailableCopy[state]
  return (
    <>
      <section aria-labelledby="clinician-profile-state-title" className={styles.statePanel} data-profile-section="P1">
        <h1 id="clinician-profile-state-title">{content.heading}</h1>
        <p>{content.copy}</p>
        {retryHref && state === 'failure' ? <Link className="ds-touch-target" href={retryHref}>Try this profile again</Link> : null}
      </section>
      <section aria-labelledby="clinician-profile-recovery-title" className={`${styles.support} ds-support-band`} data-profile-section="P7" id="profile-support">
        <h2 id="clinician-profile-recovery-title">Continue browsing</h2>
        <p>Search other clinicians or explore services while this profile is unavailable.</p>
        <div className="ds-support-actions"><Link className="ds-touch-target" href={directoryHref}>Back to doctor results</Link><Link className="ds-touch-target" href="/services">View all services</Link><Link className="ds-touch-target" href="/">Home</Link></div>
      </section>
    </>
  )
}

export function ClinicianProfileTemplate({ serviceContext, portraitSrc, portraitDisclosure, relatedTopics = [], appointmentHref, biography, directoryHref = '/doctors', profile, shell, state }: ClinicianProfileTemplateProps) {
  const unavailable = state === 'failure' || state === 'gone' || state === 'unavailable'
  const clinician = profile.clinician
  const hasEditorial = Boolean(biography || clinician?.details.interests.length || clinician?.details.credentials.length || clinician?.details.languages.length)
  const requestHref = state === 'appointment-unavailable' ? undefined : appointmentHref

  return (
    <SiteShell {...shell}>
      {!unavailable && clinician ? <ClinicianTransition /> : null}
      <article className={styles.frame} data-clinician-profile-state={state} data-clinician-profile-template data-care-profile={appointmentHref ? true : undefined} data-clinician-identity-id={unavailable ? undefined : clinician?.publicId} data-profile-section="P0">
        {unavailable || !clinician ? (
          <UnavailableProfile directoryHref={directoryHref} retryHref={appointmentHref ? profile.canonicalPath ?? undefined : undefined}
            state={unavailable ? state : 'unavailable'} />
        ) : (
          <>
            <section aria-labelledby="clinician-profile-title" className={styles.introduction} data-profile-section="P1">
              <ClinicianPortrait name={clinician.details.name} src={portraitSrc} transitionName={clinicianTransitionName(clinician.publicId, 'portrait')} />
              <div className={styles.identity}>
                {appointmentHref ? <p className={styles.eyebrow}>Doctor profile</p> : null}
                <h1 data-care-transition-name id="clinician-profile-title" tabIndex={-1} style={{ viewTransitionName: clinicianTransitionName(clinician.publicId, 'name') }}>{clinician.details.name}</h1>
                {portraitDisclosure ? <p className={styles.portraitDisclosure}>{portraitDisclosure}</p> : null}
                {clinician.details.professionalTitle ? <p className={styles.professionalTitle}>{clinician.details.professionalTitle}</p> : null}
                <ul aria-label="Specialties" className={styles.specialties}>
                  {clinician.details.specialties.map((specialty) => <li key={specialty}>{specialty}</li>)}
                </ul>
                {requestHref ? <Link className={`${styles.primaryLink} ds-touch-target`} href={requestHref} aria-label={`Request an appointment with ${clinician.details.name}`}>Request an appointment</Link> : (
                  <span
                    aria-disabled="true"
                    className={styles.disabledAction}
                    data-appointment-doctor-public-id={clinician.publicId}
                  >
                    Appointment requests unavailable
                  </span>
                )}
                {appointmentHref ? <Link className="ds-touch-target" href={directoryHref}>Back to doctor results</Link> : null}
              </div>
            </section>

            {serviceContext ? <aside className={styles.serviceContext} aria-label="Your service choice">
              <div><p>Service you explored</p><strong>{serviceContext.name}</strong></div>
              <Link className="ds-touch-target" href={`${serviceContext.href}#care-team`}>Back to the service <span aria-hidden="true">→</span></Link>
            </aside> : null}
            {appointmentHref ? <nav aria-label="On this doctor’s profile" className={styles.profileNavigation}>
              {clinician.details.interests.length ? <a href="#clinician-profile-care-title">Areas of care</a> : null}
              {biography || clinician.details.credentials.length || clinician.details.languages.length ? <a href="#clinician-profile-about-title">About the doctor</a> : null}
              <a href="#clinician-profile-request-title">Appointment information <span aria-hidden="true">↓</span></a>
            </nav> : null}

            <div className={`${styles.contentLayout} ${hasEditorial ? '' : styles.railOnly}`} data-profile-content-layout>
              {hasEditorial ? <div className={styles.editorialColumn}>
                {clinician.details.interests.length ? (
                  <section aria-labelledby="clinician-profile-care-title" className={styles.section} data-profile-section="P2">
                    <h2 id="clinician-profile-care-title" tabIndex={-1}>Areas of care</h2>
                    <ul className={styles.plainList}>
                      {clinician.details.interests.map((interest) => <li key={interest}>{interest}</li>)}
                    </ul>
                  </section>
                ) : null}

                {biography || clinician.details.credentials.length || clinician.details.languages.length ? (
                  <section aria-labelledby="clinician-profile-about-title" className={styles.section} data-profile-section="P3">
                    <h2 id="clinician-profile-about-title" tabIndex={-1}>About this clinician</h2>
                    {biography ? <p>{biography}</p> : null}
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
              </div> : null}

              <aside aria-label="Care request information" className={styles.requestRail}>
                <section aria-labelledby="clinician-profile-request-title" className={`${styles.section} ${styles.requestPanel}`} data-profile-section="P4">
                  <h2 id="clinician-profile-request-title" tabIndex={-1}>Where and how to request care</h2>
                  <p className={styles.selectedDoctor}>Selected doctor: <strong>{clinician.details.name}</strong></p>
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
                  <p>An appointment request does not confirm a booking or a time.</p>
                  {state === 'appointment-unavailable' ? (
                    <p className={styles.stateMessage} role="status">The appointment route is unavailable. No request was started.</p>
                  ) : null}
                  {requestHref ? <Link className={`${styles.primaryLink} ds-touch-target`} href={requestHref}>Request an appointment</Link> : <span aria-disabled="true" className={styles.disabledAction}>Appointment requests unavailable</span>}
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
                      {appointmentHref ? <Link className="ds-touch-target" href={service.canonicalPath}>View service details</Link> : <span>Service information unavailable</span>}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {relatedTopics.length ? <section aria-labelledby="clinician-topics-title" className={styles.section}>
              <h2 id="clinician-topics-title">Prepare your questions</h2>
              <p>These preview guides connect through the services listed above. Confirm the right care for your concern with the hospital.</p>
              <ul>{relatedTopics.map((topic) => <li key={topic.href}><Link href={topic.href}>{topic.name}</Link></li>)}</ul>
            </section> : null}
            {appointmentHref ? <section aria-labelledby="clinician-profile-review-title" className={styles.reviewNote} data-profile-section="P6">
              <h2 id="clinician-profile-review-title">About this information</h2>
              <p>This illustrative profile has not been reviewed for public clinical or operational use. Appointment times and availability are not shown.</p>
            </section> : null}

            <section aria-labelledby="clinician-profile-support-title" className={`${styles.support} ds-support-band`} data-profile-section="P7" id="profile-support">
              <h2 id="clinician-profile-support-title">Need help choosing?</h2>
              <div className="ds-support-actions"><Link className="ds-touch-target" href={directoryHref}>Back to doctor results</Link><Link className="ds-touch-target" href="/services">View all services</Link><Link className="ds-touch-target" href="/#home-call">Contact options</Link></div>
            </section>
          </>
        )}
      </article>
    </SiteShell>
  )
}
