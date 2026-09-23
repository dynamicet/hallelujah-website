# B03-009 — Controlled Emergency Resilience Evidence

**Status:** In review for controlled development; hosted exact-head CI and acceptance pending
**Date / timezone:** 23 September 2026, Africa/Addis_Ababa
**Target:** Synthetic local T0/private hosted T1; local T0 complete
**Responsible / local review identity:** `befikadusata` directing Codex in temporary Frontend and
QA roles
**Tracking:** [issue #68](https://github.com/dynamicet/hallelujah-website/issues/68)
**Safety and publication authority:** Not granted

## Scope and boundary

B03-009 adds an expiry-first, fail-closed resolver and controlled specimens for required content
withheld, required content expired, required arrival unavailable, static and explicitly injected
unsupported call handoff, and optional-map failed/blocked states. The B03-008 controlled and
long-content specimens remain as baselines.

All state data is visibly synthetic, deliberately invalid and loopback-only. There is no public
`/emergency/` route, `tel:`, `mailto:`, form, real contact, real route, clinical claim, coordinate,
map/provider request, media, external link, personal-data input, analytics or public action.
B03-001–B03-003, SAFE-01–SAFE-04, LANG-01, SEC-02 and formal DEL-01 remain open.

## Implemented contracts

- Invalid or elapsed lifecycle wins over withheld approval, missing required fields, unsupported
  handoff and map failure.
- Withheld, expired and required-arrival-unavailable results are newly constructed fail-closed
  objects; no contact, distinction, scope, warning, support or arrival record reaches rendering.
- Every required controlled field is rejected when blank, missing or structurally empty.
- Unsupported handoff retains the validated purpose and deliberately invalid display value as
  inert text. Cards and surrounding whitespace have no action and make no call/service outcome
  claim.
- Optional-map failed/blocked messaging follows complete E5/E6 text directions and accessibility
  guidance. It creates no request, coordinate or fallback link.
- Initial server-rendered states have no live region. A loopback-only enhancement upgrades the
  explicitly injected specimen's single notice to a polite, atomic, programmatically focusable
  status after load; no-JS retains the same readable notice without a live region or duplicate.
- All Emergency states remain motion Level 0 and readable in semantic source order without
  JavaScript, CSS or media.

## Local results

| Gate | Result |
| --- | --- |
| `pnpm emergency:check` | Pass: 52 fail-closed lifecycle, required-field, precedence, stale-value suppression, SSR, isolation, escaping, announcement, static-motion and token cases. |
| `pnpm emergency:smoke` | Pass: 255 responsive/capability/accessibility/isolation cases across nine states, 320/360/768/1440 CSS px, default/no-JS/reduced-motion/forced-colors/print/200% text/no-CSS, accessibility tree, announcement focus context and response policy. |
| Fail-closed safety | Pass: expired dominates every lower state; withheld/expired/arrival-unavailable output has zero record values and zero call choices; all required fields have negative cases. |
| Call-handoff unsupported | Pass: purpose and invalid display values remain readable; zero active call targets; surrounding cards remain inert; injected state exposes exactly one polite atomic announcement and retains programmatic focus context. |
| Arrival/map resilience | Pass: required arrival omission blocks the ready composition; both optional-map failures retain E5/E6 earlier in source order; zero provider/external requests. |
| Capability and layout | Pass: no horizontal overflow, heading skip, hidden required content or Emergency-subtree motion at all tested widths/capabilities; touch targets pass when CSS is present. |
| Configured `pnpm verify` | Pass with Node.js 24.21.0, pnpm 10.27.0, fontTools 4.65.0 and Brotli 1.2.0: policy, docs, lint/types, all model/workflow/security suites, optimized build, deployment isolation, runtime and every rendered matrix. |
| `pnpm rebuild:verify` | Pass: independent frozen reconstruction used 543 cached packages and downloaded none; lock graph `b143b09bf35b897291553919a74247047f1b6529da0d759642ca6aa4290652bd`, importer graph `72df5c767c10664a290292b262c772a238c6bb287cb3a5622fa2e4c2095f1815`. |
| `pnpm audit:dependencies` | Pass: 650 dependencies checked with zero moderate, high or critical known advisories. |
| `pnpm secrets:check --history` | Pass: 502 current text files plus reachable Git history checked. |
| Deployable build boundary | Pass: optimized routes remain `/`, `/_not-found`, `/health`; 28 isolation controls inspect 79 application source files, six traces and 138 payloads. |
| Documentation and whitespace | Pass: format policy inspected 501 files; 1,315 local links passed; ten backlog assertions passed; `git diff --check` passed before evidence reconciliation. |

The largest controlled specimen measured 16,930 initial compressed bytes, including 617 compressed
JavaScript bytes and four initial requests for the explicitly injected loopback specimen, with zero
external requests and zero media bytes. These are loopback fixture measurements, not a deployed-route
or constrained-device performance claim.

## Failure and correction history

The first compiler pass exposed TypeScript's inability to narrow the nested state discriminator;
an explicit type guard corrected the union boundary. The first token check rejected a nonexistent
focus-color alias; replacing it with the established semantic focus token corrected the stylesheet.
Lint then identified two unused destructured lifecycle fields; explicit omission corrected that
without weakening the resolver. Every affected focused check passed on repeat.

The first sandboxed browser run failed to bind loopback with `EPERM`; the permitted loopback repeat
passed. The first sandboxed clean rebuild could not register its temporary project in the read-only
pnpm store and failed with `EROFS`; the permitted repeat reused 543 cached packages, downloaded
nothing and passed the complete independent verification. These are environment-bound attempts,
not successful test results.

## Current verdict

B03-009 moves In progress → **In review** for controlled development. No scoped local defect
remains open. Private hosted exact-head T1, explicit controlled client acceptance, checked merge
and passing exact-main CI remain required before Done. B03-010 remains responsible for human,
assistive-technology, physical-device, comprehension, language, live-call and on-site evidence.

No authentic emergency record, clinical/safety approval, active call, provider, public route,
production behavior, emergency-use claim or publication approval is granted.
