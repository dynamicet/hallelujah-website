# Controlled Service Directory

## Purpose

`B04-011` supplies a reusable service-directory composition and query contract without mounting a
public `/services/` route. It demonstrates S1–S7 with synthetic governed records while taxonomy,
clinical claims, search, language and publication decisions remain open.

## Boundary

- `controlledServiceDirectory` accepts only the `controlled-fixture` mode already required by the
  service projection.
- The query surface is `q`, repeated `group`, and `page`. Queries normalize Unicode and whitespace,
  remove controls and cap at 80 characters; groups are checked against an explicit allowlist;
  invalid pages resolve safely.
- Search covers only projected synthetic service names and exact fictional synonyms. It performs no
  diagnosis, semantic inference, treatment recommendation, urgency estimation, logging, analytics
  or remote request.
- One group identity supplies filter and result grouping. Withheld claims, retired records and
  non-current approvals cannot enter results or counts.
- One exact fictional urgent term demonstrates the governed placement boundary. It has no clinical
  meaning and activates no call, external provider or public emergency route.
- The loopback preview accepts GET/HEAD only, rejects unknown keys, disables caching and indexing,
  blocks external connections and keeps native GET submission available.
- Application source contains no fixture import and `apps/web/src/app/services/` remains absent.

## State model

Initial, searched, grouped and paged states render governed synthetic results. A review-only loading
state retains controls and withholds results. No-match preserves controls and supplies a reset.
Failure, offline and empty-approved-set states replace results so stale records cannot appear current.
Withheld claim text and withdrawn or expired records never render.

## Promotion requirements

A public route requires B04-004/B04-005 taxonomy and claim approval, CARE-04/CARE-05, SEARCH-01,
approved language scope, authentic CMS records, canonical detail behavior, privacy-safe query policy,
formal human acceptance evidence and explicit publication authority. This controlled preview does
not approve or substitute for any of those decisions.
