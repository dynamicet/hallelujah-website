# B00-002 — WordPress SEO-Spam Incident Closeout

**Backlog / decision / requirement:** `B00-002` / `SEC-01` / `S-001`  
**Lane / priority / milestone:** `DECISION` / `P0` / `M0`  
**Execution state:** `Deferred` by client direction on 13 September 2026; return before production migration, provisioning, DNS cutover, SEO recovery acceptance, or release  
**Systems in scope:** Existing public WordPress site at `hallelujahhospital.com`; search-engine properties; hosting, DNS, identity, and related control planes  
**Clean-rebuild boundary:** This documentation workspace and the planned Payload/Next.js application are not the compromised WordPress installation

## Outcome

Close the known WordPress SEO-spam incident with evidence that the publishing path is contained, the persistence mechanism and unauthorized access are removed, relevant credentials and sessions are invalidated, the site and search index are recovering, and monitoring can detect recurrence. Separately designate the clean source from which the replacement site may be built.

Public disappearance of spam URLs is necessary but is not incident closure. Closure requires authenticated evidence and named approval in restricted storage.

## Provisional trusted-source decision for approval

Use an **isolated clean rebuild** for the replacement site:

- Do not copy the legacy WordPress repository, database, plugins, themes, uploads containing executable files, configuration, users, sessions, scheduled tasks, caches, or generated sitemap data into the Payload/Next.js application.
- Treat the existing public WordPress site only as an untrusted evidence source.
- Admit content into the rebuild only through the controlled structured bundle and verification queue referenced by the project source hierarchy. Each imported record still requires its content, clinical, operational, rights, and publication approvals.
- Obtain media from verified originals with ownership/consent records; do not hotlink or bulk-copy the legacy uploads directory.
- Create new infrastructure, secrets, service identities, databases, deployment keys, and administrative accounts for the rebuild. Do not reuse legacy credentials or salts.

This decision becomes authoritative only when the named Security owner and Executive acceptance owner sign it in the restricted incident record.

## Sanitized public-surface baseline

The detailed incident record, logs, account lists, file paths, indicators, and vulnerability findings must stay in the restricted evidence location selected under `B00-015`. The following observations are safe to retain in this implementation package.

| Observation | 7 September 2026 audit | 12 September 2026 public recheck | Interpretation |
| --- | --- | --- | --- |
| Yoast sitemap shape | Eight post sitemaps exposed 7,310 post URLs | One page sitemap is exposed | Material public cleanup is visible |
| Gambling-term URL count | 5,810 post URLs matched the audit terms | 0 of 99 current sitemap URLs matched the same category of terms | Injected URLs are no longer advertised in the current sitemap |
| Public WordPress posts | Sampled spam post returned HTTP 200 | Public posts endpoint reports 0 published posts | The former public post corpus is no longer exposed through that endpoint |
| Public pages | Not used as incident-closure evidence | Public pages endpoint and page sitemap each report 99 pages | Counts agree at the checked surface; content approval remains separate |
| Response hardening | Common browser-security headers were absent | The homepage recheck still lacks the recorded hardening headers | Hardening remains open; absence does not identify the entry point |

The recheck was read-only and performed at approximately 23:20 EAT on 12 September 2026. It covered public HTTP responses only. It did not access the host, CMS administration, database, logs, backups, registrar, DNS, Search Console, analytics, mail, or the appointment API.

## Restricted incident record checklist

The Security owner must maintain timestamps in UTC and EAT, preserve original time zones from source logs, and record who performed and approved each action.

### 1. Preserve before changing

- [ ] Capture immutable or access-controlled snapshots of the affected filesystem, database, web-server configuration, scheduled tasks, relevant logs, user/account inventory, sitemap state, and Search Console security/manual-action state.
- [ ] Record discovery time, earliest supported compromise time, reporter, symptoms, affected systems, known spam URL patterns, and every action already taken.
- [ ] Hash preserved exports and record custody. Do not store the exports, hashes tied to sensitive filenames, credentials, or detailed indicators in this repository.
- [ ] Confirm backup dates, retention, and whether a demonstrably pre-compromise recovery point exists.

### 2. Contain

- [ ] If malicious pages, redirects, downloads, or unsafe forms remain active, place the affected function or site into a safe maintenance/unavailable state approved by Operations and Security.
- [ ] Restrict administrative access, revoke active CMS and hosting sessions, and stop unauthorized publishing without destroying evidence.
- [ ] Ask the hosting provider to preserve platform, access, authentication, and change logs and to identify cross-account or infrastructure indicators.
- [ ] Check whether the appointment API, mail, DNS, analytics/tag-management, and Search Console properties share credentials or trust with WordPress; isolate them if they do.

### 3. Determine scope and entry path

- [ ] Reconcile WordPress administrator/editor/service accounts against authorized people, creation dates, last activity, MFA, application passwords, and session tokens.
- [ ] Compare core files with the matching official WordPress release and compare every plugin/theme with a verified publisher package; inspect must-use plugins and drop-ins separately.
- [ ] Review executable or obfuscated content in uploads, web root, configuration, server startup/scheduled jobs, rewrite rules, caches, database posts/options/users, and any adjacent hosted sites.
- [ ] Correlate web, authentication, SFTP/SSH, control-panel, database, WAF/CDN, and change logs to establish the likely initial access, persistence, and affected time range.
- [ ] Review unexpected Search Console owners/tokens, DNS changes, analytics/tag-manager changes, outbound mail, redirects, and external script inclusions.
- [ ] Record confirmed findings and uncertainty; do not infer the entry point from public plugin fingerprints alone.

### 4. Eradicate and recover

- [ ] Prefer rebuilding the legacy WordPress runtime from verified official core and publisher packages in an isolated environment over cleaning unknown files in place.
- [ ] Restore only reviewed content and media; remove unauthorized database records, accounts, scheduled tasks, verification tokens, rewrite rules, executable uploads, and persistence identified by the investigation.
- [ ] Patch WordPress, the runtime, server packages, plugins, and themes to supported versions; permanently remove unused components.
- [ ] Reset least-privilege ownership and file permissions, disable dashboard file editing, protect configuration and logs, and ensure production error display is off.
- [ ] Validate the isolated recovery copy before cutover, retain a rollback path, and do not restore from a backup merely because its date precedes discovery.

### 5. Rotate identities and secrets

- [ ] Rotate, from known-clean administrator devices, credentials for hosting/control panel, registrar/DNS, CDN/WAF, WordPress administrators, database, SFTP/SSH, deployment, mail, APIs, Search Console, analytics/tag management, and backup storage as applicable.
- [ ] Replace WordPress authentication keys/salts and revoke sessions, application passwords, API tokens, SSH keys, recovery codes, and unrecognized OAuth grants.
- [ ] Enable MFA where supported, remove shared/dormant accounts, prohibit credential reuse, and record break-glass ownership and expiry.
- [ ] Verify that no legacy secret is reused by the clean rebuild.

### 6. Repair search surfaces

- [ ] Confirm every injected URL is removed and returns a truthful `404` or `410`; do not redirect spam URLs to Home and do not rely on `robots.txt` to hide them.
- [ ] Confirm internal links, canonicals, feeds, search, caches, and generated sitemaps cannot recreate or advertise unauthorized records.
- [ ] Publish and submit only the clean canonical sitemap; validate its modification dates, hostnames, status codes, and record eligibility.
- [ ] Review Search Console Security Issues, Manual Actions, ownership, indexed pages, crawl anomalies, and submitted sitemaps.
- [ ] Use temporary Search Console removals only where urgent; permanent removal still depends on the correct site response. Request review/reconsideration when the applicable Google workflow requires it.

### 7. Verify hardening and monitoring

- [ ] Run authenticated malware/file/database/account checks and an independent security review after recovery; store the reports in restricted evidence.
- [ ] Test public pages with ordinary browser, search-crawler, mobile, referrer, and logged-out conditions to detect conditional cloaking or redirects.
- [ ] Add alerts for unexpected publishing spikes, new privileged accounts, file/configuration changes, suspicious scheduled tasks, sitemap growth, anomalous outbound traffic, and reappearance of known spam patterns.
- [ ] Confirm backups and restore are tested, protected from the production account, and retained according to the approved policy.
- [ ] Have the Security owner define and complete a risk-based observation window with no recurrence before closure.

## Acceptance and evidence

`B00-002` may move to `Done` only when the restricted record contains:

1. containment timeline and preserved-evidence references;
2. investigation scope, supported root-cause or explicitly bounded uncertainty, and affected-system list;
3. removal/recovery record covering files, database content, accounts, persistence, and adjacent services;
4. credential/session rotation matrix with completion evidence but no secret values;
5. patch, hardening, backup/restore, and monitoring validation;
6. sitemap, status-code, Search Console, and index-recovery evidence;
7. signed selection of either the cleaned legacy source or the isolated clean-build source, including migration exclusions;
8. Security owner closure and Executive acceptance with names, dates, evidence identifiers, and any residual-risk expiry.

The sanitized pointer belongs under `docs/backlog/evidence/`. The underlying artifact must remain outside this repository in the access-controlled location selected under `B00-015`.

## References

- [Original public audit](../../../audit/report-source.md)
- [Content verification queue](../../../resources/content-review.md#priority-0--source-integrity)
- [Requirement `S-001`](../requirements/requirements-matrix.md#safety-security-privacy-and-language)
- [Decision `SEC-01`](../validation/stakeholder-low-fidelity-validation.md#security-delivery-accessibility-and-qa)
- [WordPress: FAQ My site was hacked](https://wordpress.org/documentation/article/faq-my-site-was-hacked/)
- [WordPress hardening guidance](https://developer.wordpress.org/advanced-administration/security/hardening/)
- [Google Search spam policies: hacked content](https://developers.google.com/search/docs/essentials/spam-policies#hacked-content)
- [Google Search Console removals guidance](https://support.google.com/webmasters/answer/9689846)
