# Canonical Site Settings and Contact Boundary

The [B02-003 execution brief](../backlog/b02-003-canonical-site-settings.md) adds one operations-governed
`site-settings` record to the existing authenticated Payload Local API collection. No application
route is added. Current-record uniqueness is checked inside the existing PostgreSQL write lock;
stable public IDs and immutable audit/workflow metadata retain the B02-001/B02-002 boundaries.

`site-settings.ts` validates separately labeled identity, four phone purposes, email, address,
staffed hours, three entrance/direction purposes and staffed fallback. Each fact retains its own
source, owner, explicit withheld/unverified/conflict/verified state, verifier and UTC lifecycle dates.
Unknown facts are rejected. No phone purpose, entrance or approval is inferred from another fact.
Unapproved extracted contact values are never seeded. Verification labels are evidence metadata,
not persisted CMS roles or authentication claims.

The existing contact safety workflow requires independent operations review plus a distinct
general approver and publisher, with existing post-publication verification. Fact readiness is
rechecked at approval, scheduling and publication using the actual action time. Structural
scheduled/published records additionally require facts current at their publication instant.
Any edit clears prior approvals through the existing draft-return workflow. Review/expiry,
withdrawal and conflicting/unverified facts cause internal consumption to fail closed.

`canonical-contact-view.ts` provides the shared consumer and a semantic server-rendered text
template. Values and future phone/email targets derive from the same canonical fact. Only an
explicit controlled-fixture mode with a synthetic record can expose internal text specimens;
they show a synthetic warning and no contact links/scripts. English and unreviewed Amharic
shaping labels are supported; missing language labels omit the affected fact. Public-default
consumption exposes no values, and `publicEligibility` explicitly safety-gates the settings kind.
The consumer never accepts precomputed contact values from template callers.

Tests cover schema and workflow negatives, stale verification, per-purpose conflicts, canonical
uniqueness, bilingual server rendering, escaping and visible-value/target consistency. The fresh
disposable database smoke repeats settings persistence and authenticated safety transitions.
The internal template is not mounted into the application or review harness; existing responsive,
keyboard, reduced-motion and no-JavaScript browser verification still repeats in the repository gate.

Authentic operations evidence, named hospital safety owners, SAFE-01/SAFE-03 closure, bilingual
language approval, public templates and publication require later explicit work. This ticket
creates no migration/import, external map/provider, real email/call action or production scheduler.
