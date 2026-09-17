# Governed Patient & Visitor Topics

B02-007 extends the existing authenticated governed-record collection with a visitor-topic kind.
Its [execution brief](../backlog/b02-007-governed-visitor-topics.md) permits synthetic local records
and internal specimens only. ACCESS-01 remains unresolved.

A record identifies an explicit purpose and before/during/after phase. An integer task order
controls sequence within each phase, with stable public IDs breaking ties. Opaque topic identity
and purpose cannot change; one current record per purpose prevents competing guidance.
Include/unavailable/defer/omit decisions have reasons; non-included decisions have null bodies.
The synthetic inventory explicitly records all unavailable purposes without inventing guidance.

Source, owner, review/expiry instants, localized canonical title and append-only audit use the
shared record contract. Titles/locales must agree with topic details. Included topics require useful
text, and the CMS lifecycle requires independent operations, privacy and legal reviews plus a
general approver. Legal is a separate synthetic CMS role; production role/signature approval is
still GOV-01/ACCESS-01 work. Authors cannot supply stamps. Edits return through draft and clear
all reviews. Existing PostgreSQL advisory locking, fresh revisions and complete-set validation
enforce duplicate, concurrency, retirement and rollback behavior.

The internal hub accepts complete synthetic workflow documents. It exposes only published,
effective, reviewed, unexpired included topics with matching independent review evidence.
Unavailable/deferred/omitted/draft/untranslated/retired topics produce no content candidate,
link or empty phase. Temporary guidance disappears at review/expiry boundaries on read; there
is no production scheduler. The existing explicit local lifecycle invocation can retire due records.
The default returns a safe unavailable state. Public eligibility denies visitor topics even if
their synthetic flag is removed.

The authenticated Payload Local API helper locks reads against authoring/identity changes,
requires a live review identity and revalidates operations/privacy/legal/general approval actors.
Revoked approvals remove the affected topic. No HTTP route, public search/sitemap integration
or provider is introduced. Candidate text is escaped by React in an inert semantic specimen
with English and explicitly unreviewed Amharic shaping fixtures. Missing language guidance omits.

Staffed fallback remains explicitly withheld: a topic cannot supply a copied contact number,
action or provider. Authentic staffed contact actions require canonical safety/contact approval.
The withheld statement describes an approval boundary and supplies no hospital advice.

Verification combines pure negative/workflow/order/lifecycle/render checks with fresh disposable
PostgreSQL persistence, concurrent-write denial, failed approval/publication rollback, live review
and approver revocation, complete unavailable inventory and actual elapsed temporary expiry.
The shared browser matrix verifies existing component interactions. No new visual direction,
media, motion, interaction or benchmark application is introduced by this schema pull.
