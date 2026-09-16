# Controlled component review harness

`B01-013` reviews the actual built, server-rendered component fixtures through a separate
loopback-only Node server. Its code lives under `scripts/`; application code cannot import its
inventory, stress text or review controls. No application route or production runtime is added.

## Review surface

After `pnpm build`, `pnpm review-harness:serve` starts a temporary local application with collection
and providers disabled, then exposes `http://127.0.0.1:3213`. Stop it with Ctrl+C; both servers close.
The index links the nine specimen groups and exposes a state inventory, language mode and byte
report. English keeps original source wording. Amharic mode adds explicitly unreviewed Ethiopic
shaping spans beside English text throughout the specimens; input values, IDs and relationships
remain literal. This stress mode supports wrapping/glyph review and cannot certify translation.

The review server removes Next hydration scripts/flight data and JavaScript preloads from its copy
of the built HTML, retaining existing first-party component enhancements and compiled CSS. Thus
review markup does not conflict with hydration. The production application is still verified
independently with its normal framework runtime, CSP and asset budgets.

## Network and publication boundary

Only an HTTP `127.0.0.1` upstream and loopback Host are accepted. The server admits the root
specimen, health, compiled assets discovered in built HTML, existing first-party enhancements,
abstract fixture media, and review CSS/report. Unknown routes, ambiguous language state,
unsupported query keys and overlong values fail closed. Only bounded `q`, `type`, `page` reach
the application's existing allowlisted search adapter; `review-language` stays in review tooling.
POST is rejected before an upstream request or body processing. No credentials/cookies are
forwarded, redirects followed, external providers enabled, or restricted evidence logged.

Every response has no-store, noindex/nofollow/noarchive, nosniff and no-referrer headers. The review
CSP allows local scripts/styles/fonts/images/media, denies connections and framing, and keeps
forms first-party; unconditional POST rejection provides the collection boundary. No robots or
header claim substitutes for the automated application-source exclusion check.

## Evidence

`pnpm review-harness:check` inventories every exported rendering component, proves all protected
context/area/requested-level combinations remain Level 0, checks application-source exclusion,
preserves literal input values, and tests negative HTTP boundaries against a synthetic upstream.

`pnpm review-harness:smoke` runs the existing full component interaction suite through the harness,
then 90 language/capability/viewport cases and bilingual actual-media-end/page-exit/history checks.
It validates group anchors, duplicate IDs, label/description relationships, shaping coverage,
reflow, static media, no-JavaScript collection locks, preferences and zero external/pre-intent media
requests. Optional captures cover each group plus the actual shell header/footer at 320 and 1440 in both modes; JSON records browser
version, results, initial gzip budgets, motion-runtime bytes and separately activated media.

Blocked image/font coverage tests dependency loss. No custom font or authentic image is present
at this stage, so later asset intake must repeat rendered fallback checks with actual approved
assets. Resize/text/preference/touch emulation is local `T0` evidence; it cannot certify actual
browser zoom, physical devices, human screen readers, translation/comprehension or production
LCP/INP/long-task acceptance. Unknown-outcome appointment workflow remains gated; the review
inventory exercises its existing protected motion contract rather than inventing a workflow.

Sanitized evidence follows deferred `B00-015` repository handling. Reopen affected cases whenever
components, states, languages, assets, runtimes, capabilities or the working matrix change.
