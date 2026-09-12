# Hallelujah Website Design System

**Version:** 0.4 Order 12 developer handoff  
**Prepared:** 12 September 2026  
**Status:** Prototype values and interaction/accessibility rules are fixed for planning; hospital identity approval and listed human/production validation remain open  
**Related:** [Requirements matrix](../requirements/requirements-matrix.md) · [Page specifications](../ux/page-specifications.md) · [Sitemap](../ux/sitemap.md) · [Benchmark traceability](../benchmarks/benchmark-traceability.md) · [Developer handoff](../visual-design/handoff/README.md)

## Purpose

This deliverable converts the approved experience direction into a consistent, testable interface system. It governs what pages look like, how components behave, how the experience adapts, and how urgent or failed states are communicated.

The system is designed around a stressed patient or caregiver using a small, low-cost phone and an unreliable connection. Its character is **calm clinical confidence, locally human**: clear enough for urgent decisions, warm enough for families, and restrained enough to protect trust.

## Design decisions

The system incorporates benchmark applications `BM-01`, `BM-02`, `BM-06`, and `BM-08`–`BM-13`: task-first hierarchy, distinct emergency meaning, staffed recovery, text-first access, bilingual boundaries, accessible low-bandwidth components, visible content governance, evidence-gated trust, and targeted status alerts. It does not copy a benchmark's brand or page composition. Full dispositions and source IDs are recorded in the [benchmark traceability register](../benchmarks/benchmark-traceability.md).

| Decision | Status | Rule |
| --- | --- | --- |
| Light, high-contrast interface | Adopt for Phase 1 | Essential content must not depend on a theme preference or dark mode. |
| Existing cyan-led identity as a starting point | Provisional | Validate against the source logo, brand files, and hospital approval before implementation. |
| Deep teal as functional primary | Provisional | It provides stronger contrast than the current bright cyan when paired with white. |
| Red reserved for emergency and error meaning | Adopt | Brand decoration must never compete with or imitate emergency meaning. |
| Noto family for Latin and Ethiopic coverage | Provisional | Test Amharic legibility, metrics, loading, and editorial fit on real devices before approval. |
| 4 px base and 8 px primary spacing rhythm | Adopt | Components and page sections use named tokens, not arbitrary gaps. |
| Restrained motion with no scroll choreography | Adopt | Motion communicates state or orientation only and always respects reduced-motion preferences. |
| One coherent SVG icon family | Adopt | Essential actions pair icons with text; emoji and mixed icon styles are excluded. |
| No automatic carousel, background video, or auto-playing media | Adopt | Safety, comprehension, performance, and motion comfort take precedence. |

The UI/UX reference search returned an “AI-driven dynamic landing” pattern because of a classification mismatch. That pattern is explicitly rejected: this is a public hospital service, not an AI product. The useful accessibility, healthcare palette, form, focus, touch-target, and reduced-motion guidance was retained and reconciled with the project evidence.

## Three-layer token contract

```text
Primitive value
    ↓ assigned a purpose
Semantic token
    ↓ scoped to a reusable pattern
Component token
```

Example:

```text
teal-700 (#006A73)
    → color.action.primary
        → button.primary.background
```

- **Primitive tokens** contain raw scales: color, spacing, type size, radius, border, elevation, duration, and layer.
- **Semantic tokens** express purpose: text, surface, action, emergency, success, warning, focus, section gap, or reading width.
- **Component tokens** express local use: button background, input border, alert edge, card padding, or header height.
- Components must reference component or semantic tokens. Raw values do not appear inside component implementations.
- Token names describe purpose rather than a temporary appearance. Use `color.action.primary`, not `color.cyan`.

## Deliverable map

| File | Questions it answers |
| --- | --- |
| [Foundations](foundations.md) | What visual language, scales, constraints, and accessibility roles do all screens share? |
| [Layout patterns](layout-patterns.md) | How are shells and page sections composed across viewport sizes? |
| [Components](components.md) | What reusable controls and content patterns exist, and how must each behave? |
| [Interaction and motion](interaction-and-motion.md) | What moves, how feedback works, and what happens when motion or runtime support is limited? |
| [Order 4 prototype foundations](../visual-design/foundations/README.md) | What exact tokens and rendered specimens govern non-public prototype work? |
| [Order 5 component system](../visual-design/components/README.md) | What responsive variants, states, and component aliases were tested in the prototype? |
| [Order 12 developer handoff](../visual-design/handoff/README.md) | How do developers apply these contracts, gates, assets, and evidence without shipping prototype fixtures? |

## Implementation order

1. Start with the [Order 12 developer handoff](../visual-design/handoff/developer-handoff.md) and confirm the applicable formal decisions before estimating an affected production capability.
2. Establish one generated three-layer token source; keep the Calm Wayfinding values replaceable until `BRAND-01` and bilingual/contrast retesting close.
3. Implement and test shared semantics, shell, typography, links, buttons, alerts, fields, and recovery states before composing templates.
4. Assemble only approved route/section scope and governed records. Preserve the accepted section IDs and safe omission/withheld behavior.
5. Apply the [accessibility and validation checklist](../visual-design/handoff/accessibility-and-validation-checklist.md) in CI and the approved human/device/browser release matrix.
6. Activate contacts, personal-data workflows, operational claims, and third parties only after their decision evidence closes.
7. Propagate every approved change through decisions, requirements, page/component contracts, wireframes/flows, visuals, implementation, and acceptance evidence.

## Release gates

The design system is ready for implementation only when:

- A named brand owner approves the logo source, palette, and type direction.
- All default and interactive color pairs pass required contrast in rendered components.
- English and Amharic samples pass legibility and expansion review on representative devices.
- Core component states cover default, hover, focus, active, disabled, loading, error, success, empty, unavailable, and no-JavaScript behavior where applicable.
- Emergency styling cannot be confused with ordinary promotion, error, or selected navigation.
- The component inventory maps every Phase 1 page requirement to a supported pattern.
- Any deviation is recorded with an owner, rationale, affected requirements, and review date.

## Explicitly outside this deliverable

- Approval of clinical, contact, schedule, privacy, response-time, or institutional claims
- A final logo redraw or corporate identity program
- High-fidelity page mockups
- A coded component library or framework choice
- Dark mode, decorative animation, or campaign-specific art direction
