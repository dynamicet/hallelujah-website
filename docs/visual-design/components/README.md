# Order 5 — Polished Responsive Component System

**Prepared:** 12 September 2026  
**Status:** Complete for non-public prototype use; implementation and performed human/device validation remain open  
**Foundation:** [Order 4 prototype foundations](../foundations/README.md)  
**Behavior baseline:** [Component contracts](../../design-system/components.md) and [interaction and motion](../../design-system/interaction-and-motion.md)

## Outcome

Order 5 converts the shared foundation values into one responsive component layer for the 12 designed page types. It covers the shared shell, navigation, mobile menu, footer, breadcrumbs, links, buttons, emergency/call actions, language switching, search, filters, cards, forms, alerts, statuses, accordions, review metadata, and optional-map launcher.

The package includes all applicable default, hover, focus, pressed, disabled, loading, validation/error, empty, unavailable, offline, and authoritative-success states. It uses controlled records and inert actions only. It does not activate contact details, appointment submission, search logging, maps, recruitment providers, analytics, or any other gated operation.

## Artifacts

| Artifact | Purpose |
| --- | --- |
| [Component specification](component-specifications.md) | Anatomy, variants, state priority, responsive and bilingual rules, accessibility semantics, motion, fallbacks, traceability, and acceptance evidence. |
| [Component CSS tokens and reference classes](component-tokens.css) | Order 5 component aliases and dependency-free reference styling, importing the Order 4 value source. |
| [Portable component token manifest](component-tokens.json) | Machine-readable Order 5 component aliases that explicitly extend the Order 4 manifest. |
| [Rendered component study](studies.html) | Responsive semantic specimens using inert controlled placeholders, local inline SVG, and no external requests. |
| [Rendered evidence](evidence/) | Desktop, compact, reduced-motion, and focused-state captures plus the evidence manifest. |

## Binding decisions

- Order 4 primitives and semantic meanings are unchanged. Order 5 adds component aliases only.
- Every target is at least 44 × 44 CSS px, with 8 px separation where adjacent controls are not one grouped control.
- One text-labeled primary action leads a region. Emergency action is a separate Level 0 component, never a red promotional variant.
- Red distinguishes emergency and error only through different structure, copy, icon, and outcomes; color alone never carries state.
- Visible labels, hints, field-level errors, a focusable linked error summary, and preserved values govern forms.
- Search remains an HTML `GET` form. Autocomplete is progressive enhancement and is not enabled in the study.
- Cards have one stretched title destination and never make nested actions or the whole vacancy card an invisible Apply target.
- Loading retains dimensions and meaningful text. Static emergency/contact content never skeletonizes or waits on JavaScript.
- Success styling is reserved for authoritative acknowledgement. A local click, call handoff, or delivery attempt is not portrayed as completed care or a confirmed appointment.
- Empty, unavailable, offline, and expired states always explain the condition and provide a safe next route when one is approved.
- Amharic text in the study is a geometry fixture only and is visibly marked for professional review.
- The compact menu is the only overlay-like specimen; essential navigation remains available as ordinary links when JavaScript is absent.
- The optional map launcher is idle and inert. Text address, entrance, landmarks, and directions remain the complete base experience.

## State priority

When states overlap, apply the most consequential state first:

1. unavailable, expired, or safety-blocked;
2. disabled;
3. loading/busy;
4. validation/error/offline;
5. pressed;
6. focus;
7. hover;
8. default.

Focus remains visible when compatible with the higher-priority state. A disabled reason is adjacent whenever the user could reasonably expect the control to work.

## Review sequence

1. Read the [component specification](component-specifications.md), especially the shared state grammar and component coverage matrix.
2. Open the [rendered study](studies.html) and keyboard through the skip link, header, menu, controls, form, cards, disclosures, and footer.
3. Compare [desktop and compact evidence](evidence/) for wrapping, one-column reflow, target size, and long-label behavior.
4. Inspect the reduced-motion capture and confirm that status, focus, loading meaning, and final geometry remain present without travel, rotation, scale, stagger, or looping motion.
5. Treat every operational action and fact as gated until the validation register contains a named owner, dated outcome, and durable evidence.

## Evidence limits

The rendered captures establish only visible geometry at their named viewports. The study was inspected in Chromium with keyboard-operable native controls and automated structural checks, but this is not a completed screen-reader, Windows High Contrast, touch-device, low-end Android, professional Amharic, or human comprehension test. Those remain Orders 9–11 and `DEL-01` work.

## Completion record

- [x] Shared shell, skip link, desktop navigation, compact menu, footer, and breadcrumb variants are specified and rendered.
- [x] Links, primary/secondary/tertiary buttons, emergency/call actions, language switcher, icons, and all pointer/keyboard states are specified.
- [x] Search, native filters, active-filter chips, result count, pagination, zero-result, failure, offline, and no-JavaScript baselines are specified.
- [x] Doctor, service, location/contact, and gated vacancy cards plus review metadata are rendered from controlled records.
- [x] Inputs, select, textarea, radio, checkbox, optional/required labels, disabled explanation, validation, busy, timeout, delivery warning, and success are covered.
- [x] Emergency, error, warning, information, success, temporary-operations, empty, unavailable, and offline feedback remain structurally distinct.
- [x] Accordion/disclosure, loading indicator, skeleton boundary, image placeholder, and optional-map launcher follow the content-first and failed-dependency rules.
- [x] The component layer imports the Order 4 token source and contains no new primitive or semantic value definitions.
- [x] Reduced-motion, forced-colors, print, 320/360 px, English/Ethiopic geometry, mixed-script, long-label, and missing-data behavior are documented.
- [x] The study makes no network request, uses no remote font/icon/media/library, collects no personal data, and activates no live hospital operation.

## Order 6 handoff

Use this package to design Home, Emergency, and Request an Appointment section by section. Preserve `H0`–`H9`, `E0`–`E8`, and `A0`–`A8`; compose these components without creating page-only variants or changing the accepted section hierarchy. Show every critical validation, pending, timeout, reconciliation, duplicate, delivery-warning, unavailable, and success state with controlled placeholders. Keep Emergency and every urgent/error/privacy/unknown-outcome element at Level 0.

