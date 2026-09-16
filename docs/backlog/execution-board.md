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
| 12 | `B00-008`–`B00-010` | Blocked | Named Backend/DevOps owners / Security owner | `B00-006`, `B00-007`; appointment gates where stated | Least-privilege database, migration, backup, and restore evidence |
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
| 6 | `B01-006` | **Done** | Client workspace identity `befikadusata` directing Codex in the temporary Frontend Lead and QA roles / same identity for controlled-development acceptance; named production roles return at their gates | Local `T0` and hosted implementation `T1` pass for server-rendered header/shell APIs, one responsive navigation order, native compact disclosure, same-origin focus enhancement, skip/breadcrumb/language/footer behavior, modes, and sanitized visual evidence; final documentation head must pass before merge | [Execution brief](b01-006-global-shell-navigation.md), [local evidence](evidence/B01-006-global-shell-navigation-2026-09-14.md), [issue `#10`](https://github.com/dynamicet/hallelujah-website/issues/10), [pull request `#11`](https://github.com/dynamicet/hallelujah-website/pull/11), and [hosted run](https://github.com/dynamicet/hallelujah-website/actions/runs/34879240044) |
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
