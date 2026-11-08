# Implementation Backlog

**Status:** Execution-controlled baseline  
**Product scope:** Phase 1 hospital website plus explicitly separated Phase 2 work  
**Technical baseline:** Payload CMS, Next.js, TypeScript, PostgreSQL, GitHub Actions, Docker, and VPS hosting  
**Publication status:** Not approved

## Purpose

This package converts the approved product, UX, visual-design, architecture, content, and validation documentation into sequenced implementation work. It is the working contract for product management, project management, design, engineering, content, QA, security, and hospital decision owners.

The backlog does not approve hospital facts, clinical wording, operational behavior, personal-data collection, third parties, brand assets, translations, or public release. Those items remain controlled by their named decision and publication gates.

## Start here

1. [Execution board](execution-board.md) — the current pull order, readiness state, ownership gate, and first executable brief.
2. [Roadmap and delivery plan](roadmap.md) — releases, milestones, critical path, sequencing, and exit gates.
3. [Traceability matrix](traceability-matrix.md) — requirement and decision coverage across the epics.
4. [Epic 00: Governance and technical foundation](epic-00-governance-foundation.md)
5. [Epic 01: Design system and global experience](epic-01-design-system-global.md)
6. [Epic 02: CMS, content governance, and assets](epic-02-cms-content.md)
7. [Epic 03: Critical journeys](epic-03-critical-journeys.md)
8. [Epic 04: Care discovery](epic-04-care-discovery.md)
9. [Epic 05: Practical access and institutional pages](epic-05-practical-institutional.md)
10. [Epic 06: Search, localization, and discoverability](epic-06-search-localization.md)
11. [Epic 07: Quality, security, release, and operations](epic-07-quality-release.md)
12. [Epic 08: Phase 2 and post-launch](epic-08-phase-2.md)
13. [Issue template](ticket-template.md) — required structure when moving a backlog item into an issue tracker or coding-agent task.
14. [Backlog integrity audit](audit-backlog.mjs) — local, read-only structural gate for ticket counts, traceability, routes, and links.
15. [Implementation acceptance matrix](../validation/implementation-acceptance-matrix.md) — accepted controlled-development evidence tiers, platforms, quality thresholds, exceptions, and per-ticket benchmark proof; formal production acceptance remains deferred.
16. [`B00-003` project control registers](b00-003-project-control-registers.md) — stable decision, dependency, risk, assumption, exception, and evidence IDs for controlled execution.
17. [Visual direction baseline and correction criteria](visual-direction-baseline.md) — current template captures, verified composition drift, intentional adaptations, and acceptance criteria for the visual correction branch.
18. [Frontend demo repair plan](frontend-demo-repair-plan.md) — combines intended design, the 20 October connected-page review, affected files, ordered repairs, and client-demo acceptance criteria for the six implemented page types.
19. [Care structure and booking frontend plan](care-structure-and-booking-plan.md) — agreed scope for specialty/service relationships, bidirectional doctor and care selection, mock content, and frontend request preparation without backend integration or saving.

The epic tables define baseline scope, not live issue status. Until an approved issue tracker is selected, [the execution board](execution-board.md) is the only place that may promote an item to `Ready`. Every other item remains `Proposed` or `Blocked` even when its implementation contract is detailed.

## Baseline inventory

This initial baseline contains **137 backlog items**:

| Dimension | Count |
| --- | ---: |
| P0 | 82 |
| P1 | 41 |
| P2 | 12 |
| P3 | 2 |
| Delivery | 71 |
| Decision | 36 |
| Content | 5 |
| Evidence | 25 |

Counts describe the planning baseline, not completed work or committed schedule. Recalculate them whenever tickets are split, merged, cancelled, or added.

## Backlog operating model

### Work lanes

| Lane | Meaning | May proceed with unresolved hospital facts? | Completion authority |
| --- | --- | --- | --- |
| `DELIVERY` | Code, configuration, infrastructure, tests, or documentation | Yes, only with controlled fixtures, safe omissions, and disabled publication/collection | External Delivery Lead and QA Lead |
| `DECISION` | Hospital choice, approval, policy, or operating model | No; it exists to resolve the named gate | Accountable hospital owner |
| `CONTENT` | Sourcing, reconciliation, writing, translation, rights, review, or migration | Drafting may proceed; publication cannot | Content owner plus applicable clinical/operations/legal/brand owner |
| `EVIDENCE` | Test, audit, approval, or release record | Only against the identified build/environment | Named tester or approver |

Delivery tickets and decision/content tickets must not be merged into a single status. A coded page can be complete in staging while its publication gate remains blocked.

### Priority

| Priority | Meaning | Scheduling rule |
| --- | --- | --- |
| `P0` | Safety, security, privacy, data integrity, critical-path, or release blocker | Pull first when its dependencies are met; no launch exception without accountable written acceptance |
| `P1` | Required Phase 1 product capability or quality | Must be complete for the Phase 1 release slice that includes it |
| `P2` | Approved Phase 2 capability or valuable non-launch enhancement | Must not displace unresolved P0/P1 work |
| `P3` | Optimization or experiment | Schedule only after measurement and an explicit product hypothesis |

Priority is not sequence. A P1 shell can be built with safe fixtures before a P0 hospital decision closes, but it cannot be published with invented content.

### Status

Use only these delivery states:

- `Proposed` — defined but not yet refined with the assigned team.
- `Ready` — meets the Definition of Ready below.
- `In progress` — actively owned and within work-in-progress limits.
- `In review` — implementation complete; required review/evidence is running.
- `Done` — meets the Definition of Done below.
- `Blocked` — cannot make progress because a named dependency or decision is unresolved.
- `Deferred` — intentionally outside the active release with owner and reason recorded.
- `Cancelled` — no longer required, with decision/evidence link recorded.

Do not use percent-complete. Track demonstrable ticket outcomes and remaining blockers.

## Ticket contract

Every issue created from this backlog must retain these fields:

| Field | Required content |
| --- | --- |
| ID and title | Stable backlog ID; outcome-oriented title |
| Lane | `DELIVERY`, `DECISION`, `CONTENT`, or `EVIDENCE` |
| Priority and phase | `P0`–`P3`; Phase 0, Phase 1, Phase 2, or Post-launch |
| Outcome | User, operational, governance, or risk outcome—not an implementation activity alone |
| Scope | Routes, stable section IDs, components, states, records, environments, and languages affected |
| Exclusions | What the ticket explicitly does not authorize or implement |
| Dependencies | Backlog IDs and formal decision IDs that govern start, staging, collection, publication, or release |
| Acceptance criteria | Observable Given/When/Then behavior or an equivalent measurable checklist |
| Verification | Automated, manual, owner, clinical, privacy, security, content, language, or operational evidence required |
| Sources | Exact requirement IDs and links to canonical specifications, wireframes, designs, architecture, content, and validation records |
| Owner | Responsible delivery role and accountable acceptance role |

### AI-assisted coding instructions

Every coding-agent task must also state:

1. the exact repository area it may change;
2. the authoritative source links and acceptance cases;
3. the test commands and evidence output expected;
4. whether controlled fixtures are allowed and how they must be labeled;
5. which facts, integrations, packages, routes, and design decisions it must not invent;
6. that screenshots and prototype code are references, not production architecture;
7. that unrelated user or parallel-agent changes must be preserved;
8. that completion means the scoped tests pass—not that a gated page is approved for publication.

An agent must stop and raise a blocker if completing a ticket would require an unapproved clinical/operational claim, personal-data flow, third party, public route, brand asset, translation, or destructive migration.

## Definition of Ready

A delivery ticket is `Ready` only when:

- outcome, lane, phase, priority, routes/sections, owner, and acceptance owner are assigned;
- applicable requirements, decision gates, page contracts, states, languages, and evidence destination are linked;
- dependencies are complete or a controlled fixture/withheld-state approach is explicit;
- required content/data schema is approved for implementation, or safe omission is specified;
- personal-data and third-party work has an approved data-flow/security review before collection or connection;
- responsive, keyboard, focus, no-JavaScript, failure, reduced-motion, and relevant bilingual cases are identified;
- no unresolved design choice is being silently delegated to a coding agent.

Decision/content tickets are `Ready` when the accountable role, decision question, candidate evidence, due milestone, required record format, and downstream blocked tickets are explicit.

## Definition of Done

In addition to ticket-specific criteria, a delivery ticket is `Done` only when:

- authoritative server and client behavior covers every applicable default, loading, empty, error, offline, unavailable, expired, validation, unknown-outcome, and success state;
- semantic, keyboard, focus, contrast, target-size, reflow, reduced-motion, language, and progressive-enhancement checks pass as applicable;
- tests include negative and failure paths, not only the happy path;
- no unapproved fixture, personal data, secret, internal ID, sensitive query, or restricted evidence enters source, URL, logs, analytics, snapshots, or public artifacts;
- lint, types, tests, builds, security checks, migration checks, and local reference checks pass;
- non-sensitive evidence is stored with build, environment, method, expected/actual, result, tester/date, and defect/retest status;
- content has source, owner, status, review/expiry, language, rights, and retirement behavior before publication;
- affected documentation and traceability links are updated in the same change;
- the acceptance owner signs off or the ticket is explicitly recorded as staging-complete/publication-blocked.

The complete release-level checklist remains [Developer Handoff: Definition of done](../visual-design/handoff/developer-handoff.md#13-definition-of-done) and the [Accessibility and Validation Checklist](../visual-design/handoff/accessibility-and-validation-checklist.md).

## Source authority

Resolve conflicts in this order:

1. dated and evidenced decisions by accountable hospital owners;
2. [requirements matrix](../requirements/requirements-matrix.md) and [formal validation register](../validation/stakeholder-low-fidelity-validation.md);
3. [page specifications](../ux/page-specifications.md), [utility specifications](../ux/utility-page-specifications.md), design-system contracts, wireframes, and flow documents;
4. approved structured content and the [verification queue](../../../resources/content-review.md);
5. non-public visual studies and connected prototype;
6. benchmark evidence after local disposition.

The production implementation must follow contracts, not copy prototype structure blindly. The complete authority rule is in [Developer Handoff](../visual-design/handoff/developer-handoff.md#2-authority-and-change-control).

## Scope controls

Phase 1 includes the canonical routes in the [approved sitemap](../ux/sitemap.md#phase-1-route-inventory), plus Privacy, Accessibility, and genuine 404/410/unavailable handling. Careers, Referring Clinicians, Health Information/News, Patient Portal, separate Cookie Information, and Terms/Legal Notice remain deferred unless a recorded scope decision changes them.

The following are never implicit backlog scope: diagnosis, symptom checking, urgency estimation, confirmed booking without a real confirming system, real-time wait times, unapproved reviews/testimonials, patient records, remote clinical services, or benchmark-derived claims.

## Change control

When behavior or scope changes, update in the same change:

1. decision record and requirement;
2. route/page and component contract;
3. wireframe/flow and visual reference when affected;
4. backlog ticket and acceptance cases;
5. automated/manual tests and evidence index.

Never weaken a release gate by editing only the backlog wording.
