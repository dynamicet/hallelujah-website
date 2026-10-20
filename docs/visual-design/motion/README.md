# Order 3 — Motion, Storytelling, and Experience Direction

**Prepared:** 12 September 2026  
**Status:** Complete historical prototype evidence; production planning is superseded by the 14 September 2026 amendment
**Working visual direction:** Direction A — Calm Wayfinding  
**Scope:** Non-public motion and storytelling studies only

## Production amendment

The client-directed [High-End Motion and Interactive-Media Amendment](high-end-motion-and-interactive-media-amendment.md) preserves this package as truthful evidence of the restrained prototype that was actually reviewed, while superseding its Level 2 maximum, 300 ms expressive ceiling, no-library rule, and blanket background-video exclusion for future production planning. Emergency, urgent guidance, consequential appointment states, errors, privacy/consent, unavailable/expired states, semantic HTML, immediate navigation, and reduced-motion equivalence remain protected.

## Outcome

Order 3 adds a restrained expressive layer to the existing functional interaction baseline. The layer uses short wayfinding cues, stable state transitions, and deliberate section orientation to help a visitor understand where they are, what changed, and what to do next. It does not add decorative scroll choreography, delay navigation, hide content before JavaScript, or make any task depend on animation.

The highest permitted page intensity is intentionally modest. Emergency is always static. Appointment, search, directories, contacts, and all failure states prioritize direct functional feedback. Home, patient-information, and approved institutional narrative may use one limited orientation moment after essential content is already present.

This decision closes `VD-17` for non-public prototype work. It does not close `BRAND-01`, accessibility or performance validation, hospital content approval, or any production/publication gate.

## Artifacts

- [Motion and storytelling direction](motion-and-storytelling.md) — emotional goals, intensity system, page/section treatments, tokens, signature moments, micro-interactions, reduced-motion equivalence, mobile and performance limits, traceability, and acceptance criteria.
- [Critical-experience storyboards](storyboards.md) — frame-by-frame standard and reduced-motion behavior for Home routing, Emergency, appointment request and recovery, care discovery, site search, arrival, patient guidance, institutional trust, and language continuity.
- [Interactive motion study](studies.html) — local, dependency-free comparison of standard and reduced treatments. All controls are inert demonstrations; the file makes no external requests and collects no data.
- [Rendered evidence](evidence/) — 1440 px standard/reduced captures plus 360 px standard and 320 px reduced captures. They evidence responsive layout and visible end states, not timing quality or completed human/device testing.

## Decision summary

| Decision | Order 3 position |
| --- | --- |
| Character | Calm, direct wayfinding: short rules, small vertical offsets, and state continuity. |
| Maximum intensity | Historical prototype: Level 2 of 3. Production amendment: authored Levels 3–4 are permitted only in eligible storytelling/media sections. |
| Emergency | Level 0: immediate and static except native focus/pressed feedback and optional-map progress after explicit activation. |
| Essential content | Present in HTML and visible before enhancement; never gated by an observer, timeline, image, font, or script. |
| Route changes | Navigation begins immediately. No exit animation, transition curtain, shared-element wait, or smooth-scroll dependency. |
| Stagger | Optional, maximum six items, 30 ms intervals, 150 ms total delay; never used on emergency choices, errors, results, or form fields. |
| Reduced motion | Removes travel, scale, rotation, drawing, stagger, and smooth scrolling; preserves text, focus, status, and direct color/border changes. |
| Implementation | Historical prototype used CSS/platform behavior. Production may evaluate a scoped motion runtime with license, security, bundle, cleanup, fallback, and no-library comparison evidence. |
| Performance | No motion work before LCP, no motion-caused CLS, and no increase to the existing 150 KB compressed first-party JavaScript limit. |

## Review sequence

1. Confirm the intensity matrix and the permanent Level 0 treatment for Emergency.
2. Compare each storyboard's standard and reduced columns; verify that both communicate the same state and next action.
3. Open the interactive study, switch motion modes, use Replay, and confirm that content remains readable and usable throughout.
4. Test the study at 320/360 px, keyboard-only, 200%/400% reflow, and with the operating-system reduced-motion preference.
5. Carry the approved token candidates and constraints into Order 4; carry component recipes into Order 5 and page choreography into Orders 6–8.

## Binding boundaries

- Emergency `E1`, appointment warning `A2`, service urgent exception `S2`/`V2`, and search urgent guidance `SR2` render immediately and do not animate into view.
- No call, form submission, map, Apply action, analytics event, remote font, image, or third party is activated by these studies.
- Controlled placeholders remain visibly non-public. No storyboard timing implies a real hospital response time, availability, clinical sequence, or confirmed booking.
- Motion cannot repair missing hierarchy or content. If the static page is unclear, correct the source structure through coordinated change control.
- No autoplay, pre-intent media request, scroll-jacking, mandatory pinned section, animated claim/counter, carousel, celebratory clinical state, pulsing emergency control, or uncontrolled infinite loop is allowed. Selected bounded depth and static-first user-controlled media follow the production amendment.
- Browser Back/Forward, keyboard focus, screen-reader order, no-JavaScript access, low-bandwidth access, and language continuity take precedence over visual continuity.

## Completion record

- [x] emotional goals and a three-level intensity model are defined;
- [x] all 12 page types have a page-level intensity and section treatment;
- [x] signature moments and explicit exclusions are documented;
- [x] section transitions and visual-storytelling opportunities preserve all 104 accepted section IDs and their order;
- [x] functional micro-interactions align with the existing interaction baseline;
- [x] duration, easing, distance, delay, stagger, and sequencing tokens are proposed for Order 4;
- [x] every spatial treatment has a no-travel reduced-motion equivalent;
- [x] mobile, low-end-device, no-JavaScript, and performance limits are explicit;
- [x] nine critical-experience storyboards cover normal, safety, error, recovery, and bilingual paths;
- [x] the interactive study contains no external dependency, live action, personal-data collection, or unapproved hospital fact;
- [x] Order 4 handoff inputs and later QA evidence needs are recorded.

Order 3 is complete as a prototype direction. Static screenshots do not validate animation timing, vestibular comfort, device performance, screen-reader behavior, or human comprehension; those checks remain required in Orders 9–11.

## Order 4 handoff — consumed

Order 4 promoted the accepted candidates from [motion and storytelling direction](motion-and-storytelling.md#7-token-candidates-for-order-4) into the [shared foundation source](../foundations/tokens.css), reconciled the functional token names, rendered English/Ethiopic and system-font specimens, and kept every Level 0 exclusion intact. Those sources remain the tested prototype baseline. Production inherits the content-first sequence and prohibition on inferred approval, but uses the amendment for expanded timing, media, and runtime decisions.

## Homepage logo entrance

The integrated [first-entry logo reveal](logo-reveal.md) documents the supplied artwork,
1.8-second choreography, session and accessibility behavior, and reproducible browser checks.
