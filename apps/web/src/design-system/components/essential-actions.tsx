import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from 'react'

import { Icon, type IconName } from './icon'
import styles from './essential-actions.module.css'

export const routineActionVariants = ['primary', 'secondary', 'tertiary'] as const

export type RoutineActionVariant = (typeof routineActionVariants)[number]

interface ActionContentProps {
  readonly icon?: IconName
  readonly iconPosition?: 'start' | 'end'
  readonly label: string
}

interface ActionGroupProps {
  readonly children: ReactNode
  readonly label?: string
}

export interface ActionLinkProps
  extends ActionContentProps,
    Pick<AnchorHTMLAttributes<HTMLAnchorElement>, 'download' | 'rel'> {
  readonly href: string
  readonly variant?: RoutineActionVariant
}

interface EnabledButtonProps {
  readonly disabled?: false
  readonly disabledReason?: never
  readonly disabledReasonId?: never
}

interface DisabledButtonProps {
  readonly disabled: true
  readonly disabledReason: string
  readonly disabledReasonId: string
}

export type ActionButtonProps = ActionContentProps &
  Pick<ButtonHTMLAttributes<HTMLButtonElement>, 'form' | 'name' | 'onClick' | 'type' | 'value'> &
  (EnabledButtonProps | DisabledButtonProps) & {
    readonly variant?: RoutineActionVariant
  }

interface CallAvailabilityProps {
  readonly availability: string
  readonly availabilityId: string
}

interface CallWithoutAvailabilityProps {
  readonly availability?: never
  readonly availabilityId?: never
}

export type CallActionProps = (CallAvailabilityProps | CallWithoutAvailabilityProps) & {
  readonly displayNumber: string
  readonly purpose: string
  readonly variant?: 'emergency' | 'secondary'
}

export interface EmergencyActionProps {
  readonly compact?: boolean
  readonly href: string
  readonly label: string
}

export interface TextLinkProps
  extends Pick<AnchorHTMLAttributes<HTMLAnchorElement>, 'download' | 'rel'> {
  readonly href: string
  readonly label: string
}

export function ActionGroup({ children, label }: ActionGroupProps) {
  return (
    <div
      aria-label={label}
      className={styles.group}
      data-action-group
      role={label ? 'group' : undefined}
    >
      {children}
    </div>
  )
}

export function ActionLink({
  download,
  href,
  icon = 'arrow-right',
  iconPosition = 'end',
  label,
  rel,
  variant = 'primary',
}: ActionLinkProps) {
  return (
    <a
      className={`${styles.action} ${styles[variant]}`}
      data-action-link
      download={download}
      href={href}
      rel={rel}
    >
      <ActionContent icon={icon} iconPosition={iconPosition} label={label} />
    </a>
  )
}

export function ActionButton({
  disabled = false,
  disabledReason,
  disabledReasonId,
  form,
  icon,
  iconPosition = 'end',
  label,
  name,
  onClick,
  type = 'button',
  value,
  variant = 'primary',
}: ActionButtonProps) {
  return (
    <div className={styles.controlStack}>
      <button
        aria-describedby={disabledReasonId}
        className={`${styles.action} ${styles[variant]}`}
        data-action-button
        disabled={disabled}
        form={form}
        name={name}
        onClick={onClick}
        type={type}
        value={value}
      >
        <ActionContent icon={icon} iconPosition={iconPosition} label={label} />
      </button>
      {disabledReason ? (
        <p className={styles.disabledReason} id={disabledReasonId}>
          {disabledReason}
        </p>
      ) : null}
    </div>
  )
}

export function CallAction({
  availability,
  availabilityId,
  displayNumber,
  purpose,
  variant = 'secondary',
}: CallActionProps) {
  const telephoneValue = normalizeTelephoneNumber(displayNumber)
  const isEmergency = variant === 'emergency'

  return (
    <div className={styles.controlStack}>
      <a
        aria-describedby={availabilityId}
        className={`${styles.action} ${styles[variant]}`}
        data-call-action
        data-call-value={telephoneValue}
        data-emergency-action={isEmergency ? '' : undefined}
        data-experience-level={isEmergency ? '0' : undefined}
        href={`tel:${telephoneValue}`}
      >
        {isEmergency ? <span className={styles.emergencyWord}>Emergency</span> : null}
        <span className={styles.callCopy}>
          <span className={styles.purpose}>{purpose}</span>
          <span className={styles.number} data-call-number>
            {displayNumber}
          </span>
        </span>
        <Icon name="phone" />
      </a>
      {availability ? (
        <p className={styles.availability} id={availabilityId}>
          {availability}
        </p>
      ) : null}
    </div>
  )
}

export function EmergencyAction({ compact = false, href, label }: EmergencyActionProps) {
  return (
    <a
      aria-label={compact ? `Emergency: ${label}` : undefined}
      className={`${styles.action} ${styles.emergency} ${compact ? styles.emergencyNavigation : ''}`}
      data-emergency-action
      data-experience-level="0"
      href={href}
    >
      <span className={styles.emergencyWord}>Emergency</span>
      {compact ? null : <span className={styles.actionCopy}>{label}</span>}
      <Icon name="emergency" />
    </a>
  )
}

export function TextLink({ download, href, label, rel }: TextLinkProps) {
  return (
    <a className={styles.textLink} download={download} href={href} rel={rel}>
      {label}
    </a>
  )
}

export function normalizeTelephoneNumber(displayNumber: string) {
  const telephoneValue = displayNumber.replace(/[\s().-]/gu, '')

  if (!/^\+[1-9]\d{6,14}$/u.test(telephoneValue)) {
    throw new Error('CallAction requires a visible international number that normalizes to E.164')
  }

  return telephoneValue
}

function ActionContent({ icon, iconPosition, label }: Required<Pick<ActionContentProps, 'iconPosition' | 'label'>> & Pick<ActionContentProps, 'icon'>) {
  return (
    <>
      {icon && iconPosition === 'start' ? <Icon name={icon} /> : null}
      <span className={styles.actionCopy}>{label}</span>
      {icon && iconPosition === 'end' ? <Icon name={icon} /> : null}
    </>
  )
}
