# Roadmap and Delivery Plan

**Planning basis date:** 12 September 2026  
**Estimation state:** Relative sequencing baseline; calendar dates require named owners, capacity, and environment/provider decisions  
**Release model:** Vertical slices promoted through local, staging/acceptance, and production gates

Current pull order and status are maintained in the [execution board](execution-board.md). The roadmap defines sequence; it does not by itself make a ticket `Ready`.

On 13 September 2026, the client deferred `B00-001`, `B00-002`, `B00-007`, `B00-014`, and `B00-015` to Phase 2 or the applicable production boundary. That scoped deferral allows only controlled local implementation under the execution board's clean-rebuild, provider-neutral/default-deny, sanitized-evidence, and no-personal-data boundaries. The formal M0 and production exit gates below remain unchanged.

## Outcome

Deliver a trustworthy, accessible, bilingual, mobile-first Phase 1 hospital website without publishing unverified claims or collecting personal data before the operating, privacy, and security model is approved.

## Planning assumptions

- One cross-functional delivery team owns product, frontend, backend/CMS, DevOps, QA/accessibility, and content integration; specialist hospital owners supply decisions and approvals.
- Payload CMS, Next.js/TypeScript, PostgreSQL, GitHub Actions, Docker, and VPS hosting are the approved baseline.
- Public-content and appointment databases are logically separated on the initial VPS.
- The connected prototype is a behavior and visual reference, not production code.
- English and Amharic are left-to-right; Phase 1 safety content requires professional review.
- Careers and other explicitly deferred routes do not enter Phase 1 through incidental implementation.
- Calendar commitments begin only after `GOV-01`, delivery capacity, and the P0 decision calendar are assigned.

## Delivery increments

| Increment | Target outcome | Primary backlog | Entry gates | Exit evidence |
| --- | --- | --- | --- | --- |
| `M0` Mobilize and trust | Named governance, trusted source, delivery controls, architecture selections | Epic 00 | `GOV-02` already approved | `GOV-01`, `SEC-01`, `DEL-01`; working local/CI baseline; risk and evidence registers |
| `M1` Platform and UI foundation | Deployable CMS/app skeleton, design tokens, shell, utility error behavior | Epics 00–02 | M0 technical controls; route scope | Build/type/lint/test; token parity; shell at required viewports; no-JS and accessibility smoke evidence |
| `M2` Safety and access slice | Home, Emergency, Contact, Privacy, Accessibility | Epics 03 and 05 | `SAFE-01`–`SAFE-04`, `LANG-01`, applicable privacy decisions | Verified calls/arrival; bilingual safety review; owner sign-off; critical-route performance/accessibility tests |
| `M3` Care discovery slice | Doctor/service directories and detail routes with governed records | Epics 02, 04, and 06 | `CARE-01`–`CARE-06`, `SEARCH-01`; approved launch records | Canonical-record/relationship tests; retire/redirect behavior; directory/detail state coverage |
| `M4` Practical information and search | Patient Information, site search, About, governed media | Epics 05 and 06 | `ACCESS-01`, `SEARCH-01`–`SEARCH-02`, `INST-01`–`INST-03`, `BRAND-01`, `LANG-02` as applicable | Content approval/expiry evidence; search relevance/privacy tests; asset rights and failure behavior |
| `M5` Appointment request | Secure request intake and truthful operational handoff | Epic 03 | `APPT-01`–`APPT-04`, `APPT-03` privacy/security approval, `DEL-01` | Idempotency/reconciliation tests; no sensitive logging; backup/restore; operations/privacy/security acceptance |
| `M6` Release candidate | Integrated Phase 1 release candidate and operational readiness | Epic 07 | M2–M5 included-slice gates closed; `SEC-02` decisions | Cross-browser/AT/device/language/performance/security/content evidence; rollback and incident rehearsal |
| `M7` Public release and stabilization | Approval-controlled launch, monitoring, hypercare, measured backlog | Epic 07 | All release gates and named release approval | Production smoke tests, monitoring, rollback readiness, indexation checks, hypercare report |
| `M8` Phase 2 | Approved Careers and governed secondary capabilities | Epic 08 | Product reprioritization plus feature gates | Feature-specific acceptance, privacy/security/content/language evidence |

## Critical path

```text
GOV-01 + SEC-01 + DEL-01
  -> trusted repository/environments/CI/evidence model
  -> shared CMS + design system + global shell
  -> SAFE/LANG decisions -> safety and access slice
  -> CARE/SEARCH decisions -> discovery slice
  -> APPT decisions + isolated data path -> appointment slice
  -> integrated accessibility/security/performance/content acceptance
  -> named release approval -> production
```

`SEC-02`, brand/content approvals, and translations join the path wherever an included slice uses them. Unapproved optional providers stay off; they do not block a first-party-minimum release unless the hospital makes them essential.

## Workstream sequencing

| Workstream | Start | Depends on | May run in parallel with | Release constraint |
| --- | --- | --- | --- | --- |
| Governance and decision closeout | Immediately | None | All controlled implementation | Named/date/evidence outcomes required before affected publication |
| Platform, environments, CI | Immediately | Architecture baseline | Decision closeout, schema design | Trusted source and environment boundaries required |
| Design-system productionization | After repository skeleton | Token-source selection | CMS modeling | Brand theme remains replaceable until `BRAND-01` |
| CMS/content model | After repository skeleton | Content lifecycle contract | Design-system work | Records cannot publish without required approvals/metadata |
| Shared shell/utilities | After tokens + route model | `LANG-01` inventory for final copy | CMS modeling | Safety actions use canonical approved data only |
| Page slices | After shell and relevant collections | Applicable decision gates for real content | Other independent slices | Controlled fixtures only until content gates close |
| Appointment backend | After isolated data architecture | `APPT-01`–`APPT-04`, `APPT-03` before collection | Read-only public pages | Must fail closed until full intake path is approved |
| Integrated QA | From first component | `DEL-01` for final evidence | Every build | No late accessibility/security/performance phase |
| Content migration | After schemas, before slice acceptance | Owner/source/review records | Page development using fixtures | Extracted `_as_published` data is not approved content |

## Milestone gates

### M0 exit — ready to implement

- Accountable people replace temporary roles under `GOV-01`.
- `SEC-01` identifies a trusted source and closes or isolates the compromised source.
- `DEL-01` names environments, browsers/AT/devices, network profile, security methods, evidence locations, and acceptance authorities.
- Architecture selections have owners, rationale, cost/privacy/security notes, and rollback/migration paths.
- Repository permissions, branch protection, issue fields, secrets boundaries, and change control are active.

### M1 exit — foundation demonstrable

- Pinned toolchain runs locally and in CI.
- Separate public-content and appointment database roles exist; appointment collection remains disabled.
- One canonical token source generates platform outputs with drift tests.
- Shared shell, skip link, navigation, language control, footer, status patterns, and 404/410 behavior work with keyboard and without JavaScript where required.
- Provisional branding is visibly identified and replaceable.

### M2–M5 slice exit

Each included page/flow must meet its page contract, applicable decisions, content approval, language scope, security/privacy review, responsive states, accessibility checks, performance budgets, and evidence requirements. Staging-complete and publication-approved are recorded separately.

### M6 release-candidate exit

- All applicable `G-001`–`G-016`, `S-001`–`S-008`, and page-specific Must requirements pass.
- No open severity-1/2 safety, privacy, security, accessibility, data-loss, or critical-journey defect exists.
- Redirects, metadata, structured data, sitemap, search visibility, record withdrawal, and cache invalidation are tested.
- Backup/restore, deployment rollback, monitoring, incident response, content rollback, and owner escalation are rehearsed.
- Residual risks and approved exceptions name owner, expiry, mitigation, and removal/rollback.

## Release strategy

Use controlled vertical slices, not a single big-bang completion claim:

1. Merge behind server-side publication and collection gates.
2. Demonstrate with explicitly labeled non-production fixtures.
3. Replace fixtures only through approved content migration.
4. Run slice-specific acceptance in staging.
5. Record hospital approval independently from technical completion.
6. Enable the route/capability only after its publication/data gates close.

The Appointment feature uses a separate enablement control from page visibility. The informational route may explain that online requests are unavailable, but no personal-data fields may submit until the full approved path is operational.

## Initial dependency risks

| Risk | Effect | Owner route | Backlog response |
| --- | --- | --- | --- |
| Accountable people remain unnamed | Decisions and release acceptance cannot be durable | Executive sponsor | `B00-001`; do not convert role placeholders into approval |
| Source compromise remains unresolved | Migration or deployment may carry malicious content/configuration | IT/Security | `B00-002`; build from a trusted clean baseline |
| Contact/emergency facts conflict | Unsafe or misleading critical journeys | Operations/Clinical | `B03-001`–`B03-003`; withhold facts until tested |
| Appointment model is unresolved | Cannot safely collect or route requests | Operations/Privacy/Security | `B03-010`–`B03-015`; keep collection disabled |
| Content and Amharic approvals arrive late | Page acceptance and publication slip | Content/Language owners | `B02-001`–`B02-014`, `B06-007`–`B06-010`; prioritize safety inventory first |
| Brand assets/rights are absent | Visual polish cannot be treated as approved identity | Brand owner | `B01-002`, `B02-011`; retain replaceable provisional theme |
| Same-VPS logical isolation is misconfigured | Appointment confidentiality and recovery risk | Delivery/Security | `B00-008`–`B00-010`; least privilege and restore evidence |
| Prototype is copied as production code | Fragile architecture and fixture leakage | Delivery Lead | PR checklist and `B01-001`; contract-driven rebuild |

## Estimation and planning cadence

- Estimate only `Ready` delivery tickets; decision/content tickets receive target decision dates rather than story points.
- Refine one milestone ahead and keep no more than two implementation slices active per cross-functional team.
- Review the decision/gate board at least twice weekly during M0–M5.
- Demonstrate complete states and failure behavior at the end of each slice, not only screenshots of default pages.
- Reforecast milestone dates whenever a critical decision misses its required-by date.
- Maintain a release burn-up by accepted ticket outcome; do not count staging-complete/publication-blocked work as released scope.

## Global release gates

Public launch remains blocked until the release checklist in the [requirements matrix](../requirements/requirements-matrix.md#release-gates) is evidenced, including trusted-source recovery, reconciled emergency/contact information, approved care records, approved appointment operation/privacy, Phase 1 Amharic safety review, and accessibility/responsive/performance/security/content acceptance.
