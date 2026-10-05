# B04-011 — Controlled Service Directory

**Lane / priority / phase:** DELIVERY / P1 / Phase 1 preparation

**Status:** In review

**Responsible/review identity:** `befikadusata` directing Codex in temporary Frontend,
Backend-contract and QA roles

**Tracking:** [issue #85](https://github.com/dynamicet/hallelujah-website/issues/85)

**Production and publication authority:** Not granted

On 1 October 2026, Africa/Addis_Ababa, the client directed B04-011 to start. The ticket moves
Proposed → Ready → **In progress** on branch `b04-011-controlled-service-directory`. B04-010 is
Done for controlled validation and its exact-main run passed.

## Controlled sequencing exception

The canonical dependencies B04-004, B04-005 and SEARCH-01 remain unresolved. CARE-04, CARE-05,
authentic taxonomy/launch-subset approval, governed urgent wording, LANG-01 and formal DEL-01 also
remain gated. This exception permits only a loopback, noindex S1–S7 review composition that:

- reads visibly synthetic, current governed service fixtures through the existing controlled
  service projection;
- searches only fictional names and exact synthetic recognition terms with bounded GET state;
- uses one synthetic taxonomy with three fictional group filters, deterministic ordering and finite
  pagination;
- demonstrates an exact fictional urgent-term boundary without diagnosis, treatment advice,
  urgency estimation or a real emergency route;
- exposes no public `/services/` route and imports no fixture or preview server into deployable
  application code; and
- keeps service detail, staffed contact, doctor recommendation and appointment actions unavailable.

The exception does not satisfy B04-004, B04-005, CARE-04, CARE-05, SEARCH-01, LANG-01 or DEL-01.
Authentic records, claims, vocabulary and approvals must replace the fixtures before a public route
may be mounted.

## Controlled outcome

Implement a reusable server-rendered service-directory template and pure directory-query contract
for bounded search, group filtering, count and pagination. Provide a loopback-only preview covering
initial, searched, grouped, paged, loading, no-match, failure/offline, empty-approved-set,
withheld-claim omission and no-JavaScript behavior without representing any hospital service,
capability or availability as real.

## Allowed repository scope

- service-directory query/projection code under `apps/web/src/content/`;
- reusable directory template, stylesheet and export under `apps/web/src/design-system/`;
- synthetic fixture, renderer, loopback server and focused checks under `apps/web/scripts/`;
- package commands, controlled architecture, backlog and sanitized evidence documentation.

No new dependency, public route, database migration, CMS schema change, external provider,
authentic content, collection, infrastructure or unrelated refactor is authorized.

## Required state coverage

| State | Controlled contract |
| --- | --- |
| Initial | Deterministic synthetic results grouped by one fictional taxonomy, empty query and count. |
| Searched/grouped | Submitted values remain in bounded GET state and results reflect both controls. |
| Paged | Real links preserve bounded query/group state and expose deterministic result slices. |
| Loading | Review-only pending state shows no stale result as current and retains search context. |
| No match | Controls remain available with spelling/reset recovery and no inferred care. |
| Urgent-term boundary | One exact fictional trigger places static priority guidance before search without triage. |
| Failure/offline | Results are replaced by a truthful unavailable state; stale services are not shown. |
| Empty approved set | Directory fails closed and does not present an empty public-directory claim. |
| Withheld/retired | Withheld claims and non-current records never enter cards, results or counts. |
| No JavaScript | Native GET controls, count, groups, cards, reset and pagination remain usable. |

## Acceptance criteria

1. S1–S7 appear in logical source order inside the existing global shell with one H1 and a visible
   controlled-development boundary.
2. Query keys, values and lengths are allowlisted; unknown keys, malformed pages and unsupported
   groups fail safely without reflecting unsafe input.
3. Search covers fictional service names and exact synthetic synonyms only. Filtering and
   pagination are deterministic, shareable and usable without JavaScript.
4. One taxonomy drives filter labels and grouped results. Counts use one polite atomic status and
   committed GET actions do not move focus unexpectedly.
5. Cards expose only governed projected name, group and approved synthetic scope. Withheld claims,
   capability, availability, location and appointment data remain absent.
6. The exact fictional urgent trigger exposes static priority guidance before controls; no input
   diagnoses, recommends treatment or estimates urgency.
7. At 320/360/768/1440 px, 200% text, forced colors, print and reduced motion, controls and cards
   wrap without clipping or horizontal overflow; interactive targets are at least 44 CSS px.
8. The preview accepts GET/HEAD only on loopback and sends no-store/noindex, restrictive CSP and
   no-referrer headers; it makes zero external requests.
9. The optimized deployable build contains no `/services/` route and imports no directory fixture,
   loopback server or preview adapter.

## Verification plan

Use pinned Node.js 24.21.0 and pnpm 10.27.0:

```sh
pnpm service-directory:check
pnpm service-directory:smoke
pnpm services:check
pnpm lint
pnpm typecheck
pnpm verify
pnpm rebuild:verify
pnpm audit:dependencies
pnpm secrets:check --history
git diff --check
```

Review locally with `pnpm service-directory:preview` on its loopback URL. Preview paths are review
tool paths, never hospital application routes. Sanitized evidence may contain synthetic fixtures only.

## Source contract

1. [Epic scope](epic-04-care-discovery.md#services-directory-services-s0s7)
2. [Services-directory page specification](../ux/page-specifications.md#5-services-directory)
3. [Services-directory wireframe](../wireframes/services-directory.md)
4. [Care-discovery visual specification](../visual-design/pages/care-discovery/care-discovery-specifications.md)
5. [Governed service records](../architecture/governed-service-records.md)
6. [Search/filter primitives](../architecture/search-filter-primitives.md)
7. [Implementation acceptance matrix](../validation/implementation-acceptance-matrix.md)

## Stop conditions

Stop and report the exact gate if work would require an authentic service, approved taxonomy or
synonym, clinical/operational claim, real urgent wording, staffed contact, service detail or
appointment action, Amharic translation, public `/services/` route, provider, production or
publication claim.

## Local review result — 1 October 2026

B04-011 moves In progress → **In review** after its 22-case focused suite, 173-case rendered
browser matrix, predecessor contracts, complete repository verification, frozen clean
reconstruction, live dependency audit, reachable-history secret scan, diff-integrity check and
sanitized visual review passed. The optimized application build still exposes no `/services/`
route and imports no preview fixture or adapter.

The [evidence record](evidence/B04-011-controlled-service-directory-2026-10-01.md) retains the
local T0 results and artifact hashes. Hosted implementation
[run 36859060799](https://github.com/dynamicet/hallelujah-website/actions/runs/36859060799)
passed every gate for exact implementation head
`1351461c43d457e165a83f5935f298179d9865f3` under
[PR #86](https://github.com/dynamicet/hallelujah-website/pull/86). Explicit client controlled
acceptance remains required. This review state does not approve authentic taxonomy, services,
claims, urgent wording, staffed contacts, appointment behavior, translation, production or
publication, and it does not promote B04-012.
