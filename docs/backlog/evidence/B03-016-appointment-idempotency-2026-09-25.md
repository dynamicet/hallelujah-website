# B03-016 Appointment Idempotency Evidence — 25 September 2026

| Field | Result |
| --- | --- |
| Branch | `b03-016-appointment-idempotency` |
| Scope | Synthetic local T0 and private hosted T1 only |
| Status | In review; hosted exact-head CI and controlled acceptance pending |
| Tracking | [issue #72](https://github.com/dynamicet/hallelujah-website/issues/72) |
| Review | [PR #73](https://github.com/dynamicet/hallelujah-website/pull/73) |
| Collection | Disabled; route returns `503` before configuration or body processing |
| Production/publication authority | Not granted |

## Passing evidence

| Check | Result |
| --- | --- |
| `pnpm appointment:check` | Pass: canonical 256-bit intent validation, purpose-separated keyed intent/payload material, equivalent reconciliation, conflicting reuse, failure-before-commit and response-lost-after-commit behavior, safe outputs/audits and migration policy |
| `pnpm appointment:db-local` | Pass: two forward migrations; execute-only runtime; direct-table and cross-database denial; atomic rollback/retry; equivalent and conflicting retries; concurrent duplicate serialization; rate rejection; delivery-independent reference continuity; cascading lifecycle deletion; value/key/secret/reference-free audit rows; independent restore (`11` requests, `2` migrations, no content table) |
| `pnpm verify` | Pass: complete source, policy, type, contract, optimized-build, disabled-route runtime, accessibility, budget and rendered browser regression chain |
| `pnpm rebuild:verify` | Pass from independent frozen copy; full lockfile graph SHA-256 `dce7a390f7f3656a26128375d00e376c859aa4c2f7ea64acdbf22f43262edb91`; importer graph SHA-256 `335e58984a447fd383e00d86b2d3579b39c1d26df9f14be8b32201440ad130f3` |
| `pnpm audit:dependencies` | Pass: 650 dependencies; zero moderate, high or critical known vulnerabilities |
| `pnpm secrets:check --history` | Pass: current tree and reachable history; matched values would be redacted |
| `pnpm lint`, `pnpm typecheck`, `pnpm format:check`, `pnpm links:check`, `pnpm backlog:check`, `git diff --check` | Pass |

The disposable database proof ends with `11` request rows, `11` intent rows and `18` audit rows.
The count excludes one request/intent pair deliberately deleted to prove cascading lifecycle cleanup
and excludes the transaction that was deliberately rolled back. A separate restored database
contains the expected `11` requests and both migration-history rows, with no content table.

The forward migration stores only HMAC-SHA-256 intent and normalized-payload material under a
dedicated environment-scoped secret. The raw key, submitted values, notice version, secrets,
derived hashes and public reference are explicitly rejected from application and database audit
evidence. The runtime cannot read or directly mutate either private request table and receives only
schema usage plus execution of the bounded `SECURITY DEFINER` operation.

## Corrected attempts

- A restricted-sandbox full verification stalled when a governed test spawned its loopback child.
  The approved unrestricted rerun completed the child-process and browser chain.
- An unrestricted verification attempt initially used system Python without the repository-pinned
  `fontTools`. The passing run selected the existing hash-locked disposable asset-tool environment.

These were execution-environment setup failures, not product-test failures. No corrected attempt
processed real appointment data, enabled collection, contacted a provider or used remote
persistence.

## Remaining review boundary

Hosted exact-head CI, reviewer tracking and explicit controlled client acceptance are required
before B03-016 can become Done. `B03-011`, `APPT-01`, authentic `CARE-01`/`CARE-04` selectors,
lawful-basis and public-notice approval, named recipients and staff access, `SEC-02`,
`B03-017`–`B03-019`, formal `DEL-01`, remote infrastructure, personal-data collection, providers,
production and publication remain gated.
