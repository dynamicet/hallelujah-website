# Page-by-Page UX Specifications

**Version:** 0.2 benchmark-traceable baseline  
**Status:** Working specification; operational and clinical facts require approval  
**Related:** [Requirements matrix](../requirements/requirements-matrix.md) · [Sitemap](sitemap.md) · [Utility page specifications](utility-page-specifications.md) · [Benchmark traceability](../benchmarks/benchmark-traceability.md)

## Shared page contract

Every public template must provide:

- A skip link, semantic header/navigation/main/footer structure, unique page title, one clear `h1`, and logical headings
- Persistent, clearly labeled Emergency, Call, and Appointment access without making every page visually alarming
- Breadcrumbs on detail and secondary pages
- A concise opening summary that answers “Am I in the right place?”
- Concise patient-language labels, explanations, errors, and next steps that preserve approved clinical meaning
- One visually dominant next action appropriate to the page
- Approved contact fallback when a digital action fails
- Visible focus, keyboard operation, 44 by 44 CSS px targets, reflow at 320 CSS px and 400% zoom, and screen-reader-compatible names/statuses
- Honest language availability and context-preserving language switching
- Last-reviewed information on governed clinical and operational content
- Reserved media dimensions, progressive enhancement, and usable essential content when scripts or embeds fail

Do not display a field, card, section, filter, claim, or empty template merely because the content model supports it. Publish only approved, maintained information.

Privacy, Accessibility, and genuine 404/410/unavailable behavior are Phase 1 contracts specified separately in the [utility page specifications](utility-page-specifications.md). They inherit this shared page contract. A separate Cookie or Terms route is not part of the initial Phase 1 scope unless its named legal/product owners approve the need and maintained content through `GOV-02`.

## Template overview

| Page | Visitor's primary question | Primary action | Key requirements | Gate |
| --- | --- | --- | --- | --- |
| Home | “Where should I start?” | Choose an essential journey | H-001–H-005 | Approved featured records/claims, search taxonomy, and urgent-term behavior |
| Emergency | “What should I do right now?” | Tap to call | E-001–E-005 | Verified safety information |
| Doctor directory | “Who can help me?” | Open a doctor profile | D-001–D-003 | Approved current roster |
| Doctor profile | “Is this the right clinician and how do I request care?” | Request appointment | D-003–D-006 | Approved identity/profile; schedule omitted until approved |
| Services directory | “Which service fits my need?” | Open a service | V-001 | Approved taxonomy |
| Service detail | “Does the hospital provide this care and what happens next?” | Request care | V-002–V-005 | Approved clinical/operational scope |
| Appointment request | “Can I request an appointment safely?” | Submit request | A-001–A-007 | Workflow/privacy/SLA |
| Patient & Visitor hub | “How do I prepare for and navigate a visit?” | Open relevant guide | P-001–P-002 | Hospital-authored guidance |
| Locations & Contact | “How do I reach the right place?” | Call or get directions | C-001–C-003 | Reconciled access data |
| Search results | “Where is the information I need?” | Open result | H-005 | Governed taxonomy/urgent terms |
| About | “Can I trust this hospital?” | Contact / explore care | I-001–I-003 | Approved institutional claims |
| Careers | “Is there a current role and how do I apply?” | View/apply for vacancy | I-004 | Maintained HR workflow |

## Benchmark application by template

The [benchmark traceability register](../benchmarks/benchmark-traceability.md) contains the evidence, disposition, scope, and gates behind these mappings.

| Template | Benchmark applications incorporated | Patterns explicitly not implied |
| --- | --- | --- |
| Home/shared shell | `BM-01`, `BM-02`, `BM-03`, `BM-06`, `BM-09`, `BM-10`, `BM-12` | Portal, live triage, international coordination, or unsupported trust claims |
| Emergency | `BM-02`, `BM-06`, `BM-08`–`BM-11`, `BM-13` | Diagnosis, urgency estimation, or copied emergency protocols |
| Doctor directory/profile | `BM-03`, `BM-04`, `BM-05`, `BM-09`–`BM-11` | Unverified filters, language proficiency, schedules, or live availability |
| Services directory/detail | `BM-02`–`BM-05`, `BM-09`–`BM-11` | Diagnostic advice, unsupported capabilities, or automated routing |
| Appointment request | `BM-02`, `BM-05`, `BM-06`, `BM-09`–`BM-11` | Confirmed booking, referral acceptance, or patient-account status |
| Patient & Visitor Information | `BM-06`–`BM-11`, `BM-16` | Copied visit, payer, discharge, or clinical instructions |
| Locations & Contact | `BM-02`, `BM-04`, `BM-06`, `BM-08`–`BM-11`, `BM-13` | Map dependency, inferred hours, or an unsupported multi-facility finder |
| Search Results | `BM-02`–`BM-04`, `BM-06`, `BM-09`–`BM-11` | Symptom checker, diagnosis, treatment advice, or silent clinical correction |
| About | `BM-01`, `BM-11`, `BM-12`, `BM-16` | Unverified academic, quality, scale, partner, or payer claims |
| Careers | `BM-09`–`BM-11`, `BM-13` | Copied policy language or an unapproved application provider |

## 1. Home

### Goal

Move a stressed or time-constrained visitor into the correct essential journey quickly. Institutional storytelling supports—not precedes—care access.

### Recommended content order

1. Compact hospital identification and task-led header
2. Static introduction with one primary care-access action and direct emergency route
3. Essential-action group: Find a Doctor, Explore Services, Request an Appointment, Call, Directions
4. Visible site-search entry point in the header and main content
5. Service discovery by patient need using approved service taxonomy
6. Small approved doctor selection with “View all doctors”
7. Patient/visitor preparation entry points
8. Verified location/contact summary
9. Approved trust content and institutional story
10. Footer with safety, privacy, accessibility, contact, and language links

### States and rules

- No autoplay carousel, pre-intent video request, or critical text embedded in media. Approved user-initiated video may enhance the reserved `H1` media plane or appear after essential tasks in `H8`/About under the [interactive-media amendment](../visual-design/motion/high-end-motion-and-interactive-media-amendment.md).
- If no doctors/services are approved for featuring, omit the module without leaving a visual gap.
- Do not publish extracted statistics, partner logos, leadership, technology, “first,” or airport-proximity claims until approved.
- Emergency access remains visually distinct from the page's ordinary primary action.

### Acceptance

- A first-time visitor can identify the essential routes to emergency help, doctors, services, appointment requests, call/directions, and search from mobile and desktop without interpreting internal hospital structure.
- Heading order and keyboard sequence match the visual reading order.
- The initial view does not download an interactive map, video stream, chat, or session-replay script. An optimized hero poster may load as the measured LCP asset; video begins only after explicit activation.

## 2. Emergency

### Goal

Give immediate, accurate, low-friction action and arrival guidance without suggesting that the website provides diagnosis or replaces emergency services.

### Required content order

1. Clear Emergency heading and concise action instruction
2. A concise distinction explaining when the hospital route and applicable public emergency route should be used
3. Verified, purpose-labeled hospital and public emergency tap-to-call actions
4. “Do not use forms, email, chat, or social messaging for emergencies” warning
5. Verified pediatric/adult scope, availability, and limitations
6. Exact entrance and landmark-based text directions
7. Accessible transport/parking information where verified
8. Optional map loaded outside the critical path, with text alternative

### States and rules

- The published `+251-940-105692` emergency/ambulance value is source data, not approved release data.
- Contact actions show both label and number; never use an unlabeled phone icon.
- A call starts only from the explicit call link: never from the surrounding card, page load, pointer-down, or touch-down. Keep call targets separated from adjacent actions and allow the device dialer/operating system to leave final call placement under user control.
- Avoid long medical explanations before the call action.
- The page must remain useful with images, scripts, CSS enhancements, and map provider unavailable.

### Acceptance

- Operations signs off every visible phone number, label, hour, scope statement, entrance, and direction.
- Tap-to-call values exactly match visible normalized numbers.
- A keyboard and screen-reader user reaches the concise route distinction and explicit call choices immediately after the page heading/summary.

## 3. Doctor directory

### Goal

Help a visitor find an approved clinician by name or care specialty without exposing stale profiles or unreliable availability.

### Required content

- Search by name and specialty/service
- Approved filters only; location, language, or availability filters stay hidden until their data is reliable
- Result count announced accessibly after filtering
- Doctor cards with approved name, specialty, optional credentials/portrait, location if maintained, and one profile action
- Clear “not sure who to choose?” path to service discovery or staffed contact

### States

- Initial results
- Filtered results
- No matching results with spelling/reset/contact help
- Loading only when genuinely asynchronous
- Recoverable data failure with call/service fallback

### Rules and acceptance

- Start from the 17 current-directory records only after roster approval; keep the 15 profile-only records unpublished until confirmed.
- Resolve the unlinked Dr. Abel Zemenfes card, duplicated Dr. Daniel Hailu card, and duplicate Dr. Abiy Worku URLs during canonicalization.
- Filter state is reflected in the URL and browser back/forward behavior works.
- Cards do not claim live availability unless an authoritative current source supports it.

## 4. Doctor profile

### Goal

Establish identity and relevant expertise, then explain how the visitor can request care.

### Required content order

1. Name, approved professional title/credentials, and specialty
2. Primary appointment-request action plus telephone fallback
3. Clinical interests and service relationships
4. Approved biography, qualifications, languages, and affiliations where available
5. Location and unambiguous availability guidance
6. Related services
7. Record last-reviewed date and accountable content owner internally

### Rules and acceptance

- Never infer credentials, languages, gendered pronouns, specialty, or availability.
- Do not publish schedules until duplicate Saturday/missing Sunday data and `LT` are resolved.
- If no approved portrait exists, use a consistent neutral visual fallback; decorative fallback images use empty alt text while the nearby heading carries the name.
- Appointment actions pass the canonical doctor identifier, not free-text display text alone.
- Retired profiles redirect only when a genuine approved replacement exists; otherwise return an honest unavailable/404 state with directory and contact routes.

## 5. Services directory

### Goal

Help patients recognize the type of care they need using plain language while preserving clinical search terms as supporting synonyms.

### Required content

- Five proposed groups from the extraction: Access and Hospital Care, Medicine, Surgery, Women and Children, Specialty and Rehabilitation
- Search by service name and approved condition/need synonyms
- Short patient-facing summary for each approved service
- “Not sure?” staffed-contact or appointment-request route
- Emergency exception message where relevant

### Rules and acceptance

- Clinical/content owners may revise the five extracted groups before launch.
- Do not expose separate, overlapping Departments and Services directories.
- All 39 extracted records require approval; Phase 1 may intentionally publish a smaller verified set.
- No-results behavior suggests spelling reset, nearby services, and contact help without guessing a diagnosis.

## 6. Service detail

### Goal

Explain the verified scope of care, who it is for, how to prepare, where to go, and how to request care.

### Required content order

1. Plain-language service name and short scope summary
2. Appointment/call action and urgent-care exception
3. Common needs or conditions handled
4. Verified tests, treatments, or procedures
5. Related approved clinicians
6. Location, hours, preparation, referral, and required-document information
7. What happens next
8. Clinical reviewer and reviewed date for medical content

### Rules and acceptance

- Withhold high-consequence capabilities such as cardiac surgery, pacemaker implantation, dialysis, transplant support/referral, oncology procedures, bariatric surgery, complex neurosurgery, and pediatric emergency claims until explicitly approved.
- Correct known copied headings and duplicate content before migration.
- Plain-language summaries may include clinical synonyms for recognition/search but must not diagnose.
- Related doctor, location, and appointment links resolve to governed canonical records.

## 7. Appointment request

### Goal

Collect the minimum information needed for staff to follow up, while making clear that submission is a request—not a confirmed appointment.

### Recommended flow

1. Scope explanation, not-for-emergencies warning, and verified emergency call action
2. New/returning patient choice only if operations need it
3. Doctor, service, or “not sure” choice
4. Minimum contact and scheduling preferences
5. Optional brief notes only if privacy/security owners approve the need
6. Privacy explanation and explicit consent where required
7. Review and submit
8. Confirmation with reference, response expectation, channel, and telephone fallback

### Form behavior

- Persistent labels; examples and instructions are not substitutes for labels.
- Validate at a helpful time and summarize errors at submission; move focus to the summary and link errors to fields.
- Never clear valid entered data after an error, timeout, or failed request.
- Prevent duplicate operational requests on double submission/retry.
- Disable submission only while the request is genuinely in progress and communicate status accessibly.
- Do not collect detailed medical history through the general public form.

### Acceptance

- Operations defines who receives requests, staffed hours, response expectation, confirmation channel, escalation, cancellation/rescheduling, and fallback.
- Privacy/security approves purpose, fields, transport, access, recipients, retention, deletion, logging, and consent language.
- End-to-end tests cover success, field errors, API errors, timeout, retry, duplicate submission, lost connection, and confirmation delivery.

## 8. Patient & Visitor Information

### Goal

Reduce uncertainty before, during, and after a visit with practical, locally useful guidance.

### Recommended structure

- Before: appointment status, what to bring, preparation, arrival time, payment/insurance, accessibility support
- During: reception to triage/cashier/OPD journey, navigation, visiting rules, patient rights, language/support services
- After: discharge, results/follow-up, medicines, feedback/complaints, urgent escalation

### Rules and acceptance

- The extracted reception → triage → cashier → OPD flow is a source candidate and needs operations approval.
- Visiting, payment, accessibility, admission/discharge, rights, feedback, safeguarding, and support content is currently missing.
- Do not launch empty category pages. Publish only approved useful topics and provide a telephone fallback for unavailable guidance.
- Printable guidance uses accessible HTML first; downloads state file type and size and must be accessible.

## 9. Locations & Contact

### Goal

Help visitors call the correct team and reach the correct entrance with or without an interactive map.

### Required content order

1. Canonical hospital name and short location summary
2. Verified telephone categories and tap-to-call actions
3. Exact address and landmark-based directions
4. Hours and temporary status when maintainable
5. Entrance, vehicle/parking, public-transport, and accessible-entry guidance
6. Text directions followed by optional privacy-reviewed map
7. Email/non-urgent contact with expected handling scope

### Rules and acceptance

- Reconcile all published phone conflicts before implementation; never copy values independently across templates.
- “Around Gotera Condominium” and extracted map coordinates are not sufficient on their own.
- Map failure does not remove address, directions, contacts, or hours.
- On-site testing confirms that a first-time visitor can reach the intended entrance from the written directions.

## 10. Search results

### Goal

Connect visitors to accurate doctor, service, patient-information, and location pages without acting as a diagnostic tool.

### Required behavior

- Accept spelling variants and approved English/Amharic synonyms.
- Clearly label each result type and show a useful context snippet.
- Preserve query and filter state in the URL.
- Offer correction/reset and contact help for zero results.
- For a clinically governed list of urgent terms, show approved emergency guidance and call action before or alongside ordinary results.

### Query, result, and privacy contract

- Search is a navigational tool for public doctor, service, patient-guide, and location records. Its label and hint must not solicit a patient name, contact details, medical history, or a free-form care narrative.
- The baseline is a submitted GET search so it works without JavaScript and preserves bounded `q`, approved result type, and page state for refresh, Back/Forward, and sharing. Rendered query text is escaped and length-limited.
- Because even a navigational query may reveal health information, Privacy and Security must approve query logging, access, retention, deletion/redaction, abuse monitoring, cache behavior, and referrer policy before launch. Avoidable telemetry and outbound referrers must not expose queries.
- Analytics, pixels, session replay, chat, and remote autocomplete receive no query or query-derived classification unless their named purpose, minimization, recipients, retention, failure behavior, and approval are documented. Search remains complete without them.
- Search indexes only approved, current, public records. Unpublished or expired records and fields disappear from results, snippets, filters, suggestions, and counts without leaking their prior content.
- Typed results are limited to approved Doctor, Service, Guide, and Location records. Type filters appear only for maintained types and never expose gated content.
- Suggested spelling correction is an explicit user choice; clinically meaningful wording is not silently replaced. Snippets use approved source content and explain the match without inferring a diagnosis or echoing unsafe markup.
- An approved urgent-term match adds static emergency guidance before filters and ordinary results, keeps ordinary results available, and never states that the visitor has an emergency. If the urgent-term policy or required translation is unavailable or stale, condition-term search is not presented as release-ready.

### Required states

- Initial/no query with specific validation only after an attempted empty submission
- Results, type-filtered results, and paged results with a politely announced count
- Approved urgent-term match with verified call action
- Suggested correction requiring explicit acceptance
- Zero results with retained query and safe task/contact alternatives
- Timeout, offline, and index failure with retry and staffed fallback
- Unpublished/expired result removal and genuine unavailable destination behavior
- No-JavaScript operation and unavailable-translation behavior

### Rules and acceptance

- Do not diagnose, recommend treatment, estimate urgency, or call the feature a symptom checker.
- Search analytics and other third parties must not collect sensitive queries without explicit privacy approval and documented handling; first-party logs, caches, and referrers follow the same reviewed data-minimization boundary.
- Relevance tests use approved real-world tasks in both supported languages.
- Keyboard and screen-reader tests cover search, type filters, count announcements, urgent guidance, correction, pagination, zero/failure recovery, and Back/Forward continuity without unexpected focus movement.

## 11. About the Hospital

### Goal

Build trust through clear, verifiable institutional information rather than unsupported promotional claims.

### Required content

- Approved story, mission, vision, and values
- Approved leadership with roles and current-tenure review
- Evidence-dated capacity/facility facts only where useful to patients
- Approved partner/insurer relationships with a plain explanation of what each means
- Contact/care-discovery action

### Rules and acceptance

- Resolve the conflicting/duplicated mission source before publication.
- Verify the five historical milestones, leadership, 115/96-bed figures, jobs, experience, patient count, “first pulmonologist,” and airport-proximity claims.
- Partner logos require active-relationship confirmation and usage rights.
- Avoid a management-heavy page that obscures patient tasks.

## 12. Careers

### Goal

Show only real, current vacancies and give candidates a trustworthy, privacy-aware application route.

### Required content

- Job title, team, location, employment type, responsibilities, criteria, closing date, and application process
- Recruitment privacy information and safe contact route
- Explicit expired/filled state with route back to current vacancies

### Vacancy and application contract

- Each vacancy has one stable public identifier, a named HR owner, approved opening and closing instants with a stated timezone, a current status, source, reviewed date, and review/expiry rule. Public identifiers and URLs never contain candidate data.
- A vacancy is current only while its approved status is open and the current time is within its approved publication window. Closing, filling, withdrawal, expiry, or loss of the approved application/privacy route removes the Apply action immediately and removes the record from current lists, search, and sitemaps.
- Old vacancy destinations return an honest closed, filled, withdrawn, unavailable, 404, or 410 state with a route to current vacancies. Redirect only when HR has approved a genuinely equivalent successor; never silently send every old role to Careers or an unrelated vacancy.
- Before candidate data leaves the site, identify the application destination and provide approved recruitment privacy information covering purpose, requested data/files, recipients, access, retention, deletion/rights, contact, and any external provider or cross-border handling that applies.
- Internal forms, external recruitment systems, email addresses, uploads, analytics, logs, pixels, and referrers may receive candidate information or application state only through an explicitly approved, secured data flow. Application failure must not route data to an ungoverned fallback.
- A no-current-vacancies state gives the last-checked date and does not show disabled vacancy cards, “coming soon,” speculative-application instructions, or an ungoverned mailbox/form.
- Equal-opportunity, accommodation/access-support, recruitment-response, and fraud-warning wording must be approved for the hospital and applicable jurisdiction. Do not copy or infer policy language.
- If an internal application form is introduced, it requires its own field/data-minimization review and form-state specification before implementation; the Careers listing alone does not approve that form.

### Rules and acceptance

- Phase 2 unless HR owns a maintained workflow for creating, reviewing, expiring, and responding to vacancies.
- Do not leave an empty vacancy shell or accept candidate data into an ungoverned mailbox/form.
- Expired vacancies leave the sitemap and return an appropriate state or redirect only to a genuinely relevant successor.
- Recheck vacancy status and application-route approval when Apply is activated so a stale page or cache cannot keep a closed role actionable.

## Cross-template test matrix

Test every applicable template at minimum in these conditions:

| Dimension | Required coverage |
| --- | --- |
| Viewport/reflow | 320 CSS px, representative 360 px mobile, tablet, desktop, 200% and 400% zoom |
| Input | Keyboard only, touch, pointer; voice-control spot checks where available |
| Assistive technology | Agreed screen reader/browser pairs for mobile and desktop |
| Language | English, Phase 1 Amharic scope, unavailable-translation behavior, long text expansion |
| Network/runtime | Constrained mobile network, cold cache, JavaScript failure, third-party/map failure |
| Content | Long names/titles, missing optional data, expired record, duplicate/canonical record, no results |
| Interaction | Default, hover, focus, active, disabled, loading, error, success, retry, back/forward, deep link |
| Safety/privacy | Emergency routing, sensitive-data leakage, analytics/logging, consent, timeout, repeated submission |
| Comprehension | Correct starting route, emergency-versus-routine distinction, request-versus-booking meaning, unfamiliar-term understanding, and useful recovery in approved English/Amharic |
| Benchmark guardrails | No copied operational facts or unsupported portal, international, clinical-routing, payer, result, medication, proxy, or quality capability |

## Definition of page-ready

A page is ready for public release only when:

- All linked Must requirements pass and have evidence.
- Visible operational and clinical claims have named approvers and current sources.
- Required English and Phase 1 Amharic content is approved.
- All applicable states and failure paths are implemented and tested.
- Accessibility, responsive, performance, privacy, security, and SEO acceptance passes.
- The page has a maintained owner, review date, and expiry/review interval.
