# Controlled content transfer

The B02-013 tool authors synthetic local records through the existing authenticated Payload Local
API. It has no HTTP route. `content-transfer.ts` validates and plans; `content-transfer-cms.ts`
locks, rereads live identity/complete documents, executes existing collection hooks and commits or
rolls back the batch. A dry run uses read-only operations inside the same transaction/lock boundary.

## Bundle and snapshot contracts

Input is version 1 with `synthetic: true` and at most 500 entries / 4 MiB. Each entry has a unique
bounded `sourceKey` and operation `upsert`, `merge` or `skip`. Upsert/merge also require an explicit
`contentClass` and an exact governed unsigned draft `record`. Skip carries neither field.
Stable public IDs are supplied only for synthetic authoring; the B02-012 extracted hospital
evidence remains withheld and is never automatically converted to approved content.

The [synthetic fixture](../../apps/web/scripts/lib/content-transfer-fixture.mjs) is the small
reference specimen. The existing clinician/service/settings validators and all other governed
record-kind validators apply. Server governance metadata is constructed by `createWorkflow` and
`applyWorkflow`, then checked by the normal collection hook. Existing author-owned drafts may
be projected to unsigned authoring inputs via `unsignedTransferRecord`; non-drafts are rejected.

Explicit merge replaces an existing draft's editable payload with the reviewed source payload
and retains its canonical ID. No automatic text union or duplicate retirement occurs. Duplicate
bundle targets are rejected rather than resolved by order. New-record dependencies are sorted
before writes; missing targets/cyclic new references fail without mutation.

Reports contain source keys, stable target IDs, actions, validation issues and totals. Plan hashes
bind the complete canonical bundle, persisted actor/roles, rows and snapshot hash. Snapshot hashes
cover the complete sorted document set, including workflow revision, approval and audit metadata.
An import rebuilds the plan under the same PostgreSQL lock and requires the unchanged hash.
Unchanged repeat imports perform zero writes. Unrelated record changes intentionally stale a plan.

Export is versioned JSON containing document IDs, stable public IDs, complete governed records,
workflow metadata and a SHA-256 integrity fingerprint. It excludes passwords, users, provider
configuration and media bytes. It preserves approval metadata as evidence; a fingerprint is not
authorization to restore a snapshot or to publish. Failed-batch rollback is transactional and
restores all pre-batch metadata. Successful imports retain normal append-only CMS audit history.

This is a governed-content export, not a full disaster-recovery backup. Independent care-affiliation
records and private scanned asset stores remain under their existing workflows and backup gates.
No imported URL is dereferenced, no media receipts are accepted and no remote media becomes an asset.

## Local operator commands

Use an already provisioned synthetic local CMS identity. Set `LOCAL_CONTENT_TRANSFER_EMAIL` and
`LOCAL_CONTENT_TRANSFER_PASSWORD` in the ignored `apps/web/.env.local`, alongside existing local
database/secret variables. Keep `APP_ENVIRONMENT=local`, `PERSONAL_DATA_COLLECTION=disabled` and
`EXTERNAL_SERVICES=disabled`. Credentials must not appear in argv, repository files or evidence.

```bash
pnpm content-transfer export
pnpm content-transfer dry-run /tmp/synthetic-content-bundle.json
pnpm content-transfer import /tmp/synthetic-content-bundle.json DRY_RUN_PLAN_SHA256
```

The last argument must be the exact 64-character `planHash` from the current dry run, under the
same identity. Export requires a reviewer when other authors have content. Dry-run validation
errors return a report and nonzero exit status; imports fail without partial commits. The CLI
opens only regular local JSON files, rejects symlinks, bounds reads and does not print login tokens
or underlying driver exceptions. Use private ignored storage for exports and capture only sanitized
synthetic evidence. The API never trusts roles supplied in the caller's user object; it rereads the
persisted active local identity.

`pnpm content-transfer:db-local` creates a disposable socket-only PostgreSQL cluster, proves
public-content/appointment cross-role denial and exercises persisted dry runs, repeat imports,
updates/merges, concurrent plans, late failure rollback and live identity revocation. The late
failure hook exists only in the smoke configuration. `pnpm assets:db-local --full` repeats this
with the existing complete CMS/asset integration suite. Pure checks run in normal verification.
