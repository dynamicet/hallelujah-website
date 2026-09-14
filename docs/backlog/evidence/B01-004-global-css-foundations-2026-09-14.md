# `B01-004` Global CSS Foundations — Local Evidence

**Recorded:** 14 September 2026, Africa/Addis_Ababa

**Result:** Local `T0` passed; hosted `T1` pending GitHub authentication

## Evidence summary

| Area | Result |
| --- | --- |
| Canonical contract | Manifest `0.3.0` generates 209 primitive/semantic/component tokens; drift and consumer checks pass. |
| Contrast metadata | 13 text, action, status, focus, and meaningful-boundary pairs pass their recorded 4.5:1 or 3:1 minimum. |
| Responsive/reflow | 320, 360, 375, 667 × 375 landscape, 768, 1280, 1440, 200%/400% viewport equivalents, and 200% root-text enlargement pass without page overflow or detected clipping. |
| Typography | Immediate system fallbacks render; `lang="am"` computes the approved Noto Sans Ethiopic-first stack; body line height remains at least 1.5. No font binary or final public Amharic copy is claimed. |
| Interaction | The representative control measures at least 44 × 44 CSS px and retains a visible 3 px focus indicator in default and forced-colors modes. |
| Resilience | Essential fixture content is server rendered without image, custom-font, or non-essential JavaScript dependence. |
| Media modes | Enhanced motion duration computes to zero for reduced motion; print uses a white shadow-free surface; forced colors uses system focus/link colors and no decorative shadow. |
| Performance | Production build remains one static application page, zero external origins, 8 initial requests, and within existing compressed JavaScript/transfer budgets. |
| Visual review | [320px](b01-004-rendered/b01-004-foundations-320.png) and [1440px](b01-004-rendered/b01-004-foundations-1440.png) screenshots were inspected after the enlarged-text overflow correction. |

## Performed commands

```sh
pnpm tokens:generate
pnpm tokens:check
pnpm foundations:check
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm accessibility:smoke
pnpm budgets:smoke
pnpm foundations:smoke -- --capture-dir docs/backlog/evidence/b01-004-rendered
pnpm verify
pnpm secrets:check --history
pnpm audit:dependencies
```

The first enlarged-text rendered run found 40 px of horizontal page overflow caused by intrinsic
flex/grid sizing around the long representative link. The global touch-target and controlled
surface contracts were corrected with explicit minimum-width, maximum-width, and wrapping rules;
the expanded rendered matrix then passed. Chromium reports a zero duration as `0s`, so the check
correctly tests numeric zero instead of requiring the authored `0ms` serialization.

The complete `pnpm verify` sequence passed in its production order. Reachable-history secret
scanning passed. The first dependency-audit attempt was denied complete registry access by the
restricted network boundary; the approved network-enabled rerun passed across 650 dependencies
with zero moderate, high, or critical known vulnerabilities.

## Evidence boundary and residual gates

- The screenshots contain only controlled-development fixture text and no personal, clinical,
  operational, credential, or restricted evidence.
- The `gh` client reported an invalid configured credential, so no issue, push, pull request, or
  hosted current-head run is claimed in this record.
- The local browser is Chromium 152 from the installed Snap payload. This is implementation smoke,
  not the final physical-device/browser matrix required for production acceptance.
- Approved Noto and logo binaries remain outside the repository until verified ingestion under
  `B02-011`; system fallback rendering does not prove those final files.
- Public Amharic copy, publication, providers, personal-data collection, deployment, DNS, and
  production authority remain unchanged and unavailable.
