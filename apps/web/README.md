# Web application bootstrap

This directory is the bounded production-code area created by `B00-004`.

The default runtime is intentionally limited:

- `/` identifies the build as a controlled local bootstrap, not a hospital website;
- `/health` returns a non-sensitive local health response;
- `/api/appointment-requests` is a POST-only fail-closed boundary that returns unavailable while
  collection is disabled and does not process the submitted body;
- Payload and its PostgreSQL adapter are configured as the approved application foundation, but no admin, API, collection, database startup, seed, or personal-data path is mounted;
- the browser receives no remote font, media, analytics, map, chat, replay, pixel, autocomplete, or provider request.

From the repository root:

```sh
pnpm install --frozen-lockfile
pnpm --dir apps/web config:check
pnpm dev
pnpm verify
```

The production design-token source is `src/design-system/tokens/tokens.json`. Run
`pnpm tokens:generate` after an authorized source change and `pnpm tokens:check` to verify generated
CSS/TypeScript parity and the layer, contrast-metadata, reduced-motion, protected-context, and
consumer policies. Current values are provisional until the brand and language gates close.

Before `dev` or `start`, provide the required local-only values in an ignored
`apps/web/.env.local`. The committed `.env.example` intentionally contains names only.
The runtime rejects missing values, cross-environment credential scopes, a database name
that does not match the selected environment, short Payload secrets, and any attempt to
enable personal-data collection or external services. See the
[environment and secrets runbook](../../docs/architecture/environment-and-secrets.md).

Appointment database variables are optional while collection is disabled and must be supplied as
one environment-matched URL/abuse-secret/idempotency-secret/notice-version set. The controlled
migration and runtime
remain synthetic-only. An enabled controlled POST also requires a 256-bit base64url
`Idempotency-Key`; equivalent retries reconcile to the original opaque reference, while conflicting
reuse fails without exposing a request record. See the
[appointment foundation](../../docs/architecture/appointment-request-foundation.md).

Do not add CMS routes or collections here until their own backlog and security/content gates permit them.

## Client-facing interface copy

Keep development labels, implementation notes, fixture provenance, approval workflows,
and content-verification reminders in documentation and the backlog, outside the
patient-facing interface. Content and information will be verified before publication.
The component review harness remains an internal developer tool.

Unavailable actions must remain disabled and clearly identified. Local appointment
forms must not imply a request was accepted, display an accepted-request reference,
or confirm a booking. Emergency warnings, privacy instructions, coverage limitations,
and warnings against using inert contact/arrival details for care remain necessary.
Removing development copy does not authorize publication, activate contact links,
or change content eligibility and backend acceptance rules.

## English / Amharic shared interface

The public shell offers an English / አማርኛ switch. It changes shared navigation,
action links, search controls, form labels and validation/status copy without
changing the current URL, query, hash, scroll position, or entered form values.
The choice uses the browser's `hh-interface-language` local-storage key and survives
navigation and reloads. If storage is unavailable, it lasts for the current document.
English remains the server-rendered and no-JavaScript baseline.

`src/website/interface-messages.ts` holds the reusable UI dictionary. Use
`InterfaceText` for an isolated label, `InterfaceLink` for common action links, and
`InterfaceCopy` only around shared native control markup. Component boundaries are
left intact. The translator never changes input values, option values, route URLs,
canonical doctor/service names, or editorial content. `data-interface-content`
explicitly excludes user-entered text and content regions. Translated elements carry
Amharic language metadata while the document and pending page copy remain English.

Page headings, biographies, service descriptions, articles and guide responses await
final editorial copy; this does not publish a fully translated Amharic site. Review
shared Amharic wording with the content team before launch. No preview badge is
added to the interface.

With `pnpm dev` running, verify the language journey and capture current evidence:

```sh
node scripts/check-interface-language.mjs
pnpm visual:check / /doctors /services /appointment
```

The language check covers keyboard selection/focus return, persistent preference,
client navigation, unchanged search state, form validation and value/step retention,
normal/reduced motion, storage denial, and three responsive widths. Inspect the fresh
screenshots separately as described in [the visual-check guide](../../docs/visual-checks.md).
