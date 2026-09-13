# `B00-004` Clean Application Bootstrap Completion Record

**Outcome:** Passed for the controlled `T0` local-development boundary

**Date / timezone:** 13 September 2026, Africa/Addis_Ababa

**Responsible tester:** Codex, directed by client workspace identity `befikadusata`

**Acceptance:** Client workspace identity `befikadusata` authorized controlled local execution; named Delivery and Security acceptance remains required before production

## Artifact and environment

- Preparation commit: `19fea5e` (`docs: prepare B00-004 clean bootstrap`).
- Implementation artifact: the commit containing this evidence record, built from the working tree based on `19fea5e` before commit.
- Controlled workspace: Linux `x86_64`, Node.js `v25.2.1`, pnpm `10.27.0`.
- Runtime at initial execution: Node.js `v25.2.1`, subsequently identified as EOL by the `B00-005` follow-up. The repository now pins Node.js `24.21.0` LTS in both package manifests and `.nvmrc`; the original result remains recorded here rather than rewritten as if it ran on Node.js 24. Final support/update policy remains `B00-005`.
- Clean reconstruction: an isolated temporary copy containing no `.git`, `node_modules`, or `.next` from the controlled workspace.

## Executed evidence

| Check | Exact command / session | Expected | Actual / retest state |
| --- | --- | --- | --- |
| Initial dependency resolution | `pnpm install --no-frozen-lockfile --reporter=append-only --network-concurrency=8 --fetch-retries=5 --fetch-timeout=60000` | Resolve manifests and create lockfile | Passed after registry retries; 545 packages linked and native post-install scripts passed |
| Working-tree lock alignment | `pnpm install --offline --frozen-lockfile --reporter=append-only` | No dependency or lock drift | Passed; lockfile was up to date |
| Isolated reconstruction | `pnpm install --frozen-lockfile --reporter=append-only --network-concurrency=8 --fetch-retries=5 --fetch-timeout=60000` in the clean temporary copy | Install only the lockfile graph without a prior dependency/build tree | Passed; all 545 packages downloaded/linked in 11m 23.5s; lockfile unchanged |
| Complete clean-copy verification | `pnpm verify` | Lint, strict types, boundary test, and production build pass | Passed; static `/`, generated `/_not-found`, and dynamic `/health` were produced |
| Lint | `pnpm lint` | Zero warnings/errors | Passed after naming the flat ESLint configuration export |
| Strict types | `pnpm typecheck` | Zero TypeScript errors | Passed |
| Boundary scan | `pnpm test` | No prohibited prototype/legacy import, external origin, public environment value, or private-key marker | Passed; 6 source/config files inspected |
| Production build | `pnpm build` | Compile, type-check, collect data, and generate routes | Passed with Next.js `16.3.3` Turbopack and the in-process TypeScript compiler API |
| Local startup | `pnpm --dir apps/web start --hostname 127.0.0.1 --port 3100` | Bind locally and serve the built bootstrap | Passed; ready in 158ms; server stopped after smoke checks |
| Root smoke | `curl --silent --show-error --dump-header ... http://127.0.0.1:3100/` | `200`, local-bootstrap copy, security headers | Passed; `200`, no hospital content, CSP, `Referrer-Policy: no-referrer`, and `X-Content-Type-Options: nosniff` |
| Health smoke | `curl --silent --show-error --dump-header ... http://127.0.0.1:3100/health` | Non-sensitive healthy response without caching | Passed; `200`, `{"scope":"local-bootstrap","status":"ok"}`, and `Cache-Control: no-store` |
| Controlled-workspace backlog integrity | `node docs/backlog/audit-backlog.mjs` | 10/10 assertions | Passed before completion-record updates; final rerun is recorded in the implementation commit |

## Security and scope review

- Installation contacted only `https://registry.npmjs.org` for package metadata and lockfile-pinned tarballs. Official platform source review used Payload's official documentation/repository and Next.js official documentation.
- The running application made no request to an external origin. It has no remote font, image, analytics, map, chat, replay, pixel, autocomplete, email, storage, monitoring, or other provider configuration.
- No Payload admin/API route, CMS collection, seed, database startup, form, upload, appointment field, or personal-data path is mounted.
- No legacy WordPress executable/configuration state, prototype source/import, fictional hospital record, real content, credential, private key, signature, restricted incident detail, or production identifier was introduced.
- The default page explicitly identifies itself as a local bootstrap and carries `noindex, nofollow`; it makes no public-site, hospital-content, accessibility-conformance, release, or publication claim.
- Next.js uses its in-process TypeScript compiler API because this Node.js 25 sandbox returned empty stdout from spawned child processes; TypeScript errors remain enforced both by `pnpm typecheck` and the production build. No type/build error is ignored.

## Observation and disposition

The application-only clean copy omitted the authorized sibling `../resources` and `../audit` directories. Its backlog audit therefore reported 22 missing pre-existing cross-repository links, while the same audit passed 10/10 in the controlled workspace where those directories exist. This did not affect the clean dependency installation, source boundary test, or production build. Repository-wide documentation portability is not claimed by this application reconstruction and should be reconsidered if the sibling evidence layout changes.

No approved exception was used. The only command corrections were the named ESLint export, explicit pnpm-workspace Turbopack root, and selection of Next.js's in-process TypeScript validation. All affected checks passed on retest.

## Supported-runtime follow-up

The installation was rechecked on 13 September 2026 after the original Node.js 25 runtime was found to be EOL. Node.js `24.21.0` is an LTS release; its official Linux `x64` archive was verified against the published SHA-256 checksum before use. Both package manifests and `.nvmrc` now require that exact release, and the workspace enables pnpm's strict engine enforcement.

Under Node.js `24.21.0`, a forced frozen-lockfile reinstall completed all dependency lifecycle scripts, followed by a successful offline frozen-lockfile install with strict peer-dependency enforcement. `pnpm verify` passed lint, strict type checking, the source-boundary test, and the production build. The production server then returned HTTP `200` for both `/` and `/health`, with the expected security and cache-control headers. The workspace package graph was present, no broken dependency symlinks were found, and all three installed esbuild executables returned their declared versions (`0.18.20`, `0.25.12`, and `0.28.2`).

`pnpm store status` continues to label those three esbuild packages as modified after installation. This matches pnpm's documented issue where esbuild's post-install process changes its store-backed executable; the successful clean reinstall, direct executable checks, and full verification do not indicate a broken install. This signal must therefore be interpreted as an esbuild-specific pnpm store-status limitation, not silently discarded for other packages.

The production dependency audit reported no high or critical vulnerabilities. It did report three moderate and two low transitive advisories: an older esbuild used through Drizzle tooling and DOMPurify used through the currently unmounted Payload/Monaco administration UI. Those paths are not exposed by this bootstrap, but the advisories remain open for supported dependency selection and security disposition under `B00-005`; this follow-up does not claim a zero-advisory dependency graph.

## Authority boundary

This record closes only `B00-004` for controlled local development. It does **not** authorize publication, personal-data collection, an application provider, staging, production, deployment, migration, legacy import, database provisioning, DNS/TLS change, or release. Named production owners, Security acceptance, and all deferred gates remain open.
