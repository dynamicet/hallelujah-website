# Connected care journeys

The local website preview connects health topics, service pages, doctor discovery,
appointment examples and visit preparation. Payment and insurance features are outside scope.

- `/health-topics` exposes the existing searchable A–Z finder and a server-rendered topic list.
- `/health-topics/[slug]` gives each of the 12 preview topics a permanent route, preparation
  questions, care links, print action and explicit medical-review status. Unknown topics return 404.
- `/doctors?q=...` accepts existing topic names and aliases, plus affiliated service names.
  `demo/care-discovery.ts` connects topics through stable service IDs and the same explicit
  affiliations used by doctor profiles. It does not infer a doctor relationship from a specialty.
  Search results explain indirect matches and offer matching topic pages even if no doctor is linked.
- Service and doctor pages link back to connected topics. Profile return links retain the original
  directory query and filters. Appointment links retain the chosen doctor or service.
- `/appointment` adds first-visit/follow-up guidance within the existing care step. The visit choice
  appears in both the summary and review. Existing sample-data checks and submission boundaries remain.
- `/referrals` is a preparation guide, separate from patient appointment requests. It collects no
  patient records or documents and states that a verified referral channel is unavailable.
- `/patients-visitors#checklist` offers native checkboxes and a printable checklist. The arrival
  section explains what to confirm without redirecting visitors back to another unverified section.

All added routes call `requireLocalDemo()`. The existing noindex policy remains. No clinician,
medical review, location, clinical capability, response time or operational contact is invented.
Actual hospital records, reviewed medical explanations, verified procedure relationships,
arrival details and referral handling are still needed before public use. Existing topic copy is
preparation and navigation guidance, not a reviewed clinical encyclopedia.

The presentation follows the existing patient-page layout, tokens, photographs and responsive
shell. No new dependencies or alternate design direction were introduced.

## Validation

Run `pnpm care-journeys:check` for alias matching, explicit affiliations, missing relationships,
service matching, pagination and stable topic/service/appointment identities.

With `pnpm dev` running on port 3000, run `pnpm care-journeys:smoke` for browser interaction,
responsive overflow checks, all topic routes and 404s, the homepage-to-topic-to-appointment flow,
follow-up review, checklist privacy, printing, reduced motion and reading without JavaScript.
Screenshots and a printable PDF are written under `artifacts/care-journeys/` by default.
Browser profiles use the repository's `tmp/` folder because the session's `/tmp` quota prevented
Chromium from creating its caches. Override `CARE_BROWSER_PROFILE_ROOT` if needed.

The older clinician-directory and appointment-page render adapters now resolve `@/` imports,
which are already used by the shared patient guide; this allows their existing contracts to run.
