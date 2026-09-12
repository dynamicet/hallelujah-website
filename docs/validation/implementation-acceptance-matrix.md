# Implementation Acceptance Matrix

**Version:** 1.0 working baseline  
**Recorded:** 13 September 2026, Africa/Addis_Ababa  
**Backlog / decision:** `B00-016` / `DEL-01`  
**Status:** Approved for controlled development; formal production acceptance and release authority deferred  
**Applies to:** Every implemented Phase 1 route, shared component, API, content model, migration, infrastructure change, and release candidate

## 1. Decision boundary

This matrix is the minimum acceptance contract for implementation. It is sufficient to plan tickets, build in isolated local and CI environments, and evaluate production-like staging slices. It does not authorize public release, personal-data collection, a third party, a hospital fact, or a claim.

The working baseline is accepted through the client's 13 September 2026 direction to proceed with `B00-016`. Before production acceptance, named Product, QA/Accessibility, Security, Delivery, and applicable hospital domain owners must confirm the actual environments, physical device inventory, exact software versions, restricted evidence repository, and release artifact. `DEL-01` remains formally unresolved until that dated record exists.

Use [WCAG 2.2 Level AA](https://www.w3.org/TR/WCAG22/) as the accessibility conformance target. The project's stricter contracts—including 44 × 44 CSS px targets, 320 CSS px reflow, 400% zoom, no-JavaScript essential journeys, and the performance budgets below—still control. Security testing is risk-based and follows the applicable areas of the [OWASP Web Security Testing Guide](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/README).

## 2. Evidence tiers and environments

| Tier | Environment | Required use | Data and integration boundary | Exit authority |
| --- | --- | --- | --- | --- |
| `T0` Static/local | Isolated developer checkout with pinned toolchain | Format, lint, types, units, schema/migration validation, local links, component states | Synthetic fixtures only; no real personal data, legacy executable/config import, production secrets, or unapproved network dependency | Implementer |
| `T1` Pull-request CI | Ephemeral clean build from the reviewed commit | Reproducible install/build, automated functional/accessibility/security/performance smoke, benchmark traceability | Synthetic fixtures; sanitized artifacts; unapproved providers make zero requests | Delivery owner + automated required checks |
| `T2` Integrated staging | Production-like application, database roles, proxy, headers, cache, and feature gates | Full routes, failure states, migrations, browser matrix, security testing, rollback/restore, content and language review | Controlled test records only; outbound email/SMS/provider calls disabled or approved sandboxed; `noindex`; collection off until its gates close | QA/Accessibility + Delivery + Security; applicable domain owner |
| `T3` Release candidate | Frozen build/config/content set in production-like acceptance | Human AT/device/language/comprehension, complete security and performance evidence, go/no-go dashboard | Approved test data and integrations only; exact artifact/config/content versions recorded | Named acceptance owners; feeds `B07-016` |
| `T4` Production verification | Approval-controlled public environment after deployment | Non-destructive health, route, TLS/header, canonical, monitoring, emergency/contact display, search, and gated appointment-state checks | No invasive security load, synthetic form delivery, or personal-data test unless separately authorized | Release authority + QA + Operations |

Passing a lower tier never substitutes for a higher tier. A production-like result is stale when relevant code, configuration, content, translation, browser/AT behavior, infrastructure, or dependency changes.

## 3. Browser, operating-system, and assistive-technology matrix

At release-candidate freeze, record exact browser, OS, AT, and device versions. “Current” means latest stable available when testing begins; “previous” means the immediately preceding supported major release. If an update occurs during the freeze, QA records the change and reruns affected critical journeys.

| ID | Platform pairing | Development coverage | Release-candidate coverage |
| --- | --- | --- | --- |
| `P1` | Chromium on CI Linux | Automated every PR: all templates, key states, keyboard paths, accessibility rules, geometry, reduced motion, no-JS, performance smoke | Repeat against frozen build |
| `P2` | Windows 11 + current and previous Chrome; current Edge | Keyboard, pointer, zoom, form and critical-journey smoke | Complete critical journeys; Edge also runs forced-colors/Windows High Contrast |
| `P3` | Windows 11 + current Firefox + current NVDA | Component/journey checks as slices stabilize | Human screen-reader completion of every critical journey and representative failure states |
| `P4` | Windows 11 + current Chrome or Edge + current JAWS | May begin when licensed test access exists | Human screen-reader completion of emergency, navigation/search, appointment, errors, and confirmation; required before public release |
| `P5` | Current and previous supported macOS + current Safari; current Chrome spot check | Safari/WebKit smoke on integrated slices | Safari complete critical journeys; VoiceOver + Safari covers navigation, forms, status, recovery, and dynamic updates |
| `P6` | Physical Samsung Galaxy A14 class device, Android 13 or later, current Chrome + TalkBack | Responsive/touch spot checks when device is available | Touch, OS gestures, keyboard type, TalkBack, emergency deliberate activation, dialer handoff, constrained network |
| `P7` | Physical iPhone SE (3rd generation) class device, current supported iOS, Safari + VoiceOver | Responsive/touch spot checks when device is available | Touch, rotor/navigation, zoom/text behavior, form keyboards, status, emergency deliberate activation, dialer handoff |

An equivalent physical device may replace `P6` or `P7` only through the exception process, with the exact model, memory, OS, viewport, reason, and equivalence recorded. Emulation is useful at `T0`–`T2` but cannot satisfy the physical-device release rows.

## 4. Viewport, zoom, input, and user-preference coverage

| Dimension | Required baseline | Pass condition |
| --- | --- | --- |
| CSS viewport | 320 × 568, 360 × 800, 768 × 1024, 1280 × 800, 1440 × 900; additional content-driven breakpoints | No lost content or control, unintended two-dimensional page scrolling, overlap, truncation of consequential text, or reordered meaning |
| Browser zoom | Manual 200% and 400% on desktop; explicit 320 CSS px test remains separate | Content, focus, status, validation, and completion remain available; browser zoom is not claimed from resized screenshots |
| Text/content stress | English, approved Amharic, mixed script, long names/labels, 200% text where supported, missing equivalent | Consequential text wraps; controls and relationships remain understandable; no silent fallback or invented translation |
| Input | Keyboard only, pointer, touch; voice-control spot checks on essential labeled actions where available | No trap, hover-only action, focus loss, drag-only interaction, accidental call, or gesture-only completion |
| Preferences | Reduced motion, forced colors/Windows High Contrast, Save-Data, default and increased contrast settings where available | Meaning and state remain perceivable; focus remains visible; motion removal does not remove outcome |
| Dependency loss | No JavaScript, images blocked, custom fonts blocked, offline/timeout, optional provider failure | Essential facts, routes, validation recovery, and staffed alternatives remain usable according to the page contract |

## 5. Network, hardware, and performance profile

Use a repeatable network shaper for lab evidence and record its tool/version. The constrained profile is 1.6 Mbps download, 750 Kbps upload, 300 ms round-trip latency, cold cache, and 4× CPU slowdown. Also test offline, timeout, intermittent recovery, Save-Data, warm cache, and provider failure where applicable.

| Measure | Threshold | Enforcement |
| --- | --- | --- |
| Initial compressed transfer | ≤ 1 MB per representative template | CI and `T3`; regression blocks merge/release unless an approved exception exists |
| First-party JavaScript | ≤ 150 KB compressed | CI and `T3`; include route and shared bundles |
| Initial usable-view requests | ≤ 50 | CI and `T3`; list every origin and request category |
| Largest Contentful Paint | ≤ 2.5 s | Production-like lab on constrained profile and post-release field 75th percentile |
| Interaction to Next Paint | ≤ 200 ms | Production-like interaction lab where measurable and post-release field 75th percentile |
| Cumulative Layout Shift | ≤ 0.1 | Route/state lab and post-release field 75th percentile |

The Android physical-device run must identify actual model, RAM, free storage range, OS/browser version, battery/power mode, and connection. Field monitoring must be privacy-safe and template-level; insufficient traffic is reported as insufficient evidence, never converted into a pass.

## 6. Language and comprehension acceptance

1. Automated parity inventory compares every in-scope route, state, label, error, recovery action, metadata field, and language-switch destination.
2. A professional Amharic reviewer and the applicable clinical/content owner approve consequential meaning; automatic translation alone never passes.
3. Run at least five facilitated but unprompted scenario sessions per tested language for the critical task set. Participants should include low-health-literacy/low-digital-confidence perspectives and relevant disability perspectives; one person may satisfy more than one characteristic.
4. Every participant in the final accepted round must correctly distinguish emergency from routine contact and an appointment request from a confirmed booking. Any dangerous misunderstanding is at least `S2 High`.
5. For other critical tasks, at least four of five participants per language must select the correct starting route and reach a useful recovery without facilitator hints. Repeated failure is fixed and retested; the sample supports formative acceptance, not a population-level usability claim.
6. Evidence records the prompt, route/build, participant inclusion characteristics without identity, observed behavior, answer, assistance, result, defect, and retest. Do not store health information or direct identifiers in repository evidence.

## 7. Security and privacy coverage

| Stage | Minimum tests |
| --- | --- |
| Every PR | Secret scan; dependency and lockfile review; static analysis; server validation and output encoding tests; authorization tests for CMS/API boundaries; CSRF and idempotency tests where applicable; fixtures/log/URL/analytics redaction checks; local container/config scan when introduced |
| Integrated staging | TLS/proxy/header/cookie/CSP/CORS/cache/referrer behavior; authentication/session/admin exposure; access control/IDOR; XSS/injection; SSRF/upload/traversal when exposed; rate/abuse controls; error disclosure; dependency/container/config scan; backup/restore and migration rollback |
| Appointment release candidate | Data-minimization field audit; consent and purpose display; server-authoritative validation; duplicate/timeout/unknown-outcome reconciliation; delivery failure; retention/deletion path; no personal data in URL, client logs, analytics, snapshots, caches, or public artifacts |
| Production verification | Non-invasive TLS/header/cookie/origin/request inventory and feature-gate checks; active exploitation or load requires separate written authorization |

Security findings include severity, CWE where applicable, affected build/scope, proof stored under the evidence rules, owner, remediation, and independent retest. Restricted proof must not enter source, public issues, routine CI logs, or sanitized artifacts.

## 8. Defect thresholds and release rules

| Severity | Definition | Rule |
| --- | --- | --- |
| `S1 Critical` | Wrong emergency route, personal-data disclosure, exploitable compromise, data loss, sitewide outage, or unsafe public instruction | Stop, disable, or revert; no exception and no release |
| `S2 High` | Critical journey blocked, appointment duplicate/unknown state mishandled, major AT barrier, WCAG A/AA failure affecting task/meaning, dangerous comprehension failure, or false clinical/operational promise | Fix and independently retest before affected merge/release; no release exception |
| `S3 Medium` | Recoverable noncritical functional, accessibility, responsive, language, content, or performance defect | Fix before release or use a dated exception with mitigation, owner, expiry, and retest |
| `S4 Low` | Cosmetic issue with no task, meaning, safety, accessibility, privacy, or security effect | May enter prioritized post-release backlog with owner |

Release requires zero open `S1`/`S2`, zero untriaged serious/critical automated accessibility finding, all applicable Must requirements passing, and every `S3` either fixed or covered by an approved exception. A tool score, screenshot, or CI-green result alone is not acceptance.

## 9. Benchmark incorporation and implementation evidence

Every delivery ticket must enumerate the applicable `BM-*` IDs from its page and component contracts. Completion evidence uses this ledger:

| Field | Required record |
| --- | --- |
| Benchmark application | Exact `BM-*` ID and approved Adopt/Adapt/Test/Defer disposition |
| Intended local application | The local behavior from the benchmark register, not copied wording or composition |
| Implementation location | Ticket, route/section, component/API, and code/content/config reference |
| Requirement and gate | Exact requirement IDs and any unresolved decision preventing activation |
| Implementation state | Implemented, intentionally inapplicable, gated/disabled, or deferred |
| Verification | Test/scenario ID, expected and actual result, and evidence link |
| Deviation | None, or the linked `GOV-03` reopen/change record |

All applicable Adopt/Adapt rows must be implemented or explicitly recorded as gated/inapplicable. Test items cannot become product scope until their listed evidence passes. Defer items remain absent. A ticket cannot use an exception to promote a Test/Defer item or import a rejected direct-copy behavior.

## 10. Evidence storage and retention baseline

Following the deferred `B00-015` baseline:

- sanitized automated results, non-sensitive test narratives, benchmark ledgers, build IDs, and durable pointers may live in the private GitHub project and approved CI artifacts;
- direct identifiers, personal data, sensitive screenshots, exploit details, security reports, signed approvals, contact-bearing participant records, and incident/operational evidence stay outside the repository in an authorized restricted system;
- if no authorized restricted location exists, do not generate, copy, or transfer the restricted artifact; record only the blocked evidence need;
- every evidence item records retention/expiry or inherits a documented repository policy; a pointer is invalid when its target or access owner is unknown.

Before `T3`, the named owners must record the private project, CI retention period, restricted repository, access groups, backup/restore evidence, redaction procedure, and durable-link convention. This is the production return point for `B00-015`.

## 11. Acceptance and release authority

| Scope | Required acceptance |
| --- | --- |
| Code/component change | Implementer plus automated required checks; QA for changed critical interaction |
| Staging slice | Delivery + QA/Accessibility; Security for exposed security/data boundary; applicable content/language/clinical/operations owner for meaning/facts |
| Appointment collection enablement | Product, Operations, Privacy/Legal, Security, Delivery, and QA after `APPT-01`–`APPT-04` close |
| Release candidate | Named Product, QA/Accessibility, Security, Delivery, Content/Language, Clinical, Operations, and Executive roles as applicable |
| Public launch | Only the separately recorded `B07-016` go/no-go authority for the exact artifact/config/content versions and release window |

Temporary role names support development routing but are not production signatures.

## 12. Exception process

1. Record a stable exception ID, affected requirement/test/route/build, severity, user and operational risk, reason, mitigation, monitoring, rollback/removal, owner, approvers, creation date, expiry, and retest date.
2. `S1` and `S2`, safety/clinical truth, personal-data exposure, active security weakness, inaccessible critical-journey completion, and false appointment state cannot receive a release exception.
3. An `S3` exception requires QA plus Product and the risk-domain owner; Security or Privacy participates when applicable. It expires no later than 30 days or the next release, whichever is earlier.
4. An `S4` deferral requires a backlog owner and target milestone.
5. Expiry automatically returns the item to blocking status. Scope/build/content changes invalidate the exception unless explicitly reassessed.
6. Benchmark Test/Defer promotion uses the `B00-017` / `GOV-03` change process, not this exception path.

## 13. Working-baseline completion and production return

The documentation and controlled-development portion of `B00-016` is complete when this matrix, the ticket template, and the shared evidence checklist agree and their local audits pass. The ticket then remains `Deferred` only for the following production facts:

- names and authority of acceptance/release approvers;
- actual physical-device inventory and exact browser/OS/AT versions;
- selected restricted evidence repository, access, retention, and recovery;
- executed `T3` evidence against the frozen release candidate; and
- the exact `B07-016` release authorization.

Reopen before production acceptance or sooner if a supported platform, risk model, requirement, benchmark disposition, data flow, or critical journey materially changes.
