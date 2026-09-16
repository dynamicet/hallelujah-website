# `B02-002` Controlled CMS Workflow Evidence

**Date/timezone:** 16 September 2026, Africa/Addis_Ababa.
**Responsible:** `befikadusata` directing Codex in temporary Backend/CMS, Security and QA roles.
**Controlled review authority:** same client identity; final client acceptance is pending.
**Status:** In progress → In review after passing local T0 and hosted implementation T1; final client acceptance remains pending.
**Branch/tracker:** `b02-002-controlled-cms-workflow`; [issue #30](https://github.com/dynamicet/hallelujah-website/issues/30).

## Scope and dependencies

The [execution brief](../b02-002-controlled-cms-workflow.md) and
[architecture](../../architecture/controlled-cms-workflow.md) constrain this result to synthetic
local identities/records and internal Payload operations. `B02-001` is Done. Correction PR `#29`
merged as `5b51f5c`; exact-main CI run `35077538959` passed before this pull. The client-directed
sequencing exception leaves deferred `B00-001`/`GOV-01`, hospital role/workflow approval, real safety
facts, remote provisioning, personal-data collection, providers, production and publication open.
Benchmark application: none, because no visual surface is added.

## Expected versus actual

| Check | Expected | Actual |
| --- | --- | --- |
| Persisted authority | Supplied/JWT roles cannot grant permissions; deactivation/revocation applies before publication | Forged clinical claim rejected; deactivated domain reviewer and revoked general reviewer block publication |
| Ownership/self-approval | Authors edit/submit their own draft and never approve own work | Another author's submit/preview rejected; combined author/reviewer/domain roles cannot self-approve |
| Identity management | Separate manager required; self-role changes denied | Author bypass attempt and manager self-change rejected; manager can deactivate/reactivate another synthetic user |
| Domain/safety review | Kind-matched review plus privacy/brand as classified; separate operations/general safety reviewers | Wrong/missing clinical review rejected; contact/emergency separation passes; privacy/brand pure negative checks pass |
| Review integrity | Content cannot change during publication; request-changes clears approval | Changed title at publish rejected; pure review-return/draft-edit checks preserve previous audit and clear review metadata |
| Metadata/audit | Stable author/class/ID and server-generated append-only audit | Supplied author/class rejected; withdrawal preserves prior audit, stable public ID and recorded publisher actor |
| Concurrency | One commit for two writes from same revision | Exactly one edit commits and the other rejects with stale revision after the transaction lock |
| Safety verification | Independent operations verification after synthetic publication | Verification initially absent, then recorded by independent operations with a synthetic reference |
| Time | UTC required; early/expired/review-due publication rejected; due schedule/expiry advances securely | Pure time negatives pass; real future scheduled fixture publishes and expires through authenticated lifecycle service |
| Preview/public boundary | Anonymous/other-author preview denied; private/noindex directives; synthetic content ineligible | All denials/directives asserted in Payload; `publicEligibility` stays false; no HTTP/CMS route introduced |
| Email/deletion | No delivery or deletion bypass | Explicit disabled email adapter; Local API delete override still rejects and requires withdrawal |

## Commands and environment

Pinned Node.js `24.21.0`, pnpm `10.27.0`, Payload `3.89.0` and PostgreSQL `18.6` were used.
The ambient shell initially selected Node `25.2.1`; the package engine gate correctly rejected it.
All passing checks used the pinned Node directory in PATH. Generated Payload types were regenerated
locally; fresh-checkout typecheck also passed without that ignored file before final verification.
No dependency/lockfile change or migration was introduced.

| Command | Result |
| --- | --- |
| `pnpm cms-workflow:check` | Pass: ownership, role, state, approval, safety, UTC scheduling, audit and preview negatives |
| `pnpm governed-records:check` | Pass: existing structural/public-eligibility boundary; unauthenticated collection writes now reject even with trusted access override |
| `pnpm governed-records:db-smoke` | Pass: synthetic login, persistence, concurrent revisions, role revocation, distinct safety approval, verification, withdrawal, real timed publication/expiry |
| `pnpm verify` | Pass: policy, six CI negative controls, links/format/backlog, secret signatures, brand/introduction, lint/types/tests/build, accessibility/budgets/runtime, harness and rendered foundation/card/map checks |
| `pnpm secrets:check --history` | Pass: 317 current text files and reachable Git history; values would be redacted |
| `pnpm audit:dependencies` | Pass: 650 dependencies; zero moderate/high/critical known vulnerabilities |
| `git diff --check` | Pass |

The disposable database was initialized with `/usr/lib/postgresql/18/bin/initdb`, local trust
authentication and a separate fixture administrative role, then started with `listen_addresses`
empty, a Unix socket under `/tmp/hallelujah-b02-001-pg.…`, and port `55482`. The
[synthetic SQL setup](../../../apps/web/scripts/sql/b02-001-cms-smoke.sql) provisioned separate content
and appointment roles/databases; no appointment records or TCP listener were used. The check was
run with explicit `B02_001_PGHOST` and `B02_001_PGPORT` coordinates only, supplying fixture credentials
internally. Tokens/passwords were asserted in memory and not logged or committed.

## Defects and environment retests

- The sandbox blocked PostgreSQL Unix sockets. The same disposable local test was rerun outside
  that sandbox; no remote/provider access was involved.
- Payload supplies an original-document object during creation. An initial truthiness check tried
  to reload a nonexistent record. Using the explicit hook operation fixes create/update distinction.
- Concurrent writes showed that Payload merges original workflow fields before the hook. Current
  revision is now checked before metadata comparison, producing an explicit stale-write rejection.
- Local `/tmp` quota blocked repository-copy controls. A temporary directory inside the repository
  was also rejected by Node's copy-to-self check. Neither attempt is reported as a pass.
- With `/var/tmp`, Snap Chromium could not start its profile. The supported direct Chromium
  `152.0.7977.64` binary was selected through a temporary PATH alias; full `pnpm verify` then passed
  using `TMPDIR=/var/tmp/hallelujah-b02-002-temp` and pinned Node. No repository browser-selection
  code or acceptance assertion was weakened. Local rendered coverage includes all 92 review cases.

No open local implementation defect remains. The PostgreSQL adapter transaction-session interface
is version-specific and tied to the pinned adapter; toolchain upgrades must repeat persistence and
concurrency checks. Hosted CI repeats full verification and clean reconstruction; it does not
certify the locally executed PostgreSQL persistence matrix or production workflow/authentication.

## Review and remaining gates

The implementation is ready for controlled-development review. Matching exact-head hosted results
and PR identity will be recorded in the tracker before merge. Final client acceptance, named hospital
role assignments, actual safety approval/post-publication operations, HTTP authentication/CSRF,
production scheduling, infrastructure, collection and publication remain separate unresolved gates.

## Hosted implementation review

[Draft PR #31](https://github.com/dynamicet/hallelujah-website/pull/31) records the implementation and controlled review boundary.
[Hosted run 35080177144](https://github.com/dynamicet/hallelujah-website/actions/runs/35080177144) completed successfully for
exact commit `65206c0f52292b85ad6f1868ad6bdfc032963da4` on 16 September 2026. Every step
passed, including frozen install, negative CI controls, reachable-history secret scan, dependency
audit, full repository/browser verification and clean reconstruction with repeated verification.
No hosted failure or open local implementation defect remains.

This records implementation T1, not local PostgreSQL certification or client/production acceptance.
The final documentation head must repeat current-head CI before merge. Its matching SHA/run belongs
in issue #30 and PR #31; final client controlled-development acceptance remains pending.
