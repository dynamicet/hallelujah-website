// Fictional editorial fixtures, served only within the local website preview.
export type EditorialEntry = Readonly<{
  slug: string
  category: 'News' | 'Events' | 'Resources'
  title: string
  summary: string
  publishedAt: string
  image?: Readonly<{ src: string; width: number; height: number; alt: string; caption: string }>
  readingMinutes: number
  sections: readonly { title: string; text: string }[]
  event?: { startsAt: string; location: string }
}>

export const editorialEntries: readonly EditorialEntry[] = [
  {
    slug: 'make-room-for-your-questions', category: 'Resources',
    title: 'Make room for your questions.',
    summary: 'A little preparation can help you get more from your next care conversation.',
    publishedAt: '2026-10-28', readingMinutes: 2,
    image: { src: '/editorial/care-illustration.webp', width: 1200, height: 800,
      alt: 'Illustration of a woman and an older man discussing their questions with a clinician',
      caption: 'Illustrative care conversation; people and setting are fictional.' },
    sections: [
      { title: 'Begin with what matters', text: 'Write down what you want to understand before your visit. You can use your own words. Think about what has changed, what concerns you, and what you would like to discuss first.' },
      { title: 'Bring the details', text: 'Gather any referral letter, earlier results, and a list of medicines you take. Confirm what your care team needs before travelling. Your visit checklist can help you organise the practical details.' },
      { title: 'Leave with a next step', text: 'Ask who to contact if you have more questions after your visit. If something is unclear, ask the team to explain it again or write it down.' },
    ],
  },
  {
    slug: 'understanding-medical-breakthroughs', category: 'News',
    title: 'Behind the breakthrough.',
    summary: 'Reading a medical headline? Start with the evidence and the questions it leaves open.',
    publishedAt: '2026-10-25', readingMinutes: 3,
    image: { src: '/editorial/medical-research.webp', width: 1200, height: 800,
      alt: 'Illustration of two Ethiopian medical researchers reviewing research charts beside a microscope',
      caption: 'AI-generated illustration of medical research; people and setting are fictional.' },
    sections: [
      { title: 'Look beyond the headline', text: 'A medical news story may describe an early study, a larger trial, or a treatment already in use. These are different stages. Look for a link to the original research and an explanation of what was actually studied.' },
      { title: 'Ask about the evidence', text: 'Who took part? What was compared? What benefits and limitations were reported? A useful article explains uncertainty as well as its findings. A promising result does not automatically mean a treatment is available locally.' },
      { title: 'Bring your questions', text: 'If a story relates to your care, bring it to your clinician. Ask whether the findings are relevant to your situation. This sample article explains how a future research update could be presented; it does not announce a hospital treatment or breakthrough.' },
    ],
  },
  {
    slug: 'a-conversation-about-care', category: 'Events',
    title: 'Let’s talk about care.',
    summary: 'A sample community conversation about preparing for a visit and asking your care team questions.',
    publishedAt: '2026-10-22', readingMinutes: 2,
    image: { src: '/editorial/community-conversation.webp', width: 1200, height: 800,
      alt: 'Illustration of Ethiopian adults discussing care with a health educator in a community room',
      caption: 'AI-generated illustration of a community conversation; no actual event is depicted.' },
    event: { startsAt: '2026-11-14T10:00:00+03:00', location: 'Sample venue · hospital confirmation pending' },
    sections: [
      { title: 'About the conversation', text: 'The discussion covers preparing questions, organising visit information, and finding practical support.' },
      { title: 'Before making plans', text: 'The date, time, location, programme, and attendance arrangements are illustrative. No event has been confirmed and registration is not open. Confirm all details with the hospital before travelling.' },
    ],
  },
  {
    slug: 'keep-your-visit-information-together', category: 'Resources',
    title: 'A little less to remember.',
    summary: 'Keep your questions, records, and practical visit details together in one place.',
    publishedAt: '2026-10-18', readingMinutes: 2,
    image: { src: '/editorial/whole-life-detail.webp', width: 720, height: 480,
      alt: 'Close-up of a woman holding a book in her lap',
      caption: 'Illustrative personal detail, accompanying the reminder to keep visit notes together.' },
    sections: [
      { title: 'Keep a simple list', text: 'Make a note of the documents and questions you want to bring. Include any support you would like to ask about, such as language, mobility, or a companion.' },
      { title: 'Check before you leave', text: 'Confirm your appointment arrangements, entrance, and department with the hospital. Use the visitor guide to explore a sample checklist before your visit.' },
    ],
  },
]

export function latestEditorial(entries: readonly EditorialEntry[]) {
  return [...entries].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt) || a.slug.localeCompare(b.slug))
}

const dateFormatter = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Africa/Addis_Ababa' })
export function editorialDate(value: string) {
  return dateFormatter.format(new Date(value))
}

export function eventStatus(startsAt: string, now = Date.now()) {
  return new Date(startsAt).getTime() > now ? 'Upcoming event' : 'Past event'
}
