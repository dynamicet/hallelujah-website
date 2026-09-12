# Order 6 Critical-Journey Visual Specifications

**Prepared:** 12 September 2026  
**Status:** Complete for non-public responsive design review; not production or publication approval  
**Pages:** Home, Emergency, Request an Appointment  
**Foundation:** [Order 4 prototype foundations](../../foundations/README.md)  
**Components:** [Order 5 component system](../../components/README.md)

## 1. Composition contract

These designs preserve every accepted section ID and source order: `H0`–`H9`, `E0`–`E8`, and `A0`–`A8`. Desktop columns are presentation only; DOM, heading, keyboard, screen-reader, print, and compact reading order remain the wireframe order.

The page layer introduces composition rules only. It imports the Order 5 component CSS, which imports the Order 4 foundations. It does not redefine a primitive, semantic color, component state, or safety behavior. Section-specific arrangements do not create page-only button, alert, form, card, call, or navigation variants.

Every design study:

- carries a persistent, non-dismissible non-public prototype statement;
- uses local system fallbacks and inline SVG geometry with no external request;
- presents unapproved records and facts as controlled placeholders, never release copy;
- keeps calls, map loading, search, language switching, and appointment submission inert;
- maintains 44 px minimum targets and visible focus inherited from Order 5;
- retains essential HTML when scripts, motion, media, or optional providers are absent;
- uses Level 0 treatment for Emergency, urgent warnings, privacy, errors, unavailable states, and unknown outcomes;
- treats the Home orientation rule as the only Level 2 entrance detail and removes its drawing treatment under reduced motion.

## 2. Home section-by-section design

| ID | Polished composition | Responsive behavior | Content/state behavior | Traceability |
| --- | --- | --- | --- | --- |
| `H0` | Text identity, five task links, language control, and separated emergency action use the shared shell. | Full task navigation wide; compact Menu plus separate Emergency action below 64 rem. Identity, Menu, and actions wrap at 320 px. | Missing logo stays text-only. Amharic action explains unavailable parity without redirecting. | `G-001`–`G-006`, `G-010`, `S-006`–`S-008`, `H-001`; `BM-01`, `BM-06`, `BM-09`. |
| `H1` | Asymmetric task-led hero pairs concise orientation/actions with an abstract rights-gated visual field. Routine primary/secondary actions and Emergency remain structurally distinct. | Two columns wide, one column below 54 rem; media field follows content and shrinks without displacing tasks. Actions stack at compact width. | Media failure removes no meaning. Emergency is a real local page-design route; operational actions remain absent. | `H-001`, `H-002`, `G-001`, `E-001`; `BM-01`, `BM-02`, `BM-10`, `BM-12`. |
| `H2` | Five equal task cards use local outline icons, explicit labels, and visible outcomes. | Five columns wide, three at intermediate widths, one at compact width. Cards reduce height rather than truncate. | Call remains an inert controlled placeholder until a canonical contact is approved. Other cards route within local design artifacts. | `G-001`, `G-002`, `G-006`, `H-001`; `BM-02`, `BM-03`, `BM-06`. |
| `H3` | Raised search panel provides label, privacy hint, field, and explicit submit. | Inline field/action when useful width exists; inherited Order 5 search stacks at 320/360 px. | Standard GET is the production baseline. This study prevents submission. Empty, unavailable-index, and results states remain the Search Results page responsibility for Order 8. | `H-005`, `G-007`, `G-011`, `S-005`; `BM-03`, `BM-09`. |
| `H4` | Three-card service collection demonstrates two controlled records plus the directory route. | Three columns wide, two at intermediate widths, one compact. | Whole section is omitted without spacing if no records are approved. Failure substitutes a scoped explanation plus approved directory/contact routes; it never fabricates cards. | `H-003`, `V-001`, `V-003`, `G-015`; `BM-03`, `BM-04`, `BM-10`. |
| `H5` | Doctor collection uses two neutral 4:3 portrait fallbacks plus the directory route. | Same content-fit collection behavior as `H4`; names wrap without truncation. | Controlled names are explicitly fictional. Missing portrait is neutral and supplies no identity, gender, schedule, or availability meaning. Empty section is omitted. | `H-003`, `D-001`–`D-003`, `G-015`; `BM-03`–`BM-05`, `BM-09`. |
| `H6` | Three before/during/after guide cards use an ochre wayfinding edge and hospital-authored-content gate. | Three equal columns wide; one source-ordered column below 54 rem. | Any empty stage is omitted. If all stages are unavailable, only the staffed fallback remains. | `P-001`, `P-002`, `G-015`; `BM-06`, `BM-10`. |
| `H7` | Text-first contact content leads; abstract arrival geometry is supplementary. Purpose, value, address, entrance, and landmarks have explicit placeholder slots. | Balanced two-column panel wide; single column with text first below 54 rem. | No map loads and no dialer opens. Missing canonical contact/arrival data blocks the module and Phase 1 release rather than selecting among source conflicts. | `C-001`–`C-003`, `G-007`, `G-014`; `BM-02`, `BM-06`, `BM-08`. |
| `H8` | A restrained institutional panel pairs controlled narrative space with evidence metadata rather than promotional metrics or logos. | Two columns wide; narrative then metadata compact. | In a public build, no approved story means the whole section is omitted. The visible controlled version exists only to review `H8` composition. | `H-004`, `I-001`–`I-003`, `G-014`, `G-015`; `BM-01`, `BM-11`, `BM-12`. |
| `H9` | Human fallback gets a full-width support band before a three-column inverse footer. | Band and footer source-order into single columns at compact widths. | Canonical support, privacy, accessibility, and language records remain gated; the study links only local design artifacts. | `G-001`, `G-007`, `S-004`, `C-001`; `BM-06`, `BM-09`. |

### Home state composition

Static shell, tasks, search, and governed contact HTML never skeletonize. Optional record collections may reserve dimensions only if a real asynchronous boundary exists. Empty `H4`, `H5`, or `H8` disappears completely. A failed collection affects only its region and retains the approved directory plus staffed route. Search failure retains the visitor's query on the Search Results page and provides Doctors, Services, Contact, and Emergency routes without clinical inference.

The default study intentionally shows controlled `H4`, `H5`, and `H8` specimens so their final composition can be reviewed. This is not the public empty-state policy.

## 3. Emergency section-by-section design

| ID | Polished composition | Responsive behavior | Content/state behavior | Traceability |
| --- | --- | --- | --- | --- |
| `E0` | Shared shell stays visually quiet, with Emergency clearly current and ordinary navigation recoverable. | Wide navigation collapses to Menu without adding a sticky call bar or obscuring the first choice. | Missing Amharic parity is explained in place. No emergency value exists in the header study. | `G-001`, `G-005`, `G-010`, `S-006`–`S-008`; `BM-02`, `BM-06`. |
| `E1` | A red-edged instruction block establishes the hospital/public distinction before two separated neutral call-choice cards. Each has purpose, visible value, explicit red action, and fallback explanation. | Two columns wide and one column compact; actions size to content wide and full card width compact, but the card/whitespace never becomes active. | Both actions are inert. A missing purpose, applicability, visible number, normalized value, or route blocks publication; no disabled red call button is the release fallback. | `E-001`, `E-002`, `E-005`, `G-004`–`G-007`; `BM-02`, `BM-08`, `BM-09`. |
| `E2` | Definition list compares route audience, purpose, limits, and hours without duplicating call actions. | Paired with `E3` only when both remain readable; otherwise precedes it. | One unavailable route blocks publication unless Clinical and Operations approve a truthful complete distinction. | `E-001`, `E-002`, `C-001`; `BM-08`, `BM-10`. |
| `E3` | Non-dismissible emergency status structure warns against forms, email, chat, and social messaging. | Source-ordered beside `E2` wide and below it compact. | Static HTML, not an assertive injected alert. No online contact action is present. Copy and Amharic meaning are release gates. | `E-003`, `G-010`, `S-006`; `BM-06`, `BM-11`. |
| `E4` | Reading-width governed scope with visible information status and required review metadata. | One measure at all widths; lists/prose wrap. | Expired or missing required scope blocks publication. Optional scope detail is omitted. No related promotion precedes the safety summary. | `E-004`, `G-014`, `G-015`; `BM-10`, `BM-11`. |
| `E5` | Exact entrance precedes three landmark-based route steps and optional local copy enhancement. | Paired with `E6` wide, first in DOM and single column compact. | Text remains selectable without JavaScript. Copy success is the only local success state; missing directions block release. | `E-004`, `E-005`, `C-002`, `G-007`; `BM-06`, `BM-08`. |
| `E6` | Definition list separates vehicle/parking, transport, and accessible entrance information. | Follows `E5`; no accordion hides the accessible route. | Optional unapproved transport detail collapses. Exact accessible entrance guidance is never inferred. | `E-004`, `C-002`, `G-015`; `BM-08`, `BM-13`. |
| `E7` | Bordered optional-map launcher follows complete text guidance and includes idle, privacy, and failure explanations. | Full width; no reserved map canvas until an approved explicit request. | The study makes no request. Loading would appear after about 300 ms, reserve dimensions, and keep `E5`/`E6` unchanged. Error is non-blocking; no-JS omits the enhancement. | `C-003`, `S-005`, `G-007`–`G-009`, `G-011`; `BM-08`, `BM-09`, `BM-13`. |
| `E8` | A clearly non-emergency support band and shared footer provide safe exits. | Single-column stack compact; no floating obstruction. | Missing canonical switchboard/contact record remains a release gate. | `G-001`, `C-001`, `S-004`; `BM-06`, `BM-09`. |

### Emergency activation and motion

Emergency and every page state are Level 0. There is no hero entrance, wayfinding animation, pulse, countdown, auto-focus, auto-scroll, sticky call takeover, or exit delay. Each eventual telephone anchor may activate only on completed click/tap or normal keyboard activation. Page load, focus, surrounding-card activation, `pointerdown`, and `touchstart` never open a dialer. Visible and normalized values must match in tested implementation; this design contains neither.

The website cannot know that a call connected. Returning from an unsupported or cancelled handoff preserves the visible purpose and number for manual dialing and never presents a success state.

## 4. Appointment section-by-section design

| ID | Polished composition | Responsive behavior | Content/state behavior | Traceability |
| --- | --- | --- | --- | --- |
| `A0` | Shared shell exposes language and Emergency outside the form and marks Appointments current. No breadcrumb or progress indicator is added. | Full navigation wide; compact Menu and separated Emergency action; no sticky element covers a field or submit. | Language switching stays inert while equivalent fields, consent, and state copy are unapproved. | `G-001`, `G-003`–`G-006`, `S-006`–`S-008`; `BM-02`, `BM-06`. |
| `A1` | Reading-width opening states request/follow-up meaning and displays the operating/privacy gate. | Same form measure at every width; no oversized promotional hero. | Workflow unavailable removes the form and presents `A7`, not a dead submit. | `A-001`, `A-006`, `G-010`; `BM-02`, `BM-05`. |
| `A2` | Static emergency status immediately precedes form content and links to the local Emergency page design. | Full form width; never collapsed. | Level 0 and no personal-data interaction precedes it. Approved wording and route remain publication gates. | `A-002`, `E-001`, `E-005`, `S-006`; `BM-02`, `BM-06`. |
| `A3` | Hidden in the default page; dedicated state board shows a focusable summary, problem count, linked errors, and retained valid answer. | Single form measure; long links wrap. | Newly rendered summary receives focus once; corrections update without stealing focus. Errors remain inline and programmatically described. | `A-004`, `G-005`, `G-011`; `BM-09`, `BM-10`. |
| `A4` | Single-column form sections: mutually exclusive care route, one conditional canonical selector, contact candidates, date preference, and explicit omission of notes. | Remains one column even on desktop. Controls use full available width; labels/hints/errors wrap at 320 px. | Doctor and service never become required together. Full-name/date requiredness stays visibly unresolved. Notes remain absent pending necessity/security approval. Values persist through valid recovery states. | `A-003`, `A-004`, `S-003`, `D-001`–`D-003`, `V-001`, `V-003`; `BM-03`, `BM-05`, `BM-09`. |
| `A5` | Visible blue privacy panel and unchecked native consent choice sit directly before send. | One column; consent target remains at least 44 px. | Level 0. Essential disclosure is never collapsed. Missing approved notice/meaning removes form publication. | `A-005`, `S-003`–`S-006`; `BM-09`–`BM-11`. |
| `A6` | Consequence explanation precedes one submit action. The state board demonstrates validation, pending, duplicate recovery, known failure, offline, unknown outcome, authoritative receipt, and delivery warning. | Full-width submit compact; intrinsic width wide. State cards are two columns when they fit and source-order to one. | First intent is idempotent; unknown outcomes reconcile before retry. Only authoritative receipt uses success. Delivery failure retains the same reference and never offers resubmit. | `A-001`, `A-006`, `A-007`, `G-011`, `G-012`; `BM-05`, `BM-09`, `BM-10`. |
| `A7` | Staffed appointment fallback sits directly after form/state with purpose, visible number slot, hours slot, and explicit non-emergency scope. | Full form measure, always visible and unobscured. | Missing canonical contact is a publication block. The local control is inert. | `A-006`, `C-001`, `G-007`; `BM-06`, `BM-09`. |
| `A8` | Shared inverse footer provides Home, care discovery, Emergency, privacy/access, and design-state routes. | Three columns wide; single source-ordered column compact. | Same canonical records as other pages; no trackers or contact-only-in-footer dependency. | `G-001`, `S-004`, `C-001`; `BM-06`, `BM-09`. |

### Appointment state model

| State | Visual and interaction requirement | Focus/status rule |
| --- | --- | --- |
| Editing | No premature errors. Required/optional status and hints are visible. | Natural form order. |
| Validation error | Red summary before fields, linked actionable messages, valid values retained. | Focus summary once; links focus each invalid control. |
| Pending | Stable button label/width, busy semantics, duplicate activation unavailable. | Polite single announcement; form, Emergency, language explanation, and staffed fallback remain reachable. |
| Authoritative recoverable failure | Error states that nothing was sent; values retained; same-intent safe retry and staffed route offered. | Focus error summary/status according to implemented response; no internal detail. |
| Offline/timeout/unknown | Warning says outcome is not known; no create retry until original intent is reconciled. | Polite status; no countdown, spinner dependency, or focus trap. |
| Duplicate intent found | Information state checks/restores original outcome; no second request/reference. | Do not announce as a new success until authoritative acceptance is returned. |
| Received | Green authoritative acknowledgement, request reference, “not confirmed” boundary, response/channel/next step, staffed fallback. | Focus received heading/status once after POST/redirect/GET or equivalent. |
| Delivery warning | Amber state retains the same accepted reference, states message delivery problem, and says not to resubmit. | Focus/announce warning without changing accepted request state. |
| Workflow unavailable | Form removed; reason plus verified staffed appointment contact. | H1 and unavailable message remain ordinary entry order. |

## 5. Bilingual, responsive, and content fixtures

- Both English and Amharic remain left-to-right. `lang` changes by page or passage, never `dir="rtl"`.
- Current studies use only the language name `አማርኛ` as a geometry fixture. No unreviewed clinical, consent, validation, emergency, or operational translation is presented as meaningful copy.
- Every layout allows at least 35% label expansion, arbitrary wrapping, mixed-script fallback, and long controlled-record labels. No name, contact, heading, button label, error, or status truncates.
- Wide reference is 1280/1440 px. Collections reflow on content-fit thresholds; tablet is represented by the 54–70 rem rules rather than device names. Compact reference is 320/360 px.
- At 200% zoom on a 1280 px viewport, layouts return to compact/intermediate composition. At 400% zoom, a 320 CSS px single axis is the acceptance baseline. Fixed-position content is limited to the temporary local study announcement and must not obscure focused content in production.
- Reduced motion removes Home rule drawing and all component travel/scale/rotation/drawing/stagger/smooth-scroll behavior. State, order, focus, status, and final geometry remain.

## 6. No-JavaScript, privacy, and performance baseline

The pages are meaningful semantic HTML before the small local study script runs. Navigation and local design-page links remain ordinary anchors. Emergency warning, purpose distinction, visible placeholder values, text directions, appointment privacy disclosure, form anatomy, and staffed fallbacks remain in source order.

The study script only opens/closes the contained mobile menu and displays a local non-persistent message after an inert demo action. It sends no request, stores no input, reads no URL data, sets no cookie, loads no provider, and contains no analytics, chat, map, replay, font, icon, image, or submission integration.

Production budgets remain inherited from Orders 3–5: no approved animation library, content-first rendering, stable media dimensions, no critical runtime fetch for Emergency/contact, no map on initial load, and no layout-shifting font dependency.

## 7. Acceptance and remaining validation

- [x] All 27 accepted section IDs are present in source order across the complete page designs.
- [x] Complete mobile and desktop compositions use one inherited foundation/component source.
- [x] Home exposes Emergency, doctors, services, appointment, call, directions, search, patient guidance, and trust in the accepted priority.
- [x] Emergency distinguishes the two routes before explicit separated call choices and contains no live or source-candidate number.
- [x] Appointment preserves the single-column, data-minimized request model and distinguishes every required submission/recovery state.
- [x] No page introduces a page-only component variant, gated operational fact, public roster/service claim, live contact, data collection, map, or external dependency.
- [x] Reduced-motion, compact, no-JavaScript, missing-media, omitted-collection, failed-map, unavailable-workflow, and bilingual constraints are documented.
- [ ] Named owners must approve brand, contacts, emergency safety, content, roster/taxonomy, appointment/privacy operations, and professional Amharic meaning.
- [x] Order 9 performed complete 320/360/tablet/1280/1440, mixed-script, long-content, unavailable-translation, and 200%/400% CSS-pixel reflow-equivalent refinement across all pages and state boards; see the [Order 9 record](../responsive/responsive-bilingual-refinement.md).
- [ ] Orders 10–11 must validate real navigation/state continuity, keyboard, screen-reader, forced-colors, touch, dialer safeguards, offline/no-JS, low-end device, and reduced-motion behavior.

Rendered screenshots evidence visible geometry only. They do not prove human comprehension, assistive-technology output, touch ergonomics, device/browser compatibility, language quality, operational correctness, or publication readiness.
