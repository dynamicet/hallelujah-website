# B02-007 — Governed Patient & Visitor Topics

**Status:** Done for controlled development following client acceptance on 17 September 2026, Africa/Addis_Ababa. Final acceptance-head CI is required before merge.

The client directed “proceed with the steps” after the proposed B02-007 execution.
B02-006 PR #41 merged as `da4434ff8703f5c2f07fc9b6bf8b81270e4aec49`; final-head
[run 35136076144](https://github.com/dynamicet/hallelujah-website/actions/runs/35136076144)
and [exact-main run 35136691110](https://github.com/dynamicet/hallelujah-website/actions/runs/35136691110)
passed. B02-001 and B02-002 are Done. This records a controlled sequencing exception to
unresolved ACCESS-01 for synthetic local schemas, persisted decisions and internal specimens.
Authentic guidance requires hospital operations/content/legal approval and ACCESS-01.

| Field | Controlled contract |
| --- | --- |
| Lane / priority / phase | DELIVERY / P1 / Phase 1, M1 |
| Responsible / review authority | `befikadusata` directing Codex in temporary Backend/CMS, Operations/Content-contract, Privacy/Legal-contract and QA roles / same identity for controlled-development review |
| Environment | Synthetic local T0; private hosted T1; authenticated Payload Local API; no new route |
| Scope | `apps/web/src/content/`, exhaustive governed-kind exclusions, CMS scripts/fixtures, package scripts, backlog/architecture documentation |
| Requirements | P-001, P-002, G-013–G-015 |
| Sources | [Epic 02](epic-02-cms-content.md), [Patient Information specification](../ux/page-specifications.md#8-patient--visitor-information), [wireframe](../wireframes/patient-information.md), [record contract](b02-001-controlled-governed-record-contract.md), [CMS workflow](b02-002-controlled-cms-workflow.md), [ACCESS-01 register](../validation/stakeholder-low-fidelity-validation.md) |
| Evidence | [Execution evidence](evidence/B02-007-governed-visitor-topics-2026-09-17.md) |

Architecture: [governed visitor topics](../architecture/governed-visitor-topics.md).

## Acceptance

1. A typed visitor-topic record carries immutable opaque identity, explicit topic purpose,
   before/during/after phase, bounded task order, localized title/body, temporary flag and
   include/unavailable/defer/omit decision with reason. The existing record carries source,
   owner, review/expiry and append-only audit. Missing topics have explicit unavailable decisions
   in the synthetic inventory. Non-included decisions contain no guidance body.
2. Owning authors cannot self-review or supply governance stamps. Every included topic requires
   independent operations, privacy and legal reviews plus general approval. These are synthetic
   workflow roles, not hospital signatures. Editing clears all approvals; revoked identities,
   stale revisions, duplicates and immutable-identity edits reject transactionally.
3. One internal hub groups useful approved topics before/during/after, then by task order and
   stable ID. No unavailable/deferred/omitted/draft/untranslated/retired topic creates a content
   candidate, link or empty category. Expired or review-due temporary guidance disappears on read
   without a scheduler, retaining a safe unavailable outcome. Staffed contact fallback remains
   explicitly withheld until canonical safety/contact facts are approved.
4. Default/public consumption denies all topics, including records with synthetic flag removed.
   Authenticated internal reads revalidate persisted authorizing identities under the CMS write lock.
   English and explicitly unreviewed Amharic shaping specimens use escaped semantic text only.
5. Pure negative/lifecycle/render checks, fresh disposable PostgreSQL persistence, role revocation,
   concurrency/rollback, cross-role denial, full repository verification, history-secret scan,
   dependency audit and exact-head hosted CI pass before merge.

## Verification and boundaries

Run `pnpm visitor-topics:check`, `pnpm governed-records:db-smoke`,
`pnpm local-db-isolation:check`, `pnpm verify`, `pnpm secrets:check --history`,
`pnpm audit:dependencies` and `git diff --check` with pinned tooling.
PostgreSQL integration uses a fresh Unix-socket-only cluster and existing synthetic SQL setup.

Preserve unrelated changes. Screenshots/prototypes are references, not production architecture.
No hospital advice, legal/privacy policy, translation approval, public/CMS route, real contact,
clinical instruction, media, package, personal-data flow, provider, migration, provisioning,
production scheduler or publication is authorized. ACCESS-01 and production gates remain open.
Completion means scoped technical checks and review pass; acceptance remains a separate step.

[Issue #42](https://github.com/dynamicet/hallelujah-website/issues/42) tracks the controlled B02-007 execution.

## Local review submission

Local scoped checks, fresh disposable PostgreSQL integration/cross-role denial, full repository
verification and 92-case bilingual browser matrix, history-secret scan and dependency audit pass.
The [execution evidence](evidence/B02-007-governed-visitor-topics-2026-09-17.md) records method,
expected/actual outcomes and corrected test-fixture defects. B02-007 moves In progress → In review
under the same client workspace responsibility/review identity. Final documentation-head hosted CI and client
controlled-development acceptance remain required; ACCESS-01 and production gates remain open.

[PR #43](https://github.com/dynamicet/hallelujah-website/pull/43) tracks review.
[Hosted implementation run 35244463130](https://github.com/dynamicet/hallelujah-website/actions/runs/35244463130)
passed all steps, including clean reconstruction, for exact implementation head
`3222622361edf9495075905f923d1ab3c8720983`. The final documentation head must repeat
hosted CI before merge; its matching SHA/run is tracked in issue #42 and PR #43.
Client controlled-development acceptance remains pending. ACCESS-01, authentic guidance,
contacts, approved translations, public routes, collection and publication remain gated.


## Controlled-development acceptance

On 17 September 2026, Africa/Addis_Ababa, the client directed “close it out”.
B02-007 moves In review → **Done** for controlled development. Responsible and acceptance
authority is workspace identity `befikadusata` directing Codex in the same temporary
Backend/CMS, Operations/Content-contract, Privacy/Legal-contract and QA roles.
The target remains synthetic local T0/private hosted T1. B02-001/B02-002 are Done;
B02-006 final-head and exact-main CI passed as recorded above. The ACCESS-01 controlled
sequencing exception remains limited to synthetic contracts, decisions and internal consumers.

Implementation [run 35244463130](https://github.com/dynamicet/hallelujah-website/actions/runs/35244463130)
passed full verification and clean reconstruction for
`3222622361edf9495075905f923d1ab3c8720983`. Documentation
[run 35245153540](https://github.com/dynamicet/hallelujah-website/actions/runs/35245153540)
also passed every step for exact reviewed head `0ad3fcc233e121bddcdcb784a27123c30aa6d1c4`.
All scoped acceptance criteria pass; no implementation defect remains open.
The final acceptance-documentation head must repeat hosted CI before merge.
[Issue #42](https://github.com/dynamicet/hallelujah-website/issues/42) and
[PR #43](https://github.com/dynamicet/hallelujah-website/pull/43) retain its matching
SHA/run, merge and exact-main result. ACCESS-01, authentic guidance, hospital operations/privacy/legal
approval, contacts, approved translations, public routes, collection, providers, production
and publication remain gated.
