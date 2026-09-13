# `B00-011` CI Quality and Security Interim Record — 14 September 2026

**Classification:** Sanitized, non-sensitive controlled-development evidence

**State:** Repository implementation verified locally; hosted `T1` run and required-check evidence pending

**Responsible:** Client workspace identity `befikadusata` directing Codex in the temporary Delivery role

**Acceptance:** Same identity for repository-local implementation; named Delivery, QA, and Security
acceptance plus hosted required-check evidence remain open

## Artifact and boundary

- Preparation baseline: commit `249e2a4` (`chore: complete B00-006 environment boundary`).
- Implementation artifact: the future commit containing this interim record, prepared from the
  controlled working tree based on `249e2a4`.
- Target: local `T0` verification and a committed definition for clean GitHub Actions `T1` execution.
- No Git remote is configured in this checkout; no push, hosted run, status-check configuration,
  branch protection, deployment, or remote artifact was created or tested.
- No real credential, personal data, database connection, provider activation, legacy state,
  hospital content, migration, container, DNS/TLS change, or publication authority was introduced.

## Executed evidence

| Check | Exact command / method | Actual result |
| --- | --- | --- |
| Runtime/toolchain | Pinned command session | Passed: Node.js `24.21.0`, pnpm `10.27.0` |
| Full local gate | `pnpm verify` | Passed format/JSON, CI policy and negative controls, repository links, current-tree secret scan, backlog integrity, introduction gates, lint, strict types, application tests, build, accessibility, budgets, and runtime checks |
| CI control negative cases | Included in `pnpm verify` | Five isolated mutations proved read-only workflow policy, secret detection/redaction, local links, JSON format, and migration introduction fail closed |
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

The first dependency-audit attempt could not reach the registry from the restricted sandbox; its
warning-only output was not accepted as evidence. The audit was rerun with approved network access
and returned `No known vulnerabilities found`. The first runtime smoke could not bind loopback in
the restricted sandbox; it passed with explicit loopback permission. These were execution-sandbox
constraints, not application failures.

## Workflow controls prepared for hosted execution

- pull-request and `main` push triggers only;
- read-only `contents` token permission, no repository secret reference, no privileged trigger;
- commit-SHA-pinned checkout/setup actions and exact Node.js/pnpm activation;
- full history credential scan, full dependency audit, complete local-equivalent verification, and
  isolated clean reconstruction;
- one stable `quality-and-security` job name for later required-check enforcement;
- no artifact upload and no restricted evidence workflow.

## Honest residual gates

- Commit the implementation into the selected GitHub repository and record a successful hosted
  `quality-and-security` run for that exact revision.
- Configure and demonstrate merge blocking with the stable check. Branch protection and review/
  deployment controls remain governed by `B00-012`.
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
| Old / new status | Proposed / unblocked → In progress |
| Responsible / acceptance | Temporary client workspace identity / same identity for local implementation; hosted and named acceptance open |
| Date / timezone | 14 September 2026 / Africa/Addis_Ababa (`UTC+03:00`) |
| Dependency evidence | `B00-004`–`B00-006`; working `B00-015`/`B00-016`; `ARCH-04` |
| Target | `T0` local and committed `T1` definition |
| Remaining completion evidence | Hosted run URL/check identity and controlled required-check blocking result |
| Next unlock | None yet; `B00-012` remains blocked until `B00-011` completes and its own ownership gates are met |

This is interim technical evidence. It is not a hosted-CI pass, merge-protection proof, production
readiness, provider approval, personal-data authority, security certification, or release approval.
