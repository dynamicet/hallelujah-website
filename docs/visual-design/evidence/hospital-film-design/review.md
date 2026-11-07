# Hospital film section review

Direction: retain the established Hallelujah teal and typography; give the
corrected footage its own uninterrupted frame. This is a section refinement,
so no new direction draw or palette was introduced.

References reviewed:

- [Royal Melbourne Hospital](https://www.thermh.org.au/): clear separation of
  care information and imagery, with simple Play/Pause access for its film.
- [Spring Health](https://www.springhealth.com/): concise headlines and care
  actions informed the text hierarchy. Its page text was available; the browser
  screenshot did not render usable content.
- [Teladoc Health](https://www.teladochealth.com/): individual service sections
  pair imagery with short descriptions and direct care links.

No reference imagery or footage was copied. Existing user-supplied exports and
the source notes in the original evidence folder are retained unchanged.

ROUND 1

Seen in one second: a darkened equipment shot with a generic hospital heading.
Idea (one sentence): the detail in the supplied clinical footage should carry
the introduction instead of disappearing behind promotional text.
Live thing: pause/resume the film, then follow services or visit guidance.
Layout words by section: care focus=split / hospital=overlay / doctors=portraits.
Scores: design 6.5 · usability 7 · creativity 6 · content 7 → overall 6.6.
Caps applied: familiar category composition limits creativity.
Top three problems (visible in the original `care-background-film` screenshots):
1. The broad scrim obscures the corrected wide footage. Remove it.
2. Copy competes with detail in the film. Place the introduction above it.
3. The text-symbol control feels detached. Use stable SVG icons and an explicit label.

ROUND 2

Seen in one second: a hospital introduction followed by a bright, framed film.
Idea (one sentence): the clinical detail becomes the subject of the section,
with the hospital introduction and care actions framing it.
Live thing: native pause/resume, services, and visit links.
Layout words by section: care focus=split / hospital=editorial film / doctors=portraits.
Scores: design 8 · usability 8 · creativity 7 · content 7 → overall 7.7.
Caps applied: the concept remains usable by other hospitals; creativity capped at 7.
Top three remaining limitations:
1. The supplied loop shows equipment and writing rather than the hospital's
   own people and spaces. No footage was invented to fill that gap.
2. Full portrait framing makes the mobile chapter relatively long. It preserves
   the user's corrected crop and adds no scroll runway or pinned playback.
3. The wider homepage retains typography and partner-carousel warnings outside
   this section; these were not expanded into an unrelated redesign.

Verification: Chromium at 1440, 1024, 768, 390, 320 pixels and 390×568. Assertions
cover advancing muted frames, native aspect ratio, copy outside the film, no
overflow, controls, reduced motion, data saving, failed video, no JavaScript,
and the retained consultation image. Full-page inspector: zero failures and
four warnings at desktop/tablet/mobile. Production build (with TypeScript),
focused lint, homepage contracts and initial asset budgets pass. Homepage initial
JavaScript: 153,450 compressed bytes, below the 153,600-byte limit.
