# Production Component Architecture

**Backlog authority:** `B01-001`

**Execution boundary:** Controlled local and private-repository development only

**Publication, collection, provider, deployment, and production authority:** Not granted

## Outcome

Production UI follows a one-way composition path with a bounded public API at every layer:

```text
app route or layout
        ↓
template public API
        ↓
component public API
        ↓
primitive public API
        ↓
typed experience contracts
```

The design-token value path remains separately governed by `B01-003`:

```text
primitive value → semantic purpose → component alias → template composition
```

This separation keeps routing and content decisions out of reusable components, keeps page
composition out of primitives, and allows the provisional visual values to be replaced centrally
without importing a page study or prototype runtime.

## Source topology and public APIs

| Layer | Production location | Public API | May depend on | Must not own |
| --- | --- | --- | --- | --- |
| App | `src/app/` | Next.js route and layout files | Template API and server boundaries | Reusable component implementations, fixture controls, or page-study CSS |
| Templates | `src/design-system/templates/` | `templates/index.ts` | Components, primitives, and typed contracts | Hospital facts, data fetching, route state, or another template's CSS |
| Components | `src/design-system/components/` | `components/index.ts` | Primitives and typed contracts | Route composition, raw content records, or template imports |
| Primitives | `src/design-system/primitives/` | `primitives/index.ts` | Typed contracts | Page-specific variants, business rules, or template/component imports |
| Contracts | `src/design-system/contracts/` | `contracts/index.ts` | TypeScript/platform types only | Rendering, remote assets, providers, or runtime selection |

Cross-layer imports target only the receiving layer's `index.ts` API. Files within one layer may use
relative imports. App files may consume the design system only through `@/design-system/templates`.
The automated application boundary check rejects upward imports, internal-file bypasses, and
template CSS whose basename does not match its owning template.

## Bounded component API rules

- Public props express semantic needs and supported variants; arbitrary route records and prototype
  configuration objects do not cross the boundary.
- Server Components are the default. A future interactive leaf may use `use client` only when its
  documented behavior requires browser state, events, or APIs.
- The route owns approved content and route data. A template owns page composition. A component owns
  reusable behavior and anatomy. A primitive owns the smallest stable semantic structure.
- Essential content, actions, focus order, state meaning, and recovery must exist in the server
  result before optional enhancement.
- Global CSS is limited to truly global document rules. Template CSS is colocated in a matching CSS
  Module. Component styles introduced by later tickets remain local to their component boundary.
- Current bootstrap colors and dimensions are quarantined in its template stylesheet. They are not
  a canonical token source and must move to generated aliases under `B01-003` before production UI
  styling expands.

## Motion and interactive-media boundary

The contracts layer names Levels `0`–`4` and the permanent protected contexts. Protected contexts
have a maximum expressive level of `0`; immediate native and functional feedback remains allowed.
This prevents a parent composition from treating emergency, urgent guidance, consequential
appointment meaning, error, privacy/consent, unavailable/expired, or unknown-outcome meaning as an
expressive entrance.

`B01-001` does not select or load a motion runtime, media asset, player, provider, observer, or
animation. Runtime capability selection, reduced-motion/Save-Data behavior, cleanup, and measured
motion/media evidence remain `B01-012`–`B01-013`. Authentic media remains gated by `B01-002` and
`B02-011`.

## Prototype-to-production prohibitions

Production source must not contain:

- page-study, prototype-script, or prototype CSS imports;
- reviewer toolbars or reviewer controls;
- fixture query controls or simulated outcomes;
- remote prototype assets or unapproved external origins;
- cross-template stylesheet imports;
- legacy WordPress runtime/configuration references; or
- browser-exposed environment configuration outside the server environment contract.

The source boundary check scans the application tree for these signatures and contains synthetic
negative cases proving the architectural import rules fail closed.

## Current implementation proof

The controlled bootstrap route now passes literal, non-hospital content through the templates public
API. `ControlledBootstrapTemplate` composes the `StatusSummary` component and the `PageFrame` and
`ContentSurface` primitives. No client boundary or additional route is created, and the rendered
meaning remains unchanged.

Exact verification and current execution results are recorded in the
[`B01-001` evidence](../backlog/evidence/B01-001-production-component-architecture-2026-09-14.md).
