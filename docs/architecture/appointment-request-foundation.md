# Appointment Request Backend Foundation

The [B03-015 execution brief](../backlog/b03-015-appointment-request-foundation.md) implements a
controlled synthetic-only create path. The application route is POST-only and checks the disabled
collection gate before reading a body. No Appointment page, token issuer, staff/read API, receipt
lookup, provider or public collection capability is introduced.

## Request boundary

`src/appointment/schema.ts` is the closed input contract. It normalizes bounded names and telephone
input, validates calendar dates and conditional doctor/service IDs, requires an explicit true
acknowledgment and rejects every unknown field. `handler.ts` adds same-origin plus double-submit
CSRF verification, JSON media enforcement, a 4 KiB streamed body limit, privacy-safe outcome
mapping and `no-store` responses. It returns only validation codes or an opaque accepted reference;
database errors and submitted values never enter responses or application audit events.

The CSRF value is also transformed with a server secret into a short-lived abuse key. Only the
derived key reaches PostgreSQL. Raw request bodies, network identifiers, CSRF values and public
references are absent from audit events. B03-017 must supply the host-only secure CSRF cookie and
form; activation review must confirm the deployment's trusted client-signal strategy before the
route can be enabled.

## Data access and authorization

`PostgresAppointmentRepository` is the sole application data-access adapter. The environment
contract selects the matching `hallelujah_appointment_<environment>` database and exact
`hallelujah_appointment_runtime_<environment>` role. Local configuration requires a disposable
`/tmp` or `/var/tmp` Unix socket; non-local configuration requires verified TLS. Appointment
credentials remain optional while collection is disabled, but URL, abuse secret and server-selected
notice version are atomic if any one is configured.

Migration `0001_b03_015_foundation.sql` is owned by a separate migration role. It creates private
request, catalog, notice, abuse-window, audit and migration-history tables. `PUBLIC` loses all
schema/table/sequence/function privileges. The runtime receives schema usage and execute permission
on one `SECURITY DEFINER` function only; direct record reads and writes fail. Content and
appointment roles cannot connect to each other's databases.

The function revalidates the active synthetic notice and care selector, conditional route shape,
date, acknowledgment, bounded text, derived abuse key and synthetic marker in one transaction. It
records only event type, outcome class, internal correlation UUID and time in the audit table. Its
hard activation stop rejects non-synthetic submissions regardless of application configuration.

## State and deferred work

Accepted requests receive a database-generated UUID reference and start in `received` with delivery
`not_attempted`. Closing/cancellation and the 90-day deletion job are not exposed yet. B03-016 must
add atomic intent idempotency, conflict detection and unknown-outcome reconciliation before any
collection activation; B03-018 owns delivery state changes and providers.

`pnpm appointment:db-local` provisions a socket-only cluster, applies the separate migration,
proves runtime/table and cross-database denials, exercises synthetic POST outcomes, inspects audit
redaction, creates an appointment-only custom dump and restores it into an independent database.
The fixture cluster and dump are deleted after the run.
