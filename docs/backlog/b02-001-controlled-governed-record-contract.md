# `B02-001` — Controlled Local Governed-Record Contract

**Status:** Done for controlled development on 16 September 2026, Africa/Addis_Ababa. The client directed completion, permitting Proposed → Ready → In progress → In review → Done after local `T0`, full repository verification, history secret scan, dependency audit, and hosted exact implementation-head `T1` passed. The documentation-closeout head must repeat CI before merge.

## Execution boundary

The client directed that unknown VPS-provider, region, capacity, and production operations choices must not block locally testable schema work. `B02-001` may therefore start with synthetic, visibly labeled records and temporary development role labels. `B00-008` remains Blocked as the separate initial-VPS provisioning ticket. Neither this boundary nor a passing local test grants remote provisioning, production acceptance, content publication, or personal-data collection.

| Field | Controlled value |
| --- | --- |
| Epic / lane / priority | Epic 02 / `DELIVERY` / `P0` |
| Phase / milestone / target | Phase 1 / `M1`; isolated local `T0` and private-repository implementation `T1` only |
| Responsible / acceptance | Client workspace identity `befikadusata` may direct temporary Backend, Content, and QA roles for controlled-development work; named Backend, DevOps, Content, Security, hospital governance, and production acceptance people return at their gates |
| Dependencies | `B00-006` Done; `ARCH-02` local role separation required for integrated acceptance; `B00-008` required before remote staging/production; `GOV-01` required for real owners and publication |
| Sources | [Epic 02 ticket](epic-02-cms-content.md), [data and URL contracts](../visual-design/handoff/developer-handoff.md#6-data-and-url-contracts), [architecture `ARCH-02`](../architecture/epic-0-technical-foundation.md#approved-baseline), [requirements](../requirements/requirements-matrix.md), [working acceptance matrix](../validation/implementation-acceptance-matrix.md) |
| Allowed repository scope | Governed-record schemas and validators, synthetic fixtures, local database role definitions and negative permission checks, documentation, and sanitized evidence |
| Exclusions | No real hospital records or owner identities, appointment data, legacy import, remote environment, external provider, public route, email, publication, or production claim |

## Observable controlled acceptance

1. The shared contract validates opaque stable public IDs, localized canonical slugs and titles, provenance, draft/review/approval status, temporary owner/reviewer labels, general and kind-matched domain approval metadata, relationships, publish/review/expiry times, withdrawal reasons, and redirect decisions. Type-specific required governance blocks publish; unknown, invalid, expired, or withdrawn records fail closed.
2. Synthetic tests cover uniqueness, missing optional fields, unapproved facts, invalid status transitions, localization gaps, expiry/withdrawal, redirect validity, and search/sitemap/cache eligibility. Fixtures cannot be mistaken for approved hospital content.
3. Schema and fixture work may be reviewed before a database is available. Integrated `T0/T1` acceptance additionally requires separate local public-content and appointment PostgreSQL databases, users, credentials, and permissions, with negative tests proving neither role can read or mutate the other's records and no public network exposure. No real appointment records are created.
4. Local verification records exact configuration and test commands without secrets, identifies the build/environment and expected versus actual denial, and uses sanitized evidence only. Repository application gates and hosted exact-head CI pass before controlled-development closure.
5. `B01-008` may use the accepted controlled contract for governed-card development. The local role test does not close `B00-008`, whose VPS provisioning, independently rotatable credentials, network rules, and production evidence remain due when `B00-007` is approved.

## Implemented local checks

The pure TypeScript contract and [negative fixture checks](../../apps/web/scripts/check-governed-records.mjs) cover governed IDs, source, status, locales, owner/reviewer/approval, kind-matched domain approval, dates, withdrawal, transitions, public eligibility, canonical uniqueness, relationship and successor integrity, immutable identity, and append-only audit history. The closed [Payload collection](../../apps/web/src/content/governed-collection.ts) validates every local write, keeps an indexed stable public ID, denies unauthenticated access and API endpoints, blocks deletion, and rejects authentic records while production governance remains open. The [disposable CMS smoke](../../apps/web/scripts/check-governed-cms-db.mjs) persists and retires a visibly synthetic record in a separate clean local PostgreSQL cluster. It is collection persistence evidence, not `B02-002` CMS role/workflow acceptance.

The [disposable role-isolation setup](../../apps/web/scripts/sql/b02-001-local-isolation.sql) and [cross-role checker](../../apps/web/scripts/check-local-db-isolation.mjs) use synthetic rows only. PostgreSQL 18.6 was initialized with Unix-socket access and no TCP listener; the checker verified own-database access and denied cross-database reads/connections/mutations. Both local checks use sanitized evidence in the [15 September preparation record](evidence/B02-001-controlled-local-contract-2026-09-15.md) and [16 September integration record](evidence/B02-001-controlled-cms-integration-2026-09-16.md). Neither is initial-VPS provisioning or authentic CMS workflow acceptance.

Run the pure contract check with `pnpm governed-records:check`. To repeat the database check, create a fresh disposable PostgreSQL 18 instance, apply the SQL setup as a local administrative role, set `B02_001_PGHOST` to its Unix-socket directory and `B02_001_PGPORT` to its port, then run `pnpm local-db-isolation:check`. The script refuses to run without those explicit local coordinates. Never use production credentials or data for this check.

For the CMS smoke, use a separate fresh socket-only cluster, apply [its role/database setup](../../apps/web/scripts/sql/b02-001-cms-smoke.sql), set the same two disposable coordinates, and run `pnpm governed-records:db-smoke`. The command supplies placeholder local credentials internally and exits after synthetic create/retire assertions. Never point it at a shared, staging, or production database: Payload development schema push can remove unrelated tables.

## Review triggers

Revisit local assumptions when a VPS/provider, production environment, named owners, authentic content, appointment data flow, or storage topology is selected. Re-run the isolation tests against that target before staging or production acceptance. Until then, keep appointment collection and all provider requests disabled.
