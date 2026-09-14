# Global Shell and Navigation Architecture

**Backlog authority:** `B01-006`  
**Status:** Complete for controlled development; production and publication gates remain open

## Boundary

The production shell exports server-rendered header, primary navigation, breadcrumb, language,
skip-link, main, and footer components from `apps/web/src/design-system/components/`. It consumes
the canonical generated token layers and the completed `B01-005` action APIs. The controlled root
fixture proves the component contract without mounting proposed public routes or introducing real
hospital facts, contacts, translations, providers, collection, or external assets.

## Responsive navigation model

One `nav` list is used at every viewport. Wide layouts place that list directly in the header grid.
Compact layouts expose the same list through the browser-native Popover API. This prevents desktop
and mobile copies from drifting in route order, current-page state, accessible names, or content.

The native trigger and `popover="auto"` baseline work without JavaScript. Escape and light-dismiss
behavior remain browser-owned. A deferred first-party script served from `/shell-navigation.js`
adds only three enhancements:

- reflect the native open state in explicit `aria-expanded` markup;
- restore focus to the trigger when Escape closes a menu containing focus;
- close and restore before a navigation link continues its normal browser behavior.

The script makes no request, stores no state, reads no visitor input, and is allowed by the existing
strict same-origin Content Security Policy. It avoids the nonce-driven dynamic-rendering tradeoff
that a hydrated React client boundary would impose on the currently static route.

## Component contracts

- `SiteShell` owns one skip target, one main landmark, and the footer boundary.
- `SiteHeader` accepts governed route labels, an optional governed brand-mark slot, and action slots;
  it does not invent or own hospital identity assets or facts.
- `PrimaryNavigation` emits a semantic list and an `aria-current="page"` state with a persistent
  border marker.
- `Breadcrumbs` wraps naturally and represents the current item as text.
- `LanguageSwitcher` uses each language name in its own language, never a flag. An unavailable
  equivalent is non-interactive and programmatically associated with its reason.
- `SiteFooter` repeats fallback task and governance routes without becoming their only location.

All interactive targets use the canonical 44 CSS px minimum. Compact, wide, 200%/400% reflow,
200% text, reduced-motion, forced-colors, and print behavior are covered by automated rendered
checks. Final route labels remain governed by `LANG-01`; verified contact data remains governed by
`SAFE-01`.

## Evidence and residual gates

The repeatable source contract is `pnpm shell:check`; the rendered matrix is `pnpm shell:smoke`.
Sanitized captures and results are indexed in the
[`B01-006` evidence record](../backlog/evidence/B01-006-global-shell-navigation-2026-09-14.md).
Physical-device, screen-reader, switch-control, professional Amharic, final-content, and production
acceptance remain outside this controlled implementation result.
