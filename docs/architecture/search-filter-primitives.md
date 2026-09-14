# Search and Filter Primitive Architecture

**Status:** Controlled-development implementation baseline  
**Execution boundary:** Local and private-repository validation only  
**Publication and query-processing authority:** Not granted

## Purpose

`B01-007` provides reusable search, filter, active-chip, result-count, pagination, and disclosure
APIs without deciding what hospital content is searchable. The components preserve a native GET
baseline and accept only public, navigational state. Search vocabulary, ranking, urgent terms,
query handling, and production routes remain with `SEARCH-01`, `SEARCH-02`, and their consuming
tickets.

## Component boundary

The component public API exports:

- `SearchControlsForm` and `SearchBox` for a labeled native GET search with a persistent hint and
  bounded `q` input;
- `FilterDisclosure` and `FilterGroup` for native compact disclosure plus fieldset, legend, and
  checkbox semantics;
- `ActiveFilterList` for visible, purpose-labeled removal links and one clear-all route;
- `ResultCount` for one atomic polite status after a committed result change;
- `Pagination` for real links, current-page semantics, and explicit Previous/Next relationships;
  and
- `parseSearchState`, `createSearchStateUrl`, and `normalizeSearchQuery` for the canonical URL-state
  boundary.

Components own semantics and layout behavior. A consuming directory or search template owns the
approved record data, result rendering, count grammar, filter vocabulary, and route. The controlled
fixture uses five visibly synthetic records and is not a reusable data or search implementation.

## URL-state contract

The adapter recognizes exactly `q`, repeated public `type` slugs, and `page`:

- `q` is Unicode-normalized, whitespace-normalized, control-character stripped, and limited to 80
  characters;
- `type` values survive only when present in the consumer-supplied public allowlist;
- `page` must be a positive safe integer and is clamped to the supplied result-set maximum; and
- URL generation reconstructs state from the recognized values, so unrelated, private, draft,
  internal, or personal-data fields cannot be carried through the adapter.

This is a navigational-state boundary, not approval to log or disclose queries. Even bounded public
search terms may reveal health interests. Production logging, caching, referrers, abuse controls,
retention, analytics, suggestions, and third-party receipt remain blocked by `SEARCH-02` and
`SEC-02`.

## Progressive behavior

The server renders the form, controls, count, result links, and pagination. Refresh and browser
Back/Forward therefore restore URL-owned state without JavaScript. The filter disclosure is
server-open so no-JavaScript users can reach every filter. A small first-party enhancement:

- closes an idle disclosure on compact layouts;
- keeps active filters exposed and reopens the panel on wide layouts;
- restores server-authoritative checkbox/input state after navigation restoration; and
- closes an open compact panel on Escape and returns focus to its summary.

The enhancement performs no network request, uses no persistent storage, and does not implement
autocomplete or result processing.

The application CSP permits `form-action 'self'` so the native GET baseline can function while
continuing to reject cross-origin submissions. Personal-data collection remains independently
disabled and fail-closed by the server environment contract.

## Modes and resilience

- Controls and links use generated component aliases only; no raw component colors are introduced.
- Search rows wrap, filters remain operable, and labels use intrinsic containment through compact,
  wide, 200%/400% reflow-equivalent, and 200% text modes.
- Reduced motion resolves functional transitions to the static token.
- Forced colors retain input, control, filter, chip, pagination, and current-page boundaries.
- Print keeps labels, entered state, filters, result count, results, and pagination legible.
- The empty fixture state provides explicit recovery rather than a blank result region.
- Built accessibility and asset-budget checks inspect the request-rendered root through a bounded
  local production server when no implemented static HTML artifact exists.

## Consuming gates

`B01-007` does not approve a public search route, doctor/service directory, record type, real filter,
taxonomy, spelling correction, urgent-term policy, result ranking, query logging, autocomplete,
analytics, personal-data collection, provider, or hospital wording. Those capabilities enter only
through their decision, content, backend, page, security, and publication tickets.

Verification and current execution evidence are recorded in the
[`B01-007` brief](../backlog/b01-007-search-filter-primitives.md) and
[`B01-007` evidence](../backlog/evidence/B01-007-search-filter-primitives-2026-09-14.md).
