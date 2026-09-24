# B03-015 — Controlled Appointment Request Backend Foundation

**Lane / priority / phase:** DELIVERY / P0 / Phase 1 preparation
**Status:** Done for controlled development; final closeout CI and checked merge tracked below
**Responsible/review identity:** `befikadusata` directing Codex in temporary Backend, Security and
QA roles
**Tracking:** [issue #70](https://github.com/dynamicet/hallelujah-website/issues/70)
**Review:** [PR #71](https://github.com/dynamicet/hallelujah-website/pull/71)
**Personal-data collection, remote persistence and production authority:** Not granted

On 23 September 2026, Africa/Addis_Ababa, the client directed implementation after approving the
[`B03-012`–`B03-014` controlled contract](b03-012-014-controlled-appointment-contract.md) and the
[`B00-008`–`B00-010` controlled local database boundary](b00-008-010-logical-database-delivery-boundary.md).
This starts B03-015 with synthetic data on a dedicated feature branch. It does not close the open
hospital/privacy/security decisions or authorize a usable public form.

## Controlled implementation scope

- Strict server-side parsing for the approved name, phone, care route, conditional canonical ID,
  optional preferred date and privacy-acknowledgment fields. Unknown fields are rejected.
- A POST-only Next.js route boundary with collection checked before body processing, same-origin
  double-submit CSRF validation, a 4 KiB body ceiling, JSON-only input, generic safe errors and
  `no-store` responses.
- Purpose-limited keyed abuse signals, a five-attempt/ten-minute database window and value-free
  application/database audit events.
- A separate forward-only appointment migration, migration owner and runtime role. The runtime can
  execute one bounded `SECURITY DEFINER` operation but cannot read, list, insert or update tables.
- Database revalidation of care selections, notice availability, dates, acknowledgment and the
  visibly synthetic fixture boundary.
- Disposable socket-only PostgreSQL evidence for cross-database denial, persistence, malformed/
  unauthorized requests, rate rejection, audit redaction, separate dump and independent restore.

The deployable route is present only as an unavailable boundary: `PERSONAL_DATA_COLLECTION` still
accepts only `disabled`, no CSRF-token issuer or Appointment page exists, and the database operation
rejects any non-synthetic submission. There is no read/list/staff route, notification provider,
analytics branch, remote appointment database, real clinician/service record or personal data.

## B03-015 / B03-016 boundary

B03-015 owns the minimized create boundary, isolated persistence, server-authoritative validation,
CSRF, bounded abuse protection, least privilege and audit safety. It creates an opaque reference but
does not yet implement the atomic intent key, duplicate reconciliation, unknown-outcome lookup or
safe retry contract. Those remain B03-016. Collection must stay unavailable until B03-016 and the
remaining activation gates close.

## Acceptance checks

Use pinned Node.js 24.21.0 and pnpm 10.27.0:

```sh
pnpm appointment:check
pnpm appointment:db-local
pnpm lint
pnpm typecheck
pnpm verify
pnpm rebuild:verify
pnpm audit:dependencies
pnpm secrets:check --history
git diff --check
```

The hosted CI workflow also runs `pnpm appointment:db-local`; it uses a disposable PostgreSQL
cluster with no TCP listener and destroys the synthetic cluster after the check.

## Remaining gates

`B03-011`, `APPT-01`, `CARE-01`, `CARE-04`, final lawful-basis/public-notice approval, named
recipients and staff access, `SEC-02`, B03-016, formal `DEL-01`, remote provisioning, encrypted
off-host backup, approved RPO/RTO, production restore evidence and release authority remain open.
No passing controlled check changes those gates.

## Local review result — 24 September 2026

B03-015 moves In progress → **In review** under the same responsible/review identity. Strict schema,
HTTP security, environment, authorization, migration, persistence, audit and recovery checks pass.
Full repository verification, an independent frozen clean reconstruction, reachable-history secret
scan and registry dependency audit also pass. The
[execution evidence](evidence/B03-015-appointment-request-foundation-2026-09-24.md) records results
and corrected setup failures.

Hosted exact-head CI, review tracking and explicit controlled client acceptance remain required
before Done. Personal data, authentic selectors/notices, collection activation, remote persistence,
staff access, providers, production and publication remain withheld.

## Controlled acceptance — 24 September 2026

The client directed “close out b03-015”. B03-015 moves In review → **Done** for controlled
development under `befikadusata` as responsible and controlled acceptance person, directing Codex
in temporary Backend, Security and QA roles on 24 September 2026, Africa/Addis_Ababa. The target
remains synthetic local T0/private hosted T1 under the working B00-016 matrix.

All recorded local gates pass. Exact-head hosted
[run 35985726275](https://github.com/dynamicet/hallelujah-website/actions/runs/35985726275)
passes every step, including the isolated appointment migration/permission/restore harness, full
verification and independent frozen clean reconstruction, for
`894902ee62e1e72def84677833ff31d1e786cc6a`. No scoped controlled-implementation defect remains
open. Final acceptance-documentation CI must pass for its exact SHA before checked merge of PR #71.
Issue #70 and PR #71 must retain the matching SHA/run, merge SHA and exact-main result. Dependent
execution waits for passing exact-main CI; B03-016 is the next controlled delivery candidate but is
not promoted by this acceptance.

This closeout accepts only the synthetic, fail-closed backend foundation. `B03-011`, `APPT-01`,
`CARE-01`, `CARE-04`, final lawful-basis/public-notice approval, named recipients and staff access,
`SEC-02`, B03-016, formal `DEL-01`, remote provisioning, encrypted off-host backup, approved
RPO/RTO, production restore evidence and release authority remain open. Personal data, authentic
selectors/notices, collection activation, staff access, providers, production and publication
remain withheld.
