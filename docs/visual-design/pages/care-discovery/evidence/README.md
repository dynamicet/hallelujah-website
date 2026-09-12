# Order 7 Rendered Evidence

**Captured:** 12 September 2026  
**Sources:** [Doctor Directory](../doctor-directory.html) · [Doctor Profile](../doctor-profile.html) · [Services Directory](../services-directory.html) · [Service Detail](../service-detail.html) · [Care-discovery states](../care-discovery-states.html)  
**Status:** Local rendered-layout evidence only; not performed human, assistive-technology, device, clinical, operational, language, or publication validation

## Captures

| File | View | Coverage |
| --- | --- | --- |
| `doctor-directory-D0-D6-1440-en-standard.png` | 1440 × 3000, English, standard motion | Complete wide Doctor Directory with search, filter rail, active state, controlled cards, portrait/no-image variants, pagination, support, and footer. |
| `doctor-directory-D0-D6-360-en-standard.png` | 360 × 5400, English, standard motion | Compact Doctor Directory with wrapped shell/intro, stacked search/actions, filter trigger, cards, pagination, and support. |
| `doctor-profile-P0-P7-1280-en-standard.png` | 1280 × 3300, English, standard motion | Complete wide Doctor Profile with breadcrumb, text-first identity, neutral portrait, content/rail, governed services, metadata, and support. |
| `doctor-profile-P0-P7-360-en-standard.png` | 360 × 5200, English, standard motion | Compact profile reading order, full-width request actions, neutral portrait, in-flow request guidance, relationships, and metadata. |
| `services-directory-S0-S7-1440-en-standard.png` | 1440 × 3700, English, standard motion | Complete wide Services Directory with urgent specimen, search, single-taxonomy rail, grouped controlled records, pagination, uncertainty routes, and footer. |
| `services-directory-S0-S7-360-en-standard.png` | 360 × 6700, English, standard motion | Compact Services flow with urgent guidance before search, group trigger, stacked groups/cards, and support. |
| `service-detail-V0-V9-1280-en-standard.png` | 1280 × 4300, English, standard motion | Complete wide Service Detail with scope, urgent boundary, capability treatment, request rail, clinicians, text-before-map guidance, process, metadata, and support. |
| `service-detail-V0-V9-360-en-standard.png` | 360 × 7000, English, standard motion | Compact Service Detail source order with wrapped terms, full-width actions, relationship/no-image variants, and no horizontal clipping found. |
| `care-discovery-states-1280-en-standard.png` | 1280 × 5900, English, standard motion | Wide no-match, failure, offline, empty roster/taxonomy, missing portrait, request/map failure, withheld claim, unavailable record, relationship, and handoff states. |
| `care-discovery-states-320-en-reduced.png` | 320 × 10400, English, forced reduced-motion preference | Minimum-width one-axis state compositions and handoff keys with Level 0 state presentation. |

## Checks performed

| Check | Result |
| --- | --- |
| HTML parsing | Python standard-library `HTMLParser` completed for all five pages without an exception. |
| Section coverage | Default pages plus the state board contain `D0`–`D6`, `P0`–`P7`, `S0`–`S7`, and `V0`–`V9`. `D5` and `S6` correctly live in mutually exclusive state compositions. |
| Duplicate IDs | None found within any individual page. Repeated `data-section` values are annotations, not element IDs. |
| Local ID references | Every `aria-describedby`, `aria-labelledby`, `aria-controls`, and same-page fragment reference resolves. |
| Form labels | Every identified input, select, and textarea has a visible explicit label. |
| Local file links | All local HTML, CSS, JavaScript, Markdown, and linked query destinations resolve. |
| Token discipline | `care-discovery.css` contains no hexadecimal or `rgb()` color literal and imports the Order 6 composition source. |
| External/operational boundary | No HTTP/HTTPS resource, `tel:`, `mailto:`, `fetch`, XHR, cookie, local storage, or session storage appears in the five studies or script. |
| URL data boundary | Demonstrated directory URLs contain only public query/filter/page fixtures; appointment links contain only `doctor=prototype-clinician-a`, `service=prototype-service-a`, or `care=not-sure`. |
| No-JavaScript source path | Compact filter CSS collapses only after the script adds `.js`; without it, submitted native filters remain visible. A separate `noscript` task navigation is present. This is a source inspection, not a performed browser session. |
| Render completion | Ten PNGs rendered in local headless Chromium at their named dimensions. |
| Desktop visual review | Filter-first order, card rhythm, grouped service hierarchy, identity-before-media, detail rail measure, urgent separation, and support exits remain legible. |
| Compact visual review | 320/360 px captures use one page axis; no visible clipped heading, field, action, status, card, relationship, metadata, or footer link was found. |
| Reduced-motion geometry | The 320 px forced-preference capture retains all state and handoff meaning. A still image cannot prove temporal behavior or vestibular comfort. |

## Known limits

- The screenshots do not establish accessible name, role, value, announcement timing, or reading order in NVDA, JAWS, VoiceOver, or TalkBack.
- Chromium rendering does not establish Firefox, Safari, Android WebView, Windows High Contrast, real focus restoration, or native field parity.
- No real pointer/touch, 200%/400% browser zoom, landscape device, low-end device, constrained-network, print, no-JavaScript, or Back/Forward session was performed.
- Compact filter controls were rendered closed. Their local reveal behavior is implementation-shaped evidence only, not a full focus-trap/dialog or history validation.
- The captures use English controlled copy. The `አማርኛ` label is not evidence for approved clinical, emergency, operational, state, or directory translation.
- Controlled roster/service records, groups, synonyms, public IDs, relationships, review labels, claims, contacts, routes, and responses are not hospital data.
- Screenshot height includes trailing page-background area in some files to expose the final footer boundary; it is not an additional page region.
