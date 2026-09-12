# Order 7 — Polished Care-Discovery Designs

**Prepared:** 12 September 2026  
**Status:** Complete for non-public responsive design review; implementation and performed human/device validation remain open  
**Pages:** Doctor Directory, Doctor Profile, Services Directory, Service Detail  
**Direction:** Calm Wayfinding, using the fixed Order 4 foundations, Order 5 components, and Order 6 composition layer

## Outcome

Order 7 turns the accepted `D0`–`D6`, `P0`–`P7`, `S0`–`S7`, and `V0`–`V9` wireframes into polished mobile-first page compositions. The default pages use controlled records and a separate state board demonstrates mutually exclusive search, filter, no-match, failure, offline, unavailable-record, missing-portrait, relationship, optional-map, and appointment-handoff presentations.

No study record is a hospital roster, service taxonomy, clinical claim, contact, schedule, availability statement, or approved translation. The package is safe for non-public design review only.

## Artifacts

| Artifact | Purpose |
| --- | --- |
| [Care-discovery visual specifications](care-discovery-specifications.md) | Section composition, responsive behavior, states, motion, bilingual, privacy, performance, traceability, gates, and acceptance. |
| [Doctor Directory design](doctor-directory.html) | `D0`–`D4` and `D6`: GET-shaped search, approved-filter rail/disclosure, active state, cards, pagination, and support. |
| [Doctor Profile design](doctor-profile.html) | `P0`–`P7`: canonical identity, missing-media-safe composition, governed content/relationships, schedule boundary, review metadata, and doctor-ID handoff. |
| [Services Directory design](services-directory.html) | `S0`–`S5` and `S7`: governed urgent exception, privacy-safe search, one taxonomy, grouped results, pagination, and uncertainty routes. |
| [Service Detail design](service-detail.html) | `V0`–`V9`: controlled scope, urgent boundary, verified-capability pattern, governed clinicians, practical guidance, request process, and service-ID handoff. |
| [Care-discovery state board](care-discovery-states.html) | `D5`, `S6`, missing portrait, unavailable/retired records, failure/offline, withheld claims, absent relationships, request/map failures, and handoff continuity. |
| [Care-discovery CSS](care-discovery.css) | Directory/detail/state compositions importing the Order 6 source, which inherits Orders 4–5. |
| [Local study behavior](study.js) | Contained mobile menu, compact filter reveal, and inert-action announcements; no persistence, request, telemetry, call, submission, or provider load. |
| [Rendered evidence](evidence/) | Desktop, compact, and reduced-motion screenshots plus structural validation notes. |

## Binding decisions

- The accepted section IDs and source orders are unchanged. `D5` and `S6` are mutually exclusive result-region states and therefore appear on the state board rather than beside valid default results.
- Directory search uses a submitted GET-shaped baseline. Query, approved group/specialty, and page are the only demonstrated URL state; personal/clinical text is explicitly discouraged and no analytics runs.
- Wide filter rails precede results in DOM order and collapse before either column becomes cramped. The compact reveal retains semantic native controls and focus return behavior for Order 10 implementation.
- Doctor cards use one canonical profile destination. Neutral geometry and no-image variants do not infer identity, gender, availability, or schedule.
- Service cards use one patient-facing taxonomy and approved public vocabulary only. Candidate legacy departments, synonyms, and counts are not promoted into public truth.
- Detail pages keep identity/scope before optional media and supporting rails. Desktop columns are visual enhancement only; the compact reading order remains meaningful.
- Schedule and live availability are absent everywhere. Appointment actions mean request, carry one governed public record key, and never imply booking.
- Doctor–service relationships require published canonical endpoints and the same approved relationship at both ends. Empty or retired relationships are omitted without a heading.
- Urgent guidance is static, non-dismissible, Level 0, and before ordinary search/detail when clinically required. Search never performs triage.
- Required identity, scope, safety, operational route, or review gaps block/unpublish a record. Optional data and high-consequence claims disappear without filler.
- No live contact, map, search backend, roster, taxonomy, request submission, analytics, font, portrait, media, or third-party request exists in these studies.

## Review sequence

1. Read the [visual specifications](care-discovery-specifications.md) and confirm section/state coverage.
2. Review the two directories for task scope, URL-shaped search, filter-to-result order, card hierarchy, pagination, and safe uncertainty/recovery routes.
3. Review the two detail pages for canonical identity, required versus optional content, schedule/claim withholding, review currency, and action truthfulness.
4. Compare the relationship from [Doctor Profile](doctor-profile.html) to [Service Detail](service-detail.html), then back, without treating the fixture as approved.
5. Follow both controlled appointment links into the Order 6 form and confirm only the public fixture key enters the URL.
6. Review the [state board](care-discovery-states.html) for no-match, failure/offline, missing portrait, unavailable records, absent relationships, map failure, and request failure.
7. Compare wide, compact, and reduced-motion [evidence](evidence/) for wrapping, source order, target sizing, state geometry, and visible clipping.

## Evidence limits

The Order 7 structural checks and Chromium captures establish code structure and visible layout at their named viewports. The later [Order 9 refinement](../responsive/README.md) performed complete-page Chromium geometry checks for bilingual stress fixtures and 200%/400% CSS-pixel reflow equivalents. Neither order establishes screen-reader output, Windows High Contrast support, real touch behavior, cross-browser parity, professional Amharic meaning, clinical comprehension, low-end-device performance, hospital approval, or publication readiness.

## Completion record

- [x] `D0`–`D6`, `P0`–`P7`, `S0`–`S7`, and `V0`–`V9` are represented across default pages and mutually exclusive state evidence.
- [x] All four pages have complete desktop and compact compositions using inherited semantic tokens only.
- [x] Search, approved filter/group, active state, URL-shaped pagination, no-match, failure, offline, empty/unavailable, and no-JavaScript expectations are designed.
- [x] Missing-portrait and no-image variants preserve identity hierarchy without inference or layout gaps.
- [x] Doctor/service relationships are bidirectional fixtures with omitted-empty and retired-endpoint behavior.
- [x] Doctor and service appointment links carry stable controlled public IDs only; no PII or clinical query data is added.
- [x] Schedule, availability, unapproved capability, contact, taxonomy, roster, and response claims remain absent or visibly gated.
- [x] Evidence and known validation limits are recorded without claiming unperformed testing.

## Order 8 handoff

Use the Order 4 foundations, Order 5 components, Order 6 composition layer, and this package to design Patient & Visitor Information, Locations & Contact, Search Results, About the Hospital, and Phase 2 Careers section by section. Preserve controlled-content rules and accepted IDs. Keep contacts, practical guidance, directions, claims, relationships, imagery rights, vacancies, candidate-data handling, and third-party flows visibly gated. Do not reinterpret care-discovery controlled records as approved input to Search or institutional storytelling.
