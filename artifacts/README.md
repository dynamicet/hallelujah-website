# Local artifacts

Generated review output belongs under `artifacts/`. This directory is Git-ignored:
screenshots, browser profiles, and exploratory captures stay local. Existing tracked
artifacts remain tracked; this policy does not remove them or rewrite history.

Keep reusable capture scripts outside this directory, for example under
`apps/web/scripts/`. Commit small machine-readable reports selectively when they
provide lasting evidence, preferably beside the relevant documentation. Avoid
committing browser caches or machine-specific exploratory scripts.

Regenerate visual captures from the repository root, for example:

```sh
VISUAL_CAPTURE_WIDTHS=320,360,768,1280,1440 \
  node apps/web/scripts/capture-visual-baseline.mjs \
  artifacts/visual/visual-review emergency
```

Product assets and intentionally maintained visual-regression baselines do not belong here.
