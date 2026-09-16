# `B02-004` — Governed Clinician Records

**Status:** Done for controlled development on 16 September 2026, Africa/Addis_Ababa. The client directed “close it” after implementation and exact-head hosted verification passed. [Issue #36](https://github.com/dynamicet/hallelujah-website/issues/36) and [PR #37](https://github.com/dynamicet/hallelujah-website/pull/37) track acceptance, final closeout CI and merge.

## Execution authority

The client directed “start B02-004” following the proposed synthetic local execution.
`B02-001`–`B02-003` are Done for controlled development. PR #35 merged as
`46afd419cb00125f6953e3aa5d42c467c2ff0aa3`; exact-main
[run 35096707152](https://github.com/dynamicet/hallelujah-website/actions/runs/35096707152)
passed. This is an explicit controlled sequencing exception to unresolved `CARE-01`–`CARE-03`:
schemas, synthetic persistence and inert internal consumption may proceed; authentic roster,
profile fields, schedules and publication require the hospital decisions.

| Field | Controlled value |
| --- | --- |
| Epic / lane / priority / phase | Epic 02 / DELIVERY / P0 / Phase 1, M1 |
| Responsible / review authority | `befikadusata` directing Codex in temporary Backend/CMS, Medical-contract and QA roles / same workspace identity as controlled-development review authority |
| Environment / routes | Local T0; private-repository hosted T1 when submitted; authenticated Payload Local API; no new route |
| Scope | `apps/web/src/content/`, existing governed-card synthetic fixture, CMS check scripts, package scripts, backlog and architecture documentation |
| Requirements | `D-001`–`D-006`, `G-013`–`G-015` |
| Fixtures | Explicitly fictional clinician identities and claims; English and unreviewed Amharic shaping only; no extracted hospital person, photograph or schedule |
| Evidence | Sanitized [execution evidence](evidence/B02-004-governed-clinician-records-2026-09-16.md); no signatures, credentials, tokens or restricted approvals |
| Sources | [Epic scope](epic-02-cms-content.md), [requirements](../requirements/requirements-matrix.md), [profile specification](../ux/page-specifications.md#4-doctor-profile), [formal decisions](../validation/stakeholder-low-fidelity-validation.md), [working matrix](../validation/implementation-acceptance-matrix.md), [record contract](b02-001-controlled-governed-record-contract.md), [workflow](b02-002-controlled-cms-workflow.md), [architecture](../architecture/governed-clinician-records.md) |

The extracted [doctor resources](../../../resources/data/doctors.json) and
[verification queue](../../../resources/content-review.md#priority-1--doctors-and-schedules)
are evidence only; this pull does not import or reconcile them. Screenshots and prototype code
remain references, never production architecture. No new visual direction is needed for the
inert semantic specimen.

## Observable acceptance

1. Doctor records require opaque immutable roster identity, explicit roster status, matching
   canonical name/details, specialty, optional title/credentials/interests/languages/guidance,
   explicit location IDs and portrait metadata or null. Unsupported fields, malformed/duplicate
   labels, missing required values and divergent names reject. Missing optional information
   uses empty arrays/null and produces no empty semantic labels; missing Amharic is omitted.
2. Only current clinicians may approve, schedule or enter simulated publication. Independent
   persisted medical review and general approval remain required. Changed content cannot publish
   under an earlier approval; edits clear review/approval. Authentic records and public eligibility
   remain denied regardless of supplied role, approval or synthetic flag.
3. Schedules have an explicit withheld reason and no entries; no caller can enable schedule
   governance. Appointment data is withheld without an actionable route; projections carry only
   the stable doctor public ID. Portrait references require source, rights, consent and valid
   review/expiry metadata; no portrait bytes or derivative is consumed before `B02-011`.
4. Locked record-set checks reject duplicate IDs/slugs/roster identities and ambiguous duplicate
   current English names. Same-name ambiguity requires later explicit roster reconciliation,
   never an inferred identity. Locations resolve to the correct governed kind and must be
   approved/current before clinician approval; internal consumption also checks effective dates.
5. A single internal projection supplies directory/search/sitemap candidates with one derived
   path per stable ID and locale. Draft, future, stale, expired, withdrawn, invalid, authentic,
   duplicate and unavailable-language inputs leave no candidate residue. Retirement preserves
   audit/IDs; an explicit approved current same-kind successor resolves internally, otherwise gone.
   This does not mount HTTP 404/410/redirects or public indexes (`B02-010`).
6. Fresh disposable PostgreSQL proves clinician persistence, duplicate/identity/medical-review
   denials, unchanged-content approval/publication and retirement with successor. Local cross-role
   denial, focused schema/render checks, full repository verification, reachable-history secret
   scan and dependency audit pass. Exact-head hosted checks remain required before merge.

## Verification and boundaries

Run `pnpm clinicians:check`, `pnpm governed-records:check`, `pnpm cms-workflow:check`,
`pnpm site-settings:check`, `pnpm governed-records:db-smoke`, `pnpm local-db-isolation:check`,
`pnpm verify`, `pnpm secrets:check --history`, `pnpm audit:dependencies` and `git diff --check`
using pinned Node.js 24.21.0/pnpm 10.27.0. Database tests use a fresh PostgreSQL 18.6 /tmp or /var/tmp Unix-socket
cluster and existing synthetic SQL only. No shared/remote database or destructive migration.

Preserve unrelated changes. Do not invent hospital facts, maintained filters, translations,
capabilities, schedule conventions, packages, providers, routes, personal-data flows, photographs,
asset rights or hospital signoff. Bidirectional doctor/service/location mutation remains `B02-006`;
asset intake/derivatives remain `B02-011`; real search, appointment, CMS admin/API, provisioning,
collection and publication remain gated. Scoped verification is implementation evidence; it does
not grant clinical or production acceptance.

## Controlled-development acceptance

On 16 September 2026, Africa/Addis_Ababa, the client directed “close it”. Workspace identity
`befikadusata` accepts the synthetic local scope under the same temporary Backend/CMS,
Medical-contract and QA responsibility and controlled-development review authority.
Local T0 and hosted implementation [run 35105320640](https://github.com/dynamicet/hallelujah-website/actions/runs/35105320640)
passed, including clean reconstruction, for exact head `c42c44784ec0518be0a9b3688eb2e0fe162305d1`.
No implementation defect remains open. The status moves In review → Done for controlled
development. The acceptance-documentation head must repeat hosted CI before merge;
issue #36 and PR #37 retain the matching SHA/run, merge and exact-main result.
This acceptance does not approve authentic clinician content, hospital medical ownership,
`CARE-01`–`CARE-03`, portraits, schedules, appointments, production or publication.
