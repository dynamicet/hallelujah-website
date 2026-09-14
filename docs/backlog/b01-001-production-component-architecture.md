# `B01-001` — Production Component Architecture

**Status:** Done for controlled development; local and hosted implementation gates pass

**Execution date:** 14 September 2026, Africa/Addis_Ababa

**Publication, provider activation, production, deployment, and personal-data authority:** Not granted

## Execution contract

| Field | Controlled execution value |
| --- | --- |
| Epic / lane / priority | Epic 01 / `DELIVERY` / `P0` |
| Phase / milestone | Phase 1 / `M1` |
| Old / new status | Proposed → Ready → In progress → In review → Done for controlled development |
| Responsible owner | Client workspace identity `befikadusata` directing Codex in the temporary Frontend Lead role |
| Acceptance owner | Same client identity for controlled-development acceptance; named Delivery, Frontend, QA, and Accessibility people return before production acceptance |
| Target environment | `T0` isolated local validation and private-repository `T1` GitHub Actions execution |
| Requirements / decisions | `G-004`, `G-010`, `G-012`; approved motion/media amendment |
| Dependencies | Completed `B00-004` and `B00-005`; working `B00-015` and `B00-016` development baselines |
| Allowed repository scope | `apps/web/src/design-system`, bootstrap route/style refactor, application boundary tests, architecture/backlog documentation, and sanitized evidence |
| Issue tracker | [GitHub issue `#2`](https://github.com/dynamicet/hallelujah-website/issues/2) |
| Evidence destination | [Sanitized completion record](evidence/B01-001-production-component-architecture-2026-09-14.md) |

The client's 14 September 2026 direction to proceed with steps 1–4 authorizes this branch, readiness
promotion, controlled implementation, local and hosted verification, pull request, and merge. It
does not authorize hospital facts, translations, authentic brand assets, public routes, CMS models
or routes, providers, a motion runtime, remote media, personal-data collection, deployment, DNS, or
publication.

## Outcome and acceptance

1. Production source maps app → template → component → primitive/contract boundaries, while the
   canonical token value path remains primitive → semantic → component → template under `B01-003`.
2. Every design-system layer exposes a bounded `index.ts` public API; cross-layer consumers cannot
   import implementation files.
3. The controlled bootstrap route renders through the architecture without changing its safety or
   publication meaning.
4. Automated checks reject upward layer imports, internal API bypasses, cross-template CSS,
   reviewer controls, fixture query controls, simulated outcomes, prototype references, remote
   assets, and existing environment/legacy violations.
5. Levels 0–4 and the permanent protected contexts exist as typed contracts. No motion runtime or
   media behavior is introduced.

## State applicability

- **Default:** the bootstrap route renders through the production template and component APIs.
- **Invalid/failure:** forbidden imports or production-boundary signatures fail the application test.
- **No JavaScript, focus, forced colors, and reduced motion:** existing server-rendered semantics and
  forced-color behavior remain; protected-context policy is static and does not require JavaScript.
- **Loading, empty, timeout/offline, unavailable/expired, language switching, history, and success
  receipt:** no new behavior is introduced by this structural ticket; these states remain assigned to
  their component and route tickets.

## Verification plan

| Method | Exact command | Expected result |
| --- | --- | --- |
| Backlog integrity | `pnpm backlog:check` | Ticket, requirement, decision, links, and execution controls pass |
| Architecture boundary | `pnpm --dir apps/web test` | Current source and synthetic negative architecture cases pass |
| Static/type/build | `pnpm lint`; `pnpm typecheck`; `pnpm build` | Zero warnings/errors; production route builds |
| UI regression smoke | `pnpm accessibility:smoke`; `pnpm budgets:smoke` | Bootstrap semantics and budgets remain within the controlled baseline |
| Full local gate | `pnpm verify` | All repository quality/security checks pass |
| History credential scan | `pnpm secrets:check --history` | Reachable history passes with redacted failure behavior |
| Dependency audit | `pnpm audit:dependencies` | No moderate-or-higher known advisory; registry failure is not a pass |
| Hosted `T1` | Pull-request `quality-and-security` run | Green result belongs to the current pull-request head before merge |

## Completion boundary

- [x] App, template, component, primitive, and typed-contract responsibilities are documented and
  implemented through bounded public APIs.
- [x] The bootstrap route exercises the production composition path without adding or publishing a
  route or changing its controlled-development meaning.
- [x] Import direction, public API, template CSS, prototype/reviewer/fixture, remote-origin, legacy,
  and environment boundaries fail closed in the application test.
- [x] Levels 0–4 and permanent protected contexts are modeled without selecting a runtime or media.
- [x] Full local, history-secret, dependency-audit, and hosted implementation checks pass with
  sanitized evidence.
- [ ] Named Delivery, Frontend, QA, and Accessibility acceptance replaces the temporary development
  assignment at the applicable production boundary.

The unchecked named-acceptance item is a production gate, not an incomplete `B01-001`
controlled-development capability. Final design-token values remain `B01-002`/`B01-003`; motion and
media implementation remains `B01-012`–`B01-013`.

## References

- [Production component architecture](../architecture/production-component-architecture.md)
- [Design-system overview](../design-system/README.md)
- [Developer handoff](../visual-design/handoff/developer-handoff.md#3-prototype-to-production-boundary)
- [Motion/media amendment](../visual-design/motion/high-end-motion-and-interactive-media-amendment.md)
