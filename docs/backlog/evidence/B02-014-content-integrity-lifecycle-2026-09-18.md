# B02-014 — Content Integrity and Lifecycle Evidence

**Date / timezone:** 18 September 2026, Africa/Addis_Ababa  
**Target:** Synthetic local T0 and private hosted T1  
**Status:** Done for controlled development; final documentation CI and checked merge required

Client direction: “start” following the proposed B02-014 execution. Responsible person and
controlled review authority: `befikadusata` directing Codex in temporary QA/Content roles.
Dependencies B02-003–B02-013 are Done for controlled development. B02-013 PR #57 checked merge
`74ac57b28aee5f09e199834cf6d1aea6605489ae` has passing exact-main
[run 35362650228](https://github.com/dynamicet/hallelujah-website/actions/runs/35362650228).
The [execution brief](../b02-014-content-integrity-lifecycle.md) records the scope and working
B00-016/DEL-01 boundary. Benchmark application is inapplicable: internal evidence only.
Tracking: [issue #58](https://github.com/dynamicet/hallelujah-website/issues/58).

Sanitized results inherit the repository B00-015 working evidence baseline. No real hospital
contact, patient data, signed approval or restricted security artifact is generated.
## Implemented coverage

| Acceptance area | New cross-model cases / supporting suite |
| --- | --- |
| Governance fields and all kinds | INT-001 plus nine INT-governance cases; existing governed-record/workflow suites |
| Canonical uniqueness and relationships | INT-002/003/014; existing care, clinician, service and transfer suites |
| Contacts and dependencies | INT-004–010, INT-017; real settings/discovery persistence in the complete CMS database suite |
| Endpoint/claim expiry and both affiliation paths | INT-011–013 plus six isolated endpoint/date cases; existing authenticated care database suite |
| Metadata, missing translation, redirects and safe serialization | INT-015/016/018–020/025 plus three invalid successor cases; existing XML and loopback HTTP discovery suite |
| Asset rights, scope, expiry and consent withdrawal | INT-021–023 plus six rights/date cases; existing byte, derivative, attachment/reference and sweep database coverage |
| Default publication/collection boundary | INT-010/024; existing runtime/environment and built boundary suites |
| Deployable artifact isolation | 26 parser/trace/payload/binary controls; source inspection, route/server output traces, server/client/static/public payloads and 82 synthetic evidence-asset fingerprints |

The pure asset receipt in the new suite is explicitly synthetic and does not perform intake or
claim malware clearance. The existing asset byte/store and authenticated PostgreSQL suite
independently cover real derivative cleanup, reference eviction and temporal sweeps.

Reports: [integrity report](b02-014-artifacts/integrity-report.json) and
[build report](b02-014-artifacts/build-report.json). The fixed clock is 18 September 2026,
12:00 UTC for authoring and 12:02 UTC for consumption. Fifty named cross-model cases pass.
Build controls pass; current local output inspection finds zero fixture leakage. Lint,
typecheck, format, local links, diff and reachable-history secret checks pass. The dependency
audit passes with 650 dependencies and zero moderate/high/critical known vulnerabilities.

## Environment failures and retests

The default shell selected Node.js 25.2.1. All execution checks explicitly select the installed
pinned Node.js 24.21.0 and pnpm 10.27.0; global runtime settings are not changed.
The first sandbox dependency audit did not receive a complete registry report; its unrestricted
retest passes. Initial full verification stalled in the existing discovery loopback HTTP check;
a 20-second scoped sandbox retry timed out. The original run was stopped, and full verification
was repeated outside the network sandbox and passes. The complete browser evidence includes
92 component, 52 policy and 163 asset cases; runtime, accessibility and performance-budget
smokes also pass. PostgreSQL could not start within the sandbox; the unrestricted disposable
integration retest passes in full, including independent database roles, all model persistence,
concurrency/rollback/revocation, real elapsed lifecycle boundaries, content-transfer CLI,
asset attachment/reference eviction and derivative sweeps. The test server stops and its
temporary database is removed. These initial failures remain environment failures, not
passing evidence. Clean reconstruction also passes with the same full lockfile hash
`b143b09bf35b897291553919a74247047f1b6529da0d759642ca6aa4290652bd` and workspace importer hash
`72df5c767c10664a290292b262c772a238c6bb287cb3a5622fa2e4c2095f1815`.
It repeats full verification, including the new content and build checks and all browser matrices.

## Local review promotion

On 18 September 2026, Africa/Addis_Ababa, B02-014 moves In progress → **In review** under
the same responsible/review person `befikadusata` directing Codex in temporary QA/Content roles.
Dependencies and synthetic local/private hosted targets remain as recorded above. Focused
cases/controls, full repository verification, complete PostgreSQL integration, frozen clean
reconstruction, lint/types, history secret scan, dependency audit and documentation/diff checks
pass. Three pre-existing browser capture files changed during full verification; only those
generated changes were restored from the initially clean HEAD. The B02-014 reports remain.
No scoped implementation defect remains open. Hosted exact-head T1 and client controlled
acceptance remain required; issue #58 retains the reviewed SHA, PR and run pointers.
Formal DEL-01, hospital decisions, authentic content/migration, professional language approval,
providers, collection, remote provisioning, production and publication remain gated.

## Controlled acceptance and closeout

On 18 September 2026, 23:26 Africa/Addis_Ababa, the client directed “close it”. B02-014
moves In review → **Done** for controlled development. Responsible and acceptance person:
workspace identity `befikadusata` directing Codex in temporary QA/Content roles. Dependencies
B02-003–B02-013 are Done; synthetic local T0 and private hosted T1 remain the target.

Hosted implementation [run 35390517090](https://github.com/dynamicet/hallelujah-website/actions/runs/35390517090)
passes every quality/security step, full repository verification and independent clean
reconstruction for exact commit `d2942da68fcd082cf5c5c4e6abff6737da62c830` under
[PR #59](https://github.com/dynamicet/hallelujah-website/pull/59). All recorded local gates pass;
no scoped implementation defect remains open. This client direction supplies controlled
acceptance only; formal DEL-01 and all authentic-content and production gates remain open.

Final acceptance-documentation CI must pass for its exact SHA before checked merge. The
matching documentation SHA/run, merge SHA and exact-main result must be retained in
[issue #58](https://github.com/dynamicet/hallelujah-website/issues/58) and PR #59. Dependent
execution waits for passing exact-main CI. B03-004 Home hierarchy is the next implementation
candidate, subject to controlled-development readiness checks; no public route is authorized
by this closeout.
