# Governed Clinician Records

`B02-004` extends the existing doctor kind in the authenticated governed-record collection.
There is no separate route, collection, package, migration or public roster. Its controlled
authority and acceptance are in the [execution brief](../backlog/b02-004-governed-clinician-records.md).

`clinician.ts` validates an immutable opaque roster key, explicit current/unverified/former
state, English and optional Amharic details, typed location references, optional governed portrait
metadata and permanently withheld schedule/appointment contracts. Canonical localized titles
must match names; no profile claim is inferred from a legacy record. Empty optional arrays/null
mean omission. Portrait metadata does not establish CMS permission or approve a real asset.

The existing write lock serializes duplicate and relationship checks. Both stable public ID and
roster identity survive updates/retirement. Duplicate roster identity is prohibited across all
states; duplicate current English names trigger reconciliation even with different keys/slugs.
Actual same-name clinicians require an explicit future ambiguity policy. General approval and
publication check current roster/portrait evidence alongside matching medical review. The
existing persisted-identity and revision checks prevent forged roles and stale approvals.

`clinician-view.ts` provides one synthetic-only projection for internal directory/search/sitemap
candidate tests. It verifies the complete record set, current effective/review/expiry dates and
related location lifecycle. The default projection is empty; `publicEligibility` denies doctor
records while CARE decisions remain open. Paths are derived from stable ID's canonical locale
entry, with no mounted doctor or Amharic route. Missing languages have no fallback URL.

The workflow accepts an explicit successor ID only on withdrawal. Set validation requires a
current same-kind successor; clinician writes additionally require approved status. Internal
resolution redirects only to an effective projected successor, otherwise returns gone. No HTTP
status, redirect, cache, sitemap or search provider is implemented here. Cross-record relationship
withdrawal must obey existing set integrity; atomic bidirectional changes belong to `B02-006`.

The inert server-rendered specimen escapes all text, labels synthetic and unreviewed shaping
content, omits absent optional values and uses no image, script, action or fetch. Keyboard,
loading/offline and motion behavior are inapplicable to this text-only specimen; existing shared
component browser checks remain required. Portrait intake/rights verification belongs to `B02-011`;
schedules remain withheld until `CARE-03`, and appointments until their separate approved flow.
