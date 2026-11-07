import type { GuideAction, GuideCatalog, GuideReply } from './types'

export const maxGuideQuestionLength = 240

export function normalizeQuestion(value: string): string {
  return value.normalize('NFKC').toLocaleLowerCase('en').replace(/[^\p{L}\p{N}]+/gu, ' ').trim().replace(/\s+/gu, ' ')
}

const words = (value: string) => normalizeQuestion(value).split(' ').filter(Boolean)
const contains = (query: string, phrase: string) => ` ${query} `.includes(` ${normalizeQuestion(phrase)} `)
const any = (query: string, phrases: readonly string[]) => phrases.some((phrase) => contains(query, phrase))
const contact: GuideAction = { label: 'Contact information', href: '/#home-call' }
const doctors: GuideAction = { label: 'Browse all doctors', href: '/doctors' }
const services: GuideAction = { label: 'Browse all services', href: '/services' }

const specialties = [
  { name: 'Family care', aliases: ['family', 'family doctor', 'general practitioner', 'gp'] },
  { name: 'Child care', aliases: ['child', 'children', 'kids', 'pediatrician', 'paediatrician', 'pediatrics', 'paediatrics'] },
  { name: 'Heart care', aliases: ['heart', 'cardiology', 'cardiologist'] },
] as const

export function answerGuide(question: string, catalog: GuideCatalog): GuideReply {
  const query = normalizeQuestion(question.slice(0, maxGuideQuestionLength))
  if (!query) return { kind: 'fallback', text: 'Choose a topic or type a short question to get started.' }

  // A prepared safety message, never an assessment of urgency or a diagnosis.
  if (any(query, ['emergency', 'urgent', 'ambulance', 'chest pain', 'cannot breathe', 'can t breathe', 'trouble breathing', 'difficulty breathing', 'unconscious', 'severe bleeding', 'suicide', 'overdose', 'stroke'])) {
    return {
      kind: 'emergency',
      text: 'This guide cannot assess symptoms or provide emergency help. If you think this is an emergency, seek immediate in-person emergency care or contact your local emergency service. Do not wait for a chat reply or an appointment request.',
      actions: [{ label: 'Read emergency information', href: '/emergency' }],
    }
  }
  if (any(query, ['diagnose', 'diagnosis', 'symptom', 'symptoms', 'medicine should', 'medication', 'dosage', 'dose', 'prescription', 'treatment', 'pain', 'fever', 'rash', 'sick'])) {
    return { kind: 'answer', text: 'I can help with website information, but cannot assess symptoms, recommend treatment or explain a diagnosis. Please discuss medical questions with a qualified clinician. You do not need to share symptoms here.', actions: [doctors, contact, { label: 'Emergency information', href: '/emergency' }] }
  }
  if (any(query, ['hello', 'hi', 'hey', 'thanks', 'thank you'])) {
    return { kind: 'answer', text: 'You’re welcome here. What would you like help finding?', actions: [{ label: 'Find a doctor', query: 'Find a doctor' }, { label: 'View all services', query: 'Explore services' }, { label: 'Plan my visit', query: 'Plan my visit' }] }
  }
  if (any(query, ['common questions', 'faq', 'faqs'])) {
    return { kind: 'answer', text: 'Here are a few things visitors often ask. Choose a question, or type your own.', actions: catalog.faqs.filter((faq) => ['visit', 'hours', 'fees', 'language', 'results', 'privacy'].includes(faq.id)).map((faq) => ({ label: faq.question, query: faq.question })) }
  }

  const namedDoctors = catalog.doctors.filter((doctor) => {
    const nameWords = words(doctor.name).filter((word) => !['dr', 'doctor'].includes(word))
    return nameWords.some((word) => contains(query, word))
  })
  const namedServices = catalog.services.filter((service) => contains(query, service.name)
    || words(service.name).filter((word) => !['care', 'medicine', 'navigation', 'support', 'guidance'].includes(word))
      .some((word) => contains(query, word)))
  const specialty = specialties.find((entry) => contains(query, entry.name) || any(query, entry.aliases))
  const asksDoctor = any(query, ['doctor', 'doctors', 'clinician', 'clinicians', 'specialist', 'specialists'])
  const asksServices = any(query, ['service', 'services', 'department', 'departments'])

  if (specialty && namedServices.length && !namedDoctors.length && !asksDoctor && !asksServices
    && !namedServices.some((service) => contains(query, service.name))) {
    return { kind: 'directory', text: 'Would you like to find a doctor or learn about a service?', actions: [
      { label: `${specialty.name} doctors`, query: `${specialty.name} doctors` },
      ...namedServices.map((service) => ({ label: service.name, query: service.name })),
    ] }
  }

  if (namedDoctors.length || (specialty && (asksDoctor || (!asksServices && !namedServices.length))) || (asksDoctor && !asksServices)) {
    const matches = namedDoctors.length ? namedDoctors : specialty
      ? catalog.doctors.filter((doctor) => doctor.specialties.some((value) => normalizeQuestion(value) === normalizeQuestion(specialty.name)))
      : []
    if (!namedDoctors.length && !specialty && query !== 'find a doctor' && !['doctor', 'doctors'].includes(query)) {
      return { kind: 'directory', text: 'Try a doctor’s name or choose one of the specialties listed in this preview. The full directory also has search and filters.', actions: [...specialties.map((entry) => ({ label: entry.name, query: `${entry.name} doctors` })), doctors] }
    }
    if (!matches.length) {
      return { kind: 'directory', text: 'Choose a specialty below, or type a doctor’s name. You can also search the full doctor directory.', actions: [...specialties.filter((entry) => catalog.doctors.some((doctor) => doctor.specialties.includes(entry.name))).map((entry) => ({ label: entry.name, query: `${entry.name} doctors` })), doctors] }
    }
    return {
      kind: 'directory', text: catalog.preview ? 'These sample profiles match your search. Appointment availability is not provided in this preview.' : 'These published profiles match your search. Please confirm appointment availability with the hospital.',
      cards: matches.slice(0, 4).map((doctor) => ({
        id: doctor.id, title: doctor.name, description: doctor.specialties.join(' · '),
        actions: [{ label: 'View profile', href: doctor.profileHref }, { label: 'Request a visit', href: `/appointment?doctor=${encodeURIComponent(doctor.id)}` }],
      })), actions: [doctors],
    }
  }

  if (namedServices.length || asksServices || ['care', 'departments'].includes(query)) {
    if (namedServices.length) return {
      kind: 'directory', text: catalog.preview ? 'Here is the sample service information. The hospital team would confirm the appropriate next step.' : 'Here is the published service information. The hospital team can confirm the next step.',
      cards: namedServices.slice(0, 3).map((service) => ({ id: service.id, title: service.name, description: service.description,
        actions: [{ label: 'Request a visit', href: `/appointment?service=${encodeURIComponent(service.id)}` }] })), actions: [services],
    }
    return { kind: 'directory', text: catalog.services.length ? 'Choose a service to learn more, or open the full directory. These are the services listed in this preview.' : 'Service information is not available here yet. Check the service directory or contact the hospital.',
      actions: [...catalog.services.map((service) => ({ label: service.name, query: service.name })), services] }
  }

  // Match whole words and prepared phrases, never arbitrary substrings ("hi" in "this").
  const rankedFaqs = catalog.faqs.map((faq) => ({ faq, score: Math.max(0,
    ...[faq.question, ...faq.aliases].map((phrase) => contains(query, phrase)
      ? (normalizeQuestion(phrase) === 'appointment' ? 0.5 : words(phrase).length) : 0)) }))
    .filter(({ score }) => score > 0).sort((a, b) => b.score - a.score)
  if (rankedFaqs.length) {
    const { faq } = rankedFaqs[0]
    return { kind: 'answer', text: faq.answer, actions: faq.actions }
  }
  return {
    kind: 'fallback', text: 'I couldn’t match that to an answer in this guide. Try a short topic such as “visiting hours” or “appointment”, choose an option below, or check the hospital’s contact information.',
    actions: [{ label: 'Common questions', query: 'Common questions' }, doctors, services, contact],
  }
}
