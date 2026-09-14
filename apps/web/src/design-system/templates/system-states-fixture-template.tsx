import {
  ActionLink,
  LoadingStatus,
  NonCriticalSkeleton,
  SystemAlert,
  SystemState,
  TemporaryNotice,
} from '../components'

import styles from './system-states-fixture-template.module.css'

export function SystemStatesFixtureTemplate() {
  return (
    <section
      aria-labelledby="system-states-evidence-title"
      className="ds-flow ds-section"
      data-system-states-fixture
      id="system-states-evidence"
    >
      <div className="ds-flow ds-reading">
        <h2 id="system-states-evidence-title">System state evidence fixture</h2>
        <p>
          These server-rendered specimens use synthetic wording only. They do not report a real
          hospital condition, load a provider, publish a route, or authorize an operational claim.
        </p>
        <p>
          Each state names what happened and retains a safe next step. The Ethiopic phrase{' '}
          <span lang="am">የሙከራ ሁኔታ መረጃ</span> is an unreviewed shaping specimen, not an approved
          translation.
        </p>
      </div>

      <div className={styles.grid} data-alert-fixtures>
        <SystemAlert
          action={<ActionLink href="#controlled-state-recovery" label="Review urgent recovery" />}
          heading="Controlled urgent-route specimen"
          id="controlled-emergency-alert"
          kind="emergency"
        >
          <p>This specimen contains no emergency number or live clinical instruction.</p>
        </SystemAlert>
        <SystemAlert
          action={<ActionLink href="#controlled-state-recovery" label="Review error recovery" />}
          announcement="assertive"
          focusTarget
          heading="Controlled blocking-error specimen"
          id="controlled-error-alert"
          kind="error"
        >
          <p>The synthetic action did not complete. No information was accepted or stored.</p>
        </SystemAlert>
        <SystemAlert
          action={<ActionLink href="#controlled-state-recovery" label="Review the prerequisite" />}
          heading="Controlled warning specimen"
          id="controlled-warning-alert"
          kind="warning"
        >
          <p>A required controlled prerequisite has not been approved.</p>
        </SystemAlert>
        <SystemAlert
          action={<ActionLink href="#system-states-evidence-title" label="Review fixture scope" />}
          heading="Controlled information specimen"
          id="controlled-information-alert"
          kind="information"
        >
          <p>This build validates component behavior without publishing hospital content.</p>
        </SystemAlert>
        <SystemAlert
          action={<ActionLink href="#system-states-evidence-title" label="Review the evidence scope" />}
          announcement="polite"
          authoritative
          heading="Controlled authoritative-success shape"
          id="controlled-success-alert"
          kind="success"
        >
          <p>This static shape is not the result of a real action or server acknowledgement.</p>
        </SystemAlert>
        <TemporaryNotice
          action={<ActionLink href="#controlled-state-recovery" label="Review temporary guidance" />}
          effective={{ dateTime: '2026-09-14T10:00:00+03:00', label: '14 September 2026, 10:00 EAT — controlled' }}
          expires={{ dateTime: '2026-09-14T12:00:00+03:00', label: '14 September 2026, 12:00 EAT — controlled' }}
          heading="Controlled temporary-operations specimen"
          id="controlled-temporary-notice"
          owner="Synthetic fixture owner"
          scope="Controlled fixture only"
        >
          <p>No service, entrance, contact, or operating hour is changed by this specimen.</p>
        </TemporaryNotice>
      </div>

      <div className={styles.grid} data-system-state-fixtures>
        <SystemState
          heading="No approved synthetic records"
          id="controlled-empty-state"
          kind="empty"
          recovery={<ActionLink href="#system-states-evidence-title" label="Review the fixture boundary" />}
        >
          <p>The controlled collection is valid and contains no approved specimen records.</p>
        </SystemState>
        <SystemState
          announcement="assertive"
          heading="Controlled records could not be read"
          id="controlled-error-state"
          kind="error"
          recovery={<ActionLink href="#controlled-state-recovery" label="Review safe retry guidance" />}
        >
          <p>The cause is known in this fixture. No submitted value needs to be recovered.</p>
        </SystemState>
        <SystemState
          heading="Controlled dependency is offline"
          id="controlled-offline-state"
          kind="offline"
          recovery={<ActionLink href="#controlled-state-recovery" label="Use the text-only fallback" />}
        >
          <p>The current dependency cannot be reached; static fixture guidance remains available.</p>
        </SystemState>
        <SystemState
          focusTarget
          heading="Controlled workflow is unavailable"
          id="controlled-unavailable-state"
          kind="unavailable"
          recovery={<ActionLink href="#controlled-state-recovery" label="Use the safe available route" />}
        >
          <p>The required authority is absent, so the unsafe action is not rendered.</p>
        </SystemState>
        <SystemState
          heading="Controlled record has expired"
          id="controlled-expired-state"
          kind="expired"
          recovery={<ActionLink href="#controlled-state-recovery" label="Return to current guidance" />}
        >
          <p>The stale record is withheld and no successor is inferred.</p>
        </SystemState>
      </div>

      <div className={styles.grid} data-loading-fixtures>
        <LoadingStatus
          detail={<p>A stable indicator appears only when the consuming workflow expects a meaningful wait.</p>}
          id="controlled-loading-state"
          label="Loading controlled non-critical records"
          preservedFacts={
            <p>
              Controlled urgent, contact, privacy, validation, and arrival facts remain readable
              instead of becoming placeholders.
            </p>
          }
        />
        <NonCriticalSkeleton
          id="controlled-skeleton-state"
          label="Preparing predictable controlled record shapes"
          rows={3}
        />
      </div>

      <div className="ds-flow ds-reading" id="controlled-state-recovery" tabIndex={-1}>
        <h3>Controlled recovery boundary</h3>
        <p>
          A consuming route must supply an approved recovery action, authoritative data, and the
          correct announcement timing. This fixture performs no retry and makes no network request.
        </p>
      </div>
    </section>
  )
}
