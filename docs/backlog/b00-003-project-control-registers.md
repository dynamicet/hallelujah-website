# `B00-003` — Project Control Registers

**Status:** Done for controlled development; production authority remains deferred  
**Control snapshot:** 13 September 2026, Africa/Addis_Ababa  
**Scope:** Controlled local development only  
**Publication, production, personal-data collection, and external-provider authority:** Not granted

## Ticket contract

| Field | Value |
| --- | --- |
| Epic / lane / priority | Epic 00 / `DELIVERY` / `P0` |
| Phase / milestone | Phase 0 / `M0` |
| Responsible owner | Temporary role — Product + External Project / Delivery Lead; named people return with `B00-001` before production acceptance |
| Acceptance owner | Temporary role — External QA / Accessibility Lead; named authority returns with `B00-001` and `B00-016` before production acceptance |
| Target environment | Documentation and isolated local development |
| Repository scope | This register, backlog execution/traceability documents, sanitized evidence pointers, and the read-only backlog audit |
| Requirements / decisions | `G-014`, `GOV-01`, `DEL-01`; all formal decisions are indexed below without changing their outcomes |
| Benchmark applications | None directly; `B00-017` is indexed as the approved benchmark-use evidence and its change triggers remain binding |
| Parent / dependencies | Working `B00-016` matrix; deferred `B00-001` and `B00-015` production boundaries; execution-board baselines |
| Evidence destination | Sanitized repository evidence under [`docs/backlog/evidence/`](evidence/README.md); restricted evidence remains outside this repository |

## Outcome and boundaries

This document is the controlled-development index for decisions, dependencies, risks, assumptions, exceptions, and evidence. IDs in this document are permanent: never reuse or renumber a retired entry. Update `Last reviewed` and append history rather than silently changing prior meaning.

The [formal hospital validation register](../validation/stakeholder-low-fidelity-validation.md#decision-register-by-accountable-role) remains authoritative for decision outcomes. This index maps those outcomes to implementation holds and milestones; it cannot approve a hospital fact or close a decision. The [execution board](execution-board.md) remains authoritative for live ticket status.

Allowed work is documentation and isolated, provider-neutral local implementation using sanitized evidence and clearly labeled non-public fixtures. The following remain disabled: legacy executable/configuration import, real appointment data, public release, production provisioning, DNS cutover, personal-data collection, and all unapproved third-party requests.

## Register operating rules

1. Use the existing formal ID for a decision. Use `DEP-###`, `RSK-###`, `ASM-###`, `EXC-###`, and `EVD-###` for the other registers.
2. Never delete or reuse an ID. Mark superseded or closed entries and link the replacement/evidence.
3. The named role owns review until `B00-001` supplies an authorized person. A temporary role cannot grant production acceptance.
4. Every unresolved decision must identify the backlog work whose promotion, activation, collection, publication, or release it controls and the milestone by which it is needed.
5. Restricted evidence is linked by a sanitized pointer only. Do not store signatures, private contacts, credentials, incident details, vulnerability reports, personal data, or appointment content here.
6. An exception requires explicit approval, risk, compensating control, owner, expiry, retest, and rollback/removal. A deferral, safe default, or disabled feature is not an exception.
7. Review open entries at least twice weekly during `M0`–`M5`, at each milestone gate, and whenever a linked decision, dependency, build, provider, data flow, or requirement changes.

## Decision register

`Open` means the formal outcome is unresolved. `Working baseline` is still open for production. Approved rows are retained for complete coverage and change-trigger tracking.

| Decision | State | Responsible role | Promotion-controlled backlog | Required by | Safe state / next evidence |
| --- | --- | --- | --- | --- | --- |
| `GOV-01` | Open; `B00-001` deferred | Executive sponsor + Product | `B00-001`, `B00-012`, `B02-001`, `B07-015`–`B07-016`; all production acceptance | `M0` exit / before production | Temporary roles only; obtain signed named-owner and governance record |
| `GOV-02` | Approved for controlled scope | Product + Executive | `B08-006`, `B08-008`, `B08-009` on any scope change | `M1` scope; `M8` expansion | Keep recorded Phase 1 inventory and Phase 2 exclusions; reopen only on scope change |
| `GOV-03` | Approved for benchmark use | Product + Executive | `B00-017`; every benchmark-derived implementation | Every increment | Apply current dispositions; reopen only on documented change trigger |
| `SAFE-01` | Open | Operations + Clinical | `B03-001`, `B03-005`, `B03-008`, `B05-015` | `M2` | No live contact target; signed canonical record and performed call tests |
| `SAFE-02` | Open | Clinical + Operations | `B03-002`, `B03-008`, `B04-011`, `B05-006` | `M2` | Inert separated choices; approved wording and comprehension evidence |
| `SAFE-03` | Open | Facilities + Operations | `B03-003`, `B03-008`, `B05-005`, `B05-007` | `M2` | Text-first facts withheld and maps off; dated on-site arrival evidence |
| `SAFE-04` | Open | Clinical + Operations + Executive | `B03-002`, `B03-006`, `B03-008`, `B04-005` | `M2` | Omit high-consequence claims; dated scoped claim evidence |
| `APPT-01` | Open | Operations + Product | `B03-011`, `B03-017`, `B04-009`, `B04-013` | `M5` | Non-submitting simulation/unavailable route; approved operating procedure |
| `APPT-02` | Open | Privacy + Operations | `B03-012`, `B03-015`, `B03-017` | `M5` | No collection; field-by-field minimization and routing record |
| `APPT-03` | Open | Privacy/Legal + Security | `B03-013`, `B03-015`, `B03-017`–`B03-019` | `M5` before collection | Collect nothing; signed assessment, notice, retention, access, and data-flow records |
| `APPT-04` | Open | Operations + Backend + Security | `B03-014`, `B03-016`–`B03-019` | `M5` | Simulated outcomes only; approved state-machine decision and executable cases |
| `CARE-01` | Open | Medical Staff + Content | `B04-001`, `B04-007`, `B04-009`, `B06-003` | `M3` | Publish no extracted clinician as current; signed roster |
| `CARE-02` | Open | Medical Staff + Content | `B04-002`, `B04-007`, `B04-009` | `M3` | Fictional/withheld records; approved canonical map and maintained fields |
| `CARE-03` | Open | Operations + Medical Staff | `B04-003`, `B04-009` | `M3` | Omit schedules and availability; corrected model or signed omission |
| `CARE-04` | Open | Clinical + Content + Product | `B04-004`, `B04-011`, `B06-001`, `B06-003` | `M3` | Controlled taxonomy fixture only; signed bilingual taxonomy/correction log |
| `CARE-05` | Open | Clinical + Operations + Executive | `B04-005`, `B04-011`, `B04-013` | `M3` | Withhold unsupported services/claims; governed clinical claim ledger |
| `CARE-06` | Open | Clinical + Content | `B04-006`, `B04-009`, `B04-013`, `B03-017` | `M3` before handoff | Controlled fixture IDs only; approved bidirectional relationship table |
| `ACCESS-01` | Open | Operations + Content | `B05-001`, `B05-006`, `B06-001` | `M4` | Omit missing guidance; approved topic inventory, owners, and review dates |
| `SEARCH-01` | Open | Clinical + Product + Content | `B06-001`, `B06-003`–`B06-006`, `B04-007`, `B04-011` | `M3`/`M4` | Local non-diagnostic fixture search only; signed bilingual vocabulary and relevance cases |
| `SEARCH-02` | Open | Privacy + Security | `B06-002`, `B06-004`, `B06-006`, `B08-010` | `M4`; before telemetry | No query telemetry or remote suggestion; approved handling assessment/register |
| `LANG-01` | Open | Clinical + Content + Language | `B06-007`–`B06-010`, `B03-008`, `B03-017`, `B05-015` | `M2` | Geometry fixtures are not translation; professional clinical-language review |
| `LANG-02` | Open / Phase 2 | Product + Content + Language | `B06-011`–`B06-012`, `B08-003`–`B08-005` | `M8`; `M4` if included | Honest unavailable state; route parity and approved fallback record |
| `INST-01` | Open | Executive + Content | `B05-002`, `B05-010`, `B03-006` | `M4` | Withhold institutional claims; executive-approved claim ledger |
| `INST-02` | Open | Executive + Content | `B05-003`, `B05-010`, `B03-006` | `M4` | No real leadership record/portrait; approved current register and rights |
| `INST-03` | Open | Executive + Content | `B05-004`, `B05-010`, `B03-006` | `M4` | No logo wall/coverage implication; approved relationship/rights register |
| `BRAND-01` | Open | Brand + Product | `B01-002`, `B02-011`, `B04-002`, `B05-010` | `M1` theme / `M4` assets | Replaceable prototype theme only; original assets, rights, contrast, bilingual retest |
| `HR-01` | Open / Phase 2 | HR + Product | `B08-001`, `B08-004`–`B08-005` | `M8` | No current vacancy workflow; demonstrated lifecycle and removal evidence |
| `HR-02` | Open / Phase 2 | HR + Privacy/Security | `B08-002`, `B08-004`–`B08-005` | `M8` before collection | No Apply/email/upload/form/provider; approved recruitment data flow |
| `HR-03` | Open / Phase 2 | HR + Legal + Language | `B08-003`–`B08-005` | `M8` | Withhold uninvented policy/process copy; approvals and professional translation |
| `SEC-01` | Open; `B00-002` deferred | Security + Executive | `B00-002`, `B00-004`, `B06-013`–`B06-014`, `B07-016` | `M0` production boundary / `M7` | Isolated clean rebuild; incident closure and trusted-source evidence before production |
| `SEC-02` | Open; `B00-014` deferred | Privacy + Security + Product | `B00-014`, `B01-011`, `B03-018`, `B05-008`, `B07-009` | Before provider use / `M6` | Default deny and zero provider requests; approved per-provider register |
| `DEL-01` | Working development baseline; open for production | Product + QA + Security | `B00-015`–`B00-016`, `B07-001`, `B07-008`, `B07-015`–`B07-016` | Every increment / `M6`–`M7` | Apply working matrix and sanitized evidence rules; named production matrix and executed evidence later |

## Dependency register

| ID | Dependency and consumer | State | Owner | Required by | Resolution / safe fallback |
| --- | --- | --- | --- | --- | --- |
| `DEP-001` | `B00-003` uses the working `B00-016` implementation acceptance matrix | Satisfied for controlled development | QA + Product | `M0` | Reopen for named production authorities, actual inventory, executed release evidence, or a change trigger |
| `DEP-002` | Evidence handling depends on `B00-015` / `DEL-01` | Deferred production selection; working baseline active | QA + Security | Before restricted evidence / production | Sanitized evidence only; restricted artifacts remain outside repository or are not created |
| `DEP-003` | `B00-004` depends on `B00-002` / `SEC-01` trusted source | Satisfied only for isolated local clean rebuild | Delivery + Security | Before `B00-004`; reopen before production | Import no legacy executable/configuration state; production remains blocked |
| `DEP-004` | Any external request depends on `B00-014` / `SEC-02` | Deferred; default-deny baseline active | Privacy + Security | Before any provider activation | Local/first-party behavior only; zero browser, server, build, or CI provider requests |
| `DEP-005` | `B00-005` pinned toolchain depends on the `B00-004` repository skeleton | Waiting | Delivery | `M0`/`M1` | Complete clean bootstrap first; do not pin an invented application shape |
| `DEP-006` | `B00-006` environment contract depends on `B00-004` plus `DEP-002` | Waiting | DevOps + Security | `M0`/`M1` | Define names only and fail closed; no real secrets or production data |
| `DEP-007` | `B00-008`–`B00-010` database/backup controls depend on `B00-006`, provider decision, and appointment gates | Blocked | Backend + DevOps + Security | Before `M5` collection | Use no real appointment data; do not provision production under deferred `B00-007` |
| `DEP-008` | `B00-011`–`B00-013` CI, deployment, and observability depend on preceding M0 controls | Blocked | Delivery + DevOps + QA/Security | `M0`/`M1` | Local sanitized checks may be designed; no provider integration or production claim |
| `DEP-009` | Page slices depend on approved governed content and applicable decisions | Open per decision register | Product + domain owners | `M2`–`M5` | Use labeled fixtures, omission, unavailable state, and separate publication status |
| `DEP-010` | Release depends on named approval, closed production gates, and executed acceptance evidence | Blocked | Executive + Product + QA/Security | `M6`–`M7` | No publication, collection, DNS cutover, or production-readiness claim |

## Risk register

| ID | Risk / consequence | Owner | Mitigation and trigger | Target / state |
| --- | --- | --- | --- | --- |
| `RSK-001` | Accountable people remain unnamed; approvals cannot be durable | Executive sponsor | Keep role labels temporary; reopen `B00-001` before formal approval or production | `M0` production boundary / Open |
| `RSK-002` | Legacy compromise contaminates the rebuild or search recovery | Security + Delivery | Enforce isolated clean-build boundary; trigger on any legacy executable/config import request | Before `B00-004`, `M7` / Open |
| `RSK-003` | Conflicting emergency/contact facts cause unsafe guidance | Operations + Clinical | Withhold targets and claims until `SAFE-01`–`SAFE-04` close and tests pass | `M2` / Open |
| `RSK-004` | Unresolved appointment operations/privacy cause loss, duplicate requests, or unlawful collection | Operations + Privacy + Security | Keep collection disabled; require `APPT-01`–`APPT-04` and isolated data controls | `M5` / Open |
| `RSK-005` | Unapproved or stale clinicians, services, and institutional claims mislead visitors | Content + Clinical + Executive | Controlled fixtures/omission; governance metadata and expiry before publication | `M3`–`M4` / Open |
| `RSK-006` | Missing brand/portrait/logo rights lead to unauthorized asset use | Brand + Content | Replaceable theme and non-identifying placeholders; approve source and rights | `M1`–`M4` / Open |
| `RSK-007` | Public-content and appointment database isolation is misconfigured | Backend + Security | Least-privilege roles and denial/restore tests before collection | `M5` / Open |
| `RSK-008` | Prototype code or fixtures are mistaken for production authority | Delivery + QA | Contract-driven clean rebuild, fixture labels, fixture-leak checks | `M1` and every slice / Open |
| `RSK-009` | Deferred provider decisions lead to accidental network disclosure | Privacy + Security | Default deny; request inventory checks; reopen `SEC-02` before dependency/config addition | Every increment / Open |
| `RSK-010` | Sensitive evidence enters Git or public CI | QA + Security | Sanitized artifacts only, pointer records, secret/privacy scans; stop if no authorized restricted store exists | Every increment / Open |
| `RSK-011` | Late Amharic, assistive-technology, and physical-device evidence blocks safety acceptance | Language + QA + Clinical | Prioritize `LANG-01`; preserve honest unavailable states; schedule human evidence before slice exit | `M2`, `M6` / Open |
| `RSK-012` | A coded/staging-complete feature is mistaken for publication or collection approval | Product + QA | Track technical, content, collection, publication, and production outcomes separately | Every milestone / Open |

## Assumption register

Assumptions enable planning only. They are not facts for public content or authority to activate a capability.

| ID | Assumption | Owner | Validation / invalidation trigger | State |
| --- | --- | --- | --- | --- |
| `ASM-001` | One cross-functional team covers product, engineering, DevOps, QA/accessibility, and content integration | Product + Delivery | Validate when people/capacity are assigned; replan if ownership is split | Unvalidated |
| `ASM-002` | Payload CMS, Next.js/TypeScript, PostgreSQL, GitHub Actions, Docker, and VPS hosting remain the planning baseline | Delivery + Architecture | Validate/pin in `B00-004`–`B00-007`; change through architecture control | Accepted for planning, unpinned |
| `ASM-003` | Public-content and appointment databases will be logically separated on the initial VPS | Backend + Security | Validate provider/topology and denial tests in `B00-007`–`B00-010` | Unvalidated; no production provisioning |
| `ASM-004` | The connected prototype is a behavior/visual reference, not production code | Product + Delivery | Invalidate any direct-copy request; verify clean bootstrap and fixture exclusion | Binding working assumption |
| `ASM-005` | English and Amharic interfaces are left-to-right; safety copy still requires professional review | Language + QA | Validate with named language/clinical reviewers and human layout/meaning tests | Geometry only |
| `ASM-006` | Careers and other excluded routes remain outside Phase 1 | Product | Reopen only through `GOV-02` change control | Approved scope assumption |
| `ASM-007` | Calendar commitments wait for named owners, capacity, and P0 decision dates | Product + Delivery | Validate after `B00-001` and capacity assignment | Active |
| `ASM-008` | Controlled local implementation can remain provider-neutral and first-party | Delivery + Security | Invalidate if a required local path attempts an external request | Active; monitor every build |

## Exception register

There are **no approved exceptions** as of this snapshot. The five M0 deferrals and the working `DEL-01` baseline are scope controls, not exceptions. The next assigned ID is `EXC-001`.

Before an exception can be active, its row must record: affected requirement/decision/ticket; rationale; risk and user impact; compensating control; responsible and acceptance people; environment; start and hard expiry; retest; rollback/removal steps; sanitized evidence; and status. Expiry fails closed. No exception may authorize unsafe clinical content, undisclosed personal-data handling, credential exposure, or an unapproved provider.

## Evidence register

| ID | Outcome / artifact | Owner | Classification and location | State / review trigger |
| --- | --- | --- | --- | --- |
| `EVD-001` | Scoped M0 deferrals and working boundaries | Product + Delivery | Sanitized: [M0 deferrals](evidence/M0-deferrals-2026-09-13.md) | Current; review at each return condition |
| `EVD-002` | WordPress incident preparation pointer and clean-build boundary | Security + Delivery | Sanitized pointer: [incident evidence](evidence/B00-002-wordpress-incident-2026-09-12.md); restricted details stay external | Open for production; review before migration/provisioning/release |
| `EVD-003` | Provider-neutral infrastructure selection | Product + Delivery + Security | Sanitized: [infrastructure evidence](evidence/B00-007-infrastructure-selection-2026-09-12.md) | Partial/deferred; review before remote environment/provider use |
| `EVD-004` | Controlled-development acceptance matrix | QA + Product + Security | Sanitized: [`B00-016` record](evidence/B00-016-working-acceptance-matrix-2026-09-13.md) | Complete for development; reopen at listed production/change triggers |
| `EVD-005` | Benchmark disposition approval | Product + Executive | Sanitized: [`B00-017` record](evidence/B00-017-benchmark-disposition-2026-09-13.md) | Done; reopen only on disposition change trigger |
| `EVD-006` | `B00-003` register implementation and integrity result | Delivery + QA | Sanitized: [`B00-003` completion record](evidence/B00-003-project-control-registers-2026-09-13.md) | Passed for controlled development; production acceptance deferred |
| `EVD-007` | Structural backlog audit | Delivery + QA | Sanitized machine output from `node docs/backlog/audit-backlog.mjs`; summary recorded in `EVD-006` | Passed 10/10 on 13 September 2026; rerun on backlog/control change |

Each future evidence item must record the fields in the [evidence record format](../visual-design/handoff/accessibility-and-validation-checklist.md#evidence-record-format). An evidence link establishes traceability, not stakeholder approval.

## Verification plan

| Method | Command / review | Expected result | Evidence |
| --- | --- | --- | --- |
| Register structure | `node docs/backlog/audit-backlog.mjs` | All six registers present; all 32 decisions appear exactly once; every open decision has a controlled backlog mapping and milestone | `EVD-006`, `EVD-007` |
| Backlog integrity | `node docs/backlog/audit-backlog.mjs` | Ticket, requirement, decision, architecture, route, and local-link checks pass | `EVD-006`, `EVD-007` |
| Sensitive-data boundary | Manual review of changed files | No signature, private contact, credential, incident detail, personal data, or appointment content copied | `EVD-006` |
| Authority review | Compare formal register, execution board, and this snapshot | No decision outcome, publication authority, or production status silently changes | `EVD-006` |

## Completion criteria

- [x] Stable ID policies and owners are defined for all six registers.
- [x] All 32 formal decisions are indexed; every open decision maps to controlled backlog and a required milestone.
- [x] Dependency, risk, and assumption entries state owners, current state, safe fallback, and review trigger.
- [x] The empty exception register defines the mandatory approval, expiry, retest, and rollback/removal contract.
- [x] Evidence is classified and linked without copying restricted material.
- [x] Post-change structural and link audits pass.
- [x] Execution board and completion evidence are updated in the same change.
