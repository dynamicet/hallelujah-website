// Local presentation copy only. These values describe fictional examples, not hospital facts.
// The export script is the sole writer of src/demo/data.json.
export const clinicianExamples = [
  { sourceName: 'Dr Aster', biography: 'Dr Aster discusses everyday family-care concerns and follow-up care.', interests: ['Everyday health concerns and continuity of care', 'Planning a follow-up conversation'], languages: ['English', 'Amharic'] },
  { sourceName: 'Dr Bekele', biography: 'Dr Bekele discusses routine child-care questions with children and caregivers.', interests: ['Questions about a child’s routine care', 'Helping families prepare for a visit'], languages: ['English'] },
  { sourceName: 'Dr Chala', biography: 'Dr Chala discusses heart-care referrals and follow-up questions.', interests: ['Understanding a heart-care referral', 'Discussing the next step after a visit'], languages: ['English', 'Amharic'] },
  { sourceName: 'Dr Desta', biography: 'Dr Desta focuses on ongoing family care and reviewing earlier care plans.', interests: ['Ongoing family care', 'Reviewing a care plan with a visitor'], languages: ['English'] },
  { sourceName: 'Dr Eden', biography: 'Dr Eden discusses child-care questions and visit preparation with caregivers.', interests: ['Child-care conversations', 'Helping caregivers find the right service'], languages: ['English'] },
  { sourceName: 'Dr Fikru', biography: 'Dr Fikru discusses heart-care questions and consultation preparation.', interests: ['Heart-care conversations', 'Preparing questions for a consultation'], languages: ['English'] },
  { sourceName: 'Dr Genet', biography: 'Dr Genet discusses ongoing family care and follow-up options.', interests: ['Family care across visits', 'Explaining follow-up options in plain language'], languages: ['Amharic', 'English'] },
  { sourceName: 'Dr Hana', biography: '', interests: [], languages: [] }, // Intentional partial-profile scenario.
  { sourceName: 'Dr Imani', name: 'Dr Imani Alemu Tesfaye-Mekonnen', biography: 'Dr Imani discusses referrals, first consultations and follow-up care, including questions about earlier visits and care plans.', interests: [
    'Referrals, first consultations and follow-up care',
    'Questions about earlier visits and care plans',
  ], languages: ['English', 'Amharic'] }, // Long-name example; layout stress cases live in the profile fixtures.
]

export const serviceExamples = [
  'Sample guidance on admission preparation and arrival.',
  'Sample guidance for a planned hospital stay and visitors.',
  'Sample preparation and follow-up guidance for a day visit.',
  'Sample information for general medical consultations.',
  'Sample heart-care information and related doctor profiles.',
  'Sample information for breathing-related care enquiries.',
  'Sample information on recovery goals and rehabilitation visits.',
  'Sample guidance on speech and communication support.',
  'Sample guidance on therapy options and referral questions.',
  'Sample guidance on follow-up care after an earlier visit.',
]

export const serviceSourceNames = [
  'Admission guidance', 'Inpatient navigation', 'Day care navigation', 'General medicine',
  'Heart medicine', 'Breathing medicine', 'Rehabilitation care', 'Speech support',
  'Therapy navigation', 'Follow-up support',
]

export const homeExample = {
  featuredDoctorIds: [0, 1, 8],
  featuredServiceIds: [3, 4, 6],
  story: {
    title: 'A clearer way to find the next step',
    body: 'Start with an area of care, meet a clinician, and see how an appointment request can be made. Practical arrival information stays close at hand, so the next step is easier to find.',
  },
  contact: {
    call: '+0 000 000 0000 — illustrative number',
    address: '100 Test Avenue, Example District — illustrative location',
    entrance: 'Example main entrance — illustrative arrival point',
  },
}

export const emergencyExample = {
  description: 'Choose between a hospital-specific example and a separate public-service example, then follow the written arrival route.',
  hospitalChoice: {
    audience: 'Someone seeking hospital-specific arrival guidance in this illustrative route',
    displayValue: '+0 000 000 0001 — illustrative, cannot call',
    hours: 'No staffed hours are represented',
    label: 'Hospital emergency route',
    limitations: 'No real availability, response or clinical capability is represented',
    purpose: 'Illustrates asking about the example emergency entrance and hospital access',
  },
  publicChoice: {
    audience: 'Someone comparing a separate public response route in this illustrative route',
    displayValue: '+0 000 000 0002 — illustrative, cannot call',
    hours: 'No public-service hours are represented',
    label: 'Public emergency route',
    limitations: 'No jurisdiction, dispatch service or response is represented',
    purpose: 'Illustrates a public response route separate from hospital arrival questions',
  },
  warning: 'Online messages and appointment requests are not emergency channels.',
  scope: {
    summary: 'This example reserves space for hospital-approved emergency scope. It makes no claim about services or who can be treated.',
    availability: 'Not verified for this demonstration',
    limitations: 'Clinical scope and operating status require hospital approval',
    owner: 'Presentation content team',
    reviewedLabel: 'Illustrative presentation copy',
    reviewedOn: '2026-10-21',
  },
  arrival: {
    address: '100 Test Avenue, Example District — illustrative location',
    entrance: 'Example emergency entrance C — illustrative only',
    steps: ['Start at Example Junction A.', 'Continue past Test Landmark B.', 'Find Example Entrance C.'],
    parking: 'Example parking area; no real access route is represented.',
    publicTransport: 'Example Stop B; no real transport route is represented.',
    accessibleEntrance: 'Example step-free entrance; no real accessible route is represented.',
  },
}
