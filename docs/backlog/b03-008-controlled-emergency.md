# B03-008 — Controlled Server-Rendered Emergency Page

**Lane / priority / phase:** DELIVERY / P0 / Phase 1 preparation
**Status:** Done for controlled development; final closeout CI and checked merge tracked below
**Tracking:** [issue #66](https://github.com/dynamicet/hallelujah-website/issues/66)
**Review:** [PR #67](https://github.com/dynamicet/hallelujah-website/pull/67)
**Publication and emergency-use authority:** Not granted

On 22 September 2026, Africa/Addis_Ababa, the client directed a controlled-development
implementation using placeholders that remain explicitly flagged in the backlog and documentation.
`befikadusata` directs Codex in temporary Frontend/Operations-contract/Clinical-contract/QA roles
and is the controlled-development review authority. This direction supplies execution authority for
synthetic local T0/private hosted T1 only; it is not hospital safety approval or final acceptance.

The preceding B03-006 PR #65 merged as `0ef397aafce6c4809b597656394aebf00c22e713`, and exact-main
[run 35432845708](https://github.com/dynamicet/hallelujah-website/actions/runs/35432845708)
passed. B01-005, B02-003 and the reusable shell/foundation contracts are Done. B03-007 remains
independently gated and is not a dependency of this controlled pull.

## Controlled sequencing exception

The canonical B03-008 dependencies B03-001–B03-003 and SAFE-01–SAFE-04 remain open. The exception
permits only a loopback-only, noindex Emergency E0–E8 composition using visibly synthetic and
deliberately invalid fixtures for:

- B03-001 contact purposes and route values;
- B03-002 hospital/public distinction, limitations, warning and scope;
- B03-003 address, entrance, landmark directions, transport, parking and accessible arrival.

Every specimen value is inert. The controlled preview creates no `tel:` or `mailto:` target, map,
coordinates, geolocation, external link, provider request, form, personal-data input, authentic
clinical/operational statement or public application route. The deployable application remains the
existing controlled bootstrap and imports no Emergency fixture or preview module.

This exception does not satisfy or close B03-001–B03-003, SAFE-01–SAFE-04, LANG-01, SEC-02 or
DEL-01. Authentic approved records must replace the fixtures, and live call/dialer behavior must be
tested under B03-009/B03-010 before `/emergency/` may be mounted or published.

## Implementation scope

- A reusable server-rendered Emergency template preserving E1–E8 source order inside the existing
  E0 global shell.
- Permanent Level 0 treatment: no animation, entrance choreography, pulse, countdown, autofocus,
  autoscroll, sticky takeover, media or critical runtime fetch.
- Two separated inert route-choice specimens whose surrounding cards and displayed values cannot
  activate a call.
- Static route distinction and online-contact warning before clinical scope and arrival content.
- Text-first synthetic entrance, directions and access information before a static map-withheld
  boundary.
- A loopback-only preview with strict no-store/noindex/CSP headers and controlled/long-content states.
- Static SSR/escaping/isolation checks plus responsive browser, accessibility-tree, keyboard,
  no-JS/no-CSS, 200% text, forced-colors, reduced-motion and print checks.

Allowed files are the Emergency template/style/export, loopback fixture/renderer/server, Emergency
checks and package commands, and backlog/architecture/evidence documentation. No new dependency,
CMS/database write, public route, provider, collection, migration, provisioning or publication is
authorized.

## Controlled acceptance contract

| Area | Required controlled result |
| --- | --- |
| E0/E1 shell and first choice | One H1, current Emergency navigation, explicit synthetic boundary and two separated inert choices; no call target exists. |
| E2/E3 distinction and warning | Both fictional routes expose audience/purpose/limits/hours; static warning is in source order and is not injected as an assertive alert. |
| E4 scope | Availability, limitations, fixture owner and review date are visible without capability inference. |
| E5/E6 arrival | Synthetic address, entrance, three landmark steps, vehicle/parking, transport and accessible-entry placeholders remain selectable without JS/CSS. |
| E7 map | Text stays complete; no map canvas, coordinate, provider, external link or request exists. |
| E8 support | Non-emergency purpose is explicit; no contact action or collection is enabled. |
| Safety/isolation | No authentic number or source candidate, `tel:`, `mailto:`, form, media, provider request or public route appears. Fixtures remain outside application source/build imports. |
| Responsive/accessibility | E1–E8 heading/source order, skip link, 44 px interactive shell targets, 320/360/reflow, 200% text, forced colors, print and no-JS/no-CSS pass without content overflow. |

## Verification

Use pinned Node.js 24.21.0 and pnpm 10.27.0:

```sh
pnpm emergency:check
pnpm emergency:smoke
pnpm verify
pnpm rebuild:verify
pnpm audit:dependencies
pnpm secrets:check --history
git diff --check
```

Review locally with `pnpm emergency:preview` at `http://127.0.0.1:3215/`; the expanded wrapping
fixture is `/long-content`. These are review-tool paths, not hospital application routes.

Sources: [Epic scope](epic-03-critical-journeys.md#emergency-emergency-e0e8),
[Emergency page specification](../ux/page-specifications.md#2-emergency),
[Emergency wireframe](../wireframes/emergency.md), and
[controlled architecture](../architecture/emergency-page.md).

Hosted exact-head T1 and explicit controlled client acceptance are required before Done. Checked
merge and passing exact-main CI govern dependent execution. Hospital safety, language, real-device
dialer/arrival testing, authentic records, public routes, providers, production and publication
retain their gates.

## Local review result — 22 September 2026

B03-008 moves In progress → **In review** under the same responsible/review identity. Thirteen SSR
contract cases, 58 responsive/capability/accessibility/isolation browser cases, four sanitized and
visually reviewed captures, complete repository verification, optimized-build isolation, formatting,
links, backlog audit and diff checks pass. The
[execution evidence](evidence/B03-008-controlled-emergency-2026-09-22.md) retains the wrong-Node,
loopback-permission, corrected 200% definition-row reflow and missing-default-fontTools history.
Hosted exact-head T1 and controlled client acceptance remain required before Done. No authentic
safety content, public route, production or publication gate changes.

## Controlled acceptance — 23 September 2026

The client directed “Close out B03-008”. B03-008 moves In review → **Done** for controlled
development under `befikadusata` as responsible and controlled acceptance person, directing Codex
in temporary Frontend/Operations-contract/Clinical-contract/QA roles on 23 September 2026,
Africa/Addis_Ababa. Target remains synthetic local T0/private hosted T1 under the working B00-016
matrix. The controlled sequencing exception remains in force; B03-001–B03-003, SAFE-01–SAFE-04,
LANG-01, SEC-02 and formal DEL-01 remain unresolved.

All recorded local gates pass. Replacement exact-head hosted
[run 35783340838](https://github.com/dynamicet/hallelujah-website/actions/runs/35783340838)
passes every step, including complete verification and independent frozen clean reconstruction,
for `05900cd1994cdf5530ebf856db53db6f0a13fc78`. No scoped controlled-implementation defect remains
open. Final acceptance-documentation CI must pass for its exact SHA before checked merge of PR #67.
Issue #66 and PR #67 retain the matching SHA/run, merge SHA and exact-main result. Dependent
execution waits for passing exact-main CI; no successor ticket is promoted by this acceptance.

This closeout accepts only the inert, loopback-only controlled-development artifact. It does not
approve an authentic emergency number or safety statement, call activation, Amharic clinical
meaning, physical-device or on-site arrival behavior, `/emergency/`, a provider, production,
emergency use or publication. Those gates remain withheld for B03-001–B03-003, B03-009–B03-010
and their governing control records.
