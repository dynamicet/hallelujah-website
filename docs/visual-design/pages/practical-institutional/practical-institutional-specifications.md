# Order 8 Practical-Access and Institutional Visual Specifications

**Prepared:** 12 September 2026  
**Status:** Complete for non-public responsive design review; not production or publication approval  
**Pages:** Patient & Visitor Information, Locations & Contact, Search Results, About the Hospital, Careers (Phase 2)  
**Foundation:** [Order 4 prototype foundations](../../foundations/README.md)  
**Components:** [Order 5 component system](../../components/README.md)  
**Composition sources:** [Order 6 critical journeys](../critical-journeys/README.md) and [Order 7 care discovery](../care-discovery/README.md)

## 1. Composition contract

The studies preserve `PI0`–`PI7`, `LC0`–`LC7`, `SR0`–`SR7`, `AB0`–`AB9`, and `CR0`–`CR8`. Desktop pairings and rails never alter DOM, keyboard, heading, screen-reader, print, or compact reading order. The Order 8 stylesheet imports the Order 7 source and adds page composition only; it defines no new primitive, semantic color, component-state, safety, or motion token.

Every study:

- carries a persistent non-public prototype statement;
- uses controlled copy, dates, records, geometry, and public IDs rather than hospital facts;
- marks contact, guidance, directions, hours, claims, leadership, relationships, image rights, vacancies, application handling, search policy, translation, and review gates explicitly;
- keeps urgent, error, offline, unavailable, expired, privacy, temporary-operation, and vacancy-lifecycle states at Motion Level 0;
- leaves search, call, clipboard, map, email, application, provider, and translation operations inert or local-study navigation only;
- preserves server-rendered HTML, normal links, GET-shaped search, source order, print, and no-JavaScript baselines;
- inherits visible focus, 44 px targets, wrapping, constrained-layout, forced-color, reduced-motion, and external-resource prohibitions.

## 2. Patient & Visitor Information section design

| ID | Polished composition | Responsive/state behavior | Traceability and gates |
| --- | --- | --- | --- |
| `PI0` | Shared shell marks Patient information current; Emergency and language stay distinct. | Full nav becomes compact menu below 64 rem; no-JS task links remain. | `G-001`–`G-006`, `S-006`–`S-008`; identity, contact labels, translations. |
| `PI1` | Text-led orientation pairs scope/actions with a wayfinding-edged “start where you are” rail. | Two columns wide, one below 54 rem; actions stack compact. | `P-001`–`P-002`, `G-010`, `C-001`; minimum guide set and staffed-help scope/hours. |
| `PI2` | Before card begins a three-stage journey and demonstrates preparation, arrival, payment, and access topics. | Three cards wide; one column below 54 rem; empty stage omitted. | `P-001`–`P-002`, `A-001`, `C-002`, `G-014`–`G-015`; Operations, Privacy, Content approval. |
| `PI3` | During card covers navigation, visiting, language, access, rights, and support without inventing the source journey. | Always follows Before; temporary status stays beside affected guidance. | `P-001`–`P-002`, `C-002`, `G-014`–`G-015`; process, visiting, navigation, support approval. |
| `PI4` | After card covers discharge, follow-up, medicines, and feedback with a clinical escalation boundary. | Always follows During; unsafe/expired topics disappear. | `P-001`–`P-002`, `E-001`–`E-003`, `G-014`–`G-015`; Clinical, Operations, Privacy approval. |
| `PI5` | Quiet access and rights cards expose maintained cross-stage routes only. | Two wide, one below 64 rem; missing routes leave no gap. | `P-001`–`P-002`, `S-004`, `G-001`; destination, owner, translation, review approval. |
| `PI6` | State board provides guide-unavailable, partial, temporary-change, and offline behavior. | Replaces only the affected topic/stage; useful hub content remains. | `G-007`, `G-011`, `G-015`, `S-007`–`S-008`; recovery copy and alternatives. |
| `PI7` | Full-width staffed-help band leads to Contact and an inert call specimen. | Source-ordered compact stack; no digital-only dead end. | `G-001`, `G-007`, `C-001`–`C-002`; verified purpose, number, hours. |

## 3. Locations & Contact section design

| ID | Polished composition | Responsive/state behavior | Traceability and gates |
| --- | --- | --- | --- |
| `LC0` | Shared shell marks Locations current and preserves every care/safety route. | Same compact shell and no-JS continuity as Patient Information. | `G-001`–`G-006`, `S-006`–`S-008`; labels and translations. |
| `LC1` | Restrained identity establishes one canonical place record before action. | Reading-led two-column intro becomes one; no map/hero dominates. | `C-001`–`C-002`, `G-010`, `G-014`; public name, site count, owner/date. |
| `LC2` | Purpose rows separate hospital emergency from routine enquiries; only explicit controls call. | Rows become one column at compact widths; visible number survives unsupported dialer. | `C-001`, `E-001`–`E-003`, `G-006`; visible/normalized value, purpose, hours. |
| `LC3` | Selectable address, entrance, and landmark block precedes clipboard enhancement. | Paired wide with calls, one column narrow; Copy failure preserves text. | `C-002`, `E-004`, `G-007`, `S-006`; on-site verification and translation. |
| `LC4` | Purpose-specific definition rows include a dated temporary-status specimen. | Labels/values stack at compact size; status is static and non-dismissible. | `C-001`, `E-004`, `G-014`–`G-015`; schedule, timezone, expiry workflow. |
| `LC5` | Numbered text directions expose landmark, entrance, vehicle/transport, and accessible arrival. | Paired with hours wide, one column below 64 rem; no horizontal route diagram. | `C-002`, `P-001`–`P-002`, `G-015`; Facilities/Operations on-site test. |
| `LC6` | Abstract map geometry remains optional beside an explicit privacy-aware launcher. | One column below 64 rem; idle/load/failure reserve no critical dependency. | `C-003`, `S-005`, `G-007`–`G-009`, `G-011`; provider, coordinates, privacy, performance. |
| `LC7` | Non-urgent written-contact warning states scope before an inert route. | Reading width at every size; delayed channel never implies urgent response. | `C-001`, `S-004`–`S-005`, `E-003`; channel, monitoring, privacy handling. |

## 4. Search Results section design

| ID | Polished composition | Responsive/state behavior | Traceability and gates |
| --- | --- | --- | --- |
| `SR0` | Shared shell keeps care, Contact, Emergency, and language available. | Full/compact continuity; no breadcrumb on this utility route. | `G-001`–`G-006`, `S-006`–`S-008`; labels, contacts, language scope. |
| `SR1` | Persistent-label GET-shaped search uses a retained controlled query and prominent privacy-safe hint. | Field/button stack at compact size; clear preserves predictable URL semantics. | `H-005`, `G-005`, `G-007`, `S-005`; limits, normalization, logs/referrers. |
| `SR2` | State board shows the static governed urgent-term guidance before ordinary content. | Full width at all sizes; never placed inside filters or removed by filtering. | `H-005`, `E-001`–`E-005`, `S-006`; term list, matching, wording, number. |
| `SR3` | Native type rail lists only Doctor, Service, Guide, and Location fixtures. | Rail precedes results in DOM; compact disclosure retains native controls. | `H-005`, `G-011`, `D-001`, `V-001`, `P-001`, `C-001`; approved indexes/counts. |
| `SR4` | Quiet committed-result status and active type sit immediately before results. | Wraps without truncation; production update announces politely without focus jump. | `G-010`–`G-011`, `H-005`; bilingual count and safe query display. |
| `SR5` | One-column typed result list emphasizes type, canonical title, and governed match context. | One column at every width; pagination links preserve bounded URL state. | `H-005`, `G-013`–`G-015`; current approved public index, ranking, snippet source. |
| `SR6` | State board covers correction, zero, failure/offline, and unavailable index/policy. | Replaces results only; query/search and matched urgent guidance remain. | `G-007`, `G-011`, `H-005`, `C-001`; correction, recovery, cache, fallback. |
| `SR7` | Support band routes to Services, Not sure request, and Contact. | Compact source-ordered stack; never recommends care or diagnoses. | `G-001`, `A-001`–`A-003`, `C-001`; staffed fallback and request wording. |

## 5. About the Hospital section design

| ID | Polished composition | Responsive/state behavior | Traceability and gates |
| --- | --- | --- | --- |
| `AB0` | Secondary shell and breadcrumb preserve essential exits. | Breadcrumb wraps; compact menu and no-JS links remain. | `G-001`–`G-006`, `G-010`, `G-013`, `S-006`–`S-008`; identity/routes/translations. |
| `AB1` | Evidence-led introduction keeps Services and Contact before institutional depth. | Two columns wide, one below 54 rem; no promotional oversized hero. | `G-001`–`G-002`, `I-001`, `C-001`; approved orientation/action labels. |
| `AB2` | Reading-led story pairs a vertical evidence-dated timeline with abstract rights-gated media. | Pair becomes one column; no carousel, horizontal timeline, or motion dependency. | `I-001`, `H-004`, `G-014`–`G-015`; narrative, milestone evidence/dates. |
| `AB3` | Mission/vision/value panel uses restrained text and wayfinding rules. | Values become one column below 54 rem; conflicting source blocks the route. | `I-001`, `G-014`–`G-015`; Executive/Content source resolution. |
| `AB4` | Modest evidence cards avoid oversized counters and include definitions/as-of placeholders. | Three to two to one columns; each expired fact disappears. | `I-001`, `H-004`, `G-014`–`G-015`; claim ledger and disputed facts. |
| `AB5` | Leadership grid demonstrates portrait and no-portrait records with text-first identity. | Three/two/one columns; stale name/role blocks that record. | `I-001`–`I-002`, `G-014`–`G-015`; roster, tenure, bio, portrait rights. |
| `AB6` | Relationship explanations outrank abstract logo marks. | Three/two/one columns; none approved means section omission. | `I-003`, `S-005`, `G-014`–`G-015`; status, meaning, limitations, rights. |
| `AB7` | Optional image boundary is described after meaningful content, without presenting a real asset. | Abstract media may vanish globally; text/actions remain complete. | `G-010`, `G-014`–`G-015`, `I-001`–`I-003`; authenticity, consent, rights, alt. |
| `AB8` | Quiet metadata separates institutional review from medical review. | Wraps and prints; expiry unpublishes required content. | `G-014`, `I-001`–`I-003`; owner/date/source/interval. |
| `AB9` | Support band returns visitors to Services, Doctors, Appointments, and Contact. | One-dimensional compact stack; no dead end. | `G-001`, `D-001`–`D-003`, `V-001`–`V-003`, `A-001`, `C-001`–`C-003`; canonical routes. |

## 6. Careers section design

| ID | Polished composition | Responsive/state behavior | Traceability and gates |
| --- | --- | --- | --- |
| `CR0` | Secondary shell and breadcrumb retain patient-task priority. | Compact/full shell continuity; Phase 2 language scope remains explicit. | `G-001`–`G-006`, `G-010`, `G-013`, `S-006`–`S-008`; route labels and language. |
| `CR1` | Restrained recruitment orientation leads to an in-page current-vacancies target. | One column below 54 rem; no culture video or unsupported claims. | `I-004`, `G-002`, `G-010`, `G-015`; HR/Executive/Content approval. |
| `CR2` | Static count/check-date status precedes records without premature filters. | Wraps; no fictional skeletons; no-current state replaces collection. | `I-004`, `G-011`, `G-014`–`G-015`; HR cadence/order/owner. |
| `CR3` | Complete controlled vacancy separates metadata, responsibilities, criteria, process, public ID, and action gate. | Main/rail wide, source-ordered one column below 64 rem; no countdown. | `I-004`, `G-010`, `G-013`–`G-015`; all fields, status/window, destination. |
| `CR4` | Sticky wide privacy rail follows role information and precedes Apply in DOM. | In-flow before Apply on compact/reflow; no provider loads. | `S-003`–`S-005`, `I-004`; data/files, recipients, security, retention, rights, provider. |
| `CR5` | State board provides honest no-current-vacancies behavior and checked date. | Replaces list/privacy/action; no disabled cards or speculative route. | `I-004`, `G-011`, `G-014`–`G-015`, `C-001`; maintained HR fallback only if approved. |
| `CR6` | State board distinguishes closed, stale/expired, provider unavailable, and handling unapproved. | One readable Level 0 panel; Apply removed immediately. | `I-004`, `G-011`, `G-013`–`G-015`; lifecycle/cache/search/sitemap behavior. |
| `CR7` | Policy/access-support panel explicitly withholds inferred equality, accommodation, and fraud wording. | Reading width; purpose-specific route only. | `I-004`, `S-004`, `C-001`; HR/Privacy/Operations approval. |
| `CR8` | Quiet vacancy currency metadata makes fixture status and required evidence visible. | Wraps/prints; machine-readable production dates required. | `G-014`, `I-004`; owner, source, dates, interval, expiry. |

## 7. State and publication model

| Domain | Publication and recovery rule |
| --- | --- |
| Patient guidance | Publish only a useful approved minimum plus current staffed fallback. Omit empty topics/stages. Direct expired routes receive honest alternatives; ungoverned stale advice never appears. |
| Contact and arrival | Required canonical identity, calls, address, entrance, landmarks, and purpose hours must agree. Device/clipboard/map failures preserve visible HTML. Temporary status requires effective/expiry data. |
| Search | Index only current public records. A stale urgent-term policy blocks condition-term search. Correction is explicit; zero/failure preserve safe routes and never diagnose. |
| Institutional story | Required story and resolved mission/vision/values gate About. Optional fact/person/relationship/image modules vanish independently; expired claims leave About, Home, and Search. |
| Careers | A role is actionable only inside its approved publication window with current status, privacy notice, and destination. Apply rechecks the lifecycle; closure removes it from lists, Search, sitemap, and stale caches. |
| Language | Preserve context only when equivalent consequential meaning exists. Explain unavailable translation in place; remove application action when role/process/privacy terms cannot be understood. |
| No JavaScript/fonts/images/map | Shell links, guide stages, purpose contacts, address/directions/hours, GET search/filter/results, institutional text, vacancy details/privacy/status, review metadata, and recovery remain usable in source order. |

## 8. Accessibility, privacy, safety, motion, and performance

- Headings follow section source order; visual columns do not reorder content. Typed search results and contact purposes are textual, not color- or icon-only.
- Every control inherits the 44 px target and visible focus. Search/filter labels persist; call rows are not fully clickable; vacancy cards are not nested whole-card links.
- Long Amharic, English, mixed-script, addresses, landmarks, titles, role criteria, and 35% label expansion wrap without fixed text height.
- Emergency, urgent-term, temporary-operation, privacy, failure, offline, unavailable, expired, closed, and unknown states use Motion Level 0. The only expressive mark is the inherited already-sized orientation rule.
- No external font, image, map, search backend, analytics, tracker, autocomplete, email, upload, recruitment provider, call, clipboard, or data submission runs. `no-referrer` is set on each study.
- Search query fixtures are public navigational context only. Candidate and visitor data never enters a URL, local storage, log, remote resource, or prototype action.
- Abstract media/map geometry is CSS-only, sized in advance, removable without information loss, and suppressed in print. Core content is server-rendered HTML.

## 9. Acceptance evidence

Order 8 records dependency-free semantic HTML/CSS studies, five default pages, a cross-page state board, desktop and compact captures, forced reduced-motion captures, structural parsing, duplicate-ID and local-reference checks, persistent-label/form checks, section-ID coverage, semantic-color discipline, and external/operational-boundary inspection.

Rendered screenshots establish visible geometry only. They do not prove professional Amharic meaning, human comprehension, screen-reader/browser output, touch/dialer behavior, clipboard behavior, on-site wayfinding, search relevance, vacancy lifecycle integration, cross-browser/device compatibility, 200%/400% complete-page reflow, low-end performance, stakeholder approval, or publication readiness.
