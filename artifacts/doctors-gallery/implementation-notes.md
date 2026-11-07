# Doctors gallery — 1 November 2026

The brief prioritizes recognizable people and names, with a stronger visual
composition for this part of the homepage. Retained the existing One motif
direction (seed 238462439), brand palette and typography; no redraw or new assets.

The doctors become a portrait gallery on a full-width deep teal field. Portraits
and names lead; specialty and language remain supporting information. Each of the
six profiles has equal prominence and retains its existing destination. The upper
corner crop echoes the hospital site's established motif. No image overlays,
autoplay, hidden profiles, or extra controls were introduced.

## Responsive composition

| Viewport | Composition | First portrait | Name size |
| --- | --- | --- | --- |
| 1440px | Three-column portrait gallery | 405 × 304px | 36px |
| 1024px | Three-column portrait gallery | 283 × 212px | 28px |
| 900px | Three-column portrait gallery | 257 × 193px | 28px |
| 768px | Two columns of portrait/text pairs | 128 × 160px | 28px |
| 600px | One column of portrait/text pairs | 160 × 160px | 32px |
| 390 / 320px | One column of portrait/text pairs | 124 × 155px | 28px |

Previously desktop portraits were 112 × 152px and names 24px. At 1440px the
section increases from approximately 845px to 1320px: deliberately giving people
more visual presence takes space. Tablet uses horizontal portrait/text pairs to
avoid the much taller first-pass image-above-text gallery at that width.

Existing illustrative profiles and AI-generated portrait files are retained,
with their disclosure immediately before the gallery. They still require approved
hospital replacements before representing real clinicians. No found assets or new
clinical claims were added.

## Browser review

ROUND 1
Seen in one second: large faces and doctor names on a deep teal field.
Idea (one sentence): the doctor's recognizable face and name form the section's visual identity.
Live thing: existing direct profile links and doctor directory; all six remain visible.
Layout words by section: hero=cinematic / navigator=choice / health=lookup /
care=showcase / doctors=portrait-gallery / visit=FAQ-contact / partners=logo-row /
statistics=band / stories=paired-editorial / consultation=split / news=editorial-grid /
footer=brand-navigation.
Scores: design 6 · usability 6 · creativity 6 · content 5 → overall 5.9.
Caps applied: heading contrast failed the initial inspection.
Top three problems (most visible first), each with the screenshot it shows in and the fix:
1. Initial doctors-1440.jpg: heading inherited dark text on dark ground. Set explicit white heading text.
2. Initial doctors-1440.jpg: upper hairlines were cropped. Anchor photographs to the top of the source.
3. Initial section-768.jpg: three rows of large gallery portraits made tablet browsing excessive. Use paired portraits and text, with a separate single-column composition below 700px.

ROUND 2 — final screenshots
Seen in one second: recognizable faces, large names, and an explicit doctors heading.
Idea (one sentence): the doctor's recognizable face and name form the section's visual identity.
Live thing: six direct profile links, with a contrasting directory action and visible keyboard focus.
Layout words by section: hero=cinematic / navigator=choice / health=lookup /
care=showcase / doctors=portrait-gallery / visit=FAQ-contact / partners=logo-row /
statistics=band / stories=paired-editorial / consultation=split / news=editorial-grid /
footer=brand-navigation.
Scores: design 7.5 · usability 8 · creativity 6 · content 5 → overall 7.1.
Caps applied: concept remains transferable to another hospital; illustrative content limits authenticity.
Top three problems (most visible first), each with the screenshot it shows in and the fix:
1. section-1440.jpg: the portraits remain illustrative, despite the stronger presentation. Replace with approved clinician photography as part of H2.
2. after/tablet-page-02.jpg: three news items still leave one article on a second row. This is outside this doctors-focused change; retain readable content until a separate editorial composition pass.
3. after/desktop-page-03.jpg: consultation and news repeat the hero photograph. Address through the separate imagery milestone.

Opened all ten final inspector folds/contact sheets, the full doctors section at
1440/768/390px, and focused captures at 600/320px plus keyboard focus. The final
inspector reports **0 FAIL, 4 WARN**. The requested collections justify repeated
items; font-size variety is inherited except the deliberate larger doctor names;
authentic hospital footage is unavailable; the partner strip has existing controls.

## Verification

- `review.mjs`: seven widths (1440, 1024, 900, 768, 600, 390, 320px), no document
  overflow, six loaded portraits, name sizing, disclosure and keyboard focus.
- All six doctor destinations and the directory return HTTP 200.
- All six profiles remain visible without JavaScript; responsive checks use reduced motion.
- TypeScript, focused ESLint, source design lint, 14 home contract cases and
  `git diff --check` passed.
- Final measurements and screenshots are in this directory; full homepage
  inspection evidence is in `before/` and `after/`.

This pass changes the doctors section only. Other proposed homepage polish remains
optional; this is not a new H1 acceptance requirement.
