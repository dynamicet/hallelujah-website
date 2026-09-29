# B04-007 Controlled Clinician Directory Evidence — 29 September 2026

| Field | Result |
| --- | --- |
| Branch | `b04-007-controlled-clinician-directory` |
| Scope | Synthetic English loopback T0 preparation only |
| Status | Done for controlled development; checked merge and exact-main closeout complete |
| Tracking | [issue #77](https://github.com/dynamicet/hallelujah-website/issues/77) |
| Public route | Absent; no `/doctors/` route exists |
| Providers and collection | Disabled; no external request, analytics or personal-data collection exists |
| Production/publication authority | Not granted |

## Focused passing evidence

| Check | Result |
| --- | --- |
| `pnpm clinician-directory:check` | Pass: 18 projection, query, rendering, escaping, lifecycle, header and deployable-build-isolation cases |
| `pnpm clinician-directory:smoke` | Pass: 142 responsive, capability, isolation and GET-state cases across 320/360/768/1440 px; default, no-JavaScript, reduced-motion, forced-colors, print, 200% text and no-CSS |
| Search and filters | Pass: bounded native GET query, repeated allowlisted specialty filters, retained state, deterministic sorting, finite pagination and no-match reset |
| Fail-closed states | Pass: failure, offline and empty-approved-set states expose no clinician cards; withdrawn records never enter results or counts |
| Accessibility and resilience | Pass: one main/H1, logical D0–D6 source order, skip-link focus, valid fragment targets, 44 px controls, no horizontal overflow and no external/media element |
| Loopback policy | Pass: exact loopback host, GET/HEAD only, unknown-query rejection, no-store/noindex, `connect-src 'none'`, `form-action 'self'`, no external request |
| `pnpm lint`, `pnpm typecheck`, `pnpm format:check` | Pass |
| `pnpm verify` | Pass: complete repository gate, optimized Next.js build and absence of a deployable `/doctors/` route |
| `pnpm rebuild:verify` | Pass from a fresh temporary copy and frozen lockfile; lockfile graph `4087343a2a551525c7658e758d82063f9f3167dc9dddc425a4d80a14ee1b0db3`, importer graph `335e58984a447fd383e00d86b2d3579b39c1d26df9f14be8b32201440ad130f3` |
| `pnpm audit:dependencies` | Pass: 650 dependencies; zero moderate, high or critical known vulnerabilities |
| `pnpm secrets:check --history` | Pass: current text files plus reachable Git history; matched values would be redacted |
| `git diff --check` | Pass |

## Visual review

Five sanitized captures in [`b04-007-artifacts/`](b04-007-artifacts/README.md) cover default and
no-match states at 360 and 1440 CSS px plus a landscape specimen. Visual inspection confirmed a
clear controlled-preview warning, persistent visible labels, mobile wrapping, stable desktop card
grid, readable inactive profile boundary and no horizontal clipping. Every record and specialty is
explicitly synthetic.

The UI review followed the local UI/UX checklist: semantic project tokens, native controls,
visible focus, at least 44 px targets, restrained motion, bounded reading measure and fail-closed
offline/error behavior. The project has no dark theme, so no unimplemented dark-mode behavior is
claimed; forced-colors and print modes are covered by the browser matrix.

## Corrected attempts

The first focused browser run passed all assertions but encountered a Chromium profile cleanup
race. The harness now waits for graceful exit, escalates to `SIGKILL` only if necessary and retries
the exact temporary-directory cleanup. Its complete rerun and clean reconstruction pass.

The first full verification attempt stopped at the repository's pre-existing asset-tool
prerequisite because the system Python did not include `fontTools`. The successful full and clean
verification runs used `ASSET_FORMAT_PYTHON` with the repository-pinned `fontTools 4.65.0` and
`brotli 1.2.0`, plus the repository-pinned Node.js 24.21.0 and pnpm 10.27.0. This was an execution
environment correction, not a product-code bypass.

The first hosted exact-head run stopped at dependency audit after a new moderate `undici` advisory
was published for transitive version 7.29.0. The repository now applies the narrow
`payload>undici` 7.29.1 patched override. The live audit, frozen install, full verification and
fresh clean reconstruction all pass on the patched graph; the failed hosted run is not counted as
acceptance evidence.

## Controlled acceptance

The client directed “close it out”. B04-007 moves In progress → In review → **Done** for
controlled development under `befikadusata` as responsible and controlled acceptance person,
directing Codex in temporary Frontend, Backend-contract and QA roles on 29 September 2026,
Africa/Addis_Ababa. The target remains synthetic local T0/private hosted T1 under the working
B00-016 matrix.

Accepted implementation head: `2a24c83c065b98ef7d79d7559bf1e89e6c993982`. Matching hosted
[run 36539369658](https://github.com/dynamicet/hallelujah-website/actions/runs/36539369658)
passes every step, including the focused server-rendered and browser matrices, optimized-build
isolation, history secret scan, dependency audit, full repository verification and independent
frozen clean reconstruction. All recorded local gates pass and no scoped controlled-development
defect remains open.

Final acceptance-documentation CI must pass for its exact SHA before checked merge of
[PR #78](https://github.com/dynamicet/hallelujah-website/pull/78). Its matching SHA/run, merge SHA
and exact-main result must be retained in [issue #77](https://github.com/dynamicet/hallelujah-website/issues/77)
and PR #78. Dependent execution waits for passing exact-main CI. B04-008 is not promoted by this
acceptance.

## Exact-main closeout

Final acceptance-documentation
[run 36541780392](https://github.com/dynamicet/hallelujah-website/actions/runs/36541780392)
passed for exact head `b48aa336edb75dfcbcfb9a860a610a878fc1b15b`.
[PR #78](https://github.com/dynamicet/hallelujah-website/pull/78) then merged as
`908fad5242e778901cbbdfe6ed20c79c9555d109`, automatically closing
[issue #77](https://github.com/dynamicet/hallelujah-website/issues/77). Exact-main
[run 36564303277](https://github.com/dynamicet/hallelujah-website/actions/runs/36564303277)
passed every gate for that merge commit, including independent frozen clean reconstruction. This
completes B04-007 controlled-development closeout without promoting B04-008 or any remaining gate.

## Remaining gates

B04-001, B04-002, CARE-01, CARE-02, SEARCH-01, LANG-01 and DEL-01 remain unresolved. Authentic
roster approval, specialty vocabulary, profile destinations, portraits, schedule/availability,
staffed contact, appointment actions, provider integration, production and publication remain
gated. Controlled acceptance closes no dependency or publication gate.
