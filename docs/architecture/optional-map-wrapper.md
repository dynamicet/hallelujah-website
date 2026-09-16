# Provider-Neutral Optional-Map Wrapper

**Implementation boundary:** `B01-011`, controlled local development only
**Provider authority:** Not granted; `B00-014` is deferred and `SEC-02` is unresolved

## Text-first architecture

`OptionalMap` is a server-rendered component exported through the design-system component API.
Address, landmark, entrance, and ordered text directions render before the optional panel and never
depend on its state, JavaScript, a map, images, or a third party. Consumers must supply approved
arrival facts before public-route integration; the local fixture supplies visibly synthetic text.

The current API accepts no provider URL, coordinates, external link, iframe, tile source, script
source, or provider surface. It has no production-approved provider mode. Consequently, an approval
marker alone cannot turn this implementation into a working external integration.

## Authority and states

| Authority | Allowed initial state | Behavior |
| --- | --- | --- |
| `not-approved` | `blocked` | Disabled map action, explicit reason, and complete written directions. |
| `controlled-fixture` | `idle` | Unchecked local-test acknowledgement and disabled Preview button precede first-party enhancement. Explicit Preview reveals only a local placeholder. |
| `controlled-fixture` | `loading` | Visibly synthetic busy-state specimen preserves all directions; no request or operational wait exists. Reduced motion uses a static indicator. |
| `controlled-fixture` | `failure` | Visibly synthetic failure wording retains the written route; no retry, inferred destination, or external fallback link is offered. |

The acknowledgement is not consent to a provider or a privacy-consent record. It remains unchecked
by default, is never serialized or stored, and only enables the fixture Preview button. A real
provider's disclosure, activation/consent policy, data flow, timeout, failure, and removal rules
require their own approved change.

## First-party enhancement

The bounded `/optional-map.js` enhancement operates only on an idle controlled fixture. Checking
the local acknowledgement enables Preview; Preview displays a clearly labeled placeholder and
focuses it. Remove clears the placeholder, announces removal politely, and restores focus to the
launcher. An empty, visually hidden polite live region exists before interaction so announcements
do not depend on exposing a previously hidden region. Unchecking removes an active placeholder.
Page exit clears the placeholder and the local
choice; a restored page also clears the choice. No persistent storage, request API, geolocation,
navigation, or resource destination exists.

Without JavaScript, acknowledgement and Preview remain disabled while the complete written route
is readable. Print omits the optional panel rather than the directions. Responsive layouts,
non-color boundaries, focus outlines, forced colors, and reduced loading motion use existing
canonical tokens.

## Verification and future integration

`pnpm optional-map:check` enforces the source/API boundary, ordered fallback, states, inert default,
local acknowledgement/intent, removal, cleanup, and lack of request/resource destinations.
`pnpm optional-map:smoke` records browser requests, verifies no new request on activation/removal,
checks keyboard focus, actual JavaScript-disabled output, responsive/enlarged text, reduced motion,
print, and forced colors. Both are part of the repository's verification path.

Before any real provider is added, reopen `B00-014` and close the applicable `SEC-02` review. Before
real arrival content appears, resolve the relevant `SAFE-03`, content, language, and publication
gates. The website may retain the text-first/no-provider approach permanently.
