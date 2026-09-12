# Search Results — Annotated Low-Fidelity Wireframe

**Route:** `/search/?q={query}`  
**Primary question:** “Where is the information I need?”  
**Primary action:** Open an approved canonical result  
**Status:** Conditionally publishable only after taxonomy, synonyms, urgent-term behavior, ranking, privacy and translation decisions are approved

Search is navigation, not a symptom checker. It does not diagnose, recommend treatment or a clinician, estimate urgency, or infer that the visitor has a condition. Queries may be sensitive even when the interface does not request personal data.

## Requirement coverage

| Area | IDs |
| --- | --- |
| Global shell, accessibility, fallback, states, performance, canonical content, patient language | `G-001`–`G-016` |
| Privacy, third parties, security, Amharic and context switching | `S-002`–`S-008` |
| Site search and urgent-term routing | `H-005` |
| Emergency behavior | `E-001`–`E-005` |
| Doctor and service records | `D-001`–`D-004`, `V-001`–`V-005` |
| Contact and patient guidance | `C-001`–`C-003`, `P-001`–`P-002` |

## Mobile wireframe — 360 px review frame

```text
┌────────────────────────────────────┐
│ [Skip to main content]             │
│ {SR0} [APPROVED LOGO]              │
│       [Emergency]         [Menu]   │
├────────────────────────────────────┤
│ MAIN                               │
│ {SR1} H1: Search results           │
│       Label: Search this website   │
│       [retained query__________]   │
│       [Search] [Clear if filled]   │
│       Use a name/service/place;    │
│       [VERIFY: privacy-safe hint]  │
├────────────────────────────────────┤
│ {SR2} [STATE: APPROVED URGENT-TERM │
│       MATCH ONLY]                  │
│       H2: Emergency help           │
│       [VERIFY: governed guidance]  │
│       [Explicit call action]       │
├────────────────────────────────────┤
│ {SR3} [Result types (n)]           │
│       [All] [Doctors] [Services]   │
│       [Guides] [Locations]         │
│       APPROVED TYPES ONLY          │
├────────────────────────────────────┤
│ {SR4} Status: [N] results for      │
│       “[retained query]”           │
├────────────────────────────────────┤
│ {SR5} [APPROVED RESULTS ONLY]      │
│       Type: [Doctor/Service/Guide/ │
│              Location]             │
│       [Canonical result title →]   │
│       [Approved match context]     │
│       [additional results]         │
│       [Pagination]                 │
├────────────────────────────────────┤
│ {SR6} [STATE: correction / zero    │
│       results / failure / offline] │
│       edit/reset/retry + Doctors + │
│       Services + Contact           │
├────────────────────────────────────┤
│ {SR7} Cannot find what you need?   │
│       [VERIFY: staffed call]       │
│       [Request help] [Contact →]   │
│       Footer                       │
└────────────────────────────────────┘
```

`SR2` is absent unless the submitted term matches the clinically approved urgent-term policy. It precedes filters and ordinary results, stays visible when results are filtered, and never states that the visitor is experiencing an emergency.

## Desktop wireframe — 1280 px review frame

```text
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│ [Skip] [APPROVED LOGO] [Doctors] [Services] [Appointments] [Patient info] [Locations]     │
│                         Search (current) [Language] [Call] [Emergency]                  {SR0}│
├────────────────────────────────────────────────────────────────────────────────────────────┤
│ H1 Search results                                                                      {SR1}│
│ Label: Search this website [ retained query _________________________________ ] [Search]    │
│ [VERIFY: concise privacy-safe scope hint; no request for symptoms or personal details]     │
│ [APPROVED URGENT-TERM GUIDANCE + explicit call action; when matched]                  {SR2}│
│                                                                                            │
│ ┌────────────────────────────┐  ┌────────────────────────────────────────────────────────┐ │
│ │ H2 Filter by result type   │  │ Status: [N] results for “[query]”                {SR4}│ │
│ │ [APPROVED TYPES + counts]  │  │                                                        │ │
│ │ [Apply/reset if submitted] │  │ [TYPE] [Canonical title →]                      {SR5}│ │
│ │                       {SR3}│  │ [Approved context snippet]                            │ │
│ └────────────────────────────┘  │ [TYPE] [Canonical title →]                            │ │
│                                 │ [Pagination]                                          │ │
│                                 └────────────────────────────────────────────────────────┘ │
│ [STATE: correction/zero/failure replaces result region, never search or urgent help] {SR6}│
├────────────────────────────────────────────────────────────────────────────────────────────┤
│ Cannot find what you need? [VERIFY: staffed call] [Request help] [Contact →]           {SR7}│
│ Footer                                                                                     │
└────────────────────────────────────────────────────────────────────────────────────────────┘
```

The type rail precedes the count and results in DOM order. It becomes a focus-managed disclosure or submitted native control when columns no longer fit. Types with no approved searchable records are absent; a filter never exposes unpublished records.

## Search result contract

| Result type | Required visible content | Publication boundary |
| --- | --- | --- |
| Doctor | Type label, approved name, specialty/service context, canonical profile link | Current approved roster only; no schedule/live availability |
| Service | Type label, approved patient-facing name, short scope/match context, canonical detail link | Approved launch taxonomy/scope only; no inferred capability |
| Guide | Type label, approved guide title, stage/topic context, maintained canonical link | Hospital-authored current guidance only; no empty topic page |
| Location | Type label, canonical place name, approved address/landmark context, canonical contact link | Reconciled maintained location record only; no raw coordinates as the sole context |

Snippets explain why a governed page matches using approved page content or a separately governed search description. They never echo arbitrary query text as HTML, fabricate a medical relationship, or expose unpublished fields.

## Section map — purpose, requirements, and ownership

| ID | Purpose and user need | Requirement IDs | Content and owner dependencies |
| --- | --- | --- | --- |
| SR0 | Keep global care, emergency, contact and language routes available. | `G-001`–`G-006`, `S-006`–`S-008` | Approved identity/labels: Brand + Product; contacts/translations: Operations + Content. |
| SR1 | Let visitors submit or revise a bounded navigational query and understand safe scope. | `H-005`, `G-005`, `G-007`, `S-005` | Search label, examples, privacy hint, query limits and normalization: Product + Clinical + Privacy + Content. |
| SR2 | Route approved urgent-term matches to verified help before ordinary content without triage. | `H-005`, `E-001`–`E-005`, `S-006` | Term list/policy and wording: Clinical + Product; number/purpose: Operations; translation: Clinical + Content. |
| SR3 | Narrow results by maintained public content type only. | `H-005`, `G-011`, `D-001`, `V-001`, `P-001`, `C-001` | Searchable types, labels and counts: Product + Content; each index derives from approved records. |
| SR4 | Confirm the committed query/filter outcome. | `G-010`, `G-011`, `H-005` | Count/query grammar in both languages: Content + Delivery + QA. |
| SR5 | Connect to accurate, canonical approved content with useful typed context. | `H-005`, `G-013`–`G-015`, `D-001`–`D-004`, `V-001`–`V-005`, `C-001`–`C-002`, `P-001`–`P-002` | Indexed fields, ranking, snippets, canonical URLs, owners and review status: Clinical + Content + Operations + Delivery. |
| SR6 | Recover from correction, no-match, unavailable index, failure or offline state without guessing. | `G-007`, `G-011`, `H-005`, `C-001` | Approved correction threshold, recovery copy, safe destinations and staffed fallback: Product + Operations + Content. |
| SR7 | Provide human and task-based alternatives when search cannot resolve the need. | `G-001`, `A-001`–`A-003`, `C-001` | Staffed purpose/hours and Not sure request route: Operations + Product. |

## Section map — layout, components, and outcomes

| ID | Layout and hierarchy | Reusable components | Interaction and navigation outcome |
| --- | --- | --- | --- |
| SR0 | Flat utility route; no breadcrumb. | Skip link, header/menu, language switcher, essential actions. | Global routes; language preserves a safe query/filter only when equivalent search behavior is approved. |
| SR1 | `intro` plus visible GET search; input/button may stack compact. | Search box, clear control, input hint. | GET → `/search/?q=…`; empty submit returns specific validation; autocomplete is optional enhancement only. |
| SR2 | Static, non-dismissible alert before filters/results. | Emergency alert/action, Call link. | → `/emergency/` or approved explicit `tel:`; never auto-calls or blocks ordinary results. |
| SR3 | Type filter disclosure compact, rail wide. | Native filter group, active chip, Apply/Clear. | Updates safe `q`, `type`, `page` URL state; Back/Forward/share restore the view. |
| SR4 | Status directly before result collection. | Result count/status. | Polite announcement after committed action; focus stays on initiator. |
| SR5 | One-column typed result list for scan consistency. | Typed result card/list item, pagination. | Opens one canonical URL; real pagination links work without JS. |
| SR6 | Replaces ordinary results only; urgent guidance remains when matched. | Correction prompt, empty/error/offline state, Retry/Clear links. | Accept correction explicitly, edit/reset, retry, or open safe directories/Contact. |
| SR7 | `support` plus footer. | Call link, appointment action, text links, footer. | Staffed `tel:`, `/appointments/?care=not-sure`, `/contact/`, core tasks. |

## Section map — responsive states and cross-cutting gates

| ID | Mobile, tablet, desktop behavior | Applicable states | Accessibility, bilingual, safety, privacy, performance, motion | Open decisions and approval gates |
| --- | --- | --- | --- | --- |
| SR0 | Compact menu/emergency; full nav wide. | Menu/current route/translation unavailable. | Logical focus, 44 px targets, ≥35% expansion, reduced motion. | Labels and Phase 1 search-language scope. |
| SR1 | Field/button stack at 320 if needed; full width within standard container. | Empty, entered, submitting, normalized query, over limit. | Persistent label, no per-keystroke announcements, escaped output, GET/no-JS baseline; no personal-detail prompt. | Query length/normalization, hint copy, logging/retention/referrer policy. |
| SR2 | Full-width at every size; never inside filter rail/disclosure. | Governed match shown; no match absent; policy/index unavailable = search publication block. | Not color-only; static reading; approved Amharic; explicit safe call activation; never infers user condition. | Urgent terms, match rules, wording, route and number. |
| SR3 | Disclosure/native submitted control compact; rail wide only when readable. | No filter, active filter, applying/clearing, type unavailable. | Native semantics, focus restore, counts not color-only; filters cannot surface gated content. | Searchable types, labels and filter threshold/order. |
| SR4 | Wraps before results; long query is safely truncated visually only with full accessible context. | Initial results, filtered, paged, zero, failure. | Polite status after action; escaped query; no unexpected focus jump. | Count grammar and safe query display rule. |
| SR5 | One-column list at all widths; context remains readable. | Current results, page change, stale record removed, partial optional snippet. | Semantic headings/links, type in text, no hover-only action; server-rendered; no images required. | Ranking, index freshness, snippet source and canonical-removal SLA. |
| SR6 | One readable panel. | Suggested correction, zero results, search failure, timeout/offline, index unavailable, no JS. | Non-blaming; correction requires action; retry retains safe query; no diagnosis or treatment suggestion. | Correction policy, safe alternatives, failure copy and cache policy. |
| SR7 | Full-width support; actions stack compact. | Default, staffed route unavailable = publication block. | Purpose/number/hours visible; request wording not booking; no telemetry dependency. | Staffed fallback and Not sure routing. |

## State inventory

| State | Presentation and recovery |
| --- | --- |
| Initial/no query | H1 and search remain. After an attempted empty submit, show specific validation and safe task links; do not show an artificial “all results” index. |
| Results | Retain escaped query and active type/page in URL; show typed approved records in deterministic governed ranking with a stated count. |
| Approved urgent-term match | Show `SR2` before all ordinary results and keep it across type/paging state. It is guidance triggered by a term, not a conclusion about the user. |
| Suggested correction | Present the submitted term and proposed approved correction as an explicit choice; never silently replace clinically meaningful wording. |
| Zero results | Retain query, offer edit/clear, approved spelling guidance, Doctors, Services, Patient Information, Contact and staffed help. Do not suggest a diagnosis. |
| Failure/timeout/offline | Keep the query, state that results could not be retrieved, offer Retry and safe task/contact routes. Do not present an ungoverned stale index as current. |
| Unpublished/expired record | Remove promptly from index and filters. Redirect only at its destination when a genuine approved successor exists; search never leaks the title/snippet. |
| No JavaScript/fonts/images | GET search, urgent guidance, submitted type filter, count, typed result links, pagination and recovery work in semantic HTML. |

## Privacy and query handling boundary

- Search asks for public navigational terms such as a doctor, service, guide or place; it does not solicit a patient name, contact details, medical history or free-form care narrative.
- The query remains in the URL to support GET/no-JavaScript, refresh, Back/Forward and sharing. The interface must therefore warn against personal details using approved concise copy and treat the URL as potentially sensitive.
- Before launch, Privacy + Security define query logging, access, retention, deletion/redaction, abuse monitoring, cache behavior and referrer policy. Search pages must not leak queries to third-party assets or outbound referrers.
- Analytics, session replay, pixels, chat and remote autocomplete receive no query or query-derived classification unless a named purpose, minimization method, retention and approval exist. Search remains functional without them.
- Rendered query text is escaped and length-limited; safe errors never echo internal syntax. Clinical synonyms and urgent matching use approved normalized terms without storing a diagnosis label about the visitor.

## Focus, URL, and reading order

```text
Skip → shell → H1/search label/input/submit → urgent guidance when matched
→ type filters → result status → typed canonical results → pagination
→ correction/zero/failure recovery when applicable → staffed support → footer
```

- Committed search/filter changes keep focus on the initiator and announce the count. Pagination exposes the result status as the next logical context without forcing an unexpected focus jump.
- URL contains only bounded query, approved type and page parameters. It contains no form/contact data or inferred diagnosis. Clear removes search state; Back/Forward restores it.
- A language switch retains the query only if approved cross-language normalization and the urgent-term policy are equivalent. Otherwise it stays in place, explains the limitation and offers safe translated routes.

## Publication and approval gates

- Clinical + Product approve searchable taxonomy, English/Amharic names and synonyms, spelling variants, urgent terms/match policy, correction behavior, relevance tasks and non-diagnostic wording (`H-005`).
- Medical staff, Clinical, Operations and Content approve every indexed record and field; publication/unpublication must update the index without leaking gated content (`D-001`, `V-001`–`V-003`, `P-002`, `C-001`).
- Operations approves the staffed fallback and emergency contact; Clinical approves urgent guidance; Content provides professional Amharic review (`E-001`–`E-003`, `S-006`).
- Privacy + Security approve logs, retention, access, referrer/cache behavior, analytics and any autocomplete/third-party flow; without approval, query analytics and remote suggestions stay off (`S-005`).
- Delivery + QA test relevance and urgent routing in both languages, XSS/escaping and length limits, index freshness, URL/Back/Forward, keyboard/screen reader, 320 px/400% zoom, no match, failure/offline/no-JS, constrained network and absence of query leakage.
