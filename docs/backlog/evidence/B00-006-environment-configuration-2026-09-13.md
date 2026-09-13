# `B00-006` Environment Configuration Completion Record — 13 September 2026

**Classification:** Sanitized, non-sensitive controlled-development evidence

**Execution window:** Completed 13 September 2026 at 23:42 Africa/Addis_Ababa (`UTC+03:00`)

**Responsible:** Client workspace identity `befikadusata` directing Codex in the temporary DevOps role

**Acceptance:** Same client identity at the controlled-development boundary; named DevOps and Security acceptance remains required before production

## Artifact and boundary

- Preparation baseline: commit `555ff33` (`chore: complete B00-005 toolchain baseline`).
- Implementation artifact: the commit containing this record, prepared from the controlled working
  tree based on `555ff33`.
- Target: controlled `T0` local development. Staging/production names and rules are contracts only;
  no remote environment or real value was created.
- Server environment schema SHA-256:
  `395bdde3647246ae961e8aeb7dac13b3aaa1b5d7b818569e4c592dd615ad073f`.
- Names-only example SHA-256:
  `e676d69d84c67ca3519200f3262895a05771b53accdcd6cb3e723b45831b2308`.
- No database was contacted or provisioned. No real credential, personal data, provider request,
  legacy configuration, deployment, DNS/TLS change, public route, or publication authority was introduced.

## Executed evidence

| Check | Exact command / method | Actual result |
| --- | --- | --- |
| Runtime/toolchain | Pinned Node.js and pnpm invocation | Passed: Node.js `24.21.0`, pnpm `10.27.0` |
| Environment schema | `pnpm test` | Passed valid local/staging/production, missing/unknown environment, cross-scope, database mismatch/protocol/credential, disabled-gate, short-secret, output-redaction, and server-start-hook cases |
| Missing actual configuration | `pnpm --dir apps/web config:check` with no environment values | Correctly failed closed with only three missing variable names/requirements and exit code 1 |
| Synthetic actual configuration | Same command with controlled synthetic local process values | Passed; output disclosed only `local`, personal data `disabled`, and external services `disabled` |
| Full application verification | `pnpm verify` | Passed toolchain policy, ESLint, TypeScript, boundary/environment tests, and Next.js `16.3.5` production build |
| Secret-free build | Included in `pnpm verify` with no runtime credential values | Passed; `/`, `/_not-found`, and `/health` only; no credential was required or baked into the build command |
| Local startup | `pnpm dev --hostname 127.0.0.1` with controlled synthetic local process values | Configuration passed and Next.js became ready on loopback |
| Runtime health | Local `GET http://127.0.0.1:3000/health` | Passed HTTP 200 with `{"scope":"local-bootstrap","status":"ok"}`; server then stopped |
| Frozen reconstruction | `pnpm rebuild:verify` | Passed in an isolated copy: 543 reused packages, zero downloads, full verification and production build |
| Full graph identity | Rebuild verifier | Lockfile SHA-256 `02377eceb46d753972dd52453b007b992626e54d443995a2044e7ce4406f784f` |
| Workspace importer identity | Rebuild verifier | Importer graph SHA-256 `05665f37f00b97a0173a35343b11f77ec7f61b092ee0e82903c5aa9a6b3ff1d0` |
| Example/source boundary | `pnpm test` plus manual changed-file review | Exact names-only inventory; centralized server access; no `NEXT_PUBLIC_*`, credential value, personal data, or restricted evidence |
| Backlog integrity after promotion | `node docs/backlog/audit-backlog.mjs` | Passed 10/10 assertions across 137 tickets, 62 requirements, 32 decisions, 7 architecture records, 15 route rows, and 278 local links |

The first local server bind was denied by the workspace sandbox. The same loopback-only startup and
health request passed after explicit local-bind permission. The first isolated rebuild was similarly
denied write access to pnpm's user-level project metadata; it passed after the existing verifier was
rerun with that filesystem permission. These were sandbox constraints, not application defects.

Next.js `16.3.5` generated `apps/web/AGENTS.md` and `apps/web/CLAUDE.md` during the runtime smoke.
They contain only the framework-managed instruction to use the version-matched bundled documentation
and are retained so ordinary development startup does not repeatedly dirty the worktree.

## Security disposition

- Generic reusable `DATABASE_URL` and `PAYLOAD_SECRET` access was removed. The selected environment
  reads only its `LOCAL_*`, `STAGING_*`, or `PRODUCTION_*` pair, and any populated non-selected pair
  is rejected.
- The URL must use PostgreSQL, include credentials, and select the exact environment-named content
  database. Payload secrets must contain at least 32 bytes.
- Personal-data collection and external services remain mandatory `disabled` gates. No schema value
  can currently enable them.
- Errors report controlled variable names and rules only. Tests prove supplied database URLs and
  secret values do not occur in errors.
- `dev`, `start`, the Next.js server-start hook, and Payload configuration all invoke the contract.
  A build remains runtime-secret-free so the same artifact can later be promoted under separately
  approved runtime injection.

## Honest residual gates

- Named DevOps and Security people must accept actual staging/production supply, permissions,
  rotation cadence, identity/emergency-access mechanism, and evidence before production acceptance.
- `B00-007` remains deferred; no provider, staging placement, secret store, or host is selected here.
- `B00-008` must define and prove separate least-privilege database roles before provisioning or data use.
- `B00-011` must run the checks remotely and establish required CI gates; this record is local evidence.
- `B00-012` controls protected deployment and production approval. `B00-014`/`SEC-02` and all personal-data
  decisions remain closed to activation.

## Promotion record

| Field | Value |
| --- | --- |
| Ticket | `B00-006` |
| Old / new status | Proposed / unblocked → In progress → Done for controlled local development |
| Responsible / acceptance | Temporary client workspace identity / same identity at controlled-development boundary |
| Date / timezone | 13 September 2026 / Africa/Addis_Ababa (`UTC+03:00`) |
| Dependency evidence | `B00-004`, `DEP-002`, working `B00-015`/`B00-016`, `ARCH-03` |
| Target | `T0`; schema/runbook definitions only for later staging/production |
| Next unlock | `B00-011` controlled local/CI implementation brief; `B00-008`–`B00-010` remain blocked by deferred infrastructure and data gates |

This is technical completion evidence for controlled development. It is not production readiness,
provider approval, personal-data authority, publication approval, or hospital security acceptance.
