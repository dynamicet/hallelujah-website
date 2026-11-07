# Website Requirements Matrix

**Product:** Hallelujah General Hospital public website  
**Version:** 0.2 benchmark-traceable baseline  
**Prepared:** 10 September 2026; benchmark incorporation updated 11 September 2026  
**Status:** Working requirements; hospital approval required  

## Purpose

This matrix defines the minimum verifiable behavior and content for the public website. It is the traceability layer between research, design, content, implementation, and acceptance testing.

### Development fixtures and production facts

Client clarification, 30 October 2026 (this conversation): institutional approval gates apply to production facts and publication. Development and non-public design previews use mock data to render complete KPI/statistics sections and demonstrate dynamic value updates without visible demo labels, mock-data badges, disclaimers or approval-pending notices. The preview context establishes that the content is provisional; the page should show the intended finished design. Pending institutional facts must not prevent implementation or remove those sections from development previews. Mock values are not approved hospital facts and must not become a production fallback. Production empty, expired and unavailable states must also be reviewable. This clarification does not change the existing motion rules; permission to mock dynamic data does not itself authorize count-up animation.

### Priority and phase

- **P0**: safety, security, privacy, or release blocker
- **P1**: required for a useful public-service launch
- **P2**: required for operational maturity after the safe foundation
- **P3**: evidence-led enhancement
- **Phase 0**: safety and recovery before public launch
- **Phase 1**: safe English foundation plus safety-critical Amharic content
- **Phase 2**: essential-journey Amharic parity and operational expansion
- **Phase 3**: optional enhancements with demonstrated operating capacity

### Source codes

| Code | Source |
| --- | --- |
| DC | [`../../../concepts/design-concept.md`](../../../concepts/design-concept.md) |
| CR | [`../../../resources/content-review.md`](../../../resources/content-review.md) |
| CI | [`../../../resources/content-inventory.md`](../../../resources/content-inventory.md) |
| HP | [`../../../resources/hospital-profile.json`](../../../resources/hospital-profile.json) |
| DR | [`../../../resources/data/doctors.json`](../../../resources/data/doctors.json) |
| SV | [`../../../resources/data/services.json`](../../../resources/data/services.json) |
| AU | [`../../../audit/report-source.md`](../../../audit/report-source.md) |
| BM | [`../benchmarks/benchmark-traceability.md`](../benchmarks/benchmark-traceability.md) and the underlying [`../../../benchmarks/`](../../../benchmarks/) study |

Benchmark patterns are supporting evidence, not requirements by themselves. The [benchmark traceability register](../benchmarks/benchmark-traceability.md) records which external patterns are adopted, locally adapted, test-only, deferred, or rejected and maps each included pattern back to the requirement IDs below. Hospital approval and benchmark disposition remain separate decisions.

## Global experience and quality

| ID | Requirement | Level | Priority / phase | Acceptance evidence | Content status | Owner |
| --- | --- | --- | --- | --- | --- | --- |
| G-001 | Every page exposes predictable access to Emergency, Call, Find a Doctor, Services, Appointments, and Contact/Directions. | Must | P1 / Phase 1 | Keyboard and mobile walkthrough from every template reaches each route without a dead end. | Ready: direction; Verify: final labels | Product + Operations |
| G-002 | Navigation uses patient tasks instead of duplicating the hospital's internal department structure. | Must | P1 / Phase 1 | Primary navigation matches the approved sitemap and usability test participants can identify the correct starting point. | Ready: direction | Product |
| G-003 | The interface is mobile-first and has no two-dimensional page scrolling at 320 CSS px or 400% zoom. | Must | P1 / Phase 1 | Reflow tests pass for every template; essential controls remain visible and operable. | Ready | Delivery |
| G-004 | Normal text meets 4.5:1 contrast; large text and meaningful graphics meet 3:1. | Must | P0 / Phase 1 | Automated and manual checks cover default, hover, focus, disabled, error, and success states. | Ready | Design + QA |
| G-005 | All functionality is keyboard operable with visible focus and logical focus order. | Must | P0 / Phase 1 | Keyboard-only test passes every route and state; no keyboard trap exists. | Ready | Delivery + QA |
| G-006 | Interactive targets are at least 44 by 44 CSS px with adequate separation. | Must | P1 / Phase 1 | Measurement and touch-device review pass for header, forms, filters, cards, and footer actions. | Ready | Design + QA |
| G-007 | Essential information remains available when non-essential JavaScript or third-party embeds fail. | Must | P0 / Phase 1 | Emergency, contact, service, doctor, and appointment fallback content works in a scripted-failure test. | Ready | Delivery |
| G-008 | Pages meet the agreed mobile performance budgets: LCP at most 2.5 s, INP at most 200 ms, CLS at most 0.1 at the field 75th percentile. | Must | P1 / Phase 1 | Pre-launch lab results and post-launch field monitoring are recorded by template. | Ready | Delivery |
| G-009 | Initial compressed page transfer is at most 1 MB, first-party JavaScript at most 150 KB, and initial usable view at most 50 requests unless a documented exception is approved. | Should | P1 / Phase 1 | Repeatable performance report from the agreed constrained mobile profile. | Ready | Delivery |
| G-010 | Content has a meaningful heading hierarchy, landmarks, descriptive link text, alt text where imagery conveys meaning, and no essential meaning communicated by color alone. | Must | P0 / Phase 1 | Automated audit plus manual screen-reader review of every template. | Ready | Content + QA |
| G-011 | Loading, empty, error, success, unavailable, and no-JavaScript states are designed wherever applicable. | Must | P1 / Phase 1 | State inventory and acceptance tests exist for each interactive component and route. | Ready: requirement | Product + Delivery |
| G-012 | Motion explains state, spatial change, or an intentionally art-directed story: functional feedback stays typically within 80–300 ms; selected non-critical compositions may use 250–1200 ms choreography; all meaning and actions precede enhancement and `prefers-reduced-motion` receives an intentional equivalent. | Should | P1 / Phase 1 | Motion inventory, default/reduced/Save-Data comparison, interaction review, and measured device/performance evidence pass under the [high-end motion amendment](../visual-design/motion/high-end-motion-and-interactive-media-amendment.md). | Ready: amended direction; implementation evidence missing | Design + Delivery |
| G-013 | Core content is rendered as indexable semantic HTML with clean canonical URLs, accurate metadata, genuine 404/410 responses, breadcrumbs, and valid sitemaps. | Must | P1 / Phase 1 | Crawl report and structured-data validation pass; unsupported properties are absent. | Ready: direction | Delivery + Content |
| G-014 | Each published operational or clinical record has an owner, source, last-reviewed date, and review/expiry interval. | Must | P0 / Phase 1 | No governed template publishes an unowned or expired record. | Missing: named owners | Executive + Content |
| G-015 | Optional fields with no approved value are omitted; the interface never displays invented text or placeholder claims. | Must | P0 / Phase 1 | Content fixture tests confirm null optional fields do not render misleading placeholders. | Ready | Content + Delivery |
| G-016 | Public labels, summaries, instructions, errors, and next steps use concise patient language; necessary clinical or administrative terms are explained without changing their approved meaning. | Must | P1 / Phase 1 | Representative English/Amharic comprehension review covers essential journeys, low health literacy, error recovery, and screen-reader output. | Ready: direction; Missing: approved bilingual content and test participants | Content + Clinical + QA |

## Safety, security, privacy, and language

| ID | Requirement | Level | Priority / phase | Acceptance evidence | Content status | Owner |
| --- | --- | --- | --- | --- | --- | --- |
| S-001 | The known SEO-spam compromise is investigated and remediated before the rebuilt site becomes the trusted production source. | Must | P0 / Phase 0 | Incident record includes cleanup, credential rotation, patching, sitemap/index remediation, hardening, and monitoring validation. | Blocked: incident closure not evidenced | Security + Executive |
| S-002 | HTTPS is enforced sitewide with architecture-appropriate secure headers and cookie settings. | Must | P0 / Phase 1 | External TLS/header scan and cookie review pass in the release environment. | Ready: requirement | Security + Delivery |
| S-003 | Public forms use server-side validation, rate limiting, abuse controls, safe errors, and never place personal data in URLs, analytics, or client logs. | Must | P0 / Phase 1 | Security test evidence covers malformed input, abuse limits, logging, transport, and failure handling. | Ready: requirement | Security + Delivery |
| S-004 | A reviewed privacy notice states collection purpose, lawful basis where applicable, recipients, retention, user choices, and contact route. | Must | P0 / Phase 1 | Privacy owner approves visible notice and form-specific disclosure before collection begins. | Missing | Privacy/legal |
| S-005 | Analytics, chat, maps, pixels, session replay, and other third parties require a named purpose, approved data flow, failure behavior, and performance/privacy review. | Must | P0 / Phase 1 | Third-party register exists; unapproved integrations make no requests. | Missing: register/decisions | Privacy + Security |
| S-006 | Amharic Phase 1 coverage includes emergency guidance, appointment warnings/instructions and system messages, primary navigation, contact details, landmark directions, and form privacy/consent text. | Must | P0 / Phase 1 | Professional language and clinical review recorded; language switch retains context where an equivalent exists. | Missing: approved translations | Clinical + Content |
| S-007 | All essential journeys reach approved English–Amharic content parity in Phase 2. | Must | P2 / Phase 2 | Parity audit finds no missing content or interaction states across in-scope routes. | Missing | Content |
| S-008 | The language switch never implies full parity, silently sends a user to Home, or hides that an equivalent page is unavailable. | Must | P1 / Phase 1 | Route-by-route switching and unavailable-language state tests pass. | Ready: requirement | Product + Delivery |

## Home and global discovery

| ID | Requirement | Level | Priority / phase | Acceptance evidence | Content status | Owner |
| --- | --- | --- | --- | --- | --- | --- |
| H-001 | Home prioritizes essential tasks above promotional content: Emergency, Doctor, Service, Appointment, Call, and Directions. | Must | P1 / Phase 1 | At 320 px and desktop, all essential routes are visible or in the predictable header before campaigns. | Ready: direction | Product |
| H-002 | Home uses a static-first task-oriented introduction, never auto-rotates content, and may add approved user-initiated hero or institutional media without delaying, covering, or reordering care and Emergency actions. | Must | P1 / Phase 1 | Visual/interaction review confirms one clear primary message, zero pre-intent video request, persistent playback controls, complete poster/failure/reduced states, and unchanged task recognition. | Ready: amended direction; authentic media/Brand approval missing | Design |
| H-003 | Featured doctors and services are drawn only from approved governed records. | Must | P0 / Phase 1 | Each feature links to a published canonical record and disappears cleanly when none are selected. | Verify | Content |
| H-004 | Production statistics, leadership, technology, partner, proximity, and superlative claims appear only after their sources, dates, owners, and usage rights are approved. Development and non-public previews retain complete sections using mock data without visible demo or mock-data labeling. | Must | P0 / Phase 1 | Production claim ledger links every visible claim to current approval; unapproved claims and mock fallbacks are absent. Development previews demonstrate populated sections independently of institutional approval, plus production omission/unavailable states. | Development fixtures permitted; production facts pending verification | Executive + Content |
| H-005 | Site search matches doctors, services, clinically governed condition terms, and locations without presenting diagnosis or treatment advice. | Must | P1 / Phase 1 | Search relevance tests cover spelling variants, type labels, empty state, and urgent-term routing. | Verify: taxonomy and urgent terms | Clinical + Product |

## Emergency

| ID | Requirement | Level | Priority / phase | Acceptance evidence | Content status | Owner |
| --- | --- | --- | --- | --- | --- | --- |
| E-001 | Emergency and ambulance numbers are verified, clearly labeled, and implemented as tap-to-call actions. | Must | P0 / Phase 0 | Operations owner signs off each number; link values and visible values match. | Verify: `+251-940-105692` published for both | Operations |
| E-002 | The page distinguishes the hospital contact from the applicable public emergency number and explains when each should be used. | Must | P0 / Phase 1 | Clinical/operations approval and comprehension testing pass. | Missing | Clinical + Operations |
| E-003 | The page states that forms, email, chat, and social messaging are not monitored for emergencies. | Must | P0 / Phase 1 | Warning is visible before any non-urgent contact option and announced by screen readers. | Missing: approved wording | Clinical |
| E-004 | Exact emergency entrance, landmark-based directions, access hours, and verified service scope are displayed as text. | Must | P0 / Phase 1 | Arrival details pass an on-site verification and no-JavaScript review. | Missing/Verify | Operations |
| E-005 | Emergency guidance works without JavaScript and under the agreed slow-network profile. | Must | P0 / Phase 1 | Phone and directions content remains usable with scripts blocked and assets throttled. | Ready: requirement | Delivery |

## Doctors

| ID | Requirement | Level | Priority / phase | Acceptance evidence | Content status | Owner |
| --- | --- | --- | --- | --- | --- | --- |
| D-001 | The initial directory includes only hospital-approved current clinicians; extraction identifies 17 current-directory records and 15 additional profile-only records requiring review. | Must | P0 / Phase 1 | Approved roster is reconciled against canonical records; stale profiles are unpublished or redirected. | Verify | Medical staff owner |
| D-002 | Directory search supports name and specialty/service; filters appear only for fields with reliable maintained values. | Must | P1 / Phase 1 | Search/filter tests cover combinations, reset, URL state, zero results, keyboard use, and result count announcements. | Ready: name/specialty; Missing: other filter data | Product + Content |
| D-003 | Every directory card links to one canonical profile; duplicate cards and duplicate URLs are removed. | Must | P1 / Phase 1 | Crawl shows one canonical URL per approved clinician; Dr. Abel Zemenfes link and duplicate records are resolved. | Verify | Content + Delivery |
| D-004 | Profiles contain approved name, credentials, specialty, clinical interests, languages, location, availability guidance, appointment route, and review date; absent optional fields are omitted. | Must | P1 / Phase 1 | Profile completeness audit passes against the approved schema. | Missing/Verify | Medical staff owner |
| D-005 | Schedules are not published until duplicate Saturday rows, missing Sunday rows, and the meaning of `LT` are resolved. | Must | P0 / Phase 1 | Operations approves an unambiguous schedule model and timezone/display convention. | Blocked | Operations |
| D-006 | Portraits require approval and usage rights; placeholders use a consistent accessible fallback without implying a real photograph. | Must | P1 / Phase 1 | Asset register documents approval; fallback images have appropriate alternative text treatment. | Verify | Content |

## Services

| ID | Requirement | Level | Priority / phase | Acceptance evidence | Content status | Owner |
| --- | --- | --- | --- | --- | --- | --- |
| V-001 | The service directory uses one patient-oriented taxonomy for the 39 extracted service records and does not expose competing “department” and “service” hierarchies. | Must | P1 / Phase 1 | Clinical owner approves groups, names, synonyms, slugs, and service-to-doctor relationships. | Verify | Clinical + Content |
| V-002 | Each service page explains who it helps, common needs/conditions, verified tests or treatments, relevant clinicians, location/hours, preparation/referral needs, urgent exceptions, and how to request care. | Must | P1 / Phase 1 | Required-field and clinical-review checks pass; absent optional information is not invented. | Missing/Verify | Clinical + Operations |
| V-003 | High-consequence capability claims are withheld until scope, eligibility, availability, location, and owner are approved. | Must | P0 / Phase 1 | Claim ledger covers each published capability; unsupported claims are absent. | Blocked: claims listed in content review | Clinical + Executive |
| V-004 | Known copied headings, duplicated text, misspellings, and taxonomy overlaps are corrected through clinical/editorial review. | Must | P1 / Phase 1 | Content QA has no known incorrect cross-service heading or duplicated Ophthalmology/Speech Therapy copy. | Verify | Clinical + Content |
| V-005 | Service pages link bidirectionally to relevant approved doctors, location information, and the correct appointment route. | Should | P1 / Phase 1 | Relationship tests find no broken, stale, or circular-only journey. | Missing: governed relationships | Content |

## Appointment request

| ID | Requirement | Level | Priority / phase | Acceptance evidence | Content status | Owner |
| --- | --- | --- | --- | --- | --- | --- |
| A-001 | The journey consistently says “request an appointment” and never implies that submitting the form confirms a booking. | Must | P0 / Phase 1 | Page title, CTA, form, API response, confirmation, email/SMS, and errors use approved request language. | Verify: operating workflow | Operations + Content |
| A-002 | A visible “not for emergencies” warning with the verified emergency call action appears before the form. | Must | P0 / Phase 1 | Visual, keyboard, and screen-reader checks confirm warning placement and action. | Missing: approved wording | Clinical |
| A-003 | The form collects only the minimum approved information; users can choose a doctor, service, or “not sure” route without conflicting mandatory fields. | Must | P0 / Phase 1 | Data-minimization review approves every field and conditional validation path. | Verify: seven extracted fields | Privacy + Operations |
| A-004 | Every field has a persistent visible label, accessible instructions, inline validation, an error summary, and retains valid input after errors. | Must | P1 / Phase 1 | Keyboard, screen-reader, invalid/valid, refresh, timeout, and resubmission tests pass. | Ready: requirement | Delivery + QA |
| A-005 | Consent and privacy information is shown before submission and is not preselected. | Must | P0 / Phase 1 | Privacy owner approves copy, recording behavior, retention, and withdrawal/contact route. | Missing | Privacy/legal |
| A-006 | Success states give a reference, truthful response expectation, confirmation channel, next step, and staffed telephone fallback; failure states preserve input and give recovery options. | Must | P0 / Phase 1 | Operations and end-to-end tests validate success, duplicate, validation, timeout, API failure, and retry behavior. | Missing: SLA/channel/fallback decision | Operations + Delivery |
| A-007 | Submission is idempotent or otherwise protected against duplicate requests caused by double-clicks, retries, or network recovery. | Must | P0 / Phase 1 | Automated tests prove one operational request per submission intent. | Ready: requirement | Delivery |

## Contact, directions, and patient information

| ID | Requirement | Level | Priority / phase | Acceptance evidence | Content status | Owner |
| --- | --- | --- | --- | --- | --- | --- |
| C-001 | One approved canonical set of switchboard, emergency, ambulance, email, address, and hours data is reused across all pages. | Must | P0 / Phase 0 | Operations reconciles conflicting numbers; automated content test finds no divergent copies. | Blocked: conflicts documented | Operations |
| C-002 | Directions include exact address, landmark-based text, map coordinates, correct entrance, parking/vehicle access, public transport where maintainable, and accessible entrance guidance. | Must | P1 / Phase 1 | On-site arrival test passes without relying on the interactive map. | Missing/Verify | Facilities + Operations |
| C-003 | An interactive map is optional, loads only after approved privacy/performance handling, and always has an equivalent text route. | Must | P1 / Phase 1 | Page remains complete when the map is blocked; third-party review is recorded. | Ready: requirement | Privacy + Delivery |
| P-001 | Patient & Visitor Information is organized around before, during, and after a visit rather than internal teams. | Must | P1 / Phase 1 | Hub links to preparation, arrival, visiting, payment, accessibility, discharge, rights, and feedback content or clearly identifies approved unavailable items. | Missing: most source content | Operations + Content |
| P-002 | Visiting hours/rules, admission/discharge, payment/insurance, accessibility support, patient rights, complaints, safeguarding, and what-to-bring guidance are hospital-authored and approved before publication. | Must | P1/P2 | Topic owner and review date exist for every published guide; unsupported empty pages are absent. | Missing | Operations + Privacy/Legal |

## Institutional and secondary content

| ID | Requirement | Level | Priority / phase | Acceptance evidence | Content status | Owner |
| --- | --- | --- | --- | --- | --- | --- |
| I-001 | About content uses approved story, mission, vision, values, leadership, and evidence-dated facts; known conflicting mission copy is resolved. | Must | P1 / Phase 1 | Executive approval and claim-ledger review pass. | Verify | Executive |
| I-002 | Leadership names, titles, tenure, biographies, and portraits are current and approved. | Must | P1 / Phase 1 | Each record has owner, evidence, review date, and image rights. | Verify | Executive |
| I-003 | Partner and insurer names/logos state the patient-relevant relationship and appear only with current relationship and publication-rights approval. | Must | P1/P2 | Partner register documents status, meaning, rights, owner, and review date. | Verify | Executive + Operations |
| I-004 | Careers publishes only maintained vacancies with location, role, closing date, application route, equal-opportunity/privacy information, and expired-state behavior. | Should | P2 / Phase 2 | Vacancy owner can publish/expire records; application data flow is approved. | Missing: policy/workflow | HR + Privacy |
| I-005 | Health/news content requires a named author, clinical reviewer when medically relevant, published/review dates, sources, and an expiry/update rule. | Must | P2 / Phase 2 | Content workflow prevents publication when governance metadata is incomplete. | Missing | Clinical + Content |

## Release gates

Public launch is blocked until all of the following are evidenced:

- [ ] SEO-spam incident response and trusted-source recovery are closed (`S-001`).
- [ ] Emergency, ambulance, switchboard, address, entrance, and hours are reconciled (`E-001`, `E-004`, `C-001`).
- [ ] Clinical and operational owners approve doctor and service publication scope (`D-001`, `V-001`, `V-003`).
- [ ] Appointment request semantics, response expectation, fallback, consent, retention, and failure handling are approved (`A-001`–`A-007`).
- [ ] Privacy notice and third-party data-flow decisions are approved (`S-004`, `S-005`).
- [ ] Phase 1 Amharic safety content is professionally translated and reviewed (`S-006`).
- [ ] Accessibility, responsive, performance, security, and content acceptance evidence passes (`G-003`–`G-013`).

## Decisions needed next

| Decision | Why it is needed | Accountable role |
| --- | --- | --- |
| Name the executive, clinical, operations, content, privacy/security, and delivery owners. | Requirements cannot be approved or kept current without accountable people. | Executive sponsor |
| Confirm the public launch scope and whether incomplete secondary pages are hidden or deferred. | Prevents empty or unsafe pages from being treated as Phase 1 requirements. | Executive + Product |
| Reconcile all phone numbers, hours, entrance, and location directions. | Unblocks the two highest-risk patient journeys. | Operations |
| Approve the initial doctor roster, service taxonomy, and high-consequence capabilities. | Determines what the site may safely publish. | Clinical + Medical staff owner |
| Define the appointment operating model, response expectation, staffed fallback, and data lifecycle. | Determines form copy, validation, confirmation, privacy, and integration behavior. | Operations + Privacy |
| Approve the Phase 1 translation workflow and reviewers. | Safety-critical Amharic content must be available at launch. | Clinical + Content |
