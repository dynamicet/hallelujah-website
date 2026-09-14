# `B01-006` Global Shell and Navigation — Local Evidence

**Recorded:** 14 September 2026, Africa/Addis_Ababa

**Result:** In review for controlled development; local `T0` passes and hosted `T1` is pending

## Evidence summary

| Area | Result |
| --- | --- |
| Public APIs | `SiteShell`, `SiteHeader`, `PrimaryNavigation`, `Breadcrumbs`, `LanguageSwitcher`, `SiteFooter`, `SkipLink`, and their typed contracts are exported through the component boundary. |
| Canonical contract | The manifest generates 285 primitive/semantic/component tokens; drift and all registered component-consumer checks pass. |
| Semantic structure | One banner, one primary navigation list, one focusable main target, optional breadcrumb navigation, and one footer render in meaningful order. |
| Responsive navigation | One list serves compact and wide layouts. Native Popover behavior exposes the compact list; a same-origin external enhancement reflects expanded state, closes on navigation, and restores focus after Escape without changing the static-rendered route. |
| Current and location state | The controlled current route exposes `aria-current="page"` plus a 3 px border marker; breadcrumb ancestors link and the current item is text. |
| Language | English and Amharic language names carry `lang` metadata; no flag is used; the unavailable Amharic equivalent is non-interactive and associated with an explicit reason. No translation is represented as approved. |
| Responsive/reflow | 320, 360, 375, 667 × 375 landscape, 768, 1280, 1440, 200%/400% viewport equivalents, and 200% root-text enlargement pass without detected clipping or page overflow. |
| Interaction | Visible targets measure at least 44 × 44 CSS px; the compact popover opens natively; Escape closes it and restores focus; the skip link moves focus to main. |
| Resilience | Navigation, links, popover, breadcrumb, language status, and footer are server-rendered. The enhancement makes no request and stores no state. Reduced motion, forced colors, and print have explicit treatments. |
| Visual review | [320px](b01-006-rendered/b01-006-global-shell-320.png) and [1440px](b01-006-rendered/b01-006-global-shell-1440.png) captures were inspected for hierarchy, wrapping, action separation, current state, controlled-language status, and footer fallback. |
| Hosted implementation gate | Pending pull-request `quality-and-security` run on the exact review head. |

## Performed commands

```sh
pnpm tokens:generate
pnpm tokens:check
pnpm shell:check
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm shell:smoke --capture-dir docs/backlog/evidence/b01-006-rendered
pnpm verify
pnpm secrets:check --history
pnpm audit:dependencies
```

The initial command inherited Node.js 25 and correctly stopped at the exact-engine guard. Accepted
checks use installed Node.js `24.21.0` and pnpm `10.27.0`.

The restricted sandbox initially denied loopback binding. The approved bounded rerun exposed a Snap
Chromium profile-path incompatibility, so the shared runner now discovers DevTools through a random
loopback port rather than a host-invisible profile file. Rendered checks then found and corrected a
200% identity compression and an evidence-capture focus artifact. The final matrix passed.

Strict CSP blocked the first hydrated React focus enhancement. The implementation retained the
static route and strict policy by replacing that boundary with native Popover behavior plus one
same-origin deferred script. No `unsafe-inline`, nonce-driven dynamic rendering, external provider,
request, persistent storage, or visitor-data path was introduced.

## Evidence boundary and residual gates

- Screenshots contain controlled-development fixture text only. They contain no personal, clinical,
  operational, credential, contact, or restricted evidence.
- The browser run is implementation smoke, not final physical-device, browser, screen-reader,
  switch-control, or professional Amharic review.
- Public routes remain unmounted. Real contacts remain withheld under `SAFE-01`; final route and
  language labels remain gated by `LANG-01` and the consuming page/content tickets.
- GitHub [issue `#10`](https://github.com/dynamicet/hallelujah-website/issues/10) carries the scoped
  repository record; pull-request and exact-head hosted evidence are pending.
- Publication, providers, personal-data collection, deployment, DNS, and production authority
  remain unchanged.
