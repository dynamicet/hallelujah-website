# Visual verification

Visual checks are repository tooling and are independent of design skills. Any agent
or skill working here can use them. Honor the user's skill preferences; do not
invoke a design skill merely to capture screenshots or verify behavior.

- Start the site with `pnpm dev`, then run `pnpm visual:check / /doctors` (substitute
  the routes changed). Set `HH_PREVIEW_URL` when using another local preview port.
- Chromium must be installed. Use `CHROME_PATH` to select its executable.
- Inspect the fresh screenshots at mobile, tablet, and desktop widths. Automated
  assertions cover basic structure, overflow, broken images, and browser errors;
  they do not establish visual quality, keyboard usability, or accessibility.
- Check relevant interactions, keyboard focus, and reduced-motion behavior for the
  change. The existing hero, motion, and journey checks are available when relevant;
  they encode specific page contracts and can become outdated as the design changes.
- Each shared visual command creates a unique directory under
  `artifacts/visual-checks/`, with `run.json` recording the commit, tracked working
  tree dirty state, preview URL, times, and result. A screenshot is evidence only
  for the preview actually inspected; the commit metadata does not prove the
  server is serving that commit. Confirm the preview is current.
- Historical screenshots, reports, and prior pass claims cannot establish that
  current work passes. Capture again after changes. Never reuse old captures as
  current evidence. Interrupted runs retain `running` status and are not passes.
- Report automated results and visual inspection separately. Open the generated
  images before claiming visual inspection. Record findings in the run directory;
  leave `visualInspection` as `pending` until inspection is actually completed.

See [the visual-check guide](docs/visual-checks.md) for commands and limitations.
