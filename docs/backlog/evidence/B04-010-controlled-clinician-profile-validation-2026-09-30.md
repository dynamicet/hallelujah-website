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
| `pnpm rebuild:verify` | Pass from a fresh temporary copy and frozen lockfile after security remediation; lockfile graph `7ae05ad383cb734d68403151110c80a5e37c15ce4e403c784ccce6f140f777f3`, importer graph `2fb83f002b80a6efbc16ef014310132a2aeef1342849797942a0d583d7e315b0` |
| `pnpm audit:dependencies` | Pass: 650 dependencies; zero moderate, high or critical known vulnerabilities |
| `pnpm secrets:check --history` | Pass: 567 current text files plus reachable Git history; matches would be redacted |
| Hosted exact-head T1 | Pass: [run 36751207972](https://github.com/dynamicet/hallelujah-website/actions/runs/36751207972) completed every gate, including the live dependency audit and clean reconstruction, for exact review head `a9a8f8437e37c3a4fec697c101ce7cd6c6277230` under [PR #84](https://github.com/dynamicet/hallelujah-website/pull/84) |

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

Initial hosted implementation [run 36637389706](https://github.com/dynamicet/hallelujah-website/actions/runs/36637389706)
passed for `af457e4b951e2f225875541b8094a93d0b84e0c5`. While the evidence head was being
verified, the registry published advisories that made
[run 36681191386](https://github.com/dynamicet/hallelujah-website/actions/runs/36681191386)
fail closed with three moderate and four high findings in `fast-uri` and `brace-expansion`.
Exact scoped overrides moved those transitive lines to `fast-uri 3.1.8`,
`brace-expansion 1.1.21` and `brace-expansion 5.0.12`. Before that remediation head could pass,
the registry published the critical Next.js `GHSA-vcvr-r3jv-pc5j` advisory, so
[run 36744943907](https://github.com/dynamicet/hallelujah-website/actions/runs/36744943907)
also failed closed. Next.js and its matching ESLint config/toolchain pin moved from `16.3.5` to
`16.3.6`. Full local verification, the clean reconstruction and the zero-finding audit then passed;
[run 36751207972](https://github.com/dynamicet/hallelujah-website/actions/runs/36751207972)
passed every hosted gate for exact head `a9a8f8437e37c3a4fec697c101ce7cd6c6277230`.

## Local review result

On 30 September 2026, Africa/Addis_Ababa, B04-010 moves In progress → **In review** after every
focused, predecessor, full-repository, clean-reconstruction, dependency, history-secret and diff
gate above passed. Private hosted exact-head T1 then passed every gate in
[run 36751207972](https://github.com/dynamicet/hallelujah-website/actions/runs/36751207972)
for exact review head `a9a8f8437e37c3a4fec697c101ce7cd6c6277230` under
[PR #84](https://github.com/dynamicet/hallelujah-website/pull/84). Explicit client controlled
acceptance remains required before Done.

Human assistive-technology, authentic content, language, medical-staff, production and publication
acceptance remain open under `DEL-01` and the applicable CARE/APPT/LANG gates. Automated controlled
validation closes none of those dependencies.

## Controlled acceptance

The client directed “close it out” while B04-010 was In review. B04-010 moves In review →
**Done** for controlled validation under `befikadusata` as responsible and controlled acceptance
person, directing Codex in temporary QA, Accessibility-test and Content-contract roles on
30 September 2026, Africa/Addis_Ababa. The target remains synthetic English local T0/private
hosted T1 under the working B00-016 matrix.

Accepted validation head: `262b0582f8b2279fd6a58cdebbd50b7307bdbc09`. Matching hosted
[run 36754859509](https://github.com/dynamicet/hallelujah-website/actions/runs/36754859509)
passes every step, including the focused static and rendered validation suites, predecessor
contracts, optimized-build isolation, history secret scan, dependency audit, full repository
verification and independent frozen clean reconstruction. All recorded local gates pass and no
scoped controlled-validation defect remains open.

Final acceptance-documentation CI must pass for its exact SHA before checked merge of
[PR #84](https://github.com/dynamicet/hallelujah-website/pull/84). Its matching SHA/run, merge SHA
and exact-main result must be retained in [issue #83](https://github.com/dynamicet/hallelujah-website/issues/83)
and PR #84. Dependent execution waits for passing exact-main CI. B04-011 is not promoted by this
acceptance.

`DEL-01`, B04-001–B04-003, B04-006, CARE-01–CARE-03, CARE-06, APPT-01 and LANG-01/LANG-02 remain
unresolved. Authentic clinicians or claims, portraits, schedules, availability, staffed contact,
active appointment actions, public routes, providers, named human acceptance, production and
publication remain gated; controlled acceptance closes none of those dependencies or release
gates.

Acceptance-documentation
[run 36767977642](https://github.com/dynamicet/hallelujah-website/actions/runs/36767977642)
failed closed at the live dependency audit after the registry published low-severity DOMPurify
`GHSA-p98j-92pf-mc4p` against the prior `3.4.15` override. The exact override moves to patched
`3.4.16`; no application surface or public route is added. A new exact-head hosted pass remains
required before merge.
