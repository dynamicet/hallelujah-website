# Backlog Traceability Matrix

**Purpose:** Prove that every baseline requirement, formal decision, canonical route, and architecture decision has implementation or acceptance coverage.  
**Maintenance rule:** When a requirement, decision, route, or ticket changes, update this matrix in the same change.  
**Coverage meaning:** A mapped ticket plans work; it does not prove the requirement or decision is complete.

## Requirement coverage

### Global experience and quality

| Requirement | Phase / priority | Primary backlog coverage | Closure evidence |
| --- | --- | --- | --- |
| `G-001` | Phase 1 / P1 | `B01-006`, `B03-004`, `B03-007` | Keyboard/mobile route walkthrough from every template |
| `G-002` | Phase 1 / P1 | `B03-004`, `B07-008` | Sitemap conformance and patient starting-route comprehension |
| `G-003` | Phase 1 / P1 | `B01-004`, `B07-007`, `B07-008` | 320/360, manual 200%/400% zoom, representative tablet/desktop |
| `G-004` | Phase 1 / P0 | `B01-003`, `B01-004`, `B07-007` | Automated plus manual state/gradient/image contrast evidence |
| `G-005` | Phase 1 / P0 | `B01-005`–`B01-010`, `B07-007`, `B07-008` | Keyboard-only journeys, visible/unobscured focus, no trap |
| `G-006` | Phase 1 / P1 | `B01-005`, `B07-007`, `B07-008` | 44×44 geometry and physical touch-device review |
| `G-007` | Phase 1 / P0 | `B01-010`–`B01-012`, `B07-009` | No-JS/provider/image/font/offline failure suite |
| `G-008` | Phase 1 / P1 | `B00-013`, `B07-005`, `B07-006` | Production-like lab and field 75th-percentile CWV by template |
| `G-009` | Phase 1 / P1 | `B02-011`, `B07-005`, `B07-006` | Compressed transfer, first-party JS, and request budgets |
| `G-010` | Phase 1 / P0 | `B01-004`–`B01-010`, `B07-007`, `B07-008` | Semantic/AT/manual content-equivalence evidence |
| `G-011` | Phase 1 / P1 | `B01-010`, `B05-015`, `B07-009` | Per-route/component state inventory and tests |
| `G-012` | Phase 1 / P1 | `B01-012`, `B07-007` | Motion review, reduced-motion, Save-Data, restored-page cases |
| `G-013` | Phase 1 / P1 | `B02-001`, `B02-010`, `B05-015`, `B06-013` | Crawl, canonical, metadata, structured data, sitemap, 404/410 |
| `G-014` | Phase 1 / P0 | `B00-001`, `B02-001`–`B02-009`, `B07-010` | Zero public unowned, unreviewed, or expired governed records |
| `G-015` | Phase 1 / P0 | `B01-008`, `B02-001`, `B02-014`, `B07-010` | Null/omission fixtures and no-placeholder production scan |
| `G-016` | Phase 1 / P1 | `B06-007`–`B06-010`, `B07-008`, `B07-010` | English/Amharic low-health-literacy and AT comprehension |

### Safety, security, privacy, and language

| Requirement | Phase / priority | Primary backlog coverage | Closure evidence |
| --- | --- | --- | --- |
| `S-001` | Phase 0 / P0 | `B00-002`, `B06-014`, `B07-013` | Closed incident, clean source, index remediation, monitoring |
| `S-002` | Phase 1 / P0 | `B00-011`–`B00-012`, `B07-002`–`B07-004`, `B07-011` | TLS/headers/cookies, threat model, scans, negative tests |
| `S-003` | Phase 1 / P0 | `B03-012`–`B03-019`, `B07-002`–`B07-004` | Server validation, abuse/CSRF/idempotency/logging tests |
| `S-004` | Phase 1 / P0 | `B02-009`, `B03-013`, `B05-011`–`B05-012` | Approved notice matching deployed collection and retention |
| `S-005` | Phase 1 / P0 | `B00-014`, `B01-011`, `B06-002`, `B07-009` | Approved register; unapproved providers make zero requests |
| `S-006` | Phase 1 / P0 | `B06-007`–`B06-010`, `B03-010`, `B03-017` | Complete professionally reviewed safety string/route inventory |
| `S-007` | Phase 2 / P2 | `B06-011`–`B06-012` | Essential-journey route/state parity audit |
| `S-008` | Phase 1 / P1 | `B01-006`, `B06-008`, `B06-010`, `B06-012` | Route/record/query continuity and unavailable-equivalent tests |

### Home and emergency

| Requirement | Phase / priority | Primary backlog coverage | Closure evidence |
| --- | --- | --- | --- |
| `H-001` | Phase 1 / P1 | `B03-004`, `B03-007` | Essential tasks precede campaigns at mobile and desktop |
| `H-002` | Phase 1 / P1 | `B03-004`, `B03-007` | Static-first task introduction; optional user-initiated media; no auto-rotation, pre-intent request, or critical-path dependency |
| `H-003` | Phase 1 / P0 | `B02-004`–`B02-006`, `B03-006` | Features resolve to approved canonical records or omit |
| `H-004` | Phase 1 / P0 | `B02-008`, `B03-006`, `B05-002`–`B05-004` | Claim/relationship/rights ledger matches every visible claim |
| `H-005` | Phase 1 / P1 | `B06-001`–`B06-006` | Relevance, correction, urgent routing, non-diagnostic review |
| `E-001` | Phase 0 / P0 | `B02-003`, `B03-001`, `B03-005`, `B03-008`–`B03-010` | Owner approval, live call, visible/href and physical-device tests |
| `E-002` | Phase 1 / P0 | `B03-001`–`B03-002`, `B03-008`–`B03-010` | Clinical/operations approval and route-distinction comprehension |
| `E-003` | Phase 1 / P0 | `B03-002`, `B03-008`–`B03-010` | Warning precedes routine channels and is announced correctly |
| `E-004` | Phase 1 / P0 | `B03-002`–`B03-003`, `B03-008`–`B03-010` | Approved scope and dated on-site no-map arrival test |
| `E-005` | Phase 1 / P0 | `B03-008`–`B03-010`, `B07-009` | No-JS and approved constrained-network critical-path pass |

### Doctors and services

| Requirement | Phase / priority | Primary backlog coverage | Closure evidence |
| --- | --- | --- | --- |
| `D-001` | Phase 1 / P0 | `B02-004`, `B04-001`, `B04-007`–`B04-008` | Approved roster reconciliation and retired-record exclusion |
| `D-002` | Phase 1 / P1 | `B04-002`, `B04-007`–`B04-008` | Search/filter/reset/URL/zero/keyboard/count tests |
| `D-003` | Phase 1 / P1 | `B02-004`, `B02-006`, `B04-002`, `B04-007`–`B04-010` | One canonical URL/card/profile and duplicate resolution |
| `D-004` | Phase 1 / P1 | `B02-004`, `B04-002`, `B04-009`–`B04-010` | Approved schema completeness with clean optional omission |
| `D-005` | Phase 1 / P0 | `B02-004`, `B04-003`, `B04-009`–`B04-010` | Approved schedule model or proven total omission |
| `D-006` | Phase 1 / P1 | `B01-008`, `B02-011`, `B04-002`, `B04-009`–`B04-010` | Rights-cleared portraits and non-impersonating fallback |
| `V-001` | Phase 1 / P1 | `B02-005`, `B04-004`, `B04-011`–`B04-012` | Approved single patient taxonomy and launch subset |
| `V-002` | Phase 1 / P1 | `B02-005`, `B04-005`, `B04-013`–`B04-014` | Required-field plus named clinical/operations review |
| `V-003` | Phase 1 / P0 | `B02-005`, `B04-005`, `B04-011`–`B04-014` | High-consequence claim ledger; unsupported content absent |
| `V-004` | Phase 1 / P1 | `B02-005`, `B02-012`, `B04-004`–`B04-005`, `B04-012` | Known copy/misspelling/overlap regression is clean |
| `V-005` | Phase 1 / P1 | `B02-006`, `B04-006`, `B04-009`–`B04-014` | Bidirectional current relationships and handoff tests |

### Appointment request

| Requirement | Phase / priority | Primary backlog coverage | Closure evidence |
| --- | --- | --- | --- |
| `A-001` | Phase 1 / P0 | `B03-011`, `B03-017`, `B03-019` | All UI/API/message/error copy means request, not booking |
| `A-002` | Phase 1 / P0 | `B03-002`, `B03-017`, `B03-019` | Pre-form warning plus verified emergency action and AT check |
| `A-003` | Phase 1 / P0 | `B03-012`–`B03-015`, `B03-017`, `B03-019` | Approved field-minimization record and conditional validation |
| `A-004` | Phase 1 / P1 | `B01-009`, `B03-014`, `B03-017`, `B03-019` | Labels/instructions/error summary/value retention/AT tests |
| `A-005` | Phase 1 / P0 | `B03-013`, `B03-017`, `B03-019`, `B05-011`–`B05-012` | Approved disclosure/consent/record/retention; never preselected |
| `A-006` | Phase 1 / P0 | `B03-011`, `B03-014`, `B03-016`–`B03-019` | Accepted/failure/unknown/delivery-warning operational E2E |
| `A-007` | Phase 1 / P0 | `B03-014`–`B03-016`, `B03-019` | Concurrent/double-click/retry tests prove one request per intent |

### Contact, practical information, and institutional content

| Requirement | Phase / priority | Primary backlog coverage | Closure evidence |
| --- | --- | --- | --- |
| `C-001` | Phase 0 / P0 | `B02-003`, `B03-001`, `B05-007`–`B05-008` | Approved canonical record and zero divergence test |
| `C-002` | Phase 1 / P1 | `B03-003`, `B05-007`–`B05-008` | Dated on-site, no-map arrival and accessible entrance test |
| `C-003` | Phase 1 / P1 | `B00-014`, `B01-011`, `B05-007`–`B05-008` | Text equivalence and blocked/provider-failure behavior |
| `P-001` | Phase 1 / P1 | `B02-007`, `B05-001`, `B05-005`–`B05-006` | Task-led hub and explicit include/omit matrix |
| `P-002` | Phase 1/2 / P1 | `B02-007`, `B05-001`, `B05-005`–`B05-006` | Hospital-authored approved topics with lifecycle evidence |
| `I-001` | Phase 1 / P1 | `B02-008`, `B05-002`, `B05-009`–`B05-010` | Executive approval and claim-ledger reconciliation |
| `I-002` | Phase 1 / P1 | `B02-008`, `B02-011`, `B05-003`, `B05-009`–`B05-010` | Current leadership register and portrait rights |
| `I-003` | Phase 1/2 / P1 | `B02-008`, `B05-004`, `B05-009`–`B05-010` | Active relationship/meaning/rights/review evidence |
| `I-004` | Phase 2 / P2 | `B08-001`–`B08-005`, `B06-011`–`B06-012` | Vacancy lifecycle, data-flow, language, and provider acceptance |
| `I-005` | Phase 2 / P2 | `B08-006`–`B08-007` | Governed author/reviewer/source/review/expiry workflow |

## Formal decision coverage

| Decision | Backlog owner ticket(s) | Affected implementation |
| --- | --- | --- |
| `GOV-01` | `B00-001` | Every governed record, evidence item, and release approval |
| `GOV-02` | Approved baseline; scope changes governed by `B08-006`, `B08-008`, `B08-009` | Phase 1 route inventory and Phase 2 entry |
| `GOV-03` | `B00-017` | Benchmark-derived patterns, tests, and exclusions |
| `SAFE-01` | `B03-001` | Global shell, Home, Emergency, Appointment, records, practical pages |
| `SAFE-02` | `B03-002` | Emergency, Appointment, Services, Patient Info, Contact, Search |
| `SAFE-03` | `B03-003` | Emergency, Contact, Services, Patient Info |
| `SAFE-04` | `B03-002`, `B04-005` | Home, Emergency, Service details, About |
| `APPT-01` | `B03-011` | All appointment CTAs, page, API, confirmation, fallbacks |
| `APPT-02` | `B03-012` | Appointment fields and record selectors |
| `APPT-03` | `B03-013` | Appointment collection, privacy, storage, access, retention |
| `APPT-04` | `B03-014` | Idempotency, unknown outcome, receipts, message failure |
| `CARE-01` | `B04-001` | Clinician roster across Home, directory, search, Appointment |
| `CARE-02` | `B04-002` | Clinician profile schema, filters, canonical map, portraits |
| `CARE-03` | `B04-003` | Schedule publication or omission |
| `CARE-04` | `B04-004` | Service taxonomy, selectors, search vocabulary |
| `CARE-05` | `B04-005` | Service scope and capability claims |
| `CARE-06` | `B04-006` | Doctor/service/location/appointment relationships |
| `ACCESS-01` | `B05-001` | Patient & Visitor Information |
| `SEARCH-01` | `B06-001` | Searchable types, vocabulary, relevance, urgent behavior |
| `SEARCH-02` | `B06-002` | Query privacy, logging, cache/referrer, providers |
| `LANG-01` | `B06-007` | Phase 1 safety-critical bilingual scope |
| `LANG-02` | `B06-011` | Phase 2 parity and consequential missing-language behavior |
| `INST-01` | `B05-002` | Story, mission, values, milestones, facts/claims |
| `INST-02` | `B05-003` | Leadership and portraits |
| `INST-03` | `B05-004` | Partners/insurers and relationship meaning |
| `BRAND-01` | `B01-002`, `B01-012`, `B03-004`, `B03-007` | Logo/name, theme, typography, imagery/footage, high-end motion/media art direction, consent and rights |
| `HR-01` | `B08-001` | Vacancy lifecycle |
| `HR-02` | `B08-002` | Recruitment data flow and application provider |
| `HR-03` | `B08-003` | Recruitment legal/process/language copy |
| `SEC-01` | `B00-002` | Trusted production source and SEO-spam recovery |
| `SEC-02` | `B00-014` plus feature-specific tickets | Every optional/external provider |
| `DEL-01` | `B00-015`–`B00-016` | Acceptance matrix, evidence, and release authority |

B02-007 controlled-development execution covers P-001/P-002 schema, topic decisions,
independent operations/privacy/legal workflow, internal task ordering and safe expiry under the
[execution brief](b02-007-governed-visitor-topics.md) and
[execution evidence](evidence/B02-007-governed-visitor-topics-2026-09-17.md).
ACCESS-01 remains unresolved for hospital-authored guidance and publication. No route is enabled.

## Architecture coverage

| Decision | Backlog coverage | Verification |
| --- | --- | --- |
| `ARCH-01` Application platform | `B00-004`–`B00-005`, `B01-001` | Pinned build and contract-driven production architecture |
| `ARCH-02` Data separation | `B00-008`–`B00-010`, `B02-001`, `B03-015` | Local cross-role denial for controlled `B02-001`; VPS cross-role denial, migrations, backup/restore, threat tests before staging/production |
| `ARCH-03` Repo/hosting/environments | `B00-006`–`B00-007`, `B00-012` | Environment isolation, approved VPS/DNS/TLS decisions |
| `ARCH-04` CI/package/deployment | `B00-011`–`B00-012`, `B07-011`–`B07-012` | Required checks, immutable artifact, rollback rehearsal |
| `ARCH-05` First-party minimum | `B00-014`, `B01-011`, `B06-002`, `B07-009` | Zero unapproved provider requests and failure tests |
| `ARCH-06` Observability | `B00-013`, `B07-006`, `B07-013`, `B07-018` | Alerts, redaction, retention, field performance, hypercare |
| `ARCH-07` Evidence split | `B00-003`, `B00-015`, `B07-015` | Access-controlled evidence, redaction, durable links |

## Route coverage

| Route / response | Sections | Build tickets | Primary acceptance tickets |
| --- | --- | --- | --- |
| `/` | `H0`–`H9` | `B03-004`–`B03-006` | `B03-007`, `B07-007`–`B07-010` |
| `/emergency/` | `E0`–`E8` | `B03-008`–`B03-009` | `B03-010`, `B07-007`–`B07-010` |
| `/doctors/` | `D0`–`D6` | `B04-007` | `B04-008`, `B07-007`–`B07-010` |
| `/doctors/{doctor-slug}/` | `P0`–`P7` | `B04-009` | `B04-010`, `B07-007`–`B07-010` |
| `/services/` | `S0`–`S7` | `B04-011` | `B04-012`, `B07-007`–`B07-010` |
| `/services/{service-slug}/` | `V0`–`V9` | `B04-013` | `B04-014`, `B07-007`–`B07-010` |
| `/appointments/` | `A0`–`A8` | `B03-015`–`B03-018` | `B03-019`, `B07-004`, `B07-007`–`B07-010` |
| `/patient-information/` | `PI0`–`PI7` | `B05-005` | `B05-006`, `B07-007`–`B07-010` |
| `/contact/` | `LC0`–`LC7` | `B05-007` | `B05-008`, `B07-007`–`B07-010` |
| `/search/` | `SR0`–`SR7` | `B06-003`–`B06-005` | `B06-006`, `B07-004`, `B07-007`–`B07-010` |
| `/about/` | `AB0`–`AB9` | `B05-009` | `B05-010`, `B07-007`–`B07-010` |
| `/privacy/` | `PV0`–`PV5` | `B05-011`–`B05-012` | `B07-004`, `B07-007`–`B07-010` |
| `/accessibility/` | `AX0`–`AX5` | `B05-013`–`B05-014` | `B07-007`–`B07-010` |
| 404/410/unavailable | `NF0`–`NF4` | `B05-015` | `B05-016`, `B07-007`–`B07-010` |
| `/careers/` Phase 2 | `CR0`–`CR8` | `B08-004` | `B08-005` |

## Traceability audit checklist

- [x] Every requirement ID in the requirements matrix appears exactly once in the requirement coverage sections above. Verified by the [backlog integrity result](evidence/backlog-integrity-2026-09-12.md).
- [x] Every unresolved formal decision has at least one owned decision ticket. Verified by the [backlog integrity result](evidence/backlog-integrity-2026-09-12.md).
- [x] Every included route has build, state, content, and acceptance coverage. Verified by the [backlog integrity result](evidence/backlog-integrity-2026-09-12.md).
- [ ] Every ticket links to canonical requirements and implementation sources.
- [ ] Every release evidence record identifies requirement, decision, route/section/state, build, environment, method, expected/actual, result, tester/date, artifact, defect, and retest.
- [ ] Any Changed/Rejected decision updates the affected requirement, contract, design, ticket, test, and evidence mapping together.
