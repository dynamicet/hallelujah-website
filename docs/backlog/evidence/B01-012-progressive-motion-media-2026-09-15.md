# `B01-012` controlled-development evidence

**Build/environment:** Scoped branch `b01-012-progressive-motion-media`, local `T0`, 15 September 2026, Africa/Addis_Ababa
**Method/tester:** Codex under client-directed temporary Frontend/Designer/QA roles; pinned Node.js 24.21.0 and pnpm 10.27.0
**Status:** Done for controlled development; local `T0` and hosted implementation `T1` pass

| Expected | Actual so far | Result |
| --- | --- | --- |
| Protected/context and page-area ceilings remain static | Emergency nested in a Level 3 specimen resolves to Level 0; appointment area clamps to Level 1 | Pass, local Chromium |
| Initial HTML and poster remain useful without JavaScript | Fixture text, controls, written still, and media element without `src` are server rendered | Pass, local Chromium/no-script HTML |
| Opt-in video makes zero pre-intent requests | Neither fixture video nor informative caption source appears at any required viewport before Play | Pass, local Chromium |
| Keyboard media control preserves focus and fallback | Space activates Play; Pause and Stop work; Stop clears source, restores poster, and focuses Play | Pass, local Chromium |
| Informative media controls agree | Native Pause updates the labeled Resume control; captions attach after Play and clear with Stop; transcript remains linked | Pass, local Chromium |
| Capability and failure modes remain complete | Save-Data disables accent, blocked media restores poster/status, reduced motion removes animation, print/forced colors preserve structure | Pass, local Chromium |
| Geometry survives viewport and text expansion | 320/360/375/667/768/1280/1440, 200%/400% equivalent, and 200% enlarged text have no consequential clipping | Pass, local Chromium |

The first browser runs exposed a CSP/hydration mismatch, enlarged-text clipping, and a playback readiness race. The implementation now uses a deferred first-party script under the unchanged strict CSP, wraps long control labels, and waits for media readiness before asserting playback. The follow-up local Chromium matrix passes with those defects retested. No personal data, secret, real hospital media, contact, provider request, or restricted evidence was created.

**Local closeout, 15 September 2026:** `pnpm tokens:check`, `pnpm motion-media:smoke --capture-dir docs/backlog/evidence/b01-012-rendered`, and full `pnpm verify` pass with pinned Node.js 24.21.0. Reachable-history `pnpm secrets:check --history` passes. A sandboxed advisory refresh did not return complete JSON; the approved unrestricted rerun passes for 650 dependencies with zero moderate/high/critical known vulnerabilities. The [320 px capture](b01-012-rendered/b01-012-motion-media-320.png) and [1440 px capture](b01-012-rendered/b01-012-motion-media-1440.png) were visually reviewed for stable plane, wrapping, and protected presentation. Final asset smoke reports about 140.4 KB compressed runtime JS, 170.7 KB initial compressed bytes, 14 initial requests, and zero external origins. The abstract WebM is 2 seconds and approximately 2 KB; it is requested only after Play. The informative specimen attaches and displays its caption track after Play, uses native video controls, and retains its transcript link. [Issue `#18`](https://github.com/dynamicet/hallelujah-website/issues/18) and [pull request `#19`](https://github.com/dynamicet/hallelujah-website/pull/19) carry repository review.

**Hosted implementation `T1`:** [Run `35006070614`](https://github.com/dynamicet/hallelujah-website/actions/runs/35006070614) completed successfully for pull-request head `ef3d85fd3a5d05a3a46580c8096a48cb713a15de`, matching the local implementation commit. The documentation-only closeout head must repeat the same gate before merge; it is not yet represented as a passing run here.
