import { InterfaceCopy, InterfaceText, InterfaceLink as Link } from '@/website/interface-language'

import type { ReactNode } from 'react'

import {
  ChoiceGroup,
  FormActions,
  FormPrimitiveForm,
  FormStatus,
  FormSubmitButton,
  SelectField,
  SiteShell,
  TextField,
  type SelectOption,
  type SiteShellProps,
} from '../components'

import styles from './appointment-template.module.css'

export type AppointmentReviewStateKind =
  | 'delivery-warning'
  | 'duplicate'
  | 'editing'
  | 'known-failure'
  | 'pending'
  | 'prepared'
  | 'receipt'
  | 'unknown'
  | 'validation'
  | 'workflow-unavailable'

type AppointmentField =
  | 'care-route'
  | 'doctor-id'
  | 'full-name'
  | 'phone'
  | 'preferred-date'
  | 'privacy-acknowledged'
  | 'service-id'

export interface AppointmentTemplateProps {
  readonly doctorIdentity?: ReactNode
  readonly visitType?: ReactNode
  readonly description?: string
  readonly doctorOptions: readonly SelectOption[]
  readonly eyebrow: string
  readonly privacyDisclosure: ReactNode
  readonly recipientLabel: string
  readonly serviceOptions: readonly SelectOption[]
  readonly shell: Omit<SiteShellProps, 'breadcrumbs' | 'children'>
  readonly state: {
    readonly errors?: readonly AppointmentField[]
    readonly interactive?: boolean
    readonly localSimulation?: boolean
    readonly kind: AppointmentReviewStateKind
    readonly outcome?: AppointmentReviewStateKind
    readonly selectedCareRoute?: 'doctor' | 'not_sure' | 'service'
    readonly selectedDoctorId?: string
    readonly selectedServiceId?: string
    readonly selectionNotice?: string
    readonly specimenReference: string
  }
  readonly title: string
  readonly warning: string
}

const errorCopy: Readonly<Record<AppointmentField, { label: string; message: string }>> = {
  'care-route': { label: 'Type of care', message: 'Choose one type of care.' },
  'doctor-id': { label: 'Doctor', message: 'Choose a doctor.' },
  'full-name': { label: 'Full name', message: 'Enter a name between 2 and 120 characters.' },
  phone: { label: 'Telephone', message: 'Enter a telephone number with 7 to 15 digits, including the country code.' },
  'preferred-date': { label: 'Preferred date', message: 'Choose a valid date within the next 365 days or leave it empty.' },
  'privacy-acknowledged': { label: 'Contact permission', message: 'Confirm that you agree to be contacted about this request.' },
  'service-id': { label: 'Specialty or service', message: 'Choose an available specialty or service for this doctor.' },
}

function fieldError(field: AppointmentField, visible: boolean) {
  return {
    id: `${field}-error`,
    message: errorCopy[field].message,
    visible,
  }
}

function AppointmentErrorSummary({ errors }: { readonly errors: readonly AppointmentField[] }) {
  const visible = errors.length > 0
  return (
    <InterfaceCopy><section
      className={styles.errorSummary}
      data-error-summary
      hidden={!visible}
      id="appointment-error-summary"
      role="group"
    >
      <h3 aria-describedby="appointment-error-count" id="appointment-error-summary-heading" tabIndex={-1}>Check the form</h3>
      <p data-error-count id="appointment-error-count">There {errors.length === 1 ? 'is 1 problem' : `are ${errors.length} problems`} to correct.</p>
      <ul>
        {(Object.keys(errorCopy) as AppointmentField[]).map((field) => (
          <li data-error-item={field} hidden={!errors.includes(field)} key={field}>
            <a href={`#${field}`}>
              <strong>{errorCopy[field].label}:</strong> {errorCopy[field].message}
            </a>
          </li>
        ))}
      </ul>
    </section></InterfaceCopy>
  )
}

function AppointmentStatePanels({
  kind,
  localSimulation,
  specimenReference,
}: {
  readonly kind: AppointmentReviewStateKind
  readonly localSimulation?: boolean
  readonly specimenReference: string
}) {
  if (!localSimulation) return (
    <InterfaceCopy><div className={styles.stateStack} data-appointment-state-panels>
      {(['pending', 'known-failure', 'unknown', 'duplicate', 'receipt', 'delivery-warning'] as const).map((name) => (
        <div className={styles.statePanel} data-appointment-state-panel={name} key={name}>
          <FormStatus
            announcement={name === 'pending' ? 'live' : 'focus'}
            heading={name === 'pending' ? 'Checking the form' : name === 'known-failure' ? 'Nothing was accepted' : 'Appointment requests unavailable'}
            id={`appointment-${name}`}
            kind={name === 'pending' ? 'pending' : name === 'known-failure' ? 'failure' : 'warning'}
            visible={kind === name}
          ><p>No appointment request was sent and no booking is confirmed.</p></FormStatus>
        </div>
      ))}
    </div></InterfaceCopy>
  )
  return (
    <InterfaceCopy><div className={styles.stateStack} data-appointment-state-panels>
      <div className={styles.statePanel} data-appointment-state-panel="prepared">
        <FormStatus announcement="focus" heading="Your details are ready" id="appointment-prepared" kind="warning" visible={kind === 'prepared'}>
          <p>Your choices have been checked. <Link href="/#home-directions">Contact the hospital</Link> to arrange your appointment request.</p>
          <p>No request has been sent. You can still edit your details here.</p>
        </FormStatus>
      </div>
      <div className={styles.statePanel} data-appointment-state-panel="pending">
        <FormStatus heading="Completing your request…" id="appointment-pending" kind="pending" visible={kind === 'pending'}>
          <p>Please wait a moment.</p>
        </FormStatus>
      </div>
      <div className={styles.statePanel} data-appointment-state-panel="known-failure">
        <FormStatus announcement="focus" heading="Please try again" id="appointment-known-failure" kind="failure" visible={kind === 'known-failure'}>
          <p>Your details are still here. Review them or try again.</p>
          <div className={styles.statusActions}><button data-journey-correct type="button"><InterfaceText>Edit your details</InterfaceText></button></div>
        </FormStatus>
      </div>
      <div className={styles.statePanel} data-appointment-state-panel="unknown">
        <FormStatus announcement="focus" heading="Check your request status" id="appointment-unknown" kind="warning" visible={kind === 'unknown'}>
          <p>Check for an existing request before trying again.</p>
          <div className={styles.statusActions}>
            <button data-reconcile="found" type="button"><InterfaceText>View existing request</InterfaceText></button>
            <button data-reconcile="missing" type="button"><InterfaceText>Return to review</InterfaceText></button>
          </div>
        </FormStatus>
      </div>
      <div className={styles.statePanel} data-appointment-state-panel="duplicate">
        <FormStatus announcement="focus" heading="You already have a request" id="appointment-duplicate" kind="warning" visible={kind === 'duplicate'}>
          <p>View your existing request to avoid starting another.</p>
          <div className={styles.statusActions}><button data-reconcile="found" type="button"><InterfaceText>View your request</InterfaceText></button></div>
        </FormStatus>
      </div>
      <div className={styles.statePanel} data-appointment-state-panel="receipt">
        <FormStatus announcement="focus" heading="Example request outcome" id="appointment-receipt" kind="warning" visible={kind === 'receipt'}>
          <p>Example reference: <strong>{specimenReference}</strong>. No request has been sent.</p>
          <p><Link href="/#home-directions">Contact the hospital</Link> to confirm your appointment time.</p>
          <div className={styles.statusActions}><button data-journey-restart type="button"><InterfaceText>Start a new request</InterfaceText></button></div>
        </FormStatus>
      </div>
      <div className={styles.statePanel} data-appointment-state-panel="delivery-warning">
        <FormStatus announcement="focus" heading="Example message outcome" id="appointment-delivery-warning" kind="warning" visible={kind === 'delivery-warning'}>
          <p>Keep your reference: <strong>{specimenReference}</strong>. <Link href="/#home-directions">Contact the hospital</Link> to check your appointment time.</p>
          <div className={styles.statusActions}><button data-journey-restart type="button"><InterfaceText>Start a new request</InterfaceText></button></div>
        </FormStatus>
      </div>
    </div></InterfaceCopy>
  )
}

function AppointmentForm({
  doctorIdentity,
  doctorOptions,
  errors,
  localSimulation,
  privacyDisclosure,
  selectedCareRoute,
  selectedDoctorId,
  selectedServiceId,
  selectionNotice,
  serviceOptions,
  specimenReference,
  state,
  visitType,
}: {
  readonly doctorIdentity?: ReactNode
  readonly doctorOptions: readonly SelectOption[]
  readonly errors: readonly AppointmentField[]
  readonly localSimulation?: boolean
  readonly privacyDisclosure: ReactNode
  readonly selectedCareRoute?: 'doctor' | 'not_sure' | 'service'
  readonly selectedDoctorId?: string
  readonly selectedServiceId?: string
  readonly selectionNotice?: string
  readonly serviceOptions: readonly SelectOption[]
  readonly specimenReference: string
  readonly state: AppointmentReviewStateKind
  readonly visitType?: ReactNode
}) {
  const hasError = (field: AppointmentField) => errors.includes(field)
  const hasSelection = Boolean(selectedDoctorId || selectedServiceId)
  const selectedCare = [doctorOptions.find((option) => option.value && option.value === selectedDoctorId)?.label,
    serviceOptions.find((option) => option.value && option.value === selectedServiceId)?.label].filter(Boolean).join(' · ')
  const doctorSelector = (<div className={styles.careSelector} data-care-selector="doctor" hidden={selectedCareRoute === 'not_sure'}>
            <SelectField
              defaultValue={selectedDoctorId ?? ''}
              error={fieldError('doctor-id', hasError('doctor-id'))}
              hint="You can leave this blank when choosing a specialty or service."
              hintId="doctor-id-hint"
              id="doctor-id"
              label="Doctor"
              name="doctor_id"
              options={doctorOptions}
              required={selectedCareRoute === 'doctor'}
            />
          </div>)
  const serviceSelector = (<div className={styles.careSelector} data-care-selector="service" hidden={selectedCareRoute === 'not_sure'}>
            <SelectField
              defaultValue={selectedServiceId ?? ''}
              error={fieldError('service-id', hasError('service-id'))}
              hint="You can leave this blank when choosing a doctor."
              hintId="service-id-hint"
              id="service-id"
              label="Specialty or service"
              name="service_id"
              options={serviceOptions}
              required={selectedCareRoute === 'service'}
            />
          </div>)
  return (
    <InterfaceCopy><>
    {localSimulation ? <noscript><p className={styles.noScriptBoundary}>Enable JavaScript to use this form, or <Link href="/#home-directions">contact the hospital</Link>.</p></noscript> : null}
    <div data-appointment-safe-form inert={localSimulation || undefined}>
    <FormPrimitiveForm
      action="/controlled-appointment-submission-disabled"
      busy={state === 'pending'}
      descriptionId={localSimulation ? undefined : 'appointment-form-boundary'}
      id="appointment-request-form"
      label="Appointment request form"
      method="post"
    >
      <div data-appointment-section="A3">
        <AppointmentErrorSummary errors={errors} />
      </div>

      {localSimulation ? <nav aria-label="Appointment progress" className={styles.progress} data-journey-progress hidden>
        <ol>{['Your care', 'Your details', 'Review'].map((label, index) => <li key={label}><button aria-current={index === 0 ? 'step' : undefined} data-journey-step={index} type="button"><span aria-hidden="true" className={styles.stepNumber}>{index + 1}</span><span>{label}</span></button></li>)}</ol>
      </nav> : null}

      <section aria-labelledby="appointment-details-title" className={styles.formSection} data-appointment-section="A4">
        <div className={styles.sectionHeading}>
          <h2 data-journey-title id="appointment-details-title" tabIndex={-1}>{localSimulation ? 'Choose your care' : 'Request details'}</h2>
          <p data-journey-description>{localSimulation ? '' : 'Do not enter personal or medical information.'}</p>
        </div>

        <div className={styles.careGroup} data-journey-group="care">
          {localSimulation ? visitType : null}
          {localSimulation ? <div className={`${styles.selectedCare} ${styles.careSummary}`} data-care-summary hidden={!hasSelection}>
            <strong data-journey-value="care">{selectedCare}</strong>
            <div className={styles.reviewActions}>
              {doctorIdentity}
              <button aria-controls="appointment-care-editor" aria-expanded={!hasSelection} className={styles.textButton} data-care-edit-toggle type="button">Change care</button>
            </div>
          </div> : null}
          <p role="status" data-selection-notice hidden={!selectionNotice}>{selectionNotice}</p>
          <div className={styles.careEditor} data-care-editor hidden={localSimulation && hasSelection} id="appointment-care-editor">
          <ChoiceGroup
            error={fieldError('care-route', hasError('care-route'))}
            hint={localSimulation ? undefined : 'Choose the option that feels right for you.'}
            hintId="care-route-hint"
            id="care-route"
            legend="Type of care"
            name="care_route"
            options={[
              { label: 'A specific doctor', value: 'doctor' },
              { label: 'A specialty or service', value: 'service' },
              { label: 'Help me choose', value: 'not_sure' },
            ]}
            required
            selectedValues={selectedCareRoute ? [selectedCareRoute] : []}
            type="radio"
          />

          {localSimulation ? <section aria-label="Help choosing care" className={styles.careHelp} data-care-selector="not_sure" hidden={selectedCareRoute !== 'not_sure'}>
            <p>You can continue without choosing a doctor, or explore your options first.</p>
            <div className={styles.reviewActions}><Link href="/services">Explore services</Link><Link href="/doctors">Browse doctors</Link></div>
          </section> : null}

          <div className={styles.careSelectors} data-care-selectors>
            {selectedCareRoute === 'service' ? <>{serviceSelector}{doctorSelector}</> : <>{doctorSelector}{serviceSelector}</>}
          </div>
          </div>
        </div>

        <section aria-labelledby="appointment-contact-title" className={styles.fieldGroup} data-journey-group="details">
          {localSimulation ? <div className={styles.selectedCare} aria-label="Selected care"><span>Selected care</span><strong data-journey-value="care">Help finding the right care</strong></div> : null}
          <h3 hidden={localSimulation} id="appointment-contact-title">Your contact details</h3>
          <TextField
            autoComplete="off"
            defaultValue={state === 'validation' ? 'TEST PATIENT' : undefined}
            error={fieldError('full-name', hasError('full-name'))}
            hint={localSimulation ? undefined : 'Use TEST PATIENT for this example.'}
            hintId="full-name-hint"
            id="full-name"
            label="Full name"
            maximumLength={120}
            minimumLength={2}
            name="full_name"
            required
          />

          <TextField
            autoComplete="off"
            error={fieldError('phone', hasError('phone'))}
            hint={localSimulation ? 'Include your country code, for example +251.' : 'Use +0 000 000 0000 for this example.'}
            hintId="phone-hint"
            id="phone"
            inputMode="tel"
            label="Telephone"
            maximumLength={32}
            name="phone"
            required
            type="tel"
          />
        </section>

        <section aria-labelledby="appointment-preference-title" className={styles.fieldGroup} data-journey-group="details">
          <h3 hidden={localSimulation} id="appointment-preference-title">Your preference</h3>
          <TextField
            autoComplete="off"
            error={fieldError('preferred-date', hasError('preferred-date'))}
            hint="Leave blank if you have no preference."
            hintId="preferred-date-hint"
            id="preferred-date"
            label="Preferred date"
            name="preferred_date"
            optionalLabel="Optional"
            type="date"
          />
        </section>
      </section>

      <section aria-labelledby={localSimulation ? undefined : 'appointment-privacy-title'} className={`${styles.formSection} ${styles.privacy}`} data-appointment-section="A5">
        {localSimulation ? <p><Link href="/privacy">Read the privacy notice</Link> before adding your details.</p> : null}
        {!localSimulation ? <div className={styles.sectionHeading}>
          <h2 id="appointment-privacy-title">Your privacy</h2>
          <div id="privacy-disclosure">{privacyDisclosure}</div>
        </div> : null}
        <label className={styles.consent} htmlFor="privacy-acknowledged">
          <input
            aria-describedby={localSimulation ? hasError('privacy-acknowledged') ? 'privacy-acknowledged-error' : undefined : `privacy-disclosure privacy-acknowledged-hint${hasError('privacy-acknowledged') ? ' privacy-acknowledged-error' : ''}`}
            aria-invalid={hasError('privacy-acknowledged') || undefined}
            data-privacy-acknowledgment
            id="privacy-acknowledged"
            name="privacy_acknowledged"
            required
            type="checkbox"
            value="true"
          />
          <span>
            <strong>{localSimulation ? 'I agree to be contacted about this request.' : 'I understand this is a local example, not an appointment request.'}</strong>
            {!localSimulation ? <span id="privacy-acknowledged-hint">My sample answers stay in this browser view until I leave or finish the example.</span> : null}
          </span>
        </label>
        <p className={styles.fieldError} data-field-error hidden={!hasError('privacy-acknowledged')} id="privacy-acknowledged-error">
          <strong>Error:</strong> {errorCopy['privacy-acknowledged'].message}
        </p>
      </section>

      <section aria-labelledby="appointment-submit-title" className={styles.formSection} data-appointment-section="A6">
        <div className={styles.sectionHeading}>
          <h2 id="appointment-submit-title" tabIndex={-1}>Review your details</h2>
          <p data-journey-review-description>Check your choices and contact details.</p>
        </div>
        {localSimulation ? <div className={styles.reviewSummary} data-journey-review hidden>
          <dl>
            {visitType ? <div><dt>Visit</dt><dd data-journey-value="visit">First visit</dd></div> : null}
            <div><dt>Care</dt><dd data-journey-value="care">Help finding the right care</dd></div>
            <div><dt><InterfaceText>Full name</InterfaceText></dt><dd data-journey-value="name">Not added</dd></div>
            <div><dt><InterfaceText>Telephone</InterfaceText></dt><dd data-journey-value="phone">Not added</dd></div>
            <div><dt><InterfaceText>Preferred date</InterfaceText></dt><dd data-journey-value="date">No preference</dd></div>
          </dl>
          <div className={styles.reviewActions}><button className={styles.textButton} data-journey-edit-care type="button"><InterfaceText>Change your care</InterfaceText></button><button className={styles.textButton} data-journey-edit type="button"><InterfaceText>Edit your details</InterfaceText></button></div>
        </div> : null}
        <AppointmentStatePanels kind={state} localSimulation={localSimulation} specimenReference={specimenReference} />
        <FormActions label="Appointment form action">
          <FormSubmitButton
            describedBy={localSimulation ? undefined : 'controlled-submit-explanation'}
            disabled={!localSimulation || state === 'pending' || state === 'unknown' || state === 'duplicate' || state === 'receipt' || state === 'delivery-warning'}
            label="Check details"
            pending={state === 'pending'}
            pendingLabel="Completing request…"
          />
        </FormActions>
        {!localSimulation ? <p className={styles.fixtureBoundary} id="controlled-submit-explanation">
          This browser-only example sends nothing and does not confirm a booking.
        </p> : null}
      </section>
      {localSimulation ? <div className={styles.journeyActions} data-journey-actions hidden>
        <button className={styles.textButton} data-journey-back type="button"><InterfaceText>Back</InterfaceText></button>
        <button className={styles.continueButton} data-journey-next type="button"><InterfaceText>Enter your details</InterfaceText> <span aria-hidden="true">→</span></button>
      </div> : null}
    </FormPrimitiveForm>
    </div>
    </></InterfaceCopy>
  )
}

// Content adapters must replace controlled fixtures with approved canonical records and close
// every activation gate before a public route is mounted. This composition performs no fetch.
export function AppointmentTemplate({
  doctorIdentity,
  description,
  doctorOptions,
  eyebrow,
  privacyDisclosure,
  recipientLabel,
  serviceOptions,
  shell,
  state,
  title,
  warning,
  visitType,
}: AppointmentTemplateProps) {
  const errors = state.errors ?? []
  const unavailable = state.kind === 'workflow-unavailable'
  const guidance = <InterfaceCopy><aside className={styles.careRail} aria-label="Appointment guidance">
    {state.localSimulation ? <section className={styles.requestSlip} data-section-context="preparation" aria-labelledby="appointment-preparation-title">
      <h2 id="appointment-preparation-title">Prepare for your visit</h2>
      <p>Keep your previous reports, medicine list and questions together.</p>
      <p><Link href="/patients-visitors#checklist">Make your visit checklist</Link></p>
      <p><Link href="/faq">Common appointment questions</Link></p>
    </section> : null}
    <section aria-labelledby="appointment-warning-title" className={`${styles.section} ${styles.warning}`} data-appointment-section="A2">
      <h2 id="appointment-warning-title">{state.localSimulation ? 'Need urgent help?' : 'Do not use this form for emergency help'}</h2>
      {!state.localSimulation ? <p>{warning}</p> : <Link href="/emergency">Emergency information</Link>}
    </section>
  </aside></InterfaceCopy>

  return (
    <SiteShell {...shell}>
      <div className={styles.frame} data-appointment-outcome={state.outcome} data-appointment-state={state.kind} data-appointment-template data-experience-level="0" data-local-journey={state.localSimulation || undefined}>
        <section aria-labelledby="appointment-title" className={styles.introduction} data-appointment-section="A1">
          <h1 id="appointment-title">{title}</h1>
          {description ? <p className={styles.description}>{description}</p> : null}
          {!state.localSimulation ? <p className={styles.fixtureBoundary}>{eyebrow}</p> : null}
          {!state.localSimulation ? <p className={styles.fixtureNotice} id="appointment-form-boundary">Online appointment requests are unavailable. Do not enter personal or medical information.</p> : null}
        </section>

        <div className={styles.workspace}>
        {!state.localSimulation ? guidance : null}

        {unavailable ? (
          <section aria-labelledby="appointment-unavailable-title" className={`${styles.section} ${styles.unavailable}`} data-appointment-section="A3">
            <h2 id="appointment-unavailable-title">Online appointment requests are unavailable</h2>
            <p>No appointment request can be sent at this time.</p>
          </section>
        ) : (
          <div data-appointment-form-controller={state.interactive ? 'enabled' : 'disabled'}>
            <AppointmentForm
              doctorIdentity={doctorIdentity}
              doctorOptions={doctorOptions}
              errors={errors}
              localSimulation={state.localSimulation}
              privacyDisclosure={privacyDisclosure}
              selectedCareRoute={state.selectedCareRoute}
              selectedDoctorId={state.selectedDoctorId}
              selectedServiceId={state.selectedServiceId}
              selectionNotice={state.selectionNotice}
              serviceOptions={serviceOptions}
              specimenReference={state.specimenReference}
              state={state.kind}
              visitType={visitType}
            />
          </div>
        )}
        {state.localSimulation ? guidance : null}
        </div>

        <section aria-labelledby="appointment-support-title" className={`${styles.section} ${styles.support} ds-support-band`} data-appointment-section="A7" data-section-context={state.localSimulation ? 'assistance' : undefined} id="appointment-support">
          <h2 id="appointment-support-title">{state.localSimulation ? 'Need help choosing care?' : recipientLabel}</h2>
          {!state.localSimulation ? <p>Review the illustrative contact details or return to care discovery before deciding what to request.</p> : null}
          {state.localSimulation ? <div className="ds-support-actions"><Link className="ds-touch-target" href="/#home-call">Contact information</Link><Link className="ds-touch-target" href="/doctors">Find a doctor</Link></div> : null}
        </section>
      </div>
    </SiteShell>
  )
}
