# `B01-007` Search and Filter Primitives — Local Evidence

**Recorded:** 14 September 2026, Africa/Addis_Ababa

**Result:** In review for controlled development; full local `T0` pass

## Evidence summary

| Area | Result |
| --- | --- |
| Public APIs | Search GET form/box, filter disclosure/group, active-filter list, atomic polite count, real-link pagination, and typed URL-state helpers are exported through the component boundary. |
| Canonical contract | The manifest generates 312 primitive/semantic/component tokens; drift and all registered component/template consumer checks pass. |
| URL state | The adapter emits only normalized bounded `q`, consumer-allowlisted repeated `type`, and positive bounded `page`; unknown values and unrelated keys do not survive reconstruction. |
| Semantics | Persistent search label/hint, native search input/submit, fieldset/legend/checkbox filters, purpose-labeled chip removal, clear-all recovery, `role="status"` with atomic polite announcement, pagination navigation, and current-page state pass static checks. |
| Progressive behavior | Server-rendered GET state covers direct navigation and no-JavaScript response. The first-party enhancement makes no request or persistent write; it restores URL-authoritative controls, manages compact/wide filter visibility, closes on Escape, and restores summary focus. |
| Responsive/reflow | 320, 360, 375, 667 × 375 landscape, 768, 1280, 1440, 200%/400% viewport equivalents, and 200% root-text enlargement pass without detected clipping or page overflow. |
| Interaction | Search/filter serialization, filtered response, real-link page 2, Back restoration, active-chip/count agreement, and compact Escape focus pass in headless Chromium. Visible targets measure at least 44 × 44 CSS px. |
| Resilience | The no-JavaScript GET response retains bounded query/filter state and its matching controlled result. Reduced motion, forced colors, and print have explicit treatments. Empty results include reset guidance. |
| Built and runtime gates | Request-rendered accessibility and asset-budget checks pass through the bounded built-application harness; initial transfer is 154,645 compressed bytes across 12 requests with 138,632 compressed JavaScript bytes and zero external origins. Runtime headers permit same-origin form submission while retaining default-self, frame, object, referrer, MIME, and powered-by protections. |
| Visual review | [320px](b01-007-rendered/b01-007-search-controls-320.png) and [1440px](b01-007-rendered/b01-007-search-controls-1440.png) captures were inspected for hierarchy, wrapping, disclosure, filter readability, clear controls, count/result association, pagination labels, and controlled-data/privacy boundaries. |
| External boundary | Five synthetic records only; no real hospital record, route, contact, taxonomy, translation, provider, request, analytics, query log, personal data, or publication authority was introduced. |

## Performed commands

```sh
pnpm tokens:generate
pnpm search-controls:check
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm search-controls:smoke --capture-dir docs/backlog/evidence/b01-007-rendered
pnpm verify
pnpm secrets:check --history
pnpm audit:dependencies
```

The initial command inherited Node.js 25 and correctly stopped at the exact-engine guard. Accepted
checks use installed Node.js `24.21.0` and pnpm `10.27.0`.

The restricted sandbox denied the first loopback run; the approved bounded rerun started the local
server and headless Chromium. The rendered matrix exposed and drove correction of closed-details
author-style precedence, fragment-insensitive history assertions, stale restored checkbox state,
ambiguous test selection, wide no-JavaScript filter visibility, duplicate numeric Next labeling,
and intrinsic-width pressure at 200% text. Full verification then found that the request-rendered
root was outside the static-only accessibility and asset-budget assumptions and that CSP still
blocked every form action. The built-route harness now preserves both gates for dynamic output, and
the CSP permits same-origin forms only. The final targeted and full local matrices pass; the audit
reports 650 dependencies with zero moderate, high, or critical known vulnerabilities.

## Evidence boundary and residual gates

- Screenshots contain controlled-development fixture text and five synthetic records only. They
  contain no personal, clinical, operational, credential, contact, or restricted evidence.
- The browser run is implementation smoke, not final physical-device, browser, screen-reader,
  switch-control, comprehension, or professional Amharic review.
- Public search/directory routes remain unmounted. Searchable records, taxonomy, ranking,
  corrections, and urgent-term behavior remain gated by `SEARCH-01`; query handling remains gated
  by `SEARCH-02`; providers remain gated by `SEC-02`.
- GitHub [issue `#12`](https://github.com/dynamicet/hallelujah-website/issues/12) carries the scoped
  repository review. Pull-request and hosted current-head evidence remain pending.
- Publication, providers, personal-data collection, deployment, DNS, production, and release
  authority remain unchanged.
