# `B00-011` — CI Quality and Security Gates

**Status:** Done for controlled development; repository implementation, `T0` verification, and
hosted `T1` execution pass. Technical merge enforcement remains explicitly assigned to `B00-012`.

**Execution date:** 14 September 2026, Africa/Addis_Ababa

**Publication, provider activation, production, deployment, and personal-data authority:** Not granted

## Execution contract

| Field | Controlled execution value |
| --- | --- |
| Epic / lane / priority | Epic 00 / `DELIVERY` / `P0` |
| Phase / milestone | Phase 0 / `M0`–`M1` |
| Old / new status | Proposed / unblocked → In progress → Done for controlled development |
| Responsible owner | Client workspace identity `befikadusata` directing Codex in the temporary Delivery role |
| Acceptance owner | Same client identity for controlled-development implementation and hosted execution; named Delivery, QA, and Security people return at the production boundary |
| Target environment | `T0` isolated local validation and private-repository `T1` GitHub Actions execution |
| Requirements / decisions | `G-003`, `G-005`–`G-013`, `S-002`; `ARCH-04`; working `DEL-01` baseline |
| Dependencies | Completed `B00-004`–`B00-006`; working `B00-015` and `B00-016` development baselines |
| Allowed repository scope | GitHub Actions workflow, root command/configuration surface, bounded CI validation scripts, contributor/architecture/backlog documentation, control registers, and sanitized evidence |
| Benchmark applications | None — this ticket provides delivery controls rather than a page, user flow, content pattern, or benchmark-derived behavior |
| Evidence destination | [Sanitized completion record](evidence/B00-011-ci-quality-security-2026-09-14.md), including the hosted run and private-plan constraint |

The client's direction to start the execution, subsequent remote selection and remote-action
approvals, and 14 September 2026 direction that the repository remain private without a paid GitHub
plan authorize the private repository baseline, feature branch, pull request, hosted run, and the
controlled-development completion recorded here. They do not authorize making the repository
public, changing billing, retaining restricted reports, introducing a database migration or
container, enabling an application provider, deploying, collecting personal data, or publishing the
site.

## Outcome

Provide one stable, least-privilege GitHub Actions status check for pull requests and `main`, backed
by the same commands developers run locally. The check must reject toolchain drift, source-quality
failure, unsafe configuration, broken repository links, known dependency vulnerabilities at the
configured threshold or an incomplete registry response, credential signatures, unreproducible
builds, application test/build failure, bootstrap accessibility regressions, asset-budget
regressions, and runtime-header regressions.

## Implemented scope

- one `quality-and-security` job on pull requests and pushes to `main`, with concurrency cancellation,
  a 30-minute timeout, read-only repository permission, full history for secret scanning, and only
  commit-SHA-pinned `actions/checkout` and `actions/setup-node` actions;
- exact Node.js/pnpm activation and frozen dependency installation;
- repository-wide text/JSON hygiene, application and CI-script linting, strict TypeScript, existing
  boundary/environment tests, production build, repository/backlog local-link audits, current-tree
  and reachable-history credential-signature scans, and a moderate-or-higher full dependency audit;
- isolated negative mutations proving workflow-permission, merge-procedure, credential-redaction,
  broken-link, malformed-JSON, and premature-migration controls fail closed;
- static semantic accessibility smoke for each implemented prerendered application template;
- compressed transfer, modern first-party JavaScript, request-count, and external-origin smoke
  against the working `DEL-01` limits;
- loopback runtime health and security-header smoke using generated synthetic credentials, without a
  database connection or provider request;
- clean frozen reconstruction and repeat verification;
- fail-closed introduction gates: migrations remain prohibited until `B00-008`/`B00-009`, and
  container material remains prohibited until an approved scanner and container implementation are
  added. The current absence of those capabilities is reported as not applicable, not as a scan pass.

## Explicit exclusions and downstream controls

- The selected private GitHub repository, pull request, and hosted run are recorded in the completion
  evidence. GitHub rejected the read-only branch-protection inspection with HTTP 403 because the
  current plan does not enable protection for this private repository. The project therefore uses the
  explicit pull-request/current-head check procedure in `CONTRIBUTING.md` during controlled
  development. This is a compensating process control, not technical merge blocking.
- Branch protection, review ownership, dependency-update automation, build provenance, deployment,
  and rollback remain `B00-012`. That ticket must select an available technical control or retain the
  limitation as an accepted production risk; `B00-011` does not claim to solve it.
- The semantic HTML smoke is deliberately bounded to current prerendered templates. It is not an
  axe/browser, keyboard, screen-reader, contrast, responsive, no-JavaScript, or WCAG conformance
  claim. Those layers expand with `B07-001` and each implemented component/route.
- No migration exists, so migration execution/rollback is not claimed. No container exists, so image
  vulnerability scanning or SBOM generation is not claimed.
- CI logs are the only proposed non-sensitive machine evidence. No artifact upload or restricted
  evidence workflow is introduced while `B00-015` remains deferred.
- No real environment value, legacy state, hospital content, personal data, provider configuration,
  remote font/media, CMS route, or public route is introduced.

## Acceptance criteria

1. **Given** a pull request or push to `main`, **when** GitHub Actions evaluates the workflow,
   **then** one bounded, read-only `quality-and-security` job installs the exact frozen graph and runs
   all configured gates.
2. **Given** an action reference, privileged trigger, repository secret reference, write permission,
   missing required command, or mutable action version, **when** the CI policy check runs, **then** it
   fails before the workflow can be represented as compliant.
3. **Given** malformed JSON, unsafe text formatting, a broken in-repository Markdown target/anchor,
   source lint/type/test failure, or backlog-integrity drift, **when** verification runs, **then** the
   stable job fails with a non-sensitive location and reason.
4. **Given** a recognized credential signature in the current tree or reachable Git history,
   **when** scanning runs, **then** the job fails without printing the matched value.
5. **Given** a moderate-or-higher advisory in any installed dependency class, **when** the registry
   audit runs, **then** the job fails; registry unavailability must not be recorded as an audit pass.
6. **Given** the current bootstrap build, **when** accessibility and budget smoke run, **then** each
   implemented prerendered template has a language, title, viewport, one main and `h1`, valid IDs and
   accessible names, and remains within 1 MB compressed transfer, 150 KB compressed modern
   first-party JavaScript, 50 initial requests, and zero external initial origins.
7. **Given** generated synthetic local-only runtime values, **when** the built server starts on
   loopback, **then** `/health` and `/` return expected non-sensitive content and the configured CSP,
   referrer, content-type, and powered-by-header rules pass without contacting a database/provider.
8. **Given** migration or container material is introduced before its controlling implementation and
   scanner exist, **when** verification runs, **then** it fails closed rather than silently skipping.
9. **Given** a clean isolated copy, **when** the pinned graph is installed, **then** the lockfile and
   workspace importer identities match and the complete repository verification repeats successfully.
10. **Given** the workflow is committed to the selected private GitHub repository, **when** its pull
    request runs, **then** record a successful stable check for the current revision and require that
    result through the documented controlled-development merge procedure. Technical repository
    enforcement remains a separate `B00-012` acceptance concern.

## Verification plan

| Method | Exact command | Expected result |
| --- | --- | --- |
| Full local gate | `pnpm verify` | Toolchain, format, CI policy/negative controls, links, secret scan, backlog, introduction, lint, type, tests, build, accessibility, budgets, and runtime pass |
| History credential scan | `pnpm secrets:check --history` | Reachable Git history passes; any match is redacted |
| Dependency audit | `pnpm audit:dependencies` | Full graph has no moderate-or-higher known advisory |
| Clean reconstruction | `pnpm rebuild:verify` | Frozen graph identity and full gate repeat in an isolated copy |
| Hosted `T1` | Pull-request run of `quality-and-security` | Green run for the committed revision; durable run/check link recorded |
| Merge procedure review | Pull-request template plus `CONTRIBUTING.md` | Current-head success is required by procedure; the unavailable GitHub enforcement is stated without a false technical claim |

## Completion boundary

- [x] Exact repository commands and a least-privilege, immutable-action workflow are implemented.
- [x] Current source, build, template, budget, runtime, dependency, secret, and reconstruction checks
  pass locally with sanitized output.
- [x] Unsupported migration/container introduction fails closed.
- [x] No application provider, personal-data path, deployment, or publication boundary changed.
- [x] The committed revision runs successfully on GitHub-hosted `T1` infrastructure.
- [x] The private-plan limitation and current-head pull-request merge procedure are recorded; branch
  protection and technical merge blocking remain scoped to `B00-012`.
- [ ] Named Delivery, QA, and Security acceptance replaces the temporary development assignment at
  the applicable production boundary.

`B00-011` is Done for controlled development. The unchecked named-acceptance item is a production
gate, not an unimplemented CI capability. `B00-012` remains subject to its own ownership,
repository-control, deployment, and rollback dependencies.
