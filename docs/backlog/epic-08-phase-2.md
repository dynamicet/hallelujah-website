# Epic 08 — Phase 2 and Post-launch Product Development

**Outcome:** Expand the service only after Phase 1 is stable, evidence supports the need, and each new workflow has sustainable ownership, content, privacy, security, language, and operational capacity.  
**Priority:** P2/P3  
**Milestone:** M8  
**Primary owners:** Product Owner plus feature-specific HR, Clinical, Content, Privacy/Security, Language, Delivery, and QA owners

## Entry policy

Phase 2 work may be researched and refined earlier, but implementation priority does not supersede open Phase 1 P0/P1 items. Any new public route requires a recorded `GOV-02` scope change, sitemap/page-contract updates, requirements, operational owner, content lifecycle, security/privacy review, English/Amharic scope, and acceptance evidence.

## Careers `/careers/` (`CR0`–`CR8`)

| ID | Lane | Pri | Outcome and implementation scope | Acceptance and evidence | Dependencies / gates | Owner | References |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `B08-001` | DECISION | P2 | Assign vacancy owner and approve create/review/open/update/close/fill/withdraw/archive/stale-link/404/410 lifecycle. | Workflow demonstrates stable public IDs, exact open/close instants/timezone, approvals, removal from cache/search/sitemap, genuine-successor rules, audit trail, and owner/review/expiry. | `HR-01`, `GOV-02` | HR + Product | `I-004`, `G-011`, `G-013`–`G-015`; [Careers contract](../ux/page-specifications.md#12-careers) |
| `B08-002` | DECISION | P2 | Approve application route/provider, data/files, recipients/access, transport, subprocessors/location, retention/deletion/rights, logs/analytics, failure, and notice. | Recruitment data-flow and privacy/security assessment closes; unapproved email/uploads/forms/providers collect nothing; outage/closure cannot accept applications falsely. | `HR-02`, `SEC-02` | HR + Privacy/Security | `I-004`, `S-002`–`S-005`; [institutional flows](../wireframes/institutional-flows.md) |
| `B08-003` | DECISION | P2 | Approve equal-opportunity, accommodation/support, response, fraud-warning, and English/Amharic process/privacy wording. | HR/privacy/legal and professional language approvals identify versions/review dates; consequential missing translation disables Apply and gives an approved alternative. | `HR-03`, `LANG-02` | HR + Legal + Language | `I-004`, `S-006`–`S-008` |
| `B08-004` | DELIVERY | P2 | Implement governed vacancy collection, Careers page, canonical detail/application handoff if approved, and full lifecycle states. | Current, no roles, closing soon, closed/filled/withdrawn, stale, provider/privacy blocked, translation unavailable, and no-JS states pass; closed role cannot accept data; index/cache/search/sitemap withdrawal follows exact close instant. | `B08-001`–`B08-003`, `B02-001`–`B02-002` | Backend + Frontend | `I-004`; [wireframe](../wireframes/careers.md); [study](../visual-design/pages/practical-institutional/careers.html) |
| `B08-005` | EVIDENCE | P2 | Validate vacancy lifecycle, application privacy/security, language, accessibility, provider failure, and stale links. | Time-boundary tests, role authorization, closed-race condition, no-data-on-blocked-flow, provider outage, 404/410, cache/search removal, AT/reflow/no-JS, and bilingual process comprehension pass with HR/privacy acceptance. | `B08-004`, `DEL-01` | QA + HR + Privacy | `I-004`, `S-002`–`S-008`, `G-003`–`G-016` |

## Governed health information/news

| ID | Lane | Pri | Outcome and implementation scope | Acceptance and evidence | Dependencies / gates | Owner | References |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `B08-006` | DECISION | P2 | Approve editorial purpose, audience, taxonomy, author/reviewer qualifications, sourcing, corrections, review/expiry, language scope, and moderation/analytics policy. | Operating model names capacity and SLAs; medical content requires clinical reviewer and sources; stale/unsafe content expires; corrections are auditable; no route launches merely to host promotional posts. | `GOV-02` scope change | Clinical + Content + Product | `I-005`, `G-014`–`G-016`; [sitemap exclusions](../ux/sitemap.md#items-intentionally-excluded-from-phase-1) |
| `B08-007` | DELIVERY | P2 | Implement article/content workflow and public routes only after governance approval. | CMS blocks publication without author, applicable clinical reviewer, sources, published/review/expiry dates, correction status, language decision, and canonical metadata; retirement removes discovery; article design meets shared accessibility/performance contracts. | `B08-006`, `B02-001`–`B02-002` | CMS + Frontend | `I-005`, `G-003`–`G-016` |

## Referring clinicians and other operational expansions

| ID | Lane | Pri | Outcome and implementation scope | Acceptance and evidence | Dependencies / gates | Owner | References |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `B08-008` | DECISION | P2 | Validate need and approve an operational referring-clinician journey before creating a route. | Research confirms users/tasks; referral receiving team, scope, response, secure data channel, privacy/security, content, language, failure, and ownership are approved; public messaging makes no unsupported access promise. | `GOV-02`, `SEC-02` as applicable | Clinical + Operations + Privacy | [sitemap Phase 2](../ux/sitemap.md#secondary-navigation) |
| `B08-009` | DECISION | P2 | Treat portal, results, prescriptions, proxy access, reminders, virtual care, second opinion, remote review, international coordination, or record upload as separate products requiring discovery and architecture approval. | Each candidate has verified demand, clinical/operational owner, identity/authorization/data integration model, privacy/security/safety assessment, service levels, cost, language/accessibility plan, failure modes, and explicit go/no-go before backlog decomposition. | New governance decision | Executive + Clinical + Security | [sitemap exclusions](../ux/sitemap.md#items-intentionally-excluded-from-phase-1); [benchmark crosswalk](../benchmarks/institution-candidate-crosswalk.md) |

## Evidence-led optimization

| ID | Lane | Pri | Outcome and implementation scope | Acceptance and evidence | Dependencies / gates | Owner | References |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `B08-010` | EVIDENCE | P3 | Establish privacy-approved product measurement using operational outcomes, usability research, support themes, search quality, content freshness, accessibility defects, and Core Web Vitals. | Metric definitions avoid clinical inference and sensitive query/form capture; owner, decision use, collection method, access/retention, baseline, target, and stopping rule are documented; provider use follows `SEC-02`. | Stable Phase 1, `SEARCH-02`, `SEC-02` | Product + Privacy + QA | `G-008`, `G-016`, `S-005` |
| `B08-011` | DELIVERY | P3 | Run bounded experiments only for non-safety presentation questions with predeclared hypotheses and guardrails. | Emergency, clinical meaning, consent, privacy, accessibility, and appointment truth are excluded from casual experimentation; variants meet all baseline requirements; sample/stopping/decision rules are defined; losing variants are removed. | `B08-010` | Product + Design + QA | `G-001`–`G-016`; [benchmark validation measures](../benchmarks/benchmark-traceability.md#benchmark-derived-validation-measures) |
| `B08-012` | DELIVERY | P2 | Operate quarterly content, access, security, performance, dependency, and recovery reviews. | Review produces owners/dates for overdue content, broken/retired records, privilege/access changes, dependency/security updates, field performance, search relevance, accessibility regressions, backup restore, and third-party renew/remove decisions. | Production handover | Product + Operations + Delivery | `G-008`, `G-013`–`G-015`, `S-001`–`S-005` |

## Epic exit criteria

- Every expansion has validated local need and sustainable operational ownership before build.
- Phase 2 routes inherit Phase 1 accessibility, security, content, language, evidence, and lifecycle controls.
- Personal/clinical/candidate data is never introduced as a “content feature” without a separately approved product and threat model.

## Explicit exclusions

- No feature is approved because a benchmark institution offers it.
- No patient portal or clinical integration is an incremental extension of the public CMS.
- No experiment may weaken a safety, truthfulness, privacy, or accessibility contract.
