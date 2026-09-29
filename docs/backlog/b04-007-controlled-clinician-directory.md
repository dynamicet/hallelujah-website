# B04-007 — Controlled Clinician Directory

**Lane / priority / phase:** DELIVERY / P1 / Phase 1 preparation

**Status:** In progress for controlled development

**Responsible/review identity:** `befikadusata` directing Codex in temporary Frontend,
Backend-contract and QA roles

**Tracking:** [issue #77](https://github.com/dynamicet/hallelujah-website/issues/77)

**Production and publication authority:** Not granted

On 29 September 2026, Africa/Addis_Ababa, the client directed B04-007 to start. The ticket moves
Proposed → Ready → **In progress** on branch
`b04-007-controlled-clinician-directory`. The B03-017 and focused B01-006 corrections have passing
exact-main closeout. B01-007–B01-010 and B02-004 are Done for controlled development.

## Controlled sequencing exception

The canonical B04-007 dependencies B04-001, B04-002 and SEARCH-01 remain unresolved. CARE-01,
CARE-02, authentic roster approval, filter vocabulary, canonical slug approval, LANG-01 and formal
DEL-01 also remain gated. This exception permits only a loopback, noindex D0–D6 review composition
that:

- reads visibly synthetic, current governed clinician fixtures through the existing controlled
  clinician projection;
- searches only synthetic names and specialties with bounded, allowlisted GET state;
- uses one synthetic specialty filter, deterministic ordering and finite pagination;
- exposes no public `/doctors/` route and imports no fixture or preview server into the deployable
  application;
- presents profile destinations, staffed contact, service navigation and appointment actions as
  unavailable or inert review boundaries;
- includes no schedule, live availability, portrait, authentic roster claim, provider request,
  personal data, analytics or external link.

The exception does not satisfy B04-001, B04-002, CARE-01, CARE-02, SEARCH-01, LANG-01 or DEL-01.
Authentic records and approved vocabulary must replace the fixtures before a public route may be
mounted.

## Controlled outcome

Implement a reusable server-rendered clinician-directory template and a pure directory-query
contract for bounded search, filter, count and pagination. Provide a loopback-only preview covering
initial, searched, filtered, paged, no-match, failure/offline, empty-approved-set, retired-record
exclusion and no-JavaScript behavior without representing any clinician as real or available.

## Allowed repository scope

- clinician-directory query and projection code under `apps/web/src/content/`;
- reusable directory template, stylesheet and export under `apps/web/src/design-system/`;
- synthetic fixture, renderer, loopback server and focused checks under `apps/web/scripts/`;
- package commands, controlled architecture, backlog and sanitized evidence documentation.

No new dependency, public route, database migration, CMS schema change, external provider,
authentic content, collection, infrastructure or unrelated refactor is authorized.

## Required state coverage

| State | Controlled contract |
| --- | --- |
| Initial | Deterministic synthetic results, empty query, approved synthetic filter and count. |
| Searched/filtered | Submitted values remain in bounded GET state and results reflect both controls. |
| Paged | Real links preserve bounded query/filter state and expose deterministic result slices. |
| No match | Search controls remain available with clear reset and non-diagnostic recovery copy. |
| Failure/offline | Results are replaced by a truthful unavailable state; stale clinicians are not shown. |
| Empty approved set | Directory fails closed and does not present an empty public-directory claim. |
| Retired/unavailable | Non-current records never enter results or counts. |
| No JavaScript | Native GET controls, count, cards, reset and pagination remain usable. |

## Acceptance criteria

1. D0–D6 appear in logical source order inside the existing global shell with one H1 and a visible
   controlled-development boundary.
2. Query keys, values and lengths are allowlisted; unknown keys, malformed pages and unsupported
   filters canonicalize or fail safely without reflecting unsafe input.
3. Search covers synthetic clinician names and specialties only. Filtering and pagination are
   deterministic, shareable and usable without JavaScript.
4. Counts and result states use semantic headings/status text without per-keystroke announcements or
   unexpected focus movement.
5. Cards expose only governed projected fields and inert controlled profile destinations. Portraits,
   schedules, availability and appointment actions remain absent.
6. At 320/360/768/1440 px, 200% text, forced colors, print and reduced motion, controls and cards
   wrap without clipping, horizontal overflow or color-only meaning; interactive targets are at
   least 44 px.
7. The preview accepts GET/HEAD only on loopback and sends `no-store`, `noindex`, restrictive CSP
   and `Referrer-Policy: no-referrer`; it makes zero external requests.
8. The optimized deployable build contains no `/doctors/` route and imports no directory fixture,
   loopback server or preview adapter.

## Verification plan

Use pinned Node.js 24.21.0 and pnpm 10.27.0:

```sh
pnpm clinician-directory:check
pnpm clinician-directory:smoke
pnpm clinicians:check
pnpm lint
pnpm typecheck
pnpm verify
pnpm rebuild:verify
pnpm audit:dependencies
pnpm secrets:check --history
git diff --check
```

Review locally with `pnpm clinician-directory:preview` on its loopback URL. Preview paths are review
tool paths, never hospital application routes. Sanitized evidence may contain synthetic fixtures
only.

Local implementation and verification evidence is recorded in
[B04-007 controlled clinician-directory evidence](evidence/B04-007-controlled-clinician-directory-2026-09-29.md).
The ticket remains In progress until an explicit review promotion.

## Source contract

1. [Epic scope](epic-04-care-discovery.md#doctor-directory-doctors-d0d6)
2. [Doctor directory page specification](../ux/page-specifications.md#3-doctor-directory)
3. [Doctor directory wireframe](../wireframes/doctor-directory.md)
4. [Care-discovery visual specification](../visual-design/pages/care-discovery/care-discovery-specifications.md)
5. [Governed clinician records](../architecture/governed-clinician-records.md)
6. [Search/filter primitives](../architecture/search-filter-primitives.md)
7. [Implementation acceptance matrix](../validation/implementation-acceptance-matrix.md)

## Stop conditions

Stop and report the exact gate if the work would require an authentic clinician, approved roster or
specialty vocabulary, real portrait, schedule or availability, staffed contact, public profile,
appointment action, Amharic translation, public `/doctors/` route, provider, production or
publication claim.
