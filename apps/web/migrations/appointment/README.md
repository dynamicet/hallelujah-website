# Appointment database migrations

This directory is the forward-only migration history for the isolated appointment database. It is
separate from Payload/content migrations by design.

Apply each migration in lexical order as the environment-specific appointment migration role. The
runner must select `hallelujah_appointment_<environment>`, stop when the recorded version already
exists, and pass the separately provisioned runtime role as the quoted psql variable
`appointment_runtime_role`. The runtime role receives schema usage and the bounded submission
function only; it receives no table, sequence, DDL, content-database or record-list permission.

`0001_b03_015_foundation.sql` deliberately accepts only visibly synthetic records.
`0002_b03_016_idempotency.sql` replaces the create operation with an atomic intent/request
transaction. It stores purpose-separated keyed hashes rather than the raw intent key or raw-payload
digest, reconciles equivalent retries, rejects conflicting reuse and cascades intent deletion with
the request lifecycle. Neither migration can be used to activate personal-data collection. A later
reviewed activation migration and the remaining appointment privacy, operations, security and
release gates are required before activation.

Run `pnpm appointment:db-local` from the repository root for disposable socket-only migration,
least-privilege, synthetic persistence, concurrency/reconciliation, lifecycle, audit-redaction and
independent backup/restore evidence.
