# Service Detail — Annotated Low-Fidelity Wireframe

**Route:** `/services/{service-slug}/`  
**Primary question:** “Does the hospital provide this care and what happens next?”  
**Primary action:** Request care through the approved appointment route  
**Status:** Each page is publication-gated by clinical scope, capability, relationship, location, operational, and review approval

## Requirement coverage

| Area | IDs |
| --- | --- |
| Global shell, accessibility, failure, performance, governance, canonical content, patient language | `G-001`–`G-016` |
| Language, privacy, third-party behavior | `S-005`–`S-008` |
| Emergency boundary | `E-001`–`E-003` |
| Doctors and relationships | `D-001`–`D-004` |
| Service scope and content | `V-001`–`V-005` |
| Request and contact semantics | `A-001`–`A-003`, `C-001`–`C-003` |

## Mobile wireframe — 360 px review frame

```text
┌────────────────────────────────────┐
│ [Skip to main content]             │
│ {V0} [APPROVED LOGO]               │
│      [Emergency]          [Menu]   │
│ Services > [CURRENT SERVICE]       │
├────────────────────────────────────┤
│ MAIN                               │
│ {V1} H1: [APPROVED PLAIN-LANGUAGE  │
│           SERVICE NAME]            │
│      [APPROVED SHORT SCOPE SUMMARY]│
│      [Request care]                │
│      [VERIFY: purpose + phone]     │
├────────────────────────────────────┤
│ {V2} [APPROVED URGENT EXCEPTION]   │
│      [Emergency help]              │
│      [OMIT ONLY WHEN NOT APPLICABLE│
│       / NOT GOVERNED]              │
├────────────────────────────────────┤
│ {V3} H2: Who this service helps    │
│      [APPROVED NEEDS/CONDITIONS;   │
│       recognition, not diagnosis]  │
├────────────────────────────────────┤
│ {V4} H2: Care provided             │
│      [APPROVED TESTS/TREATMENTS/   │
│       PROCEDURES ONLY]             │
│      [HIGH-CONSEQUENCE CLAIMS      │
│       WITHHELD UNTIL APPROVED]     │
├────────────────────────────────────┤
│ {V5} H2: Doctors for this service  │
│      [APPROVED DOCTOR CARD →]      │
│      [OMIT WHEN NO GOVERNED LINK]  │
├────────────────────────────────────┤
│ {V6} H2: Before you request care   │
│      Location/hours [VERIFY]       │
│      Preparation [if approved]     │
│      Referral [if approved]        │
│      Documents [if approved]       │
│      [Directions, if approved]     │
├────────────────────────────────────┤
│ {V7} H2: What happens next         │
│      [APPROVED REQUEST/FOLLOW-UP   │
│       PROCESS; no booking promise] │
│      [Request care] [Call]         │
├────────────────────────────────────┤
│ {V8} [Medically reviewed / last   │
│       checked: VERIFY role + date] │
├────────────────────────────────────┤
│ {V9} More care options             │
│      [All services] [Find doctor]  │
│      [VERIFY: staffed contact]     │
│      Footer                        │
└────────────────────────────────────┘
```

Bracketed withheld/gated lines are authoring annotations. They are never public copy. If required scope, request, urgent-exception, or operational fields are unavailable, the record stays unpublished rather than showing an incomplete clinical shell.

## Desktop wireframe — 1280 px review frame

```text
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│ [Skip] [APPROVED LOGO] [Doctors] [Services] [Appointments] [Patient info] [Locations]      │
│                         [Search] [Language] [Call] [Emergency]                           {V0}│
│ Services > [CURRENT APPROVED SERVICE]                                                       │
├────────────────────────────────────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────┐ ┌────────────────────────────────┐ │
│ │ H1 [APPROVED SERVICE NAME]                     {V1}│ │ Request-care support           │ │
│ │ [approved short scope summary]                      │ │ [Request care] [staffed call]  │ │
│ │ [Request care] [VERIFY: purpose-labeled call]       │ │ [location/hours if approved]   │ │
│ └─────────────────────────────────────────────────────┘ │                            {V6}│ │
│ [APPROVED URGENT EXCEPTION + Emergency help]        {V2}│ └────────────────────────────────┘ │
│ H2 Who this service helps [APPROVED RECOGNITION CONTENT]                           {V3}│
│ H2 Care provided [APPROVED CAPABILITIES ONLY]                                      {V4}│
│                                                                                            │
│ H2 Doctors for this service [APPROVED CARDS; OMIT WHEN EMPTY]                        {V5}│
│                                                                                            │
│ H2 Before you request care [preparation/referral/documents/directions if approved]    {V6}│
│ H2 What happens next [approved process] [Request care] [Call]                        {V7}│
│ [approved medical/operational review metadata]                                       {V8}│
├────────────────────────────────────────────────────────────────────────────────────────────┤
│ All services | Find a doctor | purpose-labeled staffed contact                        {V9}│
│ Footer                                                                                    │
└────────────────────────────────────────────────────────────────────────────────────────────┘
```

The support rail is visually adjacent only when the remaining reading width is comfortable. In DOM order it follows the identity/action and urgent exception; at zoom it returns before the preparation section without hiding the repeated in-flow content.

## Section map — purpose, requirements, and content ownership

| ID | Purpose and user need | Requirement IDs | Content and owner dependencies |
| --- | --- | --- | --- |
| V0 | Confirm site location and retain essential/global exits. | `G-001`, `G-005`, `G-010`, `G-013`, `S-006`–`S-008` | Approved shell labels and canonical service name/slug: Brand + Product + Clinical + Content. |
| V1 | State what the service is and provide the main truthful next action. | `V-001`–`V-003`, `A-001`–`A-003`, `C-001` | Plain name, scope, request route, canonical service ID, staffed phone/hours: Clinical + Operations + Content. |
| V2 | Make any clinically required urgent exception visible before ordinary detail. | `V-002`, `E-001`–`E-003`, `S-006` | Approved exception, emergency wording/route, Amharic review: Clinical + Operations + Content. |
| V3 | Help visitors recognize who/what the service covers without diagnosing them. | `V-002`, `V-004`, `G-014`–`G-015` | Approved needs/conditions, synonyms, owner/reviewer/date: Clinical + Content. |
| V4 | Describe only verified care capability and withhold consequential claims. | `V-002`–`V-004`, `G-014`–`G-015` | Tests/treatments/procedures, eligibility/scope, availability/location, claim ledger: Clinical + Executive + Operations. |
| V5 | Connect the service to approved current clinicians. | `V-005`, `D-001`–`D-004` | Governed bidirectional relationships, roster status, canonical URLs: Clinical + Medical staff owner + Content. |
| V6 | Give approved practical location, hour, preparation, referral, document, and arrival information. | `V-002`, `V-005`, `C-001`–`C-003`, `G-015` | Operational location/hours, preparation/referral rules, document needs, directions: Operations + Facilities + Clinical. |
| V7 | Explain the operating process and repeat a useful request/fallback action. | `V-002`, `A-001`–`A-003`, `C-001` | Request steps, receiving team, response/follow-up semantics, phone/hours: Operations + Content. |
| V8 | Make clinical and operational currency inspectable. | `G-014`, `V-002`–`V-004` | Named clinical reviewer/public label, review date, content owner, source, review/expiry interval: Clinical + Content. |
| V9 | Recover to broader discovery when this service is not right or available. | `G-001`, `V-001`, `D-001`–`D-003`, `C-001` | Directory, doctor, and staffed routes: Product + Operations + Content. |

## Section map — layout, components, and outcomes

| ID | Layout and hierarchy | Reusable components | Interaction and navigation outcome |
| --- | --- | --- | --- |
| V0 | Detail shell with wrapping breadcrumb. | Skip link, header/menu, breadcrumb, language switcher, essential actions. | Services → `/services/`; current record is text; safe equivalent-language route or limitation. |
| V1 | Identity `intro`; scope then dominant request action. | Page introduction, appointment action, call link. | → `/appointments/?service={canonical-id}`; approved staffed `tel:`; no confirmed booking claim. |
| V2 | Static alert immediately after intro, never collapsed. | Emergency/warning alert, Emergency action. | → `/emergency/` or approved explicit `tel:` per policy; no diagnosis or urgency estimation. |
| V3 | Reading-width `content`. | Governed prose/list, optional safe glossary links. | Content-only; links only to approved explanatory/service routes. |
| V4 | Reading-width `content`; claims listed plainly. | Governed content, review metadata reference. | No action hidden inside a claim; unsupported capability is absent. |
| V5 | `collection`; approved relationships only. | Doctor cards/text links. | → canonical doctor profiles; entire section omitted if no approved links. |
| V6 | `content`; support rail may summarize but full content stays in DOM. | Location/contact content, lists, text directions, optional map launcher after text. | → Contact/directions or explicit map load only after complete HTML guidance. |
| V7 | `content` then repeated action after substantial detail. | Appointment action, call link, information content. | Same canonical service ID enters request; staffed fallback remains. |
| V8 | Quiet metadata after governed clinical/process content. | Review metadata. | Optional reviewer/source explanation; accurate review label. |
| V9 | `support` plus footer. | Text links, call link, footer. | → Services, Doctors, Contact; no circular-only exit. |

## Section map — responsive states and cross-cutting gates

| ID | Mobile, tablet, desktop behavior | Applicable states | Accessibility, bilingual, safety, privacy, performance, motion | Open decisions and approval gates |
| --- | --- | --- | --- | --- |
| V0 | Breadcrumb wraps; compact menu, full wide nav. | Current, translation unavailable, menu open. | Logical focus, 44 px targets, language metadata/expansion, reduced motion. | Approved translated name/route and retired-record policy. |
| V1 | Single column compact; wide may use quiet support rail. | Default, request service unavailable, staffed contact unavailable. | One H1; stable canonical ID; no PII in URL; HTML first; no promotional hero. | Name, summary, scope, request route, contact purpose/hours. |
| V2 | Full width in flow; before ordinary detail at every size. | Required/shown, not applicable/omitted, expired/unapproved = publication block where safety-relevant. | Not color-only/dismissible; static screen-reader reading; professionally reviewed Amharic; no diagnosis. | Exact exception, applicability, emergency route/number. |
| V3 | Reading measure; lists wrap. | Complete, partial approved items, required content absent. | Plain language and clinical synonyms; owner/date; no hidden eligibility. | Who it helps, common needs/conditions, translation. |
| V4 | One column; long terms wrap; no dense marketing tiles. | Approved claims, optional claim absent, high-consequence claim withheld, expired. | No inferred scope/outcomes; meaningful headings; no image dependence. | Scope, eligibility, availability, location, clinical/executive approval. |
| V5 | One card compact, up to three wide. | Approved relationships, none = omit, clinician retired. | Semantic canonical links; current roster only; no live availability. | Bidirectional relationship approval and roster status. |
| V6 | In flow compact; summary rail wide only with DOM integrity. | Full/partial approved practical info, map idle/loading/error, absent required operational data. | Text directions before map; no third-party request until approved/actioned; optional fields omitted; no CLS. | Location, hours, preparation, referral, documents, entrance/directions, map need/data flow. |
| V7 | One reading column; actions stack compact. | Default, appointment unavailable/failure, phone unavailable. | Request language, staffed fallback, no schedule/booking claim; no JS dependency. | Process, response expectation, routing, phone/hours. |
| V8 | Wraps; no tiny muted-only essential text. | Medical review, operational check, expired. | Truthful label and accessible date; record expires/unpublishes under policy. | Reviewer/public identity, date, interval, owner. |
| V9 | Stacked compact, quiet band wide. | Default, service unavailable/retired. | Purpose-labeled contact, global emergency route, no dead end. | Fallback content and contact record. |

## State inventory

| State | Presentation and recovery |
| --- | --- |
| Default/approved | Required scope, who-it-helps, care capability, practical/request process, urgent exception decision, and review metadata are current; only approved optional content appears. |
| Partial optional content | Omit individual optional preparation/referral/document/location enhancement or doctor relationship without empty headings. Required fields remain a publication gate. |
| High-consequence claim unapproved | Omit the claim completely. Do not soften, generalize, infer, or replace it with imagery; if it defines the service's core identity, keep the entire record unpublished. |
| Related doctor absent | Omit the section; preserve service/request/support routes. Never publish a stale clinician card. |
| Appointment route failure | Preserve service information; explain the request route problem and provide approved staffed contact. Do not claim the service itself is unavailable unless Operations says so. |
| Operational data unavailable/expired | Omit genuinely optional detail; required location/hours/request information keeps the record unpublished or in a controlled unavailable state with a safe contact alternative. |
| Record retired | Redirect only to a genuine approved successor. Otherwise return honest 404/410/unavailable with Services, Doctors, Contact, and Emergency routes. |
| No JavaScript/images/map/fonts | Scope, urgent exception, needs, capabilities, doctors as links, location/preparation, process, request link, call, and review metadata remain semantic HTML in order. |

## Request handoff and relationship integrity

```text
Service detail → Request care
               → /appointments/?service={stable-canonical-id}
               → form resolves approved display name from ID
               → user may change to Doctor or Not sure

Service detail ↔ approved doctor profile
               ↔ same governed relationship at both ends
```

- The request URL carries only a public canonical record key, never symptoms, notes, or other personal data.
- A retired/unpublished service cannot remain selectable in the appointment form; the user receives a truthful choice and no silent substitution.
- Relationship tests verify both endpoints are published and canonical. A related record never becomes the only route back.
- Language switching preserves the stable ID and displays only an approved translated record.

## Publication and approval gates

- Clinical + Content approve the canonical name, summary, who-it-helps content, synonyms, tests/treatments/procedures, service group, translations, and doctor relationships (`V-001`, `V-002`, `V-004`, `V-005`).
- Clinical + Executive approve scope, eligibility, availability, location, and each high-consequence capability through a current claim ledger (`V-003`).
- Clinical + Operations approve urgent exceptions and emergency routing; missing required safety guidance blocks that page (`V-002`, `E-001`–`E-003`).
- Operations + Facilities approve location, hours, preparation, referral, required documents, directions, request process, staffed fallback, and update policy (`V-002`, `C-001`–`C-003`).
- Privacy + Delivery approve any optional map; it remains outside the critical path (`S-005`).
- Delivery + QA test canonical-ID handoff, bidirectional links, missing fields, withheld claims, expired records, keyboard/screen reader, 320 px/400% zoom, bilingual expansion, no-JS/map/media failure, and constrained performance.
