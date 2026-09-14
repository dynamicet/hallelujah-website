import type { ReactNode } from 'react'

import styles from './system-states.module.css'

export const systemAlertKinds = [
  'emergency',
  'error',
  'warning',
  'information',
  'success',
] as const

export const systemStateKinds = [
  'empty',
  'error',
  'offline',
  'unavailable',
  'expired',
] as const

export const componentStatePrecedence = [
  'unavailable',
  'expired',
  'error',
  'invalid',
  'disabled',
  'loading',
  'pending',
  'pressed',
  'focus-visible',
  'hover',
  'default',
] as const

export type SystemAlertKind = (typeof systemAlertKinds)[number]
export type SystemStateKind = (typeof systemStateKinds)[number]
export type ComponentState = (typeof componentStatePrecedence)[number]
export type StatusAnnouncement = 'assertive' | 'polite' | 'static'

interface FeedbackPanelProps {
  readonly action?: ReactNode
  readonly announcement?: StatusAnnouncement
  readonly children: ReactNode
  readonly focusTarget?: boolean
  readonly heading: string
  readonly id: string
}

interface AuthoritativeSuccessAlertProps extends FeedbackPanelProps {
  readonly authoritative: true
  readonly kind: 'success'
}

interface NonSuccessAlertProps extends FeedbackPanelProps {
  readonly authoritative?: never
  readonly kind: Exclude<SystemAlertKind, 'success'>
}

export type SystemAlertProps = AuthoritativeSuccessAlertProps | NonSuccessAlertProps

export interface TemporaryNoticeProps extends FeedbackPanelProps {
  readonly effective: DatedStatusMetadata
  readonly expires: DatedStatusMetadata
  readonly owner: string
  readonly scope: string
}

export interface DatedStatusMetadata {
  readonly dateTime: string
  readonly label: string
}

export interface SystemStateProps extends Omit<FeedbackPanelProps, 'action'> {
  readonly kind: SystemStateKind
  readonly recovery: ReactNode
}

export interface LoadingStatusProps {
  readonly detail?: ReactNode
  readonly id: string
  readonly label: string
  readonly preservedFacts?: ReactNode
}

export interface NonCriticalSkeletonProps {
  readonly id: string
  readonly label: string
  readonly rows?: number
}

export type ActiveComponentStates = Partial<Record<ComponentState, boolean>>

export function SystemAlert({
  action,
  announcement = 'static',
  authoritative,
  children,
  focusTarget = false,
  heading,
  id,
  kind,
}: SystemAlertProps) {
  return (
    <FeedbackPanel
      action={action}
      announcement={announcement}
      authoritative={authoritative}
      focusTarget={focusTarget}
      heading={heading}
      id={id}
      kind={kind}
      marker="alert"
    >
      {children}
    </FeedbackPanel>
  )
}

export function TemporaryNotice({
  action,
  announcement = 'static',
  children,
  effective,
  expires,
  focusTarget = false,
  heading,
  id,
  owner,
  scope,
}: TemporaryNoticeProps) {
  return (
    <FeedbackPanel
      action={action}
      announcement={announcement}
      focusTarget={focusTarget}
      heading={heading}
      id={id}
      kind="temporary"
      marker="temporary-notice"
    >
      {children}
      <dl className={styles.metadata} data-status-metadata>
        <div>
          <dt>Affected scope</dt>
          <dd>{scope}</dd>
        </div>
        <div>
          <dt>Effective</dt>
          <dd>
            <time dateTime={effective.dateTime}>{effective.label}</time>
          </dd>
        </div>
        <div>
          <dt>Expires or review due</dt>
          <dd>
            <time dateTime={expires.dateTime}>{expires.label}</time>
          </dd>
        </div>
        <div>
          <dt>Information owner</dt>
          <dd>{owner}</dd>
        </div>
      </dl>
    </FeedbackPanel>
  )
}

export function SystemState({
  announcement = 'static',
  children,
  focusTarget = false,
  heading,
  id,
  kind,
  recovery,
}: SystemStateProps) {
  return (
    <FeedbackPanel
      action={recovery}
      announcement={announcement}
      focusTarget={focusTarget}
      heading={heading}
      id={id}
      kind={kind}
      marker="system-state"
    >
      {children}
    </FeedbackPanel>
  )
}

export function LoadingStatus({
  detail,
  id,
  label,
  preservedFacts,
}: LoadingStatusProps) {
  return (
    <section
      aria-atomic="true"
      aria-labelledby={`${id}-label`}
      aria-live="polite"
      aria-busy="true"
      className={`${styles.panel} ${styles.loading}`}
      data-loading-status
      id={id}
      role="status"
    >
      <div className={styles.headingRow}>
        <span aria-hidden="true" className={styles.spinner} data-loading-indicator />
        <h3 id={`${id}-label`}>{label}</h3>
      </div>
      {detail ? <div className={styles.message}>{detail}</div> : null}
      {preservedFacts ? (
        <div className={styles.preservedFacts} data-preserved-critical-facts>
          <strong>Information that remains available</strong>
          <div>{preservedFacts}</div>
        </div>
      ) : null}
    </section>
  )
}

export function NonCriticalSkeleton({
  id,
  label,
  rows = 3,
}: NonCriticalSkeletonProps) {
  const safeRowCount = Number.isFinite(rows)
    ? Math.max(1, Math.min(6, Math.trunc(rows)))
    : 3

  return (
    <section
      aria-atomic="true"
      aria-labelledby={`${id}-label`}
      aria-live="polite"
      aria-busy="true"
      className={`${styles.panel} ${styles.loading}`}
      data-loading-boundary="non-critical-records"
      id={id}
      role="status"
    >
      <h3 id={`${id}-label`}>{label}</h3>
      <div aria-hidden="true" className={styles.skeleton} data-skeleton-placeholder>
        {Array.from({ length: safeRowCount }, (_, index) => (
          <span key={index} />
        ))}
      </div>
      <p className={styles.boundaryCopy}>
        Only predictable, non-critical record shapes may use this reserved placeholder.
      </p>
    </section>
  )
}

export function resolveDominantComponentState(
  activeStates: ActiveComponentStates,
): ComponentState {
  return componentStatePrecedence.find((state) => activeStates[state]) ?? 'default'
}

interface FeedbackPanelInternalProps extends FeedbackPanelProps {
  readonly authoritative?: true
  readonly kind: SystemAlertKind | SystemStateKind | 'temporary'
  readonly marker: 'alert' | 'system-state' | 'temporary-notice'
}

function FeedbackPanel({
  action,
  announcement = 'static',
  authoritative,
  children,
  focusTarget = false,
  heading,
  id,
  kind,
  marker,
}: FeedbackPanelInternalProps) {
  const headingId = `${id}-heading`
  const live = announcement === 'static' ? undefined : announcement
  const role = live === 'assertive' ? 'alert' : live === 'polite' ? 'status' : undefined

  return (
    <section
      aria-atomic={role ? 'true' : undefined}
      aria-labelledby={headingId}
      aria-live={live}
      className={`${styles.panel} ${styles[kind]}`}
      data-authoritative-completion={authoritative ? 'true' : undefined}
      data-experience-level={isProtectedState(kind) ? '0' : '1'}
      data-feedback-kind={kind}
      data-system-feedback={marker}
      id={id}
      role={role}
      tabIndex={focusTarget ? -1 : undefined}
    >
      <div className={styles.headingRow}>
        <FeedbackIcon kind={kind} />
        <h3 id={headingId}>{heading}</h3>
      </div>
      <div className={styles.message}>{children}</div>
      {action ? <div className={styles.action}>{action}</div> : null}
    </section>
  )
}

function FeedbackIcon({ kind }: { readonly kind: FeedbackPanelInternalProps['kind'] }) {
  const iconKind = kind === 'temporary' || kind === 'offline' ? 'information' : kind

  return (
    <svg
      aria-hidden="true"
      className={styles.icon}
      data-status-icon={iconKind}
      fill="none"
      focusable="false"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      {iconKind === 'success' ? <path d="m5 12 4 4L19 6" /> : null}
      {iconKind === 'error' || iconKind === 'expired' || iconKind === 'unavailable' ? (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v6" />
          <path d="M12 17h.01" />
        </>
      ) : null}
      {iconKind === 'warning' || iconKind === 'emergency' ? (
        <>
          <path d="M12 3 2.5 20h19Z" />
          <path d="M12 9v5" />
          <path d="M12 17h.01" />
        </>
      ) : null}
      {iconKind === 'information' ? (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 11v6" />
          <path d="M12 7h.01" />
        </>
      ) : null}
      {iconKind === 'empty' ? (
        <>
          <path d="M4 7h16v12H4z" />
          <path d="M8 7V5h8v2" />
          <path d="M9 13h6" />
        </>
      ) : null}
    </svg>
  )
}

function isProtectedState(kind: FeedbackPanelInternalProps['kind']) {
  return ['emergency', 'error', 'expired', 'offline', 'temporary', 'unavailable', 'warning'].includes(kind)
}
