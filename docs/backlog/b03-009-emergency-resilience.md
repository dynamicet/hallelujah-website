# B03-009 — Controlled Emergency Resilience and Failure States

**Lane / priority / phase:** DELIVERY / P0 / Phase 1 preparation
**Status:** Done for controlled development; final closeout CI and checked merge tracked below
**Tracking:** [issue #68](https://github.com/dynamicet/hallelujah-website/issues/68)
**Review:** [PR #69](https://github.com/dynamicet/hallelujah-website/pull/69)
**Publication and emergency-use authority:** Not granted

On 23 September 2026, Africa/Addis_Ababa, the client first directed documentation of the completed
`B03-008` merge and creation of this controlled-development brief and its tracking issue, then
explicitly directed implementation. `B03-009` therefore moves Proposed → Ready → In progress
within the synthetic-only boundary below. This direction does not authorize authentic safety data,
a public route, call activation, a map/provider request, production, emergency use or publication.

`B03-008` is Done for controlled development. Its checked PR #67 merged as
`2a7f5d11d42cd5551cb65bca20b56e65d1fd87f3`; exact-head documentation
[run 35825256269](https://github.com/dynamicet/hallelujah-website/actions/runs/35825256269)
and exact-main
[run 35844236363](https://github.com/dynamicet/hallelujah-website/actions/runs/35844236363)
passed. `B01-010`–`B01-012` are also Done for controlled development. The merge-control
prerequisites for readiness review are therefore satisfied.

## Controlled sequencing boundary

The production Emergency states depend on approved, current facts from `B03-001`–`B03-003` and
`SAFE-01`–`SAFE-04`; professional safety-language review under `LANG-01`; provider/privacy review
under `SEC-02`; and the formal evidence matrix under `DEL-01`. Those gates remain open.

A later explicit start direction may promote a controlled implementation that extends only the
loopback, noindex B03-008 specimen with visibly synthetic, deliberately invalid and inert state
fixtures. Such fixtures may exercise state selection, lifecycle rejection, rendering, recovery
placement and resilience without activating any real-world behavior. They must never become a
source of plausible safety information.

The controlled implementation must not create a public `/emergency/` route, `tel:` or `mailto:`
target, valid-looking contact, coordinate, geolocation, external map link, provider request, form,
personal-data input, analytics event, authentic clinical/operational statement or deployable
fixture import. A synthetic call-handoff-unsupported specimen may retain its deliberately invalid
display value for layout and manual-dial guidance review, but it cannot activate a dialer or claim
that a call or emergency service failed.

## Outcome

Extend the controlled Emergency composition with fail-closed state contracts so required safety
facts are never guessed or retained after withholding/expiry, an unsupported call handoff keeps
the visible verified value and context, optional-map failure cannot remove text directions, and
the page remains understandable without JavaScript, CSS or media. Production behavior remains
gated until authentic records and human/device evidence exist.

## Allowed repository scope

- `apps/web/src/design-system/templates/emergency-template.tsx` and its colocated stylesheet;
- `apps/web/scripts/lib/emergency-fixture.mjs`, Emergency renderer/preview helpers and server;
- `apps/web/scripts/check-emergency.mjs` and `check-emergency-rendered.mjs`;
- existing Emergency package commands, without adding a dependency;
- `docs/architecture/emergency-page.md`, this brief, the execution board and sanitized evidence.

The deployable application route, CMS schemas, canonical contact model, database, providers,
infrastructure, unrelated design-system components and non-Emergency pages are outside scope.

## Required controlled state coverage

| State | Controlled contract |
| --- | --- |
| Required content withheld | A page-level unavailable state identifies the approval boundary and safe recovery destination; it exposes no prior, candidate or fixture safety value and cannot render the normal call choices. |
| Required content expired | Expiry dominates every lower state; all expired contact, distinction, scope and required arrival values are removed together, with no stale call action or inferred successor. |
| Call handoff unsupported | The purpose and deliberately invalid synthetic display value remain readable; focus/context is retained; guidance says only that automatic handoff is unsupported and never claims the call or service failed. No surrounding region activates. |
| Required arrival unavailable | Missing entrance or required text directions prevents the ready composition; no map or generic directions substitute for it. |
| Optional map failure/blocked | Complete synthetic text directions and arrival/accessibility guidance remain before a non-blocking map state; there is no external fallback link or request without provider approval. |
| No JavaScript/CSS/media | Semantic headings, state explanation, retained manual information and recovery remain in source order; absence of enhancements cannot reveal hidden/stale values or remove essential text. |
| Announcement behavior | Initial server-rendered unavailable/expired/failure content is read in document order without a live-region interruption. Any explicitly injected controlled state uses one atomic announcement only and does not duplicate on rerender. |

Loading is not valid for required Emergency facts. Empty is not a valid substitute for required
content. The website has no “call connected” success state. Optional media remains absent and the
Emergency experience remains motion Level 0.

## Acceptance criteria

1. **Given** any required contact, distinction, warning, scope, entrance or directions field is
   missing, withheld, invalid or expired, **when** the state resolver composes the page, **then** it
   selects the unavailable/expired result and emits none of the unsafe record values or normal call
   choices.
2. **Given** both expired and lower-priority failure/interactive states, **when** precedence is
   resolved, **then** expired wins and no disabled or stale emergency action can reappear.
3. **Given** a call-handoff-unsupported specimen, **when** it renders and is navigated with keyboard
   or assistive semantics, **then** the purpose and display value remain readable, recovery is
   adjacent, context is retained and neither the card nor its whitespace is actionable.
4. **Given** an optional-map error, blocked-provider state or no JavaScript, **when** the page is
   rendered, **then** E5/E6 text directions remain complete and earlier in source order and zero
   provider, coordinate, geolocation or external-link request occurs.
5. **Given** CSS, fonts and media are unavailable, **when** every controlled state is read, **then**
   its heading, explanation, retained safe information and recovery remain usable in document
   order without content generated only by CSS or script.
6. **Given** static and explicitly injected controlled state specimens, **when** accessibility
   semantics are inspected, **then** static content has no unsolicited live region and each injected
   change exposes no more than one appropriate atomic announcement.
7. **Given** 320/360 px, 200% text, 400% reflow equivalent, forced colors, print and reduced motion,
   **when** all states render, **then** content wraps without clipping, focus remains visible,
   meaning is not color-only and no Emergency-subtree motion appears.
8. **Given** an optimized production build, **when** route and trace isolation is checked, **then**
   `/emergency/` is still absent and no synthetic fixture, preview server or state adapter enters the
   deployable application graph.

## Source contract

1. [Epic ticket and dependencies](epic-03-critical-journeys.md#emergency-emergency-e0e8)
2. [Requirements `G-007`, `G-011`, `E-005`](../requirements/requirements-matrix.md)
3. [Emergency page specification](../ux/page-specifications.md#2-emergency)
4. [Emergency wireframe state inventory](../wireframes/emergency.md#state-inventory)
5. [Page handoff matrix](../visual-design/handoff/page-handoff-matrix.md#page-contracts)
6. [System-state architecture](../architecture/system-state-patterns.md)
7. [Controlled Emergency architecture](../architecture/emergency-page.md)
8. [Implementation acceptance matrix](../validation/implementation-acceptance-matrix.md)

Applicable benchmark dispositions are `BM-02`, `BM-06`, `BM-08`–`BM-11` and `BM-13` from the
[benchmark traceability contract](../benchmarks/benchmark-traceability.md). The controlled pull may
apply their structural patterns only; hospital facts, staffed fallbacks, bilingual meaning, on-site
arrival, named governance and final human/device evidence retain their recorded gates.

## Verification plan

Use pinned Node.js 24.21.0 and pnpm 10.27.0. A started implementation must run and report:

```sh
pnpm emergency:check
pnpm emergency:smoke
pnpm verify
pnpm rebuild:verify
pnpm audit:dependencies
pnpm secrets:check --history
git diff --check
```

The Emergency checks must cover every state above, state precedence, escaping, zero authentic or
plausible contact values, zero active call/provider/external targets, responsive and accessibility
semantics, no-JS/no-CSS behavior, response headers and deployable-build isolation. Sanitized
captures may show only synthetic fixtures and belong under a B03-009 evidence directory.

Hosted exact-head T1, explicit controlled client acceptance, checked merge and passing exact-main
CI are required before Done. `B03-010` remains the separate human/device, comprehension, language,
live-call and on-site acceptance ticket and cannot be satisfied by this controlled work.

Local implementation evidence is recorded in the
[B03-009 controlled resilience evidence](evidence/B03-009-emergency-resilience-2026-09-23.md).

## Stop conditions

Stop and report the exact gate if implementation would require a real or plausible telephone
number, clinical instruction, hospital/public route rule, service scope, hours, address, entrance,
landmark, staffed fallback, translation, external provider, public route or claim that a call was
placed, connected or failed. Completion of controlled checks would not approve emergency use or
publication.

## Controlled acceptance — 23 September 2026

The client directed “close out b03-009”. B03-009 moves In review → **Done** for controlled
development under `befikadusata` as responsible and controlled acceptance person, directing Codex
in temporary Frontend and QA roles on 23 September 2026, Africa/Addis_Ababa. Target remains
synthetic local T0/private hosted T1 under the working B00-016 matrix. B03-001–B03-003,
SAFE-01–SAFE-04, LANG-01, SEC-02 and formal DEL-01 remain unresolved.

All recorded local gates pass. Exact-head hosted
[run 35893534863](https://github.com/dynamicet/hallelujah-website/actions/runs/35893534863)
passes every step, including complete verification and independent frozen clean reconstruction,
for `3cd89ae3bfe95866faf306be2d9d91534a1a0309`. No scoped controlled-implementation defect remains
open. Final acceptance-documentation CI must pass for its exact SHA before checked merge of PR #69.
Issue #68 and PR #69 must retain the matching SHA/run, merge SHA and exact-main result. Dependent
execution waits for passing exact-main CI; B03-010 is not promoted by this acceptance.

This closeout accepts only the inert, loopback-only controlled-development artifact. It does not
approve an authentic emergency number or safety statement, call activation, professional Amharic
clinical meaning, physical-device or on-site arrival behavior, `/emergency/`, a provider,
production, emergency use or publication. Those gates remain withheld for B03-001–B03-003,
B03-010 and their governing control records.
