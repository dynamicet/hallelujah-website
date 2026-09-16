# `B01-013` — Component, Motion, Media, and State Review Harness

**Execution date:** 16 September 2026, Africa/Addis_Ababa
**Status:** In review; local `T0` verification passes
**Production, collection, provider, authentic content, and publication authority:** Not granted

## Execution contract

| Field | Controlled execution value |
| --- | --- |
| Epic / lane / priority | Epic 01 / `EVIDENCE` / `P1` |
| Phase / milestone | Phase 1 / `M1` |
| Old / new status | Proposed → Ready → In progress → In review on client instruction to start `B01-013` and passing local verification on 16 September 2026, Africa/Addis_Ababa; client controlled-development acceptance remains pending |
| Responsible / acceptance | Client workspace identity `befikadusata` directing Codex in temporary Designer, Frontend, and QA roles / same client identity for controlled-development review; named Language, Accessibility, QA, Security, and Release people return before production |
| Dependencies | `B01-005`–`B01-012` Done for controlled development; latest dependent PR `#25` merged as local `54c741b`. The working `B00-016` acceptance matrix is binding; formal `DEL-01` production signatures remain deferred. |
| Target | Isolated local `T0` built application and loopback Chromium review; private-repository hosted `T1` when the implementation is submitted for review |
| Requirements | `G-003`–`G-012`, `H-002`; protected contexts and media acceptance from the approved production motion amendment |
| Allowed repository scope | `scripts/review-harness/`, harness launch/contract commands, existing rendered-check orchestration, root verification commands, architecture/backlog documentation, and sanitized captures/reports |
| Fixtures / languages | Existing visibly synthetic component specimens; English source meaning plus repeated, explicitly unreviewed Amharic shaping/mixed-script stress. No translation is approved or invented. |
| Exclusions | No public route, hospital claim, authentic media/font/logo intake, personal-data flow, provider, package, CMS workflow, appointment outcome, migration, deployment, production, DNS, or publication |
| Branch | `b01-013-component-review-harness` |
| Review tracker | [issue `#26`](https://github.com/dynamicet/hallelujah-website/issues/26) tracks execution; pull-request submission follows local closeout; exact-head hosted result is tracked there before merge; client acceptance remains pending |
| Evidence destination | [Local evidence](evidence/B01-013-component-review-harness-2026-09-16.md), sanitized captures and JSON under `evidence/b01-013-rendered/` |
| Sources | [Epic 01](epic-01-design-system-global.md), [component evidence baseline](../visual-design/components/README.md), [motion/media acceptance](../visual-design/motion/high-end-motion-and-interactive-media-amendment.md#9-acceptance-before-production), [working matrix](../validation/implementation-acceptance-matrix.md), [architecture](../architecture/component-review-harness.md) |

## Observable acceptance

1. Every exported rendering component has an inventory entry and an existing server-rendered
   specimen. The index links to the foundation, action, shell, search, form, system-state, motion/
   media, governed-card, and optional-map sections, with explicit applicable states.
2. Review-only code and controls are outside application source/public assets, excluded from its
   import graph and production output. Loopback host/upstream checks, no-store/noindex headers,
   bounded GET state, default-deny routes, and unconditional POST rejection prevent collection.
3. English and unreviewed Amharic shaping stress cover 320/360/768/1280/1440, default/reduced motion,
   Save-Data, forced colors, no JavaScript, blocked images/fonts, coarse pointer, print, and enlarged
   text. ID relationships, native labels, essential facts, static media, and reflow remain intact.
4. The existing full interaction suite runs all component modes, including invalid-summary focus,
   retained synthetic values, fail-closed acceptance, menu/filter Escape, search pagination/Back,
   map activation/removal/revocation, and keyboard Play/Pause/Stop and blocked-media recovery.
5. Actual finite playback end, page exit, deep-link and Back/Forward restoration have separate
   bilingual checks. No media/captions request precedes intent; no external origin is requested.
6. Reports separate initial compressed HTML/CSS/JavaScript/requests, motion runtime, activated
   WebM/captions and codec/duration. Existing production budgets still pass independently.
7. Repository verification, history secret scan, dependency audit, sanitized visual review, and
   exact-head hosted `T1` pass before controlled-development closure. Physical-device, human AT,
   language approval and production performance evidence remain higher-tier acceptance needs.

## Verification commands

```sh
pnpm review-harness:check
pnpm review-harness:smoke --capture-dir docs/backlog/evidence/b01-013-rendered
pnpm verify
pnpm secrets:check --history
pnpm audit:dependencies
```

For manual review after `pnpm build`, run `pnpm review-harness:serve` and open
`http://127.0.0.1:3213`. Screenshots and prototype code remain references; the harness reviews the
actual built production components. Preserve unrelated worktree changes. Passing this evidence
ticket does not approve translations, hospital facts, collection, providers, public routes or launch.
