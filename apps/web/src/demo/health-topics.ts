import data from './data.json'
import { careEntry } from './care-model'

export interface HealthTopic {
  readonly id: string
  readonly name: string
  readonly aliases: readonly string[]
  readonly summary: string
  readonly nextStep: string
  readonly preparation: readonly string[]
  readonly route: 'appointment' | 'guidance'
  readonly servicePublicId?: string
  readonly servicePath?: string
  readonly serviceName?: string
  readonly appointmentHref?: string
}

// Explicit navigation paths for the local preview, pending hospital review before publication.
// A service record alone is not evidence that a condition can be booked or treated there.
const entries: readonly {
  name: string; aliases: readonly string[]; route: HealthTopic['route']; service?: string
  summary: string; nextStep: string; preparation: readonly string[]
}[] = [
  {
    name: 'Allergies', aliases: ['allergy', 'allergy concerns'], route: 'guidance',
    summary: 'Questions about allergy concerns or an existing diagnosis.',
    nextStep: 'Contact the hospital to ask about allergy-related care and which service to approach.',
    preparation: ['What allergy concern would you like to discuss?', 'Do you have an earlier diagnosis or care plan to ask about?'],
  },
  {
    name: 'Asthma', aliases: ['asthma care'], route: 'guidance',
    summary: 'Questions about asthma care or an existing diagnosis.',
    nextStep: 'Ask the hospital which service handles asthma enquiries and how to arrange a conversation.',
    preparation: ['Is this a first enquiry or a follow-up about asthma?', 'What would you like clarified about your existing care?'],
  },
  {
    name: 'Back pain', aliases: ['backache', 'aching back', 'back hurts', 'lower back pain'], route: 'appointment', service: 'Rehabilitation care',
    summary: 'Questions about back pain, movement and everyday activities.',
    nextStep: 'Request a Rehabilitation care visit to discuss your concerns and goals; the care team can confirm the appropriate service.',
    preparation: ['How does your back concern affect everyday activities?', 'What movement or recovery goals would you like to discuss?'],
  },
  {
    name: 'Diabetes', aliases: ['blood sugar', 'diabetic', 'diabetes care'], route: 'appointment', service: 'General medicine',
    summary: 'Questions about blood sugar, diabetes or existing care.',
    nextStep: 'Request a General medicine visit to discuss your diabetes questions. The care team can confirm the service and any follow-up arrangements.',
    preparation: ['Are you asking about blood sugar, an existing diagnosis or a follow-up?', 'Are there earlier results or care instructions you want to discuss?'],
  },
  {
    name: 'Digestive concerns', aliases: ['stomach', 'digestion', 'stomach pain', 'stomach ache', 'tummy pain'], route: 'appointment', service: 'General medicine',
    summary: 'Questions about stomach or digestive concerns.',
    nextStep: 'Request a General medicine visit to explain your digestive concern and ask about further care options.',
    preparation: ['What stomach or digestive concern would you like to explain?', 'When did you first notice it, and what questions do you have?'],
  },
  {
    name: 'Everyday wellbeing', aliases: ['home remedies', 'self care', 'self-care', 'wellness'], route: 'guidance',
    summary: 'Reviewed self-care and home-remedy guidance is not yet available in this preview.',
    nextStep: 'Contact the hospital to ask where to find reviewed advice for your concern.',
    preparation: ['What everyday care question would you like help with?', 'Is there a particular remedy or source of advice you want to ask about?'],
  },
  {
    name: 'Headaches', aliases: ['headache', 'head pain'], route: 'guidance',
    summary: 'Questions to prepare for a visit about headaches.',
    nextStep: 'Contact the hospital to explain your headache concern and ask which service to approach.',
    preparation: ['When did you first notice the headaches?', 'What would you like the care team to help you understand?'],
  },
  {
    name: 'High blood pressure', aliases: ['hypertension', 'blood pressure', 'high bp'], route: 'appointment', service: 'General medicine',
    summary: 'Questions about blood pressure, hypertension or follow-up care.',
    nextStep: 'Request a General medicine visit to discuss blood pressure questions and clarify your next care steps.',
    preparation: ['Are you asking about a reading, an existing diagnosis or a follow-up?', 'What earlier results or instructions would you like to discuss?'],
  },
  {
    name: 'Joint pain', aliases: ['aching joints', 'joint ache', 'knee pain', 'hip pain'], route: 'appointment', service: 'Rehabilitation care',
    summary: 'Questions about joint pain, daily activities and movement goals.',
    nextStep: 'Request a Rehabilitation care visit to discuss your joint concerns and goals. The care team can confirm whether this service is appropriate.',
    preparation: ['Which joints would you like to discuss?', 'Which activities or movement goals matter most to you?'],
  },
  {
    name: 'Sleep concerns', aliases: ['sleep', 'sleeping', 'difficulty sleeping', 'trouble sleeping'], route: 'guidance',
    summary: 'Questions to prepare for a visit about sleep concerns.',
    nextStep: 'Contact the hospital to ask where to start a conversation about sleep.',
    preparation: ['What sleep concern would you like to discuss?', 'How long has it been a concern for you?'],
  },
  {
    name: 'Thyroid concerns', aliases: ['thyroid', 'thyroid care'], route: 'appointment', service: 'General medicine',
    summary: 'Questions about thyroid concerns, an existing diagnosis or follow-up care.',
    nextStep: 'Request a General medicine visit to discuss your thyroid questions and clarify any further care options.',
    preparation: ['Is this a first thyroid enquiry or a follow-up?', 'Are there earlier results or care instructions you want explained?'],
  },
  {
    name: 'Vision concerns', aliases: ['eyes', 'eye care', 'blurry vision', 'eyesight', 'vision'], route: 'guidance',
    summary: 'Questions about eye care, vision concerns or follow-up care.',
    nextStep: 'Ask the hospital about eye-care availability and which service can address your enquiry.',
    preparation: ['What eye or vision concern would you like to explain?', 'Are you looking for a first conversation or follow-up information?'],
  },
]

export const healthTopics: readonly HealthTopic[] = entries.map((entry) => {
  const service = data.services.find((candidate) => candidate.name === entry.service)
  const canonicalName = service ? careEntry(service.publicId)?.name ?? service.name : undefined
  return {
    id: entry.name.toLowerCase().replaceAll(' ', '-'), name: entry.name, aliases: entry.aliases,
    summary: entry.summary, nextStep: service && canonicalName ? entry.nextStep.replaceAll(service.name, canonicalName) : entry.nextStep, preparation: entry.preparation,
    route: entry.route === 'appointment' && service ? 'appointment' : 'guidance',
    servicePublicId: service?.publicId,
    servicePath: service?.canonicalPath,
    serviceName: canonicalName,
    appointmentHref: entry.route === 'appointment' && service ? `/appointment?service=${encodeURIComponent(service.publicId)}` : undefined,
  }
})
