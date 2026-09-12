# Page Handoff Matrix

This matrix is the implementation entry map for the 12 designed page types. The linked product specification and wireframe remain authoritative for purpose, order, content, states, and acceptance. The HTML study is a visual/state reference containing controlled fixtures, not production content or code.

## Page contracts

| Page / proposed route | Stable sections | Product and structure sources | Polished reference | Principal implementation states | Primary decision gates |
| --- | --- | --- | --- | --- | --- |
| Home `/` | `H0`–`H9` | [Page spec](../../ux/page-specifications.md#1-home), [wireframe](../../wireframes/home.md) | [Home study](../pages/critical-journeys/home.html) | Default; optional governed collections omitted; search validation/failure; temporary notice; language unavailable; no JS | `GOV-02`, `SAFE-01`–`SAFE-04`, `CARE-01`, `CARE-04`, `SEARCH-01`–`SEARCH-02`, `LANG-01`, `INST-01`, `BRAND-01` |
| Emergency `/emergency/` | `E0`–`E8` | [Page spec](../../ux/page-specifications.md#2-emergency), [wireframe](../../wireframes/emergency.md) | [Emergency study](../pages/critical-journeys/emergency.html) | Verified ready; required content withheld; call handoff unsupported; arrival/map failure; expired; no JS/CSS/media | `SAFE-01`–`SAFE-04`, `LANG-01`, `SEC-02`, `DEL-01` |
| Doctor Directory `/doctors/` | `D0`–`D6` | [Page spec](../../ux/page-specifications.md#3-doctor-directory), [wireframe](../../wireframes/doctor-directory.md) | [Directory study](../pages/care-discovery/doctor-directory.html) | Initial; searched/filtered/paged; loading; no match; failure/offline; empty approved set; retired/unavailable; no JS | `CARE-01`–`CARE-04`, `CARE-06`, `SEARCH-01`–`SEARCH-02`, `LANG-02` |
| Doctor Profile `/doctors/{doctor-slug}/` | `P0`–`P7` | [Page spec](../../ux/page-specifications.md#4-doctor-profile), [wireframe](../../wireframes/doctor-profile.md) | [Profile study](../pages/care-discovery/doctor-profile.html) | Approved/partial; portrait omitted; route failure; expired/unapproved; related record absent; no schedules by default; no JS | `CARE-01`–`CARE-03`, `CARE-06`, `APPT-01`–`APPT-04`, `BRAND-01`, `LANG-02` |
| Services Directory `/services/` | `S0`–`S7` | [Page spec](../../ux/page-specifications.md#5-services-directory), [wireframe](../../wireframes/services-directory.md) | [Services study](../pages/care-discovery/services-directory.html) | Initial; searched/grouped/paged; loading; no match; failure/offline; empty approved set; withheld record; no JS | `CARE-04`–`CARE-05`, `SEARCH-01`–`SEARCH-02`, `LANG-02` |
| Service Detail `/services/{service-slug}/` | `V0`–`V9` | [Page spec](../../ux/page-specifications.md#6-service-detail), [wireframe](../../wireframes/service-detail.md) | [Detail study](../pages/care-discovery/service-detail.html) | Approved/partial; claim withheld; related clinician absent; appointment route failure; operational data unavailable/expired; retired; no JS | `SAFE-02`–`SAFE-04`, `CARE-04`–`CARE-06`, `APPT-01`–`APPT-04`, `LANG-02` |
| Request an Appointment `/appointments/` | `A0`–`A8` | [Page spec](../../ux/page-specifications.md#7-appointment-request), [wireframe](../../wireframes/appointment.md) | [Appointment study](../pages/critical-journeys/appointment.html) and [state board](../pages/critical-journeys/appointment-states.html) | Conditional validation; pending; duplicate; known failure; offline; unknown/reconciliation; authoritative receipt; delivery warning; unavailable; no JS | `SAFE-01`–`SAFE-02`, `APPT-01`–`APPT-04`, `LANG-01`, `SEC-02`, `DEL-01` |
| Patient & Visitor Information `/patient-information/` | `PI0`–`PI7` | [Page spec](../../ux/page-specifications.md#8-patient--visitor-information), [wireframe](../../wireframes/patient-information.md) | [Patient information study](../pages/practical-institutional/patient-information.html) | Approved minimum; partial/omitted stage; guide unavailable/expired; temporary notice; print/download; failure/offline; no JS | `ACCESS-01`, `SAFE-01`–`SAFE-03`, `LANG-02`, `SEC-02` |
| Locations & Contact `/contact/` | `LC0`–`LC7` | [Page spec](../../ux/page-specifications.md#9-locations--contact), [wireframe](../../wireframes/locations-contact.md) | [Contact study](../pages/practical-institutional/locations-contact.html) | Verified ready; missing/conflicting facts; dialer unsupported; temporary change; map idle/loading/failure; no JS/CSS/map | `SAFE-01`–`SAFE-03`, `LANG-01`, `SEC-02` |
| Search Results `/search/` | `SR0`–`SR7` | [Page spec](../../ux/page-specifications.md#10-search-results), [wireframe](../../wireframes/search-results.md) | [Search study](../pages/practical-institutional/search-results.html) | Initial; results; urgent-term route; explicit correction; zero; failure/timeout/offline; expired/unpublished; no JS | `SAFE-02`, `SEARCH-01`–`SEARCH-02`, `LANG-01`–`LANG-02`, `SEC-02` |
| About the Hospital `/about/` | `AB0`–`AB9` | [Page spec](../../ux/page-specifications.md#11-about-the-hospital), [wireframe](../../wireframes/about.md) | [About study](../pages/practical-institutional/about.html) | Approved/partial; required narrative withheld; expired claim/leader/relationship; image omitted; translation unavailable; no JS | `INST-01`–`INST-03`, `BRAND-01`, `LANG-02`, `SEC-02` |
| Careers `/careers/` (Phase 2) | `CR0`–`CR8` | [Page spec](../../ux/page-specifications.md#12-careers), [wireframe](../../wireframes/careers.md) | [Careers study](../pages/practical-institutional/careers.html) | Current; no roles; close approaching; closed/filled/withdrawn; stale; provider/privacy blocked; translation unavailable; no JS | `GOV-02`, `HR-01`–`HR-03`, `LANG-02`, `SEC-02`, `DEL-01` |

## Phase 1 utility contracts

These utility contracts have product and wireframe coverage but no polished prototype study. Implement from the specifications and shared design-system contracts; do not infer public copy or conformance from an existing footer link.

| Utility route / response | Stable sections | Product and structure sources | Required implementation states | Primary decision gates |
| --- | --- | --- | --- | --- |
| Privacy Notice `/privacy/` | `PV0`–`PV5` | [Utility spec](../../ux/utility-page-specifications.md#privacy-notice), [utility wireframe](../../wireframes/utility-pages.md#privacy-notice) | Current; no optional providers; affected collection disabled; contact unavailable; translation unavailable; print; no JS | `GOV-01`, `SAFE-01`, `APPT-03`, `SEARCH-02`, `SEC-02`, `DEL-01` |
| Accessibility Statement `/accessibility/` | `AX0`–`AX5` | [Utility spec](../../ux/utility-page-specifications.md#accessibility-statement), [utility wireframe](../../wireframes/utility-pages.md#accessibility-statement) | Current; known limitation; support unavailable; translation unavailable; print; no JS | `GOV-01`, `SAFE-01`, `LANG-01`, `DEL-01` |
| 404/410/unavailable response | `NF0`–`NF4` | [Utility spec](../../ux/utility-page-specifications.md#not-found-unavailable), [utility wireframe](../../wireframes/utility-pages.md#not-found-unavailable) | 404; 410; successor redirect; retired/unpublished; temporary failure; missing language; search unavailable; no JS | `GOV-01`, `GOV-02`, `SAFE-01`, `LANG-01`–`LANG-02`, `DEL-01` |

A separate Cookie route and Terms / Legal Notice are outside the initial Phase 1 backlog unless `GOV-02` records an approved legal/product scope change. Cookie disclosure stays in `/privacy/` by default. Referring Clinicians, Health Information / News, Careers, and a Patient Portal are likewise deferred; Careers remains the existing Phase 2 exception in the core matrix above.

## Shared journey contracts

| Journey family | Canonical flow source | Implementation invariant |
| --- | --- | --- |
| Home, Emergency, Appointment | [Critical user flows](../../wireframes/critical-user-flows.md) | Route distinction precedes emergency call choice; appointment outcome is server-authoritative. |
| Doctor and service discovery | [Care-discovery flows](../../wireframes/care-discovery-flows.md) | Only current approved records and relationships appear; stable public IDs carry context. |
| Visit access and search | [Practical-access flows](../../wireframes/practical-access-flows.md) | Text directions work without a map; search is navigational and privacy bounded. |
| Institutional and Careers | [Institutional flows](../../wireframes/institutional-flows.md) | Evidence/rights expiry removes affected claims/assets; closed roles cannot accept applications. |

## Shared component and state sources

- Use [component specifications](../components/component-specifications.md) for shared anatomy and visual states.
- Use [prototype interaction contracts](../prototype/prototype-specification.md) for demonstrated transitions and focus recovery.
- Use [responsive/bilingual refinement](../pages/responsive/responsive-bilingual-refinement.md) for the tested layout corrections and fixture boundaries.
- Use [Order 11 QA](../qa/order-11-design-motion-qa.md) for performed evidence and explicit limitations.

The three state boards demonstrate mutually exclusive conditions for Appointment, care discovery, and practical/institutional pages. They are evidence fixtures, not additional public routes.
