# Local artifacts

Generated visual captures belong under `artifacts/visual/`. That directory is intentionally
Git-ignored: screenshots are local review output, not repository source or durable acceptance
evidence.

Keep capture scripts and machine-readable JSON reports in Git. Regenerate screenshots from the
repository root with the command recorded beside the relevant report. For example:

```sh
VISUAL_CAPTURE_WIDTHS=320,360,768,1280,1440 \
  node apps/web/scripts/capture-visual-baseline.mjs \
  artifacts/visual/visual-review emergency
```

Product assets and intentionally maintained visual-regression baselines do not belong here.
