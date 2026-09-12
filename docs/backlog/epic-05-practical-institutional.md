# Epic 05 — Practical Access, Utility, and Institutional Pages

**Outcome:** Patients can prepare for a visit, contact and reach the hospital, understand privacy/accessibility commitments, recover from unavailable content, and view only evidence-backed institutional information.  
**Priority:** P0/P1  
**Milestones:** M2 and M4  
**Routes:** `/patient-information/`, `/contact/`, `/about/`, `/privacy/`, `/accessibility/`, and 404/410/unavailable responses

## Canonical sources

- [Practical-access flows](../wireframes/practical-access-flows.md) and [institutional flows](../wireframes/institutional-flows.md)
- [Practical/institutional visual package](../visual-design/pages/practical-institutional/README.md)
- [Utility specifications](../ux/utility-page-specifications.md) and [utility wireframes](../wireframes/utility-pages.md)
- [Page handoff matrix](../visual-design/handoff/page-handoff-matrix.md)

## Patient information and access decisions

| ID | Lane | Pri | Outcome and scope | Acceptance and evidence | Dependencies / gates | Owner | References |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `B05-001` | DECISION | P0 | Approve minimum launch guidance for before, during, and after a visit and explicitly omit/defer every unavailable topic. | Hospital-authored register covers visiting, admission/discharge, payment/insurance, accessibility, rights, complaints, safeguarding, medicines, what-to-bring, feedback, and staffed fallback; each included topic has owner/source/review/expiry and domain approval. | `ACCESS-01`, `GOV-01` | Operations + Content + Privacy/Legal | `P-001`, `P-002`, `C-001`, `G-014`; [W5 scenario](../validation/stakeholder-low-fidelity-validation.md#w5--visit-preparation-and-practical-access) |
| `B05-002` | DECISION | P0 | Approve institutional story, mission, vision, values, milestones, and capacity/facility/superlative claims. | Conflicting mission sources and 115/96-bed figures are dispositioned; every claim has definition, authoritative source, as-of date, wording, translation, owner, review interval, expiry, and withdrawal behavior. | `INST-01` | Executive + Content | `H-004`, `I-001`, `G-014`; [content review](../../../resources/content-review.md) |
| `B05-003` | DECISION | P1 | Approve current leadership records and portrait rights. | Register includes name, role, tenure/status, biography, owner, evidence, review date, image original/rights/consent/crop/alt, and expiry; stale leaders are removed promptly. | `INST-02`, `BRAND-01` | Executive + Brand | `I-002`, `D-006`, `G-014` |
| `B05-004` | DECISION | P1 | Approve each partner/insurer relationship, patient-relevant meaning/limitations, and name/logo rights. | Active status, exact relationship/coverage limitation, owner, source, rights, review interval, expiry, and removal are recorded; unapproved logos/coverage implications are absent. | `INST-03`, `SEC-02` if linked externally | Executive + Operations | `I-003`, `H-004`, `S-005` |

## Patient & Visitor Information `/patient-information/` (`PI0`–`PI7`)

| ID | Lane | Pri | Outcome and implementation scope | Acceptance and evidence | Dependencies / gates | Owner | References |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `B05-005` | DELIVERY | P1 | Implement task-led before/during/after hub with approved guides, direct practical actions, and truthful omission/unavailability. | Approved-minimum, partial/omitted stage, guide unavailable/expired, temporary notice, print/download, failure/offline, and no-JS states pass; no public empty pages; critical contacts use canonical settings; reading order and actions work at all breakpoints. | `B02-003`, `B02-007`, `B05-001`; `SAFE-01`–`SAFE-03` for related facts | Frontend + Content | `P-001`, `P-002`; [page spec](../ux/page-specifications.md#8-patient--visitor-information); [wireframe](../wireframes/patient-information.md); [study](../visual-design/pages/practical-institutional/patient-information.html) |
| `B05-006` | EVIDENCE | P1 | Validate visit-preparation completeness, comprehension, expiry, accessibility, printing, and recovery. | Named domain owners confirm facts; patient tasks find correct guidance; missing/expired/temporary states, no JS/offline, print, long bilingual text, 320/360/zoom, keyboard/AT, and canonical contact links pass. | `B05-005`, `DEL-01`, applicable `LANG` gates | QA + Operations + Content | `P-001`, `P-002`, `G-003`–`G-016` |

## Locations & Contact `/contact/` (`LC0`–`LC7`)

| ID | Lane | Pri | Outcome and implementation scope | Acceptance and evidence | Dependencies / gates | Owner | References |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `B05-007` | DELIVERY | P0 | Implement purpose-labeled contacts, hours, address, text-first directions, entrance/access information, and optional map. | Verified, missing/conflicting, unsupported dialer, temporary change, map idle/loading/failure, and no-JS/CSS/map states pass; no conflicting fact renders; text route is complete before map; map makes no request unless approved/activated. | `B02-003`, `B03-001`–`B03-003`, `B01-011`; `SEC-02` if map used | Frontend + Operations | `C-001`–`C-003`, `E-001`, `E-004`; [page spec](../ux/page-specifications.md#9-locations--contact); [wireframe](../wireframes/locations-contact.md); [study](../visual-design/pages/practical-institutional/locations-contact.html) |
| `B05-008` | EVIDENCE | P0 | Validate live contacts, physical arrival, deliberate activation, map independence, temporary-change expiry, and accessibility. | Visible/href/canonical consistency, physical dialer/touch, on-site no-map route, keyboard/AT, no JS/CSS/provider, print, Amharic directions, 320/360/zoom, and stale-cache invalidation pass with dated owner evidence. | `B05-007`, `LANG-01`, `DEL-01` | QA + Facilities + Operations | `C-001`–`C-003`, `G-003`–`G-010`, `G-014`, `G-016` |

## About `/about/` (`AB0`–`AB9`)

| ID | Lane | Pri | Outcome and implementation scope | Acceptance and evidence | Dependencies / gates | Owner | References |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `B05-009` | DELIVERY | P1 | Implement evidence-backed hospital narrative, leadership, milestones/facts, relationships, media, and clear returns to care tasks. | Approved/partial, required narrative withheld, expired claim/leader/relationship, image omitted, translation unavailable, and no-JS states pass; each claim shows/links appropriate as-of context; no unapproved superlative, coverage, capacity, or leadership implication appears. | `B02-008`, `B02-011`, `B05-002`–`B05-004`, `BRAND-01` | Frontend + Content | `I-001`–`I-003`, `H-004`; [page spec](../ux/page-specifications.md#11-about-the-hospital); [wireframe](../wireframes/about.md); [study](../visual-design/pages/practical-institutional/about.html) |
| `B05-010` | EVIDENCE | P1 | Validate claim provenance, leadership/relationship lifecycle, asset rights, task returns, accessibility, and resilience. | Claim/asset register and automated expiry tests reconcile every visible controlled item; withdrawal removes all derivatives/references; no-JS/images, print, reflow, keyboard/AT, and bilingual/unavailable behavior pass; executive/brand owners sign current build. | `B05-009`, `DEL-01` | QA + Executive + Brand | `I-001`–`I-003`, `G-009`, `G-010`, `G-013`–`G-016` |

## Privacy `/privacy/` (`PV0`–`PV5`)

| ID | Lane | Pri | Outcome and implementation scope | Acceptance and evidence | Dependencies / gates | Owner | References |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `B05-011` | CONTENT | P0 | Approve current privacy notice covering actual collection, purpose, lawful-basis position where applicable, recipients, retention, choices/rights, security boundary, cookies/providers, and contact route. | Privacy/legal owner signs version/effective/review dates; notice matches deployed data flows and disabled providers; form-specific disclosures link correctly; missing contact or unapproved collection disables affected feature. | `APPT-03`, `SEARCH-02`, `SEC-02`, `GOV-01` | Privacy/Legal | `S-004`, `S-005`; [Privacy spec](../ux/utility-page-specifications.md#1-privacy-notice--privacy) |
| `B05-012` | DELIVERY | P0 | Implement versioned Privacy route and current/no-optional-provider/collection-disabled/contact-unavailable/translation-unavailable/print/no-JS states. | Semantic content is server rendered and indexable; in-page navigation works; effective/review dates and contact are visible; current deployed providers/features match notice; print is complete; no scripts are required to read or exercise available choices. | `B02-009`, `B05-011` | Frontend + Privacy | `S-004`, `S-005`, `G-007`, `G-010`, `G-013`; [utility wireframe](../wireframes/utility-pages.md#privacy-notice) |

## Accessibility `/accessibility/` (`AX0`–`AX5`)

| ID | Lane | Pri | Outcome and implementation scope | Acceptance and evidence | Dependencies / gates | Owner | References |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `B05-013` | CONTENT | P0 | Approve truthful accessibility statement, tested scope/date, known limitations, support/barrier-reporting route, response expectations, and review cadence. | QA and accessibility owner verify every conformance statement against current evidence; unresolved defects are disclosed accurately; support contact/workflow is operationally tested; no unsupported compliance claim appears. | `DEL-01`, `SAFE-01`, `GOV-01` | QA/Accessibility + Operations | `G-003`–`G-010`, `G-016`; [Accessibility spec](../ux/utility-page-specifications.md#2-accessibility-statement--accessibility) |
| `B05-014` | DELIVERY | P1 | Implement Accessibility route with current/known-limitation/support-unavailable/translation-unavailable/print/no-JS states. | Statement is semantic/indexable, supports in-page navigation and print, exposes tested date/scope and reporting path, and never blocks reading on JS/provider failure; support unavailability has truthful alternative only when verified. | `B02-009`, `B05-013` | Frontend + QA | `G-003`, `G-007`, `G-010`, `G-013`; [utility wireframe](../wireframes/utility-pages.md#accessibility-statement) |

## 404, 410, redirect, and unavailable (`NF0`–`NF4`)

| ID | Lane | Pri | Outcome and implementation scope | Acceptance and evidence | Dependencies / gates | Owner | References |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `B05-015` | DELIVERY | P0 | Implement genuine 404, 410, approved-successor redirect, unpublished/retired, temporary failure, missing-language, and search-unavailable responses. | HTTP status and visible message agree; redirects target only genuine approved successors and avoid loops; unavailable content never masquerades as 200 success; emergency/contact actions use canonical data; helpful task routes remain available without JS. | `B02-010`, `B01-010`; `GOV-02`, `SAFE-01`, `LANG-01`–`LANG-02` | Backend + Frontend | `G-011`, `G-013`, `G-015`; [Not Found spec](../ux/utility-page-specifications.md#3-not-found-and-unavailable-content); [utility wireframe](../wireframes/utility-pages.md#not-found-unavailable) |
| `B05-016` | EVIDENCE | P1 | Crawl and test status, redirect, retirement, language, recovery, accessibility, and indexing behavior. | Automated crawl covers unknown, deleted, expired, merged, unpublished, wrong-language, stale-search, and failed-dependency URLs; status/canonical/robots/sitemap/cache behavior passes; keyboard/AT/reflow/no-JS recovery works. | `B05-015`, `DEL-01` | QA + SEO/Content | `G-011`, `G-013`–`G-016` |

## Epic exit criteria

- All visible practical and institutional facts are current, owned, sourced, reviewed, and expirable.
- Contact and arrival remain usable without map, scripts, styles, media, or custom fonts.
- Privacy and accessibility statements describe the deployed system—not intended future behavior.
- Removed content produces truthful status/redirect behavior and disappears from discovery surfaces.

## Explicit exclusions

- No separate Cookie or Terms/Legal route without approved scope change.
- No partner/insurer logo or coverage implication without relationship and rights evidence.
- No empty practical-information pages created to make the sitemap appear complete.
