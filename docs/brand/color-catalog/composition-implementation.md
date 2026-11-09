# Revised composition: study and implementation

**Current usage authority:** [Final brand and composition guide — deliverable 6](../usage-guide.md).

4 November 2026. Implements the [client's composition correction](composition-review-2026-11-04.md).
This is an implemented design revision for review, not a claim of client acceptance or new
multi-reviewer agreement. The subsequent [deliverable 5 route rollout](route-rollout.md) is recorded separately.

## Review the result

- [Side-by-side comparison](http://127.0.0.1:3977): 27 groups, desktop/phone
  switch, homepage/shared-component filters, full-resolution capture links, expandable comparisons.
- [Live homepage](http://localhost:3000/): revised composition in its full sequence.
- [Live component gallery](http://localhost:3000/component-library): interactive controls and
  additional state specimens.

The study and capture endpoint return 404 outside development. Captures live with repository
review evidence rather than public assets. The existing homepage publication gate is preserved.

## What changed

Blue provides recurring headings, action recognition and structure. Ground, type, accents,
frames and states are independently composed. Orange and magenta participate in the same
experience through different visual responsibilities. The existing palette supplies enough
contrast for this pass; palette expansion remains possible rather than prohibited by old records.
No new hue is presented as approved merely because it would add variety.

| Area | Implemented relationship |
| --- | --- |
| Navigation and utilities | Pale-blue identity edge, orange current-page underline and warm appointment-button edge |
| Hero | Existing human photography and readable blue scrim; warm edge on the inverse action and separated arrow cue |
| Care search | Mist grouping, white controls, blue search edge, orange help marker |
| Specialties | Deep-blue stage and tonal corner arc; veil, white and mist card planes; blue actions; orange/magenta leading rules |
| Technology | Framed image stages, blue typography, warm disclosure controls, warm-edged inverse closing action group |
| Hospital film | Blue heading marker, warm image-stage edge and consistent blue actions |
| Clinicians | Pale-blue portrait foundations, blue/orange/magenta image rules and consistent profile arrow circles |
| Human introduction | Blue editorial structure and a magenta marker alongside the existing natural image |
| Statistics | Deep-blue ground, pale-blue figures, warm small markers, distinct column edges and explicit preview notice |
| Stories | White ground, blue headings, expressive and blue image rules; deep-blue, mist and peach quotation planes with different accent edges |
| Contact/directions | White contact plane, blue structure, warm arrival note; urgency retains its separate red treatment |
| Visit preparation | Paper ground, blue questions and panel structure, warm offset corner and guidance marker; pink/magenta expansion controls become blue when expanded |
| Partners | White logo stage, warm title marker, explicit blue navigation control edge; original partner artwork preserved |
| Health finder | Mist enclosure and blue spine, magenta search edge, balanced alphabet grid, separate selected/disabled/focus treatments |
| News/resources | Paper ground, contrasted image/metadata rules, blue reading links and framed arrow cues |
| Footer | Blue closing field, warm identity marker and a tonal divider before the large wordmark |
| Surfaces/actions | Readability follows ground; accent detail is independently chosen; nested white cards restore light actions/focus |
| Task cards | Blue structural edge, pale icon plane, warm destination cue; compact rows retain their native link behavior |
| Fields/choices | Blue labels, white controls, a blue selected-choice marker and grouping; invalid and disabled states remain distinct |
| Notices | White reading plane, semantic leading edge/icon/heading, ordinary reading ink and explicit recovery actions |
| Search/filter/pagination | Blue search structure, warm applied-filter marker, clear selected-page edge and separated keyboard focus |
| Governed cards | Blue current-content spine, warm destination marker, explicit current/expired/unavailable behavior |

These are relationships to inspect in context, not a new rule that every component must receive
a border, that a specialty owns an accent, or that every section needs multiple hues. The study
keeps restrained contexts as well as richer ones.

## Shared component API

```tsx
<BrandSurface labelledBy="visit-title" tone="mist" accent="orange" detail="rule">
  <h2 id="visit-title">Before your visit</h2>
  <BrandCard labelledBy="questions-title" tone="white" accent="magenta" detail="corner">
    <h3 id="questions-title">Bring your questions</h3>
    <TextLink href="/patients-visitors" label="Prepare for your visit" />
  </BrandCard>
</BrandSurface>
```

- `tone`: `paper`, `white`, `mist`, `inverse`, `supporting`, `expressive`.
- `accent`: `none` (default), `blue`, `orange`, `magenta`.
- `detail`: `rule` (default), `corner`, `frame`; has no decoration when accent is `none`.

Supporting/expressive tones no longer force orange/magenta headings or rules. Blue headings
remain the light-surface default. Inverse context supplies white reading text and appropriate
actions/focus. Nested surfaces reset those roles. Accents do not change functional state meaning.
Generated primitive → semantic → component bindings remain canonical; there are 471 tokens,
37 contrast policies and seven protected motion contexts.

## Comparison evidence

The [capture directory](../evidence/composition-revision/captures/before.json) indexes the
baseline. [Revised captures](../evidence/composition-revision/captures/after.json) record the
implemented revision. Each group has previous/revised images at 1440px and 390px: 108 images.

The original 24 groups were captured from committed deliverable 4 (`759d123`) before restoring
the revised sources. Three added specimen groups (search, extended feedback and governed cards)
compare the same new gallery content with committed baseline CSS and revised CSS. They are
explicitly labeled as newly added specimens, not pages that existed in the older gallery.
Library explanation copy was updated to describe the revised relationships. Homepage content,
preview disclosures and original imagery remain in place.

The study uses intrinsic capture dimensions to reserve image space; images can be opened at
full resolution. Phone captures can be compared side by side on a larger screen. Narrow screens
stack each pair with persistent previous/revised labels.

[Study interaction checks](../evidence/composition-revision/study-checks.json) verify the
16-homepage/11-shared filters, 54 desktop image responses, invalid-filename rejection and
27 native comparison disclosures with page JavaScript disabled.

## Verification

See [rendered checks](../evidence/composition-revision/checks.json) for viewport, interaction,
state and contrast results. Passed production build, TypeScript, changed-source ESLint,
token drift/consumer checks, and action, form, search-control, system-state, foundation,
homepage, homepage-enhancement, health-finder, shell and brand checks. Repository links passed.

Chromium at 1440, 768, 390 and 320px verified no horizontal overflow, one H1 and unique IDs on
the homepage, library and comparison study. Interactions covered the mobile menu, visit and
story disclosures, topic selection/reader/return focus, partner expansion, native choice
selection, disabled-field tab skipping and error-recovery navigation. Primary actions retain
their hover/pressed colors, 3px focus treatment and forced-colors separation behavior across
all five demonstrated contexts. The flat-background sample checked 85 homepage and 174
gallery text/action pairs; minimum measured contrast was 4.956:1. Photographic text is outside
that flat-color sample.

The actual production server returned 404 for `/composition-study`, `/component-library`
and a valid capture URL. The temporary production server was stopped after these checks.

The [final visual inspector](../evidence/composition-revision/inspection.json) records zero
failures with two explicit allowances: `hairline` for the client's requested linework and
`eyebrow` for meaningful story attribution. Its unadjusted run reported those two style-rule
failures; they were not treated as functional defects. Seven warnings remain documented:

| Warning | Review decision |
| --- | --- |
| Mixed headline emphasis | Existing italic editorial emphasis is part of this visual study. |
| Dashed edges | Native disabled alphabet controls use a second visible availability cue. |
| Warm paper | The current paper neutral coordinates the blue and accent families. |
| Type-size count | Existing page type scales are retained; typography consolidation is outside this composition pass. |
| Sideways partner row | Existing accessible controls and the view-all alternative remain available. |
| Multiple text edges | Section frames align; nested card and control insets create additional internal edges. |
| Repeated mobile cards | Care destinations retain a comparable task structure; their planes and cues now have clearer hierarchy. |

All desktop and phone comparison groups, the final inspector's desktop/tablet/phone sheets,
and the study previews were visually reviewed. The state examples remain specimens: they do
not represent a real pending request, success or appointment.

## Visual critique

ROUND 2

Seen in one second: a human conversation and a blue care identity, followed by more clearly
layered destinations and editorial content.

Idea (one sentence): the existing care journey gains a recurring open edge and directional
cue that connects blue practical tasks with warm and expressive human detail.

Live thing: care search, the topic finder/reader, disclosures and the comparison-size/category controls.

Layout words by section: hero=photographic opening / discovery=destination grid /
technology=image stage / clinicians=portrait sequence / stories=editorial pair and quotations /
arrival=practical split / preparation=questions / topics=index / news=editorial hierarchy.

Qualitative scores for this focused revision: design 7.7 · usability 8 · creativity 6.7 ·
content 7.5 → overall 7.6. These are a local critique, not an external award or team consensus.
The recurring detail is still a familiar editorial device rather than a unique hospital motif.

Top three problems addressed:

1. The specialty cards merged into one blue plane: contrast the ground, card planes and actions.
2. Stories and preparation repeated their accent at every level: restore blue structure and
   independently compose rules, controls and insets.
3. Finder details lacked distinction and the revised alphabet left an isolated desktop letter:
   separate selection/disabled/focus treatments and balance the desktop grid.

Further refinement can develop a more hospital-specific graphic motif and reduce the existing
type-scale variety. The current result is ready for client comparison and further art direction.

Scope limits: this study covers the homepage and reusable component foundation. The subsequent
[deliverable 5 rollout](route-rollout.md) covers the remaining route compositions. Existing publication/content-readiness decisions are retained.
No assistive-technology certification or complete site accessibility audit is claimed.

Run `pnpm composition:preview` to open the loopback composition archive. Review evidence is kept outside the deployable application.
