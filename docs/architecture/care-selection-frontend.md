# Care selection and appointment frontend contract

This frontend work uses representative mock content. It does not establish the hospital's current catalog or connect appointment collection. The implementation follows the [care structure plan](../backlog/care-structure-and-booking-plan.md).

## Care records and relationships

`apps/web/src/demo/care-model.ts` supplies the frontend classification and relationships. Existing `ServiceView` records remain the combined collection for specialties and services, with stable `publicId` and canonical routes. Doctors remain a separate collection.

- `kind` distinguishes a specialty from a specific service.
- `access` distinguishes an appointment request, team contact, referral/admission, or emergency information.
- `synonyms` make alternative department, clinic and plain-language names searchable without creating duplicate destinations.
- `specialtyIds` link a service to specialties. They do not assign any doctors to that service.
- Explicit doctor–care links declare specialty membership or provision of a specific service according to the target entry's kind.

Doctor specialty filters derive from specialty links only. Service teams derive from explicit provision links, never from all doctors in a related specialty. The representative data includes a doctor with two specialties, a specialty with multiple doctors, echocardiography offered by a subset of its specialty's doctors, and team-delivered physiotherapy without an individual doctor choice.

Preparation guides stay in the existing patient-information presentation. Admission, contact-only and emergency entries must not become ordinary appointment choices.

## Selection handoff

Only selected IDs travel in URLs: `doctor` and `service`. Contact details never belong in route context. The shared helpers resolve known, requestable entries and compatible pairs before generating appointment links.

| Entry path | Prepared selection |
| --- | --- |
| Doctor → appointment | `doctor_id` |
| Specialty/service → appointment | `service_id` |
| Care → related doctor → appointment | Both IDs |
| Doctor → related care → appointment | Both IDs |
| Help choosing | Neither ID |

An affiliation is not an implicit patient selection. Opening a doctor's appointment link does not add that doctor's specialties. Unknown IDs and incompatible pairs produce recoverable guidance. Within the form, a changed primary choice retains compatible context and clears an incompatible dependent choice with feedback. Contact fields remain in memory while the visitor edits care.

## Pure preparation boundary

`apps/web/src/demo/appointment-draft.ts` exports `prepareAppointmentRequest`. It validates the chosen IDs, relationship compatibility, name, phone, optional preferred date and privacy acknowledgement, then returns either field errors or a payload:

```ts
type AppointmentRequestPayload = {
  full_name: string
  phone: string
  preferred_date?: string
  doctor_id?: string
  service_id?: string
  privacy_acknowledged: true
}
```

The UI's starting mode is presentation state; it does not need a new backend entity. First-visit/follow-up remains a presentation choice and is not included in this payload. A future integration must decide whether to collect it as a separate field.

Preparation does not call an API, send contact details, persist a request, add browser storage, or log patient fields. The normal local outcome cannot claim that a request was sent, saved or confirmed. A valid draft is preparation for a later integration, not a booking or reserved slot. Raw payloads and implementation details are not exposed in the patient interface.

## Later backend integration

The existing [appointment foundation](appointment-request-foundation.md) is unchanged. Its schema requires `care_route`, permits only one care ID at a time, and uses `doc_…` / `svc_…` identifiers. These frontend fixtures use `pub_…` IDs in separate doctor and care collections.

A later integration must provide an adapter to governed IDs, accept and validate joint selections, revalidate access and relationships on the server, and define request receipt and failure behavior before enabling collection. It must also decide the final transport shape and any first-visit/follow-up field. The frontend payload must not be sent directly to the current endpoint.

API handlers, repositories, database schemas and migrations, collection gates, deployment and publication are outside this change.
