# `B01-005` — Essential Actions

**Status:** Done for controlled development; local `T0` and hosted implementation `T1` gates pass

**Execution date:** 14 September 2026, Africa/Addis_Ababa

**Publication, real-contact activation, production, deployment, final-language, and personal-data authority:** Not granted

## Execution contract

| Field | Controlled execution value |
| --- | --- |
| Epic / lane / priority | Epic 01 / `DELIVERY` / `P0` |
| Phase / milestone | Phase 1 / `M1` |
| Old / new status | Proposed → Ready → In progress → In review → Done for controlled development |
| Responsible owner | Client workspace identity `befikadusata` directing Codex in the temporary Frontend Lead and QA roles |
| Acceptance owner | Same client identity for controlled-development acceptance; named Delivery, Frontend, QA, Accessibility, Operations, Clinical, and Language people return at their production gates |
| Target environment | `T0` isolated local application and headless Chromium; private-repository hosted `T1` |
| Requirements / decisions | `G-001`, `G-004`–`G-006`, `G-011`, `E-001`–`E-005`, `A-002`, `A-007`; real contact data remains gated by `SAFE-01` |
| Dependencies | Completed `B01-003` and merged `B01-004`; working `B00-015` and `B00-016` development baselines |
| Allowed repository scope | Essential action components and icons, component token aliases and generated outputs, controlled local fixture, static/rendered checks, architecture/backlog documentation, and sanitized screenshots |
| Repository review | [Issue `#8`](https://github.com/dynamicet/hallelujah-website/issues/8), [pull request `#9`](https://github.com/dynamicet/hallelujah-website/pull/9), and [hosted implementation run](https://github.com/dynamicet/hallelujah-website/actions/runs/34869074953) on `c8491ef` |
| Evidence destination | [Sanitized local evidence](evidence/B01-005-essential-actions-2026-09-14.md) |

The client's 14 September 2026 direction to start the next execution authorized readiness
promotion, the scoped branch, implementation, local verification, sanitized evidence, and normal
repository review. It did not authorize public routes, real hospital telephone numbers or hours,
direct emergency calling, clinical routing, providers, personal-data collection, deployment, DNS,
production, or publication.

## Outcome and acceptance

1. `ActionLink`, `ActionButton`, and `TextLink` preserve native anchor/button semantics; routine
   variants expose stable visible labels and optional decorative icons without custom activation.
2. `CallAction` accepts one visible international number, normalizes it once, rejects structurally
   invalid values, and generates both the `tel:` destination and testable canonical value from that
   source. Purpose and optional availability remain visible and programmatically associated.
3. `EmergencyAction` and the emergency call variant always include the visible word “Emergency,” a
   supporting icon and divider, and a Level 0 motion binding. Emergency meaning therefore survives
   grayscale, forced colors, missing icons, reduced motion, and text wrapping.
4. All rendered action targets measure at least 44 × 44 CSS px, groups compute at least 8 px
   separation, focus uses the shared 3 px indicator, and long labels wrap without clipping.
5. Native keyboard activation succeeds once; a moved touch sequence does not activate the target.
   Source checks prohibit pointer-down or touch-start activation handlers.
6. The fixture is server rendered with no required client JavaScript, external dependency, remote
   asset, custom font, provider request, real hospital content, or personal data.

## State applicability

- **Default, hover, active, focus:** primary, secondary, tertiary, call, and emergency treatments use
  generated action tokens and preserve explicit names.
- **Disabled:** a native disabled button remains legible and requires a visible, associated reason.
- **Emergency:** protected Level 0 treatment has no entrance, travel, scale, pulse, or countdown.
- **Long/compact content:** labels, number, purpose, and explanations wrap at 320 px and
  zoom-equivalent widths without horizontal page overflow.
- **No JavaScript:** links, `tel:` handoff, form submission semantics, visible number, disabled
  state, and emergency route remain in server-rendered HTML.
- **Reduced motion, forced colors, print:** interaction transitions reduce to zero; system control
  boundaries and non-color meaning remain; essential labels/numbers print without decorative fill.
- **Loading, error, receipt, unavailable-route, and asynchronous duplicate protection:** owned by
  `B01-009`–`B01-010` and the consuming journey; this ticket does not simulate an outcome.

## Verification plan

| Method | Exact command | Expected result |
| --- | --- | --- |
| Token/action contract | `pnpm tokens:check`; `pnpm actions:check` | Generated parity, 250 tokens, 18 contrast pairs, semantics, phone invariant, target, icon, and emergency policies pass |
| Application checks | `pnpm lint`; `pnpm typecheck`; `pnpm test`; `pnpm build` | Zero warnings/errors; the controlled route remains statically rendered |
| Rendered behavior and geometry | `pnpm actions:smoke -- --capture-dir docs/backlog/evidence/b01-005-rendered` | Responsive/zoom geometry, names, focus, target/gap, telephone, keyboard, moved-touch, emergency, reduced-motion, print, and forced-colors assertions pass |
| Existing gates | `pnpm accessibility:smoke`; `pnpm budgets:smoke`; `pnpm runtime:smoke`; `pnpm verify` | Semantic, asset, runtime/security-header, and full repository gates pass |
| Hosted `T1` | Pull-request `quality-and-security` run | Green result belongs to the exact current review head before merge |

## Completion boundary

- [x] Public action APIs, controlled fixture, canonical component aliases, and generated artifacts exist.
- [x] Static semantics, name, icon, telephone, target, spacing, emergency, mode, and source-boundary checks pass.
- [x] Required responsive, zoom, keyboard, moved-touch, focus, reduced-motion, print, and forced-colors browser checks pass locally.
- [x] Sanitized 320 px and 1440 px screenshots were visually reviewed.
- [x] Pull request `#9` implementation head passed hosted `T1`; this documentation closeout head must repeat the gate before merge.
- [ ] Named production roles accept verified hospital contact data, physical-device/assistive-technology behavior, final language, and release evidence.

The final checkbox remains an external production gate. `SAFE-01` owns canonical real contact
data; `B01-006` may consume these actions in the shell after pull request `#9` merges;
`B01-009`–`B01-010` own asynchronous and failure states.

## References

- [Epic scope](epic-01-design-system-global.md)
- [Essential action contract](../design-system/components.md#3-links-buttons-and-essential-actions)
- [Visual component specification](../visual-design/components/component-specifications.md#3-links-buttons-essential-actions-and-language)
- [Implementation acceptance matrix](../validation/implementation-acceptance-matrix.md)
