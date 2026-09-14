# Accessible Form Primitive Architecture

**Status:** Controlled-development implementation baseline

**Execution boundary:** Local and private-repository validation only
**Personal-data collection and appointment authority:** Not granted

## Purpose

`B01-009` provides reusable field, choice, help/error, error-summary, pending, receipt, warning,
failure, and submit-action APIs without implementing an appointment or other collecting workflow.
The component system owns accessible semantics and state presentation. Consuming features own
server validation, authorization, idempotency, reconciliation, privacy, retention, operations, and
the decision to enable collection.

## Component boundary

The public component API exports:

- `FormPrimitiveForm` for a labeled native form with optional description and truthful busy state;
- `TextField`, `TextAreaField`, and `SelectField` for persistent labels, visible required/optional
  copy, help, error relationships, and server-retained default values;
- `ChoiceGroup` for native fieldset, legend, radio, and checkbox semantics;
- `ErrorSummary` for a focusable server-error region with links to invalid fields;
- `FormStatus` for pending, authoritative receipt, accepted-delivery warning, and known-failure
  states;
- `FormActions` and `FormSubmitButton` for wrapping actions and truthful disabled/pending behavior.

The receipt props are a discriminated TypeScript contract: a receipt requires
`authoritative={true}` and a reference. This makes the consequential call site explicit, but it does
not itself prove backend acceptance. Only a consuming server response may supply those props.

## Validation and focus contract

The server remains authoritative. A consuming workflow returns retained safe values, field errors,
and an error-summary item for every invalid field. The input or fieldset exposes `aria-invalid` only
while its error is visible, and `aria-describedby` joins the stable help and error identifiers.

After an invalid response, a bounded enhancement may focus the error summary once. Summary links
use fragment targets for the corresponding controls. Client validation may improve timing but may
not replace server validation, announce success, or remove a server error without a new validation
result.

## Outcome states

- **Pending:** the form exposes `aria-busy`, disables duplicate submit activation, and preserves
  navigation and visible status.
- **Receipt:** appears only after authoritative acceptance and carries the accepted reference.
- **Accepted-delivery warning:** preserves the accepted reference and does not invite resubmission.
- **Known failure:** states that acceptance did not occur and offers retry only when the consuming
  workflow proves it safe.
- **Unknown outcome:** remains a Level 0 protected context; a consumer must preserve the submitted
  reference or reconciliation route and must not guess whether retry is safe.

## Controlled fixture and no-JavaScript behavior

The root fixture accepts only a documented specimen word and synthetic choices. Its first-party
script prevents the native request before doing any work, shows a short local pending state,
focuses the summary on invalid input, retains values, and finishes in a known non-acceptance state.
It makes no network request and uses no persistent storage.

The submit button is disabled in server HTML. The script enables it only after installing the
request-prevention handler. Without JavaScript, no value can leave the fixture. Static receipt,
warning, and failure examples are visibly described as controlled component specimens, not real
outcomes.

## Modes and resilience

- All styling consumes generated component aliases; raw component colors are prohibited.
- Controls, labels, help, errors, and status panels use intrinsic containment across compact, wide,
  200%/400% reflow-equivalent, and enlarged-text conditions.
- Visible form and choice targets meet the 44 × 44 CSS px minimum.
- Error, warning, receipt, and pending meaning uses words and boundaries in addition to color.
- Error and consequential outcome states use static protected motion; reduced motion removes the
  submit feedback transition.
- Forced colors preserves control, invalid, status, focus, and disabled boundaries; print keeps
  labels, entered values, status words, and references legible.

## Consuming gates

`B01-009` does not approve an appointment route, server action, database write, personal-data field,
CSRF/rate-limit strategy, notification, provider, receipt source, retention policy, hospital copy,
translation, deployment, production, or publication. Appointment use remains gated by
`APPT-01`–`APPT-04` and the later frontend/backend, privacy, security, operations, and release
tickets.

Verification and current execution evidence are recorded in the
[`B01-009` brief](../backlog/b01-009-accessible-form-primitives.md).
