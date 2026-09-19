# B03-006 — Home Governed Optional Content and Omissions

**Lane / priority / phase:** DELIVERY / P1 / Phase 1 preparation
**Status:** Done for controlled development; final closeout CI and checked merge tracked below
**Tracking:** [issue #64](https://github.com/dynamicet/hallelujah-website/issues/64)
**Review:** [PR #65](https://github.com/dynamicet/hallelujah-website/pull/65)

On 19 September 2026, Africa/Addis_Ababa, the client directed “start”. `befikadusata`
directs Codex in temporary Frontend/Content/QA roles and is the controlled-development review
authority. This direction supplies execution, not final acceptance or hospital approval. Target:
synthetic local T0/private hosted T1. B02-004–B02-006, B02-008, B03-004 and B03-005 are Done;
B03-005 PR #63 merged as `ff696fd4d3f0004e59ece59ca4636c1fef54a096` and exact-main
[run 35403351431](https://github.com/dynamicet/hallelujah-website/actions/runs/35403351431)
passed. The working B00-016 matrix supplies controlled acceptance; formal DEL-01 remains deferred.

## Controlled sequencing and scope

CARE-01, CARE-04 and INST-01–INST-03 remain unresolved. The controlled exception permits
visibly synthetic, loopback-only Home H4/H5/H8 projections from the existing clinician, service,
care-relationship and institutional workflow contracts. The public/default projection stays empty.
Authentic records, feature decisions, language, public routes and publication remain withheld.

The Home composition must:

- accept explicit, bounded feature-ID lists rather than infer, rank or substitute records;
- require current published clinician/service records and an approved current care relationship;
- require the complete institutional content/brand/legal review contract;
- preserve canonical doctor/service paths without mounting those paths in the preview;
- limit each optional collection to three records and preserve explicit selection order;
- omit an entire H4, H5 or H8 section, including its heading and spacing, when no selected record
  remains eligible in the requested language and instant;
- project current data on every server render, with no Home-specific record cache;
- retain B03-005 canonical-contact composition and the B03-004 task-first source order.

Allowed files: the Home governed projection and template; the existing governed-card destination
contract; Home template/style/export; synthetic fixtures and static/browser checks; package commands;
Home architecture, backlog and sanitized evidence. No new dependency, CMS/database write, authentic
record, public application route, search query, provider, personal-data collection, migration,
provisioning or publication is authorized.

## Acceptance

| Contract | Observable controlled result |
| --- | --- |
| H4 services | At most three explicitly selected, clinically approved, current services with approved care relationships render in selection order and link to their canonical service paths. |
| H5 doctors | At most three explicitly selected, current approved clinicians with approved care relationships render in selection order; schedules, availability and authentic portraits remain absent. |
| H8 institution | Only current workflow documents with independent content, brand, legal, approval and publication evidence render; evidence date and limitation remain visible. |
| Governed omissions | Empty, draft, invalid, missing-language, missing-relationship, expired, withdrawn or over/duplicate/invalid selections leave no empty heading, card or layout gap. |
| Safety/content boundary | No inferred specialty, capability, statistic, partner, leadership, technology, superlative, availability or appointment claim appears. |
| Canonical continuity | Card paths come from the canonical clinician/service projections; the loopback preview returns no published page at those paths. |
| Responsive/accessibility | Semantic H2/H3 order, readable untruncated names, 44 px targets, 320/360/reflow, enlarged text, forced colors, reduced motion, Save-Data, print and no-JS pass without horizontal overflow. |
| Isolation | Fixtures, authored payloads and preview modules stay outside deployable outputs; external requests remain zero. |

## Verification

Use pinned Node.js 24.21.0 and pnpm 10.27.0:

```sh
pnpm home-governed:check
pnpm home-governed:smoke
pnpm home:check
pnpm home-contacts:check
pnpm verify
pnpm rebuild:verify
pnpm audit:dependencies
pnpm secrets:check --history
git diff --check
```

Review locally with `pnpm home:preview` at
`http://127.0.0.1:3214/governed-current`. Additional controlled states are
`/governed-empty`, `/governed-doctor-only`, `/governed-service-only`,
`/governed-institution-only`, `/governed-expired`, `/governed-unreviewed`,
`/governed-missing-language`, and `/governed-invalid-selection`. These are review-tool paths,
not hospital application routes.

Sources: [Epic scope](epic-03-critical-journeys.md#home--h0h9),
[Home specification](../ux/page-specifications.md#1-home), [Home wireframe](../wireframes/home.md),
[Home hierarchy architecture](../architecture/home-hierarchy.md), and the B02-004–B02-006/B02-008
execution contracts. BM-01/03/04/09/10/11/12 apply through task-first order, canonical care
handoffs, first-party delivery and evidence-backed omissions; benchmark facts and prototype code
have no runtime authority.

Hosted current-head T1 and client controlled acceptance are required before Done. Checked merge
and passing exact-main CI precede dependent execution. Authentic content/language/feature approval,
providers, collection, migration, provisioning, production and publication retain their gates.

## Local review result — 19 September 2026

B03-006 moves In progress → **In review** under the same responsible/review identity. Nine SSR
states, 289 responsive/capability/accessibility/canonical-path browser cases, six sanitized visual
captures, full repository verification, independent frozen reconstruction, reachable-history
secret scan, dependency audit and documentation/diff checks pass. The
[execution evidence](evidence/B03-006-home-governed-omissions-2026-09-19.md) retains environment
failures, the corrected contact-composition harness assumption, exact methods, byte samples and
visual-review limits. Issue #64 retains the repository review pointers.

Hosted exact-head T1 and controlled client acceptance remain required before Done. No authentic
feature/content/language approval, public doctor/service/Home route, production or publication is
claimed.

## Controlled acceptance — 19 September 2026

The client directed “close b03-006”. B03-006 moves In review → **Done** for controlled
development under `befikadusata` as responsible and controlled acceptance person, directing
Codex in temporary Frontend/Content/QA roles on 19 September 2026, Africa/Addis_Ababa. Target:
synthetic local T0/private hosted T1. B02-004–B02-006, B02-008 and B03-004–B03-005 are Done;
the preceding checked merge and exact-main CI pass. The working B00-016 matrix supplies
controlled acceptance while formal DEL-01, CARE-01, CARE-04 and INST-01–INST-03 remain unresolved.

All recorded local gates pass. Exact-head hosted
[run 35428435194](https://github.com/dynamicet/hallelujah-website/actions/runs/35428435194)
passes every step, including complete verification and independent frozen clean reconstruction,
for `5bf5b65c1a7d8273cbbac9fb366fa7b9496edc33`. No scoped implementation defect remains open.
Final acceptance-documentation CI must pass for its exact SHA before checked merge of PR #65.
Issue #64 and PR #65 retain the matching SHA/run, merge SHA and exact-main result. Dependent
execution waits for passing exact-main CI. B03-007 remains gated by B06-005 and formal DEL-01;
no successor ticket is promoted by this acceptance. Authentic content/language/feature approval,
public routes, providers, collection, migration, provisioning, production and publication retain
their gates.
