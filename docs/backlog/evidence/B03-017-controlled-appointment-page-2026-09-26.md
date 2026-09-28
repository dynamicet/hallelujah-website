# B03-017 Controlled Appointment Page Evidence — 26 September 2026

| Field | Result |
| --- | --- |
| Branch | `b03-017-appointment-page` |
| Scope | Synthetic English local T0 and private hosted T1 preparation only |
| Status | Done for controlled development; exact-main closeout complete |
| Tracking | [issue #74](https://github.com/dynamicet/hallelujah-website/issues/74) |
| Review | [PR #75](https://github.com/dynamicet/hallelujah-website/pull/75) |
| Collection | Disabled; no public Appointment route or token issuer exists |
| Providers | Disabled; no WhatsApp, Telegram or other external request exists |
| Production/publication authority | Not granted |

## Focused passing evidence

| Check | Result |
| --- | --- |
| `pnpm appointment-page:check` | Pass: 20 controlled SSR, state, isolation, escaping and canonical-token cases across editing, validation, pending, known failure, unknown, duplicate, receipt, delivery warning, unavailable and expanded-content fixtures |
| `pnpm appointment-page:smoke -- --capture` | Pass: 284 responsive, capability, interaction, accessibility and isolation cases across 320/360/768/1440 px; default, no-JS, reduced-motion, forced-colors, print, 200% text and no-CSS |
| Browser interaction | Pass: linked error-summary focus, four initial errors, retained corrected values, exclusive doctor/service selectors, pending-to-known-failure focus, and zero request during local submission |
| Accessibility tree | Pass: Appointment H1, safety warning, request details, privacy boundary and request-state headings are exposed |
| Loopback policy | Pass: exact loopback host, GET/HEAD only, query rejection, no-store/noindex, `connect-src 'none'`, `form-action 'none'`, no external request |
| Performance specimen | Controlled state: 20,041 initial gzip bytes, 1,986 JavaScript gzip bytes, four requests, zero external/media bytes |
| `pnpm lint`, `pnpm typecheck`, `pnpm format:check` | Pass after the focused implementation correction below |
| `pnpm verify` | Pass: complete repository gate, including optimized Next.js build, disabled-collection runtime policy and all rendered matrices |
| `pnpm rebuild:verify` | Pass from a fresh temporary copy and frozen lockfile; lockfile graph `dce7a390f7f3656a26128375d00e376c859aa4c2f7ea64acdbf22f43262edb91`, importer graph `335e58984a447fd383e00d86b2d3579b39c1d26df9f14be8b32201440ad130f3` |
| `pnpm audit:dependencies` | Pass: 650 dependencies; zero moderate, high or critical known vulnerabilities |
| `pnpm secrets:check --history` | Pass: 531 current text files plus reachable Git history; matched values would be redacted |
| `git diff --check` | Pass |

## Visual review

Eight sanitized captures in [`b03-017-artifacts/`](b03-017-artifacts/README.md) cover controlled,
validation, receipt and workflow-unavailable states at 360 and 1440 CSS px. Visual inspection
confirmed a single reading measure, persistent labels, clear emergency/privacy/state hierarchy,
wrapped mobile copy, visible error relationships and stable desktop composition. Every capture is
synthetic and contains no patient data, real selector, contact, recipient account or provider.

## Corrected attempt

The first browser matrix found that validation-summary links were shorter than the 44 px touch
minimum at 768 px. The Appointment stylesheet now gives each linked error a tokenized minimum
touch height. A later full build found two unscoped CSS-module selectors that the isolated preview
accepted but the production compiler correctly rejected; both selectors now use local classes.
The preview-only script reference was also moved out of the reusable template and into the
loopback document. The complete 284-case matrix, production build, full verification and clean
reconstruction pass after those corrections. No request, personal data, provider or deployed
route was involved.

The first full verification attempt used shell activation for the pinned Python asset tools, but
the repository checker intentionally resolves its worker through `ASSET_FORMAT_PYTHON`; the
attempt therefore stopped at the pre-existing font fixture with a missing system module. The
successful rerun used the repository-supported override and exact pinned `fontTools 4.65.0` and
`brotli 1.2.0`. A later clean-rebuild session was interrupted externally and restarted from a
fresh temporary copy; its complete rerun passed.

## Controlled acceptance

The client directed “B03-017 is In Review, close out”. B03-017 moves In review → **Done** for
controlled development under `befikadusata` as responsible and controlled acceptance person,
directing Codex in temporary Frontend, Backend-contract and QA roles on 28 September 2026,
Africa/Addis_Ababa. The target remains synthetic local T0/private hosted T1 under the working
B00-016 matrix.

Accepted implementation head: `e4c2070644f35667a9cb71b0f0de4934db152d19`. Matching hosted
[run 36429200636](https://github.com/dynamicet/hallelujah-website/actions/runs/36429200636)
passes every step: focused server-rendered and browser Appointment matrices, optimized-build
isolation, disabled-collection policy, history secret scan, dependency audit, full repository
verification, isolated appointment migration/permission/restore and independent frozen clean
reconstruction. All recorded local gates pass and no scoped controlled-implementation defect
remains open. The corrected implementation and execution-environment attempts remain in this
evidence record.

Final acceptance-documentation CI must pass for its exact SHA before checked merge of
[PR #75](https://github.com/dynamicet/hallelujah-website/pull/75). Its matching SHA/run, merge SHA
and exact-main result must be retained in [issue #74](https://github.com/dynamicet/hallelujah-website/issues/74)
and PR #75. Dependent execution waits for passing exact-main CI. B03-018 is not promoted by this
acceptance.

## Exact-main closeout

Final acceptance-documentation
[run 36432057419](https://github.com/dynamicet/hallelujah-website/actions/runs/36432057419)
passed for exact head `37b88354590837b017316b38a46f66464339e535`.
[PR #75](https://github.com/dynamicet/hallelujah-website/pull/75) then merged as
`6e8686fe6b768d0e13900d48c258755164e0d910`, automatically closing
[issue #74](https://github.com/dynamicet/hallelujah-website/issues/74). Exact-main
[run 36434020886](https://github.com/dynamicet/hallelujah-website/actions/runs/36434020886)
passed for that merge commit. This clears the dependent-execution pause and completes B03-017
closeout. B03-018 remains unpromoted; all activation and release gates below remain unchanged.

## Remaining gates

B03-011/APPT-01, LANG-01, authentic CARE-01/CARE-04 selectors, final privacy and operations
approval, named recipients/staff access, B03-018 provider delivery, SEC-02, DEL-01, remote
persistence, personal-data collection, production and publication remain gated.
