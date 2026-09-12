# Low-Fidelity Wireframe Packages

**Version:** 0.2 benchmark-traceable review package  
**Prepared:** 10 September 2026  
**Status:** Structure and behavior for review; not production UI or approved hospital content

## Purpose and scope

These packages turn the approved requirements, sitemap, page specifications, and design-system contracts into reviewable low-fidelity structures.

### Critical journeys

1. [Home](home.md)
2. [Emergency](emergency.md)
3. [Request an Appointment](appointment.md)
4. [Critical user flows](critical-user-flows.md)

### Care discovery

1. [Doctor Directory](doctor-directory.md)
2. [Doctor Profile](doctor-profile.md)
3. [Services Directory](services-directory.md)
4. [Service Detail](service-detail.md)
5. [Care-discovery user flows](care-discovery-flows.md)

### Practical access and site search

1. [Patient & Visitor Information](patient-information.md)
2. [Locations & Contact](locations-contact.md)
3. [Search Results](search-results.md)
4. [Practical-access and site-search user flows](practical-access-flows.md)

### Institutional content and careers

1. [About the Hospital](about.md)
2. [Careers](careers.md)
3. [Institutional-content and vacancy-lifecycle flows](institutional-flows.md)

### Phase 1 utility behavior

1. [Privacy, Accessibility, and 404/unavailable utility pages](utility-pages.md)

Cookie information remains within the Privacy Notice unless an approved decision requires a separate maintained page. Terms / Legal Notice, Referring Clinicians, Health Information / News, Careers, and a Patient Portal are outside the initial Phase 1 implementation backlog unless `GOV-02` records an approved scope change. Careers retains its existing Phase 2 review package.

It tests hierarchy, responsive behavior, navigation, form recovery, and requirement traceability before visual polish or implementation. Boxes show relative order and grouping, not final size, typography, color, copy, or imagery.

## Authoritative sources

- [Requirements matrix](../requirements/requirements-matrix.md)
- [Sitemap](../ux/sitemap.md)
- [Page specifications](../ux/page-specifications.md)
- [Utility page specifications](../ux/utility-page-specifications.md)
- [Design-system overview](../design-system/README.md)
- [Visual foundations](../design-system/foundations.md)
- [Layout patterns](../design-system/layout-patterns.md)
- [Component contracts](../design-system/components.md)
- [Interaction and motion](../design-system/interaction-and-motion.md)
- [Benchmark traceability and local incorporation](../benchmarks/benchmark-traceability.md)

Where these packages and a source conflict, the source is authoritative unless the conflict is explicitly resolved in both places. Benchmark IDs explain provenance but never override local requirements or approval gates. The sitemap's Phase 1 inventory is the canonical route source: Appointment is `/appointments/`, Patient & Visitor Information is `/patient-information/`, and Locations & Contact is `/contact/`. Completed passes resolved the prior source gaps and now also define the Phase 1 Privacy, Accessibility, and genuine 404/410/unavailable contracts.

## Benchmark application by wireframe package

| Package | Incorporated applications | Deferred boundaries preserved |
| --- | --- | --- |
| Critical journeys | `BM-01`, `BM-02`, `BM-05`, `BM-06`, `BM-08`–`BM-11`, `BM-13` | Live triage, confirmed booking, portal/account state |
| Care discovery | `BM-02`–`BM-05`, `BM-06`, `BM-09`–`BM-11` | Diagnosis, unsupported filters, schedules, availability, or clinical routing |
| Practical access/search | `BM-02`–`BM-11`, `BM-13`, `BM-16` | Map dependency, copied patient/payer guidance, symptom checker |
| Institutional/careers | `BM-01`, `BM-09`–`BM-13`, `BM-16` | Unsupported claims, quality results, policies, provider, or international-care promises |

## Wireframe notation

| Mark | Meaning |
| --- | --- |
| `[ … ]` | Component, control, or bounded content region |
| `( )` | Single-choice radio option |
| `[ ]` within a form | Checkbox |
| `→ /route/` | Navigation outcome |
| `→ tel:[VERIFIED]` | Device-dialer handoff after operational approval |
| `↳` | Conditional or progressively disclosed content |
| `{A1}` | Annotation referenced by the page's section map |
| `[VERIFY: …]` | Required fact/copy is blocked pending named approval |
| `[APPROVED RECORDS ONLY]` | Render only governed, publishable records |
| `[OMIT WHEN EMPTY]` | Remove the whole module and its gap; do not show a hollow shell |
| `[STATE: …]` | Alternate interaction or system state, not simultaneous default content |

Placeholder brackets are editorial gates, not proposed public copy. They must never ship or be replaced with invented facts.

## Viewport and reflow assumptions

| Review frame | Assumption | Expected behavior |
| --- | --- | --- |
| Compact mobile | 320–767 CSS px; diagrams use 360 px | One reading column, 16 px candidate gutter, stacked actions, no horizontal page scroll |
| Tablet | 768–1023 CSS px | 24 px candidate gutter; one or two columns only when labels and reading order remain clear |
| Desktop | 1024 CSS px and above; diagrams use 1280 px | 32 px candidate gutter; maximum content widths from foundations; primary navigation visible |
| Reflow | 320 CSS px and 400% zoom | Behaves like compact layout; no clipping, overlap, or two-dimensional scrolling |

Breakpoints are not content guarantees. Components adapt when their content no longer fits. The form remains a single reading column at every width and stays near a 640 px maximum.

## Shared shell

### Compact

```text
┌──────────────────────────────────┐
│ [Skip to main content]           │
│ [Approved logo → /]              │
│ [Emergency → /emergency/] [Menu] │
├──────────────────────────────────┤
│ MAIN: one H1 + page content      │
├──────────────────────────────────┤
│ Contextual call/support fallback │
│ Footer: tasks, privacy, access,  │
│ language scope, governed contact │
└──────────────────────────────────┘

Menu open order:
Find a Doctor → Services → Appointments → Patient & Visitor
Information → Locations & Contact → Search → Language → Call
```

### Desktop

```text
┌──────────────────────────────────────────────────────────────────────────┐
│ [Skip to main content]                                                   │
│ [Approved logo] [Doctors] [Services] [Appointments] [Patient info]      │
│                 [Locations] [Search] [Language] [Call] | [Emergency]     │
├──────────────────────────────────────────────────────────────────────────┤
│ MAIN: aligned standard/reading-width content                             │
├──────────────────────────────────────────────────────────────────────────┤
│ Contextual fallback                                                      │
│ Footer: core tasks | canonical contacts | privacy | accessibility        │
└──────────────────────────────────────────────────────────────────────────┘
```

Home and flat top-level routes omit breadcrumbs; detail and genuinely nested secondary routes use them. The emergency control is visually and physically distinct from routine actions. A compact action bar is not assumed because it risks covering form fields, focus, browser controls, and small-screen content; it may be tested later only if those risks are eliminated.

## Shared interaction contract

- DOM order matches the diagrams' top-to-bottom reading order. Visual columns never reorder meaning.
- Every target is at least 44 by 44 CSS px, normally 48 px high, with at least 8 px between adjacent targets.
- Keyboard focus is always visible. Skip link is first; overlays restore focus; invalid submission focuses the error summary; acknowledged success focuses the confirmation heading.
- Links navigate; buttons change local state or submit. Call links show purpose and visible number as well as using an approved matching `tel:` value.
- Essential content and standard form submission have semantic HTML/no-JavaScript paths. Enhancements must not remove the baseline.
- Loading feedback appears only when delay is perceptible, reserves its space, and retains the initiating label and user context.
- Motion is state communication only: generally 150–300 ms, with travel/rotation removed and durations reduced to 0–100 ms under `prefers-reduced-motion`.
- No carousel, autoplay, background video, scroll reveal, parallax, chat, session replay, or map request is in the critical path.

## English and Amharic assumptions

- English and Amharic/Ethiopic both read left to right. The page remains `dir="ltr"`; do not mirror the shell or directional controls merely because the language changes.
- Use correct `lang="en"` and `lang="am"` metadata. Mixed-language passages receive their own language annotation.
- Reserve at least 35% expansion for labels and instructions, allow wrapping, and never truncate navigation, phone purpose, warnings, consent, errors, names, or calls to action.
- Phase 1 requires reviewed Amharic primary navigation, emergency content, appointment warnings/instructions/system messages, contacts, landmark directions, and privacy/consent copy (`S-006`). Full essential-journey parity remains a Phase 2 gate (`S-007`).
- A switch retains route, safe query/context, and entered form data only where field meanings and consent remain valid. If no equivalent exists, it explains the limitation in place and offers translated nearby routes; it never silently redirects Home (`S-008`).
- Font direction remains the provisional Noto Sans/Noto Sans Ethiopic system and requires real-device legibility and loading tests before brand approval.

## Shared state interpretation

| State | Package rule |
| --- | --- |
| Default | Only approved content is shown; no placeholder claims |
| Loading | Used only for genuinely asynchronous content; static emergency/contact content does not wait on JavaScript |
| Empty | Optional governed modules are omitted; user-owned search/form states explain the next useful action |
| Error | Specific, non-blaming explanation plus recovery and approved offline/telephone fallback |
| Validation | Error summary plus linked inline errors; valid data remains |
| Success | Used only after authoritative acknowledgement; never turns a request into a confirmed booking |
| Unavailable | Explain what is unavailable and provide a truthful alternative; safety/contact data missing at release blocks publication |

## Review checklist

- [ ] At 320 px, 360 px, tablet, desktop, 200% zoom, and 400% zoom, content reflows without horizontal page scroll.
- [ ] Header/menu and page content expose Emergency, Call, Doctors, Services, Appointments, Contact/Directions, Search, and Language predictably.
- [ ] Emergency call controls are explicit, separated, keyboard operable, and cannot fire from a card, page load, pointer-down, or touch-down.
- [ ] Visible and `tel:` numbers will be generated from one approved canonical record and tested for equality.
- [ ] Home essential tasks precede promotion and work when optional doctors, services, imagery, or claims are absent.
- [ ] Doctor/service directories preserve approved search/filter/page state in the URL and provide useful no-match, failure, offline, and no-JavaScript recovery.
- [ ] Patient guidance publishes only useful approved topics, omits empty stages/pages, and provides staffed recovery for unavailable guidance.
- [ ] Contact data comes from one canonical record; written entrance/directions work without a map and map failure leaves the journey complete.
- [ ] Site search indexes only approved current records, labels types, preserves safe URL state, routes approved urgent terms, and covers correction, zero, failure, offline, stale-record, bilingual, and no-JavaScript states.
- [ ] Search queries do not enter unapproved analytics, autocomplete, pixels, replay, chat, logs, caches, or outbound referrers; reviewed first-party handling is a release gate.
- [ ] Only approved current doctor/service records, fields, taxonomy terms, synonyms, and relationships appear; optional gaps collapse without empty UI.
- [ ] Doctor profiles omit schedules and live availability until `D-005` is resolved; appointment handoff uses a canonical public record ID.
- [ ] Service details withhold unapproved capabilities, surface governed urgent exceptions, and never diagnose, recommend treatment, or estimate urgency.
- [ ] Appointment language consistently says “request,” and the candidate field set passes operations/privacy data-minimization review.
- [ ] Consent is explicit and initially unchecked; privacy notice, recipient, retention, contact, and withdrawal handling are approved.
- [ ] Validation, timeout, lost connection, API failure, retry, duplicate suppression, success, and confirmation-delivery behavior are reviewed.
- [ ] Keyboard, screen-reader, touch, pointer, Back/Forward, no-JavaScript, constrained-network, and reduced-motion paths are testable.
- [ ] English/Amharic hierarchy, 35% expansion, wrapping, language metadata, and unavailable-translation behavior are reviewed.
- [ ] About shows only approved story, mission/vision/values, leadership, evidence-dated facts, and relationships; optional evidence and rights-expired imagery collapse without invented substitutes.
- [ ] Institutional claims, milestones, leadership records, partner/insurer meanings, names/logos, translations, and imagery have current owners, sources, review dates, and rights.
- [ ] Careers remains deferred until HR owns the complete vacancy lifecycle and every current record has required fields, stable public identity, closing instant/timezone, privacy terms, and an approved application route.
- [ ] Closed, filled, withdrawn, expired, untranslated, or privacy-blocked vacancies cannot remain actionable through the page, direct links, caches, search, sitemaps, or a third-party provider.
- [ ] No-current-vacancy and application-failure states collect no candidate data through speculative, disabled, ungoverned, or silently substituted routes.
- [ ] Every visible clinical, operational, contact, privacy, or institutional assertion has an owner, source, review date, and publication gate.
- [ ] Every requirement ID cited by the package exists in the requirements matrix.
- [ ] No reviewer interprets these ASCII frames as approved final copy, branding, dimensions, or production UI.

## Approval roles

| Decision area | Accountable role from requirements |
| --- | --- |
| Emergency numbers, hours, entrance, directions, call labels | Operations; Clinical where safety wording/scope is involved |
| Canonical contacts and arrival details | Operations + Facilities |
| Patient guidance, stages, availability, rights and feedback | Operations + Content + Privacy/legal; Clinical where medically relevant |
| Search taxonomy, synonyms, correction, ranking and urgent terms | Clinical + Product + Content |
| Search logs, retention, cache/referrer behavior and third parties | Privacy + Security + Delivery |
| Doctor roster and service taxonomy | Medical staff owner; Clinical + Content |
| Appointment workflow, staffing, response expectation, confirmation channel, fallback | Operations |
| Fields, consent, privacy notice, retention, recipients, withdrawal/contact route | Privacy/legal + Security |
| Amharic safety and clinical meaning | Clinical + Content with professional language review |
| Brand tokens, typography, imagery | Brand owner/Design; still provisional in this package |
| Mission, history, leadership, capacity and institutional claims | Executive + Content; Operations for operational definitions |
| Partner/insurer status, patient meaning, and logo rights | Executive + Operations + Content/Brand |
| Vacancy content, status, closing, lifecycle, and candidate response | HR + hiring owner |
| Recruitment privacy, application provider, data/files, retention, equality/access wording | Privacy/legal + Security + HR |
| Accessibility, performance, security, state implementation | Delivery + QA + Security |
