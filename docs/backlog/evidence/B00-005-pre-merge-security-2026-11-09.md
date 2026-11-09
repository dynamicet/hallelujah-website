# B00-005 / B00-011 — 9 November 2026 pre-merge verification

Scope: the client's instruction to run all checks before a pull request and merge
to main. Changes repair verification and dependency blockers on `fix/internal-review`.
No live collection, external provider activation, database deployment, or production
approval is introduced.

## Dependency remediation

The initial registry report contained 7 moderate, 7 high, 3 critical, and 4 low
advisories. Exact updates:

| Dependency | Previous | Updated |
| --- | --- | --- |
| Next.js and eslint-config-next | 16.3.8 | 16.4.1 |
| DOMPurify override | 3.4.16 | 3.4.17 |
| Payload's undici override | 7.29.1 | 7.30.1 |
| AJV's fast-uri override | 3.1.8 | 3.1.9 |
| React Hooks ESLint plugin's Zod | transitive vulnerable release | 4.6.6 |
| minimatch 7–10 | transitive vulnerable release | 11.0.1 |

The existing Next ESLint directory-discovery compatibility patch is carried forward
unchanged to 16.4.1 and its regression check passes. The canonical toolchain record,
manifests, and regenerated pnpm lockfile agree. Payload remains 3.90.0; its Next.js
peer range includes the update. Node, pnpm, PostgreSQL, images, and migrations are
unchanged.

Registry audit after remediation: 646 dependencies, zero moderate/high/critical,
one low advisory. The remaining advisory is
[deepmerge prototype poisoning, GHSA-gcqx-w48m-w2h4](https://github.com/advisories/GHSA-gcqx-w48m-w2h4),
which has no published fix. This is retained and disclosed, not an advisory-free
claim.

The audit wrapper previously treated every nonzero pnpm exit as a blocking
advisory, despite B00-011 defining a moderate-or-higher threshold. Pinned pnpm
10.27.0's JSON branch returns 1 for any advisory before applying `--audit-level`.
The wrapper now explicitly requests the policy level and accepts exit 1 only with
a complete matching low/informational advisory list and no report error.
Moderate/high/critical counts, malformed/missing reports, inconsistent advisory
counts, and unexpected command failures remain blocking. Sixteen CI control cases
pass, including these audit cases and the existing negative mutations.

## Verification repairs

- Source comments point to the narrative-source record without introducing
  runtime URL exceptions. Only the existing exact OpenStreetMap copyright target
  is accepted in the map component; negative URL and prefix-extension cases remain
  rejected.
- Generated visual JSON now ends with a newline, as required by the format gate.
  Existing ignored evidence was normalized without deleting or changing results.
- Clean rebuild excludes local generated review/profile directories, which can
  contain Chromium sockets and are not production build inputs.
- Usability and cross-browser checks follow the current enabled language picker,
  full health-topic browser, story cinema dialog, native About film, and equipment
  disclosures. The translated service filter assertion follows the existing
  “Apply filters” message. No translation was changed.
- Forced-colors critical status panels regain a visible 3px double boundary.
- The public demo's privacy-route link is restricted to the demo journey; controlled
  appointment forms retain their supplied in-place privacy disclosure and inert
  fixture navigation contract.
- Motion checks reflect static care boundaries, complete portraits inside the
  horizontal specialist rail, and the story reading-position handoff. Story image
  scroll progress and keyboard browsing remain covered. The usability check waits
  for the story section's intersection-triggered controller before activation.

## Current local evidence

- `pnpm audit:dependencies`: passed at the documented threshold, with the low
  advisory above disclosed.
- `pnpm secrets:check --history`: passed.
- `pnpm appointment:db-local`: passed, including role isolation and independent
  synthetic backup/restore.
- `pnpm rebuild:verify`: passed; full lockfile graph SHA-256
  `d4ed1f8a7a2a926572d9060d29c6fdcfb897cb3540734f8015f11c8e15a0d189`;
  workspace importer graph SHA-256
  `0cbd22c4ae26c581063fe42e0bb99431fe802ceef8d507e096209e1cb8be7520`.
- Fresh development responsive run `2026-11-09T06-18-05.881Z-responsive-P4Wxwl`:
  20 public page patterns at 390/768/1440px, all 60 automated combinations passed.
  All 20 derived three-width sheets were opened and inspected; no blocking visual
  defect was found. Long pages were reviewed at overview scale. The run directory
  contains the separate visual findings and inspected-file list.

Additional completed checks:

- Full disposable CMS/PostgreSQL suite: authenticated workflows, asset governance,
  content transfer, concurrency/rollback, role revocation, timed lifecycle,
  retirement, and database isolation passed.
- All five rendered clinician directory/profile/service smoke and validation
  stages passed. The corrected appointment matrix passed all 284 cases.
- Standalone care journeys and patient-guide browser checks passed.
- Chromium interaction checks passed for contact, interface language/loading,
  featured specialists, hero/motion, media/stories, editorial/reading, menus,
  directory feedback, clinician transitions, disclosures, choreography, signature
  scenes, care continuity, appointments, Help, site quality, usability, intentional
  journeys, and journey quality. Rendered color contexts passed at all three widths.
- Firefox motion/story/media/equipment/menu checks passed at all three widths.
  WebKit could not launch: the host lacks its required ICU 74, libxml2, woff2,
  libvpx, libevent, and libavif libraries. This remains a blocked optional engine
  check, not a full cross-browser pass.
- Optional `pnpm assets:malware:check` could not start because `clamscan` is not
  installed. Synthetic scanner contracts and full asset-governance/database checks
  passed; no real malware-scanner acceptance is claimed.
- Fresh post-correction component/home run
  `2026-11-09T06-24-32.202Z-responsive-TBcn4H`, forced-colors run
  `2026-11-09T06-26-03.597Z-forced-colors-status-retest-PScCqW`, and final appointment
  run `2026-11-09T06-36-58.321Z-responsive-c1uVjq` passed automated checks; their
  generated three-width sheets/status captures were opened and visual findings
  recorded separately.

Final results:

- `ASSET_FORMAT_PYTHON=/tmp/hallelujah-asset-tools/bin/python pnpm verify`: passed
  in one complete final run, including lint, types, tests, build, content isolation,
  accessibility/budgets/runtime, review harness, and every rendered smoke stage.
- Final-source `pnpm rebuild:verify`: passed with the graph hashes above.
- `pnpm build:demo` and local `HH_PREVIEW_URL=http://localhost:3002 pnpm staging:smoke`:
  passed; all sampled routes, health, unknown-route 404s, and disabled collection
  behaved as expected.
- Optimized-demo responsive run `2026-11-09T06-56-39.649Z-responsive-unF5v9`:
  12 homepage/appointment/privacy/component-library combinations passed; all four
  three-width sheets were opened and found free of blocking visual regressions.
- Isolated `pnpm visual:clinician-playback`: all 12 width/CPU/repeat samples passed
  the 20ms mean-frame budget, at 16.66–16.67ms mean. The run was executed after
  other browser suites finished. This measures local main-thread opportunities,
  not physical GPU delivery.
- Generated test evidence was preserved under ignored
  `artifacts/pre-merge-2026-11-09/generated-evidence/`; historical committed evidence
  overwritten by tests was restored from the original revision.

Automated passes do not establish full WCAG conformance, assistive-technology
coverage, or physical-device performance. The WebKit, ClamAV, and low-advisory
limitations above remain explicit.

## Hosted clean-checkout follow-up

[PR run 42576398607](https://github.com/dynamicet/hallelujah-website/actions/runs/42576398607)
passed installation, CI controls, history scanning, and the dependency audit, then
found three historical documentation links whose ignored targets existed locally
but were absent from the clean checkout. Those references now explicitly identify
unavailable archives, preserving their filenames without claiming retrievable
evidence. The link checker remains unchanged. A separate archive of the committed
tree is used to verify the correction without local ignored files.
