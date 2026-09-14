# `B01-006` — Global Shell and Navigation

**Status:** In review for controlled development; local `T0` implementation gates pass

**Execution date:** 14 September 2026, Africa/Addis_Ababa

**Publication, final-route, verified-contact, final-language, production, and deployment authority:** Not granted

## Execution contract

| Field | Controlled execution value |
| --- | --- |
| Epic / lane / priority | Epic 01 / `DELIVERY` / `P1` |
| Phase / milestone | Phase 1 / `M1` |
| Old / new status | Proposed → Ready → In progress → In review |
| Responsible owner | Client workspace identity `befikadusata` directing Codex in the temporary Frontend Lead and QA roles |
| Acceptance owner | Same client identity for controlled-development acceptance; named Delivery, Frontend, QA, Accessibility, Language, Content, Operations, and Security people return at their production gates |
| Target environment | `T0` isolated local application and headless Chromium; private-repository hosted `T1` pending |
| Requirements / decisions | `G-001`–`G-003`, `G-005`, `G-013`, `S-006`–`S-008`; final labels and equivalents remain gated by `LANG-01`; real contacts remain gated by `SAFE-01` |
| Dependencies | Completed `B01-004`, merged `B01-005`, working `B00-015` and `B00-016` development baselines |
| Allowed repository scope | Shell/navigation components and first-party enhancement, component token aliases and generated outputs, controlled local fixture, static/rendered checks, architecture/backlog documentation, and sanitized screenshots |
| Repository review | [Issue `#10`](https://github.com/dynamicet/hallelujah-website/issues/10); pull request and hosted implementation run pending |
| Evidence destination | [Sanitized local evidence](evidence/B01-006-global-shell-navigation-2026-09-14.md) |

The client's 14 September 2026 direction to proceed authorized readiness promotion, a scoped branch,
implementation, local verification, sanitized evidence, and normal repository review. It did not
authorize public routes, final hospital labels, real contact data, translations, providers,
personal-data collection, deployment, DNS, production, or publication.

## Outcome and acceptance

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

## Completion boundary

- [x] Production shell APIs, canonical component aliases, first-party enhancement, and controlled fixture exist.
- [x] Static semantics, one-order navigation, current state, breadcrumb, language, target, mode, and source-boundary checks pass.
- [x] Required responsive, zoom, enlarged-text, compact/wide, Escape, skip-link, reduced-motion, print, and forced-colors browser checks pass locally.
- [x] Sanitized 320 px and 1440 px screenshots were visually reviewed.
- [ ] Pull-request current head passes hosted `T1` and repository review.
- [ ] Named production roles accept final routes/labels, physical-device and assistive-technology behavior, professional Amharic, governed contacts, and release evidence.

The final checkbox remains an external production gate. `LANG-01` owns final language decisions;
`SAFE-01` owns canonical real contact data; later page tickets own route publication and content.

## References

- [Epic scope](epic-01-design-system-global.md)
- [Header/navigation and language contract](../design-system/components.md#4-header-and-navigation)
- [Architecture record](../architecture/global-shell-navigation.md)
- [Implementation acceptance matrix](../validation/implementation-acceptance-matrix.md)
