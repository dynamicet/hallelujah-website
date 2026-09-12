# Utility Page UX Specifications

**Version:** 0.1 implementation-planning baseline  
**Status:** Working specification; privacy, legal, support, and conformance claims require named approval  
**Related:** [Requirements matrix](../requirements/requirements-matrix.md) · [Sitemap](sitemap.md) · [Core page specifications](page-specifications.md) · [Utility wireframes](../wireframes/utility-pages.md)

## Scope decision

The following utility behavior is part of the Phase 1 product contract:

| Route or behavior | Phase 1 disposition | Publication gate |
| --- | --- | --- |
| `/privacy/` | Required | Approved privacy notice, contact route, processing inventory, and review owner (`S-004`, `S-005`) |
| `/accessibility/` | Required | Approved support/reporting route and an evidence-bounded conformance statement (`G-003`–`G-010`) |
| Genuine 404/unavailable response | Required system behavior | Implemented route handling, recovery links, language behavior, and crawl validation (`G-011`, `G-013`, `S-008`) |
| Cookie information | Conditional; do not create an empty route | Include in `/privacy/` unless approved cookie use and legal advice require a distinct maintained page |
| Terms / legal notice | Conditional; outside the initial Phase 1 backlog unless legal review requires it | Named legal owner, applicable wording, review date, and route decision |

Referring Clinicians, Health Information / News, Careers, a Patient Portal, and any dedicated Terms or Cookie route are excluded from the initial Phase 1 implementation backlog. They require a later approved scope change and their feature-specific governance gates. Careers remains Phase 2 under `HR-01`–`HR-03`.

## Shared utility contract

Every utility page or state must:

- use the shared skip link, semantic header/navigation/main/footer, language availability, focus, reflow, and no-JavaScript contracts;
- expose Emergency and core task routes without presenting routine policy content as urgent;
- use an accurate page title, one `h1`, meaningful headings, and a canonical URL where the response is indexable;
- identify the accountable owner and last-reviewed date for governed policy/support content;
- use approved contact records rather than duplicating telephone numbers or email addresses;
- remain readable without custom fonts, images, JavaScript, analytics, maps, or other third parties;
- never claim legal compliance, accessibility conformance, privacy behavior, support availability, or response timing beyond current evidence; and
- provide a truthful recovery route when content, translation, a contact method, or an optional dependency is unavailable.

<a id="privacy-notice"></a>

## 1. Privacy Notice — `/privacy/`

### Goal

Help visitors understand what the public website collects, why it is collected, how it is handled, which choices or rights apply, and how to contact the accountable hospital owner.

### Required content order

1. `PV0` — Shared shell and breadcrumb where required by the approved navigation model
2. `PV1` — Page identity, effective date, last-reviewed date, and accountable privacy owner
3. `PV2` — Plain-language processing summary organized by visitor task or data flow
4. `PV3` — Purpose, lawful basis where applicable, data categories, recipients, access, transport, retention/deletion, and user choices or rights
5. `PV4` — Cookies, logs, analytics, maps, forms, recruitment providers, fonts, media, and other third parties, including an explicit statement when a category is not used
6. `PV5` — Approved privacy contact/rights route, complaint or escalation information where applicable, related policies, and footer

### Required states

- Approved current notice
- Approved notice with no optional third parties enabled
- Material processing change awaiting approval, with the affected collection disabled
- Contact route unavailable, with collection disabled where that route is required
- Translation unavailable, without implying parity
- Print view and no-JavaScript operation

### Rules and acceptance

- Derive the notice from an approved processing/data-flow inventory; do not copy another organization’s policy or infer legal obligations.
- Form-specific disclosures remain beside the relevant form even when the full notice is linked.
- State actual behavior. Do not describe analytics, cookies, providers, retention, or rights that the implementation does not support.
- If required privacy information, consent behavior, recipient, retention rule, or contact route is unresolved, the affected collection remains disabled under `APPT-03`, `HR-02`, `SEARCH-02`, or `SEC-02`.
- Links to settings or rights requests must lead to an approved working route; a disabled or fictional control is not acceptable.
- Acceptance covers keyboard and screen-reader navigation, 320/360/reflow, print, language metadata, no-JavaScript access, link integrity, and a comparison between the published notice and the production data/third-party inventory.

<a id="accessibility-statement"></a>

## 2. Accessibility Statement — `/accessibility/`

### Goal

Explain how visitors can use the site, request communication or access support, and report a digital accessibility barrier without overstating tested conformance.

### Required content order

1. `AX0` — Shared shell and breadcrumb where required by the approved navigation model
2. `AX1` — Page identity, scope of the statement, last-reviewed date, and accountable accessibility owner
3. `AX2` — Supported access features and essential-task alternatives stated in plain language
4. `AX3` — Known limitations and unavailable content, with workarounds only when verified
5. `AX4` — Approved barrier-reporting and access-support route, information to include, expected handling only when operationally approved, and emergency boundary
6. `AX5` — Testing basis, evidence-bounded conformance wording, escalation information where applicable, and footer

### Required states

- Current evidence-bounded statement
- Known limitation with verified workaround
- Support channel temporarily unavailable
- Translation unavailable, with translated essential alternatives where approved
- Print view and no-JavaScript operation

### Rules and acceptance

- Describe performed testing and current limitations accurately; automated checks or prototype QA alone must not be presented as full conformance certification.
- Do not promise an accessibility standard, legal status, response time, accommodation, or support channel until its owner and evidence are recorded.
- The barrier-reporting route must not require a user to disclose health information unnecessarily. Its collection, recipient, retention, security, and fallback require privacy review when personal data is accepted.
- Keep emergency help visibly separate from routine accessibility support.
- Acceptance includes keyboard, screen-reader, zoom/reflow, forced-colors, language, no-JavaScript, link/contact, and human support-route testing in the `DEL-01` environment.

<a id="not-found-unavailable"></a>

## 3. Not Found and Unavailable Content

### Goal

Recover visitors from an unknown, retired, expired, unpublished, or untranslated destination without masking the response status or sending them to an unrelated page.

### Response contract

| Condition | Required response |
| --- | --- |
| Unknown route or record | Genuine `404` with useful recovery links |
| Intentionally and permanently removed resource with no successor | `410` when approved by the content/SEO owner |
| Current approved successor | Server redirect to that specific successor only |
| Temporarily unavailable dependency or route | Appropriate non-success response and retry/fallback; never render a false success page |
| Unpublished or expired governed record | Remove from navigation, search, and sitemap; return the approved unavailable/404/410 behavior without leaking prior content |
| Missing language equivalent | Keep context, explain the gap, and offer approved nearby translated routes; do not silently redirect Home |

### Required content order

1. `NF0` — Minimal shared shell with skip link and essential task navigation
2. `NF1` — Clear status heading and concise non-blaming explanation
3. `NF2` — Context-safe recovery: Home, Doctors, Services, Appointments, Patient Information, Contact, and Search when available
4. `NF3` — Verified urgent and staffed support routes, visually separated from ordinary recovery
5. `NF4` — Optional search, language-unavailable explanation, and footer; failed search must not block the other routes

### Required states

- Generic 404
- Approved 410
- Retired doctor/service/content record with and without a genuine successor
- Temporarily unavailable route or dependency
- Missing language equivalent
- Search unavailable and no-JavaScript operation

### Rules and acceptance

- Preserve the correct HTTP status through the server, CDN, cache, and rendered page. Do not serve a soft 404 with status `200`.
- Never expose unpublished titles, snippets, identifiers, personal data, internal paths, stack traces, or provider details.
- Redirect only to a genuine approved successor. Do not redirect every retired record to a directory or Home.
- Recovery remains complete without JavaScript or search and must not depend on an optional third party.
- Acceptance includes direct/deep links, retired canonical records, language switching, keyboard/screen-reader behavior, 320/360/reflow, no-JavaScript, crawl/sitemap checks, caching, and safe server error output.

## Utility definition of ready

A utility implementation ticket is ready only when its route/disposition is approved, its accountable product/content/legal/privacy/delivery owners are named as applicable, linked requirement and decision IDs are present, all states above are included or explicitly inapplicable, and the evidence destination is known. Privacy collection and accessibility-support forms additionally require approved data-flow and security handling before implementation.
