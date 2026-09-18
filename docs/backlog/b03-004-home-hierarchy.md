# B03-004 — Server-Rendered Home Hierarchy

**Lane / priority / phase:** DELIVERY / P1 / Phase 1 preparation
**Status:** In review for controlled development; full local verification and clean reconstruction pass

The client directed “start” following the proposed B03-004 execution on 18 September 2026,
Africa/Addis_Ababa. Responsible person: `befikadusata` directing Codex in temporary Frontend,
Product and QA roles. The same identity is controlled-development review authority; this start
is not final acceptance. Target: isolated local T0 and private hosted T1. B01-006 and B01-012
are Done. GOV-02 supplies the planned Home scope; the project brand baseline remains centrally
replaceable and authentic BRAND-01 assets remain gated. B02-014 PR #59 merged as
`baaa1be922442a657b027f6fa4ea909d61f45ec5`; exact-main
[run 35392349389](https://github.com/dynamicet/hallelujah-website/actions/runs/35392349389) passed.
Tracking: [issue #60](https://github.com/dynamicet/hallelujah-website/issues/60).
Review: [draft PR #61](https://github.com/dynamicet/hallelujah-website/pull/61), implementation
`171c904dfb6b40f6a7edf7e413f7f79730ba4f07`. Hosted CI must repeat for the final documentation
review head; its matching SHA/run remains tracked in issue #60 and PR #61.
The working B00-016 matrix supplies controlled acceptance while formal DEL-01 production
signatures remain deferred.

## Outcome and allowed scope

Implement a reusable server-rendered Home template through the existing template/component
public APIs and canonical tokens. Compose H1 task introduction, distinct Emergency access,
H2 essential task group, H3 search entry and optional H1/H8 opt-in media. B03-005 owns canonical
contact integration and B03-006 owns governed featured/visitor/institutional modules; this pull
does not implement or fabricate those records.

The sequencing approach follows the existing isolated rendered-page review pattern:
the template is exported but is not mounted as a hospital route. A separate HTTP loopback-only
preview renders the actual React template and CSS Modules. Its visibly controlled draft labels
lead to local withheld-state explanations for every task. The deployed bootstrap remains the
component foundation surface. This explicit approach allows layout and navigation verification
while authentic labels, contacts, routes, media and language remain gated.

Allowed files: Home template and colocated stylesheet/API export; Home test/review scripts and
synthetic data under `apps/web/scripts/`; package command entries; execution/architecture docs
and sanitized evidence. No new dependency, provider, CMS/database write, content migration,
search-query handling, appointment collection, public route, remote provisioning or release.

## Acceptance

| Contract | Observable result |
| --- | --- |
| H1/H2 hierarchy | One h1, meaningful landmarks, introduction and essential tasks precede supplementary story media |
| Essential tasks | Emergency, Doctor, Service, Appointment, Call and Directions are named native anchors with deterministic local review destinations |
| Honest unavailable states | No approved contacts, directions, doctors, clinical claims or appointment result is implied; no tel/mailto/form/provider exists |
| Search | Header and H3 entry lead to explicit unavailable state; no query is accepted while SEARCH decisions remain open |
| Responsive/progressive | 320/360/tablet/desktop, 200% text and 400% equivalent reflow; keyboard, no-JS, reduced-motion, Save-Data, blocked images/fonts, forced-colors and print |
| Language | English draft meaning remains visible; Amharic is explicitly unavailable; expanded mixed-script labels are unreviewed shaping fixtures |
| Motion/media | Protected actions and unavailable meanings stay Level 0; one isolated decorative Level 3 accent; optional media has a complete written still, reserved geometry, zero pre-intent requests, captions/transcript and native activation controls |
| Failure/cleanup | Missing media keeps still/tasks usable; Play/Pause/Stop/end and route-exit cleanup work without moving focus or task targets |
| Omissions/isolation | No H4/H5/H6/H7 module or institutional claim is fabricated; no empty H8 media module when media is absent; preview/fixtures remain outside deployable imports/traces |

## Verification

Use pinned Node.js 24.21.0 and pnpm 10.27.0. Existing format processors use the pinned
Python environment described in B02-014 evidence.

```sh
pnpm home:check
pnpm home:smoke
pnpm lint
pnpm typecheck
pnpm verify
pnpm rebuild:verify
pnpm audit:dependencies
pnpm secrets:check --history
git diff --check
```

Review locally with `pnpm home:preview` at `http://127.0.0.1:3214/` after start.
The local preview paths are `/`, `/hero`, `/story`, `/media-failure`, and `/long-labels`;
they are not Next application routes. Evidence: [execution record](evidence/B03-004-home-hierarchy-2026-09-18.md).
Hosted current-head T1 and controlled client acceptance remain required before Done; checked
merge and passing exact-main CI remain required before dependent execution.

## Local review result — 19 September 2026

B03-004 moves In progress → **In review** under the same responsible/review identity.
Fourteen SSR/omission/safety/escaping/token cases, 165 responsive/progressive/native-keyboard/
media cases and six rejected request controls pass. The 52 px mobile activation shift is fixed
and poster/playing frame/task geometry matches. Full repository verification, independent
frozen reconstruction, fresh dependency audit, history secret scan and documentation/diff checks
pass. The [execution evidence](evidence/B03-004-home-hierarchy-2026-09-18.md) retains failed runs,
passing retests, methods, byte reports and six visually reviewed sanitized captures.
Hosted exact-head T1 and controlled client acceptance remain required; no Done, merge or
publication is claimed.

## Source authority and benchmark application

- [Epic scope](epic-03-critical-journeys.md#home--h0h9): H-001, H-002, G-001–G-003 and G-012.
- [Home page specification](../ux/page-specifications.md#1-home) and [H0–H9 wireframe](../wireframes/home.md).
- [Motion/media amendment](../visual-design/motion/high-end-motion-and-interactive-media-amendment.md).
- [Production component architecture](../architecture/production-component-architecture.md).
- [Home hierarchy architecture](../architecture/home-hierarchy.md).
- BM-01/02/03/06/09/10/12 apply through the Home/shared-shell dispositions in the page
  specification: patient tasks before institutional storytelling, distinct urgent access,
  recognizable doctor/service handoffs, first-party text access and governed omissions.
  Screenshots and prototype code are references only; no benchmark content/assets enter the build.

Hospital approvals, authentic media rights/consent/crops, professional bilingual approval,
GOV-01/SEC-01, real contacts/content/migration, providers, personal-data collection, production,
publication, legacy migration and DNS retain their existing gates.
