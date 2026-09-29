# Controlled Clinician Directory

## Purpose

`B04-007` supplies a reusable clinician-directory composition and query contract without mounting a
public `/doctors/` route. It demonstrates D0–D6 with synthetic governed records while roster,
taxonomy, search, language and publication decisions remain open.

## Boundary

- `controlledClinicianDirectory` accepts only the explicit `controlled-fixture` mode already
  required by the clinician projection.
- The query surface is `q`, repeated `type`, and `page`. Queries are normalized and capped at 80
  characters; filters are checked against an explicit allowlist; invalid pages resolve safely.
- Search covers only projected clinician names and exact synthetic specialty text. It performs no
  diagnosis, synonym inference, ranking inference, logging, analytics or remote request.
- Results retain only the existing controlled clinician view. Portrait, schedule and appointment
  values stay withheld.
- The loopback preview accepts GET/HEAD only, rejects unknown keys, disables caching and indexing,
  blocks external connections, and keeps native GET submission available.
- Application source contains no fixture import and `apps/web/src/app/doctors/` must remain absent.

## State model

Initial, searched, filtered and paged states render governed synthetic results. No-match preserves
the controls and supplies a reset. Failure, offline and empty-approved-set states replace all
results so stale records cannot appear current. Withdrawn or expired records never enter counts.

## Promotion requirements

A public route requires B04-001/B04-002 roster and field approval, CARE-01/CARE-02, SEARCH-01,
approved language scope, authentic CMS records, canonical profile behavior, privacy-safe logging
decisions, formal acceptance evidence and explicit publication authority. The controlled preview
is not convertible into approval evidence for those decisions.
