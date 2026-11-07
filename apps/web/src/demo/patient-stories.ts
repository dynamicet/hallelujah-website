import type { PatientStory } from '../website/patient-testimonials'
import type { PatientQuote } from '../website/everyday-stories'

// Fictional layout examples, restricted to the local development homepage.
// Replace text and generated imagery together with approved patient material.
export const patientStories: readonly PatientStory[] = [
  {
    id: 'everyday-moments',
    video: { src: '/editorial/everyday-moments-preview.webm', captionsSrc: '/editorial/everyday-moments-preview.vtt', language: 'en', captionsLabel: 'English story text', transcript: ['At first, recovery felt like a long way from the life I knew. I missed our afternoons together: a quiet seat outside, a conversation, time without watching the clock.', 'I began to talk about those everyday things when I talked about my goals. Some days called for patience. On others, I noticed a small change and let myself feel hopeful.', 'Being together again did not mean every challenge had disappeared. It meant there was room for the things I loved, alongside the care I still needed.'] },
    status: 'published',
    title: 'Back to the little things.',
    attribution: 'Mekdes',
    quote: 'I looked forward to sitting with my daughter again. The small moments became something to work towards.',
    account: [
      'At first, recovery felt like a long way from the life I knew. I missed our afternoons together: a quiet seat outside, a conversation, time without watching the clock.',
      'I began to talk about those everyday things when I talked about my goals. Some days called for patience. On others, I noticed a small change and let myself feel hopeful.',
      'Being together again did not mean every challenge had disappeared. It meant there was room for the things I loved, alongside the care I still needed.',
    ],
    photograph: {
      src: '/editorial/open-arms-family.webp',
      alt: 'Older woman and her adult daughter sharing a quiet moment outdoors',
      width: 1536, height: 1024,
    },
  },
  {
    id: 'finding-my-voice',
    video: { src: '/editorial/finding-my-voice-preview.webm', captionsSrc: '/editorial/finding-my-voice-preview.vtt', language: 'en', captionsLabel: 'English story text', transcript: ['I used to arrive with questions in my head and forget them as soon as the conversation began. Before my next visit, I tucked a short list into the book I carried with me.', 'Having those words on paper helped me explain what worried me and ask what I could expect. I also made space to talk about what mattered in my day-to-day life.', 'I still take my questions with me. Feeling able to ask them is part of how I keep moving forward.'] },
    status: 'published',
    title: 'A little more confidence.',
    attribution: 'Hanna',
    quote: 'Writing down my questions helped me find my voice. I could take the next step with a little more confidence.',
    account: [
      'I used to arrive with questions in my head and forget them as soon as the conversation began. Before my next visit, I tucked a short list into the book I carried with me.',
      'Having those words on paper helped me explain what worried me and ask what I could expect. I also made space to talk about what mattered in my day-to-day life.',
      'I still take my questions with me. Feeling able to ask them is part of how I keep moving forward.',
    ],
    photograph: {
      src: '/editorial/whole-life-portrait.webp',
      alt: 'Woman in a cream shawl holding a favourite book',
      width: 960, height: 1200,
    },
  },
]

// Fictional preview quotes; replace with approved patient quotations before publication.
export const patientQuotes: readonly PatientQuote[] = [
  {
    id: 'time-to-listen', status: 'published', attribution: 'Selam',
    quote: 'It meant a lot to have time to explain what was on my mind.',
  },
  {
    id: 'someone-beside-me', status: 'published', attribution: 'Dawit',
    quote: 'Having someone beside me made it easier to ask the questions I had been holding back.',
  },
  {
    id: 'understanding-next-step', status: 'published', attribution: 'Tigist',
    quote: 'I left with my questions written down and a clearer idea of what to ask next.',
  },
]
