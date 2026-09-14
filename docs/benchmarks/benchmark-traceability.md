# Benchmark Traceability and Local Incorporation

**Version:** 1.0 approved implementation baseline  
**Prepared:** 11 September 2026; approved 13 September 2026  
**Status:** `B00-017` / `GOV-03` approved for controlled implementation; review again only on a recorded change trigger  
**Scope:** The 93 cross-site patterns and 120 institution-specific candidate transfers in [`../../../benchmarks/`](../../../benchmarks/)

## Purpose

This document connects the external benchmark study to the Hallelujah requirements, sitemap, page specifications, design-system contracts, wireframes, flows, validation decisions, and future acceptance evidence. It makes clear what the blueprint has adopted, adapted, left for testing, deferred, or rejected.

The benchmark sites are evidence of possible patterns, not proof that a pattern is safe, useful, lawful, or operationally supportable for Hallelujah General Hospital. No contact, clinical, appointment, language, payment, staffing, availability, quality, or institutional claim may be copied from a benchmark.

## Decision and approval model

| Blueprint disposition | Meaning in this document | What it does not mean |
| --- | --- | --- |
| Adopt | The underlying pattern is already expressed substantially in the working blueprint. | Hospital approval, publication approval, or permission to copy a benchmark implementation. |
| Adapt | The underlying pattern is expressed with a narrower or locally safer structure. | Approval of the gated content, data, workflow, or wording needed to operate it. |
| Test | The pattern is a candidate for stakeholder review and prototype/usability validation before commitment. | Permission to add it to Phase 1 or expose an unsupported capability. |
| Defer | The pattern is outside the current release or depends on unavailable evidence, operations, data, identity, or technology. | Permanent rejection. |
| Reject | Direct use conflicts with the project’s safety, accessibility, privacy, content-integrity, or task-priority rules. | Rejection of the patient need that motivated the benchmark pattern. |

The complete disposition map was approved unchanged through `B00-017` / `GOV-03` on 13 September 2026. This approves how benchmark evidence may influence implementation; it does not approve hospital facts, clinical or operational behavior, personal-data processing, third parties, translations, claims, or publication. Those remain controlled by their named decision and release gates.

On 14 September 2026, client direction amended the production motion and interactive-media interpretation without changing these benchmark dispositions. The [amendment](../visual-design/motion/high-end-motion-and-interactive-media-amendment.md) permits original, static-first, user-controlled video and selected cinematic choreography while continuing to reject copied benchmark expression, autoplay/pre-intent media, critical-path dependency, and motion-led understanding.

## `B00-017` approval record

| Review item | Approved result |
| --- | --- |
| Cross-site coverage | All 93 patterns are present exactly once in the disposition register: 25 Adopt, 35 Adapt, 9 Test, and 24 Defer. |
| Institution-specific coverage | All 120 candidates are present exactly once in the candidate crosswalk: 15 Adopt, 45 Adapt, 26 Test, and 34 Defer. |
| Reject boundary | The direct-copy rejection list is binding even though no whole patient need is rejected: external brand expression, facts, clinical routing, unsupported capability, consequential automatic translation, nonessential third-party dependencies, and unverified claims must not be imported. |
| UX/architecture conclusion | Approve the map unchanged. It prioritizes recognizable patient tasks, emergency separation, honest request states, multiple discovery paths, accessibility, low-bandwidth resilience, bilingual boundaries, canonical content, and explicit recovery while withholding capability-dependent promises. |
| Approval authority | Client executive/product direction, supported by senior UI/UX engineering and architecture review. The temporary role-based approval is recorded in the [formal validation register](../validation/stakeholder-low-fidelity-validation.md#recorded-approval-gov-03). |
| Implementation rule | Adopt and Adapt rows may guide controlled implementation within their stated gates. Test rows remain candidates until their specified evidence passes. Defer rows remain outside scope. No benchmark wording, imagery, behavior, data, or claim is copied by implication. |
| Reopen trigger | Review only when a proposed implementation changes or conflicts with a disposition, the source pack gains a candidate, local evidence supports promoting a Test/Defer item, or testing identifies a safety, accessibility, privacy, language, operational, or architectural conflict. No routine Phase 2 reapproval is required if the map remains unchanged. |
| Evidence | [Sanitized `B00-017` completion record](../backlog/evidence/B00-017-benchmark-disposition-2026-09-13.md). |

## Local application map

These application IDs are the bridge between benchmark evidence and the working product documents. Cross-site pattern IDs may appear in more than one application when the same evidence affects several journeys.

| Application | Patient or delivery problem | Benchmark evidence | Local incorporation | Requirements and artifacts | Blueprint disposition | Approval/gate |
| --- | --- | --- | --- | --- | --- | --- |
| `BM-01` Task-led public front door | Stressed visitors should not need to understand the hospital organization before acting. | `C1-P02`, `C2-P02`, `C3-P01`, `C4-P01`, `C5-P01` | Persistent essential actions, short patient-facing navigation, promotional content after care tasks, and explicit Phase 1 route scope. | `G-001`, `G-002`, `H-001`, `H-002`; [sitemap](../ux/sitemap.md); Home and shared shell | Adopt | Validate labels, ordering, and comprehension; `GOV-02`, `GOV-03`. |
| `BM-02` Urgency and emergency boundary | Routine forms and general contact can create unsafe delay. | `C1-P04`, `C2-P01`, `C3-P02`, `C3-P19`, `C4-P06`, `C4-P07`, `C5-P04` | Emergency remains distinct and prominent; routine channels carry a not-for-emergencies warning; actions explain their purpose and outcome. No symptom checker or autonomous triage is implied. | `E-001`–`E-005`, `A-002`, `V-002`; Emergency, Appointment, Search; critical and practical-access flows | Adopt | Exact routes, wording, contacts, scope, hours, and public-emergency distinction remain gated by `SAFE-01`–`SAFE-04`. |
| `BM-03` Multiple discovery starting points | Visitors may know a doctor, specialty, service, common need, or location—but not an internal department. | `C1-P01`, `C1-P12`, `C1-P15`, `C2-P03`, `C2-P04`, `C3-P14`, `C4-P02`, `C5-P03` | Separate doctor and service finders, typed site search, governed patient vocabulary, cross-links, explicit correction, and safe zero-result routes. No diagnosis or treatment recommendation. | `D-001`–`D-004`, `V-001`–`V-005`, `H-005`; directory/detail/search specifications and care-discovery flows | Adapt | Name/specialty is the minimum. Additional filters, condition terms, synonyms, and alphabetical fallback require `CARE-01`–`CARE-06` and `SEARCH-01`. |
| `BM-04` Connected doctor, service, and place records | Separate directories create dead ends and wrong-location handoffs. | `C1-P06`, `C2-P05`, `C3-P15`, `C4-P03`, `C4-P04`, `C5-P03` | Canonical public IDs, governed bidirectional relationships, location context, stable appointment handoff, and optional location detail only when maintained. | `D-003`, `D-004`, `V-005`, `C-001`–`C-003`, `A-003`; detail pages and care-discovery flows | Adapt | Relationships, location records, schedules, and facility scope require `CARE-06`, `SAFE-01`, `SAFE-03`, and evidence that more than one maintained location exists. |
| `BM-05` Truthful appointment and referral states | A submitted request must not be mistaken for a booking or accepted referral. | `C1-P03`, `C1-P07`, `C2-P08`, `C3-P16`, `C4-P05`, `C5-P02` | “Request an appointment” language; minimum-data form; pre-submit requirements; acknowledgement, unknown-outcome, duplicate, delivery-failure, and staffed-fallback states. | `A-001`–`A-007`; Appointment specification, wireframe, and critical flows F3–F4 | Adapt | New/returning/referring branches are not added until operations proves distinct workflows. `APPT-01`–`APPT-04` remain release gates. |
| `BM-06` Supported non-digital access | Low connectivity, disability, low confidence, or a failed digital route must not become a care barrier. | `C2-P07`, `C3-P17`, `C4-P05`, `C4-P10`, `C5-P06` | Purpose-labeled call actions and staffed recovery routes accompany appointment, search, contact, and unavailable-content states. | `G-001`, `G-007`, `A-006`, `C-001`, `P-001`; component and page recovery contracts | Adopt | Every fallback must have a verified purpose, owner, staffed hours, response expectation, and canonical contact; `SAFE-01`, `APPT-01`, `ACCESS-01`. |
| `BM-07` Before/during/after visit and caregiver journey | Patients and supporters need timely preparation, arrival, visiting, discharge, and recovery guidance. | `C1-P05`, `C2-P06`, `C2-P13`, `C3-P08`, `C3-P09`, `C4-P08`, `C4-P12`, `C4-P15`, `C5-P07`, `C5-P11`, `C5-P16` | Patient & Visitor Information is stage-based; unavailable stages are omitted; practical, access, family, payment, and after-visit topics use canonical governed records and staffed recovery. | `P-001`, `P-002`, `C-001`, `C-002`; Patient Information specification/wireframe and practical-access flow PA1 | Adapt | Hospital-authored guidance, consent boundaries, portable discharge information, and follow-up ownership require `ACCESS-01`; unsupported stages stay absent. |
| `BM-08` Text-first arrival and temporary disruption | Maps can fail and stale entrance information can cause harm. | `C1-P13`, `C2-P12`, `C4-P03`, `C4-P18` | Exact text address, landmarks, entrances, access details, purpose-labeled contacts, optional map, and temporary-status expiry behavior. | `E-004`, `C-001`–`C-003`, `G-007`, `G-014`; Emergency and Locations & Contact | Adapt | On-site verification and a rapid operational owner are required through `SAFE-01`, `SAFE-03`, and `SEC-02`. |
| `BM-09` Bilingual public access with honest boundaries | A translated shell without equivalent tasks can create false confidence; interface language is not clinical interpretation. | `C1-P10`, `C2-P15`, `C3-P11`–`C3-P13`, `C4-P19`, `C5-P18` | Phase 1 safety-critical English/Amharic coverage, Phase 2 essential-journey parity, stable-ID context switching, missing-equivalent states, expansion testing, and professional review. | `S-006`–`S-008`; language switcher and every page/flow | Adapt | `LANG-01` and `LANG-02` govern translation. Doctor-language filters and interpreter or alternative-format services remain Test/Defer until separately verified. |
| `BM-10` Accessible, plain, low-bandwidth service patterns | Essential tasks must work for assistive-technology users and on constrained devices or networks. | `C2-P09`–`C2-P11`, `C2-P18` | Semantic HTML, reusable accessible components, visible focus, reflow, 44 px targets, bounded initial performance, no-JavaScript baselines, structured errors, concise patient-language labels, and optional media that never enters the critical path or loads before intent. | `G-003`–`G-013`; design-system contracts; cross-template test matrix | Adopt | Named environments, language comprehension methods, devices, browsers, and screen-reader pairs require `DEL-01`. |
| `BM-11` Structured content governance and handoffs | Volatile facts repeated as prose become contradictory or stale. | `C2-P17`, `C3-P18`, `C4-P20`, `C5-P20` | Canonical records carry owner/source/review/expiry metadata; external handoffs state ownership and return paths; stale records are withheld or retired. | `G-013`–`G-015`, `D-001`–`D-005`, `V-001`–`V-005`, `C-001`, `I-004`, `I-005`; review-metadata component | Adopt | Named owners and workflows require `GOV-01`; third-party destinations require `SEC-02`. |
| `BM-12` Evidence-backed institutional and quality claims | Scale, academic, accreditation, experience, and outcome claims can mislead without scope and dates. | `C1-P08`, `C3-P20`, `C4-P17`, `C5-P19` | Claims are omitted unless the ledger records definition, source, scope, date, owner, approval, rights, review, and expiry; care tasks remain more prominent than proof. | `H-004`, `I-001`–`I-003`, `G-014`; About and Home institutional modules | Adapt | Academic/research and public quality measures are deferred unless `INST-01`–`INST-03` and `GOV-02` approve maintained Phase 1/2 content. |
| `BM-13` Targeted, expiring safety/status alerts | Global persistent warnings become noise; missing or stale alerts can cause harm. | `C2-P16`, `C3-P19`, `C4-P18` | Alerts appear at affected task entry points, carry scope and status, do not replace canonical content, and expire through a named workflow. Careers includes a separately governed fraud-warning gate. | `G-011`, `G-014`, `I-004`; alert/status component; Emergency, Contact, Careers | Adapt | Exact warning content, targeting, owner, source, effective instant, and expiry require `SAFE-*`, `HR-01`–`HR-03`, or the relevant content owner. |
| `BM-14` International, diaspora, regional, and network coordination | Travelling patients may need pre-travel review, records, costs, accommodation, and return-home continuity. | `C1-P09`, `C3-P03`–`C3-P10`, `C4-P13`, `C4-P14` | The sitemap does not promise a dedicated route. Relevant needs are retained as evidence for future referral/international discovery, while public service scope and practical guidance stay general and locally verifiable. | Phase 2 candidates in [sitemap](../ux/sitemap.md); `V-002`, `P-002`, `I-003` | Defer | Requires demonstrated demand, verified clinical/referral scope, secure intake, named coordination, finance/legal decisions, travel-source governance, and `GOV-02`. |
| `BM-15` Authenticated records, portal, proxy, and longitudinal care | Accounts can connect appointments, results, messages, medicines, representatives, and follow-up, but unsafe imitation creates serious risk. | `C1-P14`, `C2-P14`, `C4-P11`, `C5-P08`–`C5-P10`, `C5-P12`–`C5-P15` | “Patient Portal” remains conditional in the sitemap; the public blueprint does not simulate records, results, prescriptions, proxy access, or personalized reminders. Public request state is limited to the appointment workflow. | Sitemap exclusions/conditional routes; `S-002`–`S-005`, `A-004`–`A-007` | Defer | Requires an actual clinical/identity system, verified patient and representative identity, scoped consent, audit, clinical safety, support, and a separately approved product scope. |
| `BM-16` Payment, insurance, cost, and eligibility clarity | Patients need practical financial information without false guarantees or copied payer assumptions. | `C3-P06`, `C4-P09`, `C5-P17` | Payment/insurance is a governed Patient Information topic; insurer/partner meaning is constrained; missing content is omitted rather than inferred. | `P-001`, `P-002`, `I-003`, `G-014`; Patient Information and About | Test | Finance, operations, privacy/legal, currency, inclusions, exclusions, expiry, assistance, and uncertainty wording must be approved through `ACCESS-01` and `INST-03`. |
| `BM-17` Guided care modes, remote review, and virtual care | Advice, virtual, urgent, home, or second-opinion modes can help only when clinical rules and live capability are dependable. | `C1-P11`, `C3-P10`, `C5-P05` | The blueprint provides emergency versus routine boundaries and a “not sure” request route, but no symptom-based urgency estimation, virtual-care promise, or automated routing. | Sitemap Phase 1 exclusions; `E-002`, `A-002`, `A-003`, `V-002` | Defer | Requires verified modes, clinical rules, licensing, availability, escalation, data flow, and accountable human review. |

## Cross-pattern disposition register

This register proves that every stable cross-site pattern has been considered. The source pattern wording and comparative strength remain authoritative in each linked pattern inventory; this table records only the Hallelujah disposition and destination.

### Category 1 — Global academic and medical authorities

Source: [Category 1 pattern inventory](../../../benchmarks/category-1-global-academic-authorities/pattern-inventory.md)

| Pattern | Disposition | Local application | Scope note |
| --- | --- | --- | --- |
| `C1-P01` | Adapt | `BM-03` | Governed doctor/service/need discovery, not diagnosis. |
| `C1-P02` | Adopt | `BM-01` | Patient tasks remain separate from institutional routes. |
| `C1-P03` | Test | `BM-05` | Add audience branches only for distinct maintained workflows. |
| `C1-P04` | Adopt | `BM-02` | Emergency interrupts routine request behavior. |
| `C1-P05` | Adapt | `BM-07` | Start with a small approved guidance set. |
| `C1-P06` | Adapt | `BM-04` | Connected records require approved relationships. |
| `C1-P07` | Adapt | `BM-05`, `BM-07` | Explain verified prerequisites and next steps before collection. |
| `C1-P08` | Defer | `BM-12` | Academic/research proof is not a Phase 1 care dependency. |
| `C1-P09` | Defer | `BM-14` | No international route without an operating model. |
| `C1-P10` | Adapt | `BM-09` | Phased, human-governed bilingual access. |
| `C1-P11` | Defer | `BM-17` | Only verified care modes may appear. |
| `C1-P12` | Test | `BM-03` | Alphabetical fallback requires usability and scale evidence. |
| `C1-P13` | Adapt | `BM-08` | Text-first arrival; facility layers only when maintained. |
| `C1-P14` | Defer | `BM-15` | Portal is conditional on a real supported system. |
| `C1-P15` | Adapt | `BM-03` | Patient-language service content ends in safe action, not advice. |

### Category 2 — Public service and accessibility

Source: [Category 2 pattern inventory](../../../benchmarks/category-2-public-service-accessibility/pattern-inventory.md)

| Pattern | Disposition | Local application | Scope note |
| --- | --- | --- | --- |
| `C2-P01` | Adopt | `BM-02` | Distinct routine/uncertain/emergency routes without diagnosis. |
| `C2-P02` | Adopt | `BM-01` | Recognizable public tasks lead. |
| `C2-P03` | Adapt | `BM-03` | Plain patient language with a governed next action. |
| `C2-P04` | Adapt | `BM-03` | Doctor/service/search starting points. |
| `C2-P05` | Test | `BM-04`, `BM-08` | Location-aware finding only with accurate maintained records. |
| `C2-P06` | Adopt | `BM-07` | Before/during/after visit structure. |
| `C2-P07` | Adopt | `BM-06` | Staffed alternatives remain visible. |
| `C2-P08` | Adopt | `BM-05` | State prerequisites, exclusions, acknowledgement, and response. |
| `C2-P09` | Adopt | `BM-10` | Shared accessible component contracts. |
| `C2-P10` | Adopt | `BM-10` | Accessibility spans specification through acceptance. |
| `C2-P11` | Adopt | `BM-10` | Plain, actionable content and familiar interaction patterns. |
| `C2-P12` | Adapt | `BM-08` | Physical access works without maps and includes disruption states. |
| `C2-P13` | Adapt | `BM-07` | Visitor/caregiver needs included with privacy limits. |
| `C2-P14` | Defer | `BM-15` | No unsupported account/app. |
| `C2-P15` | Adapt | `BM-09` | Consequential translations require professional governance. |
| `C2-P16` | Adapt | `BM-13` | Targeted, owned, expiring alerts only. |
| `C2-P17` | Adopt | `BM-11` | Visible review metadata backed by real governance. |
| `C2-P18` | Adopt | `BM-10` | Accessible HTML is primary; downloads are supplementary. |

### Category 3 — Premium international and multilingual care

Source: [Category 3 pattern inventory](../../../benchmarks/category-3-premium-international-multilingual/pattern-inventory.md)

| Pattern | Disposition | Local application | Scope note |
| --- | --- | --- | --- |
| `C3-P01` | Adopt | `BM-01` | Care actions outrank premium positioning. |
| `C3-P02` | Adapt | `BM-02`, `BM-14` | Local/urgent routes now; international/referrer branches deferred. |
| `C3-P03` | Defer | `BM-14` | Secure pre-travel clinical review not established. |
| `C3-P04` | Defer | `BM-14` | No maintained international lifecycle yet. |
| `C3-P05` | Defer | `BM-14` | No named international coordinator or service level. |
| `C3-P06` | Test | `BM-16` | General payment guidance may precede any future travel scope. |
| `C3-P07` | Defer | `BM-14` | No hospital-owned visa/travel/accommodation workflow. |
| `C3-P08` | Adapt | `BM-07` | General caregiver needs included; travel logistics deferred. |
| `C3-P09` | Adapt | `BM-07`, `BM-14` | Basic after-visit guidance; cross-border continuity deferred. |
| `C3-P10` | Defer | `BM-17` | No verified remote consultation/second-opinion operation. |
| `C3-P11` | Adapt | `BM-09` | English/Amharic priority journeys in phases. |
| `C3-P12` | Test | `BM-09`, `BM-03` | Doctor language must be defined, verified, and maintained. |
| `C3-P13` | Defer | `BM-09` | Translated pages do not imply interpreter availability. |
| `C3-P14` | Adapt | `BM-03` | Only reliable doctor fields become filters. |
| `C3-P15` | Adapt | `BM-04` | Preserve canonical location context where verified. |
| `C3-P16` | Adopt | `BM-05` | Eligibility and confirmation semantics are explicit. |
| `C3-P17` | Adapt | `BM-06`, `BM-15` | Staffed phone supported; portals/apps deferred. |
| `C3-P18` | Adapt | `BM-11` | External handoffs disclose ownership and return path. |
| `C3-P19` | Adopt | `BM-02`, `BM-13` | Verified urgent routes and targeted fraud/safety boundaries. |
| `C3-P20` | Adopt | `BM-12` | Claims require source, scope, owner, date, and expiry. |

### Category 4 — African and regional relevance

Source: [Category 4 pattern inventory](../../../benchmarks/category-4-african-regional-relevance/pattern-inventory.md)

| Pattern | Disposition | Local application | Scope note |
| --- | --- | --- | --- |
| `C4-P01` | Adopt | `BM-01` | Patient tasks remain immediately visible. |
| `C4-P02` | Adapt | `BM-03` | Doctor/service/need/place concepts use governed vocabulary. |
| `C4-P03` | Adapt | `BM-04`, `BM-08` | Decision-ready place information, text first. |
| `C4-P04` | Adapt | `BM-04` | Preserve place context only from canonical records. |
| `C4-P05` | Adopt | `BM-05`, `BM-06` | Staffed uncertainty and request fallback. |
| `C4-P06` | Adopt | `BM-02` | Emergency separated from routine access. |
| `C4-P07` | Adopt | `BM-02` | Explain purpose and next action, not only a number. |
| `C4-P08` | Adapt | `BM-07` | Hospital-authored preparation checklist. |
| `C4-P09` | Test | `BM-16` | Ethiopian payer/self-pay boundaries require local evidence. |
| `C4-P10` | Adopt | `BM-06` | Assisted alternative to essential digital tasks. |
| `C4-P11` | Defer | `BM-15` | No unsupported digital records route. |
| `C4-P12` | Adapt | `BM-07` | Approved discharge/recovery guidance belongs in after-visit stage. |
| `C4-P13` | Defer | `BM-14` | No verified multi-level network/referral model. |
| `C4-P14` | Defer | `BM-14` | Distinct regional coordination needs an operating model. |
| `C4-P15` | Adapt | `BM-07` | Family/caregiver needs with patient consent boundaries. |
| `C4-P16` | Adapt | `BM-07`, `BM-11` | Rights/feedback require actionable staffed routes. |
| `C4-P17` | Defer | `BM-12` | Quality publication requires stable definitions and owners. |
| `C4-P18` | Adapt | `BM-08`, `BM-13` | Local temporary states need rapid publication and expiry. |
| `C4-P19` | Adapt | `BM-09` | Public language and clinical communication remain distinct. |
| `C4-P20` | Adopt | `BM-11` | Volatile claims and operating facts use governed records. |

### Category 5 — Specialized and integrated care

Source: [Category 5 pattern inventory](../../../benchmarks/category-5-specialized-integrated-care/pattern-inventory.md)

| Pattern | Disposition | Local application | Scope note |
| --- | --- | --- | --- |
| `C5-P01` | Adapt | `BM-01` | Front door reflects verified public care scope. |
| `C5-P02` | Adapt | `BM-05` | Show access limits before data collection; referral workflow deferred. |
| `C5-P03` | Adapt | `BM-03`, `BM-04` | Multi-concept discovery only from governed relationships. |
| `C5-P04` | Adopt | `BM-02` | Emergency remains separate from routine care. |
| `C5-P05` | Defer | `BM-17` | No automated or unsupported clinical routing ladder. |
| `C5-P06` | Adopt | `BM-06` | Staffed help complements digital paths. |
| `C5-P07` | Adapt | `BM-07` | Start with governed, concise visit guidance. |
| `C5-P08` | Defer | `BM-15` | Longitudinal authenticated context is outside the public blueprint. |
| `C5-P09` | Defer | `BM-15` | No public results state without clinical-system scope. |
| `C5-P10` | Defer | `BM-15` | Proxy identity/permission belongs to a future authenticated product. |
| `C5-P11` | Adapt | `BM-07` | Family support does not override patient autonomy. |
| `C5-P12` | Defer | `BM-15` | Life-stage transition needs specialist scope and partners. |
| `C5-P13` | Defer | `BM-15` | Cross-channel encounter continuity needs clinical integration. |
| `C5-P14` | Defer | `BM-15` | Medication workflows are not verified public capabilities. |
| `C5-P15` | Defer | `BM-15` | No personalized prompts without identity, consent, data, and capacity. |
| `C5-P16` | Test | `BM-07`, `BM-14` | Portable discharge/follow-up guidance needs clinical ownership. |
| `C5-P17` | Test | `BM-16` | Explain only locally approved payer/cost boundaries. |
| `C5-P18` | Test | `BM-09` | Public bilingual access now; assisted/clinical formats need operations. |
| `C5-P19` | Defer | `BM-12` | Outcome publication requires governed measures and interpretation. |
| `C5-P20` | Adopt | `BM-11` | Scope, owner, effective date, and expiry are required metadata. |

## Institution-specific candidate coverage

Institution-specific IDs remain useful evidence but do not create a second set of product decisions. The [institution-specific candidate crosswalk](institution-candidate-crosswalk.md) dispositions all 120 IDs individually; this summary shows how each source rolls up to the local application layer.

| Benchmark source | Candidate IDs | Primary local applications | Coverage note |
| --- | --- | --- | --- |
| Mayo Clinic | `C1-MAY-01`–`C1-MAY-07` | `BM-02`–`BM-05`, `BM-07`, `BM-12`, `BM-14` | Discovery, emergency-at-request, preparation, connected care, international journey, and patient-benefit proof are dispositioned above. |
| Charité | `C1-CHA-01`–`C1-CHA-07` | `BM-01`, `BM-03`, `BM-05`, `BM-07`, `BM-08`, `BM-12` | Audience gateways, paired finders, campus context, route differences, preparation, accountability, and research proof are covered. |
| Mass General Brigham | `C1-MGB-01`–`C1-MGB-08` | `BM-01`, `BM-02`, `BM-04`–`BM-07`, `BM-09`, `BM-14`, `BM-15` | Find Care, connected records, account, preparation, response expectations, language, and international care are covered. |
| NHS | `C2-NHS-01`–`C2-NHS-09` | `BM-01`–`BM-03`, `BM-06`, `BM-08`, `BM-10`, `BM-11` | Task hierarchy, urgency, patient language, place, accessible patterns, assisted access, HTML, and review metadata are covered. |
| Singapore General Hospital | `C2-SGH-01`–`C2-SGH-10` | `BM-01`, `BM-03`, `BM-05`–`BM-11`, `BM-13`, `BM-15` | Visit stages, channels, response, doctor discovery, disruption, caregivers, fraud, translation, and handoffs are covered. |
| Cleveland Clinic Abu Dhabi | `C3-CCA-01`–`C3-CCA-09` | `BM-03`, `BM-05`, `BM-06`, `BM-09`, `BM-12`, `BM-14`, `BM-15` | Bilingual parity, discovery, route-specific CTAs, access hub, portal help, international intake, language boundaries, and claims are covered. |
| Sidra Medicine | `C3-SID-01`–`C3-SID-10` | `BM-05`, `BM-07`, `BM-09`, `BM-11`, `BM-14`, `BM-17` | Eligibility, route separation, referral states, visit stages, family, remote review, discharge, handoffs, and coordination are covered. |
| Apollo Hospitals | `C3-APL-01`–`C3-APL-10` | `BM-01`, `BM-03`–`BM-05`, `BM-09`, `BM-11`, `BM-13`, `BM-14`, `BM-16` | Immediate actions, language, location, discovery, international journey, costs, fraud, continuity, and governance are covered. |
| Aga Khan University Hospital Nairobi | `C4-AKU-01`–`C4-AKU-10` | `BM-01`–`BM-09`, `BM-11`, `BM-14`, `BM-16` | Regional homepage, facilities, sessions, emergency contacts, referrals, payment, assisted access, schedules, and language are covered. |
| Netcare | `C4-NET-01`–`C4-NET-10` | `BM-02`–`BM-07`, `BM-10`, `BM-12`, `BM-15` | Discovery, matching, accounts, pre-admission, triage explanation, discharge, rights, quality, and low-data alternatives are covered. |
| Mediclinic Southern Africa | `C4-MED-01`–`C4-MED-10` | `BM-04`–`BM-08`, `BM-11`, `BM-12`, `BM-16` | Local access hubs, emergency results, place context, matching, admission, costs, channels, navigation, and quality are covered. |
| Great Ormond Street Hospital | `C5-GOS-01`–`C5-GOS-10` | `BM-05`, `BM-07`, `BM-09`, `BM-12`, `BM-15` | Specialist/referral boundaries, preparation, teams, proxy access, results, transition, outcomes, and alternative formats are covered. |
| Kaiser Permanente | `C5-KAI-01`–`C5-KAI-10` | `BM-04`, `BM-05`, `BM-09`, `BM-15`–`BM-17` | Care ladder, encounter continuity, location, status, reminders, medicines, caregivers, costs, regional continuity, and interpretation are covered. |

## Direct-copy rejections and non-negotiable boundaries

The following are rejected even when a benchmark or source site appears to use them:

- copying another institution’s clinical routing, emergency wording, payer assumptions, eligibility rules, operating hours, response times, or international-service promises;
- copying brand expression, page composition, imagery, iconography, proprietary copy, or visual identity as a substitute for Hallelujah’s approved identity;
- presenting an appointment request, referral receipt, external handoff, or contact form as a confirmed booking or clinical acceptance;
- exposing a portal-shaped interface, result status, prescription workflow, caregiver access, or personalized reminder without the real identity, clinical, consent, audit, and support systems behind it;
- using automated translation for emergency, clinical, consent, privacy, medication, eligibility, or other consequential content without professional review;
- introducing a symptom checker, diagnostic inference, urgency estimation, or AI care recommendation into the public-site scope without a separately approved clinical-safety program;
- making maps, apps, JavaScript, third-party fonts, analytics, chat, media, or external providers a dependency for essential information;
- publishing trust, quality, scale, accreditation, partner, insurer, leadership, roster, schedule, capability, or availability claims without the required governance evidence.

## Benchmark-derived validation measures

Benchmark use is successful only if the adapted local journey performs safely. These measures become candidate inputs to `DEL-01`; target values require stakeholder approval and a test plan.

| Measure | Journey | Evidence method | Related applications and decisions |
| --- | --- | --- | --- |
| Correct starting-route selection | Home/shared navigation | Scenario task success by viewport and language | `BM-01`; `GOV-02`, `LANG-01`, `LANG-02` |
| Emergency-versus-routine comprehension | Emergency, Appointment, Search | Comprehension test without facilitator hints | `BM-02`; `SAFE-01`–`SAFE-04` |
| Purpose-specific contact accuracy | Emergency and Contact | Signed record plus live call test | `BM-02`, `BM-06`, `BM-08`; `SAFE-01` |
| Discovery success and safe zero-result recovery | Doctors, Services, Search | Representative known-item and common-language tasks; zero-result and urgent-term cases | `BM-03`, `BM-04`; `CARE-01`–`CARE-06`, `SEARCH-01` |
| Correct location/entrance arrival | Emergency and Contact | On-site text-only arrival test with map unavailable | `BM-04`, `BM-08`; `SAFE-03` |
| Request/booking distinction | Appointment | Comprehension check before and after submission | `BM-05`; `APPT-01`, `APPT-04` |
| Appointment completion and recovery | Appointment | Keyboard, screen-reader, validation, timeout, duplicate, and delivery-failure tests | `BM-05`, `BM-10`; `APPT-02`–`APPT-04` |
| Staffed-fallback reliability | All essential journeys | Published-hours test, mystery contact, and escalation evidence | `BM-06`; `SAFE-01`, `APPT-01`, `ACCESS-01` |
| Visit-guidance findability and usefulness | Patient Information | Before/during/after scenario tasks with patients and caregivers | `BM-07`; `ACCESS-01` |
| Bilingual semantic and interaction parity | In-scope routes | Professional review plus route/state parity audit | `BM-09`; `LANG-01`, `LANG-02` |
| Accessibility and constrained-network completion | All templates | Agreed browser/screen-reader/device matrix, reflow, no-script, and throttling tests | `BM-10`; `DEL-01` |
| Content freshness and expiry | Governed records and alerts | Record audit and simulated expiry/removal test | `BM-11`–`BM-13`; `GOV-01`, `SEC-02`, relevant content decisions |
| No unsupported promise | Sitewide | Claim, route, and external-handoff audit | `BM-12`–`BM-17`; `GOV-02`, `GOV-03` |

## Change control

When a benchmark disposition changes:

1. Record the named owner, date, rationale, and durable evidence under `GOV-03`.
2. Update this register and the affected requirement rows, sitemap route/phase, page specifications, design-system contracts, wireframes, and flows together.
3. Add or update the relevant validation measure and acceptance evidence.
4. Keep the affected feature, content, or promise gated until its operational, clinical, privacy, language, accessibility, security, and content dependencies are approved.
5. Never use a benchmark change to silently weaken an existing safety or accessibility requirement.

## Exit criteria for the benchmark pass

The benchmark incorporation pass is ready for stakeholder disposition when:

- every `C1-P01`–`C5-P20` pattern is present in the cross-pattern register;
- every institution-specific candidate ID is individually dispositioned in the [candidate crosswalk](institution-candidate-crosswalk.md);
- each adopted/adapted pattern points to its local requirements and artifacts;
- each Test or Defer pattern states the missing evidence or capability;
- direct-copy and unsupported-capability boundaries are explicit;
- benchmark-derived validation measures are carried into delivery planning; and
- `GOV-03` is included in the stakeholder validation and change-control process.

This document meets those criteria, and its complete disposition map is approved for controlled implementation through `B00-017` / `GOV-03`. Approval of benchmark use does not close any referenced clinical, operations, privacy, language, security, content, or production gate.
