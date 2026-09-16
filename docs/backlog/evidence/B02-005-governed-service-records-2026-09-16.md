# B02-005 — Execution Evidence

**Status:** Proposed → Ready → In progress → In review → Done for controlled development; client acceptance recorded on 16 September 2026, Africa/Addis_Ababa. Final closeout CI and merge results are tracked in PR #39.
**Date/timezone:** 16 September 2026, Africa/Addis_Ababa.
**Responsible/review authority:** `befikadusata` directing Codex in temporary Backend/CMS,
Clinical-contract and QA roles; same workspace identity for controlled-development review.
**Branch:** `b02-005-governed-service-records`.
**Build basis:** scoped implementation based on main `1a6a2c8c3314794e74a142d59e68629c53ede448`;
implementation head `f74e4821bed6ee0f19fa0778e9410faabf220e96` passed exact-head hosted
[run 35128628242](https://github.com/dynamicet/hallelujah-website/actions/runs/35128628242).
[Issue #38](https://github.com/dynamicet/hallelujah-website/issues/38) and
[PR #39](https://github.com/dynamicet/hallelujah-website/pull/39) retain final closeout evidence.
**Environment:** Synthetic local T0; no authentic data, provider, collection or publication.

The [execution brief](../b02-005-governed-service-records.md) records the client-directed scope.
B02-001/B02-002 are Done. Dependency merge `1a6a2c8c3314794e74a142d59e68629c53ede448`
has passing [exact-main CI](https://github.com/dynamicet/hallelujah-website/actions/runs/35123369970).

## Method and results

Pinned Node.js 24.21.0/pnpm 10.27.0; installed PostgreSQL 18.6; direct installed Chromium
152.0.7977.64; loopback-only application/harness and fresh Unix-socket PostgreSQL cluster
`/var/tmp/hallelujah-b02-001-pg.gcbUTziV`, port 55485, with empty listen_addresses.
The cluster was shut down after all assertions. No shared database, authentic identity,
hospital content, remote provider or restricted evidence was used.

| Check / expected behavior | Actual / result |
| --- | --- |
| `pnpm services:check` | Pass: required service/group/claim schema, explicit omissions, clinical claim stamping, author/self/wrong-role negatives, stale evidence/content, future scheduling, duplicate/copy/group/location conflicts, canonical grouped vocabulary, default/public denial, bilingual omissions, escaped inert rendering and retirement |
| `pnpm governed-records:check`, `pnpm cms-workflow:check`, `pnpm typecheck` | Pass: existing governance/workflow negatives and types; generic fixtures use location/page kinds while the service-specific suite owns claim-level controls |
| `pnpm governed-records:db-smoke` | Pass: authenticated PostgreSQL persistence and synthetic workflow; duplicate/copy/immutable service denials, author-supplied approval rejection, persisted clinical stamping, wrong/revoked-role rejection, unchanged publication, grouped vocabulary, successor retirement and preserved identity/audit; existing concurrency/timed/settings/clinician negatives also pass |
| `pnpm local-db-isolation:check` | Pass: content and appointment roles each deny cross-database reads/writes; no network listener |
| `pnpm verify` | Pass: toolchain, format, CI policy/6 fail-closed mutations, links, secrets, backlog 10/10, brand/introduction gates, lint, types, tests, build, semantic accessibility, byte budgets, runtime and all shared browser checks |
| Browser verification | Pass: 92 bilingual language/capability/viewport and media/history cases, shared interactions, foundation/action responsive/reflow/keyboard checks, governed-card no-JavaScript/print/forced-colors matrix and optional-map zero-activation/external-request assertions |
| `pnpm secrets:check --history` | Pass: 340 current text files and reachable Git history; matched values redact |
| `pnpm audit:dependencies` | Pass: 650 dependencies; zero moderate/high/critical known vulnerabilities |
| `pnpm format:check`, `pnpm links:check`, `git diff --check` after documentation updates | Pass: 340 text files, 1094 repository links and no whitespace error |

The build retains only bootstrap, not-found and health routes. Initial runtime: 146077 compressed
JavaScript bytes, 183160 total initial compressed bytes, 15 requests and zero external origins.
The new service specimen is inert React static semantic rendering: no form, link, script, image,
button, fetching or motion. Missing optional claims/languages omit; withheld high-consequence text
never renders and script-like text escapes. Shared browser checks validate existing interactive UI.

Copy detection compares exact text normalized by Unicode NFKC, case and whitespace. It does not
certify semantic similarity, spelling, clinical correctness or language approval. No new benchmark
application changes: the approved governed-card layout remains unchanged and the new specimen
adds no visual or interaction direction. Public lifecycle/HTTP/search integration remains B02-010;
bidirectional relationship mutation B02-006; asset intake B02-011.

## Defects and retests

- The sandbox mount helper and zsh heredoc temporary storage hit existing quota limits. Approved
  inline commands outside the sandbox allowed scoped edits. The first full verification hit /tmp
  copyfile quota in CI-control negatives; rerunning with TMPDIR=/var/tmp passed.
- The first fresh database smoke found a generic-fixture expectation still matching “clinical role”
  after that fixture moved to the page/content domain. Correcting the expected domain and repeating
  on a fresh cluster passed the complete smoke and cross-role denials.
- Snap Chromium denied /var/tmp profile SingletonLock creation. A minimal launch reproduced the
  denial. Selecting the already installed direct Chromium executable through a disposable PATH
  entry made the full browser suite pass; no repository harness guard or assertion changed.

No open local implementation defect remains. Required checks and publication gates were preserved.

## Review and acceptance boundary

On 16 September 2026, Africa/Addis_Ababa, the client directed “B02-005 PR is In Review, close out”.
Workspace identity `befikadusata` accepts the synthetic local scope under the same temporary
Backend/CMS, Clinical-contract and QA responsibility and controlled-development review authority.
Local T0 and hosted implementation [run 35128628242](https://github.com/dynamicet/hallelujah-website/actions/runs/35128628242)
passed full verification and clean reconstruction for exact head
`f74e4821bed6ee0f19fa0778e9410faabf220e96`. No implementation defect remains open.
This direction promotes In review → Done for controlled development. The acceptance-documentation
head must repeat hosted CI before merge; issue #38 and PR #39 retain the matching SHA/run,
merge and exact-main result. CARE-04/CARE-05, authentic taxonomy/services and claims,
hospital clinical/operations approval, public routes, collection, providers, production and
publication remain gated.
