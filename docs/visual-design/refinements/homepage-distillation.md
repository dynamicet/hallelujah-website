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
