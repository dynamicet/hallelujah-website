# B04-008 — Controlled Clinician-Directory Validation

**Lane / priority / phase:** EVIDENCE / P1 / Phase 1 preparation

**Status:** Done for controlled validation; final acceptance-documentation CI and checked merge
tracked below

**Responsible/review identity:** `befikadusata` directing Codex in temporary QA,
Accessibility-test and Content-contract roles

**Tracking:** [issue #79](https://github.com/dynamicet/hallelujah-website/issues/79) ·
[PR #80](https://github.com/dynamicet/hallelujah-website/pull/80)

**Production/publication authority:** Not granted

On 29 September 2026, Africa/Addis_Ababa, the client directed the next work to start. B04-008
moves Proposed → Ready → **In progress** on branch
`b04-008-clinician-directory-validation`. B04-007 is Done for controlled development and its
exact-main run passed. The working B00-016 matrix and this brief govern the controlled pull.

## Controlled sequencing exception

The canonical B04-008 dependency `DEL-01` remains unresolved. This exception permits deterministic
local T0 and private hosted T1 validation of the synthetic English B04-007 review composition. It
does not substitute automation for named human assistive-technology, content, medical-staff or
production acceptance and does not close `DEL-01`.

B04-001, B04-002, CARE-01, CARE-02, SEARCH-01 and LANG-01 also remain unresolved. Therefore every
test uses visibly synthetic names and specialties on the loopback/noindex preview. No authentic
roster, maintained vocabulary, public `/doctors/` route, profile, portrait, schedule, availability,
staffed contact, appointment action, provider, personal data, production or publication is allowed.

## Controlled outcome

Add an auditable validation layer over the completed directory implementation that proves:

- bounded name/specialty relevance, approved filter combinations and explicit typo/no-match behavior;
- canonical URL generation, deterministic parameter-order handling, deep links, resets and native
  Back/Forward restoration;
- unique public IDs and canonical profile paths across pagination, with withdrawn records excluded;
- one accessible result-count status, keyboard-operable disclosure/filter/search controls and
  URL-authoritative form state;
- long-content and missing-optional behavior at 320/360 CSS px and 200% text without overflow;
- no-JavaScript deep links plus fail-closed failure, offline and empty-approved-set states;
- immediate exclusion at review/expiry boundaries and no stale card rendering; and
- loopback-only, no-store/noindex responses with zero external browser requests.

Validation may repair a scoped defect exposed by these cases. It must not add a route or expand the
directory feature contract.

## Acceptance criteria

1. Search checks cover case variants, full names, normalized whitespace, specialties, combined
   search/filter behavior and a misspelling that returns an explicit zero result rather than an
   inferred person.
2. Repeated/unknown filter values are bounded; canonical URLs use allowlisted values in stable
   order and omit empty/default state.
3. Native GET submission, deep links, reset links and Back/Forward keep displayed controls aligned
   with the URL. The existing first-party search-controls enhancement is present in the preview;
   the directory remains fully usable without JavaScript.
4. The browser accessibility tree contains one polite atomic status for the count, the results list
   references it, and the disclosure, checkbox and search sequence work by keyboard.
5. All nine current synthetic records occur once across pagination; public IDs and canonical paths
   are unique; the retired fixture never appears.
6. Long fictional content at 320/360 px and 200% text has no horizontal overflow or empty heading,
   while failure/offline/empty states expose no stale record or count.
7. Records disappear at their review/expiry boundaries. Every preview variant is no-store/noindex,
   accepts only the existing read-only loopback contract and makes zero external request.
8. The full repository gate, clean reconstruction, dependency audit, reachable-history secret scan
   and diff-integrity check pass before controlled acceptance is requested.

## Allowed repository scope

- focused static and rendered validation scripts under `apps/web/scripts/`;
- the loopback clinician-directory renderer/server only where a validation case exposes a scoped
  defect or requires a deterministic test seam;
- package commands plus this brief, execution board and sanitized evidence record.

No dependency, public route, authentic content, CMS mutation, provider, collection path, database,
deployment, production configuration or unrelated refactor is authorized.

## Verification plan

Use pinned Node.js 24.21.0 and pnpm 10.27.0:

```sh
pnpm clinician-directory:check
pnpm clinician-directory:smoke
pnpm clinician-directory:validate
pnpm clinician-directory:validate:smoke
pnpm search-controls:check
pnpm lint
pnpm typecheck
pnpm verify
pnpm rebuild:verify
pnpm audit:dependencies
pnpm secrets:check --history
git diff --check
```

The rendered checks may bind only a random loopback port and use headless Chromium. Sanitized
evidence may contain synthetic fixtures only.

## Local review result

On 29 September 2026, Africa/Addis_Ababa, B04-008 moves In progress → **In review** after the
focused predecessor and validation suites, full repository verification, independent frozen clean
reconstruction, dependency audit, reachable-history secret scan and diff-integrity check passed.
The optimized build retains no `/doctors/` route. Hosted implementation
[run 36572857997](https://github.com/dynamicet/hallelujah-website/actions/runs/36572857997)
then passed every gate for review head `ce8088db89c139b92d254351cd461fc6928f4a0c`.
Explicit client controlled acceptance, final acceptance-documentation CI and checked merge remain
required before Done.

## Controlled acceptance — 29 September 2026

The client directed “B04-008 is In Review, close it out”. B04-008 moves In review → **Done** for
controlled validation under `befikadusata` as responsible and controlled acceptance person,
directing Codex in temporary QA, Accessibility-test and Content-contract roles on 29 September
2026, Africa/Addis_Ababa. The target remains synthetic local T0/private hosted T1 under the working
B00-016 matrix.

Accepted implementation head `ce8088db89c139b92d254351cd461fc6928f4a0c` has matching hosted
[run 36572857997](https://github.com/dynamicet/hallelujah-website/actions/runs/36572857997), which
passes every hosted gate. The
[completion evidence](evidence/B04-008-controlled-clinician-directory-validation-2026-09-29.md#controlled-acceptance)
retains the local and hosted proofs; no scoped controlled-validation defect remains open.

Final acceptance-documentation CI must pass for its exact SHA before checked merge of
[PR #80](https://github.com/dynamicet/hallelujah-website/pull/80). Its matching SHA/run, merge SHA
and exact-main result must be retained in [issue #79](https://github.com/dynamicet/hallelujah-website/issues/79)
and PR #80. Dependent execution waits for passing exact-main CI. B04-009 is not promoted by this
acceptance.

This closeout accepts only the automated synthetic English loopback/noindex validation. `DEL-01`,
B04-001, B04-002, CARE-01, CARE-02, SEARCH-01, LANG-01, named human assistive-technology/content
acceptance, authentic relevance and clinician data, public routes, profiles, providers, production
and publication remain gated.

## Source contract

1. [Epic scope](epic-04-care-discovery.md#doctor-directory-doctors-d0d6)
2. [B04-007 controlled implementation](b04-007-controlled-clinician-directory.md)
3. [Doctor directory page specification](../ux/page-specifications.md#3-doctor-directory)
4. [Doctor directory wireframe](../wireframes/doctor-directory.md)
5. [Governed clinician records](../architecture/governed-clinician-records.md)
6. [Search/filter primitives](../architecture/search-filter-primitives.md)
7. [Implementation acceptance matrix](../validation/implementation-acceptance-matrix.md)

## Stop conditions

Stop and report the exact gate if validation would require an authentic clinician or vocabulary,
public route, real portrait, schedule or availability, staffed contact, appointment action,
unreviewed translation, external service, personal data, named production acceptance or a release
claim.
