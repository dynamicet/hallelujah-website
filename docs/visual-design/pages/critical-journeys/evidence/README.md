# Order 6 Rendered Evidence

**Captured:** 12 September 2026  
**Sources:** [Home](../home.html) · [Emergency](../emergency.html) · [Appointment](../appointment.html) · [Appointment states](../appointment-states.html)  
**Status:** Local rendered-layout evidence only; not performed human, assistive-technology, device, operational, language, or publication validation

## Captures

| File | View | Coverage |
| --- | --- | --- |
| `home-H0-H9-1440-en-standard.png` | 1440 × 4600, English, standard motion | Complete desktop Home, including shell, hero, task group, search, controlled service/doctor collections, patient journey, text-first contact, trust, support, and footer. |
| `home-H0-H9-360-en-standard.png` | 360 × 8600, English, standard motion | Complete compact Home with one-column task/cards, wrapped labels, media-after-content order, support, and footer. |
| `emergency-E0-E8-1440-en-reduced.png` | 1440 × 3500, English, Level 0/reduced treatment | Complete desktop Emergency route distinction, separated call choices, warning, scope, arrival, optional map, non-emergency support, and footer. |
| `emergency-E0-E8-360-en-reduced.png` | 360 × 5450, English, Level 0/reduced treatment | Complete compact Emergency source order and separated 44 px-plus actions without horizontal clipping. |
| `appointment-A0-A8-1280-en-standard.png` | 1280 × 3800, English, standard motion | Complete desktop Appointment request with single-column form, urgent boundary, conditional care route, privacy, send, staffed fallback, and footer. |
| `appointment-A0-A8-360-en-standard.png` | 360 × 4550, English, standard motion | Complete compact Appointment page with wrapped labels/hints, full-width controls, support, and footer. |
| `appointment-states-A3-A7-1280-en-standard.png` | 1280 × 4200, English, standard motion | Desktop validation, pending, duplicate-intent, known failure, offline, unknown-outcome, authoritative receipt, delivery warning, and workflow-unavailable states. |
| `appointment-states-A3-A7-320-en-reduced.png` | 320 × 7600, English, forced reduced-motion preference | Minimum-width state composition with one-axis reflow, state meaning, actions, support, and footer retained. |

The Emergency files are named `reduced` because the whole journey is permanently Level 0; they contain no expressive entrance treatment regardless of the operating-system preference. The 320 px state capture additionally used Chromium's forced reduced-motion preference.

## Checks performed

| Check | Result |
| --- | --- |
| HTML parsing | Python standard-library `HTMLParser` completed for all four pages without an exception. |
| Section coverage | Home contains `H0`–`H9`; Emergency contains `E0`–`E8`; Appointment contains `A0`–`A8`. The dedicated state board supplements `A3`, `A6`, and `A7`. |
| Duplicate IDs | None found across any individual page. |
| Local ID references | Every `aria-describedby`, `aria-labelledby`, `aria-controls`, and same-page fragment reference resolves. |
| Form labels | Every identified input, select, and textarea has an explicit `for` association or is contained by a visible label. |
| Local file/fragment links | All linked local CSS, JavaScript, HTML, and HTML fragment targets resolve. |
| Page-layer token discipline | `page-compositions.css` contains no hexadecimal or `rgb()` color literal and imports the Order 5 component source. |
| External/operational boundary | No HTTP/HTTPS resource, `tel:`, `mailto:`, `fetch`, XHR, cookie, local-storage, or session-storage use appears in the four studies or their script. |
| Render completion | Eight PNGs rendered in local Chromium at their named dimensions. |
| Desktop visual review | Task hierarchy, card rhythm, form measure, Emergency/routine separation, safety route distinction, text-first arrival, and state severity remain legible. |
| Compact visual review | 320/360 px captures use one page axis; no visible clipped heading, label, field, action, status, card, or footer link was found. |
| Reduced-motion geometry | The 320 px forced-preference capture retains content/state hierarchy. A still image cannot prove temporal behavior or vestibular comfort. |

## Known limits

- The screenshots do not establish accessible name/role/value output in NVDA, JAWS, VoiceOver, or TalkBack.
- Chromium rendering does not establish Firefox, Safari, Android WebView, Windows High Contrast, native date-control, or font-fallback parity.
- No pointer, real touch target, native dialer, on-site arrival, screen-reader, 200%/400% browser zoom, low-end device, constrained network, print, or no-JavaScript session was performed.
- The compact menu and appointment conditional route are implementation-shaped local behaviors, not full Order 10 journey validation.
- The captures use English controlled copy. The `አማርኛ` language name tests only a small Ethiopic label; no clinical, operational, privacy, validation, or safety translation was tested or approved.
- Placeholder purposes, numbers, routes, records, facts, directions, privacy terms, references, response expectations, channels, owners, and dates are not hospital data and cannot be used for care or travel decisions.
- Screenshot height includes a small trailing page-background area in some files so the final footer boundary is visible; this is capture canvas, not an additional page section.
