# B02-008 — Execution Evidence

**Status:** Done for controlled development following client acceptance on 17 September 2026, Africa/Addis_Ababa. Local T0 and hosted implementation/documentation T1 pass; final acceptance-head CI is required before merge.
**Date / timezone:** 17 September 2026, Africa/Addis_Ababa.
**Responsible / review authority:** `befikadusata` directing Codex in temporary Backend/CMS,
Executive/Content-contract, Brand/Legal-contract and QA roles; same controlled-development review identity.
**Environment:** Synthetic local T0/private hosted T1; no authentic content or public route.

[Execution brief](../b02-008-governed-institutional-blocks.md) records the INST-01–INST-03
controlled sequencing exception. B02-001/B02-002 are Done; B02-007 PR #43 merged as
`2adbbbefcf4b058d39da0c5a95a60891d053cea4` and exact-main
[run 35247200418](https://github.com/dynamicet/hallelujah-website/actions/runs/35247200418) passed.
[Issue #44](https://github.com/dynamicet/hallelujah-website/issues/44) tracks this execution.

## Local methods and results

Pinned Node.js 24.21.0/pnpm 10.27.0, PostgreSQL 18.6 and installed Chromium were used.
The complete disposable CMS suite used a fresh Unix-socket-only cluster at
`/var/tmp/hallelujah-b02-001-pg.mqbtifgu`, port 55488, with TCP disabled. Existing synthetic
SQL provisioned distinct content/appointment roles. After cross-role isolation passed, the
disposable content probe table was removed before Payload schema initialization.
The cluster was stopped and removed afterward.

| Check / expected outcome | Actual result |
| --- | --- |
| `pnpm institutional-blocks:check`: reject incomplete evidence, competing missions, supplied stamps, wrong roles, stale revisions, coverage flags and immutable changes | Pass: all six types, explicit content dispositions, source/definition/limitations/as-of/review/expiry validation, independent content/brand/legal/general reviews, edit reset, mission/identity conflict rejection, public/default denial, evidence expiry, missing language omission, escaped bilingual inert rendering and withdrawal |
| `pnpm local-db-isolation:check`: each role can access only its own database, with no TCP listener | Pass: both cross-role connection/mutation attempts denied |
| `pnpm governed-records:db-smoke`: persistence, transactional concurrency/rollback and live approvals | Pass: institutional data persists; concurrent edits yield one success/one stale rejection; mission/identity/type conflicts and forged request roles deny; incomplete approval and revoked-review publication roll back record/revision/audit; content/brand/legal/general approval revocation removes blocks; authenticated bilingual reads/default denial pass; relationship evidence expiry leaves the current narrative; edit reset clears reviews; actual elapsed leadership evidence expiry removes the block while stored status remains published; retirement preserves identity/audit |
| `pnpm verify`: repository controls, source, build and browser checks | Pass: toolchain, format, CI policy and six negative mutations, links, current secret scan, backlog 10/10, brand/introduction, lint, TypeScript, all content/component checks, production build, semantic accessibility/budgets/runtime, 92 bilingual capability/viewport/media/history cases and foundation/card/map browser checks |
| `pnpm secrets:check --history` | Pass: 366 current text files and reachable history; matched values would be redacted |
| `pnpm audit:dependencies` | Pass: 650 dependencies; zero moderate/high/critical known vulnerabilities |
| `git diff --check` | Pass |

## Defects and environment retests

- Rapid workflow actions advance whole-second audit timestamps. The first pure approval test
  treated the preceding evidence stamp as future relative to its unchanged wall clock.
  Institutional readiness now uses the same effective monotonic workflow instant; read-time
  projections continue to reject future evidence. Pure and PostgreSQL retests pass.
- `/tmp` returned disk-quota errors for sandbox startup, shell heredocs and disposable test copies.
  Workspace edits used explicit escaped Python arguments; full verification used `TMPDIR=/var/tmp`
  and PostgreSQL used its already-allowlisted `/var/tmp` socket path. No quota-related source change.
- The isolation fixture table initially triggered an interactive Payload rename prompt. The stalled
  disposable test was stopped and cleaned up. A fresh cluster repeated isolation, then removed only
  its content probe table before initializing Payload; the complete suite passes unattended.

Local review submission is In progress → In review under the brief's responsibility/review identity,
17 September 2026, Africa/Addis_Ababa. No scoped implementation defect remains open.
Hosted CI and client acceptance remain pending. INST-01–INST-03, authentic executive signatures,
hospital facts, coverage, translations, media, public routes, collection, providers and publication
remain gated.

[PR #45](https://github.com/dynamicet/hallelujah-website/pull/45) tracks the draft review.
Hosted implementation T1 [run 35253420861](https://github.com/dynamicet/hallelujah-website/actions/runs/35253420861)
passed every step, including full verification and clean reconstruction, for exact commit
`e38726255685d939136a8f7f5277f5a39a455315`.
Client controlled-development acceptance remains pending. The final documentation head must
repeat hosted CI before merge; issue #44 and PR #45 retain the matching SHA/run.
INST-01–INST-03, authentic content, executive approval, coverage and publication remain gated.


## Controlled-development acceptance

On 17 September 2026, Africa/Addis_Ababa, the client directed “close it”.
B02-008 moves In review → **Done** for controlled development. Responsible and acceptance
authority is workspace identity `befikadusata` directing Codex in temporary Backend/CMS,
Executive/Content-contract, Brand/Legal-contract and QA roles, under the same synthetic
local T0/private hosted T1 boundary.

All scoped acceptance criteria pass; no implementation defect remains open. Local schema,
workflow, rendering, PostgreSQL persistence/concurrency/rollback/live-role/elapsed-expiry checks,
role isolation, full verification, history-secret scan and dependency audit pass. Hosted
implementation [run 35253420861](https://github.com/dynamicet/hallelujah-website/actions/runs/35253420861)
passed for `e38726255685d939136a8f7f5277f5a39a455315`; documentation
[run 35254108886](https://github.com/dynamicet/hallelujah-website/actions/runs/35254108886)
passed for `4b8c3e639879e493578cbcfc7d0f357165de2753`.

The final acceptance-documentation head must repeat hosted CI before
[PR #45](https://github.com/dynamicet/hallelujah-website/pull/45) merges.
[Issue #44](https://github.com/dynamicet/hallelujah-website/issues/44) and PR #45 retain its
matching SHA/run, merge and exact-main result. INST-01–INST-03, hospital executive approval,
authentic content, insurance coverage, reviewed translations, media, public routes, collection,
providers and publication remain gated.
