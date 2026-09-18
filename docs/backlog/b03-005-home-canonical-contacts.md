# B03-005 — Home Canonical Safety and Contact Integration

**Lane / priority / phase:** DELIVERY / P0 / Phase 1 preparation
**Status:** In progress

On 19 September 2026, Africa/Addis_Ababa, the client directed “start” after the proposed
B03-005 execution. `befikadusata` directs Codex in temporary Frontend/Operations-contract/QA
roles and is controlled-development review authority. This direction supplies execution,
not final acceptance or hospital approval. Target: synthetic local T0/private hosted T1.
B02-003 and B03-004 are Done; PR #61 merged as
`de341e59073ad3da4813b43de7b1686c74f1cebe` and exact-main
[run 35398851259](https://github.com/dynamicet/hallelujah-website/actions/runs/35398851259) passed.
The working B00-016 matrix supplies controlled acceptance; formal DEL-01 remains deferred.
Tracking: [issue #62](https://github.com/dynamicet/hallelujah-website/issues/62).

## Controlled sequencing and scope

B03-001–B03-003 remain unresolved. The explicit controlled exception permits a reusable
server composition consuming the existing single governed settings record through synthetic
CMS workflow documents, with separately named emergency, enquiry and arrival information.
Default and authentic-record consumption remains withheld. The loopback Home preview may
show visibly synthetic contact text and native local section links only. Canonical `tel:` and
`mailto:` targets are checked in the internal projection, never activated in the preview.
Real dialer, touch-device, screen-reader and on-site arrival acceptance returns with approved
hospital records and the applicable DEL-01 platform evidence.

Allowed files: Home templates/API/styles; `apps/web/src/content/home-contact-view.ts`;
Home contact fixture and check scripts; existing preview/renderer/browser check; package
commands; build-isolation marker policy; backlog/architecture documentation and sanitized
evidence. Preserve unrelated changes. No new package, app route, CMS/database write, provider,
geolocation, search query, appointment collection, migration, provisioning or publication.

## Acceptance

- One complete validated set supplies exactly one current canonical settings document;
  draft, scheduled, ambiguous, malformed, unsigned, stale, withdrawn and authentic data withhold.
- Independent operations review, approval and post-publication verification are required for
  the synthetic document. Every required fact must remain reconciled and current.
- Enquiry uses `publicPhone`, never substitutes switchboard, ambulance or emergency numbers.
  All purpose labels and display values come from the canonical localized facts; missing language
  does not borrow a label from another language. Canonical targets match the displayed numbers.
- Home Emergency, Call and Directions links reach distinct stable Level 0 sections. Missing
  facts show useful withheld explanations. No callable or provider target is emitted.
- Re-rendering a changed document replaces old facts immediately; the existing CMS invalidation
  contract includes `/`, `/am/` and `canonical-contacts`. No contact projection cache is introduced.
  Time is checked on every render, including exact review/expiry boundaries and backwards time.
- Keyboard, semantic accessible names, no-JS/CSS, 320/360/reflow, expanded text, forced colors,
  reduced motion, Save-Data, print and synthetic lifecycle browser checks pass. Fixture imports,
  traces and authored payloads stay outside the deployable build.

## Verification and sources

Use pinned Node.js 24.21.0 and pnpm 10.27.0:

```sh
pnpm home-contacts:check
pnpm home-contacts:smoke
pnpm site-settings:check
pnpm home:check
pnpm verify
pnpm rebuild:verify
pnpm audit:dependencies
pnpm secrets:check --history
git diff --check
```

Sources: [Epic scope](epic-03-critical-journeys.md#home--h0h9),
[Home specification](../ux/page-specifications.md#1-home), [Home wireframe](../wireframes/home.md),
[canonical settings boundary](b02-003-canonical-site-settings.md),
[canonical settings architecture](../architecture/canonical-site-settings.md),
[Home architecture](../architecture/home-hierarchy.md),
[working matrix](../validation/implementation-acceptance-matrix.md), E-001/C-001/G-007/G-014.
BM-02/06/09/10 apply as purpose distinction and text-first contact/arrival access; prototype
code, screenshots and benchmark facts have no runtime authority.

Hosted current-head T1 and client controlled acceptance are required before Done. Checked
merge and passing exact-main CI precede dependent execution. Hospital safety/language approval,
authentic contacts, real call/arrival acceptance, production and publication retain their gates.
