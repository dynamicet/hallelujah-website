# B02-009 — Controlled Versioned Privacy and Accessibility Statements

**Status:** Done for controlled development by client acceptance on 17 September 2026. Local T0 and corrected hosted T1 pass; final acceptance-documentation CI and merge closeout remain required.

On 17 September 2026, Africa/Addis_Ababa, the client directed “start” for the proposed next
B02-009 execution. B02-008 PR #45 merged as `c451fa5335fd8b4a036c2e2c75c2725912b63848`
after final-head [run 35255139180](https://github.com/dynamicet/hallelujah-website/actions/runs/35255139180)
passed. Exact-main [run 35255831837](https://github.com/dynamicet/hallelujah-website/actions/runs/35255831837)
passed. B02-001/B02-002 are Done. This records a controlled sequencing exception to
APPT-03, SEARCH-02 and formal DEL-01, using the accepted working B00-016 matrix.
It authorizes synthetic local contracts, persistence and internal consumption only.

| Field | Controlled contract |
| --- | --- |
| Lane / priority / phase | DELIVERY / P0 / Phase 1, M1 |
| Responsible / review authority | `befikadusata` directing Codex in temporary Backend/CMS, Privacy/Legal-contract and Accessibility/QA roles / same identity for controlled-development review |
| Environment | Synthetic local T0; private hosted T1; authenticated Payload Local API |
| Scope | Versioned statement contracts, matching review roles, governed dependencies, disabled collection-contract evaluation, internal semantic specimens and verification |
| Sources | [Epic 02](epic-02-cms-content.md), [utility specifications](../ux/utility-page-specifications.md), existing governed-record/CMS workflow |
| Evidence | [Execution evidence](evidence/B02-009-versioned-utility-statements-2026-09-17.md) |

## Acceptance

1. Opaque statement series identity, immutable type/version/predecessor, localized semantic sections,
   accountable owner, effective/review/expiry dates and server-generated review stamps.
2. Privacy requires independent content, privacy and legal reviews; accessibility requires independent
   content and accessibility reviews. Bound contacts additionally require operations review.
   Authors cannot supply stamps or self-approve; live matching identities are checked under the write lock.
3. Each version has its own stable public ID and canonical slug. Predecessors are retained, version
   chains advance by one, current versions cannot compete, and predecessor retirement precedes
   successor approval. Published and historical text cannot change; historical versions cannot reopen.
   This pull retains every version without defining or executing production retention/deletion policy.
4. Privacy carries an explicit per-feature disabled/planned processing inventory, including purpose,
   categories, recipients, access, transport, retention/deletion and choices, with no providers.
   Evaluation requires the exact approved current version and complete inventory match, a current
   canonical contact with purpose-specific operations evidence, and current service dependencies.
   Every decision returns collection disabled, including when the synthetic contract matches.
5. Accessibility testing records tested date/scope/methods, evidence and known limitations.
   No conformance certification, response-time promise or support availability is inferred.
   Unavailable contacts and translations remain explicit; synthetic bilingual sections are escaped,
   readable without scripts and have native in-page navigation.
6. Strict schema/workflow/render negatives, fresh PostgreSQL persistence/concurrency/rollback,
   live-role revocation, actual elapsed expiry, role isolation, full verification, reachable-history
   secret scan and dependency audit pass before submission. Hosted CI and client acceptance are separate.

## Boundaries

No authentic legal policy, legal advice, hospital statement, reviewed translation, real support or
rights-request route, new dependency, CMS/public route, personal-data collection, external provider,
production scheduler, migration, provisioning or publication is authorized.
APPT-03, SEARCH-02, GOV-01, formal DEL-01, hospital privacy/legal approval and production gates remain open.

Commands: `pnpm utility-statements:check`, `pnpm governed-records:db-smoke`,
`pnpm local-db-isolation:check`, `pnpm verify`, `pnpm secrets:check --history`,
`pnpm audit:dependencies` and `git diff --check`.

[Issue #46](https://github.com/dynamicet/hallelujah-website/issues/46) tracks controlled B02-009 execution.

## Local review submission

[Issue #46](https://github.com/dynamicet/hallelujah-website/issues/46) tracks this pull.
All scoped local checks, fresh PostgreSQL persistence/lifecycle and role isolation, the full
verification suite including 92 shared-component and 52 statement browser cases, reachable-history
secret scan, refreshed dependency audit and sanitized specimen review pass.
B02-009 moves In progress → In review under the same responsibility/review identity and synthetic
local T0/private hosted T1 scope. Hosted implementation T1 passes; client controlled-development acceptance remains pending.

## Hosted implementation review

[Draft PR #47](https://github.com/dynamicet/hallelujah-website/pull/47) tracks review.
Hosted implementation T1 [run 35259827827](https://github.com/dynamicet/hallelujah-website/actions/runs/35259827827)
passed every step, including full verification and clean dependency reconstruction/build,
for exact commit `76df9d832465b1467b7855ff8f43264e1baffbd9`.
B02-009 remains In review pending client controlled-development acceptance.
The final documentation head must repeat hosted CI before merge; issue #46 and PR #47 retain
its matching SHA/run. APPT-03, SEARCH-02, formal DEL-01, authentic hospital policy/support
approval, public routes, collection, providers, production and publication remain gated.

## Final-head CI harness correction

Final documentation [run 35260612990](https://github.com/dynamicet/hallelujah-website/actions/runs/35260612990)
failed on `9da7dc2883578328b59da5ceda77b0a4c2717bb8` in the existing B01-013/form smoke assertion:
the controlled invalid submission no longer appeared busy/pending/disabled when sampled.
All statement schema checks and the build passed; the run stopped before the new statement browser step.

The form fixture exposes pending state synchronously and clears it after 80 ms. The harness
submitted and sampled pending semantics using separate browser-protocol calls. Under runner load,
the callback could clear pending before the second call arrived. The correction samples the same
busy, visible-pending and disabled-submit conditions within the submission browser task.
It also replaces fixed result sleeps with bounded condition waits requiring visible/focused invalid
summary or visible truthful failure after completion. No assertion, runtime timer, form behavior,
collection or publication gate is weakened. The failure remains part of the evidence; the corrected
exact head requires passing local and hosted verification before review is ready.

The corrected harness subsequently passed full local `pnpm verify`, including all pending/focus/
truthful-failure assertions, the 92-case shared-component matrix and all 52 statement cases.
No application/runtime behavior changed. Corrected exact-head hosted CI remains required before
review is ready; issue #46 and PR #47 retain the final matching SHA/run and failed-run history.

## Controlled-development acceptance

On 17 September 2026 at 22:06 Africa/Addis_Ababa, the client directed “close it”.
B02-009 moves In review → **Done** for controlled development. Responsible and acceptance
authority is workspace identity `befikadusata` directing Codex in temporary Backend/CMS,
Privacy/Legal-contract and Accessibility/QA roles, under the same synthetic local T0/private hosted T1
boundary. Dependencies B02-001/B02-002 are Done; B02-008 merge and exact-main CI passed.

All scoped local acceptance checks pass, including fresh PostgreSQL persistence, concurrency,
rollback, historical-text retention, live-role/dependency revocation, actual elapsed expiry and role
isolation. Full local verification, the 92-case shared-component and 52-case statement browser
matrices, reachable-history secret scan and dependency audit pass. Corrected exact-head hosted
[run 35261501352](https://github.com/dynamicet/hallelujah-website/actions/runs/35261501352)
passed every step, including full verification and clean reconstruction/build, for
`4c0541582e24930947014e407efd292684905062`. This resolves the documented form-smoke timing failure;
the earlier failed run remains retained as evidence. No scoped implementation defect remains open.

The final acceptance-documentation head must repeat hosted CI before
[PR #47](https://github.com/dynamicet/hallelujah-website/pull/47) merges.
[Issue #46](https://github.com/dynamicet/hallelujah-website/issues/46) and PR #47 retain its matching
SHA/run, merge and exact-main result. APPT-03, SEARCH-02, GOV-01, formal DEL-01, authentic policy
and support facts, hospital privacy/legal/accessibility approval, reviewed translations, public routes,
collection, providers, production and publication remain gated. B02-010 is the next candidate after
successful merge/main closeout, subject to controlled-development readiness checks.
