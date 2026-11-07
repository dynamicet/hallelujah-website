# Editorial motion exploration — D2/D3 follow-through

Two browser prototypes were compared with the actual homepage content: an editorial passage and a horizontal gallery. UI UX Pro Max informed the exploration; the Taste skill was not used.

## Direction selected
The editorial passage connects the care band to larger portraits, gives each equipment explanation its own alternating image-and-copy chapter, and expands stories into alternating spreads. The gallery prototype offered strong individual stages but required separate horizontal exploration to discover the remaining content. The selected direction preserves a single vertical reading journey.

Prototype evidence: `artifacts/visual-checks/2026-11-06T11-53-00.890Z-creative-directions-9EzRQW`. This is browser-injected exploratory CSS over b27ed99, not evidence of the final implementation.

## Implemented behavior
- The desktop care color continues behind the specialist heading and portraits. Its lower edge recedes with scroll progress, revealing the white reading surface. Equal portrait sizing avoids implying a clinician hierarchy.
- Equipment now has three alternating chapters, larger typography and an always-available desktop chapter index within the section. Native links move focus to each chapter and clear both sticky navigation layers. An IntersectionObserver updates the active indication; the indicator uses a short transition, not a perpetual animation.
- Stories now alternate full-width image-and-copy spreads. Images retain their scroll-driven entrance while text and disclosure triggers stay still.
- Existing D1 disclosure continuity and D2 entrances remain. Mobile and tablet use a vertical composition with a static index. Reduced motion removes animated backdrops, image timelines and indicator transitions. Native chapter links work without JavaScript.
- No new assets, dependencies, scroll interception, mandatory pinning or autoplay behavior were introduced.

## Review
The browser comparison and final scene review assess hierarchy, image framing, readable labels and section continuity. Automated checks separately cover keyboard navigation, active chapter tracking, sticky-header clearance, overflow, stopped/reversed image motion, stable copy geometry, reduced motion and disclosure continuity. These checks establish behavior, not visitor engagement or conversion improvement.

Run `node scripts/check-editorial-passage.mjs` with the local preview running for scene captures and navigation checks. The existing `pnpm visual:signature`, `pnpm visual:foundation` and `pnpm visual:check / /doctors` checks remain applicable.

Chromium is the tested browser. Wider cross-browser and assistive-technology review remains D7 work. The existing hospital background-film opt-in work remains D6.
