# Asset and Content Guidance

## Current boundary

There are no approved production logo/vector assets, bundled fonts, icon library, or hospital photographs. The extracted [media manifest](../../../../resources/data/media-manifest.json) contains remote references with missing source alternative text; it is an audit input, not an asset library. Audit screenshots, benchmark captures, generated evidence images, abstract prototype media, and remote source URLs must not ship as hospital product assets.

Structured content in [resources](../../../../resources/README.md) preserves public-site claims and quality flags. Fields ending in `_as_published` are source evidence, not independently verified facts.

## Required asset record

Every production image, logo, icon set, font, document, or video needs a durable record containing:

| Field | Requirement |
| --- | --- |
| Stable asset ID and version | Does not depend on filename or remote URL |
| Source/original | Original file and provenance; no hotlinking |
| Owner and approvers | Brand plus content/clinical/privacy/HR owner as applicable |
| Rights and consent | License, subject consent/release, permitted routes/channels/territories, restrictions |
| Authenticity and claim review | Confirms what/where/who is shown and prevents implied capability/outcome claims |
| Language/text status | No baked-in text; approved transcript/caption where applicable |
| Accessibility purpose | Informative/decorative decision and approved alt, caption, transcript, or nearby equivalent |
| Crop/focal point | Human-selected focal point and allowed aspect ratios; landmarks remain visible |
| Technical outputs | MIME, dimensions, bytes, responsive variants, compression, color profile |
| Lifecycle | Publish date, review date, expiry/consent withdrawal, removal owner, fallback |

The content record referenced by an asset also needs stable public identity, source, status, owner, reviewer, review/expiry dates, language parity, relationships, and retirement/redirect behavior.

## Intake and delivery workflow

1. Receive the original through the approved controlled channel; malware-scan and preserve provenance.
2. Confirm identity, authenticity, clinical/operational implications, privacy/consent, license, and permitted use.
3. Decide whether the asset is informative or decorative and write the approved text alternative in context.
4. Create non-upscaled responsive derivatives from the approved master; remove unnecessary metadata according to policy.
5. Review crops at 320/360, tablet, desktop, reflow, and both language contexts. Entrance and wayfinding images must retain useful landmarks.
6. Record dimensions/bytes and test loading, failure, Save-Data, print, and no-image fallbacks without layout shift or content loss.
7. Publish only through the approved first-party pipeline or an approved provider under `SEC-02`; never hotlink the old site or benchmark sources.
8. Monitor review/expiry and remove every derivative, cache, search reference, sitemap reference, and relationship when rights or content approval ends.

## Format and performance guidance

- Keep accessible HTML text primary. Never bake headings, contacts, warnings, directions, schedules, or consequential translations into an image.
- Generate only justified widths and formats supported by the production browser policy. Supply intrinsic dimensions and `srcset`/`sizes` or the framework equivalent.
- Prefer modern compressed raster formats with an appropriate fallback where required. Preserve SVG only from a trusted, sanitized, rights-cleared source.
- Lazy-load below-fold noncritical media; do not lazy-load the actual LCP candidate without measurement. Do not preload decorative assets.
- Self-host approved fonts when feasible. Limit to approved 400/600/700 weights, verify Ethiopic coverage, prevent synthetic styles, use immediate fallbacks, and subset only with language-owner review.
- Use project-owned or licensed icons on the documented 24 × 24 outline geometry. Pair safety/essential icons with visible labels and never use emoji as the icon system.
- Include asset bytes and requests in `G-009`; validate LCP/CLS on the compressed production build under `G-008`.

## Subject and claim safeguards

Preferred future photography, after approval, includes the actual entrance, reception, staff at work, neighborhood landmarks, and non-sensitive environments in natural light. Do not use:

- identifiable patients, children, vulnerable people, distress, or procedures without specific recorded permission and appropriate review;
- equipment, interiors, uniforms, vehicles, or stock scenes that imply an unapproved service, staffing level, availability, result, or location;
- AI-generated people presented as real patients, clinicians, leaders, or facilities;
- testimonials or outcome imagery without a separately approved evidence/consent/legal basis;
- benchmark or competitor assets, traced logos, copied compositions, third-party logos without relationship/rights evidence, or unapproved partner/insurer coverage implications.

When an informative asset is unavailable, expired, or withdrawn, preserve the complete text content and use the specified neutral fallback or omit the media. Never retain an outdated image merely to protect layout.

## Content publication checklist

- [ ] Canonical record, stable public ID, owner, source, status, review date, and expiry exist.
- [ ] Clinical/operations/privacy/HR/brand approval is attached where applicable.
- [ ] English and required Amharic content are professionally reviewed; missing-equivalent behavior is explicit.
- [ ] Claims include scope, limitations, location/availability, source date, and withdrawal behavior.
- [ ] Related records are bidirectionally current and approved; no relationship is inferred from proximity or old-site linking.
- [ ] Contact, entrance, hours, emergency, schedule, and vacancy facts passed their required operational test.
- [ ] Search, navigation, metadata, structured data, sitemap, cache, and redirect behavior follow publication/retirement status.
- [ ] Optional sections with no approved records are omitted instead of filled with plausible copy.
