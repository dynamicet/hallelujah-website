# Hallelujah Hospital Website

This repository contains the clean, controlled implementation workspace for the hospital website. The application is not approved for publication, personal-data collection, provider activation, production provisioning, migration, or DNS cutover.

## Repository layout

| Path | Purpose | Authority |
| --- | --- | --- |
| `apps/web/` | Minimal Next.js, Payload CMS, and TypeScript production skeleton | Delivery implementation; currently local bootstrap only |
| `docs/` | Requirements, decisions, UX, design, backlog, validation, and handoff contracts | Project authority; application code must not import it at runtime |
| `.github/` | Pull-request CI plus contribution issue and review templates | `B00-011` CI passes locally and hosted; technical branch enforcement remains `B00-012` |

## Local commands

Prerequisites: Node.js 24.21.0 LTS and pnpm 10.27.0. The canonical [`toolchain-versions.json`](toolchain-versions.json), `.nvmrc`, package manifests, lockfile, and automated policy check pin and enforce the tested baseline. See [`B00-005`](docs/backlog/b00-005-pinned-toolchain.md) for compatibility, support, security, container-image, and update policy.

```sh
pnpm install --frozen-lockfile
pnpm --dir apps/web config:check
pnpm dev
```

The local bootstrap surface is available at `http://localhost:3000`; its health endpoint is `http://localhost:3000/health`.
Configure an ignored `apps/web/.env.local` from the names-only example before starting the
application. Environment-scoped credentials, disabled data/provider gates, and operational
handling are defined in the [environment and secrets runbook](docs/architecture/environment-and-secrets.md).

Run all current checks with:

```sh
pnpm verify
pnpm rebuild:verify
pnpm audit:dependencies
pnpm secrets:check --history
```

The canonical production design-token source is
`apps/web/src/design-system/tokens/tokens.json`. Use `pnpm tokens:generate` after an authorized
source change and `pnpm tokens:check` to prove generated CSS/TypeScript parity and policy checks.
Its current values remain provisional pending `B01-002` brand and language approval.

Before container work, run `pnpm toolchain:check:containers`. It also requires Docker 29.8.0 and PostgreSQL client 18.6; a mismatch fails closed. Application development does not require containers at the current bootstrap boundary.

The default application has no CMS admin/API route, public hospital content, external application integration, or personal-data field. Payload configuration is present as the approved platform skeleton only. Later tickets must add database and CMS capabilities behind their own gates.

See [`B00-004`](docs/backlog/b00-004-clean-application-bootstrap.md) for the application boundary and
[`B00-011`](docs/backlog/b00-011-ci-quality-security.md) for the completed controlled-development CI
contract. The private/free-plan merge-enforcement limitation remains explicit under `B00-012`.
