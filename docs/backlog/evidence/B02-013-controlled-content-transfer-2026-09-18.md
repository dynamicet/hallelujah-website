# B02-013 — Controlled Content Transfer Evidence

**Date/timezone:** 18 September 2026, Africa/Addis_Ababa
**Responsible / review authority:** `befikadusata` directing Codex in temporary Backend/Content/QA roles
**Environment:** synthetic local T0; private hosted T1 pending
**Status:** In review; no controlled acceptance or hospital migration approval claimed

Tracking: [issue #56](https://github.com/dynamicet/hallelujah-website/issues/56).

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

No authentic source record, hospital approval, asset download, provider request, public route,
collection, production provisioning, publication or migration is enabled.
