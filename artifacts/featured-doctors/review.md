# Featured doctors section review

Scope: one existing homepage section. Kept the site's type, palette, spacing,
portrait corner treatment, and profile navigation; no direction draw required.

Idea: the preview's six clinician identities become a browsable portrait directory,
with names, areas of care, and languages visible together. The live action is opening
each doctor's existing profile or the complete directory.

Final screenshot review: desktop 1440px, tablet 768px, mobile 390px. Viewed every
final inspector screenshot. Six consistently cropped portraits, readable profile
details, and balanced desktop columns; phone entries stack without overflow.

Scores for the changed section: design 7, usability 8, creativity 6, content 7;
weighted overall 7.1/10. The section is clear and consistent with the existing
site. The main limitation is fictional profiles and generated portraits, explicitly
identified on the page. Approved clinician photographs remain necessary for launch.

Inspection: before 0 failures / 3 warnings; after 0 failures / 2 warnings.
The card-row warning is gone. Existing page-wide type-size variety and the absence
of footage remain outside this section's scope. No new footage is needed for
static doctor identification. TypeScript and targeted ESLint checks passed.

Assets: six generated portraits, no found photographs or clips. Provenance is in
apps/web/public/editorial/clinicians/SOURCES.txt. Disclosure appears in the section.
No global clinician record portraits were changed.

Motion follow-up: profiles now use a sequential 70ms entrance stagger. Fine-pointer
hover and keyboard focus raise the portrait by 3px and move the arrow 3px diagonally.
Touch devices retain the static profile layout. Reduced-motion mode disables all
transitions and these transforms. Browser checks confirmed six loaded portraits,
visible keyboard focus, no horizontal overflow, and no transforms or transitions
under reduced motion. Final motion inspection: 0 failures / 2 existing warnings
at 1440px, 768px, and 390px. All screenshots, plus focused and reduced-motion
section captures, were reviewed. Section scores remain 7 / 8 / 6 / 7 (7.1 overall);
motion adds feedback without changing the composition or the sample-image limitation.
TypeScript, targeted ESLint, and diff whitespace checks passed.
