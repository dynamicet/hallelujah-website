# Order 8 Rendered Evidence

**Captured:** 12 September 2026  
**Scope:** Local Chromium rendering and structural checks only

## Evidence register

| File | View | Purpose |
| --- | --- | --- |
| `patient-information-PI0-PI7-1440-en-standard.png` | 1440 px desktop | Staged journey, access/rights support, and staffed fallback. |
| `patient-information-PI0-PI7-360-en-standard.png` | 360 px compact | Stage/source order, wrapping, and stacked actions. |
| `locations-contact-LC0-LC7-1280-en-standard.png` | 1280 px desktop | Purpose calls, address, hours, text directions, optional map, written-contact boundary. |
| `locations-contact-LC0-LC7-360-en-reduced.png` | 360 px compact/reduced | Compact call separation, text-first route, and no motion dependency. |
| `search-results-SR0-SR7-1440-en-standard.png` | 1440 px desktop | Search, filter rail, status, typed results, pagination, support. |
| `search-results-SR0-SR7-320-en-reduced.png` | 320 px compact/reduced | Narrow field/filter/results behavior and reduced motion. |
| `about-AB0-AB9-1280-en-standard.png` | 1280 px desktop | Story, timeline, values/facts, leadership, relationships, imagery gate, care exits. |
| `about-AB0-AB9-360-en-standard.png` | 360 px compact | Institutional source order, wrapping, optional-media independence. |
| `careers-CR0-CR8-1280-en-standard.png` | 1280 px desktop | Role anatomy, privacy rail, Apply gate, support, currency. |
| `careers-CR0-CR8-360-en-standard.png` | 360 px compact | Privacy-before-Apply reading order and long-title reflow. |
| `practical-institutional-states-1280-en-standard.png` | 1280 px desktop | Cross-page mutually exclusive and recovery states. |
| `practical-institutional-states-320-en-reduced.png` | 320 px compact/reduced | Narrow state panels, action stacking, and Level 0 continuity. |

## What the evidence establishes

- Local HTML parses, IDs are unique, required form controls have labels, local references resolve, and accepted section IDs are present.
- The inherited token/component chain loads without remote resources.
- The named desktop and compact viewports render without visible horizontal clipping in the captured page area.
- Reduced-motion captures preserve content/state meaning and suppress the inherited orientation animation.
- Inert actions announce that no live call, query, map, clipboard, email, application, translation, provider, or data flow occurred.

## Limits

Screenshots are visual records, not human or device validation. They do not prove screen-reader semantics, forced-color output, touch behavior, real dialing/clipboard behavior, professional translation, clinical comprehension, on-site wayfinding, search relevance, third-party/provider failure, vacancy timing, 200%/400% complete-page reflow, cross-browser parity, or publication readiness.
