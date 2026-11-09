# X: color, composition and component strategy

**Status:** adopted implementation specification. See the [delivery record](x-implementation.md) for verification and limitations.
**Decision:** user selected X with richer supporting colors, 9 November 2026.
**Authority:** [DESIGN.md](../../DESIGN.md), [PRODUCT.md](../../PRODUCT.md), current
source and the selected rendered X study. This specification governs the application implementation; local verification
is distinct from deployment or hospital publication approval.

[Open the color and composition map](x-color-composition-map.svg) for the visual
overview. The map summarizes relationships; its band heights are not page-height
or color-percentage specifications.

## 1. The design decision

Build a composed, welcoming hospital site. Blue provides continuity and clear
actions. The other hospital colors have enough area and typographic presence to
be felt, with a reason for being where they are.

**The idea:** the emblem's open, embracing composition becomes generous framing
for people and clear paths into care. Keep the emblem intact; this is a design
interpretation rather than an assertion about its original symbolism. The
existing care finder is the principal interactive expression of that idea.

The hospital's specific material is its four-color emblem, full hospital name,
Gotera Agona/Addis Ababa location, existing care-discovery paths, appointment
preparation journey, visit checklist, contact/directions handoff, specialist
portraits, institutional story, equipment presentation, and patient-story format.
Some assets and records are explicitly demonstration material: their presence
does not establish real staff, equipment, capabilities, partnerships or outcomes.

This is an expansion of X, not another palette contest. No new random art
direction, font pairing, framework or visual identity is required. Impeccable
provides hierarchy/context discipline; UI UX Pro Max provides task/state checks;
Design Taste provides composition, image, type and restraint principles. Generated
green-palette and social-proof-template recommendations from the generic skill
search were rejected because the selected hospital identity and real evidence
take precedence. A generator's accessibility label is not conformance evidence.

### What becomes visibly different

1. Pale blue stops covering several neighboring homepage chapters. White care
   discovery and contact sections create separation; specialists retain a pale
   stage and natural portraits.
2. Preparation becomes a substantial peach chapter with complete deep-orange
   headings and well-resolved disclosures. Stories become a substantial pink
   chapter with complete deep-magenta headings and a considered media action.
3. Yellow becomes a compact, labeled next-step destination at relevant handoffs.
   It gains useful area rather than appearing mainly as an isolated decorative dot.
4. Interior pages receive composition variants suited to finding, doing or
   reading. Privacy, feedback and service detail stop inheriting identical
   decorative treatment simply because they share a wrapper.
5. Supporting color reaches component interiors—disclosure affordances, guidance
   slips, story controls and preparation insets—with explicit foreground/state
   pairs. Main care actions remain recognizable across the site.

## 2. Palette, dosage and local contexts

| Context | Ground | Heading | Body / supporting text | Ordinary link |
| --- | --- | --- | --- | --- |
| Default reading | White or `#FBF8F6` | `#00445D` | `#17313D` / `#52636B` | `#00678D` |
| Quiet care | `#EAF5F9` | `#00445D` | Same default inks | `#00678D` |
| Preparation | **`#FFEDDF`** | **`#A8430C`** | Default inks | Blue; deep orange for a clearly local disclosure link |
| Human story | **`#FBE4EF`** | **`#A61558`** | Default inks | Blue; deep magenta for story-specific reading controls |
| Bounded assistance | **`#F5C82D`** | `#17313D` | **Both `#17313D`** | **`#17313D`, underlined** |
| Inverse blue | `#00445D` | White | White; avoid untested opacity | White, underlined in prose |
| Featured cyan action | `#15B0E6` | — | **`#17313D` label and icon** | — |

Use these contexts as explicit component relationships. A yellow panel must reset
its secondary text and links as well as its heading. A white panel nested in a
colored chapter returns to the default reading context. A control within that
white panel uses the white-panel focus and boundary treatment.

**Dosage:** quiet surfaces lead task pages; preparation and story fields can lead
their own chapters. A normal interior page needs at most one substantial
supporting-color chapter plus a small assistance handoff where useful. The long
homepage can carry both preparation and story chapters because they have different
jobs and are separated by other material. Treat this as an attention rule, not a
pixel quota. Images contribute color too. If the page reads as equal peach, pink,
yellow and blue tiles, reduce repetition and restore a dominant subject.

The supplied orange and magenta remain visible in artwork. Their deeper companions
carry small text. Yellow help and yellow warning are separate semantic contexts:
help asks a question and offers a destination; warning states a condition with
explicit wording and an appropriate icon. Never imply clinical category, urgency,
specialist rank or availability through a brand color.

### Buttons and links: the deliberate exceptions

- **Primary care action:** white on `#0078A6`; hover `#00678D`; pressed `#00445D`.
  Keep labels and icons white throughout. Header, directories, forms, contact
  actions and appointment continuation share this vocabulary.
- **Featured hero appointment action:** body ink on supplied cyan; hover
  `#D0EFFA`; pressed `#EAF5F9`, retaining body-ink label/icon and the visible focus
  treatment. Its dark photographic setting supplies separation. Do not spread
  this special action to ordinary white-ground forms.
- **Inverse footer handoff:** white action with deep-blue label; hover blue mist;
  pressed selected blue. Retain the separate white focus outline and inverse gap.
- **Story media action:** one contextual `Watch story` action may use white on
  existing `#D81B72`, hover deep magenta `#A61558`, pressed deep magenta with an
  inset white state cue. `Read story` stays a deep-magenta text/disclosure action.
  This is editorial media, not a second appointment-primary color.
- **Preparation disclosure:** deep-orange label/icon on peach; white icon well
  when closed; deep-orange icon well with white glyph when open, plus chevron
  orientation and expanded content. Keep ordinary navigation blue.
- **Assistance:** dark underlined text is normally sufficient on yellow. If a
  filled action is needed in a large help panel, use white on deep blue; do not
  add a second yellow or bright-orange button.
- **Emergency:** preserve the existing deep-blue call stage and large white
  phone action, including the inverse mobile call bar. Red urgent cues and red
  emergency action variants keep their existing white-label pairings. Do not
  reuse story/preparation treatment for emergency or error controls.

Text-link hover and active tokens are separate from filled-action tokens even
where current values coincide. No hover changes font weight, dimensions or page
layout. Never inherit a bright fill color as transparent-link text.

Use the existing SVG icon family and `currentColor`: approximately 20px inline
with action labels, 24px for larger utility controls, consistent 2px viewBox
strokes for the shared `Icon` family. Keep media-specific glyphs coherent within
their control group. Do not add a new icon library or put every icon in a tinted
tile. Preparation glyphs may use deep orange and story controls deep magenta;
meaningful controls retain a tested foreground and a readable label. Decorative
artwork remains distinct from interface icons.

### Contrast contract

Measured on exact opaque sRGB values; these are palette checks, not a complete
assessment of photographs, rendered glyphs or all component states.

| Foreground / background | Ratio | Decision |
| --- | ---: | --- |
| Deep orange / richer peach | 5.31:1 | Normal text supported |
| Deep magenta / richer pink | 6.08:1 | Normal text supported |
| Blue link / peach; pink | 5.54:1; 5.25:1 | Supported |
| Secondary ink / peach; pink | 5.49:1; 5.20:1 | Supported |
| Body ink / yellow | 8.54:1 | Use for all help text roles |
| Blue link / yellow | 3.96:1 | Fails normal text; reset to ink |
| Secondary ink / yellow | 3.93:1 | Fails normal text; reset to ink |
| Body ink / cyan | 5.43:1 | Featured action label |
| White / primary blue | 4.96:1 | Normal action label |
| White / darker magenta `#D81B72` | 4.86:1 | Story media action label |
| White / deep magenta | 7.32:1 | Contextual hover/strong fill |
| White / deep orange | 6.05:1 | Open disclosure glyph / bounded fill |
| White / supplied orange; magenta | 3.26:1; 4.22:1 | Fail normal text |
| Body ink / supplied orange | 4.17:1 | Fails normal text |
| Control edge `#718892` / peach; pink | 3.27:1; 3.09:1 | Supported boundary, little margin on pink |

Use at least 4.5:1 for normal text and 3:1 for large text. Required non-text
control/state cues generally need 3:1 against adjacent colors. Compare unrounded
ratios, including hover/pressed and transparent backgrounds. See W3C
[text contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
and [non-text contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html).
The study's pale peach separator is decorative; it cannot substitute for a
meaningful control boundary. White labels on raw cyan remain excluded.

## 3. Typography, frame and composition

Keep the established self-hosted fonts. `Editorial` is FreeSerif, Lato supplies UI
and reading, and Ethiopic is the Noto Sans Ethiopic fallback. The emblem/wordmark
is an identity exception, with the existing Clash Grotesk treatment. No extra
display font or downloaded pairing is needed.

| Role | Desktop target | Phone target | Treatment |
| --- | --- | --- | --- |
| Homepage hero | 72–88px | 44–56px | Editorial regular, white, roughly 1.05 line height |
| Interior page title | 48–64px | 36–44px | Editorial regular, deep blue |
| Major chapter heading | 40–50px | 30–36px | Editorial regular, about 1.15 line height |
| Card / task subsection | 22–24px | 20–24px | Lato bold, about 1.3 line height |
| Reading copy | 17–18px | 17px | Lato regular, 1.55–1.65 line height |
| Controls / essential guidance | 16px minimum | 16px minimum | Lato regular or available bold |
| Nonessential metadata | 14px | 14px | Secondary ink, comfortable leading |

These are bounded roles, not permission for every intermediate one-pixel size.
Consolidate existing near-duplicates. Keep full clinician names, medical terms,
field labels and factual titles; do not truncate or rewrite them for appearance.
Major marketing headings aim for two lines; long medical/document headings may
wrap naturally. Use relative units and preserve browser text scaling.

Set complete headings in one face/color; remove recurring colored or italic
fragments such as the current accented words in preparation and care headings.
Full preparation headings can be deep orange; full story headings deep magenta.
Body paragraphs stay ink. Link color means destination, not decoration. Dates,
categories and bylines remain readable text rather than tiny letter-spaced pills.

Preserve the approximately 1280px shared content cap and symmetric gutters:
40px desktop, 24–32px tablet, 20px phone, 16px at very narrow widths. Full-bleed
photo/color fields contain that same frame. Reuse its column edges for titles,
lists, actions and images. Long reading is approximately 60–68ch; task forms
approximately 640–720px when the layout permits. Do not stretch prose to fill a
wide frame.

Use a 4/8px spacing basis: 8–16px within controls; 16–24px between related items;
24–40px between component groups; approximately 64–96px between major desktop
chapters and 40–56px on phones. Related content has less space than chapter
transitions. Do not introduce tall empty bands to make the site feel premium.
Keep current compact task density where useful; do not impose homepage spacing on
forms or legal documents.

Geometry stays recognizable: 8px actions/controls, 12px ordinary panels, 20px
editorial media stages. Native radios/checkboxes and true utility pills retain
their appropriate shapes. Prefer open layout and tonal changes to nested cards.
Retain visible working-control edges. Remove decorative card-top strokes, hairline
section framing and idle shadows where tone/space already separates the content.

## 4. Shared shell: header, navigation, help and footer

### Header and menus

White primary bar, paper utility bar, unchanged emblem and full hospital identity.
The blue appointment action remains the strongest header control. Navigation uses
deep-blue text; current item uses underline plus weight/`aria-current`. Contacts,
language and emergency remain useful and legible. Official channel icons keep
their recognizable identity colors; these are not invitations to recolor the UI.

Keep compact navigation when space demands it, based on actual content fit.
Mobile shows identity and Menu clearly; useful utility actions remain within the
existing compact structure. The open menu is a white working surface with grouped
links, a blue appointment action and distinct emergency information. Current,
hover, focus, Escape and return-focus behavior must remain clear. A shadow is
appropriate on this genuinely floating surface; a glass or pill-shaped header
is not part of X.

### Help and Patient Guide

Keep the small shared launcher visually subordinate to page actions, with the
existing anchored clearance behavior. Do not turn it into a persistent large
yellow callout on every viewport. Its open menu/guide uses white reading and
response surfaces with blue controls. Yellow belongs to a short help introduction
or in-page decision handoff, not every message bubble. Questions, suggestions,
loading, clarification, retry and unavailable states need words and focus handling.
Retain the distinction between prepared website guidance and clinical advice.

### Footer

Deep-blue field, readable white information, one clear inverse appointment
handoff. Keep useful care/visit/hospital groups, contact details and the intact
identity. The current orange identity detail can stay as a single bounded mark;
do not add one beneath each link group. Replace ornamental separators with space
where their removal leaves groups clear. Avoid a giant decorative wordmark or
extra pre-footer CTA section that crowds out practical navigation. On phones,
stack the closing message/action before the link groups and identity/contact close.

## 5. Homepage: chapter-by-chapter composition

Preserve the existing content sequence and working destinations. Change visual
emphasis and composition locally, without removing content to make the page thin.

| Chapter and its job | Composition and field | Detail / phone consequence |
| --- | --- | --- |
| Hero: identify hospital and next care action | One large natural care scene; deep-blue copy region, white serif title, cyan appointment action | Faces remain visible; short portrait crop above the reading area on phone. Keep the useful location link. Scrim serves copy only. |
| Care finder: start a known or uncertain search | Pale-blue working band; white inputs; blue action | Mode selection uses a native/explicit cue. Labels precede controls; phone stacks mode and search. Preserve query and destination behavior. |
| Quick access: plan / arrive / urgent information | Compact white labeled navigation | Orange supports preparation, blue directions, red emergency. Use clear destinations, not three promotional panels. Stack useful full-width rows on phone. |
| Specialized care: show available discovery paths | **White chapter**, pale-blue destination cards; existing four-color artwork beside introduction | Same treatment for each specialty, readable headings and summaries. Remove repeated cyan decorative card-top lines. Cards stack/fit by width. |
| Specialists: connect names to people | Pale-blue stage, portraits on white, deep-blue names | Preserve comparable identity and directory handoff. Existing desktop/tablet browsing controls remain; mobile retains compact readable rows. Remove isolated yellow heading dot. |
| Uncertain-care handoff | One **bounded yellow** question/action block at the end of specialists | Dark text/link throughout. Compact enough to read as a handoff rather than a new major chapter. |
| Visit preparation: explain what to bring and confirm | **Richer peach `#FFEDDF`**, complete deep-orange heading; checklist left, disclosures right | Distinct checklist and disclosure columns, stacked on phone. No card around each list item. Explicit chevron/open-state treatment. |
| Contact/directions: help people arrive or call | **White** practical chapter; useful map/address and phone hierarchy | Keep phone prominent and native contact actions. Small peach arrival inset only if needed; map credit remains. No extra warm outer panel. |
| Health topics: bridge to useful reading | Compact paper editorial band, heading opposite short text/action | Its scale is smaller than the care and institutional chapters. Phone follows a simple heading → copy → link sequence. |
| Technology: present the equipment topic | Pale-blue stage; one substantial image and concise explanation | Preserve natural equipment color. Preparation content reached from this chapter may use peach; never use orange/yellow as equipment-status lights. |
| Hospital story: explain origins and people | White editorial layout with title/description and a deliberate founder portrait relationship | Preserve source content; avoid a large blank gulf around the portrait. Phone keeps portrait and identity together. Do not invent institutional proof. |
| Everyday stories: show human experience | **Richer pink `#FBE4EF`**, complete deep-magenta heading, generous natural human image | Plain byline placed with story text, not a floating pill. Contextual Watch / Read controls. Body copy stays ink; phone image precedes copy. |
| News/resources: offer deeper reading | Paper; one dominant story plus two supporting entries | Preserve useful asymmetry. Blue titles/links, readable metadata. Remove arbitrary colored top strokes and repeated framed boxes. |
| Organizations: practical arrangement information | Quiet white, grouped native disclosures with actual organization artwork | No automatic logo carousel or endorsement wall. Keep wording that arrangements require confirmation. |
| Footer: close with useful routes | Deep-blue shared close | Consistent with interior pages; no additional saturated chapter before it. |

The scroll should read: **human blue opening → clear care discovery → people →
peach preparation → practical white → quiet learning/technology → institutional
story → pink human story → useful resources → blue close.** The page is not a
repeating alternating-color checkerboard. A neighboring chapter changes emphasis
through image, layout or density as well as ground.

## 6. Interior pages: purpose determines the composition

Introduce explicit composition variants in shared page wrappers where needed;
do not recolor all `PatientPage` instances through a global selector. Modes below
belong to these surfaces, not the whole hospital product.

| Route / surface | Visitor mode and priority | Selected composition and supporting color |
| --- | --- | --- |
| `/` | Persuade + care discovery | Homepage sequence above; also apply roles to governed/partial home fallback. |
| `/doctors` | Operate: compare and find | Quiet title, pale search/filter workspace, white comparable results. Portraits lead. Peach preparation guide; compact yellow assistance after results. No rainbow specialties. |
| `/services` | Operate: find a care path | Same task vocabulary; clear service names/descriptions, uniform blue destinations. Preparation/help bands have distinct roles, not one generic tinted band. |
| `/doctors/[slug]` | Read → act: understand clinician | Portrait/name/specialties form identity; white readable details; blue appointment handoff. Peach visit/preparation guidance; yellow only for genuine uncertainty. Complete long names and missing portrait fallback. |
| `/services/[slug]` | Read → act: understand access | Title/summary first, clear access action and related team. Peach for preparation only. Preserve service-specific appointment, referral, emergency, contact and guide-only branches; no universal Book action. |
| `/appointment` | Operate: prepare/request appropriately | Quiet title, white form with readable fields and blue continuation. Peach preparation guidance is a secondary companion; review/request summaries and final status stay neutral/status-specific. Yellow unsure-care assistance stays outside the form. |
| `/patients-visitors` | Read + navigate: prepare a visit | Practical-guide opening, clear anchors, peach preparation chapter, white reading, blue directions/contact. Do not tint every section. |
| `/referrals` | Read → act: understand procedure | Practical/document composition; concise requirements and verified next steps. Peach checklist/preparation inset; blue contact/referral destinations. No decorative care hero. |
| `/faq` | Read/find answer | Simple title and grouped questions/disclosures; white reading on paper. Peach only for visit-preparation group if it improves scanning. No separate colored card for each answer. |
| `/about` | Persuade + Read: understand hospital | Preserve image-led opening, history, founder, film, leadership and technology. Give the existing “The founding vision” human account a pink field and complete deep-magenta heading; history/leadership stay white, technology pale blue, equipment preparation peach. Preserve interactions and factual caveats. |
| `/contact` | Operate: choose contact/arrival route | Compact useful title, white contact/map working areas. Peach arrival checklist; red distinct urgent route. Phone numbers/action precede decorative material. |
| `/emergency` | Operate: access urgent information | Direct title, existing deep-blue call stage and large white phone action, distinct red urgency cues, quiet arrival information. Clear call handoff and alternate information. Keep warm brand decoration out of the urgent task. |
| `/health-topics` | Operate + Read: find a topic | Quiet title, stable blue search/filter controls, white results. Remove the decorative magenta input underline. Pink may mark one conversation-guidance introduction; topic categories never receive arbitrary brand colors. |
| `/health-topics/[slug]` and reader | Read: understand and prepare questions | Document/reader composition, comfortable white reading column. Peach preparation/questions inset, blue care/contact handoff. Keep clinical caveats and source/review cues legible. |
| `/news-resources` | Read/browse | Editorial title; one leading item plus consistent archive entries. Pink can own the archive introduction, not every article card. Readable categories and blue links. |
| `/news-resources/[slug]` | Read: comprehend article | White reading column, title/image/chapter navigation; paper margins. Contextual pink story inset or peach preparation inset only when content warrants it. Preserve source return and reader position. |
| `/feedback` | Operate: compose/review locally | Compact task opening, white fields, blue next action, quiet pink invitation/guidance inset. Preview/unavailable wording stays beside the form; neutral review, no decorative magenta review border or success styling for a message that was not sent. |
| `/careers` | Read → act: understand opportunities | Restrained recruitment composition with the actual supplied information. Blue destinations and optional small yellow question handoff. No invented openings, benefits or staff photographs. |
| `/patient-rights` | Read: understand rights/responsibilities | Document layout, white reading, clear contents/headings and source cues. Minimal accent; no decorative hero/artwork repeated before the document. |
| `/privacy` | Read: understand data practices | Quiet document layout, reliable links and narrow measure. No colorful promotional sections or compulsory photography. |
| `/component-library` | Operate: inspect the system | Neutral specimen environment with labeled context/state examples. Show real components in all approved contexts, including nested surfaces and exceptional states. |

In profiles/articles/guides, a repeated subsection can share a layout for scanning.
In directories, repeated cards are comparison tools. These are deliberate
exceptions to gallery-style bans on repetition. Real step order and control
boundaries also remain legitimate. No gallery preference overrides content,
task clarity, the selected palette or the actual emblem.

## 7. Shared component and state specification

### Shared wrapper contracts

Extend `PatientPage` with an explicit composition variant, selected by the route,
rather than inferring visual purpose from its URL or alternating section index:

| Variant | Opening and hierarchy | Section behavior |
| --- | --- | --- |
| Care detail | Identity/summary, relevant image if supplied, real access action | Care information → preparation → related care/action; preserve branch-specific destinations |
| Practical guide | Compact title/summary with visible section navigation | Open reading groups; one substantial preparation context; useful local contact/directions |
| Document | Compact title, summary/source cues and contents | Reading measure; no artwork hero, compulsory lead CTA or alternating panel sequence |
| Recruitment | Clear introduction, actual opportunities and their details | Comparable real listings; peach application preparation; preserve sample/unavailable wording |
| Task | Compact title and consequence/preview explanation beside the working area | Form/composer leads; supplemental guidance is secondary; neutral review and explicit status |

Keep breadcrumbs, heading structure and focusable section targets. Make the
wrapper's lead action optional for document/task variants; retain useful existing
actions at the point their content supports them. Existing copy is preserved.
Sections select explicit neutral/preparation/story/assistance context as needed;
do not let a boolean `tone` impose the same pale panel on every second section.
Status components keep their own status context. Distinguish an information
panel from an actionable card in both semantics and visual affordance.

### Reusable specimens

| Component | Resting design | Required state/detail treatment |
| --- | --- | --- |
| Primary/secondary/text actions | Blue primary, white/quiet secondary, underlined prose links | Explicit hover/pressed/focus; labels and icons use the same foreground; stable bounds. |
| Search/filter/segmented choices | White fields, visible control edge; blue working context | Selected blue plus native mark/underline and state semantics; pending/result count/empty/reset wording; retain query and focus. |
| Doctor/service cards | Comparable light surfaces; portrait or concise care content | Whole-card focus is visible; nested actions avoid ambiguous duplicate interaction; selection is distinct from hover. No arbitrary support-hue categories. |
| Preparation checklist/disclosure | Peach ground, deep-orange local headings; ink list copy | Open/closed chevron, contrast-safe icon well, readable expanded links. Ordinary field boundaries remain stronger than decorative separators. |
| Story card/player/reader | Pink editorial context, natural image, plain byline | Watch/Read hierarchy, dark media canvas, visible close/pause/transcript controls; keyboard containment/return and no-JS reading fallback. |
| Assistance band | Yellow + ink, compact question and destination | Link hover/active stays ink with underline; blue filled action only if needed. Never default blue/muted text on yellow. |
| Appointment/form controls | White fields, ink labels, readable helper text | Invalid boundary + icon/message and association; pending wording; disabled semantics; review/edit continuity; no validation color used as decoration. |
| Status message | Its named info/success/warning/error context | Explicit condition/action, visible icon and text. Preserve technical distinctions between failed, unknown, duplicate, receipt and unavailable states. |
| Breadcrumbs/anchors/pagination | Plain readable blue links | `aria-current`, underlines/position cues; sticky-header clearance and browser history/focus behavior. |
| Tabs/disclosures | Native behavior or established accessible pattern | Selected/open cue beyond color; arrow key behavior only where the existing semantic pattern requires it. |
| Dialog/menu/language picker | White working surface; dark separated backdrop where modal | Focus handling, dismissal and focus return; scroll containment; no invisible content under fixed chrome. |
| Missing/withheld/unavailable content | Quiet informative surface | Preserve verification wording, useful fallback, stable layout and honest disabled actions. Do not style unavailable care as available. |

### Focus and boundaries

On supported light surfaces use a 3px deep-blue outline, about 4px offset, with
an opaque white separation gap when needed. The magenta Watch action on pale pink
uses this light-context treatment: dark outer ring, white separation. A white
outer ring alone against pink is insufficient. On inverse blue and the cyan action
against the dark hero, use a white outer outline with a dark separation gap. A
white control in an inverse field needs a dark gap before the white ring. Test
actual adjacent colors and clipping. Strong orange/magenta grounds, if used in
existing exceptional contexts, require inverse focus; deep-blue focus on them
does not meet the required contrast.

Inputs remain white within light contexts and keep a contrast-safe control edge.
Do not nest an untested input directly on selected cyan or saturated yellow.
Check the field's inner and outer adjacent colors. Focus must remain visible
under sticky headers and outside overflow clips. The project aims for fully
visible focus, stronger than the minimum partial-visibility requirement described
by [W3C](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html).

Use 44px minimum practical target areas and 48px principal form/actions where
appropriate. This is the project's design target, not the WCAG 2.2 AA 24px target
minimum with its exceptions; see [target-size guidance](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html).
Retain forced-colors support and native control semantics.

### State coverage that must survive

- Directories: initial, query/filter selection, pending, updated, empty, failure,
  offline/unavailable where supported, clear/reset, keyboard and native GET fallback.
- Profile/service: complete, partial/withheld, missing/gone, retrieval failure,
  portrait fallback, unavailable action and each access branch.
- Appointment: validation, current step, selected care/doctor, loading/pending,
  review/edit, local preparation, workflow unavailable, known failure, unknown
  outcome, duplicate, receipt and delivery warning in the existing scenario paths.
- Emergency: current/expired/unavailable information, missing contact, native call
  handoff and map fallback. Emergency remains distinct from appointment requests.
- Reading/media/help: article/source return, disclosure open/closed, dialog/player
  controls, transcript, empty search, loading, clarification, failed download/retry,
  focus return and reduced-motion/no-JS alternatives.
- Feedback/language: local compose/review/unavailable, retained text, pending
  language load, failed download/retry and storage-denied fallback.

These are styling and continuity obligations, not authorization to activate
unfinished workflows or invent new operational outcomes.

## 8. Imagery, responsive detail and motion

Keep natural skin tones and meaningful crops. The hero shows the conversation,
portraits keep heads/shoulders consistent, equipment images retain useful detail,
and editorial images retain their subject. Use a shared aspect ratio per content
type, not one ratio for every image. Dark media canvases can retain their existing
specialized tokens. Neutral/deep photo scrims are legibility tools; do not tint
the entire photograph cyan, orange or magenta.

The hospital's own approved entrance, reception, clinicians and equipment would
strengthen specificity when available. Do not search for generic stock and label
it as the hospital. Current concept/fictional media and content retain their
existing provenance and publication constraints. No new media or copy is required
to implement this color direction.

Phone layouts retain a meaningful hero crop, readable quick-access rows, compact
specialist identity, full-width usable fields, and useful document contents.
Tablet is checked independently; desktop sidebars may stack before their content
becomes cramped. In task flows, critical fields/actions precede supplemental
guidance when columns stack. No fixed Help/header element covers reading or a
focused action. Check 320/375/390px, 768px, 1024px and 1440px plus a short landscape
viewport, 200% text sizing and reflow/zoom.

Keep existing purposeful portrait, media and reading transitions. New color does
not require more animation. Feedback is roughly 150–200ms; small entrances, where
already justified, about 240–320ms with modest travel. Animate transform/opacity
for travel; ordinary short color feedback is allowed. Never animate whole-page
palette changes or delay practical information. Reduced motion retains all
content, selection, focus and immediate state feedback; remove nonessential travel.
There is no motion-count quota or autoplay requirement for task/document pages.

## 9. Implementation architecture and sequence

The earlier X injection is a visual reference. It is not the permanent CSS
implementation. Use explicit owner classes/context props, not `[class*='…']`
selectors or a new layer of `!important` overrides.

### Token changes

| Planned change | Canonical location / relationship |
| --- | --- |
| Add richer peach/pink primitives | `primitive.color.orange.100 = #FFEDDF`, `primitive.color.magenta.100 = #FBE4EF`; keep supplied brand primitives and existing 050 tints |
| Rebind supporting/expressive surfaces | Existing `semantic.color.surface.supporting/expressive` → new 100 primitives; review every consumer |
| Keep readable context inks | Existing supporting-text → orange.800; expressive-text → magenta.800 |
| Separate transparent-link states | Add `semantic.color.text.link-hover` → blue.700 `#00678D`, `text.link-active` → blue.800 `#00445D`; underline supplies hover feedback where default/hover share a value. Classify consumers currently using action-state tokens for text. |
| Explicit inverse focus | Add sibling `semantic.color.focus-inverse`; existing `focus` is a scalar, so do not add children beneath it |
| Explicit featured foreground | Add `semantic.color.action.featured-foreground` → mineral.900 if consolidating the existing hero context |
| Story media action context | New consumed semantic `action.story`, `action.story-hover`, `action.story-active`, `action.story-foreground` → magenta.600, magenta.800, magenta.800, white primitives; component roles → those semantic roles. Existing raw `accent.expressive` cannot supply the white-label fill. |
| Assistance component roles | Existing yellow highlight ground with ink primary/secondary/link state bindings |

All references obey primitive → semantic → component. Semantic-to-semantic aliases
are not allowed by the generator. Add only roles with an identified consumer;
optional strong orange/magenta chapter surfaces are not needed for this pass.

### Work packages and ownership boundaries

| Order | Scope / source ownership | Complete before moving on |
| --- | --- | --- |
| 1 | `tokens/tokens.json`, generator outputs, `docs/brand/brand-foundation.json`, `styles.css`; context components `brand-surface`, `task-card`, `essential-actions`, `system-states` | Add/rebind roles, reconcile brand record and contrast policies; verify nested white panels and status contexts in component library. |
| 2 | Shared shell and Help: `global-shell.tsx`, `hospital-shell.module.css`, `global-shell.module.css`, `help-widget.*`, `patient-guide.*` | Header/menu/footer states and contextual focus; no lost emergency/contact/language affordances. |
| 3 | Homepage and its component modules; `home-composition.css`, `usability-refinements.css`, `everyday-stories.css`; governed home template | Full chapter treatment and typography; normal/reduced motion and fallback homepage; remove touched superseded styling. |
| 4 | Directory/profile/service templates, search controls, `care-pages.css`, service-detail modules | Comparable result cards, deliberate preparation/help contexts, detail/access branches and selected-care continuity. |
| 5 | Appointment template, form primitives, doctor identity/visit choices, feedback composer | Quiet task surfaces, secondary guidance, full state matrix and keyboard recovery. |
| 6 | `patient-page.*`, information modules, health library, editorial/news, about/equipment, contact/emergency modules | Explicit care-detail/practical-guide/document/recruitment/task variants, route-by-route adoption; reading and urgent exceptions. |
| 7 | Specimen/fixture templates and affected repository checks | Complete state/context specimens, final route and journey review, reconcile stale documentation and check contracts deliberately. |

Update owning declarations rather than adding a final global override file.
`layout.tsx` imports several presentation layers; resolve cascade conflicts within
the touched scope. Do not refactor the whole styling stack just to adopt two tints.
Run `pnpm tokens:generate` and commit generated CSS **and** TypeScript together.
Keep canonical brand-foundation validation synchronized; retain historical logo
color provenance. Token consumer validation uses a fixed allowlist and does not
prove every website module adopted the direction.

## 10. Acceptance and evidence

The implementation is complete only when the full page compositions and reachable
states are reviewed. A homepage palette sample is insufficient.

1. **System:** token generation/freshness, brand consistency, relevant existing
   lint/type/component checks; add actual foreground/background pairs to contrast
   policies. Check context inheritance and text-link/action separation.
2. **Routes:** start current preview with `pnpm dev`; run fresh `pnpm visual:check`
   batches for every static public route and representative dynamic pages at
   390/768/1440. Include the governed/optimized home fallback, not only the enhanced
   local homepage. Confirm which preview is being inspected.
3. **Journeys:** run existing targeted hero, visit, contact, Help, directory
   search-feedback, care-continuity, appointment, media/reading and language checks
   where touched. Preserve useful contracts; revise outdated visual expectations
   explicitly rather than hiding regressions.
4. **Accessibility/stress:** keyboard traversal and focus return, reduced motion,
   forced colors, text scaling/reflow, short landscape and long content; compute
   actual rest/hover/pressed/focus pairs on peach, pink, yellow, cyan, inverse fields
   and nested white panels. Inspect scrims at actual photo crops.
5. **Design review:** open fresh full-page and section captures at all widths. Check
   dominant subject, type hierarchy, image crops, useful content, chapter rhythm,
   action consistency and absence of arbitrary color rotation. Fix the largest
   composition issues before polishing small accents.
6. **Record:** separate automated results from visual judgment. Each repository
   visual run retains its metadata and inspected-image list; leave uninspected
   evidence pending. No complete WCAG or production-readiness claim follows from
   these checks alone.

### Final design gates

- The hospital still reads as X at first glance: human imagery, deep-blue structure,
  cyan identity, readable working surfaces.
- Orange/pink/yellow are visibly useful at chapter/component scale without
  competing with every care action.
- The homepage does not have three consecutive chapters with the same ground,
  density and composition. Task directories intentionally retain repeatable cards.
- No isolated accent word, decorative rule or tiny badge substitutes for hierarchy.
- Forms and emergency information remain calmer and more direct than marketing.
- Every route and state retains content/verification semantics and useful next steps.
- No new asset, clinical assertion, color approximation or workflow is silently
  introduced by the implementer.

The direction, color values, role exceptions, route families and work sequence are
resolved. Remaining content/media approvals are existing product constraints;
they do not prevent implementation of this visual system.

## 11. Review provenance and current limitations

The strategy combines lead UI Designer, independent interior-page review and
technical token/contrast review, using the three requested skills. Current-site
baseline captured from a newly started local `pnpm dev` on 9 November 2026:
`artifacts/visual-checks/2026-11-08T22-14-30.722Z-responsive-nkIb7v/` (UTC name).
Ten representative routes × three widths passed automated structure, overflow,
image and console checks. Fresh visual findings and the exact image-inspection
scope are recorded with that run. Dynamic and other static routes were inventoried
from source; this strategy pass did not visually certify all of their states.

Design Taste baseline measurements are in
`artifacts/color-strategy-current-taste/report.json`. Its existing-site findings
are inputs to the strategy, not a failed implementation of this unbuilt spec.
Useful findings include excess near-duplicate type sizes, repeated decorative
rules, accent-word styling and small utility text. The functional location link,
controlled specialist browser, hospital palette and consented story media are
intentional contextual exceptions to generic gallery rules. Do not delete useful
information or add autoplay solely to satisfy the detector.

The previous reviewed X captures establish the selected color relationships; they
are historical reference, not current implementation verification. The strategy preparation itself did not modify application files. The subsequent
implementation is recorded separately in the [delivery record](x-implementation.md).
