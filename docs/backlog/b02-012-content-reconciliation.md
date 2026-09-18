# B02-012 — Controlled Content Reconciliation

**Lane / priority / phase:** CONTENT / P0 / Phase 1 preparation
**Status:** Done for controlled draft reconciliation; local T0 and hosted implementation T1 pass.
Final acceptance-documentation CI and checked merge/main closeout remain required; hospital disposition approval remains gated.

On 18 September 2026, Africa/Addis_Ababa, the client directed “start” after the proposed
controlled reconciliation execution. Responsible person and controlled review authority:
workspace identity `befikadusata` directing Codex in temporary Content Manager and QA roles.
Hospital domain owners remain unassigned; temporary delivery responsibility is not hospital approval.
B02-011 PR #53 merged as `2c50a3cf26524b2ebb6f1aef9fc2663ebcc9bb4f`; exact-main
[run 35279658953](https://github.com/dynamicet/hallelujah-website/actions/runs/35279658953)
passed. This direction permits the draft/withheld approach below while GOV-01, SEC-01 and
applicable hospital decisions remain unresolved.

## Outcome and allowed scope

Every available extracted record has a traceable proposed disposition, source fingerprint,
reason, review role, unresolved gates and linked defect/decision. Totals reconcile to the
available source bundle without pretending the unavailable 99-page raw response was reviewed.

Allowed changes: `docs/content-reconciliation/`, this execution brief, backlog/epic/evidence
documentation, `scripts/lib/content-reconciliation.mjs`, related root verification scripts and
the root package script entry. No application, CMS, database or public asset changes are needed.
Unrelated workspace edits must be preserved.

Sources are the 10 September extracted JSON bundle and inventory/review documents under
workspace `resources/`, captured byte-for-byte as explicitly unverified inert evidence inside
the private repository. Executable WordPress state/configuration, extraction scripts and remote
media are not copied. Source URLs and form destinations are never fetched or activated.

## Controlled acceptance

- One disposition per available clinician, service, supporting page, media usage, individual
  hospital-profile unit and extracted duplicate-profile alias. Parent records retain their
  complete nested content; aliases also have explicit merge proposals.
- Proposed dispositions use approve/correct/merge/omit/defer/reject vocabulary. This draft
  rejects `approve`, any hospital approval or authored canonical ID. Correct/merge/omit remain
  proposals; they do not supply replacement facts, an actual merge, redirect or migration.
- Profile-only clinicians, media and unconfirmed fields remain deferred. The legacy appointment
  endpoint is proposed for omission from application configuration while preserved as evidence.
- Extracted quality flags and known review-queue conflicts have explicit open issues, role owners,
  bidirectional source links and required decisions. Named hospital owners remain null.
- Byte fingerprints protect the captured files; record fingerprints bind dispositions to content.
  Missing/extra/duplicate records, invalid or cyclic merges, removed defects, forged approval,
  inventory mismatches and stale reports fail verification.
- Raw-page completeness, missing Dermatology source and missing launch policy/access content
  are recorded as gaps. No fortieth service, reviewed Amharic copy or invented policy is created.

This is an offline evidence/documentation workflow: viewport, focus, motion, no-JavaScript and
browser testing introduce no new UI cases. Existing application checks may be run as regression
evidence. BM benchmarks do not apply to inventory disposition.

## Verification and downstream boundary

Use the pinned Node.js 24.21.0 / pnpm 10.27.0 runtime:

```bash
pnpm content-reconciliation:check
pnpm format:check
pnpm links:check
pnpm backlog:check
pnpm lint
pnpm secrets:check --history
pnpm verify
git diff --check
```

The reconciliation check also runs meaningful negative cases and is part of `pnpm verify`.
After intentionally reviewed disposition changes, regenerate the deterministic summary with
`node scripts/check-content-reconciliation.mjs --write-report` (also updates the readable queue), then rerun the checks.
No dependency was introduced; package dependencies and the frozen lockfile are unchanged.

Evidence destination: [B02-012 execution evidence](evidence/B02-012-content-reconciliation-2026-09-18.md).
Reviewable result: [reconciliation guide](../content-reconciliation/README.md),
[dispositions](../content-reconciliation/dispositions.json),
[source manifest](../content-reconciliation/source-manifest.json) and
[report](../content-reconciliation/report.json).

GOV-01, SEC-01 and applicable SAFE/CARE/ACCESS/INST/APPT/BRAND/LANG decisions return before
authentic approval or migration. No import/export tooling, real collection, provider activation,
remote source request, route, production provisioning or publication is authorized here.
B02-013 depends on this ticket; the draft alone does not make authentic import work Ready.

Authoritative baseline: [Epic 02](epic-02-cms-content.md),
[content inventory](../../../resources/content-inventory.md),
[review queue](../../../resources/content-review.md), `G-014` in the
[requirements matrix](../requirements/requirements-matrix.md), and the
[working acceptance matrix](../validation/implementation-acceptance-matrix.md).

## Local review result

The 259-unit register, captured bundle, 20-issue review queue, deterministic report and integrity/
negative checks pass. Full `pnpm verify` passes with the existing pinned local asset Python
environment, including the 92-case shared-component, 52-case statement and 163-case media matrices.
History secret scan, original-workspace fingerprint comparison and diff checks pass.
The [evidence](evidence/B02-012-content-reconciliation-2026-09-18.md) retains the sandbox interruption
and missing-default-Python prerequisite failure alongside the passing configured retest.
No scoped implementation defect remains open. Controlled completion does not confer hospital
content acceptance or approval to start authentic import/migration.

## Closeout direction

On 18 September 2026, Africa/Addis_Ababa, `befikadusata` directed “close out B02-012” under
the same responsible and controlled acceptance identity. [Issue #54](https://github.com/dynamicet/hallelujah-website/issues/54)
tracks hosted exact-head verification, controlled acceptance and checked merge/main results.
[PR #55](https://github.com/dynamicet/hallelujah-website/pull/55) carries the controlled review.
No hospital disposition or migration approval is implied; the evidence boundary above remains active.

Hosted implementation [run 35340428619](https://github.com/dynamicet/hallelujah-website/actions/runs/35340428619)
passes full verification and clean reconstruction for exact commit
`24785783f93d9e5396f738525072ed467c728647`. B02-012 moves In review → **Done** for controlled
development under the same responsible and acceptance identity on 18 September 2026,
Africa/Addis_Ababa. The final acceptance-documentation head must repeat CI before merge;
issue #54 and PR #55 retain its matching SHA/run, merge and exact-main result. B02-013 is the next
candidate after successful closeout, subject to controlled-development readiness checks.
