# `B01-013` Form Focus Correction During `B02-002` Closeout

**Date/timezone:** 16 September 2026, Africa/Addis_Ababa.
**Responsible / acceptance:** `befikadusata` directing Codex in temporary Frontend/QA roles / same client identity directing closeout.
**Tracker:** [Issue #32](https://github.com/dynamicet/hallelujah-website/issues/32).
**Boundary:** Existing internal review harness only; no application behavior, content, provider, collection or publication change.

## Failure and correction

PR `#31` final acceptance head `0ff4da7` passed
[run `35081816962`](https://github.com/dynamicet/hallelujah-website/actions/runs/35081816962)
attempt 2 after attempt 1 failed the Amharic invalid-form summary-focus assertion during clean
reconstruction. PR `#31` merged as `3fac0d9`, automatically closing issue `#30`.
Post-merge [run `35091489396`](https://github.com/dynamicet/hallelujah-website/actions/runs/35091489396)
passed full verification and then failed the same assertion in English during clean reconstruction.
Both failures are retained as manual-merge control evidence; dependent execution is paused.

The [form fixture](../../../apps/web/public/form-primitives.js) schedules invalid-form validation
after 80 ms. The [browser harness](../../../scripts/review-harness/check-browser.mjs) also waits
80 ms after dispatching keyboard activation, then immediately checks summary focus. Equal timer
delays cannot guarantee the browser validation callback has completed under runner load.

The correction polls the original condition up to 40 times at 50 ms intervals. Keyboard Space
activation remains real, and success still requires both the visible error summary and actual
focus on that summary. Missing validation or broken focus still fails after the bounded wait.
No runtime timer, behavior or assertion is weakened; the check waits for asynchronous completion.

## Verification

Local full `pnpm verify` is required under pinned Node.js `24.21.0`, the previously validated direct
Chromium alias and disposable temporary-root setup. Final documentation format/link/backlog and
diff checks must pass. Exact-head hosted `quality-and-security`, including clean reconstruction,
must pass before the correction merges; its SHA/run/merge result belongs in issue `#32` and the
correction PR. Exact-main CI must then pass before dependent execution resumes.

Local full `pnpm verify` passed with the existing direct Chromium alias and
`TMPDIR=/var/tmp/hallelujah-b02-002-temp`, including all 92 bilingual capability/viewport and
media/history cases, the corrected English/Amharic keyboard summary-focus checks, and subsequent
foundation/card/map checks. `pnpm secrets:check --history` passed; refreshed
`pnpm audit:dependencies` passed for 650 dependencies with zero moderate/high/critical findings.
The correction adds no dependency or toolchain change. Hosted exact-head and post-merge results
remain required and will be recorded in issue `#32` and the correction PR. This evidence does not
promote any production gate.

## Successful hosted and merged closeout

Correction commit `5496053` passed exact-head [run `35092261032`](https://github.com/dynamicet/hallelujah-website/actions/runs/35092261032), including clean reconstruction.
[PR #33](https://github.com/dynamicet/hallelujah-website/pull/33) merged as
`38d5e455d0733a62e6fbd188fa76c0127012c57d`; exact-main
[run `35092817178`](https://github.com/dynamicet/hallelujah-website/actions/runs/35092817178)
completed successfully on 16 September 2026. Issue #32 is closed. The earlier failures remain
documented above; the successful correction resolves the dependent-execution pause.
The client directed recording this closeout and proceeding with controlled `B02-003` development
on 16 September 2026, Africa/Addis_Ababa. Production gates remain unresolved.
