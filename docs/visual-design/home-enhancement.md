# Homepage enhancement review — 2 November 2026

> Evidence availability (8 November 2026): some historical captures referenced below are absent from this checkout. Their filenames are retained as archive references, not current verification evidence. Rerun the documented checks for fresh evidence.

Implemented locally in the existing Next.js application. Publication is outside this
pass. The ready local preview at `/` uses the new composition; controlled and governed
homepage specimens retain their eligibility, omission and unavailable-state contracts.

## Result and evidence

The opening now identifies the hospital, offers an immediate appointment action and
leads into one Doctor/Service search. The query survives switching modes. The page
continues through concern browsing, an image-led specialty explorer, three clinicians,
a coordinated human-care chapter, visit preparation/arrival, partners, and editorial
reading. The shared light header keeps its main bar available while utilities scroll
away; the teal footer closes with an appointment action.

| Evidence | Desktop | Tablet | Mobile |
| --- | --- | --- | --- |
| Before | 1440px (unavailable archive: `evidence/home-enhancement/before/desktop-fold.jpg`) | 768px (unavailable archive: `evidence/home-enhancement/before/tablet-fold.jpg`) | 390px (unavailable archive: `evidence/home-enhancement/before/mobile-fold.jpg`) |
| After | 1440px (unavailable archive: `evidence/home-enhancement/after/desktop-fold.jpg`) | 768px (unavailable archive: `evidence/home-enhancement/after/tablet-fold.jpg`) | 390px (unavailable archive: `evidence/home-enhancement/after/mobile-fold.jpg`) |

Full-page contact sheets are alongside each fold capture. Additional full-page
captures cover 1024px (unavailable archive: `evidence/home-enhancement/after-1024.jpg`) and
320px (unavailable archive: `evidence/home-enhancement/after-320.jpg`). A
320×568 capture (unavailable archive: `evidence/home-enhancement/short-mobile.jpg`) confirms the primary
action fits the short first screen. The 200% equivalent (unavailable archive: `evidence/home-enhancement/zoom-200.jpg`)
uses a 720×450 CSS viewport at device scale 2; this is not a substitute for manual
browser text-zoom testing. The appointment specimen suite separately covers 200% text.

Final motion recordings: [hero continuity](evidence/home-enhancement/hero-motion.webm)
and [human-care expansion](evidence/home-enhancement/human-motion.webm). These are
12fps sequences of actual browser frames captured while scrolling, not wall-clock
performance recordings. The baseline has still screenshots only. The
desktop scene sheet (unavailable archive: `evidence/home-enhancement/scenes/scene-1-desktop.jpg`),
phone sheet (unavailable archive: `evidence/home-enhancement/scenes/scene-1-phone.jpg`), and
reduced-motion sheet (unavailable archive: `evidence/home-enhancement/scenes/reduced-desktop.jpg`) show the
hold, exit and settled alternatives. Headless scene sampling reported 66 frames,
16.7ms median and no frames above 34ms; this is a rough local observation.

## Validation

- TypeScript and production build pass; focused ESLint passes without warnings.
- Homepage, canonical-contact, governed-content, search, shell, care-journey,
  health-finder and patient-guide contracts pass. New `home-enhancement:check`
  validates both native GET paths, the no-JavaScript forms, specialty fallback
  destinations, exclusive selection and responsive asset geometry.
- [Browser interaction results](evidence/home-enhancement/interaction-results.json)
  cover both search submissions, query preservation, three canonical profiles,
  stable specialty geometry, guide opening/focus return, story and visit disclosures,
  topic browsing, native menu Escape dismissal, language availability, five widths,
  short mobile, reduced motion, no JavaScript, failed images and route changes during motion.
- Shared-shell screenshots cover doctor/service directories, appointment, visitors
  and emergency. All three featured profile destinations return 200. Language
  access retains the existing explicit Amharic-unavailable state; no translation
  availability is invented.
- Accessibility-tree names were checked for the heading, search mode, query and
  guide action; [named controls](evidence/home-enhancement/accessibility-labels.json)
  are recorded. Keyboard Escape and focus return were exercised. Help-widget
  collision checks pass at all five widths; captions are now included as obstacles.
  A manual screen-reader session was not performed.
- Appointment rendered regression passes 284 responsive, capability, interaction,
  accessibility and isolation cases. The actual Next.js route also enables its safe
  form and advances to the details step after the controller bundle split.
- Built-asset budgets pass: homepage 153,337 compressed JavaScript bytes against
  153,600; 205,320 initial compressed HTML/JS/CSS bytes; 13 initial requests; no
  external origins. This budget script excludes image and font transfer. The JS
  margin is small, so future interactive features need another budget check.
- `git diff --check` passes. Repository-wide `format:check` remains failing on
  pre-existing generated reports/artifacts and the bundled Lato license whitespace.
  New and changed task files pass the same whitespace/newline policy; unrelated
  historical artifacts were left alone.

Final [visual inspector report](evidence/home-enhancement/after/report.json): zero
failures at 1440, 768 and 390. One explicit allowance, `covered-text`, addresses the
inspector measuring blockquotes inside closed native `<details>` as covered text.
Their closed and opened behavior was separately exercised. Four warnings remain:
plus/minus controls use the text face beside display labels; the retained shell
and editorial wordmark use more than five sizes; still imagery intentionally
replaces film per the brief; and the existing partner band retains sideways
browsing with controls and a View all option.

## Art direction and critique

The dealt direction was **Photographs at uneven sizes**, seed **564105115**;
[direction record](evidence/home-enhancement/direction.json). No redraws. The user's
specified section order, large full-width hero and existing palette/type take
precedence over the dealt hero and atmospheric photograph suggestions. No reference
website imagery was downloaded.

Subject inventory: Hallelujah name and emblem, Ethiopian care context, teal/navy/cyan,
Clash/Lato/Ethiopic faces, stable preview clinician identities, Doctor/Service GET
routes, existing care guide, visit-request semantics, unverified arrival details,
fictional stories and existing institutional figures. The page's argument is:
find care immediately; explore a concern; compare specialties; recognize a doctor;
bring daily life into the conversation; prepare and arrive; read further.

ROUND 1
Seen in one second: hospital care and a clear appointment action.
Idea (one sentence): Hallelujah's whole-life care conversation becomes a sequence of human images and practical care choices.
Live thing: unified care search and synchronized specialty explorer.
Layout words by section: hero=image field / concern=open directory / specialty=unequal split / doctors=portrait row / human=expanding colour chapter / visit=disclosures and illustration / news=lead and links / footer=teal close.
Scores: design 6 · usability 6 · creativity 6 · content 6 → overall 6.0.
Caps applied: initial contrast and unfinished-image failures.
Top three problems (most visible first), each with the screenshot it shows in and the fix:
1. Dark headings disappeared into the human-care field (desktop-page-02): inherit the chapter's white text.
2. Asset generation was incomplete during first capture (desktop-page-02): finish and verify every AVIF/WebP derivative.
3. Tablet portraits wrapped into an uneven second row (tablet-page-01): keep all three in one row until the mobile entry layout.

ROUND 2
Seen in one second: a clearer hospital introduction with useful care choices.
Idea (one sentence): Hallelujah's whole-life care conversation becomes a sequence of human images and practical care choices.
Live thing: query-preserving directory search and service image selection.
Layout words by section: hero=image field / concern=open directory / specialty=unequal split / doctors=portrait row / human=expanding colour chapter / visit=disclosures and illustration / news=lead and links / footer=teal close.
Scores: design 6.5 · usability 7.5 · creativity 6 · content 7 → overall 6.8.
Caps applied: generated concept imagery cannot supply authentic subject photography.
Top three problems (most visible first), each with the screenshot it shows in and the fix:
1. Mobile utilities occupied 188px (mobile-fold): fix intrinsic contact-grid sizing to reduce the utility row to 92px.
2. Arrival repeated the editorial illustration (mobile-page-01): generate a dedicated fictional arrival scene with an explicit caption.
3. Figure disclosure lost the page gutter (desktop-page-02): place its paragraph inside the shared frame.

ROUND 3
Seen in one second: Hallelujah General Hospital, whole-life care, request an appointment.
Idea (one sentence): Hallelujah's whole-life care conversation becomes a sequence of human images and practical care choices.
Live thing: care search and the specialty image/copy/destination selection.
Layout words by section: hero=image field / concern=open directory / specialty=unequal split / doctors=portrait row / human=expanding colour chapter / visit=disclosures and illustration / news=lead and links / footer=teal close.
Scores: design 6.5 · usability 8 · creativity 6 · content 7 → overall 7.0.
Caps applied: fictional/generated imagery; the care concept can fit another hospital.
Top three problems (most visible first), each with the screenshot it shows in and the fix:
1. The imagery cannot establish this hospital's actual people or place (all image sections): replace with approved hospital photography in the later content pass.
2. The mobile hero has generous dark-wall space in its landscape crop (mobile-fold): consider a hospital-approved portrait crop when authentic photos arrive.
3. Practical contact copy remains an unavailable-data state (mobile-page-01): replace only after address, entrance and contact verification.

All final fold and full-page inspector screenshots, and all three scene sheets,
were opened and reviewed. Gate corrections were checked within these three design
rounds; there is no claim of award-level or publication-ready content.

## Assets and remaining limits

Generated with the built-in imagegen tool: general-medicine, heart-care and
rehabilitation scenes, plus a fictional arrival illustration. The existing
`hope-care.webp` and `together-care.webp` supply hero and wide human-care imagery.
The existing clinician portraits preserve identity continuity. Responsive AVIF and
WebP variants live in `apps/web/public/editorial/`; exact prompts, source IDs and
reproduction instructions are in
[HOME-ENHANCEMENT.txt](../../apps/web/public/editorial/HOME-ENHANCEMENT.txt).
No found photographs or external clips were used, so there are no new stock-image
licenses or credits. Existing font/partner provenance remains in the repository.

Hospital data, contacts, biographies, availability, figures, patient stories,
editorial dates and people remain preview material. The existing bilingual
infrastructure and unavailable-language messaging are preserved. This pass adds
no API, database or CMS migration, no animation dependency and no publishing step.

The browser assertion script is retained at
[evidence/home-enhancement/review-browser.mjs](evidence/home-enhancement/review-browser.mjs).
Run it from the repository root with `HOME_REVIEW_BROWSER_DRIVER` set to the local
design-taste-frontend skill's `scripts/lib/cdp.mjs` module and the preview on port
3000; `HOME_REVIEW_ORIGIN` can override the origin.
