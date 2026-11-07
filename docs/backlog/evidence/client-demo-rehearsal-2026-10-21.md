# Client frontend demo rehearsal — 21 October 2026

**Reviewed revision:** `d5a3803` plus the favicon and browser-audit changes in this working tree. **Environment:** local Next development server, fresh headless Chromium profile, fictional fixture data, no personal-data collection or external services. This is an internal rehearsal for a client walkthrough, not a record of client approval.

## Acceptance criteria and result

| Criterion set before the walkthrough | Result | Evidence |
| --- | --- | --- |
| All six page types render as complete default compositions, with no clipped controls or unexplained blank media regions at 320, 360, 768, 1280 and 1440 CSS px | Pass | Full-page captures in the [comparison board](frontend-demo-fd08-artifacts/index.html), fresh connected capture pass, and visual inspection of Home, Doctors, Profile, Services, Emergency and Appointment on desktop and mobile. |
| A visitor can search from Home, open a matching doctor, carry the doctor into Appointment, validate the sample form and see one local receipt | Pass | Connected Chromium journey; selected context, focus, value retention and duplicate activation assertions. |
| Service search/filter/reset, related-service handoff, directory Back/Forward, mobile menu, Escape focus return and useful recovery states work | Pass | Connected Chromium journey, including partial, empty, failure, unavailable and uncertain scenarios. |
| Essential controls have visible labels and keyboard paths; small-screen content stays in reading order | Pass for the tested paths | Browser labels/focus/reflow checks and visual inspection. A manual screen-reader session was outside this rehearsal. |
| No unexpected browser exception, console warning, failed load or HTTP error occurs in the supported local demo | Pass after fix | Final 17-group connected run reported zero in all four categories. Two development hot-reload scripts were blocked during the deliberately disabled-JavaScript scenarios and are separately counted. |
| The appointment example never sends a real request, contact values clear on completion, and emergency contact examples never open a dialer | Pass | Connected browser checks, including no browser `POST` and the disabled API boundary. |

## Walkthrough and visual review

The scripted walkthrough followed Home search `Aster` → Doctors result → Dr Aster profile → selected-doctor Appointment → linked validation → local receipt. It then covered Services search and group reset, Emergency route and direction feedback, a 360 px mobile navigation, partial and failure recovery, and a reset to Home. The final fresh-profile run passed **17 route/journey groups**. Its screenshots also show the full default pages and the Appointment validation and receipt states.

I inspected all six full-page desktop and mobile compositions. The Home opening has a clear care action and balanced abstract artwork. Both directories keep search and results together; cards show distinct information and usable actions. The profile keeps the matching request context visible and collapses its partial state without an accidental empty column. Emergency separates hospital and public examples and keeps written arrival information available. Appointment presents the form, safety notice and local outcome in a readable order. I found no visible horizontal clipping, unexplained vacant media frame or blocked primary action in those captures. The [FD-08 comparison board](frontend-demo-fd08-artifacts/index.html) remains the durable visual reference; the fresh run also wrote local `/tmp/hallelujah-demo-*.png` screenshots.

## Errors found and action taken

1. Chromium requested `/favicon.ico` and received **404**. Added a small SVG tab icon at `apps/web/src/app/icon.svg`. The icon route now returns 200, and the final browser run had no HTTP errors.
2. The stricter network audit reported two CSP-blocked Next development hot-reload scripts. Both occurred while the walkthrough intentionally disabled JavaScript on the Doctors and Appointment pages. The audit now records and names those expected blocks while continuing to fail for any other blocked load, browser warning, exception or HTTP error.
3. A production-server attempt returned **404** for `/doctors`. Source and the execution board confirm that the demonstration routes are deliberately restricted to `NODE_ENV=development`. The client walkthrough must use `pnpm dev` on the local server; this result is a deployment boundary, not a failed local-demo journey. The boundary was left intact.
4. `pnpm format:check` still fails on 20 ignored historical files under `artifacts/visual/client-page-review-2026-10-20/` because they lack final newlines. It reported no file created or edited for this rehearsal. Those prior evidence captures were left byte-for-byte intact; this remains a repository format-check failure outside the client journey.

## Verification and handoff

- `node scripts/check-demo-routes.mjs`: passed, 17 groups, zero unexpected console or network errors; Noto Sans rendered locally.
- `pnpm lint`, `pnpm typecheck`, `pnpm build`, `pnpm links:check` and `git diff --check`: passed after the favicon change; the build includes `/icon.svg`.
- Start the presentation with `pnpm dev`, open `http://localhost:3000/` in a new browser profile, and use the [FD-08 scenario index and presenter script](frontend-demo-fd08-2026-10-21.md#reproducible-scenarios). Use only fictional form values. Return to `/` in a fresh tab or profile before leaving the demo.

**Internal decision:** ready for the controlled local client walkthrough. The client’s visual acceptance remains a separate decision. The demo still uses illustrative people, services, contact and arrival details; its receipt does not make a booking. Typography should be checked on the presentation machine because approved self-hosted Noto binaries are absent.

**Follow-up visual change, 21 October 2026:** Per the user's request, the Home doctor cards, directory cards, and profile header now show clearly labeled empty photo slots. The updated 1440 and 360 px captures in `/tmp/hallelujah-photo-review/` were visually reviewed; the full connected run again passed 17 groups with zero unexpected browser errors, warnings, failed loads or HTTP errors. The original FD-08 board predates this photo-slot change.
