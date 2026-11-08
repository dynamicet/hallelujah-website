# Shared visual checks

The browser runner is owned by this repository in `scripts/lib/visual-browser.mjs`.
It uses Node's WebSocket support and a local Chromium executable, with no design
skill dependency or additional npm package. Run commands from the repository root
with the supported Node version. Start the current site with `pnpm dev` first.

| Command | Coverage |
| --- | --- |
| `pnpm visual:check / /doctors` | Fresh full-page captures at 390, 768, and 1440px; basic structure, overflow, image loading, and console errors |
| `pnpm visual:hero` | Existing home hero layout, focus, and fallback contracts |
| `pnpm visual:signature` | Desktop scroll-responsive image scenes, compact fallback, stop/reverse behavior, stable copy, live resize/reduced motion and keyboard section links |
| `pnpm visual:choreography` | Full-home reading sequence, reverse/fast scrolling, focus settling, section accents, reduced motion and client navigation |
| `pnpm visual:interactions` | Care-mode keyboard/query continuity, deduplicated organization listing and disclosure focus, menu focus/Escape, reduced motion and no-JavaScript fallback |
| `pnpm visual:search-feedback` | Doctor/service pending and updated result counts, retained keyboard focus, repeated search/filter submissions, empty results, reduced motion and native GET fallback |
| `pnpm visual:clinician-playback` | Uninterrupted client navigation at three widths and normal/4× CPU, two samples each; records frame intervals and long tasks, asserts a 20ms mean-frame budget and document reuse. Run alone; no screenshots or physical-device/GPU certification |
| `pnpm visual:clinician-transition` | Directory → profile portrait/name transitions at three widths, paused start/middle/end frames, keyboard activation, filtered browser history, reduced motion (including a live change), and initials/no-JavaScript fallback |
| `pnpm visual:foundation` | Anchored disclosure controls, intermediate open/close geometry, keyboard and reduced motion at three widths |
| `pnpm visual:motion` | Existing home motion, live reduced-motion, and static fallback contracts |
| `pnpm visual:care-continuity` | Service → doctor → appointment context, keyboard care editing, validation, and unrelated-service rejection at three widths |
| `pnpm visual:appointment` | Appointment error focus and keyboard recovery, retained choices, date limits, review validation, retry editing, unsure-care guidance, long-script text, repeat-submit protection, completion/restart, consent clearing and synthesized cached-page lifecycle recovery at three widths; unknown/duplicate/delivery-warning recovery on mobile |
| `pnpm visual:help` | Help access on home/directory, two-option menu, guide topics/replies, keyboard dismissal/return, reset/reopen, profile/service appointment context, reduced motion and failed-download retry at phone/tablet/desktop/short viewports |
| `pnpm visual:quality` | Public-page skip links, control names and fragment targets; keyboard section jumps, feedback recovery, health-reader focus, navigation and help dismissal |
| `pnpm visual:journeys` | Existing six-route responsive checks, service selection, mobile navigation, and reduced motion |

Use `HH_PREVIEW_URL=http://localhost:3001 pnpm visual:check /` for another preview.
Set `CHROME_PATH` if automatic Chromium discovery cannot find the executable.
These checks require an environment that permits browser processes and local
connections. A browser startup failure is a blocked check, never a visual pass.

Every command prints a new `artifacts/visual-checks/<time>-<check>-<unique>/`
directory. `run.json` records the check, preview URL, source commit, tracked dirty
state, times, and automated result. The generic responsive check also writes
`measurements.json`. Failed checks retain their available evidence and error.
Run directories are ignored by Git and are never overwritten by later runs.

Confirm the preview serves current changes. Inspect the generated screenshots,
then record visual findings separately in that run directory, including which
files were opened. Set `visualInspection` in `run.json` to `passed` or `failed`
only after that review. Re-run after further edits. Commit metadata identifies
the checkout, but does not fingerprint uncommitted files or a separately hosted
preview. Untracked files are not included in the dirty-state flag.

These checks do not prescribe an art direction. Other agents and design skills
can use the same runner. Page-specific checks may need deliberate updates when
their asserted page contracts change. Automated passes do not establish aesthetic
quality, assistive-technology behavior, cross-browser parity, or production readiness.
Old reports and captures remain historical records and cannot validate current work.

D5 reader and disclosure continuity: `pnpm visual:reading` checks keyboard opening/return, original result and scroll restoration, nested transcript closure, reduced motion and the native no-JavaScript story fallback at 390/768/1440px. Inspect its captures separately from the automated result.

D5 full article journeys: `pnpm visual:editorial` checks homepage and filtered archive sources, keyboard chapter links and card focus return, browser Back/Forward, short-article guide omission, reduced motion and no-JavaScript anchors.

### D6 media experience

`pnpm visual:stories` checks the patient-story cinema dialog at phone, tablet,
desktop and short landscape sizes: keyboard focus containment/return, transcript
reading, Escape/Close/backdrop dismissal, page-position restoration, reduced
motion and the native inline video fallback without JavaScript. Inspect the
fresh captures separately from the automated result.

Run `pnpm visual:media` against the current preview for poster-first activation, keyboard playback/return, finite playback, off-screen pause, reduced motion, Save-Data, failure/retry, and native story player checks. See [D6 media experience](visual-design/motion/media-experience.md) for scope and limitations. Inspect the fresh screenshots and record findings in the run directory.

### D7 integrated journey quality

`pnpm visual:journey-quality` verifies reading and chapter landing positions at five viewport shapes, including 320px reflow and a short landscape window. It records a warmed-image scroll sample, layout-shift sources, long tasks and frame timing, including 4× CPU samples. These are local diagnostics, not production Core Web Vitals or physical-device certification. See [D7 findings and limits](visual-design/motion/journey-quality.md).

`pnpm visual:cross-browser` uses an optional isolated Playwright installation. Set `HH_PLAYWRIGHT_MODULE` to its absolute `index.mjs` path and install the matching Firefox/WebKit engines first. For example, install `playwright-core@1.57.0` in a temporary tools directory with `npm install --prefix /tmp/hh-browser-tools playwright-core@1.57.0`, then run that package's `cli.js install firefox webkit`. The website gains no runtime dependency. Set `PLAYWRIGHT_BROWSERS_PATH` consistently if isolating downloaded engines. Host libraries must also support the engines; a failed launch is retained as a failed run. `HH_BROWSER_ENGINES=firefox` selects one engine explicitly; the default checks both. A single-engine pass is not a cross-browser release pass.

Both commands create the standard unique evidence directory. Open their fresh screenshots and record visual inspection separately. The development-only enhanced homepage and the normal optimized-build fallback are different experiences; identify the preview actually inspected.
