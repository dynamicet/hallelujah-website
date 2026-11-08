# Staging demo deployment

Deploy the `staging/development` branch. It contains the connected presentation
demo and bundled assets. No database, API keys, CMS setup, or manually supplied
environment variables are needed. This is a demo deployment, not the live CMS or
appointment service; appointment requests are not submitted or stored.

## Railway

1. Create a project from the GitHub repository `dynamicet/hallelujah-website`.
2. Select `staging/development` as the service's source branch.
3. Keep the root directory at the repository root (`/`).
4. Deploy, then generate a public domain under Networking.

The root `railway.json` selects Railpack, runs `pnpm build:demo`, starts
`pnpm start:demo`, and checks `/health`. The server binds to `0.0.0.0` and uses
Railway's `PORT`. Node and pnpm versions come from the root package manifest.
No database service or persistent volume is required.

## Vercel

1. Import `dynamicet/hallelujah-website` and choose `staging/development`.
2. Set **Root Directory** to `apps/web` and enable **Include source files outside
   of the Root Directory in the Build Step** for the workspace lockfile.
3. Use the **Next.js** framework preset and Node.js **24.x**.
4. Deploy. Set the project's **Production Branch** to `staging/development` so
   subsequent staging pushes update its main demo URL.

`apps/web/vercel.json` supplies the build command and demo variables for both build
time and runtime. Leave the Install Command override disabled so Vercel detects
pnpm from the workspace lockfile. Keep the output directory at the Next.js default.
Vercel manages Node patch releases. Both workspace manifests accept Node `24.x`,
including Vercel's `24.22.2`, while `.nvmrc`, CI, and container images retain the
tested `24.21.0` development baseline. Strict engine checking stays enabled for
normal installs; the lockfile and application dependency versions stay pinned.

Use a separate project from any future live hospital deployment. The Vercel
"Production" label refers to this demo project's primary URL; the application
still runs with `APP_ENVIRONMENT=staging`.

## Local production verification

```sh
pnpm install --frozen-lockfile
pnpm build:demo
pnpm start:demo
```

Open `http://localhost:3000`. For another port, use `PORT=3214 pnpm start:demo`.
Run `HH_PREVIEW_URL=http://localhost:3000 pnpm staging:smoke` against the running
server to verify public routes, demo rendering, unknown-route handling, and the
disabled appointment endpoint. Browser checks also accept `HH_PREVIEW_URL`.

The enhanced homepage is selected at build time. Use `pnpm build:demo` for a
hosted demo; setting a demo flag only at runtime cannot enable it in a normal
production build. Normal builds exclude the enhanced homepage client modules.

Hosted demo mode requires both `HH_DEMO_MODE=true` and
`APP_ENVIRONMENT=staging`. It rejects enabled collection/provider gates. Without
the demo flag, the existing strict environment and credential requirements apply.
Keep future feature branches based on `staging/development` to avoid reintroducing
historical review captures through a full merge of the older feature branch.

Platform references: [Railway configuration](https://docs.railway.com/config-as-code/reference),
[Vercel monorepos](https://vercel.com/docs/monorepos), and
[Vercel Node versions](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions).
