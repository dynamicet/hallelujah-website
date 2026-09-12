# Order 11 — Design and Motion QA

**Status:** Complete for performed non-public prototype QA  
**Completed:** 12 September 2026  
**Publication status:** Not approved for public use

Order 11 audited and corrected the connected prototype across semantics, computed text contrast, keyboard/focus behavior, accessibility-tree structure, controlled bilingual stress fixtures, forced colors, error/loading states, reduced motion, Save-Data, emulated touch, zoom/reflow equivalents, no-JavaScript behavior, asset budgets, and a constrained local HTTP profile.

## Start here

- [QA record, findings, and limitations](order-11-design-motion-qa.md)
- [Machine-readable results and captures](evidence/README.md)
- [Repeatable Chromium runner](audit-order-11.mjs)
- [Connected prototype](../prototype/README.md)

## Result

- 17 of 17 Order 11 automated assertions passed across 16 artifacts.
- Computed solid-background text contrast passed across all artifacts; the lowest sampled ratio was 5.1:1.
- Real Chromium `Tab`, `Enter`, and `Escape` events passed the all-artifact skip-link pass plus menu, filter, validation-summary, and linked-field journeys.
- Fifteen controlled loading/no-match/failure/offline/unavailable combinations passed.
- Sixty Amharic-geometry, mixed-script, long-content, and unavailable-translation cases passed at the tested compact viewport.
- Six forced-color focus/border cases, 32 device-scale reflow-equivalent cases, and 16 no-JavaScript cases passed.
- Emergency actions remained inert under a deliberate emulated tap and were not activated by a moved scroll gesture.
- Home used nine initial local requests, 120,920 uncompressed bytes, and 41,515 uncompressed JavaScript bytes in the performed local-HTTP profile.
- The 6× CPU / 400 ms / 400 kbps run recorded zero layout shift, no long task over 50 ms, and a 66 ms menu interaction round trip.
- The Order 10 regression suite still passed 19/19 interaction assertions and 45/45 geometry cases; the Order 9 regression suite still passed 525/525 cases.

## Evidence boundary

This completion means the documented local QA was performed and the identified prototype defects were corrected. It does not establish professional Amharic quality, human screen-reader output, Windows High Contrast usability, physical touch/dialer safety, manual browser-control zoom, Firefox/WebKit parity, low-end Android performance, field Core Web Vitals, human comprehension, hospital approval, or publication readiness. Those limits are recorded in the QA report and remain formal validation or production-handoff gates.

