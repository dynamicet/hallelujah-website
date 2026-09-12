# B00-007 — Infrastructure Selection

**Backlog:** `B00-007`  
**Lane / priority / milestone:** `DECISION` / `P0` / `M0`  
**Execution state:** `Deferred` by client direction on 13 September 2026; return before production readiness, while current information is sufficient only for local, provider-neutral implementation  
**Activation boundary:** Non-public prototyping only; no production provisioning, personal-data collection, third-party activation, DNS cutover, or release is authorized

## Outcome

Establish the minimum infrastructure direction needed to prototype the clean Payload/Next.js rebuild without prematurely committing to capacity, providers, data locations, recovery targets, or paid services that require evidence from a working application.

## Working selections

| Area | Working selection | Status and boundary |
| --- | --- | --- |
| VPS model | VPS from a local or Ethiopia-region provider where feasible | **Preferred candidate.** Provider, legal entity, facility/region, support, SLA, pricing, security, and data-location evidence remain open. |
| Operating system | Linux server | **Selected at family level.** Distribution, supported release, hardening profile, and patch lifecycle are selected and pinned under `B00-005` after provider compatibility is known. |
| Edge, DNS, and TLS | Cloudflare for authoritative DNS and the planned reverse-proxy/TLS edge | **Selected for planning; activation gated by `B00-014` / `SEC-02`.** Origin TLS must use certificate validation; Flexible mode is excluded. DNS ownership, least-privilege access, DNSSEC, cache rules, origin restriction, rollback, and cost tier remain acceptance items. |
| Prototype media | Payload local upload storage on persistent prototype disk; PostgreSQL stores media records and metadata, not media binaries | **Selected for the prototype.** Media remains controlled/non-public and disposable; it is not a production durability decision. |
| Production media | MinIO is the preferred self-hosted S3-compatible candidate only if object-storage requirements are demonstrated | **Deferred decision.** Compare MinIO with persistent filesystem and an approved managed S3-compatible provider using operations, backup, data-location, availability, and cost evidence. |
| PostgreSQL media extension | None | **Selected.** PostgreSQL large objects exist as a database facility, but no extension is needed for Payload media. Avoid coupling public media binaries to the relational database and its restore path without a demonstrated requirement. |
| Staging placement | Local prototype first; remote staging placement undecided | **Deferred.** Staging must remain isolated from production secrets and personal data when provisioned. |
| Capacity | Measure the prototype before sizing | **Deferred.** Record CPU, memory, disk, image-processing, database, build, and constrained-network measurements before choosing the VPS size. |
| Email delivery | No provider and no outbound email during prototype | **Deferred and disabled.** Selection requires purpose, data-flow, failure, privacy/security, cost, and `SEC-02` approval. |
| Backup destination | Not yet selected; production backup must be encrypted and off-host | **Deferred.** A MinIO instance on the application VPS is not an off-host backup. |
| Recovery targets | RPO/RTO not yet selected | **Deferred.** Set from hospital operational tolerance before production data or publication. |

## Prototype architecture boundary

For the first non-public prototype:

- run the application and PostgreSQL locally or in an explicitly disposable development environment;
- keep the public-content and appointment schemas logically separate as required by `ARCH-02`, but collect no real appointment or personal data;
- use controlled fixture media only, labeled non-public, on persistent local development storage;
- keep Cloudflare, MinIO, email, analytics, maps, monitoring providers, and other external integrations disabled;
- capture measurements that inform capacity and media-storage decisions;
- do not present the prototype environment as staging, production, or a trusted publication source.

## Why media is not stored in PostgreSQL

Payload directly supports local uploads and storage adapters, including S3-compatible storage. PostgreSQL also has a large-object facility, but selecting it would introduce a separate application integration and couple binary-media growth, backup, restore, replication, and permissions to the relational database. No prototype requirement currently justifies that coupling.

The production comparison must consider:

1. expected original and derived-image volume;
2. backup size and restore time;
3. whether more than one application instance must read the same files;
4. CDN/cache integration and invalidation;
5. object versioning, immutability, lifecycle, and off-host recovery;
6. operational burden and failure behavior of self-hosted MinIO;
7. provider data location, subprocessors, access, cost, and exit path.

## Remaining decisions before `B00-007` can close

- [ ] Select the exact VPS provider, contracting entity, physical region/data location, support route, SLA, price, payment owner, and exit/migration process.
- [ ] Record provider security and privacy review, including administrative access, incident notification, deletion, and subprocessors.
- [ ] Select the Linux distribution/release and confirm provider support, automated security updates, maintenance ownership, and end-of-life policy.
- [ ] Decide whether staging shares the production VPS, uses a separate VPS, or remains local until release-candidate work; document isolation and cost.
- [ ] Size CPU, memory, disk/IOPS, bandwidth, and growth headroom from prototype measurements and image-processing/build peaks.
- [ ] Complete the Cloudflare provider register entry and define account ownership, MFA, recovery, least-privilege tokens, DNSSEC, origin certificate, strict TLS, origin access restriction, caching exclusions, logs, rollback, and cost tier.
- [ ] Decide production media storage from the recorded comparison; define backup, restore, migration, cache invalidation, and provider-failure behavior.
- [ ] Select email delivery only after the message purposes and personal-data flow are approved; otherwise retain a no-email launch behavior.
- [ ] Select encrypted off-host backup storage and prove restore independently for configuration, content, media, and appointment data as applicable.
- [ ] Approve RPO/RTO, retention, capacity alerts, and the responsible recovery roles.

## Acceptance evidence

The final decision record must identify for every selected service:

- accountable decision and operational owners;
- provider/legal entity and exact data location;
- purpose, data categories, access, retention, and subprocessors;
- monthly and growth cost assumptions;
- capacity and failure assumptions;
- backup, restore, rollback, and exit/migration path;
- security/privacy review and `B00-014` register link where third-party processing applies;
- dated prototype measurements and test results;
- approval date, review date, and durable restricted/non-sensitive evidence locations.

## References

- [Epic 0 architecture baseline](../architecture/epic-0-technical-foundation.md)
- [Payload production deployment and upload storage](https://payloadcms.com/docs/production/deployment)
- [Payload storage adapters](https://payloadcms.com/docs/upload/storage-adapters)
- [PostgreSQL large objects](https://www.postgresql.org/docs/current/largeobjects.html)
- [MinIO S3 compatibility](https://min.io/product/s3-compatibility)
- [Cloudflare Full (strict) TLS](https://developers.cloudflare.com/ssl/origin-configuration/ssl-modes/full-strict/)
- [Cloudflare DNS setup models](https://developers.cloudflare.com/dns/zone-setups/)
