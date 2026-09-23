# Stakeholder Low-Fidelity Validation and Decision Pass

**Prepared:** 11 September 2026  
**Status:** Recommended safe baselines conditionally accepted; `GOV-02`, `GOV-03`, and project `BRAND-01` direction approved; 29 formal hospital outcomes unresolved
**Scope:** All 12 low-fidelity page types, the four flow packages, and the benchmark disposition register  
**Decision authority:** Named hospital owners, with recorded client-delegated project exceptions that do not grant public-release authority

## Purpose

Use this document to validate the proposed structure, benchmark-informed pattern dispositions, and behavior before polished design, prototyping, backlog commitment, or production implementation. It is the single review log for stakeholder outcomes, but it does not replace the [benchmark traceability register](../benchmarks/benchmark-traceability.md), [requirements matrix](../requirements/requirements-matrix.md), [page specifications](../ux/page-specifications.md), [design-system contracts](../design-system/README.md), or [wireframes](../wireframes/README.md).

All decisions begin as **Unresolved**. Extracted website content is evidence to investigate, not authority to approve it. A decision becomes **Approved**, **Changed**, or **Rejected** when an accountable owner supplies a date and a durable evidence link. Under the client's temporary-owner instruction, a role-based placeholder may record a planning decision until the person's name is supplied; it does not authorize public release, live data collection, or approval of safety-, clinical-, privacy-, or security-critical facts.

An AI-convened multidisciplinary review has assessed all 32 decisions, 12 page structures, four flow packages, and seven scenarios. Its recommendations, safe defaults, blockers, and two incorporated blueprint corrections are recorded in the [stakeholder team desk review](stakeholder-team-desk-review.md). That review is advisory and does not replace the named hospital participants, sessions, evidence, or signatures required below. `GOV-02` is approved as a planning-scope decision, `GOV-03` is approved as the benchmark-use boundary, and `BRAND-01` is approved as a project brand direction through the client directions recorded below; the other 29 formal outcomes remain Unresolved.

## Conditional working-baseline acceptance

On 12 September 2026, the project stakeholder direction accepted all recommended safe baselines as the working policy for design, non-public prototyping, and implementation planning. This acceptance covers all 32 decision IDs in six grouped bundles:

| Bundle | Decision IDs | Accepted working baseline |
| --- | --- | --- |
| Governance and scope | `GOV-01`–`GOV-03` | Use accountable ownership, review, and expiry; retain the proposed phased scope and benchmark boundaries. |
| Emergency and hospital access | `SAFE-01`–`SAFE-04` | Withhold unverified contact, arrival, and consequential capability claims; keep emergency routing clear and non-diagnostic. |
| Appointment requests | `APPT-01`–`APPT-04` | Treat the journey as a request rather than confirmed booking; collect nothing until the operating and privacy models are approved; minimize fields and preserve safe recovery. |
| Care, search, access, and language | `CARE-01`–`CARE-06`, `ACCESS-01`, `SEARCH-01`–`SEARCH-02`, `LANG-01`–`LANG-02` | Publish only governed records; keep search non-diagnostic and privacy-preserving; require professionally reviewed bilingual consequential content. |
| Institution, brand, and careers | `INST-01`–`INST-03`, `BRAND-01`, `HR-01`–`HR-03` | Withhold unverified claims and rights-dependent assets; use the `B01-002` project brand system without implying binary/media approval; keep Careers Phase 2 and non-collecting. |
| Security, testing, and release | `SEC-01`–`SEC-02`, `DEL-01` | Keep the known incident as a release gate, default-deny optional third parties, and require risk-proportionate test evidence. |

The direction is intentionally flexible where flexibility is safe and useful. Apply the following exception policy:

1. Prefer the accepted baseline. Introduce an exception only for a documented user, clinical, operational, legal, language, accessibility, or delivery need—not preference alone.
2. Use proportionate controls. Optional presentation, sequencing, and low-risk content choices may change with lightweight evidence; emergency safety, privacy, security, accessibility, consequential translation, and clinical claims require the relevant accountable owner and evidence.
3. Choose the least-data, least-privilege, simplest reliable solution that meets the demonstrated need. Do not activate an optional integration or collect an optional field merely because it is available.
4. Localize selectively without copying unsupported behavior from another institution. Preserve the outcome and risk control even when the implementation differs.
5. Record every material exception with its decision ID, rationale, affected pages/flows, owner, evidence, risk controls, validation method, review date, and expiry or rollback condition.
6. If evidence is incomplete, omit or disable only the affected claim, record, field, relationship, or integration when the remaining journey is still truthful and useful. Escalate to a full route or release block only when the missing item is essential to safety, comprehension, legality, or reliable operation.

This is a working-baseline approval, not formal hospital approval of unresolved facts, operational readiness, live data collection, or public release. Except for `GOV-02`, `GOV-03`, and the client-delegated project brand direction `BRAND-01`, the approvers' names, authority confirmation, and durable evidence links have not yet been entered. Therefore the remaining 29 formal outcome cells below stay **Unresolved** until those records are supplied.

## Recorded approval: GOV-02

| Field | Record |
| --- | --- |
| Decision ID | `GOV-02` |
| Outcome | Approved |
| Decision statement | Approve the documented Phase 1 route inventory and exclusions. Careers, Referring Clinicians, Health Information / News, and Patient Portal remain deferred; the conditional utility-route rules remain unchanged. |
| Accountable owner | TBD — Hospital Project Owner / Focal Person (temporary role-based owner authorized by the client) |
| Decision date and timezone | 12 September 2026, Africa/Addis_Ababa |
| Evidence | Client direction, “approved,” recorded in the project workspace session; this section is the durable project decision record pending replacement with the named representative and organizational approval reference. |
| Requirements affected | `G-001`, `G-002`, `S-006`–`S-008`, `P-001`, `P-002`, `I-004`, `I-005` |
| Publication impact | Phase 1 backlog scope is unblocked. Individual routes, content, data collection, integrations, and public release remain subject to their applicable decision gates. |
| Review trigger | Replace the temporary owner with the authorized person's name and evidence reference, or review whenever Phase 1/Phase 2 scope changes. |

## Recorded approval: GOV-03

| Field | Record |
| --- | --- |
| Decision ID | `GOV-03` |
| Outcome | Approved |
| Decision statement | Approve unchanged all 93 cross-site pattern dispositions and all 120 institution-specific candidate dispositions in the benchmark register and crosswalk as the binding benchmark-use boundary for controlled implementation. |
| Accountable owner | TBD — Client Executive / Product Authority (temporary role-based owner authorized by the client) |
| Technical reviewer | Senior UI/UX Engineering and Architecture review, recorded by Codex |
| Decision date and timezone | 13 September 2026, Africa/Addis_Ababa |
| Evidence | Client direction to address and complete `B00-017`, the [approved benchmark register](../benchmarks/benchmark-traceability.md#b00-017-approval-record), and the [sanitized completion record](../backlog/evidence/B00-017-benchmark-disposition-2026-09-13.md). |
| Review findings | Coverage is complete with no missing or duplicate IDs. The map consistently prioritizes safe patient-task completion and withholds unsupported facts, clinical routing, provider behavior, personal-data flows, and institutional promises. |
| Requirements affected | Supports all requirements; especially `G-001`–`G-016`, `S-005`–`S-008`, `H-001`, `H-005`, `E-001`–`E-005`, `A-001`–`A-007`, and `G-014`. |
| Publication impact | Benchmark-informed implementation is unblocked within the recorded dispositions. This does not close any clinical, operations, privacy, language, content, security, accessibility-test, or release gate referenced by those dispositions. |
| Review trigger | Review only if implementation changes/conflicts with a disposition, the benchmark pack gains a candidate, local evidence supports promoting a Test/Defer item, or validation exposes a material safety, accessibility, privacy, language, operational, or architectural conflict. Replace the temporary owner record when an authorized person's identity may be stored. |

## Recorded implementation-planning decision: Epic 0 architecture

The client also approved the initial production architecture for implementation planning on 12 September 2026. The complete decision is recorded in [Epic 0 — Initial Production Architecture](../architecture/epic-0-technical-foundation.md). Its seven choices cover Payload CMS with Next.js/TypeScript, PostgreSQL with logically separate CMS and appointment databases initially on the same VPS, GitHub/VPS environments, GitHub Actions with approval-controlled deployment and intended Docker packaging, first-party-minimum integrations, privacy-conscious monitoring, and split evidence storage.

This is a technical planning baseline owned by **TBD — External Project / Delivery Lead** and accepted through the client direction in the project session. It is not a new formal hospital fact/content decision and does not change the unresolved outcomes for `SEC-01`, `SEC-02`, `APPT-03`, `APPT-04`, or `DEL-01`. Provider, security, privacy, test-matrix, and release approvals remain required as stated in those rows.

## Recorded working baseline: DEL-01

On 13 September 2026, the client directed the project to proceed with `B00-016`. The [implementation acceptance matrix](implementation-acceptance-matrix.md) is accepted as the controlled-development baseline. It defines `T0`–`T4` evidence tiers, rolling browser/OS/AT support, physical-device targets, viewport/zoom/forced-colors coverage, constrained network and performance budgets, English/Amharic comprehension methods, security coverage, defect thresholds, evidence handling, approver roles, exceptions, and per-ticket `BM-*` implementation traceability.

This baseline unblocks ticket preparation, local/CI work, and production-like staging validation. It does not formally close `DEL-01`: named acceptance authorities, actual device inventory and software versions, the restricted evidence repository, executed release-candidate results, and the exact `B07-016` release approval remain required before production acceptance. `B00-016` is deferred at that production boundary and must reopen there or sooner on a material platform, risk, requirement, benchmark, data-flow, or critical-journey change.

## Outcome rules

| Outcome | Meaning | Required record |
| --- | --- | --- |
| Approved | The proposed behavior/content boundary may proceed as recorded. | Named accountable owner, decision date, evidence link, and review/expiry rule where content can become stale. |
| Changed | The stakeholder approved a materially different behavior or scope. | The same evidence as Approved plus coordinated updates to the requirement, page specification, component/layout contract, wireframe/flow, and acceptance evidence. |
| Rejected | The proposal will not proceed. | Named accountable owner, date, rationale, affected requirements/pages, safe replacement or deferral, and evidence link. |
| Unresolved | Evidence, authority, or agreement is missing. | Named next owner and evidence/action needed; affected content remains withheld and blocked behavior remains unimplemented. |

Verbal agreement, an undated screenshot, and the compromised public website alone are not approval evidence. Do not record a group or department as the approver when an accountable person's name is available.

## Review control

### Named participants

The role titles below are temporary working assignments, not personal names or approval evidence. Replace each `TBD` entry with an authorized person's full name, authority confirmation, and contact before recording that person's formal approval. One person may hold multiple roles.

| Role | Temporary role-based name | Organization side | Authority confirmed by | Contact | Status |
| --- | --- | --- | --- | --- | --- |
| Executive sponsor | TBD — Hospital General Manager / CEO | Hospital | — | — | Placeholder; formal owner unresolved |
| Product owner | TBD — Hospital Project Owner / Focal Person | Hospital | — | — | Placeholder; formal owner unresolved |
| Clinical approver | TBD — Medical Director | Hospital | — | — | Placeholder; formal owner unresolved |
| Medical staff owner | TBD — Medical Staff / Clinical Services Manager | Hospital | — | — | Placeholder; formal owner unresolved |
| Operations owner | TBD — Hospital Operations Manager | Hospital | — | — | Placeholder; formal owner unresolved |
| Facilities/access owner | TBD — Facilities Manager | Hospital | — | — | Placeholder; formal owner unresolved |
| Content owner | TBD — Communications / Content Manager | Hospital | — | — | Placeholder; formal owner unresolved |
| Professional Amharic reviewer | TBD — Professional Amharic Language Reviewer | Hospital or commissioned specialist | — | — | Placeholder; formal owner unresolved |
| Privacy/legal owner | TBD — Legal / Compliance Officer | Hospital | — | — | Placeholder; formal owner unresolved |
| Security owner | TBD — Hospital IT / Information Security Manager | Hospital | — | — | Placeholder; formal owner unresolved |
| Brand/asset-rights owner | TBD — Marketing / Communications Manager | Hospital | — | — | Placeholder; formal owner unresolved |
| HR/recruitment owner | TBD — Human Resources Manager | Hospital | — | — | Placeholder; formal owner unresolved |
| Delivery owner | TBD — External Project / Delivery Lead | External development entity | — | — | Placeholder; formal owner unresolved |
| QA/accessibility owner | TBD — External QA / Accessibility Lead | External development entity | — | — | Placeholder; formal owner unresolved |

### Temporary decision-owner routing

Use these role placeholders to route questions and prepare backlog dependencies now. They do not by themselves change a formal decision; the recorded `GOV-02` and `GOV-03` client decisions are the only role-based exceptions currently approved for controlled implementation planning.

| Decision group | Temporary accountable role(s) |
| --- | --- |
| `GOV-01`–`GOV-03` | Hospital General Manager / CEO + Hospital Project Owner / Focal Person |
| `SAFE-01`–`SAFE-04` | Hospital Operations Manager + Medical Director + Facilities Manager where arrival/access is involved |
| `APPT-01`–`APPT-04` | Hospital Operations Manager + Legal / Compliance Officer + Hospital IT / Information Security Manager; External Delivery Lead for technical state behavior |
| `CARE-01`–`CARE-06` | Medical Director + Medical Staff / Clinical Services Manager + Communications / Content Manager |
| `ACCESS-01` | Hospital Operations Manager + Communications / Content Manager + Legal / Compliance Officer |
| `SEARCH-01`–`SEARCH-02` | Hospital Project Owner + Medical Director + Content Manager; Legal / Compliance and Information Security for query data |
| `LANG-01`–`LANG-02` | Professional Amharic Language Reviewer + Medical Director + Communications / Content Manager |
| `INST-01`–`INST-03` | Hospital General Manager / CEO + Communications / Content Manager + Operations or Brand owner as applicable |
| `BRAND-01` | Client workspace identity `befikadusata` for the recorded project decision; Marketing / Communications, Language, Accessibility, and asset/content owners return for applicable production exceptions and assets |
| `HR-01`–`HR-03` | Human Resources Manager + Legal / Compliance Officer + Information Security Manager |
| `SEC-01`–`SEC-02` | Hospital IT / Information Security Manager + External Delivery Lead |
| `DEL-01` | External Project / Delivery Lead + External QA / Accessibility Lead, accepted by the Hospital Project Owner |

### Session record

Create one row per meeting or asynchronous approval round.

| Session | Date/time and timezone | Participants | Decisions considered | Minutes/evidence link | Facilitator |
| --- | --- | --- | --- | --- | --- |
| 1 — Safety and appointments | — | — | `GOV-01`, `SAFE-01`–`SAFE-04`, `APPT-01`–`APPT-04`, `LANG-01` | — | — |
| 2 — Care discovery and practical access | — | — | `CARE-01`–`CARE-06`, `ACCESS-01`, `SEARCH-01`–`SEARCH-02` | — | — |
| 3 — Institutional, brand, and Phase 2 careers | — | — | `GOV-02`, `INST-01`–`INST-03`, `BRAND-01`, `HR-01`–`HR-03`, `LANG-02` | — | — |
| 4 — Security, delivery, and closure | — | — | `SEC-01`–`SEC-02`, `DEL-01`; unresolved-item disposition; `GOV-03` only if a documented reopen trigger occurs | — | — |

## Decision register by accountable role

### Executive sponsor and product owner

| ID | Decision required | Requirements | Blocked pages/flows | Evidence needed | Outcome | Owner/date/evidence |
| --- | --- | --- | --- | --- | --- | --- |
| GOV-01 | Name all accountable owners and approve how ownership, review dates, and expiry are recorded. | `G-014`; supports every gated requirement | All 12 pages and all four flow packages | Signed responsibility list and content-governance record; see [documentation ownership](../README.md#ownership-and-approval) | Unresolved | — |
| GOV-02 | Confirm Phase 1 public routes, deferred/hidden routes, Phase 2 scope, and whether Careers remains Phase 2. | `G-001`, `G-002`, `S-006`–`S-008`, `P-001`, `P-002`, `I-004`, `I-005` | Home, shared shell, Patient Information, About, Careers; critical and institutional flows | Approved release-scope statement mapped to the [sitemap](../ux/sitemap.md) and page specifications | Approved | [TBD — Hospital Project Owner / Focal Person; 12 September 2026; recorded approval](#recorded-approval-gov-02) |
| GOV-03 | Confirm or change each Adopt, Adapt, Test, Defer, and Reject disposition in the benchmark application map; verify that included patterns solve a local need and that deferred patterns do not leak into scope or implied promises. | Supports all requirements; especially `G-001`–`G-016`, `S-005`–`S-008`, `H-001`, `H-005`, `E-001`–`E-005`, `A-001`–`A-007`, `G-014` | All 12 pages, four flow packages, sitemap, design system, and future backlog | Named product/executive decision against the [benchmark traceability register](../benchmarks/benchmark-traceability.md); referenced domain gates remain authoritative for clinical/operations/privacy activation | Approved | [TBD — Client Executive / Product Authority; 13 September 2026; recorded approval](#recorded-approval-gov-03) |

### Operations, facilities, and clinical safety

| ID | Decision required | Requirements | Blocked pages/flows | Evidence needed | Outcome | Owner/date/evidence |
| --- | --- | --- | --- | --- | --- | --- |
| SAFE-01 | Approve one canonical record for hospital emergency, ambulance, public emergency, switchboard, other purpose-specific phones, email, address, and hours. Reconcile every conflict; do not select a value merely because it is published. | `E-001`, `E-002`, `C-001`, `G-014` | Home, Emergency, Appointment, Doctor Directory/Profile, Service Directory/Detail, Patient Information, Locations & Contact, Search; critical, care-discovery, and practical-access flows | Signed operations record plus call tests. Candidate/conflicting values are listed in [content verification queue](../../../resources/content-review.md#priority-0--safety-and-access) and [extracted hospital profile](../../../resources/hospital-profile.json). | Unresolved | — |
| SAFE-02 | Approve when a visitor should use the hospital emergency route versus the applicable public route, the audience/scope/limitations, and the exact warning that forms, email, chat, and social messaging are not emergency channels. | `E-002`–`E-004`, `A-002`, `V-002` | Emergency, Appointment, Service Directory/Detail, Patient Information, Locations & Contact, Search; critical and practical-access flows | Clinical wording approval, operations validation, and comprehension-test plan | Unresolved | — |
| SAFE-03 | Verify the exact emergency entrance, street address, landmarks, written route, access hours, parking/vehicle access, public transport if maintained, and accessible entrance through an on-site arrival test without a map. | `E-004`, `C-002`, `C-003` | Emergency, Service Detail, Patient Information, Locations & Contact; critical and practical-access flows | Dated on-site test with named facilities/operations approvers, route notes, and approved coordinates if used | Unresolved | — |
| SAFE-04 | Confirm which 24/7, emergency, ICU, ambulance-equipment, pediatric/adult, and other high-consequence operational claims are currently true and within scope. | `E-004`, `V-002`, `V-003`, `H-004` | Emergency, Service Directory/Detail, Home, About; critical and care-discovery flows | Current operating evidence and claim-ledger entries with scope, location, availability, owner, date, and expiry | Unresolved | — |

### Appointment operations, privacy, security, and delivery

| ID | Decision required | Requirements | Blocked pages/flows | Evidence needed | Outcome | Owner/date/evidence |
| --- | --- | --- | --- | --- | --- | --- |
| APPT-01 | Define the request operating model: receiving team, staffed hours, routing, response expectation, confirmation channel, escalation, cancellation/rescheduling, telephone fallback, and what constitutes authoritative receipt. | `A-001`, `A-006`, `C-001` | Appointment and every appointment CTA/handoff on Home, Doctor Profile, Service Detail, About; critical, care-discovery, and institutional flows | Approved operating procedure and service-level wording; candidate source behavior is in the [extracted profile](../../../resources/hospital-profile.json) | Unresolved | — |
| APPT-02 | Approve the minimum field set and conditional rules for specific doctor, service, or “not sure”; decide whether new/returning patient choice and free-text notes are operationally necessary. | `A-003`, `D-001`, `V-001`, `S-003` | Appointment; Doctor Profile and Service Detail handoffs; critical and care-discovery flows | Field-by-field data-minimization record with purpose, necessity, required/optional rule, recipient, and canonical-ID source | Approved for controlled development; authentic selector data remains gated | Client workspace identity `befikadusata`, 23 September 2026; [controlled appointment contract](../backlog/b03-012-014-controlled-appointment-contract.md) |
| APPT-03 | Approve the privacy notice, consent mechanism, lawful basis where applicable, recipients/access, retention/deletion, withdrawal/contact route, transport, logs, analytics, and abuse controls. | `A-003`, `A-005`, `S-003`–`S-005` | Appointment and any public form; critical flow F3–F5 | Signed privacy/security assessment, public notice, retention schedule, data-flow diagram, and third-party register | Controlled first-party development contract approved; lawful basis, named recipients, public notice and collection activation unresolved | Client workspace identity `befikadusata`, 23 September 2026; [controlled appointment contract](../backlog/b03-012-014-controlled-appointment-contract.md) |
| APPT-04 | Approve the submission state model: idempotency, duplicate suppression, unknown-outcome reconciliation, safe retry, reference handling, confirmation-delivery failure, refresh, and Back/Forward behavior. | `A-004`, `A-006`, `A-007`, `S-003` | Appointment; critical flow F4 | Architecture decision plus testable examples for accepted, rejected, timed-out, reconciled, duplicate, and delivery-failure states | Approved for controlled development | Client workspace identity `befikadusata`, 23 September 2026; [controlled appointment contract](../backlog/b03-012-014-controlled-appointment-contract.md) |

### Medical staff, clinical, and content governance

| ID | Decision required | Requirements | Blocked pages/flows | Evidence needed | Outcome | Owner/date/evidence |
| --- | --- | --- | --- | --- | --- | --- |
| CARE-01 | Approve the current clinician roster and disposition of 17 directory records versus 15 additional profile-only records. | `D-001`, `H-003`, `G-014` | Home, Doctor Directory/Profile, Appointment selectors, Search; care-discovery flows | Signed roster with stable public IDs, current status, owner, review date, and retire/redirect decision | Unresolved | — |
| CARE-02 | Reconcile duplicate/missing canonical records and approve required profile fields, names, credentials, titles, specialties, clinical interests, languages, locations, appointment routes, maintained filters beyond name/specialty, and optional-field omissions. | `D-002`–`D-004`, `D-006`, `G-013`–`G-015` | Doctor Directory/Profile, Search, Appointment; care-discovery flows C1, C2, C5–C7 | Approved clinician records, maintained-filter fields, and canonical map; known duplicate/unlinked issues are in [content verification queue](../../../resources/content-review.md#priority-1--doctors-and-schedules) | Unresolved | — |
| CARE-03 | Decide whether schedules can be governed reliably. Resolve duplicate Saturday rows, missing Sunday rows, `LT`, timezone/display convention, and refresh ownership; otherwise confirm schedules remain omitted. | `D-005` | Doctor Profile and any directory/search/appointment availability wording; care-discovery flow C5 | Corrected source schedule, convention definition, update process, and operations approval—or explicit approval to continue omitting schedules | Unresolved | — |
| CARE-04 | Approve one patient-oriented service taxonomy, launch subset, names, groups, spellings, slugs, English/Amharic synonyms, and correction policy. | `V-001`, `V-004`, `H-005` | Home search/features, Doctor Directory, Service Directory/Detail, Appointment selectors, Search; care-discovery and practical-access flows | Signed taxonomy using the extracted service inventory, with correction log for known copied/duplicated/misspelled source content | Unresolved | — |
| CARE-05 | Approve required service scope, who-it-helps wording, tests/treatments, preparation/referral, location/hours, urgent exceptions, and each high-consequence capability—or withhold the affected record/claim. | `V-002`–`V-004`, `E-002`–`E-004`, `H-004` | Services Directory/Detail, Home, Search, About; care-discovery and practical-access flows | Clinical claim ledger with source, eligibility, limitations, availability, location, owner, reviewer, review date, and expiry | Unresolved | — |
| CARE-06 | Approve bidirectional doctor/service/location relationships and stable public-ID handoff to Appointment. | `V-005`, `D-003`, `D-004`, `A-003` | Doctor Profile, Service Detail, Appointment, Search; care-discovery flows C1, C3–C7 | Governed relationship table proving both records are current and the relationship is clinically/editorially approved | Unresolved | — |

### Patient access, search, language, and content

| ID | Decision required | Requirements | Blocked pages/flows | Evidence needed | Outcome | Owner/date/evidence |
| --- | --- | --- | --- | --- | --- | --- |
| ACCESS-01 | Approve the minimum launch guidance for before, during, and after a visit; include owners for visiting, admission/discharge, payment/insurance, accessibility, rights, complaints, safeguarding, medicines, feedback, and staffed fallback. | `P-001`, `P-002`, `C-001`, `G-014` | Home, Patient Information, Search; practical-access flow PA1 | Hospital-authored topic records, named approvers, current sources, review dates, and an explicit omit/defer decision for every missing topic | Unresolved | — |
| SEARCH-01 | Approve searchable record types, bilingual names/synonyms/spelling variants, ranking/relevance tasks, explicit corrections, urgent terms, match policy, and non-diagnostic wording. | `H-005`, `D-001`, `V-001`–`V-004`, `P-002`, `C-001` | Home, Doctor/Service directories, Search; critical, care-discovery, and practical-access flows | Signed search vocabulary and relevance/urgent-term test cases in both languages | Unresolved | — |
| SEARCH-02 | Approve first-party query logging/access/retention/redaction, cache and referrer controls, and whether analytics, autocomplete, pixels, chat, replay, or other third parties may receive query context. | `S-005`, `H-005`, `G-007`–`G-009` | Home search, Doctor/Service directories, Search; practical-access flow PA6 | Privacy/security assessment and third-party register; without approval, remote suggestions and query analytics remain off | Unresolved | — |
| LANG-01 | Approve the Phase 1 English/Amharic safety-critical content set and professional clinical-language review workflow. | `S-006`, `S-008` | Shared navigation plus Home, Emergency, Appointment, Locations & Contact, safety/search warnings; critical and practical-access flows | Route/string inventory, named translator and clinical reviewer, translation memory/source record, review date, and parity test | Unresolved | — |
| LANG-02 | Approve Phase 2 essential-journey parity, missing-equivalent behavior, stable-ID continuity, and the rule that untranslated consequential Careers terms disable Apply. | `S-007`, `S-008`, `I-004` | All 12 pages, especially doctor/service detail, Patient Information, About, Careers; all flow packages | Route-by-route parity matrix and approved fallback wording/behavior | Unresolved | — |

### Executive content, brand, and asset rights

| ID | Decision required | Requirements | Blocked pages/flows | Evidence needed | Outcome | Owner/date/evidence |
| --- | --- | --- | --- | --- | --- | --- |
| INST-01 | Resolve the conflicting mission sources and approve the hospital story, mission, vision, values, milestones, and every capacity/facility/superlative claim, including the 115/96-bed figures. | `H-004`, `I-001`, `G-014` | Home and About; institutional flows I1–I3 | Executive-approved claim ledger with authoritative sources, definitions, as-of dates, wording, translations, review interval, and expiry | Unresolved | — |
| INST-02 | Approve current leadership names, roles, tenure/status, biographies, portraits, and review ownership. | `I-002`, `D-006`, `G-014` | About and any Home trust excerpt; institutional flows I1–I3 | Leadership register plus image source, consent/rights, crop/alt decision, review date, and expiry | Unresolved | — |
| INST-03 | Approve each partner/insurer's active status, exact patient-relevant meaning and limitations, name/logo rights, owner, and review interval. | `I-003`, `H-004`, `S-005` | About and any Home trust excerpt; institutional flows I1–I3 | Partner register and rights evidence; no logo or coverage implication without approval | Unresolved | — |
| BRAND-01 | Approve the authentic logo source, hospital name/tagline treatment, palette direction, English/Amharic typography, imagery policy, and asset-rights workflow. | `G-004`, `G-010`, `H-002`, `D-006`, `I-002` | Shared shell and all 12 pages; binary assets and rights-dependent media still use their intake/content gates | Project-adopted first-party logo records and signed decision against [visual foundations](../design-system/foundations.md), with source fingerprints, contrast, glyph/weight/license and bilingual render evidence; replace on authenticated-master conflict | **Approved for project use** | Client workspace identity `befikadusata`, 14 September 2026; [decision](../backlog/b01-002-project-brand-system.md), [evidence](../backlog/evidence/B01-002-project-brand-system-2026-09-14.md) |

### HR, recruitment, privacy, and legal

| ID | Decision required | Requirements | Blocked pages/flows | Evidence needed | Outcome | Owner/date/evidence |
| --- | --- | --- | --- | --- | --- | --- |
| HR-01 | Assign a vacancy owner and approve the create, review, schedule/open, update, close/fill/withdraw, remove/archive, stale-link, 404/410, and genuine-successor lifecycle. | `I-004`, `G-011`, `G-013`–`G-015` | Careers; institutional flows I4–I5 | Demonstrated workflow with stable public IDs, exact instants/timezone, ownership, cache/search/sitemap removal, and review/expiry rules | Unresolved | — |
| HR-02 | Approve the application route and provider, requested data/files, recipients/access, transport, subprocessors, retention/deletion/rights, cross-border handling where relevant, logs/analytics, failure behavior, and public notice. | `I-004`, `S-002`–`S-005` | Careers; institutional flows I4 and I6 | Recruitment data-flow and privacy/security assessment; unapproved email, uploads, forms, or providers collect nothing | Unresolved | — |
| HR-03 | Approve exact equal-opportunity, accommodation/access-support, response, fraud-warning, and English/Amharic process/privacy wording. | `I-004`, `S-006`–`S-008` | Careers; institutional flows I4 and I7 | HR/privacy/legal approval and professional translation evidence; no borrowed or inferred wording | Unresolved | — |

### Security, delivery, accessibility, and QA

| ID | Decision required | Requirements | Blocked pages/flows | Evidence needed | Outcome | Owner/date/evidence |
| --- | --- | --- | --- | --- | --- | --- |
| SEC-01 | Close the known SEO-spam incident and establish the trusted production source before launch. | `S-001` | Sitewide release | Incident record covering cleanup, credential rotation, patching, sitemap/index remediation, hardening, and monitoring validation; source issue documented in [content verification queue](../../../resources/content-review.md#priority-0--source-integrity) | Unresolved | — |
| SEC-02 | Approve the third-party register and default-deny behavior for maps, analytics, chat, pixels, replay, autocomplete, form/recruitment providers, fonts, and external media. | `S-005`, `C-003` | All pages using an optional provider; practical-access and institutional flows | Named purpose, data flow, minimization, failure behavior, privacy/security review, performance cost, and owner for each provider | Unresolved | — |
| DEL-01 | Confirm the acceptance environments, screen-reader/browser pairs, constrained-network profile, performance budgets, patient-language comprehension methods, security tests, and evidence repository. | `G-003`–`G-013`, `G-016`, `S-002`, `S-003`, `E-005`, `A-004`, `A-007` | All 12 pages and all flows; prototype/backlog exit criteria | Working development strategy: [implementation acceptance matrix](implementation-acceptance-matrix.md). Production closure still needs named authorities, actual versions/devices/repositories, and executed release-candidate evidence matching the [cross-template test matrix](../ux/page-specifications.md#cross-template-test-matrix) and [benchmark-derived validation measures](../benchmarks/benchmark-traceability.md#benchmark-derived-validation-measures). | Unresolved; working baseline accepted | [Recorded working baseline](#recorded-working-baseline-del-01) |

## Scenario-based walkthrough prompts

The facilitator reads the scenario, asks a stakeholder to narrate what should happen, then records decisions by ID. Do not turn preferences into approval without the accountable owner and evidence.

### W1 — Emergency call and arrival under stress

**Scenario:** At night, a caregiver on a 360 px low-cost phone and slow connection opens Home in Amharic. They need urgent help, must distinguish the hospital number from the applicable public route, avoid an accidental call, and reach the correct entrance without JavaScript or a map.

Ask:

1. Which exact route and wording should they see first, and who is each number for?
2. Are the hospital emergency and ambulance contacts actually the same purpose and number?
3. What hours, audience, limitations, and online-channel warning are true?
4. Can a first-time visitor follow the written landmarks to the correct accessible entrance?
5. Does the explicit link → native dialer behavior provide enough protection from accidental activation?
6. Is the Amharic wording professionally equivalent and clinically safe?

Record: `SAFE-01`–`SAFE-04`, `LANG-01`, `DEL-01`. Walk against [critical flow F2](../wireframes/critical-user-flows.md#f2--emergency-call-and-arrival-flow) and [practical-access flow PA2](../wireframes/practical-access-flows.md#pa2--call-the-correct-purpose-and-arrive-without-a-map).

### W2 — Appointment request with uncertain outcome

**Scenario:** A visitor opens Appointment from a doctor profile, changes to “Not sure,” submits the approved minimum information, loses connectivity after sending, retries, and later receives no SMS/email even though the request was accepted.

Ask:

1. What minimum information does the receiving team truly need, and which fields are unnecessary?
2. Who receives the request, during what staffed hours, and when should the visitor expect a response?
3. What does consent cover, how long is data kept, and how can the visitor exercise choices?
4. How does the system determine whether the timed-out request already exists?
5. What reference and fallback are shown when confirmation delivery fails?
6. Which wording makes clear that receipt is not a confirmed booking?

Record: `APPT-01`–`APPT-04`, `CARE-01`, `CARE-04`, `LANG-01`. Walk against [critical flows F3 and F4](../wireframes/critical-user-flows.md#f3--appointment-request-happy-path).

### W3 — Care discovery without diagnosis

**Scenario:** A visitor does not know a department. They search a colloquial English or Amharic need term, receive either a service match, an approved urgent warning plus ordinary results, or no match, then request care without entering symptoms in the URL.

Ask:

1. Which patient-oriented terms, spellings, synonyms, and urgent matches are clinically approved?
2. Does the proposed taxonomy reflect how patients seek care rather than internal departments?
3. Which service capabilities must be omitted or block the whole record?
4. What safe route is offered when no result exists or the visitor is unsure?
5. May any query reach logs, analytics, autocomplete, chat, replay, or referrers?

Record: `CARE-04`–`CARE-06`, `SEARCH-01`, `SEARCH-02`, `LANG-01`. Walk against [care-discovery flow C3](../wireframes/care-discovery-flows.md#c3--browse-or-search-services) and [practical-access flows PA3, PA4, and PA6](../wireframes/practical-access-flows.md#pa3--detailed-site-search-happy-path).

### W4 — Doctor publication and schedule boundary

**Scenario:** A profile-only clinician appears in an old public URL, has incomplete credentials and a generic portrait, and the source schedule includes a repeated Saturday, no Sunday, and `LT`. A visitor follows it toward Appointment.

Ask:

1. Is this clinician current, and what is the canonical public ID/URL?
2. Which identity fields are required for publication and which may be omitted?
3. Is there valid portrait consent/usage evidence?
4. Can the schedule be corrected and maintained, or should every schedule remain absent?
5. If the clinician is retired, is there a genuine approved successor or should the URL be unavailable?

Record: `CARE-01`–`CARE-03`, `CARE-06`. Walk against [care-discovery flow C5](../wireframes/care-discovery-flows.md#c5--doctor-profile-publication-and-schedule-boundary).

### W5 — Visit preparation and practical access

**Scenario:** A visitor wants to know what to bring, visiting/payment rules, accessibility support, and how to arrive. One guide is missing, a temporary entrance change has expired, and the optional map fails.

Ask:

1. Which guides are safe and useful enough for Phase 1, and who maintains each?
2. Should missing topics be omitted, deferred, or replaced by an approved staffed fallback?
3. Which privacy/legal or clinical reviews apply to rights, complaints, safeguarding, medicines, and feedback?
4. Who removes expired temporary notices and search entries?
5. Is the text route complete when the map and JavaScript are unavailable?

Record: `SAFE-01`, `SAFE-03`, `ACCESS-01`, `SEC-02`, `LANG-01`. Walk against [practical-access flow PA1](../wireframes/practical-access-flows.md#pa1--prepare-for-navigate-and-complete-a-visit).

### W6 — Institutional claim and asset expiry

**Scenario:** About contains conflicting mission wording, 115/96-bed figures, a leadership portrait, and a partner logo. The leader changes role and logo rights later expire.

Ask:

1. Which source is authoritative for each narrative and numerical claim?
2. What do the bed figures measure, and as of what date?
3. What exact patient-relevant relationship does each partner/insurer name imply—and not imply?
4. Who reviews these records and how quickly are changed or expired items withheld?
5. Can approved text remain when portrait/logo rights end?

Record: `INST-01`–`INST-03`, `BRAND-01`. Walk against [institutional flows I1 and I3](../wireframes/institutional-flows.md#i1--about-content-publication-gate).

### W7 — Vacancy closes during application

**Scenario:** A candidate opens a current Amharic vacancy, reaches Apply as the closing instant passes, and the external provider fails. An old cached link remains discoverable the next day.

Ask:

1. What exact timezone and lifecycle event closes Apply?
2. How are the page, direct URL, cache, search index, and sitemap updated?
3. Is the provider still approved at click time, and what data/files would it receive?
4. What safe recovery exists without diverting applications into an unapproved mailbox or upload?
5. Are privacy, equality, access-support, response, and fraud-warning terms approved in the active language?

Record: `HR-01`–`HR-03`, `LANG-02`, `SEC-02`. Walk against [institutional flows I4–I7](../wireframes/institutional-flows.md#i4--current-vacancy-application-path).

## Page and flow coverage check

Use this table to prove that each page structure—not its gated facts—was reviewed. “Accepted structure” is not publication approval.

`GOV-03` applies across every row: reviewers must validate the mapped local application, not the benchmark site's brand, content, or operating model.

| Page type | Primary decision IDs | Structure outcome | Named reviewer/date | Notes/evidence |
| --- | --- | --- | --- | --- |
| Home | `GOV-02`, `SAFE-01`, `CARE-01`, `CARE-04`, `SEARCH-01`, `INST-01`, `LANG-01`, `BRAND-01` | Advisory baseline accepted; formal Unresolved | No hospital reviewer | [Wireframe](../wireframes/home.md); [team review](stakeholder-team-desk-review.md#page-and-flow-structure-recommendations) |
| Emergency | `SAFE-01`–`SAFE-04`, `LANG-01`, `SEC-02`, `DEL-01` | Advisory baseline accepted after correction; formal Unresolved | No hospital reviewer | [Wireframe](../wireframes/emergency.md); [team review](stakeholder-team-desk-review.md#review-changes-incorporated) |
| Doctor Directory | `CARE-01`, `CARE-02`, `CARE-04`, `SEARCH-02`, `LANG-02`, `DEL-01` | Advisory baseline accepted; formal Unresolved | No hospital reviewer | [Wireframe](../wireframes/doctor-directory.md); [team review](stakeholder-team-desk-review.md#page-and-flow-structure-recommendations) |
| Doctor Profile | `CARE-01`–`CARE-03`, `CARE-06`, `BRAND-01`, `LANG-02`, `DEL-01` | Advisory baseline accepted; formal Unresolved | No hospital reviewer | [Wireframe](../wireframes/doctor-profile.md); [team review](stakeholder-team-desk-review.md#page-and-flow-structure-recommendations) |
| Services Directory | `CARE-04`, `CARE-05`, `SEARCH-01`, `SEARCH-02`, `LANG-02`, `DEL-01` | Advisory baseline accepted; formal Unresolved | No hospital reviewer | [Wireframe](../wireframes/services-directory.md); [team review](stakeholder-team-desk-review.md#page-and-flow-structure-recommendations) |
| Service Detail | `SAFE-04`, `CARE-04`–`CARE-06`, `SEC-02`, `LANG-02`, `DEL-01` | Advisory baseline accepted; formal Unresolved | No hospital reviewer | [Wireframe](../wireframes/service-detail.md); [team review](stakeholder-team-desk-review.md#page-and-flow-structure-recommendations) |
| Request an Appointment | `SAFE-01`, `SAFE-02`, `APPT-01`–`APPT-04`, `LANG-01`, `DEL-01` | Advisory baseline accepted after correction; formal Unresolved | No hospital reviewer | [Wireframe](../wireframes/appointment.md); [team review](stakeholder-team-desk-review.md#review-changes-incorporated) |
| Patient & Visitor Information | `GOV-02`, `SAFE-01`, `SAFE-03`, `ACCESS-01`, `LANG-02`, `DEL-01` | Advisory baseline accepted; formal Unresolved | No hospital reviewer | [Wireframe](../wireframes/patient-information.md); [team review](stakeholder-team-desk-review.md#page-and-flow-structure-recommendations) |
| Locations & Contact | `SAFE-01`–`SAFE-03`, `SEC-02`, `LANG-01`, `DEL-01` | Advisory baseline accepted; formal Unresolved | No hospital reviewer | [Wireframe](../wireframes/locations-contact.md); [team review](stakeholder-team-desk-review.md#page-and-flow-structure-recommendations) |
| Search Results | `SAFE-01`, `CARE-01`, `CARE-04`, `SEARCH-01`, `SEARCH-02`, `LANG-01`, `DEL-01` | Advisory baseline accepted; formal Unresolved | No hospital reviewer | [Wireframe](../wireframes/search-results.md); [team review](stakeholder-team-desk-review.md#page-and-flow-structure-recommendations) |
| About the Hospital | `GOV-02`, `INST-01`–`INST-03`, `BRAND-01`, `LANG-02`, `DEL-01` | Advisory baseline accepted; formal Unresolved | No hospital reviewer | [Wireframe](../wireframes/about.md); [team review](stakeholder-team-desk-review.md#page-and-flow-structure-recommendations) |
| Careers | `GOV-02`, `HR-01`–`HR-03`, `SEC-02`, `LANG-02`, `DEL-01` | Advisory Phase 2 baseline accepted; formal Unresolved | No hospital reviewer | [Wireframe](../wireframes/careers.md); [team review](stakeholder-team-desk-review.md#page-and-flow-structure-recommendations) |
| Critical journeys | `SAFE-*`, `APPT-*`, `LANG-01` | Advisory baseline accepted; formal Unresolved | No hospital reviewer | [Flow package](../wireframes/critical-user-flows.md); [team review](stakeholder-team-desk-review.md#page-and-flow-structure-recommendations) |
| Care discovery | `CARE-*`, `SEARCH-*`, `LANG-02` | Advisory baseline accepted; formal Unresolved | No hospital reviewer | [Flow package](../wireframes/care-discovery-flows.md); [team review](stakeholder-team-desk-review.md#page-and-flow-structure-recommendations) |
| Practical access/search | `SAFE-*`, `ACCESS-01`, `SEARCH-*`, `LANG-*` | Advisory baseline accepted; formal Unresolved | No hospital reviewer | [Flow package](../wireframes/practical-access-flows.md); [team review](stakeholder-team-desk-review.md#page-and-flow-structure-recommendations) |
| Institutional/careers | `INST-*`, `BRAND-01`, `HR-*`, `LANG-02` | Advisory baseline accepted; formal Unresolved | No hospital reviewer | [Flow package](../wireframes/institutional-flows.md); [team review](stakeholder-team-desk-review.md#page-and-flow-structure-recommendations) |

## Decision capture template

Copy this block beneath the relevant decision row or link to a durable external decision record.

```text
Decision ID:
Outcome: Approved | Changed | Rejected | Unresolved
Decision statement:
Accountable owner (name and role):
Decision date and timezone:
Evidence link(s):
Requirements affected:
Pages/components/flows affected:
Publication impact: Unblocked | Partially unblocked | Still blocked | Deferred
Review/expiry date or trigger:
Required document changes:
Change owner and due date:
```

## Change-control procedure

When an outcome is **Changed** or **Rejected**:

1. Keep the decision ID in this register and add the durable evidence link.
2. If benchmark use changes, update the affected disposition, local application, direct-copy boundary, and validation measure in the [benchmark traceability register](../benchmarks/benchmark-traceability.md).
3. Update the affected row in the [requirements matrix](../requirements/requirements-matrix.md), including owner, status, acceptance evidence, decision date, and evidence link.
4. Update the corresponding section of the [page specifications](../ux/page-specifications.md).
5. Update any affected [design-system component](../design-system/components.md), [layout pattern](../design-system/layout-patterns.md), or [interaction contract](../design-system/interaction-and-motion.md).
6. Update every affected page wireframe and flow in the same change; do not allow conflicting source and review documents.
7. Re-run benchmark-ID, requirement-ID, link, and contradiction checks and record the result with the decision.

Do not weaken a safety, privacy, accessibility, or content-integrity acceptance criterion silently. A deferral must state which route/content remains unavailable and what safe fallback remains.

## Pass exit criteria

The low-fidelity validation pass is complete only when:

- every role has a named accountable person;
- `GOV-03` has a named outcome and every benchmark disposition remains traceable to a local need, requirement/artifact, gate, and validation measure;
- all 12 page structures and four flow packages have a recorded outcome;
- every decision row has an outcome, named owner, date, and evidence link;
- every Changed or Rejected outcome has been propagated through requirements, specifications, design-system contracts, wireframes, and flows;
- unresolved items name a next owner and remain visibly withheld or blocked;
- `S-001`, `E-001`–`E-004`, `C-001`, `A-001`–`A-007`, `S-004`–`S-006`, `D-001`, `V-001`, and `V-003` have evidence or an explicit release-blocking disposition;
- the executive sponsor signs the resulting Phase 1/Phase 2 scope.

Only then may approved visual directions move into polished responsive design. Prototype and implementation work remain gated by the applicable operational, clinical, privacy, language, brand, security, accessibility, and content decisions.
