# `B00-005` Pinned Toolchain Completion Record — 13 September 2026

**Classification:** Sanitized, non-sensitive controlled-development evidence
**Execution window:** Completed 13 September 2026 at 23:18 Africa/Addis_Ababa (`UTC+03:00`)
**Responsible:** Client workspace identity `befikadusata` directing Codex in the temporary Delivery role
**Acceptance:** Same client identity at the controlled-development boundary; named Delivery and Security acceptance remains required before production

## Artifact and boundary

- Preparation baseline: commit `012e823` (`chore: pin supported Node 24 runtime`).
- Implementation artifact: the commit containing this record, prepared from the controlled working tree based on `012e823`.
- Target: controlled `T0` local development and a repository-defined `T1` policy workflow.
- Canonical policy: [`toolchain-versions.json`](../../../toolchain-versions.json), SHA-256 `2c3690f9f2987366004ea23c7e5e52c0152daba64776e9c6fb2a17d0b0ca52dd`.
- Frozen graph: [`pnpm-lock.yaml`](../../../pnpm-lock.yaml), SHA-256 `02377eceb46d753972dd52453b007b992626e54d443995a2044e7ce4406f784f`.
- No public route, CMS collection, database connection, real secret/data, provider activation, migration, remote provisioning, DNS/TLS change, deployment, or publication was introduced.

## Executed evidence

| Check | Exact command / method | Actual result |
| --- | --- | --- |
| Active runtime | Node.js and pnpm under installed `nvm` Node `24.21.0` | Passed: Node.js `24.21.0`, pnpm `10.27.0` |
| Static/runtime drift | `pnpm toolchain:check` | Passed: policy, manifests, lockfile, workflow, Node.js, and pnpm agree |
| Application verification | `pnpm verify` | Passed: policy, ESLint, TypeScript, boundary test, and Next.js `16.3.5` production build |
| Dependency security | `pnpm audit --audit-level moderate` | Passed: no known vulnerabilities found |
| Image provenance | Read-only `docker buildx imagetools inspect` of the exact official Node/PostgreSQL tags | Passed: selected multi-platform index digests match the policy |
| Frozen reconstruction | `pnpm rebuild:verify` | Passed in an isolated temporary copy: 543 packages, zero downloads on final retest, full lockfile graph hash match, importer graph hash match, and repeated `pnpm verify` success |
| Full graph identity | Rebuild verifier | Lockfile SHA-256 `02377eceb46d753972dd52453b007b992626e54d443995a2044e7ce4406f784f` |
| Workspace importer identity | Rebuild verifier | Importer graph SHA-256 `05665f37f00b97a0173a35343b11f77ec7f61b092ee0e82903c5aa9a6b3ff1d0` |
| Container host gate | `pnpm toolchain:check:containers` | Correctly failed closed: PostgreSQL client `18.6` matched; Docker CLI and Engine `29.2.1` did not match selected `29.8.0` |
| Backlog integrity before promotion | `node docs/backlog/audit-backlog.mjs` | Passed 10/10 before documentation promotion; rerun after this record and board updates |

The initial isolated-rebuild verifier attempts exposed an output-buffer problem caused by recursively duplicating the dependency tree. The final verifier uses the full frozen lockfile hash for transitive identity and a bounded depth-zero workspace importer comparison; the temporary copies from every attempt were removed in `finally` cleanup.

## Security disposition

The pre-change advisory query reported five transitive findings: three moderate and two low. Exact scoped overrides moved DOMPurify to `3.4.15` and the legacy `@esbuild-kit/core-utils` child to esbuild `0.25.12`. The application and clean-copy builds passed after the change, and the post-change moderate-threshold audit returned no known vulnerabilities.

Next.js telemetry is disabled in all repository commands and the policy workflow. Registry requests made to install/audit development packages and inspect official image metadata do not authorize any application runtime third party; the built application retains the `B00-014` default-deny boundary.

## Honest residual gates

- Upgrade the local Docker CLI/Engine to selected `29.8.0` and pass `pnpm toolchain:check:containers` before container packaging, Compose, or provisioning work is accepted.
- Execute the committed toolchain workflow remotely and make it a required check under `B00-011`; this local record does not claim a GitHub-hosted run.
- Replace temporary roles with named authorized Delivery and Security people before production acceptance.
- Re-review the machine-readable baseline no later than 13 October 2026 and immediately on any security/EOL/compatibility trigger.

## Promotion record

| Field | Value |
| --- | --- |
| Ticket | `B00-005` |
| Old / new status | Proposed / unblocked → Done for controlled local development |
| Responsible / acceptance | Temporary client workspace identity / same identity at controlled-development boundary |
| Date / timezone | 13 September 2026 / Africa/Addis_Ababa (`UTC+03:00`) |
| Dependency evidence | `B00-004`, `DEP-003`–`DEP-005`, working `B00-016`, deferred `B00-014`/`B00-015` development baselines |
| Target | `T0`; repository-defined `T1` workflow, remote execution deferred |
| Next unlock | `B00-006` execution-brief extraction and temporary authority |

This is technical completion evidence for controlled development. It is not hospital approval, production readiness, publication approval, provider approval, or authority to collect personal data.
