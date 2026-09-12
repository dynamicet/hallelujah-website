# Order 6 — Polished Critical-Journey Designs

**Prepared:** 12 September 2026  
**Status:** Complete for non-public responsive design review; implementation and performed human/device validation remain open  
**Pages:** Home, Emergency, Request an Appointment  
**Direction:** Calm Wayfinding, using the fixed Order 4 foundations and Order 5 components

## Outcome

Order 6 turns the accepted `H0`–`H9`, `E0`–`E8`, and `A0`–`A8` wireframes into complete polished mobile-first page compositions. Every section was resolved before page assembly, and desktop visual groupings preserve the original DOM and focus order.

The package demonstrates the complete default Home, Emergency, and Appointment pages plus a dedicated appointment state board. It includes validation, pending, duplicate-intent, known failure, offline, unknown-outcome, recovered acknowledgement, authoritative receipt, confirmation-delivery warning, and workflow-unavailable treatments without activating any hospital operation.

## Artifacts

| Artifact | Purpose |
| --- | --- |
| [Critical-journey visual specifications](critical-journey-specifications.md) | Section-by-section composition, responsive behavior, states, motion, bilingual, privacy, performance, traceability, gates, and acceptance. |
| [Home design](home.html) | Complete `H0`–`H9` responsive composition with controlled service, clinician, visit, location, and trust specimens. |
| [Emergency design](emergency.html) | Complete `E0`–`E8` Level 0 composition with route distinction, explicit inert call choices, scope, text-first arrival, and optional-map failure baseline. |
| [Appointment design](appointment.html) | Complete `A0`–`A8` single-column, data-minimized, inert request form. |
| [Appointment state board](appointment-states.html) | `A3`/`A6` validation, pending, duplicate, failure, offline, reconciliation, success, delivery-warning, and unavailable compositions. |
| [Page composition CSS](page-compositions.css) | Page/layout rules importing the Order 5 component source without redefining primitives or semantic roles. |
| [Local study behavior](study.js) | Contained mobile-menu and inert-action announcements; no persistence, external request, telemetry, map, call, or submission. |
| [Rendered evidence](evidence/) | Desktop, compact, and reduced-motion screenshots plus validation notes. |

## Binding decisions

- The accepted page and section hierarchy is unchanged: 10 Home sections, 9 Emergency sections, and 9 Appointment sections.
- Home care access and search precede governed collections, practical access, and institutional storytelling.
- The Home hero uses one rights-independent abstract geometry field. It cannot contain critical text and disappears safely in print or media failure.
- Optional Home collections use controlled records for design review and must be omitted in public output when their approved set is empty.
- Emergency is Level 0 from entry to footer. The hospital/public distinction appears before the two purpose-labeled call actions.
- Emergency call controls are inert in this study. No source-candidate or invented number is rendered, and no surrounding card is clickable.
- Emergency entrance and directions remain complete text before the optional idle map launcher. No provider request exists.
- Appointment remains a one-page, one-column request form with no progress indicator, breadcrumb, or booking language.
- Doctor/service choice stays mutually conditional, while “I am not sure” requires neither. Full-name and preferred-date requiredness remain visibly unresolved.
- Brief notes are omitted rather than exposed before necessity, access, warning, security, and retention approval.
- Privacy/consent, errors, unknown outcomes, unavailable workflow, and all urgent elements stay Level 0.
- Only an authoritative acknowledgement receives success treatment. A delivery problem keeps the same accepted reference and says not to resubmit.
- Calls, search, language change, map, copy, retry, server check, privacy route, and form submission are inert or local-design navigation only.

## Review sequence

1. Read the [visual specifications](critical-journey-specifications.md) and confirm every source section/state remains represented.
2. Review [Home](home.html) for task priority, routine/Emergency separation, collection omission boundaries, text-first location, and trust subordination.
3. Review [Emergency](emergency.html) from H1 through route distinction, call choices, warning, scope, entrance, arrival, map failure, and non-emergency exit.
4. Review the default [Appointment page](appointment.html), then the [state board](appointment-states.html) against the documented submission state model.
5. Compare desktop, compact, and reduced-motion [evidence](evidence/) for wrapping, source order, target sizing, stable state geometry, and absence of visible clipping.
6. Treat every bracketed fact, controlled record, response, reference, contact, translation, and operation as unavailable for publication until its named owner records dated evidence.

## Evidence limits

The Order 6 pages were structurally checked and rendered in Chromium. Their original screenshots establish visible layout at their named viewport only. The later [Order 9 refinement](../responsive/README.md) performed complete-page Chromium geometry checks for bilingual stress fixtures and 200%/400% CSS-pixel reflow equivalents. Neither order establishes real screen-reader output, Windows High Contrast support, touch/dialer safeguards, low-end-device performance, cross-browser behavior, professional Amharic meaning, human comprehension, hospital approval, or public-release readiness.

## Completion record

- [x] `H0`–`H9`, `E0`–`E8`, and `A0`–`A8` are represented without changing accepted source order.
- [x] Home, Emergency, and Appointment have complete desktop and compact compositions.
- [x] Existing foundation and component tokens are inherited; the page layer introduces no raw color or page-only component variant.
- [x] Routine, Emergency, privacy, unavailable, error, unknown, and authoritative-success meanings remain distinct in words and structure.
- [x] All requested appointment validation, loading, failure, recovery, unavailable, duplicate, unknown-outcome, authoritative-success, and delivery states are designed.
- [x] The page studies contain no approved-seeming roster, taxonomy, contact, scope, direction, schedule, claim, response expectation, privacy term, or translation.
- [x] No live `tel:`, `mailto:`, map, form endpoint, analytics, font, media, icon, third-party script, cookie, storage, or network integration exists.
- [x] Responsive, reduced-motion, failed-media, no-JavaScript, and print behavior preserve content hierarchy and safe exits.
- [x] Evidence and known validation limits are recorded without claiming unperformed testing.

## Order 7 handoff

Use the Order 4 foundations, Order 5 components, this page-composition layer, and the care-discovery wireframes to design Doctor Directory, Doctor Profile, Services Directory, and Service Detail section by section. Preserve their accepted IDs and controlled-record rules. Include approved-filter, URL-state, pagination, no-match, failure/offline, missing-portrait, unavailable-record, governed relationship, and canonical-ID appointment-handoff presentations. Do not turn the Home controlled records into an approved roster/taxonomy or infer schedule, availability, capability, identity, relationship, contact, or translation facts.
