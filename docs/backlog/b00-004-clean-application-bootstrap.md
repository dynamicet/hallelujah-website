# `B00-004` Clean Application Bootstrap

**Preparation state:** Done for controlled local development on 13 September 2026, Africa/Addis_Ababa
**Execution authority:** Client workspace identity `befikadusata`; Codex acted as the scoped implementation agent, while named production responsibility and acceptance remain deferred
**Publication, production, personal-data collection, provider activation, legacy migration, and DNS authority:** Not granted

| Field | Value |
| --- | --- |
| Epic | `00` |
| Lane | `DELIVERY` |
| Priority | `P0` |
| Phase / milestone | Phase 0 / `M0` |
| Status | `Done` for controlled local development; production acceptance deferred |
| Responsible owner | Client workspace identity `befikadusata` directing Codex in the temporary Delivery role |
| Acceptance owner | Client workspace identity `befikadusata` at the temporary controlled-development boundary; named Security acceptance remains required before production |
| Target environment | `T0` isolated local checkout; clean `T1` CI only after its execution path is approved |
| Routes / sections | No public route or page slice is authorized; bootstrap health/startup surface only |
| Requirements | `S-001`; repository-level support for `G-003`, `G-005`–`G-013` is prepared but not claimed complete |
| Benchmark applications | None — repository bootstrap does not implement a page, component, content, or benchmark behavior |
| Decisions / gates | `ARCH-01`, `ARCH-03`; `SEC-01` is satisfied only for an isolated local clean rebuild under `DEP-003` and returns before production |
| Parent / dependencies | `B00-002` deferred at the production boundary; working `B00-016` matrix; `DEP-002`–`DEP-004`; unlocks `B00-005`, `B00-006`, and later `B00-011` |
| Evidence destination | Sanitized non-sensitive results under `docs/backlog/evidence/`; restricted evidence remains outside the repository under the deferred `B00-015` baseline |

## Outcome

Create the smallest clean production-application skeleton for the approved Next.js, Payload CMS, and TypeScript platform while retaining this documentation as the authority. A fresh isolated checkout must be able to install, build, and start without importing executable or configuration state from the legacy WordPress system, enabling an external provider, accepting personal data, or shipping prototype fixtures.

## Execution authorization and remaining owner gate

The client directed the prepared brief to be committed and execution to proceed on 13 September 2026. This dated instruction authorizes only the `T0` local clean-bootstrap scope and records the authenticated workspace identity instead of inventing a personal name. The following fields still return before production acceptance:

1. Record the full name and confirmed authority of the responsible Delivery person.
2. Record the full name and confirmed authority of the accepting Security person.
3. Complete `B00-005` version compatibility/security rationale, clean-install reproduction, drift enforcement, and update policy.

The authorized layout is `apps/web/` with root pnpm workspace/command manifests and repository contribution metadata. The command set is `pnpm install --frozen-lockfile`, `pnpm dev`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`, `pnpm start`, `pnpm verify`, and `node docs/backlog/audit-backlog.mjs`.

## Scope

The client-authorized execution changed only:

- root application and workspace manifests, lockfile, supported-runtime declaration, ignore rules, and contributor-facing repository metadata;
- a bounded production application directory containing the minimal Next.js, Payload CMS, and TypeScript skeleton;
- local-only service orchestration needed to start that skeleton without remote providers or real data;
- repository ownership, contribution guidance, and issue/pull-request templates;
- this ticket, the execution board, and sanitized `B00-004` evidence.

The implementation must preserve `docs/` as authoritative project documentation. It may link to visual studies as references, but production source must not import from `docs/visual-design/` or treat screenshots, fixtures, or prototype behavior as runtime assets.

## Explicit exclusions

- No executable, plugin, theme, database dump, upload, secret, account, configuration, or generated artifact from the legacy WordPress system.
- No production or staging provisioning, DNS/TLS change, deployment, migration, backup, monitoring, or provider activation.
- No database separation, production database role, content model, editorial workflow, appointment field, form submission, or personal-data collection.
- No analytics, maps, chat, replay, pixels, autocomplete, remote fonts/media, email, storage, monitoring, or other external request.
- No public hospital route, clinical or operational fact, contact detail, schedule, claim, translation, consent/privacy text, brand asset, or plausible placeholder.
- No copied prototype HTML/CSS/JavaScript, reviewer toolbar, fixture query control, simulated outcome, fictional record, or remote prototype asset.
- No claim that the versions are supported, secure, or reproducibly pinned beyond the initial lockfile; that determination belongs to `B00-005`.

## Source contract

Use these sources in authority order:

1. [Execution board and controlled clean-rebuild boundary](execution-board.md#current-execution-verdict)
2. [Working implementation acceptance matrix](../validation/implementation-acceptance-matrix.md#1-decision-boundary)
3. [Epic 0 approved architecture baseline](../architecture/epic-0-technical-foundation.md#approved-baseline)
4. [`B00-004` backlog outcome](epic-00-governance-foundation.md#backlog)
5. [Project dependency, risk, and assumption registers](b00-003-project-control-registers.md)
6. [Prototype-to-production boundary](../visual-design/handoff/developer-handoff.md#3-prototype-to-production-boundary)
7. [Security and privacy baseline](../visual-design/handoff/developer-handoff.md#11-security-and-privacy-baseline)

If implementation requires an unapproved package beyond the minimal Next.js/Payload/TypeScript bootstrap, a remote service, legacy material, real content, personal data, or a public environment, stop and return the ticket to `Proposed` or `Blocked` with the exact gate.

## Acceptance criteria

1. **Given** a fresh isolated checkout on the documented supported local runtime, **when** the documented install and build commands run, **then** the initial build passes from the committed manifest and lockfile without legacy files, production secrets, or external service credentials.
2. **Given** the documented local startup command, **when** the minimal application and any required local-only service start, **then** startup succeeds with synthetic or empty local state and makes zero requests to unapproved external origins.
3. **Given** an absent optional provider, production secret, real content source, or personal-data configuration, **when** the application starts, **then** it remains within the minimal bootstrap surface or fails closed with a non-sensitive actionable message; it must not silently connect, collect, or substitute plausible content.
4. **Given** the production source tree, **when** imports and shipped assets are inspected, **then** none resolve into `docs/visual-design/`, legacy WordPress material, reviewer tools, fictional records, fixture controls, or remote prototype assets.
5. **Given** the repository documentation, **when** a new contributor follows it, **then** repository layout, documentation authority, ownership, contribution flow, supported runtime, and one command per local service are unambiguous.
6. **Given** missing JavaScript in a browser or missing page/content implementation, **when** the bootstrap surface is requested, **then** it makes no false public-site, content, accessibility, or publication claim. Page-level progressive enhancement belongs to later route tickets.
7. **Given** repository and dependency scans, **when** sanitized evidence is produced, **then** no secret, personal data, restricted incident detail, private contact, signature, or production identifier enters source, logs, screenshots, or CI artifacts.

## State coverage

Page and journey states are outside this bootstrap ticket. The following repository/runtime states apply:

- [x] Clean install from a fresh isolated application copy
- [x] Successful initial build
- [x] Successful local startup with empty state
- [x] Missing application/provider configuration preserves the bounded bootstrap without connecting or collecting
- [x] Optional/unapproved provider configuration is absent and creates zero runtime requests
- [x] No JavaScript does not expose invented public content or a false readiness claim
- [x] Start/stop leaves the minimal local environment recoverable

## Quality and security checks

- [x] TypeScript strictness is enabled without suppressing bootstrap errors.
- [x] Production source has no dependency or import path into prototype studies.
- [x] Lockfile is committed; deeper version policy and drift enforcement remain `B00-005`.
- [x] Example configuration contains names and safe local defaults only—no secrets or production values.
- [x] Dependency install/build/start completes without contacting application-level third-party services; package-registry access during dependency installation is recorded separately and is not application runtime authority.
- [x] Secret and sensitive-fixture boundary scan passes on the changed source and sanitized output.
- [x] Initial production build output is inspected for prototype fixtures, remote origins, restricted values, and accidental environment disclosure.
- [x] `docs/` remains intact and local Markdown links pass the backlog audit in the controlled workspace.

## Verification plan

The client-directed execution records pnpm 10 and the following exact command interface. `B00-005` remains responsible for the final supported-version rationale and drift policy.

| Method | Exact command/session before `Ready` | Expected artifact | Evidence location |
| --- | --- | --- | --- |
| Backlog integrity | `node docs/backlog/audit-backlog.mjs` | All assertions pass | Sanitized terminal result in the `B00-004` completion record |
| Clean dependency install | `pnpm install --frozen-lockfile` | Successful install from committed lockfile | Sanitized `T0`/`T1` log or summary |
| Static/lint/type | `pnpm lint` and `pnpm typecheck` | Zero errors | Sanitized `T0`/`T1` summary |
| Production build | `pnpm build` | Successful production build | Sanitized `T0`/`T1` summary |
| Local startup | `pnpm dev` for development; `pnpm start` after `pnpm build` | Healthy minimal bootstrap surface and `/health` response | Sanitized manual session record |
| Boundary scan | Repository import, fixture, remote-origin, secret, and sensitive-value checks defined during implementation | No prohibited material or unapproved runtime request | Sanitized `B00-004` completion record |
| Browser/accessibility | Minimal semantic smoke only; route-level conformance is not claimed | No serious/critical automated finding on the bootstrap surface | Sanitized `T0`/`T1` summary |

## AI-assisted coding brief

```text
Implement B00-004 only within the client-directed In progress scope recorded on the execution board.

Allowed repository scope:
- Root application/workspace manifests, lockfile, runtime declaration, ignore rules, and contributor metadata explicitly listed in the Ready promotion.
- apps/web/ as the approved minimal production application directory.
- Local-only service orchestration required by the minimal bootstrap.
- Repository ownership, contribution, issue, and pull-request guidance.
- docs/backlog/b00-004-clean-application-bootstrap.md
- docs/backlog/execution-board.md
- docs/backlog/evidence/B00-004-clean-application-bootstrap-YYYY-MM-DD.md

Authoritative sources:
- docs/backlog/execution-board.md
- docs/backlog/epic-00-governance-foundation.md (B00-004 only)
- docs/architecture/epic-0-technical-foundation.md (ARCH-01, ARCH-03, ARCH-05, ARCH-07)
- docs/backlog/b00-003-project-control-registers.md (DEP-002 through DEP-005, RSK-002, RSK-008 through RSK-010, ASM-002, ASM-004, ASM-008)
- docs/validation/implementation-acceptance-matrix.md (T0/T1 and evidence rules)
- docs/visual-design/handoff/developer-handoff.md (prototype and security boundaries)

Required behavior:
- Fresh isolated checkout installs, builds, and starts using the exact Ready-state commands.
- Documentation remains authoritative and is not imported into production runtime code.
- No legacy executable/configuration state, prototype fixture, remote prototype asset, real content, personal data, production secret, or unapproved application-level provider request is present.
- Missing unapproved configuration fails closed without a false publication or readiness claim.

Run and report:
- node docs/backlog/audit-backlog.mjs
- pnpm install --frozen-lockfile
- pnpm lint
- pnpm typecheck
- pnpm test
- pnpm build
- pnpm start

Evidence to produce:
- Sanitized non-sensitive command summaries and a completion record under docs/backlog/evidence/.
- Record the environment, commit/artifact, expected/actual result, tester/date, and retest state.

Controlled fixtures:
- Only the minimum synthetic local state required for startup is allowed.
- It must be structurally incapable of appearing as hospital content and must not ship as a default public-site fixture.

Do not invent or enable clinical/operational facts, contacts, schedules, claims, translations, consent/privacy text, third parties, personal-data fields, public hospital routes, brand assets, unrelated packages, or destructive migrations. Do not copy prototype code or legacy WordPress state. Preserve unrelated work. Stop and report the exact gate if the contract cannot be completed within these boundaries. Passing this ticket means only that the clean local skeleton works; it does not approve a route, collection, provider, staging, production, DNS, or publication.
```

## Completion record requirements

When implementation finishes, add `docs/backlog/evidence/B00-004-clean-application-bootstrap-YYYY-MM-DD.md` with:

- exact build/commit and local environment;
- exact install, lint, type, build, start, boundary-scan, and smoke commands;
- expected and actual results;
- package-registry origins used during installation and confirmation of zero unapproved application runtime origins;
- confirmation that no legacy/prototype executable state, fixture content, personal data, secret, or restricted evidence was introduced;
- responsible tester/date and named acceptance-owner outcome;
- defects, exceptions, and retest state; and
- an explicit statement that publication, collection, provider, staging, production, migration, and DNS remain unauthorized.

## Promotion record

| Field | Required value before `Ready` |
| --- | --- |
| Responsible person | Client workspace identity `befikadusata`, directing Codex as scoped implementer; full production name pending |
| Acceptance person | Client workspace identity `befikadusata` for controlled development; named Security production acceptance pending |
| Authority confirmation | Client instruction: “commit and proceed” in the project workspace |
| Promotion date / timezone | 13 September 2026, Africa/Addis_Ababa |
| Exact allowed application layout | `apps/web/`; root pnpm manifests; root repository/contribution metadata; scoped backlog/evidence updates |
| Exact command set | `pnpm install --frozen-lockfile`; `pnpm dev`; `pnpm lint`; `pnpm typecheck`; `pnpm test`; `pnpm build`; `pnpm start`; `pnpm verify`; backlog audit |
| Dependency evidence | `DEP-003` isolated clean-rebuild boundary plus working `B00-016` matrix |
| Target environment | `T0` isolated local; approved clean `T1` CI only |
| Issue / evidence link | This brief; completion record added after implementation |

## Completion

The clean local application skeleton passed frozen-lockfile reconstruction, lint, strict type-checking, boundary checks, production build, startup, HTTP smoke checks, security-header inspection, and the controlled-workspace backlog audit. See the [13 September 2026 completion record](evidence/B00-004-clean-application-bootstrap-2026-09-13.md).

`B00-005` is now unblocked for the pinned-toolchain compatibility, security, drift, and update-policy work. This completion does not cross any production or publication boundary.
