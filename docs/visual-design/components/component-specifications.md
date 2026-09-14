# Order 5 Component Specifications

**Prepared:** 12 September 2026  
**Status:** Stable for non-public prototype composition; not production or publication approval  
**Requirements:** `G-001`–`G-016`, `S-003`–`S-008`, `H-005`, `E-001`–`E-005`, `D-001`–`D-006`, `V-001`–`V-005`, `A-001`–`A-007`, `P-001`–`P-002`, `C-001`–`C-003`, `I-004`–`I-005`

## 1. System contract

This package specializes the [Order 4 token source](../foundations/tokens.css) without redefining its primitive values or semantic meanings. Its reference CSS imports the foundation file, declares component aliases, and supplies implementation-shaped classes for the study. Production code may map these aliases into a framework, but the behavior, state priority, and accessibility contract must remain equivalent.

Every specimen carries the persistent non-public label. Controlled records use explicit names such as “Prototype clinician A” and values such as “[verified number]”; they are not selectable roster, contact, clinical, recruitment, or operational data.

### Component state priority

| Priority | State | Required treatment |
| ---: | --- | --- |
| 1 | Unavailable, expired, safety-blocked | Remove unsafe action; name what is unavailable; retain a safe approved route. |
| 2 | Validation/error/offline | State cause and recovery in words; preserve valid data and static alternatives. |
| 3 | Disabled | Use native semantics where possible; preserve legibility; explain why when expectation exists. |
| 4 | Loading/busy | Retain action label and dimensions; announce once; prevent duplicate intent. |
| 5 | Pressed | Immediate stable color feedback; optional 0.99 routine-action scale only. |
| 6 | Focus | Immediate 3 px blue outline with 2 px offset; never hidden by sticky content. |
| 7 | Hover | Subtle surface/border change; never the only affordance. |
| 8 | Default | Clear label, role, purpose, and primary destination. |

Focus remains visible on enabled busy and error states. Emergency, urgent, privacy/consent, unavailable, expired, and unknown-outcome components are Level 0: no entrance, travel, scale, pulse, stagger, countdown, or smooth-scroll dependency.

## 2. Shared shell and orientation

| Component | Anatomy and variants | Responsive behavior | Semantics and interaction | States / gates |
| --- | --- | --- | --- | --- |
| Prototype banner | One persistent statement above the shell | Wraps at 320 px; remains in print | Static text, never dismissible | Always present until formal approval replaces it |
| Skip link | “Skip to main content” | Moves into view on focus without changing page layout | First focusable anchor to `main` | Default visually off-screen; focus visible; no script |
| Header | Text-only identity, primary nav, language, search/menu, separated emergency access | Three regions wide; identity + menu + emergency/task access compact; header may grow without squeezing identity text | `header` banner; one labeled primary `nav`; identity is Home link | Amharic and configured long-navigation modes use the compact shell at all widths; logo remains text-only under `BRAND-01`; sticky use deferred per `VD-09` |
| Primary navigation | Patient-task links and current marker | Visible wide only when labels retain useful width; ordinary links inside compact menu otherwise | List of anchors; `aria-current="page"`; no positive tabindex | Hover, focus, pressed, current, wrapping, long language; no truncation |
| Mobile menu | Labeled trigger, primary task links, Search, Language, routine actions | Below-header contained panel; never wider than viewport | Trigger button uses `aria-expanded`/`aria-controls`; Escape closes and focus returns; no-JS fallback exposes equivalent links | Open/closed, focus, reduced motion; not used for primary page forms |
| Breadcrumb | Labeled list; current page text | Wraps; no horizontal scrolling; links retain a 44 px inline target | `nav aria-label="Breadcrumb"`; current item not redundant link | Omitted on Home and flat Appointment route |
| Footer | Core tasks, canonical contact routes, privacy/accessibility/institutional links | Source-ordered stacked groups compact; columns only when content fits | `footer`; same governed records as page content | Never sole location for emergency/contact; unapproved destinations labeled/withheld |

The shell covers `G-001`–`G-006`, `G-012`–`G-013`, `S-006`–`S-008`, `C-001`, `BRAND-01`, `LANG-01`–`LANG-02`, and `SAFE-01`.

## 3. Links, buttons, essential actions, and language

### Text link and icon-and-label action

- Navigation uses anchors; state-changing behavior uses buttons. A disabled navigation destination is not a dead anchor: render explanatory text/status or omit it.
- Inline links are underlined. Hover increases underline weight; visited uses a darker approved action color plus double underline so state is not color-only.
- Icon-supported controls retain visible text. The local SVG subset uses a 24 px view box, 2 px rounded stroke, `currentColor`, and decorative `aria-hidden="true"` when the label supplies meaning.
- External/provider consequences are written in the label or adjacent explanation. Do not place a vague external icon on every link.

### Button variants and states

| Variant | Permitted use | Default / hover / pressed | Loading / disabled |
| --- | --- | --- | --- |
| Primary | One leading routine action per region | Teal 700 / 800 / 900, white text; 0.99 pressed scale allowed | Label retained with spinner and `aria-busy`; disabled has adjacent reason |
| Secondary | Important alternative | Transparent teal boundary; teal 050 / 100 state surfaces | Same stable layout and semantics |
| Tertiary | Low-emphasis local action | Underlined text with quiet hover surface | Never substitute for an unavailable primary outcome |
| Emergency | Verified urgent page route or explicit call link | Red 700 / 800, white explicit label; no scale | Static verified number remains visible; no skeleton, auto-focus, or auto-activation |

The study intercepts all demo actions and never creates `tel:`, `mailto:`, map, Apply, or submit behavior. Production call links must display a purpose label plus human-readable number, use a matching normalized `tel:` value, activate only on click/keyboard activation, keep 8 px target separation, and leave final call placement to the device.

### Language switcher

- Language names appear in their own language; flags are prohibited.
- Equivalent routes retain stable record ID, bounded search/filter state, and safe form context.
- Missing equivalent content keeps the visitor on the page with an explanation; it never silently redirects Home.
- Consequential form data is preserved only when translated field/consent meaning remains valid. Otherwise warn before a reset.
- Document and passage `lang` values are correct. The study’s Ethiopic sample is geometry only and carries a professional-review note.

Requirements: `G-004`–`G-006`, `G-011`, `E-001`–`E-005`, `A-002`, `A-007`, `S-006`–`S-008`.

## 4. Search, autocomplete, filters, and pagination

| Component | Baseline | Enhanced behavior | Required states |
| --- | --- | --- | --- |
| Search box | Visible label, `type="search"`, bounded `GET` query, submit button; field and action stack through the compact/tablet range | Approved autocomplete may add typed suggestions without moving DOM focus | Initial, retained query, empty-attempt validation, busy, zero, timeout, offline, unavailable index; long action never compresses field |
| Autocomplete | Absent by default; base search complete | Accessible combobox/listbox pattern, announced count/active option, arrows/Enter/Escape; suggestions identify record type | No remote query sharing or urgent/diagnostic inference; unavailable enhancement leaves search intact |
| Filter group | Native checkbox/radio/select; maintained values only | Compact disclosure/menu with explicit Apply/Reset; wide change may update count | Default, selected, unavailable option, busy results, failure, no-JS submit |
| Active-filter chip | Visible value + explicit Remove action | URL and Back/Forward stay synchronized | Focus, pressed, removed, long/mixed-script wrap; Clear all when multiple |
| Result count | Heading/status adjacent to results | Polite announcement after submitted change, not every keystroke | Results, no matches, filtered, stale record removed |
| Pagination | Real anchors and current page text | Optional Load more retains a conventional link fallback | Previous/next unavailable, current, focus, long translated labels |

Search is navigational, not diagnostic. Fields do not solicit patient names, contact details, histories, or symptom narratives. Queries reach no analytics, autocomplete provider, replay, chat, pixel, or outbound referrer without `SEARCH-02`/`SEC-02` approval. Urgent-term guidance, when approved, is a separate static Emergency component before ordinary results and never states a diagnosis.

Requirements: `H-005`, `D-002`, `V-001`, `G-007`–`G-011`, `SEARCH-01`–`SEARCH-02`, `SEC-02`.

## 5. Governed record cards

### Shared anatomy

`type → title link → approved summary → optional governed metadata → contextual action/status`

- One entity, one clear primary destination. A title link may stretch across the card, while any secondary action sits above it in stacking order and remains independently labeled.
- Optional missing fields collapse; empty headings and speculative labels do not render.
- Hover border is supplemental. The title remains visibly linked without pointer or animation.
- Cards use one column compact, two when each card retains useful width, and no more than three wide.

| Card | Required content | Optional / prohibited | Unavailable behavior |
| --- | --- | --- | --- |
| Doctor | Approved name, specialty/service, profile route | Approved credentials/location/portrait/language; no inferred gender, schedule, or availability | Remove from current lists; honest profile-unavailable route unless genuine approved successor |
| Service | Patient-facing name, approved summary, detail route | Approved group/synonym; no diagnostic recommendation or unsupported capability | Withhold affected claim or record; retain safe directory/contact route |
| Location/contact | Canonical place, purpose-labeled contact, address/landmark summary, text directions | Approved hours/temporary status; map never precedes text route | State missing/expired operation; do not choose among conflicting source facts |
| Vacancy (Phase 2) | Complete current `I-004` record, privacy-before-Apply, stable public ID | No candidate data in URL; no speculative vacancy, unapproved mailbox/upload/provider | Remove Apply immediately on close/fill/withdraw/expiry/provider/privacy/language failure; show honest lifecycle state |

### Media and fallback

Doctor portrait fallback is an abstract neutral field with empty alt when the nearby name identifies the record. It does not imply gender or a real person. Service/location imagery is optional and text-independent. All future media requires recorded rights, authenticity, purpose, crop/focal point, alt decision, owner, review, and expiry.

### Review metadata

Clinical content uses “Medically reviewed” only with an authorized named review. Operational content uses “Information last checked.” The component includes approved reviewer role/name, date, next review/expiry policy, and internal record owner as applicable. It is not a decorative badge.

Requirements: `D-001`–`D-006`, `V-001`–`V-005`, `C-001`–`C-003`, `G-013`–`G-015`, `I-004`–`I-005`, `CARE-*`, `HR-*`.

## 6. Forms and validation

### Field anatomy

`visible label + written required/optional status → instruction/example → semantic control → inline error/status`

- Default field height is at least 48 px in page composition; the token hard floor is 44 px. Textarea is vertically resizable.
- Use correct input type, name, input mode, and autocomplete. Placeholder is an example, never a label.
- Full name and preferred-date requiredness remains a controlled prototype assumption pending `APPT-01`; the study labels its fields as examples.
- Validate on blur and submit, not before a reasonable attempt. Error connects through `aria-invalid` and `aria-describedby`, states problem and fix, and uses words plus geometry.
- Valid values survive validation, timeout, offline, unknown outcome, and recoverable server failure.

### Choice controls

- Radio: small mutually exclusive set, including an approved “Not sure” where supported.
- Checkbox: independent choice or explicit consent. Consent is never preselected.
- Native select: longer stable set. A custom combobox requires a separately tested pattern.
- Switches are not used for consent or one-time form answers.

### Submission state model

| State | Component behavior | Focus / announcement |
| --- | --- | --- |
| Editing | Consequence label reads “Send appointment request” | Normal DOM order |
| Validation error | Linked error summary plus inline messages; valid data retained | Focus summary; links move to fields |
| Pending | Submit disabled against duplicates, label retained, spinner and busy text | Polite “sending” once; no page lock |
| Rejected/recoverable | Explain failure, preserved data, retry condition, staffed fallback | Blocking failure announced; focus status/summary |
| Timeout/offline/unknown | Do not say failed or received; reconcile before retry if protocol supports it | Level 0 unknown-outcome status |
| Received | Reference, truthful response expectation, channel, next step, phone fallback | Focus confirmation heading; polite success only after acknowledgement |
| Delivery warning | Keep received reference; distinguish failed notification from failed request | Warning, not error/success reversal |

No public study submission exists. Production remains blocked until `APPT-01`–`APPT-04`, `SAFE-01`–`SAFE-02`, privacy, security, language, delivery, and incident gates close.

The reference pending control uses `aria-disabled="true"` instead of removing it from the focus order; its event guard blocks activation while `aria-busy` communicates progress. A production implementation must enforce the same duplicate protection in the request/idempotency layer rather than trusting presentation state alone.

Requirements: `A-001`–`A-007`, `S-003`–`S-005`, `G-011`, `APPT-*`.

## 7. Alerts, status, loading, and recovery

| Variant | Structure | Announcement / dismissal | Motion |
| --- | --- | --- | --- |
| Emergency | Explicit urgent heading, route distinction, verified action, visible number | Static page content reads normally; newly injected urgent state only if clinically governed; never dismissible when safety-relevant | Level 0 |
| Error | Specific failure, preserved-data statement, recovery | `role="alert"` for blocking injected failure; not dismissible until resolved if essential | Level 0 |
| Warning | Caution/prerequisite, consequence, safe choice | Static or polite; dismiss only when no task/safety loss | Level 0 for privacy/unknown outcomes |
| Information | Scope, eligibility, process, unavailable explanation | Static or polite | Direct color/border state only |
| Success | Authoritatively completed/received state and next step | `role="status"`/polite; never substitutes for server acknowledgement | Direct appearance; no celebration |
| Temporary operations | Affected service/entrance/hours, effective and expiry time, owner | Prominence follows affected journey; safety-relevant version not dismissible | Level 0 |

Loading under roughly 300 ms does not flash an indicator. From roughly 300 ms to 2 s, show a local stable indicator. Longer waits get plain-language progress and cancellation/safe fallback where supported; never invent a percentage. Skeletons are allowed only for predictable noncritical repeated record shapes, reserve final dimensions, contain no fake names, and never replace static emergency/contact content.

Empty means a valid collection has no items; unavailable means a required record/action cannot safely be supplied; offline means the current dependency cannot be reached. Each uses different words and recovery. “Nothing here” is insufficient.

Requirements: `G-004`, `G-010`–`G-011`, `E-003`, `A-002`, `I-005`.

## 8. Disclosure, image, and optional map

### Accordion/disclosure

- Use native `details/summary` or an equivalent heading/button pattern with exposed expanded state.
- Summary target is at least 44 px. Keyboard uses native activation; deep links/page search reveal targeted content where feasible.
- Do not hide the primary action, emergency warning, eligibility, privacy consequence, error, or only safe recovery.
- Standard treatment changes surface in up to 200 ms and may rotate a conventional indicator; reduced motion reveals final state immediately without rotation/travel.

### Optional image

- Declare dimensions or aspect ratio. Missing/loading/failure leaves surrounding content stable.
- Meaningful images have purpose-specific alt; redundant portraits/decorative abstract fields use empty alt.
- No source, rights, consent, authenticity, crop, or alt approval means the image is omitted or replaced by the abstract geometry fixture.

### Optional map launcher

- Text address, entrance, landmarks, directions, parking/transport, and accessibility guidance are complete before the launcher.
- The launcher explains whether it loads or leaves for a named approved provider and activates only after explicit consent/action where required.
- Idle, loading, failure, offline, blocked provider, and no-JavaScript states preserve the text route. No fallback uses an unapproved external link.

Requirements: `C-002`–`C-003`, `S-005`, `G-007`, `SEC-02`.

## 9. Responsive, bilingual, accessibility, and motion matrix

| Test | Component pass condition in Order 5 | Remaining performed validation |
| --- | --- | --- |
| 320 / 360 px | One-dimensional page flow; labels wrap; controls remain ≥44 px; no horizontal page scroll | Order 9 Chromium geometry pass complete; hardware/device validation remains |
| Tablet / 1280 / 1440 | Navigation/cards enhance only when minimum useful widths remain | Order 9 complete-page composition pass complete; cross-browser validation remains |
| 200% / 400% reflow | No fixed component heights; overlays fit viewport; sticky UI cannot obscure focus | Order 9 CSS-pixel reflow-equivalent pass complete; manual browser zoom and AT matrix remain under `DEL-01` |
| Keyboard | Source order matches visual order; focus visible; menu restores trigger; no traps | Cross-browser manual test in Orders 10–11 |
| Screen reader | Semantic names/roles/values and status patterns are specified | Named browser/screen-reader pairs under `DEL-01` |
| English / Amharic | 35% expansion, wrapping, Ethiopic family/line height and non-uppercase labels, correct `lang`, no flags; compact Amharic navigation shell | Order 9 geometry pass complete; approved copy and professional language review remain |
| Reduced motion | Travel, scale, rotation, drawing, stagger, smooth scrolling, and looping spinner removed; status/focus remain | Vestibular/human/device validation |
| Forced colors | System borders/focus retained; color is not the only state signal | Windows High Contrast manual validation |
| No JavaScript | Header links, emergency/contact content, GET search, native form submit/failure, details, and text directions remain useful | Production server/fallback implementation |
| Performance | No external request/library/font/icon/media; component CSS is layered over foundation source | Bundled production measurement on constrained profile |

## 10. Traceability and gates

| Component group | Pages / flows | Decisions that remain production gates |
| --- | --- | --- |
| Shell, navigation, language | All 12 pages; all flow packages | `GOV-02`–`GOV-03`, `LANG-01`–`LANG-02`, `BRAND-01`, `DEL-01` |
| Emergency and call | Home, Emergency, Appointment, Contact, Search; F1–F5, PA2/PA4 | `SAFE-01`–`SAFE-04`, `LANG-01`, `SEC-02` |
| Search and filters | Home, directories, Search; C1–C7, PA3–PA7 | `CARE-01`, `CARE-04`, `SEARCH-01`–`SEARCH-02`, `LANG-*`, `SEC-02` |
| Governed cards | Home, directories/details, Contact, About, Careers | `CARE-*`, `INST-*`, `HR-*`, `BRAND-01` |
| Appointment form/states | Appointment and discovery handoffs; F3–F5 | `APPT-01`–`APPT-04`, `SAFE-01`–`SAFE-02`, `LANG-01`, `DEL-01` |
| Guidance/status/map | Emergency, Patient Information, Contact, Search, detail pages; PA1–PA7 | `ACCESS-01`, `SAFE-*`, `SEC-02`, `LANG-*` |

The 32 decisions are sufficient working policy for non-public design and prototyping. They remain formal Unresolved outcomes until named hospital participants provide dated evidence. Existing source content and benchmark usage never imply approval.

## 11. Acceptance evidence

Order 5 records:

- dependency-free semantic HTML and CSS specimens;
- rendered 1440 px, 360 px, 320 px reduced-motion, and focus-state evidence;
- a source check for raw color values outside the inherited foundation file;
- a JSON parse check for the portable manifest;
- a local-link and external-request inspection;
- keyboard, landmark, target-size, overflow, accessible-name, field-label, and duplicate-ID checks performed against the study in Chromium;
- explicit limitations for unperformed screen-reader, device, language, human-comprehension, and production integration testing.

The later [Order 9 refinement](../pages/responsive/README.md) records the 525-case complete-page viewport, reflow, and language/content geometry pass plus the shared corrections that now extend this component baseline.

Any failed check or foundation exception must be recorded in the evidence manifest and corrected or dispositioned before Order 6 consumes the component.
