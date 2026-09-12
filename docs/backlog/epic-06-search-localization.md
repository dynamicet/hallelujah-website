# Epic 06 — Search, Localization, and Discoverability

**Outcome:** A privacy-bounded, non-diagnostic site search and honest English/Amharic experience that preserve canonical context across routes, filters, errors, and unavailable translations.  
**Priority:** P0/P1/P2  
**Milestones:** M2–M4; Phase 2 parity follows M7  
**Primary owners:** Product, Search/Backend, Frontend, Clinical/Content, Professional Amharic Reviewer, Privacy/Security, QA

## Canonical sources

- [Search Results specification](../ux/page-specifications.md#10-search-results) and [wireframe](../wireframes/search-results.md)
- [Practical-access/search flows](../wireframes/practical-access-flows.md)
- [Responsive bilingual refinement](../visual-design/pages/responsive/responsive-bilingual-refinement.md)
- [Search visual study](../visual-design/pages/practical-institutional/search-results.html)
- [Requirements: language and search](../requirements/requirements-matrix.md#safety-security-privacy-and-language)

## Search governance

| ID | Lane | Pri | Outcome and scope | Acceptance and evidence | Dependencies / gates | Owner | References |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `B06-001` | DECISION | P0 | Approve searchable record types, bilingual names/synonyms/spelling variants, ranking tasks, explicit correction behavior, urgent terms, and non-diagnostic wording. | Signed vocabulary and relevance set covers doctors, services, governed condition terms, locations, practical content, urgent phrases, correction display, excluded sensitive/diagnostic behavior, and owner/update cadence in both languages. | `SEARCH-01`, `CARE-01`, `CARE-04`, `ACCESS-01` | Clinical + Product + Content | `H-005`, `D-001`, `V-001`–`V-004`, `P-002`, `C-001` |
| `B06-002` | DECISION | P0 | Approve query logging, access, retention, redaction, cache/referrer controls, analytics/autocomplete/provider exposure, and sensitive-query handling. | Privacy/security assessment defines logging-off default or bounded first-party fields; raw sensitive queries never reach analytics/client logs; cache/referrer headers and access/retention tests pass; remote suggestions stay off unless approved. | `SEARCH-02`, `SEC-02` | Privacy + Security | `S-005`, `H-005`, `G-007`–`G-009`; [decision detail](../validation/stakeholder-low-fidelity-validation.md#patient-access-search-language-and-content) |

## Search implementation `/search/` (`SR0`–`SR7`)

| ID | Lane | Pri | Outcome and implementation scope | Acceptance and evidence | Dependencies / gates | Owner | References |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `B06-003` | DELIVERY | P0 | Build first-party index pipeline from approved current canonical records with type, language, synonyms, status, and retirement events. | Only publishable records index; updates/expiry/withdrawal remove promptly; no private/draft/internal fields enter documents; language analyzers preserve names/clinical terms; index rebuild is deterministic, observable, and reversible. | `B02-004`–`B02-010`, `B06-001` | Backend + Content | `H-005`, `G-013`–`G-015`; [search contract](../visual-design/handoff/developer-handoff.md#6-data-and-url-contracts) |
| `B06-004` | DELIVERY | P0 | Implement bounded server search, approved ranking/corrections, typed canonical results, urgent-term routing, pagination, and privacy controls. | Input length/keys are bounded; query remains navigational; urgent terms show approved route without diagnosing; corrections are explicit; results contain only approved fields; malformed/abusive input fails safely; logging/cache/referrer follow decision. | `B06-001`–`B06-003` | Backend + Security | `H-005`, `S-003`, `S-005`, `G-007`–`G-009` |
| `B06-005` | DELIVERY | P1 | Implement Search Results and global search entry with initial/results/urgent/correction/zero/failure/timeout/offline/expired/no-JS states. | `SR0`–`SR7` order and state contracts pass; form works as GET with bounded navigational state; type labels and result count are accessible; query is not echoed unsafely; sensitive-input warning is visible; recovery never advises treatment. | `B01-007`, `B01-010`, `B06-004` | Frontend + Product | `H-005`, `G-001`, `G-007`, `G-011`; [Search spec](../ux/page-specifications.md#10-search-results); [wireframe](../wireframes/search-results.md); [study](../visual-design/pages/practical-institutional/search-results.html) |
| `B06-006` | EVIDENCE | P1 | Validate search relevance, safety, privacy, canonicality, accessibility, resilience, and performance in both language scopes. | Judgment set measures approved relevance tasks; urgent/sensitive/adversarial/misspelled/zero cases pass; no unpublished records or sensitive logs; URL/history, encoding, rate limits, 320/360/reflow, keyboard/AT, no JS, timeout/offline, and index withdrawal pass. | `B06-003`–`B06-005`, `DEL-01` | QA + Clinical + Privacy | `H-005`, `S-003`, `S-005`, `G-003`–`G-013`, `G-016` |

## Language governance and implementation

| ID | Lane | Pri | Outcome and implementation scope | Acceptance and evidence | Dependencies / gates | Owner | References |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `B06-007` | DECISION | P0 | Approve Phase 1 safety-critical English/Amharic route/string inventory and professional translation/clinical review workflow. | Inventory includes primary navigation, Emergency, Appointment warnings/instructions/system messages/privacy/consent, contacts, landmark directions, and safety/search warnings; names translator/reviewer, source/version, terminology memory, review date, and update SLA. | `LANG-01`, `GOV-01` | Clinical + Content + Language Reviewer | `S-006`, `S-008`, `G-016` |
| `B06-008` | DELIVERY | P0 | Implement localization architecture with stable public-record identity, localized fields/slugs, route-aware language switch, metadata/hreflang, and unavailable-equivalent contract. | Switching preserves equivalent route, record, and bounded safe query/filter state; never carries personal form data; missing equivalent remains on an explanatory state with nearby translated choices and never silently redirects Home; locale fallbacks are explicit. | `B02-001`, `B02-010`, `B06-007` | Frontend + Backend | `S-006`–`S-008`, `G-013`, `G-016`; [bilingual handoff](../visual-design/handoff/developer-handoff.md#9-bilingual-and-responsive-implementation) |
| `B06-009` | CONTENT | P0 | Produce, professionally review, and import the Phase 1 safety-critical translation inventory. | Every string has stable key, English source/version, Amharic translation, translator, clinical reviewer where applicable, status/date, affected routes/states, and expiry/update linkage; geometry-only prototype strings are never imported. | `B06-007`–`B06-008` | Content + Language + Clinical | `S-006`, `G-016`; [unperformed Amharic validation](../visual-design/handoff/remaining-assumptions-and-gates.md#unperformed-or-non-closing-validation) |
| `B06-010` | EVIDENCE | P0 | Validate Phase 1 meaning, pronunciation, parity, context preservation, layout, AT output, and unavailable behavior. | Professional/human review plus automated route matrix covers long/mixed text, names, errors/status, emergency distinction, appointment request semantics, privacy/consent, landmarks, switch context, missing equivalent, 320/360/zoom, fonts, and screen readers. | `B06-008`–`B06-009`, `DEL-01` | QA + Language + Clinical | `S-006`, `S-008`, `G-003`, `G-010`, `G-016` |
| `B06-011` | DECISION | P2 | Approve Phase 2 route/state parity and the rule for missing consequential Careers terms. | Route-by-route matrix identifies required content/states, stable-ID behavior, owner, delivery sequence, and approved fallback; Careers Apply is disabled when process/privacy language is unavailable. | `LANG-02`, `HR-03` | Product + Content + Language | `S-007`, `S-008`, `I-004` |
| `B06-012` | CONTENT | P2 | Deliver and validate Phase 2 essential-journey English/Amharic parity. | Parity audit finds no missing approved content, labels, instructions, errors, recovery, metadata, or interaction states for included routes; professional/clinical review and comprehension tests are recorded. | `B06-011`; route-specific content gates | Content + Language + QA | `S-007`, `S-008`, `G-016` |

## Discoverability and SEO recovery

| ID | Lane | Pri | Outcome and implementation scope | Acceptance and evidence | Dependencies / gates | Owner | References |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `B06-013` | DELIVERY | P1 | Generate accurate localized metadata, canonical/hreflang, structured data, sitemaps, and robots behavior from approved records only. | Crawl has one canonical per record/language; supported structured-data properties validate; expired/unpublished/fixture pages are absent; no false medical, review, availability, or organizational claims are emitted. | `B00-002`, `B02-010`, `B06-008` | Backend + SEO QA | `G-013`–`G-015`, `S-001` |
| `B06-014` | EVIDENCE | P1 | Verify legacy spam cleanup and production discoverability after controlled launch. | Search-console/index records show submitted clean sitemap, spam URL removal/410 as appropriate, canonical consistency, no fixture/staging indexation, and monitoring for reinfection/index anomalies; evidence links to `SEC-01`. | `B00-002`, `B06-013`, production approval | Security + Content/SEO | `S-001`, `G-013` |

## Epic exit criteria

- Search indexes and returns only current approved records, never diagnoses, and handles urgent/sensitive queries safely.
- Query handling matches the approved privacy decision and does not leak through URLs, caches, referrers, logs, or providers beyond the allowed bounded contract.
- Phase 1 Amharic safety scope is professionally reviewed in every relevant state—not only default pages.
- Language switching preserves canonical context and is honest about missing equivalents.

## Explicit exclusions

- No remote autocomplete, analytics, or search provider without `SEC-02` and `SEARCH-02` approval.
- No inferred synonym, translation, correction, urgency category, or clinical intent.
- No claim of full bilingual parity until `B06-012` passes.
