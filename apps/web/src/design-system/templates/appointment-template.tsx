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
  'care-route': { label: 'Type of care', message: 'Choose one synthetic care route.' },
  'doctor-id': { label: 'Synthetic doctor', message: 'Choose one synthetic doctor.' },
  'full-name': { label: 'Synthetic full name', message: 'Enter the exact specimen name TEST PATIENT.' },
  phone: { label: 'Synthetic telephone', message: 'Enter the exact specimen number +0 000 000 0000.' },
  'preferred-date': { label: 'Synthetic preferred date', message: 'Use the YYYY-MM-DD format or leave this optional field empty.' },
  'privacy-acknowledged': { label: 'Privacy acknowledgment', message: 'Acknowledge the controlled privacy boundary.' },
  'service-id': { label: 'Synthetic service', message: 'Choose one synthetic service.' },
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
      <h3 id="appointment-error-summary-heading">Check the synthetic form</h3>
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
  reference,
}: {
  readonly kind: AppointmentReviewStateKind
  readonly reference: string
}) {
  return (
    <div className={styles.stateStack} data-appointment-state-panels>
      <div className={styles.statePanel} data-appointment-state-panel="pending">
        <FormStatus heading="Checking the synthetic request" id="appointment-pending" kind="pending" visible={kind === 'pending'}>
          <p>Local controlled validation is in progress. Do not submit again.</p>
        </FormStatus>
      </div>
      <div className={styles.statePanel} data-appointment-state-panel="known-failure">
        <FormStatus heading="Nothing was accepted" id="appointment-known-failure" kind="failure" visible={kind === 'known-failure'}>
          <p>No request was recorded. The same synthetic intent may be retried after the controlled failure is resolved.</p>
        </FormStatus>
      </div>
      <div className={styles.statePanel} data-appointment-state-panel="unknown">
        <FormStatus heading="The outcome is not known" id="appointment-unknown" kind="warning" visible={kind === 'unknown'}>
          <p>Do not create another request. Reconcile the original intent before deciding whether a retry is safe.</p>
        </FormStatus>
      </div>
      <div className={styles.statePanel} data-appointment-state-panel="duplicate">
        <FormStatus acceptedReference={reference} heading="Original outcome restored" id="appointment-duplicate" kind="warning" visible={kind === 'duplicate'}>
          <p>The same synthetic intent resolves to its original specimen reference. No second request is represented.</p>
        </FormStatus>
      </div>
      <div className={styles.statePanel} data-appointment-state-panel="receipt">
        <FormStatus authoritative heading="Synthetic authoritative-response specimen" id="appointment-receipt" kind="receipt" reference={reference} visible={kind === 'receipt'}>
          <p>This demonstrates a database-authoritative acceptance response. It is not a real appointment and does not confirm a booking.</p>
        </FormStatus>
      </div>
      <div className={styles.statePanel} data-appointment-state-panel="delivery-warning">
        <FormStatus acceptedReference={reference} heading="Accepted; notification needs review" id="appointment-delivery-warning" kind="warning" visible={kind === 'delivery-warning'}>
          <p>The accepted specimen reference remains authoritative. Do not resubmit because notification delivery failed.</p>
        </FormStatus>
      </div>
    </div>
  )
}

function AppointmentForm({
  doctorOptions,
  errors,
  privacyDisclosure,
  reference,
  selectedCareRoute,
  serviceOptions,
  state,
}: {
  readonly doctorOptions: readonly SelectOption[]
  readonly errors: readonly AppointmentField[]
  readonly privacyDisclosure: ReactNode
  readonly reference: string
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
      label="Controlled appointment request form"
      method="post"
    >
      <div data-appointment-section="A3">
        <AppointmentErrorSummary errors={errors} />
      </div>

      <section aria-labelledby="appointment-details-title" className={styles.formSection} data-appointment-section="A4">
        <div className={styles.sectionHeading}>
          <h2 id="appointment-details-title">Request details</h2>
          <p>Use only the exact synthetic values described below. No notes or medical information are collected.</p>
        </div>

        <ChoiceGroup
          error={fieldError('care-route', hasError('care-route'))}
          hint="Choose one route. Doctor and service are never required together."
          hintId="care-route-hint"
          id="care-route"
          legend="Type of care"
          name="care_route"
          options={[
            { description: 'Choose from fictional doctor records.', label: 'A specific synthetic doctor', value: 'doctor' },
            { description: 'Choose from fictional service records.', label: 'A synthetic service', value: 'service' },
            { description: 'Continue without a doctor or service identifier.', label: 'Not sure', value: 'not_sure' },
          ]}
          required
          selectedValues={selectedCareRoute ? [selectedCareRoute] : []}
          type="radio"
        />

        <div className={styles.careSelector} data-care-selector="doctor" hidden={selectedCareRoute !== 'doctor'}>
          <SelectField
            defaultValue={selectedCareRoute === 'doctor' ? doctorOptions[1]?.value : ''}
            error={fieldError('doctor-id', hasError('doctor-id'))}
            hint="Fictional option for controlled layout and validation only."
            hintId="doctor-id-hint"
            id="doctor-id"
            label="Synthetic doctor"
            name="doctor_id"
            options={doctorOptions}
            required={selectedCareRoute === 'doctor'}
          />
        </div>

        <div className={styles.careSelector} data-care-selector="service" hidden={selectedCareRoute !== 'service'}>
          <SelectField
            defaultValue={selectedCareRoute === 'service' ? serviceOptions[1]?.value : ''}
            error={fieldError('service-id', hasError('service-id'))}
            hint="Fictional option for controlled layout and validation only."
            hintId="service-id-hint"
            id="service-id"
            label="Synthetic service"
            name="service_id"
            options={serviceOptions}
            required={selectedCareRoute === 'service'}
          />
        </div>

        <TextField
          autoComplete="off"
          defaultValue={state === 'validation' ? 'TEST PATIENT' : undefined}
          error={fieldError('full-name', hasError('full-name'))}
          hint="Controlled test value: TEST PATIENT. Never enter a real name."
          hintId="full-name-hint"
          id="full-name"
          label="Synthetic full name"
          maximumLength={120}
          minimumLength={2}
          name="full_name"
          required
        />

        <TextField
          autoComplete="off"
          error={fieldError('phone', hasError('phone'))}
          hint="Controlled test value: +0 000 000 0000. Never enter a real telephone number."
          hintId="phone-hint"
          id="phone"
          inputMode="tel"
          label="Synthetic telephone"
          maximumLength={32}
          name="phone"
          required
          type="tel"
        />

        <TextField
          autoComplete="off"
          error={fieldError('preferred-date', hasError('preferred-date'))}
          hint="Optional YYYY-MM-DD fixture within the next 365 days."
          hintId="preferred-date-hint"
          id="preferred-date"
          inputMode="numeric"
          label="Synthetic preferred date"
          maximumLength={10}
          name="preferred_date"
          optionalLabel="Optional"
          pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}"
        />
      </section>

      <section aria-labelledby="appointment-privacy-title" className={`${styles.formSection} ${styles.privacy}`} data-appointment-section="A5">
        <div className={styles.sectionHeading}>
          <p className={styles.panelLabel}>Controlled privacy boundary</p>
          <h2 id="appointment-privacy-title">Before the synthetic submission</h2>
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
            <strong>I understand this controlled preview stores and sends nothing.</strong>
            <span id="privacy-acknowledged-hint">Required for the local interaction specimen. This is not legal consent.</span>
          </span>
        </label>
        <p className={styles.fieldError} data-field-error hidden={!hasError('privacy-acknowledged')} id="privacy-acknowledged-error">
          <strong>Error:</strong> {errorCopy['privacy-acknowledged'].message}
        </p>
      </section>

      <section aria-labelledby="appointment-submit-title" className={styles.formSection} data-appointment-section="A6">
        <div className={styles.sectionHeading}>
          <h2 id="appointment-submit-title">Review the request state</h2>
          <p>No booking is confirmed by this form. The controlled preview never contacts the synthetic recipient.</p>
        </div>
        <AppointmentStatePanels kind={state} reference={reference} />
        <FormActions label="Controlled appointment form action">
          <FormSubmitButton
            describedBy="controlled-submit-explanation"
            disabled
            label="Validate synthetic request"
            pending={state === 'pending'}
            pendingLabel="Checking synthetic request…"
          />
        </FormActions>
        <p className={styles.fixtureBoundary} id="controlled-submit-explanation">
          Browser-only review. No API request, database write, message or authoritative receipt can occur.
        </p>
        <noscript>
          <p className={styles.noScriptBoundary}>JavaScript is unavailable, so submission remains disabled and no value can leave this page.</p>
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
            Controlled preview only. Use synthetic values. Nothing entered here is sent, stored, logged or shared.
          </p>
        </section>

        <section aria-labelledby="appointment-warning-title" className={`${styles.section} ${styles.warning}`} data-appointment-section="A2">
          <p className={styles.panelLabel}>Safety wording placeholder</p>
          <h2 id="appointment-warning-title">Do not use this form for emergency help</h2>
          <p>{warning}</p>
          <p className={styles.fixtureBoundary}>Synthetic English wording — clinical and language approval remain pending.</p>
        </section>

        {unavailable ? (
          <section aria-labelledby="appointment-unavailable-title" className={`${styles.section} ${styles.unavailable}`} data-appointment-section="A3">
            <h2 id="appointment-unavailable-title">Online appointment requests are unavailable</h2>
            <p>The operating workflow is not approved. No form or plausible contact substitute is displayed.</p>
          </section>
        ) : (
          <div data-appointment-form-controller={state.interactive ? 'enabled' : 'disabled'}>
            <AppointmentForm
              doctorOptions={doctorOptions}
              errors={errors}
              privacyDisclosure={privacyDisclosure}
              reference={state.specimenReference}
              selectedCareRoute={state.selectedCareRoute}
              serviceOptions={serviceOptions}
              state={state.kind}
            />
          </div>
        )}

        <section aria-labelledby="appointment-support-title" className={`${styles.section} ${styles.support}`} data-appointment-section="A7" id="appointment-support">
          <p className={styles.panelLabel}>Synthetic operating label</p>
          <h2 id="appointment-support-title">{recipientLabel}</h2>
          <p>No staffed hours, telephone number, response time, messaging account or escalation path is represented.</p>
          <a className="ds-touch-target" href="#appointment-title">Return to the controlled appointment introduction</a>
        </section>
      </div>
    </SiteShell>
  )
}
