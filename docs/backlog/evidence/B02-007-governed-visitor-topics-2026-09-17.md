# B02-007 — Execution Evidence

**Status:** Proposed → Ready → In progress → In review → Done for controlled development on 17 September 2026, Africa/Addis_Ababa.
**Responsible/review authority:** `befikadusata` directing Codex in temporary Backend/CMS,
Operations/Content-contract, Privacy/Legal-contract and QA roles; same controlled review identity.
**Branch:** `b02-007-governed-visitor-topics`.
**Basis:** main `da4434ff8703f5c2f07fc9b6bf8b81270e4aec49`; exact-main
[run 35136691110](https://github.com/dynamicet/hallelujah-website/actions/runs/35136691110) passed.
**Environment:** Synthetic local T0; private hosted T1 when submitted.

The [execution brief](../b02-007-governed-visitor-topics.md) records the client-directed boundary
and ACCESS-01 sequencing exception. B02-001 and B02-002 are Done.
Local T0 passes. Hosted implementation T1 passes; client controlled-development acceptance remains pending.

[Issue #42](https://github.com/dynamicet/hallelujah-website/issues/42) tracks the controlled B02-007 execution.

## Method and results

Pinned Node.js 24.21.0/pnpm 10.27.0, PostgreSQL 18.6 and installed direct Chromium.
Fresh Unix-socket-only cluster `/var/tmp/hallelujah-b02-001-pg.9sll3edz`, port 55487,
with empty listen_addresses. The runner stopped the cluster after all assertions.
No authentic identity, hospital guidance, shared database or provider was used.
The tester is the client workspace identity directing Codex in the temporary roles above.

| Check / expected outcome | Actual result |
| --- | --- |
| `pnpm visitor-topics:check`: reject malformed/unsupported schemas and unsupported actions | Pass: strict identity/purpose/phase/task-order/title/body/fallback rules; all 18 explicit unavailable decisions; no copied contacts or approval stamps |
| Independent workflow: every included topic needs operations/privacy/legal plus general approval | Pass: self/wrong/missing-domain/stale/content-change denials; edit clears all reviews; immutable identity/purpose and duplicate-current-purpose checks |
| Internal hub: useful current content follows before/during/after tasks and order | Pass: deterministic task/stable-ID ordering; no empty phases or draft/unavailable/deferred/omitted/untranslated/retired candidates; public/default denial including synthetic flag removal |
| Temporary and bilingual rendering: expiry is safe, shaping remains visibly unreviewed | Pass: review/expiry boundary denial; English/Amharic semantic escaped text; no links, media, scripts, forms, actions or empty categories; safe unavailable/fallback text |
| `pnpm governed-records:db-smoke`: persisted authorization, atomic changes and real expiry | Pass: fresh PostgreSQL persistence, one successful concurrent writer/stale loser, immutable/duplicate denials, failed approval/publication transaction rollback preserving record/revision/audit; forged request roles denied; live operations/privacy/legal/general-approver revocation removes guidance; complete unavailable inventory persists; edit clears approvals; actual elapsed temporary expiry removes content while stored status is still published, then explicit local retirement preserves identity/audit |
| `pnpm local-db-isolation:check`: both roles deny cross-database reads/writes | Pass: public-content and appointment roles remain isolated; no network listener |
| `pnpm verify`: full repository and shared browser verification | Pass: pinned tooling, format, CI controls, links, secrets, backlog 10/10, brand/introduction gates, lint, types, all tests, build, semantic accessibility, budgets and runtime |
| Shared browser matrix | Pass: 92 bilingual capability/viewport/media/history cases plus foundation/action, governed-card no-JavaScript/print/forced-colors and optional-map zero-activation/external-request checks |
| `pnpm secrets:check --history` | Pass: 357 current text files plus reachable history; matched values would redact |
| `pnpm audit:dependencies` | Pass: 650 dependencies; zero moderate/high/critical known vulnerabilities |

The build retains bootstrap, not-found and health routes. Runtime budget is unchanged:
146077 compressed JavaScript bytes, 183162 initial compressed bytes, 15 requests,
zero external origins. New semantic specimens remain outside application routes.
No new interaction, visual direction, media or benchmark application is introduced.

## Defects and retests

- The existing sandbox mount and shell temporary-file quota prevented normal shell startup/heredocs.
  Approved direct writes and disposable /var/tmp tooling allowed scoped work without deleting files.
- Adding the legal role made ignored generated Payload types stale. Initializing the updated fresh
  CMS regenerated them; full repository type checks pass. Generated artifacts are not committed.
- First integration run reused a clinician successor's synthetic ID. The visitor fixture now has a
  distinct namespace; repeating fresh PostgreSQL integration resolves the test collision.
- The anonymous-read negative initially used a helper that defaulted undefined to its reviewer.
  Calling the authenticated API with undefined directly corrected the test; fresh integration
  proves the anonymous-read denial and all subsequent authorization/lifecycle cases.

No implementation defect remains open. Hosted implementation T1 passes; client acceptance is pending.
ACCESS-01, authentic operational/privacy/legal guidance, approved contacts, translations,
public routes, providers, collection, production and publication remain gated.

[PR #43](https://github.com/dynamicet/hallelujah-website/pull/43) tracks review.
[Hosted implementation run 35244463130](https://github.com/dynamicet/hallelujah-website/actions/runs/35244463130)
passed all steps, including clean reconstruction, for exact implementation head
`3222622361edf9495075905f923d1ab3c8720983`. The final documentation head must repeat
hosted CI before merge; its matching SHA/run is tracked in issue #42 and PR #43.
Client controlled-development acceptance remains pending. ACCESS-01, authentic guidance,
contacts, approved translations, public routes, collection and publication remain gated.


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
