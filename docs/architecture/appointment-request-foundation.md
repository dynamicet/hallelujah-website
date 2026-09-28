# Appointment Request Backend Foundation

The [B03-015 execution brief](../backlog/b03-015-appointment-request-foundation.md) implements a
controlled synthetic-only create path. The
[B03-016 execution brief](../backlog/b03-016-appointment-idempotency.md) extends it with atomic
submission intent and reconciliation behavior. The application route is POST-only and checks the
disabled collection gate before reading a body. No Appointment page, token issuer, staff/read API,
receipt lookup, provider or public collection capability is introduced.

## Request boundary

`src/appointment/schema.ts` is the closed input contract. It normalizes bounded names and telephone
input, validates calendar dates and conditional doctor/service IDs, requires an explicit true
acknowledgment and rejects every unknown field. `handler.ts` adds same-origin plus double-submit
CSRF verification, JSON media enforcement, a 4 KiB streamed body limit, privacy-safe outcome
mapping and `no-store` responses. It returns only validation codes or an opaque accepted reference;
database errors and submitted values never enter responses or application audit events. An enabled
controlled request also requires an `Idempotency-Key` containing exactly 32 cryptographically
random bytes in canonical unpadded base64url form.

The CSRF value is also transformed with a server secret into a short-lived abuse key. Only the
derived key reaches PostgreSQL. A separate idempotency secret derives purpose-separated
HMAC-SHA-256
values for the intent key and canonical normalized payload, including the acknowledged notice
version. Only those non-reversible keyed values reach PostgreSQL; the raw intent and an offline-
testable raw-payload digest are not stored. Raw request bodies, network identifiers, CSRF values and
public references are absent from audit events. B03-017 must supply the host-only secure CSRF
cookie, random intent and form; activation review must confirm the deployment's trusted client-
signal strategy before the route can be enabled.

## Controlled Appointment presentation boundary

The [B03-017 controlled execution brief](../backlog/b03-017-controlled-appointment-page.md) adds a
reusable server-rendered A0–A8 template without mounting `/appointments/`. Its review adapter is a
loopback-only HTTP server under `apps/web/scripts/`; the fixture, renderer, server and browser-only
enhancement remain outside the application import graph and deployable public assets. The adapter
accepts only GET/HEAD on an exact loopback host, rejects query state and bodies, and returns
`no-store`, `noindex`, `connect-src 'none'` and `form-action 'none'` controls.

The preview demonstrates conditional synthetic doctor/service selection, persistent labels,
privacy-boundary acknowledgment, linked error summary/focus, pending, known failure, unknown
outcome, reconciliation, receipt and delivery-warning presentation. Its enhancement calls
`preventDefault()` before local validation and contains no fetch, storage, cookie, URL-state or
logging path. Without JavaScript, the submit control remains disabled; CSP separately prevents an
implicit form navigation.

This controlled slice deliberately does not issue a CSRF cookie or idempotency key and cannot call
the POST route. Those values may be issued only from a same-host server boundary when collection is
separately approved and enabled. The eventual adapter must map the existing POST statuses to the
reviewed UI states without treating a notification as acceptance. PostgreSQL remains authoritative;
B03-018 owns WhatsApp, Telegram or any other separately approved notification provider.

## Data access and authorization

`PostgresAppointmentRepository` is the sole application data-access adapter. The environment
contract selects the matching `hallelujah_appointment_<environment>` database and exact
`hallelujah_appointment_runtime_<environment>` role. Local configuration requires a disposable
`/tmp` or `/var/tmp` Unix socket; non-local configuration requires verified TLS. Appointment
credentials remain optional while collection is disabled, but URL, abuse secret, idempotency
secret and server-selected notice version are atomic if any one is configured.

Migration `0001_b03_015_foundation.sql` is owned by a separate migration role. It creates private
request, catalog, notice, abuse-window, audit and migration-history tables. `PUBLIC` loses all
schema/table/sequence/function privileges. The runtime receives schema usage and execute permission
on one `SECURITY DEFINER` function only; direct record reads and writes fail. Content and
appointment roles cannot connect to each other's databases.

Forward migration `0002_b03_016_idempotency.sql` adds a private intent table and replaces the
bounded function signature. The intent-key hash is unique, its payload fingerprint is keyed and its
request foreign key is unique, non-null, deferred and delete-cascading. A new intent reserves its
database-generated request ID before the request insert within one transaction. Concurrent inserts
serialize on the unique intent hash: the winner creates the request; an equivalent loser returns
the winner's reference; conflicting input returns a safe conflict. A rolled-back winner leaves
neither intent nor request, so a retry may safely become the creator.

The function revalidates the active synthetic notice and care selector, conditional route shape,
date, acknowledgment, bounded text, derived abuse key, keyed intent material and synthetic marker
in one transaction. Equivalent retries reconcile before mutable catalog/rate checks so an already
accepted result remains authoritative. It records only event type, outcome class, internal
correlation UUID and time in the audit table. Its hard activation stop rejects non-synthetic
submissions regardless of application configuration.

## State and deferred work

Accepted requests receive a database-generated UUID reference and start in `received` with delivery
`not_attempted`. A first commit returns `201 accepted`; an equivalent retry returns `200
reconciled` with the same reference; changed input under the same intent returns `409 conflict`. A
response lost after commit is reconciled by repeating the same POST and intent. There is
deliberately no GET lookup or reference-as-credential behavior. Delivery failure never changes the
accepted reference. Deleting a request cascades its intent material. Closing/cancellation and the
90-day deletion job are not exposed yet; B03-018 owns delivery state changes and providers.

`pnpm appointment:db-local` provisions a socket-only cluster, applies the separate migrations,
proves runtime/table and cross-database denials, exercises synthetic POST outcomes, concurrent
duplicates, equivalent retry, conflicting reuse, response-loss reconciliation, delivery failure
and lifecycle deletion, inspects audit redaction, creates an appointment-only custom dump and
restores it into an independent database. The fixture cluster and dump are deleted after the run.
