# `B01-005` Essential Actions — Local Evidence

**Recorded:** 14 September 2026, Africa/Addis_Ababa

**Result:** Done for controlled development; local `T0` and hosted implementation `T1` pass

## Evidence summary

| Area | Result |
| --- | --- |
| Public APIs | Native `ActionLink`, `ActionButton`, `TextLink`, `CallAction`, `EmergencyAction`, `ActionGroup`, and three decorative SVG icons are exported through the component boundary. |
| Canonical contract | Manifest generates 250 primitive/semantic/component tokens; drift and all component-consumer checks pass. |
| Contrast | 18 recorded pairs cover default, hover, active, emergency, secondary/tertiary hover, disabled, status, focus, and control-boundary uses. |
| Semantics and names | Anchors navigate/call, buttons submit or change state, every specimen has visible purpose text, disabled reasoning is associated, and decorative icons are hidden from assistive technology. |
| Telephone invariant | The visible controlled number normalizes to the same value used by the generated `tel:` href; invalid non-international structures fail closed. No real hospital contact is present. |
| Responsive/reflow | 320, 360, 375, 667 × 375 landscape, 768, 1280, 1440, 200%/400% viewport equivalents, and 200% root-text enlargement pass without detected clipping or page overflow. |
| Interaction | Targets measure at least 44 × 44 CSS px, groups compute at least 8 px gaps, keyboard activation fires once, a moved touch fires zero activations, and focus retains the 3 px shared indicator. |
| Emergency | Visible “Emergency” text, supporting siren icon, persistent divider, and `data-experience-level="0"` remain; computed transition duration is zero. |
| Resilience | Server-rendered actions require no client JavaScript, provider, external request, remote asset, custom font, personal data, or approved hospital facts. Reduced motion, forced colors, and print have explicit treatments. |
| Security and dependencies | Current source plus reachable Git history secret scanning passes; 650 dependencies report zero moderate, high, or critical known vulnerabilities. |
| Visual review | [320px](b01-005-rendered/b01-005-essential-actions-320.png) and [1440px](b01-005-rendered/b01-005-essential-actions-1440.png) captures were inspected for hierarchy, wrapping, separation, focus, disabled reasoning, and non-color emergency meaning. |
| Hosted implementation gate | [`quality-and-security`](https://github.com/dynamicet/hallelujah-website/actions/runs/34869074953) passed in 2m06s on commit `c8491ef`. |

## Performed commands

```sh
pnpm tokens:generate
pnpm tokens:check
pnpm actions:check
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm actions:smoke -- --capture-dir docs/backlog/evidence/b01-005-rendered
pnpm verify
pnpm secrets:check --history
pnpm audit:dependencies
```

The initial local command inherited Node.js 25 and correctly stopped at the pinned-engine guard.
All accepted checks above ran with the installed Node.js `24.21.0` and pnpm `10.27.0` baseline.

The first browser invocation was denied loopback binding by the restricted sandbox. The approved
bounded rerun started only the local production server and headless browser. It exposed two test
harness defects: focus style was read after focus moved, and an embedded normalization expression
lost an escape. Both harness defects were corrected. The complete browser matrix then passed,
including native keyboard activation and moved-touch cancellation.

## Evidence boundary and residual gates

- Screenshots contain controlled-development fixture text and a structurally valid but non-staffed
  number. They contain no personal, clinical, operational, credential, or restricted evidence.
- The browser run is implementation smoke, not the final physical-device, browser, screen-reader,
  switch-control, or professional Amharic review required for production acceptance.
- Real emergency, ambulance, switchboard, appointment, and hours data remain withheld under
  `SAFE-01`; direct emergency calling is not activated by this evidence.
- GitHub [issue `#8`](https://github.com/dynamicet/hallelujah-website/issues/8) and [pull request
  `#9`](https://github.com/dynamicet/hallelujah-website/pull/9) carry the scoped repository review.
  Hosted run `34869074953` proves `c8491ef`; this documentation-closeout revision must repeat the
  exact-head gate before merge. Publication, providers, personal-data collection, deployment, DNS,
  and production authority remain unchanged.
