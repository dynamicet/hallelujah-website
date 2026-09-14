# `B01-004` — Global CSS Foundations

**Status:** Done for controlled development; local `T0` and hosted implementation `T1` gates pass

**Execution date:** 14 September 2026, Africa/Addis_Ababa

**Publication, provider activation, production, deployment, final-language, and personal-data authority:** Not granted

## Execution contract

| Field | Controlled execution value |
| --- | --- |
| Epic / lane / priority | Epic 01 / `DELIVERY` / `P1` |
| Phase / milestone | Phase 1 / `M1` |
| Old / new status | Proposed → Ready → In progress → In review → Done for controlled development |
| Responsible owner | Client workspace identity `befikadusata` directing Codex in the temporary Frontend Lead and QA roles |
| Acceptance owner | Same client identity for controlled-development acceptance; named Delivery, Frontend, QA, Accessibility, Language, and Brand people return at their production gates |
| Target environment | `T0` isolated local application and headless Chromium; private-repository pull request `#7` for hosted `T1` |
| Requirements / decisions | `G-003`–`G-005`, `G-007`, `G-010`; project brand direction approved under `B01-002` |
| Dependencies | Completed `B01-003`; working `B00-015` and `B00-016` development baselines |
| Allowed repository scope | Canonical foundation token roles and generated outputs, global CSS, controlled local fixture, static/rendered checks, architecture/backlog documentation, and sanitized screenshots |
| Repository review | [Issue `#6`](https://github.com/dynamicet/hallelujah-website/issues/6), [pull request `#7`](https://github.com/dynamicet/hallelujah-website/pull/7), and [hosted implementation run](https://github.com/dynamicet/hallelujah-website/actions/runs/34837389038) on `b3868f4` |
| Evidence destination | [Sanitized local evidence](evidence/B01-004-global-css-foundations-2026-09-14.md) |

The client's 14 September 2026 direction to proceed authorized readiness promotion, the scoped
branch, local implementation, verification, evidence capture, and the normal repository review
flow. It did not authorize hospital facts or translations, public routes, final font/logo binary
ingestion, CMS capability, providers, motion/media runtime implementation, personal-data
collection, deployment, DNS, production, or publication.

## Outcome and acceptance

1. The canonical manifest now exposes the approved foundation palette roles, responsive type
   scale, adaptive spacing, content widths, touch target, focus/border, radius, elevation, and
   dynamic-viewport values; generated CSS and TypeScript remain deterministic.
2. Global styles establish immediate Latin/system and Amharic/Ethiopic font stacks, body and
   heading hierarchy, wrapping, link/focus treatment, form inheritance, responsive media, readable
   containers, flow/grid utilities, and visually hidden content without raw component colors.
3. Print uses a white essential-content surface without decorative elevation. Forced-colors keeps
   system link/focus colors and removes the controlled surface shadow. Reduced motion resolves the
   enhanced semantic duration to zero.
4. A server-rendered, local-only fixture covers long English labels, an explicitly unreviewed
   Ethiopic shaping sample, a focusable 44 px control, readable measure, no-image/custom-font
   fallback, and no-JavaScript content.
5. Headless Chromium/Chrome measures 320, 360, 375, phone landscape, tablet, 1280, and 1440 layouts plus
   200%/400% viewport equivalents and 200% root-text enlargement without page overflow or clipped
   consequential content.

## State applicability

- **Default:** the controlled bootstrap consumes the generated foundation aliases and remains server rendered.
- **Long/mixed script:** representative English and unreviewed Ethiopic fixtures wrap without truncation; actual public Amharic copy remains under `LANG-01`/`LANG-02`.
- **No custom font/image/JavaScript:** all fixture meaning remains visible with the immediate system fallback and no media dependency; approved font/logo binaries remain under `B02-011`.
- **Reduced motion:** semantic enhanced durations compute to zero under the user preference.
- **Forced colors:** system focus/link colors remain visible and decorative shadow is removed.
- **Print:** essential text and actions remain present on a white, shadow-free surface.
- **Loading, empty, invalid, failure, timeout/offline, unavailable/expired, history, and receipt:** no new application behavior is introduced; component-specific states remain with `B01-005`–`B01-010`.

## Verification plan

| Method | Exact command | Expected result |
| --- | --- | --- |
| Token/foundation contract | `pnpm tokens:check`; `pnpm foundations:check` | Generated parity, 209 token checks, 13 contrast pairs, and required CSS/fixture contracts pass |
| Application checks | `pnpm lint`; `pnpm typecheck`; `pnpm test`; `pnpm build` | Zero warnings/errors; controlled route remains statically rendered |
| Rendered geometry and modes | `pnpm foundations:smoke -- --capture-dir docs/backlog/evidence/b01-004-rendered` | Viewport, zoom-equivalent, enlarged-text, focus, target, type, reduced-motion, print, and forced-colors assertions pass |
| Existing UI/performance gates | `pnpm accessibility:smoke`; `pnpm budgets:smoke`; `pnpm runtime:smoke` | Semantic baseline, bounded assets, loopback runtime, and security headers pass |
| Full local gate | `pnpm verify` | All repository quality/security checks pass with a supported local Chromium executable |
| Hosted `T1` | Pull-request `quality-and-security` run | Green result belongs to the current pull-request head before merge; pending authentication |

## Completion boundary

- [x] Canonical foundation roles and generated artifacts are present and drift checked.
- [x] Global typography, layout, focus, border, elevation, media, print, and forced-color behavior is implemented.
- [x] Required responsive, zoom-equivalent, enlarged-text, bilingual-stack, and modality checks pass locally.
- [x] Sanitized compact and wide Chromium screenshots were visually reviewed.
- [x] GitHub issue/pull request and hosted implementation `T1` verification are recorded.
- [ ] Named production roles accept real devices, ingested fonts/assets, final language, and production release evidence.

The final checkbox remains an external/production gate. `B02-011` owns verified font/logo binary
ingestion; `LANG-01`/`LANG-02` own public language; `B01-005`–`B01-010` own component behavior and
states; `B01-012`–`B01-013` own enhanced motion/media and the full evidence harness.

## References

- [Epic scope](epic-01-design-system-global.md)
- [Foundation checklist](../design-system/foundations.md#9-foundation-acceptance-checklist)
- [Canonical token system](../architecture/canonical-design-token-system.md)
- [Implementation acceptance matrix](../validation/implementation-acceptance-matrix.md)
