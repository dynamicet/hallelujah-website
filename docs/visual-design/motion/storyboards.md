# Order 3 Critical-Experience Motion Storyboards

**Prepared:** 12 September 2026  
**Status:** Non-public prototype specification; timing, comprehension, and device behavior remain unvalidated  
**Companion:** [Motion and storytelling direction](motion-and-storytelling.md)

## How to read the boards

Each board describes a state sequence, not a video timeline. A visitor may enter at any frame by deep link, reload, browser history, validation return, or restored session. Every frame therefore has to remain complete and understandable without earlier animation.

The `T+` values show maximum visual timing after a valid user or system event. They are not hospital response-time promises. “Reduced” always includes no JavaScript: content and state are placed directly in their final positions.

| Column | Meaning |
| --- | --- |
| Frame | Stable interface state and source sections. |
| Standard | Optional visible transition within the page's intensity ceiling. |
| Reduced | Equivalent with travel, scale, rotation, stagger, and smooth scroll removed. |
| Accessibility/state | Focus, status, history, and failure behavior that animation cannot change. |

## SB1 — Home orientation to essential task

**Trace:** `F1`; `H0`–`H3`; `G-001`–`G-002`, `H-001`–`H-005`, `E-001`  
**Emotional goal:** orient quickly, then make the visitor feel in control of a small set of distinct routes.  
**Intensity:** Level 2 ceiling; Emergency remains Level 0.

| Frame | Standard | Reduced | Accessibility/state |
| --- | --- | --- | --- |
| 1. Usable first paint (`H0`, `H1`) | Shell, H1, summary, routine actions, and separate Emergency are already visible and actionable. No fade from blank. | Identical. | Skip link and H1 lead the reading order; no content waits for a font, image, or script. |
| 2. Orientation (`H1`, T+0–240 ms) | The already-sized short ochre rule grows from 60% to full length after content paint. | Final rule is present immediately. | Decorative rule is ignored by assistive technology and carries no meaning alone. |
| 3. Task group (`H2`, T+0–370 ms) | Up to six routine task actions settle 8 px with 30 ms intervals. Emergency does not move. On compact views only the first four participate. | All actions remain in their final positions. | Targets work before the sequence. Labels and DOM order do not change; no announcement fires. |
| 4. Choice | A valid click/key activation gives immediate pressed/focus feedback and navigates with no exit animation. | Identical, with direct color/border state. | Browser Back restores useful Home position where supported; route activation is never on pointer-down. |
| 5. Search path (`H3`) | Empty validation or submission status appears directly. No field or result animation runs on Home. | Identical. | GET query and Back/Forward behavior remain primary; no unapproved logging or urgent inference. |

**Fail-safe:** on slow hardware, Save-Data, restored navigation, or any initialization fault, skip frames 2–3. The first paint remains the finished page.

## SB2 — Emergency choice and text-first arrival

**Trace:** `F2`; `E0`–`E8`; `G-003`–`G-007`, `E-001`–`E-005`, `C-001`–`C-003`  
**Emotional goal:** remove ambiguity and avoid adding urgency through visual movement.  
**Intensity:** Level 0.

| Frame | Standard | Reduced | Accessibility/state |
| --- | --- | --- | --- |
| 1. Immediate page (`E0`, `E1`) | H1, approved route distinction, purposes, visible numbers, and explicit call links appear at first paint. No entrance treatment. | Identical. | Route distinction precedes or is inside the first call group; all content works without CSS/JS/media. |
| 2. Read route | No pulse, bounce, glow loop, count-down, auto-focus, or auto-scroll. | Identical. | Screen-reader order matches the single-column visual order. Initial warnings are not assertive live regions. |
| 3. Activate one call | Completed click/tap/Enter activates only the labeled link; immediate color/border feedback only. | Identical. | Never activate on page load, focus, `pointerdown`, `touchstart`, or surrounding card. Native dialer retains final call control. |
| 4. Return/unsupported dialer | Purpose and number remain in the same place; truthful fallback appears directly if detectable. | Identical. | The website does not announce that a call connected. Manual selection/copy remains possible. |
| 5. Arrival (`E5`, `E6`) | Entrance, landmark, transport, and access text remain static. Local Copy feedback may appear without moving content. | Identical. | Text route is the complete route and remains useful offline/no-JS. |
| 6. Optional map (`E7`) | Only explicit approved activation creates a stable reserved region and local progress; no page slide. | Identical, with static progress text. | Provider failure leaves `E5`/`E6` intact and returns focus to a useful retry/exit. |

**Fail-safe:** missing route, number, purpose, entrance, or reviewed safety copy blocks publication; animation is never used to soften or replace the block.

## SB3 — Appointment request, validation, and authoritative receipt

**Trace:** `F3`–`F4`; `A1`–`A7`; `A-001`–`A-007`, `G-005`, `G-011`–`G-012`  
**Emotional goal:** set a truthful expectation, protect entered work, and distinguish “received” from “booked.”  
**Intensity:** Level 1.

| Frame | Standard | Reduced | Accessibility/state |
| --- | --- | --- | --- |
| 1. Expectation/safety (`A1`, `A2`) | Request-not-booking explanation and Emergency warning are static at first paint. | Identical. | Warning precedes personal-data fields; no animated disclosure or dismissal. |
| 2. Care-route choice (`A4`) | Selecting Doctor or Service reveals only the matching selector using opacity + 4 px in 180 ms. “Not sure” removes both directly after state change. | Matching group appears/disappears instantly. | `aria`/DOM state changes before presentation; focus stays on the chosen radio unless user action requires otherwise. |
| 3. Invalid submit (`A3`, `A4`) | Error summary and inline messages appear directly; no shake or smooth-scroll reliance. | Identical. | Focus moves to the error-summary heading; links focus exact fields; valid data is retained. |
| 4. Valid submit (`A6`, T+0) | Button becomes busy immediately; layout is fixed. After about 300 ms, local progress text appears if still pending. | Identical; spinner, if any, is static or omitted. | One intent identity; repeated activation is blocked; busy status is announced once. |
| 5a. Authoritative accepted | Form region is replaced in place. Received heading/reference use one 150 ms opacity transition. | Confirmation appears instantly. | Focus moves to heading; live status announces once; copy repeats “not a confirmed appointment.” |
| 5b. Known rejection | Specific error and safe retry appear directly. | Identical. | Same intent is reused; retained data and staffed fallback are explicit. |
| 5c. Timeout/offline/unknown | Reconciling state appears directly, with no success color or check icon. | Identical. | Do not invite a fresh request until reconciliation proves it was not created. |
| 5d. Message-delivery failure after receipt | Same reference remains; delivery warning replaces only channel status. | Identical. | No submit/retry request action; failure is not described as a failed appointment request. |

**Fail-safe:** prototype fields never submit or collect personal data. Simulated state timing must be visibly labeled and never presented as a hospital SLA.

## SB4 — Doctor/service discovery and governed handoff

**Trace:** `C1`–`C7`; `D1`–`D6`, `P1`–`P7`, `S1`–`S7`, `V1`–`V9`; `D-001`–`D-003`, `V-001`–`V-003`  
**Emotional goal:** make refinement feel controlled while keeping records stable and trustworthy.  
**Intensity:** Level 1.

| Frame | Standard | Reduced | Accessibility/state |
| --- | --- | --- | --- |
| 1. Directory first paint | Orientation, filters, count, and current approved records render in final positions. No card entrance sequence. | Identical. | GET/native baseline and canonical links work before JS; names never truncate. |
| 2. Refine (`D2`/`S3`) | Pressed/focus feedback is immediate. A mobile filter disclosure may use opacity + 8 px within 200 ms. | Filter content appears directly. | `aria-expanded` updates first; focus remains on initiator; active criteria persist in safe URL state. |
| 3. Results update (`D3`/`S4`) | Count may receive a 150 ms color emphasis; records replace directly with reserved structure. | Direct count and record replacement. | Announce result count; do not focus the first record or animate the grid. |
| 4a. No match/failure/offline | Recovery state replaces results directly. | Identical. | Keep query/filters, explain what happened, and expose governed fallback routes. |
| 4b. Retired/duplicate record | Honest unavailable/canonical state appears directly. | Identical. | No stale profile appears current; redirect only under approved canonical mapping. |
| 5. Open record | Navigation starts immediately; no card flight or exit fade. | Identical. | Browser Back restores filters/paging/scroll where supported. |
| 6. Related record/appointment handoff (`P5`, `V5`) | Destination heading may receive a 150 ms border-color emphasis once visible. | Final focus/border state appears directly. | Stable public ID carries context; no schedule/live availability is inferred or put into free text. |

**Fail-safe:** if an approved relationship, canonical ID, roster, taxonomy, or current status is unavailable, omit or show the governed unavailable state; motion cannot imply continuity.

## SB5 — Site search and urgent-term boundary

**Trace:** `PA3`–`PA6`; `SR1`–`SR7`; `H-005`, `S-005`, `SEARCH-01`–`SEARCH-02`  
**Emotional goal:** keep a potentially anxious visitor grounded in their exact query while drawing a hard boundary around urgent guidance.  
**Intensity:** Level 1, with `SR2` at Level 0.

| Frame | Standard | Reduced | Accessibility/state |
| --- | --- | --- | --- |
| 1. Search submit (`SR1`) | Immediate control feedback; no page-exit animation. | Identical. | Query uses bounded GET behavior; no PII is copied to unapproved analytics/logs. |
| 2. Urgent-term match (`SR2`) | Governed urgent guidance appears in final position before ordinary results with no reveal. | Identical. | It does not diagnose, reinterpret silently, or estimate urgency; correct language parity is a release gate. |
| 3. Filter/count (`SR3`, `SR4`) | Count color emphasis ≤150 ms; results replace directly. | Direct update. | Focus stays on control; result count is announced. |
| 4. Suggested correction | Original query and explicit suggestion are static; accepting it is a separate action. | Identical. | No silent correction of clinically meaningful wording. |
| 5. Zero/failure/offline (`SR6`, `SR7`) | State appears directly; no empty-grid dissolve. | Identical. | Preserve query; offer task routes and only approved staffed fallback. |
| 6. Open canonical result | Navigate immediately. | Identical. | Back restores the exact safe query/filter/page state. |

**Fail-safe:** if governed urgent terms, index freshness, privacy behavior, or language equivalence are not approved, use the explicit unavailable path; do not add animation as reassurance.

## SB6 — Text-first arrival and optional map

**Trace:** `PA2`; `LC1`–`LC7`; `C-001`–`C-003`, `G-007`–`G-009`, `S-005`  
**Emotional goal:** help a first-time visitor build a clear mental route without dependency on imagery or a map.  
**Intensity:** Level 1.

| Frame | Standard | Reduced | Accessibility/state |
| --- | --- | --- | --- |
| 1. Place and purpose (`LC1`, `LC2`) | Identity, purpose-labeled calls, and status render statically. | Identical. | Temporary closure/relocation/hours are words and structure, never motion/color alone. |
| 2. Entrance and route (`LC3`, `LC5`) | Static ordered steps and landmarks; no route-drawing animation. | Identical. | Text remains selectable, printable, translatable, and useful without media/JS. |
| 3. Copy | Local status appears in reserved space with optional opacity ≤150 ms. | Direct status. | Announce success/failure; retain visible source text; no claim that a call/map worked. |
| 4. Map idle (`LC6`) | No provider request or ambient map movement. | Identical. | Launcher explains external dependency before activation where required. |
| 5. Map load/failure | Explicit activation reserves the map region and shows local progress; provider result replaces it without moving core content. | Same with direct state changes. | Failure retains text directions and a useful retry/exit; focus is managed. |

**Fail-safe:** unverified address, entrance, landmark, accessibility, hours, provider, coordinates, or privacy flow remains blocked/withheld.

## SB7 — Patient visit stages

**Trace:** `PA1`, `PA7`; `H6`, `PI1`–`PI7`; `P-001`–`P-002`, `G-015`–`G-016`  
**Emotional goal:** replace visit uncertainty with a plain sequence while being honest about missing guidance.  
**Intensity:** Level 2 ceiling.

| Frame | Standard | Reduced | Accessibility/state |
| --- | --- | --- | --- |
| 1. Orientation (`PI1`) | Content is visible; one short orientation rule completes in 240 ms. | Final rule is visible immediately. | One H1 and plain introductory text establish scope. |
| 2. Approved stages (`PI2`–`PI4`) | Up to three static stage markers may change boundary-to-primary color at 30 ms intervals; text does not move. | Final marker colors appear directly. | Source/DOM order is Before, During, After; empty stages are omitted, not animated placeholders. |
| 3. Open guide | Navigate immediately or use an ordinary disclosure if specified. | Identical/direct disclosure. | Deep links work; guide heading receives correct focus. |
| 4. Missing/expired guide (`PI6`) | Honest unavailable state appears directly. | Identical. | Offer canonical staffed/task fallback; no false completeness or generic medical advice. |
| 5. Print/download | Native print or approved file action receives ordinary feedback only. | Identical. | Accessible HTML stays primary; file type/size and failure are explicit. |

**Fail-safe:** when fewer than two approved stages exist, omit the marker sequence and present the useful content/support directly.

## SB8 — Institutional story to evidence to care

**Trace:** `I1`–`I3`; `AB1`–`AB9`; `H-004`, `I-001`–`I-003`, `INST-01`–`INST-03`  
**Emotional goal:** create trust through source visibility and a return to patient tasks, not spectacle.  
**Intensity:** Level 2 ceiling.

| Frame | Standard | Reduced | Accessibility/state |
| --- | --- | --- | --- |
| 1. Orientation (`AB1`) | All content is readable; one orientation rule completes in 240 ms. | Final rule is present immediately. | No hero claim or rights-dependent image blocks the introduction. |
| 2. Story/evidence path (`AB2`, `AB4`, `AB8`) | An already-sized short evidence rule shifts boundary-to-primary over 300 ms. Facts remain static. | Final static state appears directly. | Narrative, fact, source, owner, review, and expiry remain explicit; rule has no independent meaning. |
| 3. Leadership/relationships (`AB5`, `AB6`) | No list stagger, portrait reveal, logo wall, or carousel. | Identical. | Only approved current records render; meanings are written, not implied by logos. |
| 4. Asset unavailable (`AB7`) | Reserved geometry collapses only when source rules allow; no repeated fade/retry. | Identical. | Text remains complete; rights/alt/consent failure cannot hide facts. |
| 5. Return to care (`AB9`) | Immediate button/link feedback and navigation; no exit scene. | Identical. | Care/contact routes regain priority; Back behavior remains conventional. |

**Fail-safe:** expired or unsupported claims, leaders, relationships, or images are removed or honestly unavailable. No animation preserves the appearance of stale authority.

## SB9 — English/Amharic context continuity

**Trace:** `F5`, `C7`, `PA7`, `I7`; `S-006`–`S-008`, `G-003`, `G-010`–`G-011`, `G-016`  
**Emotional goal:** make language change predictable without suggesting equivalence that has not been approved.  
**Intensity:** inherits page ceiling; language state itself is Level 0/1.

| Frame | Standard | Reduced | Accessibility/state |
| --- | --- | --- | --- |
| 1. Activate named language | Immediate pressed state; equivalent route/state replaces directly with no page crossfade. | Identical. | Language names are visible; route, stable record IDs, safe query/filter state, and `lang` metadata are preserved. |
| 2a. Equivalent exists | Content reflows naturally; no animation measures old/new word width. | Identical. | Both languages remain LTR; 35% expansion and long content do not truncate or reorder focus. |
| 2b. Equivalent missing | In-place explanation appears directly with available translated task routes. | Identical. | No silent redirect Home and no machine-generated consequential copy presented as reviewed. |
| 3. Form has safe equivalent fields | Values remain mapped by stable IDs; field positions may reflow without transition. | Identical. | No values in URL; labels/consent meanings must be equivalent. |
| 4. Form meaning is not equivalent | Warning appears directly before any reset; user can cancel and stay. | Identical. | Emergency navigation is never trapped by a data-loss warning. |

**Fail-safe:** a font swap, missing glyph, delayed translation, or route mismatch cannot replay a page sequence or leave the interface between languages.

## Cross-storyboard review matrix

| Review question | SB1 | SB2 | SB3 | SB4 | SB5 | SB6 | SB7 | SB8 | SB9 |
| --- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Essential content visible before enhancement | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Reduced/no-JS equivalent documented | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Focus/status behavior explicit | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Failure/unavailable path retained | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| No live data/contact/third party implied | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Existing section/flow order preserved | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

## Storyboard acceptance review

- [ ] Every frame can be entered directly and remains understandable without prior animation.
- [ ] Standard and reduced columns communicate the same content, state, and next action.
- [ ] Emergency and urgent guidance never animate into view.
- [ ] Motion never activates or delays navigation, calls, submission, maps, or language switching.
- [ ] Appointment received motion occurs only after authoritative acknowledgement.
- [ ] Filter/search result grids remain stable and do not re-enter as a decorative sequence.
- [ ] Arrival and institutional stories remain text/source-led and useful without assets.
- [ ] Back/Forward, deep-link, restored-page, offline, and no-JavaScript paths skip expressive entry safely.
- [ ] English/Amharic reflow does not depend on measured text animation or imply unreviewed equivalence.
- [ ] Timing and comfort claims remain open until the named Order 11 browser/device tests are executed.
