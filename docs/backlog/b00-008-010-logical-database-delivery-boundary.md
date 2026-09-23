# `B00-008`–`B00-010` — Logical Database Delivery Boundary

**Decision:** Approved for controlled-development sequencing on 23 September 2026,
Africa/Addis_Ababa.

## Selected topology

Each environment uses one PostgreSQL instance with two logically isolated databases:

| Lane | Database | Application role |
| --- | --- | --- |
| Public content | `hallelujah_content_<environment>` | Environment-specific content role |
| Appointment requests | `hallelujah_appointment_<environment>` | Environment-specific appointment role |

The roles have independent credentials. `PUBLIC` database access is revoked, neither application
role may connect to or mutate the other database, and neither role receives superuser, role,
database-creation, replication, or host-administration privileges. Same-instance logical isolation
is cost-conscious separation, not physical isolation; security and capacity review may move the
appointment database to a separate instance or host later without combining the two histories.

## Delivery boundary

`B00-008`–`B00-010` control both locally testable application contracts and environment-specific
operational proof. Those two boundaries are intentionally separated:

| Boundary | Required evidence |
| --- | --- |
| Controlled local development | Disposable socket-only PostgreSQL; separate databases and roles; cross-role connection/read/write denial; distinct forward-only migration histories; synthetic backup and independent restore checks; no personal data; collection disabled |
| Remote staging or production preparation | Selected host and secret-delivery mechanism; network rules; independently rotatable credentials; reviewed migration execution and failure recovery; encrypted backup destination, retention, access and monitoring |
| Personal-data activation and production acceptance | Approved appointment privacy/operations contract; named Backend/DevOps/Security owners; approved RPO/RTO; successful dated restore rehearsal; security and release acceptance |

Full `B00-008`–`B00-010` completion remains required at the applicable remote/activation boundary.
Its absence does not block controlled local code delivery when the local row above passes and the
ticket's domain decisions are satisfied.

## Migration and recovery rules

- Content and appointment migrations use separate directories, credentials and history tables.
- A migration runs only as the role for its target database and must fail closed on a database-name
  or environment mismatch.
- Forward migrations are the normal correction mechanism. Destructive or materially locking work
  requires a reviewed expand/migrate/contract and recovery plan.
- Backups and restores remain separate by database. A combined dump is not acceptance evidence.
- Local development proves mechanics with synthetic data. Production scheduling, encryption key
  custody, off-host storage, retention, alerting and RPO/RTO remain `B00-010` activation evidence.

## Effect on appointment delivery

`B03-015` may enter controlled local implementation after `B03-012`–`B03-014` define the approved
field, privacy/security and request-state contracts. Its migrations and local recovery checks are
developed with the schema rather than waiting for remote provisioning. No public submission route,
personal-data collection, remote appointment persistence or production claim follows from this
decision.

## Existing evidence and next evidence

The existing `B02-001` disposable role-isolation check already proves the two-database denial model
with synthetic rows and no TCP listener. It remains reusable evidence for the local topology, but
does not close remote provisioning. `B00-009` and `B00-010` still require appointment-specific
migration and independent synthetic backup/restore evidence when that schema is implemented.
