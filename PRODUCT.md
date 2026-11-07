# Hallelujah Hospital

<!-- impeccable:product-schema 1 -->

## Platform

web

## Context and Authority

Initialized on 7 November 2026 from the current implementation and fresh local
renders, with user confirmation of the foundations to preserve. Current progress
is the baseline; older documentation is historical context, not an instruction
to undo implemented progress. Preserve the hospital identity, care journeys, and
content-verification safeguards. Resolve conflicts by inspecting current code,
content provenance, and confirmed user direction rather than copying old plans.

This record describes product intent and observed implementation. An implemented
preview does not establish a real hospital capability or publication approval.

## Users

The working primary audience is patients, prospective patients, families, and
companions seeking care or planning a visit to Hallelujah General Hospital in
Addis Ababa, Ethiopia. Help people who know which doctor or service they need as
well as people who need help finding a starting point.

The hospital is also a stakeholder: the user explicitly requested that its
presentation goals be included alongside visitor tasks. The user delegated the
working priority framework below; audience research and a ranked business
conversion target have not been supplied.

Referring clinicians and people evaluating the hospital are supported by existing
referral and institutional content. Their priority relative to patient tasks
remains open.

## Product Purpose

Help visitors find suitable care, understand their next step, request an
appointment when that workflow becomes operational, and prepare for a visit.
Keep contact, directions, and emergency information easy to find.

Also give the hospital room to explain who it is, what care it offers, and why
someone might consider it. Present its clinicians, specialties, equipment,
facilities, approach to care, useful resources, and approved institutional
evidence. Support this presentation with facts rather than invented claims.

Working priorities, proposed under the user's delegation:

1. Make care discovery and the next action understandable.
2. Present the hospital's identity and breadth of care with credible evidence.
3. Help visitors plan arrival, prepare questions, and understand visit steps.
4. Build understanding through educational resources and approved stories.
5. Support referrals and institutional relationships without obscuring patient
   tasks.

Success means visitors can identify a relevant next step and understand what is
available, while the hospital can present approved information clearly. Numerical
targets, conversion weighting, and analytics measures remain undecided.

## Positioning

The current site presents Hallelujah General Hospital in Addis Ababa through a
whole-person care message: “Care for your whole life.” This is the implemented
message, not evidence of clinical superiority. No exclusive clinical advantage,
accreditation, outcome claim, or competitive ranking has been confirmed here.

## Operating Context

- The existing application is a Next.js/React web app in `apps/web`, with shared
  design-system components and templates, website-specific composition, Payload
  CMS integration, and PostgreSQL-backed content and appointment foundations.
- Start the local preview from the repository root with `pnpm dev`. Many current
  visitor routes require local demonstration mode; do not equate their local
  availability with staging or production availability.
- The current interface is English. It acknowledges Amharic, but reviewed
  Amharic pages are unavailable. Do not imply a complete bilingual experience.
- The shared shell connects care discovery, appointments, visit information,
  hospital information, contact, and emergency routes. Preserve continuity
  between a selected doctor or service and the appointment journey.

## Capabilities and Constraints

- Current surfaces include the homepage, doctor directory and profiles, service
  directory and details, appointment preview, emergency information,
  patients-and-visitors guidance, referrals, hospital information, health topics,
  news/resources, and feedback preview.
- Care discovery includes search, specialty filtering, and related information.
  The patient guide matches questions to prepared website answers; it is not a
  clinician, diagnostic tool, patient-record system, or live booking agent.
- The current appointment page simulates requests without sending or saving
  answers. A request is distinct from a confirmed appointment. Backend
  foundations do not make this preview an operational booking service.
- Feedback composition and review stay in page memory; sending is unavailable
  in the current preview. Do not introduce a live submission claim without
  implementing and confirming the complete workflow.
- Preserve content verification, publication, privacy, and environment controls
  already present in code. Keep unverified, withheld, conflicting, and unavailable
  information distinguishable. Do not infer operational facts from demo fixtures.
- Emergency routes must remain distinct from appointment requests and feedback.
- Opening and visiting hours, access arrangements, department availability,
  accepted insurance, and referral procedures need current hospital confirmation
  where the implementation identifies them as unresolved.
- Branding and presentation may evolve through separately scoped design work.
  Initialization itself does not replace the current visual system.

## Brand Commitments

Preserve the Hallelujah hospital identity and existing emblem. The implementation
uses “Hallelujah General Hospital” as the full name and “Hallelujah Hospital” in
compact contexts. The emblem is bundled at
`apps/web/public/brand/hallelujah-emblem.png`.

The current copy addresses people directly, uses familiar care and visit language,
and explains next steps. Continue that approach while distinguishing factual
hospital information from demonstration material. No additional brand promises
were approved during initialization.

## Evidence on Hand

- `apps/web/src/website/home.tsx` and `apps/web/src/app/` show current visitor
  journeys and institutional presentation. Fresh homepage and doctor-directory
  captures at mobile, tablet, and desktop widths were inspected during init.
- `apps/web/src/website/hospital-contact.ts` supplies contact and location values
  currently used by the preview. Its verification comments are repository
  provenance, not an independent verification performed during initialization.
  Consult the maintained source instead of freezing phone numbers in this file.
- `apps/web/src/demo/site.tsx` and `apps/web/src/demo/data.json` explicitly provide
  fictional clinician and service presentation data. Doctor portraits and demo
  profiles do not prove employment, credentials, or available clinical services.
- `apps/web/src/demo/hospital-statistics.ts` supplies presentation figures;
  `apps/web/src/demo/patient-stories.ts` supplies fictional patient examples.
  Neither is approved institutional or clinical evidence.
- `apps/web/src/demo/partners.ts` records logos and names migrated from the old
  hospital homepage, with current relationships and rights awaiting review.
  Listing a logo does not confirm an insurer is accepted or a partnership exists.
- `apps/web/public/editorial/` contains concept care imagery and preview media.
  Generated people and settings must not be represented as photographs of actual
  staff, patients, or hospital facilities. Approve replacement media and its
  factual context together.
- `apps/web/src/content/` contains structured verification and content-lifecycle
  foundations. Their presence does not certify every visible preview claim.

## Product Principles

1. Serve visitor needs and hospital presentation together; make each institutional
   section useful and keep practical care actions easy to reach.
2. Build on current progress while preserving confirmed identity and care journeys.
3. Make claims proportional to evidence. Never turn fictional or historical
   material into current hospital facts by repetition.
4. State what happens next, especially when a request needs confirmation or an
   action is unavailable.
5. Support preparation and informed conversations without replacing clinical care.

## Accessibility & Inclusion

Retain the current foundations for responsive layouts, keyboard access, visible
focus, skip navigation, reduced motion, and accessible form states. Care and visit
information must remain usable when animation is reduced or an enhancement is
unavailable. These are implementation foundations, not a claim of audited
conformance. A required conformance standard has not been confirmed.

Do not promise physical access, interpretation, or companion arrangements before
hospital confirmation. Preserve Ethiopian context and the distinction between
available English content and unavailable reviewed Amharic content.

## Open Decisions

- Hospital-approved audience research and the final ranking of business goals.
- The verified clinical differentiators and institutional proof to publish.
- Approved clinician, service, equipment, facility, story, statistics, and
  relationship records replacing preview material.
- Operational launch scope for appointment requests, feedback, and referrals.
- Translation scope, accessibility conformance target, and measurement plan.
