# Reusable color components — deliverable 4

> Evidence availability (8 November 2026): some historical captures referenced below are absent from this checkout. Their filenames are retained as archive references, not current verification evidence. Rerun the documented checks for fresh evidence.

**Current contract:** The [final usage guide](../usage-guide.md) consolidates the revised
composition. Surface tone, accent and detail are independent in the API below. The
[revised implementation](composition-implementation.md) records the correction and comparison;
the [page rollout](route-rollout.md) completes deliverable 5. Earlier test evidence keeps its scope.

Implemented 4 November 2026. This extends the [homepage adoption](homepage-adoption.md)
into shared components using the existing approved palette and typography.

Review the live gallery at [localhost:3000/component-library](http://localhost:3000/component-library)
with the development server running. It is a component reference, with inert action examples
and no collection form. The route returns 404 in production; the homepage publication gate
also remains in place. Website-wide page composition is recorded in the completed deliverable 5 rollout.

## Component contracts

All exports below are available from `@/design-system/components`.

| Component | Supported treatments | Use |
| --- | --- | --- |
| `BrandSurface` | `paper`, `white`, `mist`, `inverse`, `supporting`, `expressive` | A section with a required `labelledBy` heading |
| `BrandCard` | Same tones; defaults to white | Editorial content with independent links, rendered as an article |
| `TaskCard` | `appearance="row"` (default), `appearance="panel"` | One destination; the whole card is a native anchor |
| `ActionLink`, `ActionButton` | Primary, secondary, tertiary | Native navigation or activation; adapt to the nearest branded surface |
| `TextLink` | Persistent underline | Ordinary navigation, including an inverse surface |
| `EmergencyAction`, `CallAction` | Existing protected emergency treatment | Explicit emergency label; red stays separate from editorial orange |
| `TextField`, `TextAreaField`, `SelectField` | Default, hover, focus, invalid, native disabled | Visible labels, help and error relationships remain intact |
| `ChoiceGroup` | Selected, unselected, disabled choices | Native radio/checkbox behavior with blue selection |
| `FormSubmitButton`, `FormStatus` | Pending, disabled and existing result states | Preserve existing pending/value-retention contracts |
| `SystemAlert`, `SystemState` | Existing information, success, warning and error families | Meaning comes from copy and icons as well as color |

`BrandSurface` defaults to paper. Supporting means a peach surface and expressive means a
pink surface; both retain blue headings. `accent="blue|orange|magenta|none"` chooses an
independent detail color and `detail="rule|corner|frame"` chooses its treatment.
The default accent is `none`. Colors do not rotate automatically through a group of cards.
Photography, display typography, linework and distinctive page compositions remain available.

## Color and interaction rules

| Context | Primary action | Secondary / ordinary link | Keyboard focus |
| --- | --- | --- | --- |
| Light / tinted field | Primary blue → strong blue → deep blue | Strong-blue text; secondary outlined | 3px deep blue, separated from control |
| Deep-blue field | White → veil → air, with deep-blue text | White text; outlined secondary | 3px white with deep-blue separation |
| White card inside dark field | Restores the light treatment | Strong blue | Restores deep blue |
| Disabled action | Mist, slate and meaningful control edge | Native disabled button; adjacent reason retained | Skipped by native tab order |
| Forced colors | System colors | System link/control colors | System Highlight; no shadow separator |

Hover/pressed feedback supplements the existing native semantics. Underlines remain on ordinary
links. Invalid fields retain a red edge and explicit error copy while focus stays visible.
Notice headings now inherit their status color. Governed-card ordinary links use strong blue.

A form control keeps its white field surface. Put a form in a white or mist `BrandCard` when
the surrounding section is dark, so labels and help text also retain their intended context.

## Usage

```tsx
import { ActionGroup, ActionLink, BrandCard, BrandSurface } from '@/design-system/components'

<BrandSurface labelledBy="care-title" tone="inverse">
  <h2 id="care-title">Find your next step in care</h2>
  <ActionGroup>
    <ActionLink href="/services" label="Explore services" />
    <ActionLink href="/doctors" label="Find a doctor" variant="secondary" />
  </ActionGroup>
  <BrandCard labelledBy="visit-title">
    <h3 id="visit-title">Before your visit</h3>
    <ActionLink href="/patients-visitors" label="Prepare for your visit" />
  </BrandCard>
</BrandSurface>
```

Each surface resets registered `component.context.*` aliases, including headings, actions,
links and focus. A nested light surface therefore cannot accidentally inherit inverse action
colors. Existing APIs and default task-row layout remain available. Shared styles improve
current consumers; new section/card adoption across care pages happens in deliverable 5.

Canonical definitions remain in
[the application token manifest](../../../apps/web/src/design-system/tokens/tokens.json).
There are now 471 generated tokens, 37 contrast policies and seven protected motion contexts.
The token validator now also checks the new surface styles and existing task, governed-card
and system-state styles for unknown token references and raw colors.

## Validation and visual review

The section below records deliverable 4 before the composition correction. Current revision
results are recorded in [the implementation review](composition-implementation.md).

Passed: production build including TypeScript; ESLint on changed JavaScript/TypeScript;
token, foundation, brand, action, form, system-state, home, global-shell and search-control
checks. The homepage check includes 14 SSR/omission/safety cases.
A production request to `/component-library` returned 404.

Chromium checks at 1440, 768, 390 and 320px verified no horizontal overflow; default contrast;
primary hover/pressed colors; light/inverse 3px focus; forced-colors focus; native disabled
controls; and nested white-card context reset. The sampled 41 text/action pairs at each width
had a minimum contrast of 4.956:1. This is a sample of rendered combinations, not every
possible future composition.

See [the state matrix](../evidence/component-system/checks.json) and
[interaction checks](../evidence/component-system/interactions.json).
Actual Tab navigation skips the disabled field, inputs show keyboard focus, native radio
selection works, hash links navigate, and the component content/styles remain available
with page JavaScript disabled.

Desktop study (unavailable archive: `../evidence/component-system/desktop.jpg`),
tablet study (unavailable archive: `../evidence/component-system/tablet.jpg`) and
mobile study (unavailable archive: `../evidence/component-system/mobile.jpg`) show the final reference.
The approved direction was reused; no new palette, typeface, imagery, claims or dependency
was introduced.

Visual refinements: nested actions keep intrinsic width; short content cards retain their
own height; task rows retain their compact padding. Qualitative final assessment for this
internal reference: design 7/10, usability 8/10, creativity 6/10, content 8/10; weighted 7.2/10.
The gallery deliberately repeats components for comparison and is not a finished care page.

The component/app-mode inspector reported 0 failures and eight warnings. Warnings concern
the approved warm paper, strong color and rules, large reference title, sequential gallery
length, short-card heights and unused comparison space. The marketing-page mode separately
reported six failures (photography, motion, repeated status panels, inferred margins and
one misidentified eyebrow). Those are retained in the evidence rather than treating this
reference gallery as a passing marketing page. The actual wrapper is centered and browser
overflow checks pass. All final desktop, tablet and mobile captures were visually reviewed.

[Component inspector report](../evidence/component-system/component-inspection.json) and
[marketing heuristic report](../evidence/component-system/page-inspection.json) record
those limits. Assistive-technology testing and the full repository test suite were not run
for this deliverable; these results do not constitute complete accessibility certification.
