# D1 — Motion foundation and continuity

Implemented for the enhanced homepage and shared reveal runtime. Uses ui-ux-pro-max;
the Taste skill was not used.

## Shared vocabulary

`apps/web/src/app/motion.css` owns the timing, easing, distance and stagger tokens.
Functional feedback: 160ms. Disclosure changes: 240ms. Editorial entrances:
480ms; image entrances: 620ms. Mobile entrances shorten to 380/480ms, travel
drops from 12px to 8px, and stagger drops from 70ms to 45ms. Existing
`--hh-motion-*` aliases use this vocabulary.

These are distinct roles, not a requirement to animate every component. Future
signature sequences can have authored timing without slowing actions.

## Authoring contract

- Add `data-reveal="0"` to a deliberate entrance target. Values 1–3 express a
  short sequence; the runtime caps longer delays. Use `data-motion="image"`
  for the image treatment. Do not infer motion from layout class names.
- Keep essential actions readable and immediately usable. No hidden CSS baseline.
- Use `data-motion-disclosure` on native details for coordinated open and close.
  Preserve summary semantics; do not replace keyboard handling with custom clicks.
- The disclosure transition changes local document height intentionally. It is
  bounded to user-triggered disclosure, not continuous scroll animation. No JS
  measurement loop or scroll interception is used.
- Supporting browsers interpolate details content size. Other browsers retain
  normal native disclosure behavior. Chromium was tested; Safari/Firefox parity
  has not been established.
- Reveals run once per mounted element. Dynamic/streamed targets are registered.
  Navigation disconnects observers and cancels owned effects. Focusing an
  animating target settles it immediately. Live reduced motion settles active
  reveals and disables disclosure transitions. Static content remains available
  with JavaScript disabled.

## Continuity fixes

Story controls use a stable vertical order on every viewport. Opening Read story
no longer changes its flex order or moves it into a different column. Film and
transcript disclosures use the same transition contract; closing film still
pauses its video.

Visit questions allow multiple answers to stay open. Opening a later answer no
longer collapses content above the active trigger. Visitors can compare guidance
and close answers individually.

## Verification

Run `pnpm visual:foundation` for real keyboard activation, measured intermediate
opening/closing heights, anchored trigger positions, rapid reversal, live
reduced motion, and a no-JavaScript native disclosure check at 390/768/1440px.
Chromium does not enumerate these pseudo-element transitions consistently in
getAnimations(); the test measures geometry instead.

Also run `pnpm visual:check / /doctors` and `pnpm visual:motion`. Open fresh
screenshots and record visual findings in each run directory independently of
automated results. This is not a full assistive-technology or cross-browser audit.

## Next packages remain distinct

D2: whole-home scrolling rhythm and section transitions are implemented in
[Homepage scroll choreography](homepage-scroll-choreography.md).
D3: signature discovery moments are implemented in
[Signature discovery scenes](signature-discovery-scenes.md). Actual equipment
frames now own the native desktop scroll effect; the unused flagship animation
has been removed.

D4/D5: care-mode continuity, partner expansion, menus/cards, and reader/detail
transitions. D6: explicit opt-in for the background care film (its existing
viewport autoplay policy is unchanged here). D7: full-journey performance and
final polish. These known assessment findings remain open, not implicitly
completed by D1.
