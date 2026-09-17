# B02-010 — Controlled Governed Discovery and HTTP Lifecycle

**Status:** Done for controlled development; client accepted by directing “close it” on 17 September 2026, Africa/Addis_Ababa.

B02-009 PR #47 merged as `14fe00e40384a4131a651e8ea4f44e9e0e051272` and exact-main
[run 35263794651](https://github.com/dynamicet/hallelujah-website/actions/runs/35263794651) passed.
B02-001–B02-003 are Done for controlled development. This pull permits synthetic local
discovery candidates and internal HTTP adapters while LANG-01/LANG-02, authentic content,
production provisioning and publication remain gated.

| Field | Controlled contract |
| --- | --- |
| Lane / priority / phase | DELIVERY / P1 / Phase 1 |
| Responsible / review authority | `befikadusata` directing Codex in temporary Backend/CMS and SEO/QA roles / same identity for controlled-development review |
| Environment | Synthetic local T0 and private hosted T1; authenticated Payload Local API |
| Scope | Shared canonical route identity, metadata, alternate candidates, minimal structured data, XML sitemap, robots, genuine HTTP lifecycle responses and dependency cache invalidation |
| Repository areas | `apps/web/src/content/`, related checks in `apps/web/scripts/`, package scripts, architecture/backlog/evidence documentation |
| Sources | [Epic 02](epic-02-cms-content.md), [route inventory](../ux/sitemap.md), [data/URL contracts](../visual-design/handoff/developer-handoff.md#6-data-and-url-contracts), [working acceptance matrix](../validation/implementation-acceptance-matrix.md) |

## Acceptance

1. One validated current-record projection supplies internal search, metadata, structured data
   and sitemap candidates. Invalid sets, missing approval, future publication, due review,
   elapsed expiry, revoked approvals and unavailable dependencies fail closed.
2. Doctor/service detail paths and the approved static page inventory are canonical. Internal
   blocks/topics/settings do not invent individual public routes. English/Amharic counterparts
   share the stable public ID; missing counterparts never fall back to English under an Amharic URL.
   All fixture metadata remains noindex; final alternate approval stays LANG-01/LANG-02 gated.
3. XML/HTML/JSON output is escaped; structured data asserts only WebPage identity/title/language,
   with no medical, hospital, schedule, contact or conformance claim. Only loopback fixture origins
   are accepted. Robots denies crawling and advertises no sitemap.
4. Native Response adapters and loopback HTTP tests prove 200, 308, 404, 410 and unavailable 503
   semantics. Redirects resolve directly to an eligible genuine same-kind successor in the requested
   language; no home redirect, chain, external target or query copying is permitted.
5. Controlled cache entries expire at the earliest review/expiry/dependency boundary and invalidate
   after persisted writes. Reverse dependencies and shared emergency/contact consumers are included.
   Rollback never promotes uncommitted records into cache; safety updates cannot serve stale data.
6. Meaningful schema/output/HTTP/lifecycle negatives, fresh PostgreSQL authenticated persistence,
   role revocation/rollback checks, local isolation, full verification, history secret scan and dependency
   audit pass before review. Hosted CI and client acceptance remain separate.

No public/CMS route, production cache, production scheduler, authentic translation, external request,
provider, collection, migration or publication is authorized. Preserve unrelated workspace changes.

Commands: `pnpm discovery:check`, `pnpm governed-records:db-smoke`,
`pnpm local-db-isolation:check`, `pnpm verify`, `pnpm secrets:check --history`,
`pnpm audit:dependencies` and `git diff --check`.

[Issue #48](https://github.com/dynamicet/hallelujah-website/issues/48) tracks controlled execution.

## Local review submission

All scoped checks, fresh PostgreSQL discovery/persistence/lifecycle integration and isolation, full
repository verification, the 92-case shared-component and 52-case statement browser suites, history
secret scan, dependency audit and sanitized artifacts pass. B02-010 moves In progress → In review
under the same responsible/review identity and synthetic local T0/private hosted T1 scope.
[Completion evidence](evidence/B02-010-governed-discovery-2026-09-17.md) records results and local
environment retests. Hosted implementation CI passes; client controlled-development acceptance is recorded below.

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
