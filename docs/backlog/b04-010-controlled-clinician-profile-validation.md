# B04-010 — Controlled Clinician-Profile Validation

**Lane / priority / phase:** EVIDENCE / P1 / Phase 1 preparation

**Status:** Done for controlled validation; checked merge and exact-main closeout complete

**Responsible/review identity:** `befikadusata` directing Codex in temporary QA,
Accessibility-test and Content-contract roles

**Tracking:** [issue #83](https://github.com/dynamicet/hallelujah-website/issues/83) and
[pull request #84](https://github.com/dynamicet/hallelujah-website/pull/84)

**Production/publication authority:** Not granted

On 30 September 2026, Africa/Addis_Ababa, the client directed the next work to start. B04-010
moves Proposed → Ready → **In progress** on branch
`b04-010-clinician-profile-validation`. B04-009 is Done for controlled development and its
exact-main run passed. The working B00-016 matrix and this brief govern the controlled pull.

## Controlled sequencing exception

The canonical B04-010 dependency `DEL-01` remains unresolved. This exception permits deterministic
local T0 and private hosted T1 validation of the synthetic English B04-009 review composition. It
does not substitute automation for named human assistive-technology, medical-staff, content or
production acceptance and does not close `DEL-01`.

B04-001–B04-003, B04-006, CARE-01–CARE-03, CARE-06, APPT-01 and LANG-01/LANG-02 also remain
unresolved. Every check therefore uses fictional loopback/noindex fixtures. No authentic roster,
claim, portrait, schedule, availability, staffed contact, appointment action, public route,
provider, personal data, production or publication is allowed.

## Controlled outcome

Add an auditable validation layer over the completed clinician-profile implementation that proves:

- required profile identity, review metadata and stable appointment context remain complete;
- missing optional fields, portrait metadata and schedules leave no misleading or empty output;
- long multilingual-name shaping reflows at 320/360 CSS px and 200% text;
- withdrawn/expired relationships disappear completely without removing the eligible profile;
- review/expiry boundaries remove the record from profile and internal crawl/search candidates;
- retired records return gone or one genuine-successor outcome without stale details;
- appointment-unavailable, no-JavaScript, print and accessibility-tree behavior remain truthful;
- loopback responses are no-store/noindex, make zero external requests and create no public route.

Validation may repair a scoped defect exposed by these cases. It must not expand the clinician
profile feature contract.

## Acceptance criteria

1. Required synthetic identity, specialty, review date, opaque public ID and canonical path are
   present once; the appointment boundary retains only the stable public ID and remains inert.
2. Missing optionals create no empty headings/lists, while stored portrait metadata and schedules
   never render an image, likeness, availability implication or source/rights detail.
3. Long mixed-script fictional names pass 320/360 px at 200% text without horizontal overflow;
   no approved translation is implied.
4. Withdrawn, expired, missing or stale care relationships remove the whole location/service
   association while the current profile remains eligible.
5. At record review and expiry boundaries, profile resolution fails closed and the shared internal
   clinician index emits no search/sitemap candidate.
6. Withdrawn records without a successor produce gone; a current genuine successor produces one
   bounded loopback redirect; neither outcome exposes stale profile details.
7. Browser accessibility-tree, no-JavaScript appointment-unavailable, print, failure and recovery
   checks pass with valid labeling and no external request.
8. The full repository gate, clean reconstruction, dependency audit, reachable-history secret scan
   and diff-integrity check pass before controlled acceptance is requested.

## Allowed repository scope

- focused static and rendered validation scripts under `apps/web/scripts/`;
- the synthetic clinician-profile fixture/loopback preview only for a deterministic validation seam;
- package commands plus this brief, execution board and sanitized evidence record;
- fail-closed dependency remediation discovered during review, limited to exact patched transitive
  overrides and the patched Next.js release with its matching lint/toolchain pins.

No unrelated dependency, public route, authentic content, CMS mutation, provider, collection path,
database, deployment, production configuration or unrelated refactor is authorized.

## Verification plan

Use pinned Node.js 24.21.0 and pnpm 10.27.0:

```sh
pnpm clinician-profile:check
pnpm clinician-profile:smoke
pnpm clinician-profile:validate
pnpm clinician-profile:validate:smoke
pnpm clinicians:check
pnpm care-relationships:check
pnpm lint
pnpm typecheck
pnpm verify
pnpm rebuild:verify
pnpm audit:dependencies
pnpm secrets:check --history
git diff --check
```

Rendered checks may bind only a random loopback port and use headless Chromium. Sanitized evidence
may contain fictional fixtures only.

## Local review result

On 30 September 2026, Africa/Addis_Ababa, B04-010 moves In progress → **In review** after the
20-case focused validation suite, 10-case rendered validation suite, 30-case predecessor contract,
142-case predecessor browser matrix, full configured repository verification, independent frozen
clean reconstruction, dependency audit, reachable-history secret scan and diff-integrity check
passed. The optimized production build retains no `/doctors/` route.

The [sanitized evidence record](evidence/B04-010-controlled-clinician-profile-validation-2026-09-30.md)
records completeness/omission, portrait and schedule withholding, long mixed-script reflow,
withdrawn/expired relationship removal, record review/expiry withdrawal, genuine-successor,
accessibility-tree, no-JavaScript, print and isolation results. Private hosted exact-head T1
[run 36751207972](https://github.com/dynamicet/hallelujah-website/actions/runs/36751207972)
passed every gate, including the live dependency audit and clean reconstruction, for exact review
head `a9a8f8437e37c3a4fec697c101ce7cd6c6277230` under
[PR #84](https://github.com/dynamicet/hallelujah-website/pull/84). Explicit client controlled
acceptance remains required before Done.

## Controlled acceptance — 30 September 2026

The client directed “close it out” while B04-010 was In review. B04-010 moves In review →
**Done** for controlled validation under `befikadusata` as responsible and controlled acceptance
person, directing Codex in temporary QA, Accessibility-test and Content-contract roles on
30 September 2026, Africa/Addis_Ababa. The target remains synthetic English local T0/private
hosted T1 under the working B00-016 matrix.

Accepted validation head `262b0582f8b2279fd6a58cdebbd50b7307bdbc09` has matching hosted
[run 36754859509](https://github.com/dynamicet/hallelujah-website/actions/runs/36754859509), which
passes every hosted gate. The
[completion evidence](evidence/B04-010-controlled-clinician-profile-validation-2026-09-30.md#controlled-acceptance)
retains the local and hosted proofs; no scoped controlled-validation defect remains open.

Final acceptance-documentation CI must pass for its exact SHA before checked merge of
[PR #84](https://github.com/dynamicet/hallelujah-website/pull/84). Its matching SHA/run, merge SHA
and exact-main result must be retained in [issue #83](https://github.com/dynamicet/hallelujah-website/issues/83)
and PR #84. Dependent execution waits for passing exact-main CI. B04-011 is not promoted by this
acceptance.

This closeout accepts only the synthetic English loopback/noindex validation. `DEL-01`,
B04-001–B04-003, B04-006, CARE-01–CARE-03, CARE-06, APPT-01 and LANG-01/LANG-02 remain unresolved.
Authentic clinicians or claims, portraits, schedules, availability, staffed contact, active
appointment actions, public routes, providers, named human acceptance, production and publication
remain gated.

The first acceptance-documentation head failed closed in the live dependency audit after the
registry published low-severity DOMPurify `GHSA-p98j-92pf-mc4p`. The already authorized exact
transitive override moves from `3.4.15` to patched `3.4.16`; no application surface or public route
is added. A new exact-head hosted pass remains required before merge.

## Exact-main closeout — 1 October 2026

Final acceptance-documentation
[run 36768495648](https://github.com/dynamicet/hallelujah-website/actions/runs/36768495648)
passed for exact head `cf5cd988d075a817ae1f15d5e9d8740d74d0deb0` after the DOMPurify
remediation. [PR #84](https://github.com/dynamicet/hallelujah-website/pull/84) then merged as
`0b845e52a4d67191a574bcbf21b69000f5faf839`. Exact-main
[run 36778354463](https://github.com/dynamicet/hallelujah-website/actions/runs/36778354463)
passed every gate for that merge commit, including the live dependency audit and independent
frozen clean reconstruction. This completes B04-010 controlled-validation closeout;
[issue #83](https://github.com/dynamicet/hallelujah-website/issues/83) is closed explicitly after
this record reaches main. B04-011 is not promoted, and every authentic-data, named-human,
production and publication gate listed above remains withheld.

## Source contract

1. [Epic scope](epic-04-care-discovery.md#doctor-profile-doctorsdoctor-slug-p0p7)
2. [B04-009 controlled implementation](b04-009-controlled-clinician-profile.md)
3. [Doctor profile page specification](../ux/page-specifications.md#4-doctor-profile)
4. [Doctor profile wireframe](../wireframes/doctor-profile.md)
5. [Governed clinician records](../architecture/governed-clinician-records.md)
6. [Governed care relationships](b02-006-governed-care-relationships.md)
7. [Implementation acceptance matrix](../validation/implementation-acceptance-matrix.md)

## Stop conditions

Stop and report the exact gate if validation would require an authentic clinician or claim, public
route, real portrait, schedule or availability, staffed contact, active appointment action,
approved translation, external service, personal data, named production acceptance or a release
claim.
