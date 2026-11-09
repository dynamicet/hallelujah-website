# Order 10 Evidence

> Evidence availability (8 November 2026): some historical captures referenced below are absent from this checkout. Their filenames are retained as archive references, not current verification evidence. Rerun the documented checks for fresh evidence.

**Final run:** 12 September 2026  
**Environment:** Local headless Chromium through DevTools Protocol  
**External requests:** None observed  
**Publication status:** Not approved

## Machine-readable result

[`order-10-audit-results.json`](order-10-audit-results.json) records:

- 19 of 19 passing scripted interaction assertions;
- 45 of 45 passing geometry cases across all 12 page studies and 3 state boards at 320, 768, and 1280 CSS px with reduced motion forced;
- no page-level horizontal overflow;
- no audited enabled target smaller than 44 × 44 CSS px;
- a loaded Order 10 toolbar on every audited artifact;
- no non-`file:` resource request.

The interaction assertions cover connected routing, controlled canonical handoff, appointment validation and focused summary, duplicate protection, authoritative receipt, unknown-outcome reconciliation, directory filtering and URL continuity, compact-filter Escape/focus return, failure/recovery, Amharic fixture continuity, Emergency inertness, forced reduced motion, unsafe-query rejection, and controlled Home search.

## Representative captures

| Capture | Evidence |
| --- | --- |
| `home-connected-routes-360-en-standard.png` (unavailable archive: `home-connected-routes-360-en-standard.png`) | Connected Home at compact width with review controls and essential task hierarchy. |
| `appointment-authoritative-receipt-1280-en-standard.png` (unavailable archive: `appointment-authoritative-receipt-1280-en-standard.png`) | Mutually exclusive simulated receipt replacing the form and explicitly remaining “not a confirmed appointment.” |
| `doctor-directory-failure-1280-en-reduced.png` (unavailable archive: `doctor-directory-failure-1280-en-reduced.png`) | Known directory failure with retained context and recovery. |
| `doctor-directory-handoff-360-am-reduced.png` (unavailable archive: `doctor-directory-handoff-360-am-reduced.png`) | Compact Amharic geometry fixture, controlled filter state, and visible translation disclaimer. |
| `search-offline-360-en-reduced.png` (unavailable archive: `search-offline-360-en-reduced.png`) | Mutually exclusive offline search state with text-first recovery routes. |

## What this evidence does not prove

Automated Chromium and screenshot review do not prove screen-reader output, professional Amharic meaning, forced-colors usability, hardware touch or dialer safety, browser zoom controls, cross-browser parity, constrained-device performance, real network failure, human comprehension, clinical correctness, content approval, privacy/security readiness, or publication authorization. These remain explicitly open for Order 11, formal stakeholder validation, or production-gate work.
