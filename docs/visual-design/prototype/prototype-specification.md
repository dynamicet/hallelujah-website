# Order 10 Interaction and Journey Specification

**Status:** Implemented in the non-public local prototype  
**Source:** Orders 4–9, accepted wireframes and flows, design-system contracts, and unresolved publication gates

## 1. Prototype boundary

The connected prototype is a progressive enhancement over the existing static pages. Source order, section IDs, controlled records, persistent prototype identity, and the no-JavaScript static baseline remain intact. The shared layer makes only local `file:` navigation and loads no remote dependency. After Order 11, each page loads the shared layer directly after the fixture layer in parser order so reviewer controls do not appear as a late layout shift.

The prototype may simulate state but cannot:

- start a phone call, email, map, application, upload, appointment request, or hospital workflow;
- send, retain, log, classify, analyze, or recover visitor data;
- present an Amharic geometry fixture as approved translation;
- infer urgency, diagnosis, treatment, schedule, availability, capability, or current roster status;
- turn a simulated receipt or response duration into an operational promise.

## 2. Navigation map

| Journey | Connected behavior | Continuity |
| --- | --- | --- |
| Home → essential tasks | Routes to all complete page studies, with Emergency kept visually and behaviorally distinct. | Browser navigation is immediate; no exit animation. |
| Home → Search | Allows only `prototype`, `prototype care`, or `prototype service` in this local demonstration. | Safe controlled term becomes `q`; no analytics or external request. |
| Doctor/Service directory → detail | Opens the one controlled canonical detail page. | Query/filter/page remains in browser history. |
| Detail → Appointment | Passes only `doctor=prototype-clinician-a` or `service=prototype-service-a`. | Form resolves the controlled label and visitor can change route. |
| Not sure → Appointment | Passes only `care=not-sure`. | Neither doctor nor service becomes required. |
| Practical/Institutional → care | Returns to canonical directory, appointment, location, or Home route. | Ordinary browser Back remains available. |
| Any page → language fixture | Keeps route plus allow-listed public/query/filter state. | Unsafe or personal form values never enter the URL; a dirty Appointment form warns before fixture reset. |

## 3. Interaction contracts

### Shared shell and review controls

- Existing desktop, compact, no-JavaScript, footer, Emergency, and skip-link structures remain the source UI.
- The Order 10 review toolbar is labeled as reviewer tooling, not a hospital-interface proposal.
- Compact menu uses the existing native button, `aria-expanded`, controlled region, first-item focus, and Escape return.
- Internal page links retain the current non-English fixture and forced reduced-motion review mode.

### Directory and site search

- Forms remain GET-shaped and use real local URLs for Back, Forward, refresh, and share-state testing.
- The prototype accepts only the three controlled terms above. Any other text is rejected before URL creation, marked invalid, focused, and announced; this prevents accidental personal data from entering prototype history.
- Doctor specialty, service group, result type, and page values are allow-listed controlled state.
- Result changes are direct. Counts use a polite live region; grids do not animate or receive focus.
- Loading, no-match, failure, offline, and unavailable simulations are mutually exclusive, Level 0, and hide—not overlay—the controlled results.
- Recovery clears only `state`; the safe query/filter context stays available.
- Escape closes a compact filter and returns focus to the trigger without clearing state.

### Appointment request

- Doctor, service, and Not sure handoffs resolve only allow-listed public fixture IDs.
- The selected route controls one matching selector. Doctor and service are never required together; Not sure requires neither.
- The prototype does not enforce the unresolved Full name, Preferred date, phone-format, or consent policies.
- A missing conditional doctor/service creates one inline error and a focused error-summary heading while retaining other local fields.
- Valid simulation immediately disables the submit control, exposes busy status, and blocks duplicate activation.
- Only the `receipt` simulation receives success styling. Its `PROTO-ONLY-001` reference is visibly non-operational and repeats that the result is not a confirmed appointment.
- Known failure retains editing and permits the same simulated intent to retry.
- Unknown outcome blocks fresh submission and offers explicit “existing receipt found” or “not created” reconciliation branches.
- Delivery warning keeps the same simulated reference, does not claim the request failed, and offers no submit action.
- Locally entered contact values are never read by the simulator and are cleared before receipt/delivery panels replace the form.

### No-JavaScript prototype safety

- Every local `.demo-form` is `inert` in source HTML. The contained study script removes `inert` only when its interception layer is available.
- With script execution disabled or the study layer unavailable, form controls cannot accept or natively submit visitor input and a visible fail-closed explanation is shown.
- Essential page, emergency, care, arrival, governance, privacy, and fallback content remains ordinary semantic HTML; only the unsafe local form simulation is unavailable.

### Safety-critical and third-party boundaries

- Emergency remains Level 0 and has no `tel:` link, call activation, autofocus, autoscroll, countdown, pulse, or entrance animation.
- Contact, copy-directions, map, routine-support, careers Apply, privacy, and all external-provider specimens remain inert with a local explanation.
- Search does not implement urgent-term classification; the governed urgent-boundary designs remain on the state board pending approval.

## 4. Motion and reduced-motion behavior

- Content is complete before enhancement. Home may settle only its first five routine task cards by 8 px within the inherited short duration; Emergency never participates.
- Route changes, result replacement, errors, urgent/privacy/unavailable states, and navigation never wait for motion.
- `prefers-reduced-motion: reduce` and the reviewer `motion=reduce` override remove meaningful animation and smooth scrolling.
- Save-Data, an initially hidden document, a transition to hidden, or bfcache restoration sets a conservative mode that removes the Home orientation and task-card treatments.
- Forced reduction, content fixtures, public ID handoff, safe filters, and current path coexist in URL state without form values.

## 5. Traceability and evidence

| Assertion | Behavior | Primary flows/requirements |
| --- | --- | --- |
| `P10-01`–`P10-04` | Shared toolbar, no external resources, Home → directory → canonical profile | `F1`, `C1`, `G-001`–`G-002`, `D-001`–`D-003` |
| `P10-05` | Controlled doctor ID resolves at Appointment | `C6`, `A-001`–`A-003`, `D-004` |
| `P10-06` | Conditional validation, inline error, focused summary | `F3`–`F4`, `A-004`, `G-011`–`G-012` |
| `P10-07`–`P10-09` | Receipt, unknown outcome, and reconciliation | `F4`, `A-006`–`A-007`, `S-003` |
| `P10-10`–`P10-13` | Filter URL state, Escape return, failure, recovery | `C2`, `C3`, `D-002`, `V-002`, `G-005`, `G-011`–`G-013` |
| `P10-14` | Amharic fixture keeps route/query/filter context and visible limitation | `F5`, `C7`, `S-006`–`S-008` |
| `P10-15` | Emergency stays inert, static, and dependency-free | `F2`, `E-001`–`E-005`, `C-001`–`C-003` |
| `P10-16` | Forced reduced-motion equivalence | `G-012`, Order 3 SB1–SB9 |
| `P10-17`–`P10-18` | Unsafe local query rejected; controlled query reaches Search Results | `F1`, `PA3`–`PA6`, `H-005`, `SEARCH-01`–`SEARCH-02` |
| `P10-19` | 15 artifacts × 3 viewport conditions pass overflow, target, toolbar, and dependency checks | `G-003`–`G-013`, Orders 4, 5, and 9 |

The repeatable result is stored in [`evidence/order-10-audit-results.json`](evidence/order-10-audit-results.json). This evidence is an Order 10 implementation check, not the broader human/device/accessibility certification assigned to Order 11.
