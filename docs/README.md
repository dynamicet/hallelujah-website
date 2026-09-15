# Hallelujah Hospital Website Documentation

This folder contains the implementation-facing product, UX, content, and delivery documentation for the Hallelujah General Hospital website rebuild.

For current progress, remaining work, and the next controlled pull, see the [backlog execution board](backlog/execution-board.md).

## First deliverable

| Document | Purpose | Status |
| --- | --- | --- |
| [Requirements matrix](requirements/requirements-matrix.md) | Traceable, testable release requirements with priorities and publication gates | Initial baseline |
| [Sitemap](ux/sitemap.md) | Proposed task-led information architecture and release scope | Initial baseline |
| [Page specifications](ux/page-specifications.md) | Page-by-page goals, content, actions, states, and acceptance criteria | Initial baseline |
| [Utility page specifications](ux/utility-page-specifications.md) | Phase 1 Privacy, Accessibility, and 404/410/unavailable contracts plus explicit deferred utility scope | Implementation-planning baseline |

The first deliverable translates the existing audit, content extraction, benchmark research, and design concept into implementation-ready requirements. It does not approve operational or clinical claims.

## Second deliverable

| Document | Purpose | Status |
| --- | --- | --- |
| [Design-system index](design-system/README.md) | Scope, decision status, implementation order, and approval gates | Initial baseline |
| [Visual foundations](design-system/foundations.md) | Brand direction, accessible token roles, typography, spacing, layout, and media rules | Brand values project-approved by `B01-002`; implementation validation pending |
| [Brand system](brand/README.md) | Identity, logo provenance, palette, bilingual typography, voice, imagery/video, and asset lifecycle | Project-approved by `B01-002` |
| [Layout patterns](design-system/layout-patterns.md) | Reusable page-shell, section, directory, detail, form, and emergency compositions | Initial baseline |
| [Component contracts](design-system/components.md) | Anatomy, variants, states, behavior, content rules, and requirement traceability | Initial baseline |
| [Interaction and motion](design-system/interaction-and-motion.md) | Feedback, transition, progressive enhancement, reduced-motion, loading, media, and failure behavior | Production direction amended 14 September 2026 |

The second deliverable defines the experience system shared by every page. `B01-002` converts the
candidate direction into a source-traceable, project-approved brand foundation. This is not public
release authority: `B01-004` must still validate rendered foundations, `B02-011` must ingest binary
assets, and named language/content/release gates remain binding.

## Third deliverable

| Document | Purpose | Status |
| --- | --- | --- |
| [Wireframe package index](wireframes/README.md) | Conventions, viewports, shared shell, language assumptions, and review checklist | Initial review package |
| [Home wireframe](wireframes/home.md) | Annotated mobile/desktop structure and essential discovery routes | Initial review package |
| [Emergency wireframe](wireframes/emergency.md) | Annotated urgent-call and arrival structure with accidental-activation safeguards | Publication-gated review package |
| [Appointment wireframe](wireframes/appointment.md) | Annotated request form plus validation, loading, failure, duplicate, and success behavior | Publication-gated review package |
| [Critical user flows](wireframes/critical-user-flows.md) | Home routing, emergency, appointment recovery, and language-switch flows | Initial review package |
| [Utility page wireframes](wireframes/utility-pages.md) | Privacy, Accessibility, and genuine 404/410/unavailable structures and states | Implementation-planning review package |

The third deliverable is intentionally low fidelity. It validates hierarchy, behavior, responsive reflow, bilingual handling, safety, and traceability; it does not approve public copy, operational facts, visual branding, or production implementation.

## Fourth deliverable

| Document | Purpose | Status |
| --- | --- | --- |
| [Doctor Directory wireframe](wireframes/doctor-directory.md) | Approved-roster search/filter, canonical results, and zero/failure recovery | Publication-gated review package |
| [Doctor Profile wireframe](wireframes/doctor-profile.md) | Governed identity, expertise, relationships, schedule boundary, and appointment handoff | Publication-gated review package |
| [Services Directory wireframe](wireframes/services-directory.md) | Single patient taxonomy, governed search, urgent boundary, and uncertainty routes | Publication-gated review package |
| [Service Detail wireframe](wireframes/service-detail.md) | Approved scope/capability, urgent exception, practical guidance, and request handoff | Publication-gated review package |
| [Care-discovery flows](wireframes/care-discovery-flows.md) | Doctor/service discovery, recovery, publication gates, relationships, and language continuity | Initial review package |

The fourth deliverable extends the low-fidelity package into care discovery. It intentionally leaves roster, schedule, taxonomy, relationship, capability, location, contact, clinical, and translation facts behind accountable approval gates. It also clarifies that unresolved schedules are omitted rather than blocking an otherwise approved doctor profile solely because no schedule is shown.

## Fifth deliverable

| Document | Purpose | Status |
| --- | --- | --- |
| [Patient & Visitor Information wireframe](wireframes/patient-information.md) | Before/during/after visit guidance, unavailable-topic recovery, and governed practical content | Publication-gated review package |
| [Locations & Contact wireframe](wireframes/locations-contact.md) | Purpose-labeled calls, canonical access data, text-first arrival, and optional-map failure behavior | Publication-gated review package |
| [Search Results wireframe](wireframes/search-results.md) | Typed canonical results, urgent routing, correction/recovery, and sensitive-query boundary | Publication-gated review package |
| [Practical-access and site-search flows](wireframes/practical-access-flows.md) | Visit planning, calling/arrival, detailed search, urgent terms, recovery, privacy, and language continuity | Initial review package |

The fifth deliverable completes the practical-access page set and detailed site-search flow at low fidelity. It does not approve patient guidance, contacts, hours, entrances, directions, searchable taxonomy, urgent terms, analytics/log handling, maps, or translations. It also resolves a source-specification gap by defining privacy controls for first-party search logs, caches and referrers—not only optional analytics.

## Sixth deliverable

| Document | Purpose | Status |
| --- | --- | --- |
| [About the Hospital wireframe](wireframes/about.md) | Evidence-backed institutional narrative, leadership, facts, relationships, imagery, and care-task return paths | Publication-gated review package |
| [Careers wireframe](wireframes/careers.md) | Current-vacancy records, application/privacy boundary, honest empty and closed states, and HR governance | Phase 2 publication-gated review package |
| [Institutional-content and vacancy-lifecycle flows](wireframes/institutional-flows.md) | Institutional publication/expiry, vacancy lifecycle, candidate-data, third-party, and bilingual continuity | Initial review package |

The sixth deliverable completes the 12 planned page types at low fidelity. It does not approve mission/history, leadership, capacity or facility claims, partner/insurer relationships, equality wording, vacancies, application handling, recruitment privacy, translations, or imagery rights. It also closes a source-specification gap by defining vacancy identity, opening/closing, stale-destination behavior, provider/data-flow checks, and the no-current-vacancy state.

## Seventh deliverable

| Document | Purpose | Status |
| --- | --- | --- |
| [Benchmark traceability and local incorporation](benchmarks/benchmark-traceability.md) | Maps all cross-site patterns and institution-specific candidates to local applications, requirements, pages, gates, and validation measures | Approved unchanged through `B00-017` / `GOV-03` |
| [Institution-specific candidate crosswalk](benchmarks/institution-candidate-crosswalk.md) | Individually dispositions all 120 source-organization candidate transfers | Complete and approved unchanged through `B00-017` / `GOV-03` |

The seventh deliverable closes the gap between the external benchmark library and the implementation-facing blueprint. It records Adopt, Adapt, Test, Defer, and Reject decisions without treating benchmark behavior as hospital approval or copying external clinical, operational, visual, or policy content.

## Eighth deliverable

| Document | Purpose | Status |
| --- | --- | --- |
| [Stakeholder low-fidelity validation and decision pass](validation/stakeholder-low-fidelity-validation.md) | Role-grouped decision register, scenario walkthroughs, page/flow coverage, evidence capture, and change control | `GOV-02` and `GOV-03` approved for controlled implementation planning; 30 formal outcomes unresolved |
| [Multidisciplinary stakeholder team desk review](validation/stakeholder-team-desk-review.md) | Advisory review of all decisions and structures, safe defaults, evidence blockers, and human closeout actions | Advisory review complete; current formal outcomes are maintained in the validation register |

The eighth deliverable prepares the review process across all 12 page types, four flow packages, and the benchmark disposition register. A multidisciplinary advisory desk review assessed every decision and structure, recorded safe defaults, and corrected two blueprint issues. `GOV-02` was subsequently approved for backlog planning, and `GOV-03` for benchmark use, through recorded client direction. Hospital owners must still complete the participant, session, outcome, and evidence fields for the other 30 formal decisions before the applicable production/publication gates can close.

## Visual design execution

| Document | Purpose | Status |
| --- | --- | --- |
| [Visual design workspace](visual-design/README.md) | Order register, artifact conventions, prototype labeling, folders, and change control | Orders 1–12 complete for non-public blueprint and handoff |
| [Order 1 design audit](visual-design/order-1-design-audit.md) | Complete page/section/component/state/asset inventory, visual-decision gaps, safe placeholders, and Order 2 handoff | Complete at document-review level |
| [Orders 2–5 direction, motion, foundations, and components](visual-design/README.md) | Selected Calm Wayfinding direction and its inherited prototype system | Complete for non-public prototype use |
| [Order 6 critical-journey designs](visual-design/pages/critical-journeys/README.md) | Polished Home, Emergency, Appointment, and appointment-state studies | Complete for non-public responsive design review |
| [Order 7 care-discovery designs](visual-design/pages/care-discovery/README.md) | Polished doctor/service directories, detail pages, and state studies | Complete for non-public responsive design review |
| [Order 8 practical and institutional designs](visual-design/pages/practical-institutional/README.md) | Polished practical-access, Search, About, Careers, and cross-page state studies | Complete for non-public responsive design review |
| [Order 9 responsive and bilingual refinement](visual-design/pages/responsive/README.md) | Complete-page viewport/reflow matrix, language/content fixtures, shared corrections, repeatable audit, and visual evidence | Complete for non-public prototype review |
| [Order 10 connected prototype](visual-design/prototype/README.md) | Local progressive-enhancement journeys, controlled state transitions, and repeatable interaction/geometry evidence | Complete for non-public browser review |
| [Order 11 design and motion QA](visual-design/qa/README.md) | Performed semantic, contrast, keyboard, state, motion, resilience, and constrained-profile audit with explicit evidence limits | Complete for performed non-public prototype QA |
| [Order 12 developer handoff](visual-design/handoff/README.md) | Canonical source map, implementation boundaries, page/gate matrices, asset policy, accessibility checklist, and integrity evidence | Complete for implementation planning; release gates remain open |
| [High-end motion and interactive-media amendment](visual-design/motion/high-end-motion-and-interactive-media-amendment.md) | Post-handoff production direction for choreographed motion, static-first video, imagery, stable contexts, performance, and acceptance | Approved for production planning; implementation/assets/validation open |

Orders 1–12 complete the non-public blueprint, connected prototype, performed local QA, and developer handoff without approving hospital facts, operations, identity, language, assets, personal-data flows, third parties, production implementation, or publication. The 14 September motion/media amendment changes the production expressive ceiling, not those approval boundaries or the accepted page hierarchies. The handoff preserves all 12 core page hierarchies, adds implementation contracts for the three Phase 1 utility behaviors, carries all 32 formal decisions forward, and prevents controlled prototype content from being mistaken for approved public content.

## Implementation planning

| Document | Purpose | Status |
| --- | --- | --- |
| [Epic 0 — Initial production architecture](architecture/epic-0-technical-foundation.md) | Records the approved Payload/Next.js/PostgreSQL/GitHub/VPS foundation, same-VPS logical data separation, delivery controls, observability, evidence model, and remaining selections | Approved implementation-planning baseline; security, privacy, acceptance, and release gates remain open |
| [Implementation acceptance matrix](validation/implementation-acceptance-matrix.md) | Defines evidence tiers, supported platforms/devices, responsive and language coverage, security/performance tests, defect thresholds, evidence/authority rules, exceptions, and per-ticket benchmark proof | Accepted for controlled development; formal `DEL-01` production closure deferred |
| [Implementation backlog](backlog/README.md) | Execution-controlled delivery backlog with live pull order, operating rules, roadmap, traceability, acceptance criteria, evidence, and AI-assisted coding controls | `B01-010` and `B01-012` are complete for controlled development; `B01-008` and `B01-011` retain their named gates |

The architecture and acceptance baselines assign technical implementation to the external development entity while preserving hospital approval of business, privacy, security, cost, operational, and release constraints. `B00-016` supplies the working development matrix and is deferred only at the formal production-signature/evidence boundary. `B00-011` supplies the passing local and hosted CI baseline; technical merge enforcement remains a separate `B00-012` concern under the private/free-plan constraint. `B01-001` supplies the production UI boundaries, and `B01-003` supplies the generated provisional token pipeline without approving final brand values. None of these baselines authorizes appointment-data collection or production publication.

## Source hierarchy

Use sources in this order when documents disagree:

1. Approved decisions recorded by the hospital's named executive, clinical, or operational owner
2. The structured records in [`../../resources/data/`](../../resources/data/) and [`../../resources/hospital-profile.json`](../../resources/hospital-profile.json)
3. The verification queue in [`../../resources/content-review.md`](../../resources/content-review.md)
4. The experience direction in [`../../concepts/design-concept.md`](../../concepts/design-concept.md)
5. Benchmark research in [`../../benchmarks/`](../../benchmarks/), interpreted through the local [benchmark traceability register](benchmarks/benchmark-traceability.md)

Benchmark evidence never outranks an approved local requirement or named hospital decision. It supplies pattern provenance and test hypotheses, not hospital facts.

The public website is an evidence source, not an automatic source of truth. The audit found a known SEO-spam compromise, conflicting contact details, duplicated records, and unsupported claims.

## Requirement language

- **Must**: release-blocking safety, accessibility, security, legal, or core journey requirement.
- **Should**: expected product quality; deviation needs a recorded reason and owner.
- **May**: optional or later-phase capability.

## Status language

- **Ready**: sufficient approved source content exists for implementation.
- **Verify**: extracted content exists, but an accountable hospital owner must confirm it.
- **Missing**: the hospital must provide new content or an operational decision.
- **Blocked**: implementation or publication must not proceed until the named dependency is resolved.

## Ownership and approval

The titles below are temporary role-based names for routing work. Replace each `TBD` with an authorized person's full name before treating any decision as formally approved.

| Temporary role-based name | Organization side | Responsibility |
| --- | --- | --- |
| TBD — Hospital General Manager / CEO | Hospital | Institutional claims, scope, and final publication approval |
| TBD — Hospital Project Owner / Focal Person | Hospital | Product priorities, release scope, and coordination of hospital decisions |
| TBD — Medical Director | Hospital | Service scope, urgent guidance, and clinical wording |
| TBD — Hospital Operations Manager | Hospital | Contacts, hours, directions, appointment workflow, and service availability |
| TBD — Facilities Manager | Hospital | Entrances, access routes, facilities facts, and on-site validation |
| TBD — Communications / Content Manager | Hospital | Doctor, service, location, institutional content, and review schedules |
| TBD — Professional Amharic Language Reviewer | Hospital or commissioned specialist | Amharic quality, terminology, and bilingual parity review |
| TBD — Legal / Compliance Officer | Hospital | Privacy notices, consent, retention, legal wording, and data governance |
| TBD — Hospital IT / Information Security Manager | Hospital | Incident closure, third parties, security controls, and hospital-side technical authority |
| TBD — Marketing / Communications Manager | Hospital | Brand, logo, imagery, and asset rights |
| TBD — Human Resources Manager | Hospital | Phase 2 Careers content, vacancy lifecycle, and recruitment policy |
| TBD — External Project / Delivery Lead | External development entity | Implementation, architecture, delivery evidence, defects, and release preparation |
| TBD — External QA / Accessibility Lead | External development entity | Test strategy, accessibility validation, quality evidence, and retesting |

Role placeholders enable backlog assignment but are not signatures. Formal approval still requires the real person's name, date, authority confirmation, and evidence link in the [stakeholder validation register](validation/stakeholder-low-fidelity-validation.md#named-participants).

## Change control

When a requirement changes, update its row in the matrix and the affected page specification in the same change. Record the decision owner, date, and evidence link in the requirement's notes rather than silently weakening acceptance criteria.
