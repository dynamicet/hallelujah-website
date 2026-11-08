# B04-011 Controlled Service Directory Evidence — 1 October 2026

> Evidence availability (8 November 2026): some historical captures referenced below are absent from this checkout. Their filenames are retained as archive references, not current verification evidence. Rerun the documented checks for fresh evidence.

| Field | Result |
| --- | --- |
| Branch | `b04-011-controlled-service-directory` |
| Scope | Synthetic English loopback T0/private T1 composition only |
| Status | Done for controlled development; client accepted 5 October 2026; dependency remediation verified locally |
| Tracking | [issue #85](https://github.com/dynamicet/hallelujah-website/issues/85) and [pull request #86](https://github.com/dynamicet/hallelujah-website/pull/86) |
| Public route | Absent; no `/services/` route is authorized |
| Production/publication authority | Not granted |

## Boundary

This evidence covers only the synthetic English, loopback-only/noindex B04-011 composition. It is
not evidence of an authentic service taxonomy, clinical or operations review, hospital capability,
urgent-care wording, staffed contact, appointment activation, translation approval, production
readiness or publication authority.

## Implemented result

- One controlled directory query composes the existing governed service projection without changing
  its authentic-data default deny.
- The server-rendered S1–S7 template covers bounded GET search, one fictional taxonomy, group
  filtering, count, pagination, exact fictional urgent-term placement and truthful recovery.
- A controlled record contains a withheld high-consequence claim; the record's approved synthetic
  scope may render while the withheld wording remains absent. Retired records are excluded.
- No public `/services/` route, API, provider, personal-data field, callable contact, service-detail
  action, recommendation or appointment link exists.

## Verification status

| Check | Current result |
| --- | --- |
| `pnpm service-directory:check` | Pass: 22 projection, query, SSR, safety, isolation, escaping, lifecycle and header cases |
| `pnpm service-directory:smoke` | Pass: 173 responsive, capability, safety, isolation and GET-state browser cases |
| Search and filter behavior | Pass: bounded literal search over fictional names/synonyms, allowlisted repeated groups, deterministic counts/order and shareable pagination |
| Safety and recovery | Pass: exact fictional urgent-term placement plus loading, no-match, failure, offline and empty-approved-set states; unavailable states render no stale cards |
| Governed-record boundary | Pass: one controlled withheld claim and one withdrawn record remain absent from cards, counts and result groups |
| No-JavaScript and accessibility | Pass: native GET submission, logical S1–S7 source order, one H1/main, skip-link focus, 44 CSS px targets and named controls |
| Responsive/capability matrix | Pass at 320/360/768/1440 CSS px, 375 px small phone, 667×375 landscape, 200% text, forced colors, print, reduced motion, no CSS and no JavaScript |
| Isolation | Pass: GET/HEAD loopback server, no-store/noindex, restrictive CSP/referrer policy, zero external requests and no deployable `/services/` route |
| `pnpm services:check`, `pnpm search-controls:check` | Pass |
| Format, links, backlog, lint, typecheck and `git diff --check` | Pass |
| `pnpm verify` | Pass: complete configured repository gate, optimized build and all rendered matrices |
| `pnpm rebuild:verify` | Pass from a fresh temporary copy and frozen lockfile; lockfile graph `c3b5bb34419974d6475a3baa65d47bfd690976172d45bec737b4d43c86a28a01`, importer graph `2fb83f002b80a6efbc16ef014310132a2aeef1342849797942a0d583d7e315b0` |
| `pnpm audit:dependencies` | Pass: 650 dependencies; zero moderate, high or critical known vulnerabilities |
| `pnpm secrets:check --history` | Pass: 579 current text files plus reachable Git history; matches would be redacted |
| Hosted exact-head T1 | Pass: [run 36859060799](https://github.com/dynamicet/hallelujah-website/actions/runs/36859060799) completed every gate, including the live audit and clean reconstruction, for implementation head `1351461c43d457e165a83f5935f298179d9865f3` under [PR #86](https://github.com/dynamicet/hallelujah-website/pull/86) |

## Sanitized visual review

| Specimen | Result |
| --- | --- |
| 360 px initial directory (unavailable archive: `b04-011-artifacts/service-directory-360.png`) | Pass: synthetic boundary, GET controls, groups, result cards and recovery boundary remain legible without clipping; 106,142 bytes; SHA-256 `fa5b531bd2ca0db7ddca341f242605b57dc348732f49cd8f4eab0ea6d9a024c0` |
| 1280 px urgent boundary (unavailable archive: `b04-011-artifacts/service-directory-urgent-1280.png`) | Pass: static fictional priority guidance precedes controls and does not expose a callable emergency action; 155,006 bytes; SHA-256 `6b1c190cc056b45eec5b73616029a656b41852c43400825d75182a0d485fb035` |

The UI/UX review used the repository design tokens, existing shell and search primitives, then
checked compact targets, wrapping, source order and responsive behavior against the controlled
page specification. No visual defect remains open in the two sanitized specimens.

## Defects and execution notes

An implementation-time TypeScript narrowing error in the new directory contract was corrected
before the focused and full suites passed. It did not survive into the recorded evidence. The
first command used system Node.js 25.2.1 and stopped at the repository engine guard before tests;
all recorded results use the required Node.js 24.21.0 and pnpm 10.27.0. The first loopback browser
attempt was denied by the sandbox before the preview bound; the identical scoped command passed
after loopback execution was authorized.

## Local review result

On 1 October 2026, Africa/Addis_Ababa, B04-011 moves In progress → **In review** after every
focused, predecessor, full-repository, clean-reconstruction, dependency, reachable-history secret,
diff-integrity and sanitized visual-review gate above passed. Private hosted implementation T1
then passed every gate in
[run 36859060799](https://github.com/dynamicet/hallelujah-website/actions/runs/36859060799)
for exact implementation head `1351461c43d457e165a83f5935f298179d9865f3` under
[PR #86](https://github.com/dynamicet/hallelujah-website/pull/86). Explicit client controlled
acceptance remains required before Done.

Human assistive-technology, authentic taxonomy/content, language, clinical/operations,
production and publication acceptance remain open under `DEL-01` and the applicable CARE/SEARCH/
LANG gates. Automated controlled verification closes none of those dependencies.

## Remaining gates

B04-004, B04-005, CARE-04, CARE-05, SEARCH-01, LANG-01 and DEL-01 remain unresolved. Authentic
taxonomy, services, claims, urgent wording, staffed contacts, public routes, providers, production
and publication remain gated.


## Controlled acceptance — 5 October 2026

The client directed “close out b04-011” on 5 October 2026, Africa/Addis_Ababa, accepting
the controlled-development result under `befikadusata` as responsible and controlled
acceptance person directing Codex in the same temporary roles. B04-011 moves In review →
**Done** for controlled development. No scoped defect remains open.

Hosted review-documentation
[run 36861289193](https://github.com/dynamicet/hallelujah-website/actions/runs/36861289193)
passed for exact head `9c406a940441cf5df932dff8042fa8dd7af1f42b`. Final acceptance-documentation
CI must pass before checked merge of PR #86. Exact-head, merge and exact-main evidence will
be retained in issue #85 and PR #86 before explicit issue closure. B04-012 remains unpromoted
until its own readiness assessment; all remaining gates above stay open.


Final acceptance-documentation
[run 37312102957](https://github.com/dynamicet/hallelujah-website/actions/runs/37312102957)
failed the live dependency audit for exact acceptance head
`75f49b0c3af884ecc1734056ade9a8df016f6f6e`. The registry reports high-severity
[`GHSA-vfj7-8cjw-p6xm`](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm) in
`braces@3.0.3`, reached through `eslint-config-next` → `@next/eslint-plugin-next` →
`fast-glob` → `micromatch`. On 5 October 2026 the registry's latest `braces` is `3.0.3`,
the advisory lists no patched release, and latest `@next/eslint-plugin-next@16.3.8`
still depends on `fast-glob@3.3.1`. No compatible upstream version fix was available
in these checks. The audit gate remains enforced. PR #86 stays open and unmerged,
issue #85 stays open, and exact-main closeout is blocked pending dependency remediation
and a new passing exact-head run. Controlled implementation acceptance remains recorded;
B04-012 and all production/publication gates remain unpromoted.


## Dependency remediation — 5 October 2026

The client directed “fix the vulnrability”. The scoped override
`@next/eslint-plugin-next>fast-glob` now resolves to `tinyglobby@0.2.17`. A pinned
[pnpm compatibility patch](../../../patches/@next__eslint-plugin-next@16.3.8.patch)
disables implicit directory expansion and preserves absolute and root paths and
trailing-slash behavior for the plugin's root-directory discovery. `sass@1.105.1`
replaces the optional older Sass graph, removing its `chokidar@3` dependency on
`braces`. The frozen lockfile contains no `braces`, `micromatch` or `fast-glob` package.
The overrides are enforced by the toolchain policy. No advisory suppression or
security-gate exception is introduced.

`pnpm lint-glob:check`, now included in `pnpm verify`, exercises the installed patched
Next.js plugin for literal, wildcard, brace, array, Windows-separator, absolute, root,
missing and file paths. It also proves the actual internal-link ESLint rule still
reports an invalid anchor, checks Sass compilation and asserts exclusion of the
vulnerable package graph. The focused regression check passes. The live dependency
audit passes with 644 dependencies and zero moderate, high or critical findings.
Full verification, frozen clean reconstruction and exact-head hosted CI remain
required before merge.


## Remediation verification result — 5 October 2026

The independent frozen clean reconstruction passed the complete `pnpm verify` suite,
including the installed-plugin compatibility regression, lint, types, application
contracts, optimized build, accessibility, budgets, runtime and all rendered matrices,
including the 173-case service-directory matrix. Lockfile graph SHA-256:
`8056d55de822a1e38f68ac909a2c199f798cd86b849f29151a5e3c2949ed33c8`; workspace importer
graph SHA-256: `2fb83f002b80a6efbc16ef014310132a2aeef1342849797942a0d583d7e315b0`.
The live audit passes with zero moderate, high or critical findings. Reachable-history
secret scanning and documentation/diff integrity checks pass.

The initial local attempt lacked the pinned Python asset processors; a temporary
environment with the repository's exact FontTools/Brotli requirements supplied them
for the successful complete clean run. No test or security gate was skipped.

The recorded vulnerability blocker is remediated. Final acceptance-documentation
hosted CI must pass before checked merge; exact-head, merge and exact-main results
are retained in [issue #85](https://github.com/dynamicet/hallelujah-website/issues/85)
and [PR #86](https://github.com/dynamicet/hallelujah-website/pull/86). Explicit issue
closure follows passing exact-main CI. B04-012 and the remaining gates stay unpromoted.
