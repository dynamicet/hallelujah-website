# Browser and screen-reader audit — 5 November 2026

Tested the current local source at `http://localhost:3000`, based on commit
`0807af0` with the error-description fix described below. All appointment inputs
were synthetic; checks used the browser-only example.

## Browser results

| Browser / engine on Linux | Widths | Automated result |
| --- | --- | --- |
| Chromium 156 | 390, 768, 1440px | Passed |
| Firefox 157.0.1 | 390, 768, 1440px | Passed |
| WebKitGTK 2.52.6 | 390, 768, 1440px | Passed |

The matrix covers 12 representative routes at every width in every engine:
home, doctors, services, appointment, patients and visitors, emergency, referrals,
feedback, health topics, news archive, Dr Chala's profile, and the heart-care
service. Checks cover viewport width, document overflow, one main and h1,
broken images among loaded images, and native Tab/Enter skip-link behavior.

Additional flows at every width cover feedback review/edit retention, native
section jumps, health-reader focus and return, mobile menu Escape/trigger focus,
doctor/service empty-search recovery, and appointment validation, error-link
focus, review, failed example recovery, retained answers, and completion focus.
There are 108 route/width/engine samples and 18 grouped interaction checks.
Viewport widths are desktop-engine resizing, not physical-device testing.

Final source evidence:
`artifacts/visual-checks/2026-11-05T14-15-01.078Z-cross-browser-DTWU7q/`.
`run.json` records engine versions, individual checks, and results.
All 27 fresh home, profile, and appointment-review viewport captures were opened
and reviewed separately; `findings.json` records the visual observations. The
fresh full-page appointment captures also passed visual inspection at all widths. Native Firefox
was driven with WebDriver BiDi; WebKitGTK used an isolated X11 WebView with keyboard
link navigation enabled. Chromium used the repository CDP runner. No browser
packages were added to the application's dependencies.

## Actual screen-reader observations

Orca 50.2 with Chromium on an isolated Linux desktop generated speech output for
required and invalid field states, error-summary navigation to the telephone
field, the review heading, the known-failure message and retained-answer guidance,
local completion, and the selected health-topic title. Initial testing also
confirmed native skip navigation to main and Orca's H heading navigation.

This is a screen-reader smoke test using Orca's own speech-generation logs and
browser focus checks. It is not an audio-listening study or an end-to-end test by
a blind participant. Some scripted focus moves were superseded by Orca's loading
navigation; those steps are inconclusive and are not counted as announcement
passes. In particular, the final untouched-telephone step did not record a usable
announcement, although its description association was verified in all engines.

## Finding fixed

Hidden error messages were included in `aria-describedby` before validation.
Orca read an error along with a field's normal hint even when the field was not
marked invalid. A referenced hidden node can contribute to the accessible
description, so hiding its visual presentation alone did not prevent this.

Shared text, textarea, select, and choice fields now reference an error only when
it is visible. The appointment privacy control follows the same rule. Both the
appointment controller and shared form fixture add/remove the error reference
as validation changes, while retaining other hint and privacy references.

The appointment browser regression now checks that the telephone error is absent
initially, present when invalid, and removed after correction. The cross-browser
matrix verifies the initial and invalid associations. Orca's corrected-name
announcement contained the hint without the stale error.

## Remaining coverage and polish

- The repeated appointment announcements were addressed in the follow-up below.
- NVDA with Chrome/Firefox on Windows and VoiceOver with Safari on macOS/iOS
  require those platforms. Linux WebKitGTK does not establish Safari parity.
- Actual Edge, Chrome-branded builds, Android TalkBack, touch exploration,
  braille, audio quality, media playback, and every content record were not tested.
- This sampled audit does not establish WCAG conformance or production readiness.

## Repeatable repository regression

Run `pnpm dev`, then `pnpm visual:appointment` and
`pnpm visual:check /appointment`. Lint, type checking, and the form primitive
contract check also passed. See `docs/visual-checks.md` for evidence rules.
The one-off native-browser and Orca harnesses are retained with the local audit
artifacts; they require the Linux browser/AT dependencies and local tool paths.

The legacy `pnpm form-primitives:smoke` runner stalled in its browser transport
and was stopped; it is not a pass. A bounded direct check against its freshly
rendered fixture passed the initial, invalid, and corrected error-description
associations. The direct check is retained in the final evidence directory.

## Follow-up: appointment announcement polish

Tested the local source based on `cb1bbbf` with the announcement changes applied.
The summary now focuses its heading and describes it with the current problem
count; the error links follow in reading and tab order. Result panels focus
their heading, described by the recovery or completion guidance. These panels
use no live announcement. The checking state remains a polite live status while
focus stays on the submit button. Other consumers retain FormStatus's default
live behavior. Focus outlines follow the new heading targets.

Orca 50.2 with Chromium generated each of the following once in its recorded step:

- Revisited validation: “Check the form” and “There is 1 problem to correct.”
- Failure: “The example could not be completed” and retained-answer/retry guidance.
- Completion: “Example request complete” and the local-only notice, reference,
  and hospital contact guidance.

Speech-generation logs and the local harness are in
`artifacts/visual-checks/alert-polish-tools/`. The first validation and untouched
telephone steps still recorded no usable speech; the summary result above comes
from editing an already reviewed telephone number and validating again. This
follow-up does not establish NVDA or VoiceOver behavior, and the earlier
three-engine matrix was not rerun for this change.

Lint, type checking, and the form primitive contract check passed. Fresh
appointment and care-continuity browser regressions passed at 390, 768, and
1440px, including error-link keyboard recovery, retained details, failed-example
editing, completion focus, and reduced motion. Evidence:

- `artifacts/visual-checks/2026-11-05T14-47-56.554Z-appointment-usability-jm6lZ5/`
- `artifacts/visual-checks/2026-11-05T14-48-21.815Z-responsive-T5Di9O/`
- `artifacts/visual-checks/2026-11-05T14-48-29.951Z-care-continuity-e2Yki4/`

Visual inspection was separate: all 12 appointment-state captures and three
full-page captures were opened. Headings, wrapped focus outlines, error links,
recovery controls, and completion guidance remain readable at all widths. No
clipping or overlap was found in those captures. Care-continuity screenshots
were not opened; that run records an automated pass only.
