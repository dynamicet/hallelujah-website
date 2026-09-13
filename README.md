# Hallelujah Hospital Website

This repository contains the clean, controlled implementation workspace for the hospital website. The application is not approved for publication, personal-data collection, provider activation, production provisioning, migration, or DNS cutover.

## Repository layout

| Path | Purpose | Authority |
| --- | --- | --- |
| `apps/web/` | Minimal Next.js, Payload CMS, and TypeScript production skeleton | Delivery implementation; currently local bootstrap only |
| `docs/` | Requirements, decisions, UX, design, backlog, validation, and handoff contracts | Project authority; application code must not import it at runtime |
| `.github/` | Contribution issue and pull-request templates | Delivery workflow support; branch protection remains later work |

## Local commands

Prerequisites: Node.js 20.9 or later (below 26) and pnpm 10. The exact supported toolchain and update policy are finalized by `B00-005`.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

The local bootstrap surface is available at `http://localhost:3000`; its health endpoint is `http://localhost:3000/health`.

Run all current checks with:

```sh
pnpm verify
node docs/backlog/audit-backlog.mjs
```

The default application has no CMS admin/API route, public hospital content, external application integration, or personal-data field. Payload configuration is present as the approved platform skeleton only. Later tickets must add database and CMS capabilities behind their own gates.

See [`B00-004`](docs/backlog/b00-004-clean-application-bootstrap.md) for the complete boundary and acceptance contract.
