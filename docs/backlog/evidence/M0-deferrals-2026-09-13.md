# M0 Execution Deferrals — 13 September 2026

| Field | Value |
| --- | --- |
| Backlog items | `B00-001`, `B00-002`, `B00-007`, `B00-014`, `B00-015` |
| Status | `Deferred` |
| Direction | Skip during the current controlled implementation stage and return in Phase 2 or before the applicable production boundary |
| Decision date / timezone | 13 September 2026, Africa/Addis_Ababa |
| Authority represented here | Client execution-sequencing direction; not formal hospital, security, infrastructure, or release approval |
| Allowed effect | Temporary role labels, isolated local clean rebuild, provider-neutral working assumptions, default-deny third-party behavior, and sanitized non-sensitive development evidence may continue |
| Prohibited effect | No legacy migration, real personal data, third-party activation, remote production provisioning, DNS cutover, publication, or release |
| Review point | Phase 2, or earlier before any production, migration, external-provider request/activation, restricted-evidence workflow, collection, publication, or release boundary is crossed |
| Recorder | Codex execution-board maintenance |

## Boundary

This record changes pull order only. It does not mark `GOV-01`, `SEC-01`, `SEC-02`, `DEL-01`, the infrastructure selection, the third-party register, or the durable evidence repository as approved or complete. The open acceptance criteria in the source tickets remain intact and must be revisited at their review points.

Current implementation must use the documented isolated clean-rebuild boundary, must not copy executable or configuration state from legacy WordPress, and must keep all unapproved external providers disabled.

## Minimum working baselines

- `B00-014`: default deny. Use local/first-party assets and behavior only. Unapproved providers make zero browser, server, build, or CI requests. Reopen the ticket before adding or activating any external provider.
- `B00-015`: store only sanitized, non-sensitive evidence in the repository or approved CI artifacts. Restricted material stays outside the repository in an already authorized source system; use sanitized pointers only. If no authorized restricted location exists, development must not create or transfer the restricted artifact. Reopen the ticket before a restricted-evidence workflow and before production acceptance.
