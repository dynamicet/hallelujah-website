# H5 film control and popup review — 2 November 2026

Scope: preserve the existing circular play button and native dialog. Review the running site before changes; refine this component within the existing brand. No new direction, imagery, footage or dependencies.

## ROUND 1 — before

Seen in one second: a clear play circle; an oversized popup header before the film.

Idea (one sentence): the hero photograph invites a visitor into a film through a restrained circular control.

Live thing: user-activated film playback in a dismissible modal.

Layout words by section: hero=photo overlay / popup=heading, notice, video.

Scores (component only): design 7 · usability 6 · creativity 7 · content 5 → overall 6.5.

Caps applied: preview footage limits content to 5; no full-page score claimed.

Top three problems:

1. `before/844-dialog.jpg`: playback controls fall below the visible panel. Size the landscape player against the available viewport height.
2. `before/390-dialog.jpg`: the long note precedes the video and adds three lines to the header. Use a shorter note below the player, keeping its disclosure accessible.
3. `before/768-button.jpg`: the play circle sits 72px above the photo edge despite a 24px side inset. Align its corner spacing. On phones use the left corner to separate it from fixed Help throughout scrolling.

## ROUND 2 — after

Seen in one second: the film leads; the heading and close control form a compact header.

Idea (one sentence): the existing hero photo and white play circle lead into a focused film frame.

Live thing: the same user-activated player, with existing playback and dismissal behavior.

Layout words by section: hero=photo overlay / popup=heading, video, note.

Scores (component only): design 8 · usability 8 · creativity 7 · content 5 → overall 7.5.

Caps applied: preview footage still limits content to 5. Visual refinement does not approve the footage for public use.

Top three findings after refinement:

1. `after/844-dialog.jpg`: the complete 339px-high panel fits within a 390px-high viewport, including native playback controls. No internal scrolling is required.
2. `after/390-dialog.jpg`: the panel is 46px shorter and the video is 8px wider. The disclosure remains readable below the player.
3. `after/390-button.jpg`: the 56px circle remains prominent over the photo and occupies the opposite side from Help. Desktop and tablet keep their 72px and 60px circles.

Remaining limitation: the abstract test footage is unchanged. The native browser determines the compact video controls at narrow widths. No custom video-control redesign was introduced.

## Evidence and checks

Before and after captures were opened and compared at 1440 × 900, 768 × 1024, 390 × 844, 320 × 740 and 844 × 390. All five viewports had no horizontal overflow; all five passed Escape, focus return, and body scroll unlocking. Additional interaction results are in `after/interactions.json`.

The homepage inspector's ten final screenshots were also opened. It reports 0 FAIL and 5 WARN. Card rows and type-size count concern other homepage sections; carousel scrolling is an existing deliberate carousel; tablet text alignment concerns other sections. The no-footage heuristic does not count a closed dialog's video and is not a reason to add an autoplay background clip. These are documented scope limits, not a claim that every homepage warning was fixed.

TypeScript, focused ESLint, changed-source design lint (0 FAIL, 0 WARN), and production build passed. No assets or sample facts were added. Existing illustrative photography and test footage remain.
