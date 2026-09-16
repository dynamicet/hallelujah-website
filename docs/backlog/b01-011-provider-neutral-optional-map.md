# `B01-011` — Provider-Neutral Optional-Map Wrapper

**Execution date:** 16 September 2026, Africa/Addis_Ababa
**Status:** In review; local implementation and `T0` verification complete
**Provider, real arrival content, collection, production, and publication authority:** Not granted

## Execution contract

| Field | Controlled execution value |
| --- | --- |
| Epic / lane / priority | Epic 01 / `DELIVERY` / `P1` |
| Phase / milestone | Phase 1 / `M1` |
| Old / new status | Proposed → Ready → In progress → In review on the client's provider-neutral instruction, implemented component/fixture, passing local gates, and sanitized evidence; controlled-development acceptance remains unclaimed |
| Responsible / acceptance | Client workspace identity `befikadusata` directing Codex in temporary Frontend and QA roles; same client identity reviews controlled-development acceptance; named production Privacy, Security, Operations, Language, Accessibility, and Release owners return at their gates |
| Dependencies | `B01-010` is Done. The deferred `B00-014` default-deny baseline explicitly permits dependent local/first-party development, but does not approve any provider. `SEC-02` remains unresolved. |
| Target | Isolated local `T0` application and headless Chromium; hosted `T1` remains a separate review gate |
| Requirements | `C-003`, `S-005`, `G-007`; real arrival facts remain under `SAFE-03` and the canonical content gates |
| Allowed repository scope | Provider-neutral map component/CSS, first-party enhancement, visibly synthetic fixture, static/browser tests, verification commands, architecture/backlog documentation, and sanitized evidence |
| Branch | `b01-011-optional-map-wrapper` |
| Repository review | Local implementation only at this stage; no issue, pull request, push, or hosted result is claimed |
| Evidence destination | [Local evidence](evidence/B01-011-provider-neutral-optional-map-2026-09-16.md) and captures under `evidence/b01-011-rendered/` |

The client's direction authorizes this controlled implementation and verification. It does not
authorize provider selection or integration, map requests or outbound map links, geolocation,
real coordinates or directions, hospital facts, privacy-consent collection, personal data,
analytics, public routes, deployment, DNS, production, or publication.

## Observable acceptance

1. Address, landmark, entrance, and ordered text directions render in HTML before the optional
   panel and remain complete in idle, blocked, loading, failure, active-placeholder, and removed
   states.
2. The API exposes no approved-provider mode, URL, coordinates, external fallback, tile, iframe,
   or provider surface. No external provider can be activated by the current implementation.
3. No-JavaScript defaults disable the local-test acknowledgement and Preview. First-party
   enhancement enables an unchecked acknowledgement; only explicit Preview after acknowledgement
   reveals a clearly labeled local placeholder. This is not provider consent and stores nothing.
4. Native keyboard controls operate Preview and Remove. Activation focuses the placeholder;
   removal restores launcher focus and announces removal politely. Unchecking and page exit clear
   the placeholder; page exit also clears the temporary choice.
5. Controlled loading and failure specimens preserve the written route, do not imply a real
   request, and offer no unapproved retry or external link.
6. Responsive/reflow/enlarged-text, minimum targets, focus, true no-JavaScript mode, reduced motion,
   print, forced colors, static boundary checks, browser request checks, and repository gates pass.

## Verification plan

```sh
pnpm optional-map:check
pnpm optional-map:smoke --capture-dir docs/backlog/evidence/b01-011-rendered
pnpm verify
pnpm secrets:check --history
pnpm audit:dependencies
```

Use pinned Node.js `24.21.0` and pnpm `10.27.0`. Screenshots and prototype code are references, not
production architecture. Preserve unrelated worktree changes. Passing local tests does not claim
screen-reader/physical-device acceptance, approved translations, provider authority, or publication.

## Sources

- [Epic 01 scope](epic-01-design-system-global.md)
- [Optional-map component contract](../design-system/components.md#11-optional-map)
- [Provider-neutral architecture](../architecture/optional-map-wrapper.md)
- [Default-deny execution baseline](execution-board.md#b00-014--third-party-register)
- [Implementation acceptance matrix](../validation/implementation-acceptance-matrix.md)

## Completion boundary

- [x] Provider-neutral component/CSS, first-party enhancement, and visibly synthetic fixtures exist.
- [x] Static contract, lint/types/build, full local `pnpm verify`, responsive/resilience browser
      matrix, history secret scan, dependency audit, and sanitized visual inspection pass.
- [ ] Client controlled-development acceptance and repository issue/pull-request review are recorded.
- [ ] Hosted `T1` passes for the exact current review commit before merge.
- [ ] Named production roles approve actual provider, arrival facts, privacy/consent policy,
      language, physical-device/assistive-technology behavior, and publication where applicable.

The last item is a separate production/provider outcome and does not require activating a map.
