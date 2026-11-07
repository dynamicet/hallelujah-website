# A whole life comes with you

**Current usage authority:** [Final website guide](usage-guide.md). This earlier document retains editorial context; current palette roles and composition are consolidated there.

Composition direction, revised 4 November 2026. Layout and typography describe the local
website; the curated color direction now drives application tokens and the refined homepage.
The institutional signature remains
**Bringing Quality Care Home**.

## Design argument

The person arriving for care carries a whole life with them. A conversation is the
opening scene, with the practical next step inside the same photographic space.
Faces remain unobscured; a localized scrim protects the reading area. This is a
care encounter, not a separate image card beside a marketing column.

The reference synthesis combines Faire's editorial restraint, Alden's surface
hierarchy, August's readable body rhythm, Luffu's human compositions, Apple's
visual focus, Turn.io's selective dark contrast, and Tedy's action hierarchy.
It uses Hallelujah's identity rather than importing reference-site colors. The next refinement
uses the curated blue family in the [color catalog](color-catalog/index.html),
[role mapping](color-catalog/color-role-mapping.md), and
[component study](color-catalog/component-study.html).

## Shared decisions

For color distribution, follow the [composition refinement](color-catalog/composition-direction.md)
and its revised study: large blue brand fields, peach/pink editorial environments, saturated accent
frames and panels, expressive text, rules, outlines, and shades. The original color study was a
functional baseline; its restrained accent placement does not limit the current direction.

`apps/web/src/app/intentional.css` supplies the shared frame and typography.
The homepage's final color composition is scoped in `apps/web/src/app/home-composition.css`.
Both consume the canonical application tokens through semantic roles and public aliases.

- Warm paper `#fbf8f6` establishes the canvas; white supports practical discovery;
  blue mist `#eaf5f9` and veil `#d5eaf2` group information. The study assigns reading
  ink `#17313d` to copy, deep blue `#00445d` to headings/footer, primary blue `#0078a6`
  to filled actions, and strong blue `#00678d` to ordinary links and hover. The app's
  earlier root color overrides have been removed. See the [adoption review](color-catalog/homepage-adoption.md).
  Orange `#f26522` supports selected details; deep orange `#a8430c` on pale orange
  `#fff0e7` supports readable accent copy. Magenta `#d81b72` is occasional editorial
  expression without gender, condition, or specialty coding. Yellow stays in original artwork.
  White fields use control edge `#718892`; quiet edge `#cbd8de` is decorative.
- The bundled, licensed FreeSerif font supplies major editorial headings, regular
  weight, with restrained negative tracking. Lato remains the functional face.
  The existing Clash wordmark treatment remains a brand exception. Ethiopic
  text keeps its script font and natural spacing.
- Desktop content is capped at 1280px with equal gutters. Paragraphs have separate
  reading measures. Section spacing scales from 64px to 104px.
- In the study, main appointment buttons use primary blue with white text on light surfaces
  and invert to white with deep-blue text on the photographic hero. They share a pill shape, a
  52px minimum homepage height, 16px label, and 14px/24px padding outside the hero.
  The hero action uses a 56px minimum height, regular 17px label, 16px/28px padding,
  and a centered label–arrow group with a 12px gap. Its secondary links form a
  matching pair with label-only hover/focus underlines and 44px targets. The
  header appointment control is quieter at 44px tall with a regular 14px label.
  All actions retain visible keyboard focus. Light surfaces use a 3px deep-blue outline
  with a 4px white separation; dark surfaces use white focus outlines. Decorative accents
  do not substitute for action or status semantics.
- Information panels use 16px corners; contained media uses 24px. The hero alone
  is edge-to-edge with no frame or rounded corners, including mobile. Normal
  surfaces are flat.

## Composition and behavior

Desktop opens with one full-width photographic scene, 600–720px tall. Regular
editorial type (64–88px, 1.02 leading, −.035em tracking) sits on the quiet left
side of the photograph. The clinician and patient remain clear on the right.
The primary appointment action stands alone above the doctor and visit links.

Below 1100px, the same scene becomes vertical: faces above, left-aligned reading
area below, joined by a dark scrim sampled to the scene's tone. Keep photographs naturally
colored and evaluate scrims separately for legibility during the color study; do not
automatically replace image overlays with brand blue. On phones
the photograph occupies the first 300px, with the headline starting at 260px;
short viewports reduce these to 240px and 200px. The headline uses 44–58px,
body 16px/1.55, with a full-width appointment pill and two quieter links beneath.
Landscape tablets use a 280px image lead-in with copy starting at 240px.
All essential actions remain available without animation or JavaScript.

**Composition contract:** never restore adjacent text/image columns in the hero.
`intentional.css` owns all enhanced-home hero layout rules; the competing rules
in `home-enhancement.css` have been removed. Future hero changes should update
this direction and the responsive regression check together. Patient tasks
retain priority over immersive effects. Emergency access stays in the header.

See [the hero decision and reference review](hero-composition.md) for rationale,
reference limitations, validation, and the remaining photography requirement.

Native doctor/service GET search follows the introduction. Service exploration
now precedes the health library. The library remains available farther down the
page, beside other informational resources. Clinician listings, visit guidance,
and the footer complete the care journey; deep blue is its study target. Directory page titles remain
visible on mobile.

Motion follows reading order: the hero heading and introduction settle over
500–560ms, with a 70ms offset; the photograph settles from 103.5% over 720ms.
The appointment actions stay still and immediately available. Section text enters
once over 480ms; photographs open within their frames over 620ms, with doctor
portraits staggered by 70ms. No scroll position is intercepted or extended.
Service selection crossfades photographs over 360ms and introduces its related
description and destination over 240ms. Press feedback lasts 140ms, color feedback
180ms. Reduced motion shows the finished state, including when enabled mid-visit.
The optional film retains a playback control and poster fallback. Focus indicators
are visible for links, buttons, inputs, selects and textareas.

## Content and release boundaries

Existing image provenance remains in the internal source records; this revision
adds no imagery, invented testimonials, statistics, clinicians or capabilities.
The local demonstration content remains demonstration content. Real participant
photography and hospital data still require their established intake checks.

Appointment submission remains disabled in the current local environment; contact
and language availability remain governed by existing records. Visual completion
does not establish that these operational services are ready for launch.

## Review

Browser evidence is stored in `.taste-skill/intentional-before`,
`.taste-skill/intentional-after`, and `.taste-skill/intentional-journeys`.
`node scripts/check-intentional-design.mjs` checks the six principal routes at
390, 768 and 1440px, service selection, mobile navigation and reduced motion.
It requires the design-taste-frontend skill's Chromium harness; override its
location with `TASTE_SKILL_ROOT` and the server with `HH_PREVIEW_URL`.
`node scripts/check-home-motion.mjs` checks animated desktop/mobile entrances,
immediately available actions, service changes, retained focus, one-time reveals,
live reduced-motion changes, and the no-JavaScript fallback.

`node scripts/check-home-hero.mjs` checks the unified edge-to-edge composition
at 320–1920px, action sizes and destinations, two-line headline limit, overflow,
keyboard focus, failed imagery, no JavaScript, and forced-color fallbacks.
