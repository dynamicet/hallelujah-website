# B04-010 Controlled Clinician-Profile Validation Evidence — 30 September 2026

| Field | Result |
| --- | --- |
| Branch | `b04-010-clinician-profile-validation` |
| Scope | Synthetic English loopback T0/private T1 validation only |
| Status | In review; local T0 and hosted implementation T1 complete, explicit client acceptance pending |
| Tracking | [issue #83](https://github.com/dynamicet/hallelujah-website/issues/83) and [pull request #84](https://github.com/dynamicet/hallelujah-website/pull/84) |
| Public route | Absent; no `/doctors/{doctor-slug}/` route is authorized |
| Production/publication authority | Not granted |

## Focused evidence

| Check | Current result |
| --- | --- |
| `pnpm clinician-profile:validate` | Pass: 20 completeness, omission, lifecycle, relationship, withdrawal and isolation cases |
| `pnpm clinician-profile:validate:smoke` | Pass: 10 semantic, accessibility-tree, no-JavaScript, 320/360 reflow, print and fail-closed withdrawal cases |
| Multilingual-name shaping | Pass at 320/360 CSS px and 200% text with no horizontal overflow; fixture is explicitly unreviewed and makes no translation claim |
| Portrait/schedule boundary | Pass: stored synthetic portrait metadata and every schedule remain omitted; no image, source detail, availability claim or active action renders |
| Relationship lifecycle | Pass: missing, withdrawn and review-expired affiliations remove complete service/location output while the eligible profile remains available |
| Record withdrawal | Pass: profile and shared internal index withdraw exactly at review/expiry boundaries; retired records resolve to gone or one current successor without stale details |
| Appointment continuity | Pass: only the inert stable clinician public ID persists; no appointment URL, form or request is enabled |
| Isolation | Pass: every preview is loopback-only, no-store/noindex, zero external requests; optimized route inventory contains no `/doctors/` route |
| `pnpm clinician-profile:check` | Pass: 30 predecessor projection, omission, lifecycle, SSR, isolation, escaping and header cases |
| `pnpm clinician-profile:smoke` | Pass: 142 predecessor responsive/capability/omission/isolation cases |
| `pnpm clinicians:check`, `pnpm care-relationships:check` | Pass |
| Format, lint, typecheck and `git diff --check` | Pass |
| `pnpm verify` | Pass: complete configured repository gate, optimized build and all rendered matrices |
| `pnpm rebuild:verify` | Pass from a fresh temporary copy and frozen lockfile; lockfile graph `4087343a2a551525c7658e758d82063f9f3167dc9dddc425a4d80a14ee1b0db3`, importer graph `335e58984a447fd383e00d86b2d3579b39c1d26df9f14be8b32201440ad130f3` |
| `pnpm audit:dependencies` | Pass: 650 dependencies; zero moderate, high or critical known vulnerabilities |
| `pnpm secrets:check --history` | Pass: 567 current text files plus reachable Git history; matches would be redacted |
| Hosted implementation T1 | Pass: [run 36637389706](https://github.com/dynamicet/hallelujah-website/actions/runs/36637389706) completed every gate, including clean reconstruction, for exact implementation head `af457e4b951e2f225875541b8094a93d0b84e0c5` under [PR #84](https://github.com/dynamicet/hallelujah-website/pull/84) |

## Defects found and corrected

The first rendered validation assertion counted only the two profile-specific disabled actions.
The governed shell correctly exposes a third disabled control for the unavailable Amharic
alternative. The assertion now verifies the exact accessible text of all three controls. A print
isolation selector also initially used unquoted attribute-prefix values and was corrected before
the rendered suite passed. Neither correction changed product behavior.

The first full-gate attempt used system Python without the repository-pinned `fontTools`. The
successful configured and clean-rebuild runs selected the repository-supported disposable Python
environment with hash-locked `fontTools 4.65.0` and Brotli 1.2.0. The first configured full run
then exposed a missing root forwarding alias for the new app-level rendered validation command;
the alias was added and the complete configured gate subsequently passed end to end.

## Local review result

On 30 September 2026, Africa/Addis_Ababa, B04-010 moves In progress → **In review** after every
focused, predecessor, full-repository, clean-reconstruction, dependency, history-secret and diff
gate above passed. Private hosted implementation T1 then passed every gate in
[run 36637389706](https://github.com/dynamicet/hallelujah-website/actions/runs/36637389706)
for exact review head `af457e4b951e2f225875541b8094a93d0b84e0c5` under
[PR #84](https://github.com/dynamicet/hallelujah-website/pull/84). Explicit client controlled
acceptance remains required before Done.

Human assistive-technology, authentic content, language, medical-staff, production and publication
acceptance remain open under `DEL-01` and the applicable CARE/APPT/LANG gates. Automated controlled
validation closes none of those dependencies.
