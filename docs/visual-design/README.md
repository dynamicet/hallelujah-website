# Visual Design Workspace

**Status:** Orders 1–12 complete for non-public blueprint and implementation handoff  
**Scope:** Non-public visual design and prototype artifacts only  
**Primary guardrail:** Unresolved hospital facts, brand assets, clinical or operational behavior, personal-data collection, and third-party integrations remain visibly gated.

## Purpose

This directory is the working index for visual-design Orders 1–12. It sits downstream of the requirements, sitemap, page specifications, design-system contracts, wireframes, benchmark dispositions, content sources, and stakeholder validation register. It does not replace any of them.

The [independent visual and UX assessment dated 31 October 2026](independent-design-assessment-2026-10-31.md) consolidates the running-site review into a prioritized fix checklist with screenshot evidence and acceptance criteria. Its recommendations remain open and do not supersede hospital approvals or authorize public release.

## Source priority

Use sources in this order when visual artifacts disagree:

1. A dated decision from a named accountable hospital owner
2. The requirements matrix and formal validation register
3. Page specifications, design-system contracts, and section-level wireframes
4. Structured content records and their verification queue
5. The design concept
6. Benchmark research, interpreted only through the local disposition register

Existing public-site content and benchmark screenshots are evidence, not approval or reusable production assets.

## Artifact register

| Order | Artifact | Status | Next dependency |
| ---: | --- | --- | --- |
| 1 | [Design audit and workspace preparation](order-1-design-audit.md) | Complete at document-review level | Begin Order 2 from the accepted inventory and gates |
| 2 | [Benchmark translation and visual direction](direction/README.md) | Complete at document-review and rendered-study level | Direction A — Calm Wayfinding recommended |
| 3 | [Expressive motion/storytelling layer and critical-experience storyboards](motion/README.md) | Complete at document-review and interactive-study level | Restrained Calm Wayfinding motion direction selected |
| 4 | [Final prototype foundations and tokens](foundations/README.md) | Complete at document-review and rendered-study level | Shared value source consumed by Order 5 |
| 5 | [Polished responsive component system](components/README.md) | Complete for non-public prototype use | Consumed by Order 6 |
| 6 | [Polished Home, Emergency, and Appointment designs](pages/critical-journeys/README.md) | Complete for non-public responsive design review | Consumed by Order 7 |
| 7 | [Polished doctor and service discovery designs](pages/care-discovery/README.md) | Complete for non-public responsive design review | Consumed by Order 8 |
| 8 | [Polished practical-access and institutional designs](pages/practical-institutional/README.md) | Complete for non-public responsive design review | Consumed by Order 9 |
| 9 | [Responsive and bilingual refinement](pages/responsive/README.md) | Complete for non-public prototype review | Begin Order 10 from the refined page set |
| 10 | [Connected interactive prototype](prototype/README.md) | Complete for non-public browser review | Consumed by Order 11 |
| 11 | [Design and motion QA](qa/README.md) | Complete for performed non-public prototype QA | Consumed by Order 12 |
| 12 | [Documentation and developer handoff](handoff/README.md) | Complete for implementation planning and formal stakeholder review | Close applicable gates, then create the prioritized implementation backlog |

## Working conventions

### Artifact identity

Name visual frames and exports using:

```text
{page}-{section-or-state}-{viewport}-{language}-{motion}
```

Examples:

```text
home-H1-360-en-standard
emergency-E1-320-am-reduced
appointment-validation-1280-en-standard
doctor-directory-no-results-400-reflow-en-standard
```

Use the existing wireframe section IDs unchanged. Add a new ID only through coordinated source-document change control.

### Required frame variables

Every applicable page/component study must record:

- viewport: 320, 360, representative tablet, 1280, 1440, 200% reflow, or 400% reflow;
- language fixture: English, Amharic, mixed-script, long content, or unavailable translation;
- state: default, hover, focus, pressed, disabled, loading, validation, error, empty, offline, unavailable/expired, success, no JavaScript, or failed dependency as applicable;
- motion: standard or reduced;
- content status: approved, source candidate, controlled placeholder, omitted, or blocked;
- linked page/section, requirements, decision IDs, and evidence location.

### Prototype labeling

All unapproved visual work must carry a persistent, non-dismissable label equivalent to:

> Non-public prototype — content, contacts, brand, and operations may be placeholders and are not hospital-approved.

Do not rely on file names, canvas notes, or color alone to communicate this status.

### Evidence folders for later orders

Create folders only when an artifact exists. Use this planned structure:

```text
visual-design/
├── README.md
├── order-1-design-audit.md
├── direction/       # Order 2 studies and decision record
├── motion/          # Order 3 tokens and storyboards
├── foundations/     # Order 4 tokens and specimens
├── components/      # Order 5 responsive/state studies
├── pages/           # Orders 6–9 page and section studies
├── prototype/       # Order 10 references and interaction notes
├── qa/              # Order 11 methods, findings, fixes, evidence
└── handoff/          # Order 12 implementation package
```

## Change control

- Preserve the accepted information architecture and section order unless a documented usability/accessibility finding requires a coordinated change.
- A visual treatment cannot activate a gated route, claim, relationship, contact, form, map, or third party.
- Changed behavior must be propagated through the validation decision, requirement, page specification, component/layout contract, wireframe/flow, visual artifact, and acceptance evidence.
- Visual preference does not overrule emergency clarity, accessibility, privacy, clinical accuracy, truthful state language, or low-bandwidth operation.

## Order 2 decision

Order 2 is complete for non-public prototype work. [Direction A — Calm Wayfinding](direction/visual-directions.md#3-direction-a--calm-wayfinding-recommended) is the recommended working direction for Orders 3–4. Its teal/mineral/ochre palette, unified Noto candidate typography, restrained outline/icon geometry, text-first imagery policy, and wayfinding character remain provisional under `BRAND-01`.

The [benchmark matrix](direction/benchmark-inspiration-matrix.md), [three-direction decision record](direction/visual-directions.md), [rendered studies](direction/studies.html), and [capture evidence](direction/evidence/) were the Order 3 inputs.

## Order 3 decision

Order 3 is complete as truthful evidence of the restrained non-public prototype. The [motion and storytelling package](motion/README.md) originally established three intensity levels with Level 2 as its maximum. The client-directed [High-End Motion and Interactive-Media Amendment](motion/high-end-motion-and-interactive-media-amendment.md) now governs production planning: selected Home, About, Patient Information, arrival, and institutional-story sections may use authored Levels 3–4, including static-first user-controlled media. Emergency and urgent, consequential appointment, error, privacy, unavailable, and expired content remain stable Level 0/1 contexts.

The original signature rule remains available, but production expression is no longer limited to it. High-end design comes from choreography and restraint: content remains visible before enhancement, route changes never wait for an exit animation, user-controlled media starts from a complete poster, and reduced motion preserves focus, status, and meaning. A scoped motion runtime may be evaluated only through the amendment's license, bundle, cleanup, fallback, and measured-performance gate.

The [critical-experience storyboards](motion/storyboards.md) and [interactive study](motion/studies.html) were consumed by Order 4 when reconciling the candidate palette, typography, spacing, shape, imagery, icon, and motion values. `B01-002` subsequently approved the [project brand foundation](../brand/README.md); content/language approvals, binary asset intake, performed production accessibility/device validation, and every affected release gate remain open.

## Order 4 decision

Order 4 is complete for non-public prototype work. The [foundation package](foundations/README.md) promotes Calm Wayfinding into one three-layer token source covering color, typography, spacing, sizing, layout, shape, elevation, icons, imagery, focus, motion, reduced motion, constrained layouts, and print. The [CSS source](foundations/tokens.css), [portable manifest](foundations/tokens.json), [foundation specification](foundations/prototype-foundations.md), [rendered study](foundations/studies.html), and [evidence](foundations/evidence/) are the Order 5 inputs.

The values are stable enough to prevent drift across the component and page orders. They remain prototype decisions: the text-only identity, no-remote-font fallback, abstract media placeholders, visible non-public label, inert operational actions, Level 0 safety exclusions, and all formal hospital approval/release gates continue to apply.

## Order 5 decision

Order 5 is complete for non-public prototype composition. The [component package](components/README.md) specializes the Order 4 foundations into responsive shell, navigation, action, language, discovery, governed-record, form, feedback, disclosure, review-metadata, and optional-map components. The [component CSS](components/component-tokens.css) imports the foundation source rather than redefining it; the [portable manifest](components/component-tokens.json), [detailed specifications](components/component-specifications.md), [rendered study](components/studies.html), and [evidence](components/evidence/) carry the system into Order 6.

Default, hover, focus, pressed, disabled, loading, validation/error, empty, unavailable, offline, and authoritative-success behavior is explicit where applicable. Emergency and every urgent/error/privacy/unavailable/expired/unknown-outcome state remain Level 0. All actions and records in the study are inert controlled placeholders; no hospital fact, contact, submission, map, query flow, recruitment route, third party, or approval is activated or inferred.

## Order 6 decision

Order 6 is complete for non-public responsive design review. The [critical-journey package](pages/critical-journeys/README.md) composes the Order 4 foundation and Order 5 component sources into complete Home, Emergency, and Request an Appointment designs while preserving `H0`–`H9`, `E0`–`E8`, and `A0`–`A8`.

The [section-level specifications](pages/critical-journeys/critical-journey-specifications.md), complete [Home](pages/critical-journeys/home.html), [Emergency](pages/critical-journeys/emergency.html), and [Appointment](pages/critical-journeys/appointment.html) studies, [appointment state board](pages/critical-journeys/appointment-states.html), page composition source, and [rendered evidence](pages/critical-journeys/evidence/) are the Order 7 inputs. Home keeps care access before storytelling; Emergency remains entirely Level 0 with explicit inert call choices and text-first arrival; Appointment remains a one-column request rather than a booking and includes truthful validation, pending, duplicate, failure, offline, unknown-outcome, authoritative-receipt, delivery-warning, and unavailable states.

All service/doctor/contact/safety/arrival/trust/form/privacy/response/translation content remains controlled, omitted, or visibly gated. No live contact, search, map, personal-data submission, external dependency, operational workflow, or hospital approval was introduced. Order 9 now provides performed Chromium geometry checks for bilingual stress fixtures and 200%/400% CSS-pixel reflow equivalents; screen-reader, forced-color, touch/dialer, low-end-device, professional language, and human validation remain Order 11 and formal stakeholder work.

## Order 7 decision

Order 7 is complete for non-public responsive design review. The [care-discovery package](pages/care-discovery/README.md) composes Doctor Directory, Doctor Profile, Services Directory, and Service Detail while preserving `D0`–`D6`, `P0`–`P7`, `S0`–`S7`, and `V0`–`V9` across the default pages and mutually exclusive state evidence.

The [section-level specifications](pages/care-discovery/care-discovery-specifications.md), four complete page studies, [state board](pages/care-discovery/care-discovery-states.html), composition source, and [rendered evidence](pages/care-discovery/evidence/) are the Order 8 inputs. Directories use GET-shaped search, approved-filter/taxonomy controls, active-state feedback, stable pagination, and safe recovery. Detail pages keep identity/scope before optional media, omit schedules and availability, govern bidirectional relationships, and pass only controlled public IDs into the appointment route.

All roster, taxonomy, identity, specialty, portrait, clinical scope, capability, relationship, location, contact, schedule, availability, review, translation, and response data remains controlled, absent, or gated. No search backend, roster, map, analytics, external resource, personal-data collection, or live hospital operation was introduced. Order 9 now provides performed Chromium geometry checks for bilingual stress fixtures and 200%/400% CSS-pixel reflow equivalents; screen-reader, cross-browser, forced-color, touch, low-end-device, professional language, and human/clinical comprehension validation remain Order 11 and formal stakeholder work.

## Order 8 decision

Order 8 is complete for non-public responsive design review. The [practical-access and institutional package](pages/practical-institutional/README.md) composes Patient & Visitor Information, Locations & Contact, Search Results, About the Hospital, and Careers (Phase 2) while preserving `PI0`–`PI7`, `LC0`–`LC7`, `SR0`–`SR7`, `AB0`–`AB9`, and `CR0`–`CR8` across default pages and mutually exclusive state evidence.

The [section-level specifications](pages/practical-institutional/practical-institutional-specifications.md), five complete page studies, [cross-page state board](pages/practical-institutional/practical-institutional-states.html), composition source, and [rendered evidence](pages/practical-institutional/evidence/) are the Order 9 inputs. Patient guidance follows Before → During → After; Locations keeps purpose-labeled calls and complete text directions ahead of an optional map; Search stays navigational and privacy bounded; About uses evidence-led storytelling; Careers keeps privacy before Apply and fails closed across the vacancy lifecycle.

All guidance, contact/location facts, search policy/index data, urgent terms, institutional claims, leadership/relationship records, imagery rights, vacancies, recruitment policies, translations, and provider/data flows remain controlled, absent, or gated. No live query, call, clipboard, map, email, upload, application, analytics, external resource, personal-data collection, or hospital operation was introduced. Order 9 now provides performed Chromium geometry checks for bilingual stress fixtures and 200%/400% CSS-pixel reflow equivalents; screen-reader, cross-browser, forced-color, touch/dialer, on-site wayfinding, relevance, lifecycle/provider, low-end-device, professional language, and human comprehension validation remain Order 11 and formal stakeholder work.

## Order 9 decision

Order 9 is complete for non-public prototype review. The [responsive and bilingual refinement package](pages/responsive/README.md) adds one inherited correction layer and visibly labeled English, Amharic-geometry, mixed-script, long-content, and unavailable-translation fixtures to all 12 page studies and 3 state boards.

The final local Chromium run covered seven viewport/reflow conditions and five fixtures for 525 total render cases with reduced motion forced. All 525 passed the page-level horizontal-overflow and audited 44 × 44 px target checks. Nine representative captures were visually reviewed after correcting the 640 px card boundary, tablet search-field compression, Ethiopic result-label intrinsic sizing, 320 px About media overflow, short breadcrumb targets, and crowded long/Ethiopic navigation.

The [refinement record](pages/responsive/responsive-bilingual-refinement.md), [repeatable audit runner](pages/responsive/audit-order-9.mjs), [shared refinement source](pages/responsive/order-9.css), and [evidence](pages/responsive/evidence/README.md) are the Order 10 inputs. Professional Amharic meaning, manual browser zoom, assistive-technology output, forced colors, touch hardware, cross-browser parity, low-end-device performance, and human comprehension remain unproven and explicitly assigned to later QA or stakeholder validation.

## Order 10 decision

Order 10 is complete for non-public browser review. The [connected prototype package](prototype/README.md) adds one progressive-enhancement layer to all 12 refined page studies and 3 state boards, plus a [journey-map entry point](prototype/index.html). Home now reaches every complete page; controlled doctor/service records pass only allow-listed public fixture IDs into Appointment; safe local GET demonstrations preserve allow-listed query/filter state; and the Appointment study demonstrates conditional validation, pending/duplicate protection, known failure, unknown-outcome reconciliation, authoritative receipt, and delivery warning without contacting a hospital system or reading visitor contact values.

The shared review controls preserve route and safe state across the visibly labeled Order 9 content fixtures, can force reduced motion, and expose mutually exclusive loading, no-match, failure, offline, and unavailable result states. Emergency, contact, map, application, external provider, analytics, live search, and personal-data operations remain inert.

The final local Chromium run passed 19 of 19 scripted interaction assertions and 45 of 45 geometry cases across all 15 page/state artifacts at 320, 768, and 1280 CSS px. The [interaction specification](prototype/prototype-specification.md), [repeatable audit runner](prototype/audit-order-10.mjs), and [evidence](prototype/evidence/README.md) are the Order 11 inputs. This does not prove screen-reader/browser output, professional Amharic meaning, forced-colors usability, hardware touch/dialer safety, browser zoom, cross-browser parity, constrained-device performance, human comprehension, hospital approval, or publication readiness.

## Order 11 decision

Order 11 is complete for performed non-public prototype QA. The [QA package](qa/README.md) records 17 of 17 passing Chromium assertions across 16 artifacts after correcting no-JavaScript form safety, Save-Data motion conservation, and late toolbar injection. The final regressions also retained 19/19 Order 10 interaction assertions, 45/45 Order 10 geometry cases, and 525/525 Order 9 responsive/bilingual cases.

The performed evidence covers computed text contrast, DOM and accessibility-tree structure, trusted keyboard events, focused validation recovery, controlled result states, bilingual stress fixtures, forced colors, emulated touch safety, device-scale reflow equivalents, no-JavaScript behavior, motion/reduced-motion/Save-Data, asset budgets, and an indicative constrained local-HTTP profile. [Findings, corrections, performance interpretation, and limitations](qa/order-11-design-motion-qa.md) are the Order 12 inputs.

Professional Amharic meaning, human screen-reader output, physical touch/dialer behavior, manual browser UI zoom, Firefox/WebKit parity, low-end Android hardware, field Core Web Vitals, comprehension, hospital approval, and publication readiness remain explicitly unproven. The installed Firefox renderer failed before producing evidence, and the deliberately uncompressed 400 kbps local run recorded LCP 3.508 s; neither boundary may be represented as passed production validation.

## Order 12 decision

Order 12 is complete for documentation review and implementation planning. The [developer handoff package](handoff/README.md) indexes the authoritative requirements, decisions, page/section contracts, design-system and motion specifications, three-layer tokens, responsive rules, prototype references, asset/content policy, accessibility evidence checklist, and performed QA record.

The package maps all 12 page types and all 32 formal decision IDs, distinguishes prototype study inheritance from a production style architecture, and defines gate-aware readiness/done criteria. Its repeatable local integrity audit verifies required files, local links, page and decision coverage, token manifests, CSS foundation inheritance, and the recorded Order 9–11 result summaries.

This handoff does not authorize production implementation, personal-data collection, live hospital operations, third parties, or public release. Named hospital decisions, professional language review, human/device/browser/accessibility testing, production security and performance evidence, content/asset approval, and every affected publication gate remain open exactly as recorded in the validation and QA sources.
