# D2 — Homepage scroll choreography

D2 applies the D1 vocabulary across the entire enhanced homepage. It is a
reading sequence with deliberate quiet intervals, native scrolling, and stable
task controls. The existing hero stays as the opening; the work continues below it.

## Section storyboard

| Section | Motion and continuity | Stable content |
| --- | --- | --- |
| Hero → quick access | Existing hero resolves into the task strip; first boundary accent introduces care | Search, appointment, urgent links and quick access |
| Specialized care | Heading leads; whole cards rise in a short desktop row sequence | Links remain present and usable |
| Specialists | Heading then whole clinician cards; portrait, identity and profile action move together | No separate portrait/text entrances |
| Visit preparation | Heading provides orientation, then a quiet reading interval | Questions and D1 disclosures |
| Contact & directions | Heading entrance only; removes separate moving contact panels | Phone numbers, address, maps and urgent guidance |
| Health topics | Heading joins the sequence | Input, alphabet, results and reader interactions |
| Technology | Second boundary accent; heading and complete equipment cards | No nested image/copy effects; no claimed flagship scroll animation |
| Hospital film | Slower reserved image-plane reveal after the heading | Links outside the media plane |
| Hospital numbers | Soft heading arrival provides a pause | Numbers, labels and links; no count-up |
| Everyday stories | Third boundary accent connects the numbers band to lived experience; images lead, text softly follows | Preview disclaimer and D1 control geometry |
| News & resources | Heading followed by complete editorial cards | Archive cards keep their existing behavior |
| Partners → footer | Soft arrival for the partner row; a stable footer closes the journey | Partner controls, footer navigation and final appointment action |

## Behavior

Desktop card entrances take 540ms, headings 460ms, and selected images 720ms.
Mobile shortens these to 400/360/480ms and removes row stagger; stacked content
enters when encountered. These are animation durations, not delays before access.

Only three decorative section rules react again when scrolling back. They expand
when their section intersects the central viewport band and settle when it leaves.
They are intersection-triggered transitions, not continuous scroll-scrubbed media.
Text and card entrances never replay on reverse scroll within the same mount.

Fast skips cancel entrances once the target leaves the viewport. Focusing a moving
card settles its entrance immediately. Client navigation disconnects the additional
observers and removes boundary state. No scroll listeners, pinned sections, new
animation dependencies, perpetual animation loops or hidden content baselines
were introduced.

Reduced motion leaves all content and chapter rules fully resolved. Forced-colors
mode omits decorative rules. Static HTML remains complete. Print suppresses
entrances and boundary transitions.

## Verification

- `pnpm visual:choreography`: full-home sequence at 390/768/1440, no nested
  reveals, readable headings, stop/reverse/fast scrolling, decorative boundary
  response, focus settling, live reduced motion and Next client navigation/back.
- `pnpm visual:foundation`: preserve D1 opening/closing and anchored controls.
- `pnpm visual:motion`: immediate hero action, one-shot entrances and static fallback.
- `pnpm visual:check / /doctors`: responsive structure, images and console errors.
- TypeScript and targeted ESLint.

Fresh screenshots and observations live in the unique run directories under
`artifacts/visual-checks/`; visual inspection is recorded separately there.
Chromium verification does not establish Safari/Firefox or assistive-technology
parity. Time-sensitive browser checks should run sequentially to avoid competing
browser processes obscuring short intermediate frames.

## Remaining deliverables

D3's [signature discovery scenes](signature-discovery-scenes.md) now build on
this sequence. On supported desktop browsers they replace the D2 card/image
entrances in the specialist, equipment and story scenes; compact screens keep
the D2 treatment. D4/D5 own care-mode,
partner expansion, menu/card interaction polish, and reader/detail continuity.
D6's explicit opt-in background-film policy remains open; D2 does not change
playback authorization. D7 retains final cross-browser and full-journey performance
review. This package supplies the homepage rhythm those experiences build on.
