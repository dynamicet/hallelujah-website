# Controlled Emergency Page Architecture

**Authority:** B03-008 controlled sequencing exception extended by B03-009
**Status:** Synthetic local composition and resilience states; not hospital safety or publication approval

The reusable `EmergencyTemplate` is a server component with no fetch, client boundary or safety
inference. A future approved content adapter must supply the canonical contact, route distinction,
scope and arrival records. The current loopback adapter supplies only deliberately invalid fixtures.
Its B03-009 resolver validates lifecycle, approval and every required field before passing a ready
record to the template.

## Boundary

```text
synthetic fixture (scripts/lib only)
  -> expiry-first, fail-closed resolver
      -> expired/unavailable composition (no record values)
      -> ready/unsupported-handoff/map-state composition
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

## State resolution

The resolver uses this fixed dominance order:

1. an invalid or elapsed lifecycle selects `expired`;
2. absent approval or any missing/blank required field selects `unavailable`;
3. unsupported handoff retains only the already validated synthetic purpose and display values;
4. optional-map failed/blocked states retain the complete validated E5/E6 text first;
5. otherwise the controlled record is ready.

Expired and unavailable results are newly constructed objects. They do not carry route choices,
distinctions, scope, arrival, warning or support values into rendering. Their reduced E1/E8 source
order explains the boundary and provides an internal recovery destination. Static server-rendered
states have no live-region semantics. The explicit injected-handoff specimen is also readable in
static HTML; a loopback-only enhancement upgrades its single programmatically focusable notice to a
polite, atomic status after load. The two inert route cards never announce separately, and no-JS
output retains the notice without a live region.

## Safety invariants

- Experience level is permanently `0`; the Emergency subtree contains no animation or transition.
- Route choice precedes expanded distinction; warning precedes scope and arrival information.
- Required facts never fall back, infer, rank or substitute.
- Surrounding cards, whitespace, focus, pointer-down and touch-start have no call behavior.
- No map/provider request occurs; text directions remain complete in source order.
- No online-contact action, personal-data field, analytics, media or external URL is present.
- Required states have no loading or empty substitute; expiry dominates every lower state.
- Required arrival failure cannot fall back to a map; optional-map failure cannot remove E5/E6.
- No-JavaScript, no-CSS, forced-colors, print and text-resize modes preserve semantic source order.
- Loopback responses are no-store/noindex and use `connect-src 'none'`, `form-action 'none'`,
  `frame-ancestors 'none'` and a loopback Host allowlist.

## Promotion boundary

Before a public route exists, B03-001–B03-003 and SAFE-01–SAFE-04 must provide signed current facts;
LANG-01 must supply professionally reviewed safety language; the adapter must reject incomplete or
expired required records; and B03-009/B03-010 must prove visible/normalized number parity, deliberate
physical-device dialer activation, arrival without a map, failure states and human comprehension.
