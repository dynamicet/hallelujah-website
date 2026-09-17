# B02-008 — Governed Institutional Content Blocks

**Status:** In review for controlled development after passing local T0 on 17 September 2026, Africa/Addis_Ababa. Hosted implementation T1 passes; client acceptance pending. Final documentation CI required before merge.

The client directed “continue” after the proposed B02-008 execution. B02-007 PR #43 merged
as `2adbbbefcf4b058d39da0c5a95a60891d053cea4`; exact-main
[run 35247200418](https://github.com/dynamicet/hallelujah-website/actions/runs/35247200418)
passed. B02-001/B02-002 are Done. This records a controlled sequencing exception to
INST-01–INST-03 limited to synthetic local contracts, persistence and internal consumers.
Authentic institutional text, executive approval, leadership, relationship meaning and publication
remain subject to those decisions and hospital signoff.

| Field | Controlled contract |
| --- | --- |
| Lane / priority / phase | DELIVERY / P1 / Phase 1, M1 |
| Responsible / review authority | `befikadusata` directing Codex in temporary Backend/CMS, Executive/Content-contract, Brand/Legal-contract and QA roles / same identity for controlled-development review |
| Environment | Synthetic local T0; private hosted T1; authenticated Payload Local API |
| Scope | Content contracts, shared workflow, internal consumers, CMS checks/fixtures and architecture/backlog documentation |
| Sources | [Epic 02](epic-02-cms-content.md), [About specification](../ux/page-specifications.md#11-about-the-hospital), shared governed-record and CMS workflow contracts |
| Evidence | [Execution evidence](evidence/B02-008-governed-institutional-blocks-2026-09-17.md) |

## Acceptance

1. Typed narrative, mission, leadership, milestone, fact and relationship blocks carry immutable
   opaque identity/type, explicit include/unavailable/defer/omit decisions, localized canonical
   text, source/owner/audit and review/expiry. Non-included blocks contain no body or factual payload.
2. Each included block has claim-level source, definition, limitations, as-of/review/expiry dates.
   Content review creates evidence stamps; authors cannot create or edit stamps. Independent
   content, brand and legal reviews plus general approval are required. Synthetic content reviewers
   represent an executive/content contract only; they are not hospital executive signatures.
3. Complete-set validation rejects competing current mission records rather than silently choosing
   one. Stable identity/type, uniqueness, revisions, append-only audits and rollback remain enforced.
4. Leadership has explicit name/role. Relationships state partner/insurer meaning with insurance
   coverage withheld. No coverage boolean, benefit, eligibility or media enters this pull.
5. Internal reads omit untranslated, unapproved, withdrawn, review-due and expired blocks,
   including evidence expiry earlier than the record. Persisted approval identities are checked under
   the existing write lock. Public/default consumption denies every institutional block even when
   the synthetic flag is removed. Escaped semantic English and unreviewed Amharic specimens are inert.
6. Pure workflow/schema/render negatives, fresh PostgreSQL persistence/concurrency/rollback/live-role
   denial, role isolation, full verification, history-secret scan and dependency audit pass before
   submission. Exact-head hosted CI is required before merge; client acceptance is separate.

## Boundaries

No authentic hospital facts, policies, claims, contacts, reviewed translations, media, new package,
public/CMS route, collection, provider, migration, provisioning or publication is authorized.
INST-01–INST-03, GOV-01 and production gates remain open.

Commands: `pnpm institutional-blocks:check`, `pnpm governed-records:db-smoke`,
`pnpm local-db-isolation:check`, `pnpm verify`, `pnpm secrets:check --history`,
`pnpm audit:dependencies` and `git diff --check`.

## Local review submission

[Issue #44](https://github.com/dynamicet/hallelujah-website/issues/44) tracks this pull.
All scoped local checks, fresh PostgreSQL integration and role isolation, full verification and
the 92-case bilingual shared-component browser matrix, history-secret scan and dependency audit pass.
B02-008 moves In progress → In review under the same responsibility/review identity and synthetic
local T0/private hosted T1 environment. Hosted exact-head CI and client acceptance remain pending.

[PR #45](https://github.com/dynamicet/hallelujah-website/pull/45) tracks the draft review.
Hosted implementation T1 [run 35253420861](https://github.com/dynamicet/hallelujah-website/actions/runs/35253420861)
passed every step, including full verification and clean reconstruction, for exact commit
`e38726255685d939136a8f7f5277f5a39a455315`.
Client controlled-development acceptance remains pending. The final documentation head must
repeat hosted CI before merge; issue #44 and PR #45 retain the matching SHA/run.
INST-01–INST-03, authentic content, executive approval, coverage and publication remain gated.
