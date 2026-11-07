# H2 clinician identity continuity — 2 November 2026

Scope: preserve the existing visual direction and six fictional preview portraits while making each identity recognizable across homepage, directory, profile and appointment selection/review. No new images were acquired, generated or edited. The three clinicians without assigned portraits retain initials. Real hospital identities/portraits remain deferred.

The single explicit mapping is in `apps/web/src/demo/clinician-portraits.ts`, keyed by public ID, never inferred from name or array order. Names and specialties still come from the same clinician records. Generic templates receive optional presentation props/slots only; the governed `ClinicianView.portrait` contract remains null. Local routes remain gated. Each new presentation includes an illustrative/AI-portrait disclosure. Portraits have empty alt text because the adjacent name supplies their identity; initials remain decorative to assistive technology. The native doctor select remains the input.

## Round 1

Seen in one second: homepage faces become initials on profiles and result rows; appointment guidance has only a selected name.
Idea (one sentence): the same clinician identity follows the visitor's choice.
Live thing: native clinician selection, directory filtering and profile-to-appointment handoff.
Layout words by section: homepage=compact portrait rows / directory=comparison rows / profile=identity and details / appointment=guidance and form.
Scores: design 6.5 · usability 6.5 · creativity 6 · content 6 → overall 6.3.
Caps applied: fictional clinician records and generated portraits do not substantiate real hospital identities.
Top three problems:
1. `before/profile-390.jpg`: a familiar homepage face becomes an initial. Reuse the same portrait by public ID.
2. `before/directory-768-full.jpg`: all nine clinicians use initials despite six assigned homepage portraits. Reuse those six while preserving honest fallbacks for the other three and compact row footprints.
3. `before/appointment-768-full.jpg`: selection has no portrait/specialty context. Add the selected identity beside the native selector, guidance and review, updating together on selection changes.

## Round 2

Seen in one second: the same face, name and specialty identify a selected preview clinician throughout the journey.
Idea (one sentence): the same clinician identity follows the visitor's choice.
Live thing: native selection updates all appointment identity displays; service selection clears the doctor identity.
Layout words by section: existing layouts retained, with the portrait in the former initial slot and a compact appointment identity row.
Scores: design 6.5 · usability 8 · creativity 6 · content 6 → overall 6.7.
Caps applied: real hospital approval is still absent; this is demo continuity, not authentic staff identification.
Remaining limitations:
1. The three unpictured clinicians retain initials (`after/directory-390-full.jpg`). Do not reuse a different person's portrait to fill these slots.
2. Necessary preview disclosures add some supporting text (`after/profile-390.jpg`); they remain visible until actual approved staff imagery exists.
3. Existing profile typography/margins, shared footer footprint and unavailable operational facts are outside this identity change; the inspector records them for the relevant open findings.

Reviewed homepage-section, directory, profile and appointment captures at 1440 × 900, 768 × 1024 and 390 × 844, including full-page task captures and appointment review/fallback evidence. Full-page captures scroll displayed portraits into view first so native lazy loading does not leave misleading blank image slots. A sticky header's position in a full-page capture is not a page-overlap finding.

## Verification

The 39-record browser regression covers all nine clinician identities at all three widths, six distinct assigned portraits, three initial fallbacks, filtered return-query preservation, keyboard profile/appointment handoff, doctor selection changes, service-route clearing, review/back preservation and heading focus, failed-image fallback, unavailable states, reduced-motion changes and no-JavaScript markup. No appointment request was submitted. All nine directory records remain on one page; no horizontal overflow was measured on the reviewed directory/profile pages and no-JavaScript routes.

Existing contracts passed: 18 directory cases, 30 profile cases, 20 appointment-page cases and 14 homepage cases. TypeScript, focused ESLint and the production build passed. The new portrait/appointment-identity source design lint reports 0 FAIL, 0 WARN.

## Inspector limits and remaining findings

The profile marketing inspector reports 3 FAIL and 5 WARN. Its failures classify the useful return-results link as an eyebrow, require at least four images on a single-clinician profile, and require more animation. Those are not reasons to delete navigation or add unrelated portraits/motion to this task. The warnings cover type-size variety, absent footage, long text measure, measured margin variation and a name-only-title heuristic. The actual heading names the clinician and the visible specialty/context explains the page; other typography/frame refinements remain separate review work. No overall inspector pass is claimed. All six inspector screenshots were reviewed.
