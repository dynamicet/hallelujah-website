# B03-016 — Atomic Appointment Idempotency and Reconciliation

**Lane / priority / phase:** DELIVERY / P0 / Phase 1 preparation

**Status:** In review for controlled development; hosted exact-head review pending

**Responsible/review identity:** `befikadusata` directing Codex in temporary Backend, Security and
QA roles

**Tracking:** [issue #72](https://github.com/dynamicet/hallelujah-website/issues/72)

**Personal-data collection, remote persistence and production authority:** Not granted

On 25 September 2026, Africa/Addis_Ababa, the client directed the next implementation. B03-016
moves Proposed → Ready → **In progress** on branch `b03-016-appointment-idempotency`. Completed
B03-014 and B03-015 satisfy the controlled dependencies. B03-015 merged as `a59980a`; exact-main
[run 35989108824](https://github.com/dynamicet/hallelujah-website/actions/runs/35989108824)
passed for that merge commit and clears the dependent-execution pause.

## Controlled outcome

Extend the synthetic-only request boundary so a cryptographically random client intent creates at
most one appointment request. Equivalent retries must return the original database-authoritative
opaque reference; reuse of an intent for different normalized input must fail as a conflict.

The implementation derives purpose-separated keyed hashes for the intent and normalized payload,
stores neither the raw intent key nor raw payload in idempotency material, and commits the intent
and request atomically. Reconciliation stays on the existing POST boundary. No reference lookup,
record read/list route or Appointment page is introduced.

## Allowed repository scope

- appointment security, handler, service and PostgreSQL data-access modules;
- the existing POST-only route and server-selected appointment configuration;
- one forward-only appointment migration and the disposable database harness;
- appointment contract, environment, migration-introduction and runtime checks;
- architecture, backlog and sanitized execution evidence.

## Acceptance criteria

1. A valid new 256-bit intent key and normalized request create one intent and one request in one
   transaction and return a database-generated opaque reference.
2. Same intent plus same keyed payload fingerprint returns the original reference without creating
   another request; same intent plus different input returns a safe conflict.
3. Concurrent equivalent submissions prove the database uniqueness boundary and produce one
   request. Retry tests cover failures before commit and responses lost after commit.
4. The raw intent key, payload fingerprint input, submitted values, notice acknowledgment, secrets
   and public reference remain absent from application/database audit events and logs.
5. The runtime retains execute-only authority for the bounded operation and cannot read/list or
   directly mutate request or intent tables.
6. Idempotency material follows the request lifecycle and is removed when its request is removed.
7. Collection remains disabled in deployable configuration; only visibly synthetic local fixtures
   can pass the database hard stop.

## Verification plan

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

Hosted exact-head T1, explicit controlled acceptance, checked merge and passing exact-main CI are
required before Done.

## Local review result

On 25 September 2026, B03-016 moves In progress → **In review** after the handler and database
contract checks, disposable PostgreSQL concurrency/rollback/restore suite, full repository
verification, independent frozen reconstruction, dependency audit and reachable-history secret
scan passed. The
[sanitized execution evidence](evidence/B03-016-appointment-idempotency-2026-09-25.md) records the
results and corrected local setup attempts. Hosted exact-head CI and explicit controlled client
acceptance remain required before Done; this review state grants no collection or release
authority.

## Remaining gates

`B03-011`, `APPT-01`, `CARE-01`, `CARE-04`, final lawful-basis/public-notice approval, named
recipients and staff access, `SEC-02`, `B03-017`–`B03-019`, formal `DEL-01`, remote provisioning,
production recovery evidence and release authority remain open. Personal data, authentic
selectors/notices, collection activation, staff access, providers, production and publication
remain withheld.
