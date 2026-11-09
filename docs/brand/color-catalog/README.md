# Hallelujah color catalog

**Current website authority:** [Brand and composition guide — deliverable 6](../usage-guide.md).
Finalized 4 November 2026 after the revised homepage/shared study and inner-page rollout.

## Review and use

- [Interactive catalog](index.html): swatches, pairings, contrast calculator, copy/download
  controls and print view. Opens directly from disk or a local HTTP server.
- [Revised implementation](composition-implementation.md): homepage and shared relationships,
  independent surface/accent/detail API and validation evidence.
- [Page rollout — deliverable 5](route-rollout.md): route matrix, responsive refinements,
  before/after captures, interaction checks and remaining limits.
- [Reusable component specification](component-system.md): current contracts and state rules.
- Development previews: [component library](http://localhost:3000/component-library) and
  [27-group comparison](http://127.0.0.1:3977).

Blue leads identity, headings, destinations and tonal structure. Orange and magenta participate
through independently composed type, lines, frames, shapes, controls and surfaces. Neutrals
give reading and task content distinct planes. No section owns an accent; no percentage or
one-accent-per-section limit governs composition. The usage guide contains the complete
palette, representative examples and extension process.

Bright decorative cyan, orange and magenta were aligned to agency estimates on 8 November 2026;
functional blues and readable deep accent shades remain separate. See the usage guide for
the source qualification, measured contrast and meeting explanation.

## Sources and maintenance

The [application token manifest](../../../apps/web/src/design-system/tokens/tokens.json) is the
runtime authority. The catalog's `palette.json` generates `palette-data.js` and `tokens.css`:
run `python3 docs/brand/color-catalog/generate.py` from the repository root.
Changing catalog data does not update runtime tokens. Reconcile both sources when values change,
regenerate consumers and verify affected pairings and states.

The catalog uses repository fonts and logos, with no external font or script request. Digital
values do not establish historical logo colors. Original artwork stays intact. Flat-color
checks do not establish complete accessibility. Print color needs profile-specific proofing.

## Historical review material

The [original role mapping](color-role-mapping.md), [chapter direction](composition-direction.md)
and [standalone component study](component-study.html) record earlier experiments. Their
section-color prescriptions are superseded by the client correction and revised implementation.
The [initial adoption review](homepage-adoption.md) and [review agreement](review-agreement.md)
retain dated findings; finalization does not imply a new expert consensus.
The PDF is the older v1.1 snapshot, not the final website usage guide.

The [client correction](composition-review-2026-11-04.md) explains why surface and accent were
separated. Its comparison and rollout are implemented. The local preview remains distinct
from production publication and hospital content approval.

Run `pnpm composition:preview` to open the loopback composition archive. Review evidence is kept outside the deployable application.
