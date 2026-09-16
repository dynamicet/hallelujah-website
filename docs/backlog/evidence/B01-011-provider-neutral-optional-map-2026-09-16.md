# `B01-011` — Provider-Neutral Optional-Map Local Evidence

**Recorded:** 16 September 2026, Africa/Addis_Ababa
**Result:** Local implementation complete; In review for controlled development
**Tester:** Codex directed by client workspace identity `befikadusata` in the temporary Frontend/QA roles
**Build:** `b01-011-optional-map-wrapper` implementation snapshot tested before commit, based on merged `main` commit `e6d567f`; no hosted exact-head result is claimed
**Environment:** Isolated local Next.js production build, Node.js `24.21.0`, pnpm `10.27.0`, headless Chromium from `/snap/bin/chromium` (installed Snap metadata version `152.0.7977.64`)

## Expected and actual results

| Method / expected behavior | Actual result |
| --- | --- |
| `pnpm optional-map:check`: bounded API, ordered text fallback, disabled authority, inert no-JavaScript controls, explicit acknowledgement/intent, removal, and no request/resource destinations | Passed. No approved-provider mode, URL, coordinates, iframe, external-link slot, request API, socket, navigation destination, or persistent storage exists in the implementation. |
| Responsive browser assertions at 320, 360, 375, 667 × 375 landscape, 768, 1280, and 1440 px | Passed. Four specimens preserve address, landmark, entrance, and two ordered steps before each map panel; targets meet the 44 px contract; no detected page overflow or consequential clipping. |
| Unchecked acknowledgement prevents Preview; explicit keyboard intent operates the local placeholder | Passed. The temporary choice starts unchecked. Enter activates only after acknowledgement; the local region receives focus and one atomic polite status describes the placeholder. Activation creates zero new requests. |
| Keyboard Remove, choice revocation, and route exit clear the optional surface | Passed. Space activates Remove, launcher focus returns, and removal is announced politely. Unchecking hides the surface and disables Preview. Page exit clears both surface and choice; restored-page cleanup also exists. No resource or provider is retained. |
| True JavaScript-disabled reload | Passed. Acknowledgement and Preview remain disabled, the placeholder is hidden, all four complete written routes remain in HTML, and no embedded resource surface exists. |
| Blocked/loading/failure resilience | Passed. Disabled authority offers no action; the loading specimen is explicitly synthetic and busy; failure retains the written route and provides no unapproved retry or outbound link. |
| 200%/400% viewport-equivalent reflow and 200% root-text enlargement | Passed. The full geometry check and optional-map enlarged-text assertions detect no consequential clipping after compact padding/list-indent correction. |
| Reduced motion, print, and forced colors | Passed. Loading motion becomes static; print retains directions and hides optional panels; forced colors retain non-color state borders and enabled-control focus. |
| Browser network events from navigation through interactions/reloads | Passed. Zero requests outside the loopback application origin; zero new requests on activation/removal. Failed as well as successful request attempts are observable through DevTools network events. |
| `pnpm verify`: policy, links, secrets, backlog, lint, types, tests, production build, semantic smoke, budgets, runtime headers, existing foundation/cards, and optional-map browser matrix | Passed locally. No new public route, data collection path, migration, container, package, or provider is introduced. |
| Built budget smoke | Passed: 146,077 compressed JavaScript bytes, 183,163 initial compressed bytes, 15 requests, zero external initial origins. |
| `pnpm secrets:check --history` | Passed for the current tree and reachable Git history; matched values would be redacted. |
| `pnpm audit:dependencies` | Fresh approved-network audit passed for 650 dependencies with zero moderate, high, or critical known vulnerabilities. The dependency graph is unchanged. |
| Sanitized visual inspection | [320 px](b01-011-rendered/b01-011-optional-map-320.png) and [1440 px](b01-011-rendered/b01-011-optional-map-1440.png) reviewed for complete fallback, wrapping, grouping, state wording, inert acknowledgement, and synthetic disclaimers. Captures focus the map fixture by temporarily hiding unrelated sibling fixtures; no production DOM or code is changed by capture framing. |

## Source fingerprints

SHA-256 identifies the implementation and browser harness reviewed locally; this does not replace
the future exact-commit hosted gate.

| File | SHA-256 |
| --- | --- |
| `apps/web/src/design-system/components/optional-map.tsx` | `fe88ecd6c707ede3cb474266a035491921f1cb6d611aabbfe040e0483263067e` |
| `apps/web/src/design-system/components/optional-map.module.css` | `91ee34863e2cc86c86310dbfa1f4c681fd0f35e830a19a1389cc528473966398` |
| `apps/web/public/optional-map.js` | `0d78ff5ab32c3aaddf24b9e2943a487bdf1957ae2b60f61ce8c51d8535529acf` |
| `scripts/check-rendered-foundations.mjs` | `0b251483ae423b2ef77335c90375c58eb4259f4961ae1778b46e5eb81886e345` |

## Defects and retests

- Compact nested padding and list indentation initially clipped content at 200% text. Reduced
  compact padding/indentation and an explicit idle style corrected it; the full reflow matrix passes.
- The first synthetic Enter test sent raw keydown only, which did not emit Chromium's button
  keypress. Normal Enter dispatch now follows verified acknowledgement and launcher focus; both
  Enter Preview and Space Remove pass. A disabled launcher was also an invalid forced-colors focus
  target; the corrected check uses the enabled, labeled acknowledgement control.
- Chromium's long-page fixture crop shifted the compact capture. Focused-fixture framing produces
  complete sanitized captures. This was an evidence-framing correction, not a component mutation.
- The sandbox prevented loopback/browser startup and stalled the registry audit. Approved bounded
  outside-sandbox runs completed both checks. No application provider request was authorized.

## Remaining acceptance boundaries

Client controlled-development acceptance, issue/pull-request review, and hosted exact-head `T1`
remain unclaimed. The client subsequently directed a local commit of this implementation;
no push, issue, or pull request is authorized or claimed.

Real provider selection/integration and activation still require `B00-014` / `SEC-02`. Real arrival
facts, contacts, entrances, access guidance, and coordinates require applicable content and
`SAFE-03` approval. The local acknowledgement is not provider consent and stores nothing. Real
privacy notices, professionally reviewed languages, physical devices, assistive technology,
operations, public routes, production, and publication retain their gates. The site can remain
text-first with no provider permanently.
