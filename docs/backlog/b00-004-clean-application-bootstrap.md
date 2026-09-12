# `B00-004` Clean Application Bootstrap

**Preparation state:** Proposed — execution brief prepared 13 September 2026, Africa/Addis_Ababa  
**Execution authority:** Not yet granted; named responsible and acceptance people plus the exact package-manager command are required before promotion to `Ready`  
**Publication, production, personal-data collection, provider activation, legacy migration, and DNS authority:** Not granted

| Field | Value |
| --- | --- |
| Epic | `00` |
| Lane | `DELIVERY` |
| Priority | `P0` |
| Phase / milestone | Phase 0 / `M0` |
| Status | `Proposed` |
| Responsible owner | Pending named person — Delivery Lead role |
| Acceptance owner | Pending named person — Security role |
| Target environment | `T0` isolated local checkout; clean `T1` CI only after its execution path is approved |
| Routes / sections | No public route or page slice is authorized; bootstrap health/startup surface only |
| Requirements | `S-001`; repository-level support for `G-003`, `G-005`–`G-013` is prepared but not claimed complete |
| Benchmark applications | None — repository bootstrap does not implement a page, component, content, or benchmark behavior |
| Decisions / gates | `ARCH-01`, `ARCH-03`; `SEC-01` is satisfied only for an isolated local clean rebuild under `DEP-003` and returns before production |
| Parent / dependencies | `B00-002` deferred at the production boundary; working `B00-016` matrix; `DEP-002`–`DEP-004`; unlocks `B00-005`, `B00-006`, and later `B00-011` |
| Evidence destination | Sanitized non-sensitive results under `docs/backlog/evidence/`; restricted evidence remains outside the repository under the deferred `B00-015` baseline |

## Outcome

Create the smallest clean production-application skeleton for the approved Next.js, Payload CMS, and TypeScript platform while retaining this documentation as the authority. A fresh isolated checkout must be able to install, build, and start without importing executable or configuration state from the legacy WordPress system, enabling an external provider, accepting personal data, or shipping prototype fixtures.

## Readiness blockers

The following fields must be resolved in one dated execution-board update before this ticket may move to `Ready` or application files may be generated:

1. Record the full name and confirmed authority of the responsible Delivery person.
2. Record the full name and confirmed authority of the accepting Security person.
3. Record the exact bootstrap package-manager command. The initial choice may be made for bootstrapping, but version pinning, compatibility/security rationale, drift enforcement, and update policy remain `B00-005` scope.
4. Confirm the allowed application layout and exact generated-file boundary in the AI-assisted coding brief below.

## Scope

Once promoted to `Ready`, this ticket may change only:

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

- [ ] Clean install from a fresh isolated checkout
- [ ] Successful initial build
- [ ] Successful local startup with empty or synthetic local state
- [ ] Missing required local configuration fails closed
- [ ] Optional/unapproved provider configuration is absent and creates zero requests
- [ ] No JavaScript does not expose invented public content or a false readiness claim
- [ ] Stop/restart leaves the minimal local environment recoverable

## Quality and security checks

- [ ] TypeScript strictness is enabled without suppressing bootstrap errors.
- [ ] Production source has no dependency or import path into prototype studies.
- [ ] Lockfile is committed; deeper version policy and drift enforcement remain `B00-005`.
- [ ] Example configuration contains names and safe local defaults only—no secrets or production values.
- [ ] Dependency install/build/start completes without contacting application-level third-party services; package-registry access during dependency installation is recorded separately and is not application runtime authority.
- [ ] Secret and sensitive-fixture scan passes on the changed source and sanitized output.
- [ ] Initial production build output is inspected for prototype fixtures, remote origins, source maps containing restricted values, and accidental environment disclosure.
- [ ] `docs/` remains intact and local Markdown links pass the backlog audit.

## Verification plan

The final command strings are a readiness field, not an implementation-time invention. Replace each `<package-manager>` placeholder in the same change that promotes the ticket to `Ready`.

| Method | Exact command/session before `Ready` | Expected artifact | Evidence location |
| --- | --- | --- | --- |
| Backlog integrity | `node docs/backlog/audit-backlog.mjs` | All assertions pass | Sanitized terminal result in the `B00-004` completion record |
| Clean dependency install | `<package-manager> clean-install-command` | Successful install from committed lockfile | Sanitized `T0`/`T1` log or summary |
| Static/lint/type | `<package-manager> lint-command` and `<package-manager> typecheck-command` | Zero errors | Sanitized `T0`/`T1` summary |
| Production build | `<package-manager> build-command` | Successful production build | Sanitized `T0`/`T1` summary |
| Local startup | `<package-manager> start-command` plus documented local service command(s) | Healthy minimal bootstrap surface | Sanitized manual session record |
| Boundary scan | Repository import, fixture, remote-origin, secret, and sensitive-value checks defined during implementation | No prohibited material or unapproved runtime request | Sanitized `B00-004` completion record |
| Browser/accessibility | Minimal semantic smoke only; route-level conformance is not claimed | No serious/critical automated finding on the bootstrap surface | Sanitized `T0`/`T1` summary |

## AI-assisted coding brief

```text
Implement B00-004 only after the execution board records it as Ready.

Allowed repository scope:
- Root application/workspace manifests, lockfile, runtime declaration, ignore rules, and contributor metadata explicitly listed in the Ready promotion.
- The approved minimal production application directory.
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
- [replace with exact clean-install, lint, typecheck, build, start, boundary-scan, and smoke commands before Ready]

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
| Responsible person | Pending |
| Acceptance person | Pending |
| Authority confirmation | Pending |
| Promotion date / timezone | Pending |
| Exact allowed application layout | Pending |
| Exact command set | Pending |
| Dependency evidence | `DEP-003` isolated clean-rebuild boundary plus working `B00-016` matrix |
| Target environment | `T0` isolated local; approved clean `T1` CI only |
| Issue / evidence link | This brief; completion record added after implementation |

