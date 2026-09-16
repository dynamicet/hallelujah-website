# Controlled CMS Workflow

`B02-002` extends the `B02-001` structural write boundary with local synthetic identity and
workflow authorization. It exposes no administration, REST, GraphQL or HTTP preview route.
[Execution scope](../backlog/b02-002-controlled-cms-workflow.md) records the client-directed
sequencing exception; authentic identities, hospital procedures and publication remain gated.

## Authority and actions

| Role | Permitted action |
| --- | --- |
| Author | Create unsigned synthetic draft; edit and submit own draft; preview own records |
| Reviewer | Independently request changes and give general approval after all domain reviews |
| Medical / clinical / operations / human-resources / content | Review matching doctor / service / location / vacancy / page domain |
| Privacy / brand | Additional review for explicitly privacy / brand classified records |
| Operations | Additional emergency/contact review and independent post-publication verification |
| Publisher | Schedule/publish approved records, advance due scheduled/expired records, withdraw with a reason |
| Identity manager | Change/deactivate other synthetic users; cannot change own authority or approve content through this role |

Combining roles never permits an author to approve own work. Contact/emergency fixtures require
an operations reviewer distinct from both the author and general approver. Class assignment is
explicit and immutable: future type-specific safety schemas must assign their proper safety class;
this controlled fixture classifier is not a clinical content-classification system.

Synthetic users are initially provisioned by a trusted local seed using Payload's Local API,
with reserved `fixture-…@cms.invalid` emails and generated temporary passwords. Public user creation
is denied. Every content request reloads active roles from PostgreSQL. Request/JWT role claims
are not authority. Identity writes cannot self-grant roles and share the same transaction lock as
content approvals. Login expires in 30 minutes and has bounded failed attempts; email/reset
delivery explicitly throws. Production identity lifecycle/session policy remains a named-owner gate.

## Write and review integrity

`governed-records` stores an indexed immutable author ID, immutable explicit content class, the
validated shared record, and server-generated workflow metadata. The virtual `command` carries an
action and `expectedRevision`; it is consumed by the hook and never stored as content.

The PostgreSQL write transaction acquires advisory lock `2002002`, reloads current identity and
record state, and checks revision before applying the command. This serializes the complete
controlled set, including uniqueness/relationships and identity role revocation. A concurrent
edit using an earlier revision fails. Transactions are mandatory, including trusted Local API
writes with `overrideAccess: true`; that option cannot bypass these hooks.

Only draft edits accept content changes. Workflow actions preserve all reviewed content and dates;
actors, approvals and audit entries are generated from persisted identity/server time. Returning
approved/scheduled content to review, then draft, clears all prior reviews. Complete type-matched
governance is validated at approval; publication rechecks all approval identities and current roles.
Audit instants use UTC whole seconds and remain monotonic across rapid local writes; revision
is the concurrency authority. A record cannot change stable ID/kind or be deleted.

## Time and preview

Scheduling requires a future UTC instant. Publication rejects early schedules and elapsed review
or expiry dates. `advanceDueCmsRecords` explicitly invokes the same authenticated publisher
boundary for due publication/expiry. No timer, remote job or production scheduler is registered.
Stored expired/withdrawn records retain their reason, ID and audit; shared public eligibility also
fails closed when review or expiry is due. All persisted records remain synthetic and ineligible.

`cmsPreview` is an internal authenticated read with `overrideAccess: false`, not a web endpoint.
It returns `X-Robots-Tag: noindex, nofollow, noarchive` and `Cache-Control: private, no-store`.
Any future route must authenticate its caller, forward those directives and receive separate
authorization. Trusted backend code can override read access through the raw Local API; no such
override is used by preview or lifecycle operations. This implementation cannot authorize a
future HTTP authentication/CSRF, network, safety publication or production workflow claim.

## Verification

`pnpm cms-workflow:check` covers role/state/time/preview negatives. The disposable
`pnpm governed-records:db-smoke` authenticates synthetic identities, persists drafts, tests
concurrent edits, rechecks role revocation, gives separate safety approvals, verifies and withdraws
records, then advances a real future schedule and expiry. It uses a fresh socket-only PostgreSQL
18 cluster, never a shared or production database. Full repository and hosted exact-head CI are
required independently of this local integration evidence.
