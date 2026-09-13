# Backlog Execution Board

**Status:** Active execution control  
**Basis date:** 14 September 2026
**Publication and collection authority:** Not granted

## Purpose

This board turns the planning baseline into a controlled pull system. It identifies what may start, what must wait, the exact order for M0, and the evidence needed to promote later work. Epic tables remain the scope authority; this board is the temporary status authority until an approved issue tracker replaces it.

`Ready` means work may begin within the stated scope. It never means that hospital facts are approved, personal-data collection is enabled, or a route may be published.

## Current execution verdict

- On 13 September 2026, the client directed that `B00-001`, `B00-002`, `B00-007`, `B00-014`, and `B00-015` be skipped for the current controlled implementation stage and returned to in Phase 2 or before production. Because `Skipped` is not an allowed backlog status, all five are recorded as `Deferred`.
- The deferral is a sequencing decision, not completion or approval of `GOV-01`, `SEC-01`, infrastructure, publication, collection, migration, DNS, provider activation, or release.
- Controlled local implementation may use temporary role labels, an isolated clean rebuild that imports no executable/configuration state from legacy WordPress, the provider-neutral infrastructure assumptions already recorded, and the minimum working baselines below for third parties and evidence handling.
- `B00-017` is complete. The `B00-016` working acceptance matrix is also complete and accepted for controlled development; the ticket is `Deferred` only at its formal production-signature boundary, while `DEL-01` remains unresolved for production. `B00-003`–`B00-006` and `B00-011` are complete for controlled development. `B00-011` has passing local and hosted gates. Because the repository must remain private and a paid GitHub plan is unavailable, current-head CI success is a documented manual merge control; technical branch enforcement remains honestly open under `B00-012`. Named Delivery, DevOps, QA, and Security people still return before production acceptance.
- Personal-data collection, external-provider requests, production provisioning, legacy migration, DNS cutover, and publication remain disabled.
- On 14 September 2026, client direction approved the [high-end motion and interactive-media amendment](../visual-design/motion/high-end-motion-and-interactive-media-amendment.md) for production planning. It supersedes the prototype-wide expressive ceiling but does not approve a runtime, footage, rights, third-party media host, implementation, or release. The next applicable design-system/Home pull must include its progressive layers, permanently stable contexts, and media acceptance evidence.

## Status authority and update rule

For every promotion, record the ticket ID, old/new status, responsible person, acceptance person, date/timezone, dependency evidence, target environment, and issue/evidence link. Update this board and the issue tracker in the same change. A role name alone cannot promote a delivery ticket to `Ready`.

If this board and an epic disagree, use the epic for scope and this board for live status. If either conflicts with a dated hospital decision, update all affected artifacts through the backlog change-control rule before work continues.

## M0 pull queue

| Order | Ticket | Status | Responsible / acceptance authority | Required before start | Completion evidence / next unlock |
| ---: | --- | --- | --- | --- | --- |
| 1 | `B00-001` | **Deferred** | Hospital Project Owner / Executive sponsor; names still required before production | Return before production acceptance or any formal hospital approval | Signed RACI plus sanitized pointer record; required for production governance |
| 2 | `B00-002` | **Deferred** | Named Security owner / Executive sponsor | Return before production migration, provisioning, DNS cutover, SEO recovery acceptance, or release | Incident closure or signed isolated clean-build decision; current work must use the documented clean-rebuild boundary |
| 3 | `B00-007` | **Deferred** | Named Delivery lead / Product, Security, and cost authorities | Return before remote staging/production provisioning or provider activation | Dated provider/environment selection; current work remains local and provider-neutral |
| 4 | `B00-014` | **Deferred** | Privacy and Security roles / Product authority before activation | Return in Phase 2, before any external-provider request or activation, or before production—whichever is earlier | Development baseline: default deny, local/first-party assets and behavior only; unapproved providers make zero requests |
| 5 | `B00-015` | **Deferred** | QA and Security roles / Product authority before production acceptance | Return in Phase 2, before restricted evidence must be created or moved, or before production—whichever is earlier | Development baseline: sanitized non-sensitive evidence only in repository/approved CI; restricted material stays outside the repository |
| 6 | `B00-016` | **Deferred** | QA role / Product and Security roles | Working matrix completed on 13 September 2026; return before formal production acceptance or on a documented change trigger | [Working acceptance matrix](../validation/implementation-acceptance-matrix.md) and [completion record](evidence/B00-016-working-acceptance-matrix-2026-09-13.md); `DEL-01` production closure remains open |
| 7 | `B00-017` | **Done** | Product role / Client executive authority; senior UI/UX architecture review | Complete—93 patterns and 120 candidates reviewed; existing dispositions approved unchanged on 13 September 2026 | [`B00-017` completion record](evidence/B00-017-benchmark-disposition-2026-09-13.md); reopen only on the documented change triggers |
| 8 | `B00-003` | **Done** | Temporary Product and Delivery roles / temporary QA role; named authorities return before production acceptance | Completed under the working `B00-016` matrix and `B00-015` baseline | [Project control registers](b00-003-project-control-registers.md) and [completion record](evidence/B00-003-project-control-registers-2026-09-13.md); audit passed 10/10 |
| 9 | `B00-004` | **Done** | Client workspace identity `befikadusata` directing Codex / same client identity at the temporary development boundary; named Delivery and Security people return before production | Completed under the working `B00-016` matrix and isolated clean-rebuild boundary | [Completion record](evidence/B00-004-clean-application-bootstrap-2026-09-13.md); clean local bootstrap passed without legacy executable/configuration import, application providers, personal data, or production claim |
| 10 | `B00-005` | **Done** | Client workspace identity `befikadusata` directing Codex / same identity at the controlled-development boundary; named Delivery and Security people return before production | Completed within the [extracted controlled-development scope](b00-005-pinned-toolchain.md) | [Completion record](evidence/B00-005-pinned-toolchain-2026-09-13.md); exact policy, frozen graph, advisory scan, application checks, and isolated rebuild passed; Docker host mismatch remains fail-closed before container work |
| 11 | `B00-006` | **Done** | Client workspace identity `befikadusata` directing Codex / same identity at the controlled-development boundary; named DevOps and Security people return before production | Completed within the [extracted controlled-development scope](b00-006-environment-configuration.md) | [Completion record](evidence/B00-006-environment-configuration-2026-09-13.md); environment-scoped values, startup/Payload validation, disabled gates, names-only example, and runbook passed local checks |
| 12 | `B00-008`–`B00-010` | Blocked | Named Backend/DevOps owners / Security owner | `B00-006`, `B00-007`; appointment gates where stated | Least-privilege database, migration, backup, and restore evidence |
| 13 | `B00-011` | **Done** | Client workspace identity `befikadusata` directing Codex / same identity for controlled-development implementation; named Delivery/QA/Security return before production | Complete—repository/local gates and hosted execution pass; manual current-head CI procedure records the private/free-plan constraint without claiming technical enforcement | [Execution brief](b00-011-ci-quality-security.md) and [completion evidence](evidence/B00-011-ci-quality-security-2026-09-14.md); branch enforcement remains `B00-012` |
| 14 | `B00-012`–`B00-013` | Blocked | Named Delivery/DevOps owners / QA and Security owners | `B00-011` is satisfied; deferred ownership/infrastructure/provider gates and an available `B00-012` enforcement approach remain | Deployment control and privacy-safe observability evidence |

The 13 September deferrals remove `B00-001`, `B00-002`, `B00-007`, `B00-014`, and `B00-015` from the current pull queue without closing their Phase 2, provider, restricted-evidence, or production gates. `B00-017`, `B00-003`–`B00-006`, and `B00-011` are complete at their recorded controlled-development boundaries. The working portion of `B00-016` is also complete and its production signature is deferred. `B00-011` records its repository gates, local evidence, successful hosted execution, and honest private/free-plan limitation. Technical merge enforcement is not claimed and remains in `B00-012`. Later orders follow their explicit dependencies and the documented non-production baselines; numeric order does not override them.

### `B00-005` — pinned toolchain

The [canonical toolchain policy](../../toolchain-versions.json) pins Node.js, pnpm, Next.js, Payload, TypeScript, PostgreSQL, Docker, official-image digests, and patched security overrides. Repository checks reject drift, expired support/review dates, non-exact application dependencies, mutable image references, and an incompatible active runtime. The isolated frozen reconstruction produced the same lockfile and workspace importer graph and repeated the full build. The current local Docker `29.2.1` does not meet the selected `29.8.0` baseline and remains fail-closed before container work. Remote workflow execution passed under `B00-011`; technical repository enforcement remains `B00-012`. See the [completion record](evidence/B00-005-pinned-toolchain-2026-09-13.md).

### `B00-006` — environment and secrets boundary

The [server configuration contract](b00-006-environment-configuration.md) selects exactly one local,
staging, or production credential scope; rejects non-selected scopes and environment-mismatched
content databases; validates Payload secret length; and keeps personal-data collection and external
services disabled. `dev`, `start`, Next.js server initialization, and Payload use the same redacted,
fail-closed boundary. The committed example contains names only, while the
[runbook](../architecture/environment-and-secrets.md) defines provider-neutral supply, rotation,
rollback, and emergency access. Local full verification, runtime smoke, and isolated reconstruction
passed; actual staging/production mechanisms and named acceptance remain deferred. See the
[completion record](evidence/B00-006-environment-configuration-2026-09-13.md).

### `B00-011` — CI quality and security gates

The [CI execution brief](b00-011-ci-quality-security.md) defines one read-only, bounded
`quality-and-security` job for pull requests and `main`. Local verification now covers the pinned
toolchain, formatting, immutable workflow policy, repository/backlog links, source and reachable
history secret signatures, lint/types/tests/build, bounded accessibility and asset budgets, runtime
health/security headers, the full dependency graph, and isolated reconstruction. Migration and
container introduction remain fail-closed because neither authorized capability exists. The
[completion evidence](evidence/B00-011-ci-quality-security-2026-09-14.md) records the successful
hosted run. The repository must remain private and the approved boundary excludes a paid GitHub
plan, so the current-head CI merge procedure is the controlled-development fallback. Technical
branch and review enforcement remains in `B00-012` and is not falsely claimed here.

## Deferred working baselines and completed benchmark decision

### `B00-014` — third-party register

The formal register decision is deferred to Phase 2 or production. Until it returns, the approved development baseline is **default deny**: local assets and first-party behavior only, with every external integration disabled. No browser, server, build, or CI request may be made to Cloudflare, maps, analytics, chat, replay/pixels, autocomplete, externally hosted fonts/media, email/form/recruitment services, monitoring, or storage providers. Reopen `B00-014` before any provider-specific integration or request is enabled.

### `B00-015` — evidence storage split

The formal storage selection is deferred to Phase 2 or production. Until it returns, the approved development baseline permits sanitized, non-sensitive build, lint, test, accessibility, and screenshot evidence in the repository or approved CI artifacts. Security reports, incident details, signatures, private contacts, credentials, and personal data must not be copied into the repository or public CI artifacts. Keep such material in its already authorized source system, if one exists, and use only a sanitized pointer; if no authorized restricted location exists, do not create or transfer the restricted artifact as part of development. Reopen `B00-015` before a restricted-evidence workflow is required and before production acceptance.

### `B00-016` — implementation acceptance matrix

The [working matrix](../validation/implementation-acceptance-matrix.md) is complete and binding for controlled development. It defines evidence tiers, rolling platform coverage, physical-device targets, viewports/zoom/forced colors, constrained performance, language/comprehension testing, security coverage, defect thresholds, evidence handling, acceptance roles, exceptions, and `BM-*` implementation proof. `B00-016` is deferred only for named production authorities, actual version/device inventory, restricted repository selection, executed release-candidate evidence, and `B07-016` authorization. See the [completion record](evidence/B00-016-working-acceptance-matrix-2026-09-13.md).

### `B00-017` — benchmark disposition

The existing map is approved unchanged as the binding benchmark-use baseline for controlled implementation: 93 cross-site patterns and 120 institution candidates were checked with no missing or duplicate IDs. External examples remain non-authoritative. Adopt/Adapt items guide implementation only within their stated gates; Test items require their listed evidence; Defer items remain outside scope; direct-copy rejections remain binding. Reopen only for a disposition conflict/change, a new benchmark candidate, evidence supporting promotion of a Test/Defer item, or a discovered safety, accessibility, privacy, language, operational, or architectural conflict. See the [completion record](evidence/B00-017-benchmark-disposition-2026-09-13.md).

## `B00-001` deferred production issue brief

Use the [ticket template](ticket-template.md) when creating the issue. The following fields are fixed for the first pull:

| Field | Execution value |
| --- | --- |
| Epic / lane / priority | Epic 00 / `DECISION` / `P0` |
| Phase / milestone | Phase 0 / `M0`; required before any delivery ticket is promoted |
| Status | `Deferred`; return before production readiness |
| Responsible owner | Hospital Project Owner / Focal Person; enter the authorized person's full name at task start |
| Acceptance owner | Hospital General Manager / CEO; enter the authorized person's full name before acceptance |
| Target environment | Documentation and hospital-controlled approval process only |
| Allowed repository scope | `hallelujah/docs/README.md`; `hallelujah/docs/validation/stakeholder-low-fidelity-validation.md`; `hallelujah/docs/backlog/`; owner references affected by the approved RACI |
| Requirements / decisions | `G-014`, `GOV-01` |
| Evidence destination | Sanitized pointer record under `hallelujah/docs/backlog/evidence/`; signed/contact-bearing source remains outside the repository under the deferred `B00-015` working baseline |
| Explicit exclusions | No approval of clinical facts, operations, contacts, privacy, security, brand, language, providers, collection, implementation, or release |

Acceptance requires:

1. Every temporary role in the named-participant register has an authorized person's full name, organization side, authority confirmation, and contact or an explicit documented vacancy/escalation.
2. Delegate/absence behavior, decision scope, review cadence, and approval-evidence format are recorded.
3. The downstream M0 queue names a responsible and acceptance person; unresolved assignments remain `Blocked`.
4. The sanitized evidence pointer identifies the approval date, approver, controlled source location, and affected document version without copying private contact/signature data.
5. `node hallelujah/docs/backlog/audit-backlog.mjs` passes after all affected references are updated.

## `B00-002` preparation state

Preparatory work began on 12 September 2026 against the existing public WordPress site. The [incident closeout package](b00-002-wordpress-incident-closeout.md) records the clean-rebuild boundary, sanitized public-surface comparison, restricted investigation checklist, credential-rotation scope, search-recovery work, and closure evidence required. The current public sitemap is materially cleaner than the 7 September audit baseline, but public checks cannot prove eradication or authorize closure.

The ticket is `Deferred — production gate`: no named Security responsible person or Executive acceptance person is recorded, and authenticated hosting, CMS, database, log, identity, Search Console, and backup evidence is unavailable.

For sequencing only, the client directed on 13 September 2026 that this ticket be skipped during controlled implementation and returned to before production. This permits an isolated clean rebuild; it does not change `B00-002` to `Done`, designate the legacy source as trusted, or authorize legacy migration, production provisioning, collection, DNS cutover, or publication.

## `B00-007` preparation state

The [partial infrastructure selection](b00-007-infrastructure-selection.md) records Linux, a local-provider preference, Cloudflare planning, prototype-local media, no PostgreSQL media extension, and MinIO as a conditional production candidate. Provider, region, exact Linux release, staging, capacity, email, backup, RPO/RTO, costs, and approvals remain open until prototype evidence or operational requirements exist.

The ticket is `Deferred — production gate` and does not authorize remote staging/production provisioning or third-party activation. Its recorded direction is sufficient for local, provider-neutral implementation and avoids prematurely coupling media files to PostgreSQL.

## Promotion checks for delivery tickets

A delivery item may move to `Ready` only when all answers are yes:

- [ ] Responsible and acceptance owners are named people with confirmed authority.
- [ ] Phase, milestone, target environment, allowed repository scope, and evidence destination are explicit.
- [ ] Every blocking backlog/decision dependency has a dated evidence link, or the ticket states an approved controlled-fixture/withheld behavior.
- [ ] Direct requirement, specification, wireframe/design, architecture/content, and validation links are copied into the extracted issue as applicable.
- [ ] Acceptance criteria identify default plus applicable loading, empty, invalid, failure, timeout/offline, unavailable/expired, no-JavaScript, language, focus, history, and success states.
- [ ] Exact commands and expected non-sensitive artifacts are known for lint, type, unit, integration, browser, accessibility, security, performance, migration, or content checks that apply.
- [ ] The change scope does not require an unapproved fact, translation, provider, package, route, personal-data flow, or destructive migration.

Failure of any check keeps the item `Proposed` or `Blocked`; it is not silently delegated to implementation.

## Slice sequencing after M0

| Pull sequence | Work | Earliest controlling gates |
| ---: | --- | --- |
| 1 | Platform, CMS skeleton, tokens, shared shell, utility failures, progressive motion/media capability modes | M0 exit; `SEC-01`, `DEL-01`, named delivery owners; motion/media amendment for `B01-001`, `B01-003`, `B01-012`–`B01-013` |
| 2 | Home, Emergency, Contact, Privacy, Accessibility | `SAFE-01`–`SAFE-04`, `LANG-01`, applicable privacy decisions; `BRAND-01` and media acceptance for enabled Home media |
| 3 | Doctor/service discovery and governed search index | `CARE-01`–`CARE-06`, `SEARCH-01`; approved launch records |
| 4 | Patient Information, Search UI, About | `ACCESS-01`, `SEARCH-01`–`SEARCH-02`, `INST-01`–`INST-03`, `BRAND-01` as applicable |
| 5 | Appointment request and isolated intake | `APPT-01`–`APPT-04`, `APPT-03`, `DEL-01`; collection separately enabled |
| 6 | Integrated release candidate and production | All included-slice gates, release evidence, `B07-016` approval |

Keep at most two delivery slices active. A technically complete slice remains staging-only until its content, collection, and publication gates are separately approved.

## Operating commands

Run the documentation gate before and after backlog changes:

```sh
node hallelujah/docs/backlog/audit-backlog.mjs
```

Run repository application commands only after `B00-004` creates and documents them. Do not invent package-manager, build, migration, browser, deployment, or production commands in earlier tickets.

## Handoff to an issue tracker

When an issue tracker is selected, create issues one milestone ahead using the required template. Preserve the stable `Bxx-xxx` ID in every title, copy direct source links rather than relying on epic context, represent each dependency as a link, and keep decision/content/evidence issues separate from delivery issues. After the tracker becomes authoritative, replace this board's row status with tracker links and retain this file as the pull-policy index.
