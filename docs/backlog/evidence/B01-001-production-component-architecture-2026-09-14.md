# `B01-001` Production Component Architecture Evidence — 14 September 2026

**Classification:** Sanitized, non-sensitive controlled-development evidence

**State:** In review; local `T0` implementation and verification pass, hosted `T1` execution pending

**Responsible:** Client workspace identity `befikadusata` directing Codex in the temporary Frontend Lead role

**Acceptance:** Same identity for controlled development; named Delivery, Frontend, QA, and Accessibility acceptance remains open at the production boundary

## Artifact and boundary

- Starting point: merge commit `b6445f3` on remote `main`.
- Working branch: `b01-001-production-component-architecture`.
- Tracking issue: [GitHub issue `#2`](https://github.com/dynamicet/hallelujah-website/issues/2).
- Target: local `T0` verification and private-repository `T1` GitHub Actions execution.
- Scope is limited to production UI layer boundaries, the unchanged controlled bootstrap
  composition, automated boundary enforcement, documentation, and sanitized evidence.
- No hospital fact, translation, brand asset, new route, provider, CMS model/route, personal-data
  path, motion runtime, remote media, deployment, DNS change, or publication authority is included.

## Executed evidence

| Check | Exact command / method | Result |
| --- | --- | --- |
| Runtime/toolchain | Pinned command session | Passed: Node.js `24.21.0`, pnpm `10.27.0` |
| Architecture boundary | `pnpm --dir apps/web test` | Passed: 18 source/config files inspected; current source plus synthetic route-bypass, upward-import, private-import, and cross-template CSS cases passed |
| Full local gate | `pnpm verify` | Passed: toolchain, format, CI policy/negative controls, links, current-tree secrets, backlog, introduction gates, lint, types, tests, build, accessibility, budgets, and runtime |
| Production build | Included in `pnpm verify` | Passed: `/` static, `/health` dynamic, no additional route or CMS route introduced |
| Accessibility smoke | Included in `pnpm verify` | One implemented static template passed bounded semantic checks; no conformance claim |
| Asset/request budget | Included in `pnpm verify` | 133,482 compressed modern JS bytes, 136,392 initial compressed bytes, eight initial requests, zero external origins |
| Runtime smoke | Included in `pnpm verify` | Loopback health, bootstrap HTML, and fail-closed security headers passed |
| Reachable-history secret scan | `pnpm secrets:check --history` | Passed: 206 current text files plus reachable history; match output remains redacted |
| Dependency audit | `pnpm audit:dependencies` | Passed: 650 dependencies; zero moderate, high, or critical known vulnerabilities |
| Hosted current-head gate | Pull-request `quality-and-security` run | Pending |

The shell initially exposed Node.js `25.2.1`; strict engine enforcement rejected the command before
tests ran. The complete evidence uses the installed pinned Node.js `24.21.0` runtime. The first full
gate reached the final runtime smoke but could not bind loopback inside the restricted sandbox. The
runtime smoke then passed with explicit loopback permission, followed by a complete passing
`pnpm verify` in the same permitted environment. Neither preliminary rejection is recorded as an
application pass or defect.

## Promotion record

| Field | Value |
| --- | --- |
| Ticket | `B01-001` |
| Old / new status | Proposed → Ready → In progress → In review |
| Responsible / acceptance | Client workspace identity `befikadusata` / same identity for controlled development; named production acceptance open |
| Date / timezone | 14 September 2026 / Africa/Addis_Ababa (`UTC+03:00`) |
| Dependency evidence | `B00-004`, `B00-005`, working `B00-015`/`B00-016`, and the approved motion/media amendment |
| Target | `T0` local and private-repository `T1` hosted execution |
| Allowed scope | Production design-system architecture, bootstrap composition, boundary tests, documentation, and sanitized evidence |
| Issue / evidence | [Issue `#2`](https://github.com/dynamicet/hallelujah-website/issues/2) / this record |

This is controlled-development implementation evidence, not a release, design-token completion,
motion/media implementation, production readiness, provider approval, personal-data authority,
security certification, or publication approval.
