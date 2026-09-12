# Backlog Ticket Template

Copy this template into the issue tracker or AI-assisted coding brief. Do not remove safety, source, test, or evidence fields merely because the implementation looks small.

## `[BACKLOG-ID] Outcome-oriented title`

| Field | Value |
| --- | --- |
| Epic | `00`–`08` |
| Lane | `DELIVERY` / `DECISION` / `CONTENT` / `EVIDENCE` |
| Priority | `P0` / `P1` / `P2` / `P3` |
| Phase / milestone | Phase 0/1/2/Post-launch; `M0`–`M8` |
| Status | Proposed / Ready / In progress / In review / Done / Blocked / Deferred / Cancelled |
| Responsible owner | Named person and role |
| Acceptance owner | Named accountable person and role |
| Target environment | Local / staging-acceptance / production |
| Routes / sections | Canonical routes and stable section IDs |
| Requirements | Exact IDs such as `G-005`, `A-007` |
| Benchmark applications | Exact applicable `BM-*` IDs and disposition; state `None` only with reason |
| Decisions / gates | Exact IDs; state whether each blocks build, collection, publication, or release |
| Parent / dependencies | Backlog IDs and external dependencies |
| Evidence destination | Durable non-sensitive or restricted location |

## Outcome

Describe the user, operational, governance, or risk outcome in one short paragraph.

## Scope

- Exact application/repository areas allowed to change.
- Routes, records, components, states, breakpoints, languages, environments, and integrations included.
- Server/client/CMS/infrastructure responsibilities.

## Explicit exclusions

- Facts, copy, translations, assets, providers, workflows, routes, refactors, or infrastructure choices this ticket does not authorize.
- Anything that must remain omitted, disabled, first-party-only, or fixture-only.

## Source contract

List direct links in authority order:

1. dated owner decision/evidence;
2. requirements and validation register;
3. page/utility specification and stable sections;
4. component/layout/interaction contracts;
5. wireframe and flow;
6. visual reference/prototype contract;
7. approved structured content and verification item;
8. applicable benchmark disposition.

When sources disagree, stop and resolve the higher-authority contract. Do not let an implementation or screenshot silently override it.

## Acceptance criteria

Use observable behavior. Include applicable negative and failure cases.

1. **Given** … **when** … **then** …
2. **Given** … **when** … **then** …
3. **Given** missing/unapproved/expired data, **when** the route renders, **then** the contracted omission or unavailable state appears and no plausible placeholder is invented.
4. **Given** JavaScript/images/fonts/optional provider are unavailable, **when** an essential task is attempted, **then** the contracted server-rendered content and recovery remain usable.
5. **Given** reduced motion, keyboard, screen reader, long Amharic, 320 px, and 400% reflow conditions, **when** the interaction is used, **then** meaning, focus, status, and completion remain intact.

## State coverage

- [ ] Default
- [ ] Loading/pending, only where content genuinely changes
- [ ] Empty/zero result
- [ ] Validation error
- [ ] Known failure
- [ ] Timeout/offline
- [ ] Unknown outcome/reconciliation, where applicable
- [ ] Disabled with adjacent explanation
- [ ] Unavailable/unapproved/expired/retired
- [ ] Authoritative success/receipt, where applicable
- [ ] Confirmation-delivery warning, where applicable
- [ ] No JavaScript / no optional provider
- [ ] Back/Forward, refresh, deep link, and focus restoration

## Quality and security checks

- [ ] Semantic structure, names, labels, descriptions, headings, landmarks
- [ ] Keyboard, focus visibility/order/return, target size, touch behavior
- [ ] Contrast, forced colors, no color-only meaning
- [ ] 320/360/tablet/1280/1440 and manual 200%/400% zoom/reflow
- [ ] English, Amharic, mixed/long content, missing-equivalent behavior
- [ ] Reduced motion, Save-Data, hidden/restored page
- [ ] No JS/images/fonts; offline/timeout/provider failure
- [ ] Server validation, authorization, encoding, CSRF, abuse/rate limits as applicable
- [ ] No personal/sensitive data, consent, secret, internal ID, or fixture in URL/log/analytics/snapshot/artifact
- [ ] Performance budgets and request inventory
- [ ] Canonical, metadata, structured data, sitemap, redirect/404/410, cache invalidation
- [ ] Record source/owner/review/expiry/rights/retirement behavior

## Verification plan

| Method | Exact command/session | Expected artifact | Evidence location |
| --- | --- | --- | --- |
| Static/lint/type/build |  |  |  |
| Unit/component |  |  |  |
| Integration/API/migration |  |  |  |
| Browser/end-to-end |  |  |  |
| Accessibility/AT |  |  |  |
| Security/privacy |  |  |  |
| Performance/resilience |  |  |  |
| Content/language/owner |  |  |  |

## AI-assisted coding brief

```text
Implement [BACKLOG-ID] only.

Allowed repository scope:
- [exact files/directories]

Authoritative sources:
- [direct links]

Required behavior and states:
- [acceptance criteria and state list]

Run and report:
- [exact commands]

Evidence to produce:
- [non-sensitive outputs and location]

Controlled fixtures:
- [allowed/not allowed; required PROTOTYPE/NON-PUBLIC labeling]

Do not invent or enable:
- clinical/operational facts;
- contact details, schedules, claims, translations, consent/privacy text;
- third parties, data fields, public routes, packages, or brand assets;
- unrelated refactors or destructive migrations.

Preserve unrelated existing and parallel work. Stop and report the exact gate if the contract cannot be completed without an unapproved decision. Completion means the scoped checks pass; it does not mean publication is approved.
```

## Evidence record

| Field | Result |
| --- | --- |
| Build / commit / artifact |  |
| Benchmark implementation | `BM-*` ID, local application, implementation location/state, test/evidence, deviation or `None` |
| Environment |  |
| Browser / OS / AT / device |  |
| Viewport / zoom / language / motion / network |  |
| Expected / actual |  |
| Pass / fail |  |
| Tester / date |  |
| Durable artifact |  |
| Defect / exception |  |
| Retest status |  |
| Acceptance owner outcome |  |

## Completion

- [ ] Ticket-specific acceptance criteria pass.
- [ ] Applicable global Definition of Done in [backlog operating model](README.md#definition-of-done) passes.
- [ ] Documentation and traceability were updated in the same change.
- [ ] Every applicable benchmark application is recorded as implemented, gated/disabled, intentionally inapplicable, or deferred, with evidence and no silent disposition change.
- [ ] Staging completion, content approval, collection enablement, publication approval, and production verification are recorded separately where applicable.
