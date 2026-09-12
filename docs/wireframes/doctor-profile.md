# Doctor Profile — Annotated Low-Fidelity Wireframe

**Route:** `/doctors/{doctor-slug}/`  
**Primary question:** “Is this the right clinician and how do I request care?”  
**Primary action:** Request an appointment with the canonical doctor identifier  
**Status:** Each profile is publication-gated by roster, identity, content, relationship, and review approval; schedules remain withheld

## Requirement coverage

| Area | IDs |
| --- | --- |
| Global shell, accessibility, states, performance, canonical content, patient language | `G-001`–`G-016` |
| Language and third-party governance | `S-005`–`S-008` |
| Doctor records and portraits | `D-001`–`D-006` |
| Related services and appointment handoff | `V-001`, `V-005`, `A-001`–`A-003` |
| Canonical telephone fallback | `C-001` |

## Mobile wireframe — 360 px review frame

```text
┌────────────────────────────────────┐
│ [Skip to main content]             │
│ {P0} [APPROVED LOGO]               │
│      [Emergency]          [Menu]   │
│ Doctors > [CURRENT NAME]           │
├────────────────────────────────────┤
│ MAIN                               │
│ {P1} [approved portrait OR neutral │
│       fallback OR no image]        │
│      H1: [APPROVED NAME]           │
│      [credentials/title if approved]│
│      [APPROVED SPECIALTY]          │
│      [Request an appointment]      │
│      [VERIFY: appointment phone]   │
├────────────────────────────────────┤
│ {P2} H2: Areas of care             │
│      [APPROVED CLINICAL INTERESTS] │
│      [OMIT ABSENT OPTIONAL ITEMS]  │
├────────────────────────────────────┤
│ {P3} H2: About [approved name]     │
│      [APPROVED BIOGRAPHY]          │
│      Qualifications [if approved]  │
│      Languages [if approved]       │
│      Affiliations [if approved]    │
├────────────────────────────────────┤
│ {P4} H2: Where and how to request  │
│      care                          │
│      [APPROVED LOCATION, if kept]  │
│      SCHEDULE WITHHELD             │
│      [VERIFY: truthful availability│
│       /request guidance]           │
│      [Request an appointment]      │
├────────────────────────────────────┤
│ {P5} H2: Related services          │
│      [APPROVED SERVICE CARD →]     │
│      [OMIT WHEN EMPTY]             │
├────────────────────────────────────┤
│ {P6} [Information last checked /  │
│       medically reviewed metadata] │
│      [VERIFY: reviewer/date]       │
├────────────────────────────────────┤
│ {P7} Need help choosing?           │
│      [Back to all doctors]         │
│      [Explore services] [Call]     │
│      Footer                        │
└────────────────────────────────────┘
```

`SCHEDULE WITHHELD` is an authoring annotation, not public copy. The public page simply omits schedule labels, rows, and empty space until `D-005` is resolved. Approved general request guidance may still explain how to ask for care without claiming a time or availability.

## Desktop wireframe — 1280 px review frame

```text
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│ [Skip] [APPROVED LOGO] [Doctors] [Services] [Appointments] [Patient info] [Locations]      │
│                         [Search] [Language] [Call] [Emergency]                           {P0}│
│ Doctors > [CURRENT APPROVED NAME]                                                          │
├────────────────────────────────────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────┐ ┌────────────────────────────────┐ │
│ │ H1 [APPROVED NAME]                             {P1}│ │ [approved portrait / neutral] │ │
│ │ [approved credentials/title] [approved specialty] │ │ image is secondary to identity│ │
│ │ [Request an appointment] [VERIFY: appointment call]│ └────────────────────────────────┘ │
│ └─────────────────────────────────────────────────────┘                                    │
│                                                                                            │
│ ┌─────────────────────────────────────────────────────┐ ┌────────────────────────────────┐ │
│ │ H2 Areas of care                               {P2}│ │ H2 Where/how to request   {P4}│ │
│ │ [APPROVED CLINICAL INTERESTS]                      │ │ [approved location if kept]   │ │
│ │ H2 About [approved name]                      {P3}│ │ no schedule until approved    │ │
│ │ [approved bio/qualifications/languages]             │ │ [truthful request guidance]    │ │
│ └─────────────────────────────────────────────────────┘ │ [Request an appointment]        │ │
│                                                        └────────────────────────────────┘ │
│ H2 Related services [APPROVED SERVICE CARDS; OMIT WHEN EMPTY]                         {P5}│
│ [review/check metadata with approved role/date]                                       {P6}│
├────────────────────────────────────────────────────────────────────────────────────────────┤
│ Back to all doctors | Explore services | purpose-labeled appointment help              {P7}│
│ Footer                                                                                    │
└────────────────────────────────────────────────────────────────────────────────────────────┘
```

The supporting rail follows the identity/action and main content in DOM order even when visually adjacent. At narrow widths or zoom it returns after `P3` as shown in the mobile frame.

## Section map — purpose, requirements, and content ownership

| ID | Purpose and user need | Requirement IDs | Content and owner dependencies |
| --- | --- | --- | --- |
| P0 | Confirm location in the site and retain essential routes. | `G-001`, `G-005`, `G-010`, `G-013`, `S-006`–`S-008` | Approved identity/labels and canonical profile name/slug: Brand + Product + Content. |
| P1 | Establish clinician identity and provide the main truthful next step. | `D-001`, `D-003`, `D-004`, `D-006`, `A-001`, `C-001` | Name, credentials, title, specialty, portrait rights, canonical ID, request route, phone: Medical staff owner + Operations + Content. |
| P2 | Help the visitor recognize relevant expertise without diagnosing. | `D-004`, `G-014`, `G-015` | Approved clinical interests and clinical reviewer: Medical staff owner + Clinical. |
| P3 | Provide approved supporting professional information without filling gaps by inference. | `D-004`, `G-014`, `G-015` | Biography, qualifications, languages, affiliations, pronoun decision: Medical staff owner + Content. |
| P4 | Explain location and the available request route without exposing unreliable schedule data. | `D-004`, `D-005`, `A-001`–`A-003`, `C-001` | Maintained location, truthful availability wording, appointment route, staffed phone/hours: Operations + Medical staff owner. |
| P5 | Connect expertise to governed patient-facing care routes. | `V-001`, `V-005`, `D-004` | Bidirectional doctor-service relationships, translated names, canonical service URLs: Clinical + Content. |
| P6 | Show when governed information was checked or medically reviewed. | `G-014`, `D-004` | Named internal owner, approved public reviewer role/name, source, date, review/expiry interval: Medical staff owner + Clinical + Content. |
| P7 | Recover when the clinician is not appropriate, unavailable, or the visitor remains unsure. | `G-001`, `D-002`, `V-001`, `C-001` | Directory/service routes and purpose-labeled staffed fallback: Product + Operations. |

## Section map — layout, components, and outcomes

| ID | Layout and hierarchy | Reusable components | Interaction and navigation outcome |
| --- | --- | --- | --- |
| P0 | Detail shell with wrapping breadcrumb. | Skip link, header/menu, breadcrumb, language switcher, essential actions. | Doctors → `/doctors/`; current page is text; equivalent language route or in-place limitation. |
| P1 | Identity `intro`; text precedes optional portrait in DOM; dominant action near H1. | Page introduction, image/fallback, primary appointment action, call link. | → `/appointments/?doctor={canonical-id}` using non-PII governed ID; call opens approved staffed route. |
| P2 | Reading-width `content`; plain list/prose. | Governed content, safe links if needed. | May link only to approved related service/definition; no diagnostic recommendation. |
| P3 | Reading-width `content`; optional subsections disappear individually. | Content sections, lists. | No interaction required; approved external affiliation link only if useful and governed. |
| P4 | Supporting `content`; rail wide, in-flow compact. | Information alert/text, appointment action, call link, location link. | Request carries canonical doctor ID; → Contact/location only if approved; no schedule controls. |
| P5 | `collection` of approved relationships only. | Service cards/text links. | → `/services/{approved-slug}/`; section omitted when none are governed. |
| P6 | Quiet metadata after clinical/operational content. | Review metadata. | Optional reviewer/source explanation; no false “medically reviewed” label. |
| P7 | `support` plus footer. | Text links, call link, footer. | → directory, Services, Contact; approved phone fallback. |

## Section map — responsive states and cross-cutting gates

| ID | Mobile, tablet, desktop behavior | Applicable states | Accessibility, bilingual, safety, privacy, performance, motion | Open decisions and approval gates |
| --- | --- | --- | --- | --- |
| P0 | Breadcrumb wraps; compact menu, wide nav. | Current, translation available/unavailable, menu open. | Correct `lang`; no truncation; focus/order; reduced motion. | Approved route/name translations and retired-route policy. |
| P1 | Text and action first compact; optional portrait never delays identity. Wide may pair without DOM reorder. | Image approved, neutral fallback, no image; appointment route unavailable. | H1 carries identity; decorative neutral fallback `alt=""`; real portrait alt decision governed; dimensions reserved; no inferred credentials/pronouns. | Roster, identity, title, specialty, portrait rights, canonical ID and CTA label. |
| P2 | One reading column; wraps long terminology. | Default; some/all interests absent; record expired. | Plain language plus approved clinical terms; no diagnosis; owner/date; no motion. | Clinical interests and reviewer. |
| P3 | Optional subsections stack and vanish without gaps. | Complete, partial, absent optional data. | Never infer language, qualification, affiliation, biography, or gender; meaningful headings remain sequential. | Approve every visible field and translations. |
| P4 | In flow compact; rail only wide; repeated action after substantial content. | Approved general guidance; location omitted; schedule blocked; appointment service failure. | No live availability/schedule; fallback remains visible; no PII in handoff URL; HTML first. | Define approved non-schedule availability wording, location reliability, staffed number/hours. |
| P5 | One card compact, up to three wide. | Approved records, no relationships = omit, related service retired. | Semantic canonical links; no empty shell; bidi relationship integrity. | Approve relationship model and service publication scope. |
| P6 | Wraps in reading width. | Clinically reviewed, operationally checked, expired/unavailable. | Exact truthful label; date understandable in both languages; expired records unpublish. | Public reviewer display, dates, interval, owner. |
| P7 | Stacked compact; quiet band wide. | Default; profile unavailable; fallback missing = route block. | Purpose-labeled phone; no dead end; same canonical contact record. | Contact purpose/hours and unavailable-profile copy. |

## State inventory

| State | Presentation and recovery |
| --- | --- |
| Default/approved | Only approved fields render. Appointment action passes stable canonical ID; schedule is absent. |
| Partial optional content | Omit missing portrait, credentials, interests, biography subsections, language, affiliation, location, or related-service module without placeholder text or empty headings. Required identity/profile completeness remains a publication decision. |
| Portrait unavailable | Use the approved neutral fallback or no image. It cannot resemble a real person, infer gender, or repeat the nearby name to assistive technology. |
| Appointment route failure | Keep profile content; explain failure; offer approved staffed appointment phone and directory/services routes. Never claim booking. |
| Record expired/unapproved | Unpublish. Redirect only to a genuine approved successor; otherwise return an honest 404/410/unavailable view with directory, services, contact, and emergency shell routes. |
| Related service absent/retired | Omit the relationship; do not leave an empty Related services heading or circular-only link. |
| Loading | Core profile is server-rendered. Do not show an identity skeleton in place of known content; optional enhancement loading cannot block name, specialty, or request route. |
| No JavaScript/images/fonts | Identity, approved content, appointment link/form route, call fallback, breadcrumb, review metadata, and related text links remain usable in order. |

## Appointment handoff and continuity

```text
Profile → Request an appointment
        → /appointments/?doctor={stable-canonical-id}
        → form shows approved doctor name from that ID
        → user may change to Service or Not sure without stale doctor validation
```

- The identifier is a governed public record key, not free text, a schedule claim, or personal visitor data.
- Back returns to the same profile and useful scroll position where supported.
- If the doctor becomes unavailable before submission, the form explains that state and lets the visitor choose another doctor, a service, Not sure, or staffed contact; it does not silently swap clinicians.
- Language switching re-renders the approved translated display record while retaining the same canonical identifier.

## Publication and approval gates

- Medical staff owner approves current status, canonical identity, credentials/title, specialty, clinical interests, biography, qualifications, languages, affiliations, and profile completeness (`D-001`, `D-004`).
- Operations resolves the schedule defects and `LT` meaning before any schedule row is published; until then all schedules are omitted (`D-005`).
- Content + Delivery approve one canonical URL per clinician and retired/duplicate redirect behavior (`D-003`, `G-013`).
- Content approves portrait source, consent/rights, crops, and fallback treatment (`D-006`).
- Clinical + Content approve doctor-service relationships and all clinical wording; Operations approves location and appointment guidance (`V-005`, `D-004`).
- Delivery + QA test canonical-ID handoff, missing optional data, retired profiles, keyboard/screen reader, 320 px/400% zoom, bilingual expansion, no-JS/media failure, and constrained performance.
