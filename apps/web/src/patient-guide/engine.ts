import type { GuideAction, GuideCatalog, GuideChoice, GuideContext, GuideReply, GuideSelection } from './types'

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
const emergencyPhrases = ['emergency', 'urgent', 'ambulance', 'chest pain', 'cannot breathe', 'can t breathe', 'trouble breathing', 'difficulty breathing', 'unconscious', 'severe bleeding', 'suicide', 'overdose', 'stroke']
const medicalPhrases = ['diagnose', 'diagnosis', 'symptom', 'symptoms', 'medicine should', 'medication', 'dosage', 'dose', 'prescription', 'treatment', 'pain', 'fever', 'rash', 'sick']
const specialties = [
  { name: 'Family care', aliases: ['family', 'family doctor', 'general practitioner', 'gp'] },
  { name: 'Child care', aliases: ['child', 'children', 'kids', 'pediatrician', 'paediatrician', 'pediatrics', 'paediatrics'] },
  { name: 'Heart care', aliases: ['heart', 'cardiology', 'cardiologist'] },
] as const

// One insertion/deletion/substitution or adjacent transposition. Short words and
// ambiguous corrections are left alone; this is bounded matching, not inference.
function oneEditApart(a: string, b: string): boolean {
  if (Math.abs(a.length - b.length) > 1 || a === b) return false
  let i = 0
  while (i < a.length && a[i] === b[i]) i++
  if (a.length === b.length) return a.slice(i + 1) === b.slice(i + 1)
    || (a[i] === b[i + 1] && a[i + 1] === b[i] && a.slice(i + 2) === b.slice(i + 2))
  return a.length > b.length ? a.slice(i + 1) === b.slice(i) : a.slice(i) === b.slice(i + 1)
}

function correctQuestion(query: string, catalog: GuideCatalog) {
  const doctorWords = new Set(catalog.doctors.flatMap((doctor) => words(doctor.name)).filter((word) => word.length >= 5))
  const serviceWords = new Set(catalog.services.flatMap((service) => words(service.name)).filter((word) => word.length >= 5))
  const recordWords = new Set([...doctorWords, ...serviceWords])
  const vocabulary = new Set([
    ...catalog.faqs.flatMap((faq) => [faq.question, ...faq.aliases].flatMap(words)),
    ...specialties.flatMap((entry) => [entry.name, ...entry.aliases].flatMap(words)),
    ...emergencyPhrases.flatMap(words), ...medicalPhrases.flatMap(words),
    'doctor', 'doctors', 'physician', 'services', 'department', 'hospital',
    ...recordWords,
  ].filter((word) => word.length >= 5))
  const common: Readonly<Record<string, string>> = { docter: 'doctor', docters: 'doctors', doctro: 'doctor', apointment: 'appointment', appointmnt: 'appointment', apponitment: 'appointment', visitting: 'visiting', recepton: 'reception', hospitl: 'hospital' }
  const canCorrectRecord = words(query).length <= 3 || any(query, ['doctor', 'dr', 'physician', 'service', 'find', 'show', 'about'])
  let recordCorrected = false
  const corrected = words(query).map((word) => {
    if (common[word]) return common[word]
    if (word.length < 5 || vocabulary.has(word)) return word
    const candidates = [...vocabulary].filter((candidate) => (canCorrectRecord || !recordWords.has(candidate)) && oneEditApart(word, candidate))
    if (candidates.length !== 1) return word
    if (recordWords.has(candidates[0])) recordCorrected = true
    return candidates[0]
  }).join(' ')
  return { query: corrected, recordCorrected }
}

function validSelection(selection: GuideSelection | undefined, catalog: GuideCatalog) {
  if (!selection) return undefined
  return (selection.kind === 'doctor' ? catalog.doctors : catalog.services).some((entry) => entry.id === selection.id) ? selection : undefined
}

function contactActions(catalog: GuideCatalog): readonly GuideAction[] {
  const direct = catalog.faqs.find((faq) => faq.id === 'contact')?.actions.filter((action) => action.href?.startsWith('tel:') || action.href?.startsWith('mailto:')) ?? []
  return [...direct.slice(0, 2), contact]
}

function choiceAction(choice: GuideChoice, catalog: GuideCatalog): GuideAction | undefined {
  if (choice.kind === 'doctor') {
    const doctor = catalog.doctors.find((entry) => entry.id === choice.id)
    if (doctor) return { label: `${doctor.name} · ${doctor.specialties.join(', ')}`, query: 'Show this doctor', context: { selection: choice, topicId: 'doctors' } }
  } else if (choice.kind === 'service') {
    const service = catalog.services.find((entry) => entry.id === choice.id)
    if (service) return { label: service.name, query: 'Show this service', context: { selection: choice, topicId: 'services' } }
  } else if (choice.kind === 'faq') {
    const faq = catalog.faqs.find((entry) => entry.id === choice.id)
    if (faq) return { label: faq.question, query: faq.question, context: {} }
  } else if (choice.kind === 'specialty') {
    const specialty = specialties.find((entry) => entry.name === choice.id)
    if (specialty) return { label: `${specialty.name} doctors`, query: `${specialty.name} doctors`, context: {} }
  } else if (choice.id === 'doctors' || choice.id === 'services') {
    return { label: choice.id === 'doctors' ? 'Find a doctor' : 'Explore services', query: choice.id === 'doctors' ? 'Find a doctor' : 'Explore services', context: {} }
  }
}

function clarify(text: string, choices: readonly GuideChoice[], catalog: GuideCatalog): GuideReply {
  const available = choices.filter((choice) => choiceAction(choice, catalog)).slice(0, 3)
  return { kind: 'clarification', text, actions: [...available.flatMap((choice) => choiceAction(choice, catalog) ?? []), contact], context: { choices: available } }
}

function doctorReply(matches: GuideCatalog['doctors'], catalog: GuideCatalog): GuideReply {
  const displayed = matches.slice(0, 4)
  return {
    kind: 'directory', text: catalog.preview ? 'These sample profiles match your search. Appointment availability is not provided in this preview.' : 'These published profiles match your search. Please confirm appointment availability with the hospital.',
    cards: displayed.map((doctor) => ({ id: doctor.id, title: doctor.name, description: doctor.specialties.join(' · '),
      actions: [{ label: 'View profile', href: doctor.profileHref }, { label: 'Request a visit', href: `/appointment?doctor=${encodeURIComponent(doctor.id)}` }],
    })), actions: [doctors],
    context: { topicId: 'doctors', selection: displayed.length === 1 ? { kind: 'doctor', id: displayed[0].id } : undefined,
      choices: displayed.map((doctor) => ({ kind: 'doctor', id: doctor.id })) },
  }
}

function serviceReply(matches: GuideCatalog['services'], catalog: GuideCatalog): GuideReply {
  const displayed = matches.slice(0, 3)
  return {
    kind: 'directory', text: catalog.preview ? 'Here is the sample service information. The hospital team would confirm the appropriate next step.' : 'Here is the published service information. The hospital team can confirm the next step.',
    cards: displayed.map((service) => ({ id: service.id, title: service.name, description: service.description,
      actions: [{ label: 'Request a visit', href: `/appointment?service=${encodeURIComponent(service.id)}` }],
    })), actions: [services],
    context: { topicId: 'services', selection: displayed.length === 1 ? { kind: 'service', id: displayed[0].id } : undefined,
      choices: displayed.map((service) => ({ kind: 'service', id: service.id })) },
  }
}

function faqReply(id: string, catalog: GuideCatalog, selection?: GuideSelection): GuideReply | undefined {
  const faq = catalog.faqs.find((entry) => entry.id === id)
  if (!faq) return undefined
  // Related questions may retain a public care selection; unrelated topics clear it.
  const care = validSelection(selection, catalog)
  const keep = care && ['appointment', 'hours', 'fees', 'visit', 'directions', 'contact'].includes(id) ? care : undefined
  const name = keep?.kind === 'doctor' ? catalog.doctors.find((entry) => entry.id === keep.id)?.name
    : keep ? catalog.services.find((entry) => entry.id === keep.id)?.name : undefined
  const appointmentHref = keep ? `/appointment?${keep.kind}=${encodeURIComponent(keep.id)}` : '/appointment'
  const actions = id === 'appointment' ? faq.actions.map((action) => {
    if (action.href === '/appointment') return { ...action, href: appointmentHref }
    if (keep?.kind === 'doctor' && action.query === 'Find a doctor') return { ...action, label: 'Choose another doctor' }
    return action
  }) : faq.actions
  let text = faq.answer
  if (id === 'appointment' && name && keep) {
    text = catalog.preview
      ? `For ${name}, you can continue to the appointment preview with this ${keep.kind} selected. No request is sent or saved, and no appointment is booked. Contact the hospital to arrange a visit and confirm a time.`
      : `For ${name}: ${faq.answer}`
  }
  return { kind: 'answer', text, actions, context: { topicId: id, selection: keep } }
}

export function answerGuide(question: string, catalog: GuideCatalog, previous: GuideContext = {}): GuideReply {
  const raw = normalizeQuestion(question.slice(0, maxGuideQuestionLength))
  const correction = correctQuestion(raw, catalog)
  const query = correction.query
    .replace(/\bphysicians?\b/gu, 'doctor').replace(/\bclinics?\b/gu, 'service')
  const selection = validSelection(previous.selection, catalog)
  if (!query) return { kind: 'fallback', text: 'Choose a topic or type a short question to get started.' }

  // Always evaluate safety before clarification, context, or spelling suggestions.
  // These are prepared boundaries, never an assessment or a diagnosis.
  if (any(raw, emergencyPhrases) || any(query, emergencyPhrases)) return {
    kind: 'emergency', text: 'This guide cannot assess symptoms or provide emergency help. If you think this is an emergency, seek immediate in-person emergency care or contact your local emergency service. Do not wait for a chat reply or an appointment request.',
    actions: [{ label: 'Read emergency information', href: '/emergency' }],
  }
  if (any(raw, medicalPhrases) || any(query, medicalPhrases)) return {
    kind: 'answer', text: 'I can help with website information, but cannot assess symptoms, recommend treatment or explain a diagnosis. Please discuss medical questions with a qualified clinician. You do not need to share symptoms here.',
    actions: [doctors, contact, { label: 'Emergency information', href: '/emergency' }],
  }
  if (correction.recordCorrected) return {
    kind: 'clarification', text: 'I found a close spelling match. Is this what you meant?',
    actions: [{ label: correction.query, query: correction.query, context: {} }, ...contactActions(catalog).slice(0, 1)],
  }
  if (['hello', 'hi', 'hey', 'thanks', 'thank you'].includes(query)) return {
    kind: 'answer', text: 'You’re welcome here. What would you like help finding?',
    actions: [{ label: 'Find a doctor', query: 'Find a doctor' }, { label: 'View all services', query: 'Explore services' }, { label: 'Plan my visit', query: 'Plan my visit' }],
    context: { selection, topicId: previous.topicId, choices: previous.choices },
  }

  const ordinal = query.match(/^(?:the |option |number )?(first|second|third|fourth|1|2|3|4)(?: one| option| doctor| service)?$/u)
  if (ordinal && previous.choices?.length) {
    const index = ['first', 'second', 'third', 'fourth'].indexOf(ordinal[1])
    const choice = previous.choices[index >= 0 ? index : Number(ordinal[1]) - 1]
    const action = choice && choiceAction(choice, catalog)
    if (action?.query) return answerGuide(action.query, catalog, action.context)
    return clarify('Please choose one of the options shown below.', previous.choices, catalog)
  }
  if (ordinal) return clarify('There is no current list to choose from. What would you like to find?', [{ kind: 'topic', id: 'doctors' }, { kind: 'topic', id: 'services' }], catalog)

  const followup = ['more', 'tell me more', 'more about them', 'more about it', 'that one', 'this one', 'show this doctor', 'show this service', 'view profile', 'show their profile', 'tell me more about this doctor', 'tell me more about this service']
  const followupQuery = query.replace(/^(?:can|could|would) you /u, '').replace(/ please$/u, '')
  const mentionsCare = catalog.doctors.some((doctor) => words(doctor.name).filter((word) => !['dr', 'doctor'].includes(word)).some((word) => contains(query, word)))
    || catalog.services.some((service) => words(service.name).filter((word) => !['care', 'medicine'].includes(word)).some((word) => contains(query, word)))
  const bookingReference = any(query, ['book', 'appointment', 'request a visit']) && any(query, ['them', 'him', 'her', 'this', 'that', 'it']) && !mentionsCare
  if (followup.includes(followupQuery) || bookingReference) {
    if (selection) {
      if (any(query, ['book', 'appointment', 'request a visit'])) {
        const reply = faqReply('appointment', catalog, selection)
        if (reply) return reply
      }
      return selection.kind === 'doctor' ? doctorReply(catalog.doctors.filter((entry) => entry.id === selection.id), catalog)
        : serviceReply(catalog.services.filter((entry) => entry.id === selection.id), catalog)
    }
    if (previous.choices?.length) return clarify('Which option do you mean? Choose one so I can keep the next step connected.', previous.choices, catalog)
    const previousFaq = previous.topicId && !any(query, ['book', 'appointment', 'request a visit']) ? faqReply(previous.topicId, catalog) : undefined
    if (previousFaq) return previousFaq
    return clarify('Which would you like help with?', [{ kind: 'topic', id: 'doctors' }, { kind: 'topic', id: 'services' }, { kind: 'faq', id: 'appointment' }], catalog)
  }
  if (any(query, ['common questions', 'faq', 'faqs'])) {
    const choices = catalog.faqs.filter((faq) => ['visit', 'hours', 'fees'].includes(faq.id)).map((faq) => ({ kind: 'faq' as const, id: faq.id }))
    return { kind: 'answer', text: 'Choose a question, or ask about another topic such as language support, results or privacy.',
      actions: [...choices.flatMap((choice) => choiceAction(choice, catalog) ?? []), contact], context: { choices } }
  }

  const scoredDoctors = catalog.doctors.map((doctor) => ({ doctor, score: words(doctor.name)
    .filter((word) => !['dr', 'doctor'].includes(word)).filter((word) => contains(query, word)).length }))
  const highestNameScore = Math.max(0, ...scoredDoctors.map(({ score }) => score))
  const namedDoctors = scoredDoctors.filter(({ score }) => score > 0 && (score === highestNameScore || any(query, ['and', 'or']))).map(({ doctor }) => doctor)
  const namedServices = catalog.services.filter((service) => contains(query, service.name)
    || words(service.name).filter((word) => !['care', 'medicine', 'navigation', 'support', 'guidance'].includes(word)).some((word) => contains(query, word)))
  const specialty = specialties.find((entry) => contains(query, entry.name) || any(query, entry.aliases))
  const asksDoctor = any(query, ['dr', 'doctor', 'doctors', 'clinician', 'clinicians', 'specialist', 'specialists'])
  const asksServices = any(query, ['service', 'services', 'department', 'departments'])

  const exactFaq = catalog.faqs.find((faq) => normalizeQuestion(faq.question) === query)
  const rankedFaqs = catalog.faqs.map((faq) => ({ faq, score: Math.max(0,
    ...[faq.question, ...faq.aliases].map((phrase) => contains(query, phrase)
      ? (['appointment', 'where', 'open', 'close', 'help'].includes(normalizeQuestion(phrase)) ? 0.25 : words(phrase).length) : 0)) }))
    .filter(({ score }) => score > 0).sort((a, b) => b.score - a.score)
  const best = rankedFaqs[0]
  if (exactFaq || best) {
    const selectedFaq = exactFaq ?? best.faq
    const competing = rankedFaqs.filter(({ faq, score }) => faq.id !== selectedFaq.id && score >= 1 && (score === best.score || any(query, ['and', 'or'])))
    if (!exactFaq && competing.length) return clarify('I found more than one topic. Which would you like to start with?',
      [{ kind: 'faq', id: selectedFaq.id }, ...competing.map(({ faq }) => ({ kind: 'faq' as const, id: faq.id }))], catalog)
    // Explicit care discovery takes precedence over a generic word such as "help".
    if (exactFaq || best.score >= 1 || selectedFaq.id === 'appointment'
      || (!namedDoctors.length && !namedServices.length && !asksDoctor && !asksServices && !specialty)) {
      if (selectedFaq.id === 'appointment' && namedDoctors.length > 1) return clarify('Which doctor would you like to continue with?', namedDoctors.map((doctor) => ({ kind: 'doctor', id: doctor.id })), catalog)
      if (selectedFaq.id === 'appointment' && namedServices.length > 1) return clarify('Which service would you like to continue with?', namedServices.map((service) => ({ kind: 'service', id: service.id })), catalog)
      if (selectedFaq.id === 'appointment' && ((asksDoctor && !namedDoctors.length) || (asksServices && !namedServices.length))) return clarify('Please choose the care you mean before continuing to appointments.', [{ kind: 'topic', id: asksDoctor ? 'doctors' : 'services' }], catalog)
      const care = namedDoctors.length === 1 ? { kind: 'doctor' as const, id: namedDoctors[0].id }
        : namedServices.length === 1 ? { kind: 'service' as const, id: namedServices[0].id } : selection
      return faqReply(selectedFaq.id, catalog, care)!
    }
  }

  if (namedDoctors.length > 1) return clarify('More than one profile matches that name. Which doctor do you mean?', namedDoctors.map((doctor) => ({ kind: 'doctor', id: doctor.id })), catalog)
  if (asksDoctor && asksServices && !namedDoctors.length && !namedServices.length) return clarify('Would you like to find a doctor or explore a service?', [{ kind: 'topic', id: 'doctors' }, { kind: 'topic', id: 'services' }], catalog)
  if (specialty && namedServices.length && !namedDoctors.length && !asksDoctor && !asksServices && !namedServices.some((service) => contains(query, service.name))) {
    return clarify('Would you like to find a doctor or learn about a service?', [{ kind: 'specialty', id: specialty.name }, ...namedServices.map((service) => ({ kind: 'service' as const, id: service.id }))], catalog)
  }
  if (namedDoctors.length || (specialty && (asksDoctor || (!asksServices && !namedServices.length))) || (asksDoctor && !asksServices)) {
    const matches = namedDoctors.length ? namedDoctors : specialty
      ? catalog.doctors.filter((doctor) => doctor.specialties.some((value) => normalizeQuestion(value) === normalizeQuestion(specialty.name))) : []
    if (matches.length) return doctorReply(matches, catalog)
    const choices = specialties.filter((entry) => catalog.doctors.some((doctor) => doctor.specialties.includes(entry.name))).map((entry) => ({ kind: 'specialty' as const, id: entry.name }))
    return { kind: 'directory', text: choices.length ? 'Choose a specialty below, or try a doctor’s name. You can also search the full doctor directory.' : 'Doctor information is not available here yet. Please check the directory or contact the hospital.',
      actions: [...choices.flatMap((choice) => choiceAction(choice, catalog) ?? []), doctors], context: { topicId: 'doctors', choices } }
  }
  if (namedServices.length || asksServices || ['care', 'departments'].includes(query)) {
    if (namedServices.length > 1) return clarify('Which service do you mean?', namedServices.map((service) => ({ kind: 'service', id: service.id })), catalog)
    if (namedServices.length) return serviceReply(namedServices, catalog)
    const choices = catalog.services.slice(0, 3).map((service) => ({ kind: 'service' as const, id: service.id }))
    return { kind: 'directory', text: choices.length ? 'Choose a service to learn more, or open the full directory.' : 'Service information is not available here yet. Check the service directory or contact the hospital.',
      actions: [...choices.flatMap((choice) => choiceAction(choice, catalog) ?? []), services], context: { topicId: 'services', choices } }
  }

  const unmatchedCount = Math.min((previous.unmatchedCount ?? 0) + 1, 2)
  const related = selection ? [{ label: 'Return to selected care', query: selection.kind === 'doctor' ? 'Show this doctor' : 'Show this service', context: { selection } }]
    : previous.topicId && catalog.faqs.some((faq) => faq.id === previous.topicId) ? [{ label: 'Return to the previous topic', query: catalog.faqs.find((faq) => faq.id === previous.topicId)!.question }]
      : [{ label: 'Common questions', query: 'Common questions' }]
  return {
    kind: 'fallback', text: unmatchedCount > 1 ? 'I still couldn’t match that to a prepared answer. Please contact the hospital, or return to a topic below.'
      : 'I couldn’t match that to an answer in this guide. Try a short topic such as “visiting hours” or “appointment”, or use the options below.',
    actions: [...related, ...contactActions(catalog)], context: { selection, topicId: previous.topicId, unmatchedCount },
  }
}
