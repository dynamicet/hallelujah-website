# B02-011 Synthetic Asset Evidence

> Evidence availability (8 November 2026): some historical captures referenced below are absent from this checkout. Their filenames are retained as archive references, not current verification evidence. Rerun the documented checks for fresh evidence.

These specimens contain generated raw geometric pixels only. They are test evidence, never hospital
photography or production assets. No person, facility, clinical capability, authentic logo/font or rights claim
is represented. The scan is explicitly fixture-only; it is not malware clearance.

- [Measured raster report](raster-report.json): native/cropped responsive outputs with dimensions,
  bytes, SHA-256 and metadata policy; private temporary storage keys and reviewer identities omitted.
- Native 320-pixel specimen (unavailable archive: `native-320.png`): full blue/red geometry, intrinsic 320 × 160 dimensions.
- Approved-focal-point crop specimen (unavailable archive: `focal-crop-320.png`): square red region, intrinsic 320 × 320
  dimensions, retaining the authored right-hand focal point without upscaling.

Reproduce with `pnpm assets:check --capture`. Source originals with synthetic EXIF remain private
inside disposable test storage; outputs are verified to contain no EXIF, ICC or XMP metadata.
Tests also verify PNG/WebP output MIME, measured bytes/dimensions, hashes, source-size limits,
crop ratios, safe removal and preservation of the original fingerprint.

## Completion reports

- [Format measurements](format-report.json): synthetic font subsets, sanitized vector, readable
  document equivalents/previews and video/poster/captions. Scan receipts are fixture-only.
- [Real-engine check](malware-report.json): current-signature ClamAV clean synthetic raster and
  harmless EICAR rejection; no authentic asset clearance.
- [Browser verification](browser/verification.json): internal bilingual capability/viewport and
  media network/fallback checks. Synthetic geometric fonts and unreviewed Amharic shaping only.
