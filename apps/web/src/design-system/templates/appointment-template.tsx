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
  readonly description: string
  readonly doctorOptions: readonly SelectOption[]
  readonly eyebrow: string
  readonly privacyDisclosure: ReactNode
  readonly recipientLabel: string
  readonly serviceOptions: readonly SelectOption[]
  readonly shell: Omit<SiteShellProps, 'breadcrumbs' | 'children'>
  readonly state: {
    readonly errors?: readonly AppointmentField[]
    readonly interactive?: boolean
    readonly kind: AppointmentReviewStateKind
    readonly selectedCareRoute?: 'doctor' | 'not_sure' | 'service'
    readonly specimenReference: string
  }
  readonly title: string
  readonly warning: string
}

const errorCopy: Readonly<Record<AppointmentField, { label: string; message: string }>> = {
  'care-route': { label: 'Type of care', message: 'Choose one type of care.' },
  'doctor-id': { label: 'Doctor', message: 'Choose a doctor.' },
  'full-name': { label: 'Full name', message: 'Enter TEST PATIENT.' },
  phone: { label: 'Telephone', message: 'Enter +0 000 000 0000.' },
  'preferred-date': { label: 'Preferred date', message: 'Use the YYYY-MM-DD format or leave this optional field empty.' },
  'privacy-acknowledged': { label: 'Privacy acknowledgment', message: 'Read and acknowledge the privacy information.' },
  'service-id': { label: 'Service', message: 'Choose a service.' },
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
    <section
      aria-labelledby="appointment-error-summary-heading"
      className={styles.errorSummary}
      data-error-summary
      hidden={!visible}
      id="appointment-error-summary"
      role="alert"
      tabIndex={-1}
    >
      <h3 id="appointment-error-summary-heading">Check the form</h3>
      <p data-error-count>There {errors.length === 1 ? 'is 1 problem' : `are ${errors.length} problems`} to correct.</p>
      <ul>
        {(Object.keys(errorCopy) as AppointmentField[]).map((field) => (
          <li data-error-item={field} hidden={!errors.includes(field)} key={field}>
            <a href={`#${field}`}>
              <strong>{errorCopy[field].label}:</strong> {errorCopy[field].message}
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}

function AppointmentStatePanels({
  kind,
}: {
  readonly kind: AppointmentReviewStateKind
}) {
  return (
    <div className={styles.stateStack} data-appointment-state-panels>
      <div className={styles.statePanel} data-appointment-state-panel="pending">
        <FormStatus heading="Checking the form" id="appointment-pending" kind="pending" visible={kind === 'pending'}>
          <p>Please wait. No appointment request is being sent.</p>
        </FormStatus>
      </div>
      <div className={styles.statePanel} data-appointment-state-panel="known-failure">
        <FormStatus heading="Nothing was accepted" id="appointment-known-failure" kind="failure" visible={kind === 'known-failure'}>
          <p>No appointment request was sent.</p>
        </FormStatus>
      </div>
      <div className={styles.statePanel} data-appointment-state-panel="unknown">
        <FormStatus heading="Appointment requests unavailable" id="appointment-unknown" kind="warning" visible={kind === 'unknown'}>
          <p>No appointment request was sent.</p>
        </FormStatus>
      </div>
      <div className={styles.statePanel} data-appointment-state-panel="duplicate">
        <FormStatus heading="Appointment requests unavailable" id="appointment-duplicate" kind="warning" visible={kind === 'duplicate'}>
          <p>No appointment request was sent.</p>
        </FormStatus>
      </div>
      <div className={styles.statePanel} data-appointment-state-panel="receipt">
        <FormStatus heading="Appointment requests unavailable" id="appointment-receipt" kind="warning" visible={kind === 'receipt'}>
          <p>No appointment request was sent and no booking is confirmed.</p>
        </FormStatus>
      </div>
      <div className={styles.statePanel} data-appointment-state-panel="delivery-warning">
        <FormStatus heading="Appointment requests unavailable" id="appointment-delivery-warning" kind="warning" visible={kind === 'delivery-warning'}>
          <p>No appointment request was sent.</p>
        </FormStatus>
      </div>
    </div>
  )
}

function AppointmentForm({
  doctorOptions,
  errors,
  privacyDisclosure,
  selectedCareRoute,
  serviceOptions,
  state,
}: {
  readonly doctorOptions: readonly SelectOption[]
  readonly errors: readonly AppointmentField[]
  readonly privacyDisclosure: ReactNode
  readonly selectedCareRoute?: 'doctor' | 'not_sure' | 'service'
  readonly serviceOptions: readonly SelectOption[]
  readonly state: AppointmentReviewStateKind
}) {
  const hasError = (field: AppointmentField) => errors.includes(field)
  return (
    <FormPrimitiveForm
      action="/controlled-appointment-submission-disabled"
      busy={state === 'pending'}
      descriptionId="appointment-form-boundary"
      id="appointment-request-form"
      label="Appointment request form"
      method="post"
    >
      <div data-appointment-section="A3">
        <AppointmentErrorSummary errors={errors} />
      </div>

      <section aria-labelledby="appointment-details-title" className={styles.formSection} data-appointment-section="A4">
        <div className={styles.sectionHeading}>
          <h2 id="appointment-details-title">Request details</h2>
          <p>Do not enter personal or medical information.</p>
        </div>

        <div className={styles.careGroup}>
          <ChoiceGroup
            error={fieldError('care-route', hasError('care-route'))}
            hint="Choose one route. Doctor and service are never required together."
            hintId="care-route-hint"
            id="care-route"
            legend="Type of care"
            name="care_route"
            options={[
              { description: 'Choose a doctor.', label: 'A specific doctor', value: 'doctor' },
              { description: 'Choose a service.', label: 'A service', value: 'service' },
              { description: 'Choose this if you need help deciding.', label: 'Not sure', value: 'not_sure' },
            ]}
            required
            selectedValues={selectedCareRoute ? [selectedCareRoute] : []}
            type="radio"
          />

          <div className={styles.careSelector} data-care-selector="doctor" hidden={selectedCareRoute !== 'doctor'}>
            <SelectField
              defaultValue={selectedCareRoute === 'doctor' ? doctorOptions[1]?.value : ''}
              error={fieldError('doctor-id', hasError('doctor-id'))}
              hint="Choose an option."
              hintId="doctor-id-hint"
              id="doctor-id"
              label="Doctor"
              name="doctor_id"
              options={doctorOptions}
              required={selectedCareRoute === 'doctor'}
            />
          </div>

          <div className={styles.careSelector} data-care-selector="service" hidden={selectedCareRoute !== 'service'}>
            <SelectField
              defaultValue={selectedCareRoute === 'service' ? serviceOptions[1]?.value : ''}
              error={fieldError('service-id', hasError('service-id'))}
              hint="Choose an option."
              hintId="service-id-hint"
              id="service-id"
              label="Service"
              name="service_id"
              options={serviceOptions}
              required={selectedCareRoute === 'service'}
            />
          </div>
        </div>

        <section aria-labelledby="appointment-contact-title" className={styles.fieldGroup}>
          <h3 id="appointment-contact-title">Your contact details</h3>
          <TextField
            autoComplete="off"
            defaultValue={state === 'validation' ? 'TEST PATIENT' : undefined}
            error={fieldError('full-name', hasError('full-name'))}
            hint="Use TEST PATIENT. Do not enter a real name."
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
            hint="Use +0 000 000 0000. Do not enter a real telephone number."
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

        <section aria-labelledby="appointment-preference-title" className={styles.fieldGroup}>
          <h3 id="appointment-preference-title">Your preference</h3>
          <TextField
            autoComplete="off"
            error={fieldError('preferred-date', hasError('preferred-date'))}
            hint="Use YYYY-MM-DD within the next 365 days."
            hintId="preferred-date-hint"
            id="preferred-date"
            inputMode="numeric"
            label="Preferred date"
            maximumLength={10}
            name="preferred_date"
            optionalLabel="Optional"
            pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}"
          />
        </section>
      </section>

      <section aria-labelledby="appointment-privacy-title" className={`${styles.formSection} ${styles.privacy}`} data-appointment-section="A5">
        <div className={styles.sectionHeading}>
          <p className={styles.panelLabel}>Privacy</p>
          <h2 id="appointment-privacy-title">Before continuing</h2>
          <div id="privacy-disclosure">{privacyDisclosure}</div>
        </div>
        <label className={styles.consent} htmlFor="privacy-acknowledged">
          <input
            aria-describedby={`privacy-disclosure privacy-acknowledged-hint privacy-acknowledged-error`}
            aria-invalid={hasError('privacy-acknowledged') || undefined}
            data-privacy-acknowledgment
            id="privacy-acknowledged"
            name="privacy_acknowledged"
            type="checkbox"
            value="true"
          />
          <span>
            <strong>I understand that no appointment request will be sent.</strong>
            <span id="privacy-acknowledged-hint">Do not enter personal or medical information.</span>
          </span>
        </label>
        <p className={styles.fieldError} data-field-error hidden={!hasError('privacy-acknowledged')} id="privacy-acknowledged-error">
          <strong>Error:</strong> {errorCopy['privacy-acknowledged'].message}
        </p>
      </section>

      <section aria-labelledby="appointment-submit-title" className={styles.formSection} data-appointment-section="A6">
        <div className={styles.sectionHeading}>
          <h2 id="appointment-submit-title">Review your details</h2>
          <p>No booking is confirmed by this form.</p>
        </div>
        <AppointmentStatePanels kind={state} />
        <FormActions label="Appointment form action">
          <FormSubmitButton
            describedBy="controlled-submit-explanation"
            disabled
            label="Check details"
            pending={state === 'pending'}
            pendingLabel="Checking details…"
          />
        </FormActions>
        <p className={styles.fixtureBoundary} id="controlled-submit-explanation">
          Online appointment requests are unavailable. No request will be sent.
        </p>
        <noscript>
          <p className={styles.noScriptBoundary}>Online appointment requests are unavailable.</p>
        </noscript>
      </section>
    </FormPrimitiveForm>
  )
}

// Content adapters must replace controlled fixtures with approved canonical records and close
// every activation gate before a public route is mounted. This composition performs no fetch.
export function AppointmentTemplate({
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
}: AppointmentTemplateProps) {
  const errors = state.errors ?? []
  const unavailable = state.kind === 'workflow-unavailable'

  return (
    <SiteShell {...shell}>
      <div className={styles.frame} data-appointment-state={state.kind} data-appointment-template data-experience-level="0">
        <section aria-labelledby="appointment-title" className={styles.introduction} data-appointment-section="A1">
          <p className={styles.eyebrow}>{eyebrow}</p>
          <h1 id="appointment-title">{title}</h1>
          <p className={styles.description}>{description}</p>
          <p className={styles.fixtureNotice} id="appointment-form-boundary">
            Online appointment requests are unavailable. Do not enter personal or medical information.
          </p>
        </section>

        <section aria-labelledby="appointment-warning-title" className={`${styles.section} ${styles.warning}`} data-appointment-section="A2">
          <h2 id="appointment-warning-title">Do not use this form for emergency help</h2>
          <p>{warning}</p>
        </section>

        {unavailable ? (
          <section aria-labelledby="appointment-unavailable-title" className={`${styles.section} ${styles.unavailable}`} data-appointment-section="A3">
            <h2 id="appointment-unavailable-title">Online appointment requests are unavailable</h2>
            <p>No appointment request can be sent at this time.</p>
          </section>
        ) : (
          <div data-appointment-form-controller={state.interactive ? 'enabled' : 'disabled'}>
            <AppointmentForm
              doctorOptions={doctorOptions}
              errors={errors}
              privacyDisclosure={privacyDisclosure}
              selectedCareRoute={state.selectedCareRoute}
              serviceOptions={serviceOptions}
              state={state.kind}
            />
          </div>
        )}

        <section aria-labelledby="appointment-support-title" className={`${styles.section} ${styles.support}`} data-appointment-section="A7" id="appointment-support">
          <h2 id="appointment-support-title">{recipientLabel}</h2>
          <p>Contact information is unavailable.</p>
          <a className="ds-touch-target" href="#appointment-title">Return to appointment information</a>
        </section>
      </div>
    </SiteShell>
  )
}
