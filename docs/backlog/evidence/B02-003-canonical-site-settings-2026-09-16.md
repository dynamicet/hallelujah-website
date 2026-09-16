# `B02-003` Canonical Site Settings Evidence

**Date/timezone:** 16 September 2026, Africa/Addis_Ababa.
**Responsible / review authority:** `befikadusata` directing Codex in temporary Backend/CMS,
Operations-contract and QA roles / same client identity for controlled-development review.
**Status:** Proposed → Ready → In progress → In review after passing local T0; client acceptance and hosted T1 pending.
**Branch/tracker:** `b02-003-canonical-site-settings`; [issue #34](https://github.com/dynamicet/hallelujah-website/issues/34).

## Scope and dependencies

The [execution brief](../b02-003-canonical-site-settings.md) constrains work to explicitly synthetic
local records and internal canonical consumers. B02-001/B02-002 are Done; correction PR #33
merged as `38d5e45` and exact-main run `35092817178` passed before this pull. The client directed
“record closeout and proceed”. SAFE-01/SAFE-03, authentic contacts/arrival facts, named hospital
approvals, providers, collection, production and publication remain unresolved. No real hospital
contact dataset, imported source record, new dependency, schema migration or application route is used.

## Expected versus actual

| Check | Expected | Actual |
| --- | --- | --- |
| Canonical schema | Independent purpose labels and source/owner/verifier/UTC lifecycle metadata; unsupported/missing/malformed facts reject | All twelve fact omissions and malformed metadata reject; duplicate English purposes, invalid phones/emails, controls and unsupported facts/locales reject |
| Conflict/readiness | Every required conflict, withheld/unverified fact, future verification or elapsed review/expiry blocks approval/publication | Per-fact negative matrix passes; stale verification blocks publication even while record-level review/expiry remain current |
| Safety authority | Mandatory contact class, independent operations review and distinct general approver | General-class bypass, missing operations review, author self-approval and same-person safety approval reject |
| Persistence/uniqueness | One current settings record within authenticated transactional write boundary | Fresh PostgreSQL stores all facts/metadata, rejects another author's second settings draft and preserves stable ID |
| Conflict reconciliation | Changes clear approvals and require repeat safety review | Emergency-number conflict blocks approval; request-changes/draft correction clears review metadata; independent repeat review and approval pass |
| Publication integrity | Content cannot change during workflow publication; controlled verification/audit retained | Changed phone at publish rejects; unchanged synthetic publication and operations verification persist; withdrawal retains record and suppresses consumption |
| Consumer consistency | Displayed values and normalized targets derive from one record | Both locale selectors and semantic renderer pass; all phone/email targets match their canonical displayed values, including independent equal emergency/ambulance values |
| Public/resilience boundary | No authentic or synthetic public contact exposure; stale/retired/invalid input safely withheld | Public default exposes no values; authentic settings are safety-gated; null/invalid time/unsupported language and expired/withdrawn facts fail closed |
| Language/rendering | English and explicit unreviewed Amharic shaping; missing labels omit; escaped server text without contact actions/scripts | Twelve facts render in each complete shaping fixture; missing Amharic address label omits that fact; escaping passes; no anchor, href, script or input is rendered |

## Commands and environment

Pinned Node.js `24.21.0`, pnpm `10.27.0`, Payload `3.89.0`, PostgreSQL `18.6` and direct
Playwright Chrome for Testing `151.0.7922.34` were used. Disposable files were isolated under
`/var/tmp/hallelujah-b02-003.94SsiW`; a temporary Chromium PATH alias selected the existing direct
binary. Database data was fresh under that temporary root; PostgreSQL listened only on a
`/tmp/hallelujah-b02-001-pg.…` Unix socket at port `55483`, with no TCP listener. The
[existing synthetic SQL](../../../apps/web/scripts/sql/b02-001-cms-smoke.sql) created separate
content and appointment database roles. No appointment content was collected or stored.
Fixture credentials/tokens stayed in memory and were never logged. The cluster stopped after checks.

| Command | Result |
| --- | --- |
| `pnpm site-settings:check` | Pass: twelve-fact schema/readiness negatives, safety/public/lifecycle checks, bilingual semantic render and target consistency |
| `pnpm cms-workflow:check` / `pnpm governed-records:check` | Pass: inherited authorization, governance and public boundaries |
| `pnpm governed-records:db-smoke` | Pass: authenticated persistence/concurrency/role revocation/timed lifecycle plus canonical settings conflict/duplicate/safety/consumer/withdrawal assertions |
| `pnpm verify` | Pass: full policy/negative controls/links/format/backlog/secrets/brand/introduction/lint/types/tests/build/accessibility/budgets/runtime and rendered browser gates |
| `pnpm secrets:check --history` | Pass: current text files and reachable history; matched values would be redacted |
| `pnpm audit:dependencies` | Pass: 650 dependencies, zero moderate/high/critical known vulnerabilities |
| `git diff --check` | Pass |

The browser gate repeats all 92 bilingual capability/viewport and media/history review cases,
plus foundation/action, governed-card and optional-map responsive/resilience matrices.
The new internal text template is not mounted into the application or harness; its language,
escaping, semantic/no-JavaScript and absence-of-action checks run through server rendering.
New-template keyboard/focus/motion/loading/offline interaction tests are inapplicable because it
has no interactive, client, fetching or motion behavior. Existing interactive browser gates pass.
The application build retains only its bootstrap, not-found and health surfaces, with zero external
initial origins and passing asset budgets.

## Defects and retests

- Extending the governed kind exposed an existing card fixture's broad type annotation. Restricting
  that fixture and card union to their actual card kinds restores typecheck without a new card variant.
- The sandbox's temporary quota first blocked command mounts and later the edit helper. A shell
  heredoc was also truncated by its temporary-file quota and made no documentation changes.
  The same edits were completed with a correctly quoted inline script outside the sandbox.
- Full verification and fresh database sockets required execution outside the sandbox, with
  disposable `/var/tmp` storage. No acceptance check, production gate or browser assertion was weakened.

No open local implementation defect remains. Local PostgreSQL integration is distinct from hosted
T1 and does not certify production infrastructure or workflows. Hosted exact-head quality/security
and clean reconstruction must pass before merge, and client controlled-development acceptance
remains required to promote In review → Done.
