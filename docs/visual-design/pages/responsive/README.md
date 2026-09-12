# Order 9 — Responsive and Bilingual Refinement

**Status:** Complete for non-public prototype review  
**Completed:** 12 September 2026  
**Scope:** 12 complete page studies and 3 cross-page state boards  
**Publication status:** Not approved for public use

Order 9 refines the inherited Order 4–8 visual system for compact mobile, tablet, desktop, CSS-pixel reflow, Ethiopic, mixed-script, expanded-content, and unavailable-translation conditions. It does not supply an approved Amharic translation, activate hospital facts, or replace professional language and assistive-technology review.

## Package

- [Refinement record](responsive-bilingual-refinement.md) — method, matrix, findings, fixes, acceptance, and limits.
- [`order-9.css`](order-9.css) — shared responsive and bilingual correction layer loaded by all page/state studies.
- [`order-9-fixtures.js`](order-9-fixtures.js) — visibly labeled, query-controlled layout fixtures and in-page geometry audit.
- [`audit-order-9.mjs`](audit-order-9.mjs) — repeatable Chromium DevTools Protocol matrix runner.
- [Evidence index](evidence/README.md) — machine-readable results and representative visual captures.

## Fixture URLs

Append one fixture to any Order 6–8 HTML study:

```text
?fixture=en
?fixture=am
?fixture=mixed
?fixture=long
?fixture=unavailable
```

Add `&audit=1` to append a machine-readable `#order-9-audit-result` JSON block to the document. Every non-English stress mode displays a persistent test label. The Amharic strings are geometry fixtures only and must never be represented as translated hospital content.

## Completion result

The final run rendered `15 pages × 7 viewport/reflow conditions × 5 fixtures = 525 cases` in local Chromium with reduced motion forced. All 525 passed the automated horizontal-overflow and audited 44 × 44 px target checks. Representative captures were visually inspected for hierarchy, label wrapping, alignment, and stable source order.

Order 10 may now build the interactive prototype from this refined page set. Professional Amharic review, real browser zoom controls, screen-reader/browser pairing, forced-colors, touch hardware, cross-browser parity, and human comprehension remain explicit Order 11 or stakeholder validation work.
