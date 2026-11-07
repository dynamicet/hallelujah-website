# D3 — Signature discovery scenes

The subsequent [editorial exploration](creative-direction-exploration.md) expands
these scenes with a moving section backdrop, alternating layouts and equipment
chapter navigation. The image-timeline contracts below remain applicable.

D3 adds three deliberate image scenes to the D2 reading sequence, using existing
assets and native CSS view timelines. No animation library, scroll listener,
pinned section, or extra media download is introduced.

## 1. Care areas → people

The care-area footer now offers **Meet our specialists**, a native link to the
next section, alongside the existing service-directory action. The destination
can receive keyboard focus and clears the sticky header.

On desktop, the three clinician portraits progressively open their side/bottom
crop as the image row enters the viewport. Their entry ranges are offset by
0/12/24 percent, so the row resolves in reading order. Names, specialties and
profile links stay stationary. Hovering or focusing a clinician resolves that
portrait immediately. This connects the two sections without implying that the
featured clinicians correspond one-to-one to the care-area cards above.

## 2. Technology in focus

The actual three equipment images now respond to scrolling: a small approach
and crop opening settles into the existing full image. The reserved frames
do not change size, and titles, descriptions and preparation controls stay still.
The reveal backdrop matches the dark illustrations. Focusing an equipment
control resolves its corresponding image.

The previous animation targeted an absent flagship element. That unused animation
rule is removed. This implementation targets the rendered product frames and
has been checked against their computed timeline and geometry.

## 3. Numbers → everyday stories

A native **Explore everyday stories** link leads from the statistics band into
the story section. Numerical values and reporting labels remain static.

The two story photographs open from a restrained crop and settle from a small
scale adjustment as they enter. The second image starts slightly later. Story
text and actions remain stationary on desktop; focusing a story control resolves
its photograph. Existing fictional-story/generated-photo and preview-statistics
disclosures remain visible. Motion does not imply a clinical outcome or turn
preview content into a verified patient account.

## Responsive and interaction contract

- At 900px and wider, with motion allowed and the CSS features supported, native
  view timelines drive the image effects. The frame owns the timeline so an
  overflow-clipped image container cannot become the wrong scroll reference.
- Progress stops when scrolling stops and reverses with scrolling. There is no
  timed follow-on loop or required dwell period.
- D2 entrances on the same image/card are suppressed on this desktop path to
  avoid competing movement. D2 headings and the rest of the homepage remain.
- Below 900px, or when the timeline/range features are unsupported, the D2
  composed entrances remain. No continuous image motion is added on compact
  screens. Resizing changes treatments without remounting the content.
- Reduced motion and print omit the signature animations. Native links, full
  image geometry, and essential copy remain available. The signature effects
  themselves require no JavaScript.
- Interaction takes priority over image composition. No link, disclosure,
  emergency action or navigation waits for a timeline to finish.

## Verification and limits

`pnpm visual:signature` checks 390/768/1440px: actual computed image transforms
and crop changes across scroll positions; stop/reverse behavior; stable frame and
copy positions; responsive fallback and live resizing; focus settling; live
reduced motion; and real keyboard activation of both section links.

D1 continuity, D2 choreography, existing motion/static fallback, TypeScript,
targeted lint, and fresh responsive captures cover regression checks. Visual
inspection findings are recorded separately inside each fresh run directory.

Chromium is the tested browser. The unsupported-feature branch is provided by
CSS feature queries; it is not a claim that an older browser was tested.
Cross-browser and assistive-technology parity remain outside these checks.

Implementation reference: [MDN — view timelines](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/view-timeline)
and [timeline ranges](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Scroll-driven_animations/Timeline_range_names).

## Following packages

D4/D5 still cover the remaining component and reading transitions. D6's explicit
opt-in policy for the existing hospital background film remains open; D3 does
not alter that film. D7 retains final cross-browser and full-journey performance
review.
