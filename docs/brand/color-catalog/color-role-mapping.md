# Website color-role mapping

**Document status — deliverable 6:** Historical role-mapping study. Chapter-color prescriptions are superseded. Contrast restrictions remain useful for their specified pairs. Use the [current usage guide](../usage-guide.md).

**Client review update:** Read the [composition correction](composition-review-2026-11-04.md)
before using this mapping. Semantic roles and contrast restrictions remain useful; the
section-color prescriptions require revised visual studies before website-wide adoption.

4 November 2026 · Adoption specification and component-study checklist.

**Adoption update:** The application manifest, generated CSS/TypeScript, public aliases,
shared actions, and homepage now implement these roles. See the [homepage adoption review](homepage-adoption.md).
The following specification and staged checklist retain the context of the preceding study;
recommendations marked new are now implemented unless explicitly deferred in the adoption review.

The current [HTML catalog](index.html), its [palette](palette.json), and loaded [tokens](tokens.css) define the color direction. Brand Guardian, UI Designer, and UX Architect agreed on these application rules; the Accessibility Auditor reviewed the resulting study without a source-proven blocker. The [review agreement](review-agreement.md) records the original study decisions and validation limits. Brand documents label earlier color rules historical; application tokens and the homepage now use this direction.

Keep the curated anchor hues, natural photography, original logo artwork, existing layouts, typography, content, and interaction behavior. This work establishes how colors reach the existing components.

## Composition refinement

The [composition direction](composition-direction.md) extends this mapping beyond functional controls. Use deep blue as a substantial brand field, peach and pink as distinct editorial environments, and saturated orange/magenta for deliberate frames, statement panels, typographic emphasis, and details. These are approved uses of the existing families, not additional hues. The revised study demonstrates section rhythm alongside rules, outlined rows, inset surfaces, and expressive text. The previous 75/15/10 example is not an acceptance target or a cap on colored area.

Primary actions use white on blue in light contexts and deep blue on white in inverse contexts. Decorative orange does not automatically become a button. Magenta may occupy a whole editorial panel with white ordinary text (4.86:1); its occasional use describes frequency, not a restriction to small marks. Deep magenta on pale pink and deep orange on pale peach support both headings and body copy. There is no blanket prohibition on colored text, lines, borders, boxes, or shades; give each a compositional or functional purpose and verify its actual pairing.

## Target roles

Catalog names below refer to `--hh-*` tokens. Application semantic paths refer to the existing `tokens.json` manifest. New paths are explicitly marked **new**; they are recommendations for later implementation, not declarations already present in the app.

| Current application role | Catalog target | Value | Adoption decision |
| --- | --- | --- | --- |
| `semantic.color.surface.page` | `surface-page` / `paper` | `#FBF8F6` | Main canvas |
| `semantic.color.surface.raised` | `surface-raised` / `white` | `#FFFFFF` | Content panels and form fields |
| `semantic.color.surface.subtle` | `surface-subtle` / `blue-50` | `#EAF5F9` | Quiet grouping |
| Selected surfaces, currently component-specific | `blue-100` | `#D5EAF2` | Add **new** `semantic.color.surface.selected`; use words, shape, or selection indicator as well |
| Decorative pale fills, currently mint/cyan/teal | `blue-200` | `#A8D3E4` | Decorative use; deep-blue text if content is placed on this fill |
| `semantic.color.surface.inverse` | `surface-inverse` / `blue-800` | `#00445D` | Footer and deliberate closing fields |
| `semantic.color.text.heading` | `text-heading` / `blue-800` | `#00445D` | Headings |
| `semantic.color.text.primary` | `text-primary` / `ink` | `#17313D` | Ordinary reading and essential information |
| `semantic.color.text.secondary` | `text-secondary` / `muted` | `#52636B` | Supporting text |
| Ordinary links currently inheriting action primary or text accent | `text-link` / `blue-700` | `#00678D` | Add **new** `semantic.color.text.link`; bind ordinary links independently from filled actions |
| `semantic.color.action.primary` | `action-primary` / `blue-600` | `#0078A6` | Main filled action |
| `semantic.color.action.primary-hover` | `action-hover` / `blue-700` | `#00678D` | Main filled action hover |
| `semantic.color.action.primary-active` | `action-active` / `blue-800` | `#00445D` | Main filled action pressed |
| `semantic.color.action.on-solid`, `semantic.color.text.inverse` | `text-inverse` / `white` | `#FFFFFF` | Labels on primary/strong/deep blue; inverse body and links |
| `semantic.color.text.inverse-muted` | `blue-100` | `#D5EAF2` | Supporting text on deep blue; verify actual rendered pairing |
| `semantic.color.border.default` | `border-subtle` / `border` | `#CBD8DE` | Decorative dividers only |
| `semantic.color.border.strong` | `border-control` / `control` | `#718892` | Meaningful boundaries on supported light surfaces; do not apply directly against blue veil or blue air |
| `semantic.color.focus` | `focus` / `blue-800` | `#00445D` | Light-context focus color; geometry and inverse treatment are specified below |
| `semantic.color.text.information`, `semantic.color.surface.information` | `status-info`, `blue-50` | `#00678D` / `#EAF5F9` | Information |
| `semantic.color.text.success`, `semantic.color.surface.success` | `status-success`, `success-tint` | `#24634B` / `#EEF7F1` | Actual success state |
| `semantic.color.text.warning`, `semantic.color.surface.warning` | `status-warning`, `warning-tint` | `#80530C` / `#FFF6E5` | Actual caution state |
| `semantic.color.text.error`, `semantic.color.surface.error` | `status-error`, `error-tint` | `#A33330` / `#FBEFED` | Validation/error state |
| `semantic.color.action.emergency` | `status-urgent` | `#A33330` | Urgent access; retain separate urgency and error aliases |
| Emergency hover/active | `status-urgent` | `#A33330` | Catalog defines no separate red shades; preserve the anchor and demonstrate distinguishable hover/press feedback without inventing new palette values |
| `semantic.color.brand.cool`, `semantic.presentation.story-blue` | `blue-600` | `#0078A6` | Identity moments; classify current uses before rebinding |
| `semantic.color.brand.navy`, `semantic.presentation.story-ink` | `blue-800` | `#00445D` | Deep identity/structure |
| `semantic.color.brand.warm` | `accent-supporting` / `orange` | `#F26522` | Main supporting accent; companions `#FFF0E7` and `#A8430C` |
| No complete existing expressive family | `accent-expressive` / `magenta` | `#D81B72` | Add expressive family with `#FCEAF2` and `#A61558`; occasional editorial use |

The current `semantic.color.text.accent` is ambiguous: classify its consumers. Ordinary links move to the independent link role; brand emphasis receives an explicit supporting or expressive role. Do not turn every text-accent consumer into orange or magenta.

## Public-site aliases and overloaded consumers

The website currently combines two paths: generated semantic/component tokens and public `--site-*` aliases. [styles.css](../../../apps/web/src/app/styles.css) imports the generated layer and [editorial.css](../../../apps/web/src/app/editorial.css); [intentional.css](../../../apps/web/src/app/intentional.css) subsequently replaces several public aliases with literal colors. [layout.tsx](../../../apps/web/src/app/layout.tsx) supplies the stylesheet sequence. Both paths must resolve to the same target roles.

| Existing public role | Target and consumer treatment |
| --- | --- |
| `--site-ground` | Page surface: warm paper |
| `--site-white` | Raised/content surface: clear white |
| `--site-pale` | Quiet section: blue mist; selected components use a separate blue-veil role |
| `--site-muted` | Supporting text: slate |
| `--site-link` | Ordinary light-surface links: strong blue; filled-action hover gets its own alias even though the value currently matches |
| `--site-urgent` | Urgent access: muted red; form error uses a separate error alias |
| `--site-ink` | Split by use: heading `#00445D`, body `#17313D`, primary action `#0078A6`, inverse field `#00445D`. Retain as a temporary heading alias only after its consumers have been classified |
| `--site-accent` | Split by use: quiet hover/selection fill → blue veil; inverse link emphasis → tested light inverse color; supporting brand accent → orange. No global mint-to-orange replacement |

Recommended public aliases for that split: `--site-heading-ink`, `--site-reading-ink`, `--site-action-primary`, `--site-action-hover`, `--site-action-active`, `--site-surface-inverse`, `--site-selection`, `--site-link-inverse`, and explicit supporting/expressive accent aliases. Bind them to application semantic roles rather than repeating hex values in component styles.

Concrete consumers that demonstrate why a split is necessary:

- [hospital-shell.module.css](../../../apps/web/src/design-system/components/hospital-shell.module.css) uses `--site-ink` for navigation text, appointment actions, and footer content.
- [intentional.css](../../../apps/web/src/app/intentional.css) uses it for the footer field and appointment submit/continue actions.
- [home-enhancement.css](../../../apps/web/src/app/home-enhancement.css) uses it for search actions and large statistics fields, and uses `--site-accent` for links inside inverse content.
- [website.css](../../../apps/web/src/app/website.css) uses `--site-accent` for filled content, hover feedback, and some directory links. Each usage needs its intended role established before rebinding.

## Approved study pairings and restrictions

| Component or context | Foreground / background | Rule |
| --- | --- | --- |
| Reading text | Reading ink / warm paper or white | Default reading treatment |
| Supporting text | Slate / white, warm paper, or blue mist | Keep at readable size; verify the actual study rendering |
| Headings | Deep blue / white, warm paper, blue mist, blue veil, or blue air | Deep blue provides structure |
| Ordinary links | Strong blue / white, warm paper, blue mist, or blue veil | Underline ordinary content links; preserve discernible interaction states |
| Main filled action | White / primary blue, strong-blue hover, deep-blue pressed | Primary fill is independent of link text |
| Inverse field | White / deep blue | Inverse links retain visible link cues; do not inherit strong blue on deep blue |
| Field boundary | Control edge with white field interior; surrounding panel white, warm paper, or blue mist | Test both adjacent colors; keep fields in these supported contexts |
| Quiet divider | Quiet edge / light field | Decorative only; cannot supply the sole input boundary |
| Supporting orange content | Deep orange / pale orange | Approved ordinary-text accent treatment; anchor orange is a decorative supporting fill/detail |
| Expressive editorial content | Deep magenta / pale magenta, or white / anchor magenta | Occasional editorial use; no form state, emergency, or primary-action meaning |
| Status message | Named status foreground / its matching tint | Visible words communicate the actual outcome or condition |

Do not use white or reading ink as ordinary small text on anchor orange: the respective ratios are about 3.15:1 and 4.32:1. Primary blue on blue mist is about 4.47:1 and fails normal-text contrast. Strong blue on blue air also fails normal-text contrast; use deep blue there. Control edge against blue veil is about 2.994:1, below 3:1; rounded display values must not turn that into a pass. Blue air is decorative, not a general field surface.

Preserve natural image color. Existing dark photography scrims and media overlays need individual review at actual crops, viewport widths, and interaction states. A fixed palette swatch does not establish text contrast over an image.

## Focus, validation, and state geometry

- On supported light surfaces, use a 3px deep-blue outline, offset 4px from the control, with a 4px opaque white separation. Check the ring is not clipped by rounded containers, overflow rules, sticky headers, or adjacent content.
- On deep-blue surfaces, use a 3px white outline. A white control on an inverse field needs a deep-blue separation gap so its boundary, gap, and white ring remain distinguishable.
- On primary-blue fields, use the catalog's white outline and deep-blue separation treatment. Verify the actual control/field combination rather than assuming all inverse contexts are identical.
- Keep a persistent, visible focus state for keyboard interaction. Forced-colors/system overrides must preserve discernible controls and focus; palette values must not override those accessibility modes.
- Form errors use the error alias, explanatory words, and `aria-invalid` association. The study should demonstrate the invalid field boundary in addition to the message. Urgent routing keeps distinct wording and placement despite sharing the red primitive.
- Disabled controls remain recognizable and expose their unavailable state. Hover, pressed, selected, loading, and validation states preserve their existing behavior and do not rely on color alone.

## Staged adoption

1. **Complete the representative study.** Apply these roles to existing component compositions: header/navigation, primary and secondary actions, care card/directory, appointment field/error/success, urgent access, a restrained orange supporting moment, an occasional magenta editorial moment, and footer. Keep layout/type intact. This study is the current authorized implementation scope; the active app remains unchanged.
2. **Reconcile the records.** Once reviewers agree on the study, update or supersede current brand guidance, the machine-readable brand record, and presentation-direction rules. Historical evidence can remain clearly identified as historical. Record the catalog's digital-master status without claiming a recovered historical logo color.
3. **Update the existing application manifest.** In the later adoption step, transfer approved primitives and semantic roles into [the application token manifest](../../../apps/web/src/design-system/tokens/tokens.json). Follow its primitive → semantic → component reference rules. Use [the generator](../../../apps/web/scripts/generate-design-tokens.mjs) to regenerate CSS and TypeScript together. Do not hand-edit generated outputs or add an independent permanent `--hh-*` application theme.
4. **Rebind public aliases and classified consumers.** Remove or replace competing color overrides in editorial/intentional styles, split overloaded roles, and preserve unrelated layout/type/motion rules. Inspect literal color values by purpose, including contextual focus and image scrims; avoid global hex replacement.
5. **Verify representative routes before wider application.** Run token generation/drift checks and relevant existing component checks, then inspect real rendered header/home, care discovery, appointment, urgent access, and footer contexts. Broaden only where other consumers or failures justify it.

## Study review checklist

- [ ] Blue leads; orange supports; magenta appears only in a deliberate editorial moment. The 75/15/10 surface guidance remains a composition aid, not a quota.
- [ ] Existing composition, type, content, logo artwork, natural photography, and task behavior are preserved.
- [ ] Heading, body, primary action, link text, inverse field, selection, and accent roles are distinct in the implementation.
- [ ] Ordinary links on all four approved light surfaces use strong blue; inverse links use light treatment.
- [ ] Filled actions show primary/hover/pressed states with legible labels; secondary actions remain distinct.
- [ ] White fields show a meaningful control boundary; decorative dividers never substitute for it.
- [ ] Focus is visible in light, blue, and deep-blue contexts and remains unclipped at desktop, tablet, mobile, and zoomed layouts.
- [ ] Invalid, successful, unavailable, selected, and urgent specimens pair visible words with their visual treatment.
- [ ] Orange and magenta examples follow the approved text/fill restrictions; status colors retain their meaning.
- [ ] Text/image combinations are checked at actual crops; screenshots alone are not treated as complete accessibility certification.
- [ ] Generated tokens, public aliases, and component bindings agree; no old cyan/teal/mint family leaks through unrelated overrides.
- [ ] Brand Guardian, UI Designer, UX Architect, and Accessibility Auditor findings are reconciled before active website adoption; record any unresolved issue explicitly.
