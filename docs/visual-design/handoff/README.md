# Order 12 — Documentation and Developer Handoff

**Status:** Complete for implementation planning and formal stakeholder review  
**Completed:** 12 September 2026  
**Publication status:** Not approved for production implementation or public use

This package consolidates the performed Orders 1–11 work into an implementation-facing map. It does not replace the requirements matrix, formal decision register, page and component specifications, or QA evidence. It identifies which source is authoritative, what may be built safely, what remains inert or omitted, and which evidence must exist before an affected production capability is activated.

## Start here

1. [Developer handoff](developer-handoff.md) — source precedence, architecture boundaries, token integration, build sequencing, and definitions of ready/done.
2. [Epic 0 technical foundation](../../architecture/epic-0-technical-foundation.md) — approved production-stack baseline, same-VPS logical data separation, open implementation selections, and delivery boundaries.
3. [Page handoff matrix](page-handoff-matrix.md) — the 12 core routes plus three Phase 1 utility contracts, accepted section IDs, canonical references, principal states, and gate bundles.
4. [Remaining assumptions and gates](remaining-assumptions-and-gates.md) — all 32 formal decisions, safe defaults, closure evidence, and unperformed validation.
5. [Implementation acceptance matrix](../../validation/implementation-acceptance-matrix.md) — accepted development test tiers, platforms, devices, language/comprehension, security, performance, defect, evidence, exception, and benchmark-proof rules; formal production authority remains deferred.
6. [Accessibility and validation checklist](accessibility-and-validation-checklist.md) — pre-merge, journey, and pre-release evidence requirements.
7. [Asset and content guidance](asset-and-content-guidance.md) — intake, approval, transformation, delivery, expiry, and removal rules.
8. [Order 12 evidence](evidence/README.md) — repeatable documentation-integrity audit and its limits.

Review the [requirements matrix](../../requirements/requirements-matrix.md) and [formal validation register](../../validation/stakeholder-low-fidelity-validation.md) before estimating or implementing an affected feature. The accepted safe baselines allow planning and non-public prototyping; they are not hospital fact verification, production activation, or release approval.

## Canonical source map

| Concern | Canonical source | Implementation use |
| --- | --- | --- |
| Requirement and acceptance obligation | [Requirements matrix](../../requirements/requirements-matrix.md) | Create acceptance tests and release evidence by requirement ID. |
| Formal decision and named approval | [Stakeholder validation register](../../validation/stakeholder-low-fidelity-validation.md) | Determine whether a gated behavior or record may be activated. |
| Release scope and routes | [Sitemap](../../ux/sitemap.md) | Preserve route purpose and phase; confirm through `GOV-02`. |
| Page purpose, order, and states | [Core page specifications](../../ux/page-specifications.md) and [utility specifications](../../ux/utility-page-specifications.md) | Product contract for each template and Phase 1 utility behavior. |
| Section order and cross-cutting detail | [Wireframe index](../../wireframes/README.md) and linked page/flow files, including [utility wireframes](../../wireframes/utility-pages.md) | Preserve stable section IDs and documented recovery paths. |
| Base interaction contracts | [Shared design system](../../design-system/README.md) | Technology-independent behavior and accessibility baseline. |
| Project brand values and production tokens | [Brand system](../../brand/README.md) and [canonical token architecture](../../architecture/canonical-design-token-system.md) | `B01-002` project-approved direction; centrally replaceable; rendered implementation and binary intake remain gated. |
| Responsive component behavior | [Order 5 components](../components/README.md) | Component anatomy, variants, states, and token aliases. |
| Motion and storytelling | [Motion guide](../motion/README.md) and [production amendment](../motion/high-end-motion-and-interactive-media-amendment.md) | Treat Orders 3–11 as historical prototype evidence; use the amendment for production intensity, static-first media, protected contexts, and acceptance. |
| Complete page studies | [Visual workspace](../README.md) | Visual reference after the product and section contracts. |
| Connected behavior | [Prototype specification](../prototype/prototype-specification.md) | Demonstration of state transitions, never a production data-flow design. |
| Performed QA and limitations | [Order 11 QA](../qa/README.md) | Regression baseline; do not extend its claims beyond the recorded environment. |
| Extracted content candidates | [Content resources](../../../../resources/README.md) | Use only after the applicable owner verifies and approves each record. |

If sources disagree, a dated decision from the named accountable hospital owner wins, followed by the requirements and validation register, page/design-system/wireframe contracts, approved structured records, the design concept, and finally locally dispositioned benchmark evidence. Extracted public-site content is evidence, not approval.

## Handoff outcome

- All 12 planned core page types and their 104 accepted section IDs have an implementation reference; Privacy, Accessibility, and 404/410/unavailable behavior now have separate Phase 1 product and wireframe contracts.
- Appointment, Patient Information, and Contact use the sitemap's canonical `/appointments/`, `/patient-information/`, and `/contact/` paths throughout the handoff.
- A separate Cookie route, Terms / Legal Notice, Referring Clinicians, Health Information / News, Careers, and a Patient Portal are excluded from the initial Phase 1 backlog unless `GOV-02` records an approved scope change; Careers retains its Phase 2 package.
- The three-layer token path is documented as primitive → semantic → component; page and prototype CSS are examples, not a production import architecture.
- Component, motion, responsive, bilingual, asset, accessibility, security, privacy, and progressive-enhancement boundaries are consolidated.
- All 32 formal decisions retain an explicit safe default and evidence-to-close rule.
- The performed Order 9–11 results are linked without converting Chromium automation into human, device, browser, language, field-performance, security, or stakeholder approval.
- Production code, live hospital facts, operational integrations, personal-data collection, third parties, and public-release actions remain outside this order.

## Performed evidence baseline

| Scope | Result | What it proves |
| --- | --- | --- |
| Order 9 responsive/bilingual geometry | 525/525 cases passed | Tested viewport/reflow geometry and audited target size across controlled fixtures. |
| Order 10 connected prototype | 19/19 interactions; 45/45 geometry cases passed | Local inert journey behavior, safe fixture URL state, and prototype connectivity. |
| Order 11 design/motion QA | 17/17 assertions passed across 16 artifacts | The exact documented Chromium semantic, contrast, keyboard, state, motion, resilience, and budget checks. |
| Order 12 documentation integrity | See [machine result](evidence/order-12-audit-results.json) | Required handoff files, links, decision/page/utility coverage, canonical routes, token manifests, and prior result summaries are internally consistent. |

## Non-negotiable boundary

The prototype must not be deployed as the public website. Its records, contact treatments, Amharic strings, receipt references, review controls, and outcomes are controlled demonstrations. No implementation ticket may silently turn a fixture or safe fallback into a hospital fact, live action, consent model, service promise, or approval claim.

## Completion record

- [x] canonical design-system, motion, component, page/section, responsive, prototype, token, asset, accessibility, and QA sources are indexed;
- [x] production extraction boundaries and a gate-aware build sequence are documented;
- [x] all 12 core page types map to stable section IDs, visual references, principal states, and gate bundles;
- [x] all three Phase 1 utility behaviors map to product specifications, low-fidelity structures, stable section IDs, states, and gate bundles;
- [x] the canonical route paths are consistent between sitemap and handoff, and deferred/conditional routes are explicit;
- [x] all 32 formal decisions are carried forward individually, with `GOV-02` and `GOV-03` approved for controlled implementation planning and the other 30 unresolved;
- [x] the asset intake and withdrawal contract prevents unapproved, expired, hotlinked, benchmark, or misleading media from shipping;
- [x] the accessibility checklist separates performed prototype automation from required human and production evidence;
- [x] a repeatable integrity audit checks local links, page/decision/utility coverage, canonical route agreement, token JSON, CSS inheritance, and prior QA result summaries;
- [x] no stakeholder, language, content, safety, privacy, security, device, browser, performance, or publication limitation was represented as closed.

Order 12 remains complete as the historical handoff baseline. The 14 September 2026 production amendment is a controlled post-handoff direction change and must be included in the next applicable implementation brief, alongside closure or safe deferral of its brand, media, consent/rights, performance, accessibility, and provider gates.
