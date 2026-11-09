# CI browser startup diagnosis — 2026-11-09

The [first main run after PR 93](https://github.com/dynamicet/hallelujah-website/actions/runs/42577765029/attempts/1)
passed dependency auditing, source checks, tests, the application build, build
isolation, accessibility and budget smoke checks, and the runtime smoke check.
It stopped at `review-harness:smoke`: Chromium did not expose the polled DevTools
endpoint within the startup budget. Database integration and clean reconstruction
were consequently skipped. Vercel runs the application build, which does not
include this browser test.

The same source passed the preceding pull-request CI run and a fresh local harness
run. The failed run hid Chromium's captured output, so its exact operating-system
or browser failure cannot be established retrospectively. A port collision or a
transient runner failure is a hypothesis, not a confirmed cause.

The focused launcher change lets Chromium bind an available debugging port and
reads its announced loopback endpoint. It also honors `CHROME_PATH`, prints the
selected browser and version, handles spawn errors and signal termination, and
prints up to 8,000 characters of browser diagnostics on failure. Application
server output remains private. The existing startup budget and application
assertions are unchanged; failures still fail the job, with no automatic retry.

## Local verification

- The unchanged full review harness passed its 92-case matrix.
- The updated launcher also passed the full 92-case review harness matrix.
- Four controlled startup fixtures correctly failed: exit code 17, SIGTERM,
  missing executable, and a running process that never announces DevTools.
  Exit, signal and timeout cases retained their diagnostic marker. These also
  exercised the `CHROME_PATH` override and free-port launch argument.
- Lint, formatting, local links, CI policy, all 16 CI control negative cases,
  and the review harness contract passed.

No application markup, styling, deployment configuration, dependency graph, or
required CI gate changed. This is browser automation verification, not a new
visual-quality or accessibility certification.

## Deferred CI simplification

`pnpm verify` currently chains 36 commands inside one workflow step. The workflow
also runs CI controls and secret scanning separately, and reconstructs the build
after the initial build. A separate follow-up should separate the small required
application checks from the larger database, browser, historical-policy and
reconstruction suites, remove redundant work, and expose clear step-level failures.
That restructuring is outside this focused startup fix.
