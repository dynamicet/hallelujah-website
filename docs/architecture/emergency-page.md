# Controlled Emergency Page Architecture

**Authority:** B03-008 controlled sequencing exception
**Status:** Synthetic local implementation; not hospital safety or publication approval

The reusable `EmergencyTemplate` is a server component with no fetch, client boundary or safety
inference. A future approved content adapter must supply the canonical contact, route distinction,
scope and arrival records. The current loopback adapter supplies only deliberately invalid fixtures.

## Boundary

```text
synthetic fixture (scripts/lib only)
  -> loopback renderer
  -> reusable EmergencyTemplate
  -> static E1–E8 HTML inside SiteShell E0

deployable application
  - does not import the fixture, renderer or preview server
  - does not mount /emergency/
  - contains no active emergency call or map integration
```

The template preserves route-choice, distinction, warning, scope, directions, arrival, optional-map
and non-emergency-support positions. Controlled route values render as plain, explicitly inert text,
not anchors or disabled red buttons. This prevents a placeholder from initiating a call while still
allowing responsive, semantic and visual review.

## Safety invariants

- Experience level is permanently `0`; the Emergency subtree contains no animation or transition.
- Route choice precedes expanded distinction; warning precedes scope and arrival information.
- Required facts never fall back, infer, rank or substitute.
- Surrounding cards, whitespace, focus, pointer-down and touch-start have no call behavior.
- No map/provider request occurs; text directions remain complete in source order.
- No online-contact action, personal-data field, analytics, media or external URL is present.
- Loopback responses are no-store/noindex and use `connect-src 'none'`, `form-action 'none'`,
  `frame-ancestors 'none'` and a loopback Host allowlist.

## Promotion boundary

Before a public route exists, B03-001–B03-003 and SAFE-01–SAFE-04 must provide signed current facts;
LANG-01 must supply professionally reviewed safety language; the adapter must reject incomplete or
expired required records; and B03-009/B03-010 must prove visible/normalized number parity, deliberate
physical-device dialer activation, arrival without a map, failure states and human comprehension.
