# `B02-004` Governed Clinician Evidence

**Date/environment:** 16 September 2026, Africa/Addis_Ababa; local controlled development T0.
**Responsible/review identity:** `befikadusata` directing Codex in temporary Backend/CMS,
Medical-contract and QA roles; same identity as controlled-development review authority.
**Status:** Proposed → Ready → In progress → In review → Done for controlled development; client acceptance recorded on 16 September 2026, Africa/Addis_Ababa. Final closeout CI and merge results are tracked in PR #37.
**Branch/tracker:** `b02-004-governed-clinician-records`; [issue #36](https://github.com/dynamicet/hallelujah-website/issues/36).

## Boundary and method

Client instruction: “start B02-004”, following the proposed synthetic-only scope.
Dependencies `B02-001`–`B02-003` are Done; PR #35 merge `46afd419cb00125f6953e3aa5d42c467c2ff0aa3`
has passing exact-main CI run 35096707152. The [execution brief](../b02-004-governed-clinician-records.md)
governs local fixtures, schema/medical-review negatives, canonical/lifecycle projection and
disposable PostgreSQL integration. No actual hospital roster, claims, images, credentials,
tokens or schedule is used. Public/production/collection/provider gates remain unresolved.

## Verification

Pinned Node.js 24.21.0, pnpm 10.27.0, PostgreSQL 18.6 and direct Chrome for Testing
151.0.7922.34 were used. Full verification ran with isolated temporary storage under
`/var/tmp/hallelujah-b02-004-verify.uQgQmn` (the actual command log remains local).
Database integration used a fresh disposable cluster under a `/var/tmp/hallelujah-b02-004-db.*`
root and a separately generated `/var/tmp/hallelujah-b02-001-pg.*` socket directory, port 55484.
The server had no TCP listener and stopped through the exit trap. Fixture identities logged in
using in-memory random credentials/tokens without recording them. Both database roles were
non-superuser with separate content/appointment databases; only synthetic marker data was used.

| Command / method | Expected and actual result |
| --- | --- |
| `pnpm clinicians:check` | Pass: required/optional/unsupported-field schema, matching canonical names, roster and medical review, schedule/appointment denials, governed portrait dates, duplicates, location kind/currentness, identity/audit preservation, canonical/public/lifecycle/redirect negatives, bilingual omission and escaped inert render |
| `pnpm governed-records:check`, `pnpm cms-workflow:check`, `pnpm site-settings:check` | Pass: inherited record, role/revision/workflow and contact-safety contracts |
| `pnpm governed-records:db-smoke` | Pass: fresh authenticated PostgreSQL clinician persistence; immutable/duplicate identity; wrong/revoked medical role and changed-credential publication denial; withheld schedule; stable canonical appointment ID; pending-successor denial; approved successor retirement; immutable audit/public ID and deletion denial; inherited concurrency, timed lifecycle and settings tests |
| `pnpm local-db-isolation:check` | Pass: both local roles read their synthetic marker; cross-role reads/mutations reject and no network listener exists |
| `pnpm verify` | Pass: pinned toolchain, format, CI policy/negative controls, links, secrets, backlog, brand, introduction gates, lint, types, tests, build, semantic accessibility, budgets, runtime, harness and all shared responsive/resilience checks |
| Browser matrix | Pass: 92 bilingual language/capability/viewport and media/history cases, all shared interactions, foundation/action checks, governed-card responsive/no-JavaScript/print/forced-colors checks and optional-map zero-activation/external-request checks |
| `pnpm secrets:check --history` | Pass: 333 current text files and reachable history; potential matches redact values |
| `pnpm audit:dependencies` | Pass: 650 dependencies, zero moderate/high/critical known vulnerabilities |
| `git diff --check` | Pass |

The build retains only bootstrap, not-found and health routes. Initial runtime: 146077
compressed JavaScript bytes, 183162 initial compressed bytes, 15 requests, zero external origins.
No clinician/Amharic route, CMS admin/API or fetching behavior was introduced. The new inert
specimen is validated through static semantic rendering, including mixed-language notices and
escaping. It has no interactive or motion behavior; shared browser checks cover the existing
interactive components. Missing optional fields create no empty labels; portraits/schedules/
appointment actions never render.

These are implementation and controlled fixture tests, not professional language review,
real-roster approval, HTTP lifecycle integration or production infrastructure certification.


## Defects and retests

- The initial negative successor test found an attempted append to a frozen set-validation
  result. Copying that immutable result before adding collection-specific issues fixes the
  rejection path; focused and full checks passed after correction.

- The default shell selected Node.js 25.2.1 for later commands when PATH was scoped only
  to the first invocation. Exporting the pinned PATH for the full command session restored
  the required 24.21.0 baseline; all recorded successful checks used that baseline.
- The sandbox mount quota prevented further commands and /tmp quota prevented PostgreSQL
  socket lock creation before startup. Approved execution outside the sandbox with isolated
  /var/tmp storage succeeded. Harness guards accept only disposable named directories under
  /tmp or /var/tmp, reject supplied credentials and require local no-network listener evidence.
- The first successful socket startup included a synthetic content marker table before Payload
  initialization, triggering an interactive rename/create question. That smoke process was
  stopped and its cluster shut down; a fresh CMS database was initialized before marker tables.
  The fresh integration and repeated role-isolation checks passed; no table was renamed or
  destructive migration performed.

No open local implementation defect remains. No check or publication gate was weakened.

## Acceptance boundary

The client directed “close it” on 16 September 2026, Africa/Addis_Ababa. Workspace identity
`befikadusata`, under the same temporary Backend/CMS, Medical-contract and QA responsibility
and controlled-development review authority, accepts the implemented synthetic local scope.
This direction promotes In review → Done for controlled development only. No implementation
defect remains open.

Hosted implementation [run 35105320640](https://github.com/dynamicet/hallelujah-website/actions/runs/35105320640)
passed full verification and clean reconstruction for exact head
`c42c44784ec0518be0a9b3688eb2e0fe162305d1`. The acceptance-documentation head must repeat
CI before merge. [Issue #36](https://github.com/dynamicet/hallelujah-website/issues/36) and
[PR #37](https://github.com/dynamicet/hallelujah-website/pull/37) retain the final matching
SHA/run, merge and exact-main result; this record does not claim a merge before it occurs.
Formal `CARE-01`–`CARE-03`, hospital medical ownership, authentic content, asset intake,
CMS/public routes, appointments, production and publication remain gated.
