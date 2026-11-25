'use client'

import { useEffect, useRef, useState, useSyncExternalStore, type FormEvent } from 'react'
import { appointmentCopy as copy } from '@/appointment/copy'
import { ErrorSummary, Icon, TextField } from '@/design-system/components'
import { parseAppointmentSubmission, type AppointmentValidationIssue } from '@/appointment/schema'
import type { AppointmentRequestInput, SendAppointmentRequest } from '@/appointment/request-form'
import { previewAppointmentRequest, type AppointmentPreviewScenario } from '@/demo/appointment-request-preview'
import { hospitalContact } from './hospital-contact'
import { InterfaceLink as Link, InterfaceText } from './interface-language'
import { CarePreferencePicker } from './care-preference-picker'
import styles from './appointment-request.module.css'

export type CarePreference = Readonly<{ kind: 'doctor' | 'service'; id: string; label: string }>

type ErrorField = 'full-name' | 'phone' | 'care-preference'
type FieldErrors = Partial<Record<ErrorField, string>>
type RequestState = AppointmentPreviewScenario

type FormProps = Readonly<{
  doctors: readonly CarePreference[]
  services: readonly CarePreference[]
  initialPreference?: CarePreference
  selectionNotice?: string
  context?: string
}>

const fieldLabels: Record<ErrorField, string> = {
  'full-name': 'Full name',
  phone: 'Phone number',
  'care-preference': 'Doctor or service preference',
}
const fieldOrder = Object.keys(fieldLabels) as ErrorField[]
const noSubscription = () => () => {}
const readySnapshot = () => true
const serverSnapshot = () => false

function appointmentErrors(issues: readonly AppointmentValidationIssue[]): FieldErrors {
  const errors: FieldErrors = {}
  for (const { field } of issues) {
    if (field === 'full_name') errors['full-name'] = 'Enter your full name.'
    if (field === 'phone') errors.phone = 'Enter a phone number reception can call.'
    if (field === 'doctor_id' || field === 'service_id' || field === 'care_route') {
      errors['care-preference'] = 'Choose another preference or leave it blank.'
    }
  }
  return errors
}

export function AppointmentRequestPreview({ scenario, startEditing, ...props }: FormProps & {
  scenario: AppointmentPreviewScenario
  startEditing: boolean
}) {
  const attempt = useRef(0)
  return <AppointmentRequestForm {...props} initialState={startEditing ? 'editing' : scenario}
    sendRequest={(input) => {
      const firstAttempt = startEditing && attempt.current++ === 0
      const outcome = firstAttempt || scenario === 'duplicate'
        ? scenario : scenario === 'unknown' ? 'duplicate' : 'editing'
      return previewAppointmentRequest(outcome)(input)
    }} />
}

function AppointmentRequestForm({
  doctors, services, initialPreference, selectionNotice, context, sendRequest, initialState,
}: FormProps & {
  sendRequest: SendAppointmentRequest
  initialState: RequestState
}) {
  const ready = useSyncExternalStore(noSubscription, readySnapshot, serverSnapshot)
  const [preference, setPreference] = useState(initialPreference)
  const [state, setState] = useState(initialState)
  const [errors, setErrors] = useState<FieldErrors>(initialState === 'validation' ? {
    phone: 'Enter a phone number reception can call.',
  } : {})
  const [reference, setReference] = useState('HH-1042')
  const formRef = useRef<HTMLFormElement>(null)
  const statusRef = useRef<HTMLHeadingElement>(null)
  const focusTarget = useRef<'error' | 'status' | null>(null)
  const submitting = useRef(false)
  const received = state === 'receipt' || state === 'duplicate' || state === 'delivery-warning'
  const failure = state === 'known-failure' || state === 'unknown'
  const pending = state === 'pending'

  useEffect(() => {
    switch (focusTarget.current) {
      case 'error': formRef.current?.querySelector<HTMLElement>('#appointment-error-summary')?.focus(); break
      case 'status': statusRef.current?.focus(); break
    }
    focusTarget.current = null
  })


  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!ready || pending || submitting.current) return

    const data = new FormData(event.currentTarget)
    const fields = {
      full_name: String(data.get('full_name') ?? ''),
      phone: String(data.get('phone') ?? ''),
      // The submit action acknowledges the contact notice displayed directly above it.
      privacy_acknowledged: true,
    }
    const input: AppointmentRequestInput = preference?.kind === 'doctor'
      ? { ...fields, care_route: 'doctor', doctor_id: preference.id }
      : preference?.kind === 'service' ? { ...fields, care_route: 'service', service_id: preference.id }
        : { ...fields, care_route: 'not_sure' }
    const validated = parseAppointmentSubmission(input)
    if (!validated.ok) {
      const next = appointmentErrors(validated.issues)
      focusTarget.current = 'error'
      setErrors(next)
      setState('validation')
      return
    }

    submitting.current = true
    setErrors({})
    setState('pending')
    try {
      const result = await sendRequest(input)
      if (result.status === 'rejected') {
        const next = appointmentErrors(result.issues)
        if (Object.keys(next).length) {
          focusTarget.current = 'error'
          setErrors(next)
          setState('validation')
          return
        }
      }
      focusTarget.current = 'status'
      if (result.status === 'accepted' || result.status === 'reconciled') {
        setReference(result.reference)
        setState(result.status === 'reconciled' ? 'duplicate' : 'receipt')
      } else {
        setState(result.status === 'unknown' ? 'unknown' : 'known-failure')
      }
    } catch {
      focusTarget.current = 'status'
      setState('unknown')
    } finally {
      submitting.current = false
    }
  }

  const errorItems = fieldOrder.flatMap((fieldId) => errors[fieldId] ? [{
    fieldId, label: fieldLabels[fieldId], message: errors[fieldId],
  }] : [])
  const error = (field: ErrorField) => errors[field]
    ? { id: `${field}-error`, message: errors[field], visible: true }
    : undefined

  return <div className={styles.formPanel} data-appointment-request data-appointment-state={state}>
    {received ? <section className={styles.receipt} aria-labelledby="appointment-result-title">
      <h2 id="appointment-result-title" tabIndex={-1} ref={statusRef}>
        <InterfaceText>{copy.confirmation}</InterfaceText>
      </h2>
      <p><InterfaceText>Request reference</InterfaceText> <strong>{reference}</strong></p>
      <p><InterfaceText>{copy.receipt}</InterfaceText></p>
    </section> : state === 'workflow-unavailable' ? <section aria-labelledby="appointment-unavailable-title">
      <h2 id="appointment-unavailable-title">Online requests are unavailable</h2>
      <p>Please <a className="text-link" href={hospitalContact.phoneHref}>call reception</a> to arrange an appointment.</p>
    </section> : <>
      <noscript><p>Enable JavaScript to use the form or <a href={hospitalContact.phoneHref}>call reception</a>.</p></noscript>
      <form ref={formRef} id="appointment-request-form" aria-label="Appointment request"
        method="post" noValidate onSubmit={submit}>
        {errorItems.length ? <ErrorSummary id="appointment-error-summary" heading="Check your details" items={errorItems} /> : null}
        {failure ? <div className={styles.failure}>
          <h2 tabIndex={-1} ref={statusRef}>{state === 'unknown' ? 'We couldn’t verify your request' : 'We couldn’t send your request'}</h2>
          <p>{state === 'unknown' ? 'Try again to check the result, or ' : 'Your details are still here. Try again, or '}<a href={hospitalContact.phoneHref}>call reception</a>.</p>
        </div> : null}
        <fieldset className={styles.fields} disabled={!ready || pending}>
          <TextField id="full-name" name="full_name" label="Full name" required autoComplete="name"
            maximumLength={120} error={error('full-name')} />
          <TextField id="phone" name="phone" label="Phone number" type="tel" required autoComplete="tel"
            maximumLength={32} error={error('phone')} />
          <div className={styles.preference}>
            {selectionNotice && !preference ? <p>{selectionNotice}</p> : null}
            <div className={styles.options} id="appointment-preference-options">
              <CarePreferencePicker doctors={doctors} services={services} value={preference} error={errors['care-preference']}
                onChange={next => {
                  setPreference(next)
                  if (errors['care-preference']) setErrors({ ...errors, 'care-preference': undefined })
                }} />
              {context && preference && preference.id === initialPreference?.id && <small>You were viewing {context}. Your request includes your doctor preference.</small>}
              {errors['care-preference'] ? <p className={styles.fieldError} id="care-preference-error">{errors['care-preference']}</p> : null}
            </div>
          </div>
          <div className={styles.privacy}>
            <InterfaceText>{copy.acknowledgment}</InterfaceText>{' '}
            <Link className="text-link" href="/privacy">Privacy notice</Link>
          </div>
          <button type="submit" className={`solid-button blue-button ${styles.submit}`}>
            <InterfaceText>{pending ? copy.pending : failure ? 'Try again' : copy.submit}</InterfaceText>
            <Icon name="arrow-right" />
          </button>
        </fieldset>
        <span role="status" className={styles.srOnly}>{pending ? copy.pending : ''}</span>
      </form>
    </>}
  </div>
}
