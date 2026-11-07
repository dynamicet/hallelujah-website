# Equipment showcase

The homepage introduces three selected technologies after Health Topics: C-arm imaging, an integrated laboratory analyser, and panoramic dental imaging. The selection comes from `sources/hospital-profile.json#/technology_as_published`; illustrations remain generic equipment depictions.

## Current composition — 6 November 2026

The selected editorial direction keeps all three devices visible. Large alternating image/text rows remain on desktop; a compact image/text split reduces tablet length, and phones stack image then copy with tighter spacing. An open lineup beside the desktop heading uses three transparent device cutouts as native jump links. The machines retain distinct proportions and short labels; the mobile lineup stays in one compact row, with the heading above. There are no individual card frames. They stay in normal page flow so they do not cover device headings during scrolling. Their active and focus states remain clear. Deliberate hover or keyboard focus gently lifts the selected object; reduced motion keeps the objects still.

Each device retains a short description, a related care link and the native “Uses & preparation” disclosure with patient and referring-clinician guidance. A quiet “Explore services” link closes the section. The previous heavy action banner is removed. Equipment images and their 3:2 proportions are retained, as are scroll-linked desktop motion and reduced-motion fallbacks.

The cutout sources, final asset paths and built-in image-generation prompts are recorded in [equipment-lineup-assets.md](equipment-lineup-assets.md).

## Temporary imagery

Three images were generated with the built-in image generation tool. They depict
generic devices, not exact HH equipment or manufacturer models. An image credit
at the bottom of the section identifies the illustrations as AI-generated.
No found photographs or external licences are involved.

The final assets are `apps/web/public/editorial/equipment-{c-arm,laboratory,dental}-{640,1440}.{avif,webp}`.
All twelve files together are approximately 405 KB; a browser loads the matching
format and responsive width, not all variants. Images are lazy-loaded and have
explicit dimensions. Exact generation prompts are recorded in
[equipment-visuals.json](equipment-visuals.json).

Replace these images with approved HH photographs at the same aspect ratio (3:2)
or update the component dimensions and asset names when footage arrives. Confirm
the promoted equipment selection and approved copy before publication.

## Current lineup validation

TypeScript, targeted ESLint and patch whitespace checks passed. Fresh responsive checks passed at 390/768/1440px; the existing signature-motion checks passed at all three widths. The final focused run `2026-11-06T20-47-00.156Z-equipment-lineup-N7c0j3` passed at 320/390/768/900/1440px, covering all six images, native chapter focus/landings, disclosures, hover/focus feedback, reduced motion, overflow and browser errors.

Visual inspection was separate: the final mobile/tablet/desktop lineup and full-section context were accepted by the parent and UI reviewer. Desktop pointer capability was explicitly emulated for the hover assertion; the default headless host advertises no hover. The failed earlier pointer-assumption run is retained as diagnostic evidence. The whole-homepage Taste inspector still reports other flags; this is scoped acceptance of the lineup.

## Prior editorial-row validation

TypeScript, targeted ESLint and patch whitespace checks passed. Fresh responsive checks passed at 390/768/1440px. Focused checks at 320/390/768/900/1440px verified loaded images, complete visible chapters, jump-link target/focus/current state and heading visibility, native keyboard disclosure, reduced motion and overflow/browser errors. The existing signature-motion checks also passed at 390/768/1440px.

Visual inspection is recorded separately in `2026-11-06T20-14-32.971Z-equipment-refined-lkltF6`: the final mobile/tablet/desktop layouts were opened and accepted. Tablet section height fell from about 3019px to 1275px while retaining all three devices. A scroll inspection caught and resolved heading coverage by the equipment navigation; the links now remain in normal flow. The whole-homepage Taste inspector still reports other flags; this is a scoped section acceptance.

## Historical verification

The results below describe earlier versions. They do not validate the current composition; fresh checks are recorded separately under `artifacts/visual-checks/`.


TypeScript and targeted ESLint checks pass. Browser checks at 1440, 768, 390 and
320 pixels confirm three loaded images, headings of at most two lines, no page
overflow, and keyboard disclosure activation. No-JavaScript disclosure and reduced
motion fallbacks pass. Service, referral and appointment destinations return 200.
Screenshots and the browser report are in `.taste-skill/equipment/`.

The final design inspector passes at 1440, 768 and 390 pixels with zero failures.
Its four remaining warnings concern the surrounding homepage's mixed headline
styling, warm ground, full-page type scale and horizontal content row. Final
screenshots and measurements are in `.taste-skill/equipment-final-inspect/`.

The repository-wide format command also finds existing missing newlines and
whitespace in older cached visual reports and evidence files. Those files are
outside this section's scope; patch whitespace and final component lint pass.

## Visual critique

ROUND 1
Seen in one second: a large, clearly visible C-arm on a charcoal product stage.
Idea (one sentence): The equipment behind care becomes a distinct photographic chapter.
Live thing: native equipment disclosures with patient and clinician guidance.
Layout words by section: introduction=split / flagship=large image and explanation / supporting=paired products / close=care destinations.
Scores: design 7.5 · usability 8 · creativity 7 · content 7 → overall 7.5.
Caps applied: temporary generic imagery limits subject specificity.
Top three problems (most visible first), each with the screenshot it shows in and the fix:
1. `equipment/1440-expanded.jpg`: flagship details occupied only the right half, leaving excessive empty space. Moved the expanded content below both columns with audience guidance side by side.
2. `equipment/320-2.jpg`: the main action wrapped inside a tall pill. Shortened the label to “Explore services”.
3. Early `equipment/1440-0.jpg`: the anchor target sat under the sticky header. Added header-aware scroll margin and corrected screenshot offsets.

ROUND 2
Seen in one second: equipment presented as the focal point of a distinct dark chapter.
Idea (one sentence): The equipment behind care becomes a distinct photographic chapter.
Live thing: native equipment disclosures with patient and clinician guidance.
Layout words by section: introduction=split / flagship=large image and explanation / supporting=paired products / close=care destinations.
Scores: design 7.8 · usability 8 · creativity 7 · content 7 → overall 7.7.
Caps applied: creativity capped at 7 because the composition can suit another hospital.
Top three problems (most visible first), each with the screenshot it shows in and the fix:
1. `equipment/1440-0.jpg`: the generic image cannot prove HH's exact machine or its rarity. Replace with HH's approved photography and verified distinction when supplied.
2. `equipment/390-1.jpg`: the two smaller machines have equal emphasis. Keep that hierarchy until the actual rare-equipment selection is supplied.
3. `equipment/1440-expanded.jpg`: preparation and referral guidance remains general. Add approved equipment-specific instructions when available.
