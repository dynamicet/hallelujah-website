# Composition correction before deliverable 5

**Document status — deliverable 6:** Client correction record. The requested revised comparison, implementation and rollout are complete; future-tense requests below preserve the original review. Use the [current usage guide](../usage-guide.md).

Client review, 4 November 2026, following deliverable 4 (`759d123`).

**Status:** The client rejected the current section-color treatment as the rollout direction.
Deliverable 5 is deferred while composition is revised. This review supersedes earlier advice
that preparation should become an orange environment and reflection a magenta environment.
The code and previous evidence still describe the implemented version; they do not demonstrate
acceptance of a revised design. No new expert consensus or browser validation is claimed here.

## What went wrong

Reusable semantic colors and components remain useful. The mistake was treating a color family
as a complete art direction: background, heading, rule, frame and panel repeatedly inherited
the same accent. The result alternates isolated color environments without enough internal
hierarchy or a recurring visual language. Passing contrast and component checks did not resolve
this design weakness.

Blue must carry the hospital identity across the experience. Supporting colors should participate
inside compositions through typography, borders, controls, markers, imagery framing, shapes,
and selected surfaces. A distinctive section needs its own composition and interaction emphasis,
alongside recognizable blue structure, typography and recurring details. A different background
alone is insufficient.

## Screenshot review

All 18 client-provided PNGs were opened and reviewed from
`/home/befikadusata/Pictures/Screenshots/`. Filenames share the prefix
`Screenshot From 2026-11-04 ` and suffix `.png`. The observations below refer to these captures,
not a new inspection of the reference sites or a new responsive browser test.

| Capture time | Observation | Design consequence |
| --- | --- | --- |
| 20-49-37 | Blue search controls and labels remain dominant; the orange vertical help marker adds a second emphasis without recoloring the whole panel. | Keep this relationship and develop its line/marker vocabulary. |
| 20-50-17 | Magenta rules give a short, clear interruption to a light field. | Keep expressive linework as a useful device; its success does not justify making every neighboring element magenta. |
| 20-51-27 | Deep-blue field, transparent blue cards, pale borders and repeated circular arrows have almost identical treatment across all four destinations. | Introduce a stronger relationship between field, card plane and action; vary emphasis rather than assigning arbitrary specialty colors. |
| 20-51-48; 20-52-06 | Pink ground, magenta heading, labels, image rules, panel borders, divider and solid quote repeat the same family. Photography and blue copy help, but the accent owns too many layers. | Restore blue structure and contrast between editorial surfaces; choose which magenta details actually lead. |
| 20-52-22 | Peach ground, orange headline emphasis, outer frame, row dividers and summary text repeat one treatment. | Make the preparation interaction blue-led, with warmth concentrated in framing or a bounded note; compare alternative compositions. |
| 20-55-12 | The finder is readable and blue-led, but the search enclosure and alphabet offer little distinctive detail. | Test an accent frame/edge and a clearer selected-letter treatment while retaining a separate focus indicator and recognizable disabled letters. |
| 20-56-56; 20-57-58 | Navy structure, related blue text/shapes, small yellow markers and repeated yellow actions coexist with white cards and a green field. | Repeat recognizable details across different grounds; surface changes need not change every other role. |
| 21-00-16; 21-02-04 | Yellow or blue stages are composed with white content, photography/product fragments, contrasting small shapes and differentiated controls. | Treat the contents of a colored field as designed layers, with a focal point and depth of tone. |
| 21-03-26 | Turn.io combines a green stage and tonal arcs with emphasized type, a coral action, cyan detail, pale chat surfaces and portraits. | Blue can lead an equally rich arrangement without becoming the only color in it. |
| 21-03-56; 21-04-10 | Green and cyan testimonial treatments each use pale ground, darker type, stronger attribution rules, image overlays and active progress lines. | A predominantly single-family composition can succeed when tone, imagery, geometry and behavior give it structure. |
| 21-04-33 | Contrasting comparison panels, category icons and a product fragment explain the content. | Color should reinforce what differs in the content, rather than merely decorate a sequence. |
| 21-04-51; 21-05-30 | Purple fields contain tonal arcs or a repeated circle pattern, contrasting icons and bright orange/pink punctuation. | A large secondary-color moment is possible when internally composed and connected to the wider identity. Avoid turning every section into this intensity. |
| 21-13-59 | August uses a multicolor card sequence connected by consistent typography, proportions, linework and arrow controls. | Cohesion comes from repeated design relationships as well as a dominant hue. Multiple families require more art direction, not an automatic rainbow rotation. |

## Revised color responsibilities

| Layer | Responsibility | Starting application |
| --- | --- | --- |
| Brand blues | Identity, orientation, headings, action recognition, tonal structure | Deep, primary and pale blues recur through light and accent-supported compositions. Blue continuity need not mean a blue background everywhere. |
| Orange | Warmth and deliberate emphasis | Borders, action-adjacent markers, selected editorial text, image details and bounded surfaces; an accent action is an experiment requiring a clear hierarchy and readable states. |
| Magenta | Expressive contrast | Quote punctuation, rules, selected labels, graphic detail or a deliberately composed panel; it does not automatically own stories or reflection. |
| Neutrals | Reading, separation and visual rest | White, paper, ink and slate do distinct jobs. Keep visible plane changes between ground, card and controls instead of tinting everything alike. |
| Complementary families | Extend the expressive range where a composition benefits | Explore coordinated cool and warm candidates in context, with pale, middle and deep companions. No new hex values are approved by this review. |
| Functional states | Explain actual selection, focus, pending, success, caution, error and urgency | Retain semantic meaning, explicit labels and independent focus treatment. Decorative accents must remain distinguishable from these states. |

There is no one-accent-per-section restriction and no mandatory color percentage. Orange and
magenta may coexist when their emphasis differs. Nor is a minimum number of colors required:
the tonal testimonial references demonstrate why that would misdiagnose the problem.

Do not lock a hue to a department, patient group or content topic merely to distribute colors.
Do not make every primary action a different color. Carry relationships across sections:
for example, a recognizable action, an offset edge, a recurring marker or a consistent image frame.
Choose that vocabulary through the experiments rather than adding all devices everywhere.

## Component architecture correction

Separate **surface context** from **accent expression**. Surface context supplies readable text,
appropriate actions and focus on light or dark ground. Accent expression can independently style
a rule, quotation mark, outline, graphic, label or bounded inset. Avoid an API where choosing
`supporting` necessarily chooses peach ground, orange headings and orange linework together.

The existing `BrandSurface` and `BrandCard` tone presets remain implemented examples, not the
final composition contract. Study the needed combinations before changing their APIs. Preserve
the useful native semantics, nesting resets, generated token references and state behavior.

## Required visual experiments

Produce side-by-side alternatives with the same real content and existing typography. Use enough
surrounding homepage content to assess continuity; isolated swatches or button grids cannot decide
this. Show desktop and phone treatments. These are experiments to build next, not completed work.

| Study | Alternative A | Alternative B | What decides the result |
| --- | --- | --- | --- |
| Specialties | Deep-blue stage with lighter card planes, a warm edge/marker and a distinct action shape | Light blue-led directory with a strong blue feature and contrasting accent linework | Finding the right destination remains immediate; all cards do not dissolve into the same blue plane. |
| Stories | Neutral or mist ground, blue editorial type, magenta quote punctuation/rules and varied inset tones | A bounded pink editorial composition supported by a blue feature or frame and contrasting quote planes | Human imagery and story hierarchy lead; the result belongs beside care discovery. |
| Visit preparation | Light neutral ground, blue accordion text and controls, orange structural edge and a peach note | Mist/blue composition with a warm inset and contrasting expansion indicators | The questions feel interactive and helpful; every layer does not inherit orange. |
| Health-topic finder | Blue-led search and alphabet with an expressive frame or offset accent | Neutral search plane with a blue selected-letter shape and a contrasting guiding detail | Selection, availability and keyboard focus remain clearly different; decorative detail helps orientation. |
| Palette extension | Compose the studies with the existing families | Repeat selected studies with a coordinated complementary family | Added colors create a useful relationship and preserve recognition; extra hue alone is insufficient. |

Review as a team across brand continuity, visual composition, content/interaction hierarchy and
accessibility. Record differing judgments and their resolution; do not infer agreement from
technical checks. Present the selected composition with its rejected alternative and rationale.

## Acceptance before rollout

- Blue identity persists across the sequence, including supporting-color moments.
- Each study has a clear focal point, distinct planes and an intentional relationship between
  ground, type, imagery, linework and actions.
- Neighboring sections have distinctive experiences while sharing recognizable visual details.
- The improvement is visible in the rendered comparisons, beyond a change of background hue.
- Any new palette values have explicit roles, tonal companions and tested rendered pairings.
- Desktop and phone layouts preserve that composition; hover, focus, selection, disabled and
  expanded states remain clear and readable.
- Revised guidance and component contracts follow the selected visual studies. Deliverable 5
  then carries the agreed approach across routes.

This review changes the design direction and next deliverables. It does not change application
styling, approve new palette values, or claim the revised composition has been built or tested.
