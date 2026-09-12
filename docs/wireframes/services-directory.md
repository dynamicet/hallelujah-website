# Services Directory — Annotated Low-Fidelity Wireframe

**Route:** `/services/`  
**Primary question:** “Which service fits my need?”  
**Primary action:** Open an approved service detail page  
**Status:** Publication-blocked pending patient-oriented taxonomy, synonym, scope, and launch-subset approval

This directory supports recognition and navigation. It does not diagnose, recommend treatment, or estimate urgency.

## Requirement coverage

| Area | IDs |
| --- | --- |
| Global shell, responsive, accessibility, states, performance, governance, patient language | `G-001`–`G-016` |
| Language and privacy-safe search | `S-005`–`S-008` |
| Site search/urgent-term boundary | `H-005` |
| Emergency route | `E-001`–`E-003` |
| Service taxonomy and content | `V-001`–`V-005` |
| Doctor and staffed fallback routes | `D-001`–`D-003`, `A-001`–`A-003`, `C-001` |

## Mobile wireframe — 360 px review frame

```text
┌────────────────────────────────────┐
│ [Skip to main content]             │
│ {S0} [APPROVED LOGO]               │
│      [Emergency]          [Menu]   │
├────────────────────────────────────┤
│ MAIN                               │
│ {S1} H1: Services                  │
│      Find approved care by service │
│      name or recognized need term. │
│      Not sure? [Request help]      │
│      or [VERIFY: staffed contact]  │
├────────────────────────────────────┤
│ {S2} [STATIC GOVERNED URGENT       │
│      EXCEPTION, IF APPLICABLE]     │
│      [Emergency help]              │
├────────────────────────────────────┤
│ {S3} Label: Search services        │
│      [service or approved term__]  │
│      [Search] [Clear, when filled] │
│      [Browse groups (n)]           │
│      [Active group ×] [Clear all]  │
├────────────────────────────────────┤
│ {S4} Status: [N] services          │
├────────────────────────────────────┤
│ {S5} H2: [APPROVED GROUP NAME]     │
│      ┌──────────────────────────┐  │
│      │ [APPROVED SERVICE NAME] │  │
│      │ [approved short summary]│  │
│      │ [Learn about service →] │  │
│      └──────────────────────────┘  │
│      [additional approved cards]   │
│      [approved groups only]        │
│      [Pagination, if needed]       │
├────────────────────────────────────┤
│ {S6} [STATE: no results OR         │
│      recoverable data failure]     │
│      spelling/reset/nearby groups  │
│      + request help + staffed call │
├────────────────────────────────────┤
│ {S7} Still not sure?               │
│      [Request an appointment]      │
│      [Find a doctor] [Call]        │
│      Footer                        │
└────────────────────────────────────┘
```

The five extracted group labels—Access and Hospital Care, Medicine, Surgery, Women and Children, and Specialty and Rehabilitation—are taxonomy candidates only. The public UI uses them, revised labels, or a smaller group set only after Clinical + Content approval.

## Desktop wireframe — 1280 px review frame

```text
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│ [Skip] [APPROVED LOGO] [Doctors] Services (current) [Appointments] [Patient info]          │
│                         [Locations] [Search] [Language] [Call] [Emergency]               {S0}│
├────────────────────────────────────────────────────────────────────────────────────────────┤
│ H1 Services                                                                            {S1}│
│ Find approved care by service name or recognized need term. [Request help] [Staffed call]  │
│ [GOVERNED URGENT EXCEPTION + Emergency help, only when applicable]                     {S2}│
│                                                                                            │
│ Label: Search services [ service or approved term ________________________ ] [Search]   {S3}│
│                                                                                            │
│ ┌────────────────────────────┐  ┌────────────────────────────────────────────────────────┐ │
│ │ H2 Browse by group         │  │ Status: [N] services                               {S4} │ │
│ │ [APPROVED GROUPS ONLY]     │  │ H2 [APPROVED GROUP]                               {S5} │ │
│ │ [Apply/reset if submitted] │  │ [SERVICE CARD] [SERVICE CARD] [SERVICE CARD]             │ │
│ │                        {S3}│  │ H2 [APPROVED GROUP]                                    │ │
│ └────────────────────────────┘  │ [SERVICE CARD] [SERVICE CARD]                           │ │
│                                 │ [Pagination]                                            │ │
│                                 └────────────────────────────────────────────────────────┘ │
│ [STATE: no matches/failure replaces grouped results, not search or recovery]            {S6}│
├────────────────────────────────────────────────────────────────────────────────────────────┤
│ Still not sure? [Request an appointment] [Find a doctor] [purpose-labeled staffed call] {S7}│
│ Footer                                                                                    │
└────────────────────────────────────────────────────────────────────────────────────────────┘
```

The browse rail is a single taxonomy control, not a competing “Departments” navigation. It precedes the count/results in DOM order and collapses into the compact disclosure when space or zoom requires it.

## Section map — purpose, requirements, and content ownership

| ID | Purpose and user need | Requirement IDs | Content and owner dependencies |
| --- | --- | --- | --- |
| S0 | Preserve essential task, emergency, language, and contact access. | `G-001`–`G-006`, `S-006`–`S-008` | Approved shell identity/labels: Brand + Product; contact and translations: Operations + Content. |
| S1 | Explain the directory's recognition role and offer human/request help. | `V-001`, `A-001`–`A-003`, `C-001`, `G-010` | Approved plain-language scope, request semantics, staffed purpose/hours: Clinical + Operations + Content. |
| S2 | Route urgent needs safely without turning search into triage. | `H-005`, `E-001`–`E-003`, `V-002` | Clinically governed urgent exception and verified emergency route: Clinical + Operations; omit if not approved. |
| S3 | Search by approved service name/synonym and browse one maintained patient taxonomy. | `V-001`, `H-005`, `G-005`, `G-011` | Groups, canonical names, synonyms, slugs, relationships, Amharic equivalents: Clinical + Content. |
| S4 | Confirm submitted search/group changes. | `V-001`, `G-010`, `G-011` | Count grammar/translations and update behavior: Content + Delivery + QA. |
| S5 | Let visitors recognize approved services through concise, non-diagnostic summaries. | `V-001`–`V-004`, `G-013`–`G-015` | Launch records, summary, group, synonyms, canonical URL, clinical review and claims ledger: Clinical + Content + Operations. |
| S6 | Recover without guessing a diagnosis when no service matches or data fails. | `V-001`, `G-007`, `G-011`, `A-003`, `C-001` | Spelling/reset/nearby-group copy, Not sure route, staffed phone/hours: Product + Operations + Content. |
| S7 | Give safe next steps when self-selection remains uncertain. | `G-001`, `V-001`, `D-001`–`D-003`, `A-001`–`A-003`, `C-001` | Approved request, doctor, and staffed-contact routes: Operations + Medical staff owner + Content. |

## Section map — layout, components, and outcomes

| ID | Layout and hierarchy | Reusable components | Interaction and navigation outcome |
| --- | --- | --- | --- |
| S0 | Flat top-level shell; no breadcrumb. | Skip link, header/menu, language switcher, emergency/call actions. | Global canonical routes; route/query retained on language switch when approved. |
| S1 | `intro`; H1, scope, uncertainty alternatives. | Page introduction, appointment action, call/text links. | → `/appointments/?care=not-sure`, Contact call; language never implies diagnosis. |
| S2 | Static visible alert after intro and before search when governed. | Emergency/warning alert, Emergency action. | → `/emergency/` or approved explicit `tel:` according to global policy; never hidden in disclosure. |
| S3 | Search first, then one group filter; compact disclosure/wide rail. | Search box, filter group, active chip, buttons. | GET URL state; Apply/Clear/Back/Forward restore query/group/page. |
| S4 | Status immediately before grouped collection. | Result count/status. | Polite announcement after committed action; initiator keeps focus. |
| S5 | `collection` grouped by approved taxonomy; one destination per card. | Service card, heading group, pagination. | → `/services/{approved-slug}/`; real links work without JS. |
| S6 | Recovery replaces results only. | Empty/unavailable state, retry/reset, safe links, call fallback. | Change/clear query, browse group, request Not sure, or call staffed contact. |
| S7 | `support` after results. | Appointment action, text/call links, footer. | → Appointments, Doctors, Contact; never auto-selects care. |

## Section map — responsive states and cross-cutting gates

| ID | Mobile, tablet, desktop behavior | Applicable states | Accessibility, bilingual, safety, privacy, performance, motion | Open decisions and approval gates |
| --- | --- | --- | --- | --- |
| S0 | Compact menu/emergency; full task nav wide. | Menu/current route/translation unavailable. | 44 px controls; logical focus; labels wrap ≥35%; reduced motion. | Approved labels and parity scope. |
| S1 | Reading width; actions stack compact. | Default; help route unavailable. | One H1, no symptom checker framing, semantic HTML. | Intro wording and staffed routing ownership. |
| S2 | Full-width, in flow, never dismissible/collapsed. | Approved and shown; absent if not governed; expired = remove/block affected claim. | Static screen-reader-readable warning; no color-only meaning; approved Amharic safety copy; no diagnosis/urgency estimate. | Urgent terms/exceptions, wording, route, translation. |
| S3 | Full search; group disclosure compact, rail wide. | Pristine, query/group active, applying/reset, taxonomy unavailable. | Persistent label, native controls, focus-managed overlay; query not sent to unapproved analytics; no per-keystroke announcement. | Approve one taxonomy, group labels/order, names/synonyms in both languages. |
| S4 | Wraps above results. | Initial, filtered, paged, no match, failure. | Polite status after action; count not color-only. | Count grammar. |
| S5 | One card compact, two medium, max three wide; groups stack. | Approved subset, missing optional summary data, high-consequence claim withheld, record retired. | No diagnosis; no unapproved capability; semantic headings/links; no imagery dependency; server render/lazy optional media. | Approve up to 39 records or smaller Phase 1 subset, correct copy/taxonomy overlaps, claims ledger. |
| S6 | One readable panel. | No match, data failure, offline, empty approved subset, no JS. | Non-blaming recovery; does not guess care; explicit actions; staffed fallback. | Nearby-group policy, safe copy, fallback number/hours. |
| S7 | Stacked compact, quiet band wide. | Default; appointment or contact unavailable. | Request wording never implies booking; purpose-labeled phone; no dead end. | Not sure routing and contact scope. |

## State inventory

| State | Presentation and recovery |
| --- | --- |
| Initial | Approved launch subset grouped by the one approved taxonomy; deterministic order; empty search; count visible. |
| Searched/grouped | Query and one approved group remain visible and in the URL; result count and matching group headings update. |
| Loading | Only for genuine async work after roughly 300 ms; keep search context and geometry stable. Server-rendered submitted navigation remains the baseline. |
| No matches | Repeat safe search context, offer spelling change, Clear all, approved nearby groups, Not sure appointment route, and staffed contact; no diagnostic suggestions. |
| Data failure/offline | Explain failure, offer Retry and approved call/request alternatives. Do not present cached operational/clinical records as current without a governed cache policy. |
| No approved services | Do not publish an empty directory. Defer the route and provide an approved staffed/request alternative. |
| Record/claim withheld | Omit the record or unsupported field/capability cleanly. Never replace it with generic filler or infer a similar service. |
| No JavaScript/images/fonts | GET search, native group control, grouped service links, pagination, urgent/static fallback, and support actions remain usable. |

## Search, taxonomy, and safety rules

- Search accepts only approved names, spelling variants, and English/Amharic need/condition synonyms. A synonym helps recognition; it is not a statement that a visitor has a condition.
- Approved urgent-term behavior shows governed emergency guidance before ordinary results. It never estimates urgency, diagnoses, or recommends treatment.
- One canonical taxonomy drives group navigation, search labels, service URLs, cards, and service-to-doctor relationships. “Departments” is not a second public directory.
- Phase 1 may contain fewer than the 39 extracted records. Counts, groups, and navigation derive only from the approved published subset.
- Search analytics remain off until Privacy approves collection purpose and sensitive-query handling.

## Focus, URL, and reading order

```text
Skip → shell → H1/help routes → governed urgent exception → search → group filter
→ active state → result count → group headings/service cards → pagination → support → footer
```

- Applying/clearing keeps focus on the initiator and politely announces the result count.
- Compact group disclosure/dialog returns focus to its trigger on close; Escape never clears the query.
- URL preserves query, approved group, and page. Back/Forward and shared links reproduce the view without analytics dependence.
- Results are not live-filtered on every keystroke in the baseline; autocomplete, if later used, is progressive enhancement under the component contract.

## Publication and approval gates

- Clinical + Content approve one patient-oriented taxonomy: groups, names, synonyms, spellings, slugs, service-to-doctor relationships, translations, and launch subset (`V-001`, `V-004`, `V-005`).
- Clinical + Executive approve or withhold every high-consequence capability through the claim ledger (`V-003`).
- Clinical + Operations approve any urgent exception, emergency route, service summary/scope, and staffed fallback (`V-002`, `E-001`–`E-003`).
- Content QA resolves known copied headings, duplicated Ophthalmology/Speech Therapy copy, misspellings, and overlaps before migration (`V-004`).
- Privacy approves any query analytics or third-party autocomplete; otherwise neither sends requests (`S-005`).
- Delivery + QA test keyboard/screen reader, 320 px/400% zoom, bilingual expansion, URL/Back/Forward, zero/error/offline/no-JS states, taxonomy integrity, canonical links, and constrained performance.
