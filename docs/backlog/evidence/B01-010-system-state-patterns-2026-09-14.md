# `B01-010` System State and Recovery Patterns — Local Evidence

**Recorded:** 14 September 2026, Africa/Addis_Ababa

**Result:** Done for controlled development; full local `T0` and hosted implementation `T1` pass

## Evidence summary

| Area | Result |
| --- | --- |
| Public APIs | `SystemAlert`, `TemporaryNotice`, `SystemState`, `LoadingStatus`, `NonCriticalSkeleton`, the canonical precedence list, and its resolver are exported through the production component boundary. |
| Canonical contract | The manifest generates 378 primitive/semantic/component tokens; drift, contrast, protected-context, component, and template consumer checks pass. |
| State semantics | Five alert variants, five distinct collection/workflow states, and dated temporary notices use headings, visible state words, decorative local icons, non-color boundaries, and recovery/actions. Static content has no unsolicited live-region role; explicit injected blocking error and authoritative success specimens use atomic assertive and polite semantics. |
| Typed safety | Success requires `authoritative={true}`. System states require recovery. Temporary notices require affected scope, effective time, expiry/review time, and owner. No dismissal API exists in the controlled baseline. |
| Precedence | The exported resolver applies unavailable → expired → error → invalid → disabled → loading → pending → pressed → focus-visible → hover → default. Visual component documentation now matches the production handoff and Epic 01 authority. |
| Loading boundary | Busy status is visible and atomic. Critical controlled facts remain readable. Skeleton bars accept no record text, are accessibility-hidden, and are explicitly bounded to predictable non-critical repeated-record shapes. Reduced motion replaces the loop with a static indicator. |
| Responsive/reflow | 320, 360, 375, 667 × 375 landscape, 768, 1280, 1440, 200%/400% viewport equivalents, and 200% root-text enlargement pass without detected clipping or page overflow. Compact state headings stack their icon and text. |
| Interaction and resilience | Recovery targets measure at least 44 × 44 CSS px; programmatic panel focus has a visible three-pixel outline; no-JavaScript HTML retains state, recovery, dates, loading boundary, and critical facts; forced colors and print retain boundaries and wording. |
| Built and runtime gates | Built semantic checks and runtime/security-header checks pass. The final local closeout run measured 166,729 compressed initial bytes across 13 requests with 139,428 compressed JavaScript bytes and zero external origins. The state implementation is server-rendered and adds no client component or provider request. |
| Visual review | [320px](b01-010-rendered/b01-010-system-states-320.png) and [1440px](b01-010-rendered/b01-010-system-states-1440.png) captures were inspected for hierarchy, wrapping, distinct state wording, recovery prominence, dated metadata, loading boundaries, and controlled-data disclaimers. |
| Security/dependencies | Current-tree and reachable-history secret scans pass. The audit reports 650 dependencies with zero moderate, high, or critical known vulnerabilities. |
| External boundary | Synthetic state text only; no real hospital fact, operational notice, crisis content, contact, translation, action outcome, provider, request, personal data, public route, or publication authority was introduced. |
| Hosted implementation gate | [`quality-and-security`](https://github.com/dynamicet/hallelujah-website/actions/runs/34896169521) passed in 2m13s on implementation commit `3774c0c`. |

## Performed commands

```sh
pnpm tokens:generate
pnpm system-states:check
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm system-states:smoke --capture-dir docs/backlog/evidence/b01-010-rendered
pnpm verify
pnpm secrets:check --history
pnpm audit:dependencies
```

The shell initially exposed Node.js 25.2.1 and correctly stopped at the exact-engine guard. Accepted
checks use the installed pinned Node.js `24.21.0` and pnpm `10.27.0`.

The restricted sandbox denied the first loopback run; approved bounded reruns started only the
local Next.js server and headless Chromium. The first browser matrix exposed and drove correction
of an over-specific server-HTML marker check, a temporary-owner selector, and icon/heading width
pressure at 200% text. Contract review then hardened success to require authoritative intent and
temporary notices to require affected scope. The registry audit first timed out under restricted
network access; its approved rerun returned the complete 650-dependency report. Final targeted and
full local matrices pass.

## Evidence boundary and residual gates

- Screenshots contain controlled-development fixture text and synthetic dates only. They contain
  no personal, clinical, operational, contact, credential, or restricted evidence.
- The browser run is implementation smoke, not final physical-device, browser, screen-reader,
  switch-control, comprehension, professional Amharic, clinical, or operations review.
- Consumers still own authoritative state vocabulary, announcement timing, safe retry/recovery,
  temporary-notice lifecycle, route scope, approved actions, and stale-record withholding.
- GitHub [issue `#16`](https://github.com/dynamicet/hallelujah-website/issues/16) and [pull request
  `#17`](https://github.com/dynamicet/hallelujah-website/pull/17) carry the scoped repository review.
  Hosted run `34896169521` proves implementation commit `3774c0c`; this documentation-closeout
  revision must repeat the exact-head gate before merge.
- Hospital operations, providers, personal-data collection, deployment, DNS, production,
  publication, and release authority remain unchanged.
