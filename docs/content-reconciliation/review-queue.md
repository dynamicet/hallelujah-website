# Hospital Content Review Queue

**Status:** 20 open decisions; named hospital owners unassigned. All dispositions remain proposals.

The [register](dispositions.json) contains complete bidirectional source links; [source manifest](source-manifest.json) identifies the captured evidence. Counts below can overlap because one source unit can need several decisions. This queue supplies role assignments for review, not approval or verified replacement wording.

## schedule_has_duplicate_saturday_and_no_sunday

schedule has duplicate saturday and no sunday.

**Owner role:** Medical Staff owner

**Named owner:** Unassigned

**State:** Open

**Affected source units:** 31

Required decision: Correct each source timetable, confirm Sunday explicitly and define LT before translating any schedule into application logic.

Evidence: `data/doctors.json`, `content-review.txt`.

## uses_generic_doctor_placeholder

uses generic doctor placeholder.

**Owner role:** Medical Staff owner

**Named owner:** Unassigned

**State:** Open

**Affected source units:** 17

Required decision: Obtain consented, authentic clinician portraits and governed accessibility/crop approval; a shared placeholder cannot establish identity.

Evidence: `data/doctors.json`, `content-review.txt`.

## directory_card_has_no_profile_link

directory card has no profile link.

**Owner role:** Medical Staff owner

**Named owner:** Unassigned

**State:** Open

**Affected source units:** 1

Required decision: Confirm this clinician and the intended canonical profile/handoff; absence of a link is not retirement evidence.

Evidence: `data/doctors.json`, `content-review.txt`.

## duplicate_profile_pages_exist

duplicate profile pages exist.

**Owner role:** Medical Staff owner

**Named owner:** Unassigned

**State:** Open

**Affected source units:** 1

Required decision: Confirm the duplicate clinician identity, choose a canonical governed record and approve any redirect independently.

Evidence: `data/doctors.json`, `content-review.txt`.

## profile_not_present_in_current_doctor_directory

profile not present in current doctor directory.

**Owner role:** Medical Staff owner

**Named owner:** Unassigned

**State:** Open

**Affected source units:** 15

Required decision: Confirm each profile-only clinician is current or explicitly choose omission/retirement; no automatic inclusion or inferred successor.

Evidence: `data/doctors.json`, `content-review.txt`.

## copied_incorrect_hepatobiliary_subheading

copied incorrect hepatobiliary subheading.

**Owner role:** Clinical owner

**Named owner:** Unassigned

**State:** Open

**Affected source units:** 3

Required decision: Clinical owner must supply correct page-specific wording; copied Hepatobiliary headings cannot be silently rewritten.

Evidence: `data/services.json`, `content-review.txt`.

## no_standalone_pediatrics_page_found

no standalone pediatrics page found.

**Owner role:** Clinical owner

**Named owner:** Unassigned

**State:** Open

**Affected source units:** 1

Required decision: Approve Pediatrics launch scope and accountable evidence; embedded overview copy does not prove a standalone service or successor URL.

Evidence: `data/services.json`, `content-review.txt`.

## contact-conflicts

Header placeholder, contact list, emergency landline range and phone purpose conflicts.

**Owner role:** Operations owner

**Named owner:** Unassigned

**State:** Open

**Affected source units:** 17

Required decision: Test each purpose-specific number, arrival field and staffed fallback and record approved operations evidence; do not choose the most plausible published value.

Evidence: `content-review.txt`.

## home-mission-conflict

Home repeats vision under mission while About has different mission wording.

**Owner role:** Executive/Content owner

**Named owner:** Unassigned

**State:** Open

**Affected source units:** 4

Required decision: Executive owner must approve the current mission and vision independently; About is a candidate source and cannot override Home without sign-off.

Evidence: `content-review.txt`.

## directory-duplicate-card

Daniel Hailu rendered twice; inventory prose inconsistently describes its unique list.

**Owner role:** Medical Staff owner

**Named owner:** Unassigned

**State:** Open

**Affected source units:** 3

Required decision: Confirm the duplicate rendered card and launch membership; reconcile 18 source cards to 17 unique extracted directory clinicians without creating a second clinician.

Evidence: `content-review.txt`, `content-inventory.txt`, `data/doctors.json`, `data/site-pages.json`.

## ophthalmology-copied-copy

Review queue identifies Speech Therapy copy under Ophthalmology in the service hub.

**Owner role:** Clinical owner

**Named owner:** Unassigned

**State:** Open

**Affected source units:** 3

Required decision: Compare hub copy with standalone Ophthalmology and Speech Therapy, supply clinical corrections and decide taxonomy/overlap without importing copied claims.

Evidence: `content-review.txt`.

## absent-dermatology-source

Review queue flags Dermatology copied heading but no Dermatology record exists in the service bundle.

**Owner role:** Clinical owner

**Named owner:** Unassigned

**State:** Open

**Affected source units:** 1

Required decision: Obtain the missing Dermatology source and approved scope or record explicit omission; do not manufacture a fortieth service from review prose.

Evidence: `content-review.txt`.

## raw-snapshot-unavailable

Metadata reports 99 pages; original raw WordPress response is not available.

**Owner role:** Content Manager

**Named owner:** Unassigned

**State:** Open

**Affected source units:** 1

Required decision: Supply the original snapshot and extraction lineage before claiming raw-page reconciliation; current completeness is limited to available transformed records.

Evidence: `data/metadata.json`, `source-readme.txt`.

## missing-launch-content

Privacy, accessibility, patient rights, visiting/admission/discharge and support guidance have no usable approved source.

**Owner role:** Privacy/Operations owner

**Named owner:** Unassigned

**State:** Open

**Affected source units:** 5

Required decision: Assign hospital owners to supply and review missing launch content; record unavailable or deferred states instead of plausible policy or operational copy.

Evidence: `content-review.txt`.

## lt-convention

Timetable LT meaning has not been defined and schedule text must not become executable hours.

**Owner role:** Medical Staff owner

**Named owner:** Unassigned

**State:** Open

**Affected source units:** 32

Required decision: Define the local-time convention and verify each corrected schedule with medical-staff owner; do not infer Ethiopian clock conversions or Sunday availability.

Evidence: `content-review.txt`.

## claims-and-relationships

Capacity, history, first-specialist, airport proximity, partner and equipment claims require dated evidence.

**Owner role:** Executive/Content owner

**Named owner:** Unassigned

**State:** Open

**Affected source units:** 33

Required decision: Provide claim definitions, as-of dates, active relationship meaning and clinical/executive evidence; names and logos cannot imply insurance coverage or current capability.

Evidence: `content-review.txt`.

## clinical-capability-claims

Every service needs claim-level review; high-consequence procedures are not proved by public copy.

**Owner role:** Clinical owner

**Named owner:** Unassigned

**State:** Open

**Affected source units:** 39

Required decision: Assign clinical owners to approve each launch service and individual claims, including CABG, dialysis, transplant support, surgical oncology, neurosurgery and pediatric emergency scope with current operational evidence.

Evidence: `content-review.txt`.

## media-clearance

All 85 media usage references lack ingested, cleared originals and approved rights/accessibility.

**Owner role:** Brand/Privacy owner

**Named owner:** Unassigned

**State:** Open

**Affected source units:** 85

Required decision: Obtain authentic original bytes, per-use rights/consent, ownership and locale-specific alt/caption decisions; route all ingestion through the governed asset boundary and never hotlink source URLs.

Evidence: `content-review.txt`.

## phase2-careers

Vacancy source is outside Phase 1 and supplies no recruitment operating/privacy contract.

**Owner role:** Content Manager

**Named owner:** Unassigned

**State:** Open

**Affected source units:** 1

Required decision: Retain for Phase 2 reprioritization and approved recruitment content/privacy process; do not create a vacancy route or carry over the legacy vacancy form.

Evidence: `content-review.txt`.

## appointment-contract

Legacy endpoint and request fields lack approved consent, privacy, SLA and booking semantics.

**Owner role:** Privacy/Operations owner

**Named owner:** Unassigned

**State:** Open

**Affected source units:** 11

Required decision: Operations/privacy owners must define request versus confirmed booking, response hours, consent, cancellation, emergency exclusions and approved handoff; legacy endpoint and fields are not reusable intake authority.

Evidence: `content-review.txt`.
