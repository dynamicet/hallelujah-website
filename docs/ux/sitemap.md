# Proposed Sitemap and Release Scope

**Status:** Phase 1 route scope approved for backlog planning under `GOV-02`; route-specific publication gates remain  
**Principle:** Organize the site around patient tasks, not internal reporting lines.

**Benchmark basis:** The route hierarchy incorporates the task-first, urgency-separated, multi-entry discovery, connected-record, practical-access, and bilingual patterns mapped in the [benchmark traceability register](../benchmarks/benchmark-traceability.md). Benchmark portal, international-care, live routing, and integrated-record patterns remain conditional or deferred; their presence on another hospital site does not create a Hallelujah route.

## Navigation model

### Primary navigation

1. Find a Doctor
2. Services
3. Appointments
4. Patient & Visitor Information
5. Locations & Contact

### Persistent utility actions

- Emergency
- Call
- Search
- Language: Amharic / English, with honest availability signaling

### Secondary navigation

- About the Hospital
- Referring Clinicians — Phase 2, when the referral route is operationally defined
- Health Information / News — Phase 2, when content governance exists
- Careers — Phase 2, when the recruitment workflow is maintained
- Patient Portal — only if a supported portal exists

## Site tree

```text
Home
├── Emergency
├── Find a Doctor
│   └── Doctor Profile
├── Services
│   └── Service Detail
├── Appointments
├── Patient & Visitor Information
│   ├── Before Your Visit
│   ├── During Your Visit
│   ├── After Your Visit
│   ├── Payment and Insurance
│   ├── Visiting Information
│   ├── Accessibility Support
│   ├── Patient Rights and Feedback
│   └── Frequently Asked Questions
├── Locations & Contact
│   └── Location Detail (when more than one maintained location exists)
├── Search Results
├── About the Hospital
├── Referring Clinicians [Phase 2]
├── Health Information / News [Phase 2]
└── Careers [Phase 2]

Utility
├── Privacy Notice
├── Accessibility Statement
└── 404 / unavailable content

Conditional/deferred utility routes
├── Cookie Information (only if an approved decision requires a separate page)
└── Terms / Legal Notice (only if legal review requires it)
```

## Phase 1 route inventory

| Route pattern | Template | Indexable | Primary action | Publication gate |
| --- | --- | --- | --- | --- |
| `/` | Home | Yes | Start an essential journey | Approved featured records and claims |
| `/emergency/` | Emergency | Yes | Call verified emergency/ambulance route | Numbers, scope, entrance, hours, public-emergency distinction |
| `/doctors/` | Doctor directory | Yes | Find an approved clinician | Approved current roster and taxonomy |
| `/doctors/{doctor-slug}/` | Doctor profile | Yes | Request appointment / call | Approved profile and truthful request guidance; schedule omitted until approved |
| `/services/` | Service directory | Yes | Find appropriate service | Approved 39-record taxonomy or smaller launch subset |
| `/services/{service-slug}/` | Service detail | Yes | Request care | Clinical scope, owner, location, hours, and urgent exceptions |
| `/appointments/` | Appointment request | Yes | Submit a request | Workflow, privacy, consent, SLA, fallback, and secure handling |
| `/patient-information/` | Patient & Visitor hub | Yes | Prepare for a visit | Minimum approved visit, access, payment, and rights content |
| `/contact/` | Locations & Contact | Yes | Call or get directions | Reconciled contacts, hours, entrance, and directions |
| `/search/` | Search results | Conditional | Open appropriate content | Governed synonyms and urgent-term behavior |
| `/about/` | About | Yes | Learn about hospital / contact | Approved mission, story, leadership, and claims |
| `/privacy/` | Privacy notice | Yes | Understand/control data use | Privacy/legal approval |
| `/accessibility/` | Accessibility statement | Yes | Request support / report barrier | Support route and tested conformance statement |

The route patterns in this table are canonical for implementation. Page studies, handoff documents, tests, redirects, and backlog tickets must use these exact paths unless `GOV-02` records an approved change. Phase 1 utility structure and behavior are defined in the [utility page specifications](utility-page-specifications.md) and [utility wireframes](../wireframes/utility-pages.md).

## URL and navigation rules

- Use lowercase, human-readable, stable slugs with one canonical URL per record.
- Redirect retired duplicate doctor/service URLs to the approved canonical record when a genuine successor exists; otherwise return a genuine 404 or 410.
- Keep page context when changing language. When no equivalent exists, explain that clearly and offer nearby translated options.
- Use breadcrumbs on all detail and secondary pages, but not as the only route back.
- Preserve search/filter state in the URL so results can be shared and browser navigation behaves predictably.
- Do not create public empty pages for missing content. Defer the route or provide a truthful, useful alternative.
- Do not create separate competing Departments and Services directories unless patient research demonstrates a distinct need.

## Items intentionally excluded from Phase 1

- Symptom checker, diagnosis, treatment recommendations, or urgency estimation
- Chatbot or unstaffed messaging presented as immediate help
- Real-time wait times without reliable operational data
- Confirmed online booking unless the operational system genuinely confirms appointments
- Public reviews or testimonials without consent, moderation, and claims governance
- Rich interactive maps, video, or virtual tours in the critical path
- International-patient record upload before secure intake and follow-up are operationally approved
- Patient portal, results, prescriptions, proxy access, or personalized reminders without a real supported identity and clinical system
- Dedicated international/regional coordination, virtual care, remote review, or second-opinion routes without verified demand and an approved operating model
- Benchmark-derived academic, quality, cost, payer, or outcome content without local sources, definitions, owners, dates, and expiry rules
- Referring Clinicians, Health Information / News, Careers, and a Patient Portal
- A separate Cookie Information route unless the approved cookie/data-flow inventory and legal review require it
- A Terms / Legal Notice route unless legal review confirms that it is required and supplies an owner, approved content, and review lifecycle
