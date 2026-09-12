# Epic 04 — Care Discovery

**Outcome:** Patients can find approved clinicians and services through canonical, non-diagnostic, resilient directories and detail pages, then carry safe context into the appointment journey.  
**Priority:** P0/P1  
**Milestone:** M3  
**Routes:** `/doctors/`, `/doctors/{doctor-slug}/`, `/services/`, `/services/{service-slug}/`

## Canonical sources

- [Care-discovery flows](../wireframes/care-discovery-flows.md)
- [Doctor and service page specifications](../ux/page-specifications.md#3-doctor-directory)
- [Care-discovery visual package](../visual-design/pages/care-discovery/README.md)
- [Page handoff matrix](../visual-design/handoff/page-handoff-matrix.md#page-contracts)
- [Doctor data](../../../resources/data/doctors.json), [service data](../../../resources/data/services.json), and [content review](../../../resources/content-review.md)

## Content and taxonomy decisions

| ID | Lane | Pri | Outcome and scope | Acceptance and evidence | Dependencies / gates | Owner | References |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `B04-001` | DECISION | P0 | Approve the current clinician roster and disposition of 17 directory records versus 15 profile-only records. | Signed roster provides stable public ID, publish/omit/merge/retire disposition, owner, review date, and genuine-successor redirect; no record is assumed current from old-site presence. | `CARE-01` | Medical Staff + Content | `D-001`, `H-003`, `G-014`; [W4 scenario](../validation/stakeholder-low-fidelity-validation.md#w4--doctor-publication-and-schedule-boundary) |
| `B04-002` | DECISION | P0 | Resolve duplicate/missing clinician records and approve profile fields, maintained filters, canonical slugs, availability wording, and portrait treatment. | Canonical map closes known duplicate/unlinked issues; completeness and optional-field rules are explicit; every filter is maintainable; portrait rights/fallback decision is recorded. | `CARE-02`, `BRAND-01` for imagery | Medical Staff + Content | `D-002`–`D-004`, `D-006`, `G-013`–`G-015`; [doctor review queue](../../../resources/content-review.md#priority-1--doctors-and-schedules) |
| `B04-003` | DECISION | P0 | Approve governed schedule model or explicitly continue omitting schedules. | Duplicate Saturday/missing Sunday/`LT` issues, timezone/display, refresh owner, and review frequency are resolved; otherwise omission is the signed outcome and no availability implication appears. | `CARE-03` | Operations + Medical Staff | `D-005` |
| `B04-004` | DECISION | P0 | Approve one patient-oriented service taxonomy, launch subset, names/groups/slugs, bilingual synonyms, and correction policy. | Signed taxonomy reconciles all 39 extracted records, known overlaps/misspellings/copy errors, searchable terms, and deferred records; Departments is not introduced as a competing hierarchy. | `CARE-04` | Clinical + Content + Product | `V-001`, `V-004`, `H-005`; [services data](../../../resources/data/services.json) |
| `B04-005` | DECISION | P0 | Approve service scope, common needs, tests/treatments, preparation/referral, urgent exceptions, locations/hours, and each high-consequence capability. | Claim ledger records source, scope, eligibility, limitation, availability, location, owner/reviewer, review date, expiry, and approved wording; affected claims/records are withheld when evidence is incomplete. | `CARE-05`, `SAFE-02`–`SAFE-04` | Clinical + Operations + Executive | `V-002`–`V-004`, `E-002`–`E-004`, `H-004`; [claim ledger](../../../audit/claim-ledger.md) |
| `B04-006` | DECISION | P1 | Approve bidirectional doctor/service/location relationships and appointment public-ID handoff. | Governed relationship table proves both records are current and the relationship is approved; removal and appointment-selector behavior are specified. | `CARE-06`, `CARE-01`, `CARE-04` | Clinical + Content | `V-005`, `D-003`, `D-004`, `A-003` |

## Doctor directory `/doctors/` (`D0`–`D6`)

| ID | Lane | Pri | Outcome and implementation scope | Acceptance and evidence | Dependencies / gates | Owner | References |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `B04-007` | DELIVERY | P1 | Implement server-rendered clinician directory with name/specialty search, approved filters, result count, pagination, and canonical cards. | Initial, searched/filtered/paged, loading, zero, failure/offline, empty-approved-set, retired/unavailable, and no-JS states work; URL state is bounded/shareable; only approved records and maintained filters appear; counts announce once. | `B01-007`–`B01-010`, `B02-004`, `B04-001`–`B04-002`, `SEARCH-01` | Frontend + Backend | `D-001`–`D-003`; [directory spec](../ux/page-specifications.md#3-doctor-directory); [wireframe](../wireframes/doctor-directory.md); [study](../visual-design/pages/care-discovery/doctor-directory.html) |
| `B04-008` | EVIDENCE | P1 | Validate directory relevance, URL/history, canonicality, accessibility, resilience, and content lifecycle. | Tests cover combinations/reset/deep links/Back/Forward, spelling/name variants, keyboard/filter focus, AT count, long/missing fields, 320/360/reflow, no JS, failure, record expiry during session, and crawl uniqueness. | `B04-007`, `DEL-01` | QA + Content | `D-001`–`D-003`, `G-003`, `G-005`–`G-013` |

## Doctor profile `/doctors/{doctor-slug}/` (`P0`–`P7`)

| ID | Lane | Pri | Outcome and implementation scope | Acceptance and evidence | Dependencies / gates | Owner | References |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `B04-009` | DELIVERY | P1 | Implement governed clinician profile with approved identity, expertise, languages/location, related services, appointment handoff, review metadata, and optional schedule/portrait. | Approved/partial, portrait omitted, route failure, expired/unapproved, missing related record, schedule omitted, and no-JS states pass; optional fields leave no misleading label; appointment passes only stable public ID; canonical/404/410/redirect is correct. | `B02-004`, `B02-006`, `B04-001`–`B04-003`, `B04-006`; appointment CTA gated by `APPT-01` | Frontend + Backend | `D-003`–`D-006`, `V-005`; [profile spec](../ux/page-specifications.md#4-doctor-profile); [wireframe](../wireframes/doctor-profile.md); [study](../visual-design/pages/care-discovery/doctor-profile.html) |
| `B04-010` | EVIDENCE | P1 | Validate profile completeness, omission, retirement, relationships, imagery, schedule boundary, and appointment continuity. | Schema/crawl tests plus human review cover long multilingual names, missing optionals, no portrait, no schedule, expired/merged record, removed relationship, appointment unavailable, no JS, reflow, print, AT, and cache/search/sitemap withdrawal. | `B04-009`, `DEL-01` | QA + Medical Staff + Content | `D-003`–`D-006`, `G-010`, `G-013`–`G-016` |

## Services directory `/services/` (`S0`–`S7`)

| ID | Lane | Pri | Outcome and implementation scope | Acceptance and evidence | Dependencies / gates | Owner | References |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `B04-011` | DELIVERY | P1 | Implement server-rendered service directory with approved grouping, search, filters, count, pagination, and non-diagnostic guidance. | Initial, searched/grouped/paged, loading, zero, failure/offline, empty-approved-set, withheld-record, and no-JS states pass; only one taxonomy appears; urgent terms route safely; no diagnosis/treatment recommendation is generated. | `B01-007`–`B01-010`, `B02-005`, `B04-004`–`B04-005`, `SEARCH-01` | Frontend + Backend | `V-001`, `V-003`, `V-004`, `H-005`; [services spec](../ux/page-specifications.md#5-services-directory); [wireframe](../wireframes/services-directory.md); [study](../visual-design/pages/care-discovery/services-directory.html) |
| `B04-012` | EVIDENCE | P1 | Validate taxonomy comprehension, directory relevance, withholding, canonicality, accessibility, and resilience. | Tests include representative patient tasks, synonyms/spelling, urgent terms, group/filter reset/history, copied-content regression, expired/unpublished exclusion, 320/360/reflow, keyboard/AT, no JS, and failures. | `B04-011`, `DEL-01` | QA + Clinical + Product | `V-001`, `V-003`, `V-004`, `G-003`–`G-013`, `G-016` |

## Service detail `/services/{service-slug}/` (`V0`–`V9`)

| ID | Lane | Pri | Outcome and implementation scope | Acceptance and evidence | Dependencies / gates | Owner | References |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `B04-013` | DELIVERY | P1 | Implement service detail with approved scope, who-it-helps, care details, preparation/referral, urgent exception, clinician/location relationships, and appointment handoff. | Approved/partial, claim withheld, no related clinician, appointment unavailable, operational data unavailable/expired, retired, and no-JS states pass; no empty headings or invented claims; stable IDs preserve relationship and request context. | `B02-005`–`B02-006`, `B04-004`–`B04-006`; `SAFE-02`–`SAFE-04`, `APPT-01` | Frontend + Backend | `V-002`–`V-005`; [detail spec](../ux/page-specifications.md#6-service-detail); [wireframe](../wireframes/service-detail.md); [study](../visual-design/pages/care-discovery/service-detail.html) |
| `B04-014` | EVIDENCE | P0 | Validate every published clinical/operational statement and service journey against the claim ledger. | Automated completeness/expiry/relationship tests and named clinical/operations review cover claim scope/limitations, urgent wording, location/hours, no-JS, print, AT, languages, 320/360/reflow, retirement, cache/search/sitemap removal, and appointment handoff. | `B04-013`, `DEL-01`, applicable content/language gates | QA + Clinical + Operations | `V-002`–`V-005`, `G-014`–`G-016` |

## Epic exit criteria

- One approved canonical record appears across directory, profile/detail, Home, search, sitemap, and appointment selectors.
- Retired/unapproved records and relationships disappear everywhere and return correct redirect/404/410 behavior.
- Search and service language remain navigational and non-diagnostic.
- No schedule, capability, availability, relationship, or portrait implication is inferred.

## Explicit exclusions

- No real-time availability or confirmed appointment slots.
- No symptom checker, diagnosis, treatment advice, or urgency estimation.
- No filter based on data the hospital cannot maintain reliably.
