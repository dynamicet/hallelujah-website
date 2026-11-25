<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Shared public shell

Public hospital routes belong in `src/app/(public)/`. Its shared layout owns
`SiteShell`, header/footer, main and skip link automatically. Pages render body
content only; do not call `demoShell` or pass `shell` to page templates there.
Use optional patterns from `src/website/page-patterns.tsx` or `PatientPage` when
helpful; custom page markup and design are supported without opting out of the
shared site layout. See `docs/architecture/public-page-patterns.md` at repo root.
The `/` route always renders `WebsiteHome`; query parameters and deployment mode
must not select a different homepage template.
Do not duplicate header/footer configuration or insert standalone menu links.
Add primary menu entries once in `hospitalShellConfig`; shared navigation renders
all entries with the same hover, focus, responsive-menu and current-page styles.
Nested routes inherit their parent menu's current state. Keep the full home and
compact interior footer variants. Existing and future routes, including Careers, follow this
pattern; design prototypes are not application routes.
