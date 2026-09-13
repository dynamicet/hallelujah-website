# Developer Handoff

## 1. Readiness statement

The blueprint is ready to estimate and plan. It is not authorization to deploy the prototype, publish extracted content, collect visitor data, connect hospital operations, or enable a third party. A production slice is ready only when its applicable rows in the [formal decision register](../../validation/stakeholder-low-fidelity-validation.md) have named owners, dated outcomes, and durable evidence.

Careers remains Phase 2. Phase 1 Privacy, Accessibility, and genuine 404/410/unavailable behavior now have coordinated [utility specifications](../../ux/utility-page-specifications.md) and [wireframes](../../wireframes/utility-pages.md). Cookie disclosure remains within `/privacy/` by default. A separate Cookie route, Terms / Legal Notice, Referring Clinicians, Health Information / News, Careers, and a Patient Portal stay outside the initial Phase 1 implementation backlog unless `GOV-02` records an approved scope change.

## 2. Authority and change control

Implement from contracts, not screenshots. Use this order when resolving ambiguity:

1. dated, evidenced decision by the accountable hospital owner;
2. requirements matrix and formal validation register;
3. page specifications, shared design-system contracts, wireframes, and flow documents;
4. approved structured content records and verification queue;
5. non-public visual studies and connected prototype;
6. locally dispositioned benchmark evidence.

Keep requirement IDs, applicable `BM-*` IDs/dispositions, decision IDs, route, stable section ID, acceptance test, evidence link, and content approval state on every implementation ticket. Apply the test tiers, supported-platform matrix, defect rules, exception process, and benchmark implementation ledger in the [implementation acceptance matrix](../../validation/implementation-acceptance-matrix.md). A behavior change must update the decision record, requirement, page contract, component/layout contract, wireframe/flow, visual reference, implementation acceptance, and evidence together.

## 3. Prototype-to-production boundary

The HTML studies demonstrate composition and state. They deliberately omit a production framework, CMS model, API, persistence, authentication/authorization, rate limiting, observability, consent storage, operational ownership, and deployment controls.

Those production choices now have an approved implementation-planning baseline in [Epic 0 — Initial Production Architecture](../../architecture/epic-0-technical-foundation.md): Payload CMS with Next.js/TypeScript, PostgreSQL, GitHub, VPS hosting, GitHub Actions, intended Docker packaging, first-party-minimum integrations, privacy-conscious monitoring, and split evidence storage. Public content and appointment data are logically separated but initially hosted on the same VPS. The linked record's open selections and security, privacy, acceptance, and release gates remain binding.

Do not copy these prototype-only elements into production:

- fictional clinicians, services, facts, contact placeholders, reference `PROTO-ONLY-001`, or geometry-only Amharic strings;
- the reviewer toolbar, fixture query parameters, forced-state selectors, allow-listed demo search behavior, or simulated timeouts/outcomes;
- inert calls/maps/applications and local-only announcements as substitutes for approved operational behavior;
- deep CSS imports between page-study packages or the prototype script as an application architecture;
- public-site or benchmark screenshots, remote media URLs, or unapproved source copy.

Use the prototype to derive tested contracts. Rebuild those contracts with server authority, approved data, route-level error handling, security controls, and production tests.

## 4. Token and style integration

The design system uses three layers:

```text
primitive values
  → semantic roles
    → component aliases
      → template composition
```

- [Foundation CSS](../foundations/tokens.css) is the current prototype value source.
- [Foundation JSON](../foundations/tokens.json) is the portable manifest.
- [Component CSS](../components/component-tokens.css) imports foundations and adds component aliases.
- [Component JSON](../components/component-tokens.json) describes that extension.
- Page CSS, the Order 9 correction layer, and prototype CSS are review implementations downstream of those contracts.

For production, choose one canonical token source and generate the other format. Add a parity test so CSS and platform tokens cannot drift. Preserve primitive → semantic → component references; template styles should consume semantic or component aliases and must not introduce a second palette. The Calm Wayfinding values remain a replaceable prototype theme until `BRAND-01`, professional English/Amharic typography review, font licensing, and rendered contrast retesting close.

The review studies use chained page imports to minimize duplicated prototype CSS. Production templates should depend on shared foundation/component layers and their own bounded composition module, not on another page template or `prototype.css`.

## 5. Recommended delivery sequence

This is a dependency sequence, not the prioritized product backlog required after Order 12.

| Sequence | Deliverable boundary | Entry condition | Required behavior |
| ---: | --- | --- | --- |
| 0 | Trusted source, governance, environments | `GOV-01`, `GOV-02`, `SEC-01`, `DEL-01` dispositioned for the work | Repository/deployment trust, owners, phase scope, evidence locations, CI checks. |
| 1 | Shared shell and static safe routes | Approved labels, Phase 1 route inventory, `LANG-01` safety set | Skip link, landmarks, task navigation, language continuity, no-JS access, provisional tokens kept swappable. |
| 2 | Emergency and contact/arrival | `SAFE-01`–`SAFE-04`, `SEC-02`, required language/content evidence | Purpose-labeled deliberate calls, route distinction before action, text-first arrival, map optional and noncritical. |
| 3 | Approved care records | `CARE-01`–`CARE-06` as applicable | Canonical public IDs, governed publication/retirement, no inferred schedules/availability/capability, bidirectional relationships. |
| 4 | Patient information and navigational search | `ACCESS-01`, `SEARCH-01`, `SEARCH-02`, language parity for included routes | Approved guidance only; typed canonical results; non-diagnostic matching; bounded URL state; privacy-safe logs or logging off. |
| 5 | Appointment request | `APPT-01`–`APPT-04`, safety/privacy/security/delivery evidence | Server-authoritative validation, idempotency, unknown-outcome reconciliation, truthful receipt/delivery states, no booking promise. |
| 6 | About and governed media | `INST-01`–`INST-03`, `BRAND-01`, asset rights | Evidence-dated claims, expiry/removal, care-task returns, no unsupported superlatives or relationship implications. |
| 7 | Careers (Phase 2) | `HR-01`–`HR-03`, provider/privacy/security/language gates | Current lifecycle-controlled vacancies; privacy before Apply; removal on close; safe provider failure. |
| 8 | Optional third parties/enhancements | `SEC-02` plus feature-specific approval and failure test | Default deny; explicit purpose/minimization; essential journeys remain complete when blocked or failed. |

## 6. Data and URL contracts

- Public doctor, service, vacancy, location, and content records need stable opaque public IDs, status, owner, review date, expiry/withdrawal behavior, and redirect decision.
- Query strings may contain navigational state only: bounded search text, approved filter keys, page, language route context, and public record IDs. Never place names, phone numbers, email addresses, notes, consent, health context, candidate data, receipt secrets, or internal identifiers in a URL.
- The server must revalidate every identifier, enumeration, record status, relationship, and field. A hidden input or prototype allow-list is not authorization.
- Search stays navigational. It must not diagnose, estimate urgency, silently change clinically meaningful wording, or expose unpublished/expired records.
- Language switching preserves the canonical record and safe navigational state. It must never copy personal form data through the URL.
- Retired records leave directories, search, and sitemaps. Redirect only to a genuine approved successor; otherwise return the agreed unavailable/404/410 behavior.

## 7. Progressive enhancement and resilience

Server-render meaningful headings, landmarks, contacts, directions, record identity, privacy notices, validation errors, and recovery actions. Essential information must survive absent JavaScript, styles, images, custom fonts, optional maps, analytics, and third-party providers.

GET is appropriate for bounded directory/site-search state after `SEARCH-01`/`SEARCH-02`. Personal-data forms use POST or the approved equivalent with CSRF protection, server validation, abuse controls, idempotency, and cache/referrer protections. If the workflow is not approved or reachable, fail closed before accepting data and explain the staffed alternative only when that alternative is verified.

Loading may cover only genuinely changing content. Never delay or skeletonize emergency facts, required privacy text, validation errors, or primary contact/arrival information. Preserve submitted valid values through correctable validation and known failure. An unknown outcome blocks a duplicate attempt until reconciliation establishes whether the original request exists.

## 8. Component and state contract

Use the [detailed component specification](../components/component-specifications.md) as the visual-state source and the [shared component contracts](../../design-system/components.md) as the technology-independent source.

State precedence is: unavailable/expired → error/invalid → disabled → loading/pending → pressed → focus-visible → hover → default. Focus remains visible when it coincides with validation or other states. Disabled controls require an adjacent explanation; do not use a disabled primary action as the only way to teach form requirements.

Only an authoritative accepted response receives success treatment. A local validation pass, optimistic client state, timeout, queued attempt, or confirmation-delivery warning is not success. Alerts and statuses use structure, words, and an appropriate recovery action rather than color alone.

## 9. Bilingual and responsive implementation

- Treat both English and Amharic as left-to-right at document level unless approved content contains a bounded bidirectional run.
- Do not truncate navigation, record names, field labels, warnings, errors, or emergency language. Allow wrapping and use content-fit layout changes.
- Preserve 320 and 360 CSS px behavior, representative tablet, 1280/1440 layouts, and 200%/400% reflow. Do not translate the tested CSS-pixel equivalents into a claim that manual browser zoom has passed.
- Keep a single meaningful DOM order across breakpoints. Reflow grids visually; do not duplicate content for mobile/desktop.
- Use the unavailable-translation contract rather than silently falling back for consequential text. Careers Apply remains unavailable when required process/privacy terms lack an approved equivalent.
- System fonts render immediately. Any later self-hosted font needs license, glyph, weight, subsetting, preload, fallback-metric, and performance review.

## 10. Accessibility, motion, and performance

Implement the [accessibility and validation checklist](accessibility-and-validation-checklist.md) in CI and manual release testing. The Order 11 Chromium results are a regression baseline, not a substitute for production semantics, screen readers, browsers, touch hardware, zoom, language comprehension, or field telemetry.

Use the [High-End Motion and Interactive-Media Amendment](../motion/high-end-motion-and-interactive-media-amendment.md) for production and retain the original [Order 3 rules](../motion/motion-and-storytelling.md#3-intensity-scale) as historical prototype evidence. Functional motion remains brief; selected Home, About, Patient Information, arrival, and institutional-story sections may use composed/cinematic Levels 3–4. Emergency and urgent, consequential appointment, error, privacy/consent, unavailable, expired, and unknown-outcome content remain stable Level 0/1 contexts. Reduced motion receives an intentional static/direct composition; Save-Data prevents automatic non-essential transfer. No route change waits for animation.

Hero and institutional video is poster-first and user-initiated. It makes zero media request before Play, exposes persistent playback controls, and never carries unique task or safety meaning. Informative media needs captions/transcript and an audio-description decision. A motion runtime is not implicit scope: record its license, security, compressed bytes, loading boundary, cleanup, reduced-mode behavior, and CSS/no-library comparison before selection.

Treat `G-008` field thresholds and the approved `DEL-01` environment as release gates. The local 400 kbps result of LCP 3.508 s did not pass the production LCP requirement. Maintain the `G-009` transfer/request/JavaScript budgets, but measure compressed production output and real templates.

## 11. Security and privacy baseline

- Do not build on or migrate from a source until `SEC-01` establishes it as trusted.
- Default-deny analytics, maps, chat, replay, pixels, remote autocomplete, fonts, media, appointment providers, and recruitment providers until `SEC-02` and the feature-specific assessment close.
- Validate and encode output by context; restrict allowed markup; protect state-changing requests; rate-limit/abuse-protect forms; keep dependencies patched; apply a restrictive CSP and appropriate cache/referrer headers.
- Minimize collection before designing storage. Document purpose, lawful basis where applicable, recipients, access, transport, retention/deletion, logs, analytics, incident handling, and user rights for every personal-data field.
- Never log raw appointment/candidate content, secrets, consent values, or sensitive search terms by default. Redaction and access/retention rules require explicit approval and tests.
- Authoritative receipts need non-guessable references and access rules. Public IDs are not authorization; internal IDs and secrets do not belong in markup or URLs.

## 12. Definition of ready

An implementation ticket is ready when it has:

- approved phase and route, accountable product/content/technical owners, and applicable decision outcomes;
- linked requirement IDs, page/section IDs, component contracts, state list, and language scope;
- approved content/data schema or an explicit safe omission/withheld state;
- security/privacy/data-flow review for personal data or third parties;
- acceptance cases for 320/360/reflow, keyboard, focus, no-JS/failure, reduced motion, and relevant bilingual states;
- a durable evidence destination and expiry/review behavior.

## 13. Definition of done

A slice is done only when:

- server and client behavior meet the authoritative contract across default and applicable loading, empty, error, offline, unavailable, expired, validation, unknown, and success states;
- content is approved, current, language-reviewed, rights-cleared, and traceable to owner/date/source/expiry;
- automated and required manual tests pass in the approved environments, with evidence linked to requirements;
- security/privacy review and negative tests pass; optional dependencies fail without blocking essential tasks;
- performance budgets pass on compressed production output and the agreed constrained profile; field monitoring is configured where required;
- the named release owner records residual risk or exception, rollback/removal behavior, and approval.
