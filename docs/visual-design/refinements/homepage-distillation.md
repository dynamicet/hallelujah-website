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
