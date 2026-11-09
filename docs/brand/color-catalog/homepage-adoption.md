# Homepage color adoption

> Evidence availability (8 November 2026): some historical captures referenced below are absent from this checkout. Their filenames are retained as archive references, not current verification evidence. Rerun the documented checks for fresh evidence.

**Document status — deliverable 6:** Historical deliverables 1–3 review. Later composition corrections and rollout are consolidated in the current guide. Evidence below retains its original scope. Use the [current usage guide](../usage-guide.md).

4 November 2026 · Deliverables 1–3 · Base: `3f3b10a`

The approved composition now runs in the website implementation. Brand Guardian and UI
Designer agree on the rendered composition; Accessibility Auditor reports no outstanding
source blockers within the reviewed color/focus scope. Browser checks substantiate the
specific layout, color, state, and interaction findings below.

## Delivered

| Deliverable | Result |
| --- | --- |
| Production color system | 443 canonical primitive/semantic/component tokens, generated CSS and TypeScript, 33 contrast policies, independent public roles for reading, headings, links, actions, selection, inverse surfaces and accents. Competing root color overrides removed. |
| Refined homepage | Natural-color photographic opening; deep-blue care discovery with pale-blue type and framed links; mist technology; white specialists; pink editorial chapter with one saturated magenta quote; peach visit preparation; red urgent access; deep-blue footer. |
| Expert review and refinement | Independent brand and accessibility source reviews, desktop/tablet/mobile screenshot review, simplified card framing, earlier orange support detail, corrected field boundaries, and verified contextual keyboard focus. |

The composition is the existing `WebsiteHome` development preview at `/`, available with
`pnpm dev` at [localhost:3000](http://localhost:3000/). Existing `isLocalDemo()` behavior
intentionally selects a separate content-withheld homepage in `next build`/`next start`.
That publication gate is preserved. Its remaining literal colors were rebound to the same
semantic roles; the full demo composition has not been exposed in production. This delivery
does not publish the website or redesign every interior page.

## Visual evidence

All images below are browser captures of the final implementation, not concept mockups.

| View | Evidence |
| --- | --- |
| Desktop, 1440px | Opening and care discovery (unavailable archive: `../evidence/homepage-color-adoption/desktop.jpg`), technology and specialists (unavailable archive: `../evidence/homepage-color-adoption/desktop-middle.jpg`), stories and contact (unavailable archive: `../evidence/homepage-color-adoption/desktop-lower.jpg`) |
| Tablet, 768px | Stories, contact, visit preparation and resources (unavailable archive: `../evidence/homepage-color-adoption/tablet-lower.jpg`) |
| Phone, 390px | Opening and discovery (unavailable archive: `../evidence/homepage-color-adoption/mobile.jpg`), specialists and stories (unavailable archive: `../evidence/homepage-color-adoption/mobile-middle.jpg`) |
| Lower sections, desktop/phone | Desktop visit (unavailable archive: `../evidence/homepage-color-adoption/desktop-visit.jpg`), phone visit (unavailable archive: `../evidence/homepage-color-adoption/mobile-visit.jpg`), desktop footer (unavailable archive: `../evidence/homepage-color-adoption/desktop-footer.jpg`), phone footer (unavailable archive: `../evidence/homepage-color-adoption/mobile-footer.jpg`) |

Original logo, existing fonts, imagery, content, routes, and interaction behavior remain.
No assets were sourced or generated for this refinement. Existing generated images,
fictional stories/quotes, clinician examples, and illustrative statistics retain their
existing preview status; existing image provenance remains in the brand records.

## Review findings and resolutions

- **Role ambiguity:** Heading, reading, filled action, link, and inverse roles previously
  shared the same public ink alias. They now have independent bindings. The legacy ink
  alias remains a compatible heading/deep-blue role; ordinary global links use strong blue.
- **Overly uniform surface rhythm:** Deep-blue discovery, pink editorial content and peach
  preparation now have complete environments, separated by quieter imagery/content sections.
  No area-percentage quota limits those fields.
- **Care-card density:** Removed the internal action rule while retaining the outer frame
  and circular arrow. The card has one less competing structural layer.
- **Late orange recognition:** Added an orange support rule beside “Help choosing care”
  near the opening. Preparation uses deep-orange text, an orange frame and structural rules;
  ordinary text does not sit on saturated orange.
- **Action/field drift:** Search, health-search, film and shared header actions use the
  proper blue roles. Search controls have white interiors and meaningful control borders.
- **Inverse focus:** Hero, care cards, equipment close and footer use white focus with a
  deep-blue gap. Light contexts use deep-blue focus with a white gap. Specific forced-colors
  selectors preserve system `Highlight` and remove separation shadows.
- **Urgent meaning:** Urgent help has its own red text/rule and matching tint, with explicit
  wording. Error and urgent aliases remain independently named despite sharing a primitive.

## Validation

Passed on the final source:

- Production build and TypeScript; changed-code ESLint; `git diff --check`.
- Token generation/drift validation: 443 tokens, 33 contrast policies, 7 protected contexts.
- Brand validator now checks current interface roles against the machine-readable brand
  record, retaining historical logo provenance separately.
- Foundation contracts, 14 homepage SSR/omission/safety cases, homepage enhancement and
  health-finder checks, plus repository local-link checks.
- Browser layout/interaction checks at 320, 390, 768 and 1440px: no horizontal page overflow,
  loaded visible images, valid fragment destinations, one H1, expected computed roles,
  search-mode switching, menu dismissal, native disclosures, health-topic selection and
  keyboard-focus return. Representative doctors, services, appointment, emergency and
  patients/visitors routes rendered without page overflow or browser exceptions.
- Browser focus checks at 390 and 1440px: light/inverse outlines and gaps, forced-colors
  `Highlight`, hover/pressed colors, reduced-motion hero, no-script content/service fallback
  and native disclosure. See [browser results](../evidence/homepage-color-adoption/browser-checks.json)
  and [focus results](../evidence/homepage-color-adoption/focus-checks.json).
- Final design inspector at 1440/768/390px: **0 failures, 3 warnings** with explicit allowances
  for the client's approved expressive type, story attribution, structural lines and frames.
  Warnings retain the curated warm canvas, existing responsive type scale, and existing
  intentionally controlled partner carousel. These are documented design choices.

Two existing repository checks are not green: `patient-testimonials:check` expects a preview
notice from the unchanged legacy `PatientTestimonials` component; this homepage uses
`EverydayStories`, whose preview notice remains visible. The repository-wide format check
also reports missing newlines/whitespace in existing capture and generated artifacts. Neither
was repaired by changing unrelated content or evidence. Changed source passes scoped hygiene.

Real screen-reader testing and complete WCAG conformance were not established. Photo contrast
still depends on the tested crop/scrim; this review does not certify future images or crops.

## Render critique

ROUND 1 — before

Seen in one second: the care conversation; next action clear.
Idea: practical discovery and personal care occupy one patient journey.
Live thing: doctor/service search and the health-topic reader.
Layout words: photographic opening / card discovery / equipment showcase / clinicians /
human scene / statistics / stories / contact / visit guide / resources / footer.
Scores: design 7.0 · usability 8.0 · creativity 6.5 · content 7.0 → overall 7.2.
Top problems: uniform paper/mint sections; separate equipment slate palette; overloaded action ink.

ROUND 2 — final

Seen in one second: the care encounter and appointment action; blue discovery follows.
Idea: the hospital's practical and personal care journey becomes a sequence of distinct colored rooms.
Live thing: existing care search, expandable preparation answers and topic reader, including focus return.
Layout words: photo / framed directory / mist showcase / white portraits / human scene /
deep-blue statistics / pink editorial / contact / peach preparation / quiet resources / blue close.
Scores: design 8.0 · usability 8.0 · creativity 7.0 · content 7.0 → overall 7.7.
Caps applied: generic creative idea remains bounded at 7; client-authorized expressive devices
are intentional exceptions to the skill's generic aesthetic bans, not accessibility exceptions.
Top three refinements completed: simpler card structure; earlier orange support cue; consistent
fields/actions and contextual focus. Remaining limits: long existing content sequence, broad
inherited type scale, and preview content. Scores are qualitative reviewer judgment, not certification.
