# Connected care journeys

The local website preview connects doctor discovery, service pages, appointment
preparation and contact information.

- `/doctors?q=...` accepts names, specialties, affiliated service names and
  curated condition terms. `demo/care-discovery.ts` resolves indirect matches
  through the same explicit service affiliations used by doctor profiles.
  Results explain those matches. An empty result offers a link to reception.
- Profile return links retain their directory context. Appointment links retain
  the chosen doctor or service.
- `/appointment` offers first-visit and follow-up choices. The visit choice
  appears in the summary and review of the local preview.
- `/referrals` serves the separate clinician referral journey. Arrival and
  preparation information lives at `/contact#before-you-travel`.
- The Health Topics library and its articles are retired. Six article URLs
  redirect to their associated Family medicine or Physiotherapy page. The
  library and other article URLs return 404.

## Validation

Run `pnpm care-journeys:check` for search aliases, explicit affiliations,
missing relationships, service matching, pagination and clinician-name search.

With `pnpm dev` running, use `pnpm care-journeys:smoke` to check responsive
layouts, retired routes, redirects, keyboard access to reception and the
service-to-appointment journey. Screenshots go to `artifacts/care-journeys/`
by default. Set `HH_PREVIEW_URL` to use another local port.
