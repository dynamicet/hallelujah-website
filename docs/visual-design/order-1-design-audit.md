# Order 1 — Design Audit and Workspace Preparation

**Prepared:** 12 September 2026  
**Status:** Complete at document-review level; hospital approvals remain unresolved  
**Next order:** Order 2 — Benchmark translation and visual direction

## 1. Audit result

The existing blueprint is structurally ready for visual exploration. It defines 12 primary page types, 104 section IDs, four cross-page flow packages, a shared shell, responsive rules, reusable component contracts, and failure/recovery behavior. The accepted information architecture and the section order in each wireframe should remain unchanged during visual design unless testing produces a documented accessibility or usability reason for a coordinated change.

Visual design may proceed only as a non-public prototype. All 32 formal stakeholder decisions remain unresolved even though their safe baselines were accepted as working policy. The current cyan/teal/orange palette, Noto typography, imagery direction, and logo treatment are candidates, not approved hospital identity standards.

Five preparation findings require explicit handling in later orders:

1. The Phase 1 sitemap includes Privacy and Accessibility routes, and the utility tree includes cookie/legal and 404/unavailable routes, but these do not yet have page-level specifications or wireframes.
2. The component contract defines a Vacancy card but the summary component-inventory table omits it; later component work must include it as Phase 2 and non-actionable until HR/privacy gates close.
3. The media manifest contains 85 references to 61 unique remote files; none is downloaded and every source alt field is missing. No source media is production-ready.
4. The only local hospital imagery consists of audit screenshots. The remaining local images are benchmark evidence and cannot be repurposed as Hallelujah product assets.
5. English/Amharic structure is defined, but no approved Amharic content fixture, translation memory, or professional review evidence exists. Safety-critical Amharic screens cannot be represented as approved copy.

**Post-Order-12 resolution:** Finding 1 is now closed for implementation planning by the [utility page specifications](../ux/utility-page-specifications.md) and [utility wireframes](../wireframes/utility-pages.md). Privacy, Accessibility, and genuine 404/410/unavailable behavior are Phase 1 contracts. Separate Cookie and Terms routes remain conditional/deferred. This documentation closure does not approve policy copy, legal applicability, support operations, conformance claims, or publication.

## 2. Sources reviewed

| Source set | Audited scope | Result for visual design |
| --- | --- | --- |
| Requirements | 62 requirements across global, safety/privacy/language, Home, Emergency, Doctors, Services, Appointment, practical access, and institutional content | Authoritative behavior, quality, state, and release constraints; all publication gates remain binding |
| Sitemap | Primary, persistent, secondary, utility, Phase 1, conditional, and deferred routes | Preserve task-led navigation; do not add benchmark-inspired routes by implication |
| Page specifications | 12 template goals, content order, rules, states, and acceptance | Primary page-level design brief |
| Design-system documents | Foundations, layouts, components, interaction/motion | Candidate prototype system; brand approval and rendered-state validation remain open |
| Wireframes | 12 annotated pages and four flow packages | Preserve the 104 section IDs and documented hierarchy |
| Benchmark evidence | 93 cross-site patterns, 17 local applications, 120 source-organization candidates, 20 local reference screenshots | Use only through Adopt/Adapt/Test/Defer/Reject dispositions; no brand or unsupported behavior copying |
| Content resources | 99 source pages, 32 doctor records, 39 service records, hospital profile, 85 media references | Source candidates only; verification and rights flags govern every use |
| Validation | 32 decisions, seven scenarios, four planned sessions, 12 page/four flow reviews | Safe baseline accepted for prototype use; all formal outcomes and named owners unresolved |
| Existing audit | Current-site screenshots, report, evidence, and claim ledger | Research evidence; known SEO-spam compromise prevents treating the live site as trusted production source |

## 3. Route and page inventory

### Primary designed templates

| Page | Route/phase | Section sequence | Dominant user action | Prototype/publication gate |
| --- | --- | --- | --- | --- |
| Home | `/`, Phase 1 | `H0` shell; `H1` orientation; `H2` essential tasks; `H3` site search; `H4` services; `H5` doctors; `H6` visit stages; `H7` location/contact; `H8` trust; `H9` support/footer | Start an essential journey | Contacts, search vocabulary, featured records, trust claims, brand, translations |
| Emergency | `/emergency/`, Phase 1 | `E0` minimal shell; `E1` route/call choices; `E2` route explanation; `E3` online-channel warning; `E4` scope; `E5` entrance/directions; `E6` arrival/access; `E7` optional map; `E8` non-emergency support | Explicit verified call action | Both routes/purposes/numbers, scope, warning, hours, entrance, directions, Amharic |
| Doctor Directory | `/doctors/`, Phase 1 | `D0` shell; `D1` orientation; `D2` search/filters; `D3` result status; `D4` cards; `D5` recovery; `D6` uncertainty support | Open a canonical profile | Approved current roster, canonical map, vocabulary, portraits, staffed fallback |
| Doctor Profile | `/doctors/{doctor-slug}/`, Phase 1 | `P0` shell/breadcrumb; `P1` identity/action; `P2` interests; `P3` biography/credentials; `P4` location/request; `P5` services; `P6` review metadata; `P7` recovery | Request appointment with stable doctor ID | Identity/profile completeness, rights, relationships, location; schedules remain omitted |
| Services Directory | `/services/`, Phase 1 | `S0` shell; `S1` orientation; `S2` urgent exception; `S3` search/taxonomy; `S4` result status; `S5` cards; `S6` recovery; `S7` support | Open a canonical service | Approved taxonomy/subset/synonyms, claims, urgent policy, translations |
| Service Detail | `/services/{service-slug}/`, Phase 1 | `V0` shell/breadcrumb; `V1` identity/action; `V2` urgent exception; `V3` who/needs; `V4` capabilities; `V5` doctors; `V6` practical details; `V7` process/action; `V8` review metadata; `V9` support | Request care with stable service ID | Scope, capabilities, urgent exception, location/hours, relationships, review record |
| Request an Appointment | `/appointments/`, Phase 1 | `A0` shell; `A1` request expectation; `A2` emergency warning; `A3` error summary; `A4` minimum fields; `A5` privacy/consent; `A6` submit/outcome; `A7` staffed recovery; `A8` footer | Send appointment request | Submission disabled until operations, privacy, security, field, SLA, and idempotency decisions close |
| Patient & Visitor Information | `/patient-information/`, Phase 1 | `PI0` shell; `PI1` orientation; `PI2` before visit; `PI3` during visit; `PI4` after visit; `PI5` cross-stage topics; `PI6` unavailable recovery; `PI7` staffed support | Open an approved guide | Useful approved minimum, guide ownership, consequential review, canonical fallback |
| Locations & Contact | `/contact/`, Phase 1 | `LC0` shell; `LC1` place identity; `LC2` call purposes; `LC3` address/entrance; `LC4` hours/status; `LC5` arrival/access; `LC6` optional map; `LC7` non-urgent contact | Call or use text directions | Reconciled contacts, on-site arrival evidence, purpose/hours, translations, map/privacy |
| Search Results | `/search/`, conditional Phase 1 | `SR0` shell; `SR1` bounded search; `SR2` urgent guidance; `SR3` type filters; `SR4` result status; `SR5` typed results; `SR6` recovery; `SR7` staffed/task alternatives | Open a canonical result | Governed index, vocabulary, ranking, urgent policy, query privacy/logging, fallback |
| About the Hospital | `/about/`, Phase 1 | `AB0` shell/breadcrumb; `AB1` orientation; `AB2` story; `AB3` mission/vision/values; `AB4` facts; `AB5` leadership; `AB6` relationships; `AB7` imagery; `AB8` review metadata; `AB9` care return | Explore care/contact | Required narrative, claims, leadership, relationships, rights, translations |
| Careers | `/careers/`, Phase 2 | `CR0` shell/breadcrumb; `CR1` orientation; `CR2` current status; `CR3` vacancies; `CR4` privacy; `CR5` no roles; `CR6` stale/closed; `CR7` policy/support; `CR8` review metadata | Apply only when fully approved | Remains non-collecting and outside public navigation until HR lifecycle, provider, privacy, policy, and language gates close |

### Routes without a complete visual-design brief

These routes are part of the accepted information architecture, so Order 2 must not remove them. Orders 4–8 must either add coordinated specifications/wireframes or define a documented shared utility-page pattern before polished page completion.

| Route/content type | Current scope | Missing design input | Safe present treatment |
| --- | --- | --- | --- |
| `/privacy/` | Phase 1, indexable | Page specification, section IDs, long-form/legal layout, version/effective-date behavior | Link may appear as a labeled placeholder; no invented notice copy |
| `/accessibility/` | Phase 1, indexable | Page specification, support/reporting states, conformance-claim rules | Link may appear; no untested conformance claim or unverified support contact |
| Cookie information | Utility, if applicable | Applicability decision, consent model, banner/preferences behavior | Do not render a banner until Privacy defines need and categories |
| Terms/legal notice | Utility, if legally required | Jurisdiction/content decision and template | Do not invent legal text |
| 404/410/unavailable | Required utility behavior | Shared visual template and variants for retired, untranslated, blocked, and missing records | Use honest status, task routes, and only approved contact fallbacks |
| Patient-information child guides | Conditional under hub | Topic templates and section IDs | Omit missing topics; do not create empty pages |
| Location detail | Conditional on more than one maintained location | Collection/detail model and canonical data | Keep one `/contact/` page until maintained records exist |
| Referring Clinicians | Phase 2 | Operational scope and full specification | Hidden/deferred |
| Health Information / News | Phase 2 | Editorial governance and article template | Hidden/deferred |
| Patient Portal | Conditional | Real supported identity/clinical system and separate product scope | Absent |

## 4. Cross-page flow inventory

| Package | Flows | Visual-design implications |
| --- | --- | --- |
| Critical journeys | `F1` Home routes; `F2` emergency call/arrival; `F3` appointment happy path; `F4` validation/timeout/recovery; `F5` language continuity | Preserve emergency immediacy, explicit activation, form state continuity, and request-not-booking language |
| Care discovery | Seven doctor/service search, recovery, publication, relationship, handoff, and bilingual flows | Stable IDs and governed relationships must remain visible in state design; no live availability |
| Practical access/search | Seven visit, arrival, detailed search, urgent-term, recovery, sensitive-query, and language flows | Text-first arrival and typed non-diagnostic search survive map/JS/network failure |
| Institutional/careers | Seven claim publication/expiry, care-return, vacancy, data-boundary, and bilingual flows | Claims/assets expire cleanly; Careers remains Phase 2 and non-collecting |

## 5. Shared shell and component inventory

The source contract specifies 37 Phase 1 entries in its inventory table plus the separately documented Vacancy card. Order 5 must design the applicable states below, not only ideal/default examples.

| Group | Components/patterns already specified | Audit note for polished work |
| --- | --- | --- |
| Structure | Skip link, header, primary navigation, mobile menu, breadcrumb, footer | Resolve compact header priority, wrapping, sticky behavior, focus return, and utility-route presentation |
| Essential actions | Emergency action, call link, appointment action, language switcher | Emergency and routine actions need distinct meanings; no unlabeled icon or ambiguous whole-card target |
| Controls | Button, text link, icon-and-label action, input, select, checkbox, radio, textarea | Required/optional language, 44/48 px sizing, keyboard, touch, disabled explanation, and bilingual expansion are mandatory |
| Discovery | Search box, autocomplete, filter group, active-filter chip, result count, pagination | Base GET/native behavior first; autocomplete is optional; state stays in safe URLs |
| Governed content | Doctor card, service card, location/contact card, review metadata | Optional fields collapse; current status, source/review, and canonical destination determine rendering |
| Careers | Vacancy card | Add to the summary inventory during Order 5; show only non-actionable prototype states until Phase 2 gates close |
| Feedback | Alert, inline error, error summary, status message, loading indicator, empty/unavailable state | Differentiate emergency, validation error, warning, information, success, and temporary operations by words/structure as well as color |
| Disclosure/media | Accordion, image, optional map launcher and text alternative | Never hide emergency/core eligibility/error; reserve media size; map remains user-initiated and noncritical |
| Layout patterns | Intro, action group, content, collection, support; global shell; directory; detail; form; patient hub; contact; search; institutional | These are composition patterns, not new bespoke card variants |
| Later/conditional | Tabs, general dialog, portal/account controls, campaign modules | Excluded until a demonstrated use and corresponding behavior/accessibility contract exist |

### Component state checklist

| State family | Components requiring an explicit study |
| --- | --- |
| Pointer/keyboard | Links, all button variants, navigation, menu, language switcher, search, filters, chips, pagination, cards, accordion, map launcher, form controls |
| Disabled/unavailable | Appointment submission, gated calls/maps/Apply, missing translation, expired records; always explain why when visible |
| Loading/busy | Form submit, genuine async directory/search update, user-initiated map, optional image; never block static emergency/contact content |
| Validation/error | Inputs, care selector, consent, error summary, form/API outcome, search/directory failure, map/provider failure |
| Empty | Search query/result, approved doctor/service subset, optional collections, no vacancies, missing visit stage |
| Success | Authoritative appointment receipt, confirmation delivery, local copy action; never claim call connection or booking |
| Offline/no JavaScript | Shell navigation, emergency, contact/directions, GET search/filter, governed detail, secure POST fallback, core help routes |
| Expired/retired | Doctor, service, guide, claim, relationship, alert, leader, partner, vacancy, indexed record |
| Reduced motion | Menu, disclosure, validation, loading, result updates, alerts, language changes, page/section transitions |

## 6. Page state inventory

| Page | Required or documented states |
| --- | --- |
| Home | Default; initial loading; empty search; omitted optional collection; collection failure; search unavailable; unavailable translation; no JavaScript |
| Emergency | Ready; map loading; required-content absence; call handoff unsupported; map failure; content unavailable/expired; local copy success; no JavaScript/CSS/media |
| Doctor Directory | Initial; searched/filtered; loading; no matches; data failure/offline; empty roster; retired/duplicate record; no JavaScript/images/fonts |
| Doctor Profile | Approved; partial optional content; portrait unavailable; appointment-route failure; expired/unapproved; related service absent/retired; optional loading; no JavaScript/images/fonts |
| Services Directory | Initial; searched/grouped; loading; no matches; data failure/offline; no approved services; record/claim withheld; no JavaScript/images/fonts |
| Service Detail | Approved; partial optional content; high-consequence claim withheld; related doctor absent; appointment-route failure; operational data unavailable/expired; retired record; no JavaScript/images/map/fonts |
| Appointment | Editing; validation error; pending; authoritative rejected/recoverable failure; timeout/offline/unknown; reconciling; received/success; received/confirmation-delivery warning; language limitation; no JavaScript/server-validation fallback |
| Patient Information | Approved minimum; partial content; guide unavailable/expired; temporary operational change; download/print; loading/failure/offline; no JavaScript/images/fonts |
| Locations & Contact | Ready; conflicting/missing required data; dialer unsupported; temporary closure/relocation/hours; map idle/loading/failure; copy success/failure; future multiple locations; no JavaScript/CSS/map/fonts |
| Search Results | Initial/no query; results; approved urgent-term match; suggested correction; zero results; failure/timeout/offline; unpublished/expired result; no JavaScript/fonts/images |
| About | Approved; unresolved required narrative; partial optional evidence; expired claim/record; unclear partner/insurer; image unavailable; unavailable translation; no JavaScript/images/fonts |
| Careers | Current vacancies; no vacancies; close approaching; closed/filled/withdrawn; expired/stale; provider unavailable; privacy handling unapproved; unavailable translation; no JavaScript/images/fonts |

## 7. Content and asset inventory

### Structured content candidates

| Content set | Available evidence | Prototype rule |
| --- | --- | --- |
| Hospital profile | Name, source tagline, five timeline entries, mission/vision/five values, four leaders, 19 partners, six technology references, six fact claims, contacts, four visitor steps | Use structural length only; do not publish facts, people, relationships, or claims without approval |
| Doctors | 32 unique public profiles; 17 current-directory candidates and 15 profile-only candidates; 17 unique image URLs; all 32 records carry quality flags; 17 source images are marked as placeholders | Use clearly fictional/synthetic prototype records or abstract content labels; no extracted clinician is presented as approved/current |
| Services | 39 records in five extracted groups: 9 access/hospital care, 12 medicine, 11 surgery, 2 women/children, 5 specialty/rehabilitation; four records have known quality flags | Use enough controlled records to test hierarchy; avoid unsupported capability copy and treat taxonomy as provisional |
| Appointments | Seven source fields and one existing API endpoint | Do not connect to the endpoint or collect real data; use the candidate minimized field structure and simulated states only |
| Contacts/arrival | Conflicting general/emergency numbers, source email/address, coordinates | Never create a live `tel:`, `mailto:`, or map target from unapproved values |
| Patient guidance | Four source visitor steps; most before/during/after content missing | Use topic-label placeholders and omit unsupported guidance text |
| Careers | Existing vacancy shell only | No real vacancy, Apply action, CV/email/upload, or provider handoff |

### Local image assets

| Asset class | Count/status | Permitted use |
| --- | --- | --- |
| Current-site audit screenshots | 6 desktop captures at 1440×1000 plus one mobile Home capture at 390×844 | Research and before/after evidence only; not a product asset |
| Audit benchmark excerpts | 4 captures at 1440×1000 | Research only; do not copy layout or branding |
| Full benchmark homepage captures | 9 files: four at 1440×1000 and five at 1440×1200 | Order 2 comparison/moodboard evidence with source attribution; never ship in the hospital site |
| Audit report evidence | 5 rendered QA images | Documentation evidence only |
| Remote media manifest | 85 references, 61 unique URLs; 51 Home usages, 32 doctor usages, 2 About usages; zero downloaded; all 85 lack source alt | Not approved for visual designs as hospital-owned media; rights, authenticity, consent, crop, and alt purpose required first |
| Approved logo/vector assets | None | Use a text-only prototype identifier; do not trace or redraw the screenshot logo |
| Approved fonts | None bundled | System fallback or non-public Noto study only; later self-hosting requires license/file/weight and language review |
| Approved icon library | None bundled | Order 2/4 may study one coherent outline family; do not mix emoji or copied branded icons |

The UI/UX design-intelligence review reinforces visible labels, blur/submit validation, announced errors, appropriate input types/keyboards, explicit recovery, mobile-first composition, touch-sized targets, restrained line length, and a coherent outline icon family. These checks already agree with the source contracts and should be carried into Orders 4–5.

## 8. Missing visual decision register

| ID | Decision still needed | Working constraint now | Target order / accountable evidence |
| --- | --- | --- | --- |
| `VD-01` | Authentic logo, name, tagline, variants, clear space, minimum size | Text-only prototype identification; no invented symbol | Order 2/4; Brand owner, `BRAND-01` |
| `VD-02` | One recommended visual direction and acceptable degree of warmth/authority | “Calm clinical confidence, locally human”; avoid luxury, technology-led, or alarm-heavy styling | Order 2; Product/Brand with user-study rationale |
| `VD-03` | Final palette and identity/accent roles | Candidate cyan/orange identity accents, deep teal action, red emergency/error; all labeled provisional | Order 2/4; Brand + rendered contrast evidence |
| `VD-04` | English/Amharic typography, weights, metrics, numeral/date treatment, font delivery | Noto Sans/Noto Sans Ethiopic candidate; system fallback; 35% expansion | Order 2/4/9; Brand + professional language/device review |
| `VD-05` | Photography subjects, art direction, consent, rights, crops, and expiry | No source or stock imagery implies real services/outcomes; text remains complete | Order 2/4; Brand/Privacy/Content rights workflow |
| `VD-06` | Icon family, metaphors, stroke/weight, bidirectional treatment | One neutral outline family, 20/24 px, icon plus text | Order 2/4; Brand + accessibility review |
| `VD-07` | Section rhythm, density, surface alternation, border/elevation character | Existing 4/8 px rhythm and restrained surfaces; no card around every paragraph | Order 2/4; cross-page visual study |
| `VD-08` | Compact-header logo/action priority and wrapping under Amharic/zoom | Logo, menu, and labeled Emergency remain; other tasks move into menu when needed | Order 2/5/9; 320/360/400% evidence |
| `VD-09` | Whether any mobile action bar is sticky | Optional only; cannot cover content, focus, browser controls, or submit | Order 5/6; journey testing |
| `VD-10` | Emergency visual intensity and separation of hospital/public call choices | Minimal shell, no hero, stable single column, red reserved and concentrated | Order 2/5/6; `SAFE-01`–`SAFE-04` plus comprehension test |
| `VD-11` | Appointment single-page versus genuinely beneficial multi-step treatment | Single-column, about 640 px, no modal; single-page is the default | Order 5/6; `APPT-01`–`APPT-04` and usability evidence |
| `VD-12` | Neutral doctor portrait fallback | Omit image or use abstract neutral non-person visual; never infer identity/gender | Order 2/5/7; `CARE-02`, rights review |
| `VD-13` | Service imagery/illustration system | Service scope is text-first; visuals cannot prove capability or diagnose | Order 2/7; Clinical/Brand approval |
| `VD-14` | Institutional storytelling and fact/relationship presentation | No animated counters, logo walls, or unsupported hero claims | Order 2/8; `INST-01`–`INST-03` |
| `VD-15` | Map visual/provider treatment | Text route first; map idle until explicit action and approval | Order 5/8; `SAFE-03`, `SEC-02` |
| `VD-16` | Full alert/status visual grammar | Meaning uses heading, words, icon, action, and metadata—not color alone | Order 4/5; accessibility and safety review |
| `VD-17` | Expressive motion intensity and signature moments | Functional motion only, 150–300 ms; reduced motion removes travel | Order 3; performance/accessibility constraints |
| `VD-18` | Privacy, Accessibility, legal/cookie, 404/410/unavailable page patterns | Preserve links/status; no invented policy or conformance claims | Before Orders 5–8; coordinated page-spec/wireframe decision |
| `VD-19` | Long-content, mixed-script, Amharic, missing-translation visual fixtures | No truncation; both languages LTR; honest in-place unavailable state | Order 4/9; `LANG-01`–`LANG-02` |
| `VD-20` | Print/download styling for patient guidance | Accessible HTML primary; optional file states name type/size | Order 4/8; Operations/Content |
| `VD-21` | Directory card density, pagination, and filter threshold | 1/2/maximum 3 columns; real pagination baseline; only maintained filters | Order 5/7; roster/taxonomy and responsive tests |
| `VD-22` | Final focus, hover, pressed, disabled, and high-contrast state appearance | Persistent 3 px focus with 2 px offset; no hover-only affordance | Order 4/5/11; rendered-state QA |

## 9. Formal decision and release-gate inventory

| Bundle | Decision IDs | Visual/prototype effect |
| --- | --- | --- |
| Governance/scope | `GOV-01`–`GOV-03` | Show ownership/status in annotations; keep accepted route phases and benchmark dispositions |
| Emergency/access | `SAFE-01`–`SAFE-04` | No real contacts, map, arrival instruction, hours, or capability claim until approved |
| Appointment | `APPT-01`–`APPT-04` | Non-submitting simulation; request language; candidate requiredness; authoritative/unknown/delivery states |
| Care records | `CARE-01`–`CARE-06` | No extracted roster/taxonomy/relationships represented as current; no schedules/live availability |
| Visit/search/language | `ACCESS-01`, `SEARCH-01`–`SEARCH-02`, `LANG-01`–`LANG-02` | Omit missing guidance; non-diagnostic search; no telemetry; reviewed translations only |
| Institution/brand/careers | `INST-01`–`INST-03`, `BRAND-01`, `HR-01`–`HR-03` | Omit claims/relationships/rights-dependent media; provisional identity label; Careers non-collecting |
| Security/delivery | `SEC-01`–`SEC-02`, `DEL-01` | No production-readiness claim; default-deny third parties; evidence plan required before release |

Hard public-release gates remain the SEO-spam incident; canonical emergency/contact/arrival data; appointment operations/privacy/security; Phase 1 Amharic safety content; approved doctor roster/service taxonomy/claims; privacy and third-party decisions; and executed accessibility, responsive, performance, and security evidence.

## 10. Controlled prototype placeholder policy

| Content/behavior | Safe prototype placeholder | Prohibited treatment |
| --- | --- | --- |
| Global status | Persistent “Non-public prototype” notice in every frame/prototype entry | Hidden canvas note or implication that the design is approved |
| Hospital identity | Text “Hallelujah General Hospital — prototype identity” | Traced logo, invented compact mark, or unapproved tagline as brand lockup |
| Phone/email/address/hours | Static tokens such as “Verified hospital number required” with no live link | Fake or extracted number in `tel:`, unapproved email action, invented hours/directions |
| Emergency | Labeled inert action specimen plus explicit “not connected” prototype note | Disabled red control without explanation, accidental activation, or copied public-emergency advice |
| Doctors | Clearly fictional `Prototype clinician 01`, neutral fallback, synthetic stable ID | Extracted person presented as current, invented credentials/language/schedule, realistic fake portrait |
| Services | `Prototype service A` and neutral structure-length copy | Unsupported procedures, outcomes, eligibility, urgent exceptions, or diagnosis language |
| Appointment form | Non-submitting fields with obviously fictional sample values and simulated states | Connection to the current API, real PII, confirmed-booking language, inferred consent/SLA |
| Search | Local static fixture using prototype records; explicit non-diagnostic scope | Logging/analytics, remote autocomplete, diagnosis, silent correction, unapproved urgent terms |
| Patient guidance | Topic labels such as “Approved what-to-bring guidance” or omit | Generic medical/operational advice written as hospital instruction |
| Location/map | Abstract text-route/map placeholder after full withheld-state explanation | Unverified coordinates, routes, entrance, third-party request, or critical-path map |
| About/trust | Withheld-state modules, qualitative layout blocks, `Fact label / approval pending` | Extracted statistics, leaders, partners/logos, “first/best” claims, animated counters |
| Careers | No-current-role or privacy-blocked static prototype state | Apply, upload, mailbox, external provider, inferred equality/fraud wording |
| Amharic | Approved supplied copy when available; otherwise explicit “Amharic review required” fixture | Machine-generated safety/privacy/clinical copy presented as final |
| Review metadata | “Prototype record — owner/review evidence required” | Fake reviewer name/date or “medically reviewed” claim |
| Images | Abstract shapes or rights-cleared non-hospital concept studies labeled as such | Benchmark screenshot, hotlinked source image, identifiable person, or imagery implying capability |

Optional unapproved sections should usually be omitted rather than filled. A placeholder is justified only when a visual/state decision cannot be assessed without its geometry, and it must remain visibly non-public.

## 11. Responsive, language, accessibility, and performance fixtures

Order 2 studies and every later polished artifact must cover the following minimum set:

| Fixture | Minimum evidence |
| --- | --- |
| 320 px and 360 px | No horizontal page scroll; task and emergency labels remain explicit; targets at least 44×44 px |
| Tablet | Header/filter/card layout changes at content-fit thresholds rather than arbitrary device labels |
| 1280 px and 1440 px | Reading measure remains bounded; directories never exceed three columns; priority is not diluted by empty width |
| 200% and 400% | Visual/DOM order agree; breadcrumb/filter/menu reflow; no focus or sticky obstruction |
| English long content | Names, service labels, errors, warnings, and navigation wrap without truncation |
| Amharic and mixed script | Comparable hierarchy, correct `lang`, LTR behavior, 35% expansion, stable IDs, no missing consequential meaning |
| Keyboard/screen reader | Skip link, landmarks, one H1, visible focus, accessible names/statuses, focus restoration, error-summary behavior |
| Reduced motion | No spatial travel, parallax, smooth scroll, rotation, or decorative reveal; status remains perceivable |
| No image/font/JavaScript | Essential HTML, call labels/numbers when approved, text directions, content, search/form fallback, and task exits remain useful |
| Slow/failure/offline | Stable dimensions, local progress after about 300 ms, truthful recovery, no stale governed record represented as current |
| Performance | Initial transfer ≤1 MB, first-party JS ≤150 KB compressed, ≤50 initial requests unless approved; LCP ≤2.5 s, INP ≤200 ms, CLS ≤0.1 targets |

## 12. Order 2 handoff

Order 2 is unblocked for non-public work. It must:

1. Build a benchmark-inspiration matrix from the 17 local applications and captured references, not from visual copying.
2. Produce two or three distinct visual directions that all preserve the task-led hierarchy, emergency separation, accessible contrast, bilingual expansion, text-first practicality, and low-bandwidth behavior.
3. Show representative Home orientation, Emergency call-choice, directory card, appointment field/error, practical-arrival, and trust-content studies in each direction.
4. Include English and Amharic typography specimens, a text-only prototype identity, imagery/placeholder studies, icon direction, surface/rhythm studies, and default/focus/error/emergency color roles.
5. Recommend one direction with explicit reasoning and list every remaining `VD-*`, `BRAND-01`, language, content, and rights dependency.
6. Keep all concepts persistently labeled as non-public prototypes and avoid live actions or personal-data collection.

Order 1 completion means the workspace, inventory, constraints, and next-order inputs are ready. It does not mean that the hospital brand, content, operations, translations, assets, or public release are approved.
