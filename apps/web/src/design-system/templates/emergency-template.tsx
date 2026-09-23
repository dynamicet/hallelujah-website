import type { ReactNode } from 'react'

import { SiteShell, type SiteShellProps } from '../components'

import styles from './emergency-template.module.css'

export interface EmergencyRouteChoice {
  readonly audience: string
  readonly displayValue: string
  readonly hours: string
  readonly label: string
  readonly limitations: string
  readonly purpose: string
}

type EmergencyAnnouncement = 'polite' | 'static'
type EmergencyReadyStateKind =
  | 'call-handoff-unsupported'
  | 'map-blocked'
  | 'map-failed'
  | 'ready'

interface EmergencyTemplateBaseProps {
  readonly eyebrow: string
  readonly shell: Omit<SiteShellProps, 'breadcrumbs' | 'children'>
  readonly title: string
}

interface EmergencyUnavailableTemplateProps extends EmergencyTemplateBaseProps {
  readonly state: {
    readonly announcement: EmergencyAnnouncement
    readonly description: string
    readonly heading: string
    readonly kind: 'expired' | 'unavailable'
    readonly reason: 'required-arrival-unavailable' | 'required-content-expired' | 'required-content-withheld'
    readonly recoveryLabel: string
  }
}

interface EmergencyReadyTemplateProps extends EmergencyTemplateBaseProps {
  readonly arrival: {
    readonly accessibleEntrance: string
    readonly address: string
    readonly entrance: string
    readonly parking: string
    readonly publicTransport: string
    readonly steps: readonly string[]
  }
  readonly description: string
  readonly hospitalChoice: EmergencyRouteChoice
  readonly mapStatus: ReactNode
  readonly publicChoice: EmergencyRouteChoice
  readonly scope: {
    readonly availability: string
    readonly limitations: string
    readonly owner: string
    readonly reviewedLabel: string
    readonly reviewedOn: string
    readonly summary: string
  }
  readonly state: {
    readonly announcement: EmergencyAnnouncement
    readonly description?: string
    readonly kind: EmergencyReadyStateKind
  }
  readonly support: ReactNode
  readonly warning: string
}

export type EmergencyTemplateProps = EmergencyReadyTemplateProps | EmergencyUnavailableTemplateProps

function InertRouteChoice({
  choice,
  handoffUnsupported,
}: {
  readonly choice: EmergencyRouteChoice
  readonly handoffUnsupported: boolean
}) {
  const descriptionId = `emergency-choice-${choice.label.toLowerCase().replaceAll(/[^a-z0-9]+/gu, '-')}`

  return (
    <article className={styles.callCard} data-inert-call-choice>
      <p className={styles.choiceType}>Synthetic route placeholder</p>
      <h2>{choice.label}</h2>
      <p id={descriptionId}>{choice.purpose}</p>
      <div
        aria-describedby={descriptionId}
        className={styles.inertCallValue}
        data-call-action={handoffUnsupported ? 'unsupported' : 'withheld'}
      >
        <span>{handoffUnsupported ? 'Automatic handoff unsupported' : 'Call action withheld'}</span>
        <strong>{choice.displayValue}</strong>
      </div>
      <p className={styles.fixtureBoundary}>
        {handoffUnsupported
          ? 'The synthetic display value remains readable for unsupported-handoff review. It is inert and must not be called.'
          : 'Inert test value — do not call or use for care.'}
      </p>
    </article>
  )
}

function RouteDefinition({ choice }: { readonly choice: EmergencyRouteChoice }) {
  return (
    <div>
      <dt>{choice.label}</dt>
      <dd>
        <span><strong>Who it represents:</strong> {choice.audience}</span>
        <span><strong>Purpose:</strong> {choice.purpose}</span>
        <span><strong>Limits:</strong> {choice.limitations}</span>
        <span><strong>Hours:</strong> {choice.hours}</span>
      </dd>
    </div>
  )
}

function StateAnnouncement({
  announcement,
  children,
}: {
  readonly announcement: EmergencyAnnouncement
  readonly children: ReactNode
}) {
  const injected = announcement === 'polite'

  return (
    <div
      className={styles.stateNotice}
      data-state-announcement={injected ? 'pending-injection' : 'static'}
      tabIndex={injected ? -1 : undefined}
    >
      {children}
    </div>
  )
}

function UnavailableEmergencyTemplate({
  eyebrow,
  shell,
  state,
  title,
}: EmergencyUnavailableTemplateProps) {
  return (
    <SiteShell {...shell}>
      <div
        className={styles.frame}
        data-emergency-state={state.kind}
        data-emergency-state-reason={state.reason}
        data-emergency-template
        data-experience-level="0"
      >
        <section
          aria-labelledby="emergency-title"
          className={styles.introduction}
          data-emergency-section="E1"
        >
          <div className={styles.introCopy}>
            <p className={styles.eyebrow}>{eyebrow}</p>
            <h1 id="emergency-title">{title}</h1>
            <p className={styles.fixtureNotice}>
              Controlled preview only. Required Emergency information is fail-closed and no
              contact, route, scope or arrival value is published.
            </p>
          </div>
          <StateAnnouncement announcement={state.announcement}>
            <h2>{state.heading}</h2>
            <p>{state.description}</p>
            <a className="ds-touch-target" href="#non-emergency-support">
              {state.recoveryLabel}
            </a>
          </StateAnnouncement>
        </section>

        <section
          aria-labelledby="support-title"
          className={`${styles.section} ${styles.support}`}
          data-emergency-section="E8"
          id="non-emergency-support"
          tabIndex={-1}
        >
          <h2 id="support-title">Controlled preview boundary</h2>
          <p>
            Return to the controlled review owner. This specimen performs no call, request,
            retry, lookup or safety-data substitution.
          </p>
          <a className="ds-touch-target" href="#emergency-title">Return to state explanation</a>
        </section>
      </div>
    </SiteShell>
  )
}

function isUnavailableEmergency(
  props: EmergencyTemplateProps,
): props is EmergencyUnavailableTemplateProps {
  return props.state.kind === 'expired' || props.state.kind === 'unavailable'
}

// Content adapters must replace every controlled fixture with one approved canonical record
// before a public route is mounted. This composition performs no fetch or safety inference.
export function EmergencyTemplate(props: EmergencyTemplateProps) {
  if (isUnavailableEmergency(props)) {
    return <UnavailableEmergencyTemplate {...props} />
  }

  const {
    arrival,
    description,
    eyebrow,
    hospitalChoice,
    mapStatus,
    publicChoice,
    scope,
    shell,
    state,
    support,
    title,
    warning,
  } = props
  const handoffUnsupported = state.kind === 'call-handoff-unsupported'

  return (
    <SiteShell {...shell}>
      <div
        className={styles.frame}
        data-emergency-state={state.kind}
        data-emergency-template
        data-experience-level="0"
      >
        <section
          aria-labelledby="emergency-title"
          className={styles.introduction}
          data-emergency-section="E1"
        >
          <div className={styles.introCopy}>
            <p className={styles.eyebrow}>{eyebrow}</p>
            <h1 id="emergency-title">{title}</h1>
            <p className={styles.description}>{description}</p>
            <p className={styles.fixtureNotice}>
              Controlled preview only. Every contact, route, scope and arrival value below is
              synthetic and inert. This page provides no emergency advice.
            </p>
          </div>
          {handoffUnsupported ? (
            <StateAnnouncement announcement={state.announcement}>
              <strong>Automatic call handoff is unsupported in this controlled specimen.</strong>
              <p>{state.description}</p>
            </StateAnnouncement>
          ) : null}
          <div
            aria-label="Synthetic emergency route choices"
            className={styles.callGrid}
            data-route-choice-group
            role="group"
          >
            <InertRouteChoice choice={hospitalChoice} handoffUnsupported={handoffUnsupported} />
            <InertRouteChoice choice={publicChoice} handoffUnsupported={handoffUnsupported} />
          </div>
        </section>

        <div className={styles.pairedSections}>
          <section
            aria-labelledby="route-difference-title"
            className={styles.section}
            data-emergency-section="E2"
          >
            <h2 id="route-difference-title">How the routes differ</h2>
            <dl className={styles.routeDefinitions}>
              <RouteDefinition choice={hospitalChoice} />
              <RouteDefinition choice={publicChoice} />
            </dl>
          </section>

          <section
            aria-labelledby="online-warning-title"
            className={`${styles.section} ${styles.warning}`}
            data-emergency-section="E3"
          >
            <p className={styles.choiceType}>Safety warning placeholder</p>
            <h2 id="online-warning-title">Do not use online contact for emergencies</h2>
            <p>{warning}</p>
            <p className={styles.fixtureBoundary}>Synthetic wording — clinical approval is pending.</p>
          </section>
        </div>

        <section
          aria-labelledby="hospital-scope-title"
          className={`${styles.section} ${styles.reading}`}
          data-emergency-section="E4"
        >
          <h2 id="hospital-scope-title">Emergency care at this hospital</h2>
          <p>{scope.summary}</p>
          <dl className={styles.scopeFacts}>
            <div><dt>Availability placeholder</dt><dd>{scope.availability}</dd></div>
            <div><dt>Limitations placeholder</dt><dd>{scope.limitations}</dd></div>
            <div><dt>Fixture owner</dt><dd>{scope.owner}</dd></div>
            <div>
              <dt>Fixture review date</dt>
              <dd><time dateTime={scope.reviewedOn}>{scope.reviewedLabel}</time></dd>
            </div>
          </dl>
        </section>

        <div className={styles.arrivalGrid}>
          <section
            aria-labelledby="where-to-go-title"
            className={styles.section}
            data-emergency-section="E5"
          >
            <h2 id="where-to-go-title">Where to go</h2>
            <dl className={styles.locationFacts}>
              <div><dt>Synthetic address</dt><dd>{arrival.address}</dd></div>
              <div><dt>Synthetic emergency entrance</dt><dd>{arrival.entrance}</dd></div>
            </dl>
            <h3>Landmark-based test directions</h3>
            <ol className={styles.directionSteps}>
              {arrival.steps.map((step) => <li key={step}>{step}</li>)}
            </ol>
            <p className={styles.fixtureBoundary}>Text is selectable. Copy and navigation actions are disabled.</p>
          </section>

          <section
            aria-labelledby="arriving-safely-title"
            className={styles.section}
            data-emergency-section="E6"
          >
            <h2 id="arriving-safely-title">Arriving safely</h2>
            <dl className={styles.locationFacts}>
              <div><dt>Vehicle and parking placeholder</dt><dd>{arrival.parking}</dd></div>
              <div><dt>Public transport placeholder</dt><dd>{arrival.publicTransport}</dd></div>
              <div><dt>Accessible entrance placeholder</dt><dd>{arrival.accessibleEntrance}</dd></div>
            </dl>
          </section>
        </div>

        <section
          aria-labelledby="map-title"
          className={`${styles.section} ${styles.mapPanel}`}
          data-emergency-section="E7"
          data-map-state={state.kind === 'map-failed' || state.kind === 'map-blocked' ? state.kind : 'disabled'}
        >
          <h2 id="map-title">Optional map</h2>
          {mapStatus}
          <p className={styles.fixtureBoundary}>
            No map, coordinates, geolocation, external link or provider request is enabled.
          </p>
        </section>

        <section
          aria-labelledby="support-title"
          className={`${styles.section} ${styles.support}`}
          data-emergency-section="E8"
          id="non-emergency-support"
          tabIndex={-1}
        >
          <h2 id="support-title">Need another hospital contact?</h2>
          {support}
        </section>
      </div>
    </SiteShell>
  )
}
