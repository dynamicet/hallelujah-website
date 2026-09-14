# Visual Foundations

**Status:** Brand values approved by `B01-002`; `B01-004` local foundation implementation and rendered smoke pass, hosted and production validation remain required
**Requirements:** G-003–G-006, G-008–G-012, G-015, G-016, S-006–S-008, H-002, D-006  
**Benchmark basis:** Task-first hierarchy, restrained trust, bilingual boundaries, low-bandwidth access, and evidence-gated imagery/claims from `BM-01`, `BM-09`, `BM-10`, and `BM-12` in the [benchmark traceability register](../benchmarks/benchmark-traceability.md)

The [project brand system](../brand/README.md) now governs identity, color, typography, voice,
imagery, and asset lifecycle. The application [token manifest](../../apps/web/src/design-system/tokens/tokens.json)
is the canonical production value source. The Order 4 foundation package remains historical
prototype evidence and must not override these approved project values.

## 1. Experience character

### Calm clinical confidence, locally human

The interface should feel:

- **Calm:** quiet surfaces, stable layouts, no competing movement, and no alarm styling outside genuine urgent contexts.
- **Capable:** direct language, strong hierarchy, visible next steps, and complete states.
- **Human:** authentic staff/place imagery, respectful writing, and practical Addis Ababa wayfinding.
- **Clinical:** accurate structure and disciplined presentation without looking cold, luxurious, or technology-led.

### Visual anti-patterns

- Automatic carousels; autoplaying or pre-intent video; uncontrolled background motion; scroll-jacking; and generic entrance choreography applied to every section
- Glassmorphism, low-contrast translucent controls, neon accents, or AI-style purple gradients
- Oversized promotional heroes that push essential actions below the first useful view
- Red brand decoration or large warning-colored surfaces with no urgent meaning
- Generic stock scenes that imply a service, facility, patient outcome, or technology the hospital has not approved
- A card around every paragraph, excessive shadows, or inconsistent corner radii
- Critical text baked into images or icons used without visible labels

Selected Home, About, Patient Information, and arrival/storytelling sections may use approved medical/place imagery, bounded decorative depth, composed entrances, and static-first user-controlled video under the [high-end motion and interactive-media amendment](../visual-design/motion/high-end-motion-and-interactive-media-amendment.md). This permission does not extend expressive motion into Emergency, consequential appointment states, errors, privacy/consent, unavailable/expired content, or clinical/operational facts.

## 2. Brand asset rules

The public horizontal and square raster marks are adopted as source-traceable project assets. Their
URLs, dimensions, fingerprints, usage boundary, clear-space method, and replacement triggers are in
the [brand system](../brand/README.md#2-logo-system). They are not misrepresented as original vectors.

Production must ingest a verified copy through `B02-011`; it must not hotlink, trace, recolor, or
upscale the public file. Use the full mark on white or a quiet near-white surface. Until a trusted
compact master exists, do not invent a symbol; accessible text naming the hospital is the safe
fallback when the raster cannot remain legible.

## 3. Color system

### Approved primitive palette

The bright public-logo accents are preserved for identity while deeper accessible roles carry text,
actions, focus, and status. This palette is approved for project use; rendered component/state
testing remains part of `B01-004` and release QA.

| Primitive | Value | Intended role |
| --- | --- | --- |
| `neutral.white` | `#FFFFFF` | Main and raised surfaces |
| `mineral.025` | `#F4FAF9` | Page background |
| `mineral.050` | `#EEF7F6` | Quiet grouped surface |
| `mineral.200` | `#C7DAD7` | Subtle boundaries |
| `mineral.400` | `#789B9B` | Meaningful control boundaries |
| `mineral.600` | `#516A70` | Secondary text |
| `mineral.900` | `#17323A` | Primary text |
| `brand.cyan` | `#1EAEE2` | Public-logo identity detail; decorative only outside the artwork |
| `brand.orange` | `#EF5C28` | Public-logo warm detail; decorative only outside the artwork |
| `teal.700` | `#006A73` | Primary non-emergency action and link |
| `teal.800` | `#00565F` | Hover |
| `teal.900` | `#00434A` | Active/pressed |
| `blue.700` | `#075EA8` | Focus candidate |
| `blue.800` | `#064B86` | Informational text |
| `green.700` | `#176B45` | Success |
| `green.800` | `#105438` | Success text on tint |
| `amber.900` | `#5F3900` | Warning text/icon |
| `red.700` | `#B42318` | Emergency fill; same primitive family as error |
| `red.800` | `#8F1C13` | Error text and emergency active state |

### Semantic roles

| Semantic token | Primitive | Use |
| --- | --- | --- |
| `color.surface.page` | `mineral.025` | Default page canvas |
| `color.surface.raised` | `white` | Header, menu, cards, fields |
| `color.surface.subtle` | `mineral.050` | Section grouping and quiet notices |
| `color.text.primary` | `mineral.900` | Headings and body |
| `color.text.secondary` | `mineral.600` | Supporting text, never essential information alone |
| `color.border.default` | `mineral.200` | Dividers and quiet cards |
| `color.border.strong` | `mineral.400` | Meaningful input/control boundaries |
| `color.action.primary` | `teal.700` | Highest-priority non-emergency action |
| `color.action.primary.hover` | `teal.800` | Pointer hover |
| `color.action.primary.active` | `teal.900` | Pressed state |
| `color.focus` | `blue.700` | 3 px visible focus outline with offset |
| `color.emergency` | `red.700` | Emergency route and genuine urgent warning |
| `color.error` | `red.800` | Validation/system error text on tint, always with words/icon |
| `color.success` | `green.800` | Completed/success text on tint, always with words/icon |
| `color.warning` | `amber.900` | Caution, always with words/icon |
| `color.brand.accent.cool` | `brand.cyan` | Decorative identity detail; never normal text on white |
| `color.brand.accent.warm` | `brand.orange` | Decorative identity detail; never normal text on white |

Emergency and validation errors may share a red primitive but must use different component language and icons. An emergency action says what route it opens; an error explains what failed and how to recover.

### Checked palette contrast pairs

The following ratios were calculated from the listed prototype values. Re-test rendered fonts, borders, focus, and all states after implementation.

| Foreground / background | Ratio | Intended use |
| --- | ---: | --- |
| `#17323A` / `#FFFFFF` | 13.52:1 | Primary text on raised surface |
| `#516A70` / `#FFFFFF` | 5.76:1 | Secondary normal text |
| `#006A73` / `#FFFFFF` | 6.35:1 | Link text or primary fill with white label |
| `#00565F` / `#FFFFFF` | 8.41:1 | Primary hover with white label |
| `#B42318` / `#FFFFFF` | 6.57:1 | Emergency/error fill with white label |
| `#064B86` / `#E8F3FC` | 7.91:1 | Information text on tint |
| `#105438` / `#E7F4EC` | 7.90:1 | Success text on tint |
| `#5F3900` / `#FFF3D6` | 9.19:1 | Warning text on tint |
| `#8F1C13` / `#FDECEA` | 7.84:1 | Error text on tint |
| `#789B9B` / `#FFFFFF` | 3.02:1 | Meaningful control boundary, not text |
| `#1EAEE2` / `#FFFFFF` | 2.56:1 | Logo/decorative only; fails normal-text contrast |
| `#EF5C28` / `#FFFFFF` | 3.37:1 | Logo/decorative only; fails normal-text contrast |

Never infer compliance from a palette swatch alone. A 1 px border, disabled state, text over images, gradient, opacity, or neighboring color can change the effective result.

## 4. Typography

### Approved family

| Context | Approved stack | Rule |
| --- | --- | --- |
| English/Latin UI | `"Noto Sans", system-ui, sans-serif` | Use 400, 600, and 700 only. |
| Amharic/Ethiopic UI | `"Noto Sans Ethiopic", "Noto Sans", sans-serif` | Apply from the document or component `lang="am"` context. |
| Numbers and telephone values | Same active language family | Use tabular numerals only where comparison benefits. |

This unified Noto direction is approved because both scripts retain comparable authority and
hierarchy. `B01-002` verified official SIL OFL 1.1 releases, 400/600/700 files, declared Amharic
coverage, and representative Latin/Ethiopic shaping. See the [brand typography record](../brand/README.md#4-typography).
Font files must be self-hosted through `B02-011`, subset only after language-owner review, use
immediate fallbacks, and never hide essential text while loading.

### Responsive type tokens

| Token | Candidate size | Line height | Use |
| --- | --- | --- | --- |
| `type.display` | `clamp(2.25rem, 1.75rem + 2.5vw, 3.5rem)` | 1.12 | Home introduction only |
| `type.h1` | `clamp(2rem, 1.65rem + 1.75vw, 3rem)` | 1.18 | Page title |
| `type.h2` | `clamp(1.5rem, 1.25rem + 1.25vw, 2.25rem)` | 1.24 | Major section |
| `type.h3` | `clamp(1.25rem, 1.16rem + .45vw, 1.5rem)` | 1.32 | Subsection/card title |
| `type.body.large` | `clamp(1.0625rem, 1.02rem + .22vw, 1.1875rem)` | 1.62 | Patient guidance and opening summary |
| `type.body` | `1rem` | 1.6 | Default body and controls |
| `type.body.small` | `0.875rem` | 1.5 | Metadata/supporting text only |

- Use sentence case; avoid all-caps for navigation, warnings, and long labels.
- Keep reading measure near 45–75 characters.
- Do not truncate navigation, doctor names, service names, warnings, or Amharic labels.
- Allow at least 35% label expansion in prototypes and test mixed-script line wrapping.
- Underlines remain visible on inline links; color is not the only link cue inside body copy.

## 5. Spacing and sizing

### Primitive scale

| Token | Value | Typical use |
| --- | ---: | --- |
| `space.1` | 4 px | Fine separation |
| `space.2` | 8 px | Icon/label and closely related items |
| `space.3` | 12 px | Compact internal gap |
| `space.4` | 16 px | Default component gap/mobile page gutter |
| `space.6` | 24 px | Card padding and grouped content |
| `space.8` | 32 px | Mobile section separation |
| `space.12` | 48 px | Standard section separation |
| `space.16` | 64 px | Desktop section separation |
| `space.20` | 80 px | Large desktop separation only |

- Interactive targets are at least 44 × 44 CSS px, including header controls and inline icon actions.
- Keep at least 8 px between adjacent touch targets unless one grouped control provides equivalent separation.
- Dense directory results may reduce visual padding, never the interactive target.
- Space shows relationship: items inside a group sit closer than the distance between groups.

## 6. Layout and responsive behavior

### Layout tokens

| Token | Candidate value | Use |
| --- | --- | --- |
| `layout.viewport.min` | 320 px | Required no-horizontal-scroll baseline |
| `layout.gutter.compact` | 16 px | 320–767 px |
| `layout.gutter.regular` | 24 px | 768–1023 px |
| `layout.gutter.wide` | 32 px | 1024 px and above |
| `layout.content.reading` | 720 px | Guidance and long-form content |
| `layout.content.standard` | 1120 px | Most pages and directories |
| `layout.content.wide` | 1280 px | Header and selected multi-column areas |
| `layout.header.compact` | 64 px minimum | Mobile shell; expand for wrapped approved logo if needed |
| `layout.header.regular` | 80 px minimum | Desktop shell |

Breakpoints are implementation aids, not design targets. Components adapt when their content no longer fits, and all screens must still pass at 320 CSS px and 400% zoom.

### Grid rules

- Mobile defaults to one logical reading column.
- Two columns start only when both remain readable; supporting rails never precede main content in DOM order.
- Directories use 1 column compact, 2 columns medium, and at most 3 columns wide.
- Form content stays near 640 px; do not create a long two-column healthcare form.
- Section background can change to clarify grouping, but content alignment remains consistent.
- Sticky elements must not obscure the focused control, page heading, error summary, or browser find result.

## 7. Shape, border, and elevation

| Token | Candidate | Use |
| --- | --- | --- |
| `radius.control` | 8 px | Inputs, buttons, chips |
| `radius.card` | 12 px | Cards and contained notices |
| `radius.media` | 12 px | Images where cropping is permitted |
| `border.default` | 1 px | Most boundaries |
| `border.emphasis` | 2 px | Selected, error, or high-emphasis boundary |
| `elevation.raised` | subtle single shadow | Menus and elevated surfaces only |
| `elevation.overlay` | stronger shadow + backdrop | Modal/navigation overlay only |

Prefer borders and surface contrast over shadows. Do not use shadows to make non-interactive content look clickable.

## 8. Icons and imagery

### Icons

- Use one rounded or neutral outline SVG family, with 2 px visual stroke at the 24 px grid.
- Standard icon sizes: 20 px inside controls, 24 px for standalone supporting icons.
- Essential actions always include visible text: “Call emergency,” not an unlabeled phone glyph.
- Decorative icons are hidden from assistive technology; meaningful icons inherit an accessible name from the control label.
- Directional icons follow reading and navigation meaning; verify any directionality in Amharic layouts rather than mirroring indiscriminately.

### Photography

- Prefer authentic hospital, staff, entrances, care environments, and wayfinding details with documented consent and usage rights.
- Never use identifiable patient photography without explicit, recorded permission for the specific use.
- Images cannot prove a service or outcome and must not imply that a photographed person received care.
- Avoid distress, procedures, needles, blood, or vulnerable situations in general navigation surfaces.
- Provide width and height, responsive crops, AVIF/WebP delivery, and lazy loading below the useful first view.
- Alternative text describes useful content and purpose; decorative images use empty alt text.

## 9. Foundation acceptance checklist

- [x] Project authority has approved source-traceable logo use, palette roles, and type direction under `B01-002`.
- [ ] Normal text, large text, UI boundaries, icons, and focus indicators pass contrast in every state.
- [ ] English and Amharic samples have comparable hierarchy without clipping or truncation.
- [x] Local controlled fixture passes at 320 px, 360 px, 200%/400% viewport equivalents, 200% enlarged text, and long content under `B01-004`; final physical-device evidence remains a production gate.
- [x] The local representative control and `B01-005` essential actions measure at least 44 × 44 CSS px; remaining component-wide evidence stays under `B01-006`–`B01-010`.
- [x] The controlled fixture keeps essential content without images, custom fonts, or non-essential JavaScript; production asset ingestion remains under `B02-011`.
- [ ] Photography has source, consent/rights, owner, crop variants, and alt-text decision.
- [x] The implemented controlled fixture contains no hospital clinical or operational claim.
