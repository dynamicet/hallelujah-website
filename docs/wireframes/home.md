# Home — Annotated Low-Fidelity Wireframe

**Route:** `/`  
**Primary question:** “Where should I start?”  
**Primary action:** Choose an essential care journey  
**Status:** Review structure; all bracketed facts and records are gated

## Requirement coverage

| Area | IDs |
| --- | --- |
| Global shell, responsive, accessibility, states, performance, governance, patient language | `G-001`–`G-016` |
| Security, privacy, language | `S-003`–`S-008` |
| Home and search | `H-001`–`H-005` |
| Emergency route | `E-001`, `E-005` |
| Doctor and service discovery | `D-001`–`D-003`, `V-001`, `V-003` |
| Contact and patient information | `C-001`–`C-003`, `P-001`–`P-002` |
| Institutional content | `I-001`–`I-003` |

`S-001` and `S-002` remain sitewide release/security gates but do not create visible Home sections.

## Mobile wireframe — 360 px review frame

```text
┌────────────────────────────────────┐
│ [Skip to main content]             │
│ {H0} [APPROVED LOGO]               │
│      [Emergency]          [Menu]   │
├────────────────────────────────────┤
│ MAIN                               │
│ {H1} H1: [TASK-LED INTRODUCTION]   │
│      One concise orientation line  │
│      [Request an appointment]      │
│      [Find a doctor]               │
│      [Emergency help →]            │
├────────────────────────────────────┤
│ {H2} H2: How can we help?          │
│      [Find a Doctor       →]       │
│      [Explore Services    →]       │
│      [Request Appointment →]       │
│      [Call hospital       →]       │
│      [Locations/Directions→]       │
├────────────────────────────────────┤
│ {H3} H2: Search this website       │
│      Label: Search doctors,        │
│      services and locations        │
│      [______________________]      │
│      [Search]                      │
├────────────────────────────────────┤
│ {H4} H2: Browse care by need       │
│      [APPROVED SERVICE GROUP →]    │
│      [APPROVED SERVICE GROUP →]    │
│      [View all services]           │
│      [OMIT WHEN EMPTY]             │
├────────────────────────────────────┤
│ {H5} H2: Find a doctor             │
│      [APPROVED DOCTOR CARD →]      │
│      [APPROVED DOCTOR CARD →]      │
│      [View all doctors]            │
│      [OMIT WHEN EMPTY]             │
├────────────────────────────────────┤
│ {H6} H2: Plan your visit           │
│      [Before your visit →]         │
│      [During your visit →]         │
│      [After your visit →]          │
│      Only approved useful topics   │
├────────────────────────────────────┤
│ {H7} H2: Visit or contact us       │
│      [VERIFY: canonical place]     │
│      [VERIFY: purpose + phone]     │
│      [VERIFY: address/landmark]    │
│      [Call] [Text directions]      │
│      No map in initial view        │
├────────────────────────────────────┤
│ {H8} H2: About the hospital        │
│      [APPROVED EVIDENCE-DATED      │
│       TRUST CONTENT ONLY]          │
│      [OMIT WHEN UNAPPROVED]        │
├────────────────────────────────────┤
│ {H9} Need help choosing?           │
│      [VERIFY: staffed fallback]    │
│      Footer: tasks | privacy |     │
│      accessibility | language     │
└────────────────────────────────────┘
```

## Desktop wireframe — 1280 px review frame

```text
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│ [Skip] [APPROVED LOGO] [Doctors] [Services] [Appointments] [Patient info] [Locations]     │
│                         [Search] [Language] [Call]                    [Emergency]       {H0} │
├────────────────────────────────────────────────────────────────────────────────────────────┤
│ ┌────────────────────────────────────────────────────────────────────────────────────────┐ │
│ │ H1 [TASK-LED INTRODUCTION]                                                            │ │
│ │ Concise orientation; static poster/media plane                                      │ │
│ │ [Play approved hospital film — optional, user initiated]                            │ │
│ │ [Request an appointment] [Find a doctor]             [Emergency help →]          {H1} │ │
│ └────────────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                            │
│ H2 How can we help?                                                                   {H2} │
│ [Doctor →] [Services →] [Appointment →] [Call →] [Locations/Directions →]                  │
│                                                                                            │
│ H2 Search this website                                                               {H3} │
│ Label [ Search doctors, services and locations _________________________ ] [Search]         │
│                                                                                            │
│ H2 Browse care by need                                                               {H4} │
│ [APPROVED SERVICE GROUP →] [APPROVED SERVICE GROUP →] [APPROVED GROUP →] [All services]   │
│                                                                                            │
│ H2 Find a doctor                                                                     {H5} │
│ [APPROVED DOCTOR CARD →] [APPROVED DOCTOR CARD →] [APPROVED DOCTOR CARD →] [All doctors] │
│                                                                                            │
│ H2 Plan your visit                                                                   {H6} │
│ [Before your visit →]       [During your visit →]       [After your visit →]              │
│                                                                                            │
│ ┌──────────────────────────────────────┐  ┌──────────────────────────────────────────────┐ │
│ │ H2 Visit or contact us          {H7} │  │ H2 About the hospital                 {H8} │ │
│ │ [VERIFY: place/contact/address]      │  │ [APPROVED CLAIMS ONLY; otherwise omit]     │ │
│ │ [Call] [Text directions]             │  │ [Optional poster + Play hospital film]     │ │
│ │                                       │  │ [About the hospital →]                     │ │
│ └──────────────────────────────────────┘  └──────────────────────────────────────────────┘ │
├────────────────────────────────────────────────────────────────────────────────────────────┤
│ [Need help choosing? VERIFIED STAFFED FALLBACK]                                        {H9} │
│ Footer: core tasks | canonical contacts | privacy | accessibility | language scope          │
└────────────────────────────────────────────────────────────────────────────────────────────┘
```

Desktop columns are visual only: `H7` precedes `H8` in the DOM. `H4`, `H5`, and `H8` collapse without leaving an empty heading or gap when their records are not approved.

## Section map — purpose, requirements, and content ownership

| ID | Purpose and user need | Requirement IDs | Content and owner dependencies |
| --- | --- | --- | --- |
| H0 | Identify the hospital and expose every global task predictably. | `G-001`–`G-006`, `G-010`, `S-006`–`S-008`, `H-001` | Approved logo/name and final labels: Brand + Product; canonical call record: Operations; translations: Clinical + Content. |
| H1 | Orient a stressed visitor and give immediate care, doctor, and separate emergency routes. | `H-001`, `H-002`, `G-001`, `G-012`, `E-001` | Task-led introduction: Content + Product; emergency label/route: Clinical + Operations; optional poster/video: Brand + Content + Accessibility + Delivery; no promotional claim without approval. |
| H2 | Make the five routine task categories plus emergency access scannable without knowing hospital departments. | `G-001`, `G-002`, `G-006`, `H-001` | Final patient-task labels: Product + Content; Call and Directions require `C-001`/`C-002` approval. |
| H3 | Let users directly search approved doctors, services, condition synonyms, and locations. | `H-005`, `G-007`, `G-011`, `S-005` | Governed taxonomy, synonyms, urgent-term list: Clinical + Product; analytics/data-flow decision: Privacy + Security. |
| H4 | Offer service recognition by patient need using one approved taxonomy. | `H-003`, `V-001`, `V-003`, `G-015` | Approved launch subset, names, groups, summaries, slugs: Clinical + Content. High-consequence claims remain blocked. |
| H5 | Provide a short route into the current approved clinician roster. | `H-003`, `D-001`–`D-003`, `G-015` | Featured selection and current roster: Medical staff owner + Content; canonical profile URLs: Delivery. |
| H6 | Reduce visit uncertainty through before/during/after tasks. | `P-001`, `P-002`, `G-015` | Hospital-authored useful topics only: Operations + Content + Privacy/legal. Missing stages are omitted, not fabricated. |
| H7 | Enable a call or successful arrival without requiring a map. | `C-001`–`C-003`, `G-007`, `G-014` | Canonical numbers/hours: Operations; entrance, landmark, text directions, accessibility: Facilities + Operations; optional map: Privacy + Delivery. |
| H8 | Build evidence-based institutional trust after care tasks, with the preferred alternate placement for user-controlled hospital film. | `H-002`, `H-004`, `I-001`–`I-003`, `G-012`, `G-014`, `G-015` | Story, facts, leadership, relationships, rights, sources, dates, and optional footage: Executive + Content + Brand; module/media blocked or omitted until approved. |
| H9 | Give a human fallback and repeat governance/privacy/access routes. | `G-001`, `G-007`, `S-004`, `C-001` | Staffed support purpose/hours: Operations; privacy notice: Privacy/legal; accessibility route: Product + Delivery. |

## Section map — layout, components, and outcomes

| ID | Layout and hierarchy | Reusable components | Interaction and navigation outcome |
| --- | --- | --- | --- |
| H0 | Compact shell above content; full task navigation wide. Emergency is separated from routine actions. | Skip link, header, primary navigation, mobile menu, language switcher, search link, call link, emergency action. | Logo → `/`; menu exposes all tasks; Emergency → `/emergency/`; Call → approved `tel:`; Search → `/search/`; language keeps `/`. |
| H1 | `intro`; one H1, short summary, primary/secondary routine actions, separately styled emergency link, and optional static-first media plane. | Page introduction, Primary/Secondary button, Emergency action, approved poster/Play/Pause media controls. | Appointment → `/appointments/`; doctor → `/doctors/`; emergency → `/emergency/`. No auto-rotation or pre-intent video request. |
| H2 | `action-group`; stacked cards compact, up to five equal task actions wide. | Icon-and-label action or task link; no fully clickable ambiguous container. | Routes to `/doctors/`, `/services/`, `/appointments/`, approved `tel:`, and `/contact/`. |
| H3 | `content`; visible label, search field and submit; no autocomplete dependency. | Search box, input, button; autocomplete only as progressive enhancement. | GET → `/search/?q=…`; urgent-term handling occurs on results; safe query state survives Back/Forward. |
| H4 | `collection`; concise cards after heading; no diagnosis language. | Service card, text link. | Card → canonical `/services/{slug}/`; all → `/services/`. |
| H5 | `collection`; maximum three featured items wide, one column compact. | Doctor card, neutral portrait fallback, text link. | Card → canonical `/doctors/{slug}/`; all → `/doctors/`. |
| H6 | `action-group`; before/during/after in logical source order. | Icon-and-label links. | → maintained routes under `/patient-information/`; unavailable topics do not create empty pages. |
| H7 | `support`/location card; text data and actions precede any map. | Location/contact card, call link, optional map launcher. | Call → approved `tel:`; directions → `/contact/` or maintained deep link; map only after explicit approved action. |
| H8 | `content`; lower priority than patient tasks; evidence-dated summary with optional static-first media plane. | Review metadata, text link, governed poster, labeled Play/Pause/Stop controls. | → `/about/`; optional film loads only after Play; no unsupported claim is clickable or shown. |
| H9 | `support` then footer. | Call link, footer, text links. | Approved support call; routes to privacy, accessibility, contact, and all core tasks. |

## Section map — responsive states and cross-cutting gates

| ID | Mobile, tablet, desktop behavior | Applicable states | Accessibility, bilingual, safety, privacy, performance, motion | Open decisions and approval gates |
| --- | --- | --- | --- | --- |
| H0 | Compact logo/menu/emergency; tablet wraps before crowding; desktop exposes primary nav. | Menu default/open/close; current route; unavailable translation. | Logical focus; 44 px targets; Amharic labels wrap; no hidden emergency; menu motion ≤200 ms/reduced. | Logo/labels; exact Call behavior; Phase 1 translations. |
| H1 | Actions stack compact and may align inline wide. Approved media follows content and never pushes tasks below the first useful view; mobile uses the poster and may open a dedicated player after activation. | Default poster; video available/playing/paused/ended/failed; image/video absent; Emergency route unavailable blocks release. | One H1; stable reading order; no text in media; no autoplay or video request before Play; keyboard/touch/AT controls; complete reduced-motion/Save-Data still; no unverified safety copy. | Final introduction; authentic footage, rights/consent, visual/Brand approval; Emergency route approval; performance/accessibility evidence. |
| H2 | One column compact, 2–3 tablet, five-item row or balanced grid wide when labels fit. | Default; individual destination unavailable only with truthful useful alternative. | 44/48 px targets; no hover-only affordance; text labels translate and wrap. | Usability-test labels/order. |
| H3 | Field/button may stack at 320; align wide if both remain ≥44 px and label readable. | Empty query validation; loading only for enhancement; results redirect; service failure on results page. | Semantic GET works without JS; no sensitive query analytics before approval; status not motion-dependent. | Taxonomy, urgent terms, query analytics. |
| H4 | One compact, two tablet, up to three wide; whole section disappears when empty. | Default; loading only if truly async; empty omitted; data error offers Services/contact routes. | Approved records only; reserve optional media; no inferred care recommendation. | Taxonomy and feature owners. |
| H5 | Same collection reflow as H4; names never truncate. | Default; loading; empty omitted; record/data error gives directory route. | Current roster only; neutral fallback; no availability claim; lazy media below initial view. | Roster, features, portraits, canonical URLs. |
| H6 | One compact; may become three equal groups wide. | Default; unavailable topics omitted; all unavailable → staffed fallback only. | Plain links; no false completeness; translated Phase 1 routes disclose scope. | Minimum launch guidance and owners. |
| H7 | One column compact; may pair with H8 wide but remains first in DOM. | Default; map loading/failure; missing canonical data blocks module/release; temporary status. | Text-first, JS-independent; no third-party map request initially; labels/numbers match canonical record. | Contacts, hours, entrance, directions, map review. |
| H8 | One compact; paired lower section wide; omitted with no gap when unapproved. Media may open in a dedicated player compact. | Default poster, playing/paused/ended/failed, reduced/Save-Data still, omitted; expired governed content removed. | Evidence dates/owners; approved image/footage rights and consent; zero pre-intent request; accessible controls; no autoplay or motion-led claim. | Executive/claim-ledger/brand/media/accessibility/performance approval. |
| H9 | Full-width support/footer; link groups stack compact and wrap wide. | Default; contact unavailable is a release gate; translation limitation. | Landmarks, accessible names, language metadata; no personal data; no sticky obstruction. | Staffed fallback, privacy notice, accessibility contact. |

## Page state inventory

| State | Presentation and recovery |
| --- | --- |
| Default | `H0`–`H3`, `H6` where useful content exists, `H7`, and `H9`; optional `H4`, `H5`, `H8` only with approved records. |
| Initial loading | Static shell, task links, search form, and canonical contact HTML render immediately. Do not skeleton the emergency or contact route. Optional record collections may reserve stable card space only if server rendering cannot provide them. |
| Empty search input | Submission keeps focus near `H3` and shows “Enter a doctor, service, or location” only after an attempted empty submit; wording requires Content review. |
| Empty optional collection | Omit the entire `H4`, `H5`, or `H8` section and spacing. Never show “coming soon,” dummy people, or generic claims. |
| Collection failure | Preserve all essential task routes; replace only the failed collection with a concise explanation plus its directory and approved call fallback. |
| Search unavailable | Keep the query, explain that search is unavailable, and offer Doctors, Services, Contact, and Emergency routes. No diagnosis inference. |
| Unavailable translation | Stay on `/`, explain current coverage, and link to translated emergency/contact/appointment routes where available. |
| No JavaScript | Header links, menu fallback, task links, GET search, telephone links, text contact/directions, and footer remain usable. Autocomplete, map, and async enhancements may be absent. |

## Focus and reading order

```text
Skip → logo → compact Emergency → menu (or wide navigation) → H1
→ H1 actions → essential actions → search label/input/submit
→ approved service links → approved doctor links → visit links
→ location call/directions → approved About link → support → footer
```

Omitted modules leave no focus gap. Search updates do not announce on every keystroke; submission navigates to a titled results page. The language switch preserves the current Home context.

## Page approval gates

- Home cannot present a canonical Call or location summary until `C-001` and `C-002` are reconciled.
- Search cannot claim reliable matching or urgent-term behavior until Clinical + Product approve taxonomy, synonyms, and urgent terms (`H-005`).
- Featured doctor/service modules remain absent until their governed selections and canonical records are approved (`H-003`, `D-001`, `V-001`).
- Trust content remains absent until every claim, relationship, logo right, owner, source, and date is approved (`H-004`, `I-001`–`I-003`).
- Phase 1 release requires approved Amharic safety-critical labels/content and honest unavailable-translation behavior (`S-006`–`S-008`).

### November 2026 ready-preview enhancement

The ready local preview's implemented sequence is hero + unified Doctor/Service
search; compact concern finder; image-led specialty selection; three doctors;
human-care scene + figures + two expandable stories; visit preparation + arrival;
partners; one editorial lead + two links; shared care footer. This replaces the
preview's separate navigator, film trigger and disconnected evidence/story modules.
The governed template's data eligibility and unavailable-state rules are unchanged.
See [implementation and visual evidence](../visual-design/home-enhancement.md).
