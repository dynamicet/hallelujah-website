# Order 4 Prototype Foundation Specification

**Prepared:** 12 September 2026  
**Status:** Stable baseline for non-public prototype work; not a hospital-approved identity or release standard  
**Requirements:** `G-003`–`G-012`, `G-015`–`G-016`, `S-006`–`S-008`, `H-002`, `D-006`  
**Decision inputs:** `VD-01`–`VD-08`, `VD-10`, `VD-12`–`VD-17`, `VD-19`–`VD-22`, `BRAND-01`, `LANG-01`–`LANG-02`

> **Production supersession — 14 September 2026:** The [High-End Motion and Interactive-Media Amendment](../motion/high-end-motion-and-interactive-media-amendment.md) preserves these values as historical prototype evidence but supersedes the prototype-wide motion ceiling and media exclusions for production planning. New composed/cinematic tokens and media behavior must be added through `B01-003`/`B01-012`; they are not silently inferred from this prototype source.

## 1. Foundation contract

This package promotes Calm Wayfinding from a recommended direction to the consistent visual baseline for non-public prototypes. It preserves the source hierarchy, component contracts, state semantics, safe placeholders, and motion ceilings. Later orders may compose or specialize these tokens; they may not silently change their meaning.

The token dependency is:

```text
primitive value
    → semantic purpose
        → foundation/component alias
            → rendered component or page
```

Raw color, size, radius, and duration values belong only in the primitive layer. Components use semantic or component aliases. A one-off value requires a documented exception, not a new arbitrary token.

Source precedence remains: accountable dated approval → requirements/validation → page and design-system specifications → governed records → this concept → benchmark evidence. The prototype direction cannot override safety, privacy, language, accessibility, or content governance.

## 2. Color

### 2.1 Primitive scales

| Family | Values | Purpose |
| --- | --- | --- |
| Mineral | `025 #F4FAF9`, `050 #EEF7F6`, `100 #E4F1EF`, `200 #C7DAD7`, `400 #789B9B`, `600 #516A70`, `900 #17323A` | Page/surface hierarchy, boundary, supporting and primary text. |
| Teal | `050 #E5F4F4`, `100 #CBE8E8`, `600 #007B83`, `700 #006A73`, `800 #00565F`, `900 #00434A` | Non-emergency action and selected state. |
| Blue | `050 #E8F3FC`, `700 #075EA8`, `800 #064B86` | Focus and information. |
| Green | `050 #E7F4EC`, `700 #176B45`, `800 #105438` | Success only. |
| Amber | `050 #FFF3D6`, `800 #7A4B00`, `900 #5F3900` | Warning/caution only. |
| Red | `050 #FDECEA`, `700 #B42318`, `800 #8F1C13`, `900 #71160F` | Emergency and error primitives; component grammar separates meanings. |
| Wayfinding | `ochre #D9952F`, `cyan #21A6BD` | Small non-status identity/orientation accents only. |
| Base | `white #FFFFFF`, `black #101719`, `transparent` | Raised/inverse surfaces and explicit transparency. |

Warm ochre never means warning, and cyan never replaces the primary action. Neither carries meaning alone. Large accent fills, gradients, translucency behind text, and text over uncontrolled imagery are excluded.

### 2.2 Semantic assignment

| Semantic role | Value source | Rule |
| --- | --- | --- |
| Page / raised / subtle surface | Mineral 025 / white / Mineral 050 | Default hierarchy; a section surface changes only to group content. |
| Primary / secondary / inverse text | Mineral 900 / Mineral 600 / white | Secondary text is never the only carrier of essential meaning. |
| Default / strong boundary | Mineral 200 / Mineral 400 | Use strong boundary for meaningful control edges and selected geometry. |
| Primary action default / hover / active | Teal 700 / 800 / 900 | White label, visible text, no use for emergency. |
| Secondary action | transparent with Teal 700 border/text | Hover uses Teal 050, active Teal 100. |
| Focus | Blue 700 | 3 px outline, 2 px offset, immediate and unobscured. |
| Information | Blue 050 / Blue 800 | Heading, words, and icon accompany the color. |
| Success | Green 050 / Green 800 | Only an authoritative completed/received state. |
| Warning | Amber 050 / Amber 900 | Caution or prerequisite, never a decorative ochre substitution. |
| Error | Red 050 / Red 800 | Explains failure and recovery; not an emergency route. |
| Emergency | white / Red 700 / Red 800 | Concentrated labeled call/urgent action; stable Level 0 layout. |
| Disabled | Mineral 050 / Mineral 200 / Mineral 600 | Disabled reason remains in nearby text when not self-evident. |
| Selection | Teal 050 / Teal 700 | Does not replace focus. |

### 2.3 Contrast evidence and limits

The following study pairs meet the intended WCAG 2.x numeric thresholds using sRGB arithmetic:

| Pair | Approximate ratio | Use |
| --- | ---: | --- |
| Mineral 900 on white | 13.52:1 | Primary text. |
| Mineral 900 on page | 12.80:1 | Page text. |
| Mineral 600 on white | 5.76:1 | Supporting normal text. |
| White on Teal 700 | 6.35:1 | Primary action. |
| White on Teal 800 | 8.41:1 | Hover action. |
| White on Red 700 | 6.57:1 | Emergency action. |
| Blue 800 on Blue 050 | greater than 7:1 | Information text. |
| Green 800 on Green 050 | greater than 7:1 | Success text. |
| Amber 900 on Amber 050 | greater than 9:1 | Warning text. |
| Red 800 on Red 050 | greater than 7:1 | Error text. |
| Mineral 400 on white | 3.02:1 | Meaningful 2 px control boundary/graphic, not normal text. |

These checks do not establish component conformance. Order 5 must test every default, hover, focus, pressed, disabled, visited, error, forced-colors, and adjacent state at rendered size. Disabled controls are still kept legible even where contrast exceptions apply.

## 3. Typography and language

### 3.1 Family and delivery

| Context | Prototype token | Delivery behavior |
| --- | --- | --- |
| Latin/English UI | `"Noto Sans", Arial, system-ui, sans-serif` | Use local Noto if present; otherwise render immediately in the system stack. |
| Ethiopic/Amharic UI | `"Noto Sans Ethiopic", "Noto Sans", Arial, system-ui, sans-serif` | Apply through `[lang="am"]`; no remote request or invisible text. |
| Code/reference values | Active UI family with `font-variant-numeric: tabular-nums` where alignment helps | Never use monospace for ordinary patient-facing phone/date content. |

Only weights 400, 600, and 700 are used. Synthetic bold/italic is disabled when approved font files are eventually self-hosted. Font files, exact license artifacts, Ethiopic glyph coverage, hinting, subsets, and preload decisions remain a `BRAND-01`/language/delivery gate. Essential content uses `font-display: swap` or equivalent and cannot wait for a font.

### 3.2 Scale

| Token | Size | Line height | Use |
| --- | --- | ---: | --- |
| Display | `clamp(2.25rem, 1.75rem + 2.5vw, 3.5rem)` | 1.12 | Home introduction only. |
| H1 | `clamp(2rem, 1.65rem + 1.75vw, 3rem)` | 1.18 | One page title. |
| H2 | `clamp(1.5rem, 1.25rem + 1.25vw, 2.25rem)` | 1.24 | Major section. |
| H3 | `clamp(1.25rem, 1.16rem + .45vw, 1.5rem)` | 1.32 | Subsection/card title. |
| Lead | `clamp(1.0625rem, 1.02rem + .22vw, 1.1875rem)` | 1.62 | Patient guidance/opening summary. |
| Body | `1rem` | 1.6 | Body and controls. |
| Small | `.875rem` | 1.5 | Metadata only; never critical instruction. |
| Label | `1rem` | 1.35 | Controls and compact task labels. |

Ethiopic headings use at least 1.25 line height and body uses at least 1.7 unless professional review supports a change. Do not add letter spacing to Ethiopic text. English display tracking is at most `-.015em`; body tracking remains normal.

### 3.3 Content behavior

- Sentence case is the default; all-caps is excluded for navigation, statuses, and warnings.
- Long-form measure is `45ch–72ch`; opening summaries target no more than `62ch`.
- No truncation or fixed-height clipping for navigation, names, services, urgent copy, statuses, errors, or language labels.
- Layouts reserve at least 35% label expansion and accept mixed-script/numeric wrapping.
- `lang` is set at document and inline language boundaries. Both English and Amharic are left-to-right; mirroring follows component meaning, not script presence.
- Inline links remain underlined. Visited styling must remain distinguishable without appearing disabled or alarming; Order 5 supplies the exact component state.
- Prototype Amharic samples are glyph/geometry fixtures labeled “professional review required.” They do not demonstrate translation parity or content approval.

## 4. Spacing, sizing, and density

### 4.1 Primitive and semantic rhythm

The base is 4 px: `0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96`. Use the nearest named step; arbitrary half-pixel or device-specific gaps are excluded.

| Semantic token | Value | Use |
| --- | --- | --- |
| Inline gap | 8 px | Icon/label and closely related inline content. |
| Control gap | 12 px | Adjacent fields/actions when compact. |
| Component inset compact / regular | 12 px / 16 px | Controls and small contained content. |
| Card inset | `clamp(16px, 3vw, 24px)` | Cards/notices without fixed height. |
| Stack small / regular / large | 8 / 16 / 24 px | Internal vertical relationships. |
| Section compact / regular / spacious | 32 / `clamp(40px, 5vw, 64px)` / `clamp(48px, 7vw, 80px)` | Page section separation. |

The minimum target is 44 × 44 CSS px, including menu, language, filter, disclosure, pagination, and icon-supported actions. Adjacent targets keep at least 8 px visual separation unless they are one semantically grouped control with an equally clear boundary. Dense results may reduce decoration but not target size, label visibility, or recovery text.

## 5. Layout and responsive grid

| Token | Value | Rule |
| --- | --- | --- |
| Minimum viewport | 320 px | No two-dimensional page scroll. |
| Compact / regular / wide gutter | 16 / 24 / 32 px | Applied by content fit, capped so content is never squeezed. |
| Reading / form width | 720 / 640 px | One logical content column. |
| Standard / wide container | 1120 / 1280 px | Centered with logical auto margins. |
| Compact / regular header minimum | 64 / 80 px | May grow when approved identity or labels wrap. |
| Sticky offset | Header size + 16 px | Hash/focus target remains visible. |

- Mobile starts as one source-ordered column. Grid enhancement begins only when each child keeps its minimum readable width.
- Directories use one column, two at about 40 rem of available container width, and no more than three at about 64 rem. These are container-fit references, not device promises.
- Forms remain one column and approximately 640 px. Related short controls may share a row only when labels and errors remain unambiguous at zoom.
- Supporting rails follow the main content in DOM order and may sit beside it only when the main reading measure stays intact.
- `min-width: 0`, wrapping, flexible tracks, and intrinsic sizing prevent long English/Amharic content from forcing overflow.
- Sticky UI is optional and cannot cover focus, headings, errors, browser UI, or submit actions. Emergency access is prominent without requiring stickiness.
- Safe-area insets are additive on supported devices; they never replace the base gutter or target size.

## 6. Shape, borders, and elevation

| Role | Token | Use |
| --- | --- | --- |
| Control radius | 8 px | Buttons, inputs, chips, disclosures. |
| Card/media radius | 12 px | Cards, notices, approved media crops. |
| Pill radius | 999 px | Compact status/metadata only; never long actions. |
| Default/emphasis border | 1 / 2 px | Structure versus selected/error/emergency emphasis. |
| Focus ring | 3 px + 2 px offset | Always outside the component boundary. |
| Raised shadow | `0 4px 16px rgb(23 50 58 / .10)` | Menus and genuinely raised surfaces only. |
| Overlay shadow | `0 16px 40px rgb(23 50 58 / .18)` | Modal navigation/dialog only. |

Cards do not wrap continuous prose by default. Shadows never make static content appear interactive. Overlays use a solid or near-solid surface and a visible boundary; glass blur is excluded. In forced-colors mode, system colors and borders replace custom fills/rings rather than suppressing them.

## 7. Icons, wayfinding motif, and imagery

### 7.1 Icons

- Prototype icons are an inline, project-owned SVG subset on a 24 × 24 view box, `fill="none"`, `stroke="currentColor"`, 2 px stroke, round linecap/join.
- Use 20 px inside controls, 24 px for supporting items, and no smaller than 16 px for non-essential metadata.
- Essential controls always carry visible text. Decorative SVGs use `aria-hidden="true"`; meaning is supplied by the visible control name.
- Only conventional metaphors are permitted: search, menu, close, chevron, external link, phone, location, calendar, information, success, warning, error. Clinical specialty symbols are not invented.
- Directional chevrons follow navigation direction. Language switching does not automatically mirror the entire UI or indiscriminately reverse icons.
- Order 5 must inspect every path at 200%/400%, Windows High Contrast/forced colors, and alongside both language fixtures before expanding the subset.

### 7.2 Wayfinding motif

The signature is a short 2 px ochre rule or a neutral path-and-node line used for orientation. It may occur once in a page introduction or stage sequence. It cannot resemble an ECG trace, medical cross, route claim, diagnostic chart, or hospital logo. It never replaces a heading, divider required for comprehension, progress status, or real map.

### 7.3 Imagery and abstract placeholders

Approved future photography prioritizes actual entrance, reception, staff-at-work, neighborhood landmarks, and non-sensitive care environments in natural light. Every asset requires source, rights/consent, authenticity check, owner, permitted routes, crop variants, alt purpose, review date, and expiry/withdrawal behavior.

Prohibited: identifiable patients without specific recorded permission; vulnerable/distress/procedure scenes; equipment or interiors implying unapproved capability; outcome imagery; staged testimonials; AI-generated people presented as real; benchmark images; hotlinks; text baked into images.

Until approval, prototypes use an abstract field with quiet mineral blocks and a path line. It is labeled as a geometry placeholder, has empty alternative text when decorative, makes no remote request, and disappears without content loss. Default ratios are 4:3 record, 16:9 contextual, and 1:1 only for a rights-cleared portrait. Crops use `object-fit: cover` only after a human-set focal point; entrances/wayfinding must not crop away the useful landmark.

## 8. Motion reconciliation

The canonical duration set is `0, 80, 150, 200, 240, 300 ms`; delays are `0, 30, 150 ms maximum sequence`; distances are `4, 8 px`. Easings are the Order 3 enter, exit, and state cubic Béziers. The component baseline uses:

- feedback `80 ms`, focus-adjacent/status `150 ms`, menus/disclosures `200 ms`, orientation rule `240 ms`, and evidence-path maximum `300 ms`;
- no content travel greater than 8 px in an approved recipe and no timing greater than 300 ms;
- no page exit animation, scroll-linked motion, smooth-scroll dependency, spring/bounce, autoplay, continuous animation, large blur/filter animation, or grid-wide result entrance;
- content, accessible name, state, focus behavior, and action semantics ready before enhancement.

Level 0 remains permanent for Emergency and all urgent, error, privacy/consent, unavailable, expired, or unknown-outcome content. It allows immediate native focus/pressed/status feedback but no entrance movement or expressive cue.

`prefers-reduced-motion: reduce` sets semantic transition durations to zero, removes travel/scale/rotation/drawing/stagger/smooth scrolling, and leaves status, focus, content, and final geometry present. A review-only toggle may demonstrate reduced mode, but production follows the platform preference automatically.

## 9. Foundation-level component aliases

Order 4 defines only shared aliases needed to prevent value drift. Order 5 supplies full variants and states.

| Alias group | Fixed foundation behavior |
| --- | --- |
| Page/shell | Page and raised surfaces, primary text, standard/wide gutters and containers. |
| Focus | Blue 700, 3 px ring, 2 px offset, no delay. |
| Primary button | Teal default/hover/active, white label, 44 px minimum, 8 px radius. |
| Secondary button | Transparent/quiet teal surfaces, Teal 700 text/border. |
| Emergency action | Red default/active, white label, 2 px emphasis, no scale/travel. |
| Field | White surface, strong mineral boundary, primary text, 44 px minimum; focus and error do not rely on border color alone. |
| Card | Raised surface, default border, 12 px radius, fluid 16–24 px inset, no default shadow. |
| Status | Tinted surface + strong text + semantic edge + heading/icon/words/action. |
| Prototype banner | Dark ink surface, white text, no dismiss control, wraps at 320 px and remains in print. |

## 10. Print and download foundation

Accessible HTML is the primary patient-guidance format. `@media print` uses white paper, near-black text, 11 pt body, readable heading hierarchy, full-width single-column flow, visible link destinations for useful external/contact references, and `break-inside: avoid` on bounded notices and task groups.

Navigation, search, interactive-only controls, decorative placeholders, motion, shadows, optional map frames, and redundant footer promotion are removed. Emergency/contact content is printed only when approved canonical values exist. The non-public prototype label and governed owner/review/withheld status remain. A PDF may be offered later only with an owner, accessible source, file type/size, version date, equivalent HTML, and failure fallback.

## 11. Validation matrix and honest evidence

| Concern | Order 4 evidence | Still required |
| --- | --- | --- |
| Solid color contrast | Arithmetic checks and rendered specimens. | Automated plus manual component/state/forced-color checks in Orders 5/11. |
| 320/360 reflow | Captured dependency-free specimen. | Complete page/component reflow at 200%/400% in Order 9. |
| Bilingual geometry | Latin, Ethiopic glyph, mixed-script and long-label specimens. | Professional Amharic review, approved copy, device/screen-reader/human comprehension. |
| Focus/states | Static visible examples and tokens. | Keyboard and assistive-technology interaction in Orders 5/10/11. |
| Reduced motion | CSS override and reduced capture. | Timing/vestibular/device review of interactive components. |
| Performance | No external requests, fonts, images, libraries, or scripts in the study. | Measured prototype and page budgets on constrained profile. |
| Print | Print stylesheet and PDF evidence. | Approved content, browser/assistive PDF review if a downloadable file is later offered. |

## 12. Gate disposition

`VD-03`, `VD-04`, `VD-05`, `VD-06`, `VD-07`, `VD-16`, `VD-17`, `VD-19`, `VD-20`, and `VD-22` are **resolved for non-public prototype construction** by this package. They remain unresolved for public identity approval or carry performed-validation dependencies. `VD-01` remains text-only pending authentic logo files; `VD-08` proceeds to component/zoom testing; `VD-09` remains a journey-level sticky-action question; and page-specific `VD-10`–`VD-15`, `VD-18`, and `VD-21` continue into Orders 5–8.

All formal `SAFE-*`, `APPT-*`, `CARE-*`, `ACCESS-*`, `SEARCH-*`, `LANG-*`, `INST-*`, `HR-*`, `SEC-*`, `DEL-01`, and `BRAND-01` gates remain in force. Nothing in a visual token authorizes a live destination, hospital fact, personal-data flow, third party, publication, or claim.

## 13. Order 5 acceptance contract

Order 5 is ready to begin when it:

1. imports or faithfully maps the shared token source without raw values in component definitions;
2. renders every applicable default, hover, focus, pressed, disabled, loading, error, empty, unavailable, offline, and success state;
3. distinguishes routine action, emergency, error, warning, information, and authoritative success by structure and words as well as color;
4. verifies 44 px targets, 8 px separation, long-label wrapping, English/Ethiopic geometry, keyboard focus, and reduced motion;
5. keeps Level 0 content immediate and every controlled placeholder visibly non-public;
6. records exceptions and validation evidence instead of silently changing a foundation token.
