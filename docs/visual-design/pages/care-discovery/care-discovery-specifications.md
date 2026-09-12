# Order 7 Care-Discovery Visual Specifications

**Prepared:** 12 September 2026  
**Status:** Complete for non-public responsive design review; not production or publication approval  
**Pages:** Doctor Directory, Doctor Profile, Services Directory, Service Detail  
**Foundation:** [Order 4 prototype foundations](../../foundations/README.md)  
**Components:** [Order 5 component system](../../components/README.md)  
**Composition source:** [Order 6 critical journeys](../critical-journeys/README.md)

## 1. Composition contract

The studies preserve `D0`–`D6`, `P0`–`P7`, `S0`–`S7`, and `V0`–`V9`. Desktop columns never change DOM, keyboard, heading, screen-reader, print, or compact reading order. The Order 7 stylesheet imports the Order 6 composition layer and introduces no primitive, semantic color, component state, or safety variant.

Every study:

- carries a persistent non-public prototype statement;
- uses only fictional controlled records and local outline geometry;
- makes roster, taxonomy, identity, portrait, scope, claim, relationship, schedule, availability, contact, review, and translation gates explicit;
- keeps Emergency, urgent guidance, error, offline, unavailable, expired, and unknown states at Motion Level 0;
- leaves search, filters, call, map, provider, and submission operations inert or local-design navigation only;
- keeps server-rendered HTML and normal links as the baseline;
- maintains inherited 44 px targets, visible focus, semantic fields, and wrapping behavior;
- uses no external resource, font, image, script, tracker, storage, or personal-data collection.

## 2. Doctor Directory section design

| ID | Polished composition | Responsive and state behavior | Traceability and gates |
| --- | --- | --- | --- |
| `D0` | Shared shell marks Doctors current; language and Emergency remain separate. | Wide task nav collapses below 64 rem; no-JS task links remain. | `G-001`–`G-006`, `S-006`–`S-008`; identity, labels, contact, and language approval. |
| `D1` | Reading-led intro pairs scope/actions with a wayfinding-edged uncertainty note. | Two columns wide, one below 54 rem; actions wrap/stack compact. | `D-002`, `V-001`, `C-001`, `G-010`; approved scope and staffed routing. |
| `D2` | Persistent-label search precedes one controlled specialty group and active chip. | Wide sticky rail precedes results in DOM; compact button reveals native controls. | `D-002`, `H-005`, `G-005`, `G-011`; name/specialty only until independent filter approval. |
| `D3` | Result count and active state form a quiet toolbar before cards. | Wraps without truncation; committed actions announce politely in production. | `D-002`, `G-010`–`G-011`; English/Amharic count grammar. |
| `D4` | Two-column wide collection demonstrates neutral portrait, long name, and no-image variants. | One column compact; no more than three wide in production; true pagination links. | `D-001`, `D-003`–`D-004`, `D-006`, `G-013`–`G-015`; roster, identity, URL, rights, and review approval. |
| `D5` | State board replaces only results with no-match, failure, offline, or roster-unavailable recovery. | Search/filter context remains; no stale roster is presented as current. | `D-002`, `G-007`, `G-011`, `V-001`, `C-001`; retry/cache/contact policy. |
| `D6` | Full-width uncertainty band leads to Services and inert staffed support. | Quiet horizontal band wide; source-ordered stack compact. | `G-001`, `D-002`, `V-001`, `C-001`; canonical phone purpose/hours. |

## 3. Doctor Profile section design

| ID | Polished composition | Responsive and state behavior | Traceability and gates |
| --- | --- | --- | --- |
| `P0` | Shared detail shell and wrapping Doctors breadcrumb. | Compact menu and breadcrumb wrap; current record stays text. | `G-001`, `G-005`, `G-010`, `G-013`, `S-006`–`S-008`; canonical name/slug and language route. |
| `P1` | Text identity and request action precede neutral portrait. | Balanced pair wide, text first and portrait second compact; state board shows no-image variant. | `D-001`, `D-003`–`D-004`, `D-006`, `A-001`, `C-001`; complete current identity and portrait policy. |
| `P2` | Plain reading-width list demonstrates governed areas of care. | One measure; optional interests disappear without empty heading. | `D-004`, `G-014`–`G-015`; clinical owner, source, wording, and review. |
| `P3` | Biography and optional professional subsections remain editorial, not promotional tiles. | Each optional subsection disappears independently; long terms wrap. | `D-004`, `G-014`–`G-015`; no inferred biography, language, affiliation, gender, or qualification. |
| `P4` | Wayfinding-edged request rail explains request-versus-booking and controlled public ID. | Rail follows main identity/content in DOM and returns in flow at constrained width. | `D-004`–`D-005`, `A-001`–`A-003`, `C-001`; schedule absent, route and staffed fallback gated. |
| `P5` | Governed related-service cards state bidirectional publication boundary. | Up to three wide, one compact; entire section omitted when empty. | `V-001`, `V-005`, `D-004`; both endpoints, names, URLs, and relationship approval. |
| `P6` | Quiet review metadata says the fixture is not medically reviewed. | Wraps at reading width; expired/unapproved state moves to unavailable pattern. | `G-014`, `D-004`; truthful reviewer label/date/source/owner/interval. |
| `P7` | Support band preserves Doctors, Services, staffed, and global exits. | One-dimensional compact; no dead end on unavailable record. | `G-001`, `D-002`, `V-001`, `C-001`; unavailable copy and staffed contact. |

## 4. Services Directory section design

| ID | Polished composition | Responsive and state behavior | Traceability and gates |
| --- | --- | --- | --- |
| `S0` | Shared shell marks Services current. | Same shell continuity and no-JS baseline as Doctors. | `G-001`–`G-006`, `S-006`–`S-008`; identity, label, language, and contact approval. |
| `S1` | Intro explicitly frames recognition/navigation and provides Not sure routing. | Scope and privacy note pair wide, stack compact. | `V-001`, `A-001`–`A-003`, `C-001`, `G-010`; approved patient language and routing semantics. |
| `S2` | Full-width static emergency specimen precedes search. | Always in flow and Level 0; omitted only under an approved not-applicable decision. | `H-005`, `E-001`–`E-003`, `V-002`; exact clinical exception, route, and Amharic safety review. |
| `S3` | Search plus one controlled patient taxonomy; no competing Departments UI. | Wide group rail precedes results; compact reveal uses native radio controls. | `V-001`, `H-005`, `G-005`, `G-011`; groups/names/synonyms/slugs/translations. |
| `S4` | Count and active group immediately precede collections. | Wraps and supports committed-action announcement. | `V-001`, `G-010`–`G-011`; approved count grammar. |
| `S5` | Two controlled group headings contain concise service cards and pagination. | Two cards wide, one compact; groups and optional summaries collapse cleanly. | `V-001`–`V-004`, `G-013`–`G-015`; launch subset, taxonomy, claims ledger, canonical URLs. |
| `S6` | State board provides no-match, failure/offline, and taxonomy-unavailable recovery. | Results only are replaced; no diagnosis or nearby-care guess. | `V-001`, `G-007`, `G-011`, `A-003`, `C-001`; safe recovery/contact policy. |
| `S7` | Support band offers Not sure request, Doctors, and staffed contact. | Source-ordered single column compact. | `G-001`, `V-001`, `D-001`–`D-003`, `A-001`–`A-003`, `C-001`; routing/contact approval. |

## 5. Service Detail section design

| ID | Polished composition | Responsive and state behavior | Traceability and gates |
| --- | --- | --- | --- |
| `V0` | Shared detail shell and Services breadcrumb. | Breadcrumb and shell labels wrap without truncation. | `G-001`, `G-005`, `G-010`, `G-013`, `S-006`–`S-008`; canonical name/slug/translation. |
| `V1` | Plain-language identity, controlled scope, request action, and public service-key specimen. | Identity/action before supporting card at every reading order. | `V-001`–`V-003`, `A-001`–`A-003`, `C-001`; required scope, request route, and staffed contact. |
| `V2` | Static urgent-exception specimen follows identity and precedes ordinary detail. | Full width, non-dismissible, no expressive motion. | `V-002`, `E-001`–`E-003`, `S-006`; applicability, wording, route, and professional translation. |
| `V3` | Reading-width recognition content uses plain prose/list. | Long approved terms wrap; no diagnostic interaction. | `V-002`, `V-004`, `G-014`–`G-015`; needs/conditions, owner, source, date. |
| `V4` | Sparse capability list avoids marketing tiles and flags claim-ledger boundary. | Two columns only when readable; one compact; withheld claim disappears. | `V-002`–`V-004`, `G-014`–`G-015`; scope/eligibility/capability/executive approval. |
| `V5` | Doctor cards demonstrate current bidirectional relationships and no-image handling. | Up to three wide, one compact; none means no section. | `V-005`, `D-001`–`D-004`; current roster and relationship integrity. |
| `V6` | Support rail summarizes practical needs; full source-ordered content and text-before-map rule remain in flow. | Rail collapses before cramped text; optional map reserves no critical dependency. | `V-002`, `V-005`, `C-001`–`C-003`, `G-015`; location/hours/preparation/referral/documents/directions/provider flow. |
| `V7` | Reading-width process explanation repeats request and staffed fallback after substantial content. | Actions stack compact; no booking, schedule, or response promise. | `V-002`, `A-001`–`A-003`, `C-001`; operating process and fallback approval. |
| `V8` | Quiet metadata states no medical/operational review exists. | Expired required data routes to unavailable state. | `G-014`, `V-002`–`V-004`; reviewer/date/source/owner/interval. |
| `V9` | Support band preserves Services, Doctors, staffed, and Emergency exits. | Wide horizontal grouping becomes one-dimensional compact. | `G-001`, `V-001`, `D-001`–`D-003`, `C-001`; unavailable/retired recovery and contact. |

## 6. State model

| State | Visual and behavioral rule |
| --- | --- |
| Initial / searched / filtered | Submitted public context remains visible and reproducible by URL. Result count updates after committed actions, not each keystroke. |
| Loading | Only after a real asynchronous boundary and roughly 300 ms; prior context stays, geometry is reserved, and a server-rendered link baseline remains. |
| No match | Repeat safe context, suggest spelling/reset, and provide Services/Doctors/Not sure/staffed exits without diagnosis. |
| Failure / offline | State scope and recovery explicitly. Never display an ungoverned cached roster, clinical claim, schedule, or operational fact as current. |
| Empty roster / taxonomy | Do not publish an empty directory. Use an honest unavailable route with approved broader discovery and staffed alternatives. |
| Missing portrait | Use approved neutral geometry or no image; reserve no blank gap and infer no gender, identity, specialty, or availability. |
| Partial optional content | Omit portrait, credential, biography subsection, interest, summary, relationship, location enhancement, or map independently. Required completeness remains a route gate. |
| Withheld claim | Omit completely. If it defines core service identity, unpublish the record instead of generalizing. |
| Appointment route failure | Preserve governed profile/service information and distinguish request failure from care/service availability. Offer approved staffed/discovery routes. |
| Retired / expired record | Redirect only to an approved true successor; otherwise honest unavailable/404/410 treatment with broad exits. No silent clinician/service substitution. |
| No JavaScript / images / fonts / map | GET search, submitted native filters, result cards, pagination, identity, scope, links, review metadata, and text directions remain usable. |

## 7. Canonical URL and relationship contract

```text
Doctor directory → Doctor profile → /appointments/?doctor={public-canonical-id}
Services directory → Service detail → /appointments/?service={public-canonical-id}

Doctor profile ↔ one governed relationship record ↔ Service detail
```

- Directory URLs may contain public query, approved filter/group, sort if later approved, and page only.
- Appointment handoffs contain one governed public record key. They never contain symptoms, notes, visitor identity/contact, a schedule, or free-text clinician/service labels.
- The appointment form resolves the approved display record from the key and lets the visitor switch to Doctor, Service, or Not sure.
- A retired endpoint produces a truthful choice and does not silently substitute another record.
- Each relationship test requires both published canonical endpoints and identical active relationship state in both directions.

## 8. Accessibility, bilingual, motion, privacy, and performance

- Search fields have persistent labels and safety hints. Filters use native controls; active chips include textual remove names; count/status follows committed action.
- Filter rail precedes results in DOM order. Compact reveal returns focus to its trigger when closed in the Order 10 implementation; Escape never clears a query.
- Whole-card primary links remain semantically named; supporting actions sit above the overlay layer. Cards do not rely on hover, portrait, or color for meaning.
- Every target inherits the 44 px minimum. Long names, specialties, clinical terms, Amharic, and 35% expansion wrap without fixed height.
- Emergency, urgent, error, offline, unavailable, expired, privacy, and state transitions are Level 0. Ordinary hover/focus feedback stays within inherited state tokens and is removed under reduced motion.
- Search/URL values remain public navigation context. Analytics, third-party autocomplete, external media, maps, fonts, and providers are absent pending privacy/security approval.
- Core identity and content are server-rendered. Optional media is sized or omitted; no image or map can delay the task or cause layout shift.

## 9. Acceptance evidence

Order 7 records semantic dependency-free HTML/CSS studies, desktop and compact captures, a forced reduced-motion state capture, structural parsing, duplicate-ID and local-reference checks, form-label checks, section coverage, semantic color discipline, and external/operational boundary inspection.

Rendered screenshots evidence visible geometry only. They do not prove human comprehension, clinical correctness, assistive-technology output, touch ergonomics, cross-browser/device compatibility, bilingual quality, 200%/400% complete-page reflow, low-end performance, or publication readiness.
