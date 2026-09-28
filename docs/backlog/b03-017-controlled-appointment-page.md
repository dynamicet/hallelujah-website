# B03-017 — Controlled Appointment Page and Form States

**Lane / priority / phase:** DELIVERY / P0 / Phase 1 preparation

**Status:** In review for controlled development

**Responsible/review identity:** `befikadusata` directing Codex in temporary Frontend,
Backend-contract and QA roles

**Tracking:** [issue #74](https://github.com/dynamicet/hallelujah-website/issues/74)

**Personal-data collection, provider, production and publication authority:** Not granted

On 26 September 2026, Africa/Addis_Ababa, the client directed an English-only controlled
implementation using synthetic content and the synthetic recipient label “Patient Experience
Team.” B03-017 moves Proposed → Ready → **In progress** on branch
`b03-017-appointment-page`. B03-016 PR #73 merged as
`aa92d695302de3fa5b153c3bc8e756dcd70593e8`; exact-main
[run 36110485980](https://github.com/dynamicet/hallelujah-website/actions/runs/36110485980)
passed and clears the preceding merge control.

## Controlled sequencing exception

The canonical B03-017 dependencies B03-011/APPT-01 and LANG-01 remain unresolved. Authentic
CARE-01/CARE-04 selectors, final privacy/operations approvals, named recipients and staff access
also remain gated. This exception permits only a loopback, noindex Appointment A0–A8 review
composition that:

- uses visibly synthetic doctor/service choices and a synthetic “Patient Experience Team” label;
- makes no response-time, staffed-hours, contact, confirmation-channel or operational promise;
- uses English controlled-development copy only and presents no unreviewed Amharic meaning;
- accepts no real request and sends, persists, logs or places no entered value in a URL;
- keeps `PERSONAL_DATA_COLLECTION=disabled` and mounts no public `/appointments/` route;
- makes no WhatsApp, Telegram or other external-provider request;
- treats database acceptance as the future authority and any later approved messaging as a
  notification only, never as the appointment record.

The exception does not satisfy B03-011/APPT-01, LANG-01, CARE-01, CARE-04, APPT-03 activation,
SEC-02 or DEL-01. B03-018 retains provider selection, delivery integration and delivery-state
updates.

## Controlled outcome

Implement a reusable server-rendered Appointment composition and isolated interaction adapter for
the A0–A8 form and handoff contract. The controlled preview must demonstrate conditional care
selection, persistent labels, explicit privacy acknowledgment, retained valid values, linked error
summary and the complete safe submission-state vocabulary without representing any specimen as a
real request or authoritative hospital receipt.

The preview may validate and transition synthetic values in the browser only. Its response headers
must prohibit form submission and network connections. With JavaScript unavailable, the form must
remain visibly unavailable before any collection can occur.

## Local review result

On 28 September 2026, Africa/Addis_Ababa, B03-017 moves In progress → **In review** after its
focused contract and 284-case rendered matrix, full repository verification, independent clean
reconstruction, dependency audit, reachable-history secret scan and diff-integrity check passed.
The optimized application build contains no public Appointment page route, and the controlled
preview enhancement remains outside the deployable public asset graph. Hosted exact-head CI and
explicit controlled acceptance are still required before Done.

## Allowed repository scope

- Appointment template, stylesheet and template export under `apps/web/src/design-system/`;
- controlled Appointment fixture, renderer, loopback server and focused checks under
  `apps/web/scripts/`;
- a small loopback-only preview enhancement under `apps/web/scripts/fixtures/` that never sends a
  request or enters deployable public assets;
- package commands, Appointment architecture, backlog and sanitized evidence documentation.

No new dependency, public route, API activation, token/cookie issuer, database change, provider,
staff/read API, authentic content, migration, infrastructure or unrelated refactor is authorized.

## Required state coverage

| State | Controlled contract |
| --- | --- |
| Editing | Persistent labels, required/optional status and no premature errors. |
| Validation error | Focusable summary links to inline errors; valid synthetic values survive correction. |
| Pending | Stable submit geometry, one polite status and duplicate activation disabled. |
| Known failure | States that nothing was accepted and retains a safe same-intent retry path. |
| Offline/unknown | Says the outcome is unknown and blocks creation of a second intent until reconciliation. |
| Duplicate/reconciled | Restores the original specimen reference without claiming a second request. |
| Receipt | Clearly labeled static authoritative-response specimen with reference and “not confirmed” boundary. |
| Delivery warning | Preserves the same specimen reference and says not to resubmit. |
| Workflow unavailable | Removes active submission and exposes the controlled boundary without inventing contact details. |
| No JavaScript | Form action remains prohibited and adjacent text states that no value can leave the page. |

## Acceptance criteria

1. A0–A8 appear in source order inside the existing global shell with one H1, one single-column
   form measure, the warning before fields and the privacy disclosure before submission.
2. Choosing doctor or service exposes only the matching synthetic selector; “not sure” exposes
   neither. Doctor and service can never both be required or submitted.
3. Invalid synthetic input exposes one focusable linked error summary plus inline programmatic
   errors; correction retains every other valid value and does not steal focus.
4. Controlled state specimens distinguish known failure, unknown outcome, reconciliation,
   authoritative receipt and delivery warning; only the receipt uses success semantics and the
   delivery warning retains its accepted specimen reference.
5. The consent control starts unchecked, has a minimum 44 px target and is never represented as
   legal approval. No notes, diagnosis, urgency or medical-history field exists.
6. At 320/360/768/1440 px, 200% text, forced colors, print and reduced motion, labels, errors,
   state copy and controls wrap without clipping, horizontal overflow or color-only meaning.
7. The preview uses loopback-only host validation, `no-store`, `noindex`, `connect-src 'none'` and
   `form-action 'none'`; it accepts no query, body or non-GET method and makes zero external request.
8. The optimized deployable build contains no `/appointments/` route and imports no synthetic
   fixture, loopback server or preview adapter.

## Verification plan

Use pinned Node.js 24.21.0 and pnpm 10.27.0:

```sh
pnpm appointment-page:check
pnpm appointment-page:smoke
pnpm appointment:check
pnpm lint
pnpm typecheck
pnpm verify
pnpm rebuild:verify
pnpm audit:dependencies
pnpm secrets:check --history
git diff --check
```

Review locally with `pnpm appointment-page:preview` on its loopback URL. Preview paths and state
controls are review-tool paths, never hospital application routes. Sanitized evidence must contain
only synthetic fixture values.

## Source contract

1. [Epic scope](epic-03-critical-journeys.md#appointment-operation-and-secure-intake-appointments-a0a8)
2. [Controlled appointment contract](b03-012-014-controlled-appointment-contract.md)
3. [Appointment backend architecture](../architecture/appointment-request-foundation.md)
4. [Appointment page specification](../ux/page-specifications.md#7-appointment-request)
5. [Appointment wireframe](../wireframes/appointment.md)
6. [Critical-journey specification](../visual-design/pages/critical-journeys/critical-journey-specifications.md#4-appointment-section-by-section-design)
7. [Accessible form primitives](../architecture/accessible-form-primitives.md)
8. [Implementation acceptance matrix](../validation/implementation-acceptance-matrix.md)

Screenshots and prototype code are references, not production architecture. Applicable benchmark
patterns are BM-02, BM-03, BM-05, BM-06 and BM-09–BM-11; the implementation may use their accepted
structural patterns but no benchmark content or asset.

## Stop conditions

Stop and report the exact gate if the work would require a real recipient/account, staffed hours,
response promise, telephone number, authentic clinician/service selector, privacy/legal statement,
Amharic translation, real patient value, public route, collection activation, provider, staff
access or representation that a controlled specimen was actually recorded or delivered.
