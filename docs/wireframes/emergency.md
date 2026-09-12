# Emergency — Annotated Low-Fidelity Wireframe

**Route:** `/emergency/`  
**Primary question:** “What should I do right now?”  
**Primary action:** Call the verified appropriate emergency route  
**Status:** Publication-blocked until all safety and arrival information is approved

This page does not diagnose, estimate urgency, or replace emergency services. The number `+251-940-105692` found in source material is deliberately not used as release copy here because Operations has not approved it.

## Requirement coverage

| Area | IDs |
| --- | --- |
| Global access, reflow, accessibility, fallback, states, performance, governance, patient language | `G-001`, `G-003`–`G-016` |
| Security, third parties, Amharic, language switching | `S-002`, `S-005`–`S-008` |
| Emergency | `E-001`–`E-005` |
| Canonical contacts and directions | `C-001`–`C-003` |

`S-001` remains a release gate outside the page layout. No personal data is collected on this route.

## Mobile wireframe — 360 px review frame

```text
┌────────────────────────────────────┐
│ [Skip to main content]             │
│ {E0} [APPROVED LOGO]       [Menu]  │
│      Current: Emergency            │
├────────────────────────────────────┤
│ MAIN                               │
│ {E1} H1: Emergency help            │
│      [VERIFY: concise instruction  │
│       distinguishing hospital and  │
│       public emergency routes]     │
│                                    │
│      Hospital route: [VERIFY use]  │
│      ┌──────────────────────────┐  │
│      │ Call hospital emergency │  │
│      │ [VERIFY: visible number]│  │
│      └──────────────────────────┘  │
│                                    │
│      Public route: [VERIFY use]    │
│      [Call public emergency]       │
├────────────────────────────────────┤
│ {E2} H2: How the routes differ     │
│      [VERIFY: audience, purpose,   │
│       limits and hours for each]   │
├────────────────────────────────────┤
│ {E3} WARNING                       │
│      H2: Do not use online contact │
│      [VERIFY: forms, email, chat,  │
│       social not monitored for     │
│       emergencies]                │
├────────────────────────────────────┤
│ {E4} H2: Emergency care at this    │
│      hospital                      │
│      [VERIFY: adult/pediatric      │
│       scope, limitations, hours]   │
├────────────────────────────────────┤
│ {E5} H2: Where to go               │
│      [VERIFY: exact entrance]      │
│      [VERIFY: landmark directions] │
│      [Copy text directions]        │
├────────────────────────────────────┤
│ {E6} H2: Arriving safely           │
│      [VERIFY: vehicle/parking,     │
│       transport, accessible entry]│
├────────────────────────────────────┤
│ {E7} H2: Map (optional)            │
│      Text directions stay visible │
│      [Load approved map]           │
│      Third-party notice [VERIFY]   │
├────────────────────────────────────┤
│ {E8} Need another hospital contact?│
│      [Non-emergency contact →]     │
│      Footer: privacy | access |    │
│      language | core tasks         │
└────────────────────────────────────┘
```

The route distinction is stated before or within the first call-choice group. The explicit call links then follow in DOM/focus order. Neither link is sticky, full-screen, or the entire card; surrounding whitespace is non-interactive.

## Desktop wireframe — 1280 px review frame

```text
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│ [Skip] [APPROVED LOGO] [Doctors] [Services] [Appointments] [Patient info] [Locations]     │
│                         [Search] [Language] [Call]                    Emergency (current) {E0}│
├────────────────────────────────────────────────────────────────────────────────────────────┤
│ H1 Emergency help                                                                       {E1}│
│ [VERIFY: immediate instruction distinguishing hospital and public emergency routes]        │
│ ┌──────────────────────────────────────────────┐                                            │
│ │ Hospital: [VERIFY use] [Call hospital emergency] [VERIFY: number]                      │
│ │ Public:   [VERIFY use] [Call public emergency] [VERIFY: number]                         │
│ └──────────────────────────────────────────────┘                                            │
│                                                                                            │
│ ┌──────────────────────────────────────────┐  ┌──────────────────────────────────────────┐ │
│ │ H2 How the routes differ            {E2} │  │ WARNING                             {E3} │ │
│ │ [VERIFY: audience, purpose, limits        │  │ H2 Do not use online contact             │ │
│ │ and hours for both routes]                 │  │ [VERIFY: approved warning]                │ │
│ │                                               │  │ Forms/email/chat/social are not actions   │ │
│ │                                               │  │ on this page.                             │ │
│ └──────────────────────────────────────────┘  └──────────────────────────────────────────┘ │
│                                                                                            │
│ H2 Emergency care at this hospital                                                   {E4} │
│ [VERIFY: scope, limitations, availability; concise governed text]                         │
│                                                                                            │
│ ┌──────────────────────────────────────────┐  ┌──────────────────────────────────────────┐ │
│ │ H2 Where to go                     {E5} │  │ H2 Arriving safely                  {E6} │ │
│ │ Exact entrance [VERIFY]                  │  │ Vehicle/parking/public transport         │ │
│ │ Landmark text directions [VERIFY]        │  │ and accessible entrance [VERIFY]         │ │
│ │ [Copy text directions]                   │  │                                          │ │
│ └──────────────────────────────────────────┘  └──────────────────────────────────────────┘ │
│                                                                                            │
│ H2 Optional map                                                                      {E7} │
│ Text route remains complete. [Load approved map] [VERIFY: provider/privacy notice]         │
├────────────────────────────────────────────────────────────────────────────────────────────┤
│ Non-emergency contact route + footer                                                   {E8}│
└────────────────────────────────────────────────────────────────────────────────────────────┘
```

The two-column pairs preserve source order: `E2` before `E3`, then `E5` before `E6`. Narrow or zoomed desktop returns to the mobile sequence.

## Call activation safety

The web page must make the emergency action fast without making it trigger-prone:

1. Only the explicit anchor containing the purpose label and visible number is active. The enclosing section/card and whitespace do nothing.
2. Activation occurs on a completed click, tap, Enter, or Space where platform semantics support it—never on page load, focus, `pointerdown`, or `touchstart`.
3. The primary target is at least 48 px high and has at least 8 px separation from every other target. Hospital and public routes are not adjacent icon-only buttons.
4. The page hands the approved `tel:` value to the native dialer. It never attempts an automatic call or invents a custom confirmation step; the device keeps final call placement under user control.
5. Purpose and number remain visible after activation so the user can manually dial or copy them if the device cannot open a dialer. A website generally cannot assert that a call connected.
6. Pointer, touch, keyboard, screen-reader, zoom, and representative mobile-dialer tests must verify that the visible and normalized values match and that accidental surrounding taps do not activate the link.

## Section map — purpose, requirements, and content ownership

| ID | Purpose and user need | Requirement IDs | Content and owner dependencies |
| --- | --- | --- | --- |
| E0 | Identify the hospital while keeping the urgent route uncluttered and global navigation recoverable. | `G-001`, `G-005`, `G-010`, `S-006`–`S-008` | Approved logo/name and labels: Brand + Product; emergency current-state label and translations: Clinical + Content. |
| E1 | Give the fastest understandable choice between the verified hospital and applicable public emergency routes. | `E-001`, `E-002`, `E-005`, `G-004`–`G-007` | Both purposes, numbers, applicability, immediate distinction, and instruction: Operations + Clinical; all are release gates. |
| E2 | Explain the audience, purpose, limits, and hours for both routes without delaying the initial choice. | `E-001`, `E-002`, `C-001` | Both labels, jurisdiction/applicability, limits, hours, and “when to use” copy: Operations + Clinical. |
| E3 | Stop unsafe use of delayed/unmonitored digital channels. | `E-003`, `G-010`, `S-006` | Approved concise warning and Amharic version: Clinical + Content. No online-contact CTA is included. |
| E4 | State verified audience, service scope, limitations, and availability without implying unsupported capability. | `E-004`, `G-014`, `G-015` | Clinical scope/limits: Clinical; hours/availability: Operations; owner and review date required. |
| E5 | Get a first-time visitor to the correct emergency entrance using text. | `E-004`, `E-005`, `C-002`, `G-007` | Exact entrance, landmarks, tested directions: Facilities + Operations; professional Amharic review. |
| E6 | Support vehicle, public-transport, parking, and accessible arrival where verified. | `E-004`, `C-002`, `G-015` | On-site verified access guidance: Facilities + Operations; omit an unapproved optional detail, but entrance guidance itself blocks release. |
| E7 | Offer visual map help outside the critical path without making the journey dependent on a third party. | `C-003`, `S-005`, `G-007`–`G-009`, `G-011` | Provider, coordinates, privacy/data flow, performance, failure behavior: Privacy + Delivery; optional and initially unloaded. |
| E8 | Route non-emergency needs away from urgent contact and preserve global exits. | `G-001`, `C-001`, `S-004` | Canonical switchboard/contact scope: Operations; privacy/accessibility links and language scope: Privacy/legal + Product. |

## Section map — layout, components, and outcomes

| ID | Layout and hierarchy | Reusable components | Interaction and navigation outcome |
| --- | --- | --- | --- |
| E0 | Minimal flat-page shell; no breadcrumb. Wide navigation is visible but visually quiet. | Skip link, header, navigation/menu, language switcher. | Global routes remain available; current Emergency is non-ambiguous and non-duplicative. |
| E1 | `intro`; H1 → concise distinction → vertically separated purpose-labeled call choices. | Page introduction, Emergency actions, Call links. | Each approved `tel:` opens only its own native-dialer route; visible purpose and number remain. |
| E2 | `content` immediately after the choices; expands the distinction without repeating actions. | Information alert/definition text. | The visitor can verify audience, purpose, limits, and hours without losing either call choice. |
| E3 | Static non-dismissible warning immediately after number distinction. | Warning/emergency alert with heading and text; no disclosure. | No email/form/chat/social action. Warning is read in document order, not injected assertively. |
| E4 | Reading-width `content`; concise list/prose, not a promotional service grid. | Governed-content text, review metadata. | Optional related detail may link to approved service page only after the complete safety summary. |
| E5 | Text-first `content`; entrance precedes route steps. | Location/contact content, Copy button enhancement. | Copy uses button and confirms locally; base text can be selected without JS; Contact/directions deep link if useful. |
| E6 | Supporting `content`, paired only wide. | Plain lists, accessibility guidance. | Links only when they lead to maintained transport/accessibility information. |
| E7 | Optional `content`; launcher follows complete text alternative. | Optional map launcher, information notice, loading/error status. | Explicit action loads approved provider or opens approved external map; failure leaves E5/E6 intact. |
| E8 | `support` plus footer, clearly labeled non-emergency. | Text links, canonical call link, footer. | → `/contact/`, other core routes, privacy, accessibility; no urgent ambiguity. |

## Section map — responsive states and cross-cutting gates

| ID | Mobile, tablet, desktop behavior | Applicable states | Accessibility, bilingual, safety, privacy, performance, motion | Open decisions and approval gates |
| --- | --- | --- | --- | --- |
| E0 | Compact logo/menu; wide task nav; no sticky element obscures H1 or calls. | Menu open/closed; current page; unavailable translation. | Emergency is reachable immediately; labels wrap in Amharic; focus visible; menu reduced-motion safe. | Header label order; approved translations. |
| E1 | Single column at every width; call links do not become enormous whole-region hit targets. | Default; dialer unsupported/handoff failure; missing route data = publication blocked. | Exact route distinction precedes or is part of the first interactive call group; visible purpose+number; HTML/`tel:` works without JS; activation protections above. | Both numbers, purposes, applicability, labels, normalized formats. |
| E2 | Reading-width explanation; may use two columns wide only when the comparison remains clear. | Default; one route unavailable blocks publication unless Clinical/Operations approve truthful scope. | No color-only distinction; long text does not clip; no repeated or competing call action. | Audience, limits, hours, and exact route distinction. |
| E3 | Full-width in flow; never collapsed or dismissible. | Static default; temporary copy revision; missing wording blocks publication. | Screen-reader heading; no live-region interruption on initial load; approved English/Amharic meaning. | Clinical wording and translation. |
| E4 | Reading width at all viewports; lists wrap. | Default; optional scope item absent; governed record expired = unavailable/block. | No inferred service; owner/date; HTML first; no animation/media dependence. | Adult/pediatric scope, limitations, hours, reviewer. |
| E5 | One column compact; paired with E6 wide after source order. | Default; Copy success/error; missing direction blocks release. | Text remains when CSS/JS/map fails; landmark directions translated and on-site tested. | Entrance, landmarks, route steps, review interval. |
| E6 | Follows E5 compact; adjacent wide only when each remains readable. | Default; optional unavailable details omitted. | Accessible entrance is not hidden in accordion; no empty labels. | Parking, public transport, accessible route. |
| E7 | Full-width beneath text directions; map area reserves dimensions after request. | Idle, loading, loaded, error, blocked third party, no JS. | No request before approval/user action; no layout shift; status text; reduced motion; zero critical-path dependency. | Whether a map is needed; provider/coordinates/data flow. |
| E8 | Stacked footer groups compact; wrapping multi-column wide. | Default; canonical contact unavailable blocks release; translation limitation. | “Non-emergency” is explicit; consistent record; privacy/access routes. | Switchboard purpose/hours and approved footer content. |

## State inventory

| State | Presentation and recovery |
| --- | --- |
| Default/ready | All `E1`–`E6` safety and arrival information is approved, visible HTML; optional `E7` is idle/unloaded. |
| Loading | The primary page never waits for a runtime fetch. Only a user-initiated map may show loading after about 300 ms; text directions and numbers remain usable. |
| Empty | Not a valid release state for required numbers, distinction, warning, scope, entrance, or directions. Optional transport detail or map is omitted cleanly. |
| Call handoff unsupported | Keep focus/context, retain visible number, and show static guidance to dial it manually. Do not claim the phone failed or the emergency service is unavailable. |
| Map failure | Inline non-blocking error at `E7`; preserve `E5`/`E6`; offer an approved external-map link only after review. |
| Content unavailable/expired | Required safety/contact content blocks publication or triggers a controlled unavailable route with an already-approved alternative; never show a disabled red call button or an unverified number. |
| Success | The website has no reliable “call connected” success state. It may report only local actions it knows, such as “Directions copied.” |
| No JavaScript/CSS/media | Semantic headings, purpose-labeled telephone anchors, warning, scope, entrance, directions, and footer remain usable in source order. |

## Focus and reading order

```text
Skip → logo/menu/language → H1 → hospital/public route distinction
→ each explicit call choice → expanded route explanation → online-channel warning
→ verified scope → entrance/directions → arrival/accessibility → optional map
→ non-emergency support → footer
```

The warning is not announced as a newly injected assertive alert on initial page load; it is ordinary prominent static content. Focus never moves merely because a call link opened a device handler.

## Publication and approval gates

- Operations must reconcile hospital emergency, ambulance, public emergency, switchboard, hours, entrance, and visible/normalized values (`E-001`, `E-002`, `E-004`, `C-001`).
- Clinical + Operations must approve when to use each route, the online-channel warning, audience, scope, and limitations (`E-002`–`E-004`).
- Facilities + Operations must verify the exact entrance and test landmark directions on site without a map (`E-004`, `C-002`).
- Clinical + Content must professionally review all Phase 1 Amharic safety copy (`S-006`).
- Privacy + Delivery must approve any map provider/data flow; the map can be dropped without affecting readiness (`S-005`, `C-003`).
- Delivery + QA must test accidental activation, number equality, keyboard/screen reader, 320 px/400% zoom, no JS, CSS/media failure, constrained network, and reduced motion (`E-005`, `G-003`–`G-012`).
