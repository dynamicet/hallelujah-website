# Patient & Visitor Information — Annotated Low-Fidelity Wireframe

**Route:** `/patient-information/`  
**Primary question:** “How do I prepare for and navigate a visit?”  
**Primary action:** Open an approved practical guide  
**Status:** Publication-blocked until a useful minimum set of hospital-authored guidance is approved

This is a task hub, not evidence that every proposed topic is available. Empty stages, generic advice, and unowned guidance are omitted; bracketed items are review gates rather than public copy.

## Requirement coverage

| Area | IDs |
| --- | --- |
| Global shell, accessibility, reflow, fallback, performance, governance, patient language | `G-001`–`G-016` |
| Privacy, third parties, Amharic, language continuity | `S-004`–`S-008` |
| Emergency and appointment boundaries | `E-001`–`E-005`, `A-001`–`A-003` |
| Canonical contact and arrival guidance | `C-001`–`C-003` |
| Patient and visitor information | `P-001`–`P-002` |

## Mobile wireframe — 360 px review frame

```text
┌────────────────────────────────────┐
│ [Skip to main content]             │
│ {PI0} [APPROVED LOGO]              │
│       [Emergency]         [Menu]   │
├────────────────────────────────────┤
│ MAIN                               │
│ {PI1} H1: Patient & Visitor        │
│       Information                  │
│       Approved practical guidance  │
│       for planning a visit.        │
│       [VERIFY: staffed help + hrs] │
├────────────────────────────────────┤
│ {PI2} H2: Before your visit        │
│       [APPROVED GUIDE + summary →] │
│       What to bring / preparation /│
│       arrival / payment / access   │
│       [OMIT UNAPPROVED TOPICS]     │
├────────────────────────────────────┤
│ {PI3} H2: During your visit        │
│       [APPROVED GUIDE + summary →] │
│       Reception / navigation /     │
│       visiting / rights / support  │
│       [OMIT UNAPPROVED TOPICS]     │
├────────────────────────────────────┤
│ {PI4} H2: After your visit         │
│       [APPROVED GUIDE + summary →] │
│       Discharge / follow-up /      │
│       medicines / feedback         │
│       [OMIT UNAPPROVED TOPICS]     │
├────────────────────────────────────┤
│ {PI5} H2: Access, rights and help  │
│       [Accessibility support →]    │
│       [Rights and feedback →]      │
│       [APPROVED ROUTES ONLY]       │
├────────────────────────────────────┤
│ {PI6} [STATE: requested guide is   │
│       unavailable]                 │
│       Honest explanation + nearby │
│       approved guides + staffed   │
│       call; no empty guide page    │
├────────────────────────────────────┤
│ {PI7} Need information not shown? │
│       [VERIFY: purpose + phone]    │
│       [Locations & Contact →]      │
│       Footer                       │
└────────────────────────────────────┘
```

Only groups containing at least one approved, useful guide render. The candidate reception → triage → cashier → OPD journey remains absent until Operations approves its accuracy and applicability.

## Desktop wireframe — 1280 px review frame

```text
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│ [Skip] [APPROVED LOGO] [Doctors] [Services] [Appointments] Patient info (current)         │
│                         [Locations] [Search] [Language] [Call] [Emergency]              {PI0}│
├────────────────────────────────────────────────────────────────────────────────────────────┤
│ H1 Patient & Visitor Information                                                       {PI1}│
│ Approved practical guidance for planning and navigating a visit. [VERIFY: staffed help]   │
│                                                                                            │
│ ┌──────────────────────────┐ ┌──────────────────────────┐ ┌──────────────────────────┐    │
│ │ H2 Before your visit {PI2}│ │ H2 During your visit{PI3}│ │ H2 After your visit {PI4}│    │
│ │ [APPROVED GUIDE →]       │ │ [APPROVED GUIDE →]       │ │ [APPROVED GUIDE →]       │    │
│ │ [APPROVED GUIDE →]       │ │ [APPROVED GUIDE →]       │ │ [APPROVED GUIDE →]       │    │
│ │ Omit empty stage         │ │ Omit empty stage         │ │ Omit empty stage         │    │
│ └──────────────────────────┘ └──────────────────────────┘ └──────────────────────────┘    │
│                                                                                            │
│ H2 Access, rights and help [APPROVED ROUTES ONLY]                                    {PI5}│
│ [Accessibility support →] [Payment/insurance →] [Rights/feedback →]                       │
│ [STATE: unavailable guide replaces only the requested topic, with alternatives]      {PI6}│
├────────────────────────────────────────────────────────────────────────────────────────────┤
│ Need information not shown? [VERIFY: purpose-labeled staffed call] [Contact →]         {PI7}│
│ Footer                                                                                     │
└────────────────────────────────────────────────────────────────────────────────────────────┘
```

The three columns preserve `PI2` → `PI3` → `PI4` source order. They reduce to two or one column as content, zoom, or language expansion requires; equal visual height is not required.

## Section map — purpose, requirements, and ownership

| ID | Purpose and user need | Requirement IDs | Content and owner dependencies |
| --- | --- | --- | --- |
| PI0 | Keep emergency, care, contact, search, and language routes predictable. | `G-001`–`G-006`, `S-006`–`S-008` | Approved identity and labels: Brand + Product; contact record: Operations; translations: Content + Clinical where safety-relevant. |
| PI1 | Explain the hub's practical scope and offer human help without implying completeness. | `P-001`, `P-002`, `G-010`, `C-001` | Introduction and staffed-help purpose/hours: Operations + Content. |
| PI2 | Help visitors prepare using current hospital-authored guidance. | `P-001`, `P-002`, `A-001`, `C-002`, `G-014`–`G-015` | Appointment-status wording, what-to-bring, preparation, arrival, payment and access topics: Operations + Privacy/legal + Content. |
| PI3 | Explain the maintained on-site journey, visiting rules, navigation, rights, and support. | `P-001`, `P-002`, `C-002`, `G-014`–`G-015` | Reception/process, visiting, language/accessibility, rights and safeguarding: Operations + Facilities + Privacy/legal. |
| PI4 | Support safe discharge, follow-up, medicines, feedback, and urgent escalation. | `P-001`, `P-002`, `E-001`–`E-003`, `G-014`–`G-015` | Discharge/follow-up/medicines: Clinical + Operations; complaints/feedback: Privacy/legal + Operations; urgent wording: Clinical. |
| PI5 | Make access, payment, rights, complaints, and safeguarding routes findable across stages. | `P-001`, `P-002`, `S-004`, `G-001` | Approved maintained topic routes and owners: Operations + Privacy/legal + Content. |
| PI6 | Recover truthfully when a proposed topic or translation is not publishable. | `G-007`, `G-011`, `G-015`, `S-007`–`S-008`, `P-002` | Unavailable copy and nearest valid alternatives: Product + Content; staffed fallback: Operations. |
| PI7 | Give a non-digital route for missing or uncertain guidance. | `G-001`, `G-007`, `C-001`, `C-002` | Purpose-labeled number, staffed hours and contact scope: Operations; contact route: Facilities + Operations. |

## Section map — layout, components, and outcomes

| ID | Layout and hierarchy | Reusable components | Interaction and navigation outcome |
| --- | --- | --- | --- |
| PI0 | Flat top-level shell; no breadcrumb. | Skip link, header/menu, language switcher, emergency/call actions. | Global canonical routes; equivalent language retains `/patient-information/` or explains the gap in place. |
| PI1 | `intro`; H1, concise scope, staffed fallback. | Page introduction, call link. | Approved call opens matching `tel:`; no implied clinical advice. |
| PI2 | First journey-stage `action-group`; one-line summaries. | Task links/cards, optional review metadata. | Opens maintained guide/deep link; a download is never the only format. |
| PI3 | Second journey-stage group; follows Before in DOM. | Task links/cards, information alert where governed. | Opens approved visiting/navigation/support guidance. |
| PI4 | Third journey-stage group; urgent exception stays visible in relevant guide. | Task links/cards, emergency action where approved. | Opens approved after-visit guide or Emergency; never diagnoses. |
| PI5 | Cross-stage `action-group`; rendered only for maintained destinations. | Text/icon-and-label links. | Opens accessibility, payment, rights, feedback or safeguarding content. |
| PI6 | Replaces only an unavailable topic, not the whole hub when other guidance is useful. | Unavailable state, text links, call link. | Offers nearby approved guide(s), Contact and staffed help; no hollow page. |
| PI7 | `support` plus footer. | Call link, Contact link, footer. | → approved `tel:`, `/contact/`, core tasks, privacy and accessibility. |

## Section map — responsive states and cross-cutting gates

| ID | Mobile, tablet, desktop behavior | Applicable states | Accessibility, bilingual, safety, privacy, performance, motion | Open decisions and approval gates |
| --- | --- | --- | --- | --- |
| PI0 | Compact menu/emergency; full nav wide. | Menu open/closed, current route, translation unavailable. | Logical focus, 44 px targets, ≥35% label expansion, reduced-motion menu. | Labels, translations, canonical Call. |
| PI1 | Reading width at every size; actions stack compact. | Default; staffed fallback unavailable. | One H1, plain HTML, honest scope; no promotional hero or tracker. | Minimum viable topic set and help scope/hours. |
| PI2 | One column compact; up to three stage columns wide only when readable. | Complete/partial stage, all topics absent = omit stage, expired guide. | Meaningful link text; HTML-first print; no generic/inferred advice; owners/dates. | Approve preparation, documents, arrival, payment, insurance and accessibility guidance. |
| PI3 | Same reflow; never reordered ahead of Before. | Complete/partial/omitted; temporary process update. | Temporary guidance carries effective/expiry data; visiting and rights not hidden in hover. | Approve on-site flow, visiting, navigation, language and support services. |
| PI4 | Same reflow; follows During. | Complete/partial/omitted; safety guidance expired. | Urgent route is explicit and Amharic-reviewed; medicines/discharge text requires clinical ownership. | Approve discharge, results, medicines, feedback and escalation wording. |
| PI5 | Links stack compact and wrap wide; absent links leave no gaps. | Approved subset, no approved topics = omit. | No unsupported empty route; rights/privacy labels use approved translations. | Topic routes, owners and review intervals. |
| PI6 | One readable panel at any width. | Missing route, expired guide, missing translation, offline. | Focusable heading on direct navigation; in-place language explanation; no false “coming soon.” | Unavailable copy and alternative-selection rules. |
| PI7 | Full-width support; footer groups stack/wrap. | Default, missing contact = publication block. | Visible purpose/number/hours; no digital-only dead end; same canonical record. | Staffed number, scope and hours. |

## State inventory

| State | Presentation and recovery |
| --- | --- |
| Approved minimum | Publish the hub only when at least one useful approved guide exists and the staffed fallback is current. Render only populated stage/topic groups. |
| Partial content | Omit absent topic links and empty stages. Do not show disabled cards, “coming soon,” generic advice, or empty child pages. |
| Guide unavailable/expired | Direct requests receive an honest unavailable state with nearby approved guides, Contact and staffed help. Remove expired guides from hub navigation and search. |
| Temporary operational change | Place it beside the affected guidance with effective date, expiry/review owner, and accessible non-color-only status. |
| Download/print | Accessible HTML is primary. Optional downloads state type and size, have an accessible version, and failure leaves HTML intact. |
| Loading/failure/offline | Core hub and approved guides are server-rendered. If an enhancement fails, retain links and telephone fallback; do not serve ungoverned stale advice as current. |
| No JavaScript/images/fonts | Headings, stage groups, guide links, emergency/contact routes, review dates and printable HTML remain usable in source order. |

## Focus and reading order

```text
Skip → shell → H1/help → Before → During → After
→ approved access/rights/help routes → unavailable recovery when applicable
→ staffed support → footer
```

## Publication and approval gates

- Operations + Content approve the minimum launch guides, stage placement, owner, source, last-reviewed date and review interval (`P-001`, `P-002`, `G-014`).
- Operations validates the reception/process flow, arrival, visiting, admission/discharge, payment/insurance and staffed fallback; unapproved topics stay absent (`P-002`, `C-001`, `C-002`).
- Privacy/legal approves rights, complaints, safeguarding, feedback and any collection route; Clinical approves medicines, discharge and urgent-escalation wording (`P-002`, `S-004`, `E-001`–`E-003`).
- Content + Clinical arrange professional Phase 1 Amharic review for contact, landmark and any safety-critical guidance; missing equivalents are disclosed honestly (`S-006`–`S-008`).
- Delivery + QA test 320 px/400% zoom, keyboard/screen reader, printing, long bilingual labels, direct unavailable routes, expired/partial content, no JS, constrained network and search removal.
