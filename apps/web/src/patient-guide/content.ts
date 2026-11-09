import type { GuideAction, GuideFaq } from './types'
import { hospitalContact } from '@/website/hospital-contact'

export const guideTopics = [
  { label: 'Find a doctor', query: 'Find a doctor' },
  { label: 'View all services', query: 'Explore services' },
  { label: 'Appointments', query: 'Request an appointment' },
  { label: 'Plan my visit', query: 'Plan my visit' },
  { label: 'Common questions', query: 'Common questions' },
  { label: 'Contact & directions', query: 'Contact the hospital' },
] as const satisfies readonly GuideAction[]

// Draft navigation copy for the local preview. Contact facts are sourced from the hospital website.
export const previewFaqs: readonly GuideFaq[] = [
  {
    id: 'appointment', question: 'How do I request an appointment?',
    aliases: ['appointment', 'book', 'book a visit', 'booking', 'schedule a visit', 'request an appointment', 'schedule', 'make a booking', 'reserve a visit'],
    answer: 'The appointment page is a preview. You can try the steps without choosing a doctor, but no request is sent or saved and no appointment is booked. Contact the hospital to arrange a visit and confirm a time.',
    actions: [{ label: 'Open appointment form', href: '/appointment' }, { label: 'Choose a doctor first', query: 'Find a doctor' }],
  },
  {
    id: 'visit', question: 'How can I prepare for my visit?',
    aliases: ['plan my visit', 'prepare', 'preparation', 'what to bring', 'first visit', 'documents', 'referral', 'what should i bring', 'check in', 'checklist'],
    answer: 'Use the visit guide to plan your questions and ask what documents or earlier results you may need. Preparation can differ by service, so confirm any instructions with the hospital before your visit.',
    actions: [{ label: 'Read the visit guide', href: '/patients-visitors' }, { label: 'Location & arrival', query: 'Directions' }],
  },
  {
    id: 'contact', question: 'How do I contact the hospital?',
    aliases: ['contact', 'phone', 'telephone', 'call', 'reception', 'human', 'staff', 'email', 'talk to someone', 'speak to someone', 'real person', 'talk to a person', 'speak to staff'],
    answer: `Call the hospital on ${hospitalContact.phone} or ${hospitalContact.alternatePhone}. For general enquiries, email ${hospitalContact.email}. These details are published on the hospital’s website. For time-sensitive questions, please call; email is not an emergency channel.`,
    actions: [{ label: 'Call the hospital', href: hospitalContact.phoneHref }, { label: 'Email the hospital', href: `mailto:${hospitalContact.email}` }, { label: 'View contact information', href: '/#home-call' }, { label: 'Location & arrival', href: '/#home-directions' }],
  },
  {
    id: 'directions', question: 'Where is the hospital?',
    aliases: ['directions', 'location', 'address', 'where', 'map', 'parking', 'entrance', 'getting there', 'get there', 'how do i get there', 'get to the hospital'],
    answer: 'Hallelujah General Hospital is around Gotera Condominium, Addis Ababa, Ethiopia. Open Contact & directions for the hospital’s Google Maps location. Call before travelling to confirm your department, entrance, and any parking or access arrangements you need.',
    actions: [{ label: 'View location & arrival', href: '/#home-directions' }],
  },
  {
    id: 'hours', question: 'What are the opening and visiting hours?',
    aliases: ['hours', 'opening', 'visiting', 'visitors', 'open', 'closed', 'close', 'opening times', 'visiting times', 'weekend', 'sunday', 'saturday', 'weekdays', 'when are you open'],
    answer: 'Opening and visiting hours are not verified in this preview. Hours may differ by department. Please confirm with the hospital before planning a visit.',
    actions: [{ label: 'Contact information', href: '/#home-call' }, { label: 'Plan a visit', query: 'Plan my visit' }],
  },
  {
    id: 'feedback', question: 'How can I share feedback?',
    aliases: ['feedback', 'compliment', 'suggestion', 'complaint', 'complain', 'concern about my visit'],
    answer: 'The patient feedback page explains how to prepare a compliment, suggestion, or concern. You can review a sample message there. Sending is unavailable until the hospital confirms a feedback recipient and handling arrangements.',
    actions: [{ label: 'Patient feedback', href: '/feedback' }],
  },
  {
    id: 'fees', question: 'What does a visit cost?',
    aliases: ['cost', 'price', 'prices', 'fees', 'payment', 'pay', 'insurance', 'cash', 'bill', 'how much', 'charges', 'pricing', 'coverage'],
    answer: 'Verified prices, payment methods and insurance arrangements are not available in this preview. Ask the hospital to confirm the cost and coverage for the specific service you need.',
    actions: [{ label: 'View all services', query: 'Explore services' }, { label: 'Contact information', href: '/#home-call' }],
  },
  {
    id: 'language', question: 'Is Amharic or language support available?',
    aliases: ['amharic', 'language', 'translate', 'translation', 'interpreter', 'english', 'አማርኛ'],
    answer: 'This guide currently works in English. Reviewed Amharic answers have not been added yet. Please ask the hospital about language support for your visit.',
    actions: [{ label: 'Contact information', href: '/#home-call' }],
  },
  {
    id: 'accessibility', question: 'Can I arrange accessibility support?',
    aliases: ['accessibility', 'accessible', 'wheelchair', 'mobility', 'disability', 'assistance'],
    answer: 'Please ask the hospital to confirm accessible entrances and any support you need before travelling. Accessibility arrangements are not verified in this preview.',
    actions: [{ label: 'Location & arrival', href: '/#home-directions' }, { label: 'Contact information', href: '/#home-call' }],
  },
  {
    id: 'results', question: 'How do I get my test results?',
    aliases: ['results', 'test result', 'test results', 'lab results', 'lab', 'laboratory', 'report', 'medical record', 'records'],
    answer: 'This guide cannot access test results or patient records. Ask the team that arranged your test how and when to receive the result. Please do not share a report or patient number in this chat.',
    actions: [{ label: 'Contact information', href: '/#home-call' }],
  },
  {
    id: 'changes', question: 'Can I change or cancel an appointment?',
    aliases: ['cancel', 'reschedule', 'change appointment', 'change my appointment', 'confirmation', 'confirmed', 'appointment status', 'move my appointment', 'cancel booking', 'change booking', 'when is my appointment'],
    answer: 'This guide cannot look up appointment details or change a booking. Contact the hospital team handling your appointment to confirm a time, or to change or cancel it. Have your appointment details ready.',
    actions: [{ label: 'Contact information', href: '/#home-call' }],
  },
  {
    id: 'privacy', question: 'Is this conversation saved?',
    aliases: ['privacy', 'saved', 'save', 'stored', 'personal data', 'history', 'delete', 'clear'],
    answer: 'Messages are used only in this open guide and are not sent to a chat server or saved in browser storage. Start over clears the conversation; reloading the page clears it too. Please leave out names, contact details and medical information.',
    actions: [],
  },
  {
    id: 'about', question: 'What can this guide help with?',
    aliases: ['help', 'what can you do', 'bot', 'ai', 'assistant', 'how does this work'],
    answer: 'I’m an automated website guide. I match your question to prepared answers and help you find doctors, services and visit information. I cannot give medical advice or connect you to a clinician here.',
    actions: guideTopics.slice(0, 3),
  },
]
