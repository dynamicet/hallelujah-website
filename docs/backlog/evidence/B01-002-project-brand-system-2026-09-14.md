# `B01-002` Project Brand System — Completion Evidence

> Evidence availability (8 November 2026): some historical captures referenced below are absent from this checkout. Their filenames are retained as archive references, not current verification evidence. Rerun the documented checks for fresh evidence.

**Recorded:** 14 September 2026, Africa/Addis_Ababa

**Result:** Passed for controlled-development project authority

**Decision:** `BRAND-01` project direction closed; defined production/publication gates remain

## Evidence summary

| Area | Result |
| --- | --- |
| Identity source | First-party website confirms “Hallelujah General Hospital,” “Bringing Quality Care Home,” and two public PNG logo variants. |
| Logo provenance | Horizontal 200 × 50 SHA-256 `2aaf6bc2d9c59fc3bb94ff7ca39ce771606a9582e89aa520060bb45e53d7f9ef`; square 200 × 200 SHA-256 `9386e02f37390ccb3dd7a0909041f10ee92c0bf794c4baa47b6e883f180b13f3`. |
| Color extraction | Public mark preserves cyan `#1EAEE2` and orange `#EF5C28`; measured on white at 2.56:1 and 3.37:1, so both are restricted to logo/decorative use. |
| Accessible extension | Primary text `#17323A`/white 13.52:1; secondary `#516A70`/white 5.76:1; teal action `#006A73`/white 6.35:1; focus blue `#075EA8`/white 6.61:1. |
| Latin typography | Noto Sans 2.015, SIL OFL 1.1, official 400/600/700 files; representative English and numeral shaping passed without missing glyphs. |
| Ethiopic typography | Noto Sans Ethiopic 2.102, SIL OFL 1.1, official 400/600/700 files; `fc-scan` declares `am`, `gez`, `ti-er`, `ti-et`, `tig`, `byn`, `sid`, and `wal`; representative Amharic/Ethiopic numeral shaping passed without missing glyphs. |
| Render review | 1440px (unavailable archive: `../../brand/evidence/b01-002-brand-review-1440.png`) and 360px (unavailable archive: `../../brand/evidence/b01-002-brand-review-360.png`) local Chromium renders were visually reviewed for hierarchy, wrapping, glyph rendering, weight differentiation, palette labeling, and reflow. |
| Governance | Voice, claims boundary, authentic imagery, consent/rights, poster/crop behavior, zero pre-intent video, protected contexts, lifecycle, withdrawal, and purge are defined. |
| Automated policy | `pnpm brand:check` validates identity, source metadata, fingerprints, Noto release records, font weights, Amharic evidence, media safeguards, source-color restrictions, and canonical-token parity. |

## Source and audit boundary

The public website and logo files were used only as identity evidence. They are not accepted as
authority for clinical, operational, safety, availability, capacity, leadership, contact, or other
hospital facts. The raster files are project-adopted public sources, not falsely described as
original vectors. A trusted later master replaces them through controlled change.

Official font archives were inspected outside the repository. Their archive and selected-file
fingerprints are preserved in [brand-foundation.json](../../brand/brand-foundation.json), allowing
`B02-011` to verify the exact binaries at ingestion without committing fonts under this decision.

## Performed commands

```sh
fc-scan --format '%{family[0]} | %{style[0]} | %{fontversion} | %{lang}' <font-file>
hb-shape <font-file> 'Hallelujah General Hospital — 0123456789'
hb-shape <font-file> 'ሃሌሉያ ጠቅላላ ሆስፒታል እንክብካቤ ፩፪፫'
pnpm brand:check
pnpm tokens:generate
pnpm tokens:check
pnpm verify
```

Chromium rendered the local, dependency-free review board at 1440 × 1600 and 360 × 2500. The
committed board uses valid `lang="am"` scoping and immediate local fallbacks; it makes no remote
request and clearly labels its Amharic strings as typography fixtures rather than approved copy.

The first composite `pnpm verify` attempt passed every check through build, accessibility, and
budgets, then the sandbox denied the runtime smoke test permission to bind `127.0.0.1:3211`
(`EPERM`). The unchanged `pnpm runtime:smoke` passed once loopback binding was explicitly allowed.
This is recorded as an environment permission boundary, not hidden as a product failure or claimed
as a single uninterrupted suite run.

## Residual gates

- `B02-011`: scan and ingest logo/font binaries, preserve source originals, make derivatives, test
  removal, and prohibit hotlinking.
- `B01-004`: implement and test global font loading, components/states, focus, contrast, reflow,
  forced colors, print, and performance.
- `LANG-01`/`LANG-02`: approve actual public Amharic identity and consequential content.
- Content, clinical, privacy, security, production, deployment, DNS, and publication decisions
  remain independent and unchanged.
