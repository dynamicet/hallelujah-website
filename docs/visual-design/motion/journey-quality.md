# D7 — Journey quality and motion hardening

D7 brings D1–D6 together as a visitor journey. This pass uses ui-ux-pro-max; Taste was not used. The expressive scenes, quiet reading intervals and explicit media activation remain the design direction.

## Changes driven by live inspection

| Finding | Result |
| --- | --- |
| Document scroll padding and target scroll margins both included the sticky header | The document owns header clearance. Section, article, reader and story targets add a local 24px margin. Typical target placement is now 40px below the header, rather than adding another header height. Equipment chapters add space for their index only where it is sticky. |
| The equipment index and article aside occupied too much reading space in short desktop/landscape windows | Below 600px viewport height these indexes follow normal flow. Scroll-driven image scenes use the compact entrance fallback in those windows. |
| The floating Help launcher generated repeated layout-shift entries during its collision avoidance | Its painted position now changes with a transform. The same collision and keyboard rules remain in effect. Without JavaScript, Help stays in its reserved footer space so it cannot cover reading content. |
| Built homepage JavaScript exceeded the existing 153,600-byte compressed limit | Stories render on the server; their small interaction controller loads as the chapter approaches. Native accounts, films and transcripts work independently. Optional prototype media code loads only on routes that contain its targets. |

Film, transcript and account summaries share the same landing gap. Story enhancement exposes its custom buttons only after binding succeeds; an unavailable enhancement leaves the native disclosure and video routes available. Story playback still pauses other players, on collapse, offscreen, page hide and document hide. Returning to a summary retains keyboard focus. No visitor scroll is intercepted.

The care-film video no longer duplicates its desktop poster URL. Its responsive picture already supplies the still and the video remains transparent until an actual frame plays. This avoids an eager 57KB desktop poster request, including on mobile; the compact picture can use its 19KB still instead.

## Repeatable checks

- `pnpm visual:journey-quality`: 320×800, 390×844, 768×1000, 1440×900 and 1024×400. Measures a nine-second, warmed-image scroll sample, with 4× Chromium CPU throttling at 390 and 1440px; captures raw frame timing, layout-shift sources and long tasks. Verifies keyboard jumps and the space below the header for stories, film summaries, transcripts, health readers, equipment and article chapters. Includes reduced motion and short-viewport fallbacks.
- `pnpm visual:cross-browser`: optional Firefox/WebKit checks of native timeline support or fallback, keyboard story reading, care-film activation/pause/return, reduced motion, equipment jumps, compact-menu Escape and no-JavaScript reading. Each engine creates its own evidence directory, including failed launches.
- Existing `visual:media`, `visual:reading`, `visual:quality` and responsive captures supply focused regression coverage. These checks and screenshot inspection are reported separately.

The scroll sample is a diagnostic, not a field Core Web Vitals score. Images are decoded before it begins; initial-loading layout shifts are outside that sample. Frame cadence and long tasks are recorded, not assigned an arbitrary pass threshold. The zero-shift assertion applies to the sampled journey. CPU throttling is not a physical low-end Android test.

## Environment and release limits

The enhanced website is explicitly gated to Next development mode by `isLocalDemo()`. An ordinary optimized build renders the fallback experience, so it cannot establish production LCP/INP or production visual parity for this design. This gate is preserved. Initial script resource timing from the development preview includes development tooling and is not the compressed production budget.

The build budget checks actual emitted initial script references; it is separate from runtime loading measurements. Before this pass the homepage measured 155,552 compressed JS bytes; after runtime separation it measured 153,501 bytes, below the unchanged 153,600-byte limit. This is a narrow margin, not capacity for another animation dependency. Media files remain requested only on explicit playback: the mobile care film is approximately 1.1MB WebM / 2.1MB MP4, desktop approximately 2.7MB / 7.2MB; story previews are approximately 79KB and 57KB. File size is not a measurement of bytes actually transferred during a partial viewing.

On this host Firefox 144.0.2 runs. The downloaded WebKit 26.0 engine cannot launch because required system libraries are absent. This does not establish Safari parity. Physical iOS/Android review, VoiceOver/NVDA use and production LCP/INP remain unperformed. Native semantics, keyboard checks and reduced-motion checks do not establish assistive-technology conformance.

The optimized build succeeds, but `accessibility:smoke` currently fails on eleven emitted error-shell HTML files (missing lang/main/h1). A runtime attempt at the fallback homepage also left hydration pending with React error 412. These are recorded as release-validation failures, not passes for the enhanced local homepage. They require a production-rendering investigation before release; D7 does not change the local-only content policy to conceal them.

The full `pnpm test` run stops at existing token-consumer violations in `essential-actions.module.css`, `search-controls.module.css` and `form-primitives.module.css`; those files are unchanged by D7. Patient-guide, care-journey, health-finder, partner and testimonial checks preceding that gate pass. Targeted shell and health-finder checks also pass. This is not a full-suite pass.

## Current evidence

All final browser runs below used the current worktree's development preview at `http://localhost:3000`. A fresh `pnpm dev` attempt identified the existing server in this worktree (PID 13094); the changed story-control binding and header/Help behavior were exercised against it. Each run records its source state and preview URL. Earlier failed runs remain historical records and do not count as passes.

| Check | Final evidence directory under `artifacts/visual-checks/` | Automated / visual result |
| --- | --- | --- |
| Integrated journey | `2026-11-06T13-37-42.038Z-journey-quality-dWAyZo` | Passed / all 25 captures inspected |
| Media regression | `2026-11-06T13-39-08.997Z-media-experience-gQDr66` | Passed / all 19 captures inspected |
| Firefox | `2026-11-06T13-39-33.760Z-motion-firefox-5Ty6qQ` | Passed / all ten captures inspected |
| Public-page quality | `2026-11-06T13-39-50.144Z-site-quality-Dqp3ZK` | Passed / all ten captures inspected |
| Responsive home, topic finder, article and clinician profile | `2026-11-06T13-40-15.502Z-responsive-bsnYYI` | Passed / all 12 captures inspected |
| WebKit launch | `2026-11-06T13-33-14.399Z-motion-webkit-sD3AZP` | Failed: missing host libraries / no visual result |

Visual inspection is recorded separately in each run's `inspection.txt` and `run.json`. All 76 final screenshots were opened. Focus, readable labels, poster composition, captions and reading-space findings are recorded there. Automated public-page checks cover 16 route samples; they are not a screen-reader assessment.

The final nine-second scroll samples recorded zero layout shifts, zero long tasks and zero frames over 50ms across all five viewports. Frame p95 was 16.7–16.8ms; 390px and 1440px samples used 4× CPU throttling. These are warmed development-preview results with the limits above, not a guarantee of device or production performance.

Final `pnpm build`, `pnpm budgets:smoke`, `pnpm typecheck`, `pnpm lint` and `git diff --check` pass. Targeted shell, health-finder and testimonial checks pass. Full tests and built accessibility smoke retain the failures listed above. D7's local hardening is delivered; release validation remains open for the production-rendering investigation, token-policy failures, Safari/WebKit, physical devices and assistive technology.
