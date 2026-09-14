# `B00-005` — Pinned Supported Toolchain

**Status:** Done for controlled local development; named production acceptance and full `B00-011` CI remain deferred
**Execution date:** 13 September 2026, Africa/Addis_Ababa
**Publication, provider, provisioning, and collection authority:** Not granted

## Execution contract

| Field | Controlled execution value |
| --- | --- |
| Epic / lane / priority | Epic 00 / `DELIVERY` / `P0` |
| Phase / milestone | Phase 0 / `M0`–`M1` |
| Old / new status | Proposed / unblocked → Done for controlled local development |
| Responsible owner | Client workspace identity `befikadusata` directing Codex in the temporary Delivery role |
| Acceptance owner | Same client identity at the controlled-development boundary; named Delivery and Security people return before production acceptance |
| Target environment | `T0` isolated local checkout; repository-defined `T1` toolchain workflow, with remote execution evidence deferred to `B00-011` |
| Parent / dependencies | `B00-004`, `ARCH-01`, `ARCH-04`, working `B00-016`, `DEP-002`–`DEP-005` |
| Allowed repository scope | Root runtime/package manifests, lockfile, toolchain policy/checks, minimal toolchain workflow, contributor documentation, execution board/control registers, and sanitized evidence |
| Evidence destination | [Sanitized completion record](evidence/B00-005-pinned-toolchain-2026-09-13.md); restricted evidence remains outside the repository |

The client's 13 September 2026 instruction to complete `B00-005`, following their installation and activation of Node.js 24 with `nvm`, authorizes this controlled repository scope. It does not authorize a public route, real hospital content, personal-data handling, remote environment, provider integration, migration, DNS/TLS change, or production deployment.

## Outcome and scope

Create one machine-readable source for the supported development/toolchain versions, make manifests and the lockfile agree with it, reject runtime or configuration drift, pin intended container images by immutable digest, document the compatibility and security basis, and prove a clean frozen install resolves the same graph and builds successfully.

This ticket changes no application route, CMS collection, database connection, environment secret, or deployment target. PostgreSQL and container entries are version selections only; their provisioning and operational controls remain `B00-006`–`B00-012` work.

## Selected baseline

[`toolchain-versions.json`](../../toolchain-versions.json) is the canonical machine-readable policy.

| Area | Selected version | Pin / support boundary |
| --- | --- | --- |
| Node.js | `24.21.0` | Exact `.nvmrc` and manifest engine; Active LTS through 19 October 2026, then Maintenance LTS through April 2028 |
| pnpm | `10.27.0` | Exact `packageManager` and manifest engines |
| Next.js | `16.3.5` | Exact direct dependency and matching `eslint-config-next` |
| Payload CMS | `3.89.0` | Exact `payload`, `@payloadcms/next`, and `@payloadcms/db-postgres` versions |
| TypeScript | `5.9.3` | Exact direct development dependency; current stable TypeScript 5 line selected instead of a new major |
| PostgreSQL | `18.6` | Current supported PostgreSQL 18 minor; upstream support ends 14 November 2030 |
| Docker Engine / CLI | `29.8.0` | Selected packaging baseline; the host gate rejects any other version |
| Node base image | `node:24.21.0-bookworm-slim@sha256:2fe369e969550cde8e867afc3fe370b260140cab4a23d467074295b42163d553` | Exact version, Debian family, and multi-platform index digest |
| PostgreSQL image | `postgres:18.6-bookworm@sha256:1c59e2c3c818eaa0f0628f695b36e7c9e362d6b219b36a54a32df645cbd7e1af` | Exact server minor, Debian family, and multi-platform index digest |

## Compatibility and security rationale

- Node.js 24 is an upstream Active LTS line, scheduled to enter Maintenance LTS on 20 October 2026 and remain supported through April 2028; the exact `24.21.0` release is available in the [official archive](https://nodejs.org/en/download/archive/v24). Odd Node.js 25 is EOL and is rejected.
- Next.js 16 requires Node.js `20.9+` and TypeScript `5.1+`; see the [official Next.js 16 upgrade requirements](https://nextjs.org/docs/app/guides/upgrading/version-16).
- Payload `3.89.0` supports Next.js `16.2.6+` below 17 and Node.js `20.9+`; see the [Payload installation requirements](https://payloadcms.com/docs/getting-started/installation). All three Payload direct packages remain on one exact release.
- PostgreSQL supports each major for five years and recommends the current minor. The [upstream version policy](https://www.postgresql.org/support/versioning/) lists `18.6` as the current PostgreSQL 18 minor.
- Docker `29.8.0` is the current selected patch baseline in the [official Engine 29 release notes](https://docs.docker.com/engine/release-notes/29/). Mutable image tags are insufficient, so the selected Node and PostgreSQL official-image tags also carry verified index digests.
- The first audit found transitive DOMPurify and legacy esbuild advisories. Scoped exact overrides move them to `3.4.15` and `0.25.12`; the post-change `pnpm audit --audit-level moderate` reports no known vulnerabilities. The clean build verifies compatibility of those overrides.

## Enforcement

- `pnpm toolchain:check` validates the policy schema, support/review dates, `.nvmrc`, exact engines, direct application pins, Payload parity, security overrides, lockfile entries, immutable image references, workflow pins, and active Node.js/pnpm versions.
- `pnpm toolchain:check:containers` additionally verifies the local Docker CLI, Docker Engine, and PostgreSQL client. The current host PostgreSQL `18.6` passes; Docker CLI and Engine `29.2.1` are intentionally rejected until both are upgraded to `29.8.0`. No container packaging or provisioning may claim acceptance before that gate passes.
- `pnpm verify` begins with the policy check, so ordinary lint/type/test/build execution fails on repository or active-runtime drift.
- The minimal [toolchain policy workflow](../../.github/workflows/toolchain-policy.yml) uses immutable GitHub Action SHAs, exact Node.js and pnpm versions, a frozen install, the full application verification command, the isolated rebuild verifier, and the backlog audit. Its remote run subsequently passed under `B00-011`; technical repository enforcement remains `B00-012`. Committing the workflow does not activate a third-party application integration.
- `pnpm rebuild:verify` reconstructs an isolated temporary copy without `.git`, `node_modules`, `.next`, or TypeScript build output. It verifies the full lockfile graph hash, compares the linked workspace importer graph, and repeats lint, types, tests, and production build.
- Next.js telemetry is disabled in development, build, start, clean-rebuild, and workflow commands.

## Update policy

1. Review the baseline at least monthly; `reviewDue` is enforced as a failing policy date and currently expires after 13 October 2026.
2. Review immediately for an upstream security notice, EOL/status change, incompatible peer range, lockfile integrity concern, or base-image rebuild. Critical/high findings are triaged before further dependency-bearing delivery; no affected release is promoted until patched or covered by a dated exception.
3. Apply supported patch/minor updates in a dedicated change. Update the canonical policy first, regenerate the lockfile explicitly, refresh image digests from official registries, run the full commands below, and record the result.
4. Treat Node.js, pnpm, Next.js, Payload, TypeScript, PostgreSQL, Docker, or distribution-family major changes as architecture changes. Record compatibility, migration, rollback, and security review before promotion.
5. Never hand-edit the lockfile. A normal build uses `pnpm install --frozen-lockfile`; only an intentional reviewed dependency update uses a non-frozen install.
6. Remove security overrides once the owning upstream dependency resolves to a patched version and the clean graph remains advisory-free.

## Acceptance and verification

- [x] Every required runtime, framework, database, container engine, and base image has an exact selected version.
- [x] Manifest, `.nvmrc`, policy, workflow, and lockfile drift is rejected.
- [x] Unsupported Node.js/PostgreSQL dates and an expired monthly review fail policy.
- [x] All direct application dependencies use exact versions and the lockfile retains integrity hashes.
- [x] Compatibility ranges were checked against official Node.js, Next.js, Payload, PostgreSQL, and Docker sources.
- [x] Moderate-or-higher dependency audit is clean after tested scoped overrides.
- [x] An isolated frozen install reproduces the same full lockfile and workspace importer graph, then passes the complete production build.
- [x] Current host Docker client/engine drift or inaccessibility is disclosed and fail-closed; it is not represented as accepted container capability.
- [x] The workflow definition rejects repository/runtime drift; its remote execution subsequently passed under `B00-011`.
- [x] No publication, collection, provider activation, migration, production provisioning, or release boundary changed.

## Completion

The controlled-development acceptance result and exact hashes are in the [13 September 2026 completion record](evidence/B00-005-pinned-toolchain-2026-09-13.md). `B00-006` subsequently completed, followed by the local and hosted `B00-011` CI gates. Named Delivery and Security acceptance, a passing Docker `29.8.0` host check before container work, and `B00-012` repository enforcement remain later boundaries.
