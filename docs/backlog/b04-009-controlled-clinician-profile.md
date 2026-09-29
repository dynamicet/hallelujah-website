# B04-009 — Controlled Clinician Profile

**Lane / priority / phase:** DELIVERY / P1 / Phase 1 preparation

**Status:** Done for controlled development; final acceptance-documentation CI and checked merge
tracked below

**Responsible/review identity:** `befikadusata` directing Codex in temporary Frontend,
Backend-contract and QA roles

**Tracking:** [issue #81](https://github.com/dynamicet/hallelujah-website/issues/81)

**Production/publication authority:** Not granted

On 29 September 2026, Africa/Addis_Ababa, the client directed B04-009 to start. The ticket moves
Proposed → Ready → **In progress** on branch `b04-009-controlled-clinician-profile`. B02-004
and B02-006 are Done for controlled development, and B04-007–B04-008 are Done with passing
exact-main closeout. The working B00-016 matrix and this brief govern the controlled pull.

## Controlled sequencing exception

The canonical B04-009 dependencies B04-001–B04-003 and B04-006 remain unresolved. CARE-01–CARE-03,
CARE-06, APPT-01, LANG-01/LANG-02 and DEL-01 also remain unresolved. This exception permits a
synthetic English P0–P7 profile composition through the existing governed clinician and care-
relationship projections, with deterministic lifecycle and omission states.

No authentic roster, biography, clinical claim, relationship, location/arrival fact, portrait,
schedule, availability, staffed contact or appointment action may appear. No public
`/doctors/{doctor-slug}/` route may be mounted. The review surface must remain loopback-only,
no-store and noindex, and it may send no external request.

## Controlled outcome

Implement an auditable server-rendered clinician-profile boundary that demonstrates:

- canonical synthetic identity, professional details, expertise and optional-field omission;
- neutral portrait omission without inferred likeness, gender or layout collapse;
- current approved synthetic relationships only, with absent/retired relationships omitted;
- review metadata and immediate fail-closed behavior at review/expiry boundaries;
- appointment continuity limited to the stable public clinician ID while every action remains
  unavailable;
- honest route failure, unapproved, gone and genuine-successor redirect outcomes;
- usable HTML without JavaScript, images, fonts or third-party services; and
- responsive P0–P7 composition at 320/360 CSS px, text reflow, forced colors and print.

## Acceptance criteria

1. The controlled profile renders one canonical synthetic identity and only validated current
   record fields; hostile text is escaped.
2. Credentials, interests, languages, location and related-service modules disappear cleanly when
   absent, with no empty heading or placeholder claim.
3. No portrait, schedule, availability statement, real contact or active appointment link is
   rendered. The stable clinician public ID may be retained only as inert handoff context.
4. Related services and locations appear only through an approved, current bidirectional synthetic
   relationship; stale, missing or withdrawn endpoints remove the complete relationship.
5. Unapproved/missing records produce an unavailable/404 outcome, retired records without a genuine
   successor produce 410, and an approved successor produces one bounded loopback redirect.
6. Failure and appointment-unavailable states retain truthful recovery paths without dead ends or
   claims of booking.
7. Every HTML response is no-store/noindex, accepts only read-only loopback requests, makes zero
   external requests and leaves the deployable Next.js route tree unchanged.
8. Focused checks, rendered browser checks, the full repository gate, clean reconstruction,
   dependency audit, reachable-history secret scan and diff-integrity check pass before controlled
   acceptance is requested.

## Allowed repository scope

- a controlled clinician-profile projection under `apps/web/src/content/`;
- a server-rendered profile template and token-only CSS under the design system;
- synthetic fixture, renderer, loopback server and focused checks under `apps/web/scripts/`;
- package commands plus this brief, execution board and sanitized evidence.

No dependency, public route, authentic content, CMS mutation, provider, collection path, database,
deployment, production configuration or unrelated refactor is authorized.

## Verification plan

Use pinned Node.js 24.21.0 and pnpm 10.27.0:

```sh
pnpm clinician-profile:check
pnpm clinician-profile:smoke
pnpm clinicians:check
pnpm care-relationships:check
pnpm lint
pnpm typecheck
pnpm verify
pnpm rebuild:verify
pnpm audit:dependencies
pnpm secrets:check --history
git diff --check
```

Rendered checks may bind only a random loopback port and use headless Chromium. Sanitized evidence
may contain synthetic fixtures only.

## Local review result

On 29 September 2026, Africa/Addis_Ababa, B04-009 moves In progress → **In review** after the
29-case focused contract, 128-case browser matrix, predecessor clinician/directory/relationship
suites, full configured repository verification, independent frozen clean reconstruction,
dependency audit, reachable-history secret scan and diff-integrity check passed. The optimized
build retains no `/doctors/` route.

The [sanitized completion evidence](evidence/B04-009-controlled-clinician-profile-2026-09-29.md)
records the exact checks, corrected 320 px/200% portrait reflow and failure-shell target defects,
and inspected mobile/desktop specimens. Private hosted exact-head
[run 36617331632](https://github.com/dynamicet/hallelujah-website/actions/runs/36617331632)
passed every gate for implementation head `0ab75d464f5bffb4f4b1b2fc4acc1a5e37b1cd69` in
[PR #82](https://github.com/dynamicet/hallelujah-website/pull/82). Explicit client controlled
acceptance, final acceptance-documentation CI and checked merge remain required before Done.

## Controlled acceptance — 29 September 2026

The client directed “B04-009 in review, close it out”. B04-009 moves In review → **Done** for
controlled development under `befikadusata` as responsible and controlled acceptance person,
directing Codex in temporary Frontend, Backend-contract and QA roles on 29 September 2026,
Africa/Addis_Ababa. The target remains synthetic local T0/private hosted T1 under the working
B00-016 matrix.

Accepted implementation head `0ab75d464f5bffb4f4b1b2fc4acc1a5e37b1cd69` has matching hosted
[run 36617331632](https://github.com/dynamicet/hallelujah-website/actions/runs/36617331632), which
passes every hosted gate. The
[completion evidence](evidence/B04-009-controlled-clinician-profile-2026-09-29.md#controlled-acceptance)
retains the local and hosted proofs; no scoped controlled-development defect remains open.

Final acceptance-documentation CI must pass for its exact SHA before checked merge of
[PR #82](https://github.com/dynamicet/hallelujah-website/pull/82). Its matching SHA/run, merge SHA
and exact-main result must be retained in [issue #81](https://github.com/dynamicet/hallelujah-website/issues/81)
and PR #82. Dependent execution waits for passing exact-main CI. B04-010 is not promoted by this
acceptance.

This closeout accepts only the synthetic English loopback/noindex composition. B04-001–B04-003,
B04-006, CARE-01–CARE-03, CARE-06, APPT-01, LANG-01/LANG-02 and DEL-01 remain unresolved.
Authentic clinicians and claims, portraits, schedules, availability, staffed contact, active
appointment actions, public routes, providers, production and publication remain gated.

## Source contract

1. [Epic scope](epic-04-care-discovery.md#doctor-profile-doctorsdoctor-slug-p0p7)
2. [Doctor profile page specification](../ux/page-specifications.md#4-doctor-profile)
3. [Doctor profile wireframe](../wireframes/doctor-profile.md)
4. [Care-discovery visual study](../visual-design/pages/care-discovery/doctor-profile.html)
5. [Governed clinician records](../architecture/governed-clinician-records.md)
6. [Governed care relationships](b02-006-governed-care-relationships.md)
7. [Implementation acceptance matrix](../validation/implementation-acceptance-matrix.md)

## Stop conditions

Stop and report the exact gate if implementation would require an authentic clinician, biography,
clinical statement, portrait, schedule, availability, staffed contact, active appointment action,
public route, unreviewed translation, external service, personal data, production acceptance or a
release claim.
