# Health & Care finder — desktop and mobile design

> Evidence availability (8 November 2026): some historical captures referenced below are absent from this checkout. Their filenames are retained as archive references, not current verification evidence. Rerun the documented checks for fresh evidence.

## Website integration — current direction (6 November 2026)

The homepage finder at `/#health-library`, after Contact & directions, combines one heading, **“Find health topics”**, a prominent search field and the complete A–Z including disabled letters. Introductory/helper paragraphs, example chips and repeated browse headings are omitted. All 26 letters stay visible; disabled letters automatically become available when a matching topic is supplied.

The homepage uses quiet letter styling with 44px targets. Search and heading share a desktop row, with search above the index on smaller screens. Clear results appears after interaction. Search aliases, inline results, pagination, reading, focus/scroll return and reduced motion are retained. The dedicated `/health-topics` page keeps its existing search/examples/browse controls in the shared [React component](../../../apps/web/src/website/health-library.tsx) and [scoped styles](../../../apps/web/src/website/health-library.module.css).

Current validation: TypeScript and targeted ESLint passed. Fresh responsive checks passed both routes at 390/768/1440px. Focused browser checks passed search aliases/empty results, letter selection, keyboard reader return, clear-to-search focus and reduced motion at 320/390/768/1280/1440px. Initial mobile/tablet/desktop layouts and focused/search states were visually accepted separately in `2026-11-06T19-53-20.979Z-health-search-index-3uTmw6`.

Earlier evidence and prototype descriptions below are historical; they do not establish that the current implementation passes. Fresh validation is recorded in unique directories under `artifacts/visual-checks/` with automated and visual results reported separately.

## Standalone design study

Open [index.html](index.html) directly in a browser. All fonts and assets are local; no installation or server is required. This is an isolated design study, with no live appointments or calls.

## Visual direction

The user-directed revision replaces the large cyan split with **one pale blue surface**, a compact title and a spacious rounded search field. The original filler panel is removed. Cyan appears only in the title accent and existing navigation detail. The active alphabet letter is navy; all letter targets retain a consistent circular footprint, with unavailable letters visually quieter.

At 1440px the initial finder, including its heading, is below 300px tall; the exact measurement is recorded in [layout metrics](evidence/layout-metrics.json). Search and heading share the top row. A–Z occupies one row below. Tablet and phone layouts reflow the alphabet without reducing its 44px targets.

Letter results reveal beneath the controls, led by the selected letter in large type. Matching topics use open white rows, readable names and secondary care-route labels. Selecting a topic reveals its explanation beside the navy care-action panel on wide screens; these stack on phones. The search field remains in place throughout.

The brand fonts, emblem and palette are retained. The earlier Split stage draw (seed 1889046424 in [direction.json](direction.json)) is historical; the user's explicit request for a continuous surface supersedes its split composition. No new imagery or identity assets were introduced.

## Mobile composition

Phones up to 700px have a dedicated composition:

- A compact **Health & care** heading and short explanation.
- Two 44px entry-mode controls: **Search a concern** (default) and **Browse A–Z**. Only the active entry interface is shown. Switching mode clears its old results without showing a default disease list.
- Search displays a 56px field with a mobile Search keyboard action. Browse displays the letter grid with 44px targets.
- Choosing a letter folds the grid into Change letter, with matching topics immediately below. Change letter reopens the alphabet and restores the selected letter's focus.
- Selecting a result replaces the introduction, modes and search with a focused topic name, summary and care action. Back returns to the previous matches and entry mode, with topic focus restored.
- Read more opens a viewport-height reading sheet. Its sticky toolbar keeps Close reachable while scrolling, and safe-area padding reserves space at the top and bottom. Closing it returns focus to Read more. Background scrolling is locked while a mobile dialog is open.

Desktop retains the approved heading/search row and complete alphabet. Its initial finder remains 278px tall at 1440px. The mobile-before captures are preserved in [evidence/mobile-before](evidence/mobile-before/).

## Shared interaction

Search performs literal lookup over fixture names and explicit aliases; it does not infer diagnoses. A letter choice clears search; search clears the letter. Broad searches use three results per page with Previous/Next rather than an internally scrolling list. Guides open only after a result is selected. Read more and care handoffs remain separate native dialogs. Appointment, guidance-call and self-care destinations remain demonstration-only.

## Content boundary

All 12 topics, aliases, introductory copy and hospital service mappings remain illustrative. Actual capabilities, contacts, appointment eligibility, clinical articles, self-care/escalation guidance and reviewed English/Amharic copy require confirmation before integration. No treatment instructions, clinical phone service or actual booking availability are asserted by the prototype. Existing application routes are unchanged.

## Evidence and critique

Screenshot links below and the integrated website artifacts refer to local review output, which is intentionally Git-ignored. The standalone JSON reports are committed alongside this study; screenshots are not included in a fresh checkout.

Review the desktop (unavailable archive: `evidence/desktop-fold.jpg`), mobile Search entry (unavailable archive: `evidence/mobile-fold.jpg`), mobile A–Z entry (unavailable archive: `evidence/mobile-alphabet.jpg`), letter matches (unavailable archive: `evidence/mobile-matches.jpg`), symptom-search matches (unavailable archive: `evidence/mobile-search-matches.jpg`), focused guide (unavailable archive: `evidence/mobile-reader.jpg`), and full-screen reading sheet (unavailable archive: `evidence/mobile-full-guide.jpg`).

**47 browser checks passed**; see [interaction-checks.json](evidence/interaction-checks.json). Checks cover shared search/filter/pagination/handoff behavior, separate mobile modes, clearing stale matches, focused reading, sheet dimensions, reachable Close, focus restoration, 44px targets at 320/360/390px, reduced motion and no browser exceptions. Syntax and source design lint pass. The responsive inspection still records the standalone component's unused space below it and the small mobile heading; its adjacent explanation, explicit mode labels and field label supply the task context. These are browser prototype checks, not clinical or screen-reader certification.

FINAL ROUND

Seen in one second: a compact Health & care heading, two modes and one search field on the phone.

Idea: the mobile visitor makes one decision at a time, using the approved pale-blue and navy visual language.

Live thing: choose Search or A–Z, choose a matching concern, then use its care action or longer reading sheet.

Layout words by section: mobile entry=compact title, mode switch and one control / matches=selected letter or search and matching rows / guide=focused name and care action / longer reading=full-screen sheet with sticky Close.

Author critique scores: design 6.5 · usability 8 · creativity 7 · content 6 → overall 7.1. These are subjective and retain the skill's imagery cap for a deliberately image-free functional finder.

The three mobile issues addressed are the alphabet taking space before intent, the repeated introductory/search section above an opened guide, and a desktop-style reading dialog on a narrow screen. Remaining limits are fixture-only vocabulary, illustrative service mappings and unconnected care destinations. Real mobile-device/keyboard and screen-reader verification remain integration work.
