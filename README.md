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
Its identity, color, and bilingual type direction are project-approved by `B01-002`; `B01-004`
owns rendered global-foundation implementation, and binary logo/font intake remains `B02-011`.

Before container work, run `pnpm toolchain:check:containers`. It also requires Docker 29.8.0 and PostgreSQL client 18.6; a mismatch fails closed. Application development does not require containers at the current bootstrap boundary.

The default application has no CMS admin/API route, public hospital content, external application integration, or personal-data field. Payload configuration is present as the approved platform skeleton only. Later tickets must add database and CMS capabilities behind their own gates.

See [`B00-004`](docs/backlog/b00-004-clean-application-bootstrap.md) for the application boundary and
[`B00-011`](docs/backlog/b00-011-ci-quality-security.md) for the completed controlled-development CI
contract. The private/free-plan merge-enforcement limitation remains explicit under `B00-012`.

The controlled component review tool is separate from application routes. After `pnpm build`, run
`pnpm review-harness:serve` and open `http://127.0.0.1:3213`. The index covers component states,
English/unreviewed Amharic shaping and byte reporting. See the
[harness architecture](docs/architecture/component-review-harness.md) and
[`B01-013` execution brief](docs/backlog/b01-013-component-review-harness.md).

The internal canonical settings record uses the existing authenticated CMS Local API. Run `pnpm site-settings:check` for schema, safety/lifecycle negatives and bilingual inert-render consistency. The [B02-003 execution brief](docs/backlog/b02-003-canonical-site-settings.md) and [architecture](docs/architecture/canonical-site-settings.md) define its synthetic-only boundary; public contact values remain withheld pending hospital safety approval.

Controlled clinician records use that same authenticated CMS boundary. Run `pnpm clinicians:check`
for schema, medical approval, duplicate/canonical/lifecycle negatives and bilingual inert rendering.
The [B02-004 execution brief](docs/backlog/b02-004-governed-clinician-records.md) and
[architecture](docs/architecture/governed-clinician-records.md) define its synthetic-only scope.
Public clinicians, schedules, portraits and appointment actions remain withheld.

Controlled service records use the same authenticated CMS boundary. Run `pnpm services:check`
for taxonomy, claim-level clinical approval, duplicate/lifecycle negatives and bilingual inert rendering.
The [B02-005 execution brief](docs/backlog/b02-005-governed-service-records.md) and
[architecture](docs/architecture/governed-service-records.md) define its synthetic-only scope.
Authentic services, care claims, availability and publication remain withheld.

Controlled care affiliations are authored through the local `care-relationships` collection.
Run `pnpm care-relationships:check` for the independent medical/clinical/operations review contract,
bidirectional graph and inert stable-ID handoff tests. `pnpm governed-records:db-smoke` also proves
persistence, concurrent-write denial, rollback and live identity revocation. Internal consumers use
`cmsCareGraph` for transaction-consistent authenticated reads; both inert doctor/service specimens
consume the same graph. [B02-006 scope](docs/backlog/b02-006-governed-care-relationships.md) and
[evidence](docs/backlog/evidence/B02-006-governed-care-relationships-2026-09-16.md) retain the synthetic-only boundary.

Controlled discovery uses authenticated local governed records for canonical URL, metadata,
language-alternate and sitemap candidates. Run `pnpm discovery:check` for lifecycle, escaping,
dependency/cache and real loopback HTTP checks. The [execution brief](docs/backlog/b02-010-governed-discovery.md)
and [architecture](docs/architecture/governed-discovery.md) define the synthetic-only scope;
public routes and production cache wiring remain gated.

Controlled synthetic content transfer uses the existing authenticated local CMS workflow. Run
`pnpm content-transfer:check` for bundle/plan/schema negatives and
`pnpm content-transfer:db-local` for disposable PostgreSQL concurrency/rollback evidence.
The [runbook](docs/architecture/content-transfer.md) documents operator export, dry-run and import
commands. Authentic source reconciliation remains withheld; this does not authorize migration.
