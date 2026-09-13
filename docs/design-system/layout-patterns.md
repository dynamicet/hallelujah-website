# Layout Patterns

**Status:** Initial composition baseline  
**Related:** [Page specifications](../ux/page-specifications.md) · [Foundations](foundations.md) · [Components](components.md) · [Benchmark traceability](../benchmarks/benchmark-traceability.md)

The compositions locally adapt the benchmark applications for a task-led front door, safe urgency separation, connected discovery, truthful request states, visit-stage guidance, text-first arrival, staffed fallback, and evidence-gated trust (`BM-01`–`BM-08`, `BM-11`–`BM-13`). They are not copies of any benchmark page.

## 1. Global page shell

```text
Skip link
Utility/header
  Logo | primary navigation | language/search
  Persistent Emergency | Call | Appointment actions
Breadcrumb (detail and secondary pages)
Main
  Page introduction: eyebrow (optional), H1, summary, primary action
  Page-specific sections
Contextual fallback/contact band
Footer
```

### Compact behavior

- Header shows the approved mark, menu trigger, and one clearly labeled emergency action.
- Opening the menu reveals primary navigation, Search, Language, Call, and Appointment in a logical focus sequence.
- Emergency, Call, and Appointment may use a compact action bar only if it does not cover content, browser controls, focused fields, or the form submit area.
- Main content remains first in reading order after navigation; visual rearrangement cannot corrupt DOM order.

### Wide behavior

- Primary task navigation is visible without opening a menu.
- Emergency remains visually distinct and physically separated from routine actions.
- Do not force all secondary links into the header. About, Careers, privacy, and accessibility can live in a quiet utility area or footer.

## 2. Section grammar

Every section uses one of five structures:

| Pattern | Anatomy | Use |
| --- | --- | --- |
| `intro` | Label → heading → 1–2 sentence summary → action(s) | Page/major journey opening |
| `action-group` | Heading → short guidance → 2–5 equivalent actions | Home and patient-task choices |
| `content` | Heading → readable prose/list → contextual action | Guidance and service explanation |
| `collection` | Heading → optional search/filter → result count → cards/list → pagination | Doctors, services, search, careers |
| `support` | Heading → practical fallback/contact → availability qualifier | End of uncertain or digital journeys |

- One section has one main idea.
- A section heading explains its content rather than using generic labels such as “Learn more.”
- The first visible action follows the page's main question; secondary promotion cannot precede it.
- Alternate surface colors only when they clarify section boundaries.

## 3. Home composition

```text
[Header + persistent task access]
[Static-first introduction]
  H1 + concise promise
  Primary: Request an appointment
  Secondary: Find a doctor
  Separate: Emergency
[Essential actions: Doctor | Services | Appointment | Call | Directions]
[Visible site search]
[Browse care by approved need/service group]
[Approved featured doctors — omit if none]
[Before / During / After your visit]
[Location + verified contacts + text directions]
[Approved trust content — only after claim approval]
[Footer]
```

- The introduction uses an approved static image/poster or abstract field only when it strengthens orientation or human trust. A user-initiated video may enhance its reserved media plane under the interactive-media contract; it never delays or displaces care and Emergency actions.
- If approved footage is too narrative, visually busy, long, or claim-bearing for the introduction, place the playable institutional film after essential tasks in Home trust content or About.
- On compact screens, actions stack in priority order and remain text-labeled.
- On wide screens, essential actions may form a five-item row or balanced grid; each retains a consistent hit area and description.
- Requirements: G-001, H-001–H-005, E-001, C-001.

## 4. Emergency composition

```text
[Minimal header]
[Emergency title + one-sentence instruction]
[Primary verified call action + visible number]
[Hospital/public route distinction]
[Do-not-use-web-channels warning]
[Verified scope and hours]
[Entrance + landmark text directions]
[Transport/accessibility guidance]
[Optional user-initiated map]
```

- No decorative hero, carousel, testimonial, campaign, or unrelated cross-sell.
- The call action follows the heading and instruction in DOM and focus order.
- Red is concentrated on the action label/edge, not used as a large distressing page background.
- The entire useful route must render as HTML without JavaScript.
- Requirements: E-001–E-005, G-004–G-007.

## 5. Directory composition

Applies to doctors, services, and careers where maintained.

```text
[Breadcrumb]
[H1 + purpose + uncertainty fallback]
[Search]
[Filter disclosure on compact / filter rail on wide]
[Active filters + clear all]
[Accessible result count]
[Result list/grid]
[Pagination/load more]
[No-result or data-failure recovery]
```

### Responsive rules

- Search appears before optional filters.
- Compact filters open in a focus-managed dialog or disclosure; applying/clearing returns focus predictably.
- Wide filters can sit beside results only if the reading order remains search → filters → count → results.
- Results are one column compact, two medium, and no more than three wide.
- Filter and search state lives in the URL so refresh, deep linking, and back/forward work.

### State priority

1. Data failure and recovery action
2. No matching results and reset/contact action
3. Valid results and count
4. Genuine loading feedback if results are asynchronous

- Requirements: D-001–D-003, V-001, H-005, G-011.

## 6. Doctor/service detail composition

```text
[Breadcrumb]
[Identity block: H1 + verified summary/metadata]
[Primary request-care action + call fallback]
[Urgent exception where applicable]
[Main scope/clinical interests]
[Related doctors or services]
[Location, hours, preparation/referral]
[What happens next]
[Reviewed date + reviewer metadata]
[Related safe route/contact band]
```

- Keep core action near the identity block and repeat it only after substantial content where useful.
- Supporting metadata can form a side panel on wide screens but follows the main identity/action in DOM order.
- Missing optional content collapses cleanly; empty headings and placeholder cards never render.
- Doctor portraits are secondary to identity text. Service imagery is optional and never substitutes for scope.
- Requirements: D-003–D-006, V-002–V-005, G-014–G-015.

## 7. Appointment form composition

```text
[H1 + “request, not confirmation” explanation]
[Not-for-emergencies warning + verified call action]
[Progress label if the flow truly has multiple steps]
[Single-column fields grouped by purpose]
[Privacy purpose + consent]
[Review/submit]
[Success OR recoverable failure]
[Staffed telephone fallback]
```

Appointments is a flat top-level route in the approved sitemap, so it has no breadcrumb. Add one only if a later information-architecture change nests the route.

### Form rules

- Maximum content width is approximately 640 px.
- Use multiple steps only when conditional complexity or privacy comprehension improves; never split a short form for visual effect.
- Keep visible labels above controls. Put field hints before the input and errors directly after it.
- At submission failure, focus moves to a linked error summary while valid data remains.
- Do not use a modal for the primary appointment journey.
- The success view replaces the form only after the server acknowledges the request and includes a reference, response expectation, channel, next step, and telephone fallback.
- Requirements: A-001–A-007, S-003–S-005, G-011.

## 8. Patient-information hub composition

```text
[H1 + practical summary]
[Before your visit]
[During your visit]
[After your visit]
[Payment/insurance and accessibility routes where approved]
[Rights, feedback, safeguarding where approved]
[Call for unavailable or uncertain guidance]
```

- Journey-stage groups use plain-language links with one-line descriptions.
- Do not publish an empty stage to imply completeness.
- Essential guidance is HTML; a print stylesheet supports printing without requiring a PDF.
- Requirements: P-001–P-002, G-007, S-006–S-008.

## 9. Location/contact composition

```text
[H1 + canonical hospital identity]
[Purpose-labeled phone actions]
[Address + landmark directions]
[Hours/status]
[Entrance, transport, parking, accessibility]
[Text route]
[Optional user-initiated map]
[Non-urgent email/contact scope]
```

- Telephone categories are not presented as an undifferentiated list.
- A user can complete the journey before the map loads or if it is blocked.
- Temporary notices appear next to the affected hours/entrance, carry effective and expiry dates, and do not rely on the homepage alone.
- Requirements: C-001–C-003, S-005.

## 10. Search-results composition

```text
[H1]
[Search input with retained query]
[Urgent-term guidance where governed]
[Result type filters]
[Result count]
[Typed results: Doctor / Service / Guide / Location]
[Correction, zero-result, or failure recovery]
```

- Emergency guidance appears before ordinary results for approved urgent terms but search never diagnoses or estimates urgency.
- Snippets show why a result matches without exposing private or unapproved search data.
- Search terms are not sent to analytics until privacy approval defines safe handling.
- Requirement: H-005, S-005.

## 11. About and careers composition

- **About:** approved story → mission/values → evidence-dated facts → approved leadership/partners → care/contact action.
- **Careers:** current roles → candidate guidance → recruitment privacy → application route → expired/filled state.
- Neither route competes with essential patient tasks in primary navigation.
- Requirements: I-001–I-004, H-004.

## 12. Layout validation matrix

| Test | Pass condition |
| --- | --- |
| 320 px viewport | No horizontal page scroll; all controls and text remain available. |
| 360 px constrained Android | Primary action and emergency route remain clear; no overlapping sticky UI. |
| 200% and 400% zoom | Reading order, focus visibility, reflow, and dialogs remain usable. |
| Keyboard only | Visual and DOM sequence agree; overlays return focus; no traps. |
| Long English/Amharic fixture | No truncation, collision, or fixed-height clipping. |
| JavaScript blocked | Emergency, contact, detail content, and form fallback remain useful. |
| Map/media failure | Text alternative and practical actions remain complete. |
| Missing optional records | Sections disappear cleanly without empty shells. |
