# B01-006 Header Correction Evidence — 28 September 2026

| Field | Result |
| --- | --- |
| Branch | `b01-006-header-correction` |
| Scope | Focused global-header correction in synthetic local `T0` and private hosted `T1` |
| Status | Done for the focused controlled-development correction; exact-main closeout complete |
| Responsible / review identity | `befikadusata` directing Codex in temporary Frontend Lead and QA roles / same controlled-review identity |
| Tracking | Reopened [issue #10](https://github.com/dynamicet/hallelujah-website/issues/10) |
| Review | Correction [PR #76](https://github.com/dynamicet/hallelujah-website/pull/76); implementation commit `bc76a58` |
| Historical implementation | [PR #11](https://github.com/dynamicet/hallelujah-website/pull/11); retained but does not accept the reopened cases |
| Production/publication authority | Not granted |

## Implemented correction

| Acceptance area | Passing result |
| --- | --- |
| Public contract | `SiteHeader` consumes required governed `homeLabel`, explicit `identityLanguage`, and generic `responsive | compact` navigation mode; a blank identity label fails the controlled contract. |
| DOM and visual order | Identity, Emergency, menu trigger and the single navigation panel share a mobile-first source structure. Responsive-wide CSS preserves the same block and sequential keyboard order without positive `tabindex`. |
| Compact composition | Closed compact mode exposes only identity, Emergency and Menu. Opening the native popover reveals the one primary navigation tree, Search, Language and optional routine action; Emergency is not duplicated. |
| Forced compact | Controlled Amharic and expanded-label fixtures explicitly select compact mode at 1440 px; the component does not infer language from visible text. |
| Localized identity | The link accessible name and `lang` metadata come from controlled current-language inputs; no English `home` suffix is constructed inside the component. |
| Regression coverage | Static checks govern the public contract and panel ownership. Rendered checks exercise actual Tab traversal against visual geometry, membership/tabbability, responsive and forced-compact modes, localized naming, Escape restoration, native no-JavaScript behavior, target size and overflow. |

## Local passing evidence

The successful runs used pinned Node.js 24.21.0 and pnpm 10.27.0. Asset-format checks used the
repository-supported pinned Python override where required.

| Check | Result |
| --- | --- |
| `pnpm shell:check` | Pass: governed identity inputs, explicit mode, one navigation tree, panel ownership, caller coverage and prohibited hard-coded naming assertions. |
| `pnpm shell:smoke --capture-dir docs/backlog/evidence/b01-006-correction-rendered` | Pass: responsive single-order navigation, compact disclosure, actual keyboard order, forced compact at 1440 px, Escape and skip-link focus, no-JavaScript, current state, language behavior, targets, zoom, reduced motion, print and forced colors. |
| `pnpm lint`; `pnpm typecheck`; `pnpm format:check`; `pnpm build` | Pass with zero scoped errors or warnings. |
| `pnpm home:smoke`; `pnpm appointment-page:smoke` | Pass after adapting the existing language-unavailable relationship checks to the closed compact composition. |
| `pnpm verify` | Pass: the complete repository gate, including optimized build and all existing rendered suites. |
| `pnpm backlog:check`; `pnpm links:check`; `git diff --check` | Pass after the promotion record and evidence were added. |

The first format invocation inherited Node.js 25 from the interactive shell and stopped at the
repository engine guard. The pinned Node.js 24.21.0 rerun passed; this was an execution-environment
selection failure, not passing evidence. Full verification regenerated four pre-existing B02-009
and B02-011 visual artifacts byte-for-byte differently; those unrelated generated changes were
restored, and only the three B01-006 correction captures are retained.

## Sanitized visual review

The three captures in [`b01-006-correction-rendered/`](b01-006-correction-rendered/README.md) were
visually inspected. The 320 px closed header keeps a compact identity/Emergency/Menu hierarchy and
the page reflows without horizontal clipping. The 1440 px responsive header follows the source and
Tab sequence from identity through Emergency, navigation and utilities. The 1440 px forced-compact
Amharic shaping fixture retains the compact trigger/panel composition without collision or
duplicated controls.

Screenshots establish visible geometry only. The browser suite separately verifies focus order,
tabbability, programmatic names, disclosure behavior and capability states. Professional Amharic,
physical-device and assistive-technology acceptance remain production gates.

## Review promotion and remaining gates

On the client's “let's promote it” direction, B01-006 moves In progress → **In review — reopened
correction** on 28 September 2026, Africa/Addis_Ababa. No scoped local correction defect remains
open. Implementation commit `bc76a58` is submitted under PR #76; its exact documentation head and
hosted run will be retained in issue #10 and the pull request.

Exact review-head hosted `T1` and explicit controlled acceptance remain required before Done is
restored. Final acceptance-documentation CI, checked merge and passing exact-main CI must then be
recorded. `LANG-01`, `SAFE-01`, authentic content/translation, named production roles, public
routes, providers, personal-data collection, deployment, production and publication remain gated.

## Controlled acceptance

The client directed “B01-006 is In Review, close out”. B01-006 moves In review → **Done** for the
focused controlled-development correction under `befikadusata` as responsible and controlled
acceptance person, directing Codex in temporary Frontend Lead and QA roles on 28 September 2026,
Africa/Addis_Ababa.

Accepted review head `87674b960a41c9e735602971fdfde99c76ec4a66` has matching hosted
[run 36451735815](https://github.com/dynamicet/hallelujah-website/actions/runs/36451735815), which
passed the complete `quality-and-security` workflow. Together with the recorded local targeted and
full verification, this clears the focused correction contract; no scoped controlled-development
defect remains open.

Final acceptance-documentation CI must pass for its exact SHA before checked merge of
[PR #76](https://github.com/dynamicet/hallelujah-website/pull/76). Its matching run, merge SHA and
exact-main result must be retained in [issue #10](https://github.com/dynamicet/hallelujah-website/issues/10)
and PR #76. `LANG-01`, `SAFE-01`, authentic content/translation, named production roles, public
routes, providers, personal-data collection, deployment, production and publication remain gated.

## Exact-main closeout

Final acceptance-documentation
[run 36460415859](https://github.com/dynamicet/hallelujah-website/actions/runs/36460415859)
passed for exact head `a453d686834ebc981af0f43bb10c4c9337c1070d`.
[PR #76](https://github.com/dynamicet/hallelujah-website/pull/76) then merged as
`430ef0f29a7509f553377f9ce8ab9472c6180642`. Exact-main
[run 36462238838](https://github.com/dynamicet/hallelujah-website/actions/runs/36462238838)
passed for that merge commit, and [issue #10](https://github.com/dynamicet/hallelujah-website/issues/10)
was closed with the same evidence. This completes the focused correction closeout. All production,
publication and authentic-data gates below remain unchanged.
