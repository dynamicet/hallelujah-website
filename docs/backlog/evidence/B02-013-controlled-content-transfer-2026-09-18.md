# B02-013 — Controlled Content Transfer Evidence

**Date/timezone:** 18 September 2026, Africa/Addis_Ababa
**Responsible / review authority:** `befikadusata` directing Codex in temporary Backend/Content/QA roles
**Environment:** synthetic local T0; private hosted T1 pending
**Status:** In review; no controlled acceptance or hospital migration approval claimed

Tracking: [issue #56](https://github.com/dynamicet/hallelujah-website/issues/56) and
[draft PR #57](https://github.com/dynamicet/hallelujah-website/pull/57).

Client direction: “start” following the proposed B02-013 execution. B02-012 PR #55 merged as
`ba55eb145ee7308cee5c41408ce28058973ffc86`; exact-main
[run 35341982931](https://github.com/dynamicet/hallelujah-website/actions/runs/35341982931)
passed. The [execution brief](../b02-013-controlled-content-transfer.md) and
[architecture/runbook](../../architecture/content-transfer.md) define the controlled boundary.

## Evidence under execution

- Pure checks pass for deterministic dry runs, input immutability, unchanged repeat imports,
  update/explicit-merge behavior, forward references, new-reference cycles, duplicate IDs/slugs,
  invalid statuses, forged metadata, unsupported fields, author ownership and bilingual records.
  Existing clinician/service/settings fixtures pass their full governed validators.
- Initial TypeScript verification identified Payload create types requiring hook-generated fields;
  the adapter omits those fields at runtime, retains validation and uses a documented type boundary.
- Initial disposable PostgreSQL start was blocked inside the sandbox. The permitted socket-only
  rerun outside the sandbox is recorded separately from implementation checks below.
- Focused disposable PostgreSQL persistence passes: untouched dry run, idempotent repeat,
  ownership/merge, forward references, concurrent stale-plan denial, late-hook rollback with exact
  pre-batch IDs/approval/revision/audit and live identity revocation.
- Full application `pnpm verify` passes, exit 0, including build, accessibility/budgets/runtime,
  92 component-harness cases, 52 statement cases and 163 media cases. The initial sandbox run
  stalled at the existing loopback discovery check and was interrupted; the permitted rerun passes.
- The complete database smoke first identified an overlap with existing care fixture suffixes;
  transfer specimens now use distinct 1301–1305 suffixes. CLI tests then exposed the installed
  adapter's retained reconnect client; commits/JSON output and bounded pool shutdown now complete
  before the one-shot process exits. The real CLI export/dry-run/import, credential-safe failed
  login, symlink and malformed-plan negatives pass. A post-CLI snapshot assertion was corrected
  to compare the current dataset after its deliberate successful fixture import.
- `pnpm secrets:check --history` passes; fresh `pnpm audit:dependencies` passes for all 650
  dependencies with zero moderate/high/critical known vulnerabilities. The sandboxed audit
  stalled on network access; the permitted network rerun passes. No dependency or lockfile changed.
- Full `pnpm assets:db-local --full` passes, exit 0, with PostgreSQL 18.6 cross-role denial,
  actual CLI JSON import/export/dry-run, all new transactional checks and the complete existing
  settings/clinician/service/care/topic/institutional/statement/discovery/asset persistence,
  timed-lifecycle, rollback and live-role-revocation suite. Final lint and typecheck pass.
- Initial clean reconstruction was blocked by read-only pnpm-store metadata. The permitted
  rerun encountered registry tarball timeouts; the reduced-concurrency retry also failed on
  registry connection resets. Local clean reconstruction remains an environmental failure;
  hosted T1 independently requires full clean reconstruction. No dependency/lockfile changed.
  No defect or environmental failure is represented as a passing result.

The [fixed-time synthetic report specimens](b02-013-artifacts/README.md) retain readable
create/repeat/update/merge/reference-error/export examples. They are separate from real
PostgreSQL persistence evidence. No patient-facing UI changed; existing browser matrices are
regression evidence, and no new viewport/focus/motion/AT claim is introduced.

Local verification uses the existing pinned asset Python environment:

```bash
PATH=/home/befikadusata/.nvm/versions/node/v24.21.0/bin:$PATH \
ASSET_FORMAT_PYTHON=/var/tmp/hallelujah-b02-011-tools/python/bin/python \
PYTHONDONTWRITEBYTECODE=1 pnpm verify
```

## Review promotion

On 18 September 2026, Africa/Addis_Ababa, B02-013 moves In progress → **In review** under the same
responsible and review identity, `befikadusata`, after the local source/application and complete
database/CLI matrix passes. Implementation commit: `a1c13800bfdc99e5aceeeab7bb114250fbd2a2a4`.
The first review-branch push hit a connection reset; its HTTP/1.1 retry succeeded. Private hosted
exact-head T1 and controlled acceptance remain required; no merge or acceptance is claimed.

Final scope review tightened database URLs: the local deployment label alone cannot authorize
a remote host. CLI pre-initialization and transfer API checks reject remote hosts, remote `host`
overrides, duplicate/nested query parameters and appointment database selection. IPv4/IPv6
loopback and explicit Unix-socket cases pass. Pure contract/type checks repeat successfully;
focused disposable PostgreSQL/CLI retest and current-head hosted T1 follow this amendment.

The finalized focused `pnpm content-transfer:db-local` retest passes, including CLI rejection of
a remote database URL before initialization. The preceding implementation/review head
`66376adbfc30a22c15af01ccf7c7f22a50b2ecca` passes every hosted quality/security step and full clean
reconstruction under [run 35345740923](https://github.com/dynamicet/hallelujah-website/actions/runs/35345740923).
This independent hosted reconstruction succeeds despite the local registry failures. The final
local-database guard/review-documentation head must repeat hosted CI; its exact SHA/run remains
recorded in issue #56 and PR #57 before checked closeout. Controlled acceptance is not granted.

No authentic source record, hospital approval, asset download, provider request, public route,
collection, production provisioning, publication or migration is enabled.

## Controlled acceptance — 18 September 2026

The client directed “close b02-013”. B02-013 moves In review → **Done** for controlled
development on 18 September 2026, Africa/Addis_Ababa. Responsible and acceptance person:
`befikadusata` directing Codex in temporary Backend/Content/QA roles. Target: synthetic local
T0 and private hosted T1. Dependencies B02-001–B02-012 are Done; B02-012 checked merge
`ba55eb145ee7308cee5c41408ce28058973ffc86` and exact-main run `35341982931` pass.

Final implementation commit `22e98b6b1ac8808f827ebd945d724e7567e4c5c3` passes all hosted
quality/security steps, full verification and independent clean reconstruction under
[run 35346485083](https://github.com/dynamicet/hallelujah-website/actions/runs/35346485083).
Local schema/authority checks, real CLI, complete disposable PostgreSQL integration,
rollback/concurrency/revocation negatives, final local-database guard retests, full application
verification, history secret scan and dependency audit pass. No scoped runtime defect remains open.
The additional local reconstruction's registry failures remain environmental failures;
the independent hosted reconstruction passes.

Final acceptance-documentation CI must pass for its exact SHA before checked merge of
[PR #57](https://github.com/dynamicet/hallelujah-website/pull/57). Its matching SHA/run, merge SHA
and exact-main result must be retained in [issue #56](https://github.com/dynamicet/hallelujah-website/issues/56)
and PR #57. Dependent execution waits for passing exact-main CI. B02-014 is the next candidate
after successful closeout, subject to controlled-development readiness checks.

This acceptance does not resolve GOV-01, SEC-01, authentic reconciliation or hospital migration
approval. Authentic identities/content, providers/assets, personal-data collection, remote
provisioning, production, publication, legacy migration and DNS remain gated.
