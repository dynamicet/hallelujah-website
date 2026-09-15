# `B01-008` — Governed-Content Cards

**Execution date:** 16 September 2026, Africa/Addis_Ababa

**Scope:** Controlled local and private-repository implementation only
**Status:** Done for controlled development; production acceptance remains gated
**Hosted review:** Implementation `T1` passed on `f0e8dcb`; documentation head `b62d65b` passed; final acceptance head must repeat the gate

## Execution contract

| Field | Controlled value |
| --- | --- |
| Epic / lane / priority | Epic 01 / `DELIVERY` / `P1` |
| Phase / milestone | Phase 1 / `M1` |
| Responsible / local acceptance | Client workspace identity `befikadusata` directing Codex in the temporary Frontend, Content, and QA roles; named production owners return at their gates |
| Dependencies | `B01-004` and controlled `B02-001` are Done; authentic content, asset, recruitment, and publication gates remain open |
| Requirements | `G-014`–`G-015`, `D-003`–`D-006`, `V-005`; vacancy remains under `HR-01`–`HR-03` and `LANG-02` |
| Target | Local `T0` and private-repository hosted implementation `T1`; no public route or production environment |
| Allowed scope | Governed card component, neutral media fallback, typed display fields, synthetic fixture, responsive/semantic browser checks, documentation, and sanitized evidence |
| Evidence | [Local result](evidence/B01-008-governed-content-cards-2026-09-16.md) and [captures](evidence/b01-008-rendered/) |
| Repository review | [Issue `#22`](https://github.com/dynamicet/hallelujah-website/issues/22), [pull request `#23`](https://github.com/dynamicet/hallelujah-website/pull/23), [hosted implementation run `35030463614`](https://github.com/dynamicet/hallelujah-website/actions/runs/35030463614), and [documentation-head run `35030914802`](https://github.com/dynamicet/hallelujah-website/actions/runs/35030914802) |

The client's instruction to start the next execution permits this controlled implementation and
review. It grants no authority for real hospital records, contact values, clinical claims,
staffing/schedules, portraits, vacancies, candidate data, providers, public routes, production, or
publication. The generic `B02-001` record governs identity, status, approval metadata, and dates;
the card receives separate explicitly supplied display fields until the kind-specific CMS models
are approved under `B02-003`–`B02-005` and Phase 2 careers work.

## Observable acceptance

1. A validated, current record renders one entity with one clear title destination. Doctor,
   service, location, and vacancy fields follow the [component anatomy](../design-system/components.md#7-governed-content-cards).
2. The public default withholds synthetic, invalid, unapproved, due-for-review, expired, and
   withdrawn records. Controlled fixture mode can show synthetic unavailable and retired specimens,
   but they have no destination or application action.
3. Required display fields and same-origin destinations fail closed. Optional values omit their
   label as well as their value. The doctor fallback is neutral text, with no generated likeness.
4. A separate authorized review input controls reviewer metadata. The synthetic fixture labels its
   review shape as synthetic; the public medical label is reserved for eligible clinical records.
5. Vacancy content includes process and privacy-route anatomy in the synthetic fixture. The public
   contract requires explicit recruitment-privacy and application approval plus a safe Apply
   destination; without them, it withholds the card. Closing or retirement removes actions.
6. Cards remain server rendered, work without JavaScript, wrap at 320 px and enlarged-text/reflow
   equivalents, preserve 44 px links, and retain non-color boundaries in forced colors and print.

## Verification

| Check | Command | Result |
| --- | --- | --- |
| Full repository gate | `pnpm verify` with pinned Node.js 24.21.0 | Passed locally; includes B01-008 browser smoke |
| Visual/browser matrix | `pnpm governed-cards:smoke --capture-dir docs/backlog/evidence/b01-008-rendered` | Passed; 320 and 1440 px sanitized captures |
| Reachable-history secrets | `pnpm secrets:check --history` | Passed |
| Dependency audit | `pnpm audit:dependencies` | Passed outside restricted network sandbox |
| Hosted exact-head implementation `T1` | Pull-request quality/security gate | Passed on `f0e8dcb`; documentation head `b62d65b` also passed; final acceptance head must repeat before merge |

## Remaining gates

Kind-specific CMS governance, real data and review authority, asset rights/derivatives,
clinical/operations recruitment approval, bilingual wording, physical-device and assistive-
technology acceptance, public route integration, and production release are separate outcomes.
