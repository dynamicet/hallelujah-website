# B02-011 — Controlled Asset Completion Evidence

**Status:** In review for controlled development. Local implementation and full verification pass;
clean reconstruction also passes; hosted exact-head review remains required.

Client direction “procce to finish it” on 18 September 2026, Africa/Addis_Ababa, extends the
[execution brief](../b02-011-governed-asset-intake.md). Responsible/review authority remains
`befikadusata` directing Codex in temporary Backend/CMS, Brand/Privacy and QA roles.
Branch: `b02-011-governed-asset-intake`, based on main `3fc18a945fcecb0edc70221e956c520bd97c87c5`.

## Result and scope

All six asset kinds have bounded private intake, immutable technical receipts, independent live
review and controlled lifecycle workflows. Raster output preserves the earlier tested metadata,
responsive and crop policy. Explicit local non-raster processing supports static TrueType WOFF2,
static geometry SVG, readable PDFs through complete escaped HTML/page previews, and bounded MP4
through measured H.264/AAC/poster/plain-text WebVTT. Unsupported capabilities/formats stay withheld.
No original is exposed through the private byte-consumer adapter.

Publisher commands persist scope links only to current canonical governed consumers. Private bytes
are consumed under fresh CMS locking and both asset/content live approvals. Expiry removes derivatives,
links and internal discovery cache entries while preserving originals and append-only audit. Synced
storage can be reopened after worker restart; recovery verifies ownership/permissions/fingerprints,
withholds corruption and reports orphan originals without granting activation.

## Verification collected

| Check | Result |
| --- | --- |
| `pnpm assets:check` | Pass: earlier strict governance, scanner shims/receipts, raster metadata/crops/residue/review/expiry regressions. |
| `pnpm assets:formats:check --capture` | Pass: valid font subsets/Ethiopic baseline, SVG decode/metadata stripping, PDF accessible text/previews/action exclusion, escaped markup, video dimensions/duration/metadata/poster/WebVTT, malformed/unsafe formats and residue, local reopening. Final recovery integrity/orphan and corruption-withholding checks also pass in full verification. |
| `pnpm assets:malware:check --capture` | Pass: real ClamAV 1.5.3 with verified main/daily/bytecode signatures; clean synthetic raster, harmless EICAR exit-1 rejection and no failed-intake residue. No authentic asset clearance. |
| Fresh `pnpm assets:db-local` | Pass: PostgreSQL 18.6 authentication/role isolation, immutable receipts/concurrent reviews, live asset/content revocation, persisted scope links/default/original denial, detached private bytes, local reopening, all processed formats, withdrawn originals/audit retention and real elapsed consent link cleanup. |
| Fresh `pnpm assets:db-local --full` | Pass: complete settings/care/visitor/institutional/statements/discovery integration plus asset workflow. |
| `pnpm assets:smoke` | Pass: 163 cases; five kinds, both language contexts, four widths, no-JS/Save-Data/print/image-failure, native keyboard/player, initial-video network and derivative 410 checks. |
| `pnpm verify` | Pass: complete policy/source/types/tests/build/accessibility/budgets/runtime, 92 shared-component cases, 52 statement cases and 163 asset cases. |
| `pnpm rebuild:verify` | Pass: frozen dependency reconstruction, importer parity and complete verification in a disposable clean copy. Lockfile SHA-256 `b143b09bf35b897291553919a74247047f1b6529da0d759642ca6aa4290652bd`; importer SHA-256 `72df5c767c10664a290292b262c772a238c6bb287cb3a5622fa2e4c2095f1815`. Hash-enforced Python environment also reconstructs from exact requirements. |
| `pnpm secrets:check --history`, `pnpm audit:dependencies`, toolchain and diff checks | Pass: reachable history/current source; 650 Node dependencies with zero moderate/high/critical known vulnerabilities; Python fontTools 4.65.0/Brotli 1.2.0 advisory metadata reports zero vulnerabilities. Python dependencies are package-hash enforced. |

Tooling: Node.js 24.21.0, pnpm 10.27.0, PostgreSQL 18.6, fontTools 4.65.0/Brotli 1.2.0,
FFmpeg 8.0.1 and Poppler 26.01.0 locally, plus the established direct Chromium launcher. Hosted
format checks prepare FFmpeg/Poppler and the pinned Python environment before complete verification.
The [artifact index](b02-011-artifacts/README.md) retains measured sanitized reports/captures.

The sandbox mount quota is exhausted; authorized commands use disposable `/var/tmp` tooling,
clusters and browser profiles. One initial disposable database setup exposed an interactive Drizzle
rename prompt for the role-isolation fixture table; the runner now drops that table after isolation
and before CMS initialization. One delivery default-mode test mistakenly invoked a helper's own
controlled-mode default; the direct adapter call corrected the assertion without changing availability.
Full source verification enforced the existing environment/URL boundaries: processor paths are now
server-injected and content eligibility uses the validated Local API origin. No checker is weakened.
Browser fixtures corrected their HTML response MIME and dispatched the complete Enter event for native
summary activation. Native inline media-control resources are distinguished from outbound HTTP requests.
Synthetic 320-pixel English raster and Amharic-context video captures were visually inspected via
read-only encoded image forwarding after the local image-view tool hit the same mount quota failure.
No clipping or missing alternatives were observed in those captures. Prior-ticket generated print
PDFs were restored to committed bytes after verification and are outside this change.
No unsupported human screen-reader, original-PDF accessibility or authentic-font acceptance is claimed.

Production storage/backups/capacity, scheduling/cache/CDN, authentic assets/rights/consent/crops,
professionally reviewed language alternatives, hospital/domain approvals, external providers/storage
(SEC-02), public/CMS routes, collection and publication remain release gates.
