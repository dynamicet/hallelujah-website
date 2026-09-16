# B02-006 — Execution Evidence

**Status:** Proposed → Ready → In progress → In review → Done for controlled development; client acceptance recorded on 16 September 2026, Africa/Addis_Ababa. Final closeout CI and merge results are tracked in PR #41.
**Date/timezone:** 16 September 2026, Africa/Addis_Ababa.
**Responsible/review authority:** `befikadusata` directing Codex in temporary Backend/CMS,
Content/Clinical-contract and QA roles; same identity for controlled-development review.
**Branch:** `b02-006-governed-care-relationships`.
**Basis:** main `9ca9853aa17f69b0aa7ab30086df85d337c5a1ad`; exact-main
[run 35130481886](https://github.com/dynamicet/hallelujah-website/actions/runs/35130481886) passed.
**Environment:** Synthetic local T0; private hosted T1 when submitted.
[Issue #40](https://github.com/dynamicet/hallelujah-website/issues/40) tracks execution.

The [execution brief](../b02-006-governed-care-relationships.md) records the client-directed
scope and CARE-06 sequencing exception. B02-004 and B02-005 are Done.

## Method and results

Pinned Node.js 24.21.0/pnpm 10.27.0, PostgreSQL 18.6 and installed direct Chromium.
Fresh Unix-socket-only cluster `/var/tmp/hallelujah-b02-001-pg.26h4ngpk`, port 55486,
with empty listen_addresses. The runner shut it down after all assertions.
No shared database, authentic identities, hospital facts or external provider was used.

| Check | Actual result |
| --- | --- |
| `pnpm care-relationships:check` | Pass: strict typed/stable IDs, synthetic provenance, required dates/evidence, independent medical/clinical/operations review, wrong/self/missing role denials, stale revision/content/endpoints, duplicates, expiry, bilingual omissions, explicit location scope and ID-only handoff allowlist |
| Shared graph and inert render consumers | Pass: doctor/service affiliation arrays match; default output and generic-link inference are denied; withdrawal, future/stale/expired/untranslated endpoints leave no handoff; English/explicitly unreviewed Amharic semantic specimens render without actions, media, scripts or forms |
| `pnpm governed-records:db-smoke` | Pass: fresh PostgreSQL persistence, one successful concurrent writer, stale loser, duplicate tuple/immutable ID/server metadata denials, independent review, revoked role rejection, failed approval transaction rollback preserving revision/audit, post-approval identity revocation, symmetric English/Amharic authenticated reads, review deadline, edit clearing approvals and doctor/association retirement |
| `pnpm local-db-isolation:check` | Pass: both roles deny cross-database reads/writes; no network listener |
| `pnpm verify` | Pass: pinned tooling, format, CI controls, links, secrets, backlog 10/10, brand/introduction gates, lint, types, all tests, build, accessibility, budgets, runtime and shared browser suites |
| Browser matrix | Pass: 92 bilingual capability/viewport/media/history cases plus foundation/actions, governed-card no-JavaScript/print/forced-colors and optional-map zero-activation/external-request checks |
| `pnpm secrets:check --history` | Pass: 348 current text files and reachable history; matched values redact |
| `pnpm audit:dependencies` | Pass: 650 dependencies; zero moderate/high/critical known vulnerabilities |

A single relationship row supplies both directions, with no reciprocal copies in endpoint records.
The collection and internal `cmsCareGraph` share the existing PostgreSQL transaction advisory lock
with governed-record and identity writes. Locked reads revalidate persisted endpoint and association
reviewer roles. Endpoint snapshots bind approval to exact governed content; any endpoint change
requires returning the association to draft and obtaining fresh reviews. Association expiry is
enforced at read/authoring time; no production scheduler is introduced.

The build retains bootstrap, not-found and health routes only. Runtime budget:
146077 compressed JavaScript bytes, 183162 initial compressed bytes, 15 requests,
zero external origins. No new visual direction or public component is introduced. Both inert
care specimens use the graph and escaped React text; they are outside application routes.
Handoff candidates contain doctor/service/location public IDs only and remain inert.

## Defects and retests

- Existing sandbox mount and /tmp quota limits required approved commands outside the sandbox
  and disposable /var/tmp tooling. The installed direct Chromium ran the existing browser matrix.
- Local generated Payload types initially described only old collections. Initializing the updated
  CMS regenerated the ignored types; repeat TypeScript checks and full verification passed.
- An isolation fixture table triggered Drizzle's create-versus-rename prompt in the first fresh
  cluster. The runner proved isolation first, removed its synthetic content table, then initialized
  the fresh CMS schema noninteractively. That cluster was stopped and the final fresh cluster passed.
- Concurrent update testing exposed Payload's merged stale document metadata before the explicit
  revision check. Checking the locked current revision first corrected the rejection order; repeating
  the entire fresh PostgreSQL smoke passed concurrency, rollback and all existing integration checks.

No implementation defect remains open. Hosted implementation T1 passed all steps, including clean
reconstruction, for `78aabb244a67d01b3b3330c40e423334cff9d27e` under [hosted implementation run 35133605026](https://github.com/dynamicet/hallelujah-website/actions/runs/35133605026).
The client subsequently accepted controlled development and directed closure. CARE-06, authentic affiliations, hospital clinical/operations approval,
appointment collection, providers, public routes, production and publication remain gated.

[PR #41](https://github.com/dynamicet/hallelujah-website/pull/41) retains hosted review and the final documentation head SHA/run. The documentation
head must repeat CI before merge. Implementation acceptance does not authorize production.

## Review and acceptance boundary

On 16 September 2026, Africa/Addis_Ababa, the client directed “close it”. Workspace identity
`befikadusata` accepts the synthetic local scope under the same temporary Backend/CMS,
Content/Clinical-contract and QA responsibility and controlled-development review authority.
Local T0 and hosted implementation T1 passed; documentation [run 35134533900](https://github.com/dynamicet/hallelujah-website/actions/runs/35134533900)
passed full verification and clean reconstruction for exact head
`b6e2d6bf5aafd028d0c9d03d04e258ab6906a744`. No implementation defect remains open.
This direction promotes In review → Done for controlled development. The acceptance commit
must repeat hosted CI before merge; issue #40 and PR #41 retain its matching SHA/run, merge
and exact-main result. CARE-06, authentic affiliations, hospital clinical/operations approval,
appointment collection, providers, public routes, production and publication remain gated.
