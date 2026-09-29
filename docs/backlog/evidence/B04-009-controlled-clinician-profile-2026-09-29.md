# B04-009 Controlled Clinician Profile Evidence — 29 September 2026

## Boundary

This evidence covers only the synthetic English, loopback-only/noindex B04-009 composition. It is
not evidence of an authentic clinician roster, medical review, portrait rights, schedules,
availability, staffed contact, appointment activation, translation approval, production readiness
or publication authority.

## Implemented result

- One controlled projection composes the existing governed clinician index and approved synthetic
  care graph without changing their authentic-data default deny.
- The server-rendered P0–P7 template covers canonical synthetic identity, specialty and optional
  professional details, neutral portrait omission, relationship-gated location/service context,
  inert stable-ID continuity, review metadata and truthful recovery.
- Partial records omit interests, credentials, languages, locations and related services without
  empty headings. Governed portrait metadata still produces no image or likeness.
- Missing/unapproved records return the controlled 404 presentation, retired records return 410,
  a genuine synthetic successor produces one bounded loopback redirect, and route failure returns
  503 without stale details.
- No public `/doctors/{doctor-slug}/` route, form, API, provider, personal-data field, callable
  contact, schedule, availability statement or active appointment link exists.

## Local verification

The required Node.js 24.21.0 and pnpm 10.27.0 baseline was used. Asset checks used the existing
repository-pinned disposable Python environment with fontTools 4.65.0 and Brotli 1.2.0.

| Check | Result |
| --- | --- |
| `pnpm clinician-profile:check` | Pass: 29 projection, omission, lifecycle, SSR, isolation, escaping and response-policy cases |
| `pnpm clinician-profile:smoke` | Pass: 128 responsive/capability/omission/isolation browser cases across 320/360 px, default, no JavaScript, reduced motion, forced colors, print, 200% text and no CSS |
| Clinician, care-relationship and B04-007/B04-008 predecessor suites | Pass |
| `pnpm verify` | Pass: full configured repository gate, including optimized build and every rendered matrix |
| `pnpm rebuild:verify` | Pass: fresh frozen install and complete verification; lockfile graph SHA-256 `4087343a2a551525c7658e758d82063f9f3167dc9dddc425a4d80a14ee1b0db3`; importer graph SHA-256 `335e58984a447fd383e00d86b2d3579b39c1d26df9f14be8b32201440ad130f3` |
| `pnpm audit:dependencies` | Pass: 650 dependencies, zero moderate/high/critical known vulnerabilities |
| `pnpm secrets:check --history` | Pass: 561 current text files plus reachable Git history; matches would be redacted |
| Format, local links, backlog audit, lint, typecheck and `git diff --check` | Pass |

The first full verification attempt used system `python3`, which lacks the already pinned
`fontTools` prerequisite. It stopped at the existing asset-format suite before the build and
rendered gates. No source or assertion was changed to bypass it. The successful configured full
run and clean reconstruction selected the established `ASSET_FORMAT_PYTHON` environment and
passed the exact pinned-version checks.

## Defects exposed and corrected

1. The reserved portrait fallback combined a fixed minimum block size with its aspect ratio,
   causing horizontal overflow at 320 CSS px with 200% text. Its reserved block size is now capped
   by viewport width while retaining stable layout.
2. Failure-state shell links initially targeted detail sections intentionally absent from the
   fail-closed presentation. The shell now routes those links to the visible recovery boundary.
3. The controlled breadcrumb initially exposed a link smaller than the 44 CSS px touch target.
   Because no public directory route is authorized, the review breadcrumb now truthfully renders
   the current synthetic profile as non-interactive text.

All three corrected cases are covered by the passing browser matrix.

## Sanitized visual specimens

| Artifact | Scope | Bytes | SHA-256 |
| --- | --- | ---: | --- |
| [Controlled profile at 360 px](b04-009-artifacts/clinician-profile-controlled-360.png) | Full fictional P0–P7 composition; screenshot height is intentionally bounded | 118,352 | `6bfc807c281e3364134036797716141e91624f4a26df1c9aba170500781e790f` |
| [Partial profile at 1280 px](b04-009-artifacts/clinician-profile-partial-1280.png) | Optional-content and relationship omission | 168,531 | `106e1af76a34e404e1f4f3e94252f7ee14cd26f4e41bff548719e48f4dcdc261` |

Both images were inspected locally. They contain only synthetic content and no authentic person,
contact, location, portrait or hospital capability claim.

## Controlled acceptance

The client directed “B04-009 in review, close it out”. B04-009 moves In review → **Done** for
controlled development under `befikadusata` as responsible and controlled acceptance person,
directing Codex in temporary Frontend, Backend-contract and QA roles on 29 September 2026,
Africa/Addis_Ababa. The target remains synthetic local T0/private hosted T1 under the working
B00-016 matrix.

Accepted implementation head: `0ab75d464f5bffb4f4b1b2fc4acc1a5e37b1cd69`. Matching hosted
[run 36617331632](https://github.com/dynamicet/hallelujah-website/actions/runs/36617331632)
passes every step, including the focused profile and browser matrices, predecessor suites,
optimized-build isolation, history secret scan, dependency audit, full repository verification and
independent frozen clean reconstruction. All recorded local gates pass and no scoped controlled-
development defect remains open.

Final acceptance-documentation CI must pass for its exact SHA before checked merge of
[PR #82](https://github.com/dynamicet/hallelujah-website/pull/82). Its matching SHA/run, merge SHA
and exact-main result must be retained in [issue #81](https://github.com/dynamicet/hallelujah-website/issues/81)
and PR #82. Dependent execution waits for passing exact-main CI. B04-010 is not promoted by this
acceptance.

B04-001–B04-003, B04-006, CARE-01–CARE-03, CARE-06, APPT-01, LANG-01/LANG-02 and DEL-01 remain
unresolved. Authentic clinicians and claims, portraits, schedules, availability, staffed contact,
active appointment actions, public routes, providers, production and publication remain gated;
controlled acceptance closes none of those dependencies or release gates.
