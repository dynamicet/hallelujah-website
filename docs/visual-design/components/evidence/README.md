# Order 5 Rendered Evidence

**Captured:** 12 September 2026  
**Source:** [Component study](../studies.html)  
**Status:** Local rendered-state evidence only; not performed human, assistive-technology, device, or publication validation

## Captures

| File | View | Coverage |
| --- | --- | --- |
| `order-5-components-1440-standard.png` | 1440 × 7600, standard motion | Full desktop component board, including shell, action, discovery, card, form, feedback, disclosure, map, and limitations sections. |
| `order-5-components-360-standard.png` | 360 × 15000, standard motion | Full compact flow with wrapped labels, single-column cards/forms/states, and no visible horizontal clipping. |
| `order-5-components-320-reduced.png` | 320 × 15000, forced reduced-motion preference | Minimum-width compact flow with state meaning and final geometry retained. Static capture cannot demonstrate the absence of temporal motion by itself. |
| `order-5-components-1280-focus.png` | 1280 × 2400, standard motion | Shell, explicit keyboard-focus specimens, button state set, and beginning of discovery system. |

## Checks performed

| Check | Result |
| --- | --- |
| JSON parse | `component-tokens.json` parsed successfully. |
| HTML parse | Python standard-library HTML parser completed without a parse exception. |
| Duplicate IDs | None found. |
| Fragment and `aria-describedby` references | All referenced local IDs resolved. |
| Landmarks | One `header`, one `main`, one `footer`, and four labeled navigation regions found. |
| Form labels | Eleven labels for eleven rendered input/select/textarea controls; field and choice labels remain visible. |
| State semantics | Disabled, busy, invalid, alert/status, expanded, and current-page semantics are present where demonstrated. |
| Raw component colors | No hexadecimal or `rgb()` color literal appears in `component-tokens.css`; it references inherited semantic/foundation aliases. |
| External requests | No HTTP/HTTPS URL appears in the study. Fonts, icons, imagery, scripts, and styles are local. |
| Local documentation links | All relative Markdown links inside the Order 5 package resolved. |
| Visual compact review | The 320 px and 360 px captures show wrapping rather than truncation and a single page axis; no visible clipped control, label, field, card, or status was found. |
| Visual desktop review | Component hierarchy, emergency/routine separation, focus examples, card grids, form/status relationships, and text-first optional-map treatment remain clear. |

## Known limits

- The screenshots do not establish programmatic name/role/value output in a real screen reader.
- Chromium rendering does not establish Safari, Firefox, Android WebView, or Windows High Contrast behavior.
- The reduced-motion capture was produced with Chromium's forced preference flag, but a still image cannot prove animation timing or vestibular comfort.
- Pointer, keyboard, and menu behavior is implementation-shaped in the local study; cross-browser focus return and Back/Forward behavior remain Order 10–11 validation.
- No touch device, low-end device, constrained connection, 200%/400% browser zoom, browser print, or native dialer/provider handoff was tested in this order.
- Ethiopic strings demonstrate glyph geometry and wrapping only. They are not translated hospital copy and have not received professional language or clinical review.
- All contacts, records, claims, dates, references, privacy terms, and operational outcomes are controlled placeholders.

