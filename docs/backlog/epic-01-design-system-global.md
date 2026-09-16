# Epic 01 — Design System and Global Experience

**Outcome:** A production-grade, accessible, responsive, bilingual-ready interface system and global shell that faithfully implements the Calm Wayfinding contracts while keeping approved brand choices centrally replaceable.
**Priority:** P0/P1  
**Milestone:** M1  
**Primary owners:** Product Designer, Frontend Lead, QA/Accessibility Lead, Brand Owner, Language Reviewer

## Canonical sources

- [Design-system overview](../design-system/README.md)
- [Foundations](../design-system/foundations.md), [layout patterns](../design-system/layout-patterns.md), [component contracts](../design-system/components.md), and [interaction/motion](../design-system/interaction-and-motion.md)
- [Visual component specification](../visual-design/components/component-specifications.md)
- [Responsive and bilingual refinement](../visual-design/pages/responsive/responsive-bilingual-refinement.md)
- [Developer handoff](../visual-design/handoff/developer-handoff.md#4-token-and-style-integration)
- [High-end motion and interactive-media amendment](../visual-design/motion/high-end-motion-and-interactive-media-amendment.md)

## Backlog

| ID | Lane | Pri | Outcome and implementation scope | Acceptance and evidence | Dependencies / gates | Owner | References |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `B01-001` | DELIVERY | P0 | Convert the visual contracts into a production component architecture; prohibit page-study import chains and prototype scripts. | Architecture note maps primitive → semantic → component → template; components have bounded public APIs; production code contains no reviewer toolbar, fixture query controls, simulated outcomes, remote prototype assets, or cross-template CSS imports. | `B00-004`–`B00-005` | Frontend Lead | `G-004`, `G-010`; [prototype boundary](../visual-design/handoff/developer-handoff.md#3-prototype-to-production-boundary) |
| `B01-002` | DECISION | P0 | Approve authentic logo/name/tagline, palette direction, English/Amharic typography, still/moving-imagery policy, and asset-rights workflow. | Original assets and decision record are signed; typography license/glyph/weight checks and rendered contrast are performed; imagery/video art direction, authenticity, claims, consent, poster/crop behavior, and lifecycle are approved; rejected/provisional assets remain distinguishable and removable. | `BRAND-01` | Brand + Language + Accessibility | `G-004`, `G-010`, `H-002`, `D-006`, `I-002`; [brand rules](../design-system/foundations.md#2-brand-asset-rules); [media amendment](../visual-design/motion/high-end-motion-and-interactive-media-amendment.md) |
| `B01-003` | DELIVERY | P0 | Choose one canonical token source and generate CSS/platform outputs with drift protection, including functional, composed, cinematic, and reduced/static motion roles. | Primitive, semantic, and component tokens are typed and generated; parity test fails on drift; templates consume aliases; protected Level 0/1 contexts cannot inherit cinematic tokens; theme/motion tuning does not require page rewrites; contrast and reduced-equivalent metadata are testable. | `B01-001`; final values gated by `B01-002` | Frontend Lead + Designer | [three-layer tokens](../design-system/README.md#three-layer-token-contract); [token integration](../visual-design/handoff/developer-handoff.md#4-token-and-style-integration); `G-012` |
| `B01-004` | DELIVERY | P1 | Implement global CSS foundations: typography, spacing, grid, container, color roles, focus, borders, elevation, media, print, and forced-color behavior. | 320/360/tablet/1280/1440 and 200%/400% reflow fixtures have no consequential truncation or two-dimensional page scroll; system fonts render immediately; focus and contrast meet contracts; print keeps essential text/actions. | `B01-003` | Frontend + QA | `G-003`–`G-005`, `G-007`, `G-010`; [foundation checklist](../design-system/foundations.md#9-foundation-acceptance-checklist) |
| `B01-005` | DELIVERY | P0 | Implement links, buttons, deliberate call actions, emergency actions, icons, and focus-visible behavior. | Semantics match action; target size is at least 44×44 CSS px; visible and accessible names communicate purpose; call href and visible value share canonical data; moved touch/scroll cannot accidentally activate; emergency styling never relies on color alone. | `B01-003`; real call data gated by `SAFE-01` | Frontend + QA | `E-001`; [essential actions](../design-system/components.md#3-links-buttons-and-essential-actions) |
| `B01-006` | DELIVERY | P1 | Implement header, skip link, wide/compact navigation, breadcrumbs, language switcher, and footer using one meaningful DOM order. | Skip link lands at main; menu traps no focus and restores focus on close/route change; active/current state is conveyed semantically; long English/Amharic labels wrap; language unavailability is explicit; essential actions survive no JS. | `B01-004`–`B01-005`; labels gated by `LANG-01` | Frontend + QA | `G-001`–`G-003`, `G-005`, `S-006`–`S-008`; [header/navigation](../design-system/components.md#4-header-and-navigation) |
| `B01-007` | DELIVERY | P1 | Implement search, filter, chip, count, pagination, and disclosure primitives with URL-state adapters. | Controls are labeled and keyboard operable; results/count changes are announced once; reset and Back/Forward work; compact filter focus restores; only bounded navigational state can serialize; no unpublished IDs or personal/sensitive data enter URLs. | `B01-004`; behavior used after `SEARCH-01` | Frontend + QA | `D-002`, `H-005`, `S-005`; [search/filters](../design-system/components.md#6-search-and-filters) |
| `B01-008` | DELIVERY | P1 | Implement governed-content cards, review metadata, neutral media fallbacks, and expired/unavailable variants. | Doctor/service/location/vacancy variants expose correct headings and links; optional missing fields disappear cleanly; retirement removes actions; image fallback does not impersonate a person/facility; review/expiry information is available without cluttering critical tasks. | `B01-004`, `B02-001` | Frontend + Content | `D-003`–`D-006`, `V-005`, `G-014`–`G-015`; [governed cards](../design-system/components.md#7-governed-content-cards) |
| `B01-009` | DELIVERY | P0 | Implement accessible form fields, choices, help/error relationships, error summary, pending, receipt, warning, and failure primitives. | Persistent labels and requirements precede input; server errors link to fields; first invalid submit focuses summary; valid input persists; busy/disabled semantics are truthful; success appears only for authoritative acceptance; reduced-motion and no-JS behavior pass. | `B01-004`; appointment-specific use gated by `APPT-01`–`APPT-04` | Frontend + QA | `A-004`, `A-006`; [forms](../design-system/components.md#8-forms); [forms checklist](../visual-design/handoff/accessibility-and-validation-checklist.md#forms-and-asynchronous-behavior) |
| `B01-010` | DELIVERY | P1 | Implement alert/status, temporary notice, loading/empty/error/offline/unavailable/expired patterns and state precedence. | State words, structure, and recovery action are explicit; focus remains visible when states coincide; priority is unavailable/expired → error/invalid → disabled → loading → pressed → focus → hover → default; critical facts are never skeletonized. | `B01-004` | Frontend + QA | `G-006`, `G-011`; [alerts/status](../design-system/components.md#9-alerts-and-status); [state contract](../visual-design/handoff/developer-handoff.md#8-component-and-state-contract) |
| `B01-011` | DELIVERY | P1 | Implement optional-map consent/activation wrapper and equivalent text-first fallback. | No provider request occurs before approved activation; blocked/loading/failure states preserve complete written directions; keyboard and screen-reader users can operate/remove the map; map never becomes the only route to arrival information. | `B01-010`; controlled provider-neutral work may use the deferred `B00-014` default-deny baseline under the [execution brief](b01-011-provider-neutral-optional-map.md). `B00-014` / `SEC-02` must close before provider integration or use. | Frontend + Privacy QA | `C-003`, `S-005`; [optional map](../design-system/components.md#11-optional-map) |
| `B01-012` | DELIVERY | P1 | Implement the progressive motion and interactive-media architecture: stable foundation, enhanced Levels 1–3, opt-in Level 4 media, and permanent protected contexts. | Emergency, urgent, consequential appointment, error, privacy/consent, unavailable/expired, and unknown-outcome meaning has no expressive entrance; eligible sections use bounded authored choreography; content/actions precede enhancement; reduced-motion/Save-Data/no-JS/media-failure modes are intentional; route changes never await animation; runtime selection records license/security/bundle/cleanup evidence; video makes zero pre-intent request and exposes complete controls. | `B01-003`–`B01-004`; authentic media gated by `B01-002`/`B02-011`; providers by `SEC-02` | Frontend + Designer + QA | `G-007`, `G-008`–`G-012`, `H-002`; [motion rules](../design-system/interaction-and-motion.md); [motion/media amendment](../visual-design/motion/high-end-motion-and-interactive-media-amendment.md); [motion handoff](../visual-design/handoff/developer-handoff.md#10-accessibility-motion-and-performance) |
| `B01-013` | EVIDENCE | P1 | Create a component, motion, media, and state review harness using controlled, visibly labeled fixtures in both languages and all capability modes. | Harness covers every component/state and eligible Level 2–4 treatment at 320/360/tablet/1280/1440, long/mixed scripts, default/reduced motion, Save-Data, forced colors, no images/fonts/JS, poster/play/pause/end/failure, deep-link/history restoration, and coarse-pointer cases; it reports animation/runtime/media bytes and cannot be indexed or bundled into production routes. | `B01-005`–`B01-012`, `DEL-01` | Designer + QA | `G-003`–`G-012`, `H-002`; [component evidence baseline](../visual-design/components/README.md); [motion/media acceptance](../visual-design/motion/high-end-motion-and-interactive-media-amendment.md#9-acceptance-before-production) |

## Epic exit criteria

PR `#27` is merged and issue `#26` is closed after passing final documentation CI. Its initial
post-merge `main` CI exposed an optional-map request classifier mismatch during clean reconstruction;
the [scoped closeout correction](evidence/B01-013-component-review-harness-2026-09-16.md#post-merge-closeout-correction)
must pass a follow-up PR gate and `main` CI before dependent execution resumes.

- All production templates can use the system without importing another page implementation.
- Token generation/parity, accessibility smoke, responsive geometry, motion-mode, media-request, and cleanup tests run in CI.
- Component states are demonstrable in English and Amharic fixtures without being publishable content.
- `B01-002` project-approved brand values remain centrally replaceable on a recorded change trigger without template rework.

## Explicit exclusions

- No new palette, font, icon family, logo reconstruction, photography, footage, or motion-library license is approved through implementation.
- No screenshot pixel-matching that contradicts semantic, responsive, or accessibility contracts.
- No client-only component may hide essential server-rendered content.


`B01-013` moved Proposed → Ready → In progress → In review → Done on client instruction and passing
controlled local evidence on 16 September 2026, Africa/Addis_Ababa. Its loopback-only review tool
lives outside application source/public assets and reviews the actual built SSR fixtures. All 41
rendering components are inventoried; the full shared interaction suite, 90 bilingual capability/
viewport cases, bilingual keyboard/media-end/history retests, repository gates, reachable-history
secret scan, dependency audit and sanitized captures pass. See the
[execution brief](b01-013-component-review-harness.md),
[local evidence](evidence/B01-013-component-review-harness-2026-09-16.md) and
[issue `#26`](https://github.com/dynamicet/hallelujah-website/issues/26) and
[PR `#27`](https://github.com/dynamicet/hallelujah-website/pull/27) for exact-head hosted review.
Client controlled-development acceptance is recorded on 16 September 2026, Africa/Addis_Ababa.
Hosted implementation run `35073807049` passed all steps, including clean reconstruction, for
`703ccb4d3507b42cd88f4a8ba958251da0cc23b0`; final documentation CI must pass before merge.
`DEL-01` signatures, human AT/physical devices,
professional language approval, authentic media, public routes and publication remain gated.
