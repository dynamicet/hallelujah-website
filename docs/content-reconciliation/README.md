# Controlled Content Reconciliation

**Boundary:** Private draft evidence, 18 September 2026. No hospital facts, corrections,
canonical IDs, migration, redirects or publication are approved by this register.

[B02-012 execution brief](../backlog/b02-012-content-reconciliation.md) defines the authorized
scope. The source bundle was extracted on 10 September 2026; live source requests are unnecessary.

## Review artifacts

| Artifact | Purpose |
| --- | --- |
| [Source manifest](source-manifest.json) | Original workspace locations, byte counts and SHA-256 hashes for all six JSON files and three source guides |
| [Dispositions](dispositions.json) | One source-bound proposal per unit, reason, role, unresolved gates, linked issues and optional duplicate-source merge target |
| [Report](report.json) | Deterministic totals, coverage, inventory checks and explicit unavailable raw-page coverage |
| [Review queue](review-queue.md) | Human-readable open decisions grouped by responsible hospital role |
| `sources/` | Byte-identical unverified source JSON and inert `.txt` copies of source documentation; no executable scripts or media bytes |

## Coverage and counts

The **259** source units are 32 clinicians, one duplicate-profile alias, 39 services,
nine supporting pages, 85 media usage references and 93 hospital-profile units.
An array item is one record for clinicians/services/pages/media. Each profile array item,
nested object field and scalar has its own disposition; a nested non-array object such as
coordinates stays one unit. Full nested source content is retained in its parent evidence.
The additional alias is a URL occurrence already preserved by the extractor, not another clinician.
Metadata and guides are inventoried as provenance files rather than additional hospital records.

The draft proposes **38 correct**, **one merge**, **one omit** and **219 defer** dispositions.
There are no approved or rejected records. There are **20 open review issues**. All named
hospital owners and canonical IDs are null. The client workspace identity owns preparation
and controlled technical review; the review roles are assignment requests, not fictitious sign-offs.

The 17 current-directory and 15 profile-only clinician counts match extraction metadata.
The 39 services include embedded Pediatrics. Dermatology is mentioned in the review queue
but absent from the extracted service records and is recorded as a gap.

The metadata's **99 source pages** describe the original WordPress response, which is absent.
Available-bundle reconciliation cannot establish raw-page completeness or reproduce every
extraction/deduplication decision. Obtain the original response and lineage before claiming that.
No raw-page deficit is computed by subtracting overlapping transformed inventories.

## Disposition rules

`correct` asks an owner to resolve evidence defects; it does not contain replacement clinical,
schedule, contact or institutional wording. `merge` proposes that Abiy Worku's extracted alias
be reconciled into its source parent after identity verification. Its target is a source key,
not an approved canonical ID or redirect. `omit` proposes excluding the legacy appointment
endpoint from application configuration. It remains preserved as source evidence.
`defer` retains content pending the stated decisions, including all media references and
profile-only clinicians. `approve` is forbidden in this controlled draft. `reject` is available
for an evidenced source rejection but is not used merely because approval is missing.

Source keys are file paths plus JSON pointers into this frozen snapshot. They are review
identities, never opaque public IDs. Every proposal binds to the JSON representation's SHA-256
fingerprint. Any changed extraction, ordering, source bytes or disposition must be explicitly
reviewed and rechecked. The manifest authenticates consistency with this captured bundle;
it does not prove source truth, original extraction completeness or malware clearance.

## Running and updating

```bash
pnpm content-reconciliation:check
```

This reads only repository evidence, verifies source byte/record fingerprints, requires complete
coverage and bidirectional issue links, tests failure cases and checks the report for drift.
It performs no CMS/database writes, network requests, downloads or fact publication.
It also runs inside `pnpm verify`, so hosted review does not depend on sibling workspace resources.

Review proposed changes in `dispositions.json` against the captured evidence, record owners'
decisions separately, and regenerate the summary and readable review queue only after inspecting changes:

```bash
node scripts/check-content-reconciliation.mjs --write-report
pnpm content-reconciliation:check
```

If the source inventory changes, preserve the earlier evidence and deliberately revise the
manifest, source units, issue links, guide/queue and tests together. The current controlled
validator intentionally rejects hospital approval; authentic approval requires an explicitly
authorized follow-up contract with named domain owners and dated evidence. B02-013 tooling
and authentic migration remain governed by their dependencies and approval gates.
