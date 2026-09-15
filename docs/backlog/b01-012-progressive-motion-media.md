# `B01-012` — Progressive Motion and Opt-In Media Architecture

**Status:** In review for controlled development; local `T0` passes, hosted `T1` remains open

**Execution date:** 15 September 2026, Africa/Addis_Ababa

## Execution contract

| Field | Controlled execution value |
| --- | --- |
| Epic / lane / priority | Epic 01 / `DELIVERY` / `P1` |
| Phase / milestone | Phase 1 / `M1` |
| Old / new status | Proposed → Ready → In progress → In review on client instruction to start `B01-012` and passing local evidence; Done requires exact-head hosted `T1` |
| Responsible / acceptance | Client workspace identity `befikadusata` directing Codex in temporary Frontend Lead, Designer, and QA roles / same identity for controlled-development acceptance; named Product, Brand, Accessibility, Content, Privacy, Security, Language, Delivery, QA, and Release people return at production gates |
| Target | Isolated local `T0` application and Chromium; private-repository implementation `T1` after pull-request review |
| Dependencies | `B01-003`–`B01-004` Done; `B01-002` project brand approved for planning; authentic media stays gated by `B02-011`; providers stay disabled under `B00-014` and `SEC-02` |
| Allowed repository scope | Experience contracts and component APIs; generated motion-token parity; first-party progressive script; visibly labeled abstract fixture media; local static/rendered tests; architecture, backlog, and sanitized evidence |
| Explicit exclusions | No hospital footage, photography, claims, provider, new public route, personal-data collection, real appointment/media content, deployment, production, DNS, or publication |
| Sources | [Epic 01 scope](epic-01-design-system-global.md); [production motion amendment](../visual-design/motion/high-end-motion-and-interactive-media-amendment.md); [motion contract](../design-system/interaction-and-motion.md); [developer handoff](../visual-design/handoff/developer-handoff.md) |
| Evidence destination | [Local completion evidence](evidence/B01-012-progressive-motion-media-2026-09-15.md) and sanitized captures under `evidence/b01-012-rendered/` |
| Repository review | [Issue `#18`](https://github.com/dynamicet/hallelujah-website/issues/18); pull request and hosted exact-head run pending |

## Observable acceptance

1. A named area ceiling and protected-context resolver prevent Level 2/3 motion on Emergency, urgent guidance, consequential appointment, error, privacy/consent, unavailable/expired, and unknown-outcome meaning, even inside an eligible region.
2. Essential server-rendered content, controls, focus, and recovery precede enhancement. Decorative Levels 2/3 run once in controlled eligible planes with 500/800 ms tokenized opacity/transform only. Reduced motion, Save-Data, no JavaScript, hidden/restored pages, print, and forced colors retain usable static output.
3. Opt-in Level 4 video has a labeled native Play/Pause/Stop control, stable still geometry, and a written equivalent. The first-party video `src` and request appear only after Play; Stop, failure, end, and page exit clear or withhold the source. An informative source requires captions and transcript.
4. No motion runtime or external provider is introduced. The strict existing CSP and disabled-provider gates remain in force.
5. Static/application checks, full repository verification, rendered browser matrix, history secret scan, dependency audit, sanitized evidence, and exact-head hosted `T1` pass before controlled-development closure.

## Verification commands

```sh
pnpm tokens:check
pnpm motion-media:smoke --capture-dir docs/backlog/evidence/b01-012-rendered
pnpm verify
pnpm secrets:check --history
pnpm audit:dependencies
```

The local fixture WebM is an abstract geometric clip. Screenshots and prototype source remain references, not production architecture. Unrelated worktree changes must be preserved. Passing this ticket does not grant media, provider, content, route, collection, or publication authority.
