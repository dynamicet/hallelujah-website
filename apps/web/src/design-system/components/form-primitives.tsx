import type {
  InputHTMLAttributes,
  ReactNode,
  TextareaHTMLAttributes,
} from 'react'

import styles from './form-primitives.module.css'

export interface FormPrimitiveFormProps {
  readonly action: string
  readonly busy?: boolean
  readonly children: ReactNode
  readonly descriptionId?: string
  readonly id: string
  readonly label: string
  readonly method?: 'get' | 'post'
}

export interface FieldError {
  readonly id: string
  readonly message: string
  readonly visible?: boolean
}

interface FieldCopyProps {
  readonly disabled?: boolean
  readonly error?: FieldError
  readonly hint?: string
  readonly hintId?: string
  readonly id: string
  readonly label: string
  readonly optionalLabel?: string
  readonly required?: boolean
}

export interface TextFieldProps extends FieldCopyProps {
  readonly autoComplete?: InputHTMLAttributes<HTMLInputElement>['autoComplete']
  readonly defaultValue?: string
  readonly inputMode?: InputHTMLAttributes<HTMLInputElement>['inputMode']
  readonly maximumLength?: number
  readonly minimumLength?: number
  readonly name: string
  readonly pattern?: string
  readonly placeholder?: string
  readonly type?: 'date' | 'email' | 'tel' | 'text' | 'url'
}

export interface TextAreaFieldProps extends FieldCopyProps {
  readonly autoComplete?: TextareaHTMLAttributes<HTMLTextAreaElement>['autoComplete']
  readonly defaultValue?: string
  readonly maximumLength?: number
  readonly name: string
  readonly rows?: number
}

export interface SelectOption {
  readonly disabled?: boolean
  readonly label: string
  readonly value: string
}

export interface SelectFieldProps extends FieldCopyProps {
  readonly defaultValue?: string
  readonly name: string
  readonly options: readonly SelectOption[]
}

export interface ChoiceOption {
  readonly description?: string
  readonly disabled?: boolean
  readonly label: string
  readonly value: string
}

export interface ChoiceGroupProps {
  readonly error?: FieldError
  readonly hint?: string
  readonly hintId?: string
  readonly id: string
  readonly legend: string
  readonly name: string
  readonly options: readonly ChoiceOption[]
  readonly required?: boolean
  readonly selectedValues?: readonly string[]
  readonly type: 'checkbox' | 'radio'
}

export interface ErrorSummaryItem {
  readonly fieldId: string
  readonly label: string
  readonly message: string
}

export interface ErrorSummaryProps {
  readonly heading: string
  readonly id: string
  readonly items: readonly ErrorSummaryItem[]
  readonly visible?: boolean
}

interface BaseFormStatusProps {
  /** Use focus when the controller moves focus here instead of announcing a live update. */
  readonly announcement?: 'focus' | 'live'
  readonly children: ReactNode
  readonly heading: string
  readonly id?: string
  readonly visible?: boolean
}

interface PendingFormStatusProps extends BaseFormStatusProps {
  readonly kind: 'pending'
}

interface ReceiptFormStatusProps extends BaseFormStatusProps {
  readonly authoritative: true
  readonly kind: 'receipt'
  readonly reference: string
}

interface WarningFormStatusProps extends BaseFormStatusProps {
  readonly acceptedReference?: string
  readonly kind: 'warning'
}

interface FailureFormStatusProps extends BaseFormStatusProps {
  readonly kind: 'failure'
}

export type FormStatusProps =
  | FailureFormStatusProps
  | PendingFormStatusProps
  | ReceiptFormStatusProps
  | WarningFormStatusProps

export interface FormActionsProps {
  readonly children: ReactNode
  readonly label?: string
}

export interface FormSubmitButtonProps {
  readonly describedBy?: string
  readonly disabled?: boolean
  readonly form?: string
  readonly label: string
  readonly name?: string
  readonly pending?: boolean
  readonly pendingLabel?: string
  readonly value?: string
}

export function FormPrimitiveForm({
  action,
  busy = false,
  children,
  descriptionId,
  id,
  label,
  method = 'post',
}: FormPrimitiveFormProps) {
  return (
    <form
      action={action}
      aria-busy={busy || undefined}
      aria-describedby={descriptionId}
      aria-label={label}
      className={styles.form}
      data-form-primitive
      id={id}
      method={method}
    >
      {children}
    </form>
  )
}

export function TextField({
  disabled = false,
  autoComplete,
  defaultValue,
  error,
  hint,
  hintId,
  id,
  inputMode,
  label,
  maximumLength,
  minimumLength,
  name,
  optionalLabel = 'Optional',
  pattern,
  placeholder,
  required = false,
  type = 'text',
}: TextFieldProps) {
  const describedBy = describedByIds(hint && hintId, error?.visible && error.id)

  return (
    <div className={styles.field} data-form-field>
      <FieldLabel id={id} label={label} optionalLabel={optionalLabel} required={required} />
      <FieldHint hint={hint} hintId={hintId} />
      <input
        aria-describedby={describedBy}
        aria-invalid={error?.visible ? true : undefined}
        autoComplete={autoComplete}
        className={styles.control}
        data-form-control
        disabled={disabled}
        defaultValue={defaultValue}
        id={id}
        inputMode={inputMode}
        maxLength={maximumLength}
        minLength={minimumLength}
        name={name}
        pattern={pattern}
        placeholder={placeholder}
        required={required}
        type={type}
      />
      <FieldErrorMessage error={error} />
    </div>
  )
}

export function TextAreaField({
  disabled = false,
  autoComplete,
  defaultValue,
  error,
  hint,
  hintId,
  id,
  label,
  maximumLength,
  name,
  optionalLabel = 'Optional',
  required = false,
  rows = 5,
}: TextAreaFieldProps) {
  const describedBy = describedByIds(hint && hintId, error?.visible && error.id)

  return (
    <div className={styles.field} data-form-field>
      <FieldLabel id={id} label={label} optionalLabel={optionalLabel} required={required} />
      <FieldHint hint={hint} hintId={hintId} />
      <textarea
        aria-describedby={describedBy}
        aria-invalid={error?.visible ? true : undefined}
        autoComplete={autoComplete}
        className={`${styles.control} ${styles.textarea}`}
        data-form-control
        disabled={disabled}
        defaultValue={defaultValue}
        id={id}
        maxLength={maximumLength}
        name={name}
        required={required}
        rows={rows}
      />
      <FieldErrorMessage error={error} />
    </div>
  )
}

export function SelectField({
  disabled = false,
  defaultValue,
  error,
  hint,
  hintId,
  id,
  label,
  name,
  optionalLabel = 'Optional',
  options,
  required = false,
}: SelectFieldProps) {
  const describedBy = describedByIds(hint && hintId, error?.visible && error.id)

  return (
    <div className={styles.field} data-form-field>
      <FieldLabel id={id} label={label} optionalLabel={optionalLabel} required={required} />
      <FieldHint hint={hint} hintId={hintId} />
      <select
        aria-describedby={describedBy}
        aria-invalid={error?.visible ? true : undefined}
        className={styles.control}
        data-form-control
        disabled={disabled}
        defaultValue={defaultValue}
        id={id}
        name={name}
        required={required}
      >
        {options.map((option) => (
          <option disabled={option.disabled} key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <FieldErrorMessage error={error} />
    </div>
  )
}

export function ChoiceGroup({
  error,
  hint,
  hintId,
  id,
  legend,
  name,
  options,
  required = false,
  selectedValues = [],
  type,
}: ChoiceGroupProps) {
  const selected = new Set(selectedValues)
  const describedBy = describedByIds(hint && hintId, error?.visible && error.id)

  return (
    <fieldset
      aria-describedby={describedBy}
      aria-invalid={error?.visible ? true : undefined}
      className={styles.choiceGroup}
      data-choice-group
      id={id}
    >
      <legend>
        <span>{legend}</span>
        <RequirementCopy required={required} />
      </legend>
      <FieldHint hint={hint} hintId={hintId} />
      <div className={styles.choices}>
        {options.map((option, index) => {
          const optionId = `${id}-${option.value}`
          return (
            <label className={styles.choice} htmlFor={optionId} key={option.value}>
              <input
                defaultChecked={selected.has(option.value)}
                disabled={option.disabled}
                id={optionId}
                name={name}
                required={required && type === 'radio' && index === 0}
                type={type}
                value={option.value}
              />
              <span>
                <span className={styles.choiceLabel}>{option.label}</span>
                {option.description ? (
                  <span className={styles.choiceDescription}>{option.description}</span>
                ) : null}
              </span>
            </label>
          )
        })}
      </div>
      <FieldErrorMessage error={error} />
    </fieldset>
  )
}

export function ErrorSummary({
  heading,
  id,
  items,
  visible = true,
}: ErrorSummaryProps) {
  if (items.length === 0) return null

  const headingId = `${id}-heading`
  return (
    <section
      aria-labelledby={headingId}
      className={styles.errorSummary}
      data-error-summary
      hidden={!visible}
      id={id}
      role="alert"
      tabIndex={-1}
    >
      <h3 id={headingId}>{heading}</h3>
      <ul>
        {items.map((item) => (
          <li key={`${item.fieldId}-${item.message}`}>
            <a href={`#${item.fieldId}`}>
              <span className={styles.errorSummaryLabel}>{item.label}:</span> {item.message}
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}

export function FormStatus(props: FormStatusProps) {
  const headingId = props.id ? `${props.id}-heading` : undefined
  const role = props.announcement === 'focus' ? 'group' : props.kind === 'failure' ? 'alert' : 'status'
  const reference =
    props.kind === 'receipt'
      ? props.reference
      : props.kind === 'warning'
        ? props.acceptedReference
        : undefined

  return (
    <section
      aria-atomic={role === 'group' ? undefined : true}
      aria-labelledby={role === 'group' ? undefined : headingId}
      aria-live={role === 'group' ? undefined : role === 'alert' ? 'assertive' : 'polite'}
      className={`${styles.status} ${styles[props.kind]}`}
      data-authoritative-acceptance={props.kind === 'receipt' ? 'true' : undefined}
      data-form-status={props.kind}
      hidden={props.visible === false}
      id={props.id}
      role={role}
    >
      <h3
        aria-describedby={props.announcement === 'focus' && props.id ? `${props.id}-description` : undefined}
        id={headingId}
        tabIndex={props.announcement === 'focus' ? -1 : undefined}
      >{props.heading}</h3>
      <div id={props.id ? `${props.id}-description` : undefined}>{props.children}</div>
      {reference ? (
        <p className={styles.reference}>
          <span>{props.kind === 'warning' ? 'Accepted reference' : 'Reference'}</span>{' '}
          <strong>{reference}</strong>
        </p>
      ) : null}
    </section>
  )
}

export function FormActions({ children, label }: FormActionsProps) {
  return (
    <div
      aria-label={label}
      className={styles.actions}
      data-form-actions
      role={label ? 'group' : undefined}
    >
      {children}
    </div>
  )
}

export function FormSubmitButton({
  describedBy,
  disabled = false,
  form,
  label,
  name,
  pending = false,
  pendingLabel = 'Submitting…',
  value,
}: FormSubmitButtonProps) {
  return (
    <button
      aria-describedby={describedBy}
      className={styles.submit}
      data-form-submit
      disabled={disabled || pending}
      form={form}
      name={name}
      type="submit"
      value={value}
    >
      {pending ? pendingLabel : label}
    </button>
  )
}

function FieldLabel({
  id,
  label,
  optionalLabel,
  required,
}: Pick<FieldCopyProps, 'id' | 'label' | 'optionalLabel' | 'required'>) {
  return (
    <label className={styles.label} htmlFor={id}>
      <span>{label}</span>
      <RequirementCopy optionalLabel={optionalLabel} required={required} />
    </label>
  )
}

function RequirementCopy({
  optionalLabel = 'Optional',
  required = false,
}: Pick<FieldCopyProps, 'optionalLabel' | 'required'>) {
  return (
    <span className={styles.requirement}>{required ? 'Required' : optionalLabel}</span>
  )
}

function FieldHint({ hint, hintId }: Pick<FieldCopyProps, 'hint' | 'hintId'>) {
  return hint && hintId ? (
    <p className={styles.hint} id={hintId}>
      {hint}
    </p>
  ) : null
}

function FieldErrorMessage({ error }: Pick<FieldCopyProps, 'error'>) {
  return error ? (
    <p className={styles.fieldError} data-field-error hidden={!error.visible} id={error.id}>
      <strong>Error:</strong> {error.message}
    </p>
  ) : null
}

function describedByIds(...ids: readonly (false | string | undefined)[]) {
  const value = ids.filter((id): id is string => Boolean(id)).join(' ')
  return value || undefined
}
