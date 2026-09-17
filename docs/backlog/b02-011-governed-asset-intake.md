# B02-011 — Controlled Governed Asset Intake

**Status:** Done for controlled development; local and hosted implementation verification/clean reconstruction pass.
Final acceptance-documentation CI must pass before merge.

Client direction “start” authorizes this pull on 17 September 2026, Africa/Addis_Ababa.
Responsible and controlled review authority: `befikadusata` directing Codex in temporary
Backend/CMS, Brand/Privacy and QA roles. B01-002 is Done. Correction PR #51 merged as
`3fc18a945fcecb0edc70221e956c520bd97c87c5`; exact-main
[run 35270876560](https://github.com/dynamicet/hallelujah-website/actions/runs/35270876560)
passed, resolving the dependent-execution pause.

Allowed repository areas: new asset modules in `apps/web/src/content/`, Payload collection
registration, related checks/fixtures in `apps/web/scripts/`, exact manifests/lockfile/toolchain
policy/checks, and architecture/backlog/evidence documentation. The 18 September completion direction extends
this to the related internal asset presentation and hosted processor setup/verification step.

Commands: `pnpm assets:check --capture`, fresh `pnpm assets:db-smoke`,
`pnpm governed-records:db-smoke`, `pnpm local-db-isolation:check`, `pnpm verify`,
`pnpm rebuild:verify`, `pnpm secrets:check --history`, `pnpm audit:dependencies`,
`pnpm format:check`, `pnpm links:check`, `pnpm backlog:check` and `git diff --check`.

## Controlled scope

- Synthetic local records and bytes only, private first-party disposable storage, authenticated
  Payload Local API; no HTTP upload or asset-serving route.
- Stable asset/version identity, original fingerprint/provenance, rights/consent/use restrictions,
  authenticity/claims review, English/Amharic accessibility decisions, focal point/crop approval,
  measured outputs, review/expiry/withdrawal and removal ownership.
- Scan before processing; errors, missing scanner/signatures, infection and unknown results fail
  closed. Test scanner receipts explicitly say fixture-only and never represent malware clearance.
- Metadata-stripped, non-upscaled responsive raster outputs for synthetic logos/images/icons.
  Fonts, documents, vector icons and video remain scanned private originals in quarantine until
  their format-specific sanitization, coverage/accessibility and derivative processors are approved.
  This initial restriction was extended by client direction to finish B02-011 on 18 September:
  explicit server-selected local processing now rebuilds bounded static TrueType WOFF2 subsets,
  sanitized geometry-only SVG, complete escaped PDF text equivalents/page previews, and MP4
  transcodes/posters/plain-text WebVTT. Default non-raster intake still quarantines originals.
- Independent live Brand, Privacy and Accessibility review, revision checks and server-owned
  evidence; edits cannot forge scan/output/review receipts. Default availability is withheld.
- Controlled resolution checks dates, live roles, consent and route/language scope each time;
  withdrawal/review/expiry removes private derivatives and controlled references/cache entries,
  retaining the original and audit provenance. Failed cleanup remains retryable and unavailable.

## Acceptance and remaining boundaries at initial pull

Meaningful tests must prove scanner failures and byte binding, MIME mismatch, malformed inputs,
metadata stripping, no upscaling, approved crops, strict governance, self-review/stale-revision
denials, authenticated PostgreSQL persistence, role revocation, scope and temporal withdrawal,
rollback cleanup and zero external requests. Run full local verification, reachable-history
secret scan, dependency audit and diff checks before review submission.

At the initial pull, real malware-engine clearance, all non-raster processors, authentic rights/consent and crop
review, reviewed Amharic alternatives, asset delivery/browser acceptance, production storage,
scheduler/cache/CDN integrations and hospital approval remain open. External storage requires
SEC-02. Authentic ingestion, public routes, collection, providers and publication remain gated.

Sources: [Epic 02](epic-02-cms-content.md),
[asset contract](../visual-design/handoff/asset-and-content-guidance.md),
[working acceptance matrix](../validation/implementation-acceptance-matrix.md).

## Initial execution result

The private intake/collection, governed records, raster derivatives and controlled lifecycle checks
are implemented and verified locally. [Initial evidence](evidence/B02-011-governed-asset-intake-2026-09-17.md)
records full verification/clean reconstruction, complete/focused PostgreSQL integration, refreshed
security gates and sanitized artifacts. The ticket remains **In progress**; the unfinished format,
real-engine and delivery/reference work listed above is not promoted to acceptance.

## Completion execution — 18 September 2026

The client directed “procce to finish it” under the same responsible and controlled review identity.
This authorizes completion of the remaining synthetic local format, engine, reference/delivery,
recovery and browser evidence. It supplies no authentic asset or production/publication authority.

Additional commands: `pnpm assets:formats:check --capture`, `pnpm assets:malware:check --capture`,
`pnpm assets:db-local` / `pnpm assets:db-local --full` and `pnpm assets:smoke`.
Format integration and browser checks join `pnpm verify` and clean reconstruction. Hosted CI
prepares local FFmpeg/Poppler plus pinned fontTools 4.65.0/Brotli 1.2.0; fonts reject tool drift.
Real ClamAV evidence uses an isolated 1.5.3 engine and verified current signatures; clean synthetic
raster intake and harmless EICAR rejection pass with no failed-intake residue. This verifies engine
behavior rather than clearing any authentic asset.

The server persists publisher-authored scope links only to current canonical governed consumers.
Private byte reads recheck both asset and content workflows/live roles under the CMS transaction
lock; originals cannot be served. Expiry performs idempotent derivative deletion, audited link
removal and discovery-cache eviction. Synced on-disk receipts survive local worker restart; recovery
checks ownership, permissions and fingerprints and reports orphan originals without activating them.

[Completion evidence](evidence/B02-011-governed-asset-completion-2026-09-18.md) records final validation.
Production durability/backups, storage capacity, scheduling/cache/CDN, authentic assets/rights/consent,
hospital and language-owner acceptance, public routes, providers, collection and publication remain
separate release gates. Unsupported formats and missing required processors remain unavailable.

## Controlled acceptance — 18 September 2026

Client direction to finish authorizes In review → **Done** for synthetic local T0/private hosted T1
under `befikadusata` as responsible and controlled acceptance person, directing Codex in temporary
Backend/CMS, Brand/Privacy and QA roles, on 18 September 2026, Africa/Addis_Ababa.
B01-002 is Done and the preceding exact-main run passed. All scoped local checks and
[hosted implementation run 35278163102](https://github.com/dynamicet/hallelujah-website/actions/runs/35278163102) pass for
`fb9cad46934da2d5e0c020793a9be7a3f2831380`, including frozen clean reconstruction.
[Issue #52](https://github.com/dynamicet/hallelujah-website/issues/52) and [PR #53](https://github.com/dynamicet/hallelujah-website/pull/53)
retain the final current-head SHA/run, checked merge and exact-main result. The final acceptance
commit must repeat hosted CI before merge. No scoped defect remains open; production and authentic
asset, rights/consent, language/hospital, storage/provider and publication gates above remain closed.
