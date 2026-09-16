# Governed Service Records

B02-005 extends the existing authenticated governed-record collection, with no new route,
collection, migration or package. Its [execution brief](../backlog/b02-005-governed-service-records.md)
defines the synthetic-only boundary.

`service.ts` validates stable service/group/claim identities, launch disposition, bilingual
names/synonyms and explicit omitted sections. Scope is mandatory. All patient-facing scope, needs,
tests/treatments, preparation/referral, urgent exceptions, hours and next-step wording goes through
claim evidence. Withheld claims have a reason and no approval; reviewable claims have source,
eligibility, limitations, scope, availability, owner, typed location references and expiry.

The clinical workflow stamps claim reviewer/time from the authenticated persisted actor. An author
cannot supply approval. Requesting changes clears claim reviews as well as record approval.
Clinical approval requires current evidence and inclusion in the controlled subset. Existing locked
record-set/revision checks enforce immutable identities and detect duplicate/overlapping names,
synonyms, group labels and copied cross-service claims. Claims must match the record's independent
clinical approver; existing role revalidation blocks revoked clinical identities.

`service-view.ts` derives one synthetic-only canonical projection and grouped vocabulary for internal
selector/search/directory/sitemap candidate tests. Optional unavailable sections and languages omit.
Locations must be effective published synthetic location records for consumption. Draft, future,
expired, withdrawn, duplicate or authentic records have no projected candidates. Public service
eligibility remains care-gated even when a caller removes the synthetic flag.

Retirement preserves audit/identity. Successors must be approved same-kind records; internal
resolution redirects only to an effective projected successor, otherwise returns gone. Public HTTP
semantics/cache/search integration remains B02-010 and bidirectional mutation remains B02-006.

The inert semantic specimen escapes text and labels synthetic/unreviewed shaping content. It has
no interaction, network, media or motion behavior; the existing component browser matrix checks
shared interactive behavior. Authentic clinical and operational facts require CARE-04/CARE-05.

Copy and vocabulary checks normalize Unicode NFKC, case and whitespace, then compare exact text.
They expose exact-copy/overlap conflicts for reconciliation; they do not certify semantic
equivalence, clinical correctness, spelling or translation quality. No benchmark application
changes in this schema/workflow pull: the existing approved governed-card presentation remains
the reference, and the new specimen is inert semantic text.
