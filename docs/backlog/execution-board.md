# Backlog Execution Board

**Status:** Active execution control  
**Basis date:** 16 September 2026
**Publication and collection authority:** Not granted

## Purpose

This board turns the planning baseline into a controlled pull system. It identifies what may start, what must wait, the exact order for M0, and the evidence needed to promote later work. Epic tables remain the scope authority; this board is the temporary status authority until an approved issue tracker replaces it.

`Ready` means work may begin within the stated scope. It never means that hospital facts are approved, personal-data collection is enabled, or a route may be published.

## Current execution verdict

- On 13 September 2026, the client directed that `B00-001`, `B00-002`, `B00-007`, `B00-014`, and `B00-015` be skipped for the current controlled implementation stage and returned to in Phase 2 or before production. Because `Skipped` is not an allowed backlog status, all five are recorded as `Deferred`.
- The deferral is a sequencing decision, not completion or approval of `GOV-01`, `SEC-01`, infrastructure, publication, collection, migration, DNS, provider activation, or release.
- Controlled local implementation may use temporary role labels, an isolated clean rebuild that imports no executable/configuration state from legacy WordPress, the provider-neutral infrastructure assumptions already recorded, and the minimum working baselines below for third parties and evidence handling.
- `B00-017` is complete. The `B00-016` working acceptance matrix is also complete and accepted for controlled development; the ticket is `Deferred` only at its formal production-signature boundary, while `DEL-01` remains unresolved for production. `B00-003`–`B00-006` and `B00-011` are complete for controlled development. `B00-011` has passing local and hosted gates. Because the repository must remain private and a paid GitHub plan is unavailable, current-head CI success is a documented manual merge control; technical branch enforcement remains honestly open under `B00-012`. Named Delivery, DevOps, QA, and Security people still return before production acceptance.
- Personal-data collection, external-provider requests, production provisioning, legacy migration, DNS cutover, and publication remain disabled.
- On 14 September 2026, client direction approved the [high-end motion and interactive-media amendment](../visual-design/motion/high-end-motion-and-interactive-media-amendment.md) for production planning. It supersedes the prototype-wide expressive ceiling but does not approve a runtime, footage, rights, third-party media host, implementation, or release. The next applicable design-system/Home pull must include its progressive layers, permanently stable contexts, and media acceptance evidence.
- On 14 September 2026, the client directed the next execution after pull request `#11` merged. `B01-007` is **Done** for controlled development: its controlled search/filter primitives, allowlisted URL-state adapter, first-party disclosure enhancement, synthetic fixture, static/rendered checks, full local verification, history secret scan, dependency audit, and hosted implementation `T1` pass. The documentation-closeout head must repeat CI before merge. `SEARCH-01`, `SEARCH-02`, and `SEC-02` remain unresolved, so real search behavior, query handling, providers, and publication stay disabled.
- On 14 September 2026, the client corrected the requested ticket and directed `B01-009`. It is **Done** for controlled development after its full local matrix, sanitized evidence, and hosted implementation gate passed on branch `b01-009-accessible-form-primitives` under [issue `#14`](https://github.com/dynamicet/hallelujah-website/issues/14) and [pull request `#15`](https://github.com/dynamicet/hallelujah-website/pull/15). The documentation-closeout head must repeat CI before merge. Appointment routes/backends, personal-data collection, real receipts, providers, production, and publication remain disabled.
- On 14 September 2026, the client directed the next execution after pull request `#15` merged. `B01-010` is **Done** for controlled development after its full local matrix, history secret scan, dependency audit, sanitized visual evidence, and hosted implementation `T1` passed on 15 September under [issue `#16`](https://github.com/dynamicet/hallelujah-website/issues/16), [pull request `#17`](https://github.com/dynamicet/hallelujah-website/pull/17), and [hosted run](https://github.com/dynamicet/hallelujah-website/actions/runs/34896169521). The documentation-closeout head must repeat CI before merge. Real hospital states, operations, personal data, providers, public routes, production, and publication remain disabled.
- On 15 September 2026, the client directed `B01-012`. It is **Done** for controlled development after its full local and hosted implementation `T1` passed under [issue `#18`](https://github.com/dynamicet/hallelujah-website/issues/18), [pull request `#19`](https://github.com/dynamicet/hallelujah-website/pull/19), and [hosted run](https://github.com/dynamicet/hallelujah-website/actions/runs/35006070614). The documentation-closeout head must repeat CI before merge. Authentic hospital media, external providers, public routes, production, and publication remain gated.
- On 15 September 2026, the client directed a controlled-development sequencing amendment for `B02-001`: record-schema and controlled-fixture work may start without the deferred VPS selection. Integrated local acceptance requires evidence that separate local public-content and appointment PostgreSQL roles deny cross-role access. `B00-008` retains its initial-VPS provisioning outcome and remains Blocked until `B00-007` and named production owners return. This amendment does not promote `B02-001` to Ready or Done, authorize real appointment data, or change production gates. The [extracted boundary](b02-001-controlled-governed-record-contract.md) governs the local pull; [issue `#20`](https://github.com/dynamicet/hallelujah-website/issues/20) tracks hosted review and remaining integration.
- On 16 September 2026, the client directed completion of `B02-001`. It is **Done** for controlled development after its Payload write boundary, synthetic CMS persistence/retirement smoke, kind-matched approval, immutable ID/audit checks, repeat local cross-role denial, full repository verification, reachable-history secret scan, dependency audit, and [hosted exact-head run `35027072222`](https://github.com/dynamicet/hallelujah-website/actions/runs/35027072222) passed for commit `0d16b2c`. The documentation-closeout head must repeat CI before [pull request `#21`](https://github.com/dynamicet/hallelujah-website/pull/21) merges. `B00-008`, `GOV-01`, authentic records, CMS role/workflow approval, remote provisioning, collection, and publication remain gated. Once `#21` merges, `B01-008` is the next controlled pull.
- On 16 September 2026, the client directed `B01-008` after `#21` merged and then accepted its controlled-development result. It moved Proposed → Ready → In progress → In review → **Done** under the client workspace identity `befikadusata` as temporary Frontend, Content, and QA owner and local acceptance authority. Dependencies `B01-004` and `B02-001` are Done; local `T0` and private-repository hosted implementation `T1` pass. The governed-card API, visibly synthetic fixture, full local verification, responsive/no-JavaScript/forced-colors browser matrix, history secret scan, dependency audit, and sanitized captures pass. [Issue `#22`](https://github.com/dynamicet/hallelujah-website/issues/22), [PR `#23`](https://github.com/dynamicet/hallelujah-website/pull/23), the [completion evidence](evidence/B01-008-governed-content-cards-2026-09-16.md), and [exact-head documentation run `35030914802`](https://github.com/dynamicet/hallelujah-website/actions/runs/35030914802) record acceptance. The final acceptance-documentation head must repeat CI before merge. Named production roles, authentic records, asset rights, recruitment/privacy approval, public routes, and publication remain open.
- On 16 September 2026, after `B01-008` PR `#23` merged, the client directed the provider-neutral "proceed now" approach for `B01-011`. It moved Proposed → Ready → In progress → In review → **Done** under client workspace identity `befikadusata` as temporary Frontend/QA responsible owner and controlled-development acceptance authority on 16 September 2026, Africa/Addis_Ababa. Completed `B01-010`, the working default-deny `B00-014` baseline, the [execution brief](b01-011-provider-neutral-optional-map.md), and [passing local evidence](evidence/B01-011-provider-neutral-optional-map-2026-09-16.md) govern this pull. Full local `T0`, responsive/resilience browser checks, zero activation/external-request assertions, history secret scan, dependency audit, and sanitized visual review pass on `b01-011-optional-map-wrapper`. The client subsequently accepted controlled development and directed closure under [issue `#24`](https://github.com/dynamicet/hallelujah-website/issues/24) and [PR `#25`](https://github.com/dynamicet/hallelujah-website/pull/25); [hosted implementation run `35069339308`](https://github.com/dynamicet/hallelujah-website/actions/runs/35069339308) passed for exact commit `b13d709`. The final acceptance-documentation head must repeat CI before merge. `B01-013` is the next candidate after merge, subject to controlled-development readiness checks. Provider selection/integration, external requests or links, geolocation, real arrival facts, provider consent, public routes, collection, production, and publication remain disabled; `SEC-02` is not promoted.

- On 16 September 2026, the client directed `B01-013`. It moved Proposed → Ready → In progress → In review → **Done** after passing local verification under workspace identity `befikadusata` directing Codex in temporary Designer/Frontend/QA roles, with the same identity as controlled-development review authority. `B01-005`–`B01-012` are Done and local merge `54c741b` closes the latest dependency, PR `#25`. The working `B00-016` matrix supplies controlled acceptance while formal `DEL-01` production signatures remain deferred. The [execution brief](b01-013-component-review-harness.md) limits work to a loopback-only component/state review tool outside application source, explicit English/unreviewed Amharic shaping fixtures, full interaction/capability checks, byte reports and sanitized evidence. [issue `#26`](https://github.com/dynamicet/hallelujah-website/issues/26) and [PR `#27`](https://github.com/dynamicet/hallelujah-website/pull/27) track execution and exact-head hosted review; local `T0`, all shared component interactions, 90 bilingual capability/viewport cases, bilingual keyboard/media/history retests, 47 sanitized artifacts, reachable-history secret scan and dependency audit pass. The client accepted controlled development and directed review and closure on 16 September 2026, Africa/Addis_Ababa; [hosted implementation run `35073807049`](https://github.com/dynamicet/hallelujah-website/actions/runs/35073807049) passed all steps including clean reconstruction for exact commit `703ccb4d3507b42cd88f4a8ba958251da0cc23b0`. Final acceptance-documentation CI must repeat before merge; no production, provider, authentic content, collection or publication gate is promoted.

## Status authority and update rule

On 16 September 2026, PR `#27` closeout required correction of a post-merge optional-map
request assertion under issue `#28`. Correction PR `#29` merged as `5b51f5c`; exact-main
[run `35077538959`](https://github.com/dynamicet/hallelujah-website/actions/runs/35077538959)
passed. This resolves the dependent-execution pause and the earlier manual-merge control failure.
The [correction evidence](evidence/B01-013-component-review-harness-2026-09-16.md#post-merge-closeout-correction)
retains the failed-run history and successful closure.

The client then directed `B02-002` following the proposed controlled CMS workflow execution.
It moved Proposed → Ready → In progress → In review after passing local T0 on 16 September 2026, Africa/Addis_Ababa under workspace
identity `befikadusata` directing Codex in temporary Backend/CMS, Security and QA roles; the same
identity is controlled-development review authority. `B02-001` is Done. The
[execution brief](b02-002-controlled-cms-workflow.md) records a controlled sequencing exception to
deferred `B00-001`: synthetic local identities/records only, no CMS/public route, authentic roles,
production scheduler, provisioning, providers, collection or publication. Formal `GOV-01` and
hospital role/workflow approval remain required before authentic or production use. The client
subsequently accepted controlled development by directing closeout of implemented draft PR #31,
promoting In review → **Done** on 16 September 2026, Africa/Addis_Ababa, under the same responsible
and acceptance identity. [Issue #30](https://github.com/dynamicet/hallelujah-website/issues/30) tracks the controlled pull; the
[local completion evidence](evidence/B02-002-controlled-cms-workflow-2026-09-16.md) records passing
permission/approval/preview negatives, PostgreSQL persistence, concurrent-write and real timed-lifecycle
assertions, full local verification, history secret scan and refreshed dependency audit. Exact-head
hosted implementation T1 [run 35080177144](https://github.com/dynamicet/hallelujah-website/actions/runs/35080177144) passed for exact commit `65206c0f52292b85ad6f1868ad6bdfc032963da4` under [PR #31](https://github.com/dynamicet/hallelujah-website/pull/31). Documentation [run 35080873707](https://github.com/dynamicet/hallelujah-website/actions/runs/35080873707) passed full verification and clean reconstruction for `a7a6e9c955c10235a9b673deae71b732c70e9c7c`. Final acceptance-documentation CI must repeat before merge; its matching SHA/run and merge result must be recorded in issue #30 and PR #31. Production and publication remain gated.

For every promotion, record the ticket ID, old/new status, responsible person, acceptance person, date/timezone, dependency evidence, target environment, and issue/evidence link. Update this board and the issue tracker in the same change. A role name alone cannot promote a delivery ticket to `Ready`.

During `B02-002` closeout, PR `#31` merged as `3fac0d9` after final exact-head
CI [run `35081816962`](https://github.com/dynamicet/hallelujah-website/actions/runs/35081816962)
attempt 2 passed, automatically closing issue `#30`. Post-merge main
[run `35091489396`](https://github.com/dynamicet/hallelujah-website/actions/runs/35091489396)
then failed repeated form-focus verification during clean reconstruction. Dependent execution is
paused under the manual merge control until a checked correction resolves it. The client-directed
closeout authorizes the scoped `B01-013` harness correction under
[issue `#32`](https://github.com/dynamicet/hallelujah-website/issues/32), with `befikadusata` directing
Codex in temporary Frontend/QA roles and the same controlled-development acceptance authority on
16 September 2026, Africa/Addis_Ababa. The
[correction evidence](evidence/B01-013-form-focus-closeout-2026-09-16.md) records the timer race,
bounded condition wait and required local/hosted checks. `B02-002` remains accepted for controlled
development; production, publication and collection gates remain open.

On 16 September 2026, the client directed recording closeout and proceeding with `B02-003`.
Correction PR #33 merged as `38d5e455d0733a62e6fbd188fa76c0127012c57d` after exact-head
[run `35092261032`](https://github.com/dynamicet/hallelujah-website/actions/runs/35092261032)
passed; exact-main [run `35092817178`](https://github.com/dynamicet/hallelujah-website/actions/runs/35092817178)
also passed. This resolves the dependent-execution pause recorded above. `B02-001` and `B02-002`
are Done for controlled development. `B02-003` moves Proposed → Ready → In progress under
`befikadusata` directing Codex in temporary Backend/CMS, Operations-contract and QA roles, with
the same identity as controlled-development review authority, on 16 September 2026,
Africa/Addis_Ababa. The [execution brief](b02-003-canonical-site-settings.md) authorizes synthetic
local records, conflict/verification checks and internal template consumption only. `SAFE-01`,
`SAFE-03`, authentic contacts/arrival facts, operations signoff and publication remain unresolved.

If this board and an epic disagree, use the epic for scope and this board for live status. If either conflicts with a dated hospital decision, update all affected artifacts through the backlog change-control rule before work continues.

## M0 pull queue

| Order | Ticket | Status | Responsible / acceptance authority | Required before start | Completion evidence / next unlock |
| ---: | --- | --- | --- | --- | --- |
| 1 | `B00-001` | **Deferred** | Hospital Project Owner / Executive sponsor; names still required before production | Return before production acceptance or any formal hospital approval | Signed RACI plus sanitized pointer record; required for production governance |
| 2 | `B00-002` | **Deferred** | Named Security owner / Executive sponsor | Return before production migration, provisioning, DNS cutover, SEO recovery acceptance, or release | Incident closure or signed isolated clean-build decision; current work must use the documented clean-rebuild boundary |
| 3 | `B00-007` | **Deferred** | Named Delivery lead / Product, Security, and cost authorities | Return before remote staging/production provisioning or provider activation | Dated provider/environment selection; current work remains local and provider-neutral |
| 4 | `B00-014` | **Deferred** | Privacy and Security roles / Product authority before activation | Return in Phase 2, before any external-provider request or activation, or before production—whichever is earlier | Development baseline: default deny, local/first-party assets and behavior only; unapproved providers make zero requests |
| 5 | `B00-015` | **Deferred** | QA and Security roles / Product authority before production acceptance | Return in Phase 2, before restricted evidence must be created or moved, or before production—whichever is earlier | Development baseline: sanitized non-sensitive evidence only in repository/approved CI; restricted material stays outside the repository |
| 6 | `B00-016` | **Deferred** | QA role / Product and Security roles | Working matrix completed on 13 September 2026; return before formal production acceptance or on a documented change trigger | [Working acceptance matrix](../validation/implementation-acceptance-matrix.md) and [completion record](evidence/B00-016-working-acceptance-matrix-2026-09-13.md); `DEL-01` production closure remains open |
| 7 | `B00-017` | **Done** | Product role / Client executive authority; senior UI/UX architecture review | Complete—93 patterns and 120 candidates reviewed; existing dispositions approved unchanged on 13 September 2026 | [`B00-017` completion record](evidence/B00-017-benchmark-disposition-2026-09-13.md); reopen only on the documented change triggers |
| 8 | `B00-003` | **Done** | Temporary Product and Delivery roles / temporary QA role; named authorities return before production acceptance | Completed under the working `B00-016` matrix and `B00-015` baseline | [Project control registers](b00-003-project-control-registers.md) and [completion record](evidence/B00-003-project-control-registers-2026-09-13.md); audit passed 10/10 |
| 9 | `B00-004` | **Done** | Client workspace identity `befikadusata` directing Codex / same client identity at the temporary development boundary; named Delivery and Security people return before production | Completed under the working `B00-016` matrix and isolated clean-rebuild boundary | [Completion record](evidence/B00-004-clean-application-bootstrap-2026-09-13.md); clean local bootstrap passed without legacy executable/configuration import, application providers, personal data, or production claim |
| 10 | `B00-005` | **Done** | Client workspace identity `befikadusata` directing Codex / same identity at the controlled-development boundary; named Delivery and Security people return before production | Completed within the [extracted controlled-development scope](b00-005-pinned-toolchain.md) | [Completion record](evidence/B00-005-pinned-toolchain-2026-09-13.md); exact policy, frozen graph, advisory scan, application checks, and isolated rebuild passed; Docker host mismatch remains fail-closed before container work |
| 11 | `B00-006` | **Done** | Client workspace identity `befikadusata` directing Codex / same identity at the controlled-development boundary; named DevOps and Security people return before production | Completed within the [extracted controlled-development scope](b00-006-environment-configuration.md) | [Completion record](evidence/B00-006-environment-configuration-2026-09-13.md); environment-scoped values, startup/Payload validation, disabled gates, names-only example, and runbook passed local checks |
| 12 | `B00-008`–`B00-010` | Blocked — remote/activation acceptance | Named Backend/DevOps owners / Security owner | Controlled local delivery may use the approved two-database boundary; `B00-007`, named owners and appointment gates return before remote persistence, personal-data activation or production | [Controlled-development boundary](b00-008-010-logical-database-delivery-boundary.md); remaining evidence is actual-environment least privilege, migration, encrypted backup and restore |
| 13 | `B00-011` | **Done** | Client workspace identity `befikadusata` directing Codex / same identity for controlled-development implementation; named Delivery/QA/Security return before production | Complete—repository/local gates and hosted execution pass; manual current-head CI procedure records the private/free-plan constraint without claiming technical enforcement | [Execution brief](b00-011-ci-quality-security.md) and [completion evidence](evidence/B00-011-ci-quality-security-2026-09-14.md); branch enforcement remains `B00-012` |
| 14 | `B00-012`–`B00-013` | Blocked | Named Delivery/DevOps owners / QA and Security owners | `B00-011` is satisfied; deferred ownership/infrastructure/provider gates and an available `B00-012` enforcement approach remain | Deployment control and privacy-safe observability evidence |

The 13 September deferrals remove `B00-001`, `B00-002`, `B00-007`, `B00-014`, and `B00-015` from the current pull queue without closing their Phase 2, provider, restricted-evidence, or production gates. `B00-017`, `B00-003`–`B00-006`, and `B00-011` are complete at their recorded controlled-development boundaries. The working portion of `B00-016` is also complete and its production signature is deferred. `B00-011` records its repository gates, local evidence, successful hosted execution, and honest private/free-plan limitation. Technical merge enforcement is not claimed and remains in `B00-012`. Later orders follow their explicit dependencies and the documented non-production baselines; numeric order does not override them.

## Active M1 delivery queue

| Pull order | Ticket | Status | Responsible / acceptance authority | Allowed scope and target | Evidence / issue |
| ---: | --- | --- | --- | --- | --- |
| 1 | `B01-001` | **Done** | Client workspace identity `befikadusata` directing Codex in the temporary Frontend Lead role / same identity for controlled-development acceptance; named Delivery, Frontend, QA, and Accessibility people return before production | `T0` local and private-repository implementation `T1` pass; production design-system boundaries, unchanged bootstrap composition, automated boundary checks, architecture/backlog documentation, and sanitized evidence only | [Execution brief](b01-001-production-component-architecture.md), [evidence](evidence/B01-001-production-component-architecture-2026-09-14.md), [issue `#2`](https://github.com/dynamicet/hallelujah-website/issues/2), and [hosted run](https://github.com/dynamicet/hallelujah-website/actions/runs/34815766577) |
| 2 | `B01-003` | **Done** | Client workspace identity `befikadusata` directing Codex in the temporary Frontend Lead and Designer roles / same identity for controlled-development acceptance; named production roles return at their gates | `T0` local and private-repository implementation `T1` pass; provisional canonical source, generated CSS/typed output, drift and policy checks, bootstrap alias migration, documentation, and sanitized evidence only | [Execution brief](b01-003-canonical-design-tokens.md), [evidence](evidence/B01-003-canonical-design-tokens-2026-09-14.md), [issue `#4`](https://github.com/dynamicet/hallelujah-website/issues/4), and [hosted run](https://github.com/dynamicet/hallelujah-website/actions/runs/34818265645) |
| 3 | `B01-002` | **Done** | Client workspace identity `befikadusata` directing Codex in delegated Brand Strategist, UI/UX Architect, and Marketing roles / same identity for project acceptance; production specialists return at their gates | Project brand guide, fingerprinted public-source logo records, accessible extended palette, Noto Sans/Noto Sans Ethiopic selection and audit, voice, imagery/video and asset lifecycle policy, approved token values, visual and automated evidence | [Execution brief](b01-002-project-brand-system.md) and [evidence](evidence/B01-002-project-brand-system-2026-09-14.md) |
| 4 | `B01-004` | **Done** | Client workspace identity `befikadusata` directing Codex in the temporary Frontend Lead and QA roles / same identity for controlled-development acceptance; named production roles return at their gates | `T0` local and hosted implementation `T1` pass for foundation tokens/CSS, controlled fixture, responsive/reflow, enlarged text, focus, reduced-motion, print, forced colors, visual evidence, and static/application gates | [Execution brief](b01-004-global-css-foundations.md), [evidence](evidence/B01-004-global-css-foundations-2026-09-14.md), [issue `#6`](https://github.com/dynamicet/hallelujah-website/issues/6), [pull request `#7`](https://github.com/dynamicet/hallelujah-website/pull/7), and [hosted run](https://github.com/dynamicet/hallelujah-website/actions/runs/34837389038) |
| 5 | `B01-005` | **Done** | Client workspace identity `befikadusata` directing Codex in the temporary Frontend Lead and QA roles / same identity for controlled-development acceptance; named production roles return at their gates | `T0` local and hosted implementation `T1` pass for native action semantics, controlled phone invariant, target/gap geometry, keyboard and moved-touch behavior, Level 0 emergency meaning, modes, and sanitized visual evidence; final documentation head must pass before merge | [Execution brief](b01-005-essential-actions.md), [local evidence](evidence/B01-005-essential-actions-2026-09-14.md), [issue `#8`](https://github.com/dynamicet/hallelujah-website/issues/8), [pull request `#9`](https://github.com/dynamicet/hallelujah-website/pull/9), and [hosted run](https://github.com/dynamicet/hallelujah-website/actions/runs/34869074953) |
| 6 | `B01-006` | **Done — focused correction closed** | Client workspace identity `befikadusata` directing Codex in the temporary Frontend Lead and QA roles / same identity accepted the controlled correction on 28 September 2026; named production roles return at their gates | Local correction `T0`, exact review-head hosted `T1`, final acceptance-documentation CI, checked merge and exact-main CI pass. Focused correction aligns DOM/visual/Tab order, compact composition, explicit forced-compact mode and governed localized identity naming. | [Reopened execution brief](b01-006-global-shell-navigation.md), [correction evidence](evidence/B01-006-header-correction-2026-09-28.md), [review evidence](evidence/B01-006-header-review-2026-09-28.md), closed [issue `#10`](https://github.com/dynamicet/hallelujah-website/issues/10), merged [pull request `#76`](https://github.com/dynamicet/hallelujah-website/pull/76), correction [hosted run](https://github.com/dynamicet/hallelujah-website/actions/runs/36451735815), [exact-main run](https://github.com/dynamicet/hallelujah-website/actions/runs/36462238838), and historical [pull request `#11`](https://github.com/dynamicet/hallelujah-website/pull/11) / [hosted run](https://github.com/dynamicet/hallelujah-website/actions/runs/34879240044) |
| 7 | `B01-007` | **Done** | Client workspace identity `befikadusata` directing Codex in the temporary Frontend Lead and QA roles / same identity for controlled-development acceptance; named production roles return at their gates | Controlled server-rendered GET search/filter/chip/count/pagination APIs, allowlisted `q`/`type`/`page` state, compact disclosure enhancement, synthetic fixture, generated aliases, and full local plus hosted implementation evidence; documentation-closeout head must pass before merge | [Execution brief](b01-007-search-filter-primitives.md), [local evidence](evidence/B01-007-search-filter-primitives-2026-09-14.md), [issue `#12`](https://github.com/dynamicet/hallelujah-website/issues/12), [pull request `#13`](https://github.com/dynamicet/hallelujah-website/pull/13), and [hosted run](https://github.com/dynamicet/hallelujah-website/actions/runs/34884990666) |
| 8 | `B01-009` | **Done** | Client workspace identity `befikadusata` directing Codex in the temporary Frontend Lead and QA roles / same identity for controlled-development acceptance; named production roles return at their gates | Local `T0` and hosted implementation `T1` pass for accessible form APIs, generated aliases, fail-closed synthetic fixture, request-prevention/focus enhancement, responsive and resilience matrix, and sanitized evidence; final documentation head must pass before merge | [Execution brief](b01-009-accessible-form-primitives.md), [local evidence](evidence/B01-009-accessible-form-primitives-2026-09-14.md), [issue `#14`](https://github.com/dynamicet/hallelujah-website/issues/14), [pull request `#15`](https://github.com/dynamicet/hallelujah-website/pull/15), and [hosted run](https://github.com/dynamicet/hallelujah-website/actions/runs/34892559476) |
| 9 | `B01-010` | **Done** | Client workspace identity `befikadusata` directing Codex in the temporary Frontend Lead and QA roles / same identity for controlled-development acceptance; named production roles return at their gates | Local `T0` and hosted implementation `T1` pass for server-rendered alert/status, dated notice, distinct recovery-state, bounded loading/skeleton, canonical precedence, generated aliases, controlled fixture, static/rendered checks, documentation, and sanitized evidence only | [Execution brief](b01-010-system-state-patterns.md), [local evidence](evidence/B01-010-system-state-patterns-2026-09-14.md), [issue `#16`](https://github.com/dynamicet/hallelujah-website/issues/16), [pull request `#17`](https://github.com/dynamicet/hallelujah-website/pull/17), and [hosted run](https://github.com/dynamicet/hallelujah-website/actions/runs/34896169521) |
| 10 | `B01-012` | **Done** | Client workspace identity `befikadusata` directing Codex in temporary Frontend Lead, Designer, and QA roles / same identity for controlled-development acceptance; named production roles return at their gates | Local `T0` and hosted implementation `T1` pass for progressive motion/media architecture, protected and area ceilings, first-party CSP-compatible enhancement, abstract opt-in media fixture, responsive/capability/failure checks, and sanitized evidence; documentation-closeout head must repeat CI before merge | [Execution brief](b01-012-progressive-motion-media.md), [local evidence](evidence/B01-012-progressive-motion-media-2026-09-15.md), [issue `#18`](https://github.com/dynamicet/hallelujah-website/issues/18), [pull request `#19`](https://github.com/dynamicet/hallelujah-website/pull/19), and [hosted run](https://github.com/dynamicet/hallelujah-website/actions/runs/35006070614) |
| 11 | `B01-008` | **Done** | Client workspace identity `befikadusata` directing Codex in temporary Frontend, Content, and QA roles / same identity for controlled-development local acceptance; named production authorities return at their gates | Local `T0` and hosted implementation `T1` pass for validated governed cards, typed optional fields, synthetic fixture, public fail-closed gate, retired/unavailable states, responsive/no-JavaScript/forced-colors checks, full repository verification, history secret scan, dependency audit, and sanitized captures; final acceptance-documentation head must repeat CI before merge | [Execution brief](b01-008-governed-content-cards.md), [completion evidence](evidence/B01-008-governed-content-cards-2026-09-16.md), [issue `#22`](https://github.com/dynamicet/hallelujah-website/issues/22), [PR `#23`](https://github.com/dynamicet/hallelujah-website/pull/23), and [exact-head documentation run](https://github.com/dynamicet/hallelujah-website/actions/runs/35030914802) |
| 12 | `B01-011` | **Done** | Client workspace identity `befikadusata` directing Codex in temporary Frontend/QA roles / same identity for controlled-development acceptance on 16 September 2026, Africa/Addis_Ababa; named production roles remain at their gates | Local `T0` passes for provider-neutral wrapper, complete synthetic directions, inert defaults, temporary acknowledgement, explicit placeholder activation/removal, zero activation/external requests, full repository verification, security checks, and sanitized visual evidence. Client acceptance is recorded on 16 September 2026, Africa/Addis_Ababa; issue `#24` and PR `#25` track review. Hosted implementation `T1` passed for exact commit `b13d709`; final documentation head must repeat CI before merge. | [Execution brief](b01-011-provider-neutral-optional-map.md), [completion evidence](evidence/B01-011-provider-neutral-optional-map-2026-09-16.md), and [architecture](../architecture/optional-map-wrapper.md) |
| 13 | `B01-013` | **Done** | Client workspace identity `befikadusata` directing Codex in temporary Designer/Frontend/QA roles / same identity for controlled-development acceptance on 16 September 2026, Africa/Addis_Ababa | Dependencies `B01-005`–`B01-012` Done; working `B00-016` matrix accepted for controlled local `T0`. Review tool is outside application source/public assets; synthetic English and unreviewed Amharic shaping, full component states and capability matrix, initial/motion/media byte reports and sanitized captures only. Local full verification and final keyboard/capture retest pass; client acceptance is recorded and hosted implementation `T1` including clean reconstruction passed for `703ccb4`; final documentation head must repeat CI before merge; `DEL-01` production acceptance remains open. | [Execution brief](b01-013-component-review-harness.md), [completion evidence](evidence/B01-013-component-review-harness-2026-09-16.md), and [architecture](../architecture/component-review-harness.md); [issue `#26`](https://github.com/dynamicet/hallelujah-website/issues/26); [PR `#27`](https://github.com/dynamicet/hallelujah-website/pull/27); current-head hosted CI must pass before merge |

`B01-001` was promoted Proposed → Ready → In progress → In review → Done for controlled development on 14 September 2026, Africa/Addis_Ababa,
after the client directed execution of steps 1–4. `B00-004` and `B00-005` are complete, the motion
and interactive-media amendment is approved for planning, and the issue records the exact scope,
state applicability, verification commands, and evidence destination. Hospital facts, translations,
brand assets, public routes, CMS capability, providers, motion/media runtime implementation,
personal-data collection, deployment, DNS, production, and publication remain outside scope. The
implementation revision and exact closeout head passed hosted CI, and pull request `#3` merged.

`B01-003` was promoted Proposed → Ready → In progress → In review → Done for controlled development
on 14 September 2026, Africa/Addis_Ababa, after the client directed execution. Its provisional
canonical source generates 135 CSS and typed platform tokens; automated checks enforce layer/type
integrity, output parity, four token contrast pairs, reduced equivalents, seven Level 0 protected
contexts, and consumer alias use. The controlled bootstrap consumes the generated aliases, and the
local plus hosted implementation gates pass.

`B01-002` was promoted Proposed → Ready → In progress → In review → Done for controlled development
on 14 September 2026 after the client delegated the missing brand, UI/UX, and marketing package.
The source-traceable project brand system approves identity, exact logo accents, accessible interface
extensions, bilingual type direction, voice, imagery/video art direction, and asset lifecycle. The
public rasters are explicitly replaceable project sources, not misrepresented as original vectors.
Binary ingestion stays in `B02-011`, actual Amharic copy stays language-gated, and public release is
not authorized. That closure unlocked the subsequent `B01-004` execution recorded below.

`B01-004` was promoted Proposed → Ready → In progress → In review → Done for controlled development
on 14 September 2026 after the
client directed execution. Canonical foundation roles, global CSS, the controlled bilingual-stack
fixture, and local static/rendered checks now pass across the required viewport/reflow matrix plus
375 px, landscape, enlarged text, reduced motion, print, and forced colors. A first enlarged-text
run exposed and drove correction of a real 40 px intrinsic-size overflow. Hosted Chrome then exposed
a separate 16 px status-summary overflow and an Ubuntu runner browser-selection weakness; both were
corrected with matching static/rendered checks. GitHub issue `#6`, pull request `#7`, hosted run
`34837389038`, and the final cleanup correction carry the repository review and implementation
evidence. Pull request `#7` merged as `6162e9c`; that merge unlocked `B01-005`.

`B01-005` was promoted Proposed → Ready → In progress → In review → Done for controlled development
on 14 September 2026 after the
client directed the next execution and pull request `#7` had merged. The production component API,
generated action aliases, controlled fixture, static contracts, and local Chromium matrix pass.
The visible controlled number and `tel:` value derive from one source; real hospital contacts remain
withheld under `SAFE-01`. Native keyboard activation succeeds and moved touch does not activate.
Pull request `#9` and hosted run `34869074953` carry repository review and the passing implementation
`T1`; the final documentation head must pass before merge. Named operations, clinical,
accessibility, language, and release roles return at their production gates. `B01-006` unlocks after
pull request `#9` merges.

`B01-006` was promoted Proposed → Ready → In progress → In review → Done for controlled development
on 14 September 2026 after the
client directed the next execution and pull request `#9` had merged. The production shell API,
285 generated tokens, one responsive primary-navigation order, native compact popover, additive
same-origin focus enhancement, breadcrumb, explicit language-unavailable state, footer, and
controlled fixture pass the local static and rendered matrix. The strict CSP and static route were
preserved without `unsafe-inline` or nonce-driven dynamic rendering. Pull request `#11` and hosted
run `34879240044` carry the repository review and passing implementation `T1`; the documentation
closeout head must repeat the gate before merge. Named production accessibility, language, content,
and operations gates remain open. `B01-007` unlocks after pull request `#11` merges.

`B01-007` was promoted Proposed → Ready → In progress → In review → Done for controlled development
on 14 September 2026 after the
client directed the next execution and pull request `#11` had merged. The production primitives,
312 generated tokens, allowlisted bounded URL-state adapter, responsive native filter disclosure,
first-party focus/state enhancement, and five-record controlled fixture pass targeted static,
application, and rendered checks. No public search route, real record/taxonomy, urgent behavior,
query logging, remote suggestion, provider, personal-data flow, or publication authority is added.
Issue `#12`, pull request `#13`, and hosted run `34884990666` carry repository review and the passing
implementation `T1`; the documentation closeout head must repeat the gate before merge. `B01-008`
waits for the controlled `B02-001` contract; `B01-009` unlocks after pull request `#13` merges.

`B01-009` was promoted Proposed → Ready → In progress → In review → Done on 14 September 2026 after the client
corrected the requested ticket and directed execution, with pull request `#13` already merged. Its
controlled boundary permits reusable accessible form primitives, generated aliases, a synthetic
non-collecting fixture, a first-party request-prevention/focus enhancement, static and rendered
checks, documentation, and sanitized evidence. It does not permit appointment implementation,
personal-data collection, server actions, authoritative outcome simulation, providers, hospital
content, deployment, production, or publication. Issue `#14` carries the repository execution
record. Production component APIs, 347 generated tokens, the fail-closed controlled fixture, static
contracts, the full local repository gate, reachable-history secret scan, rendered interaction and
resilience matrix, and sanitized visual evidence pass. The dependency graph is unchanged from its
last successful audit; a stalled fresh-registry refresh is recorded without being represented as a
new local pass. Pull request `#15` and hosted run `34892559476` carry repository review, a fresh
650-dependency audit, the passing implementation `T1`, and a clean rebuild; the documentation
closeout head must repeat the exact-head gate before merge. Named production accessibility,
privacy, security, language, operations, and release roles remain at their gates. `B01-010` is the
next dependency-satisfied Epic 01 delivery primitive, and that execution is recorded below.

`B01-010` was promoted Proposed → Ready → In progress → In review on 14 September 2026 and Done for
controlled development on 15 September 2026 after the client directed the next execution and pull
request `#15` had merged. Its server-rendered alert/status variants, dated temporary notices,
distinct recovery states, bounded loading and skeleton patterns, canonical precedence resolver,
378 generated tokens, synthetic fixture, and local responsive/resilience matrix pass. Success
requires explicit authoritative intent; temporary notices require affected scope, dates, and
ownership; critical facts cannot enter the skeleton boundary. Issue `#16`, pull request `#17`, and
hosted run `34896169521` carry repository review and the passing implementation `T1`; the
documentation-closeout head must repeat the gate before merge. Named production operations,
clinical, accessibility, language, privacy, security, and release roles remain at their gates.

`B01-012` was promoted Proposed → Ready → In progress → In review → Done for controlled
development on 15 September 2026,
Africa/Addis_Ababa, after the client directed its execution. Its completed `B01-003`–`B01-004`
dependencies, planning-approved `B01-002` direction, working default-deny provider baseline,
explicit abstract-media fixture, temporary client-directed owner/acceptance identity, issue `#18`,
requirements, acceptance cases, and sanitized evidence destination satisfy the controlled start.
The local token, browser, full repository, history-secret, and dependency-advisory gates pass.
Issue `#18`, pull request `#19`, and hosted run `35006070614` carry the passing implementation
`T1` for exact commit `ef3d85f`; the documentation-closeout head must repeat CI before merge.
Authentic media, any external provider, real route/content, named production acceptance, and
publication remain gated.

### `B00-005` — pinned toolchain

The [canonical toolchain policy](../../toolchain-versions.json) pins Node.js, pnpm, Next.js, Payload, TypeScript, PostgreSQL, Docker, official-image digests, and patched security overrides. Repository checks reject drift, expired support/review dates, non-exact application dependencies, mutable image references, and an incompatible active runtime. The isolated frozen reconstruction produced the same lockfile and workspace importer graph and repeated the full build. The current local Docker `29.2.1` does not meet the selected `29.8.0` baseline and remains fail-closed before container work. Remote workflow execution passed under `B00-011`; technical repository enforcement remains `B00-012`. See the [completion record](evidence/B00-005-pinned-toolchain-2026-09-13.md).

### `B00-006` — environment and secrets boundary

The [server configuration contract](b00-006-environment-configuration.md) selects exactly one local,
staging, or production credential scope; rejects non-selected scopes and environment-mismatched
content databases; validates Payload secret length; and keeps personal-data collection and external
services disabled. `dev`, `start`, Next.js server initialization, and Payload use the same redacted,
fail-closed boundary. The committed example contains names only, while the
[runbook](../architecture/environment-and-secrets.md) defines provider-neutral supply, rotation,
rollback, and emergency access. Local full verification, runtime smoke, and isolated reconstruction
passed; actual staging/production mechanisms and named acceptance remain deferred. See the
[completion record](evidence/B00-006-environment-configuration-2026-09-13.md).

### `B00-011` — CI quality and security gates

The [CI execution brief](b00-011-ci-quality-security.md) defines one read-only, bounded
`quality-and-security` job for pull requests and `main`. Local verification now covers the pinned
toolchain, formatting, immutable workflow policy, repository/backlog links, source and reachable
history secret signatures, lint/types/tests/build, bounded accessibility and asset budgets, runtime
health/security headers, the full dependency graph, and isolated reconstruction. Migration and
container introduction remain fail-closed because neither authorized capability exists. The
[completion evidence](evidence/B00-011-ci-quality-security-2026-09-14.md) records the successful
hosted run. The repository must remain private and the approved boundary excludes a paid GitHub
plan, so the current-head CI merge procedure is the controlled-development fallback. Technical
branch and review enforcement remains in `B00-012` and is not falsely claimed here.

## Deferred working baselines and completed benchmark decision

### `B00-014` — third-party register

The formal register decision is deferred to Phase 2 or production. Until it returns, the approved development baseline is **default deny**: local assets and first-party behavior only, with every external integration disabled. No browser, server, build, or CI request may be made to Cloudflare, maps, analytics, chat, replay/pixels, autocomplete, externally hosted fonts/media, email/form/recruitment services, monitoring, or storage providers. Reopen `B00-014` before any provider-specific integration or request is enabled.

### `B00-015` — evidence storage split

The formal storage selection is deferred to Phase 2 or production. Until it returns, the approved development baseline permits sanitized, non-sensitive build, lint, test, accessibility, and screenshot evidence in the repository or approved CI artifacts. Security reports, incident details, signatures, private contacts, credentials, and personal data must not be copied into the repository or public CI artifacts. Keep such material in its already authorized source system, if one exists, and use only a sanitized pointer; if no authorized restricted location exists, do not create or transfer the restricted artifact as part of development. Reopen `B00-015` before a restricted-evidence workflow is required and before production acceptance.

### `B00-016` — implementation acceptance matrix

The [working matrix](../validation/implementation-acceptance-matrix.md) is complete and binding for controlled development. It defines evidence tiers, rolling platform coverage, physical-device targets, viewports/zoom/forced colors, constrained performance, language/comprehension testing, security coverage, defect thresholds, evidence handling, acceptance roles, exceptions, and `BM-*` implementation proof. `B00-016` is deferred only for named production authorities, actual version/device inventory, restricted repository selection, executed release-candidate evidence, and `B07-016` authorization. See the [completion record](evidence/B00-016-working-acceptance-matrix-2026-09-13.md).

### `B00-017` — benchmark disposition

The existing map is approved unchanged as the binding benchmark-use baseline for controlled implementation: 93 cross-site patterns and 120 institution candidates were checked with no missing or duplicate IDs. External examples remain non-authoritative. Adopt/Adapt items guide implementation only within their stated gates; Test items require their listed evidence; Defer items remain outside scope; direct-copy rejections remain binding. Reopen only for a disposition conflict/change, a new benchmark candidate, evidence supporting promotion of a Test/Defer item, or a discovered safety, accessibility, privacy, language, operational, or architectural conflict. See the [completion record](evidence/B00-017-benchmark-disposition-2026-09-13.md).

## `B00-001` deferred production issue brief

Use the [ticket template](ticket-template.md) when creating the issue. The following fields are fixed for the first pull:

| Field | Execution value |
| --- | --- |
| Epic / lane / priority | Epic 00 / `DECISION` / `P0` |
| Phase / milestone | Phase 0 / `M0`; required before any delivery ticket is promoted |
| Status | `Deferred`; return before production readiness |
| Responsible owner | Hospital Project Owner / Focal Person; enter the authorized person's full name at task start |
| Acceptance owner | Hospital General Manager / CEO; enter the authorized person's full name before acceptance |
| Target environment | Documentation and hospital-controlled approval process only |
| Allowed repository scope | `hallelujah/docs/README.md`; `hallelujah/docs/validation/stakeholder-low-fidelity-validation.md`; `hallelujah/docs/backlog/`; owner references affected by the approved RACI |
| Requirements / decisions | `G-014`, `GOV-01` |
| Evidence destination | Sanitized pointer record under `hallelujah/docs/backlog/evidence/`; signed/contact-bearing source remains outside the repository under the deferred `B00-015` working baseline |
| Explicit exclusions | No approval of clinical facts, operations, contacts, privacy, security, brand, language, providers, collection, implementation, or release |

Acceptance requires:

1. Every temporary role in the named-participant register has an authorized person's full name, organization side, authority confirmation, and contact or an explicit documented vacancy/escalation.
2. Delegate/absence behavior, decision scope, review cadence, and approval-evidence format are recorded.
3. The downstream M0 queue names a responsible and acceptance person; unresolved assignments remain `Blocked`.
4. The sanitized evidence pointer identifies the approval date, approver, controlled source location, and affected document version without copying private contact/signature data.
5. `node hallelujah/docs/backlog/audit-backlog.mjs` passes after all affected references are updated.

## `B00-002` preparation state

Preparatory work began on 12 September 2026 against the existing public WordPress site. The [incident closeout package](b00-002-wordpress-incident-closeout.md) records the clean-rebuild boundary, sanitized public-surface comparison, restricted investigation checklist, credential-rotation scope, search-recovery work, and closure evidence required. The current public sitemap is materially cleaner than the 7 September audit baseline, but public checks cannot prove eradication or authorize closure.

The ticket is `Deferred — production gate`: no named Security responsible person or Executive acceptance person is recorded, and authenticated hosting, CMS, database, log, identity, Search Console, and backup evidence is unavailable.

For sequencing only, the client directed on 13 September 2026 that this ticket be skipped during controlled implementation and returned to before production. This permits an isolated clean rebuild; it does not change `B00-002` to `Done`, designate the legacy source as trusted, or authorize legacy migration, production provisioning, collection, DNS cutover, or publication.

## `B00-007` preparation state

The [partial infrastructure selection](b00-007-infrastructure-selection.md) records Linux, a local-provider preference, Cloudflare planning, prototype-local media, no PostgreSQL media extension, and MinIO as a conditional production candidate. Provider, region, exact Linux release, staging, capacity, email, backup, RPO/RTO, costs, and approvals remain open until prototype evidence or operational requirements exist.

The ticket is `Deferred — production gate` and does not authorize remote staging/production provisioning or third-party activation. Its recorded direction is sufficient for local, provider-neutral implementation and avoids prematurely coupling media files to PostgreSQL.

## Promotion checks for delivery tickets

A delivery item may move to `Ready` only when all answers are yes:

- [ ] Responsible and acceptance owners are named people with confirmed authority.
- [ ] Phase, milestone, target environment, allowed repository scope, and evidence destination are explicit.
- [ ] Every blocking backlog/decision dependency has a dated evidence link, or the ticket states an approved controlled-fixture/withheld behavior.
- [ ] Direct requirement, specification, wireframe/design, architecture/content, and validation links are copied into the extracted issue as applicable.
- [ ] Acceptance criteria identify default plus applicable loading, empty, invalid, failure, timeout/offline, unavailable/expired, no-JavaScript, language, focus, history, and success states.
- [ ] Exact commands and expected non-sensitive artifacts are known for lint, type, unit, integration, browser, accessibility, security, performance, migration, or content checks that apply.
- [ ] The change scope does not require an unapproved fact, translation, provider, package, route, personal-data flow, or destructive migration.

Failure of any check keeps the item `Proposed` or `Blocked`; it is not silently delegated to implementation.

## Slice sequencing after M0

| Pull sequence | Work | Earliest controlling gates |
| ---: | --- | --- |
| 1 | Platform, CMS skeleton, tokens, shared shell, utility failures, progressive motion/media capability modes | M0 exit; `SEC-01`, `DEL-01`, named delivery owners; motion/media amendment for `B01-001`, `B01-003`, `B01-012`–`B01-013` |
| 2 | Home, Emergency, Contact, Privacy, Accessibility | `SAFE-01`–`SAFE-04`, `LANG-01`, applicable privacy decisions; `BRAND-01` and media acceptance for enabled Home media |
| 3 | Doctor/service discovery and governed search index | `CARE-01`–`CARE-06`, `SEARCH-01`; approved launch records |
| 4 | Patient Information, Search UI, About | `ACCESS-01`, `SEARCH-01`–`SEARCH-02`, `INST-01`–`INST-03`, `BRAND-01` as applicable |
| 5 | Appointment request and isolated intake | `APPT-01`–`APPT-04`, `APPT-03`, `DEL-01`; collection separately enabled |
| 6 | Integrated release candidate and production | All included-slice gates, release evidence, `B07-016` approval |

Keep at most two delivery slices active. A technically complete slice remains staging-only until its content, collection, and publication gates are separately approved.

## Operating commands

Run the documentation gate before and after backlog changes:

```sh
node hallelujah/docs/backlog/audit-backlog.mjs
```

Run repository application commands only after `B00-004` creates and documents them. Do not invent package-manager, build, migration, browser, deployment, or production commands in earlier tickets.

## Handoff to an issue tracker

When an issue tracker is selected, create issues one milestone ahead using the required template. Preserve the stable `Bxx-xxx` ID in every title, copy direct source links rather than relying on epic context, represent each dependency as a link, and keep decision/content/evidence issues separate from delivery issues. After the tracker becomes authoritative, replace this board's row status with tracker links and retain this file as the pull-policy index.

On 16 September 2026, Africa/Addis_Ababa, the client directed “close it out if implemented”. `B02-003` moves In review → **Done** for controlled development under the same responsible/review identity `befikadusata` directing Codex in temporary Backend/CMS, Operations-contract and QA roles and the same local target. [Issue #34](https://github.com/dynamicet/hallelujah-website/issues/34) and [completion evidence](evidence/B02-003-canonical-site-settings-2026-09-16.md) record passing fresh PostgreSQL settings persistence/conflict/duplicate/safety/retirement checks, full repository and 92-case bilingual browser verification, reachable-history secret scan and dependency audit. Exact implementation-head [T1 run `35094906914`](https://github.com/dynamicet/hallelujah-website/actions/runs/35094906914) passed full verification and clean reconstruction for `842e0a03bdda745eea0dea6fe527aabcc21a7cfa`. The final acceptance-documentation head must repeat CI before [PR #35](https://github.com/dynamicet/hallelujah-website/pull/35) merges; its matching SHA/run, merge and exact-main result are recorded in issue #34 and PR #35. No authentic-content, hospital approval, production or publication gate is promoted.

On 16 September 2026, Africa/Addis_Ababa, the client directed “start B02-004” after
`B02-003` PR #35 merged as `46afd419cb00125f6953e3aa5d42c467c2ff0aa3` and exact-main
[run 35096707152](https://github.com/dynamicet/hallelujah-website/actions/runs/35096707152) passed.
`B02-004` moves Proposed → Ready → In progress under workspace identity `befikadusata`
directing Codex in temporary Backend/CMS, Medical-contract and QA roles; the same identity is
controlled-development review authority. Dependencies `B02-001`–`B02-002` are Done. The
[execution brief](b02-004-governed-clinician-records.md) permits synthetic local records, medical
workflow checks and inert internal canonical/lifecycle projections while `CARE-01`–`CARE-03`
remain unresolved. [Execution evidence](evidence/B02-004-governed-clinician-records-2026-09-16.md)
tracks scoped checks. Authentic clinicians, schedules, asset intake, appointment/CMS/public routes,
production, providers, collection and publication remain gated.

`B02-004` moves In progress → In review after passing local T0 on 16 September 2026,
Africa/Addis_Ababa under the same responsible/review identity and local target.
[Issue #36](https://github.com/dynamicet/hallelujah-website/issues/36) and
[completion evidence](evidence/B02-004-governed-clinician-records-2026-09-16.md) record fresh
PostgreSQL clinician/medical-role/duplicate/retirement assertions, cross-role denial, full
repository verification and the 92-case bilingual browser matrix, history secret scan and
dependency audit. Client acceptance remains pending; exact-head hosted T1 result is tracked
in issue #36 and the implementation PR and must pass before merge. No authentic
roster, hospital medical approval, schedule, asset, appointment, production or publication gate
is promoted.

On 16 September 2026, Africa/Addis_Ababa, the client directed “close it”. `B02-004` moves
In review → **Done** for controlled development under workspace identity `befikadusata`
directing Codex in temporary Backend/CMS, Medical-contract and QA roles and the same
controlled-development review authority and local target. [Issue #36](https://github.com/dynamicet/hallelujah-website/issues/36),
[PR #37](https://github.com/dynamicet/hallelujah-website/pull/37) and
[completion evidence](evidence/B02-004-governed-clinician-records-2026-09-16.md) record passing
fresh PostgreSQL clinician/medical-role/duplicate/retirement checks, local cross-role denial,
full repository and 92-case bilingual browser verification, history secret scan and dependency
audit. Hosted implementation [run 35105320640](https://github.com/dynamicet/hallelujah-website/actions/runs/35105320640)
passed full verification and clean reconstruction for exact head
`c42c44784ec0518be0a9b3688eb2e0fe162305d1`. The final acceptance-documentation head must
repeat CI before merge; issue #36 and PR #37 retain its matching SHA/run, merge and exact-main
result. Authentic clinicians, hospital medical approval, `CARE-01`–`CARE-03`, schedules,
portraits, appointments, production and publication remain gated.

On 16 September 2026, Africa/Addis_Ababa, the client directed “start” following the proposed
B02-005 synthetic local pull. B02-004 PR #37 merged as
`1a6a2c8c3314794e74a142d59e68629c53ede448`; exact-main
[run 35123369970](https://github.com/dynamicet/hallelujah-website/actions/runs/35123369970) passed.
B02-005 moves Proposed → Ready → In progress under `befikadusata` directing Codex in temporary
Backend/CMS, Clinical-contract and QA roles, with the same identity as controlled-development
review authority. B02-001/B02-002 are Done. The
[execution brief](b02-005-governed-service-records.md) records a controlled sequencing exception to
unresolved CARE-04/CARE-05 for synthetic schemas, local persistence, claim review and inert internal
projections. [Issue #38](https://github.com/dynamicet/hallelujah-website/issues/38) and
[execution evidence](evidence/B02-005-governed-service-records-2026-09-16.md) track checks.
Authentic taxonomy/services, clinical/operations approval, routes, collection and publication remain gated.

B02-005 moved In progress → In review after passing local T0 on 16 September 2026,
Africa/Addis_Ababa, under the same responsible/review identity `befikadusata` and synthetic local
target. [Issue #38](https://github.com/dynamicet/hallelujah-website/issues/38) and
[completion evidence](evidence/B02-005-governed-service-records-2026-09-16.md) record fresh PostgreSQL
service/claim/clinical-role/duplicate/copy/retirement assertions, cross-role denial, full repository
verification, the 92-case bilingual browser matrix, history secret scan and dependency audit.

On 16 September 2026, Africa/Addis_Ababa, the client directed “B02-005 PR is In Review, close out”.
B02-005 moves In review → **Done** for controlled development under the same temporary
Backend/CMS, Clinical-contract and QA responsibility and controlled-development acceptance
authority. Hosted implementation [run 35128628242](https://github.com/dynamicet/hallelujah-website/actions/runs/35128628242)
passed full verification and clean reconstruction for exact head
`f74e4821bed6ee0f19fa0778e9410faabf220e96`. No implementation defect remains open.
The acceptance-documentation head must repeat CI before merge;
[issue #38](https://github.com/dynamicet/hallelujah-website/issues/38) and
[PR #39](https://github.com/dynamicet/hallelujah-website/pull/39) retain its matching SHA/run,
merge and exact-main result. Authentic taxonomy/services, hospital clinical/operations approval,
CARE-04/CARE-05, public routes, collection, providers, production and publication remain gated.

On 16 September 2026, Africa/Addis_Ababa, the client directed “proceed with steps” for B02-006.
B02-004 and B02-005 are Done; PR #39 merged as `9ca9853aa17f69b0aa7ab30086df85d337c5a1ad`
and [exact-main run 35130481886](https://github.com/dynamicet/hallelujah-website/actions/runs/35130481886) passed.
B02-006 moves Proposed → Ready → In progress under `befikadusata` directing Codex in temporary
Backend/CMS, Content/Clinical-contract and QA roles, with the same identity as controlled-development
review authority. The [execution brief](b02-006-governed-care-relationships.md) permits synthetic
local associations and internal stable-ID handoff candidates under a CARE-06 sequencing exception.
Authentic affiliations, hospital approval, appointment collection and publication remain gated.

[Issue #40](https://github.com/dynamicet/hallelujah-website/issues/40) tracks B02-006 and its dependency/evidence boundary.

B02-006 moved In progress → In review on 16 September 2026, Africa/Addis_Ababa under the same
responsible/review identity `befikadusata`, after passing local T0. [Issue #40](https://github.com/dynamicet/hallelujah-website/issues/40)
and [completion evidence](evidence/B02-006-governed-care-relationships-2026-09-16.md) record fresh
PostgreSQL persistence/concurrency/rollback/live-role tests, cross-role denial, full verification,
the 92-case bilingual browser matrix, history secret scan and dependency audit. Hosted exact-head
T1 and client controlled-development acceptance remain pending; production gates are unchanged.

B02-006 hosted implementation T1 [hosted implementation run 35133605026](https://github.com/dynamicet/hallelujah-website/actions/runs/35133605026) passed all steps, including
clean reconstruction, for exact head `78aabb244a67d01b3b3330c40e423334cff9d27e` under [PR #41](https://github.com/dynamicet/hallelujah-website/pull/41).
The ticket remains In review pending client controlled-development acceptance. The final
documentation head must repeat CI before merge; issue #40 and PR #41 track its matching SHA/run.
CARE-06, authentic affiliations, hospital approval, collection and publication remain gated.

On 16 September 2026, Africa/Addis_Ababa, the client directed “close it”. B02-006 moves
In review → **Done** for controlled development under workspace identity `befikadusata`
directing Codex in the same temporary Backend/CMS, Content/Clinical-contract and QA roles,
with the same identity as controlled-development acceptance authority and the same synthetic
local T0/private hosted T1 target. Dependencies B02-004/B02-005 are Done. [Completion evidence](evidence/B02-006-governed-care-relationships-2026-09-16.md)
and [issue #40](https://github.com/dynamicet/hallelujah-website/issues/40) retain passing local
verification and acceptance. Documentation [run 35134533900](https://github.com/dynamicet/hallelujah-website/actions/runs/35134533900)
passed all steps, including clean reconstruction, for `b6e2d6bf5aafd028d0c9d03d04e258ab6906a744`.
The final acceptance commit must repeat hosted CI before [PR #41](https://github.com/dynamicet/hallelujah-website/pull/41)
merges; issue #40 and PR #41 record its matching SHA/run, merge and exact-main result.
CARE-06, authentic affiliations, hospital approval, collection and publication remain gated.

On 17 September 2026, Africa/Addis_Ababa, the client directed “proceed with the steps” for B02-007.
B02-006 PR #41 merged as `da4434ff8703f5c2f07fc9b6bf8b81270e4aec49` after final exact-head
[run 35136076144](https://github.com/dynamicet/hallelujah-website/actions/runs/35136076144) passed;
[exact-main run 35136691110](https://github.com/dynamicet/hallelujah-website/actions/runs/35136691110)
also passed, completing the dependent-execution merge control. B02-001/B02-002 are Done.
B02-007 moves Proposed → Ready → In progress under `befikadusata` directing Codex in temporary
Backend/CMS, Operations/Content-contract, Privacy/Legal-contract and QA roles, with the same
controlled-development review authority. The [execution brief](b02-007-governed-visitor-topics.md)
permits synthetic local topic contracts/decisions and internal consumers under an ACCESS-01
sequencing exception. [Execution evidence](evidence/B02-007-governed-visitor-topics-2026-09-17.md)
tracks required checks. Authentic guidance, hospital signoff, contacts and publication remain gated.

[Issue #42](https://github.com/dynamicet/hallelujah-website/issues/42) tracks the controlled B02-007 execution.

B02-007 moves In progress → In review on 17 September 2026, Africa/Addis_Ababa under the same
responsible/review identity `befikadusata`, after local T0 passes. [Issue #42](https://github.com/dynamicet/hallelujah-website/issues/42)
and [completion evidence](evidence/B02-007-governed-visitor-topics-2026-09-17.md) record strict
topic decisions, independent operations/privacy/legal workflow, task-ordered internal hub,
fresh PostgreSQL persistence/concurrency/rollback/live-role tests, actual elapsed temporary
expiry, cross-role denial, full verification and 92-case bilingual browser matrix, reachable-history
secret scan and dependency audit. Hosted exact-head T1 and client acceptance remain pending.
No authentic guidance, operational signoff, public route, collection or publication is promoted.

B02-007 hosted implementation T1 [run 35244463130](https://github.com/dynamicet/hallelujah-website/actions/runs/35244463130)
passed all steps, including clean reconstruction, for exact head
`3222622361edf9495075905f923d1ab3c8720983` under [PR #43](https://github.com/dynamicet/hallelujah-website/pull/43).
The ticket remains In review pending client controlled-development acceptance. Final documentation
CI must repeat before merge; issue #42 and PR #43 track the matching SHA/run.
ACCESS-01, authentic guidance, hospital signoff, collection and publication remain gated.


## Controlled-development acceptance

On 17 September 2026, Africa/Addis_Ababa, the client directed “close it out”.
B02-007 moves In review → **Done** for controlled development. Responsible and acceptance
authority is workspace identity `befikadusata` directing Codex in the same temporary
Backend/CMS, Operations/Content-contract, Privacy/Legal-contract and QA roles.
The target remains synthetic local T0/private hosted T1. B02-001/B02-002 are Done;
B02-006 final-head and exact-main CI passed as recorded above. The ACCESS-01 controlled
sequencing exception remains limited to synthetic contracts, decisions and internal consumers.

Implementation [run 35244463130](https://github.com/dynamicet/hallelujah-website/actions/runs/35244463130)
passed full verification and clean reconstruction for
`3222622361edf9495075905f923d1ab3c8720983`. Documentation
[run 35245153540](https://github.com/dynamicet/hallelujah-website/actions/runs/35245153540)
also passed every step for exact reviewed head `0ad3fcc233e121bddcdcb784a27123c30aa6d1c4`.
All scoped acceptance criteria pass; no implementation defect remains open.
The final acceptance-documentation head must repeat hosted CI before merge.
[Issue #42](https://github.com/dynamicet/hallelujah-website/issues/42) and
[PR #43](https://github.com/dynamicet/hallelujah-website/pull/43) retain its matching
SHA/run, merge and exact-main result. ACCESS-01, authentic guidance, hospital operations/privacy/legal
approval, contacts, approved translations, public routes, collection, providers, production
and publication remain gated.

## B02-008 controlled execution

On 17 September 2026, Africa/Addis_Ababa, the client directed “continue” for B02-008.
B02-007 PR #43 merged as `2adbbbefcf4b058d39da0c5a95a60891d053cea4`; exact-main
[run 35247200418](https://github.com/dynamicet/hallelujah-website/actions/runs/35247200418) passed.
B02-001/B02-002 are Done. B02-008 moves Proposed → Ready → In progress under workspace identity
`befikadusata` directing Codex in temporary Backend/CMS, Executive/Content-contract, Brand/Legal-contract
and QA roles, with the same controlled-development review authority.
The [execution brief](b02-008-governed-institutional-blocks.md) records an INST-01–INST-03 sequencing
exception for synthetic local T0/private hosted T1 contracts and internal consumers only.
[Execution evidence](evidence/B02-008-governed-institutional-blocks-2026-09-17.md) tracks verification.
Authentic hospital content, executive approval, leadership, relationships, coverage and publication remain gated.

B02-008 moves In progress → In review on 17 September 2026, Africa/Addis_Ababa under the same
responsible/review identity after passing local T0. [Issue #44](https://github.com/dynamicet/hallelujah-website/issues/44)
and [completion evidence](evidence/B02-008-governed-institutional-blocks-2026-09-17.md) record strict
claim evidence, mission conflict denial, independent content/brand/legal workflow, fresh PostgreSQL
persistence/concurrency/rollback/live-role revocation, actual elapsed leadership evidence expiry,
per-block relationship expiry, cross-role denial, full verification and 92-case bilingual shared-component
browser matrix, reachable-history secret scan and dependency audit. Hosted exact-head T1 and
client controlled-development acceptance remain pending; INST-01–INST-03 and production gates remain open.

[PR #45](https://github.com/dynamicet/hallelujah-website/pull/45) tracks the draft review.
Hosted implementation T1 [run 35253420861](https://github.com/dynamicet/hallelujah-website/actions/runs/35253420861)
passed every step, including full verification and clean reconstruction, for exact commit
`e38726255685d939136a8f7f5277f5a39a455315`.
Client controlled-development acceptance remains pending. The final documentation head must
repeat hosted CI before merge; issue #44 and PR #45 retain the matching SHA/run.
INST-01–INST-03, authentic content, executive approval, coverage and publication remain gated.


## B02-008 controlled-development acceptance

On 17 September 2026, Africa/Addis_Ababa, the client directed “close it”.
B02-008 moves In review → **Done** for controlled development. Responsible and acceptance
authority is workspace identity `befikadusata` directing Codex in temporary Backend/CMS,
Executive/Content-contract, Brand/Legal-contract and QA roles, under the same synthetic
local T0/private hosted T1 boundary.

All scoped acceptance criteria pass; no implementation defect remains open. Local schema,
workflow, rendering, PostgreSQL persistence/concurrency/rollback/live-role/elapsed-expiry checks,
role isolation, full verification, history-secret scan and dependency audit pass. Hosted
implementation [run 35253420861](https://github.com/dynamicet/hallelujah-website/actions/runs/35253420861)
passed for `e38726255685d939136a8f7f5277f5a39a455315`; documentation
[run 35254108886](https://github.com/dynamicet/hallelujah-website/actions/runs/35254108886)
passed for `4b8c3e639879e493578cbcfc7d0f357165de2753`.

The final acceptance-documentation head must repeat hosted CI before
[PR #45](https://github.com/dynamicet/hallelujah-website/pull/45) merges.
[Issue #44](https://github.com/dynamicet/hallelujah-website/issues/44) and PR #45 retain its
matching SHA/run, merge and exact-main result. INST-01–INST-03, hospital executive approval,
authentic content, insurance coverage, reviewed translations, media, public routes, collection,
providers and publication remain gated.

## B02-009 controlled execution

On 17 September 2026, Africa/Addis_Ababa, the client directed “start” for B02-009.
B02-008 PR #45 merged as `c451fa5335fd8b4a036c2e2c75c2725912b63848` after final-head
[run 35255139180](https://github.com/dynamicet/hallelujah-website/actions/runs/35255139180) passed;
exact-main [run 35255831837](https://github.com/dynamicet/hallelujah-website/actions/runs/35255831837)
passed. This records B02-008 merge closeout. B02-001/B02-002 are Done.
B02-009 moves Proposed → Ready → In progress under workspace identity `befikadusata`
directing Codex in temporary Backend/CMS, Privacy/Legal-contract and Accessibility/QA roles,
with the same controlled-development review authority. The target is synthetic local T0/private hosted T1.
The [execution brief](b02-009-versioned-utility-statements.md) records a controlled sequencing
exception to APPT-03, SEARCH-02 and formal DEL-01 using the accepted working B00-016 matrix.
[Execution evidence](evidence/B02-009-versioned-utility-statements-2026-09-17.md) tracks checks.
Authentic policy, hospital approval, reviewed translations, real support contacts, public routes,
collection, providers, production and publication remain gated.

[Issue #46](https://github.com/dynamicet/hallelujah-website/issues/46) tracks controlled B02-009 execution.

B02-009 moves In progress → In review on 17 September 2026, Africa/Addis_Ababa under the same
responsible/review identity after passing local T0. [Issue #46](https://github.com/dynamicet/hallelujah-website/issues/46)
and [completion evidence](evidence/B02-009-versioned-utility-statements-2026-09-17.md) record strict
version/inventory/evidence contracts, independent privacy/legal/accessibility reviews, fresh PostgreSQL
persistence/concurrency/rollback/live-role and dependency-approval revocation, retained historical text,
actual elapsed expiry, cross-role denial, full verification and 92 shared-component plus 52 statement
browser cases, reachable-history secret scan and dependency audit.
Hosted exact-head T1 and client controlled-development acceptance remain pending.
APPT-03, SEARCH-02, formal DEL-01, authentic policy/support facts, hospital approval, collection
and publication remain gated.

[Draft PR #47](https://github.com/dynamicet/hallelujah-website/pull/47) tracks B02-009 review.
Hosted implementation T1 [run 35259827827](https://github.com/dynamicet/hallelujah-website/actions/runs/35259827827)
passed every step, including full verification and clean reconstruction/build, for exact commit
`76df9d832465b1467b7855ff8f43264e1baffbd9`. B02-009 remains In review pending client
controlled-development acceptance. Final documentation CI must repeat before merge; issue #46
and PR #47 retain its matching SHA/run. APPT-03, SEARCH-02, formal DEL-01, authentic policy/support
facts, hospital approval, collection, providers, production and publication remain gated.

## Final-head CI harness correction

Final documentation [run 35260612990](https://github.com/dynamicet/hallelujah-website/actions/runs/35260612990)
failed on `9da7dc2883578328b59da5ceda77b0a4c2717bb8` in the existing B01-013/form smoke assertion:
the controlled invalid submission no longer appeared busy/pending/disabled when sampled.
All statement schema checks and the build passed; the run stopped before the new statement browser step.

The form fixture exposes pending state synchronously and clears it after 80 ms. The harness
submitted and sampled pending semantics using separate browser-protocol calls. Under runner load,
the callback could clear pending before the second call arrived. The correction samples the same
busy, visible-pending and disabled-submit conditions within the submission browser task.
It also replaces fixed result sleeps with bounded condition waits requiring visible/focused invalid
summary or visible truthful failure after completion. No assertion, runtime timer, form behavior,
collection or publication gate is weakened. The failure remains part of the evidence; the corrected
exact head requires passing local and hosted verification before review is ready.

The corrected harness subsequently passed full local `pnpm verify`, including all pending/focus/
truthful-failure assertions, the 92-case shared-component matrix and all 52 statement cases.
No application/runtime behavior changed. Corrected exact-head hosted CI remains required before
review is ready; issue #46 and PR #47 retain the final matching SHA/run and failed-run history.

## B02-009 controlled-development acceptance

On 17 September 2026 at 22:06 Africa/Addis_Ababa, the client directed “close it”.
B02-009 moves In review → **Done** for controlled development. Responsible and acceptance
authority is workspace identity `befikadusata` directing Codex in temporary Backend/CMS,
Privacy/Legal-contract and Accessibility/QA roles, under the same synthetic local T0/private hosted T1
boundary. Dependencies B02-001/B02-002 are Done; B02-008 merge and exact-main CI passed.

All scoped local acceptance checks pass, including fresh PostgreSQL persistence, concurrency,
rollback, historical-text retention, live-role/dependency revocation, actual elapsed expiry and role
isolation. Full local verification, the 92-case shared-component and 52-case statement browser
matrices, reachable-history secret scan and dependency audit pass. Corrected exact-head hosted
[run 35261501352](https://github.com/dynamicet/hallelujah-website/actions/runs/35261501352)
passed every step, including full verification and clean reconstruction/build, for
`4c0541582e24930947014e407efd292684905062`. This resolves the documented form-smoke timing failure;
the earlier failed run remains retained as evidence. No scoped implementation defect remains open.

The final acceptance-documentation head must repeat hosted CI before
[PR #47](https://github.com/dynamicet/hallelujah-website/pull/47) merges.
[Issue #46](https://github.com/dynamicet/hallelujah-website/issues/46) and PR #47 retain its matching
SHA/run, merge and exact-main result. APPT-03, SEARCH-02, GOV-01, formal DEL-01, authentic policy
and support facts, hospital privacy/legal/accessibility approval, reviewed translations, public routes,
collection, providers, production and publication remain gated. B02-010 is the next candidate after
successful merge/main closeout, subject to controlled-development readiness checks.

## B02-010 controlled execution

On 17 September 2026, Africa/Addis_Ababa, the client directed “Start” for B02-010.
B02-009 PR #47 merged as `14fe00e40384a4131a651e8ea4f44e9e0e051272`; exact-main
[run 35263794651](https://github.com/dynamicet/hallelujah-website/actions/runs/35263794651)
passed. B02-001–B02-003 are Done. B02-010 moves Proposed → Ready → In progress under
workspace identity `befikadusata` directing Codex in temporary Backend/CMS and SEO/QA
roles, with the same identity as controlled-development review authority. The
[execution brief](b02-010-governed-discovery.md) authorizes synthetic local candidates,
authenticated CMS consumption, HTTP adapters and controlled cache checks only.
LANG-01/LANG-02, authentic content, public/CMS routes, providers, collection, production
and publication remain gated.

[Issue #48](https://github.com/dynamicet/hallelujah-website/issues/48) tracks B02-010 execution and evidence.

B02-010 moves In progress → **In review** on 17 September 2026, Africa/Addis_Ababa after
passing local T0 under the same responsible/review identity. [Issue #48](https://github.com/dynamicet/hallelujah-website/issues/48)
and [completion evidence](evidence/B02-010-governed-discovery-2026-09-17.md) record discovery/HTTP
negatives, fresh PostgreSQL authentication/live-role/cache/rollback/dependency/elapsed-lifecycle checks,
local role isolation, full verification and browser matrices, reachable-history secret scan, dependency
audit and sanitized output. Hosted implementation T1 and client acceptance remain pending; no
production, authentic-language, collection or publication gate is promoted.

Hosted B02-010 implementation T1 [run 35267003343](https://github.com/dynamicet/hallelujah-website/actions/runs/35267003343)
passed every step, including full verification and clean reconstruction/build, for exact commit
`ffebc1aa3bfd4dd122c2eb70db535583ac375cfa` under [draft PR #49](https://github.com/dynamicet/hallelujah-website/pull/49).
B02-010 remains In review pending client acceptance. The documentation head must repeat hosted CI
before merge; issue #48 and PR #49 retain its exact SHA/run. No production/publication gate is promoted.

## B02-010 controlled-development acceptance

On 17 September 2026 at 23:04 Africa/Addis_Ababa, the client directed “close it”.
B02-010 moves In review → **Done** for controlled development under workspace identity
`befikadusata` directing Codex in temporary Backend/CMS and SEO/QA roles, with the same
identity as acceptance authority. Dependencies B02-001–B02-003 are Done; B02-009 merge
and exact-main CI passed. The target remains synthetic local T0/private hosted T1.

All scoped local checks and hosted implementation T1 pass. Documentation
[run 35267682156](https://github.com/dynamicet/hallelujah-website/actions/runs/35267682156)
passed every step, including full verification and clean reconstruction/build, for exact commit
`a90fafc653fe68eea71a84683a5ab7cca44618a1`. The final acceptance-documentation head must
repeat hosted CI before [PR #49](https://github.com/dynamicet/hallelujah-website/pull/49) merges.
[Issue #48](https://github.com/dynamicet/hallelujah-website/issues/48) and PR #49 retain the matching
SHA/run, merge and exact-main result. No scoped implementation defect remains open.

LANG-01/LANG-02, GOV-01, authentic content, hospital approval, historical public statement
routing, production cache/CDN wiring, public/CMS routes, providers, personal-data collection,
provisioning and publication remain gated. B02-011 is the next candidate after successful
merge/main closeout, subject to its controlled-development execution brief and readiness checks.

## B02-010 post-merge cleanup correction

PR #49 merged as `14616f50efca2b816f271dd60ed8fbd49876d197` after final acceptance-head
[run 35268726064](https://github.com/dynamicet/hallelujah-website/actions/runs/35268726064)
passed for `3754675763897344d79260fa8e92f26d5fb9ba11`, automatically closing issue #48.
Exact-main [run 35269268129](https://github.com/dynamicet/hallelujah-website/actions/runs/35269268129)
then failed after all 52 statement browser cases passed: profile cleanup raised `ENOTEMPTY`.
This is a manual merge control failure; dependent execution is paused until checked correction
and exact-main CI pass. B02-010 remains accepted for controlled development.

Client-directed closeout authorizes the scoped browser cleanup correction under
[issue #50](https://github.com/dynamicet/hallelujah-website/issues/50), with `befikadusata`
directing Codex in temporary Frontend/QA roles and the same controlled acceptance authority
on 17 September 2026, Africa/Addis_Ababa. The statement harness now uses five bounded
100 ms recursive-removal retries, matching the existing foundation browser harness.
Browser shutdown and all functional assertions remain intact; exhausted cleanup retries still fail.
Two local 52-case statement matrices and lint pass using pinned Node.js 24.21.0, pnpm 10.27.0
and disposable `/var/tmp` profiles. Local verification passes across all prescribed checks, including the 92-case shared-component matrix
and a third 52-case statement matrix with direct Chromium after a Snap launcher startup failure.
Format/links/backlog/history-secret/diff checks and dependency audit pass. The correction moves
In progress → In review under the same responsible/acceptance identity; hosted correction CI remains required.
The [correction evidence](evidence/B02-010-browser-cleanup-closeout-2026-09-17.md) retains the failed
run and required passing correction/merge/main results. Production/publication gates are unchanged.

Correction [PR #51](https://github.com/dynamicet/hallelujah-website/pull/51) and issue #50
record the final current-head SHA/run, checked merge and exact-main result. Once both checked
merge and exact-main CI pass, the dependent-execution pause above is resolved. Consult these
closeout records before pulling B02-011; no production/publication gate is promoted.

## B02-011 controlled asset intake — 17 September 2026

Correction PR #51 merged as `3fc18a945fcecb0edc70221e956c520bd97c87c5`; exact-main
[run 35270876560](https://github.com/dynamicet/hallelujah-website/actions/runs/35270876560)
passed. Issue #50 is closed. This resolves the preceding dependent-execution pause.

The client directed “start” for B02-011. B01-002 is Done; provider-neutral first-party local
work requires no external-storage decision. B02-011 moves Proposed → Ready → **In progress**
under workspace identity `befikadusata` directing Codex in temporary Backend/CMS, Brand/Privacy
and QA roles, with the same identity as controlled review authority. The
[execution brief](b02-011-governed-asset-intake.md) authorizes synthetic private local intake,
server-owned scan/output receipts, raster derivatives and controlled lifecycle/reference checks.
Non-raster processors and real engine clearance remain open; no completion is claimed.
Authentic assets, production storage/scheduling/cache delivery, providers, collection and
publication remain gated. SEC-02 is required before external storage.

[Initial implementation evidence](evidence/B02-011-governed-asset-intake-2026-09-17.md) records
passing private intake/raster/lifecycle checks, complete and focused PostgreSQL integration, local
verification, clean dependency reconstruction, history secret scan and dependency audit. The first
database review corrected Payload's unchanged merged JSON handling without allowing authored receipts.
Final namespace/lifecycle safeguards repeat focused checks. B02-011 remains **In progress**.

## B02-011 completion execution — 18 September 2026

The client directed “procce to finish it” under the same controlled responsible/review identity.
B02-011 moves In progress → **In review** after passing full local verification, complete/focused
PostgreSQL integration/role isolation, all four remaining format processors, real current-signature
ClamAV clean/EICAR behavior, local synced-store reopening/integrity/orphan recovery and 163 bilingual
media browser cases. Font and caption outputs bind to the requested locale; no translation approval
is inferred. [Completion evidence](evidence/B02-011-governed-asset-completion-2026-09-18.md) records
measured sanitized reports and captures. Final clean reconstruction passes, including complete verification and frozen importer parity.
Hosted exact-head review remains required. Authentic assets, hospital/language approval, external storage (SEC-02), production
storage/backups/scheduling/cache/CDN, providers, collection, public/CMS routes and publication remain gated.

## B02-011 controlled acceptance — 18 September 2026

The client direction to finish promotes B02-011 In review → **Done** for controlled development
under `befikadusata` as responsible and controlled acceptance person, directing Codex in temporary
Backend/CMS, Brand/Privacy and QA roles on 18 September 2026, Africa/Addis_Ababa.
Target: synthetic local T0/private hosted T1. B01-002 is Done and preceding exact-main CI passes.
All local format, real-engine, PostgreSQL, recovery and 163-case media browser checks pass.
[Hosted implementation run 35278163102](https://github.com/dynamicet/hallelujah-website/actions/runs/35278163102) passes full verification and frozen clean
reconstruction for `fb9cad46934da2d5e0c020793a9be7a3f2831380`; the earlier font readiness failure
and meaningful normal/delayed-response retests are retained in the
[completion evidence](evidence/B02-011-governed-asset-completion-2026-09-18.md).
No scoped implementation defect remains open. The final acceptance-documentation head must repeat
CI before [PR #53](https://github.com/dynamicet/hallelujah-website/pull/53) merges. [Issue #52](https://github.com/dynamicet/hallelujah-website/issues/52)
and PR #53 retain its matching SHA/run, checked merge and exact-main result.
Authentic assets/rights/consent/crops, hospital/language acceptance, external storage (SEC-02),
production storage/backups/capacity/scheduling/cache/CDN, providers, collection, public/CMS routes
and publication remain gated.

## B02-012 controlled draft reconciliation — 18 September 2026

B02-011 PR #53 merged as `2c50a3cf26524b2ebb6f1aef9fc2663ebcc9bb4f`; exact-main
[run 35279658953](https://github.com/dynamicet/hallelujah-website/actions/runs/35279658953)
passed. The client directed “start” for the proposed controlled B02-012 reconciliation.
B02-012 moves Proposed → Ready → **In progress** for offline draft/withheld reconciliation
under workspace identity `befikadusata` directing Codex in temporary Content Manager and QA roles;
the same identity is controlled-development review authority. Hospital domain owners remain
unassigned. The [execution brief](b02-012-content-reconciliation.md) limits this pull to source
evidence, proposed dispositions, review-role/decision links and integrity checks.

The register covers 259 available source units with zero unaccounted units and 20 open review
issues. Its completeness claim excludes the unavailable 99-page raw snapshot. All canonical IDs
and hospital approvals remain null; no corrected clinical/operational copy, actual merge/redirect,
CMS/database write, source/media fetch, public route or migration occurs. GOV-01, SEC-01 and
applicable SAFE/CARE/ACCESS/INST/APPT/BRAND/LANG decisions remain required before authentic approval
or migration. [Execution evidence](evidence/B02-012-content-reconciliation-2026-09-18.md)
records local verification; hosted review and controlled client acceptance remain pending.

B02-012 moves In progress → **In review** after the controlled local T0 passes on
18 September 2026, Africa/Addis_Ababa, under the same responsible/review identity. Source
byte comparisons, 259-unit coverage, deterministic report/queue checks, meaningful integrity
and approval negatives, full repository verification, history secret scan and diff checks pass.
Full verification includes the existing 92-case component, 52-case statement and 163-case media
matrices using pinned local Python tooling. Environment failures and the passing retest remain
in the evidence. Hosted exact-head review and controlled client acceptance remain pending;
hospital disposition approval, authentic content migration, production and publication remain gated.

On 18 September 2026, Africa/Addis_Ababa, the client directed “close out B02-012” under
`befikadusata` as responsible and controlled acceptance identity in temporary Content Manager/QA
roles. [Issue #54](https://github.com/dynamicet/hallelujah-website/issues/54) tracks closeout of
implementation commit `24785783f93d9e5396f738525072ed467c728647`. Controlled acceptance is directed;
[PR #55](https://github.com/dynamicet/hallelujah-website/pull/55) carries hosted review.
At closeout initiation the ticket remained In review pending hosted exact-head verification. Checked merge and passing
exact-main CI are required before dependent execution. Hospital approval and all authentic
migration, collection, production and publication gates remain unresolved.

## B02-012 controlled acceptance — 18 September 2026

B02-012 moves In review → **Done** for controlled development under client direction to
“close out B02-012”. Responsible and acceptance person: `befikadusata` directing Codex in temporary
Content Manager/QA roles on 18 September 2026, Africa/Addis_Ababa. Target: synthetic/offline local
T0 and private hosted T1; dependency B02-011 is Done with passing checked merge/main evidence above.
All 259 available source units reconcile, with zero unaccounted units; all source fingerprints,
deterministic report/queue checks and meaningful integrity/approval negatives pass. Full local
verification, fresh dependency audit, reachable-history secret scan and closeout documentation
checks pass. Hosted implementation [run 35340428619](https://github.com/dynamicet/hallelujah-website/actions/runs/35340428619)
passes every step, including full verification and clean reconstruction, for exact commit
`24785783f93d9e5396f738525072ed467c728647`. No scoped implementation defect remains open.
The [evidence](evidence/B02-012-content-reconciliation-2026-09-18.md) retains environment/network
failures and passing retests. Final acceptance-documentation CI must pass before
[PR #55](https://github.com/dynamicet/hallelujah-website/pull/55) merges;
[issue #54](https://github.com/dynamicet/hallelujah-website/issues/54) and PR #55 retain its matching
SHA/run, checked merge and exact-main result. B02-013 is the next candidate after successful
closeout, subject to controlled-development readiness checks. All 20 hospital review issues,
unavailable raw snapshot, hospital approval, authentic migration, collection, production and
publication gates remain unresolved.

## B02-013 controlled content transfer — 18 September 2026

B02-012 PR #55 merged as `ba55eb145ee7308cee5c41408ce28058973ffc86`; exact-main
[run 35341982931](https://github.com/dynamicet/hallelujah-website/actions/runs/35341982931)
passed. The client directed “start” for B02-013. It moves Proposed → Ready → **In progress**
under workspace identity `befikadusata` directing Codex in temporary Backend/Content/QA roles,
with the same identity as controlled-development review authority, on 18 September 2026,
Africa/Addis_Ababa. Dependencies B02-001–B02-012 are Done for controlled development.
Target: synthetic local T0 and private hosted T1. The
[execution brief](b02-013-controlled-content-transfer.md) authorizes validated unsigned-draft
import/update/explicit-merge, immutable dry runs, authenticated governed-content export and
whole-batch transactional rollback through the existing CMS hooks.
[Execution evidence](evidence/B02-013-controlled-content-transfer-2026-09-18.md) records local
checks and remaining gates; [issue #56](https://github.com/dynamicet/hallelujah-website/issues/56)
tracks the same execution. No acceptance is yet claimed. The B02-012 authentic evidence bundle,
hospital migration approval, GOV-01/SEC-01, real identities/content, assets/providers, collection,
production and publication remain gated. B02-014 is the next candidate after successful closeout.

B02-013 moves In progress → **In review** on 18 September 2026, Africa/Addis_Ababa under the same
responsible/review identity after the pure/schema/authority checks, real CLI, full application
verification, complete disposable PostgreSQL CMS/asset matrix, lint/typecheck, history secret scan
and fresh dependency audit pass. Local clean reconstruction hit registry timeouts/connection
resets, including reduced-concurrency retry; it remains an environmental failure. Hosted T1
independently requires full clean reconstruction and remains pending. Implementation commit
`a1c13800bfdc99e5aceeeab7bb114250fbd2a2a4` is pushed to `b02-013-controlled-content-transfer`.
[Issue #56](https://github.com/dynamicet/hallelujah-website/issues/56) and
[draft PR #57](https://github.com/dynamicet/hallelujah-website/pull/57) retain the remaining CI/acceptance gates; no acceptance,
merge or authentic migration approval is claimed.

Hosted [run 35345740923](https://github.com/dynamicet/hallelujah-website/actions/runs/35345740923)
passes all steps including full clean reconstruction for review head
`66376adbfc30a22c15af01ccf7c7f22a50b2ecca`. The final local-database guard requires loopback or a
Unix socket, rejects remote query overrides before CLI initialization and passes pure/type and
focused persisted/CLI retests. The final guard/review-documentation head repeats hosted T1;
its matching SHA/run must be retained in issue #56 and PR #57. B02-013 remains **In review**;
controlled acceptance and checked merge/main closeout remain required.

## Controlled acceptance — 18 September 2026

The client directed “close b02-013”. B02-013 moves In review → **Done** for controlled
development on 18 September 2026, Africa/Addis_Ababa. Responsible and acceptance person:
`befikadusata` directing Codex in temporary Backend/Content/QA roles. Target: synthetic local
T0 and private hosted T1. Dependencies B02-001–B02-012 are Done; B02-012 checked merge
`ba55eb145ee7308cee5c41408ce28058973ffc86` and exact-main run `35341982931` pass.

Final implementation commit `22e98b6b1ac8808f827ebd945d724e7567e4c5c3` passes all hosted
quality/security steps, full verification and independent clean reconstruction under
[run 35346485083](https://github.com/dynamicet/hallelujah-website/actions/runs/35346485083).
Local schema/authority checks, real CLI, complete disposable PostgreSQL integration,
rollback/concurrency/revocation negatives, final local-database guard retests, full application
verification, history secret scan and dependency audit pass. No scoped runtime defect remains open.
The additional local reconstruction's registry failures remain environmental failures;
the independent hosted reconstruction passes.

Final acceptance-documentation CI must pass for its exact SHA before checked merge of
[PR #57](https://github.com/dynamicet/hallelujah-website/pull/57). Its matching SHA/run, merge SHA
and exact-main result must be retained in [issue #56](https://github.com/dynamicet/hallelujah-website/issues/56)
and PR #57. Dependent execution waits for passing exact-main CI. B02-014 is the next candidate
after successful closeout, subject to controlled-development readiness checks.

This acceptance does not resolve GOV-01, SEC-01, authentic reconciliation or hospital migration
approval. Authentic identities/content, providers/assets, personal-data collection, remote
provisioning, production, publication, legacy migration and DNS remain gated.

## B02-014 controlled content integrity and lifecycle — 18 September 2026

B02-013 PR #57 merged as `74ac57b28aee5f09e199834cf6d1aea6605489ae`; exact-main
[run 35362650228](https://github.com/dynamicet/hallelujah-website/actions/runs/35362650228)
passed, resolving the dependent-execution wait above. The client directed “start” for B02-014.
It moves Proposed → Ready → **In progress** under `befikadusata` directing Codex in temporary
QA/Content roles, with the same identity as controlled-development review authority, on
18 September 2026, Africa/Addis_Ababa. Dependencies B02-003–B02-013 are Done for controlled
development; the working B00-016 matrix supplies T0/private hosted T1 acceptance while formal
DEL-01 production signatures remain deferred. The
[execution brief](b02-014-content-integrity-lifecycle.md) authorizes fixed-time synthetic
cross-model regression and deployable-build isolation checks only.
[Execution evidence](evidence/B02-014-content-integrity-lifecycle-2026-09-18.md) records results
and remaining review gates; [issue #58](https://github.com/dynamicet/hallelujah-website/issues/58)
tracks the same execution. Hospital decisions, authentic records/migration, language approval,
providers, collection, remote provisioning, production and publication remain gated.

B02-014 moves In progress → **In review** on 18 September 2026, Africa/Addis_Ababa under
the same responsible/review identity `befikadusata` in temporary QA/Content roles. Fifty
fixed-time cross-model cases, 26 build-isolation controls, complete local repository verification,
all 92 component/52 policy/163 asset browser cases, complete disposable PostgreSQL integration,
frozen clean reconstruction, history secret scan, dependency audit and diff checks pass.
The [evidence](evidence/B02-014-content-integrity-lifecycle-2026-09-18.md) retains the sandbox
failures and passing unrestricted retests. [Issue #58](https://github.com/dynamicet/hallelujah-website/issues/58)
retains implementation SHA, PR and hosted exact-head review pointers. Hosted T1 and client
controlled acceptance remain required before Done; no merge or publication is claimed.

On 18 September 2026, 23:26 Africa/Addis_Ababa, the client directed “close it”. B02-014 moves
In review → **Done** for controlled development under workspace identity `befikadusata`
directing Codex in temporary QA/Content roles, with the same identity as acceptance authority.
Dependencies B02-003–B02-013 are Done; target remains synthetic local T0/private hosted T1.
All recorded local gates pass. Hosted implementation
[run 35390517090](https://github.com/dynamicet/hallelujah-website/actions/runs/35390517090)
passes full verification and independent clean reconstruction for exact commit
`d2942da68fcd082cf5c5c4e6abff6737da62c830` under
[PR #59](https://github.com/dynamicet/hallelujah-website/pull/59).

Final acceptance-documentation CI must pass for its exact SHA before checked merge. Its
matching SHA/run, merge SHA and exact-main result must be retained in
[issue #58](https://github.com/dynamicet/hallelujah-website/issues/58) and PR #59. Dependent
execution waits for passing exact-main CI. B03-004 Home hierarchy is the next implementation
candidate, subject to controlled-development readiness checks. Formal DEL-01, hospital and
language approvals, authentic content/migration, providers, collection, remote provisioning,
production and publication retain their existing gates.

## B03-004 controlled Home hierarchy — 18 September 2026

B02-014 PR #59 merged as `baaa1be922442a657b027f6fa4ea909d61f45ec5`; exact-main
[run 35392349389](https://github.com/dynamicet/hallelujah-website/actions/runs/35392349389) passed,
resolving the dependent-execution wait. The client directed “start” for B03-004. It moves
Proposed → Ready → **In progress** under workspace identity `befikadusata` directing Codex in
temporary Frontend/Product/QA roles, with the same identity as controlled-development review
authority, on 18 September 2026, Africa/Addis_Ababa. B01-006/B01-012 are Done; GOV-02 supplies
planned scope and the centrally replaceable project brand baseline applies. The working B00-016
matrix supplies local T0/private hosted T1 acceptance; formal DEL-01 remains deferred.
The [execution brief](b03-004-home-hierarchy.md) authorizes the reusable Home composition and
separate loopback-only controlled preview with local withheld destinations. B03-005/006 retain
canonical contact and optional governed-record integration. [Execution evidence](evidence/B03-004-home-hierarchy-2026-09-18.md)
records results and remaining review gates. Hosted T1 and controlled client acceptance remain
pending. No hospital route, real contact, clinical claim, authentic media, language approval,
provider, collection, migration, provisioning, production or publication gate is promoted.

B03-004 moves In progress → **In review** on 19 September 2026, Africa/Addis_Ababa under the
same responsible/review identity after 14 SSR/omission/safety/escaping/token cases, 165 responsive/
capability/native-keyboard/media cases, six rejected request controls, complete repository
verification, independent frozen clean reconstruction, dependency audit and history secret scan
pass. The scoped mobile media shift is fixed and retested; six sanitized captures are visually
reviewed. [Issue #60](https://github.com/dynamicet/hallelujah-website/issues/60) and the
[execution evidence](evidence/B03-004-home-hierarchy-2026-09-18.md) retain review pointers and
failed-run/passing-retest history. Hosted current-head T1 and controlled client acceptance remain
required before Done; no merge or publication is claimed.

Implementation `171c904dfb6b40f6a7edf7e413f7f79730ba4f07` is pushed to `b03-004-home-hierarchy`
under [draft PR #61](https://github.com/dynamicet/hallelujah-website/pull/61). The final review
documentation head repeats hosted T1; issue #60 and PR #61 retain its matching SHA/run.
Controlled client acceptance, checked merge and passing exact-main CI remain required.

On 19 September 2026, Africa/Addis_Ababa, the client directed “close it”, supplying controlled
acceptance under `befikadusata` directing Codex in temporary Frontend/Product/QA roles and
authorizing the required scoped closeout correction. Review
[run 35395367464](https://github.com/dynamicet/hallelujah-website/actions/runs/35395367464)
for `804e4243849844972e6cc37ce237d3be20fd57fe` passes full verification but fails independent
reconstruction in the existing asset fallback browser test: the document body is read during
navigation before it exists. The [brief](b03-004-home-hierarchy.md#client-directed-closeout-correction--19-september-2026)
adds only `apps/web/scripts/check-assets-rendered.mjs` for guarded exact-path/complete-document
readiness and streamed delayed-body regression cases. B03-004 remains In review until corrected
hosted T1 passes. The [evidence](evidence/B03-004-home-hierarchy-2026-09-18.md#client-directed-closeout-correction--19-september-2026)
retains the failed hosted run and loopback-denied local attempt. No production, publication,
authentic content, provider, collection or migration gate changes.

Full corrected local verification passes. Hosted correction
[run 35396380781](https://github.com/dynamicet/hallelujah-website/actions/runs/35396380781)
for `017753856f12945056a41faec3909b0ac3831b99` passes asset/Home assertions but fails temporary
Home browser profile deletion with `ENOTEMPTY`. The already scoped Home test receives the
existing five-retry/100 ms removal policy; exhausted cleanup remains a failure. Both hosted
failures remain in the evidence. B03-004 stays In review pending corrected hosted T1.

## B03-004 controlled acceptance — 19 September 2026

The client directed “close it”. B03-004 moves In review → **Done** for controlled development
under `befikadusata` as responsible and controlled acceptance person, directing Codex in temporary
Frontend/Product/QA roles on 19 September 2026, Africa/Addis_Ababa. Target: synthetic local
T0/private hosted T1. B01-006/B01-012 are Done; preceding B02-014 checked merge and exact-main
CI pass. The working B00-016 matrix supplies controlled acceptance; formal DEL-01 remains deferred.

All recorded local checks and focused correction retests pass. Hosted corrected
[run 35396965682](https://github.com/dynamicet/hallelujah-website/actions/runs/35396965682)
passes every step, including full verification and independent frozen clean reconstruction, for
exact commit `3ac1705e2debc4360b8636a64b4fcd7ee78b80a1`. The
[completion evidence](evidence/B03-004-home-hierarchy-2026-09-18.md#controlled-acceptance--19-september-2026)
retains both failed hosted runs and the passing guarded navigation/cleanup retests. No scoped
implementation defect remains open.

Final acceptance-documentation CI must pass for its exact SHA before checked merge of
[PR #61](https://github.com/dynamicet/hallelujah-website/pull/61). Its matching SHA/run, merge SHA
and exact-main result must be retained in [issue #60](https://github.com/dynamicet/hallelujah-website/issues/60)
and PR #61. Dependent execution waits for passing exact-main CI. B03-005 is the next candidate,
subject to a controlled-development brief and readiness checks while B03-001–B03-003 hospital
approvals remain unresolved. Formal DEL-01, hospital/language/media approvals, authentic content,
providers, collection, migration, provisioning, production and publication retain their gates.

## B03-005 controlled Home canonical contacts — 19 September 2026

B03-004 PR #61 merged as `de341e59073ad3da4813b43de7b1686c74f1cebe`; exact-main
[run 35398851259](https://github.com/dynamicet/hallelujah-website/actions/runs/35398851259)
passed, resolving the dependent-execution wait. The client directed “start” for B03-005.
It moves Proposed → Ready → **In progress** under `befikadusata` directing Codex in temporary
Frontend/Operations-contract/QA roles, with the same identity as controlled-development review
authority, on 19 September 2026, Africa/Addis_Ababa. B02-003/B03-004 are Done.
The [execution brief](b03-005-home-canonical-contacts.md) records the explicit synthetic-only
sequencing exception while B03-001–B03-003 hospital approvals remain unresolved. The working
B00-016 matrix supplies T0/private hosted T1 acceptance; formal DEL-01 remains deferred.
Scope: canonical settings consumption by a reusable Home server composition and loopback-only
inert contact preview, with independent workflow, lifecycle, omission and invalidation checks.
[Execution evidence](evidence/B03-005-home-canonical-contacts-2026-09-19.md) retains results
and remaining review gates. Real telephone/email/provider activation, authentic records,
hospital/language/arrival approval, collection, migration, provisioning, production and
publication remain gated. Hosted T1 and client controlled acceptance remain required before Done.

B03-005 moves In progress → **In review** on 19 September 2026, Africa/Addis_Ababa under the
same responsible/review identity after all 134 contact contract cases, 293 contact browser cases,
six sanitized visual captures, full repository verification, sequential independent frozen
reconstruction, history secret scan and dependency audit pass. The
[execution evidence](evidence/B03-005-home-canonical-contacts-2026-09-19.md) retains initial
loopback/DNS/shared-port failures and passing retests. Implementation
`8394bb3c282849362297a34b3bd283c56bf809f1` is pushed under
[issue #62](https://github.com/dynamicet/hallelujah-website/issues/62) and
[draft PR #63](https://github.com/dynamicet/hallelujah-website/pull/63). The final review-documentation
head repeats hosted T1; its matching SHA/run is retained in issue #62 and PR #63. Hosted
current-head T1, client controlled acceptance, checked merge and passing exact-main CI remain
required. No hospital safety/language/arrival approval, authentic contact, callable/provider
activation, collection, migration, provisioning, production or publication gate changes.

## B03-005 controlled acceptance — 19 September 2026

The client directed “close out b03-005”. B03-005 moves In review → **Done** for controlled
development under `befikadusata` as responsible and controlled acceptance person directing
Codex in temporary Frontend/Operations-contract/QA roles on 19 September 2026,
Africa/Addis_Ababa. Target: synthetic local T0/private hosted T1. B02-003/B03-004 are Done;
preceding checked merge and exact-main CI pass. The working B00-016 matrix supplies controlled
acceptance; formal DEL-01 and B03-001–B03-003 hospital approvals remain unresolved.

All recorded local checks and independent frozen reconstruction pass. Hosted exact-head
[run 35401410274](https://github.com/dynamicet/hallelujah-website/actions/runs/35401410274)
passes every step for `941d74c15c5769d38542be575e936cee7bcdcb56`. The
[completion evidence](evidence/B03-005-home-canonical-contacts-2026-09-19.md#controlled-acceptance--19-september-2026)
retains initial environment/shared-port failures and passing retests; no scoped implementation
defect remains open.

Final acceptance-documentation CI must pass for its exact SHA before checked merge of
[PR #63](https://github.com/dynamicet/hallelujah-website/pull/63). Its matching SHA/run, merge SHA
and exact-main result must be retained in [issue #62](https://github.com/dynamicet/hallelujah-website/issues/62)
and PR #63. Dependent execution waits for passing exact-main CI. B03-006 is the next candidate,
subject to a controlled-development brief and readiness checks. Authentic contacts,
hospital/language/call/arrival approval, providers, collection, migration, provisioning,
production and publication retain their gates.

## B03-006 controlled Home governed omissions — 19 September 2026

B03-005 PR #63 merged as `ff696fd4d3f0004e59ece59ca4636c1fef54a096`; exact-main
[run 35403351431](https://github.com/dynamicet/hallelujah-website/actions/runs/35403351431)
passed, resolving the dependent-execution wait. The client directed “start”. B03-006 moves
Proposed → Ready → **In progress** under `befikadusata` directing Codex in temporary
Frontend/Content/QA roles, with the same identity as controlled-development review authority,
on 19 September 2026, Africa/Addis_Ababa. B02-004–B02-006, B02-008, B03-004 and B03-005 are Done.

The [execution brief](b03-006-home-governed-omissions.md) records the synthetic-only sequencing
exception while CARE-01, CARE-04 and INST-01–INST-03 remain unresolved. Scope: explicit bounded
feature selections projected through the existing governed clinician, service, care-relationship
and institutional workflow contracts into optional Home H4/H5/H8; canonical care paths; lifecycle,
language, selection, responsive and whole-section omission checks; no public route.
[Issue #64](https://github.com/dynamicet/hallelujah-website/issues/64) and the
[execution evidence](evidence/B03-006-home-governed-omissions-2026-09-19.md) retain execution and
results. The working B00-016 matrix supplies T0/private hosted T1 acceptance while formal DEL-01
remains deferred. Hosted T1 and client controlled acceptance remain required before Done.
Authentic content, feature/language approval, providers, collection, migration, provisioning,
production and publication remain gated.

B03-006 moves In progress → **In review** on 19 September 2026, Africa/Addis_Ababa under the
same responsible/review identity. Nine SSR states, 289 responsive/capability/accessibility/
canonical-path browser cases, six sanitized reviewed captures, full repository verification,
independent frozen reconstruction, reachable-history secret scan and refreshed dependency audit
pass. The [execution evidence](evidence/B03-006-home-governed-omissions-2026-09-19.md) retains
the initial Node/Python/loopback prerequisites and corrected combined-contact harness assumption.
Issue #64 retains repository review and exact-head hosted pointers. Hosted T1 and controlled client
acceptance remain required before Done; checked merge and passing exact-main CI govern dependent
execution. No authentic content, public route, production or publication gate changes.

## B03-006 controlled acceptance — 19 September 2026

The client directed “close b03-006”. B03-006 moves In review → **Done** for controlled
development under `befikadusata` as responsible and controlled acceptance person directing
Codex in temporary Frontend/Content/QA roles on 19 September 2026, Africa/Addis_Ababa. Target:
synthetic local T0/private hosted T1. B02-004–B02-006, B02-008 and B03-004–B03-005 are Done;
the preceding checked merge and exact-main CI pass. The working B00-016 matrix supplies controlled
acceptance; formal DEL-01, CARE-01, CARE-04 and INST-01–INST-03 remain unresolved.

All recorded local checks and independent frozen reconstruction pass. Hosted exact-head
[run 35428435194](https://github.com/dynamicet/hallelujah-website/actions/runs/35428435194)
passes every step for `5bf5b65c1a7d8273cbbac9fb366fa7b9496edc33`. The
[completion evidence](evidence/B03-006-home-governed-omissions-2026-09-19.md#controlled-acceptance--19-september-2026)
retains initial environment/prerequisite failures, the corrected combined-contact harness
assumption and passing retests; no scoped implementation defect remains open.

Final acceptance-documentation CI must pass for its exact SHA before checked merge of
[PR #65](https://github.com/dynamicet/hallelujah-website/pull/65). Its matching SHA/run, merge SHA
and exact-main result must be retained in [issue #64](https://github.com/dynamicet/hallelujah-website/issues/64)
and PR #65. Dependent execution waits for passing exact-main CI. B03-007 remains gated by B06-005
and formal DEL-01; no successor ticket is promoted. Authentic content/language/feature approval,
public routes, providers, collection, migration, provisioning, production and publication retain
their gates.

## B03-008 controlled Emergency implementation — 22 September 2026

B03-006 PR #65 merged as `0ef397aafce6c4809b597656394aebf00c22e713`; exact-main
[run 35432845708](https://github.com/dynamicet/hallelujah-website/actions/runs/35432845708)
passed, resolving the merge-control wait. B03-007 remains gated by B06-005 and formal DEL-01, but
no implementation ticket depends on B03-007. The client directed a placeholder-based controlled
B03-008 execution. B03-008 moves Proposed → Ready → **In progress** under `befikadusata` directing
Codex in temporary Frontend/Operations-contract/Clinical-contract/QA roles, with the same identity
as controlled-development review authority, on 22 September 2026, Africa/Addis_Ababa.

The [execution brief](b03-008-controlled-emergency.md) records the explicit sequencing exception
while B03-001–B03-003 and SAFE-01–SAFE-04 remain unresolved. Scope is a server-rendered E0–E8
composition and loopback-only preview using visibly synthetic, deliberately invalid and inert
contact, distinction, scope and arrival fixtures. No `tel:`, real safety fact, map/provider request,
public route, collection, authentic content, migration, provisioning, production or publication is
authorized. [Issue #66](https://github.com/dynamicet/hallelujah-website/issues/66) tracks execution.
The working B00-016 matrix supplies T0/private hosted T1 controlled acceptance; formal DEL-01 and
all hospital/language/physical-device approvals retain their gates.

B03-008 moves In progress → **In review** on 22 September 2026, Africa/Addis_Ababa, under the same
responsible/review identity after 13 SSR contract cases, 58 responsive/capability/accessibility/
isolation browser cases, four sanitized reviewed captures, complete repository verification and
optimized-build isolation pass. The
[execution evidence](evidence/B03-008-controlled-emergency-2026-09-22.md) retains prerequisite,
environment and corrected 200% reflow history. Issue #66 retains repository and hosted-review
pointers. Hosted exact-head T1 and controlled client acceptance remain required before Done;
checked merge and passing exact-main CI govern dependent execution. No hospital safety/language,
authentic content, public route, provider, production or publication gate changes.

## B03-008 controlled acceptance — 23 September 2026

The client directed “Close out B03-008”. B03-008 moves In review → **Done** for controlled
development under `befikadusata` as responsible and controlled acceptance person directing Codex
in temporary Frontend/Operations-contract/Clinical-contract/QA roles on 23 September 2026,
Africa/Addis_Ababa. Target remains synthetic local T0/private hosted T1 under the working B00-016
matrix and controlled sequencing exception. B03-001–B03-003, SAFE-01–SAFE-04, LANG-01, SEC-02 and
formal DEL-01 remain unresolved.

All recorded local checks and independent frozen reconstruction pass. Replacement exact-head
[run 35783340838](https://github.com/dynamicet/hallelujah-website/actions/runs/35783340838)
passes every step for `05900cd1994cdf5530ebf856db53db6f0a13fc78`. The
[completion evidence](evidence/B03-008-controlled-emergency-2026-09-22.md#controlled-acceptance--23-september-2026)
retains the failed predecessor run, corrected 320 px/200%-text defect, environment/prerequisite
failures and passing retests; no scoped controlled-implementation defect remains open.

Final acceptance-documentation CI must pass for its exact SHA before checked merge of
[PR #67](https://github.com/dynamicet/hallelujah-website/pull/67). Its matching SHA/run, merge SHA
and exact-main result must be retained in [issue #66](https://github.com/dynamicet/hallelujah-website/issues/66)
and PR #67. Dependent execution waits for passing exact-main CI; no successor ticket is promoted.
Authentic emergency records and claims, call activation, professional language and human/device/
on-site evidence, `/emergency/`, providers, production, emergency use and publication remain
withheld.

## B00-008–B00-010 topology and sequencing decision — 23 September 2026

The client selected Option 1: one PostgreSQL instance per environment with logically separate
public-content and appointment databases, independent least-privilege roles and credentials,
separate migration histories, and separate encrypted backup/restore sets. The
[controlled-development boundary](b00-008-010-logical-database-delivery-boundary.md) records the
decision and its evidence stages.

This corrects the prior all-or-nothing dependency interpretation. Disposable local isolation,
migration and synthetic restore evidence are controlled-development requirements; selected-host
networking, secret rotation, off-host backup operations, named ownership, approved RPO/RTO and a
dated restore rehearsal remain remote/activation requirements. `B00-008`–`B00-010` are not marked
Done and no personal-data collection or remote appointment persistence is authorized. They no
longer block controlled local `B03-015` delivery by themselves; `B03-012`–`B03-014` must still
define the field, privacy/security and request-state contracts before that implementation starts.

## B03-008 merge closeout and B03-009 planning — 23 September 2026

B03-008 PR #67 merged as `2a7f5d11d42cd5551cb65bca20b56e65d1fd87f3` after its exact-head
documentation [run 35825256269](https://github.com/dynamicet/hallelujah-website/actions/runs/35825256269)
passed for `4432a94c824a0456f36abcb01b426308ed61ac0e`. Exact-main
[run 35844236363](https://github.com/dynamicet/hallelujah-website/actions/runs/35844236363)
then passed for the merge SHA, resolving the dependent-execution wait.

The client directed recording that closeout and creating the controlled-development brief and
tracking issue for B03-009. The [B03-009 execution brief](b03-009-emergency-resilience.md) defines
the proposed synthetic-only boundary for withheld, expired, unsupported call handoff, required
arrival unavailable, optional-map failure and no-JavaScript/CSS/media states.
[Issue #68](https://github.com/dynamicet/hallelujah-website/issues/68) retains the proposed ticket.
B03-009 remains **Proposed**: this planning direction does not promote it to Ready or In progress
and does not authorize implementation. B03-001–B03-003, SAFE-01–SAFE-04, LANG-01, SEC-02 and
formal DEL-01 remain unresolved; authentic data, active calls, `/emergency/`, providers,
production, emergency use and publication remain withheld.

## B03-009 controlled Emergency resilience implementation — 23 September 2026

The client subsequently directed implementation. The completed B03-008 merge and exact-main CI,
the Done B01-010–B01-012 dependencies, the [controlled execution brief](b03-009-emergency-resilience.md)
and [issue #68](https://github.com/dynamicet/hallelujah-website/issues/68) satisfy the controlled
readiness boundary. B03-009 moves Proposed → Ready → **In progress** under workspace identity
`befikadusata` directing Codex in temporary Frontend and QA roles.

Execution is limited to visibly synthetic loopback fixtures, fail-closed state resolution, inert
rendering and automated evidence. B03-001–B03-003, SAFE-01–SAFE-04, LANG-01, SEC-02 and formal
DEL-01 remain production gates. No authentic safety value, active call, provider request, public
`/emergency/` route, production behavior, emergency-use claim or publication is authorized.

B03-009 moves In progress → **In review** on 23 September 2026, Africa/Addis_Ababa, under the same
responsible/review identity after passing 52 resolver/SSR contract cases, 255 responsive/capability/
accessibility/isolation browser cases, full repository verification, independent frozen clean
reconstruction, dependency audit and reachable-history secret scan. The optimized build retains
only `/`, `/_not-found` and `/health`; no Emergency fixture or state adapter enters the deployable
graph. The [execution evidence](evidence/B03-009-emergency-resilience-2026-09-23.md) retains the
controlled scope, results and corrected development/environment failures.

Private hosted exact-head T1, explicit controlled client acceptance, checked merge and passing
exact-main CI remain required before Done. B03-010 retains human, assistive-technology,
physical-device, comprehension, language, live-call and on-site acceptance. All authentic safety,
public-route, provider, production, emergency-use and publication gates remain withheld.

## B03-009 controlled acceptance — 23 September 2026

The client directed “close out b03-009”. B03-009 moves In review → **Done** for controlled
development under `befikadusata` as responsible and controlled acceptance person directing Codex
in temporary Frontend and QA roles on 23 September 2026, Africa/Addis_Ababa. Target remains
synthetic local T0/private hosted T1 under the working B00-016 matrix. B03-001–B03-003,
SAFE-01–SAFE-04, LANG-01, SEC-02 and formal DEL-01 remain unresolved.

All recorded local checks and independent frozen reconstruction pass. Exact-head
[run 35893534863](https://github.com/dynamicet/hallelujah-website/actions/runs/35893534863)
passes every step for `3cd89ae3bfe95866faf306be2d9d91534a1a0309`. The
[completion evidence](evidence/B03-009-emergency-resilience-2026-09-23.md#controlled-acceptance--23-september-2026)
retains the corrected development and environment attempts plus passing retests; no scoped
controlled-implementation defect remains open.

Final acceptance-documentation CI must pass for its exact SHA before checked merge of
[PR #69](https://github.com/dynamicet/hallelujah-website/pull/69). Its matching SHA/run, merge SHA
and exact-main result must be retained in [issue #68](https://github.com/dynamicet/hallelujah-website/issues/68)
and PR #69. Dependent execution waits for passing exact-main CI; B03-010 is not promoted.
Authentic emergency records and claims, call activation, professional language and human/device/
on-site evidence, `/emergency/`, providers, production, emergency use and publication remain
withheld.

## B03-012–B03-014 controlled appointment decisions — 23 September 2026

The client approved the recommended minimized-field, first-party privacy/security and authoritative
request-state defaults together. `B03-012`–`B03-014` move Proposed → Ready → **Done for controlled
development** under workspace identity `befikadusata` directing Codex in temporary Product,
Privacy, Operations, Backend and Security roles, with the same identity as controlled-development
acceptance authority. The [controlled appointment contract](b03-012-014-controlled-appointment-contract.md)
is the dated decision evidence.

The approved schema requires name, phone and care route; conditionally requires one synthetic
doctor or service canonical ID; permits an optional preferred date; and excludes notes, email,
new/returning status, uploads, medical history, payment and insurance. The privacy boundary is
first-party only, denies personal field values in logs, records an unchecked notice acknowledgment
without asserting a lawful basis, and uses a working 90-day-after-closure deletion rule. The
appointment database commit is authoritative; atomic idempotency, same-intent reconciliation,
opaque references and delivery-independent acceptance govern request outcomes.

This completion unlocks `B03-015` readiness review with synthetic data under the approved
`B00-008`–`B00-010` local boundary. `B03-011`, `APPT-01`, authentic `CARE-01`/`CARE-04` selectors,
lawful-basis and public-notice approval, named recipients/access, `SEC-02`, formal `DEL-01`, remote
persistence, personal-data collection, providers, production and publication remain gated.

## B03-015 controlled implementation start — 23 September 2026

The client directed the approved B03-012–B03-014 defaults to be implemented and asked that B03-015
begin on its own branch. `B03-015` moves Proposed → Ready → **In progress** on
`b03-015-appointment-request-foundation` under `befikadusata` directing Codex in temporary Backend,
Security and QA roles. The [execution brief](b03-015-appointment-request-foundation.md) is the scoped
implementation contract.

The controlled slice adds the closed server schema, fail-closed POST boundary, CSRF/body/abuse
controls, appointment-only data access, a separate forward migration/history, function-only runtime
authorization and value-free audit events. The database operation has an independent hard stop for
non-synthetic data. The application gate still accepts only `disabled`; no Appointment page, token
issuer, staff/read API, remote persistence, provider or personal-data path is enabled.

Local contract, type, lint, format and disposable database checks pass, including cross-database
denial, direct-table denial, synthetic persistence, selector/rate rejection, audit inspection and
appointment-only dump/restore. Full repository verification and clean reconstruction remain the
next review gates. B03-016 still owns atomic idempotency and unknown-outcome reconciliation;
`B03-011`, APPT-01, authentic selectors, final privacy/security/operations approvals, remote
infrastructure, production and publication remain open.

On 24 September 2026, B03-015 moves In progress → **In review** after full repository verification,
independent frozen reconstruction, the repeated disposable appointment database/restore suite,
reachable-history secret scan and registry dependency audit passed. The
[execution evidence](evidence/B03-015-appointment-request-foundation-2026-09-24.md) records the
results and corrected sandbox, initdb, build-loading, introduction-gate and asset-tool setup
attempts. Hosted exact-head CI, review tracking and explicit controlled client acceptance remain
required before Done; no activation or downstream gate changes.

## B03-015 controlled acceptance — 24 September 2026

The client directed “close out b03-015”. B03-015 moves In review → **Done** for controlled
development under `befikadusata` as responsible and controlled acceptance person directing Codex
in temporary Backend, Security and QA roles on 24 September 2026, Africa/Addis_Ababa. The target
remains synthetic local T0/private hosted T1 under the working B00-016 matrix.

All recorded local checks pass. Exact-head
[run 35985726275](https://github.com/dynamicet/hallelujah-website/actions/runs/35985726275)
passes every step for `894902ee62e1e72def84677833ff31d1e786cc6a`, including the isolated
appointment migration/permission/restore harness, full verification and independent frozen clean
reconstruction. The
[completion evidence](evidence/B03-015-appointment-request-foundation-2026-09-24.md#controlled-acceptance)
retains corrected attempts and passing retests; no scoped controlled-implementation defect remains
open.

Final acceptance-documentation CI must pass for its exact SHA before checked merge of
[PR #71](https://github.com/dynamicet/hallelujah-website/pull/71). Its matching SHA/run, merge SHA
and exact-main result must be retained in [issue #70](https://github.com/dynamicet/hallelujah-website/issues/70)
and PR #71. Dependent execution waits for passing exact-main CI. B03-016 is the next controlled
delivery candidate but is not promoted by this acceptance.

`B03-011`, `APPT-01`, `CARE-01`, `CARE-04`, final privacy/security/operations approvals, named
recipients and staff access, `SEC-02`, B03-016, formal `DEL-01`, remote infrastructure, personal-
data collection, authentic selectors/notices, providers, production and publication remain open.

## B03-015 exact-main closeout and B03-016 controlled start — 25 September 2026

B03-015 PR #71 merged as `a59980a1b979110c5891e5d8f1eb1b57abe3e23b`; exact-main
[run 35989108824](https://github.com/dynamicet/hallelujah-website/actions/runs/35989108824)
passed. This clears the dependent-execution pause recorded above.

The client then directed the next implementation. `B03-016` moves Proposed → Ready → **In
progress** on branch `b03-016-appointment-idempotency` under `befikadusata` directing Codex in
temporary Backend, Security and QA roles, with the same identity as controlled-development review
authority, on 25 September 2026, Africa/Addis_Ababa. Completed `B03-014` and `B03-015`, the
[controlled appointment contract](b03-012-014-controlled-appointment-contract.md), the
[execution brief](b03-016-appointment-idempotency.md), and
[issue #72](https://github.com/dynamicet/hallelujah-website/issues/72) govern the pull.

The scope is atomic synthetic intent persistence, keyed payload comparison, equivalent retry and
unknown-outcome reconciliation, conflict rejection, opaque reference continuity, lifecycle
cleanup, least privilege and concurrency/timeout evidence. Collection remains disabled; no public
Appointment page, receipt read route, authentic selector/notice, staff access, provider, remote
database, production or publication capability is authorized.

On 25 September 2026, B03-016 moves In progress → **In review** after all local T0 gates passed.
The [execution evidence](evidence/B03-016-appointment-idempotency-2026-09-25.md) records unit and
database reconciliation, conflict, concurrent duplicate, pre-commit rollback, lost-response,
delivery continuity, lifecycle, least-privilege, audit-redaction and independent restore proofs,
plus full repository verification, clean reconstruction, dependency audit and history secret scan.
Hosted exact-head CI and explicit controlled acceptance remain required before Done. Collection,
remote persistence, authentic data, providers, staff access, production and publication remain
disabled.

The client then directed “Close out B03-016”. B03-016 moves In review → **Done** for controlled
development under `befikadusata` as responsible and controlled acceptance person directing Codex
in temporary Backend, Security and QA roles on 25 September 2026, Africa/Addis_Ababa. Accepted
implementation head `2b7760074550439614de86d088d23e2e1e940795` has matching exact-head
[run 36107298049](https://github.com/dynamicet/hallelujah-website/actions/runs/36107298049), which
passes every hosted gate. The
[completion evidence](evidence/B03-016-appointment-idempotency-2026-09-25.md#controlled-acceptance)
retains the local and hosted proofs; no scoped controlled-implementation defect remains open.

Final acceptance-documentation CI must pass for its exact SHA before checked merge of
[PR #73](https://github.com/dynamicet/hallelujah-website/pull/73). Its matching SHA/run, merge SHA
and exact-main result must be retained in [issue #72](https://github.com/dynamicet/hallelujah-website/issues/72)
and PR #73. Dependent execution waits for passing exact-main CI. B03-017 is not promoted by this
acceptance, and no collection, remote persistence, authentic data, provider, staff access,
production or publication authority is granted.

## B03-016 exact-main closeout — 25 September 2026

Final acceptance-documentation
[run 36108985856](https://github.com/dynamicet/hallelujah-website/actions/runs/36108985856)
passed for exact head `9b5577482045c276fcda101220aba94d4ae933e7`.
[PR #73](https://github.com/dynamicet/hallelujah-website/pull/73) then merged as
`aa92d695302de3fa5b153c3bc8e756dcd70593e8`, automatically closing
[issue #72](https://github.com/dynamicet/hallelujah-website/issues/72). Exact-main
[run 36110485980](https://github.com/dynamicet/hallelujah-website/actions/runs/36110485980)
passed for that merge commit. This clears the dependent-execution pause and completes B03-016
closeout. B03-017 may now undergo its own controlled-readiness review but is not promoted by this
record. Personal-data collection, authentic content, external messaging providers, staff access,
remote persistence, production and publication remain disabled.

## B03-017 controlled Appointment implementation start — 26 September 2026

The client directed use of synthetic content and an English-only controlled implementation, with
“Patient Experience Team” as a synthetic recipient label. B03-017 moves Proposed → Ready → **In
progress** on `b03-017-appointment-page` under `befikadusata` directing Codex in temporary
Frontend, Backend-contract and QA roles, with the same identity as controlled-development review
authority. [Issue #74](https://github.com/dynamicet/hallelujah-website/issues/74) and the
[execution brief](b03-017-controlled-appointment-page.md) govern the pull.

The controlled sequencing exception permits an English-only A0–A8 loopback/noindex composition
using visibly synthetic selectors and operating labels. It mounts no public `/appointments/`
route, accepts or persists no request, keeps `PERSONAL_DATA_COLLECTION=disabled`, and activates no
recipient account, staff access, WhatsApp, Telegram or other provider. A later approved messaging
integration remains notification-only; database acceptance remains authoritative.

B03-011/APPT-01, LANG-01, authentic CARE-01/CARE-04 selectors, final privacy/operations approval,
named recipients and staff access, SEC-02, B03-018–B03-019, DEL-01, remote persistence, production
and publication remain unresolved. This controlled start closes none of those gates.

On 28 September 2026, B03-017 moves In progress → **In review** after all required local T0 gates
passed. The [execution evidence](evidence/B03-017-controlled-appointment-page-2026-09-26.md)
records the 20-case server-rendered contract, 284-case responsive/capability/interaction matrix,
production build, full repository verification, independent frozen clean reconstruction,
dependency audit, reachable-history secret scan and sanitized visual review. The optimized build
still has no public Appointment page route; collection and providers remain disabled. Hosted
exact-head CI and explicit controlled acceptance remain required before Done, and the unresolved
gates listed above remain unchanged.

## B03-017 controlled acceptance — 28 September 2026

The client directed “B03-017 is In Review, close out”. B03-017 moves In review → **Done** for
controlled development under `befikadusata` as responsible and controlled acceptance person,
directing Codex in temporary Frontend, Backend-contract and QA roles on 28 September 2026,
Africa/Addis_Ababa. The target remains synthetic local T0/private hosted T1 under the working
B00-016 matrix.

Accepted implementation head `e4c2070644f35667a9cb71b0f0de4934db152d19` has matching hosted
[run 36429200636](https://github.com/dynamicet/hallelujah-website/actions/runs/36429200636), which
passes every hosted gate. The
[completion evidence](evidence/B03-017-controlled-appointment-page-2026-09-26.md#controlled-acceptance)
retains the local and hosted proofs; no scoped controlled-implementation defect remains open.

Final acceptance-documentation CI must pass for its exact SHA before checked merge of
[PR #75](https://github.com/dynamicet/hallelujah-website/pull/75). Its matching SHA/run, merge SHA
and exact-main result must be retained in [issue #74](https://github.com/dynamicet/hallelujah-website/issues/74)
and PR #75. Dependent execution waits for passing exact-main CI. B03-018 is not promoted by this
acceptance.

This closeout accepts only the synthetic, English-only loopback/noindex composition. B03-011/
APPT-01, LANG-01, authentic CARE-01/CARE-04 selectors, final privacy and operations approval,
named recipients and staff access, B03-018 provider delivery, SEC-02, DEL-01, remote persistence,
personal-data collection, production and publication remain gated.

## B03-017 exact-main closeout — 28 September 2026

Final acceptance-documentation
[run 36432057419](https://github.com/dynamicet/hallelujah-website/actions/runs/36432057419)
passed for exact head `37b88354590837b017316b38a46f66464339e535`.
[PR #75](https://github.com/dynamicet/hallelujah-website/pull/75) then merged as
`6e8686fe6b768d0e13900d48c258755164e0d910`, automatically closing
[issue #74](https://github.com/dynamicet/hallelujah-website/issues/74). Exact-main
[run 36434020886](https://github.com/dynamicet/hallelujah-website/actions/runs/36434020886)
passed for that merge commit. This clears the dependent-execution pause and completes B03-017
closeout. B03-018 remains unpromoted and blocked by B00-014, B03-011, the activation boundary of
B03-013, SEC-02 and provider approval. B03-019 consequently remains blocked by B03-018 and DEL-01.
No personal-data collection, external delivery, staff access, remote persistence, production or
publication authority is granted.

## B01-006 focused header correction reopening — 28 September 2026

The client directed reopening `B01-006` after a source, rendered-shell and regression-coverage
review. B01-006 moves Done → **Ready — reopened correction** under `befikadusata` directing Codex
in temporary Frontend Lead and QA roles, with the same identity as controlled-development review
authority. The [reopening review](evidence/B01-006-header-review-2026-09-28.md) records that the
existing checks pass while wide visual/keyboard order diverges, compact disclosure omits utilities
and routine actions, a forced-compact mode is absent, and identity naming appends English text.

The [focused execution brief](b01-006-global-shell-navigation.md#reopening-trigger-and-focused-correction)
limits the correction to shell composition/API/CSS, controlled callers, first-party enhancement if
needed, regression tests, documentation and sanitized evidence. Ready does not claim implementation
start or acceptance. A later promotion must record its branch/review issue state and responsible
person; Done requires the new local matrix, visual review, exact review-head hosted T1, controlled
acceptance, checked merge and passing exact-main CI. The original 14 September evidence remains
historical. No route, authentic translation or content, provider, collection, production,
deployment or publication authority is granted.

The client subsequently directed “commit and start implementation”. Reopening documentation was
committed on `main` as `96ab85f`, and B01-006 moves Ready → **In progress** on branch
`b01-006-header-correction` under the same responsible and controlled-review identity. The bounded
implementation may change the shell public contract/composition/CSS, controlled callers and
static/rendered regression checks. In review, acceptance, merge, production and publication are not
claimed by this start record.

The client subsequently directed “let's promote it”. On 28 September 2026, Africa/Addis_Ababa,
B01-006 moves In progress → **In review — reopened correction** under the same responsible/review
identity after the focused implementation, targeted static/browser checks, full repository
verification and sanitized visual review passed locally. The
[correction evidence](evidence/B01-006-header-correction-2026-09-28.md) covers governed localized
identity naming, compact membership/tabbability, responsive and language-forced modes, actual Tab
versus visual order, Escape restoration, native no-JavaScript disclosure, target sizing and
overflow. Exact review-head hosted `T1` and explicit controlled acceptance remain required before
Done; checked merge and exact-main CI must follow. No route, authentic translation/content,
provider, collection, production, deployment or publication gate is promoted.

Correction implementation commit `bc76a58` is submitted under
[pull request #76](https://github.com/dynamicet/hallelujah-website/pull/76). Its exact current head
must pass the hosted quality-and-security workflow before controlled acceptance.

## B01-006 focused correction controlled acceptance — 28 September 2026

The client directed “B01-006 is In Review, close out”. B01-006 moves In review → **Done** for the
focused controlled-development correction under `befikadusata` as responsible and controlled
acceptance person, directing Codex in temporary Frontend Lead and QA roles on 28 September 2026,
Africa/Addis_Ababa.

Accepted review head `87674b960a41c9e735602971fdfde99c76ec4a66` has matching hosted
[run 36451735815](https://github.com/dynamicet/hallelujah-website/actions/runs/36451735815), which
passes the complete `quality-and-security` workflow. The
[correction evidence](evidence/B01-006-header-correction-2026-09-28.md#controlled-acceptance)
retains the local and hosted proofs; no scoped controlled-development defect remains open.

Final acceptance-documentation CI must pass for its exact SHA before checked merge of
[PR #76](https://github.com/dynamicet/hallelujah-website/pull/76). Its matching run, merge SHA and
exact-main result must be retained in [issue #10](https://github.com/dynamicet/hallelujah-website/issues/10)
and PR #76. This acceptance adds no route, authentic translation/content, provider, collection,
production, deployment or publication authority; named production roles remain at their gates.

## B01-006 focused correction exact-main closeout — 28 September 2026

Final acceptance-documentation
[run 36460415859](https://github.com/dynamicet/hallelujah-website/actions/runs/36460415859)
passed for exact head `a453d686834ebc981af0f43bb10c4c9337c1070d`.
[PR #76](https://github.com/dynamicet/hallelujah-website/pull/76) then merged as
`430ef0f29a7509f553377f9ce8ab9472c6180642`. Exact-main
[run 36462238838](https://github.com/dynamicet/hallelujah-website/actions/runs/36462238838)
passed for that merge commit, and [issue #10](https://github.com/dynamicet/hallelujah-website/issues/10)
was closed with the matching evidence. This completes the focused B01-006 controlled-development
closeout. Production/publication, authentic language/content, canonical contact, physical-device
and assistive-technology gates remain with their owning controls.

## B04-007 controlled clinician-directory start — 29 September 2026

The client directed “let's start B04-007”. B04-007 moves Proposed → Ready → **In progress** on
branch `b04-007-controlled-clinician-directory` under `befikadusata` directing Codex in temporary
Frontend, Backend-contract and QA roles, with the same identity as controlled-development review
authority, on 29 September 2026, Africa/Addis_Ababa. [Issue #77](https://github.com/dynamicet/hallelujah-website/issues/77)
and the [execution brief](b04-007-controlled-clinician-directory.md) govern the pull.

The controlled sequencing exception permits a synthetic English D0–D6 clinician-directory
composition through the existing governed clinician projection, with bounded GET search,
synthetic specialty filter, deterministic pagination and complete controlled states. It remains a
loopback-only noindex review tool; no public `/doctors/` route, authentic roster, profile, portrait,
schedule, availability, staffed contact, appointment action, provider, personal data, production or
publication capability is authorized.

B04-001, B04-002, CARE-01, CARE-02, SEARCH-01, LANG-01 and DEL-01 remain unresolved. This start
closes none of those gates and does not promote B04-008 or any later care-discovery ticket.

The controlled implementation has passing local focused, full-workspace and frozen clean-copy
verification. Its [sanitized evidence record](evidence/B04-007-controlled-clinician-directory-2026-09-29.md)
retains the exact checks, corrected execution attempts and visual specimens. Hosted
[run 36539369658](https://github.com/dynamicet/hallelujah-website/actions/runs/36539369658)
passes for accepted implementation head `2a24c83c065b98ef7d79d7559bf1e89e6c993982`.

The client subsequently directed “close it out”. B04-007 moves In progress → In review →
**Done** for controlled development under the same responsible and controlled-acceptance identity
on 29 September 2026, Africa/Addis_Ababa. Final acceptance-documentation CI, checked merge of
[PR #78](https://github.com/dynamicet/hallelujah-website/pull/78), and exact-main CI must pass and be
retained in [issue #77](https://github.com/dynamicet/hallelujah-website/issues/77). B04-008 is not
promoted. B04-001, B04-002, CARE-01, CARE-02, SEARCH-01, LANG-01, DEL-01, authentic clinician data,
profiles, providers, production and publication remain gated.

Final acceptance-documentation
[run 36541780392](https://github.com/dynamicet/hallelujah-website/actions/runs/36541780392)
passed for exact head `b48aa336edb75dfcbcfb9a860a610a878fc1b15b`.
[PR #78](https://github.com/dynamicet/hallelujah-website/pull/78) merged as
`908fad5242e778901cbbdfe6ed20c79c9555d109`, automatically closing
[issue #77](https://github.com/dynamicet/hallelujah-website/issues/77), and exact-main
[run 36564303277](https://github.com/dynamicet/hallelujah-website/actions/runs/36564303277)
passed for that merge commit. B04-007 closeout is complete; the unresolved gates and B04-008 state
remain unchanged.

## B04-008 controlled clinician-directory validation start — 29 September 2026

The client directed “start”. B04-008 moves Proposed → Ready → **In progress** on branch
`b04-008-clinician-directory-validation` under `befikadusata` directing Codex in temporary QA,
Accessibility-test and Content-contract roles, with the same identity as controlled-development
review authority, on 29 September 2026, Africa/Addis_Ababa. [Issue #79](https://github.com/dynamicet/hallelujah-website/issues/79),
the [execution brief](b04-008-controlled-clinician-directory-validation.md) and working B00-016
matrix govern the pull. B04-007 is Done and exact-main CI passed.

The controlled sequencing exception permits automated local T0/private hosted T1 evidence against
the synthetic English loopback/noindex directory only. `DEL-01`, B04-001, B04-002, CARE-01,
CARE-02, SEARCH-01 and LANG-01 remain unresolved; named human assistive-technology/content
acceptance, authentic relevance, public routes, profiles, providers, production and publication
remain gated.

The focused static validation currently passes 24 relevance, URL, lifecycle, canonicality,
semantics and resilience cases. The rendered validation passes 12 history, keyboard, Chromium
accessibility-tree, 320/360 reflow and fail-closed cases. It exposed and corrected a scoped preview
integration defect: the existing first-party search-controls enhancement was not loaded, allowing
browser-restored checkbox state to disagree with the URL after Back navigation. The
[sanitized evidence record](evidence/B04-008-controlled-clinician-directory-validation-2026-09-29.md)
retains the attempt and correction. Full local, clean-copy and hosted evidence remain required
before promotion.

B04-008 subsequently moves In progress → **In review** on 29 September 2026,
Africa/Addis_Ababa, after its predecessor 18-case contract and 142-case browser matrix, new 24-case
static and 12-case rendered validations, shared search-control checks, full repository gate,
optimized-build isolation, frozen clean reconstruction, dependency audit, reachable-history secret
scan and diff-integrity check passed. The build retains no `/doctors/` route. Private hosted
exact-head CI and explicit client controlled acceptance remain required before Done.
