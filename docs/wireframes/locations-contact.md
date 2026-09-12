# Locations & Contact — Annotated Low-Fidelity Wireframe

**Route:** `/contact/`  
**Primary question:** “How do I reach the right place?”  
**Primary action:** Call the appropriate verified contact or follow text directions  
**Status:** Publication-blocked until canonical contacts, hours, entrance and arrival directions are reconciled and tested

No source phone number, coordinate, address fragment, hour, entrance or landmark is release-ready merely because it was extracted. Every bracketed access fact is a gate.

## Requirement coverage

| Area | IDs |
| --- | --- |
| Global shell, accessibility, fallback, states, performance, governance, patient language | `G-001`–`G-016` |
| Security, third parties, privacy, Amharic and language continuity | `S-002`, `S-004`–`S-008` |
| Emergency distinction and calling safety | `E-001`–`E-005` |
| Canonical contacts, directions and maps | `C-001`–`C-003` |
| Patient access support | `P-001`–`P-002` |

## Mobile wireframe — 360 px review frame

```text
┌────────────────────────────────────┐
│ [Skip to main content]             │
│ {LC0} [APPROVED LOGO]              │
│       [Emergency]         [Menu]   │
├────────────────────────────────────┤
│ MAIN                               │
│ {LC1} H1: Locations & Contact      │
│       [VERIFY: canonical hospital  │
│        name + location summary]    │
├────────────────────────────────────┤
│ {LC2} H2: Call the right team      │
│       [Emergency purpose + number] │
│       [Routine purpose + number]   │
│       [Other APPROVED categories]  │
│       [VERIFY: hours/qualifiers]   │
├────────────────────────────────────┤
│ {LC3} H2: Address and entrance     │
│       [VERIFY: exact address]      │
│       [VERIFY: correct entrance]   │
│       [VERIFY: landmark text]      │
│       [Copy address/directions]    │
├────────────────────────────────────┤
│ {LC4} H2: Opening hours            │
│       [VERIFY: purpose + schedule] │
│       [DATED TEMPORARY STATUS]     │
├────────────────────────────────────┤
│ {LC5} H2: Getting here             │
│       [VERIFY: step-by-step route] │
│       [VERIFY: parking/vehicle]    │
│       [VERIFY: public transport]   │
│       [VERIFY: accessible entry]   │
├────────────────────────────────────┤
│ {LC6} H2: Map (optional)           │
│       Text route remains complete │
│       [Load approved map]          │
│       [VERIFY: provider notice]    │
├────────────────────────────────────┤
│ {LC7} H2: Non-urgent email/contact │
│       [VERIFY: address, purpose,   │
│        handling expectation]       │
│       Footer                       │
└────────────────────────────────────┘
```

Call rows are not fully clickable cards. Only their explicit purpose-labeled links activate `tel:`; the visible and normalized values come from the same approved record.

## Desktop wireframe — 1280 px review frame

```text
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│ [Skip] [APPROVED LOGO] [Doctors] [Services] [Appointments] [Patient info]                 │
│                         Locations (current) [Search] [Language] [Call] [Emergency]      {LC0}│
├────────────────────────────────────────────────────────────────────────────────────────────┤
│ H1 Locations & Contact                                                                 {LC1}│
│ [VERIFY: canonical hospital identity and concise location summary]                         │
│                                                                                            │
│ ┌──────────────────────────────────────────┐ ┌──────────────────────────────────────────┐ │
│ │ H2 Call the right team              {LC2}│ │ H2 Address and entrance            {LC3}│ │
│ │ [Purpose + visible number + hours]       │ │ [Exact address] [Correct entrance]       │ │
│ │ [Purpose + visible number + hours]       │ │ [Landmark directions] [Copy text]        │ │
│ └──────────────────────────────────────────┘ └──────────────────────────────────────────┘ │
│                                                                                            │
│ ┌──────────────────────────────────────────┐ ┌──────────────────────────────────────────┐ │
│ │ H2 Opening hours                   {LC4}│ │ H2 Getting here                   {LC5}│ │
│ │ [Purpose-specific verified hours]        │ │ Text route; vehicle/parking/transport;   │ │
│ │ [dated temporary status if applicable]   │ │ accessible entrance [ALL VERIFY]         │ │
│ └──────────────────────────────────────────┘ └──────────────────────────────────────────┘ │
│                                                                                            │
│ H2 Optional map — text route remains primary [Load approved map]                     {LC6}│
│ H2 Non-urgent email/contact [VERIFY: channel, purpose, handling scope]                {LC7}│
├────────────────────────────────────────────────────────────────────────────────────────────┤
│ Footer: canonical contacts | core tasks | privacy | accessibility | language scope         │
└────────────────────────────────────────────────────────────────────────────────────────────┘
```

Desktop pairs preserve `LC2` → `LC3` → `LC4` → `LC5` DOM order. If more than one maintained location is later approved, this route becomes a location collection and each place receives one canonical detail route; Phase 1 must not duplicate a single site to imply multiple locations.

## Section map — purpose, requirements, and ownership

| ID | Purpose and user need | Requirement IDs | Content and owner dependencies |
| --- | --- | --- | --- |
| LC0 | Preserve global care, emergency, search and language routes. | `G-001`–`G-006`, `S-006`–`S-008` | Approved identity/labels: Brand + Product; translations: Content + Clinical. |
| LC1 | Confirm the place and scope before visitors act. | `C-001`, `C-002`, `G-010`, `G-014` | Canonical public hospital/location name and concise summary: Operations + Facilities + Content. |
| LC2 | Distinguish emergency, switchboard and other maintained call purposes. | `C-001`, `E-001`–`E-003`, `G-006` | Reconciled number, purpose, availability and visible/normalized value: Operations; emergency wording: Clinical. |
| LC3 | Give the exact physical destination and correct entrance without a map. | `C-002`, `E-004`, `G-007`, `S-006` | Address, entrance, landmark and on-site-tested wording: Facilities + Operations; Amharic review: Content. |
| LC4 | State purpose-specific hours and time-bounded operational changes. | `C-001`, `E-004`, `G-014`–`G-015` | Hours, timezone/display convention, temporary status owner/effective/expiry: Operations. |
| LC5 | Support walking/vehicle/public-transport/accessibility arrival where maintainable. | `C-002`, `P-001`, `P-002`, `G-015` | Route steps and accessible entrance: Facilities + Operations; optional transport details omitted if not maintained. |
| LC6 | Add map orientation only after complete text guidance and privacy review. | `C-003`, `S-005`, `G-007`–`G-009`, `G-011` | Need, coordinates, provider, data flow, performance and failure behavior: Privacy + Delivery + Facilities. |
| LC7 | Define safe non-urgent written contact and expected scope. | `C-001`, `S-004`, `S-005`, `E-003` | Email/channel, monitored purpose, response handling and privacy notice: Operations + Privacy/legal. |

## Section map — layout, components, and outcomes

| ID | Layout and hierarchy | Reusable components | Interaction and navigation outcome |
| --- | --- | --- | --- |
| LC0 | Flat top-level shell; no breadcrumb. | Skip link, header/menu, language switcher, essential actions. | Global routes; language keeps `/contact/` when approved or explains unavailable equivalent. |
| LC1 | `intro`; H1 and short canonical identity. | Page introduction, review metadata. | No action needed; establishes correct location before calls/directions. |
| LC2 | Purpose-grouped `action-group`; emergency visually separated from routine. | Call links, emergency action, qualifiers. | Explicit approved `tel:` opens device dialer; whitespace/card never calls. |
| LC3 | Text-first `content`; entrance follows address. | Location/contact card content, Copy button enhancement. | Copy confirms local action; baseline text stays selectable; optional deep link to route heading. |
| LC4 | `content`; hours associated with their purpose, not one ambiguous schedule. | Definition list, temporary operations alert. | In-page status only; dated notices are not dismissible when still relevant. |
| LC5 | `content`; ordered route steps and access guidance. | Lists, accessibility guidance, text links. | Visitors can complete arrival without map; only maintained transport links appear. |
| LC6 | Optional `content` after full text route. | Map launcher, privacy notice, loading/error status. | Explicitly loads approved provider or opens reviewed external map; failure preserves `LC3`/`LC5`. |
| LC7 | `support` then footer; explicitly non-urgent. | Email link/contact route, information alert, footer. | Approved `mailto:` or maintained route; emergency warning precedes any delayed channel. |

## Section map — responsive states and cross-cutting gates

| ID | Mobile, tablet, desktop behavior | Applicable states | Accessibility, bilingual, safety, privacy, performance, motion | Open decisions and approval gates |
| --- | --- | --- | --- | --- |
| LC0 | Compact menu/emergency; full nav wide. | Menu/current route/translation unavailable. | Logical focus, 44 px targets, label wrapping, reduced motion. | Header labels and translations. |
| LC1 | Reading width; no oversized map/hero. | Default; identity unavailable = route block. | One H1; semantic HTML; current owner/date. | Canonical public name and number of locations. |
| LC2 | Call actions stack with ≥8 px separation; two columns only if purposes stay unmistakable. | Ready, dialer unsupported, temporary number status, missing required number = block. | Purpose + number visible; matching `tel:`; no auto-call; emergency distinction approved in both languages. | Reconcile every number, purpose, hours and applicable public route. |
| LC3 | One column; may pair wide after LC2. | Default, Copy success/error, missing address/entrance = block. | HTML first, long landmark text wraps, on-site and no-JS tests; no map dependence. | Exact address, entrance, landmarks, translation and review interval. |
| LC4 | Purpose rows stack/wrap; no dense timetable. | Default, temporary change, expired status. | Status has words plus dates; expires automatically or blocks on stale data. | Hours and temporary-notice workflow. |
| LC5 | One readable column; may pair with hours wide. | Full/partial optional detail; inaccessible-route notice if governed. | Accessible entry never hidden in accordion; omit unmaintained transport detail. | Parking, vehicle, public transport and accessible route. |
| LC6 | Reserved area appears only after activation; full width. | Idle, loading, loaded, error, blocked, no JS. | No initial third-party request; no CLS; status announced; reduced motion; text route complete. | Map necessity, provider, coordinates, consent/data flow. |
| LC7 | Full-width non-urgent section. | Available, delivery route unavailable, privacy notice unavailable. | Does not imply immediate reply; no emergency use; approved privacy handling; missing notice may block collection. | Channel, monitored scope, response wording and privacy decision. |

## State inventory

| State | Presentation and recovery |
| --- | --- |
| Default/ready | Required canonical identity, call categories, exact address, correct entrance, landmark directions and purpose-specific hours are approved and rendered as HTML. |
| Conflicting/missing required data | Do not choose a source value or show a disabled control. Keep the route unpublished or use a controlled unavailable state with an already-approved alternative. |
| Dialer unsupported | Retain visible purpose and number for manual dialing; do not claim a call failed or connected. |
| Temporary closure/relocation/hours | Show beside affected information with effective time, expiry, owner and alternative. Expired notices disappear only when the canonical replacement is current. |
| Map idle/loading/failure | No request in idle. Loading starts only after action; failure is local and never removes calls, address or directions. |
| Copy success/failure | Announce only the local clipboard result; selectable text remains the fallback. |
| Multiple locations | Activate collection/detail pattern only after separate maintained canonical location records exist; otherwise keep one location page. |
| No JavaScript/CSS/map/fonts | Purpose-labeled calls, address, entrance, hours, text directions, access guidance and non-urgent scope remain usable in source order. |

## Focus and reading order

```text
Skip → shell → H1/identity → emergency and routine call purposes
→ address/entrance/landmarks → hours/status → route/access guidance
→ optional map launcher/status → non-urgent contact → footer
```

## Publication and approval gates

- Operations reconciles one canonical record for emergency, ambulance, switchboard, other phones, email, address and purpose-specific hours; all reused copies derive from it (`C-001`, `E-001`).
- Clinical + Operations approve the hospital/public emergency distinction and online-channel warning (`E-002`, `E-003`).
- Facilities + Operations verify the exact address, correct entrance, landmarks, route steps, parking/vehicle and accessible entry through an on-site arrival test (`C-002`, `E-004`).
- Privacy + Delivery approve any map or written-contact third party, data flow, failure behavior and performance cost; map omission cannot block the journey (`C-003`, `S-005`).
- Content + Clinical provide professionally reviewed Amharic contacts, landmark directions and safety distinctions (`S-006`).
- Delivery + QA test visible/normalized call equality, accidental activation, direct-call fallback, 320 px/400% zoom, keyboard/screen reader, long bilingual directions, no JS, map failure and temporary-status expiry.
