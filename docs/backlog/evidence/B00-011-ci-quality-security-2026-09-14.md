# `B00-011` CI Quality and Security Completion Record — 14 September 2026

**Classification:** Sanitized, non-sensitive controlled-development evidence

**State:** Done for controlled development; repository implementation and hosted `T1` run pass.
Technical merge enforcement remains a separate `B00-012` control.

**Responsible:** Client workspace identity `befikadusata` directing Codex in the temporary Delivery role

**Acceptance:** Same identity for controlled-development implementation and hosted execution; named
Delivery, QA, and Security acceptance remains open at the production boundary

## Artifact and boundary

- Preparation baseline: commit `249e2a4` (`chore: complete B00-006 environment boundary`).
- Hosted implementation artifact: commit `f84b3eb` on pull request
  [`#1`](https://github.com/dynamicet/hallelujah-website/pull/1), based on `249e2a4` on remote `main`.
- Target: local `T0` verification and clean GitHub Actions `T1` execution in the selected private
  repository.
- The stable hosted run passed. A read-only branch-protection request returned HTTP 403 with GitHub's
  plan requirement to upgrade or make the private repository public. No protection setting, billing,
  visibility, deployment, or remote artifact-retention setting was changed.
- On 14 September 2026 the client confirmed that paying for a GitHub plan and making the repository
  public are both unavailable. GitHub's documented capability boundary was rechecked. `B00-011` was
  normalized to own CI execution and evidence; `B00-012` continues to own branch enforcement.
- No real credential, personal data, database connection, provider activation, legacy state,
  hospital content, migration, container, DNS/TLS change, or publication authority was introduced.

## Executed evidence

| Check | Exact command / method | Actual result |
| --- | --- | --- |
| Runtime/toolchain | Pinned command session | Passed: Node.js `24.21.0`, pnpm `10.27.0` |
| Full local gate | `pnpm verify` | Passed format/JSON, CI policy and negative controls, repository links, current-tree secret scan, backlog integrity, introduction gates, lint, strict types, application tests, build, accessibility, budgets, and runtime checks |
| CI control negative cases | Included in `pnpm verify` | Six isolated mutations proved read-only workflow policy, merge-procedure retention, secret detection/redaction, local links, JSON format, and migration introduction fail closed |
| Backlog audit | Included in `pnpm verify` | Passed 10/10; 264 clone-contained backlog links checked and 22 inherited workspace links reported separately |
| Repository links | Included in `pnpm verify` | Passed 820 clone-contained links; 77 inherited workspace references reported outside the clean-repository boundary |
| Static analysis | Included in `pnpm verify` | ESLint passed for application source, CI/audit scripts, and ESLint configuration with zero warnings |
| Application tests | Included in `pnpm verify` | Bootstrap boundary and environment contract negative/redaction/startup cases passed |
| Production build | Included in `pnpm verify` | Next.js `16.3.5` compiled and generated `/`; `/health` remained dynamic; CMS routes remained absent |
| Accessibility smoke | Included in `pnpm verify` | One implemented prerendered template passed bounded semantic checks; no conformance claim |
| Asset/request budgets | Included in `pnpm verify` | `/` used 133,482 compressed modern JS bytes, 136,087 initial compressed bytes, seven initial requests, and zero external origins |
| Runtime smoke | Included in `pnpm verify` | Loopback `/health`, bootstrap HTML, CSP, referrer, content-type, and powered-by-header checks passed using generated synthetic values |
| Current/history secret scan | `pnpm secrets:check --history` | 192 current text files plus reachable history passed; output policy redacts any future match |
| Dependency audit | `pnpm audit:dependencies` | Full dependency graph: no known vulnerabilities found at the moderate-or-higher blocking threshold |
| Migration/container gate | Included in `pnpm verify` | Neither capability exists; unauthorized introduction remains fail-closed and no scan capability is claimed |
| Clean reconstruction | `pnpm rebuild:verify` | Passed with 543 cached packages and zero downloads; full lockfile SHA-256 `02377eceb46d753972dd52453b007b992626e54d443995a2044e7ce4406f784f`; workspace importer SHA-256 `05665f37f00b97a0173a35343b11f77ec7f61b092ee0e82903c5aa9a6b3ff1d0` |
| Hosted `T1` pull-request run | [`quality-and-security`](https://github.com/dynamicet/hallelujah-website/actions/runs/34784880797) on `f84b3eb` | Passed every step in 1 minute 37 seconds, including frozen install, fail-closed controls, reachable-history secret scan, dependency audit, full verification, and clean reconstruction |
| Required-check availability | Read-only GitHub branch-protection API request for private `main` | Blocked: HTTP 403 states that GitHub Pro or public repository visibility is required; no repository setting was changed |

The first dependency-audit attempt could not reach the registry from the restricted sandbox; its
warning-only output was not accepted as evidence. The audit was rerun with approved network access
and returned `No known vulnerabilities found`. The first runtime smoke could not bind loopback in
the restricted sandbox; it passed with explicit loopback permission. These were execution-sandbox
constraints, not application failures.

The first hosted run on `4d2c182` completed all assertions but remained active because the runtime
smoke terminated only the package-manager parent and left the Next.js child alive. It was cancelled
through the workflow concurrency policy after `f84b3eb` changed cleanup to terminate the complete
process group and verify that the loopback listener stops. A pinned local regression run exited in
3.91 seconds, the complete local gate passed, and the corrected hosted run passed in 1 minute 37
seconds.

## Workflow controls observed in hosted execution

- pull-request and `main` push triggers only;
- read-only `contents` token permission, no repository secret reference, no privileged trigger;
- commit-SHA-pinned checkout/setup actions and exact Node.js/pnpm activation;
- full history credential scan, full dependency audit, complete local-equivalent verification, and
  isolated clean reconstruction;
- one stable `quality-and-security` job name, observed on the successful hosted run, for later
  required-check enforcement;
- no artifact upload and no restricted evidence workflow.

## Honest residual gates and compensating control

- During controlled development, every change follows a pull request and may merge only after the
  `quality-and-security` result succeeds for its current head commit. A direct push, bypassed check,
  or failing `main` run stops dependent work and is corrected or reverted through a checked pull
  request. This procedure is recorded in `CONTRIBUTING.md` and the pull-request template.
- This control cannot technically prevent an authorized GitHub administrator from bypassing it on
  the current private/free plan. Branch protection and review/deployment controls remain governed by
  `B00-012`; no paid-plan, public-repository, or merge-protection claim is made.
- Add real migration validation only after `B00-008`/`B00-009`; add an approved container scanner,
  SBOM, and image tests only when the container implementation is authorized.
- Expand the current static semantic check to browser/axe, keyboard, responsive, preference,
  no-JavaScript, state, and route coverage as production UI is implemented under `B07-001` and the
  route tickets.
- Named Delivery, QA, and Security people remain required before production acceptance.

## Promotion record

| Field | Value |
| --- | --- |
| Ticket | `B00-011` |
| Old / new status | Proposed / unblocked → In progress → Done for controlled development |
| Responsible / acceptance | Temporary client workspace identity / same identity for controlled-development implementation; named production acceptance open |
| Date / timezone | 14 September 2026 / Africa/Addis_Ababa (`UTC+03:00`) |
| Dependency evidence | `B00-004`–`B00-006`; working `B00-015`/`B00-016`; `ARCH-04` |
| Target | `T0` local and private-repository `T1` hosted execution |
| Remaining completion evidence | None for the `B00-011` controlled-development boundary; named production acceptance remains a later gate |
| Next unlock | `B00-011` dependency is satisfied; `B00-012` remains blocked by its own ownership and technical-control constraints |

This is controlled-development completion evidence and a hosted-CI pass. It is not merge-protection
proof, production readiness, provider approval, personal-data authority, security certification, or
release approval.
