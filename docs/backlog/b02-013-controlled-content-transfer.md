# B02-013 — Controlled Content Import and Export

**Lane / priority / phase:** DELIVERY / P1 / Phase 1 preparation
**Status:** In review for controlled development; local source/application/database/CLI checks pass.
Local clean reconstruction hit registry failures; hosted T1 and controlled acceptance remain required.

On 18 September 2026, Africa/Addis_Ababa, the client directed “start” after the proposed
B02-013 execution. Responsible person and controlled review authority: workspace identity
`befikadusata` directing Codex in temporary Backend/Content/QA roles. B02-001–B02-012 are
Done for controlled development. B02-012 PR #55 merged as
`ba55eb145ee7308cee5c41408ce28058973ffc86`; exact-main
[run 35341982931](https://github.com/dynamicet/hallelujah-website/actions/runs/35341982931)
passed. This authorizes the synthetic local boundary below; it does not approve authentic migration.

## Outcome and scope

Validated, repeatable authoring batches for the existing local `governed-records` collection,
complete authenticated exports, deterministic dry-run reports, optimistic plan checks and
transaction rollback. The existing CMS Local API, persisted identities, author ownership,
content class, workflow commands, audit rules and global PostgreSQL write lock remain authoritative.

Allowed changes: content-transfer modules under `apps/web/src/content/`, related CLI/fixtures/checks
under `apps/web/scripts/`, disposable database smoke integration, package script entries,
architecture/runbook documentation and backlog/evidence records. No public/CMS HTTP route is added.
No benchmark applies: this is an internal data tool with no patient-facing interface.

The 259-unit B02-012 evidence register remains withheld. It is not an import bundle, does not have
hospital-approved canonical IDs and cannot pass the unsigned synthetic draft contract.
Actual migration remains dependent on GOV-01, SEC-01 and applicable hospital decisions.

## Controlled acceptance

- Versioned bounded bundles carry explicit synthetic scope, unique source keys, explicit operations
  and exact governed schema. Unsupported fields/statuses/locales, forged governance, duplicate
  targets, unresolved relationships and new-record reference cycles fail closed.
- Local database URLs must resolve to loopback or an explicit Unix socket, with no remote query
  overrides or nested connection strings. The CLI checks this before database initialization.
- Imports create unsigned synthetic drafts or edit the owning author's draft. They cannot move
  content through review/approval/publication, supply approvals or audit, alter stable identities,
  change content class, or modify someone else's content.
- Dry-run reports cover create/update/merge/skip/error without writes. A bundle-wide schema failure
  produces one bundle error; semantic row failures retain source keys. Any error prevents all writes.
- A merge is an explicitly selected source payload for an existing canonical draft ID. It is not
  heuristic text union, record deletion, relationship remapping or a redirect decision. Identical
  payloads skip even when the operation is merge.
- Repeated unchanged imports do not append audit entries or bump revisions. Forward references
  use dependency order; cycles among entirely new records require separate reviewed authoring.
- Import requires the matching dry-run plan hash, binding input, actor and complete record/workflow
  snapshot. Revalidation occurs under the shared write lock; concurrent or stale plans are rejected.
- Every batch uses one PostgreSQL transaction. A late hook failure rolls back all creates/edits,
  preserving pre-batch stable IDs, approvals, revisions and audit. No arbitrary snapshot restore or
  deletion bypass is exposed. Database sequence gaps after rollback are harmless and not public IDs.
- Export retains all synthetic governed records, full approval/source/withdrawal/audit metadata and
  workflow revisions/reviews/verification. Reviewer export can read the complete set; an author
  cannot export other authors' records. Export is a snapshot format, not a signed restore grant.
- Remote media is never requested. Assets/binaries/scanner receipts and independently reviewed
  care-association records retain their own B02-011/B02-006 workflows; this tool does not restore
  those stores or invent their approvals. Exported content references are not asset clearance.

## Commands and evidence

See the [content-transfer architecture and runbook](../architecture/content-transfer.md).
Run with pinned Node.js 24.21.0 / pnpm 10.27.0:

```bash
pnpm content-transfer:check
pnpm content-transfer:db-local
pnpm assets:db-local --full
pnpm verify
pnpm rebuild:verify
pnpm audit:dependencies
pnpm secrets:check --history
git diff --check
```

The pure contract check is included in `pnpm test`; the existing complete disposable database
smoke includes the persistence/rollback/concurrency checks. No new dependency is introduced.
Tracking: [issue #56](https://github.com/dynamicet/hallelujah-website/issues/56) and
[draft PR #57](https://github.com/dynamicet/hallelujah-website/pull/57).
Evidence: [B02-013 execution evidence](evidence/B02-013-controlled-content-transfer-2026-09-18.md).
Local T0 and private hosted T1 remain separate; completion requires recorded review and acceptance.

## Local review result

Pure contract checks, real CLI, complete disposable PostgreSQL CMS/asset integration and full
application verification pass. History secret scan and fresh dependency audit pass. Registry
timeouts/connection resets prevented the additional local clean reconstruction from completing,
including a reduced-concurrency retry. This remains an environmental failure, not a passing check.
The hosted pipeline independently requires clean reconstruction before its T1 can pass.
No scoped runtime defect remains open; the ticket is not accepted or merged.

Hosted [run 35345740923](https://github.com/dynamicet/hallelujah-website/actions/runs/35345740923)
passes all steps and independent clean reconstruction for preceding review head
`66376adbfc30a22c15af01ccf7c7f22a50b2ecca`. Final loopback/Unix-socket database enforcement
passes pure/type and focused database/CLI retests; its current head must repeat hosted CI.
Issue #56 and PR #57 retain the exact current-head result before acceptance/merge.

Authentic content/identities, production provisioning, providers, personal-data collection,
publication, legacy migration and DNS remain disabled. B02-014 is the next candidate after closeout.
