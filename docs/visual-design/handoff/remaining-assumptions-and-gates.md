# Remaining Assumptions and Gates

**Formal hospital decision status:** `GOV-02` and `GOV-03` approved for controlled implementation planning; 30 unresolved  
**Production/publication status:** Not approved

## Status model

All 32 safe baselines were conditionally accepted for non-public design and prototyping on 12 September 2026. `GOV-02` was subsequently approved for backlog planning, and `GOV-03` for benchmark use, through client directions recorded in the formal validation register; the other 30 formal hospital outcomes remain `Unresolved`. This distinction is binding:

- **Prototype baseline accepted:** the documented safe fallback may be shown in a labeled, inert review artifact.
- **Production activation allowed:** the affected behavior may be built against approved facts and operations after its evidence closes.
- **Publication allowed:** release validation and named approval are complete for the affected scope.

Only the [formal validation register](../../validation/stakeholder-low-fidelity-validation.md) records an Approved, Changed, Rejected, or Unresolved outcome. This handoff summarizes safe defaults; it cannot close a decision.

The separate [Epic 0 technical foundation](../../architecture/epic-0-technical-foundation.md) records the approved implementation-planning architecture. It does not close the security, appointment, third-party, delivery-test, or release gates below.

## Decision-by-decision carry-forward

| ID | Production capability at stake | Safe default while unresolved | Minimum evidence to close |
| --- | --- | --- | --- |
| `GOV-01` | Accountability, review, expiry | Keep every governed item withheld or prototype-labeled | Signed named-owner and content-governance record |
| `GOV-02` | Phase 1 routes and deferred/Phase 2 scope | **Approved for backlog planning:** implement the recorded Phase 1 inventory; Careers stays Phase 2 | [Recorded approval](../../validation/stakeholder-low-fidelity-validation.md#recorded-approval-gov-02); review if scope changes or when replacing the temporary owner |
| `GOV-03` | Benchmark dispositions | **Approved for controlled implementation:** apply the current map and never copy facts/brand/behavior | [Recorded approval](../../validation/stakeholder-low-fidelity-validation.md#recorded-approval-gov-03); reopen only on its documented change triggers |
| `SAFE-01` | Emergency, ambulance, switchboard, phone, email, address, hours | No live contact target or selected conflicting value | Signed canonical operations record and performed call tests |
| `SAFE-02` | Hospital/public emergency routing and warning | Inert separated choices; no invented clinical guidance | Clinical wording approval, operations validation, comprehension plan/results |
| `SAFE-03` | Entrance, route, parking, transport, access hours, coordinates | Withhold facts; text-first placeholder; map off | Dated on-site arrival test and named facilities/operations approval |
| `SAFE-04` | 24/7, ICU, ambulance equipment, age scope, capability claims | Omit the claim or affected module | Current operating evidence with scope, location, owner, date, expiry |
| `APPT-01` | Request operating model and response/receipt | Non-submitting request simulation only | Approved SOP, staffing, routing, fallback, SLA wording, authoritative receipt definition |
| `APPT-02` | Appointment fields and conditional requiredness | Candidate minimized fields; unresolved requiredness stays explicit | Field-by-field necessity/purpose/recipient/canonical-ID record |
| `APPT-03` | Notice, consent, lawful basis, access, retention, transport, abuse | Collect nothing | Signed privacy/security assessment, notice, retention schedule, data flow, third-party register |
| `APPT-04` | Idempotency, duplicates, timeout, reconciliation, receipt/delivery | Simulate all outcomes; never claim success without authority | Architecture decision and executable accepted/rejected/timeout/reconcile/duplicate/delivery cases |
| `CARE-01` | Current clinician roster | Publish no extracted clinician as current | Signed roster with stable IDs, status, owner, review, retirement/redirect decision |
| `CARE-02` | Canonical clinician fields, filters, identities | Fictional records; omit unsupported fields | Approved canonical records, filter fields, duplicate map, rights and review metadata |
| `CARE-03` | Schedules and availability | Omit schedules and live availability | Corrected source/conventions/update process or explicit omission approval |
| `CARE-04` | Service taxonomy, names, slugs, synonyms | Controlled prototype taxonomy only | Signed bilingual taxonomy and correction log |
| `CARE-05` | Scope, tests/treatments, preparation, location, urgent exceptions | Withhold unsupported record or claim | Clinical claim ledger with limits, availability, owner, source, review, expiry |
| `CARE-06` | Doctor/service/location relationships and handoff | Controlled fixture IDs only | Governed bidirectional relationship table proving current approved records |
| `ACCESS-01` | Before/during/after visit guidance | Omit missing stages/topics; show approved staffed help only | Hospital-authored topics, approvers, sources, review dates, omit/defer decisions |
| `SEARCH-01` | Index, ranking, bilingual vocabulary, corrections, urgent terms | Local controlled non-diagnostic search only | Signed vocabulary and relevance/urgent-term cases in both languages |
| `SEARCH-02` | Query logs, cache/referrer controls, analytics/autocomplete | No telemetry, remote suggestion, pixel, chat, or replay | Privacy/security assessment, redaction/access/retention rules, third-party register |
| `LANG-01` | Phase 1 English/Amharic safety content | Geometry fixture only; do not publish as translation | Route/string inventory, named translator/clinical reviewer, source/memory, parity test |
| `LANG-02` | Phase 2 essential parity and missing-equivalent behavior | Honest unavailable state; disable consequential actions | Route parity matrix and approved fallback/continuity behavior |
| `INST-01` | Story, mission, values, milestones, capacity/facility claims | Withhold or label fact geometry | Executive claim ledger with source, definitions, as-of date, translation, review/expiry |
| `INST-02` | Leadership names, biographies, portraits | No real leadership record or portrait | Current leadership register, rights/consent, alt/crop, owner, review/expiry |
| `INST-03` | Partner/insurer status, meaning, logos | No logo wall or coverage implication | Current relationship register, limitations, rights, owner, review interval |
| `BRAND-01` | Logo, name/tagline, palette, typography, imagery | Text-only prototype identity and replaceable prototype theme | Original assets and signed brand decision plus contrast/bilingual retest |
| `HR-01` | Vacancy identity/lifecycle/removal | No-current-role or controlled closed states | Demonstrated owned lifecycle with exact instants, status, cache/search/sitemap removal |
| `HR-02` | Application route/provider/data/files/privacy | No Apply, email, upload, form, or provider collection | Recruitment data flow and privacy/security/provider assessment |
| `HR-03` | Equality, accommodation, response, fraud and bilingual wording | Withhold uninvented policy/process language | HR/privacy/legal approval and professional translation evidence |
| `SEC-01` | Trusted production source | Do not build on or deploy the compromised source | Incident closure: cleanup, rotation, patching, index remediation, hardening, monitoring |
| `SEC-02` | Maps, analytics, chat, replay, forms, fonts, media and other third parties | Default deny; essential experience remains first-party and complete | Per-provider purpose, minimization, data flow, failure, review, cost, and owner |
| `DEL-01` | Acceptance environments and evidence strategy | Apply the accepted [working matrix](../../validation/implementation-acceptance-matrix.md); make no production-readiness claim | Named authorities, actual browser/AT/device/repository inventory, and executed release-candidate evidence |

## Unperformed or non-closing validation

| Validation area | Performed evidence | Still required before the relevant release claim |
| --- | --- | --- |
| Amharic | Geometry, wrapping, mixed-script and unavailable fixtures in Chromium | Professional translation, clinical review, emergency/privacy comprehension, pronunciation, hospital approval |
| Screen readers | Chromium accessibility-tree structure | Human NVDA/JAWS/VoiceOver/TalkBack journeys in the approved browser/OS pairs |
| Forced colors | Chromium media emulation and focus/border geometry | Windows High Contrast user session |
| Touch and calls | Emulated tap/scroll against inert controls | Physical devices, OS gestures, deliberate activation, live approved numbers and dialer behavior |
| Zoom/reflow | CSS viewport/device-scale equivalents | Manual browser-control 200% and 400% zoom |
| Browsers | Chromium 152 headless | Approved Firefox and WebKit/Safari matrix; Firefox evidence was not produced in this environment |
| Device performance | Desktop 6× CPU/network emulation | Agreed low-end Android hardware and compressed production build |
| Core Web Vitals | Local lab metrics; constrained LCP was 3.508 s | Pre-release production lab pass and post-release field 75th-percentile LCP/INP/CLS |
| Accessibility/usability | Automated structure, contrast, keyboard and state checks | Human low-health-literacy, disability, clinical, operational and patient comprehension sessions |
| Security/privacy | Prototype made no external request or personal-data submission | Threat model, code/dependency/config tests, privacy/data-flow review, incident closure |
| Content/operations | Controlled fixtures and withholding behavior | Named owner approval, current source, dates, expiry, call/on-site/workflow tests |

## Gate application rule

A decision blocks only the affected capability, but no implementation may route around it. Safe independent work may proceed when the gated behavior stays omitted, inert, or clearly non-public. For example, component primitives can be engineered with replaceable tokens while `BRAND-01` is open; a live emergency number cannot be inferred or selected while `SAFE-01` is open.

For a Changed or Rejected outcome, follow the [validation change-control procedure](../../validation/stakeholder-low-fidelity-validation.md#change-control-procedure) before implementation continues. Record exceptions with owner, rationale, affected requirements, risk, compensating control, expiry, and retest date.
