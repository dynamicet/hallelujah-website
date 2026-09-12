# Doctor Directory — Annotated Low-Fidelity Wireframe

**Route:** `/doctors/`  
**Primary question:** “Who can help me?”  
**Primary action:** Open an approved doctor profile  
**Status:** Publication-blocked pending current-roster approval and canonical-record cleanup

## Requirement coverage

| Area | IDs |
| --- | --- |
| Global shell, accessibility, responsive behavior, states, performance, governance, patient language | `G-001`–`G-016` |
| Language and privacy-safe third parties | `S-005`–`S-008` |
| Search behavior | `H-005` |
| Doctor directory and records | `D-001`–`D-006` |
| Service route and staffed fallback | `V-001`, `C-001` |

`S-001` and `S-002` remain sitewide release gates but do not create visible directory regions.

## Mobile wireframe — 360 px review frame

```text
┌────────────────────────────────────┐
│ [Skip to main content]             │
│ {D0} [APPROVED LOGO]               │
│      [Emergency]          [Menu]   │
├────────────────────────────────────┤
│ MAIN                               │
│ {D1} H1: Find a doctor             │
│      Find by approved name or      │
│      specialty/service.            │
│      Not sure? [Explore services]  │
│      or [VERIFY: staffed contact]  │
├────────────────────────────────────┤
│ {D2} Label: Search doctors         │
│      [name or specialty_______]    │
│      [Search] [Clear, when filled] │
│                                    │
│      [Filters (n)]                 │
│      ↳ [APPROVED FIELDS ONLY]      │
│      [Active filter ×] [Clear all] │
├────────────────────────────────────┤
│ {D3} Status: [N] doctors           │
│      Updated after submitted       │
│      search/filter changes         │
├────────────────────────────────────┤
│ {D4} [APPROVED RECORDS ONLY]       │
│      ┌──────────────────────────┐  │
│      │ [portrait or neutral    ]│  │
│      │ [APPROVED NAME]          │  │
│      │ [APPROVED SPECIALTY]     │  │
│      │ [optional maintained data]│ │
│      │ [View profile →]         │  │
│      └──────────────────────────┘  │
│      [Next page →]                 │
├────────────────────────────────────┤
│ {D5} [STATE: no results OR         │
│      recoverable data failure]     │
│      explanation + reset/retry +   │
│      Services + staffed contact    │
├────────────────────────────────────┤
│ {D6} Need help choosing?           │
│      [Explore services]            │
│      [VERIFY: purpose + phone]     │
│      Footer: core tasks | privacy  │
└────────────────────────────────────┘
```

The compact Filters control opens a focus-managed disclosure or dialog. Search remains usable as a normal GET form without client JavaScript; filters may use submitted native controls in the baseline.

## Desktop wireframe — 1280 px review frame

```text
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│ [Skip] [APPROVED LOGO] Doctors (current) [Services] [Appointments] [Patient info]          │
│                         [Locations] [Search] [Language] [Call] [Emergency]               {D0}│
├────────────────────────────────────────────────────────────────────────────────────────────┤
│ H1 Find a doctor                                                                        {D1}│
│ Find by approved name or specialty/service. [Explore services] [VERIFY: staffed contact]   │
│                                                                                            │
│ Label: Search doctors [ name or specialty/service __________________________ ] [Search] {D2}│
│                                                                                            │
│ ┌────────────────────────────┐  ┌────────────────────────────────────────────────────────┐ │
│ │ H2 Filter doctors          │  │ Status: [N] doctors                               {D3} │ │
│ │ [APPROVED FIELDS ONLY]     │  │ [Active filter ×] [Clear all]                          │ │
│ │ [Apply/reset if submitted] │  │                                                        │ │
│ │                        {D2}│  │ [APPROVED CARD] [APPROVED CARD]                    {D4} │ │
│ └────────────────────────────┘  │ [APPROVED CARD] [APPROVED CARD]                         │ │
│                                 │ [Pagination: Previous 1 2 Next]                         │ │
│                                 └────────────────────────────────────────────────────────┘ │
│ [STATE: no results/data failure replaces count and cards, not the search controls]      {D5}│
├────────────────────────────────────────────────────────────────────────────────────────────┤
│ Need help choosing? [Explore services] [VERIFY: purpose-labeled staffed call]            {D6}│
│ Footer: core tasks | canonical contacts | privacy | accessibility | language scope          │
└────────────────────────────────────────────────────────────────────────────────────────────┘
```

The filter rail precedes the count/results in DOM order. At zoom or when either column becomes cramped, it returns to the compact sequence. Results use one column compact, up to two medium, and no more than three wide.

## Section map — purpose, requirements, and content ownership

| ID | Purpose and user need | Requirement IDs | Content and owner dependencies |
| --- | --- | --- | --- |
| D0 | Keep emergency, language, contact, and care routes predictable. | `G-001`–`G-006`, `S-006`–`S-008` | Approved identity/labels: Brand + Product; canonical contacts: Operations; translations: Content. |
| D1 | Explain what can be searched and offer a route for visitors who cannot name a clinician. | `D-002`, `G-010`, `V-001`, `C-001` | Approved search vocabulary and staffed-contact purpose/hours: Product + Content + Operations. |
| D2 | Find by name or specialty/service and narrow only on trustworthy maintained fields. | `D-002`, `H-005`, `G-005`, `G-011` | Current names, specialties, relationships, synonyms, and any filter field: Medical staff owner + Clinical + Content. |
| D3 | Confirm the effect of a submitted search/filter action. | `D-002`, `G-010`, `G-011` | Count grammar/translations and update behavior: Content + Delivery + QA. |
| D4 | Present one canonical route for every approved current clinician. | `D-001`, `D-003`, `D-004`, `D-006`, `G-013`–`G-015` | Approved roster, profile URLs, name, specialty, optional credentials/location/language, portrait rights: Medical staff owner + Content. |
| D5 | Recover from zero matches or system failure without creating a dead end or guessing care. | `D-002`, `G-007`, `G-011`, `V-001`, `C-001` | Approved spelling/help copy, service route, staffed phone/hours: Product + Operations + Content. |
| D6 | Give a human/service fallback when choosing a doctor remains uncertain. | `G-001`, `D-002`, `V-001`, `C-001` | Staffed routing scope, phone, and hours: Operations; service taxonomy: Clinical + Content. |

## Section map — layout, components, and outcomes

| ID | Layout and hierarchy | Reusable components | Interaction and navigation outcome |
| --- | --- | --- | --- |
| D0 | Flat top-level shell; no breadcrumb. | Skip link, header, navigation/menu, language switcher, emergency/call actions. | Global canonical routes; language retains safe route/query when equivalent exists. |
| D1 | `intro`; H1, concise scope, uncertainty alternatives. | Page introduction, text links, call link. | → `/services/` or approved staffed `tel:`; no diagnostic promise. |
| D2 | Search before filters; compact overlay/disclosure, wide rail. | Search box, filter group, active-filter chips, buttons. | GET/search updates safe URL state; Apply/Clear/Back/Forward reproduce the view. |
| D3 | Status immediately before results. | Result count/status message. | Polite announcement after committed action; focus remains on initiator. |
| D4 | `collection`; cards have one primary canonical destination. | Doctor card, image/fallback, pagination. | → `/doctors/{approved-slug}/`; real pagination links remain without JS. |
| D5 | Replaces result region, never global controls. | Empty/unavailable state, retry/reset buttons, links, call fallback. | Clear query/filter, retry same request, → Services, or approved staffed call. |
| D6 | `support` after collection. | Call link, text links, footer. | Services/contact/appointment and global exits remain available. |

## Section map — responsive states and cross-cutting gates

| ID | Mobile, tablet, desktop behavior | Applicable states | Accessibility, bilingual, safety, privacy, performance, motion | Open decisions and approval gates |
| --- | --- | --- | --- | --- |
| D0 | Compact menu/emergency; full task nav wide; wraps under long translations. | Menu open/closed; current route; translation unavailable. | Logical focus, 44 px targets, no obscuring sticky UI, reduced motion. | Approved labels and language coverage. |
| D1 | Reading width at all sizes; actions stack compact. | Default; staffed route unavailable. | One H1, no inferred clinical advice, HTML first, copy expands ≥35%. | Search scope and contact ownership/hours. |
| D2 | Full-width search; compact Filters control; wide rail only when readable. | Pristine, query entered, filters active, applying, reset, unavailable filter data. | Persistent label; native controls; focus trap/return if dialog; no query sent to unapproved telemetry; 0–200 ms state motion. | Only name/specialty are currently supported; approve any additional filter independently. |
| D3 | Wraps above results at all widths. | Initial, filtered, paged, zero, error. | `aria-live="polite"` after committed action; no per-keystroke announcements. | Count grammar in English/Amharic. |
| D4 | One column compact, two medium, maximum three wide. | Default, image absent, optional field absent, record retired, loading only if async. | Neutral fallback does not infer gender; reserve image size; no live availability; canonical semantic links; lazy-load below fold. | Approve 17-record launch roster, resolve duplicate/unlinked URLs, approve image rights. |
| D5 | Single readable recovery panel. | No match, fetch failure, offline, roster unavailable, no JS. | Specific non-blaming text; no diagnosis; reset/retry keyboard operable; static server-rendered fallback. | Approved alternative/contact wording and retry behavior. |
| D6 | Stacked compact; quiet horizontal band wide. | Default; canonical contact unavailable = publication block. | Purpose-labeled visible number; same governed contact; no trackers. | Phone, purpose, hours, translation. |

## State inventory

| State | Presentation and recovery |
| --- | --- |
| Initial | Approved roster in deterministic default order; empty query; only approved filters visible; count stated. |
| Filtered/searched | Submitted terms and filters remain visible, encoded in a safe canonical URL, removable individually, and restored by Back/Forward. |
| Loading | Only for genuine async updates after roughly 300 ms; reserve result geometry, announce once, and keep prior context. Server-rendered navigation remains the baseline. |
| No matches | State the query/filter context, offer Clear all/change spelling, Services, and staffed contact; never suggest a diagnosis. |
| Data failure/offline | Explain the directory could not load, provide explicit Retry, Services and approved phone fallback; do not display stale records as current unless the cache policy is governed. |
| Empty roster | Not a valid public directory. Defer/unpublish the route and provide an approved care/contact alternative. |
| Retired/duplicate record | Remove from results; redirect only to a genuine approved successor, otherwise use honest unavailable/404 behavior. |
| No JavaScript/images/fonts | GET search, submitted native filters, result count, cards, pagination, and fallbacks remain usable; neutral image fallback or no image causes no gap. |

## Focus, URL, and reading order

```text
Skip → shell → H1/uncertainty routes → search → filters → active filters
→ result status → doctor cards in source order → pagination → support → footer
```

- Applying or clearing filters keeps focus on the initiating control and announces the new count.
- Closing compact filters restores focus to Filters. Browser Back closes a route-like overlay first only if that model is implemented consistently.
- URL state contains query, approved filters, sort/page where used—never personal form data. Refresh and shared links reproduce the same directory state.
- A paged result change exposes the result heading/status as the next logical context without forcing unexpected focus movement.

## Publication and approval gates

- Medical staff owner must reconcile and approve the current roster; the 15 profile-only records stay unpublished until confirmed (`D-001`).
- Content + Delivery must resolve the unlinked Dr. Abel Zemenfes card, duplicate Dr. Daniel Hailu card, and duplicate Dr. Abiy Worku URLs before canonical publication (`D-003`).
- Clinical + Content must approve specialty/service vocabulary, relationships, spellings, slugs, synonyms, result order, and any field beyond name/specialty (`D-002`, `V-001`).
- Portraits require an asset-rights decision; missing portraits use the governed neutral fallback or are omitted (`D-006`).
- Operations must approve the staffed uncertainty fallback, purpose, number, and hours (`C-001`).
- Delivery + QA must test keyboard/screen reader, URL/Back/Forward, 320 px/400% zoom, long bilingual labels, zero/error/offline/no-JS states, canonical URLs, and constrained-network performance.
