# `B02-003` — Canonical Site Settings and Contact Records

**Status:** In review after passing local T0 on 16 September 2026, Africa/Addis_Ababa; [issue #34](https://github.com/dynamicet/hallelujah-website/issues/34) and [draft PR #35](https://github.com/dynamicet/hallelujah-website/pull/35) track hosted review and client acceptance.

## Execution authority and boundary

The client directed “record closeout and proceed” after the proposed canonical contact-record
execution. Correction PR #33 merged as `38d5e455d0733a62e6fbd188fa76c0127012c57d`;
exact-main [run `35092817178`](https://github.com/dynamicet/hallelujah-website/actions/runs/35092817178)
passed, resolving the previous execution pause. `B02-001` and `B02-002` are Done for controlled
development. This pull permits explicitly synthetic local settings, source/verification metadata,
conflict checks and internal template consumption while `SAFE-01` and `SAFE-03` remain unresolved.
It grants no hospital safety approval or public eligibility.

| Field | Controlled value |
| --- | --- |
| Epic / lane / priority / phase | Epic 02 / DELIVERY / P0 / Phase 1, M1 |
| Responsible / review authority | `befikadusata` directing Codex in temporary Backend/CMS, Operations-contract and QA roles / same client identity as controlled-development review authority |
| Environment / routes | Local T0 and private-repository hosted implementation T1; internal Payload Local API, no new route |
| Requirements | `E-001`, `E-004`, `C-001`, `C-002`, `G-014` |
| Dependencies / gates | `B02-001`–`B02-002` Done; `SAFE-01`/`SAFE-03` for authentic contacts and arrival facts; `GOV-01` and operations signoff before authentic use; existing infrastructure/provider/publication gates retained |
| Scope | `apps/web/src/content/`, existing governed-card kind exclusion, CMS check scripts/disposable SQL smoke, package scripts, backlog and architecture documentation |
| Facts | Identity; emergency, public enquiry, switchboard and ambulance phones; email; address; staffed hours; emergency/public/accessible entrance text; staffed fallback |
| Fixtures | Explicit synthetic labels, reserved fictional `+1 202 555 0100`–`0199` numbers and `.invalid` email; English and unreviewed Amharic shaping labels only |
| Evidence | Sanitized [completion evidence](evidence/B02-003-canonical-site-settings-2026-09-16.md); no real contact dataset, signatures or restricted approvals |
| Benchmark / visual authority | No new visual direction; semantic internal text specimen using server rendering; screenshots/prototype code remain references, never application architecture |

## Sources and decisions

- [Epic 02 scope](epic-02-cms-content.md), [requirements](../requirements/requirements-matrix.md)
- [Formal safety register](../validation/stakeholder-low-fidelity-validation.md), [working acceptance matrix](../validation/implementation-acceptance-matrix.md)
- [CMS workflow](b02-002-controlled-cms-workflow.md), [record contract](b02-001-controlled-governed-record-contract.md)
- [Canonical content and URL contract](../visual-design/handoff/developer-handoff.md#6-data-and-url-contracts)
- [Canonical contact architecture](../architecture/canonical-site-settings.md)
- The inherited external [verification queue](../../../resources/content-review.md#priority-0--safety-and-access)
  is source evidence, never an approved import. No extracted hospital contact value is used.

The canonical record is a new `site-settings` governed kind within the existing collection.
Only one non-retired settings record is allowed, including drafts. Every required fact has an
independent purpose label, source, owner, explicit state and verifier/check/review/expiry metadata.
Equal emergency/ambulance values do not imply equal purpose or approval. Entrance fields hold
text directions, landmarks, access hours and relevant vehicle/accessibility guidance; no map is
required. Missing Amharic labels are omitted rather than silently replaced or translated.
Verification metadata records evidence; only persisted matching CMS roles grant workflow authority.

## Observable acceptance

1. Unknown/missing facts, unlabeled purposes, malformed contacts and invalid/non-UTC dates reject.
   Withheld facts carry null values and reasons; conflicting candidate values carry explicit notes.
2. The contact safety class is mandatory. Independent operations review and a distinct general
   approver are required. Any required conflict, unverified/withheld fact, future check or elapsed
   review/expiry blocks approval and scheduling/publication. Editing follows the existing return-to-draft
   workflow and clears approvals. Stable IDs, append-only audit and current-revision locking persist.
3. A second current settings record rejects transactionally. Updates retain the canonical identity;
   withdrawal preserves evidence. Fresh Payload/PostgreSQL tests verify persistence, conflict and
   duplicate denials, two-person approval, unchanged-content publication and retirement.
4. A shared selector derives visible values and normalized phone/email targets from the same fact.
   Shared internal consumers use the same record without copied values. The controlled specimen
   labels itself synthetic and contains text only, with no actionable contact links or scripts.
5. Public-default consumption yields a safe withheld message without contact values. Synthetic,
   authentic, malformed, stale, expired/withdrawn and unsupported-language inputs cannot enable
   public contacts. `publicEligibility` denies the settings kind while safety gates remain unresolved.
6. English/Amharic shaping, omitted-language, escaping, no-JavaScript semantic rendering and target
   consistency checks pass. Full repository verification, history-secret and dependency-audit gates
   pass. Exact-head hosted CI is required before merge; local database evidence is separate.

## Verification and exclusions

Run `pnpm site-settings:check`, `pnpm cms-workflow:check`, `pnpm governed-records:check`,
`pnpm governed-records:db-smoke`, `pnpm verify`, `pnpm secrets:check --history`,
`pnpm audit:dependencies` and `git diff --check` with the pinned toolchain.
Database smoke must use a fresh disposable PostgreSQL 18 Unix-socket cluster and the existing
synthetic SQL setup; never use shared/staging/production credentials or data. Schema push must
not touch unrelated tables. Hosted CI runs the pure/render checks, not local PostgreSQL integration.

Preserve unrelated user changes. Do not invent hospital facts, real translations, public routes,
packages, providers, coordinates, personal-data flows, safety signoff or destructive migrations.
No public Contact/Home/Emergency implementation, CMS administration, real tap-to-call action,
email delivery, external direction link, geolocation, provider activation, production or publication
is authorized. Completion means scoped checks and review pass; release gates remain separate.
