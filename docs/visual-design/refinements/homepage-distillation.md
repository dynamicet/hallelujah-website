# Homepage distillation

The homepage keeps care discovery and practical visit information first, then
introduces the hospital and its resources. This refinement preserves its current
identity, care journeys, content safeguards, and demonstration-only boundaries.

## Deliverable 1: care-support choices

- Replace the homepage health search and alphabet with one invitation to the
  existing `/health-topics` page. Full search, alphabet browsing, and reading stay
  available there; the homepage no longer introduces a second search task.
- Keep unsure-care guidance below featured specialists as a quiet text action,
  removing the yellow panel and competing filled button.
- Remove the obsolete topic-index spacing override so the invitation has a clear
  section rhythm.

Validation: `pnpm typecheck`; responsive checks for `/` and `/health-topics`;
`node scripts/check-home-distill.mjs` for keyboard entry, visible focus,
normal/reduced-motion layouts, and the no-JavaScript destination. Screenshots and
inspection notes live in the corresponding ignored `artifacts/visual-checks/`
run directories. Static inspection and automated results are recorded separately.

Monitor whether visitors still discover health information, and whether unsure
visitors follow the care-options link; no conversion improvement is claimed.

## Deliverable 2: technology introduction

- Replace three homepage equipment chapters and their miniature navigation with
  one image, a short range of equipment types, and one descriptive link.
- Retain all three equipment explanations, patient preparation, referring-clinician
  guidance, and service links on `/about#medical-technology`. Add that section to
  About's chapter navigation; native disclosures work without JavaScript.
- The About presentation uses the existing light page palette and keeps the
  original illustrative assets and qualified copy. No availability or outcome
  claim was added.

Validation: responsive checks for `/` and `/about`; focused keyboard checks wait
for the destination anchor to receive focus before opening its disclosure, then
verify opening/closing and focus styling at all widths and motion preferences.
The first desktop keyboard run raced the route's anchor-focus handoff; waiting
for that observable state resolved it without a delay or application workaround.

## Deliverable 3: one hospital introduction, one featured story

- Keep the founder introduction and its About links. The hospital film remains
  available with native controls on About; remove the duplicate homepage player.
- Keep one featured patient story with its existing read, watch, captions,
  transcript, and keyboard-return behavior. Remove the second feature, repeated
  quotations, and demonstration statistics from the homepage. These were preview
  presentation material, not additional care functionality or verified proof;
  their source records remain available for future approved editorial use.
- Combine organization presentation into one compact section with two clearly
  named native disclosures. All 19 corporate entries and 10 partner entries,
  including shared identities, remain available with visible names and local
  logos. Retain arrangement-confirmation guidance and source provenance in
  `demo/partners.ts` and `partner-sources.json`.
- Remove automatic logo movement, paging state, and the unused homepage film
  observer. These disclosures work with keyboard, reduced motion, and JavaScript
  disabled. Their expansion is allowed to increase page height intentionally.

Validation passed: responsive homepage checks at 390/768/1440; component
interactions (care/query retention, organization keyboard opening/closing and
focus, mobile menu/Escape, live reduced motion, native no-JavaScript behavior);
reading continuity (dedicated topic browser and retained story/transcript);
media checks (retained story playback/transcript and native About film controls);
partner source/asset tests; TypeScript and scoped ESLint.

The current `visual:signature` run passed mobile/tablet and failed its desktop
portrait scroll-progress assertion: early and middle transforms were identical.
This assertion remains unresolved; baseline behavior was not reproduced, so it
is not classified as pre-existing. No motion redesign was included in this
refinement. Equipment animation expectations and removed inter-section links
were removed from that script; its remaining assertion is not weakened.
The choreography and integrated journey scripts have route/section-contract
updates but were not rerun as part of this focused verification.

The Impeccable detector ran once on changed UI targets. Its six warnings concern
thick border declarations in incumbent `home-composition.css`; several target
removed or overridden treatments. It reported no findings in the new invitation,
technology-preview, or organization-disclosure files. This is not a complete
accessibility audit or a production-performance/conversion claim.

Monitor whether people find the full organization lists and About technology
content. Approved content must still replace fictional patient examples and
unverified institutional material before publication.

## Deliverable 4: preparation at a glance

- Make the three-item What to bring checklist visible without opening a control,
  keeping the reminder to confirm additional requirements before travelling.
- Combine appointment-request and arrival guidance into Appointments & arrival;
  combine companion and access guidance into Companions & extra support. Both
  native disclosures can remain open together. All existing guidance and the
  hours/arrival destination remain available.
- Keep Read the full visit guide and the warm preparation surface. Remove the
  repeated large brand artwork, its import, and obsolete artwork sizing rules;
  give the checklist and questions equal desktop columns and a tighter gap.

Validation: `pnpm visual:check /`, `node scripts/check-home-visit.mjs`,
`pnpm typecheck`, scoped ESLint, and `git diff --check` passed. Fresh homepage
screenshots at 390/768/1440 and focused collapsed/expanded states were inspected.
The focused runner checks visible checklist content, independent keyboard
opening/closing, retained focus, live reduced motion, full-guide navigation,
no-JavaScript disclosure/link availability, and browser errors. The muted
confirmation text measures **5.91:1** against its warm background from computed
browser colors, above the normal-text threshold of 4.5:1.

The detector ran once for this deliverable and reported five existing thick-border
rules elsewhere in `home-composition.css`; none were added by this section change.
No claim is made about the full site's accessibility or the previously unresolved
signature-motion check. Monitor whether visitors find preparation requirements
without having to explore the full guide.
