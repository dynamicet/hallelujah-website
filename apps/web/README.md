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
one environment-matched URL/abuse-secret/notice-version set. The controlled migration and runtime
remain synthetic-only; see the
[appointment foundation](../../docs/architecture/appointment-request-foundation.md).

Do not add CMS routes or collections here until their own backlog and security/content gates permit them.
