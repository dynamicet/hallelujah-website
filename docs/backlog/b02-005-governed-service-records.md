# B02-005 — Governed Service Records

**Status:** Done for controlled development; client acceptance recorded on 16 September 2026, Africa/Addis_Ababa. Final closeout CI and merge results are tracked in [PR #39](https://github.com/dynamicet/hallelujah-website/pull/39).

The client directed “start” after the proposed synthetic-only execution. Dependencies B02-001 and
B02-002 are Done. B02-004 PR #37 merged as `1a6a2c8c3314794e74a142d59e68629c53ede448`;
[exact-main run 35123369970](https://github.com/dynamicet/hallelujah-website/actions/runs/35123369970) passed.
This records a controlled sequencing exception to unresolved CARE-04 and CARE-05: synthetic
schema, local persistence, clinical workflow checks and inert internal projections may proceed.
Authentic taxonomy, capabilities, availability, clinical approval and publication remain gated.

| Field | Controlled contract |
| --- | --- |
| Lane / priority / phase | DELIVERY / P0 / Phase 1, M1 |
| Responsible / acceptance authority | `befikadusata` directing Codex in temporary Backend/CMS, Clinical-contract and QA roles / same workspace identity for controlled-development review |
| Environment / routes | Local T0; private hosted T1 when submitted; authenticated Payload Local API; no new route |
| Editable scope | Existing content model/workflow, synthetic card fixture, CMS checks, package scripts and related backlog/architecture/readme documents |
| Requirements | V-001–V-004, G-013–G-015 |
| Fixtures / languages | Fictional service identities and care text; English and explicitly unreviewed Amharic shaping |
| Sources | [Epic](epic-02-cms-content.md), [requirements](../requirements/requirements-matrix.md), [service specification](../ux/page-specifications.md#6-service-detail), [decisions](../validation/stakeholder-low-fidelity-validation.md), [matrix](../validation/implementation-acceptance-matrix.md), [record contract](b02-001-controlled-governed-record-contract.md), [workflow](b02-002-controlled-cms-workflow.md) |
| Evidence | Sanitized [execution evidence](evidence/B02-005-governed-service-records-2026-09-16.md) |

## Acceptance

1. Services require immutable opaque identity, explicit include/omit/defer disposition and reason,
   one group with stable identity/localized labels, canonical bilingual names and unique synonyms.
   Missing Amharic is omitted. Unsupported fields and conflicting/copy-derived taxonomy reject.
2. Scope is mandatory; every optional section has claims or an explicit omission reason. Care,
   need, tests/treatments, preparation/referral, urgent exceptions, hours and next-step wording
   uses claim records. Withheld claims never enter internal detail/search/selector projections.
3. Reviewable claims require source, scope, eligibility, limitations, availability, typed location
   IDs, owner, review reference and expiry. Only an independent persisted clinical workflow
   reviewer stamps approval identity/time. Author-supplied approval, mismatched/revoked role,
   stale content and expired claim evidence cannot approve/schedule/simulate publication.
   Edits/requested changes clear claim and record approval.
4. Record-set checks detect duplicate identities/canonical paths, overlapping localized
   names/synonyms, conflicting group names and copied cross-service claim text. Location references
   resolve to approved/current governed locations. No relationships are inferred from legacy links.
5. One synthetic-only projection supplies canonical detail/directory/sitemap candidates and grouped
   selector/search vocabulary. Default output is empty; authentic service public eligibility remains
   denied. Draft/future/stale/retired/duplicate/unavailable-language inputs leave no candidate residue.
   Withdrawal preserves identity/audit and resolves only to an effective approved same-kind successor.
6. Fresh disposable PostgreSQL proves persistence, identity/duplicate/clinical negatives,
   unchanged-content approval and retirement. Inert escaped English/Amharic text rendering omits
   missing sections and has no action, fetch or media. Full existing bilingual/resilience verification,
   history secret scan, dependency audit and exact-head hosted checks pass before merge.

## Verification and boundaries

Run `pnpm services:check`, `pnpm governed-records:db-smoke`, `pnpm local-db-isolation:check`,
`pnpm verify`, `pnpm secrets:check --history`, `pnpm audit:dependencies` and `git diff --check`
with pinned Node.js 24.21.0/pnpm 10.27.0 and fresh local PostgreSQL 18.6 using the existing isolated
Unix-socket harness. Evidence records the actual build/environment and defects/retests.

Preserve unrelated changes. Source resources and the legacy claim ledger remain evidence only.
No hospital facts, translation approval, new packages, external providers, public/CMS/search routes,
appointment collection, assets, migration or production provisioning are authorized. B02-006 owns
bidirectional relationships; B02-010 owns public lifecycle/HTTP integration; B02-011 owns asset intake.
Screenshots/prototypes remain references. Local checks do not grant hospital or production acceptance.

[Issue #38](https://github.com/dynamicet/hallelujah-website/issues/38) tracks the controlled execution and hosted review.

## Controlled-development acceptance

On 16 September 2026, Africa/Addis_Ababa, the client directed “B02-005 PR is In Review, close out”.
Workspace identity `befikadusata` accepts the synthetic local scope under the same temporary
Backend/CMS, Clinical-contract and QA responsibility and controlled-development review authority.
Local T0 and hosted implementation [run 35128628242](https://github.com/dynamicet/hallelujah-website/actions/runs/35128628242)
passed full verification and clean reconstruction for exact head
`f74e4821bed6ee0f19fa0778e9410faabf220e96`. No implementation defect remains open.
This direction promotes In review → Done for controlled development. The acceptance-documentation
head must repeat hosted CI before merge; issue #38 and PR #39 retain the matching SHA/run,
merge and exact-main result. CARE-04/CARE-05, authentic taxonomy/services and claims,
hospital clinical/operations approval, public routes, collection, providers, production and
publication remain gated.
