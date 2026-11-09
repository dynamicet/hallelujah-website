# Hallelujah Hospital — visual direction X

## Authority and scope

Selected by the user on 9 November 2026: **X, with richer supporting-color
treatments**. This is the adopted visual direction for the application.
It extends the current hospital identity and the reviewed X study. It does not
replace the emblem, content, care journeys, or verification safeguards in
[PRODUCT.md](PRODUCT.md).

The implementation specification is
[X: color, composition and component strategy](docs/visual-design/x-color-composition-spec.md).
Its route matrix records surface-specific visitor modes. See the
[implementation and verification record](docs/visual-design/x-implementation.md)
for the delivered changes and evidence.
Earlier color studies and guidance remain historical where they conflict with
this selected direction. The token manifest is the runtime source of truth, with generated CSS and
TypeScript kept together.

## Visual thesis

**A composed hospital identity, with warmth where people need it.** Deep blue
holds orientation, reading hierarchy, dependable actions and the closing field.
Cyan connects the experience to the emblem. Generous people-focused imagery,
preparation chapters in peach, stories in pink, and bounded yellow assistance
give the site life.

The emblem's open, embracing composition informs photographic framing and clear
paths into care. This is an interpretation of the existing visual identity, not
a claim about the emblem's historical meaning. Retain its actual artwork.

The characteristic experience is a photographic blue opening, a clear care
finder, substantial but selective warm chapters, and a useful blue close. Richness
comes from relationships between chapters, type and images, rather than a large
collection of decorative accents.

## Color roles

| Role | Value | Use |
| --- | --- | --- |
| Page paper | `#FBF8F6` | Quiet page ground and editorial transitions |
| Content white | `#FFFFFF` | Navigation, reading and working surfaces |
| Blue mist | `#EAF5F9` | Care search, quiet care stages |
| Selected blue | `#D0EFFA` | Selection with explicit marks/state |
| Heading / inverse field | `#00445D` | Headings, deep-blue sections, footer |
| Reading ink | `#17313D` | Body text and labels on cyan/yellow |
| Secondary text | `#52636B` | Supporting copy on tested light surfaces |
| Primary action | `#0078A6` | White-label care and appointment actions |
| Link / action hover | `#00678D` | Ordinary links; separate semantic roles |
| Brand cyan | `#15B0E6` | Emblem/artwork and featured hero action |
| Preparation ground | `#FFEDDF` | Richer peach chapter or local inset |
| Preparation ink | `#A8430C` | Complete local headings, disclosures |
| Story ground | `#FBE4EF` | Richer pink editorial chapter |
| Story ink | `#A61558` | Complete local headings, editorial emphasis |
| Assistance ground | `#F5C82D` | One bounded help handoff, dark ink throughout |
| Raw orange / magenta | `#F65B25` / `#E7277C` | Supplied artwork and decorative details |

Keep the existing success, warning, error and emergency roles independent of
these brand relationships. The same primitive may support different roles, but
the semantic names and component treatment must distinguish them.

Use blue/white and paper for most working/reading surfaces. A preparation or story
chapter can own a substantial color field. There is no mandatory percentage or
peach → pink → yellow rotation. Do not color-code clinicians, specialties or
patient groups. Do not place all supporting hues in every component.

## Type, frame and materials

- Retain self-hosted `Editorial`/FreeSerif for major editorial headings, Lato for
  body and controls, and Ethiopic/Noto Sans Ethiopic for the language fallback.
  Clash Grotesk remains confined to the established wordmark treatment.
- Major headings use one face and one color per heading. Remove recurring italic
  or separately colored accent-word styling. Complete preparation/story headings
  may use their contextual deep orange/magenta.
- Use purposeful role sizes, readable body copy, actual available weights,
  comfortable reading measure, and complete medical names. Avoid squeezing
  essential content to satisfy a line-count preference.
- Preserve the shared frame, symmetric gutters and content hierarchy. Separate
  chapters through space, images and tone; reserve visible boundaries for controls
  and genuinely useful information structures.
- Flat fills, natural skin tones, consistent image crops, restrained rounding.
  Shadows belong to floating overlays; photo scrims belong to text legibility.
  Neither becomes a general decorative material.
- Keep existing emblem-related artwork at selected introductions. Do not expand it
  into repeated arcs, dots, icon badges, decorative lines or a new motif library.

## Interaction character

Stable blue task actions; cyan with dark ink for the featured hero action;
readable contextual story controls only where specified. A color shift never
changes an action's meaning. Ordinary text links have dedicated text-state roles.
Selection includes a check, underline or native mark; errors include explanatory
words; current navigation includes a visible structural cue.

Focus uses a contextual high-contrast outline and separation gap. Motion clarifies
existing transitions and control feedback, keeps content visible by default, and
respects reduced motion. Task and reading pages stay quieter than the homepage.

## Implementation discipline

Extend the existing primitive → semantic → component token system. Update owning
component rules and explicit context variants, regenerate CSS/TypeScript, and
reconcile the machine-readable brand record. Do not paste the study's injected
CSS, use generated class-name substring selectors, globally replace hex values,
or introduce another permanent theme stylesheet.

Judge implementation in fresh renders at mobile, tablet and desktop widths and
in reachable states. Token checks, taste detectors, screenshots and accessibility
checks provide different evidence; none alone establishes a finished design.
