# H4 task-page review — 1 November 2026

The existing hospital typography, palette, navigation, routes and functional components are retained. This is a targeted hierarchy correction, not a new design direction; no draw/redraw was needed. The visual premise is that preparation questions, visit checklists and the working request form carry the care journey. The checklist, feedback review and appointment stages remain the useful interactive elements.

## Round 1

Seen in one second: clearly named patient tasks, with useful actions but more introduction and empty separation than the tasks need.
Idea (one sentence): the patient's preparation becomes the page's organizing structure.
Live thing: visit checklist, sample feedback review and appointment care/details/review stages.
Layout words by section: introduction=text/action / navigation=wrapped section links / practical content=heading/content columns / appointment=guidance/form / footer=shared hospital close.
Scores: design 6.5 · usability 7 · creativity 6 · content 6 → overall 6.5.
Caps applied: generic task pages have no distinctive editorial concept; illustrative/unverified hospital content caps content confidence. The marketing rubric's picture-count and motion expectations are unsuitable acceptance criteria for these tasks.
Top three problems (most visible first), with the screenshot and fix:
1. `before/feedback-390-fold.jpg`: vague action wording, long pre-form explanations. Name the form action and shorten the explanations while preserving privacy and unavailable-submission facts.
2. `before/patients-visitors-390-fold.jpg` and `before/services-synthetic-service-111111111111-390-fold.jpg`: the first practical section is separated from useful navigation by excessive space. Tighten entry spacing while retaining the links.
3. `before/referrals-390-fold.jpg`: the first action leads away to the directory and referral availability is buried later. Make preparation the action, state unavailable submission in the introduction, and move recipient/channel/response status to the first section.

Source/interaction finding: appointment review heading was not focusable although goToStep attempted to focus it. Make it programmatically focusable, cancel any scroll toward the previous control, and align active stage headings after the layout change below the sticky header. Disable automatic scroll anchoring within the changing workspace. The shared document already provides header scroll-padding; remove duplicate header-sized scroll-margin on patient sections.

## Round 2

Seen in one second: direct actions, compact text introductions and visible practical navigation; no unrelated photographic barrier.
Idea (one sentence): the patient's preparation becomes the page's organizing structure.
Live thing: the same working preparation tools, preserved.
Layout words by section: introduction=compact text/action / navigation=retained links / practical content=closer heading/content columns / appointment=retained guidance/form / footer=shared hospital close.
Scores: design 6.5 · usability 8 · creativity 6 · content 6 → overall 6.7.
Caps applied: hospital content/imagery is still illustrative or unverified. This work does not claim a general art-direction improvement or public-release readiness.
Top three remaining limitations, with screenshot references:
1. `after/feedback-390-fold.jpg`: form fields extend below the first viewport, after the necessary privacy and availability text; a clearly named form anchor provides direct access. Do not remove disclosures merely to fit fields above the fold.
2. `after/referrals-390-fold.jpg`: approved referral channel and recipient are unavailable; the status is now visible early. C2 requires hospital input.
3. `after/patients-visitors-390-full.jpg`: the shared footer remains large and the guide is long because it covers distinct preparation/support/arrival tasks. Footer size is N2; section links preserve access without discarding useful content.

Reviewed all six routes at 1440 × 900, 768 × 1024 and 390 × 844, before and after, using fold and full-page sheets. Sticky-header placement in full-page captures is a capture artifact; use fold and interaction captures for placement judgments.

## Automated design inspection

Source design lint: 0 FAIL, 0 WARN for the changed patient-page styles and task-page copy/components.

The raw feedback inspector reports 3 FAIL and 2 WARN: a false eyebrow classification of the actual form action above the next section, zero editorial photos, six animated elements, missing footage, and a name-only title heuristic. The action is a real anchor, the heading explicitly names the task, and the introduction explains it. Photos, footage or additional animation would not help the feedback task. These are recorded limitations of applying the marketing inspector here, not reasons to delete a useful action or introduce decoration. No overall inspector pass is claimed. All inspector screenshots were visually reviewed.

See `imagery-decisions.md` for the role-by-role image review, `before/` and `after/` for captures, and `verification/results.json` for performed interactions.
