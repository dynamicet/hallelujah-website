# B02-010 browser cleanup closeout correction

**Status:** In review after passing local verification; dependent execution paused pending checked correction/main CI.

Client direction “close it” authorizes this scoped correction under
[issue #50](https://github.com/dynamicet/hallelujah-website/issues/50). Responsible and acceptance
authority: `befikadusata` directing Codex in temporary Frontend/QA roles on 17 September 2026,
Africa/Addis_Ababa. Target: synthetic local T0/private hosted T1.

## Failure and correction

B02-010 PR #49 merged as `14616f50efca2b816f271dd60ed8fbd49876d197` after passing
exact-head acceptance CI. Main [run 35269268129](https://github.com/dynamicet/hallelujah-website/actions/runs/35269268129)
passed every functional browser assertion, including all 52 statement cases, but temporary Chromium
profile deletion raised ENOTEMPTY after process exit. Browser descendants may still finish filesystem
writes after the parent exits. The cleanup now uses the same five bounded 100 ms recursive-removal
retries as the foundation harness; exhausted retries still fail. No assertion or application changes.

## Verification

- Two complete local statement matrices pass: 52 bilingual viewport/no-JS/forced-colors/print/unavailable cases each, native keyboard links, zero external requests and profile removal.
- Lint passes with pinned Node.js 24.21.0/pnpm 10.27.0. Disposable profiles use `/var/tmp` because `/tmp` is over quota.
- Local verification passes across all prescribed checks. The first `pnpm verify` stopped at browser startup after policy/source/types/tests/build/accessibility/budgets/runtime passed because the Snap launcher exited; all remaining browser suites then passed with a temporary launcher for the installed direct Chromium binary, including the 92-case shared-component matrix and another complete 52-case statement matrix.
- Format, local links, backlog audit (10/10), reachable-history secret scan, lint and diff checks pass. Dependency audit: 650 dependencies, zero moderate/high/critical known vulnerabilities. Regenerated prior-ticket print PDFs are excluded from the correction.
- Current-head hosted full verification/clean reconstruction, checked merge and exact-main CI remain required.

B02-010 remains accepted for controlled development. Dependent execution remains paused.
Production, publication, collection, providers and authentic content remain gated.
