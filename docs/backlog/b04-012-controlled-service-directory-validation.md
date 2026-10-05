# B04-012 — Controlled Service-Directory Validation

**Lane / priority:** EVIDENCE / P1

**Status:** Done for controlled development by client acceptance on 5 October 2026; final hosted CI, checked merge and exact-main closeout pending

**Responsible/review identity:** `befikadusata` directing Codex in temporary QA and Content-contract roles.

On 5 October 2026, Africa/Addis_Ababa, the client directed “start b04-012”. B04-011 is Done
for controlled development; PR #86 merged as `c34d1aa773bb5d3a0d014402c02a68fb49434cd0`.
Its [exact-main run](https://github.com/dynamicet/hallelujah-website/actions/runs/37317948582)
passed. This brief and the working B00-016 matrix govern branch
`b04-012-service-directory-validation`.

## Controlled sequencing exception

DEL-01, B04-004–B04-005, CARE-04–CARE-05, SEARCH-01 and LANG-01 remain unresolved.
The client-directed start permits local deterministic validation of the existing fictional English
loopback/noindex composition. Automation does not establish patient taxonomy comprehension,
clinical approval, approved spelling corrections, translation, or human assistive-technology acceptance.
Authentic records, public routes, providers, personal data, production and publication remain gated.

## Acceptance criteria

- Representative fictional name and governed synonym tasks return the expected stable ID.
- Unapproved spelling and clinical terms yield no inferred recommendation; urgent guidance uses
  only the exact fictional allowlist.
- Pagination emits each eligible canonical service once; internal resolution agrees with its path.
- Bounded copied URLs, group reset and native Back/Forward preserve query and result state.
- Review/expiry boundaries, unpublished and withdrawn records disappear from directory and index;
  duplicate records fail closed and withheld claims never render.
- Existing 320/360/reflow, keyboard, no-JavaScript, print, forced-colors, failure and isolation
  checks pass; the browser accessibility tree exposes a named search field and result heading.
- Full repository verification, frozen reconstruction, dependency audit, history secret scan and
  diff checks pass before controlled review.

## Repository scope and verification

Validation scripts, package command wiring, this brief, execution board and sanitized evidence
are in scope. Repair only defects demonstrated by these checks. No feature expansion is authorized.

Use pinned Node.js 24.21.0 and pnpm 10.27.0:

```sh
pnpm service-directory:validate
pnpm service-directory:check
pnpm service-directory:smoke
pnpm verify
pnpm rebuild:verify
pnpm audit:dependencies
pnpm secrets:check --history
git diff --check
```

## Source contract

- [Epic scope](epic-04-care-discovery.md#services-directory-services-s0s7)
- [B04-011 implementation brief](b04-011-controlled-service-directory.md)
- [Service-directory architecture](../architecture/service-directory.md)
- [Acceptance matrix](../validation/implementation-acceptance-matrix.md)

Stop if validation requires authentic taxonomy, claims, urgent wording, staffed contacts,
appointment actions, approved translation, external services or release authority.

## Evidence

[Local validation results](evidence/B04-012-controlled-service-directory-validation-2026-10-05.md) retain observed passes and outstanding checks.

## Local review result

The 20-case focused suite, 175-case browser matrix, full repository verification, frozen clean
reconstruction, live dependency audit, reachable-history secret scan and diff check pass on
5 October 2026. B04-012 moves In progress → In review. Hosted exact-head validation and explicit
controlled acceptance remain pending; no named-human or production gate is closed.

## Client-directed controlled acceptance — 5 October 2026

The client directed “B04-012 is in review, close it out”. `befikadusata` is the responsible
and controlled acceptance person directing Codex in temporary QA and Content-contract roles.
B04-012 moves In review → **Done** for the validated synthetic English loopback/noindex scope.
Local T0 evidence above is accepted; no scoped product defect remains open.

[Issue #87](https://github.com/dynamicet/hallelujah-website/issues/87) and
[PR #88](https://github.com/dynamicet/hallelujah-website/pull/88) track hosted current-head
validation, final acceptance-documentation CI, checked merge and passing exact-main CI.
The exact run/head, merge SHA and exact-main result must be retained there before explicit
issue closure. Dependent execution waits for passing exact-main CI; B04-013 is not promoted.
This acceptance closes no authentic-content, patient comprehension, clinical, language, human
assistive-technology, production or publication gate.
