# `B01-003` Canonical Generated Design Tokens Evidence — 14 September 2026

> **Current value note:** `B01-002` subsequently approved the project brand foundation and advanced
> the manifest to version 0.2.0. The evidence below remains the accurate historical result at
> `B01-003` closeout; see the [B01-002 evidence](B01-002-project-brand-system-2026-09-14.md).

**Classification:** Sanitized, non-sensitive controlled-development evidence

**State:** Done for controlled development; local `T0` and hosted implementation `T1` gates pass

**Responsible:** Client workspace identity `befikadusata` directing Codex in the temporary Frontend Lead and Designer roles

**Acceptance:** Same identity for controlled development; named production acceptance and final brand/language approval remain open

## Artifact and boundary

- Starting point: merge commit `d7cfceb` on remote `main`, containing completed `B01-001`.
- Working branch: `b01-003-canonical-design-tokens`.
- Tracking issue: [GitHub issue `#4`](https://github.com/dynamicet/hallelujah-website/issues/4).
- Pull request: [GitHub pull request `#5`](https://github.com/dynamicet/hallelujah-website/pull/5).
- Hosted implementation artifact: commit `df09d96083513b6b25cf561eab2a302f989f3ffb`.
- Target: local `T0` verification and private-repository `T1` GitHub Actions execution.
- Scope is limited to the provisional canonical token source, deterministic generated CSS and typed
  output, policy/drift checks, controlled bootstrap alias migration, documentation, and sanitized
  evidence.
- No final brand value, logo, tagline, font/asset license, hospital fact, translation, new route,
  CMS capability, provider, personal-data path, motion/media runtime, deployment, DNS change, or
  publication authority is included.

## Executed evidence

| Check | Exact command / method | Result |
| --- | --- | --- |
| Runtime/toolchain | Pinned command session | Passed: Node.js `24.21.0`, pnpm `10.27.0` |
| Token generation | `pnpm tokens:generate` | Generated 135 primitive, semantic, and component tokens into deterministic CSS and typed TypeScript artifacts |
| Token parity and policy | `pnpm tokens:check` | Passed: byte parity, layer/reference/type checks, four contrast pairs, reduced equivalents, seven protected contexts, consumers, and synthetic negative controls |
| Full local gate | `pnpm verify` | Passed: toolchain, format, CI controls, links, current-tree secrets, backlog, introduction gates, lint, types, tests, build, accessibility, budgets, and runtime |
| Production build | Included in `pnpm verify` | Passed: `/` static, `/health` dynamic, and no additional application or CMS route introduced |
| Accessibility smoke | Included in `pnpm verify` | One implemented static template passed bounded semantic checks; no conformance claim |
| Asset/request budget | Included in `pnpm verify` | 133,482 compressed modern JS bytes, 137,856 initial compressed bytes, eight initial requests, and zero external origins in the recorded local run |
| Runtime smoke | Included in `pnpm verify` | Loopback health, bootstrap HTML, and fail-closed security headers passed |
| Reachable-history secret scan | `pnpm secrets:check --history` | Passed: 213 current text files plus reachable history; match output remains redacted |
| Dependency audit | `pnpm audit:dependencies` | Passed: 650 dependencies; zero moderate, high, or critical known vulnerabilities |
| Hosted implementation gate | [`quality-and-security`](https://github.com/dynamicet/hallelujah-website/actions/runs/34818265645) on `df09d96` | Passed every step in 1 minute 34 seconds, including frozen install, fail-closed controls, history scan, dependency audit, full verify, and clean reconstruction |

The initial shell exposed Node.js `25.2.1`; strict engine enforcement rejected generation before it
ran. All accepted evidence uses the installed pinned Node.js `24.21.0` runtime. The first full gate
reached runtime smoke but the restricted sandbox prevented the server from becoming ready; the
loopback smoke and complete full gate then passed with explicit loopback permission. The first
dependency audit received no complete registry response and failed closed; it passed with explicit
registry access. None of these preliminary environment rejections is recorded as an application
pass or defect.

## Promotion record

| Field | Value |
| --- | --- |
| Ticket | `B01-003` |
| Old / new status | Proposed → Ready → In progress → In review → Done for controlled development |
| Responsible / acceptance | Client workspace identity `befikadusata` / same identity for controlled development; named production roles remain open |
| Date / timezone | 14 September 2026 / Africa/Addis_Ababa (`UTC+03:00`) |
| Dependency evidence | Completed `B01-001`; working `B00-015` and `B00-016`; approved motion/media planning amendment |
| Target | `T0` local and private-repository `T1` hosted execution |
| Allowed scope | Canonical production token pipeline, consumer migration/checks, documentation, and sanitized evidence |
| Issue / evidence | [Issue `#4`](https://github.com/dynamicet/hallelujah-website/issues/4) / this record |
| Next unlock | `B01-004` may be prepared against the generated token system; final values remain gated by `B01-002` |

## Residual gates and merge control

- The hosted implementation run proves `df09d96`. This documentation closeout revision must also
  receive a successful `quality-and-security` result for its exact head before pull request `#5`
  merges under the current-head procedure in `CONTRIBUTING.md`.
- `B01-002` still gates authentic identity, palette, typography, imagery/video policy, licenses, and
  final values. The manifest therefore remains explicitly provisional and centrally replaceable.
- `B01-004` owns rendered global foundations, responsive/reflow, forced-color, print, and full
  contrast evidence. The four automated pairs are token-level checks, not a rendered conformance
  claim.
- `B01-012`–`B01-013` own motion/media runtime selection, implementation, browser modes, request and
  cleanup proof, and component/state evidence. `B01-003` provides roles and fail-closed policy only.
- Named Delivery, Frontend, Design, QA, Accessibility, Brand, and Language people remain required
  at their production gates. The private/free GitHub plan limitation remains governed by
  `B00-012`.

This is controlled-development implementation evidence, not final brand approval, accessibility
certification, motion/media implementation, production readiness, provider approval, personal-data
authority, security certification, or publication approval.
