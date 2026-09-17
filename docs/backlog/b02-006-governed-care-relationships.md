# B02-006 — Governed Care Relationships

**Status:** Done for controlled development; client acceptance recorded on 16 September 2026, Africa/Addis_Ababa. Final closeout CI and merge results are tracked in PR #41.
**Date/timezone:** 16 September 2026, Africa/Addis_Ababa.

The client directed “proceed with steps” after the proposed B02-006 execution.
B02-004 and B02-005 are Done; PR #39 merged as `9ca9853aa17f69b0aa7ab30086df85d337c5a1ad`
and [exact-main run 35130481886](https://github.com/dynamicet/hallelujah-website/actions/runs/35130481886) passed.
This records a controlled sequencing exception to unresolved CARE-06 for synthetic local records
and inert internal consumers only. Authentic affiliations and hospital signoff remain required.

| Field | Controlled contract |
| --- | --- |
| Lane / priority / phase | DELIVERY / P1 / Phase 1, M1 |
| Responsible / review authority | `befikadusata` directing Codex in temporary Backend/CMS, Content/Clinical-contract and QA roles / same identity for controlled-development review |
| Environment | Local T0; private hosted T1 when submitted; authenticated Payload Local API; no new route |
| Scope | Canonical doctor/service/location association collection, independent reviews, shared bidirectional projection, inert stable-ID handoff, synthetic tests and scoped documentation |
| Requirements | V-005, D-003, D-004, A-003, G-013–G-015 |
| Sources | [Epic 02](epic-02-cms-content.md), [record contract](b02-001-controlled-governed-record-contract.md), [CMS workflow](b02-002-controlled-cms-workflow.md), [clinicians](b02-004-governed-clinician-records.md), [services](b02-005-governed-service-records.md) |
| Evidence | [Execution evidence](evidence/B02-006-governed-care-relationships-2026-09-16.md) |

## Acceptance

1. Each explicit association has immutable opaque identity and typed doctor, service and location
   public IDs, synthetic provenance and review/expiry instants. No association is inferred from
   generic links, labels, proximity or source resources. Both care endpoints explicitly list the location.
2. Authenticated authoring validates approved/current endpoints; independent medical, clinical and
   operations reviewers each record evidence. An independent reviewer approves unchanged content.
   Endpoint changes require fresh review. Author-supplied stamps, wrong/revoked roles, inactive
   identities, duplicates, stale revisions and unsupported fields reject.
3. A single persisted association and shared PostgreSQL transaction lock make edits/approval/
   withdrawal atomic for both directions. No copied reciprocal fields are maintained. Edits clear
   approvals; withdrawal preserves identity/audit. Concurrent writers cannot both commit one revision.
4. One controlled graph supplies doctor-to-service and service-to-doctor views scoped by location.
   Only published/current endpoints and approved/current links appear. Invalid, withdrawn, stale,
   expired, future or untranslated endpoints leave no affiliation or handoff residue. Default output is empty.
5. Handoff candidates carry only doctor/service/location stable public IDs. They do not enable
   appointment submission, collection, route, provider, eligibility, scheduling or booking.
6. Pure negative checks, fresh PostgreSQL persistence/concurrency/rollback/role revocation tests,
   local cross-role denial, full repository verification, history secret scan and dependency audit
   pass; exact-head hosted CI is required before merge.

## Verification and boundaries

Run `pnpm care-relationships:check`, `pnpm governed-records:db-smoke`,
`pnpm local-db-isolation:check`, `pnpm verify`, `pnpm secrets:check --history`,
`pnpm audit:dependencies` and `git diff --check` with pinned tooling and disposable local PostgreSQL.

No authentic relationship, hospital content, approved translation, public/CMS route, personal-data
collection, external provider, asset intake, legacy migration, provisioning or publication is authorized.
CARE-06 and all production gates remain open. Controlled-development acceptance does not authorize production.

[Issue #40](https://github.com/dynamicet/hallelujah-website/issues/40) tracks the controlled execution.

[PR #41](https://github.com/dynamicet/hallelujah-website/pull/41) records review. [hosted implementation run 35133605026](https://github.com/dynamicet/hallelujah-website/actions/runs/35133605026) passed all steps, including clean reconstruction, for
`78aabb244a67d01b3b3330c40e423334cff9d27e`. The final documentation head must repeat CI
before merge; its matching SHA/run is tracked in issue #40 and PR #41.

On 16 September 2026, Africa/Addis_Ababa, the client directed “close it”. Workspace identity
`befikadusata` accepts the synthetic local scope under the same temporary Backend/CMS,
Content/Clinical-contract and QA responsibility and controlled-development review authority.
B02-006 moves In review → Done. Documentation [run 35134533900](https://github.com/dynamicet/hallelujah-website/actions/runs/35134533900)
passed all steps for `b6e2d6bf5aafd028d0c9d03d04e258ab6906a744`. The final acceptance
commit must repeat hosted CI before merge; issue #40 and PR #41 retain its matching SHA/run,
merge and exact-main result. Authentic affiliations, hospital approvals, appointment collection
and publication remain gated.

## Verified merge closeout

Verified on 17 September 2026, Africa/Addis_Ababa: final acceptance head
`6df67e1b8a7fd1f16379082113256b790fa86183` passed
[run 35136076144](https://github.com/dynamicet/hallelujah-website/actions/runs/35136076144).
PR #41 merged as `da4434ff8703f5c2f07fc9b6bf8b81270e4aec49`; its exact-main
[run 35136691110](https://github.com/dynamicet/hallelujah-website/actions/runs/35136691110)
passed. Issue #40 is closed. This completes the dependent-execution merge control;
controlled-development acceptance and all hospital/production gates retain their existing scope.
