# Epic 0 — Initial Production Architecture

**Status:** Approved as the implementation-planning baseline  
**Decision date:** 12 September 2026, Africa/Addis_Ababa  
**Production/publication status:** Not approved

## Decision authority and boundary

The client approved this initial technical direction in the project workspace session after reviewing the available architecture options. Until personal names are supplied, the accountable technical owner is **TBD — External Project / Delivery Lead**, with business constraints and acceptance routed through **TBD — Hospital Project Owner / Focal Person**.

This approval unblocks Epic 0 backlog planning and technical implementation against non-production or controlled environments. It does not close `SEC-01`, `SEC-02`, `APPT-03`, `APPT-04`, or `DEL-01`; approve personal-data collection; verify the compromised source; approve a third party; or authorize public release. Replace the temporary role names with the authorized people's names and an organizational evidence reference before release approval.

## Approved baseline

| ID | Area | Approved direction | Required boundary or follow-up |
| --- | --- | --- | --- |
| `ARCH-01` | Application platform | Payload CMS with Next.js and TypeScript. Build the public frontend from the approved design-system, page, accessibility, and progressive-enhancement contracts. | Pin exact supported versions during implementation. Frontend quality remains an implementation and QA responsibility; the CMS choice does not itself prove UI quality. |
| `ARCH-02` | Content and appointment storage | PostgreSQL. Payload public-content records and appointment-request records use separate logical databases, database users, credentials, and access rules. Both databases initially run on the **same VPS** to control cost. | Do not expose appointment records through the public-content role or general CMS-editor permissions. Complete the appointment data flow, field minimization, retention/deletion, encryption, backup/restore, audit-access, incident, and recovery decisions under `APPT-02`–`APPT-04` and the security gates before collecting personal data. Same-host logical separation is not physical isolation and must be reviewed as demand and risk grow. Media/object storage remains to be selected. |
| `ARCH-03` | Repository, hosting, and environments | GitHub is the source repository. Use VPS hosting capable of running the selected Node.js application and supporting services. Maintain local development, staging/acceptance, and production as distinct environments. | Do not copy production personal data or production secrets into staging. Select the VPS provider/location, staging placement, resource sizing, DNS, TLS, backup destination, recovery targets, and environment-specific secrets during Epic 0. Ordinary shared hosting is not the baseline. |
| `ARCH-04` | CI, packaging, and deployment | GitHub Actions provides automated CI. Docker is the intended packaging baseline. Production deployment is manually initiated and approval-controlled at first; automated CD may be adopted after development acceptance and a proven rollback process. | CI must at least build, lint, type-check, test, scan dependencies/secrets, validate migrations, and retain non-sensitive evidence. Confirm the production Docker/deployment design at implementation acceptance; define migration, backup, rollback, and failed-deployment recovery before first release. |
| `ARCH-05` | APIs and third parties | Use a first-party-minimum launch. Do not enable optional analytics, chat, replay, embedded maps, pixels, remote autocomplete, remote fonts/media, or other optional integrations by default. | Payload-generated or project-owned server APIs still require authorization, validation, rate limiting, and data-minimization controls. Every later external provider requires `SEC-02` review and feature-specific approval. Essential journeys must work when optional services are absent or fail. |
| `ARCH-06` | Observability | Use privacy-conscious uptime, application/server error, security-event, performance, and resource monitoring. | Select tools and retention rules during Epic 0. Logs and telemetry must not contain appointment content, patient notes, credentials, consent values, secrets, or other sensitive form values. Any external monitoring provider requires `SEC-02`. |
| `ARCH-07` | Acceptance evidence | Use split evidence storage. Keep sanitized automated results and non-sensitive technical evidence in the private GitHub project; keep sensitive security/privacy reports, signed approvals, incident records, and restricted operational evidence in access-controlled storage. | Select the restricted repository and its owner, access, retention, backup, and link policy under `DEL-01`. Backlog tickets link to evidence but must not copy sensitive evidence into public issues, logs, build artifacts, or source files. |

## Epic 0 backlog outcomes

Epic 0 must turn the approved direction into tested, reviewable infrastructure:

1. Create and pin the Payload, Next.js, TypeScript, Node.js, PostgreSQL, package-manager, and Docker baseline.
2. Define Payload collections, localization, roles, editorial workflow, review dates, and publication/withdrawal behavior.
3. Create separate CMS and appointment databases, users, credentials, network permissions, migrations, backups, restore tests, and monitoring on the initial VPS.
4. Establish local, staging/acceptance, and production configuration with separate secrets and data boundaries.
5. Add GitHub branch protection and Actions checks for build, lint, types, unit/integration/accessibility tests, dependency and secret scanning, migration safety, and evidence retention.
6. Document manual production approval, deployment, health verification, rollback, database recovery, and incident procedures; reassess automated CD after development acceptance.
7. Implement the first-party-minimum network policy and maintain a default-deny third-party register.
8. Select privacy-conscious monitoring and the restricted evidence repository, then document owners, access, retention, redaction, backup, and recovery.
9. Apply the accepted working [`DEL-01` implementation acceptance matrix](../validation/implementation-acceptance-matrix.md), then close its named production-authority/inventory/evidence fields and the applicable security, privacy, appointment, content, and release gates per delivery slice.

## Choices intentionally left open

The following are implementation selections, not permission to abandon the approved boundaries:

- VPS provider, region/data location, operating system, capacity, and staging placement;
- media/object storage, email delivery, backup destination, and recovery targets;
- monitoring products and retention periods;
- restricted evidence-storage product and access administrator;
- whether CD is adopted after development acceptance;
- when appointment storage should move to a physically separate host or managed database.

Each selection needs an owner, rationale, cost/security/privacy assessment where applicable, test evidence, and rollback or migration path in its Epic 0 ticket.

`B00-005` closed the controlled-development software-version selection on 13 September 2026. The exact Node.js, pnpm, Next.js, Payload, TypeScript, PostgreSQL, Docker, and base-image pins, support dates, security overrides, enforcement, and update policy are recorded in the [pinned toolchain brief](../backlog/b00-005-pinned-toolchain.md). Named production acceptance, a conforming Docker host, remote required-check evidence, and all provider/environment decisions remain open under their own tickets.

`B00-006` closed the controlled-development environment-contract implementation on 13 September
2026. Its [execution brief](../backlog/b00-006-environment-configuration.md) and
[environment/secrets runbook](environment-and-secrets.md) define distinct local, staging, and
production credential scopes, redacted fail-closed validation, disabled collection/provider gates,
names-only source configuration, rotation, rollback, and emergency access. No real staging or
production mechanism, value, provider, database, deployment, or production acceptance is selected
or authorized by that completion.

`B00-007` now has a [partial infrastructure selection](../backlog/b00-007-infrastructure-selection.md): Linux is selected at the operating-system-family level; a local/Ethiopia-region VPS is preferred but not selected; Cloudflare is selected for planning subject to `SEC-02`; prototype media uses persistent local storage with metadata in PostgreSQL; MinIO is a conditional production candidate; and provider, capacity, staging, email, off-host backup, and RPO/RTO decisions remain open pending prototype evidence.

## Recorded evidence

| Field | Record |
| --- | --- |
| Outcome | Approved for implementation planning, with explicit open implementation selections |
| Accountable owner | TBD — External Project / Delivery Lead (temporary role-based owner) |
| Business acceptance | TBD — Hospital Project Owner / Focal Person (temporary role-based owner) |
| Evidence | Client direction approving the normalized seven-part architecture, with `ARCH-02` clarified so both logically separate databases initially run on the same VPS, recorded in the project workspace session on 12 September 2026. |
| Review triggers | Named-owner replacement; development acceptance; material cost, privacy, security, hosting, data-location, scaling, or operational change; and pre-release review. |
