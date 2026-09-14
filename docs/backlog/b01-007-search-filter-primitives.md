# `B01-007` — Search and Filter Primitives

**Status:** Done for controlled development; full local `T0` and hosted implementation `T1` gates pass

**Execution date:** 14 September 2026, Africa/Addis_Ababa

**Publication, real-search, query-processing, production, and deployment authority:** Not granted

## Execution contract

| Field | Controlled execution value |
| --- | --- |
| Epic / lane / priority | Epic 01 / `DELIVERY` / `P1` |
| Phase / milestone | Phase 1 / `M1` |
| Old / new status | Proposed → Ready → In progress → In review → Done for controlled development |
| Responsible owner | Client workspace identity `befikadusata` directing Codex in the temporary Frontend Lead and QA roles |
| Acceptance owner | Same client identity for controlled-development acceptance; named Product, Frontend, Backend, QA, Accessibility, Privacy, Security, Clinical, Content, and Language people return at their production gates |
| Target environment | `T0` isolated local application and headless Chromium; private-repository hosted implementation `T1` pass |
| Requirements / decisions | `D-002`, `H-005`, `S-005`; real behavior remains gated by `SEARCH-01`, query handling by `SEARCH-02`, and providers by `SEC-02` |
| Dependencies | Completed `B01-004` and merged `B01-006`; working `B00-014`–`B00-016` controlled-development baselines |
| Allowed repository scope | Search/filter components and first-party enhancement, URL-state adapter, component token aliases and generated outputs, controlled local fixture, static/rendered checks, architecture/backlog documentation, and sanitized screenshots |
| Repository review | [Issue `#12`](https://github.com/dynamicet/hallelujah-website/issues/12), [pull request `#13`](https://github.com/dynamicet/hallelujah-website/pull/13), and [hosted implementation run](https://github.com/dynamicet/hallelujah-website/actions/runs/34884990666) on `eb58db6` |
| Evidence destination | [Sanitized local evidence](evidence/B01-007-search-filter-primitives-2026-09-14.md) |

The client's 14 September 2026 instruction to start the next execution authorized readiness
promotion, a scoped branch, implementation, local verification, sanitized evidence, and normal
repository review. It did not authorize a public search/directory route, hospital records, taxonomy,
ranking, urgent-term behavior, real translations, remote suggestions, query logging/analytics,
providers, personal-data collection, deployment, DNS, production, or publication.

## Outcome and acceptance

1. Search form/box, filter disclosure/group, active chips, result count, pagination, and URL-state
   helpers are exported from the production component boundary.
2. The baseline is a labeled server-rendered GET form. Query length is bounded; filter values use a
   consumer-supplied public allowlist; page is a positive bounded integer; URL generation emits only
   `q`, `type`, and `page`.
3. Filter groups use native fieldset, legend, labels, and checkboxes. Compact filters disclose
   natively; the additive first-party enhancement closes idle compact filters, preserves active/wide
   visibility, handles Escape, and restores summary focus.
4. Active filters have purpose-labeled removal links and clear-all recovery. Result counts use one
   atomic polite status. Pagination uses real links, explicit Previous/Next labels, and
   `aria-current="page"`.
5. Search/filter/page state survives refresh, Back, and direct navigation. The controlled server
   response works without JavaScript; the enhancement makes no request and stores no visitor data.
6. The five-record fixture is visibly synthetic, non-diagnostic, local-only, and contains no
   hospital fact, public route, unpublished identifier, provider, or personal data.

## State applicability

- **Initial:** empty bounded query, no selected type, first page, five controlled records.
- **Searched/filtered:** server reads normalized `q`, allowlisted repeated `type`, and bounded `page`;
  the input, checkbox, active-chip, count, and result state agree.
- **Paged:** conventional real links preserve query/filter state and mark the current page.
- **Zero:** retained input and filters accompany an explicit reset/recovery action.
- **Compact/wide:** compact uses a native disclosure; wide keeps filters visible. Active compact
  filters remain exposed.
- **Back/Forward/refresh:** the URL remains authoritative; first-party restoration prevents stale
  browser form state from disagreeing with the rendered result set.
- **No JavaScript:** the server-open filter panel, GET form, result count, results, and pagination
  remain complete.
- **Reduced motion, forced colors, print, enlarged text:** static equivalents, system boundaries,
  printable state, and wrapping/intrinsic containment remain explicit.

## Verification plan

| Method | Exact command | Expected result |
| --- | --- | --- |
| Token/component contract | `pnpm tokens:check`; `pnpm search-controls:check` | Generated parity, 312 tokens, GET/label/filter/chip/count/pagination/URL/focus/mode/source-boundary checks pass |
| Application checks | `pnpm lint`; `pnpm typecheck`; `pnpm test`; `pnpm build` | Zero warnings/errors; controlled root is request-rendered only because it reads fixture query state |
| Rendered behavior and geometry | `pnpm search-controls:smoke --capture-dir docs/backlog/evidence/b01-007-rendered` | Responsive/zoom/200%-text geometry, GET state, pagination, Back restoration, count, compact/wide disclosure, Escape focus, no-JS response, targets, reduced-motion, print, and forced-colors assertions pass |
| Existing gates | `pnpm accessibility:smoke`; `pnpm budgets:smoke`; `pnpm runtime:smoke`; `pnpm verify` | Semantic, asset, runtime/security-header, and full repository gates pass |
| Hosted `T1` | Pull-request `quality-and-security` run | Green result belongs to the exact current review head before merge |

## Completion boundary

- [x] Production component APIs, allowlisted URL-state adapter, generated aliases, first-party
  enhancement, and controlled fixture exist.
- [x] Static contracts and targeted application/build checks pass.
- [x] Required responsive, zoom, enlarged-text, GET/filter/page, Back, no-JS, compact/wide,
  Escape-focus, reduced-motion, print, and forced-colors browser checks pass locally.
- [x] Sanitized 320 px and 1440 px screenshots were visually reviewed.
- [x] Full local `pnpm verify`, history secret scan, and dependency audit pass.
- [x] Pull request `#13` implementation head passes hosted `T1`; this documentation closeout head
  must repeat the gate before merge.
- [ ] Named production roles accept searchable records/vocabulary, real filters, query handling,
  physical-device and assistive-technology behavior, language, security/privacy, and release evidence.

The final checkbox is an external production gate. `SEARCH-01` owns search vocabulary, ranking,
correction, and urgent behavior; `SEARCH-02` owns query handling; later directory/search tickets own
real data and route publication. `B01-008` remains dependency-blocked by `B02-001`; `B01-009` is the
next dependency-satisfied Epic 01 delivery primitive after pull request `#13` merges.

## References

- [Epic scope](epic-01-design-system-global.md)
- [Search/filter component contract](../design-system/components.md#6-search-and-filters)
- [Search/filter architecture](../architecture/search-filter-primitives.md)
- [Implementation acceptance matrix](../validation/implementation-acceptance-matrix.md)
