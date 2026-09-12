# Order 8 — Polished Practical-Access and Institutional Designs

**Prepared:** 12 September 2026  
**Status:** Complete for non-public responsive design review; implementation and performed human/device validation remain open  
**Pages:** Patient & Visitor Information, Locations & Contact, Search Results, About the Hospital, Careers (Phase 2)  
**Direction:** Calm Wayfinding, using the fixed Order 4 foundations, Order 5 components, and Order 6–7 composition layers

## Outcome

Order 8 turns the accepted `PI0`–`PI7`, `LC0`–`LC7`, `SR0`–`SR7`, `AB0`–`AB9`, and `CR0`–`CR8` wireframes into polished mobile-first page compositions. Default pages use controlled content and a separate state board demonstrates mutually exclusive urgent-term, unavailable-guide, contact-data, search-recovery, institutional-evidence, vacancy-lifecycle, provider, and translation states.

No study content is approved patient guidance, a real contact/location fact, a search policy or index, an institutional claim, a leadership/relationship record, a rights-cleared image, a vacancy, a recruitment policy, or an approved translation. The package is safe for non-public design review only.

## Artifacts

| Artifact | Purpose |
| --- | --- |
| [Visual specifications](practical-institutional-specifications.md) | Section composition, responsive behavior, states, motion, bilingual, privacy, safety, performance, traceability, gates, and acceptance. |
| [Patient & Visitor Information](patient-information.html) | `PI0`–`PI5` and `PI7`: staged visit journey, maintained-topic boundary, access/rights routes, and staffed fallback. |
| [Locations & Contact](locations-contact.html) | `LC0`–`LC7`: purpose-labeled calls, text-first entrance/directions, purpose hours, temporary status, optional map, and non-urgent channel. |
| [Search Results](search-results.html) | `SR0`–`SR1`, `SR3`–`SR5`, and `SR7`: bounded GET search, approved public types, canonical results, pagination, privacy hint, and support. |
| [About the Hospital](about.html) | `AB0`–`AB9`: evidence-led story, mission/value boundary, modest facts, leadership, relationships, imagery rights, currency, and care exits. |
| [Careers](careers.html) | `CR0`–`CR4` and `CR7`–`CR8`: complete controlled role, privacy-before-Apply, Phase 2 lifecycle boundary, support, and review metadata. |
| [Cross-page state board](practical-institutional-states.html) | `PI6`, `SR2`, `SR6`, `CR5`, `CR6`, and applicable contact, institutional, offline, provider, expiry, and translation states. |
| [Composition CSS](practical-institutional.css) | Order 8 layouts importing the Order 7 source, which inherits Orders 4–6. |
| [Local study behavior](study.js) | Contained menu/filter reveal and inert-action announcements; no storage, request, logging, call, map, clipboard, submission, or provider load. |
| [Rendered evidence](evidence/) | Desktop, compact, and reduced-motion screenshots plus structural validation notes. |

## Binding decisions

- Accepted section IDs and source order are unchanged. Mutually exclusive states live on the state board rather than alongside valid defaults.
- The patient journey preserves Before → During → After at every width. Only approved useful topics/stages render; no empty guide, generic advice, or “coming soon” shell appears.
- Contact rows are not fully clickable. Purpose, visible number, hours, and qualifiers derive from one canonical approved record; exact entrance and directions remain complete without a map.
- Search is navigational, GET-shaped, bounded, and privacy warned. Urgent-term guidance is governed, static, before ordinary results, and never a diagnostic conclusion.
- Typed Search fixtures do not reinterpret Order 7 controlled doctor/service records as approved indexed content.
- About uses a vertical evidence timeline, modest fact treatments, text-first people/relationships, and abstract CSS-only imagery studies. It does not promote unresolved institutional claims.
- Careers stays Phase 2. A complete role and recruitment privacy boundary precede Apply in DOM order; every application/provider action is inert, and stale/closed states remove Apply.
- All emergency, urgent, temporary-status, error, offline, unavailable, expired, privacy, closed, and provider-failure states are static Motion Level 0.
- No external resource, live contact, query backend, analytics, map, clipboard write, email, vacancy feed, upload, application, provider, or personal-data flow exists in these studies.

## Review sequence

1. Read the [visual specifications](practical-institutional-specifications.md) and confirm section/state coverage.
2. Review the Patient Information stage order, omitted-empty behavior, access/rights routes, and staffed fallback.
3. Review Locations for purpose separation, explicit call targets, text-before-map order, temporary status, and failure independence.
4. Review Search for bounded query scope, filter-before-results DOM order, typed canonical results, urgent-term boundary, and recovery.
5. Review About for evidence hierarchy, non-promotional fact treatment, optional media/relationships, and care exits.
6. Review Careers for complete role data, privacy-before-Apply order, Phase 2 labeling, lifecycle removal, and no speculative collection.
7. Compare desktop, compact, and reduced-motion [evidence](evidence/) for source order, wrapping, target sizing, clipping, and state geometry.

## Evidence limits

Local structural checks and the Order 8 captures establish code structure and visible layout at their named viewports. The later [Order 9 refinement](../responsive/README.md) performed complete-page Chromium geometry checks for bilingual stress fixtures and 200%/400% CSS-pixel reflow equivalents. Neither order establishes screen-reader output, Windows High Contrast support, real touch/dialer/clipboard behavior, on-site arrival accuracy, search relevance, vacancy/provider integration, cross-browser parity, professional Amharic meaning, low-end-device performance, stakeholder approval, or publication readiness.

## Completion record

- [x] `PI0`–`PI7`, `LC0`–`LC7`, `SR0`–`SR7`, `AB0`–`AB9`, and `CR0`–`CR8` appear across default pages and mutually exclusive state evidence.
- [x] All five pages have complete desktop and compact compositions using inherited semantic tokens only.
- [x] Visit stages, contact purposes, address/entrance, purpose hours, text directions, optional map, and non-urgent channel boundaries are designed.
- [x] Search includes privacy-safe scope, GET-shaped URL continuity, typed results, approved filters, pagination, urgent guidance, correction, zero, failure, offline, and unavailable states.
- [x] Institutional storytelling, evidence-dated milestones/facts, current leadership, explained relationships, imagery rights, and review metadata remain controlled or gated.
- [x] Careers includes complete-role anatomy, privacy-before-Apply, no-current-role, closed/filled/withdrawn, stale, provider-failure, handling-unapproved, and language states without data collection.
- [x] Evidence and known validation limits are recorded without claiming unperformed human, clinical, operational, bilingual, device, or integration testing.

## Order 9 completion

The [Order 9 package](../responsive/README.md) used Orders 4–8 to test and refine the complete page system at 320 px, 360 px, representative tablet, 1280 px, 1440 px, and 200%/400% CSS-pixel reflow equivalents. English, Amharic-geometry, mixed-script, long-content, and unavailable-translation fixtures now cover all pages and state boards without converting controlled content into approved truth.
