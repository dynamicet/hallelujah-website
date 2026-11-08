# Care structure and booking frontend plan

- **Prepared:** 8 November 2026
- **Scope:** Existing homepage, navigation, care directories, detail pages, appointment journey, and frontend data contracts
- **Execution state:** Frontend implemented; backend integration remains out of scope
- **Authority:** The user’s decisions in the care structure and booking discussion

Improve the existing website so patients can find care through doctors or specialties/services and carry their selections into an appointment request. Keep the current page systems and visual direction. Prepare consistent frontend data and a future submission payload; backend integration and saving are outside this work.

## Agreed boundaries

- Use realistic mock copy and content wherever needed. Do not put “illustrative,” “unverified,” “preview only,” or replacement-content disclaimers in the patient interface. Keep fixture provenance in code or documentation.
- Do not extract or import all departments, doctors, or services from the live hospital site. Use a small representative dataset to establish relationships, page variations, filtering, and booking journeys.
- Retain the existing homepage, directories, profiles, detail pages, and appointment flow. Make targeted changes rather than rebuilding these systems.
- Keep doctors separate from one combined specialty/service collection.
- Doctors can have multiple specialties and can provide specific services. These links are explicit; specialty membership does not imply provision of every related service.
- Carry only the patient’s selections into booking, rather than every affiliation of the selected doctor.
- Support doctor only, specialty/service only, both together, and help choosing.
- Prepare frontend types, relationship lookup, validation, selection state, and payload assembly for later integration.
- Do not connect the form to an API, send patient details, save requests, introduce browser persistence, change database schemas, or modify backend request handlers. Existing collection restrictions remain in place.
- Keep accurate action and outcome wording. A local interaction must not claim that a real request was sent, saved, or confirmed. Content disclaimers are unnecessary; truthful interaction outcomes remain necessary.

These instructions govern this frontend work where older planning documents require repeated fixture disclaimers or broader source reconciliation. They do not expand the work into publication or backend integration.

## Existing implementation and changes

| Area | Already implemented | Work for this plan |
| --- | --- | --- |
| Navigation | Home, Doctors, Services, Appointment, Patients & Visitors; Emergency access; footer links | Standardize labels where useful; preserve routes and avoid separate department/clinic menus |
| Homepage | Care search, appointment action, specialty cards, featured doctors, visit guide, directions, hospital content | Align labels, destinations, mock content, and relationships with the directory; no additional major section |
| Services directory | Search, grouping/filtering, pagination, detail links, preparation-guide separation | Apply the agreed taxonomy and representative data; remove duplicate destinations and inappropriate booking options |
| Care detail | Shared content structure, preparation/referrals, related doctors, appointment links | Vary sections/actions by offering; render useful mock copy; retain context when navigating to doctors |
| Doctor directory/profile | Search/filtering, profiles, related care, appointment links | Use explicit specialty and service links; preserve context when navigating to related care |
| Patient information | Patients & Visitors, preparation guides, Emergency, Referrals, homepage visit content | Place hospital-setting/support information here when it does not merit a care offering |
| Appointment interface | Three starting choices, doctor/service preselection, doctor identity, service context, contact details, review and simulated states | Make selection bidirectional, editable, valid, and payload-ready; retain both IDs |
| Frontend data | Service groups/synonyms, clinician details, local sample records and relationship helpers | Introduce a small consistent classification and explicit relationship data; replace hardcoded specialty-name mappings |
| Backend foundation | Content and relationship contracts, request API/database foundation | Read as integration context only; leave unchanged and document the future contract difference |

## Content and relationship rules

### Patient terminology

- Keep **Services** as the navigation label. Use **Specialties & services** for the directory heading and **specialty or service** where the booking selector needs clarity.
- Do not make departments and clinics separate parallel directories.
- Combine department, clinic, specialty, and plain-language names into one canonical entry when they describe the same care. Alternative names support search.
- Retain a distinct clinic/program only if its audience, team, schedule, location, or access process gives the patient a different task.
- Keep broad groupings separate from actual care options: Medicine can group Cardiology and Internal Medicine without making patients navigate through it first.
- Preserve distinct specialties even when they share an organizational department or body system.

### Minimal frontend model

Extend or adapt existing frontend views rather than introducing another competing source of care data.

| Record or relationship | Required purpose |
| --- | --- |
| Care entry | Stable ID, canonical route, name, alternative names, specialty/service kind, browsing group, page content, access method |
| Doctor | Stable ID, canonical route, profile content; links resolved through explicit relationships |
| Doctor–specialty link | Declares clinical affiliation; drives specialty filtering and specialty care teams |
| Doctor–service link | Declares provision of that particular service; drives service care teams and valid joint selections |
| Service–specialty link | Connects specific offerings to relevant specialties without automatically assigning doctors |

Use existing IDs wherever possible. The combined collection can remain named `services`; do not rename it or `service_id` solely for terminology. Separate link meanings through the target entry’s kind where that is sufficient.

Care access methods: appointment request, contact team, referral/admission, and emergency information. This behavior is independent of whether an entry represents a specialty or service.

Hospital information does not need a new clinical record type: reuse patient information/preparation pages where appropriate. Keep Emergency prominent and outside the ordinary appointment selector. ICU and inpatient admission must not become generic appointment choices.

### Representative content coverage

Use the existing featured specialties and doctors as a starting point. Add or adjust only enough mock records to demonstrate:

- A doctor with multiple specialties.
- A specialty with multiple doctors.
- A specific service linked to a specialty and a subset of its doctors.
- A service shared across specialties where useful.
- A team-delivered service without a selectable doctor.
- A care entry with a contact or referral access method.
- Hospital-stay information presented as practical guidance.

For example, Cardiology and a related examination can demonstrate the difference between specialty membership and provision of a specific service. These are sample relationships, not a hospital-wide catalog.

## Page and navigation work

### Homepage and shared navigation

Keep the existing composition. Specialty cards and featured doctors must resolve to the same records and labels used elsewhere. Preserve plain-language names paired with familiar specialty terminology where helpful. Keep appointment, doctor search, service discovery, visit guidance, and Emergency readily accessible.

Do not introduce new Departments or Clinics sections. Keep `/appointment` and `/patients-visitors`; earlier conversational examples using `/appointments` and `/patient-information` do not require route changes. About and contact content already have destinations; no new contact page is required by this plan.

### Services directory and detail

Use one directory with understandable groups. A provisional grouping is Specialist care, Tests & treatments, and Hospital care & support; implement only groups supported by the sample content. Hospital support content may instead be linked as guidance rather than appearing among appointment options.

Search canonical names and alternative terms. Keep current search/filter/pagination behavior and empty-result recovery. Use kind-specific detail sections where useful, without displaying an organizational taxonomy lesson.

Show the appropriate care team and access action for each entry. A service with no individually selectable doctor must still have a complete next step. Preserve directory search state when returning to results.

### Doctors directory and profiles

Specialty filters use specialty affiliations, not every service a doctor provides. Specific service relationships can support relevant discovery without being mislabeled as specialties.

Separate profile presentation of specialties and provided services where both appear. Related care links retain the selected doctor when that combination is valid. Continue to allow browsing all doctors without choosing a department first.

## Selection and appointment contract

### Journey matrix

| Path | Selection arriving at appointment |
| --- | --- |
| Doctor → appointment | Doctor only |
| Specialty/service → appointment | Specialty/service only |
| Specialty/service → related doctor → appointment | Both |
| Doctor → related specialty/service → appointment | Both |
| General appointment action | Neither; choose or ask for help |

Keep an existing care selection when choosing a related doctor, and keep a doctor selection when choosing related care. Preserve this context across the actual page links, not just within the final form.

Use stable record IDs in route context. Resolve and validate them through the shared frontend data layer; do not trust URL combinations. Names, phone numbers, and other patient details stay out of URLs.

### Form behavior

- Keep the existing starting choices, updating “A service” to “A specialty or service.”
- A doctor-first route can optionally add a related specialty/service.
- A care-first route can optionally choose a linked doctor or retain no doctor preference.
- “Help me choose” allows neither selection.
- Show the selected care and doctor clearly in the form and review step. The distinction between a preference and a confirmed appointment remains clear.
- Editing an upstream choice must never leave an incompatible hidden selection. Keep compatible selections; otherwise clear the dependent choice with a brief explanation and let the patient continue.
- Invalid, unknown, unavailable, or non-requestable URL selections produce a recoverable state instead of silently submitting an invalid combination.
- Keep contact details while editing care within the form; do not add local storage or another persistence mechanism.
- Retain useful first-visit/follow-up presentation, but do not add a new submitted field solely because a UI control already exists. Document whether it belongs in a later integration contract.

### Future payload

Define a frontend-owned request draft and a pure payload builder, with this transport shape as the target:

```ts
type AppointmentRequestPayload = {
  full_name: string
  phone: string
  preferred_date?: string
  doctor_id?: string
  service_id?: string // Specialty or service from the combined collection.
  privacy_acknowledged: true
}
```

Validate contact fields, current entry/access eligibility, and explicit doctor–care relationships when both IDs are supplied. Keep the help/doctor/care UI mode separate from stored facts where possible; it need not become a new backend entity.

The existing backend uses `care_route` and rejects both IDs together. Document that compatibility gap and any ID-format mapping required for later integration. Do not change or call that API in this scope. A future integration will update its validation/persistence contract separately.

The submit action validates and prepares the draft locally for review. The normal outcome must not say “sent,” “saved,” or “booking confirmed.” Keep any simulated receipt scenario separate from normal submission and describe it truthfully. Do not expose raw payloads or developer details in the patient interface, log patient details, or issue network requests.

## Implementation sequence

1. **Baseline and change map.** Recheck current code and relevant tests. Capture the affected pages before editing where comparison is useful. Preserve unrelated work and established design, routes, and interactions.
2. **Shared frontend data.** Add care classification/access settings and explicit mock relationships. Centralize lookups and selection validation. Record fixture provenance outside the UI.
3. **Directories and detail pages.** Align labels, filters, related care teams, content, and access actions. Replace hardcoded relationship mappings and scoped content disclaimers with useful mock copy.
4. **Bidirectional context.** Implement both doctor-first and care-first page-to-page handoffs, including result-return links and invalid-context recovery.
5. **Appointment preparation.** Update editable selectors, selection summary/review, compatible-choice behavior, and the frontend payload builder. Keep submission local and backend code untouched.
6. **Homepage and shared labels.** Connect existing care cards/search/featured doctors to the same records and terminology. Make only necessary hierarchy changes.
7. **Verification and handoff.** Complete targeted automated and browser checks, fix findings, and document the future integration contract and remaining backend work.

## Expected implementation areas

- `apps/web/src/demo/`: representative care/doctor content, relationships, route context helpers, local appointment interactions.
- `apps/web/src/website/`: homepage care presentation, service detail rendering, appointment identity/selection presentation.
- `apps/web/src/app/services/`, `doctors/`, and `appointment/`: route resolution and context handoff.
- `apps/web/src/design-system/templates/`: necessary directory/profile/appointment adjustments, retaining reusable components.
- Frontend view/data helpers and focused scripts/tests where needed; avoid changing governed backend content contracts just to satisfy sample data.
- This plan and a short frontend integration contract in the established documentation area.

Backend handlers, repositories, SQL/migrations, live source imports, deployment, and publication are excluded.

## Execution record

The UI Designer and Frontend Developer implemented the plan together, with shared contract review and collective milestone commits:

- `f180333`: agreed scope and implementation plan.
- `23d69f2`: explicit care relationships, representative records, pure appointment draft preparation and integration contract.
- `dd56210`: aligned directories/detail pages, canonical labels, separate profile specialties/services, bidirectional selection and editable appointment review.
- Final verification milestone: expanded browser coverage, corrected specialty filter slugs, Help-control clearance, consistent related-topic copy and this handoff.

The [frontend integration contract](../architecture/care-selection-frontend.md) documents the final model, payload, ID mapping and existing backend incompatibility. Frontend implementation does not enable appointment collection.

Verification completed on the local development preview:

- Typecheck, lint and an optimized build passed.
- Focused care-selection/payload, care-journey, health-finder, homepage and shell checks passed.
- Directory, profile and appointment contract checks passed, including service-directory validation.
- `pnpm visual:care-continuity` passed at 390, 768 and 1440px: both directions, explicit filters, compatible edits, invalid context, team care, all four selection shapes and no patient-data delivery/storage.
- `pnpm visual:appointment` passed: keyboard error recovery, contact/date validation, local preparation, retained edits, explicit example recovery states, lifecycle cleanup, reduced motion and no-JavaScript contact fallback.
- `pnpm visual:help` passed after updating its earlier always-visible assumption: the launcher keeps its corner anchor, yields to page controls, and remains usable through keyboard access and the header guide entry. The check covers six viewport shapes, topic-page scrolling, menu/dialog focus, context links, reduced motion and lazy-download recovery (`2026-11-08T19-15-36.480Z-help-refinement-myQluX`). Its screenshots were not separately inspected; visual clearance is established by the final responsive run below.

Fresh responsive captures and visual findings are stored under `artifacts/visual-checks/`. Care/home/topic captures are in `2026-11-08T19-10-01.354Z-responsive-chRmmg`; appointment/doctor captures are in `2026-11-08T19-07-59.417Z-responsive-Innyih`. Those inspections found topic-copy and Help-overlap issues. Both were corrected, and the final affected topic/appointment capture `2026-11-08T19-12-34.004Z-responsive-TUq0HI` passed automated checks and separate visual inspection at all three widths. The fully inspected joint-review/prepared states are in `2026-11-08T19-07-56.312Z-care-continuity-1PFdTG`. Automated results and visual inspection are recorded separately in each run. Earlier failed attempts remain historical evidence, not passes.

`pnpm links:check` passed. The repository-wide `pnpm format:check` reports missing final newlines in four pre-existing, ignored `layout-*.json` files under `artifacts/visual-checks/2026-11-08T18-32-55.367Z-mission-vision-Wx3YY4/`. These historical files were not edited. Changed-file whitespace checks passed.

## Acceptance and verification

### Functional acceptance

- All five paths in the journey matrix work with consistent selections and labels.
- Both IDs reach the frontend payload when both are selected; unrelated affiliations are not included.
- One ID and neither-ID cases remain valid where appropriate.
- Specialty filters do not list procedures as specialties.
- A specialty’s doctor membership does not automatically populate every related service’s care team.
- A team service works without an individual doctor; non-appointment care cannot enter the appointment selector.
- Editing selections preserves compatible context and removes incompatible context with understandable feedback.
- Search/filter state and back navigation remain useful.
- Scoped patient-facing pages contain complete mock content without replacement-content disclaimers.
- No patient-data request is sent, persisted, or logged; no normal outcome implies a completed submission.

### Automated checks

Add focused tests for relationship lookup, all selection combinations, incompatible/unknown IDs, access eligibility, payload assembly, and the two bidirectional journeys. Verify that the normal submit interaction makes no appointment API call. Reuse existing browser tooling rather than adding another testing framework.

Run `pnpm typecheck`, `pnpm lint`, the relevant existing directory/appointment checks, and a build. Inspect existing check contracts before updating assertions; record intentional changes instead of weakening unrelated checks. Broaden testing only where failures or shared changes justify it.

### Fresh browser and visual checks

Start the site with `pnpm dev`. Confirm it serves the current work. Run `pnpm visual:check` for `/`, `/services`, `/doctors`, `/appointment`, and the actual affected doctor/service detail paths. Include `/patients-visitors` or other routes if changed. Set `HH_PREVIEW_URL` for another port and `CHROME_PATH` if necessary.

Open fresh screenshots at mobile, tablet, and desktop widths. Check relevant interactions, keyboard focus, selection announcements, and reduced-motion behavior. Record visual findings in the unique run directory; leave `visualInspection` pending until images have actually been inspected. Report automated results separately from visual inspection and follow [the visual-check guide](../visual-checks.md).

### Completion record

Report changed behavior, the representative content set, verification evidence, and the remaining integration boundary. The frontend is complete when the agreed journeys prepare valid requests locally; real API submission, persistence, notifications, and confirmed scheduling remain future work.
