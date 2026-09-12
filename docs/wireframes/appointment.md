# Request an Appointment — Annotated Low-Fidelity Wireframe

**Route:** `/appointments/`  
**Primary question:** “Can I request an appointment safely?”  
**Primary action:** Send an appointment request  
**Status:** Publication-blocked pending operating model, field, privacy, consent, response, and fallback approval

The form sends a request for staff follow-up. It never promises or displays a confirmed appointment. This is a flat top-level route and therefore has no breadcrumb under the current sitemap.

## Requirement coverage

| Area | IDs |
| --- | --- |
| Global shell, reflow, accessibility, fallback, states, motion, performance, governance, patient language | `G-001`, `G-003`–`G-016` |
| Form security and privacy | `S-002`–`S-005` |
| Phase 1 Amharic and context-preserving switching | `S-006`–`S-008` |
| Emergency boundary | `E-001`, `E-005` |
| Care choice sources | `D-001`–`D-003`, `V-001`, `V-003` |
| Appointment request | `A-001`–`A-007` |
| Canonical telephone fallback | `C-001` |

`S-001` remains a release gate outside the visible form structure.

## Candidate data-minimized field set

This is a wireframing hypothesis for review, not an approved schema. The existing source exposed Full Name, Phone Number, Appointment Date, Doctor, Department, Service, and Additional Notes. The wireframe removes the competing Department field, makes Doctor and Service mutually conditional, and adds a “Not sure” route in order to satisfy `A-003` and `V-001`.

| Candidate field | Requirement and behavior | Approval gate |
| --- | --- | --- |
| Care route: doctor / service / not sure | Required radio group. Determines one conditional selector or a staffed-routing message. | Operations + Privacy + Clinical taxonomy |
| Doctor | Required only when “A specific doctor” is selected; approved current roster only; canonical ID submitted. | Medical staff owner + Operations |
| Service | Required only when “A service” is selected; approved taxonomy only; canonical ID submitted. | Clinical + Content + Operations |
| Full name | Required only if staff need it to follow up; treat requiredness as unresolved until that necessity is documented. | Privacy + Operations |
| Phone number | Candidate required follow-up channel; format guidance must support Ethiopian and international numbers as Operations approves. | Privacy + Operations |
| Preferred date | A preference, not confirmed availability; treat requiredness as unresolved and do not expose unapproved schedules. | Operations |
| Brief notes | Optional and omitted entirely unless need, access, security, retention, and warning copy are approved; never solicit medical history. | Privacy + Security + Operations |
| Consent | Initially unchecked explicit checkbox after the approved privacy explanation. | Privacy/legal |

New/returning-patient status, email, contact-channel choice, referral details, files, medical history, payment, and insurance are not shown. They may be added only after a documented operational need and data-minimization review. Consent is a legal/interaction control rather than appointment-routing data.

## Mobile wireframe — 360 px review frame

```text
┌────────────────────────────────────┐
│ [Skip to main content]             │
│ {A0} [APPROVED LOGO]               │
│      [Emergency]          [Menu]   │
├────────────────────────────────────┤
│ MAIN                               │
│ {A1} H1: Request an appointment    │
│      This sends a request.         │
│      [VERIFY: staff response       │
│       process; no booking promise] │
├────────────────────────────────────┤
│ {A2} WARNING                       │
│      H2: Not for emergencies       │
│      [VERIFY: approved wording]    │
│      [Call emergency]              │
│      [VERIFY: visible number]      │
├────────────────────────────────────┤
│ {A3} [STATE: error summary after   │
│      invalid submission only]      │
│      H2: Check your answers        │
│      • [Link to field error]       │
├────────────────────────────────────┤
│ {A4} FORM                          │
│      H2: What care do you need?    │
│      ( ) A specific doctor         │
│      ( ) A service                 │
│      ( ) I am not sure             │
│        ↳ Label + [approved select] │
│                                    │
│      H2: Your contact details      │
│      Full name [VERIFY required?] │
│      [________________________]    │
│      Phone number (required)       │
│      Format help [VERIFY]          │
│      [________________________]    │
│                                    │
│      H2: Your preference           │
│      Preferred date [VERIFY req.?] │
│      This is not a confirmed date. │
│      [native date/text fallback]   │
│                                    │
│      [OPTIONAL/GATED: brief notes] │
│      Do not include detailed       │
│      medical information.          │
│      [________________________]    │
│      [resizable________________]   │
├────────────────────────────────────┤
│ {A5} H2: Privacy and consent       │
│      [VERIFY: purpose, recipients, │
│       retention, choices, contact] │
│      [Privacy notice →]            │
│      [ ] [VERIFY: consent text]    │
│          (not preselected)         │
├────────────────────────────────────┤
│ {A6} H2: Check and send            │
│      Request, not confirmed booking│
│      [Send appointment request]    │
│      [STATE text: Sending request…]│
├────────────────────────────────────┤
│ {A7} Need help with your request?  │
│      [VERIFY: staffed appointment  │
│       telephone + hours]           │
├────────────────────────────────────┤
│ {A8} Footer: tasks | contact |     │
│      privacy | access | language   │
└────────────────────────────────────┘
```

`A3` is absent in the default state and appears before `A4` only after invalid submission. Inline errors remain directly under their controls.

## Desktop wireframe — 1280 px review frame

```text
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│ [Skip] [APPROVED LOGO] [Doctors] [Services] Appointments (current) [Patient info]         │
│                         [Locations] [Search] [Language] [Call] [Emergency]               {A0}│
├────────────────────────────────────────────────────────────────────────────────────────────┤
│                          ┌──────────────────────────────────────────────────────────────┐   │
│                          │ H1 Request an appointment                              {A1} │   │
│                          │ Request/follow-up explanation [VERIFY]                       │   │
│                          ├──────────────────────────────────────────────────────────────┤   │
│                          │ WARNING: Not for emergencies                          {A2} │   │
│                          │ [VERIFY: wording] [Call emergency] [VERIFY: number]           │   │
│                          ├──────────────────────────────────────────────────────────────┤   │
│                          │ [STATE: linked error summary after invalid submit]      {A3} │   │
│                          ├──────────────────────────────────────────────────────────────┤   │
│                          │ FORM                                                    {A4} │   │
│                          │ H2 What care do you need?                                    │   │
│                          │ ( ) Doctor  ( ) Service  ( ) Not sure                        │   │
│                          │   ↳ one approved conditional selector                        │   │
│                          │ H2 Your contact details                                      │   │
│                          │ Full name [________________________________________]          │   │
│                          │ Phone     [________________________________________]          │   │
│                          │ H2 Your preference                                           │   │
│                          │ Preferred date [________________] Not a confirmed date        │   │
│                          │ [OPTIONAL/GATED brief notes ____________________________]     │   │
│                          ├──────────────────────────────────────────────────────────────┤   │
│                          │ H2 Privacy and consent                                 {A5} │   │
│                          │ [VERIFY: disclosure] [Privacy notice →]                       │   │
│                          │ [ ] [VERIFY: explicit consent; initially unchecked]          │   │
│                          ├──────────────────────────────────────────────────────────────┤   │
│                          │ H2 Check and send                                       {A6} │   │
│                          │ [Send appointment request] [pending status region]            │   │
│                          └──────────────────────────────────────────────────────────────┘   │
│                          [Staffed appointment telephone fallback + hours]              {A7}│
├────────────────────────────────────────────────────────────────────────────────────────────┤
│ Footer: tasks | canonical contacts | privacy | accessibility | language scope           {A8}│
└────────────────────────────────────────────────────────────────────────────────────────────┘
```

The form remains a single column at about 640 px maximum. Desktop does not place fields side by side merely to fill space; label/error association and predictable scan order take priority.

## Alternate-state wireframes

### Validation state

```text
┌─ Error summary (focus target, tabindex="-1") ────────────┐
│ H2 Check your answers                                    │
│ We found 2 problems. Your other answers are saved.       │
│ • [Enter your phone number → #phone]                     │
│ • [Agree to the consent statement → #consent]            │
└───────────────────────────────────────────────────────────┘

Phone number (required)
[ entered invalid value retained__________________________ ]
[Error icon + “Enter …” approved actionable wording]

[ ] Consent wording
[Error icon + approved action wording]
```

- Focus moves to the summary after the server/client determines the submission is invalid.
- Each summary link moves focus to the associated field; inline errors are connected programmatically.
- Valid fields and the selected care route remain unchanged. Errors do not appear before the user has had a reasonable chance to answer.

### Loading / duplicate-protection state

```text
[Send appointment request  ◌]  (same width and stable label)
Status: Sending your appointment request…
The control is temporarily inoperable and aria-busy/status is announced once.
```

- The first intent gets an idempotency/submission key. Double clicks, key repeats, client retry, and network recovery reuse that intent rather than create a new operational request.
- While pending, only the submit action is unavailable; entered data, Emergency, language, and staffed fallback remain usable. A language change during pending must not silently resubmit.
- Avoid a spinner flash under roughly 300 ms. For a long delay, show plain-language progress without an invented percentage.

### Recoverable failure state

```text
┌─ Request not sent / status unknown ──────────────────────┐
│ [Specific approved explanation]                          │
│ Your answers are still on this page.                     │
│ [Try again safely] [Call appointment team]               │
│ [VERIFY: staffed number and hours]                       │
└───────────────────────────────────────────────────────────┘
[Form remains populated below]
```

- If the server definitively rejected the request, retry uses the same submission intent safely.
- If acknowledgement was lost and outcome is unknown, status reconciliation checks the existing intent before any new create operation. A recovered original acknowledgement leads to the same confirmation reference.
- Never tell the user to submit again in a way that can create a duplicate. Never expose stack traces or put personal data/internal-only codes in copy, URLs, analytics, or client logs.

### Success state

```text
┌─ H1 Request received (focus target) ─────────────────────┐
│ This is not a confirmed appointment.                     │
│ Reference: [SERVER-GENERATED REFERENCE]                  │
│ [VERIFY: truthful response expectation]                  │
│ [VERIFY: confirmation channel and what to do next]       │
│ If you do not receive it / need help:                    │
│ [VERIFY: staffed telephone + hours]                      │
│ [Return Home] [Find a Doctor] [Explore Services]         │
└───────────────────────────────────────────────────────────┘
```

Success replaces the form only after authoritative server acknowledgement. Refresh, Back, retry, or reopening the acknowledgement URL must not create another request. The reference is safe to display but is not placed in a public/query URL if that would disclose personal/request information.

### Confirmation-channel failure after accepted request

```text
┌─ Request received; message delivery problem ─────────────┐
│ Reference: [SAME SERVER REFERENCE]                        │
│ Your request was received, but [VERIFY: confirmation     │
│ channel] could not be delivered. Do not resubmit.        │
│ [VERIFY: next step + staffed telephone fallback]         │
└───────────────────────────────────────────────────────────┘
```

This is not a form-submission failure. Keep the accepted reference, do not expose a retry that creates a request, and distinguish “request received” from “confirmation message delivered.”

## Section map — purpose, requirements, and content ownership

| ID | Purpose and user need | Requirement IDs | Content and owner dependencies |
| --- | --- | --- | --- |
| A0 | Keep global tasks, language, and emergency access predictable without obscuring the form. | `G-001`, `G-003`–`G-006`, `S-006`–`S-008` | Approved logo/labels: Brand + Product; Call data: Operations; Phase 1 translations: Clinical + Content. |
| A1 | Set the truthful expectation that this is a request for follow-up, not a booking. | `A-001`, `A-006`, `G-010` | Operating workflow, recipient team, staffed hours, and request terminology: Operations + Content. |
| A2 | Redirect urgent need before any personal-data collection. | `A-002`, `E-001`, `E-005`, `S-006` | Warning and translated safety meaning: Clinical + Content; verified emergency purpose/number: Operations. |
| A3 | Let a user understand and efficiently fix all invalid answers without losing valid work. | `A-004`, `G-005`, `G-011` | Error vocabulary in both languages: Content + QA; field rules: Operations + Privacy + Delivery. |
| A4 | Collect only the minimum information needed to route and follow up. | `A-003`, `A-004`, `S-003`, `D-001`–`D-003`, `V-001`, `V-003` | Candidate fields/conditional rules: Operations + Privacy; roster/taxonomy IDs: Medical staff owner + Clinical + Content; validation/security: Delivery + Security. |
| A5 | Explain collection before submission and capture informed, unbundled consent where required. | `A-005`, `S-003`–`S-006` | Purpose, lawful basis if applicable, recipients, retention, choices, withdrawal/contact, notice and translations: Privacy/legal + Security + Content. |
| A6 | Make the consequence explicit, prevent duplicates, and communicate progress/outcome. | `A-001`, `A-006`, `A-007`, `G-011`, `G-012` | Submit/success/failure copy: Operations + Content; idempotency and acknowledgement contract: Delivery; channels/SLA: Operations. |
| A7 | Give a staffed non-digital recovery route for uncertainty or failure. | `A-006`, `C-001`, `G-007` | Purpose-labeled number, staffed hours, escalation and rescheduling/cancellation scope: Operations. |
| A8 | Preserve core routes plus privacy/accessibility information. | `G-001`, `S-004`, `C-001` | Canonical footer record: Operations; approved privacy and accessibility routes: Privacy/legal + Product. |

## Section map — layout, components, and outcomes

| ID | Layout and hierarchy | Reusable components | Interaction and navigation outcome |
| --- | --- | --- | --- |
| A0 | Flat top-level shell, no breadcrumb; compact menu and emergency action remain outside form. | Skip link, header, navigation/menu, language switcher, emergency action. | Global routes; language retains safe form state only under approved equivalence rules. |
| A1 | `intro`; H1 and two-sentence maximum explanation; no progress indicator because the proposed form is one page. | Page introduction, information text. | Optional in-page link to process details only after core expectation; no “Book now.” |
| A2 | Static, non-dismissible alert immediately before form. | Warning alert, Emergency action/Call link. | Emergency call opens only explicit approved `tel:`; no form data is submitted. |
| A3 | Error summary appears before field groups after invalid submit. | Error summary, text links, inline errors. | Summary receives focus; links focus fields; corrections retain other data. |
| A4 | One form, single column, semantic fieldsets by purpose; one conditional selector. | Radio group, select, input, textarea, labels/hints/errors. | Doctor/service choice reveals only its matching approved selector; Not sure shows no conflicting required field. |
| A5 | Privacy disclosure and checkbox directly before submit region; no collapsed essential text. | Information content, privacy link, native checkbox. | Privacy → `/privacy/`; consent starts unchecked and is required only under approved legal model. |
| A6 | Review reminder followed by one primary submit action and adjacent status region. | Primary button, loading status, error/success alert. | Standard POST/server validation; acknowledged success replaces form; failure preserves it; safe retry reconciles intent. |
| A7 | `support` immediately after form/state, always visible. | Purpose-labeled call link. | Opens approved staffed appointment `tel:`; label/hours clarify that it is not emergency contact. |
| A8 | Footer after support. | Footer and text links. | Core tasks, contact, privacy, accessibility, language scope. |

## Section map — responsive states and cross-cutting gates

| ID | Mobile, tablet, desktop behavior | Applicable states | Accessibility, bilingual, safety, privacy, performance, motion | Open decisions and approval gates |
| --- | --- | --- | --- | --- |
| A0 | Compact logo/menu/emergency; full nav wide; no sticky bar covers fields or submit. | Menu open/closed; current page; translation available/unavailable. | Logical focus; 44 px targets; long labels wrap; reduced menu motion. | Header labels/order; safe form-language switch behavior. |
| A1 | Reading/form width at all sizes; no oversized hero. | Default; workflow unavailable blocks form publication. | One H1; plain HTML; Amharic instruction parity; no claims/animation. | Request owner, process, staffed hours, response model. |
| A2 | Full-width within form column; never hidden/collapsed. | Static default; missing number/wording blocks publication. | Before data fields in DOM; explicit call; no color-only meaning; translated clinical review. | Warning, number, purpose, exact label. |
| A3 | Wraps in form column; anchors account for any header offset. | Hidden default; validation errors; server field errors. | Focus target; count + linked specific errors; assertive only when newly shown; reduced-motion no smooth-scroll reliance. | Error copy, rules, screen-reader/browser pairs. |
| A4 | One column at 320 through desktop; radio labels and selectors wrap; native controls preferred. | Pristine, filled, inline valid/error, conditional empty, roster/taxonomy unavailable, server validation. | Persistent labels; correct autocomplete/input mode; no data in URL/analytics/logs; no medical history; low JS cost. | Every field, requiredness, formats, source lists, notes inclusion. |
| A5 | One column; consent target ≥44 px; disclosure remains visible. | Unchecked default, checked, validation error, notice unavailable. | Not preselected; no switch control; complete approved English/Amharic meaning; privacy route works without JS. | Legal basis, copy, recipients, retention, withdrawal/contact, recording. |
| A6 | Stable full-width mobile submit; intrinsic-width wide; state messages reserve/replace space predictably. | Ready, pending, timeout, offline, API failure, duplicate/recovered acknowledgement, success, confirmation-delivery failure. | Busy/status announced once; focus summary/success; idempotent server; no PII leak; motion 0–300 ms; CLS protected. | SLA, reference format, response/confirmation channel, retry/status contract. |
| A7 | Full-width support under form; never obscured by sticky UI. | Default; form failure; form unavailable; canonical contact missing = release block. | Visible number/purpose/hours; approved `tel:`; Amharic copy; no digital-only dead end. | Staffed fallback, hours, escalation/cancel/reschedule scope. |
| A8 | Stacked link groups compact, wrapping multi-column wide. | Default; language-scope message; governed contact unavailable. | Same canonical data; privacy/access links; no trackers required. | Footer content and notice readiness. |

## Validation contract

| Moment | Behavior |
| --- | --- |
| Before interaction | No error. Instructions and required/optional status are already visible. |
| Blur after a reasonable answer attempt | Validate format/completeness where helpful; add specific linked inline message without clearing the value. |
| Care-route change | Remove the no-longer-applicable selector from validation and submission. Ask before discarding a previously selected value if loss could surprise the user. |
| Submit with field errors | Prevent create request; render/focus summary; preserve all values; link every summary error to its field; keep inline errors. |
| Server field rejection | Treat as validation, using safe user-facing wording; never expose internal schema/security detail. |
| Timeout or connection loss | Do not assume failure or success; preserve form and reconcile the same submission intent before offering safe retry. |
| Corrected field | Remove its error when confirmed valid; update summary without unexpectedly moving focus. |

## Submission and duplicate state model

```text
EDITING
  ├─ invalid submit → VALIDATION ERROR → EDITING (values retained)
  └─ valid submit → PENDING [one submission intent; controls duplicate activation]
                    ├─ authoritative accepted → RECEIVED
                    │    ├─ confirmation delivered → SUCCESS
                    │    └─ confirmation failed → RECEIVED / DELIVERY WARNING
                    ├─ authoritative rejected → RECOVERABLE FAILURE → safe retry, same intent
                    └─ timeout/offline/unknown → RECONCILING
                                                 ├─ found accepted → RECEIVED
                                                 └─ not created → safe retry, same intent
```

Implementation acceptance must prove one operational request per submission intent under double click, Enter-key repeat, refresh, Back/Forward, retry, offline recovery, and lost acknowledgement.

## Language-switch behavior while editing

1. If the equivalent route, fields, instructions, privacy disclosure, consent, validation, and state copy are all approved, switch in place and preserve values by stable field IDs.
2. Re-render selected doctor/service names from their canonical translated record; never translate submitted identifiers.
3. If equivalent consent/field meaning is unavailable, do not switch silently. Explain the limitation before any reset and offer cancel/stay plus safe translated help routes.
4. Never place form values in a language-switch URL. Both English and Amharic remain left-to-right, and labels/errors must allow at least 35% expansion.

## No-JavaScript and failure baseline

- The HTML form uses a secure POST; server-side validation, abuse controls, and idempotency remain authoritative.
- Conditional care selections can be rendered by a server round trip or a single accessible combined select fallback; no user is forced to submit both doctor and service.
- On invalid response, the server re-renders safe field values, error summary, and inline errors. Password-like or sensitive medical fields do not exist.
- Emergency warning/call, privacy disclosure, notice link, submit, and staffed fallback work without client JavaScript.
- Do not load analytics, chat, maps, pixels, or session replay on this journey without an approved purpose and data flow. Form values never enter third-party telemetry.

## Publication and approval gates

- Operations must define the receiving team, staffed hours, routing, response expectation, confirmation channel, escalation, cancellation/rescheduling, and telephone fallback (`A-001`, `A-006`).
- Privacy/legal + Security must approve each field, purpose, lawful basis where applicable, recipient/access, retention/deletion, transport, logging, abuse control, consent, withdrawal/contact, and notice (`A-003`, `A-005`, `S-003`, `S-004`).
- Medical staff and Clinical/Content owners must approve the doctor roster, service taxonomy, canonical IDs, and unavailable-list behavior (`D-001`, `V-001`).
- Clinical + Content must approve the emergency warning and professional English/Amharic safety, instruction, privacy, validation, failure, and success copy (`A-002`, `S-006`).
- Delivery must define and test authoritative acknowledgement, idempotency, unknown-outcome reconciliation, safe retry, reference handling, and confirmation-delivery distinction (`A-006`, `A-007`).
- QA must validate keyboard, screen reader, touch, 320 px/400% zoom, long content, no JS, timeout, offline, retry, double submission, refresh, Back/Forward, reduced motion, and personal-data leakage (`A-004`–`A-007`, `G-003`–`G-012`).
