# `B03-012`–`B03-014` — Controlled Appointment Contract

**Decision:** Approved for controlled development on 23 September 2026,
Africa/Addis_Ababa.  
**Responsible and acceptance authority:** Client workspace identity `befikadusata` directing Codex
in temporary Product, Privacy, Operations, Backend and Security roles.  
**Personal-data collection authority:** Not granted.

This record defines the minimum field, privacy/security and request-state contracts needed to start
`B03-015` with synthetic data. Named hospital Operations, Privacy/Legal and Security owners must
approve the real operating procedure, lawful basis, public notice, recipients and activation before
any public submission route or personal-data collection is enabled.

## `B03-012` — Minimized field contract

The public request schema is closed by default. A submission may contain only the fields below;
unknown fields are rejected rather than ignored.

| Field | Rule | Purpose and recipient | Validation and retention |
| --- | --- | --- | --- |
| `care_route` | Required: `doctor`, `service` or `not_sure` | Route the request to the appointment team | Exact allowlist; appointment record lifecycle |
| `doctor_id` | Required only for `doctor`; otherwise absent | Identify the requested clinician | Approved canonical public ID; synthetic allowlist only until `CARE-01` closes; appointment record lifecycle |
| `service_id` | Required only for `service`; otherwise absent | Identify the requested service | Approved canonical public ID; synthetic allowlist only until `CARE-04` closes; appointment record lifecycle |
| `full_name` | Required | Identify the person for staff follow-up | Server-normalized bounded text; appointment personal data; delete 90 days after closure |
| `phone` | Required | First-party staff follow-up | Bounded telephone input supporting Ethiopian and international formats; appointment personal data; delete 90 days after closure |
| `preferred_date` | Optional | Express a preference, never availability or a confirmed booking | Valid calendar date under a configurable operational horizon; appointment record lifecycle |
| `privacy_notice_version` | Server-resolved; never client-authoritative | Prove which notice was presented | Must identify an enabled approved notice before collection; retained with the appointment record |
| `privacy_acknowledged` | Required `true` from an initially unchecked control | Record acknowledgment of the stated request-processing purpose | Boolean input converted to server timestamp; not marketing consent or an asserted lawful basis |

`doctor_id` and `service_id` are mutually exclusive. `not_sure` accepts neither. Free-text notes,
email, new/returning status, contact-channel choice, department, referral details, files, medical
history, payment and insurance are excluded. Adding any field requires a new necessity, recipient,
validation and retention review.

## `B03-013` — Controlled privacy and security contract

- Purpose is limited to receiving and following up an appointment request. Submission never means
  a confirmed appointment.
- Data remains first-party in the isolated appointment database. No analytics, advertising,
  session replay, remote autocomplete, messaging or other third-party provider receives it.
- The public application role may validate and create through the bounded domain operation only; it
  cannot list or read appointment records. Separate authorized appointment staff access is required
  before activation. Content roles have no appointment access.
- Remote transport must use TLS. Controlled local development uses the socket-only database
  boundary. Credentials, CSRF material and request data never enter URLs or client storage.
- Application and audit events may contain event type, time, outcome class and non-sensitive
  internal correlation metadata only. They contain no submitted field values, notice acknowledgment,
  secrets or public receipt references.
- Abuse controls use short-lived, purpose-limited derived signals and bounded counters. Raw request
  bodies and raw network identifiers are not retained as abuse logs.
- Appointment personal data is deleted 90 days after the request reaches a terminal closed or
  cancelled state. Unresolved aging requests require an authorized operational review; production
  scheduling, backup expiry and deletion proof remain activation evidence.
- The unchecked acknowledgment records notice presentation and the stated processing purpose. It
  does not claim that consent is the legal basis. Lawful basis, rights/contact wording, named
  recipients, real access assignments and the final public notice remain mandatory activation
  approvals.
- A suspected exposure disables collection, preserves privacy-safe security metadata, invokes the
  approved incident process and does not copy request contents into tickets, chat or repository
  evidence.

Collection remains feature-gated off. Synthetic fixtures must be visibly fictional and may not
resemble real patient, clinician or service records.

### Controlled data flow

```text
Loopback synthetic client
  -> same-origin application boundary (feature flag, CSRF, size/rate and schema checks)
  -> appointment domain transaction (idempotency + request + audit-safe event)
  -> isolated appointment database role/database
  -> authoritative outcome with opaque reference
```

There is no content-database write, third-party hop, notification provider or analytics branch.
Remote deployment and a public client remain outside this flow until activation approval.

### Access matrix

| Actor/role | Controlled permission | Explicit denial or activation gate |
| --- | --- | --- |
| Public browser | No direct database permission | No list/read/update/delete; public route and collection stay off |
| Appointment runtime | Execute the bounded create/reconcile operation with the appointment role | No arbitrary listing, content-database access, DDL or role administration |
| Appointment staff | None in controlled development | Named recipients, authenticated workflow and least-privilege review required before access |
| Appointment migration role | Apply reviewed appointment migrations in the matching environment | No content migration, runtime use or cross-database administration |
| Backup/restore operator | Synthetic local backup/restore evidence only | Remote secrets, real data, off-host storage and production restore remain `B00-010` gates |
| Content/CMS roles | None | Cannot connect to, read or mutate appointment data |

### Retention and notice record

The working retention clock begins when an authorized workflow later marks a request closed or
cancelled. Primary appointment data, its notice record and linked idempotency material are deleted
90 days later. Synthetic controlled-development data may be destroyed earlier with its disposable
database. Production backup expiry, unresolved-request review cadence, deletion evidence and legal
holds require activation approval and may only change this default through a dated decision.

The notice record stores the server-selected notice version and acknowledgment timestamp with the
request. It stores no marketing permission and cannot substitute for approval of the lawful basis,
rights/contact text or the actual public notice.

## `B03-014` — Authoritative request-state contract

The appointment database transaction is authoritative. A client success message, notification or
network response is not authoritative by itself.

1. A new submission intent carries a cryptographically random idempotency key. The server stores a
   unique key, a keyed payload fingerprint and the appointment request atomically.
2. A repeat with the same key and same fingerprint returns the original authoritative outcome and
   public reference. The same key with different input is rejected as a conflict.
3. Validation rejection, CSRF rejection, malformed/oversized input and rate rejection create no
   appointment request and never return success.
4. If the response is lost or times out, the outcome is `unknown` to the client. Retrying the same
   intent reconciles against the unique key before any create operation.
5. Acceptance produces one opaque, non-sequential, non-guessable public reference. References and
   idempotency keys do not appear in query strings, analytics or logs and do not grant record-list
   access.
6. Confirmation delivery has its own `not_attempted`, `pending`, `sent` or `failed` state. Delivery
   failure never reverses an accepted request; the accepted reference remains authoritative.
7. Refresh, Back/Forward navigation and rendering a receipt never issue a new POST. A deliberate new
   request receives a new intent key.
8. Idempotency records follow the request lifecycle and contain no raw submitted values. Deletion
   cannot leave a reusable fingerprint or receipt lookup that exposes the deleted request.

Test examples for `B03-015`/`B03-016` must cover accepted, rejected, timed-out before commit,
timed-out after commit, reconciled, concurrent duplicate, conflicting reuse and delivery-failure
outcomes. The first committed transaction wins; every equivalent retry returns that same outcome.

## Delivery effect and remaining gates

`B03-012`–`B03-014` are Done at the controlled-development boundary. Together with the approved
[`B00-008`–`B00-010` local database boundary](b00-008-010-logical-database-delivery-boundary.md),
this unlocks readiness review for `B03-015`.

This decision does not close `B03-011`, `APPT-01`, `CARE-01`, `CARE-04`, `SEC-02`, formal
`DEL-01`, or full `B00-008`–`B00-010` acceptance. It does not authorize authentic selectors,
appointment staff access, a public route, personal-data collection, a provider, remote persistence,
production or publication.
