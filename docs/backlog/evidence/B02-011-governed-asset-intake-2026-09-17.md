# B02-011 — Initial Controlled Implementation Evidence

**Status:** Initial raster/intake implementation verified locally; B02-011 remains In progress.

Client direction “start” authorizes the
[execution brief](../b02-011-governed-asset-intake.md) on 17 September 2026, Africa/Addis_Ababa.
Responsible and controlled review authority is `befikadusata` directing Codex in temporary
Backend/CMS, Brand/Privacy and QA roles. Branch: `b02-011-governed-asset-intake`, based on
main `3fc18a945fcecb0edc70221e956c520bd97c87c5`. PR #51 is merged, issue #50 closed and
exact-main run 35270876560 passes; the preceding dependent-execution pause is resolved.

## Implemented result

A private Payload asset collection, strict synthetic governance contract, scanned intake adapter,
server-owned immutable receipts, sequential versions, independent live domain review and controlled
resolution/lifecycle checks are implemented. Stable IDs use the existing `asset_` content namespace.
Inputs include original provenance, ownership, rights/consent/route/channel/territory restrictions,
authenticity/claims limits, English/Amharic alternatives, crop/focal-point policy and lifecycle/fallback.

The default scanner fails closed without local ClamAV and current signatures, on nonzero exits,
encrypted/oversized scan alerts and receipt/hash/time mismatch. Tests explicitly use fixture-only
receipts and executable shims; they do not assert real engine clearance. Raster derivatives use
Sharp 0.35.4, the already-frozen Next.js dependency now declared directly and enforced by policy.
PNG/JPEG/WebP outputs are metadata-stripped, sRGB, non-upscaled and measured. Logos/icons retain
geometry; image crops use authored ratios/focal points. Animated raster decoding is refused.

Only server-staged intake can persist scan/output receipts. Hooks still enforce this with
`overrideAccess`. Original/governance/output/review/audit changes require a newly ingested successor
version. Reviews enforce matching active persisted Brand/Privacy/Accessibility roles, independence
from the author, complete digest binding, current rights/content evidence and optimistic revisions.
Resolution rechecks live roles, scope, language, temporal boundary and physical fingerprints;
default mode withholds all data. No upload, download or public/CMS route exists.

Withdrawn, review-due and rights/content-expired reads remove derivatives and controlled references;
explicit publisher maintenance repeats cleanup idempotently. Originals and audit provenance remain.
Writes evict controlled consumer references and the shared discovery cache, including on rollback.
Returned snapshots are detached, visibly synthetic and require fresh resolution before reuse.

## Verification

Pinned Node.js 24.21.0/pnpm 10.27.0, PostgreSQL 18.6 and the established direct Chromium launcher.

| Check | Result |
| --- | --- |
| `pnpm assets:check --capture` | Pass: strict missing/unsupported governance, rights/scope/date/focal-point negatives; empty/oversize/malformed uploads; byte MIME mismatch; scanner failure/stale/future/forged/changed-byte receipts; no failed-intake residue; private key traversal rejection; responsive dimensions/bytes/hash; EXIF/ICC/XMP stripping; no upscaling; focal crop retention; non-raster quarantine; self/wrong-role/stale/due/expired review denials; digest binding, audit retention and idempotent derivative removal. |
| Fresh `pnpm assets:db-smoke` | Pass: authenticated intake/persistence, forged receipt/key/data/delete denials, concurrent stale revision rejection, persisted reviewer role revocation, default/scope/language denial, detached snapshots, sequential/kind-immutable versions, rollback file cleanup, output tampering, quarantine, retained originals and actual elapsed review/consent expiry. Final namespace/lifecycle edits repeat this focused suite. |
| Fresh `pnpm local-db-isolation:check` | Pass: own synthetic rows readable; cross-role database connections/reads/mutations denied; no TCP listener. |
| Fresh `pnpm governed-records:db-smoke` | Pass: complete prior settings/care/visitor/institutional/statement/discovery/workflow integration plus new asset persistence and lifecycle checks. |
| `pnpm verify` | Pass: all prescribed policy/source/types/tests/build/accessibility/budgets/runtime and browser checks, including 92 shared-component cases and 52 statement cases. Final backend namespace/lifecycle and capture edits repeat assets/type/lint checks and focused PostgreSQL integration. |
| `pnpm rebuild:verify` | Pass: frozen dependency reconstruction, importer graph parity and complete verification in a disposable clean copy. Final focused edits add no dependency or browser behavior. |
| `pnpm secrets:check --history` | Pass: current text and reachable-history credential signatures; matched values would be redacted. |
| `pnpm audit:dependencies` | Pass: 650 dependencies; zero moderate/high/critical known vulnerabilities. |
| `pnpm lint`, `pnpm typecheck`, `git diff --check` | Pass for final source. Documentation format/link/backlog checks run after evidence closeout. |

The sandbox could not start because `/tmp` exceeded its quota; approved commands used disposable
`/var/tmp` storage. The initial command used an unpinned host Node and was correctly rejected before
dependency mutation. The first pure test corrected an expected count: 800-pixel native outputs have
three justified widths and square crops two, yielding ten PNG/WebP outputs. Type generation initially
rejected a wrong database name; it then used the required local database identity. The first database
asset review exposed Payload's merged unchanged JSON: the hook now accepts only the identical original
record and applies server-owned commands to the freshly locked revision, still rejecting forged data.
The full/focused retests pass. Clusters are stopped and removed by the runner. Regenerated prior-ticket
print PDFs are restored to their original committed bytes; they are not part of this change.

## Evidence and unfinished ticket scope

[Artifact index](b02-011-artifacts/README.md) retains measured sanitized JSON and two synthetic PNGs.
Functional tests establish crop pixels and absence of private metadata. The local image-view tool
also encountered the sandbox quota failure; no unsupported human visual acceptance is claimed.

B02-011 is not Done or submitted for final acceptance. Font validation/coverage/subsetting,
document accessibility/sanitization, SVG sanitization, video poster/transcode/caption processors,
real malware-engine evidence, durable storage/recovery, content-reference/delivery integration and
media browser acceptance remain open. These formats stay quarantined with zero activation path.
The controlled consumer registry is not production record-reference cleanup or a CDN purge system.
Authentic assets/rights/consent/crops/translations, hospital approvals, production scheduler/cache/CDN,
external storage/providers (SEC-02), collection and publication remain gated.
