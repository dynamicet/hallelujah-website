# About the Hospital — Annotated Low-Fidelity Wireframe

**Route:** `/about/`  
**Primary question:** “Can I trust this hospital?”  
**Primary action:** Explore approved care or contact the hospital  
**Status:** Publication-blocked until the institutional narrative, leadership records, required claims, review ownership, and relevant translations are approved

This page supports trust after essential patient tasks. It is not a promotional claim wall. Bracketed material is an editorial or approval gate and never proposed public copy.

## Requirement coverage

| Area | IDs |
| --- | --- |
| Global shell, accessibility, reflow, fallback, performance, governance, patient language | `G-001`–`G-016` |
| Privacy-safe third parties, language, and translation continuity | `S-004`–`S-008` |
| Home trust-content boundary | `H-004` |
| Care and contact routes | `D-001`–`D-003`, `V-001`–`V-003`, `C-001`–`C-003` |
| Institutional content, leadership, and relationships | `I-001`–`I-003` |

`S-001` and `S-002` remain sitewide release gates but do not create visible About sections.

## Mobile wireframe — 360 px review frame

```text
┌────────────────────────────────────┐
│ [Skip to main content]             │
│ {AB0} [APPROVED LOGO]              │
│       [Emergency]         [Menu]   │
│ Home > About the Hospital          │
├────────────────────────────────────┤
│ MAIN                               │
│ {AB1} H1: About the Hospital       │
│       [APPROVED SHORT ORIENTATION] │
│       [Explore services]           │
│       [Locations & Contact]        │
├────────────────────────────────────┤
│ {AB2} H2: Our story                │
│       [APPROVED STORY ONLY]        │
│       H3: Milestones               │
│       [EVIDENCE-DATED ITEM]        │
│       [OMIT UNVERIFIED ITEMS]      │
├────────────────────────────────────┤
│ {AB3} H2: Mission, vision, values  │
│       [RESOLVE CONFLICTING MISSION]│
│       [APPROVED CONTENT ONLY]      │
├────────────────────────────────────┤
│ {AB4} H2: Hospital facts           │
│       [PATIENT-USEFUL, SOURCED     │
│        FACT + AS-OF DATE]          │
│       [OMIT SECTION WHEN EMPTY]    │
├────────────────────────────────────┤
│ {AB5} H2: Leadership               │
│       [APPROVED NAME + ROLE]       │
│       [CURRENT BIO, if approved]   │
│       [RIGHTS-APPROVED PORTRAIT]   │
├────────────────────────────────────┤
│ {AB6} H2: Partners and insurers    │
│       [NAME + PATIENT-RELEVANT     │
│        RELATIONSHIP EXPLANATION]   │
│       [LOGO ONLY WITH RIGHTS]      │
│       [OMIT WHEN NONE APPROVED]    │
├────────────────────────────────────┤
│ {AB7} [OPTIONAL RIGHTS-APPROVED    │
│        PLACE/STAFF IMAGE]          │
│       No patient/outcome claim     │
├────────────────────────────────────┤
│ {AB8} Information last checked:   │
│       [VERIFY: owner + date]       │
├────────────────────────────────────┤
│ {AB9} H2: Find the care you need   │
│       [Services] [Find a doctor]   │
│       [Request an appointment]     │
│       [Locations & Contact]        │
│       Footer                       │
└────────────────────────────────────┘
```

Leadership, fact, partner, and image regions never render as empty shells. A missing required approved institutional narrative keeps the route unpublished; missing optional evidence modules collapse completely.

## Desktop wireframe — 1280 px review frame

```text
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│ [Skip] [APPROVED LOGO] [Doctors] [Services] [Appointments] [Patient info] [Locations]      │
│                         [Search] [Language] [Call] [Emergency]                          {AB0}│
│ Home > About the Hospital                                                                  │
├────────────────────────────────────────────────────────────────────────────────────────────┤
│ ┌──────────────────────────────────────────────────────┐ ┌───────────────────────────────┐ │
│ │ H1 About the Hospital                          {AB1}│ │ Care and contact              │ │
│ │ [APPROVED SHORT ORIENTATION]                         │ │ [Services] [Find a doctor]    │ │
│ │ [Explore services] [Locations & Contact]             │ │ [Request] [Contact]      {AB9}│ │
│ └──────────────────────────────────────────────────────┘ └───────────────────────────────┘ │
│                                                                                            │
│ H2 Our story [APPROVED STORY + EVIDENCE-DATED MILESTONES]                          {AB2}│
│                                                                                            │
│ ┌──────────────────────────────────────────┐ ┌───────────────────────────────────────────┐ │
│ │ H2 Mission, vision, values          {AB3}│ │ H2 Patient-useful hospital facts    {AB4}│ │
│ │ [APPROVED, CONFLICT RESOLVED]             │ │ [SOURCED FACT + AS-OF DATE]              │ │
│ └──────────────────────────────────────────┘ └───────────────────────────────────────────┘ │
│                                                                                            │
│ H2 Leadership [APPROVED CURRENT RECORDS; PORTRAITS OPTIONAL]                       {AB5}│
│ [NAME + ROLE] [NAME + ROLE] [NAME + ROLE]                                                 │
│                                                                                            │
│ H2 Partners and insurers [APPROVED RELATIONSHIP MEANING; OMIT WHEN EMPTY]            {AB6}│
│ [NAME / optional rights-approved logo / plain patient-relevant explanation]               │
│                                                                                            │
│ [OPTIONAL RIGHTS-APPROVED PLACE/STAFF IMAGE; never evidence of outcome/capability]    {AB7}│
│ [Information last checked: APPROVED OWNER + DATE]                                    {AB8}│
├────────────────────────────────────────────────────────────────────────────────────────────┤
│ Services | Find a doctor | Request an appointment | Locations & Contact               {AB9}│
│ Footer                                                                                    │
└────────────────────────────────────────────────────────────────────────────────────────────┘
```

Desktop pairings are visual only. The DOM order remains `AB1` through `AB9`; the care-support rail follows the introduction and returns to the normal flow at zoom or whenever either column becomes narrow.

## Section map — purpose, requirements, and content ownership

| ID | Purpose and user need | Requirement IDs | Content and owner dependencies |
| --- | --- | --- | --- |
| AB0 | Identify the hospital, show page location, and preserve every essential exit. | `G-001`–`G-006`, `G-010`, `G-013`, `S-006`–`S-008` | Approved name/logo, labels, route and translations: Brand + Product + Content; contact data: Operations. |
| AB1 | Explain what the page can establish and keep care/contact actions ahead of institutional detail. | `G-001`, `G-002`, `I-001`, `C-001` | Concise orientation and task labels: Executive + Content + Product; canonical contact route: Operations. |
| AB2 | Present an accurate hospital story and only verified historical milestones. | `I-001`, `H-004`, `G-014`–`G-015` | Approved narrative, milestone evidence, dates, owner, sources and review interval: Executive + Content. |
| AB3 | State mission, vision and values only after the known conflicting mission sources are resolved. | `I-001`, `G-014`–`G-015` | Final wording, source, approval, translation and review date: Executive + Content. |
| AB4 | Give capacity or facility facts only when evidence-dated and useful to a patient decision. | `I-001`, `H-004`, `G-014`–`G-015` | Claim ledger; definitions and as-of dates; resolution of 115/96-bed and other extracted claims: Executive + Operations + Content. |
| AB5 | Let visitors identify current accountable leadership without stale names, roles, biographies, or portraits. | `I-001`, `I-002`, `G-014`–`G-015` | Current name, title, tenure/status, bio, source, review date and portrait rights: Executive + Content. |
| AB6 | Explain an approved partner or insurer relationship in terms meaningful to patients. | `I-003`, `S-005`, `G-014`–`G-015` | Active status, relationship meaning, scope/limitations, name/logo rights, owner and review date: Executive + Operations. |
| AB7 | Add human/place context only when the image is authentic, relevant, rights-cleared, and not misleading. | `G-010`, `G-014`–`G-015`, `I-001`–`I-003` | Asset source, consent/rights, crop, alt-text decision and expiry: Brand + Content + Privacy where people are identifiable. |
| AB8 | Make currency and accountability inspectable without implying clinical review. | `G-014`, `I-001`–`I-003` | Public “Information last checked” date and approved owner label; internal sources and next-review rule: Executive + Content. |
| AB9 | Return institutional interest to useful care, appointment, and contact journeys. | `G-001`, `D-001`–`D-003`, `V-001`–`V-003`, `A-001`, `C-001`–`C-003` | Canonical approved routes and request/contact wording: Product + Operations + Content. |

## Section map — layout, components, and outcomes

| ID | Layout and hierarchy | Reusable components | Interaction and navigation outcome |
| --- | --- | --- | --- |
| AB0 | Secondary-page shell with wrapping breadcrumb. | Skip link, header/menu, breadcrumb, language switcher, essential actions. | Home → `/`; current page is text; language keeps `/about/` only when equivalent content is approved. |
| AB1 | Reading-width `intro`; two routine actions, never a promotional oversized hero. | Page introduction, buttons/text links. | → Services or Contact; actions remain available without imagery or script. |
| AB2 | `content`; prose before a short dated list. | Governed prose, timeline/list, review metadata reference. | Optional deep links target real headings; no carousel or animated timeline. |
| AB3 | `content`; may pair visually with facts only when both remain readable. | Headings, governed prose/list. | Content-only; no slogan used as an unsupported claim. |
| AB4 | `collection` of plain evidence items, not oversized marketing counters. | Definition list/fact items, as-of date. | Optional related care/location link only when the relation is approved. |
| AB5 | `collection`; names/roles carry meaning if portraits are absent. | Governed person card, optional image/fallback, review metadata. | No card-wide hidden action; approved bio disclosure or heading link only if needed. |
| AB6 | `collection`; explanation is more prominent than logo. | Relationship card, optional rights-approved logo, external-link notice if applicable. | Approved relevant route only; no logo-only endorsement or unreviewed third-party request. |
| AB7 | Supporting media after meaningful text. | Responsive image/figure. | No action; image absence leaves no gap or lost information. |
| AB8 | Quiet metadata after governed content. | Review metadata. | Optional methodology/source explanation without exposing internal-only data. |
| AB9 | `support` and footer; may be a quiet wide rail near `AB1` without DOM reordering. | Task links, appointment action, contact link, footer. | → Services, Doctors, Appointments, Contact; no dead-end institutional page. |

## Section map — responsive states and cross-cutting gates

| ID | Mobile, tablet, desktop behavior | Applicable states | Accessibility, bilingual, safety, privacy, performance, motion | Open decisions and approval gates |
| --- | --- | --- | --- | --- |
| AB0 | Compact menu/emergency; full navigation wide; breadcrumb wraps. | Current route, menu open, translation unavailable. | Logical focus, 44 px targets, LTR in both languages, no sticky obstruction, reduced motion. | Approved route labels and language coverage. |
| AB1 | One column; wide support rail only with adequate reading measure. | Approved, institutional route unavailable. | One H1; plain HTML first; 35% expansion; care tasks are not displaced by promotion. | Approved summary and action labels. |
| AB2 | One reading column; milestones stack; no horizontal timeline. | Approved story, milestone omitted, conflicting/expired content. | Semantic headings/list; dates readable; no motion/image dependence. | Resolve and approve story plus each of five extracted milestone candidates. |
| AB3 | One column compact; optional two-column visual pairing wide. | Approved; any conflicting required content = publication block. | No text embedded in imagery; equivalent translated meaning; current owner/date. | Resolve duplicated/conflicting mission and approve vision/values. |
| AB4 | Stacked facts compact; modest grid wide. | Approved facts, some omitted, none = omit section, expired. | Values have labels/definitions/as-of dates; not color-only; no animated counters. | Resolve bed figures, jobs, experience, patient count, “first,” proximity and facility claims. |
| AB5 | One record compact; up to three wide where content fits. | Current record, portrait absent, bio absent, record expired. | Names/roles are text; neutral fallback does not infer identity; images reserve space and lazy-load. | Leadership roster, roles/tenure, bios, translations, portrait rights and review interval. |
| AB6 | One relationship per row compact; two wide only with full explanations. | Approved, logo absent, relationship expired, none = omit. | Name remains text when logo absent; external behavior labeled; no initial third-party call. | Status, patient meaning, limitations, rights, owner and review date for each relationship. |
| AB7 | Full-width supporting image with fixed aspect ratio; omitted compact or globally when unnecessary. | Loaded, image failed/blocked, no approved asset. | Useful alt or empty alt by purpose; no identifiable patient without consent; AVIF/WebP candidate; no CLS. | Asset authenticity, consent, rights, crop and alt decision. |
| AB8 | Wraps without tiny muted-only essential text. | Current, review due, expired. | Truthful operational/institutional label; machine-readable date; expired required records unpublish. | Public owner label, date and review interval. |
| AB9 | Stacked compact; grouped horizontally wide. | Default, one route unavailable, canonical contact unavailable. | Visible labels, 44 px targets, no personal data, no map/script dependency. | Final care/contact routes and canonical call data. |

## State inventory

| State | Presentation and recovery |
| --- | --- |
| Approved/default | Required story, resolved mission/vision/values, current leadership, owner and review metadata are approved. Only current optional facts, relationships and imagery render. |
| Required institutional content unresolved | Keep `/about/` unpublished or provide a controlled unavailable response with Home, Services and Contact. Do not choose between conflicting mission sources. |
| Partial optional evidence | Omit each unapproved milestone, fact, biography, portrait or relationship and collapse its gap. Do not substitute generic claims or stock imagery. |
| Claim or record expired | Remove it from page, search and Home excerpts until reapproved. If the omission makes the required narrative misleading or incomplete, unpublish the route. |
| Partner/insurer status unclear | Omit name, logo and implied relationship. Do not infer acceptance, coverage, endorsement, referral, or availability. |
| Image unavailable | Keep all text and actions; no broken placeholder or loss of meaning. A neutral non-person fallback is optional only when governed. |
| Unavailable translation | Stay on the current page, explain the limitation, and offer approved translated Emergency, Contact and care routes; never silently redirect Home. |
| No JavaScript/images/fonts | Story, mission/vision/values, leadership names/roles, sourced facts, relationship explanations, dates and care/contact links remain semantic HTML in source order. |

## Focus and reading order

```text
Skip → shell → breadcrumb → H1/orientation → care/contact actions
→ story/milestones → mission/vision/values → approved facts
→ current leadership → approved partner/insurer explanations
→ optional image → review metadata → care/contact support → footer
```

Omitted evidence creates no focus gap. No timeline, number counter, portrait, logo, or disclosure auto-advances or animates for promotion.

## Publication and approval gates

- Executive + Content resolve the conflicting mission sources and approve the story, vision, values, historical milestones, public wording, translations, sources and review interval (`I-001`).
- Executive approves current leadership names, titles, tenure/status and biographies; Brand/Content records portrait source and rights for every displayed asset (`I-002`).
- Executive + Operations approve every partner/insurer relationship, its exact patient-relevant meaning and limitations, active status, owner, review date and name/logo rights (`I-003`).
- Executive + Operations reconcile the 115/96-bed figures and every capacity, jobs, experience, patient-count, “first pulmonologist,” proximity, technology or facility claim before it appears (`H-004`, `I-001`).
- Privacy/Brand/Content approve identifiable-person consent, image rights, alt purpose and expiry; missing imagery never blocks access to text.
- Delivery + QA test 320 px/400% zoom, keyboard/screen reader, heading order, long English/Amharic content, expired/omitted records, no JavaScript/media/fonts, canonical routes and constrained-network performance.
