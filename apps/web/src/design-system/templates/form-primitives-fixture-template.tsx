import {
  ChoiceGroup,
  ErrorSummary,
  FormActions,
  FormPrimitiveForm,
  FormStatus,
  FormSubmitButton,
  SelectField,
  TextAreaField,
  TextField,
} from '../components'

import styles from './form-primitives-fixture-template.module.css'

const controlledErrors = {
  channel: {
    id: 'controlled-channel-error',
    message: 'Choose one synthetic review channel.',
    visible: false,
  },
  reference: {
    id: 'controlled-reference-error',
    message: 'Enter the exact specimen word CONTROLLED.',
    visible: false,
  },
} as const

export function FormPrimitivesFixtureTemplate() {
  return (
    <section
      aria-labelledby="form-primitives-evidence-title"
      className="ds-flow ds-section"
      data-form-primitives-fixture
      id="form-primitives-evidence"
    >
      <div className="ds-flow ds-reading">
        <h2 id="form-primitives-evidence-title">Accessible form evidence fixture</h2>
        <p id="controlled-form-boundary">
          This local fixture validates synthetic values in the browser only. Do not enter a name,
          phone number, email address, medical information, or any other personal data. It sends no
          request and cannot create an appointment or authoritative receipt.
        </p>
      </div>

      <FormPrimitiveForm
        action="/controlled-form-submission-disabled"
        descriptionId="controlled-form-boundary"
        id="controlled-form"
        label="Validate controlled form primitives"
        method="post"
      >
        <ErrorSummary
          heading="There is a problem with the controlled form"
          id="controlled-error-summary"
          items={[
            {
              fieldId: 'controlled-reference',
              label: 'Controlled reference',
              message: controlledErrors.reference.message,
            },
            {
              fieldId: 'controlled-channel',
              label: 'Review channel',
              message: controlledErrors.channel.message,
            },
          ]}
          visible={false}
        />

        <TextField
          autoComplete="off"
          error={controlledErrors.reference}
          hint="Use the exact specimen word CONTROLLED. Do not enter a real identifier."
          hintId="controlled-reference-hint"
          id="controlled-reference"
          label="Controlled reference"
          maximumLength={20}
          name="controlledReference"
          required
        />

        <SelectField
          defaultValue=""
          hint="This selection is retained when another field needs correction."
          hintId="controlled-context-hint"
          id="controlled-context"
          label="Synthetic review context"
          name="reviewContext"
          options={[
            { disabled: true, label: 'Choose a context', value: '' },
            { label: 'Component semantics', value: 'semantics' },
            { label: 'Responsive layout', value: 'responsive' },
          ]}
          required
        />

        <ChoiceGroup
          error={controlledErrors.channel}
          hint="Choose one local evidence channel; no message is delivered."
          hintId="controlled-channel-hint"
          id="controlled-channel"
          legend="Review channel"
          name="reviewChannel"
          options={[
            {
              description: 'A synthetic browser-state specimen only.',
              label: 'Rendered check',
              value: 'rendered',
            },
            {
              description: 'A synthetic semantic-contract specimen only.',
              label: 'Static check',
              value: 'static',
            },
          ]}
          required
          type="radio"
        />

        <TextAreaField
          autoComplete="off"
          hint="Optional synthetic wording only. This value never leaves the page."
          hintId="controlled-note-hint"
          id="controlled-note"
          label="Controlled note"
          maximumLength={80}
          name="controlledNote"
          rows={4}
        />

        <FormStatus
          heading="Checking controlled values"
          id="controlled-form-pending"
          kind="pending"
          visible={false}
        >
          <p>Local validation is in progress. Do not submit again.</p>
        </FormStatus>

        <FormStatus
          heading="Collection remains disabled"
          id="controlled-form-failure"
          kind="failure"
          visible={false}
        >
          <p>No request was sent and no information was accepted or stored.</p>
        </FormStatus>

        <FormActions label="Controlled form actions">
          <FormSubmitButton
            describedBy="controlled-submit-unavailable"
            disabled
            label="Validate synthetic values"
          />
        </FormActions>
        <p className={styles.noScriptReason} data-controlled-submit-unavailable id="controlled-submit-unavailable">
          Local validation requires the first-party enhancement. Without it, submission stays
          disabled and no values leave this page.
        </p>
      </FormPrimitiveForm>

      <div className={styles.stateGrid} data-form-state-fixtures>
        <FormStatus
          authoritative
          heading="Controlled accepted-response specimen"
          id="controlled-receipt-specimen"
          kind="receipt"
          reference="CONTROLLED-RECEIPT-001"
        >
          <p>
            This static specimen demonstrates the component contract used only after an
            authoritative service confirms acceptance. It is not a real submission.
          </p>
        </FormStatus>
        <FormStatus
          acceptedReference="CONTROLLED-RECEIPT-001"
          heading="Controlled delivery-warning specimen"
          id="controlled-warning-specimen"
          kind="warning"
        >
          <p>
            Acceptance is known, but downstream delivery needs review. Preserve the reference and
            do not invite a duplicate submission.
          </p>
        </FormStatus>
        <FormStatus
          heading="Controlled known-failure specimen"
          id="controlled-failure-specimen"
          kind="failure"
        >
          <p>No acceptance occurred. A consuming workflow may offer a retry only when it is safe.</p>
        </FormStatus>
      </div>

      <script data-form-primitives-script defer src="/form-primitives.js" />
    </section>
  )
}
