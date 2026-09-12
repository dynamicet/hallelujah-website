# Careers — Annotated Low-Fidelity Wireframe

**Route:** `/careers/` (Phase 2)  
**Primary question:** “Is there a current role and how do I apply?”  
**Primary action:** Review and use the approved application route for a current vacancy  
**Status:** Route and data collection are publication-blocked until HR owns the vacancy lifecycle and Privacy/Security approve every application channel

This page publishes no vacancy, equality claim, mailbox, form, upload, or third-party recruitment link by inference. Bracketed items are governance gates and must never ship as placeholder content.

## Requirement coverage

| Area | IDs |
| --- | --- |
| Global shell, accessibility, reflow, fallback, performance, governance, patient language | `G-001`–`G-016` |
| Form security, privacy, third parties, language continuity | `S-002`–`S-008` |
| Canonical contact fallback | `C-001` |
| Careers and vacancy handling | `I-004` |

`S-001` remains a sitewide release gate. Careers remains Phase 2 even if its low-fidelity structure is approved.

## Mobile wireframe — 360 px review frame

```text
┌────────────────────────────────────┐
│ [Skip to main content]             │
│ {CR0} [APPROVED LOGO]              │
│       [Emergency]         [Menu]   │
│ Home > Careers                     │
├────────────────────────────────────┤
│ MAIN                               │
│ {CR1} H1: Careers                  │
│       [APPROVED RECRUITMENT        │
│        ORIENTATION; NO CLAIMS]     │
│       [Jump to current vacancies]  │
├────────────────────────────────────┤
│ {CR2} H2: Current vacancies        │
│       [APPROVED COUNT + AS-OF DATE]│
│       [STATE: no current roles]    │
├────────────────────────────────────┤
│ {CR3} [APPROVED VACANCY RECORD]    │
│       H3: [JOB TITLE]              │
│       Team | location | type       │
│       Closing: [DATE + TIMEZONE]   │
│       H4 Responsibilities          │
│       [APPROVED SUMMARY/LIST]      │
│       H4 Criteria                  │
│       [APPROVED SUMMARY/LIST]      │
│       H4 How to apply              │
│       [APPROVED PROCESS]           │
│       [Review recruitment privacy] │
│       [Apply through approved route]│
├────────────────────────────────────┤
│ {CR4} H2: Before you apply         │
│       [VERIFY: purpose, data,      │
│        recipients, retention,      │
│        rights/contact, provider]   │
│       [Recruitment privacy notice] │
├────────────────────────────────────┤
│ {CR5} [STATE: no current vacancies]│
│       Honest status + checked date │
│       No speculative applications │
│       [OPTIONAL APPROVED HR CONTACT]│
├────────────────────────────────────┤
│ {CR6} [STATE: vacancy closed,      │
│        filled, or withdrawn]       │
│       No Apply action              │
│       [View current vacancies]     │
│       [Relevant successor only     │
│        when explicitly approved]   │
├────────────────────────────────────┤
│ {CR7} [APPROVED EQUAL-OPPORTUNITY  │
│        AND ACCESS SUPPORT WORDING] │
│       [VERIFY: safe HR contact]    │
├────────────────────────────────────┤
│ {CR8} Vacancies last checked:      │
│       [VERIFY: HR owner + date]    │
│       Footer                       │
└────────────────────────────────────┘
```

`CR5` replaces `CR2`–`CR4` when there are no current approved vacancies; it is not shown alongside an empty list. `CR6` is the destination behavior for a stale/deep link or previously shared vacancy, not default page content.

## Desktop wireframe — 1280 px review frame

```text
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│ [Skip] [APPROVED LOGO] [Doctors] [Services] [Appointments] [Patient info] [Locations]      │
│                         [Search] [Language] [Call] [Emergency]                          {CR0}│
│ Home > Careers                                                                             │
├────────────────────────────────────────────────────────────────────────────────────────────┤
│ H1 Careers                                                                            {CR1}│
│ [APPROVED RECRUITMENT ORIENTATION] [Jump to current vacancies]                             │
│                                                                                            │
│ H2 Current vacancies [APPROVED COUNT + AS-OF DATE]                                    {CR2}│
│ ┌──────────────────────────────────────────────────────┐ ┌───────────────────────────────┐ │
│ │ [APPROVED VACANCY]                              {CR3}│ │ Before you apply          {CR4}│ │
│ │ H3 [JOB TITLE]                                         │ │ [approved privacy summary]    │ │
│ │ Team | location | type | closing date/timezone          │ │ [Recruitment privacy notice]  │ │
│ │ Responsibilities | criteria | application process       │ │ [approved provider notice]    │ │
│ │ [Review privacy] [Apply through approved route]          │ └───────────────────────────────┘ │
│ └──────────────────────────────────────────────────────┘                                   │
│ [REPEAT APPROVED CURRENT RECORDS ONLY; no unmaintained filters or pagination]               │
│                                                                                            │
│ [STATE: no current vacancies; replaces list/privacy action]                           {CR5}│
│ [STATE: closed/filled/withdrawn; no Apply; current-list recovery]                      {CR6}│
│                                                                                            │
│ [APPROVED EQUAL-OPPORTUNITY + ACCESS SUPPORT + SAFE HR CONTACT]                       {CR7}│
│ [Vacancies last checked: APPROVED HR OWNER + DATE]                                    {CR8}│
├────────────────────────────────────────────────────────────────────────────────────────────┤
│ Footer: core tasks | canonical contacts | privacy | accessibility | language scope           │
└────────────────────────────────────────────────────────────────────────────────────────────┘
```

The privacy support rail follows the vacancy introduction in DOM order and becomes in-flow before any application action at reflow. A visually adjacent summary never replaces the full disclosure reached before candidate data leaves the site.

## Section map — purpose, requirements, and content ownership

| ID | Purpose and user need | Requirement IDs | Content and owner dependencies |
| --- | --- | --- | --- |
| CR0 | Identify the hospital, show secondary-page location, and preserve essential patient routes. | `G-001`–`G-006`, `G-010`, `G-013`, `S-006`–`S-008` | Approved shell, labels, canonical route and translations: Brand + Product + Content. |
| CR1 | Explain the recruitment scope without unsupported employment claims and route directly to current records. | `I-004`, `G-002`, `G-010`, `G-015` | Recruitment introduction and any employment proposition: HR + Executive + Content. |
| CR2 | Establish whether current, approved vacancies exist and when the list was checked. | `I-004`, `G-011`, `G-014`–`G-015` | Publishable record count, deterministic order, as-of date and update schedule: HR. |
| CR3 | Give a candidate enough approved role information to decide whether and how to apply. | `I-004`, `G-010`, `G-013`–`G-015` | Unique public ID; title, team, location, type, responsibilities, criteria, closing instant/timezone, process, status and owner: HR + hiring owner. |
| CR4 | Explain data handling before the candidate enters or sends any personal data. | `S-003`–`S-005`, `I-004` | Purpose, fields/files, recipients, provider, access, security, retention, deletion/rights, contact and cross-border handling if relevant: Privacy/legal + Security + HR. |
| CR5 | Provide an honest no-current-roles state without soliciting ungoverned speculative applications. | `I-004`, `G-011`, `G-014`–`G-015`, `C-001` | Approved state copy, checked date and optional purpose-specific HR contact/hours: HR + Content + Operations. |
| CR6 | Recover safely when an old vacancy is closed, filled, withdrawn, or unavailable. | `I-004`, `G-011`, `G-013`–`G-015` | Status, effective time, archive/404/410 policy and explicitly relevant successor decision: HR + Delivery. |
| CR7 | State only legally and operationally approved equal-opportunity, accommodations, fraud-warning, and support wording. | `I-004`, `S-004`, `C-001` | Exact policy, jurisdictions, accessible application support, verified HR route and monitoring hours: HR + Privacy/legal + Operations. |
| CR8 | Make vacancy currency and accountability visible. | `G-014`, `I-004` | Public checked date/owner label and internal source, reviewer, next-review/expiry rule: HR + Content. |

## Section map — layout, components, and outcomes

| ID | Layout and hierarchy | Reusable components | Interaction and navigation outcome |
| --- | --- | --- | --- |
| CR0 | Secondary-page shell with wrapping breadcrumb. | Skip link, header/menu, breadcrumb, language switcher, essential actions. | Home → `/`; current page text; language keeps context only when vacancy and policy equivalents exist. |
| CR1 | Reading-width `intro`; restrained, text-first. | Page introduction, in-page link. | → `#current-vacancies`; no auto-scroll requirement under reduced motion. |
| CR2 | Status immediately before records. | Result count/status, review metadata. | Count is static/server-rendered or politely announced after a user navigation update. |
| CR3 | One complete governed record per section/card; no nested fully clickable card. | Vacancy card, headings/lists, date, application link. | Apply action opens only the approved internal or clearly labeled external route for that vacancy; no candidate data in URL. |
| CR4 | `support` before the first data-transfer action; may repeat a short notice per vacancy. | Information alert, privacy link, external-provider notice. | → approved recruitment privacy notice; external destination/provider and behavior are clear before leaving. |
| CR5 | Replaces collection with one useful `empty` state. | Empty state, optional purpose-labeled call/email link. | No application collection; optional approved HR contact or return to Home/care routes. |
| CR6 | `unavailable` state for stale destination/deep link. | Status alert, current-list link, optional genuine successor link. | → `/careers/#current-vacancies`; redirect only to explicitly approved equivalent/successor. |
| CR7 | Reading-width `support` near applications and again where access help is needed. | Information content, contact link. | Approved HR/application-support route; never Emergency or general patient mailbox by default. |
| CR8 | Quiet metadata after vacancy collection/state. | Review metadata, footer. | No interaction required; status remains inspectable in print/no-JS output. |

## Section map — responsive states and cross-cutting gates

| ID | Mobile, tablet, desktop behavior | Applicable states | Accessibility, bilingual, safety, privacy, performance, motion | Open decisions and approval gates |
| --- | --- | --- | --- | --- |
| CR0 | Compact menu/emergency; full navigation wide; breadcrumb wraps. | Current route, menu, translation unavailable. | Logical focus, 44 px targets, LTR, label expansion, reduced motion. | Approved labels and Phase 2 language scope. |
| CR1 | One column; no recruitment video/oversized promotional hero. | Default, route deferred. | One H1; HTML first; in-page link exposes visible focus target; no unsupported culture/outcome claims. | Recruitment introduction and claims approval. |
| CR2 | Count/date wrap; no toolbar until a maintained volume proves need. | Current records, no records, data unavailable. | Status not color-only; server-rendered baseline; no skeleton of fictional jobs. | Ordering, refresh cadence, count grammar and owner. |
| CR3 | One complete record compact; one reading column wide with optional support rail. | Open/current, close approaching, closed, filled, withdrawn, record error. | Semantic headings/lists; explicit date/timezone; 44 px Apply; no hover-only detail; stable public ID; no PII in URL. | All role fields, canonical ID, status, close instant, application destination and response handling. |
| CR4 | Full disclosure link before Apply; rail moves in-flow on reflow. | Approved, provider unavailable, notice unavailable, route failure. | Visible destination; secure transport; no unapproved analytics/pixels; form/upload/mail does not activate before user action. | Data inventory, lawful basis as applicable, recipients, retention, rights, security, provider and failure behavior. |
| CR5 | Single readable state at all widths. | No current records, workflow paused. | No disabled Apply or “coming soon”; no speculative CV request; checked date visible. | Whether an approved maintained HR inquiry route exists. |
| CR6 | One state panel; long title/status wraps. | Closed, filled, withdrawn, unknown/removed. | Genuine 404/410/canonical behavior; safe Back/current-list route; no stale cache or search leakage. | Status vocabulary, retention/archive, redirect and cache/index rules. |
| CR7 | One reading column; directly associated with relevant application action. | Approved wording, support unavailable. | Policy not inferred; contact is purpose-labeled; access request path works by keyboard/screen reader. | Equal-opportunity language, accommodation process, fraud warning, HR contact and translations. |
| CR8 | Wraps; not tiny or low-contrast. | Current, review due, expired. | Machine-readable date; stale required records auto-unpublish; no script dependency. | Public owner label and expiry interval. |

## State inventory

| State | Presentation and recovery |
| --- | --- |
| Current vacancies | Only approved records whose open time has started, close time has not passed, status is open, and application route/privacy disclosure are current. |
| No current vacancies | Show an approved checked date and do not render vacancy cards, disabled Apply actions, speculative application instructions, or an ungoverned mailbox/form. |
| Vacancy close approaching | The exact approved closing date, local time and timezone remain visible. Do not use urgency animation or a countdown timer. |
| Closed/filled/withdrawn | Remove Apply immediately, remove the record from current lists/search/sitemaps, and give the precise approved status plus current-vacancies route. Use a successor only when HR explicitly confirms equivalence. |
| Vacancy record expired/stale | Automatically withhold it. A stale cache must not keep Apply active; controlled unavailable behavior replaces the record until HR resolves it. |
| Application provider unavailable | Keep the role readable, say the application route is unavailable, and show an approved HR fallback only if it accepts applications safely. Do not redirect to an ungoverned channel. |
| Privacy notice/handling unapproved | Do not activate Apply, collect a CV, or publish an application email/form/provider link. This blocks the vacancy from being actionable and normally blocks publication. |
| Unavailable translation | Stay in context, explain which content/policy is unavailable, and offer approved nearby routes. Do not preserve an Apply action if the candidate cannot understand the required privacy/process terms. |
| No JavaScript/images/fonts | Current role fields, closing date/timezone, responsibilities, criteria, privacy link, application destination label, closed/no-role states and HR support remain semantic HTML. |

## Vacancy identity, application, and focus contract

```text
Careers → current approved vacancy `{stable-public-id}`
        → read complete role and closing instant
        → read recruitment privacy/process information
        → explicit Apply action
        → approved internal form or clearly named external provider
        → provider acknowledgement only; no hiring-outcome promise

Closed/filled/withdrawn vacancy
        → Apply removed immediately
        → removed from current list, search and sitemap
        → honest status or genuine 404/410
        → current vacancies; successor only if HR approves equivalence
```

- Vacancy URLs, anchors, analytics and referrers contain only the public record ID and safe navigation state, never a candidate name, contact information, CV filename, assessment result or application status.
- If an internal form is later introduced, it inherits the form security, persistent-label, validation, data-retention, failure-recovery and authoritative-success rules; that would require a separate form wireframe before implementation.
- Focus order is `Skip → shell → breadcrumb → H1 → current-vacancy status → vacancy heading/fields → privacy information → Apply → equality/access support → review metadata → footer`.
- Returning from a third-party provider should restore the vacancy context where possible without claiming that an application was received unless the authoritative provider confirms it.

## Publication and approval gates

- HR assigns a named vacancy owner and demonstrates a maintained create → review → approve → schedule/open → update → close/withdraw/fill → remove/archive workflow before `/careers/` launches (`I-004`).
- HR + hiring owner approve every visible title, team, location, employment type, responsibility, criterion, closing instant/timezone, application process, public ID and status (`I-004`, `G-014`–`G-015`).
- Privacy/legal + Security approve purpose, data/files, recipients, access, provider/subprocessors, transport, retention, deletion/rights, candidate contact route, logs/analytics, cross-border handling where relevant, failure behavior and public notice (`S-002`–`S-005`, `I-004`).
- HR + Privacy/legal approve exact equal-opportunity, reasonable-adjustment/access-support, fraud-warning and response wording; none is inferred from another employer or jurisdiction.
- Content + HR approve English/Amharic scope and all process/privacy translations. An application action cannot remain available behind untranslated consequential terms (`S-006`–`S-008`).
- Delivery + QA test lifecycle timing, stale cache/search/sitemap removal, direct/deep links, 404/410/redirect behavior, external-provider failure/return, 320 px/400% zoom, keyboard/screen reader, no JavaScript, long bilingual role data and constrained performance.
