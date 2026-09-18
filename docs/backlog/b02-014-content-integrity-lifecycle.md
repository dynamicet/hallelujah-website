# B02-014 — Content Integrity and Lifecycle Evidence

**Lane / priority / phase:** EVIDENCE / P1 / Phase 1 preparation  
**Status:** In review for controlled development; all local gates pass

On 18 September 2026, Africa/Addis_Ababa, the client directed “start” following the proposed
B02-014 execution. Responsible person and controlled review authority: workspace identity
`befikadusata` directing Codex in temporary QA/Content roles. B02-003–B02-013 are Done for
controlled development. B02-013 PR #57 merged as
`74ac57b28aee5f09e199834cf6d1aea6605489ae`; exact-main
[run 35362650228](https://github.com/dynamicet/hallelujah-website/actions/runs/35362650228) passed.
Tracking: [issue #58](https://github.com/dynamicet/hallelujah-website/issues/58).
The working B00-016 acceptance matrix supplies local T0/private hosted T1 acceptance;
formal DEL-01 production signatures remain deferred.

## Outcome and controlled scope

Add a fixed-time synthetic regression suite joining governed records, workflows, canonical
contacts, care affiliations, policy dependencies, discovery/cache/HTTP results and asset
rights/lifecycle. Retain the existing model and persisted CMS suites as supporting coverage.
Add a deployable-build boundary check for test-only imports, traced files, known fixture
payloads and copied synthetic evidence assets, with deliberate failing controls. Wire both
checks into repository verification.

Allowed changes: test scripts/helpers, package command entries, documentation and sanitized
evidence. No new dependency, public/CMS route, publication adapter or content approval is granted.
No visual benchmark applies to this internal evidence ticket.

## Acceptance coverage

| Contract | Required evidence |
| --- | --- |
| Governance and canonical integrity | Missing publication fields, duplicate stable IDs/slugs, broken and wrong-kind dependencies fail closed |
| Contacts and dependent pages/policies | Conflict and verification expiry remove discovery/contact values; signed notice remains readable under its existing contract |
| Care lifecycle | Endpoint/claim review or expiry and withdrawn affiliations remove handoffs from both consumer paths |
| Discovery and redirects | Cache temporal boundaries, sitemap/metadata agreement, genuine same-kind successors, missing translations and hostile serialization |
| Asset governance | Missing rights, expired rights/reviews, consent withdrawal and derivative cleanup; existing authenticated CMS suite proves attachment/reference eviction |
| Build isolation | Source imports/re-exports/dynamic loads, output traces, server/client/static/public fixture payloads, and failing policy controls |

The approved bootstrap component review surface remains an explicit B00/B01 controlled-development
exception. This check forbids authored content fixtures and review-tool dependencies entering
deployment artifacts; it does not claim that the bootstrap is a publishable hospital website.

## Verification and return points

Use pinned Node.js 24.21.0 and pnpm 10.27.0:

```sh
pnpm content-integrity:check
pnpm content-build:policy
pnpm build
pnpm content-build:check
pnpm assets:db-local --full
pnpm verify
pnpm rebuild:verify
pnpm audit:dependencies
pnpm secrets:check --history
git diff --check
```

The new assertions run through `pnpm test`; the build check runs after `pnpm build` in
`pnpm verify`. CI also repeats it during clean reconstruction. See the
[execution evidence](evidence/B02-014-content-integrity-lifecycle-2026-09-18.md).
Hosted exact-head review and client controlled acceptance remain required before Done.

## Local review result

Fifty fixed-time cross-model cases and 26 build-isolation controls pass. The local build check
inspects 73 source/config files, six traces and 138 output payloads against known fixture
markers and 82 evidence-asset fingerprints, with zero findings. Full repository verification,
complete disposable PostgreSQL integration, frozen clean reconstruction, history secret scan,
dependency audit and diff checks pass. Sandbox failures and their passing unrestricted retests
remain in the evidence. Hosted exact-head review and client controlled acceptance are pending;
no acceptance or merge is claimed.

Authentic records, hospital migration decisions, professional language approval, formal DEL-01,
providers, collection, provisioning and publication retain their existing gates.
