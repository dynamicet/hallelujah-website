# Shared visual checks

The browser runner is owned by this repository in `scripts/lib/visual-browser.mjs`.
It uses Node's WebSocket support and a local Chromium executable, with no design
skill dependency or additional npm package. Run commands from the repository root
with the supported Node version. Start the current site with `pnpm dev` first.

| Command | Coverage |
| --- | --- |
| `pnpm visual:check / /doctors` | Fresh full-page captures at 390, 768, and 1440px; basic structure, overflow, image loading, and console errors |
| `pnpm visual:contact` | Header → homepage contact section → Contact page at 320/390/768/1440px; mobile menu focus handoff, return link, preparation deep link, section shortcuts and header clearance, native contact targets, Help clearance, normal/reduced motion, skip navigation, touch and no-JavaScript directions shortcut |
| `pnpm visual:language` | Language selection, directory navigation, retained form steps/values, guide controls, feedback text preservation and storage-denied fallback |
| `pnpm visual:language-loading` | On-demand Amharic messages, keyboard selection/focus return, reload persistence, editorial preservation, failed-download recovery and retry at three widths |
| `pnpm visual:specialists` | Featured homepage specialists: desktop/tablet row controls and directory end panel, compact three-row mobile list, keyboard profile access, resize focus recovery, live reduced motion and native no-JavaScript scrolling |
| `pnpm visual:hero` | Existing home hero layout, focus, and fallback contracts |
| `pnpm visual:signature` | Remaining portrait/story image scenes, compact fallback, stop/reverse behavior, stable copy, live resize/reduced motion and doctor-section link; current desktop portrait progress assertion remains unresolved (see homepage-distillation notes) |
| `pnpm visual:choreography` | Full-home reading sequence, reverse/fast scrolling, focus settling, section accents, reduced motion and client navigation |
| `pnpm visual:interactions` | Care-mode keyboard/query continuity, separate native organization disclosures and retained keyboard focus, menu focus/Escape, reduced motion and no-JavaScript fallback |
| `pnpm visual:search-feedback` | Doctor/service pending and updated result counts, retained keyboard focus, repeated search/filter submissions, empty results, reduced motion and native GET fallback |
| `pnpm visual:clinician-playback` | Uninterrupted client navigation at three widths and normal/4× CPU, two samples each; records frame intervals and long tasks, asserts a 20ms mean-frame budget and document reuse. Run alone; no screenshots or physical-device/GPU certification |
| `pnpm visual:clinician-transition` | Directory → profile portrait/name transitions at three widths, paused start/middle/end frames, keyboard activation, filtered browser history, reduced motion (including a live change), and initials/no-JavaScript fallback |
| `pnpm visual:foundation` | Anchored disclosure controls, intermediate open/close geometry, keyboard and reduced motion at three widths |
| `node scripts/check-partner-loop.mjs` | Compatibility alias for current component interactions; the automatic partner loop was replaced by native disclosures |
| `pnpm visual:motion` | Existing home motion, live reduced-motion, and static fallback contracts |
| `pnpm visual:care-continuity` | Specialty filters; care → doctor and doctor → care → appointment; joint selections, compatible editing, invalid context, team-only care, keyboard recovery, reduced motion and four local preparation paths without patient-data delivery/storage at three widths |
| `pnpm visual:appointment` | Appointment error focus and keyboard recovery, compatible choices, date limits, review validation, local preparation and retained editing, unsure-care guidance, long-script text and synthesized cached-page lifecycle cleanup at three widths; explicit example receipt/retry/unknown/duplicate/delivery-warning states remain separate from normal local preparation |
| `pnpm visual:help` | Stable Help anchor and clearance from controls while scrolling home/directory/topic pages, keyboard access, two-option menu, guide topics/replies, spelling confirmation and topic clarification, session care follow-ups, contact actions, keyboard dismissal/return, reset/reopen, profile/service appointment context, reduced motion and failed-download retry at phone/tablet/desktop/short viewports |
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

Run `pnpm visual:media` against the current preview for native About-film controls and the retained story player, transcript, and reduced-motion checks. The former homepage film controller, its Save-Data/retry states, and the partner loop were retired during [homepage distillation](visual-design/refinements/homepage-distillation.md). See [D6 media experience](visual-design/motion/media-experience.md) for scope and limitations. Inspect the fresh screenshots and record findings in the run directory.

### D7 integrated journey quality

`pnpm visual:journey-quality` verifies reading and chapter landing positions at five viewport shapes, including 320px reflow and a short landscape window. It records a warmed-image scroll sample, layout-shift sources, long tasks and frame timing, including 4× CPU samples. These are local diagnostics, not production Core Web Vitals or physical-device certification. See [D7 findings and limits](visual-design/motion/journey-quality.md).

`pnpm visual:cross-browser` uses an optional isolated Playwright installation. Set `HH_PLAYWRIGHT_MODULE` to its absolute `index.mjs` path and install the matching Firefox/WebKit engines first. For example, install `playwright-core@1.57.0` in a temporary tools directory with `npm install --prefix /tmp/hh-browser-tools playwright-core@1.57.0`, then run that package's `cli.js install firefox webkit`. The website gains no runtime dependency. Set `PLAYWRIGHT_BROWSERS_PATH` consistently if isolating downloaded engines. Host libraries must also support the engines; a failed launch is retained as a failed run. `HH_BROWSER_ENGINES=firefox` selects one engine explicitly; the default checks both. A single-engine pass is not a cross-browser release pass.

Both commands create the standard unique evidence directory. Open their fresh screenshots and record visual inspection separately. The development-only enhanced homepage and the normal optimized-build fallback are different experiences; identify the preview actually inspected.

`node scripts/check-home-distill.mjs` verifies keyboard access from the homepage to the full topic browser and About equipment section, destination-anchor focus, equipment disclosures, normal/reduced motion, and native links without JavaScript.

`node scripts/check-home-visit.mjs` verifies the homepage's visible preparation
checklist, two independent native disclosures, keyboard focus and opening/closing,
live reduced motion, computed confirmation-text contrast, full-guide navigation,
and no-JavaScript fallback at the supported widths. Inspect its collapsed and
expanded captures separately from the automated results.
