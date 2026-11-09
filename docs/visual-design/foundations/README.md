# Order 4 — Final Prototype Foundations

> Evidence availability (8 November 2026): some historical captures referenced below are absent from this checkout. Their filenames are retained as archive references, not current verification evidence. Rerun the documented checks for fresh evidence.

**Prepared:** 12 September 2026  
**Status:** Complete for non-public prototype use; hospital brand approval and performed validation remain open  
**Selected direction:** [Calm Wayfinding](../direction/visual-directions.md#3-direction-a--calm-wayfinding-recommended)  
**Motion input:** [Order 3 Motion and Storytelling Direction](../motion/motion-and-storytelling.md)

## Outcome

Order 4 converts the selected visual and motion directions into one implementation-shaped foundation system for Orders 5–10. It fixes the prototype token names and values for color, typography, spacing, layout, shape, elevation, icon geometry, imagery, focus, and motion while keeping every unapproved hospital fact, brand asset, translation, operational action, and third party gated.

“Final” in this package means **the baseline is stable for the non-public prototype**. It does not mean the hospital has approved a public identity, that fonts or imagery may be distributed, that accessibility tests have been performed, or that production activation is authorized.

## Artifacts

| Artifact | Purpose |
| --- | --- |
| [Foundation specification](prototype-foundations.md) | Decisions, scales, application rules, responsive and bilingual constraints, gates, and Order 5 contract. |
| [CSS token source](tokens.css) | Canonical prototype primitives, semantic aliases, foundation-level component aliases, and reduced-motion overrides. |
| [Token manifest](tokens.json) | Portable three-layer token inventory with values, types, and descriptions. |
| [Rendered foundation study](studies.html) | Dependency-free specimens for palette, type, spacing, grid, shape, icon, imagery, states, motion, print, and constrained layouts. |
| [Rendered evidence](evidence/) | 1440 px standard, 360 px standard, 320 px reduced, and print captures. |

The existing [design-system foundations](../../design-system/foundations.md) and [interaction baseline](../../design-system/interaction-and-motion.md) now point to this package as their non-public prototype value source. Their behavioral and accessibility rules still govern when a later component treatment conflicts.

## Decisions fixed for prototype work

- Direction A's deep teal, mineral surfaces, warm wayfinding accent, concentrated red, and blue focus role are promoted into complete primitive and semantic scales.
- The type contract uses unified Noto geometry when approved files are available, with an immediate system fallback and no remote font request. Ethiopic contexts receive a dedicated family order and more generous line height; neither script is truncated.
- A 4 px primitive spacing scale feeds compact, regular, and spacious semantic rhythm. Section gaps are fluid but bounded; target size remains at least 44 × 44 CSS px.
- Content containers are 720 px reading, 1120 px standard, and 1280 px wide. Layout changes are content-fit decisions, with 320 px and 400% reflow as hard constraints.
- Controls use 8 px radii, content surfaces and media use 12 px, and borders/surface contrast carry hierarchy before shadow.
- Icons use a project-owned, small inline SVG subset following a 24 px grid, 2 px round stroke, and visible-label rule. No remote icon package is required by the prototype.
- Photography remains text-independent and rights-gated. Abstract line-and-field placeholders indicate crop geometry without simulating people, facilities, equipment, or outcomes.
- Order 3's motion candidates are reconciled into the shared token source. This remains the tested prototype baseline; the [14 September 2026 production amendment](../motion/high-end-motion-and-interactive-media-amendment.md) preserves Level 0 exclusions, content-first rendering, and reduced-motion equivalence while replacing the prototype-wide 300 ms expressive ceiling for future implementation.
- Print defaults remove navigation, actions, prototype decoration, motion, and optional embeds while retaining the prototype warning, source/review status, link destinations, and essential guidance.

## Review sequence

1. Read the [foundation specification](prototype-foundations.md), especially Sections 2–11.
2. Inspect the desktop standard study (unavailable archive: `evidence/order-4-foundations-1440-standard.png`) for the complete scale and state grammar.
3. Inspect the 360 px standard (unavailable archive: `evidence/order-4-foundations-360-standard.png`) and 320 px reduced (unavailable archive: `evidence/order-4-foundations-320-reduced.png`) captures for reflow and long-label behavior.
4. Inspect the [print evidence](evidence/order-4-foundations-print.pdf) for the text-first patient-guidance baseline.
5. Use `tokens.css` and `tokens.json` as the value source when building Order 5 component variants.

Rendered captures prove only the visible state at those viewports. They do not prove screen-reader output, device font availability, timing comfort, browser high-contrast behavior, human bilingual comprehension, touch usability, or field performance.

## Binding boundaries

- Every prototype entry retains a visible, non-dismissable non-public label.
- The text-only prototype identity remains; no logo, tagline, brand ownership, or final font approval is inferred.
- Red is limited to emergency/error semantics. Emergency and error remain different components with different copy, structure, icon, and outcome.
- Amharic specimens test geometry only and are visibly marked for professional review. No generated safety, clinical, privacy, or operational translation is presented as approved copy.
- No live phone, email, map, form submission, upload, search logging, analytics, remote font, remote icon, or media request is introduced.
- Level 0 content never waits for, enters through, pulses with, or depends on motion.
- Essential meaning survives missing images, missing custom fonts, missing JavaScript, reduced motion, print, and failed optional dependencies.

## Completion record

- [x] Three-layer primitive → semantic → component token architecture is documented in CSS and JSON.
- [x] Color roles cover page, raised, subtle, inverse, action, focus, information, success, warning, error, emergency, disabled, selection, and print use.
- [x] Candidate solid foreground/background pairs used by the study are arithmetically checked; rendered and high-contrast validation remain scheduled.
- [x] English, Ethiopic, mixed-script, numeric, long-label, and missing-font behavior is specified without remote dependencies.
- [x] Spacing, sizing, content widths, fluid section rhythm, content-fit layout thresholds, targets, and 320/360/200%/400% constraints are fixed.
- [x] Border, radius, elevation, icon, abstract placeholder, authentic photography, crop, alternative-text, rights, and expiry rules are fixed.
- [x] Order 2 visual candidates and Order 3 motion candidates use one naming and value source.
- [x] Reduced motion removes travel, scale, rotation, drawing, stagger, and smooth scrolling while preserving state and focus.
- [x] Print/download presentation has a useful HTML-first baseline and does not require a PDF or third party.
- [x] Desktop, compact, reduced-motion, and print specimens are dependency-free and contain no live personal-data or operational behavior.
- [x] `VD-03`, `VD-04`, `VD-05`, `VD-06`, `VD-07`, `VD-16`, `VD-17`, `VD-19`, `VD-20`, and `VD-22` are resolved for prototype production with their formal approval/validation gates retained.

## Order 5 handoff — consumed

The [polished component system](../components/README.md) now consumes the semantic and foundation-level aliases in `tokens.css`. Its component layer does not redefine primitives or assign new semantic meanings. It covers shell/navigation, links/buttons, emergency and call actions, language switching, search/filter controls, forms, alerts/status, record cards, breadcrumbs, review metadata, and the optional-map launcher across the applicable states. Order 6 must use that component package when composing the critical journeys.
