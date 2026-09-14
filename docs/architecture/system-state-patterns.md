# System State and Recovery Pattern Architecture

**Status:** Controlled-development implementation baseline

**Execution boundary:** Local and private-repository validation only

**Hospital operations, production, and publication authority:** Not granted

## Purpose

`B01-010` provides reusable server-rendered alert, status, dated temporary-notice, loading,
empty, error, offline, unavailable, and expired patterns. The component layer owns accessible
structure, announcement timing, state distinction, recovery slots, and resilient presentation.
Consuming routes remain responsible for authoritative facts, lifecycle rules, safe actions,
request outcomes, provider behavior, and publication approval.

## Component boundary

The public component API exports:

- `SystemAlert` for emergency, error, warning, information, and success shapes, with success requiring
  an explicit authoritative-completion assertion at the typed boundary;
- `TemporaryNotice` for time-bounded operational wording with required effective, expiry/review,
  and owner metadata;
- `SystemState` for empty, error, offline, unavailable, and expired collection or workflow states,
  each requiring a recovery action;
- `LoadingStatus` for a stable, atomic polite busy state that can preserve critical facts; and
- `NonCriticalSkeleton` for predictable non-critical repeated-record geometry only.

All components remain React Server Components. They add no client bundle, request, timer,
persistent storage, dismissal state, provider, or outcome simulation. A consuming client boundary
may inject a state later, but it must choose announcement timing from the same semantic contract.

## Announcement contract

Static server-rendered content receives no live-region role and is read in document order. A
consumer explicitly selects `polite` or `assertive` only when a state is newly injected:

- blocking errors may use an atomic assertive alert;
- authoritative completion and non-blocking progress may use an atomic polite status; and
- emergency, warning, information, and temporary content remains static unless its accountable
  workflow proves that an injected announcement is required.

Icons are decorative and never carry the state meaning alone. Every panel has a specific heading,
plain-language message, and action/recovery slot. System states require recovery at the TypeScript
boundary. The controlled baseline has no dismissal API because no real notice has yet been proven
safe to hide.

## State precedence

The exported canonical order is:

`unavailable → expired → error → invalid → disabled → loading → pending → pressed → focus-visible → hover → default`

`resolveDominantComponentState` chooses the first active state in that order. Unavailable or
expired content therefore cannot regain an unsafe action through a lower-priority visual state.
Focus is not the dominant meaning when an error or busy state coincides, but the global three-pixel
focus indicator remains visible on enabled actions and programmatic panel focus targets.

## Loading and skeleton boundary

Loading is a real state, not invented progress. The component exposes an atomic busy status and a
stable indicator; the consumer owns the roughly 300 ms display threshold and any cancellation or
fallback offered for longer waits. Reduced motion replaces the looping indicator with a static
double boundary.

`NonCriticalSkeleton` accepts no record content and marks itself as
`non-critical-records`. Its decorative bars are hidden from the accessibility tree and reserve only
predictable repeated-record geometry. Emergency/contact facts, privacy text, validation errors,
arrival guidance, and primary actions remain real readable content through `preservedFacts` or
outside the loading boundary.

## Temporary and lifecycle metadata

`TemporaryNotice` requires a visible affected scope, machine-readable effective and expiry/review
timestamps, and a visible information owner. It does not infer whether a notice is current, where it appears, or whether it
may be dismissed. A consuming content model must withhold stale notices and supply approved route
scope, fallback behavior, timezone wording, and owner review before publication.

## Modes and resilience

- Panels use generated component aliases and words, icons, and borders rather than color alone.
- Intrinsic layout, wrapping, and compact stacking cover 320/360 px, wide viewports, 200%/400%
  reflow equivalents, and 200% root-text enlargement.
- Error, urgent, warning, temporary, offline, unavailable, and expired states expose Level 0
  protected treatment without entrance, travel, scale, pulse, countdown, or dismissal motion.
- Forced colors retains system-color borders and double high-priority boundaries.
- Print removes colored surfaces and animation while preserving headings, messages, recovery
  destinations, dates, and owner metadata.
- Server output remains complete without JavaScript.

## Consuming gates

`B01-010` does not approve a public route, real hospital status, crisis wording, emergency or
contact fact, operational owner, expiry policy, authoritative success source, retry behavior,
provider, personal-data flow, translation, deployment, production, or publication. These enter
only through their decision, content, workflow, security, operations, and release tickets.

Verification and current execution evidence are recorded in the
[`B01-010` brief](../backlog/b01-010-system-state-patterns.md).
