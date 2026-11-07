# D6 — Deliberate media experiences

D6 extends the homepage’s reading rhythm into its existing care film and illustrated stories. It adds no footage, provider, runtime dependency, or authenticity claim. Existing fictional-story notices remain visible.

## Film presentation and continuity

The care film opens as an art-directed still with an editorial caption and a clearly labeled Play control. Controls sit on opaque brand-colored surfaces. Media geometry is reserved at each breakpoint. The video fades over the poster only when a frame is playing (600 ms); a thin progress rule tracks the finite film (250 ms updates). Finishing restores the still with an invitation to replay. No loop or automatic viewport playback remains.

The illustrated story player opens with a bounded 6 px / 400 ms entrance. Native video controls, captions, and the independently expandable transcript remain available. A quiet status row identifies ready, loading, playing, paused, ended, and failed states.

## Activation and control

Care-film source URLs are assigned only inside the visitor’s Play action. The same focused button changes between Play, Pause, Resume, and Replay. Return to still clears the source and restores focus to Play. Scrolling fully out of view or hiding the document pauses playback; returning does not resume it automatically. Navigation cleanup disconnects observers/listeners and clears the source. Pending play rejections cannot overwrite a newer stop/retry state.

Story players pause when their disclosure closes, when they leave view, when the document is hidden, and when another story begins. They retain native seeking and playback controls. They use preload=none; the stricter zero-source-before-activation assertion is specific to the decorative care film.

## Intentional fallback states

Reduced motion keeps the decorative care film as a still, including when the preference changes during playback. Foreground story playback remains explicitly available with entrance animation removed. Save-Data has the same poster-first behavior and permits deliberate Play. Without JavaScript the care still and caption remain complete, with enhancement controls hidden; native story disclosures, videos, and transcripts remain usable.

Failed care-film loading restores the poster, releases the source, and offers Try film again. Story failure directs readers to the transcript. No media error blocks care links or page navigation.

## Verification

`pnpm visual:media` checks three widths (390, 768, 1440), keyboard activation and return focus, no care-film request before activation, stable frame height, pause/resume, finite completion, off-screen pause without automatic resume, reduced motion, story playback and pause, Save-Data opt-in, blocked-source recovery and retry, and no-JavaScript fallback. Expected blocked-media errors are isolated from the normal-route console-error assertions.

Run `pnpm visual:check /` for fresh structural/full-page evidence. Open the resulting images and record visual inspection separately in each run directory.

D7 still owns full journey pacing, cross-browser/device profiling and assistive-technology review. Local Chromium checks do not establish those results or approve production media rights.

Fresh local evidence (6 November 2026):

- `artifacts/visual-checks/2026-11-06T12-58-05.265Z-media-experience-FQ4E20`: behavior checks passed; all 13 captures opened and inspected.
- `artifacts/visual-checks/2026-11-06T12-59-07.935Z-responsive-gTBf0G`: homepage structure checks passed at all three widths; all three full-page captures opened and inspected.

TypeScript and targeted ESLint passed. Earlier failed runs remain recorded as failed; they led to a rapid pause/resume race fix and a test wait for asynchronous preference changes.

## D6 creative extension

The care-film poster now uses a large two-line editorial invitation over a shaded image, with a compact status label instead of the full-width caption strip. At compact widths the frame is 4:3 to preserve room for the invitation and fixed-position controls. The title yields by 12 px / 260–450 ms at activation; the shade recedes over 600 ms. The film stays unobscured while paused. Finite completion restores the invitation over 500 ms. Reduced-motion renders the composed still without these transitions. This is an authored state transition, not a shared-element effect or a new video asset.

Each playable story portrait offers a labeled film entry point. Activation opens the existing native disclosure and focuses its summary below the sticky header; it never starts playback. A matching accent connects the portrait invitation to the expanded player and transcript. The portrait arrow has 3 px hover/focus feedback with a stable hit area.

The player status now names the person whose story is being viewed. A permanently reserved “Read in words” action pauses the film, opens its transcript, and focuses the transcript summary. On completion it becomes “Continue in words,” with a bounded 300 ms entrance treatment and no inserted layout space. Readers can also use the existing native transcript disclosure. JavaScript-only entry/handoff controls are hidden without hydration.

Extended automated coverage includes portrait-entry keyboard focus, completion-to-transcript focus and header clearance, and fresh captures of portrait, playback, and transcript states at all three widths.

Caption inspection also exposed overlong native cue lines. Both existing 48-second silent preview tracks now use six 8-second cues, wrapped to 38 characters with 90% cue width. A word-by-word comparison confirmed that the original wording is preserved.

Final creative-extension evidence:

- `artifacts/visual-checks/2026-11-06T13-08-36.798Z-media-experience-cTCmkg`: all media assertions passed; all 19 captures opened and inspected.
- `artifacts/visual-checks/2026-11-06T13-09-12.126Z-responsive-mNPtHt`: all homepage structural assertions passed; all three full-page captures opened and inspected.
- TypeScript, targeted ESLint, and diff whitespace checks passed. These captures supersede the earlier D6 compositions for the changed components.
