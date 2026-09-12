# Component Contracts

**Status:** Behavioral contract with Order 5 polished prototype treatment  
**Related:** [Foundations](foundations.md) · [Interaction and motion](interaction-and-motion.md) · [Requirements matrix](../requirements/requirements-matrix.md) · [Benchmark traceability](../benchmarks/benchmark-traceability.md)

The non-public visual treatment, component-level token aliases, responsive specimens, complete state matrix, and evidence are documented in the [Order 5 polished component system](../visual-design/components/README.md). This source contract continues to govern semantics and behavior when a rendered prototype treatment differs.

## 1. Contract applied to every component

Every component specification and implementation must define:

- Purpose and when not to use it
- Semantic element and accessible name
- Anatomy and allowed variants
- Default, hover, focus, active, disabled, loading, error, success, empty, and unavailable states where applicable
- Keyboard, touch, pointer, screen-reader, and browser-back behavior
- Compact, reflow, zoom, and long-content behavior
- English/Amharic content rules and absence handling
- No-JavaScript or failed-dependency fallback where the component affects an essential journey
- Performance cost and any third-party/privacy implications
- Linked requirement IDs and test evidence
- Linked benchmark application IDs where a component implements `BM-01`–`BM-13`, without treating benchmark provenance as hospital approval

Do not create a variant solely to patch one page. A new variant needs a reusable purpose and documented accessibility behavior.

## 2. Component inventory

| Group | Components | Phase |
| --- | --- | --- |
| Structure | Skip link, header, primary navigation, mobile menu, breadcrumb, footer | 1 |
| Essential actions | Emergency action, call link, appointment action, language switcher | 1 |
| Controls | Button, text link, icon-and-label action, input, select, checkbox, radio, textarea | 1 |
| Discovery | Search box, autocomplete, filter group, active-filter chip, result count, pagination | 1 |
| Governed content | Doctor card, service card, location/contact card, review metadata | 1 |
| Careers | Vacancy card | 2; gated and non-actionable until the complete HR/privacy/language lifecycle is approved |
| Feedback | Alert, inline error, error summary, status message, loading indicator, empty/unavailable state | 1 |
| Disclosure/media | Accordion, image, optional map launcher/text alternative | 1 |
| Later capability | Tabs, dialog beyond mobile filters, portal/account controls, campaign modules | Only when justified |

## 3. Links, buttons, and essential actions

### Text link

- Use an anchor for navigation, downloads, telephone, email, and external destinations.
- Body links are underlined by default. Navigation links may use position, weight, and a selected marker but retain a visible focus state.
- External links state the destination when the consequence is meaningful; do not add a vague external-link icon to every link.
- Link text describes the destination: “Doctor directory,” not “Click here.”

### Button

| Variant | Use | Visual role |
| --- | --- | --- |
| Primary | One highest-priority non-emergency action per region | Filled `color.action.primary` |
| Secondary | Important alternative | Quiet filled or strong outline |
| Tertiary | Low-emphasis local action | Text/ghost with persistent affordance |
| Emergency | Verified emergency call/navigation only | `color.emergency`, visible word and icon |
| Destructive | Rare irreversible management action | Not expected on the public Phase 1 site |

- Minimum height 48 px by default; compact visual size still preserves a 44 px target.
- Button labels use an action verb and remain stable while loading; a spinner does not replace all context.
- Loading sets an announced busy state and prevents duplicate submission without erasing focus.
- Disabled controls need adjacent explanation when a user could reasonably expect them to work.
- Requirements: G-004–G-006, G-011, A-007.

### Call link

**Anatomy:** purpose label → human-readable number → phone icon (supporting) → optional availability qualifier.

- `tel:` value exactly matches the approved normalized visible value.
- Purpose is explicit: Emergency/ambulance, appointment help, or switchboard.
- Never show a phone icon alone and never label every number simply “Call us.”
- If hours are limited, place the qualifier beside the action.
- Requirements: E-001–E-003, C-001.

### Emergency action

- Reserved for verified urgent routing; not a promotional red button.
- Visible in every page shell and first in the Emergency page's action order.
- Label remains explicit at every viewport; a siren/phone icon alone is insufficient.
- The component may link to the Emergency page globally and become direct tap-to-call inside the Emergency context after operations approval.
- Only the explicit labeled call link is interactive; the surrounding card or region is not. Activation occurs on click/keyboard activation, never on page load, pointer-down, or touch-down.
- Keep at least 8 px separation from adjacent targets. Opening the device dialer is the web action; final call placement remains under device/user control, with the visible number retained for manual dialing if handoff fails.
- Requirements: G-001, E-001–E-005, A-002.

## 4. Header and navigation

### Header anatomy

```text
Approved logo/home link
Primary patient-task navigation
Search
Language switcher
Emergency action
Routine Call/Appointment action as space permits
Menu trigger on compact layouts
```

- Header is a semantic banner containing one labeled navigation region.
- The logo's accessible name is the approved hospital name; decorative logo text is not repeated to screen readers.
- Current navigation uses `aria-current="page"` and a non-color-only visual marker.
- Any sticky header yields to in-page anchors and focused controls.

### Mobile menu

- Trigger communicates expanded state and controls relationship.
- On open, focus moves only if the implementation uses a dialog model; on close, focus returns to the trigger.
- Escape closes it; Tab does not escape a modal implementation.
- Browser Back closes a route-like full-screen menu before leaving the page when that behavior is implemented consistently.
- Background content does not remain operable behind a modal menu.
- Requirements: G-001–G-006, G-012.

### Breadcrumb

- Use on detail and secondary pages; omit on Home and flat top-level pages where it adds no location information.
- Mark up as a labeled navigation list; current page is text or `aria-current="page"`, not a redundant link.
- Allow wrapping; never horizontal-scroll the trail.
- Requirement: G-013.

### Footer

- Repeats canonical contact routes, core tasks, language scope, privacy, accessibility, and institutional links.
- It is a fallback, not the only place for essential information.
- Contact data comes from the same governed record used elsewhere.
- Requirements: G-001, C-001, S-004.

## 5. Language switcher

**Anatomy:** current language label → available equivalent language → availability explanation when missing.

- Use language names in their own language; do not use flags.
- Switching retains the same route, query, and safe interaction context where an equivalent exists.
- When no equivalent exists, keep the user on the page and explain what is available; never silently send them Home.
- A form switch preserves entered data only if translated consent and field meanings remain valid; otherwise warn before any consequential reset.
- The document `lang` and changed passages' language metadata must be correct.
- Requirements: S-006–S-008.

## 6. Search and filters

### Search box

- Permanent visible label or programmatic label plus adjacent page heading; placeholder only provides an example.
- Uses a search input and submit button so the essential action works without client-side autocomplete.
- Clear control has an accessible name and only appears when content exists.
- Retains the query on results and encodes safe state in the URL.
- Requirements: H-005, D-002, V-001.

### Autocomplete

- Progressive enhancement only; base search remains available without it.
- Announces suggestion count and active suggestion without moving DOM focus away from the input.
- Keyboard supports arrows, Enter, Escape, and normal text-editing keys.
- Suggestions identify result type and never present diagnosis or urgency estimates.
- No query leaves the browser for unapproved analytics or third parties.

### Filter group and chips

- Filters appear only when their underlying data is approved and maintained.
- Native checkboxes/radios/selects are preferred; custom controls require equivalent semantics.
- Apply/reset actions are explicit on compact overlays; wide filters may update on change with an announced result count.
- Active-filter chips have a visible label and remove action; “Clear all” is available when multiple filters apply.
- URL, Back, Forward, and refresh preserve the state.
- Requirements: D-002, H-005, G-011.

### Result count and pagination

- Result changes are announced politely after the user action, not on every keystroke.
- Pagination uses real links for indexable lists. A “Load more” enhancement preserves loaded state and a conventional paginated fallback.
- Focus does not jump unexpectedly after a page/filter change; the result heading or status becomes the next logical context.

## 7. Governed-content cards

### Shared card rules

- A card represents one entity and has one clear primary destination.
- Prefer one stretched title link over nesting buttons/links inside a fully clickable container.
- Optional fields disappear without labels or placeholders.
- Do not use hover lift as the only click affordance.
- Compact cards stack; grids never reduce names or actions below legible sizes.

### Doctor card

**Required anatomy:** approved name → specialty/service → profile action.  
**Optional:** approved portrait, credentials, location, verified language.

- Do not show live availability or schedule without authoritative data.
- Portrait alt is normally empty because the nearby name identifies the person; meaningful clinical context needs a separate editorial decision.
- Neutral fallback does not imitate a real portrait or infer gender.
- Requirements: D-001–D-006.

### Service card

**Required anatomy:** patient-facing service name → short approved summary → detail action.  
**Optional:** approved group label and safe synonym.

- Do not use service cards as diagnostic recommendations.
- Emergency exceptions appear only when clinically governed and do not hide inside hover/disclosure.
- Requirements: V-001–V-004.

### Location/contact card

**Required anatomy:** canonical place name → purpose-labeled contact → address/landmark summary → directions action.  
**Optional:** approved hours/current temporary status.

- Text directions precede or equal the map action.
- Temporary status includes effective time and expiry/review ownership.
- Requirements: C-001–C-003.

### Vacancy card

**Required anatomy:** approved job title → team → location → employment type → closing date/timezone → responsibilities → criteria → application process → recruitment-privacy route → explicit Apply action.

- Represents one current vacancy with a stable public identifier and one approved application destination; neither contains candidate data.
- Apply is a link when it navigates to an internal or clearly labeled external application route. The surrounding card is never one large hidden application target.
- Status and closing time are text, not color or a countdown. Closing, filling, withdrawal, expiry, or loss of the approved privacy/application route removes Apply immediately.
- Optional fields disappear cleanly, but the required `I-004` record fields do not. An incomplete record remains unpublished rather than presenting a disabled or speculative vacancy shell.
- Before Apply, expose the approved recruitment privacy notice and identify any external provider. A failed provider never falls back to an ungoverned mailbox, upload, or form.
- Requirements: G-005–G-007, G-010–G-015, S-003–S-005, I-004.

### Review metadata

- Displays “Medically reviewed” only when a named, authorized review exists.
- Shows reviewer role/name as approved, review date, and next review/expiry policy as appropriate.
- Operational records use “Information last checked” rather than implying clinical review.
- Requirements: G-014, V-002, I-005.

## 8. Forms

### Field anatomy

```text
Visible label + required/optional status
Instruction or example
Input/control
Inline error or status
```

- Default field height is at least 48 px; textarea height follows expected input and remains resizable.
- Use appropriate HTML input type, `autocomplete`, input mode, and name.
- Required status is written, not conveyed by an asterisk alone; avoid marking every field if nearly all are required.
- Validate most fields on blur and again on submit; do not report an error before the user has had a reasonable chance to answer.
- Error connects to the field, states the problem and fix, and is not color-only.
- Never clear valid input after validation, timeout, or recoverable server failure.
- Requirements: A-003–A-006, S-003–S-005.

### Select, radio, and checkbox

- Radio is used for a small mutually exclusive set, including “Not sure” where approved.
- Checkbox is used for independent choices and explicit consent; consent is never preselected.
- Native select is preferred for longer stable sets; typeahead/combo box requires a fully tested accessible pattern.
- Do not use a switch for consent, one-time form choices, or settings that are not immediately applied.

### Error summary

- Appears before the field group after invalid submission.
- Receives focus, contains a plain-language heading, and links each item to its field.
- Inline errors remain present at the fields; summary is not a replacement.
- Server failures that are not field-specific give retry/fallback guidance without blaming the user.

### Submit and success state

- Submit label states the consequence: “Send appointment request,” not “Book now.”
- While pending, preserve label/context, announce progress, and block duplicate intent.
- Success appears only after server acknowledgement and includes the reference, truthful response expectation, confirmation channel, next step, and approved phone fallback.
- Requirements: A-001, A-006–A-007.

## 9. Alerts and status

| Variant | Use | Announcement |
| --- | --- | --- |
| Emergency | Immediate verified urgent route | Assertive only when newly injected; static page content is read normally |
| Error | Failed action or invalid data | Assertive for blocking failure |
| Warning | Important caution before an action | Usually static/polite |
| Information | Scope, eligibility, or process explanation | Static/polite |
| Success | Confirmed completed system action | Polite status |
| Temporary operations | Closure, relocation, or availability change | Prominence depends on affected journey |

- **Anatomy:** icon → specific heading → concise message → recovery/action → effective/expiry metadata if temporary.
- Status never relies on background color or icon alone.
- Dismissal is allowed only when hiding the notice cannot create a safety or task failure.
- Crisis banners require an owner, target routes, effective time, expiry, and fallback behavior.
- Requirements: G-004, G-010–G-011, E-003, A-002, I-005.

## 10. Accordion/disclosure

- Use only for optional detail after a complete summary, not for the primary action, emergency warning, core eligibility, or error.
- Trigger is a button with expanded state; heading contains the button where the disclosure labels a section.
- The entire labeled row may be clickable if semantics and focus remain clear.
- Default-open state follows content need; do not collapse every answer solely to shorten a page.
- Page search and deep links should reveal targeted hidden content where technically feasible.

## 11. Optional map

- Base page includes address, landmark, entrance, and text directions in HTML.
- Map loads only after an explicit action if privacy/performance review requires it.
- Launcher explains the provider/behavior when it leaves the site or loads a third party.
- Failure preserves all contact/direction content and offers an external map link only if approved.
- Requirements: C-002–C-003, S-005, G-007.

## 12. Component acceptance evidence

For each Phase 1 component, record:

| Evidence | Minimum coverage |
| --- | --- |
| Story/example states | Default plus every applicable failure and success state |
| Accessibility | Name/role/value, keyboard, focus, screen-reader announcement, contrast |
| Responsive | 320 px, 360 px, tablet, desktop, 200% and 400% zoom |
| Language | English, approved Amharic, long names, mixed script, missing translation |
| Runtime | Slow response, timeout, no JavaScript, failed third party where relevant |
| Content | Missing optional data, expired record, duplicate record, long labels |
| Traceability | Requirement IDs, owner, decision status, test link |
