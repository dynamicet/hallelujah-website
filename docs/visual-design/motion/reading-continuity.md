# D5 — Reading and detail continuity

The homepage's explicit reading interactions now connect opening, reading and returning. Implemented with ui-ux-pro-max; no Taste skill, new dependency or media-policy change.

## Deliverables

| Category | Behavior | Motion |
| --- | --- | --- |
| Topic reader | Opening focuses and positions the reader below the header at every width. Search, letter and result count remain in component state. | 10px forward entrance, 280ms; no delayed controls |
| Return to discovery | Back restores the saved page scroll and original result focus before paint. A “Last opened” label and border identify the result. | 8px reverse entrance, 220ms; no stagger |
| Story reading | Open accounts and transcripts gain a bounded reading column and supporting-color rail. Text remains stationary within the native disclosure. | Rail extends downward over 320ms, alongside D1's native disclosure transition |
| Finish and return | End-of-account “Back to story” closes that account and returns focus to its summary. Transcript closure affects only the nested transcript, preserving the film disclosure. | Immediate focus/viewport restoration; short arrow feedback |

All movement is gated by reduced-motion preference, including live changes through CSS. Print suppresses the new animations and return controls. No-JavaScript stories retain native summary controls and hide the JS-only return buttons. Forced colors preserve the reading rail and existing focus styles.

Native route links and browser history remain authoritative. The initial delivery handles inline reading on the homepage and shared /health-topics finder. The editorial extension below covers full article journeys. Neither intercepts browser history or introduces a modal reader. D6 media activation and D7 broader journey validation remain.

## Validation

TypeScript and targeted ESLint passed. Chromium interaction checks passed at 390/768/1440px: real keyboard opening/return, result identity and scroll restoration, account and nested transcript focus, reduced motion, overflow and browser errors. Native story opening without JavaScript also passed.

Fresh interaction evidence: artifacts/visual-checks/2026-11-06T12-26-41.940Z-reading-continuity-FS0oJV. All nine screenshots were opened and inspected: readable columns and rail, visible focus, coherent mobile/desktop reader and returned-result states.

Responsive evidence: artifacts/visual-checks/2026-11-06T12-27-39.848Z-responsive-lgWpTb. See run.json and inspection.txt for automated and visual review status.

Run `pnpm visual:reading` and `pnpm visual:check / /health-topics` against a current local preview. Screen-reader, cross-browser and device-performance certification are not established by these checks.

## Creative extension — full editorial journey

- **Article opening:** a supporting editorial spine, balanced title and 360ms/10px entrance; the existing card photograph is expanded into a shaped reading image with a 480ms crop reveal. Title and image identity carry across routes. This is a destination entrance, not a shared-element morph across pages.
- **Reading orientation:** articles with at least three sections show numbered native anchor links. Desktop uses a sticky sidebar; compact layouts use a three-part row above the body. IntersectionObserver identifies the visible section and a 260ms accent moves between guide positions. Text remains stationary, with a persistent target border for anchor navigation.
- **Return to exploration:** card links carry an allowlisted source path. Both article return links preserve the homepage or filtered archive and target the exact source card. The destination restores focus and positions that card below the header. This restores the card, not a stored pixel scroll offset; native browser Back/Forward remains available.
- **Completion:** a separated “Keep exploring” ending offers the original source and the full archive. Two-section articles omit the reading guide.
- **Fallbacks:** source links and section anchors are server-rendered and remain usable without JavaScript. Reduced motion suppresses entrances and guide travel. Print hides the reading guide and return coda. Observer and animation-frame listeners are cleaned up on unmount.

A first keyboard check found that Next navigation scrolled to the source fragment without focusing it; explicit destination focus restoration fixed that gap. Mobile screenshot review led to a compact horizontal guide and removal of duplicate category/reading-time metadata.

Run `pnpm visual:editorial` for the full article journey. Full-page responsive coverage uses `pnpm visual:check / /news-resources /news-resources/make-room-for-your-questions /news-resources/a-conversation-about-care`.

### Extension validation — 6 November 2026

Typecheck, targeted ESLint and whitespace checks passed. Completed Chromium journey checks passed at all three widths, including native section focus, source-card focus, filtered archive retention, browser Back/Forward, allowlisted fallback, reduced-motion article entrance and no-JavaScript section links. All 12 responsive route checks passed.

Visual inspection separately opened all nine journey screenshots and all 12 responsive screenshots. Final evidence:
- artifacts/visual-checks/2026-11-06T12-46-10.715Z-editorial-reading-D6mc9w
- artifacts/visual-checks/2026-11-06T12-47-00.986Z-responsive-gNDNrZ

Earlier runs interrupted by the session restart remain incomplete and are not pass evidence. The local preview was restarted from this worktree for the final runs. No cross-browser or screen-reader certification is claimed.
