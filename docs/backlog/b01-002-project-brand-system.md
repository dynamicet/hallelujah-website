# `B01-002` — Project Brand System

**Status:** Done for controlled development; `BRAND-01` project direction closed

**Execution date:** 14 September 2026, Africa/Addis_Ababa

**Publication, clinical/content, binary-asset ingestion, provider, production, and deployment authority:** Not granted

## Execution contract

| Field | Controlled execution value |
| --- | --- |
| Epic / lane / priority | Epic 01 / `DECISION` / `P0` |
| Phase / milestone | Phase 1 / `M1` |
| Old / new status | Proposed → Ready → In progress → In review → Done for controlled development |
| Responsible owner | Client workspace identity `befikadusata` directing Codex in delegated Brand Strategist, UI/UX Architect, and Marketing roles |
| Acceptance owner | Same client identity for project acceptance; named hospital Brand, Language, Accessibility, Privacy, and Content people return where their production/publication gates apply |
| Requirements / decision | `G-004`, `G-010`, `H-002`, `D-006`, `I-002`; closes the project-direction portion of `BRAND-01` |
| Inputs | First-party public website name/tagline and logo files; existing Calm Wayfinding prototype; official Noto releases; existing media/motion governance |
| Allowed repository scope | Project brand guide, source/fingerprint record, approved token values, review board/renders, validation check, backlog/register/handoff updates, sanitized evidence |
| Evidence destination | [Sanitized completion record](evidence/B01-002-project-brand-system-2026-09-14.md) |

The client's 14 September direction explicitly authorizes the project to complete the missing brand
package from the hospital's public logo and colors rather than wait for a marketing team. The public
raster files are accepted as current project source masters with fingerprints and strict no-trace,
no-upscale, no-hotlink rules. This is a documented exception to the preferred original-vector
input—not a claim that a hospital-issued vector or formal brand manual was received.

## Decisions

1. **Identity:** use “Hallelujah General Hospital” and “Bringing Quality Care Home”; omit terminal
   punctuation in live UI while preserving it inside unchanged source artwork.
2. **Logo:** adopt the first-party horizontal and square public raster files as replaceable,
   fingerprinted source evidence. Use accessible text when their resolution is insufficient.
3. **Color:** preserve exact public cyan `#1EAEE2` and orange `#EF5C28` for logo/decorative identity;
   retain the deeper mineral/teal/blue/red interface system for contrast and safety semantics.
4. **Typography:** approve Noto Sans 2.015 and Noto Sans Ethiopic 2.102 at 400/600/700 under SIL OFL
   1.1, self-hosted with immediate fallbacks and no premature Ethiopic subsetting.
5. **Voice:** calm, capable, human, and clinical; task/safety information precedes promotion;
   unsupported facts, superlatives, and outcome claims are prohibited.
6. **Imagery/video:** authentic, consented, context-correct documentary imagery only; video is
   poster-first, user-initiated, non-essential, and absent from protected contexts.
7. **Lifecycle:** every asset moves through proposed, quarantined, reviewed, approved, published,
   expired/withdrawn, and purged states with source, rights, consent, crop, accessibility, review,
   and removal metadata.

## Acceptance boundary

- [x] Public name/tagline and both source-logo variants are recorded with URLs, dimensions, dates,
  classification, and SHA-256 fingerprints.
- [x] Logo use, fallback, clear space, minimum-resolution, prohibited treatment, and replacement
  triggers are defined without fabricating a vector or compact symbol.
- [x] Logo-extracted colors and accessible UI extensions are assigned separate, explicit roles.
- [x] Noto license, release, weight, file fingerprint, language coverage, and representative shaping
  checks pass for Latin and Ethiopic.
- [x] Desktop and 360px review boards render the approved palette and bilingual type direction;
  low-contrast logo accents are labeled decorative-only.
- [x] Voice, message hierarchy, imagery/video art direction, authenticity, claims, consent,
  poster/crop behavior, rights, withdrawal, and purge are approved.
- [x] The canonical token source records `B01-002` closure and remains centrally replaceable.
- [ ] Production logo/font binaries are scanned and ingested with derivatives.
- [ ] Actual approved Amharic public copy and production components pass named human/device review.

The last two items belong to `B02-011`, `LANG-01`, `B01-004`, and release QA. They do not keep this
project brand decision open. `BRAND-01` reopens only on a listed material change trigger.

## References

- [Project brand system](../brand/README.md)
- [Machine-readable brand record](../brand/brand-foundation.json)
- [Review board](../brand/review-board.html)
- [Visual foundations](../design-system/foundations.md)
- [Asset and content guidance](../visual-design/handoff/asset-and-content-guidance.md)
- [Motion/media amendment](../visual-design/motion/high-end-motion-and-interactive-media-amendment.md)
