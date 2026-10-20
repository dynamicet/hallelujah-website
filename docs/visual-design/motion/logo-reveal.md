# First home entry

The root layout mounts the loading overlay before the content wrapper. Home's
hero contains no logo animation. The pre-paint entry script enables the overlay
only for an initial document at `/`, and records `hallelujah-logo-entry-v2` in
sessionStorage before playback. Reloads and subsequent route changes do not replay
it; storage failure skips the overlay. Session scope follows browser tab storage.

The SVG filter extracts boundaries from the original 280×252 emblem, removes all
color and interior fill, and preserves its proportions and silhouette. A vertical
reveal runs for 1000ms and dismisses the overlay on completion. The source artwork
is unchanged. This is a raster-derived outline, not a new vector master.

Reduced motion shows the static outline briefly (200ms after image decoding), then
releases the page. Preference changes finish playback immediately. Image decode or
animation errors also finish immediately. Independent script and CSS deadlines
release the content within 1800ms even if the animation script fails. With JavaScript
disabled, blocked entry script, or unavailable session storage, content is visible
immediately and the overlay stays hidden. Hidden content cannot receive keyboard
focus during the short entrance; its visibility is restored without moving focus.

Run `pnpm dev`, then `node scripts/check-logo-reveal.mjs`. The Chromium check covers
desktop/mobile screenshots, content hidden behind the entrance, removal from the
hero, dismissal, session reload, reduced motion, blocked scripts, unavailable
storage, and no JavaScript. Screenshots are saved under ignored
`artifacts/visual/logo-reveal/`. Use `LOGO_TEST_ORIGIN` for another local server.
