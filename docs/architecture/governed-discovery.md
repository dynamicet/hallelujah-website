# Controlled Governed Discovery

B02-010 supplies one validated, synthetic-only projection to internal search candidates,
Next.js metadata objects, WebPage structured data and XML sitemap candidates. The native
Response adapter is exercised over loopback HTTP and is not mounted as an application route.
Fixture responses always deny indexing and caching. Robots denies all crawling and has no
sitemap advertisement. The origin contract accepts only loopback addresses without credentials,
paths, query strings or fragments. Standard schema/XML namespace identifiers cause no requests.

Doctor and service detail URLs use canonical localized slugs. Approved static inventory pages
use English route identity and translated labels. Settings, visitor topics and institutional blocks
remain dependencies/hub content; they acquire no standalone routes. Current versioned utility
statements supply `/privacy/` or `/accessibility/`; historical text stays persisted, with historical
public routing and retention policy still gated. Missing language counterparts return no target.
Alternate links are synthetic candidates, not LANG-01/LANG-02 approval. Appointment candidates
are withheld. Published slugs cannot change or disappear; an actual successor requires a separate
record and an explicit withdrawal decision.

Published state alone is insufficient. The projection checks independent workflow approvals,
matching domain reviews, effective publication, future review and expiry, specialized content
readiness and transitive dependencies. Safety-class records also require post-publication
verification. Authenticated CMS reads serialize with writes, fetch the entire set, and recheck
persisted approval and verification identities before consulting the memory cache. Revoked
records remain in the set with ineligible workflows so every reverse dependency also disappears.
Malformed sets fail closed. No synthetic record becomes production content by clearing its flag.

HTTP responses preserve 404 for unknown/unpublished records, 410 for previously published
retired/elapsed-expiry records, 503 for temporarily unavailable published content, and 308 only
to eligible same-kind successors in the requested language or the canonical trailing-slash URL.
Targets are relative canonical paths without copied query state. HEAD preserves statuses/headers
with no body; unsupported methods receive 405. HTML, XML and JSON-LD are escaped by context.
Structured data contains only title, URL and language; it makes no hospital or medical claim.

The bounded local memory cache stores detached projections, recomputes on document/workflow
changes and expires at the earliest future instant anywhere in the input set. Reads cannot reuse
a snapshot after review, expiry, publication, approval or nested evidence boundaries, or after
clock reversal. Every governed-record write evicts all complete-set projections. Eviction is safe
inside a transaction: it publishes no data; a rollback leaves the next locked read using committed
state. The invalidation plan separately records old/new paths, transitive reverse dependencies,
discovery surfaces and shared emergency/contact consumers for eventual production wiring.

No Next.js production cache or public route is activated. When production wiring is authorized,
immediate tag expiration must use `revalidateTag(tag, { expire: 0 })` with affected paths, rather
than serving stale safety data. The installed Next.js route-handler, metadata and cache guides
were read for this boundary. Production invalidation delivery/retries and CDN configuration still
require their own implementation and acceptance.

See the [execution brief](../backlog/b02-010-governed-discovery.md).
