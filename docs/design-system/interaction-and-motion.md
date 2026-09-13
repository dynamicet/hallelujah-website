# Interaction and Motion

**Status:** Functional baseline with Order 4 prototype tokens reconciled  
**Requirements:** G-005–G-007, G-011–G-012, G-016, A-004, A-006–A-007, S-008  
**Benchmark basis:** `BM-05`, `BM-06`, `BM-09`, `BM-10`, and `BM-13` in the [benchmark traceability register](../benchmarks/benchmark-traceability.md)

**Production amendment:** The client-directed [high-end motion and interactive-media direction](../visual-design/motion/high-end-motion-and-interactive-media-amendment.md) supersedes the earlier prototype-wide Level 2/300 ms ceiling for production planning. The functional rules below still govern controls and stable contexts.

The non-public prototype expression that extends this functional baseline is documented in [Order 3 Motion and Storytelling Direction](../visual-design/motion/motion-and-storytelling.md). Order 4 reconciles those candidates in the [prototype foundation specification](../visual-design/foundations/prototype-foundations.md) and [shared CSS token source](../visual-design/foundations/tokens.css). Orders 9–11 still own performed responsive, bilingual, motion, assistive-technology, and device validation; this baseline continues to govern whenever a later visual treatment differs.

## 1. Motion principle

Motion exists only to answer one of these questions:

1. What changed?
2. Where did this content come from or go?
3. Is the system working?
4. What should receive attention next?

If motion cannot answer one of them or deliver a deliberately art-directed storytelling moment, omit it. High-end design comes from choreography and restraint: use a small number of focal movements with quieter supporting interactions. Automatic rotation, scroll-jacking, indiscriminate reveal effects, bouncing actions, and uncontrolled ambient motion remain excluded.

## 2. Motion tokens

| Token | Value | Use |
| --- | ---: | --- |
| `motion.duration.instant` | 0 ms | Reduced motion and immediate state correction |
| `motion.duration.feedback` | 80 ms | Optional non-emergency pressed color/scale feedback |
| `motion.duration.fast` | 150 ms | Hover, focus-adjacent color, pressed feedback |
| `motion.duration.standard` | 200 ms | Disclosure, menu, inline status |
| `motion.duration.orient` | 240 ms | One eligible short orientation rule |
| `motion.duration.slow` | 300 ms | Evidence-path color change; functional/repeated-motion ceiling |
| `motion.duration.composed` | 500 ms | Selected section/media choreography; never functional feedback |
| `motion.duration.cinematic` | 800 ms | Default Level 3 decorative/media-layer sequence; may extend to 1200 ms with documented art direction and no delayed access |
| `motion.delay.step` | 30 ms | Home task settling only; total delay capped at 150 ms |
| `motion.distance.micro` | 4 px | Conditional field/disclosure continuity |
| `motion.distance.short` | 8 px | Home task settling or mobile menu only |
| `motion.ease.enter` | `cubic-bezier(.2, .8, .2, 1)` | Content becoming available |
| `motion.ease.exit` | `cubic-bezier(.4, 0, 1, 1)` | Content leaving; usually faster than entry |
| `motion.ease.state` | `cubic-bezier(.4, 0, .2, 1)` | Color/border/status changes |

- Animate opacity and transform when spatial motion is needed.
- Avoid width, height, top, left, or other layout-heavy animation. A disclosure may use a simple, tested height technique only if it does not delay access or cause jank.
- No essential or frequently repeated transition exceeds 300 ms. Composed/cinematic timing applies only to already-usable decorative or storytelling layers.
- A pressed state responds immediately; network activity then uses a separate loading state.

## 3. Approved interaction recipes

| Interaction | Standard behavior | Reduced-motion behavior |
| --- | --- | --- |
| Button hover/focus | 150 ms color/border change; focus outline appears without delay | Same or instant |
| Button press | Immediate color change; optional 1 px visual compression | Color change only |
| Mobile menu open | 200 ms fade/short translate with managed focus | Instant reveal/fade ≤100 ms |
| Mobile menu close | 150 ms exit; focus returns to trigger | Instant close |
| Accordion | Indicator rotates; content reveals in ≤200 ms | No rotation travel; content appears instantly |
| Filter result update | Count/status updates; no grid-wide entrance animation | Same, no motion |
| Inline validation | Message appears next to field; no shake | Instant message |
| Form submission | Immediate busy state, stable layout, announced status | Same |
| Success | Status icon/text appear once; no confetti or celebration loop | Instant appearance |
| Error summary | Focus moves to summary; no animated scroll requirement | Immediate focus and browser-native movement |
| Temporary alert | Appears in document flow without pushing content repeatedly | Instant appearance |
| Image loading | Reserved aspect ratio; subtle opacity only if useful | Instant image display |
| Selected section entry | One authored 250–500 ms composition; base content is already visible and usable | Final static composition |
| Cinematic media layer | One 500–1200 ms decorative sequence in an eligible section; no control or content waits | Poster/static art direction |
| Hero/institutional video | Static poster until a labeled Play control is activated; persistent Pause/Stop/Close as applicable | Poster first; foreground playback remains an explicit user choice |

## 4. Focus and keyboard behavior

- Use a persistent 3 px focus outline with at least a 2 px offset; do not remove native focus until an equally visible replacement exists.
- Focus order follows DOM and visual reading order. Positive `tabindex` is prohibited.
- Opening a modal menu/dialog places focus according to the chosen accessible pattern; closing restores the invoking control.
- After invalid form submission, focus moves to the error summary. After successful submission, focus moves to the confirmation heading.
- After filter/search updates, keep focus on the initiating control and announce the result count; do not jump focus into the results automatically.
- In-page links account for sticky-header height and place the target heading visibly below it.
- Escape closes dismissible overlays, autocomplete, and menus, but never clears entered input without a separate action.

## 5. Loading and latency

### Under approximately 300 ms

Avoid flashing a spinner. Preserve the current control and complete the state change when ready.

### Approximately 300 ms–2 s

Show a local loading state near the initiating control. Keep dimensions stable and announce progress once.

### Longer than approximately 2 s

Show plain-language progress, retain the user's context, and provide a cancel or safe fallback where the operation supports it. Do not invent a percentage.

### Failure

- Explain what failed in patient language, what data was preserved, and the next safe action.
- Keep the approved telephone or non-digital alternative visible for essential journeys.
- Never expose stack traces, internal codes as the only explanation, or personal data in the URL/logging message.
- A retry is explicit and protected from duplicate operational requests.

Skeleton screens are optional for repeated, predictable directory shapes. They must not imitate real content, shift the page, or replace a useful static fallback. Spinners require adjacent or programmatic text.

## 6. Reduced motion

Use the platform preference as a requirement, not an optional theme:

```text
prefers-reduced-motion: reduce
    → durations become 0–100 ms
    → spatial travel, scale, rotation, parallax, and smooth scrolling are removed
    → state changes and focus remain fully perceivable
```

- Do not disable status feedback when removing animation.
- Do not autoplay video or animated imagery. Approved video is static-first and user-initiated, makes no media request before intent, provides pause/stop/close as applicable, and retains a still alternative.
- Test the complete menu, filter, form, alert, and language-switch journey with reduced motion enabled.

## 7. Scroll and navigation continuity

- Browser Back and Forward restore route, query/filter state, and a useful scroll position where the platform supports it.
- Do not hijack scrolling or use scroll position as the only way to reveal critical content.
- Hash links target real headings and work before JavaScript.
- Language switching retains the equivalent route and safe context; unavailable translation produces an explanation, not a surprise redirect.
- Infinite scroll is excluded from Phase 1. Use pagination or an accessible “Load more” enhancement with a conventional fallback.

## 8. Motion performance budget

- Prefer CSS and platform behavior for functional motion. A Level 2/3 motion runtime may be proposed only with license, security, bundle, cleanup, reduced-mode, and no-library comparison evidence.
- Non-essential choreography code loads after or within the eligible section and must not threaten the 150 KB compressed initial first-party JavaScript budget.
- Reserve all media and async-result dimensions to protect CLS ≤0.1.
- Larger masks, filters, media planes, background imagery, or bounded scroll-responsive decorative layers require profiling and a static reduced equivalent. Never apply them to text, controls, safety content, or native scrolling.
- Verify interactions on the agreed low-end Android/constrained-network profile, not only desktop development hardware.

## 9. Interaction acceptance checklist

- [ ] Every action gives immediate perceivable feedback.
- [ ] Functional motion communicates state/orientation within 80–300 ms; selected composed/cinematic layers follow the documented 250–1200 ms levels without delaying access.
- [ ] Reduced-motion removes non-essential travel without removing information.
- [ ] Keyboard focus is visible, ordered, restored after overlays, and never obscured.
- [ ] Loading does not cause layout shift or duplicate submission.
- [ ] Error and timeout states retain valid user data and provide a safe fallback.
- [ ] Success is announced only after authoritative system acknowledgement.
- [ ] Browser Back/Forward, deep links, filters, and language context behave predictably.
- [ ] No autoplay, pre-intent video request, mandatory pinned story, scroll-jacking, or uncontrolled promotional loop exists.
- [ ] Every Level 3/4 treatment has an authored poster/static state, capability fallback, cleanup behavior, and measured performance evidence.
