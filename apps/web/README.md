# Web application bootstrap

This directory is the bounded production-code area created by `B00-004`.

The default runtime is intentionally limited:

- `/` identifies the build as a controlled local bootstrap, not a hospital website;
- `/health` returns a non-sensitive local health response;
- Payload and its PostgreSQL adapter are configured as the approved application foundation, but no admin, API, collection, database startup, seed, or personal-data path is mounted;
- the browser receives no remote font, media, analytics, map, chat, replay, pixel, autocomplete, or provider request.

From the repository root:

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm verify
```

Do not add CMS routes or collections here until their own backlog and security/content gates permit them.
