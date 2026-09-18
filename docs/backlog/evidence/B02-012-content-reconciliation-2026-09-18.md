# B02-012 — Controlled Reconciliation Evidence

**Date / timezone:** 18 September 2026 / Africa/Addis_Ababa
**Target:** Private local T0 passes; controlled client acceptance, hospital content acceptance and hosted T1 remain pending.
**Responsible / controlled reviewer:** `befikadusata` directing Codex in temporary Content Manager and QA roles.
**Base:** `2c50a3cf26524b2ebb6f1aef9fc2663ebcc9bb4f`, B02-011 PR #53 merge; exact-main
[run 35279658953](https://github.com/dynamicet/hallelujah-website/actions/runs/35279658953) passed.
**Working branch:** `b02-012-content-reconciliation`.

## Measured result

The [source manifest](../../content-reconciliation/source-manifest.json) records byte-identical
copies of the six available extracted JSON files and three source guides. The
[disposition register](../../content-reconciliation/dispositions.json) covers 259 units;
the [deterministic report](../../content-reconciliation/report.json) shows zero unaccounted units,
38 correction proposals, one duplicate-profile merge proposal, one legacy-endpoint omission
proposal and 219 deferrals. All approvals, named hospital owners and canonical IDs remain absent.

Twenty open issues assign review roles and explicit decisions for extracted flags, schedule
conventions, contacts, mission, duplicate cards, copied clinical text, missing Dermatology source,
raw extraction coverage, clinical claims, media clearance, missing launch guidance,
appointment operations/privacy and Phase 2 Careers.
The missing raw response prevents verification of the metadata's 99 original pages; this is
retained as a gap, not represented as reconciled raw-page coverage.

## Verification

Initial focused checks pass: deterministic report generation, register reconciliation and negative
cases rejecting missing/duplicate/extra records, stale source content, invented approval/IDs/owners,
invalid gates and merge targets, removed flags/issues, unconfirmed profile/media promotion,
metadata-count drift, source byte tampering and an incomplete manifest.

| Check | Expected / actual |
| --- | --- |
| `pnpm content-reconciliation:check` | Pass: all 259 units covered, no approved records, source fingerprints and report/queue parity; corruption/approval/merge/defect/inventory negatives reject |
| Independent SHA-256 comparison to original workspace files | Pass: all nine captured files match the original extracted bundle/guides |
| `pnpm format:check`, `pnpm links:check`, `pnpm backlog:check` | Pass: formatting, local references and all ten backlog integrity assertions |
| `pnpm lint` and `pnpm typecheck` | Pass: lint and TypeScript checks; no application source changes |
| `pnpm secrets:check --history` | Pass: current evidence/source and reachable Git history; matched values would be redacted |
| Configured `pnpm verify` | Pass, exit 0: full policy, source, tests, asset formats, build, semantic accessibility, budgets, runtime and browser checks; includes 92 shared-component, 52 statement and 163 media cases |
| `git diff --check` | Pass: no whitespace defects |

Runtime: Node.js 24.21.0 and pnpm 10.27.0. The successful full regression command uses the
previous ticket's existing isolated Python environment (fontTools 4.65.0 / Brotli 1.2.0):

```bash
PATH=/home/befikadusata/.nvm/versions/node/v24.21.0/bin:$PATH \
ASSET_FORMAT_PYTHON=/var/tmp/hallelujah-b02-011-tools/python/bin/python \
PYTHONDONTWRITEBYTECODE=1 pnpm verify
```

The initial sandbox run was interrupted after stalling at the existing loopback discovery HTTP
test; a permitted run outside the sandbox passed that test but then failed because default
`python3` lacked `fontTools`. No assertions or runtime behavior were changed. Repeating with
the existing pinned Python environment passed the entire suite. These are retained as environment/
prerequisite failures, not hidden successful runs. No scoped implementation defect remains open.
The unchanged hosted workflow already installs the pinned Python requirements and sets
`ASSET_FORMAT_PYTHON`; hosted exact-head verification still must run independently.

Verification identifies the local branch working tree based on the merge SHA above. No new
commit, pushed branch, issue, PR or hosted pass is claimed by this local execution evidence.

No new dependency, application code, database mutation, public fixture, fetched source/media,
provider request or personal-data intake is introduced. Source forms/URLs remain inert evidence.
No UI change requires new visual or bilingual browser evidence.

## Acceptance boundary

Controlled draft preparation does not close GOV-01, SEC-01 or SAFE/CARE/ACCESS/INST/APPT/BRAND/LANG
decisions. Hospital content/domain acceptance, named review ownership, authentic policy/facts,
reviewed translations, actual import/export or migration, redirects, production and publication
remain gated. Client acceptance and hosted exact-head CI are separate closeout evidence.
