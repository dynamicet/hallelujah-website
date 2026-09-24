# B03-015 Controlled Appointment Foundation Evidence — 24 September 2026

| Field | Result |
| --- | --- |
| Branch | `b03-015-appointment-request-foundation` |
| Scope | Synthetic local T0 and CI-ready T1 only |
| Status | In review; hosted exact-head CI and explicit controlled acceptance pending |
| Collection | Disabled; route returns `503` before body processing |
| Production/publication authority | Not granted |

## Passing evidence

| Check | Result |
| --- | --- |
| `pnpm appointment:check` | Pass: closed schema, conditional IDs, privacy acknowledgment, dates, CSRF, JSON/body limits, safe response/audit outcomes and migration policy |
| `pnpm appointment:db-local` | Pass: socket-only PostgreSQL, separate owner/runtime/content roles, cross-database denial, direct-table denial, bounded function execution, synthetic persistence, selector/rate rejection, value-free audit rows, separate dump and independent restore (`8` requests, `1` migration, no content table) |
| `pnpm verify` | Pass: complete source, policy, type, test, optimized-build, runtime, accessibility, budget and browser regression chain; disabled appointment POST returns generic `503`/`no-store` without reflection |
| `pnpm rebuild:verify` | Pass from independent frozen copy; full lockfile graph SHA-256 `dce7a390f7f3656a26128375d00e376c859aa4c2f7ea64acdbf22f43262edb91`; importer graph SHA-256 `335e58984a447fd383e00d86b2d3579b39c1d26df9f14be8b32201440ad130f3` |
| `pnpm audit:dependencies` | Pass: 650 dependencies; zero moderate, high or critical known vulnerabilities |
| `pnpm secrets:check --history` | Pass: current tree and reachable history; matched values would be redacted |
| `pnpm lint`, `pnpm typecheck`, `pnpm format:check`, `pnpm links:check`, `pnpm backlog:check`, `git diff --check` | Pass |

The CI policy now runs the same appointment database harness after full verification. Only the exact
authorized `0001_b03_015_foundation.sql` migration and its README pass the migration-introduction
gate; an added unregistered migration still fails the negative control.

## Corrected attempts

- The first database start was denied by the restricted sandbox; the approved socket-only rerun
  exposed a missing deterministic initdb superuser. Adding `--username=postgres` corrected it.
- The first optimized build attempted environment validation while collecting route data. Moving
  configuration loading into the POST invocation preserved runtime validation and build isolation.
- The original migration-introduction gate still represented the pre-decision state. It was narrowed
  to the two explicitly authorized B03-015 migration files while retaining its unauthorized-file
  negative test.
- The first full run used system Python without the pinned `fontTools`. The rerun used a disposable
  environment installed from the repository's hash-locked requirements, matching CI setup.

No corrected attempt processed real appointment data, contacted a provider or enabled collection.

## Remaining evidence

Hosted exact-head CI must run the updated workflow, including PostgreSQL migration/restore. Review
tracking and explicit client acceptance must identify the accepted head before Done. B03-016 must
then implement atomic intent idempotency and unknown-outcome reconciliation. Hospital/privacy/
security approvals, authentic data, remote infrastructure and all activation/release gates remain
open.
