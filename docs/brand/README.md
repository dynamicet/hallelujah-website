# Hallelujah General Hospital Brand System

**Status:** Project-approved brand foundation for controlled development

**Decision:** `B01-002` / `BRAND-01`

**Effective:** 14 September 2026, Africa/Addis_Ababa

**Authority:** Client workspace identity `befikadusata`, delegating brand strategy, UI/UX
architecture, and marketing direction to Codex

**Machine record:** [brand-foundation.json](brand-foundation.json)

This is the working professional identity system for the website rebuild. It converts the
hospital's public identity evidence into a coherent, accessible, bilingual-ready system so product
work does not wait for a marketing package that does not presently exist.

The distinction matters: the public raster marks are **project-adopted source assets**, not claimed
to be hospital-supplied originals or vectors. They may be replaced centrally if an authenticated
higher-quality master or a later hospital instruction arrives. Individual photographs, footage,
portraits, partner marks, documents, and clinical claims are not approved by this decision and
still require the governed intake workflow in `B02-011`.

## 1. Brand core

### Identity

| Element | Approved treatment |
| --- | --- |
| Public name | **Hallelujah General Hospital** |
| Primary tagline | **Bringing Quality Care Home** |
| Tagline punctuation | No terminal punctuation in persistent lockups or navigation; an exclamation mark may be retained only when faithfully reproducing the existing source artwork. |
| Brand promise | Calm, capable, locally human access to care. This is a communication direction, not a clinical outcome claim. |
| Positioning | A trusted general hospital that makes finding care and practical next steps feel clear, respectful, and close to home. |
| Experience character | Calm, capable, human, clinical. |

The English name and tagline are evidenced by the hospital's [public website](https://hallelujahhospital.com/).
Do not invent an Amharic transliteration or translation under this decision. Approved Amharic
identity copy must pass `LANG-01`; the type system is ready to render it when supplied.

### Audience promise

Every public expression should help a patient or family answer one of three questions quickly:

1. Where should I go?
2. Who or what service can help?
3. What is the safest next step?

Institutional storytelling comes after these needs. Brand expression must never make an
unsupported claim about capability, availability, outcome, accreditation, price, insurance, or
emergency response.

## 2. Logo system

Two public raster variants are adopted as the current identity evidence:

| Variant | Source dimensions | Intended use |
| --- | ---: | --- |
| Horizontal wordmark with tagline | 200 × 50 px, transparent PNG | Header/reference use at or below native raster size; white or quiet near-white surface only. |
| Square wordmark | 200 × 200 px, transparent PNG | Compact identity, metadata, and social/avatar review; not automatically a favicon because fine lettering must remain legible. |

The exact source URLs, retrieval date, dimensions, and SHA-256 fingerprints are preserved in the
[machine record](brand-foundation.json). Production must ingest a verified copy through `B02-011`;
it must not hotlink the public website.

### Clear space and size

- Keep clear space around the mark equal to at least the height of the capital `H` in
  `HALLELUJAH`, measured from the rendered artwork.
- Do not render the horizontal raster above its native 200 × 50 CSS-pixel size at 1×. If a larger
  or high-density mark is needed, obtain a trusted vector or higher-resolution original.
- Do not crop the emblem, wordmark, hospital descriptor, or source-artwork tagline.
- On compact screens, reduce surrounding navigation before shrinking the logo below legibility.
- Use the full public mark until a trusted compact symbol master is available; do not redraw,
  trace, typeset, or synthesize one.

### Prohibited treatments

Do not stretch, recolor, rotate, outline, add effects, place over photography, rebuild from a
screenshot, change internal spacing, detach decorative colors for status meaning, or combine it
with an unapproved partner mark. If the available raster cannot meet the required size or
background, use the accessible text name as the safe fallback.

## 3. Color system

The visual system preserves the bright identity accents found in the public mark and extends them
with deeper, accessible interface roles. Logo colors and UI colors have different jobs.

### Identity colors

| Token | Value | Use | Accessibility boundary |
| --- | --- | --- | --- |
| `brand.cyan` | `#1EAEE2` | Logo/source identity, rules, small decorative accents | 2.56:1 on white; never normal text, a white-label control, focus, or status by itself. |
| `brand.orange` | `#EF5C28` | Logo/source identity, restrained warm accent | 3.37:1 on white; never normal text, a white-label control, warning, or error by itself. |

The remaining small multicolor details stay inside the source artwork. They are not promoted to UI
roles without a new decision because doing so would make the product noisy and blur safety
semantics.

### Accessible interface extension

| Role | Value | Purpose |
| --- | --- | --- |
| White | `#FFFFFF` | Raised surfaces and logo field |
| Mineral 025 | `#F4FAF9` | Quiet page surface |
| Mineral 050 | `#EEF7F6` | Grouped surface |
| Mineral 200 | `#C7DAD7` | Quiet border |
| Mineral 600 | `#516A70` | Secondary text; 5.76:1 on white |
| Mineral 900 | `#17323A` | Primary text; 13.52:1 on white |
| Teal 700 | `#006A73` | Primary non-emergency action/link; 6.35:1 on white |
| Blue 700 | `#075EA8` | Focus and information; 6.61:1 on white |
| Red 800 | `#8F1C13` | Error/urgent text; 8.96:1 on white |

Use cyan and orange to make the experience recognizable; use mineral and teal to make it usable.
Red remains reserved for genuine urgent/error meaning. No state may depend on color alone.

## 4. Typography

### Approved families

| Context | Family | Version | Weights | License |
| --- | --- | --- | --- | --- |
| English/Latin | Noto Sans | 2.015 | 400, 600, 700 | SIL Open Font License 1.1 |
| Amharic/Ethiopic | Noto Sans Ethiopic | 2.102 | 400, 600, 700 | SIL Open Font License 1.1 |

Noto was selected because it gives both scripts a related, contemporary sans-serif voice without
making English look more prestigious than Amharic. The exact official releases are from the
[Noto Latin/Greek/Cyrillic repository](https://github.com/notofonts/latin-greek-cyrillic/releases/tag/NotoSans-v2.015)
and [Noto Ethiopic repository](https://github.com/notofonts/ethiopic/releases/tag/NotoSansEthiopic-v2.102).

The release archives, chosen font files, file hashes, and audited languages are recorded in the
machine record. All six selected files shaped representative hospital, numeral, and Amharic text
without missing glyphs. Actual Amharic content still requires professional language review.

### Loading and use

- Self-host approved font files; never request them from a browser font CDN.
- Keep system fallbacks immediate and visible. Essential content must never wait for a font.
- Use 400 for body, 600 for controls/emphasis, and 700 for headings or strong emphasis. Disable
  synthetic bold/italic when implemented.
- Apply Noto Sans Ethiopic from a valid `lang="am"` context. Do not infer language from glyphs.
- Do not subset Ethiopic until the approved language inventory is complete and regression tested.
- Use sentence case. Avoid all-caps navigation, warnings, and long labels.
- Do not add tight negative tracking to Ethiopic. Long labels, names, warnings, and translations
  wrap rather than truncate.
- The responsive scale and reading measures in [visual foundations](../design-system/foundations.md#4-typography)
  remain the implementation contract.

## 5. Voice and messaging

### Voice attributes

| Attribute | Write like this | Avoid |
| --- | --- | --- |
| Calm | Clear next steps and steady factual language | Alarm, hype, urgency theatre |
| Capable | Specific services/actions backed by a current record | “Best,” “world-class,” or outcome promises |
| Human | Respectful, direct, patient-oriented wording | Bureaucratic or patronizing language |
| Clinical | Precise labels, limits, dates, and ownership | Diagnosis, speculation, or ambiguous availability |

### Message hierarchy

1. Safety and urgent routing.
2. The visitor's task and next action.
3. Practical facts, limits, and recovery options.
4. Reassurance and supporting context.
5. Institutional or promotional story.

Headlines should state a useful benefit or task, not a slogan alone. Calls to action use explicit
verbs such as “Find a doctor,” “Explore services,” “Request an appointment,” and “Get directions.”
The tagline may close a brand moment, but never replaces actionable guidance.

## 6. Imagery and video art direction

### Preferred subjects

- Authentic hospital entrance, reception, circulation, wayfinding, and accessible arrival details.
- Staff in real working environments with correct role/context and documented permission.
- Calm, respectful human moments that do not expose vulnerability or imply a treatment outcome.
- Useful environmental details that help visitors recognize where to go.

### Exclusions

- Generic stock care scenes, AI-generated people presented as real patients/staff, staged distress,
  blood, needles, invasive procedures, visible records/screens, or identifiable patients without
  explicit use-specific consent.
- Images used as evidence of a service, technology, success rate, availability, capacity, or
  relationship.
- Baked-in essential text, safety instructions, contacts, schedules, or translations.

### Composition and crops

- Prefer documentary warmth, natural light, realistic color, and uncluttered negative space.
- Record a human-selected focal point. Validate 4:3, 3:2, 16:9, and compact square crops only when
  the subject and meaningful landmarks survive.
- Preserve width/height and a complete no-image fallback. Do not upscale.
- Alternative text describes useful content in context; decorative media uses empty alt text.

### Moving media

Video is optional storytelling, never navigation or proof. The poster is the complete initial
experience; video makes zero pre-intent request, starts only after a labeled action, has persistent
controls, and has a static reduced-motion/Save-Data alternative. Meaningful speech/action requires
captions, transcript, and an audio-description decision. No urgent, error, privacy, appointment
consequence, unavailable, or unknown-outcome surface receives expressive media.

## 7. Asset rights and lifecycle

Every logo, font, icon family, photograph, document, or video must have a durable record with:

- stable ID/version and preserved original;
- source, checksum, authenticity, and what/who/where validation;
- owner and brand/content/clinical/privacy/language approvals as applicable;
- license, consent/release, territories, channels, restrictions, and withdrawal route;
- informative/decorative purpose and alt/caption/transcript decision;
- focal point, permitted crops, formats, intrinsic dimensions, bytes, and derivative list;
- publish/review/expiry dates, removal owner, fallback, and cache/search/reference purge behavior.

Lifecycle is `proposed → quarantined → reviewed → approved → published → expired/withdrawn → purged`.
Rejected and provisional files stay distinguishable from approved files and must be removable
without page-template rewrites. `B02-011` implements scanning, ingestion, derivatives, and purge;
this decision supplies its governing policy.

## 8. Approval and change control

This system is approved for project use and closes the brand-direction dependency for `B01-004`.
It does not authorize publication or rights-dependent media. Reopen `BRAND-01` only if:

- an authenticated master conflicts with the adopted logo or colors;
- the hospital supplies a formal identity/voice standard;
- a trademark or license challenge appears;
- professional Amharic review finds the font treatment unsuitable;
- rendered product testing finds a material accessibility or legibility failure; or
- the hospital name or tagline changes.

Minor accessible extensions, responsive layout tuning, and format optimization may proceed through
normal design-system change control when they preserve this identity and its safety rules.
