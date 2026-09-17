# Controlled Governed Asset Intake

B02-011 adds a private `governed-assets` Payload collection and a bounded local storage adapter.
No upload, download, CMS or public route is introduced. Authoring is limited to explicitly synthetic
governance inputs; the server owns original/scan/output fingerprints, revision, review stamps and audit.

`ingestCmsAsset` reloads the persisted local author, detaches and scans up to 32 MiB, fingerprints the
original, checks byte-signature MIME and kind, and derives eligible raster outputs. Intake receipts
are staged in a private request WeakMap. The collection write hook reloads the author under the
existing PostgreSQL advisory transaction lock; direct Local API writes, including `overrideAccess`,
cannot supply scan or output receipts. Failed writes discard staged originals and outputs. Versions
are sequential per stable asset ID, retain the same kind and receive fresh reviews. Ingest a successor
version to revise governance; original, rights, outputs and audit cannot be overwritten.

The default scanner uses local ClamAV with a bounded subprocess, no shell expansion and no signature
download. Missing engine/signatures, future/stale signatures, infection, encrypted/oversized scan
alerts and engine errors reject intake. Signatures must be no older than 48 hours. Scan receipts bind
to the original SHA-256; the stored file is rechecked before decoding. The test scanner explicitly
reports `fixtureOnly: true`. Executable shims test scanner exit semantics, never real engine clearance.
See [ClamAV scanning documentation](https://docs.clamav.net/manual/Usage/Scanning.html).

Sharp 0.35.4 is declared directly, pinned in the manifests/lockfile/toolchain policy, and already existed
in the frozen Next.js graph. PNG/JPEG/WebP are decoded with a 16-million-pixel limit and strict warning
handling, autorotated, converted to sRGB and re-encoded without metadata. Responsive PNG/WebP outputs
use bounded 320/640/1280 widths clamped to master/crop dimensions. Informative image crops use authored
focal points and allowed aspect ratios; landmarks require review. Logos/icons retain full geometry.
Each output records hash, MIME, dimensions, bytes, ratio and metadata/color policy. Animated rasters
are rejected. The [Sharp output](https://sharp.pixelplumbing.com/api-output/) and
[resize](https://sharp.pixelplumbing.com/api-resize/) contracts govern the implementation.

Non-raster intake defaults to quarantine. Explicit server-created stores with local format processing
rebuild supported originals after scanning. The bounded Python worker uses fontTools 4.65.0/Brotli
1.2.0 for static TrueType WOFF2. It verifies embedding rights, approved 400/600/700 weights, Latin ASCII
or assigned Ethiopic U+1200–U+137F plus authored alternative characters, and retains shaping closure
while subsetting each requested locale. Private names/hints/timestamps and unsupported tables do not
survive. Coverage is a controlled technical baseline, not authentic font or language-owner approval.

SVG supports bounded static geometry only, with intrinsic/viewBox agreement. Entities, declarations,
scripts, events, text, styles, links, embedded images and foreign objects are rejected; metadata is
removed and the rebuilt vector is decoded into a poster before review. No vector URL is fetched.

PDFs have at most five unencrypted pages and require a complete authored transcript matching extracted
readable text. Poppler generates bounded previews; escaped HTML supplies the reviewed full text. The
original PDF is never delivered, so actions/attachments/scripts cannot survive into the delivery output.
Scans without readable equivalents, incomplete transcripts and translations invented by the processor
are refused. This does not certify an original PDF as accessible or claim general PDF/UA conformance.

MP4 processing restricts input to the local MOV demuxer/file protocol, one bounded video stream and at
most 120 seconds. FFmpeg re-encodes non-upscaled H.264/AAC, strips authored metadata/chapters, measures
output duration/dimensions, extracts a stripped PNG poster and rejects truncation. Informative video
requires ordered plain-text WebVTT cues within the measured duration, transcript and audio-description
decision; it cannot silently inherit another locale's captions. Decoded intermediates are removed.
All outputs retain immutable measured server receipts and the same three independent domain reviews.
See [fontTools subsetting](https://fonttools.readthedocs.io/en/stable/subset/index.html) and
[FFmpeg protocol restrictions](https://ffmpeg.org/ffmpeg-protocols.html).

Brand, Privacy and Accessibility review require active matching persisted roles and independence
from the owning author. Receipts include the complete governance/original/scan/output digest. Each
command supplies an expected revision; concurrent writers cannot approve stale data. Live reviewers
are rechecked before final approval and every controlled resolution. JWT/request role claims cannot
override role revocation. Publisher withdrawal preserves original and append-only audit provenance.

`resolveCmsAsset` defaults to withholding all references. Explicit controlled-fixture reads require
a review identity, approved state/current lifecycle, complete live domain reviews, an allowed route,
channel and territory, the requested language alternative and matching physical original/output hashes.
Missing Amharic never falls back to English. Returned data is detached, visibly synthetic, includes
fixture-only scan status and a temporal validity limit, and supplies private keys rather than URLs.
Consumers must resolve afresh before each use; a returned snapshot is not a durable authorization.

Committed review/withdrawal writes evict the bounded controlled consumer registry and shared internal
discovery cache. Withdrawn, review-due, rights-expired or content-expired reads remove derivatives before
returning unavailable; `sweepCmsAssets` provides an explicit publisher-only local maintenance pass.
Originals and audit remain. File deletion is idempotent and bounded; a failure evicts references and
fails the operation so it can be retried. Registering consumer IDs happens under the transaction lock;
failed transactions evict them. No production cache/CDN integration or scheduler exists. Publisher attachment commands persist scope
links to current canonical governed content. Fresh byte consumption verifies both asset/content live
approvals, scope and hashes under the transaction lock, returns private/no-store/nosniff headers, and
refuses original keys. A server-staged lifecycle command removes expired links with an append-only
audit even when a domain reviewer triggers cleanup; authored commands cannot stage that authority.

Intake syncs originals/derivatives and their directory before returning persistence receipts. A
reopened real owned 0700 store survives local worker restart. Recovery inspection compares trusted CMS
receipts, withholds corrupted/missing bytes and reports orphan tokens without removing originals or
granting activation. This is local filesystem durability; production backups/disaster recovery and
storage capacity remain release work.

The internal React consumer is withheld by default, accepts only relative synthetic fixture sources,
preserves full text alternatives, supplies intrinsic raster geometry/srcset and uses native video
controls with preload none. Save-Data omits video. The browser harness alone mounts loopback fixture
responses, never application routes; its FontFace samples are synthetic geometric glyphs, not bundled
production typography. Both language contexts visibly identify unreviewed Amharic shaping evidence.

Run `pnpm assets:check`, `pnpm assets:formats:check`, `pnpm assets:smoke`, fresh `pnpm governed-records:db-smoke` and
`pnpm local-db-isolation:check`, full `pnpm verify`, `pnpm rebuild:verify`, dependency audit,
reachable-history secret scan and diff checks. The database suite includes forged-receipt denials,
independent reviews, concurrent revision checks, role revocation, scope/language/default denial,
sequential-version rollback cleanup, output tampering, original retention and real timed review/rights
withdrawal. `pnpm assets:db-local --full` reproduces the complete disposable database checks, including local
role isolation, all processed formats, persisted consumer links, fresh byte delivery, content role
revocation/withdrawal, real elapsed link removal and restart recovery. `pnpm assets:malware:check`
separately requires a real current local ClamAV database; fixture receipts never claim malware clearance.
The [execution brief](../backlog/b02-011-governed-asset-intake.md) retains release boundaries.
