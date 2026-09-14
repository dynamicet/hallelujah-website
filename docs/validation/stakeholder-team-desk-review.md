# Multidisciplinary Stakeholder Team Desk Review

**Review date:** 11 September 2026 (Africa/Addis_Ababa)  
**Status:** Historical advisory review complete; `GOV-02` and `GOV-03` were subsequently approved for controlled implementation planning; public release remains blocked  
**Scope:** All 32 decisions, 12 page structures, four flow packages, and seven scenario walkthroughs  
**Authority:** This is an AI-convened desk review, not approval by Hallelujah General Hospital

## Executive outcome

The multidisciplinary panel recommends accepting the low-fidelity structure as the baseline for hospital review and backlog decomposition. It does **not** recommend public release, live data collection, or publication of gated facts.

| Measure | Outcome |
| --- | --- |
| Formal decision outcomes | At this desk review: 32 Unresolved. Current formal register: 2 Approved (`GOV-02`, `GOV-03`) and 30 Unresolved. |
| Page and flow structures | All 12 pages and four flow packages accepted as the project working baseline after two corrections recorded below; formal hospital sign-off remains pending |
| Release decision | **No-go** until the Phase 0 and applicable Phase 1 gates have signed evidence |
| Backlog readiness | Ready to decompose into evidence-enabler and build stories; not ready for sprint/release commitment |
| Careers | Remains Phase 2, non-actionable, and non-collecting |
| Unverified content | Withheld; no extracted public content is promoted to approved content |

At the time of this advisory review, every formal outcome remained **Unresolved**. The governing [validation register](stakeholder-low-fidelity-validation.md) now records the subsequent client approvals for `GOV-02` and `GOV-03`; it remains the current status authority. The panel cannot impersonate hospital decision authority, fabricate call/on-site tests, approve clinical or legal claims, or close the recorded security incident.

## Working-baseline acceptance and flexibility rule

Project stakeholder direction received on 12 September 2026 accepted the panel's recommended safe present states across all 32 decisions. The grouped decision and exception policy is recorded in the [validation register](stakeholder-low-fidelity-validation.md#conditional-working-baseline-acceptance).

The accepted approach is **default, justify, verify**:

- **Default:** start with the recommended safe state.
- **Justify:** vary it only for a documented need, with scrutiny proportional to consequence.
- **Verify:** retain the same or stronger safety, privacy, security, accessibility, truthfulness, and recovery outcome and test the exception.

Flexibility is encouraged for reversible, low-risk presentation and workflow choices when it improves local usability. It is constrained for emergency routing, clinical claims, personal-data processing, consequential translation, accessibility, security, and public-release controls. Missing optional evidence should normally suppress only the affected feature or content; missing evidence for an essential safe journey remains a blocking gate.

The accepting person's name, hospital role, authority confirmation, and supporting evidence were not recorded during this advisory review. Subsequent role-based client decisions approved `GOV-02` and `GOV-03` for controlled implementation planning. Those decisions do not authorize live data collection, domain-sensitive claims or behavior, or public release.

## Panel lenses

The review was conducted in parallel from three stakeholder perspectives:

1. Product, executive, brand/content, and HR governance
2. Clinical, medical-staff, operations, facilities/access, content, and Amharic safety
3. Privacy/legal, security, architecture, delivery, QA, and accessibility

These are advisory role lenses. They are deliberately not entered as the named participants required for hospital approval.

## Decisions — governance, scope, and benchmark use

| ID | Formal outcome | Advisory recommendation and safe present state | Evidence required to sign |
| --- | --- | --- | --- |
| `GOV-01` | Unresolved | Adopt the owner/source/review/expiry model; withhold every unowned or expired record. | Executive sponsor names every accountable person and signs the responsibility and content-governance records. |
| `GOV-02` | Approved after this review | Approve the [sitemap](../ux/sitemap.md) as the proposed scope: core patient routes in Phase 1, Search conditional, Careers/News/Referring Clinicians in Phase 2, and unsupported routes hidden rather than empty. | See the [recorded approval](stakeholder-low-fidelity-validation.md#recorded-approval-gov-02). |
| `GOV-03` | Approved after this review | Approve the current Adopt/Adapt/Test/Defer/Reject map unchanged as the benchmark-use boundary. No deferred behavior enters scope by implication. | See the [recorded approval](stakeholder-low-fidelity-validation.md#recorded-approval-gov-03); referenced domain gates still govern activation. |

## Decisions — safety and operations

| ID | Formal outcome | Advisory recommendation and safe present state | Evidence required to sign |
| --- | --- | --- | --- |
| `SAFE-01` | Unresolved | Publish no phone, email, address, or hours. The extracted emergency/ambulance value, conflicting general numbers, landline range, and apparent header placeholder are candidates only. | Operations signs one canonical purpose-labeled record with staffed hours, review/expiry, and dated call tests. |
| `SAFE-02` | Unresolved | Accept the non-diagnostic route pattern after the correction below: explain the hospital-versus-public distinction before or within the first call-choice group. | Clinical approves exact English/Amharic scope and warning; Operations validates routes; QA records comprehension results. |
| `SAFE-03` | Unresolved | Accept text-first arrival structure. Publish no inferred route or coordinates; keep the optional map unloaded and noncritical. | Facilities and Operations complete a dated first-time arrival test without a map and approve entrance, route, access, coordinates, and hours. |
| `SAFE-04` | Unresolved | Omit every unverified 24/7, ICU, emergency, ambulance-equipment, adult/pediatric, and other consequential capability claim. Withhold a record when the missing claim defines its service. | Clinical and Operations sign dated claim-ledger entries with scope, location, availability, limits, owner, and expiry. |

Investigative evidence: [content verification queue](../../../resources/content-review.md#priority-0--safety-and-access) and [draft hospital profile](../../../resources/hospital-profile.json). Neither is approval evidence.

## Decisions — appointment request

| ID | Formal outcome | Advisory recommendation and safe present state | Evidence required to sign |
| --- | --- | --- | --- |
| `APPT-01` | Unresolved | Accept “request, not confirmed booking,” authoritative receipt, and truthful recovery behavior. Do not enable submission. | Operations signs the receiver, staffed hours, routing, response expectation, confirmation, escalation, cancellation/rescheduling, fallback, and receipt SOP. |
| `APPT-02` | Unresolved | Accept mutually exclusive Doctor/Service/Not sure using canonical IDs. Do not predeclare Full name or Preferred date as required; omit Brief notes by default. | Operations and Privacy produce a field-by-field purpose, necessity, requiredness, recipient, and source record; Clinical/medical staff approve selector sources. |
| `APPT-03` | Unresolved | Collect nothing. Retain secure POST, no personal data in URLs/telemetry, unchecked consent, and no third-party requests as the proposed privacy baseline. | Privacy/legal, Security, and Operations sign the data inventory, lawful basis where applicable, notice/consent rule, access matrix, retention/deletion, data-flow diagram, transport/logging/abuse controls, and third-party register. |
| `APPT-04` | Unresolved | Accept the documented state model as the proposed architecture baseline: one submission intent, authoritative acknowledgement, reconciliation before retry, stable reference, and delivery failure distinct from request failure. | Delivery signs an ADR defining atomic persistence, concurrency, idempotency-key scope/TTL and payload mismatch, reference/status disclosure, failover recovery, and exact QA/Security tests. |

## Decisions — care records, access, search, and language

| ID | Formal outcome | Advisory recommendation and safe present state | Evidence required to sign |
| --- | --- | --- | --- |
| `CARE-01` | Unresolved | Publish no roster-dependent cards, selectors, or search records; redirect only to a genuine approved successor. | Medical staff owner signs the roster, stable IDs, current status, review date, and retire/redirect decisions. |
| `CARE-02` | Unresolved | Accept one canonical URL/ID, clean omission of optional fields/portraits, and name/specialty-only filters until more maintained fields exist. | Medical staff and Content approve the canonical map, identity schema, optional omissions, filters, and portrait rights. |
| `CARE-03` | Unresolved | Continue omitting all schedules and live availability. | Operations explicitly signs the omission or supplies a corrected schedule, time convention, refresh process, and owner. |
| `CARE-04` | Unresolved | Do not use the 39 extracted records as an approved taxonomy or selector. | Clinical and Content sign the patient-oriented taxonomy, launch subset, corrections, slugs, and English/Amharic synonyms. |
| `CARE-05` | Unresolved | Omit unsupported optional claims; withhold the record when required scope, urgent exception, location, or request data is absent. | Clinical supplies per-service claim records; Operations approves practical facts; Content resolves copied, duplicated, and misspelled source text. |
| `CARE-06` | Unresolved | Omit relationships and dependent handoffs until both endpoints are current; retain stable-ID and bidirectional-integrity rules. | Clinical, Content, and Medical staff sign the doctor/service/location relationship table. |
| `ACCESS-01` | Unresolved | Retain Before/During/After structure, but omit every missing guide. Do not offer a telephone fallback until `SAFE-01` is approved; withhold the route if no useful approved minimum remains. | Operations and Content author each topic; Privacy/legal and Clinical review consequential guidance; every missing topic gets an explicit omit/defer decision. |
| `SEARCH-01` | Unresolved | Accept typed canonical, non-diagnostic results. Withhold colloquial, condition, correction, and urgent-term behavior until governed bilingual vocabulary exists. | Product, Clinical, and Content sign record types, vocabulary, ranking, correction, urgent policy, wording, and English/Amharic relevance tests. |
| `SEARCH-02` | Unresolved | Keep query analytics, remote autocomplete, pixels, chat, replay, and third-party query disclosure off. Minimize first-party handling pending approval. | Privacy and Security sign log/CDN/WAF/cache/referrer handling and the third-party register; Delivery proves no leakage. |
| `LANG-01` | Unresolved | Accept same-route switching, stable IDs, honest in-place unavailability, and no machine-inferred safety translation. Safety routes remain blocked. | Content and a professional Amharic reviewer provide the route/string inventory, translation source/memory, Clinical review, and parity/comprehension evidence. |
| `LANG-02` | Unresolved | Accept phased essential-journey parity, no silent Home redirect, and disabling Careers Apply when consequential terms are unavailable in the active language. | Product/Content and professional reviewer sign the route parity matrix, fallback wording, and review evidence. |

Investigative evidence: [doctor candidates](../../../resources/data/doctors.json), [service candidates](../../../resources/data/services.json), and the [content verification queue](../../../resources/content-review.md). Extracted counts and text do not establish current clinical truth.

## Decisions — institutional, brand, and careers

| ID | Formal outcome | Advisory recommendation and safe present state | Evidence required to sign |
| --- | --- | --- | --- |
| `INST-01` | Unresolved | Withhold About’s required narrative and every numerical/superlative claim; suppress dependent Home trust excerpts. | Executive and Content sign the authoritative claim ledger, definitions, as-of dates, final wording/translations, owner, and expiry. |
| `INST-02` | Unresolved | Omit leadership records. Portraits remain optional; an approved text record may survive later image-rights expiry. | Executive signs the leadership register/current status; Brand/Content supply biography and image source, consent/rights, crop, alt, and expiry records. |
| `INST-03` | Unresolved | Omit the partner/insurer module. No logo, coverage, endorsement, or patient-benefit implication is allowed. | Executive and Operations sign current relationship meaning/limitations; Brand signs name/logo rights and expiry. |
| `BRAND-01` | Superseded by the client-delegated `B01-002` project decision | Use the documented palette/type system only in clearly marked prototypes; do not invent a mark or use unapproved imagery. | The [project brand system](../brand/README.md) now records public-source logo fingerprints, name/tagline, palette, type, imagery, and rights workflow; production binary/media and language evidence retain their own gates. |
| `HR-01` | Unresolved | Keep Careers Phase 2 and out of public navigation until the entire vacancy lifecycle is demonstrated. | HR names the vacancy owner and proves stable IDs, instants/timezone, state transitions, and page/cache/search/sitemap removal. |
| `HR-02` | Unresolved | Collect and transfer nothing: no Apply, form, upload, mailbox, provider, or candidate telemetry. | HR, Privacy/legal, and Security approve provider/data flow, fields/files, recipients/access, transport, subprocessors, retention/rights, cross-border handling, logging, failure, and notice. |
| `HR-03` | Unresolved | Publish no borrowed equality, accommodation, response, or fraud wording. | HR and Privacy/legal approve exact hospital/jurisdiction wording; a professional reviewer supplies English/Amharic evidence. |

## Decisions — security and delivery

| ID | Formal outcome | Advisory recommendation and safe present state | Evidence required to sign |
| --- | --- | --- | --- |
| `SEC-01` | Unresolved | Treat the known SEO-spam compromise as a hard Phase 0/sitewide release gate. | Security and Executive sign an incident record covering cleanup, credential rotation, patching, sitemap/index recovery, hardening, monitoring, and the trusted production source. |
| `SEC-02` | Unresolved | Accept default-deny in principle. Self-host/no provider is the safe launch default; no optional integration is approved. | Privacy and Security sign the provider/domain register with purpose, data, minimization, recipient, retention, security, performance, failure, and owner; Delivery supplies network-test evidence. |
| `DEL-01` | Unresolved | Accept the cross-template test matrix as the proposed strategy baseline, not a test pass. | Delivery, QA/accessibility, and Security sign exact environments/versions, device/network profile, methods/participants/thresholds, security scope, evidence repository, severity/waiver/retest policy, and executed results. |

## Scenario walkthrough outcomes

| Scenario | Advisory outcome | Release consequence |
| --- | --- | --- |
| W1 — Emergency call and arrival | Structure accepted after route-order correction; facts and translation unresolved | No-go |
| W2 — Appointment under uncertain outcome | State behavior accepted; requiredness correction applied; operations/privacy unresolved | No live submission |
| W3 — Care discovery without diagnosis | Structure accepted; taxonomy, clinical terms, urgent terms, and logging unresolved | Restricted behavior remains withheld |
| W4 — Doctor publication and schedule | Structure accepted; roster and canonical records unresolved; schedules omitted | No roster publication |
| W5 — Visit preparation and access | Structure accepted; guidance, contact, and arrival evidence unresolved | Route withheld unless an approved useful minimum exists |
| W6 — Institutional claim and asset expiry | Structure accepted; all facts, relationships, and rights unresolved | Claims/modules withheld |
| W7 — Vacancy closes during application | Lifecycle structure accepted; Careers remains Phase 2 and non-collecting | No Apply action |

## Page and flow structure recommendations

“Baseline accepted” means the panel found the low-fidelity hierarchy, state coverage, omission behavior, and gates suitable for named stakeholder sign-off. It is not content, brand, test, implementation, or publication approval.

| Structure | Advisory recommendation | Binding caveat |
| --- | --- | --- |
| Home | Baseline accepted | Features/search/trust content render only from approved records. |
| Emergency | Baseline accepted after review correction | Route distinction precedes or is within the first call-choice group; all safety facts block publication. |
| Doctor Directory | Baseline accepted | No directory without approved roster/canonical map. |
| Doctor Profile | Baseline accepted | Schedule/live availability omitted; identity and relationships gated. |
| Services Directory | Baseline accepted | No raw inventory or unapproved taxonomy. |
| Service Detail | Baseline accepted | Scope, claims, urgent exceptions, practical facts, and relationships gated. |
| Request an Appointment | Baseline accepted after review correction | Full name/date requiredness unresolved; form remains disabled/unpublished. |
| Patient & Visitor Information | Baseline accepted | Empty topics omitted; useful approved minimum required. |
| Locations & Contact | Baseline accepted | Canonical contacts and on-site arrival evidence required. |
| Search Results | Baseline accepted | Clinical/urgent terms and telemetry remain off until approved. |
| About the Hospital | Baseline accepted | Required narrative and claims remain withheld. |
| Careers | Baseline accepted for Phase 2 | No vacancy or candidate data flow is active. |
| Critical journeys | Baseline accepted | Emergency/appointment gates remain binding. |
| Care discovery | Baseline accepted | Roster, taxonomy, claims, and relationships remain gated. |
| Practical access/search | Baseline accepted | Contacts, guidance, clinical search, language, and logging remain gated. |
| Institutional/careers | Baseline accepted | Facts, rights, HR lifecycle, privacy, and translation remain gated. |

## Review changes incorporated

1. `SAFE-02`: [Emergency wireframe](../wireframes/emergency.md), [critical flow F2](../wireframes/critical-user-flows.md), and [Emergency page specification](../ux/page-specifications.md) now put the hospital-versus-public distinction before or within the first call-choice group.
2. `APPT-02`: [Appointment wireframe](../wireframes/appointment.md) no longer marks Full name or Preferred date as required before operational necessity and privacy minimization are approved; Brief notes remain omitted by default.

These are corrections to the proposed blueprint, not hospital approvals or public copy decisions.

## Required human closeout

The formal pass remains open. To close it without weakening governance:

1. Enter actual named hospital participants and authority confirmation in the [validation register](stakeholder-low-fidelity-validation.md#named-participants).
2. Conduct or document the four decision sessions and link dated minutes/evidence.
3. Have each accountable owner sign an outcome for every decision row; an Unresolved outcome must name the next person and action.
4. Record named reviewer/date/evidence for all 12 page structures and four flow packages.
5. Execute the required call, on-site arrival, privacy/security, bilingual comprehension, accessibility, browser/device, network, and incident-closure checks.
6. Propagate every signed Changed or Rejected outcome through requirements, specifications, design-system contracts, wireframes, flows, and tests.
7. Obtain Executive signature on Phase 1/2 scope. Until then, public release remains no-go.
