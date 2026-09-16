import styles from './optional-map.module.css'

export const optionalMapStates = ['idle', 'blocked', 'loading', 'failure'] as const

export type OptionalMapState = (typeof optionalMapStates)[number]

export interface TextDirectionStep {
  readonly instruction: string
  readonly label: string
}

interface OptionalMapCommonProps {
  readonly address: string
  readonly directions: readonly TextDirectionStep[]
  readonly entrance: string
  readonly heading: string
  readonly id: string
  readonly landmark: string
  readonly status: string
}

interface DisabledOptionalMapProps extends OptionalMapCommonProps {
  readonly authority: 'not-approved'
  readonly state: 'blocked'
}

interface ControlledOptionalMapProps extends OptionalMapCommonProps {
  readonly activationLabel: string
  readonly authority: 'controlled-fixture'
  readonly removeLabel: string
  readonly state: 'idle' | 'loading' | 'failure'
}

export type OptionalMapProps = DisabledOptionalMapProps | ControlledOptionalMapProps

export function OptionalMap(props: OptionalMapProps) {
  const {
    address,
    authority,
    directions,
    entrance,
    heading,
    id,
    landmark,
    state,
    status,
  } = props
  const isInteractiveFixture = authority === 'controlled-fixture' && state === 'idle'
  const statusId = `${id}-map-status`

  return (
    <section
      aria-labelledby={`${id}-heading`}
      className={styles.wrapper}
      data-map-authority={authority}
      data-map-state={state}
      data-optional-map
      data-provider-request="prohibited"
      id={id}
    >
      <div className={styles.directions} data-text-directions>
        <h3 id={`${id}-heading`}>{heading}</h3>
        <dl className={styles.facts}>
          <div>
            <dt>Address</dt>
            <dd>{address}</dd>
          </div>
          <div>
            <dt>Landmark</dt>
            <dd>{landmark}</dd>
          </div>
          <div>
            <dt>Entrance</dt>
            <dd>{entrance}</dd>
          </div>
        </dl>
        <div className={styles.steps}>
          <h4>Text directions</h4>
          <ol>
            {directions.map((step) => (
              <li key={`${step.label}-${step.instruction}`}>
                <strong>{step.label}</strong>
                <span>{step.instruction}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div
        aria-busy={state === 'loading' ? true : undefined}
        aria-labelledby={`${id}-map-heading`}
        className={`${styles.mapPanel} ${styles[state]}`}
        data-map-panel
        role="group"
      >
        <div className={styles.mapHeading}>
          <MapPinIcon />
          <div>
            <h4 id={`${id}-map-heading`}>Optional interactive map</h4>
            <p>Written arrival information above remains the primary route.</p>
          </div>
        </div>

        <p className={styles.status} id={statusId}>{status}</p>

        {state === 'loading' ? (
          <div className={styles.loadingStatus} data-map-loading>
            <span aria-hidden="true" className={styles.spinner} />
            <span>Controlled loading-state specimen; no provider request is running.</span>
          </div>
        ) : null}

        {state === 'failure' ? (
          <p className={styles.failureStatus} data-map-failure>
            The optional view failed. Continue with the complete written directions above.
          </p>
        ) : null}

        {state === 'blocked' ? (
          <button aria-describedby={statusId} className={styles.button} disabled type="button">
            Interactive map unavailable
          </button>
        ) : null}

        {isInteractiveFixture ? (
          <label className={styles.acknowledgement} htmlFor={`${id}-acknowledgement`}>
            <input autoComplete="off" data-map-acknowledgement disabled id={`${id}-acknowledgement`} type="checkbox" />
            <span>I understand this is a local test, not consent to a map provider.</span>
          </label>
        ) : null}

        {isInteractiveFixture ? (
          <div className={styles.actions}>
            <button
              aria-controls={`${id}-surface`}
              aria-describedby={statusId}
              aria-expanded={false}
              className={styles.button}
              data-map-activate
              disabled
              type="button"
            >
              {props.activationLabel}
            </button>
            <button aria-controls={`${id}-surface`} className={styles.button} data-map-remove hidden type="button">
              {props.removeLabel}
            </button>
          </div>
        ) : null}

        {isInteractiveFixture ? (
          <div
            aria-labelledby={`${id}-preview-heading`}
            className={styles.placeholder}
            data-map-surface
            hidden
            id={`${id}-surface`}
            role="region"
            tabIndex={-1}
          >
            <MapPinIcon />
            <strong id={`${id}-preview-heading`}>Controlled local map placeholder</strong>
            <p>No coordinates, tiles, provider code, or hospital location are loaded.</p>
          </div>
        ) : null}

        {isInteractiveFixture ? (
          <p
            aria-atomic="true"
            aria-live="polite"
            className={`${styles.liveStatus} ds-visually-hidden`}
            data-map-live
          />
        ) : null}
      </div>
    </section>
  )
}

function MapPinIcon() {
  return (
    <svg
      aria-hidden="true"
      className={styles.icon}
      fill="none"
      focusable="false"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  )
}
