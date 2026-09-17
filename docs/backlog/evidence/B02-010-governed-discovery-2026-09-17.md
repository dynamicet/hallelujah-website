# B02-010 — Execution Evidence

**Status:** Done for controlled development; client accepted on 17 September 2026, Africa/Addis_Ababa.
Local T0, final PostgreSQL retest and hosted implementation T1 pass.

Client direction “Start” on 17 September 2026, Africa/Addis_Ababa authorizes the
[execution brief](../b02-010-governed-discovery.md). Responsible and controlled review authority
is `befikadusata` directing Codex in temporary Backend/CMS and SEO/QA roles. Target is synthetic
local T0/private hosted T1, branch `b02-010-governed-discovery`, based on main
`14fe00e40384a4131a651e8ea4f44e9e0e051272`. B02-001–B02-003 are Done; B02-009 PR #47
merged and exact-main run 35263794651 passed. [Issue #48](https://github.com/dynamicet/hallelujah-website/issues/48)
tracks execution. The PR records the exact implementation SHA and hosted check.

## Implemented result

A single validated projection supplies canonical route identity, internal search/metadata candidates,
reciprocal English/Amharic alternates, minimal WebPage structured data and XML sitemap candidates.
Every candidate is synthetic, uses a loopback origin and remains noindex. Missing language versions
have no target. Settings/topics/blocks receive no individual routes; unsupported inventory pages and
appointment candidates remain withheld. Published slugs cannot change or disappear after publication.

Independent workflow reviews, live persisted approval/verification identities, current specialized
content evidence, transitive dependencies, effective dates, review and expiry determine eligibility.
Invalid sets fail closed. Nested claim expiry removes dependent records, including graph cycles.
Safety-class content requires independent approval and post-publication verification.

Native HTTP adapters are tested over actual loopback sockets, preserving 200, canonical/direct-successor
308, unknown/unpublished 404, removed/elapsed-expiry 410, unavailable published 503 and unsupported-method
405. HEAD retains headers/status without a body. Redirects never copy query state, cross language without
an equivalent, or target a home fallback/external host. HTML, XML and JSON-LD are escaped by context.

The controlled memory cache uses detached snapshots, complete document/workflow fingerprints and the
earliest nested temporal boundary. Authenticated locked reads recheck live identities before cache use.
Every persisted governed write evicts complete-set projections; rollback publishes no uncommitted data.
The old/new path and reverse-dependency invalidation plan includes all shared-shell consumers on safety
contact changes. No production Next.js/CDN cache is enabled.

## Local verification

Pinned Node.js 24.21.0/pnpm 10.27.0, PostgreSQL 18.6 and installed Chromium 152 were used.

| Check | Result |
| --- | --- |
| `pnpm discovery:check --capture` | Pass: invalid/default/authentic/origin/date/duplicate negatives; stable bilingual inventory; missing counterpart; role/class/self-approval checks; current-only metadata/sitemap; XML parse; escaped HTML/JSON-LD; real loopback HTTP; canonical/successor/no-query redirects; HEAD/method semantics; nested expiry, cycle and transitive dependency removal; detached cache, clock reversal and temporal recomputation; complete safety invalidation plan. |
| Fresh `pnpm local-db-isolation:check` | Pass: own synthetic fixtures readable; cross-role connections/reads/mutations denied; socket-only PostgreSQL with no TCP listener. |
| Fresh `pnpm governed-records:db-smoke` | First complete integration pass includes authenticated discovery, cache-populated approval revocation, transitive dependency removal, explicit transaction rollback, committed successor HTTP and elapsed review/expiry removal without a scheduler. Final safety-class retest passes, including all existing CMS integration cases. |
| `pnpm verify` | Pass: policy, format, CI controls, links, secrets, backlog, brand, introduction gates, lint, types, tests, build, accessibility, budgets, runtime and all browser suites, including the 92-case shared-component matrix and 52 statement cases. The final shared-shell invalidation expansion repeats discovery checks, types and lint. |
| `pnpm secrets:check --history` | Pass: working tree and reachable-history credential signatures; matched values would be redacted. |
| `pnpm audit:dependencies` | Pass: 650 dependencies; zero moderate/high/critical known vulnerabilities; no dependency change. |
| `git diff --check` | Pass. |

Initial local checks stopped because `/tmp` was over its user quota. Disposable `/var/tmp` directories
and the installed direct Chromium binary resolved local test startup; the Snap launcher crashed while
the direct binary passed. An initial database fixture ID collided with an existing statement fixture;
the new fixture now uses a distinct suffix and the complete integration check passed. A first type check
identified an ES2023 array method outside the ES2022 target; the implementation uses supported APIs.
No assertion, application timer, browser matrix or approval gate was weakened. The disposable clusters
are stopped and removed by the local runner. Regenerated prior-ticket print PDFs are excluded from this change.

## Sanitized artifacts and limits

[Artifact index](b02-010-artifacts/README.md) retains English/unreviewed Amharic HTML, metadata JSON,
parsed XML sitemap and denied robots output. These specimens assert no authentic hospital, care,
schedule, contact, policy or conformance fact. Functional CMS/HTTP metadata work changes no production
visual layout, so no visual benchmark application is added.

LANG-01/LANG-02, GOV-01, authentic content, hospital approval, historical public statement routing,
production invalidation delivery/CDN wiring, public/CMS routes, providers, personal-data collection,
provisioning and publication remain gated. Hosted CI is separate from local integration and client acceptance.

## Hosted implementation review

[PR #49](https://github.com/dynamicet/hallelujah-website/pull/49) tracks review.
Hosted implementation T1 [run 35267003343](https://github.com/dynamicet/hallelujah-website/actions/runs/35267003343)
passed every step, including full verification and clean dependency reconstruction/build, for exact
commit `ffebc1aa3bfd4dd122c2eb70db535583ac375cfa`. The implementation was submitted In review; controlled-development acceptance is recorded below. The documentation head must repeat hosted CI before
merge; issue #48 and PR #49 retain the matching SHA/run. No production or publication gate is promoted.

## Controlled-development acceptance

On 17 September 2026 at 23:04 Africa/Addis_Ababa, the client directed “close it”.
B02-010 moves In review → **Done** for controlled development under workspace identity
`befikadusata` directing Codex in temporary Backend/CMS and SEO/QA roles, with the same
identity as acceptance authority. Dependencies B02-001–B02-003 are Done; B02-009 merge
and exact-main CI passed. The target remains synthetic local T0/private hosted T1.

All scoped local checks and hosted implementation T1 pass. Documentation
[run 35267682156](https://github.com/dynamicet/hallelujah-website/actions/runs/35267682156)
passed every step, including full verification and clean reconstruction/build, for exact commit
`a90fafc653fe68eea71a84683a5ab7cca44618a1`. The final acceptance-documentation head must
repeat hosted CI before [PR #49](https://github.com/dynamicet/hallelujah-website/pull/49) merges.
[Issue #48](https://github.com/dynamicet/hallelujah-website/issues/48) and PR #49 retain the matching
SHA/run, merge and exact-main result. No scoped implementation defect remains open.

LANG-01/LANG-02, GOV-01, authentic content, hospital approval, historical public statement
routing, production cache/CDN wiring, public/CMS routes, providers, personal-data collection,
provisioning and publication remain gated. B02-011 is the next candidate after successful
merge/main closeout, subject to its controlled-development execution brief and readiness checks.

## Post-merge cleanup correction

PR #49 merged as `14616f50efca2b816f271dd60ed8fbd49876d197` after final acceptance-head
[run 35268726064](https://github.com/dynamicet/hallelujah-website/actions/runs/35268726064)
passed for `3754675763897344d79260fa8e92f26d5fb9ba11`, automatically closing issue #48.
Exact-main [run 35269268129](https://github.com/dynamicet/hallelujah-website/actions/runs/35269268129)
then failed after all 52 statement browser cases passed: profile cleanup raised `ENOTEMPTY`.
This is a manual merge control failure; dependent execution is paused until checked correction
and exact-main CI pass. B02-010 remains accepted for controlled development.

Client-directed closeout authorizes the scoped browser cleanup correction under
[issue #50](https://github.com/dynamicet/hallelujah-website/issues/50), with `befikadusata`
directing Codex in temporary Frontend/QA roles and the same controlled acceptance authority
on 17 September 2026, Africa/Addis_Ababa. The statement harness now uses five bounded
100 ms recursive-removal retries, matching the existing foundation browser harness.
Browser shutdown and all functional assertions remain intact; exhausted cleanup retries still fail.
Two local 52-case statement matrices and lint pass using pinned Node.js 24.21.0, pnpm 10.27.0
and disposable `/var/tmp` profiles. Local verification passes across all prescribed checks, including the 92-case shared-component matrix
and a third 52-case statement matrix with direct Chromium after a Snap launcher startup failure.
Format/links/backlog/history-secret/diff checks and dependency audit pass. The correction moves
In progress → In review under the same responsible/acceptance identity; hosted correction CI remains required.
The [correction evidence](B02-010-browser-cleanup-closeout-2026-09-17.md) retains the failed
run and required passing correction/merge/main results. Production/publication gates are unchanged.
