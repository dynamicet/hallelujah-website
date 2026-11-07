# Hallelujah website brand and composition guide

Deliverable 6 · Finalized 4 November 2026 for the implemented local website.

This is the current website usage guide. Blue supplies a recognizable care identity;
orange, magenta, coordinated neutrals and tonal variation give each experience expression.
The visitor's task determines the layout. Color enriches that layout through type, lines,
frames, controls, shapes, images and surfaces, with a clear reading and action hierarchy.

## Authority and source order

Use this guide for composition and the [application token manifest](../../apps/web/src/design-system/tokens/tokens.json)
for exact runtime values and bindings. The [curated catalog](color-catalog/index.html) is the
interactive swatch and contrast reference; its [palette source](color-catalog/palette.json)
generates the standalone catalog assets. Runtime tokens and catalog data have separate generators.

The [identity foundation](README.md) retains logo provenance, institutional name, voice,
media rights and language requirements. Its earlier color estimates and Noto-only typography
describe the foundation stage. The current presentation uses the editorial typography below.
Older chapter-color prescriptions and percentage examples are retired as application rules.
Historical review files remain available for traceability, with their status marked.

This guide consolidates the client-directed revision and completed rollout. It does not claim
a new expert-panel consensus or hospital publication approval. The local preview and existing
content-readiness gates continue to apply.

## Palette and responsibilities

| Family | Values | Current responsibility |
| --- | --- | --- |
| Brand blue | Primary `#0078A6`, strong `#00678D`, deep `#00445D` | Primary actions, ordinary links, headings, structural marks and substantial identity fields |
| Blue companions | Mist `#EAF5F9`, veil `#D5EAF2`, air `#A8D3E4` | Grouping, selected planes, portrait grounds and tonal geometry; deep blue supplies readable text |
| Supporting orange | Anchor `#F26522`, pale `#FFF0E7`, deep `#A8430C` | Warm image edges, markers, frames, action-adjacent details, readable accent copy and bounded warm planes |
| Expressive magenta | Anchor `#D81B72`, pale `#FCEAF2`, deep `#A61558` | Quotation punctuation, metadata, contrasting rules, inset planes and expressive moments |
| Reading surfaces | Paper `#FBF8F6`, white `#FFFFFF` | Page ground, quiet reading, distinct working planes and fields |
| Reading text | Ink `#17313D`, slate `#52636B` | Essential body copy and supporting metadata; blue headings orient the reader |
| Edges | Quiet `#CBD8DE`, control `#718892` | Decorative separation versus meaningful boundaries around white controls |
| Information | Strong blue `#00678D` on mist `#EAF5F9` | Actual information messages with explicit copy |
| Success | `#24634B` on `#EEF7F1` | Actual completed or successful states |
| Caution | `#80530C` on `#FFF6E5` | Actual cautions with written meaning |
| Error and urgency | `#A33330` on `#FBEFED` | Distinct error and emergency aliases, wording, structure and recovery actions |

The original logo artwork remains intact. Its yellow is an artwork color, with no current
standalone website family. No new complementary hue was added in this delivery. Future
extensions are welcome when a real composition benefits: propose pale, middle and deep
companions, demonstrate them beside existing blues on desktop and phone, test readable and
interactive pairings, then add semantic bindings and update this guide. Older documents do
not impose a palette ceiling.

## Compose relationships

Choose the reading ground, text hierarchy, action treatment and accent detail independently.
A peach ground can carry blue headings, a magenta marker and a familiar blue action. A deep-blue
field can contain pale and white planes, natural photography and a warm directional cue.
A white directory can gain expression from portrait grounds, colored top edges and framed
arrows while keeping results easy to compare.

Blue should recur through headings, destinations or structure as the page changes atmosphere.
Orange and magenta can share a composition when they have different emphasis. A predominantly
single-family composition can also work through tonal contrast, scale, imagery and geometry.
There is no minimum color count, one-accent-per-section rule or fixed area percentage.

Give each section a dominant subject and a supporting detail. Repeat a few relationships across
the site, such as blue headings and destinations, a warm image edge or an expressive metadata
rule. Vary their scale, placement and treatment to suit the content. A new accent does not
require tinting its heading, body, background, controls and border alike. Departments, conditions
and patient groups have no exclusive accent ownership.

| Design decision | Effective application | Avoid |
| --- | --- | --- |
| Ground | Separate paper, mist, white and dark fields into legible planes | One tint flattening the whole section and everything inside it |
| Typography | Blue orientation, ink reading, selective accent copy with a tested pairing | Every text level inheriting the supporting hue |
| Lines and frames | Mark a leading edge, image boundary, selected choice or meaningful transition | A border around every paragraph or all edges competing equally |
| Shapes | Tonal geometry framing the focal subject and directional cues | Repeated decorative devices obscuring content or implying a state |
| Actions | One recognizable primary treatment with clear secondary options | A different primary button color for every chapter |
| Supporting color | Independent accents, tonal companions and occasional composed larger fields | Automatic rainbow rotation or a secondary hue owning every layer |
| States | Explicit labels, native behavior and an independent focus indicator | Decorative colors standing in for validation, selection or urgency |

## Representative compositions

These are implemented examples, not fixed color assignments for future components.
The [27-group comparison study](http://localhost:3000/composition-study) shows previous and
revised treatments. The [component library](http://localhost:3000/component-library) shows
live shared states. Both require the development server and return 404 in production.

| Experience | Relationship to reuse | Reference |
| --- | --- | --- |
| Opening and navigation | Human photograph, readable blue scrim, inverse action with warm edge; pale-blue header structure and warm current-page detail | [Homepage implementation](color-catalog/composition-implementation.md) |
| Care discovery | Blue headings/actions, distinct white results and mist filter rail, portrait planes with varied top edges | [Doctor directory, desktop](evidence/route-rollout/after/doctors-1440.jpg) |
| Services and profiles | Comparable destinations, readable blue titles, warm portrait/image edge and independently framed next-step rail | [Service directory, phone](evidence/route-rollout/after/services-390.jpg) |
| Technology and film | Image stages carry the subject; blue structure and warm disclosure/action details connect the sequence | [Homepage composition matrix](color-catalog/composition-implementation.md#what-changed) |
| Human stories | Natural imagery, blue headings, varied white/mist/peach quotation planes and contrasting punctuation | [Story comparison](evidence/composition-revision/captures/after-stories-1440.jpg) |
| Preparation and arrival | Blue reading hierarchy, white insets within mist, warm guidance marker; written urgency remains distinct | [Visitor guide, tablet](evidence/route-rollout/after/patients-visitors-768.jpg) |
| Appointment | White workspace, blue progress and selection, warm photo edge and magenta care-summary marker | [Appointment, phone](evidence/route-rollout/after/appointment-390.jpg) |
| Feedback | Blue labels, defined white fields, clear review action and expressive review edge | [Feedback, desktop](evidence/route-rollout/after/feedback-1440.jpg) |
| Topics | Mist enclosure, white search, magenta search edge, blue selection and care handoff | [Topic finder, desktop](evidence/route-rollout/after/health-topics-1440.jpg) |
| Editorial | Strong lead story, blue reading links, consistent image treatment and varied metadata rules | [Archive, tablet](evidence/route-rollout/after/news-resources-768.jpg) |
| Emergency | Blue orientation and white practical information with explicit red urgency | [Emergency, phone](evidence/route-rollout/after/emergency-390.jpg) |
| Footer | Deep-blue closing field, inverse reading, warm identity marker and tonal divider | [Homepage implementation](color-catalog/composition-implementation.md) |

## Component and state contract

`BrandSurface` and `BrandCard` separate three decisions:

- `tone`: `paper`, `white`, `mist`, `inverse`, `supporting` (peach), `expressive` (pink).
- `accent`: `none` by default, `blue`, `orange`, `magenta`.
- `detail`: `rule` by default, `corner`, `frame`; no accent means no accent decoration.

Tone determines readable text, action and focus context. Accent and detail determine decorative
expression. Light tones keep blue headings. Nested white cards restore light-context actions
and focus even inside an inverse field. Use native links for navigation and buttons for actions;
preserve the required heading relationship. See the [component specification](color-catalog/component-system.md).

```tsx
<BrandSurface labelledBy="visit-title" tone="mist" accent="orange" detail="rule">
  <h2 id="visit-title">Before your visit</h2>
  <BrandCard labelledBy="questions-title" tone="white" accent="magenta" detail="corner">
    <h3 id="questions-title">Bring your questions</h3>
    <TextLink href="/patients-visitors" label="Prepare for your visit" />
  </BrandCard>
</BrandSurface>
```

| Component family | Contract |
| --- | --- |
| Primary actions | White on primary blue; strong-blue hover and deep-blue pressed state. Inverse contexts use the shared light action treatment. Supporting edges retain the action hierarchy. |
| Secondary actions and text links | Lower emphasis, persistent inline underlines, readable context-specific contrast and visible keyboard focus. |
| Task and governed cards | Native destination, blue structure and independent destination cue; retain current, expired and unavailable behavior. |
| Fields and choices | Visible labels, white working plane, meaningful control edge, blue selection with a shape/edge cue, explicit error copy and native disabled behavior. |
| Search, filters and pagination | Recognizable blue action/selection, independent applied-filter detail, focus distinguishable from the selected state. |
| Notices and results | Semantic wording, edge/icon and recovery action; neutral reading plane. Success and pending specimens are not evidence of a real request. |
| Media and disclosures | Natural color, usable poster/static state, labeled controls and full content available without expressive motion. |
| Help and overlays | Readable floating surface, usable close control, preserved return focus and no collision with task content. |

## Typography, space and imagery

The current presentation uses self-hosted **Lato** for body/UI, **FreeSerif** under the
`Editorial` alias for major editorial headings, and **Noto Sans Ethiopic** under the
`Ethiopic` alias. The existing Clash wordmark declaration is a separate identity treatment;
it is not a third general-purpose text face. The canonical foundation retains Noto stacks,
which the editorial CSS overrides in the local presentation. Do not confuse those layers.
Definitions live in [editorial.css](../../apps/web/src/app/editorial.css) and
[intentional.css](../../apps/web/src/app/intentional.css).

Keep functional text in the sans face, use the serif to establish major reading hierarchy,
and retain sentence case. Body copy normally uses 16–18px with comfortable leading and a
roughly 45–75-character reading measure. Let long names and translated labels wrap. Ethiopic
uses normal tracking and language-aware treatment. Existing page-specific type sizes remain;
this delivery does not claim a site-wide scale reduction or a new font-license audit.

Use the shared outer frame, equal page margins and aligned content edges. The editorial frame
is up to 1280px with 40px desktop side space; existing responsive rules compact it for phones.
Keep related elements close, distinguish section gaps from internal gaps, and let the task
set density. Existing treatments include 8px controls, 16px panels, 24px image stages and pill
actions. Reuse those relationships rather than forcing one radius onto every object.

Directories compare, guides read, forms work and editorial pages lead with a story. At narrow
widths preserve that purpose: single-column results, earlier search, stacked summaries and
clear reading order. Guide columns collapse below 900px; article sidebars below 1024px.
Test at 1440, 768, 390 and 320px, including long names, validation and unavailable content.

Use existing photographs with their recorded provenance and natural skin tones. Preserve faces
and useful landmarks in responsive crops. Illustrative people and settings remain illustrative;
they do not prove hospital staff, equipment or services. New hospital imagery follows the
[identity foundation's media lifecycle](README.md#7-asset-rights-and-lifecycle). Media should
clarify the place or story. Practical search and form pages do not need extra photographs to
meet a marketing-page picture count.

## Contrast, motion and clean implementation

Normal text needs at least 4.5:1, large text 3:1 and meaningful control boundaries 3:1 against
adjacent colors. These are implementation criteria already used by the token policy. Check
actual pairs and states, including hover, nested surfaces, opacity and image overlays.

- Strong blue carries ordinary links on approved light grounds. Primary blue on mist is
  4.47:1 and fails normal text; strong blue on air also fails normal text, so use deep blue there.
- White on orange is 3.15:1 and fails normal text; ink on orange is only 4.32:1. Use deep
  orange on pale orange for normal accent copy. White on magenta is 4.86:1.
- Quiet edges are decorative. Control edge on veil is 2.9936:1 and fails 3:1; keep the approved
  white field plane or test a stronger boundary.
- Light-surface focus uses a 3px deep-blue outline and 4px white separation; inverse surfaces
  use white outlines. Selection, disabled, invalid and focus states remain distinguishable.

Prefer flat planes, tonal depth and purposeful linework. Keep shadows for a clear depth purpose
such as a floating menu. Motion must preserve reading and controls with reduced motion enabled.
Emergency, consequential appointment states, errors, privacy, unavailable content and unknown
outcomes retain their protected motion behavior. Do not add display animation to those states.

## Final review and maintenance

Deliverables 1–5 supply the implementation and recorded browser evidence. The
[homepage/shared review](color-catalog/composition-implementation.md#verification) and
[inner-page review](color-catalog/route-rollout.md#evidence-and-validation) document their checks
and exceptions. The inner-page audit covered 44 reachable routes at desktop and phone widths;
14 representative routes also received tablet/320px layout checks, captures, interaction/state
sampling and rendered flat-color contrast checks. Minimum sampled text contrast was 4.956:1.
These are scoped measurements, not a complete accessibility certification.

For finalization, the documentation was checked against runtime colors, surface APIs,
editorial font declarations and saved desktop/tablet/phone evidence. Conflicting active color
tables and stale rollout status were reconciled. No new visual defect requiring another source
change was identified in that closeout review; existing visual evidence remains applicable.
The [finalization record](evidence/finalization-checks.json) records passing brand, token and repository-link checks. The updated catalog and historical-study
labels passed eight browser checks across 1440, 768, 390 and 320px, with one H1, a guide link
and no horizontal overflow on each page. The catalog's default, failing and passing contrast
pairs were exercised again. These closeout checks did not repeat the full route rollout audit.
The repository-wide format check reports pre-existing scratch and evidence formatting issues;
the changed delivery files were checked separately. No unrelated captures were rewritten.

Two design opportunities remain: a more hospital-specific graphic motif and a tighter inherited
type scale. They are optional future design work, not claims that this delivery developed them.
Earlier local critique scores and inspector allowances remain in their original reports; this
guide does not recast them as unanimous approval or an external rating.

For future changes, update the canonical tokens first when values change, regenerate their
consumers, update catalog data when the palette changes, and compare the affected page beside
its neighbors on desktop and phone. Exercise its actual keyboard and interaction states.
Run token, brand and link checks, plus the relevant page checks; repeat rendered verification
when visual behavior changes. Add a documented example here when a new relationship proves
useful. The system is a foundation for further design, not a fixed catalog of section skins.

## Documentation map

| Document | Status and purpose |
| --- | --- |
| This guide | Current composition and usage authority; deliverable 6 |
| [Brand foundation](README.md) / [machine record](brand-foundation.json) | Institutional identity and provenance; current direction points here |
| [Catalog](color-catalog/index.html) / [palette data](color-catalog/palette.json) | Current swatches, pairings and interactive contrast lab |
| [Component specification](color-catalog/component-system.md) | Current reusable API plus explicitly dated earlier evidence |
| [Revised implementation](color-catalog/composition-implementation.md) | Homepage/shared composition and 27-group comparison evidence |
| [Page rollout](color-catalog/route-rollout.md) | Deliverable 5 route matrix, visual decisions and test limits |
| [Original role mapping](color-catalog/color-role-mapping.md), [chapter direction](color-catalog/composition-direction.md), [standalone component study](color-catalog/component-study.html) | Historical studies; superseded section-color prescriptions |
| [Initial adoption](color-catalog/homepage-adoption.md) / [review agreement](color-catalog/review-agreement.md) | Dated initial review and evidence; no new consensus implied |
| [Foundation review board](review-board.html) | Historical palette and typography specimens; current guide linked on the board |
| Catalog PDF | Historical v1.1 snapshot; use this guide and live catalog for current decisions |
