# `B01-010` — System State and Recovery Patterns

**Status:** In review for controlled development; full local `T0` passes and hosted implementation `T1` remains required

**Execution date:** 14 September 2026, Africa/Addis_Ababa

**Hospital operations, production, deployment, and publication authority:** Not granted

## Execution contract

| Field | Controlled execution value |
| --- | --- |
| Epic / lane / priority | Epic 01 / `DELIVERY` / `P1` |
| Phase / milestone | Phase 1 / `M1` |
| Old / new status | Proposed → Ready → In progress → In review |
| Responsible owner | Client workspace identity `befikadusata` directing Codex in the temporary Frontend Lead and QA roles |
| Acceptance owner | Same client identity for controlled-development acceptance; named Product, Frontend, QA, Accessibility, Operations, Clinical, Content, Language, Privacy, Security, and Release people return at their production gates |
| Target environment | `T0` isolated local application and headless Chromium; private-repository hosted implementation `T1` required before controlled-development closure |
| Requirements / decisions | `G-006`, `G-011`; real emergency, operational, workflow, language, privacy/security, and publication behavior remains under its domain gates |
| Dependencies | Completed `B01-004`, merged `B01-009`, and working `B00-014`–`B00-016` controlled-development baselines |
| Allowed repository scope | Alert/status and state components, canonical precedence resolver, component token aliases and generated outputs, controlled local fixture, static/rendered checks, architecture/backlog documentation, and sanitized screenshots |
| Repository review | [Issue `#16`](https://github.com/dynamicet/hallelujah-website/issues/16); pull request and hosted run required before controlled-development closure |
| Evidence destination | [Sanitized local evidence](evidence/B01-010-system-state-patterns-2026-09-14.md) and captures under `evidence/b01-010-rendered/` |

The client's 14 September 2026 instruction to start the next execution authorized readiness
promotion, a scoped branch, implementation, local verification, sanitized evidence, and normal
repository review. It did not authorize real hospital or clinical content, operational status,
crisis wording, personal-data collection, an authoritative action outcome, external providers,
analytics, public routes, deployment, DNS, production, or publication.

## Outcome and acceptance

1. Emergency/error/warning/information/success alerts, dated temporary notices,
   loading/non-critical skeletons, and empty/error/offline/unavailable/expired state APIs are
   exported through the production component boundary.
2. Static states use document semantics without unsolicited live announcements. Newly injected
   blocking errors and non-blocking statuses can explicitly select atomic assertive or polite
   announcement behavior.
3. Every feedback panel has a specific heading, concise message, non-color icon/boundary treatment,
   and action. Success requires explicit authoritative-completion intent, `SystemState` requires
   recovery, and temporary notices require affected scope, effective, expiry/review, and owner
   metadata at the typed boundary.
4. The exported precedence resolver applies unavailable/expired → error/invalid → disabled →
   loading/pending → pressed → focus-visible → hover → default while keeping visible focus when
   states coincide.
5. Loading preserves stable dimensions and critical facts. Skeleton geometry accepts no record
   text and is bounded to predictable non-critical repeated-record shapes.
6. The synthetic fixture remains fully server rendered, performs no retry or request, stores
   nothing, reports no real hospital state, and remains complete without JavaScript.

## State applicability

- **Static alert/status:** server-rendered emergency, warning, information, and temporary specimens
  use normal document reading order.
- **Injected error/status:** explicit assertive blocking-error and polite success shapes prove the
  opt-in live-region contract without claiming real outcomes.
- **Empty:** a valid controlled collection contains no approved records and provides a useful next
  route.
- **Error:** the cause is known, non-acceptance is explicit, and recovery is supplied.
- **Offline:** the current dependency is unreachable while static guidance remains available.
- **Unavailable/expired:** unsafe or stale action is absent; no successor is inferred; a safe
  current route remains.
- **Loading:** meaningful wait wording and critical facts remain readable; reduced motion uses a
  static indicator.
- **No JavaScript, forced colors, print, compact/reflow/enlarged text:** semantic output, boundaries,
  dates, actions, and recovery remain explicit and usable.

## Verification plan

| Method | Exact command | Expected result |
| --- | --- | --- |
| Token/component contract | `pnpm tokens:check`; `pnpm system-states:check` | Generated parity, alert/state variants, live timing, required recovery/metadata, precedence, skeleton boundary, protected motion, and fixture checks pass |
| Application checks | `pnpm format:check`; `pnpm lint`; `pnpm typecheck`; `pnpm test`; `pnpm build` | Zero warnings/errors; no request, provider, client component, or real operational route exists |
| Rendered behavior and geometry | `pnpm system-states:smoke --capture-dir docs/backlog/evidence/b01-010-rendered` | Responsive/reflow/enlarged-text geometry, announcements, focus, actions, dates, no-JS, critical-fact, loading, reduced-motion, print, and forced-colors assertions pass |
| Existing gates | `pnpm accessibility:smoke`; `pnpm budgets:smoke`; `pnpm runtime:smoke`; `pnpm verify` | Semantic, asset, runtime/security-header, and full repository gates pass |
| Hosted `T1` | Pull-request `quality-and-security` run | Green result belongs to the exact current review head before merge |

## Completion boundary

- [x] Production component APIs, precedence resolver, generated aliases, and controlled fixture exist.
- [x] Static contracts and targeted application/build checks pass.
- [x] Required local responsive, reflow, enlarged-text, no-JavaScript, focus, reduced-motion, print,
      and forced-colors browser checks pass.
- [x] Sanitized 320 px and 1440 px screenshots were visually reviewed.
- [x] Full local `pnpm verify`, reachable-history secret scan, and dependency audit pass.
- [ ] Pull-request implementation head passes hosted `T1`; the documentation-closeout head repeats
      the exact-head gate before merge.
- [ ] Named production roles accept real state vocabulary, lifecycle/expiry, owners, announcement
      timing, actions/retry rules, physical-device and assistive-technology behavior, language,
      security/privacy, operations, and release evidence.

The final checkbox is an external production gate and does not block controlled-development
closure after the local and hosted implementation matrices pass.

## References

- [Epic scope](epic-01-design-system-global.md)
- [Alerts/status component contract](../design-system/components.md#9-alerts-and-status)
- [System-state architecture](../architecture/system-state-patterns.md)
- [State contract](../visual-design/handoff/developer-handoff.md#8-component-and-state-contract)
- [Implementation acceptance matrix](../validation/implementation-acceptance-matrix.md)
