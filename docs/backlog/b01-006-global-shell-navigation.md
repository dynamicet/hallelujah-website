# `B01-006` — Global Shell and Navigation

**Status:** Ready — reopened for a focused controlled-development correction; historical `T0`/`T1`
evidence is retained but does not accept the reopened cases

**Execution date:** 14 September 2026, Africa/Addis_Ababa

**Reopening date:** 28 September 2026, Africa/Addis_Ababa

**Publication, final-route, verified-contact, final-language, production, and deployment authority:** Not granted

## Execution contract

| Field | Controlled execution value |
| --- | --- |
| Epic / lane / priority | Epic 01 / `DELIVERY` / `P1` |
| Phase / milestone | Phase 1 / `M1` |
| Old / new status | Historical: Proposed → Ready → In progress → In review → Done for controlled development; current: Done → Ready for focused correction |
| Responsible owner | Client workspace identity `befikadusata` directing Codex in the temporary Frontend Lead and QA roles |
| Acceptance owner | Same client identity for controlled-development acceptance; named Delivery, Frontend, QA, Accessibility, Language, Content, Operations, and Security people return at their production gates |
| Target environment | `T0` isolated local application and headless Chromium; private-repository hosted `T1` pass |
| Requirements / decisions | `G-001`–`G-003`, `G-005`, `G-013`, `S-006`–`S-008`; final labels and equivalents remain gated by `LANG-01`; real contacts remain gated by `SAFE-01` |
| Dependencies | Completed `B01-004`, merged `B01-005`, working `B00-015` and `B00-016` development baselines |
| Allowed repository scope | Shell/navigation components and first-party enhancement, component token aliases and generated outputs, controlled local fixture, static/rendered checks, architecture/backlog documentation, and sanitized screenshots |
| Repository review | [Issue `#10`](https://github.com/dynamicet/hallelujah-website/issues/10), [pull request `#11`](https://github.com/dynamicet/hallelujah-website/pull/11), and [hosted implementation run](https://github.com/dynamicet/hallelujah-website/actions/runs/34879240044) on `fc672b8` |
| Evidence destination | [Historical implementation evidence](evidence/B01-006-global-shell-navigation-2026-09-14.md); [reopening review](evidence/B01-006-header-review-2026-09-28.md); a dated correction record is required before re-closeout |

The client's 14 September 2026 direction to proceed authorized readiness promotion, a scoped branch,
implementation, local verification, sanitized evidence, and normal repository review. It did not
authorize public routes, final hospital labels, real contact data, translations, providers,
personal-data collection, deployment, DNS, production, or publication.

The client's 28 September 2026 direction reopens the ticket at **Ready** for the correction below.
It authorizes planning and issue/board change control. It does not claim the correction is
implemented, promote the ticket to In progress or Done, accept new evidence, or expand the original
publication and production boundary.

## Reopening trigger and focused correction

A source and rendered review of current `main` found that the implementation passes its existing
checks while violating or omitting four intended shell behaviors:

1. On wide layouts CSS places Search/Language above the primary navigation although the DOM and
   keyboard sequence place navigation first, so visual order and focus order diverge.
2. On compact layouts only primary navigation is inside the disclosed panel; Search, Language and
   routine actions remain permanently exposed. This conflicts with the approved compact
   composition and produces an unnecessarily tall closed header.
3. The responsive API has no explicit forced-compact mode for Amharic or configured long-label
   navigation at wide viewport sizes.
4. The identity link constructs its accessible name with a hard-coded English `home` suffix
   instead of consuming governed current-language naming.

The correction is limited to `SiteHeader` composition/API, its CSS and first-party enhancement as
needed, controlled fixtures/callers, shell architecture/backlog/evidence, and static/rendered
regression checks. It adds no route, hospital fact, translation, provider, dependency, collection,
deployment, production, or publication authority.

## Correction acceptance contract

| Area | Required observable result |
| --- | --- |
| DOM and visual order | At every tested state, visible interactive controls follow one logical source and keyboard order that agrees with their visual block order. Do not repair order with positive `tabindex`; CSS grid/flex placement must not make focus jump backward through the header. |
| Compact closed | Only the governed identity link, menu trigger and distinct Emergency action remain in the closed compact header. Search, Language and routine Call/Appointment actions are not visible or tabbable. |
| Compact open | The one existing primary navigation tree, Search, Language and routine Call/Appointment actions appear in the disclosed panel in a documented logical focus sequence. Emergency remains distinct, no control is duplicated, Escape restores trigger focus when applicable, and no-JavaScript native disclosure remains usable. |
| Wide | The same controls are directly available without opening the menu, and their rendered row/column sequence agrees with DOM and keyboard order. Emergency remains visually separated from routine actions. |
| Forced compact | `SiteHeader` exposes a generic explicit mode such as `responsive | compact`; shell orchestration selects compact for the controlled Amharic and configured long-navigation fixtures even at wide widths. The component must not infer language from label text. |
| Localized identity | The identity link consumes a required governed current-language accessible label, or relies on equivalent governed visible text, without concatenating an English token. Empty labels fail the controlled contract. |
| Resilience | Existing single-navigation-tree, 44 × 44 CSS px target, wrap/reflow, current-state, skip-link, breadcrumb, no-JavaScript, reduced-motion, forced-colors and print behavior remains intact. |

## Correction implementation plan

1. Amend the `SiteHeader` public contract and all controlled callers with an explicit layout mode
   and governed identity-link label. Keep defaults fail-safe and the component language-agnostic.
2. Refactor the header into a mobile-first source structure whose compact disclosed region owns
   primary navigation, Search, Language and routine actions. Keep the distinct Emergency action in
   the closed compact shell and avoid a duplicate navigation or action tree.
3. Rebuild wide CSS from that source structure so layout placement does not contradict reading or
   keyboard order. Preserve native popover behavior and use the existing first-party script only
   for additive state/focus handling.
4. Strengthen `pnpm shell:check` with public-contract, containment, single-tree and prohibited
   hard-coded accessible-name assertions.
5. Strengthen `pnpm shell:smoke` with compact closed/open membership and tabbability, actual Tab
   traversal versus visual block order, wide mode, forced compact at a wide viewport, localized
   identity naming, Escape restoration, no-JavaScript operation, target sizing and overflow cases.
   Cover 320/360 px, the wide breakpoint and 1440 px, English, controlled Amharic shaping and an
   expanded-label fixture.
6. Run targeted checks, application gates and full repository verification; visually inspect and
   retain sanitized 320 px compact, 1440 px wide and 1440 px forced-compact captures. Record local
   evidence, exact review-head hosted `T1`, checked merge and exact-main CI before re-closeout.

## Historical outcome and acceptance

1. `SiteShell`, `SiteHeader`, `PrimaryNavigation`, `Breadcrumbs`, `LanguageSwitcher`, `SiteFooter`,
   and `SkipLink` are exported from the production component boundary.
2. Header and compact layouts render one meaningful primary-navigation DOM order. The native
   popover trigger controls that list without JavaScript; the first-party enhancement reflects
   expanded state, restores trigger focus after Escape, and closes before route navigation.
3. The skip link lands on a programmatically focusable main landmark. Current navigation and
   breadcrumb items use semantic current-page state plus a non-color marker.
4. Long labels and breadcrumb trails wrap without horizontal scrolling. All visible shell targets
   measure at least 44 × 44 CSS px across the controlled viewport and zoom matrix.
5. Language names carry correct `lang` metadata and never use flags. An unavailable equivalent
   stays on the current page and exposes a visible, associated explanation.
6. Essential emergency and routine actions remain ordinary server-rendered anchors. The fixture
   adds no public route, approved hospital fact, external dependency, remote request, custom font,
   personal data, or provider.

## State applicability

- **Compact closed/open:** native trigger owns the popover relationship and accessible state;
  Escape closes it and the enhancement restores focus when focus was inside.
- **Wide:** the same navigation list is placed directly in the header; no duplicate mobile tree is
  rendered.
- **Current route:** `aria-current="page"` and a persistent border marker survive grayscale and
  forced colors.
- **Breadcrumb:** prior levels are links; the current level is text and wrapping never becomes a
  horizontal scroller.
- **Language unavailable:** the alternative is non-interactive and its reason is visible and
  programmatically associated; no fallback redirect occurs.
- **No JavaScript:** skip, navigation popover, internal anchors, emergency/routine actions,
  breadcrumb, and footer remain native HTML. The focus-restoration enhancement is additive.
- **Reduced motion, forced colors, print:** skip-link motion resolves to zero; system colors retain
  boundaries/current state; navigation and essential text remain printable.

## Verification plan

| Method | Exact command | Expected result |
| --- | --- | --- |
| Token/shell contract | `pnpm tokens:check`; `pnpm shell:check` | Generated parity, 285 tokens, governed identity slot, one navigation tree, native disclosure, language, target, mode, and source-boundary checks pass |
| Application checks | `pnpm lint`; `pnpm typecheck`; `pnpm test`; `pnpm build` | Zero warnings/errors; controlled route remains statically rendered |
| Rendered behavior and geometry | `pnpm shell:smoke --capture-dir docs/backlog/evidence/b01-006-rendered` | Responsive/zoom geometry, current state, compact/wide menu, Escape/skip focus, language status, reduced-motion, print, and forced-colors assertions pass |
| Existing gates | `pnpm accessibility:smoke`; `pnpm budgets:smoke`; `pnpm runtime:smoke`; `pnpm verify` | Semantic, asset, runtime/security-header, and full repository gates pass |
| Hosted `T1` | Pull-request `quality-and-security` run | Green result belongs to the exact current review head before merge |

## Historical completion boundary

- [x] Production shell APIs, canonical component aliases, first-party enhancement, and controlled fixture exist.
- [x] Static semantics, one-order navigation, current state, breadcrumb, language, target, mode, and source-boundary checks pass.
- [x] Required responsive, zoom, enlarged-text, compact/wide, Escape, skip-link, reduced-motion, print, and forced-colors browser checks pass locally.
- [x] Sanitized 320 px and 1440 px screenshots were visually reviewed.
- [x] Pull request `#11` implementation head passed hosted `T1`; this documentation closeout head must repeat the gate before merge.
- [ ] Named production roles accept final routes/labels, physical-device and assistive-technology behavior, professional Amharic, governed contacts, and release evidence.

The final checkbox remains an external production gate. `LANG-01` owns final language decisions;
`SAFE-01` owns canonical real contact data; later page tickets own route publication and content.

## Reopened correction completion boundary

- [ ] Public API and all controlled callers use explicit layout mode and governed identity naming.
- [ ] Compact closed/open and wide compositions satisfy the correction acceptance contract without duplicate controls.
- [ ] Rendered keyboard order agrees with visual block order in responsive and forced-compact modes.
- [ ] Static and rendered regressions fail on each reviewed defect and pass the complete viewport, language and capability matrix.
- [ ] Sanitized correction captures receive visual review and the dated correction evidence records targeted and full local gates.
- [ ] Exact review-head hosted `T1`, controlled acceptance, checked merge and exact-main CI are recorded before Done is restored.

## References

- [Epic scope](epic-01-design-system-global.md)
- [Header/navigation and language contract](../design-system/components.md#4-header-and-navigation)
- [Architecture record](../architecture/global-shell-navigation.md)
- [Implementation acceptance matrix](../validation/implementation-acceptance-matrix.md)
