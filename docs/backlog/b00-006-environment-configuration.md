# `B00-006` — Environment Configuration and Secrets Boundaries

**Status:** Done for controlled local development; named production acceptance remains deferred

**Execution date:** 13 September 2026, Africa/Addis_Ababa

**Publication, production provisioning, provider, and personal-data authority:** Not granted

## Execution contract

| Field | Controlled execution value |
| --- | --- |
| Epic / lane / priority | Epic 00 / `DELIVERY` / `P0` |
| Phase / milestone | Phase 0 / `M0`–`M1` |
| Old / new status | Proposed / unblocked → In progress → Done for controlled local development |
| Responsible owner | Client workspace identity `befikadusata` directing Codex in the temporary DevOps role |
| Acceptance owner | Same client identity at the controlled-development boundary; named DevOps and Security people return before production acceptance |
| Target environment | `T0` isolated local validation; configuration contracts only for future `T2` staging/acceptance and `T4` production |
| Requirements / decisions | `S-002`, `S-003`; `ARCH-03`; deferred `SEC-02` and `DEL-01` remain open at their stated boundaries |
| Parent / dependencies | `B00-004`; `DEP-002`; working `B00-015` and `B00-016` development baselines |
| Allowed repository scope | Server environment schema/startup hook, Payload credential access, names-only example, configuration tests/scripts, contributor/runbook documentation, execution board/control registers, and sanitized evidence |
| Benchmark applications | None — this ticket implements a server configuration boundary, not a page, flow, content pattern, or visual behavior |
| Evidence destination | [Sanitized completion record](evidence/B00-006-environment-configuration-2026-09-13.md); restricted evidence and all real credentials remain outside the repository |

The client's instruction to start the next execution on 13 September 2026 authorizes this
controlled-development scope and temporary assignment. It does not authorize a real staging or
production environment, provider integration, database provisioning, legacy configuration import,
personal data, public route, DNS/TLS change, deployment, or publication.

## Outcome

Define one fail-closed, server-only configuration boundary for local, staging/acceptance, and
production. The selected environment may load only its own named credential scope; the runtime
must reject missing, malformed, cross-environment, or gate-enabling values without exposing their
contents. Document provider-neutral supply, rotation, recovery, and emergency-access controls.

## Scope and exclusions

Included:

- `APP_ENVIRONMENT` selection for `local`, `staging`, and `production`;
- separate `LOCAL_*`, `STAGING_*`, and `PRODUCTION_*` database/Payload credential names;
- environment-matched public-content database naming and Payload-secret minimum length;
- mandatory disabled states for personal-data collection and external services;
- centralized server validation used by Payload, a Next.js server-start hook, and an explicit
  non-connecting preflight command;
- names-only committed inventory, negative/redaction tests, contributor instructions, and a
  provider-neutral secrets/rotation/emergency-access runbook.

Excluded:

- real credentials, secret-store/provider selection, actual staging/production values, accounts,
  roles, database connections, schemas, migrations, backups, deployment, or provisioning;
- legacy WordPress configuration or credentials;
- appointment data, real personal data, CMS routes/collections, and any collection capability;
- analytics, email, storage, monitoring, maps, fonts/media, or any external-provider request;
- production TLS/cookies, identity-provider design, access-system activation, and production
  acceptance evidence, which remain in their controlling tickets.

## Source contract

1. [Execution board](execution-board.md#current-execution-verdict)
2. [Working implementation acceptance matrix](../validation/implementation-acceptance-matrix.md)
3. [Epic 0 `ARCH-03` baseline](../architecture/epic-0-technical-foundation.md#approved-baseline)
4. [`B00-006` backlog outcome](epic-00-governance-foundation.md#backlog)
5. [Project dependency and risk registers](b00-003-project-control-registers.md)
6. [Environment and secrets runbook](../architecture/environment-and-secrets.md)

## Acceptance criteria

1. **Given** each supported environment, **when** only its required credential pair and disabled
   gates are supplied, **then** validation succeeds without a connection or secret-bearing output.
2. **Given** missing or unknown environment identity, selected credentials, or disabled-gate
   declarations, **when** preflight/startup or Payload configuration loads, **then** it fails before
   serving dependent capability and reports only variable names and requirements.
3. **Given** any credential variable from a non-selected environment, **when** local, staging, or
   production is selected, **then** validation fails and does not expose either credential value.
4. **Given** a database URL for another environment, wrong protocol, or absent credentials, **when**
   validated, **then** it is rejected without logging the URL or parsed components.
5. **Given** an attempt to enable personal-data collection or external services, **when** validated,
   **then** it fails closed; schema presence is not treated as activation authority.
6. **Given** the committed example and source scan, **when** tested, **then** the example contains
   exactly the controlled names with blank assignments, no `NEXT_PUBLIC_*` configuration exists,
   and application environment access remains centralized.
7. **Given** rotation or emergency recovery, **when** an operator follows the runbook, **then**
   environment separation, least privilege, approval, expiry, revocation, safe rollback, and
   restricted/sanitized evidence boundaries are explicit without storing a credential.
8. **Given** a production-mode build without runtime credentials, **when** the artifact builds,
   **then** no real secret is required or baked into it; serving later remains runtime-gated.

## Verification plan

| Method | Exact command/session | Expected result |
| --- | --- | --- |
| Schema and negative cases | `pnpm test` | Valid local/staging/production, missing, cross-scope, database mismatch, disabled-gate, minimum-secret, redaction, and startup-hook cases pass |
| Actual missing configuration | `pnpm --dir apps/web config:check` with no `.env.local` or injected values | Fails closed with names/requirements only |
| Actual synthetic local configuration | Same command and `pnpm dev` with controlled synthetic local process values | Preflight passes; collection and providers remain disabled |
| Static quality | `pnpm lint` and `pnpm typecheck` | Zero errors/warnings |
| Production build | `pnpm build` | Secret-free production build succeeds |
| Local runtime smoke | Controlled `pnpm dev --hostname 127.0.0.1`; local `GET /health` | Server becomes ready and returns non-sensitive HTTP 200 response |
| Full application gate | `pnpm verify` | Toolchain, lint, types, tests, and build pass |
| Clean reconstruction | `pnpm rebuild:verify` | Frozen graph identity and full verification pass in isolated copy |
| Backlog integrity | `node docs/backlog/audit-backlog.mjs` | All structural and local-link assertions pass |

## Completion boundary

- [x] Exact local/staging/production names and environment separation are enforced.
- [x] Missing, malformed, mismatched, cross-scope, or capability-enabling configuration fails closed.
- [x] Errors and successful preflight output contain no credential values.
- [x] `dev`, `start`, Next.js server initialization, and Payload configuration use the boundary.
- [x] The example contains names only and server configuration is never browser-exposed.
- [x] Rotation, rollback, and emergency access are documented without selecting a provider or
  storing restricted material.
- [x] No database was contacted or provisioned; no provider, collection, or production authority changed.
- [x] Controlled checks and sanitized completion evidence pass.

Named DevOps and Security people must accept the actual staging/production delivery mechanism,
permissions, secret store, access system, and executed production evidence before this ticket can
be represented as production-accepted.
