# B04-008 Controlled Clinician-Directory Validation Evidence — 29 September 2026

| Field | Result |
| --- | --- |
| Branch | `b04-008-clinician-directory-validation` |
| Scope | Synthetic English loopback T0/private T1 validation only |
| Status | Done for controlled validation; final documentation CI and checked merge required |
| Tracking | [issue #79](https://github.com/dynamicet/hallelujah-website/issues/79) · [PR #80](https://github.com/dynamicet/hallelujah-website/pull/80) |
| Public route | Absent; no `/doctors/` route is authorized |
| Production/publication authority | Not granted |

## Focused evidence

| Check | Current result |
| --- | --- |
| `pnpm clinician-directory:validate` | Pass: 24 relevance, URL, lifecycle, canonicality, semantics and resilience cases |
| `pnpm clinician-directory:validate:smoke` | Pass: 12 native-history, keyboard, browser accessibility-tree, 320/360 reflow and fail-closed resilience cases |
| URL/history | Pass: native GET query/filter submissions, deep link, reset, Back and Forward restore URL-authoritative controls |
| Accessibility | Pass: keyboard disclosure/filter/search operation and one status node with one count in Chromium's accessibility tree |
| Lifecycle/canonicality | Pass: nine unique synthetic IDs/paths across pagination; retired and review/expiry-ineligible records are excluded |
| Isolation | Pass: loopback-only browser requests; noindex/no-store response contract retained |
| `pnpm clinician-directory:check` | Pass: predecessor 18-case projection/query/SSR/isolation contract |
| `pnpm clinician-directory:smoke` | Pass: predecessor 142-case responsive/capability/GET-state browser matrix |
| `pnpm search-controls:check`, lint, typecheck and format | Pass |
| `pnpm verify` | Pass: full repository gate, optimized build and absence of a deployable `/doctors/` route |
| `pnpm rebuild:verify` | Pass from a fresh temporary copy and frozen lockfile; lockfile graph `4087343a2a551525c7658e758d82063f9f3167dc9dddc425a4d80a14ee1b0db3`, importer graph `335e58984a447fd383e00d86b2d3579b39c1d26df9f14be8b32201440ad130f3` |
| `pnpm audit:dependencies` | Pass: 650 dependencies; zero moderate, high or critical known vulnerabilities |
| `pnpm secrets:check --history` | Pass: current text files plus reachable Git history; matches would be redacted |
| `git diff --check` | Pass |
| Hosted implementation T1 | Pass: [run 36572857997](https://github.com/dynamicet/hallelujah-website/actions/runs/36572857997) completed every gate for review head `ce8088db89c139b92d254351cd461fc6928f4a0c` |

## Defect found and corrected

The first rendered validation attempt proved that Back navigation restored a mutated checkbox from
Chromium's page state while the URL no longer contained that filter. The directory preview had not
loaded the existing first-party `search-controls.js` enhancement that restores server/URL state on
`pageshow`. The scoped correction loads that already-governed local script and includes its bytes
and request in preview metrics. The unchanged Back/Forward case then passed. No public route or new
client dependency was introduced.

The initial accessibility-tree assertion expected the status node itself to own the visible count
as its accessible name. Chromium correctly exposes the count on the status node's text child. The
assertion was aligned with that browser structure while retaining the required one-status/one-count
proof; the product markup did not change for this correction.

## Local review result

On 29 September 2026, Africa/Addis_Ababa, B04-008 moves In progress → **In review** after every
focused and full local gate above passed. Hosted implementation
[run 36572857997](https://github.com/dynamicet/hallelujah-website/actions/runs/36572857997)
subsequently passed for review head `ce8088db89c139b92d254351cd461fc6928f4a0c`, including the full
repository gate, appointment isolation and frozen clean reconstruction. Explicit client acceptance,
final acceptance-documentation CI and checked merge are required before Done.

Human assistive-technology, authentic relevance/content, language, medical-staff, production and
publication acceptance remain open under `DEL-01` and the applicable CARE/SEARCH/LANG gates.

## Controlled acceptance

The client directed “B04-008 is In Review, close it out”. B04-008 moves In review → **Done** for
controlled validation under `befikadusata` as responsible and controlled acceptance person,
directing Codex in temporary QA, Accessibility-test and Content-contract roles on 29 September
2026, Africa/Addis_Ababa. The target remains synthetic local T0/private hosted T1 under the working
B00-016 matrix.

Accepted implementation head: `ce8088db89c139b92d254351cd461fc6928f4a0c`. Matching hosted
[run 36572857997](https://github.com/dynamicet/hallelujah-website/actions/runs/36572857997)
passes every step, including the predecessor and validation matrices, optimized-build isolation,
history secret scan, dependency audit, full repository verification and independent frozen clean
reconstruction. All recorded local gates pass and no scoped controlled-validation defect remains
open.

Final acceptance-documentation CI must pass for its exact SHA before checked merge of
[PR #80](https://github.com/dynamicet/hallelujah-website/pull/80). Its matching SHA/run, merge SHA
and exact-main result must be retained in [issue #79](https://github.com/dynamicet/hallelujah-website/issues/79)
and PR #80. Dependent execution waits for passing exact-main CI. B04-009 is not promoted by this
acceptance.

`DEL-01`, B04-001, B04-002, CARE-01, CARE-02, SEARCH-01 and LANG-01 remain unresolved. Named human
assistive-technology/content acceptance, authentic relevance and clinician data, public routes,
profiles, providers, production and publication remain gated; controlled acceptance closes none of
those dependencies or release gates.
