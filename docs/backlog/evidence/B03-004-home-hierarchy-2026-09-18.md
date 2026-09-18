# B03-004 — Controlled Home Hierarchy Evidence

**Status:** In review; local T0 and frozen reconstruction pass; acceptance remains pending.
**Target:** Isolated local T0; private hosted exact-head T1 required.
**Responsible/review person:** `befikadusata` directing Codex in temporary Frontend/Product/QA roles.

The client directed “start” following the proposed B03-004 Home hierarchy on 18 September 2026,
Africa/Addis_Ababa. B02-014 checked merge `baaa1be922442a657b027f6fa4ea909d61f45ec5` has passing
exact-main [run 35392349389](https://github.com/dynamicet/hallelujah-website/actions/runs/35392349389).
The [execution brief](../b03-004-home-hierarchy.md) governs scoped implementation and controlled
readiness. No authentic content, translations, hospital media, contacts, providers or collection
is included.

## Environment failures

The workspace makes `.git` read-only; creating the scoped branch required authorized execution
outside that filesystem sandbox. The initial Node SSR adapter exposed extensionless Next package
imports; the local adapter resolves the real `next/link.js` and `next/image.js`, preserving
application imports and behavior. The sandbox blocked loopback binding and the initial HTTP
read; authorized unrestricted local preview/read retests pass. These failures are retained,
not treated as successful test results.

The responsive matrix first passed 160 composition/capability cases. Follow-up checks corrected
test-driver handling of print-hidden controls, complete native Enter key events, distinct history
destinations and an HTTP Host override (Node fetch does not preserve that override). Native video
controls also expose inline image events through CDP; only `data:image/` events are exempted from
the exact loopback request assertion, consistent with existing component-review checks.
No external connection is permitted. Those failed driver runs remain failed evidence.

The focused activation check found a scoped defect: showing Stop increased the 320 px media
frame and moved H2 by 52 CSS px. Home's colocated stylesheet now reserves the hidden Stop
control's footprint; poster/playing geometry and task positions match in the focused retest.
The no-JavaScript variant explicitly explains that the still/transcript remain available and
playback requires JavaScript. Full final matrix results remain pending below.

Tracking: [issue #60](https://github.com/dynamicet/hallelujah-website/issues/60).

## Verification result

On 19 September 2026, Africa/Addis_Ababa, the final focused matrix passes:

| Check | Expected / actual |
| --- | --- |
| `pnpm home:check` | 14 controlled SSR/omission/safety/escaping/token cases pass |
| `pnpm home:smoke --capture` | 160 state/viewport/capability cases plus five native menu/media lifecycle cases pass; six negative host/method/path/query controls pass |
| Responsive and progressive modes | 320/360/768/1440 CSS px, no-JS, reduced-motion, Save-Data, forced-colors, blocked images/fonts, print and 200% text pass; 320 CSS px also covers 1280 px at 400% zoom equivalent |
| Essential journeys | Skip focus and Emergency/Doctor/Service/Appointment/Call/Directions fragment activation pass natively across every composition/capability case |
| Media | Play/Pause/Resume/Stop/end, persistent focus, equal poster/playing frame and task geometry, failure fallback and distinct-route Back restoration pass |
| Data/asset boundary | No fields, real telephone link, provider, external connection or pre-intent video/caption request; record modules and absent H8 are omitted |
| Lint / types | `pnpm lint` and `pnpm typecheck` pass; full verification repeats these gates |
| Dependency / history checks | `pnpm audit:dependencies` passes for 650 dependencies with zero moderate/high/critical known vulnerabilities; `pnpm secrets:check --history` passes |

The [browser report](b03-004-artifacts/browser-report.json) retains case results and local metrics.
The [artifact index](b03-004-artifacts/README.md) identifies method, tester/date, expected/actual,
build basis and six sanitized captures. Mobile/desktop static and optional media captures were
visually reviewed. The preview's four initial requests total 15,866–16,276 compressed bytes,
with 1,404 compressed JavaScript bytes and zero initial media/poster-asset bytes. Activated
abstract test video is 1,196 bytes, plus 82 caption bytes, with two-second finite playback.
These are isolated preview measurements, not deployed Home or constrained-device LCP/INP
acceptance. No third-party runtime is used. The report retains local LCP/CLS/long-task samples
without claiming motion attribution, physical-device performance or release acceptance.

Full final repository verification passes on 19 September 2026, Africa/Addis_Ababa. It repeats
lint/types, all pure/schema/integrity suites, optimized build, 27 build-isolation controls,
runtime/security headers, asset budgets, 92 component/52 policy/163 asset browser cases and
the final 165-case Home matrix. Three generated pre-existing capture/PDF changes were restored
from the initially clean HEAD; only the B03-004 sanitized artifacts are retained in this pull.
Independent frozen clean reconstruction also passes every repository gate and the final Home
matrix. The complete lockfile hash remains
`b143b09bf35b897291553919a74247047f1b6529da0d759642ca6aa4290652bd`; workspace importer hash remains
`72df5c767c10664a290292b262c772a238c6bb287cb3a5622fa2e4c2095f1815`. No dependency drift occurs.
The earlier full verification failed only at the old Home request-driver assertion that counted native
inline image events as external connections; all preceding repository gates passed. It remains
failed evidence; the corrected final run passes. Hosted current-head review and
controlled client acceptance are pending.

## Local review promotion — 19 September 2026

B03-004 moves In progress → **In review** under `befikadusata` directing Codex in temporary
Frontend/Product/QA roles, with the same identity as controlled-development review authority.
Dependencies and the isolated T0/private hosted T1 boundary remain as recorded in the brief.
All scoped and full local checks pass; no scoped implementation defect remains open.
[Issue #60](https://github.com/dynamicet/hallelujah-website/issues/60) retains the implementation
SHA, draft PR and hosted current-head review pointers. Hosted exact-head T1 and controlled
client acceptance remain required before Done. Checked merge and passing exact-main CI remain
required before dependent execution. No acceptance, merge or release is claimed.
Hospital approval, authentic routes/content, real contacts, language/media approval, providers,
collection, migration, remote provisioning, production and publication remain gated.
