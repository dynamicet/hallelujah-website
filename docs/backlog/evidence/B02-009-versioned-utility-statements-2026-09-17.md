# B02-009 — Execution Evidence

**Status:** Done for controlled development by client acceptance on 17 September 2026. Local T0 and corrected hosted T1 pass; final acceptance-documentation CI and merge closeout remain required.

Client direction on 17 September 2026, Africa/Addis_Ababa authorizes the
[execution brief](../b02-009-versioned-utility-statements.md). Responsible and controlled review
authority is workspace identity `befikadusata` directing Codex in temporary Backend/CMS,
Privacy/Legal-contract and Accessibility/QA roles. Target is synthetic local T0/private hosted T1.
B02-001/B02-002 are Done. B02-008 final-head run 35255139180 and exact-main run 35255831837 pass.
[Issue #46](https://github.com/dynamicet/hallelujah-website/issues/46) tracks this pull.

## Implemented result

Privacy and Accessibility records carry immutable series/type/version/predecessor, their own stable
public ID/canonical slug, effective/review/expiry dates, accountable owner, localized semantic
sections and a server-controlled review stamp. Independent content/privacy/legal or
content/accessibility reviews are required. Bound contacts add operations review and a
purpose-specific canonical fact binding; values are never duplicated in the statement.

Current approved/scheduled/published versions cannot compete. A successor advances the same series
by one with an earlier predecessor effective date; the predecessor retires before successor approval.
Published and historical statement content is immutable and retained. Historical references may
point to retired dependencies for provenance; current contact/collection consumption denies them.

Exact current privacy-version and entire processing-inventory matching, current canonical
contact/service dependencies and live matching approvals are prerequisites for a synthetic
collection-contract match. Revision labels alone are insufficient. Every result returns
`enabled: false`, including positive matches. No collection enablement or hospital approval is implied.

Accessibility specimens carry tested date/scope/methods, evidence and known limitations.
Only limited-testing claims are accepted. Native semantic sections, in-page links, complete
processing/testing details and explicit contact/translation-unavailable states work without scripts.

## Local verification

Pinned Node.js 24.21.0/pnpm 10.27.0, PostgreSQL 18.6 and installed Chromium were used.

| Check | Result |
| --- | --- |
| `pnpm utility-statements:check` | Pass: strict required/unsupported fields, dates, inventory features/providers/duplicates, independent reviews, stamp forgery, class/revision/self-approval negatives, review reset, identity/history immutability, successor conflicts, exact inventory/version matching, default-denied collection, stale/retired contact, certification/future-testing negatives, escaping and bilingual omission. |
| Fresh `pnpm local-db-isolation:check` | Pass: separate content/appointment roles read their own synthetic fixture and deny cross-database reads/mutations; Unix socket only, no TCP listener. |
| Fresh `pnpm governed-records:db-smoke` | Pass: all existing CMS integration checks plus statement persistence, concurrent stale-write denial, failed approval/publication rollback, retained predecessor/audit content, independent reviews, direct dependency-clinical-reviewer revocation at publication and read, live content/privacy/legal/operations/accessibility/approver revocation, bilingual authenticated reads, exact inventory/version negatives and actual elapsed expiry. |
| `pnpm verify` | Pass: policy, format, CI controls, links, secrets, backlog, brand, introduction gates, lint, typecheck, application tests/build, semantic accessibility, budgets, runtime and browser checks. The existing 92-case bilingual shared-component matrix and all 52 new statement cases pass. |
| `pnpm utility-statements:smoke` | Pass: 48 bilingual 320/360/768/1440 no-JavaScript/forced-colors/print cases plus four unavailable/expired cases; native keyboard fragment links, complete details, no horizontal overflow, zero collection controls and zero external requests. |
| `pnpm secrets:check --history` | Pass: working-tree and reachable-history signatures, with matched values redacted by the scanner. |
| `pnpm audit:dependencies` | Pass: 650 dependencies; zero moderate/high/critical known vulnerabilities. No dependency change. |
| `git diff --check` | Pass. |

The first disposable isolation fixture was removed before Payload schema creation to avoid an
interactive rename prompt. Local sandbox/tmp quota and Chromium snap/path startup failures were
resolved with task-created short external temporary directories and the installed direct binary;
a local PATH wrapper selected that same binary for existing shared checks. The full suite subsequently
passed. The database cluster was stopped and removed after each run. No test/runtime approval
baseline was weakened.

## Sanitized specimens and limitations

[Specimen index](b02-009-rendered/README.md) retains four PNGs, two complete English print PDFs
and the [52-case report](b02-009-rendered/verification.json). English accessibility and unreviewed
Amharic privacy captures were visually reviewed for clipping and explicit fixture labels.
These are internal semantic specimens, not public utility routes or approved policy/translation assets.
Human screen-reader acceptance and hospital legal/privacy/support review were not performed.

## Review boundary

B02-009 moves In progress → In review on 17 September 2026, Africa/Addis_Ababa under the same
responsibility/review identity and synthetic local T0/private hosted T1 scope. No scoped
implementation defect remains open. Hosted implementation T1 passes; client controlled-development acceptance remains pending. Final documentation CI must repeat before merge.

APPT-03, SEARCH-02, GOV-01, formal DEL-01, authentic policy/support facts, hospital approval,
reviewed translations, real contacts, public routes, collection, providers, production and
publication remain gated.

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
