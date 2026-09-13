# Order 3 Motion and Storytelling Direction

**Prepared:** 12 September 2026  
**Status:** Accepted working direction for non-public prototypes; final tokens and validation remain in Orders 4, 9, and 11  
**Extends:** [Interaction and Motion](../../design-system/interaction-and-motion.md)  
**Visual basis:** [Direction A — Calm Wayfinding](../direction/visual-directions.md#3-direction-a--calm-wayfinding-recommended)

> **Production supersession — 14 September 2026:** This document remains the truthful Order 3 prototype direction and evidence basis. The client-directed [High-End Motion and Interactive-Media Amendment](high-end-motion-and-interactive-media-amendment.md) supersedes its Level 2 maximum, 300 ms expressive ceiling, no-library rule, and blanket cinematic/background-media exclusions for production planning. Its content-first, stable-context, immediate-navigation, truthful-state, and reduced-motion protections remain binding.

## 1. Role of this layer

The existing interaction document is the functional baseline: controls respond, focus moves correctly, progress is announced, failure preserves context, and reduced motion removes travel. This document adds only the expressive decisions needed to make Calm Wayfinding feel coherent across pages.

The expressive layer has three jobs:

1. **Orient:** show a short, calm relationship between a page heading and the task or section that follows.
2. **Connect:** preserve a visible sense of context when a user filters, discloses, changes language, or follows a governed doctor/service relationship.
3. **Reassure:** make validation, progress, recovery, and authoritative acknowledgement feel deliberate without suggesting a clinical or operational promise.

Motion is progressive enhancement. Semantic HTML, content order, visibility, navigation, form behavior, status, and recovery must be complete before it is applied.

## 2. Emotional progression

| Visitor moment | Intended feeling | Static design carrier | Permitted motion contribution | Prohibited implication |
| --- | --- | --- | --- | --- |
| Arrive | “I can quickly tell where I am.” | H1, plain-language summary, stable shell | One short orientation cue after content paint | Grand reveal, promotion, or delayed access |
| Choose | “The important routes are distinct.” | Task order, labels, spacing, emergency separation | Immediate pressed/focus feedback; optional short task-group settling | Pulsing, bouncing, or visual pressure |
| Understand | “This information has a clear sequence.” | Headings, numbered/text stages, bounded measure | Small section marker transition when directly entering a section | Scroll-controlled storytelling or hidden text |
| Act | “The system noticed my action.” | Native control state, nearby status, stable dimensions | Fast color/border change and local progress | False completion or automatic activation |
| Recover | “My work is safe and I know the next step.” | Specific error, preserved input, focused summary, fallback | Direct state replacement; no shake or sweeping scroll | Blame, alarm, repeated movement, or data loss |
| Confirm | “The request was received, but is not booked.” | Authoritative reference, explicit wording, next step | Single quiet status arrival after acknowledgement | Celebration, confetti, booking assurance, or response-time guarantee |

The emotional arc is not a timed narrative. Each row must work independently for a visitor who enters on a deep link, reloads, returns with Back, uses no JavaScript, or changes language.

## 3. Intensity scale

| Level | Name | Allowed behavior | Typical use |
| ---: | --- | --- | --- |
| 0 | Immediate/static | Content is present with no entrance movement. Native focus/pressed feedback and explicitly initiated local progress remain. | Emergency and urgent guidance; errors; privacy/consent; unavailable/expired states. |
| 1 | Functional continuity | 80–200 ms state changes; at most 4–8 px travel for an opened menu/disclosure; no section reveal. | Forms, directories, search, filters, details, contact actions. |
| 2 | Restrained orientation | Level 1 plus one optional 200–300 ms orientation cue per view and one short, capped group sequence. Content is visible without it. | Home orientation, visit stages, approved institutional narrative. |

Level 3/cinematic motion is deliberately undefined and prohibited. Page intensity is a ceiling, not a target: any section can and should fall back to a lower level when content, safety, performance, viewport, input method, or user preference warrants it.

## 4. Page and section intensity matrix

| Page | Ceiling | Eligible sections | Direction | Permanent static/excluded sections |
| --- | ---: | --- | --- | --- |
| Home | 2 | `H1` may use the orientation rule; `H2` may use one capped task-group sequence; `H6` may mark visit-stage progression. | Orient, then expose task paths without promotion. | Emergency action in `H0`/`H1`; search status `H3`; failure/empty states; governed content in `H4`/`H5`/`H7`/`H8`. |
| Emergency | 0 | Only native focus/pressed feedback, copy confirmation, and `E7` progress after explicit map activation. | Stable, immediate, and sober at every width. | `E0`–`E6` and `E8`; especially route distinction and call choices in `E1`. |
| Doctor Directory | 1 | `D2` disclosure/menu continuity; result-count state in `D3`; optional opacity-only image load in `D4`. | Make filtering legible without animating the result grid. | Initial results, no-match, failure, offline, retired/duplicate, and staffed recovery. |
| Doctor Profile | 1 | Focus/pressed states; short accordion/disclosure only if later specified; optional image opacity. | Preserve identity and canonical handoff. | `P1` identity/action and all unavailable/expired/schedule-boundary messages. |
| Services Directory | 1 | `S3` filter continuity and `S4` result count. | Clarify search/taxonomy response. | Urgent exception `S2`, results grid `S5`, failure/recovery `S6`/`S7`. |
| Service Detail | 1 | Local disclosure and focus states only. | Keep service scope, practical facts, and relationship handoff steady. | Urgent exception `V2`, capabilities `V4`, unavailable claims, and all operational/review status. |
| Request an Appointment | 1 | Conditional field reveal in `A4`; local pending/outcome transition in `A6`. | Reassure through stable, explicit state changes. | Expectation `A1`, urgent warning `A2`, errors `A3`, privacy/consent `A5`, fallback `A7`. |
| Patient & Visitor Information | 2 | One orientation cue in `PI1`; optional short stage-marker sequence across approved `PI2`–`PI4`. | Support before/during/after wayfinding. | Missing stage, unavailable/expired guide, temporary operations, download failure, and `PI6`/`PI7` recovery. |
| Locations & Contact | 1 | Copy feedback; `LC6` user-initiated map progress; focus continuity. | Keep text-first arrival primary. | Place, phone, entrance, hours/status, and arrival facts in `LC1`–`LC5`; all temporary/unavailable states. |
| Search Results | 1 | Search/filter state and count updates. | Preserve query context and typed result stability. | Urgent guidance `SR2`, corrections, results, zero, failure/offline, expired records, and recovery. |
| About the Hospital | 2 | One `AB1` orientation cue; a simple evidence-path rule may connect approved `AB2`/`AB4`/`AB8` in source order. | Move from story to evidence to patient task. | Claims, figures, leadership, relationships, imagery-rights failure, unavailable translation, and review status text. No counters. |
| Careers | 1 | Filter/status feedback only if a later approved vacancy set needs it. | Keep lifecycle and privacy status plain. | Privacy `CR4`; no-role `CR5`; closed/stale `CR6`; support/review status; Apply remains gated. |

No section ID, source order, heading level, DOM order, or route is changed by this matrix.

## 5. Signature moments

### 5.1 Orientation rule

A 2 px warm-accent rule associated with a page or section heading may grow from 60% to 100% of its final short length while its opacity moves to full. The rule is already present at final dimensions so the transition causes no layout shift. It begins only after the heading and primary action are visible.

- Duration: 240 ms.
- Travel: none; transform is `scaleX(.6)` to `scaleX(1)` with the origin matching reading order.
- Use: once on `H1`, `PI1`, or `AB1`; never all three in one viewport.
- Reduced motion/no JavaScript: final rule appears immediately.
- Exclusions: Emergency, urgent guidance, alerts, dialogs, cards, statistics, and repeated list items.

This is the visual signature for Calm Wayfinding. It must not become a scroll-drawn line through the page.

### 5.2 Task-path settling

On Home only, up to six `H2` task actions may settle from 8 px below to their final position with 30 ms between items. All text and hit targets are present and actionable before the sequence begins. Emergency is excluded and remains visually fixed.

- Per item: 220 ms; total additional stagger delay no more than 150 ms.
- Trigger: first meaningful render only, after the heading and actions are already visible; never every time the user scrolls past.
- Compact/mobile: maximum four visible items in the sequence; remaining items appear directly.
- Reduced motion, data saver, slow device, no JavaScript, restored page, Back/Forward: no sequence.

### 5.3 Governed relationship handoff

When a visitor follows an approved doctor-to-service, service-to-doctor, or record-to-appointment link, the destination receives focus or scroll restoration through platform/router behavior. The destination heading may use a 150 ms border-color emphasis after it is visible. There is no route-exit animation, shared-element morph, card flight, or navigation delay.

Stable public IDs—not visual animation—preserve the relationship.

### 5.4 Authoritative acknowledgement

After the server has authoritatively accepted an appointment request, the `A6` status region replaces the form without changing its horizontal position. The heading and reference appear together with a 150 ms opacity transition. Focus moves to the heading, and the status is announced once.

Timeout, unknown outcome, rejection, or confirmation-delivery failure never uses this treatment. Those states appear directly with their distinct wording and safe next action.

### 5.5 Evidence path

On About, a short static vertical rule may connect the approved story, fact source, and review metadata blocks. When `AB1` is first displayed, the already-sized rule can change from boundary to primary color over 300 ms. Individual facts never count up, pop, or animate in sequence. If any source or claim is unavailable, the line remains neutral and the honest state is shown.

## 6. Section and route transition rules

### Page entry

- Render the shell, H1, safety information, and first task/action in their final positions.
- Do not set content to `opacity: 0` in base CSS. Enhancement may use a short transition only after the browser has painted readable content.
- Deep links and restored pages skip orientation and stagger treatments.

### In-page navigation

- Hash links use native instant scrolling by default and account for sticky-header offset.
- Optional smooth scrolling is excluded because reduced motion, focus placement, and predictable arrival are more important than spectacle.
- The target heading receives focus when the interaction pattern requires it; visual emphasis may change border/color for 150 ms without moving the heading.

### Route navigation

- Activate navigation immediately after a valid click/keyboard event.
- Do not animate the current page out or wait for a transition promise.
- The destination may apply its eligible entry treatment only when it is a fresh navigation, not Back/Forward restoration.
- Browser history restores query/filter state, language, and useful scroll position where supported.

### Async and conditional content

- Reserve final space when dimensions are predictable.
- A conditional form group may enter using opacity plus 4 px movement in 180 ms; the reduced equivalent appears instantly. Focus does not move unless validation or the action explicitly requires it.
- Directory and search results do not animate as a grid. Keep the current set stable, update the result count, then replace records directly.
- Temporary operational alerts appear in normal document flow without slide-down, repeated push, or auto-dismiss.

## 7. Token candidates for Order 4

These extend rather than override the functional baseline. Order 4 must reconcile final naming in one token source.

### Duration

| Candidate token | Value | Use |
| --- | ---: | --- |
| `motion.duration.instant` | 0 ms | Reduced motion, safety and corrective state changes. |
| `motion.duration.feedback` | 80 ms | Pressed feedback where a color/border change benefits from a tiny transition. |
| `motion.duration.fast` | 150 ms | Focus-adjacent color, exit, status opacity, heading emphasis. |
| `motion.duration.standard` | 200 ms | Menu, disclosure, ordinary state continuity. |
| `motion.duration.orient` | 240 ms | Orientation rule and limited page-level wayfinding cue. |
| `motion.duration.slow` | 300 ms | Evidence-path color transition; absolute ceiling for this order. |

### Delay and stagger

| Candidate token | Value | Rule |
| --- | ---: | --- |
| `motion.delay.none` | 0 ms | Default. |
| `motion.delay.step` | 30 ms | Home task settling only. |
| `motion.delay.max-sequence` | 150 ms | Last item may not begin later than this. |

Stagger no more than six items. Never stagger emergency choices, form fields, search results, directory cards, errors, warnings, status messages, or screen-reader announcements.

### Distance, scale, and rotation

| Candidate token | Value | Rule |
| --- | ---: | --- |
| `motion.distance.micro` | 4 px | Conditional field/disclosure continuity. |
| `motion.distance.short` | 8 px | Home task settling and mobile menu; never critical copy. |
| `motion.scale.pressed` | 0.99 | Optional pointer press on non-emergency buttons; omit if text rendering blurs. |
| `motion.rotate.disclosure` | 90deg | Chevron only; the label and expanded state remain explicit. |

No page content travels more than 12 px. Scale is not used for content entrance, emergency controls, form submit, errors, or status.

### Easing

| Candidate token | CSS value | Use |
| --- | --- | --- |
| `motion.ease.enter` | `cubic-bezier(.2, .8, .2, 1)` | Small content/state entry. |
| `motion.ease.exit` | `cubic-bezier(.4, 0, 1, 1)` | Faster state exit. |
| `motion.ease.state` | `cubic-bezier(.4, 0, .2, 1)` | Color/border/opacity. |

Linear easing, spring overshoot, bounce, elastic, back-easing, and physics-based motion are excluded.

### Sequencing

1. HTML and core styles expose all essential content.
2. Focus, accessible name, state, and action semantics become ready.
3. The browser paints the usable page.
4. If the page is eligible, fresh, visible, not constrained, and motion is allowed, one orientation treatment may run.
5. Any task sequence starts with the same paint and ends within 370 ms of its first item.

If steps 1–3 are not complete, steps 4–5 do not run.

## 8. Functional micro-interaction register

| Interaction | Standard | Reduced | Focus/status rule |
| --- | --- | --- | --- |
| Link/button hover | 150 ms color/border change; no movement required. | Same or instant. | Hover never supplies unique meaning. |
| Non-emergency button press | Immediate color; optional 0.99 scale for ≤80 ms. | Color only. | Activation follows native completed-click/keyboard semantics. |
| Emergency/call press | Immediate color/border only. | Same. | No scale, pulse, hold, custom confirmation, or surrounding-card activation. |
| Focus | 3 px focus outline appears with no delay. | Same. | Focus must never animate from absent or move spatially. |
| Mobile menu | Opacity + 8 px translate, 200 ms enter/150 ms exit. | Instant or opacity ≤100 ms. | Focus moves into menu and returns to trigger on close. |
| Accordion/disclosure | Content continuity ≤200 ms; chevron rotates. | Content appears instantly; chevron changes directly. | `aria-expanded` changes before visual transition. |
| Conditional form group | Opacity + 4 px, 180 ms. | Instant. | Preserve DOM order; do not announce the whole group unless needed. |
| Inline validation | Direct border/message change. | Same. | No shake; error relation is programmatic. |
| Error summary | Appears directly; browser-native target movement. | Same. | Focus summary; no smooth-scroll dependency. |
| Submit pending | Immediate disabled/busy state; local progress after about 300 ms. | Same. | Announce once; retain layout and one intent identity. |
| Success/received | 150 ms opacity after authoritative acknowledgement only. | Instant. | Focus and announce confirmation heading once. |
| Result update | Direct record replacement; 150 ms count color emphasis allowed. | Direct replacement. | Keep focus on initiating control; announce count. |
| Copy action | Text status appears for a sufficient reading interval; no toast flight. | Same. | Announce local success/failure; never claim call connection. |
| Image arrival | Reserved box; optional opacity 150 ms. | Instant. | Alt purpose and content do not depend on image. |
| Optional map load | Stable reserved area after explicit activation; local progress. | Same, no spatial transition. | Text directions remain before and during every map state. |
| Language switch | Immediate equivalent route/state swap. | Same. | Preserve route/safe IDs; explain unavailable equivalent in place. |

## 9. Visual storytelling opportunities and exclusions

| Story opportunity | Source sections | Treatment | Required evidence before polished use |
| --- | --- | --- | --- |
| Essential-task wayfinding | `H1`–`H2` | Orientation rule plus capped task settling. | Task recognition and reduced-motion comparison; labels approved for the fixture. |
| Visit preparation | `H6`, `PI1`–`PI5` | Static before/during/after markers; one optional initial marker sequence. | Approved useful stage content and language review. |
| Arrival | `H7`, `E5`–`E7`, `LC3`–`LC6` | Text route first; static step line; local copy/map feedback only. | On-site-tested route, access facts, contact approval, map decision. |
| Care relationships | `D4`, `P5`, `S5`, `V5`, appointment handoff | Stable IDs, destination heading emphasis; no card flight. | Approved roster/taxonomy/relationship map. |
| Form progress and recovery | `A3`–`A7` | Stable state replacement and focus path; no page-step illusion. | Approved fields/privacy/workflow and simulated acknowledgement contract. |
| Institutional evidence | `AB2`, `AB4`, `AB8`, `AB9` | Quiet evidence path from narrative to dated source to care return. | Approved claims, source/owner/expiry, rights, language. |
| Vacancy lifecycle | `CR2`–`CR8` | Status and expiry communicated directly; no celebratory Apply treatment. | Phase 2 HR/privacy/provider evidence. |

Permanently excluded: animated statistics, staff/logo carousels, before/after medical stories, procedure imagery, success celebrations, auto-advancing testimonials, simulated live availability, diagnostic branching, route maps that draw themselves, and any animation that claims clinical capability or institutional scale.

## 10. Reduced-motion equivalence

`prefers-reduced-motion: reduce` is the automatic baseline. A prototype control may force reduced mode for review, but production must not require visitors to find a custom setting.

| Standard treatment | Reduced equivalent |
| --- | --- |
| Orientation rule grows to final length. | Final rule is present at first paint. |
| Home task actions settle/stagger. | Every action is present in final position at first paint. |
| Menu/disclosure translates. | Direct reveal; optional opacity no longer than 100 ms. |
| Conditional field moves 4 px. | Direct appearance in source order. |
| Chevron rotates. | Icon swaps or appears at final orientation immediately. |
| Status fades in. | Status appears instantly; announcement behavior is unchanged. |
| Destination heading receives brief border-color emphasis. | Final visible focus/border state appears directly. |
| Evidence path changes color. | Final static neutral/primary state appears directly. |

Reduced motion also removes parallax, smooth scrolling, scroll-linked progress, scale, background movement, animated gradients, video/GIF autoplay, and looping indicators. A spinner may be replaced by static text or a non-rotating progress mark; progress text and live-region behavior remain.

## 11. Mobile and constrained-device constraints

- At 320/360 px, no transform may create horizontal overflow or visually clip a 44 px target.
- Do not animate fixed/sticky regions, viewport height, safe-area insets, keyboard avoidance, or browser chrome assumptions.
- When the on-screen keyboard is open, skip page/section motion and prioritize stable field/error visibility.
- Limit a compact view to one page-level orientation treatment and at most four sequenced task actions.
- Skip expressive motion when Save-Data is enabled, the document is initially hidden, the page is restored from back-forward cache, or the device/browser cannot maintain the treatment cleanly.
- Touch feedback is driven by native activation, not hover emulation, `pointerdown` navigation, or delayed taps.
- No motion depends on a custom font or image completing. Font swap and image failure must not replay a sequence.

## 12. Performance limits

These limits refine the existing ≤1 MB initial transfer, ≤150 KB compressed first-party JavaScript, ≤50 initial request, LCP ≤2.5 s, INP ≤200 ms, and CLS ≤0.1 targets.

- No animation library is required or approved for the prototype direction; prefer CSS transitions, media queries, and platform behavior.
- Motion-specific code should remain a small local enhancement and must not increase the 150 KB JavaScript ceiling. An implementation proposal over 8 KB compressed requires explicit justification and comparison with CSS/no-library behavior.
- Motion starts after essential content paint and must never compete with the LCP element, input readiness, emergency content, or form controls.
- Animate only `transform`, `opacity`, and carefully scoped color/border changes. Never animate layout, large blur, shadow spread, filter, full-page gradient, SVG path length, or background position.
- At most two non-trivial elements animate concurrently; the Home task sequence counts as one grouped treatment.
- Pause/cancel non-essential motion when the document becomes hidden or the target is no longer relevant. Do not register page-wide scroll listeners for section reveals.
- Do not add compositor layers pre-emptively with persistent `will-change`; set it only for the brief transition if profiling proves useful, then remove it.
- Motion may not create a layout shift or an interaction delay. Any long task over 50 ms attributable to the treatment is a defect.
- Validate on the agreed low-end Android/constrained-network profile in Order 11. Desktop smoothness is not sufficient evidence.

## 13. Traceability and evidence plan

| Concern | Source | Order 3 decision | Later evidence |
| --- | --- | --- | --- |
| Immediate feedback and no motion-only meaning | `G-005`–`G-007`, `G-011`–`G-012` | Functional response is retained at Levels 0–2. | Keyboard, screen-reader, pointer, touch tests in Orders 5/11. |
| Reduced motion | `A-004`, `A-006`–`A-007`, `S-008`; interaction baseline | Every spatial treatment has a direct equivalent. | Full journey at OS reduced preference in Orders 9–11. |
| Bilingual continuity | `G-016`, `S-006`–`S-008`; `F5`, `C7`, `PA7`, `I7` | Motion never relies on word width or changes route/ID continuity. | English/Amharic/mixed-script fixtures in Order 9. |
| Emergency safety | `E-001`–`E-005`, `SAFE-01`–`SAFE-04`; `F2` | Emergency is Level 0 and call activation stays native/explicit. | Comprehension and accidental-activation tests in Orders 6/11. |
| Appointment truth and recovery | `A-001`–`A-007`; `F3`–`F4` | Only acknowledgement gets the received treatment; other states are direct. | Simulated server-state, duplicate, timeout, focus, and announcement tests. |
| Discovery continuity | `D-001`–`D-003`, `V-001`–`V-003`; care flows | Results never depend on entrance motion; stable IDs carry handoffs. | Filter/paging/Back/retired-record tests in Orders 7/10/11. |
| Arrival and third parties | `C-001`–`C-003`, `S-005`; `PA2` | Text remains primary; map motion begins only after explicit approved action. | No-JS/offline/provider-failure and privacy evidence in Orders 8/11. |
| Claims and rights | `I-001`–`I-003`, `INST-01`–`INST-03`, `BRAND-01` | Storytelling is source-led; no animated claims/counters/assets. | Content/source/expiry/rights review before polished use. |
| Performance | Existing interaction budget; `DEL-01` | CSS-first, no scroll observer system, no pre-LCP animation. | Bundle, request, Web Vitals, low-end Android profiling in Order 11. |

## 14. Acceptance checklist

- [ ] Static HTML communicates every task, safety boundary, state, and next action.
- [ ] No element is hidden while waiting for JavaScript, a viewport observer, font, image, or timeline.
- [ ] Emergency and urgent guidance are immediate and motion-independent.
- [ ] No navigation waits for an exit transition.
- [ ] The page-level intensity ceiling and section exclusions are followed.
- [ ] Standard motion finishes within 300 ms per treatment and uses no more than 12 px travel.
- [ ] Sequences contain no more than six items and 150 ms total delay.
- [ ] Reduced motion removes travel, scale, rotation, drawing, stagger, and smooth scrolling while preserving feedback.
- [ ] Focus, reading order, status announcements, error correction, and browser history are unchanged by animation.
- [ ] Motion causes no layout shift, horizontal overflow, duplicate action, or loss of entered state.
- [ ] No live contact, submission, map, analytics, personal-data, or unapproved content behavior is introduced.
- [ ] Order 11 records real browser/device methods and evidence rather than treating these specifications as a passed test.
