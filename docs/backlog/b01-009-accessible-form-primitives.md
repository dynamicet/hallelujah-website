# `B01-009` — Accessible Form Primitives

**Status:** In review for controlled development

**Execution date:** 14 September 2026, Africa/Addis_Ababa

**Personal-data collection, appointment, production, deployment, and publication authority:** Not granted

## Execution contract

| Field | Controlled execution value |
| --- | --- |
| Epic / lane / priority | Epic 01 / `DELIVERY` / `P0` |
| Phase / milestone | Phase 1 / `M1` |
| Old / new status | Proposed → Ready → In progress → In review |
| Responsible owner | Client workspace identity `befikadusata` directing Codex in the temporary Frontend Lead and QA roles |
| Acceptance owner | Same client identity for controlled-development acceptance; named Product, Frontend, Backend, QA, Accessibility, Privacy, Security, Operations, Clinical, Content, and Language people return at their production gates |
| Target environment | `T0` isolated local application and headless Chromium; private-repository hosted implementation `T1` required before controlled-development closure |
| Requirements / decisions | `A-004`, `A-006`; appointment use remains gated by `APPT-01`–`APPT-04`; production acceptance remains under `DEL-01` |
| Dependencies | Completed `B01-004`, merged `B01-007`, and working `B00-014`–`B00-016` controlled-development baselines |
| Allowed repository scope | Form components and first-party enhancement, component token aliases and generated outputs, controlled local fixture, static/rendered checks, architecture/backlog documentation, and sanitized screenshots |
| Repository review | [Issue `#14`](https://github.com/dynamicet/hallelujah-website/issues/14); pull request and hosted implementation run pending |
| Evidence destination | `evidence/B01-009-accessible-form-primitives-2026-09-14.md` and sanitized captures under `evidence/b01-009-rendered/` |

The client's 14 September 2026 correction and instruction to start `B01-009` authorized readiness
promotion, a scoped branch, implementation, local verification, sanitized evidence, and normal
repository review. It did not authorize an appointment route or backend, personal-data fields,
server collection, an authoritative outcome simulation, hospital content, real translations,
notifications, providers, analytics, deployment, DNS, production, or publication.

## Outcome and acceptance

1. Labeled form, text, textarea, select, radio/checkbox group, error summary, pending, receipt,
   accepted-delivery warning, known-failure, form-action, and submit APIs are exported through the
   production component boundary.
2. Persistent labels plus visible required/optional copy and format/privacy help precede collection.
   Help and error identifiers are joined through `aria-describedby`; `aria-invalid` is present only
   while the related error is visible.
3. Server-rendered error summaries are focusable and link to invalid controls. First invalid
   submission focuses the summary, while entered values and unrelated valid selections persist.
4. Pending exposes truthful busy/disabled state. Receipt props require explicit authoritative
   acceptance and a reference. Accepted-delivery warnings preserve the reference; known failure
   never looks successful or invites unsafe duplication.
5. Controls, errors, statuses, and actions remain usable across required responsive/reflow,
   enlarged-text, reduced-motion, forced-colors, print, keyboard, and no-JavaScript states.
6. The controlled fixture sends no request, stores nothing, accepts no hospital data, and cannot
   create an appointment or real receipt. Without its first-party enhancement, submit stays
   disabled before any value can leave the page.

## State applicability

- **Initial:** empty required controls, visible guidance, enabled submit only after the bounded
  first-party request-prevention enhancement is installed.
- **Invalid:** summary and field messages appear once, invalid relationships are current, focus
  moves to the summary, and synthetic values persist.
- **Pending:** form busy state and disabled submit prevent duplicate activation without hiding
  navigation or status.
- **Receipt:** static API specimen requires explicit authoritative acceptance and a reference; the
  interactive controlled form never reaches this state.
- **Accepted-delivery warning:** accepted reference remains visible and duplicate submission is not
  encouraged.
- **Known failure:** explicit non-acceptance wording is visually distinct from receipt.
- **No JavaScript:** submit is disabled with a visible reason; no form value is transmitted.
- **Reduced motion, forced colors, print, enlarged text:** protected static outcome behavior,
  system boundaries, printable values/references, and intrinsic containment remain explicit.

## Verification plan

| Method | Exact command | Expected result |
| --- | --- | --- |
| Token/component contract | `pnpm tokens:check`; `pnpm form-primitives:check` | Generated parity, component aliases, semantic form controls, help/errors, summary, status, request-prevention, and controlled-fixture checks pass |
| Application checks | `pnpm lint`; `pnpm typecheck`; `pnpm test`; `pnpm build` | Zero warnings/errors; no collecting route or server action exists |
| Rendered behavior and geometry | `pnpm form-primitives:smoke -- --capture-dir docs/backlog/evidence/b01-009-rendered` | Responsive/reflow/enlarged-text geometry, labels, relationships, targets, invalid-summary focus, pending, value retention, false-success prevention, no-JS, reduced-motion, print, and forced-colors assertions pass |
| Existing gates | `pnpm accessibility:smoke`; `pnpm budgets:smoke`; `pnpm runtime:smoke`; `pnpm verify` | Semantic, asset, runtime/security-header, and full repository gates pass |
| Hosted `T1` | Pull-request `quality-and-security` run | Green result belongs to the exact current review head before merge |

## Completion boundary

- [x] Production component APIs, generated aliases, first-party enhancement, and controlled fixture exist.
- [x] Static contracts and targeted application/build checks pass.
- [x] Required local browser interaction, responsive, zoom, enlarged-text, no-JavaScript, reduced-motion, print, and forced-colors checks pass.
- [x] Sanitized 320 px and 1440 px screenshots were visually reviewed.
- [x] Full local `pnpm verify` and reachable-history secret scan pass.
- [x] Dependency declarations and `pnpm-lock.yaml` are unchanged from the successful `B01-007`
      audit; the stalled fresh-registry refresh is recorded without claiming a new pass.
- [ ] Pull request implementation head passes hosted `T1`; the documentation closeout head repeats the gate before merge.
- [ ] Named production roles accept real fields/copy, backend validation, authentication/authorization, CSRF and abuse controls, idempotency/reconciliation, operations, privacy/security, physical-device and assistive-technology behavior, language, and release evidence.

The last item is an external production gate. The controlled implementation may close independently
after local and hosted implementation evidence passes. `APPT-01`–`APPT-04` and later appointment
tickets own real collection and authoritative receipt behavior. `B01-010` is the next
dependency-satisfied Epic 01 delivery primitive after this implementation merges.

## References

- [Epic scope](epic-01-design-system-global.md)
- [Form component contract](../design-system/components.md#8-forms)
- [Form architecture](../architecture/accessible-form-primitives.md)
- [Forms and asynchronous checklist](../visual-design/handoff/accessibility-and-validation-checklist.md#forms-and-asynchronous-behavior)
- [Implementation acceptance matrix](../validation/implementation-acceptance-matrix.md)
