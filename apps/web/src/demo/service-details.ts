// Editorial questions for the local preview; these do not assert clinical capabilities.
export const serviceVisitQuestions: Readonly<Record<string, readonly string[]>> = {
  pub_111111111111: ['Who will confirm my admission and arrival time?', 'What should I bring for a planned hospital stay?'],
  pub_121212121212: ['Who can explain the plan for my stay?', 'What should my companion know before visiting?'],
  pub_131313131313: ['How long should I allow for the visit?', 'Will I need someone to accompany me home?'],
  pub_141414141414: ['Which health concerns should I discuss first?', 'Would earlier results help with this consultation?'],
  pub_151515151515: ['Which earlier heart-care records should I bring?', 'Which questions should I prepare for the consultation?'],
  pub_161616161616: ['What should I note about my breathing concerns?', 'Which earlier reports would be useful to bring?'],
  pub_171717171717: ['How can I describe my recovery goals?', 'Should I bring information about earlier therapy?'],
  pub_181818181818: ['How can I describe the communication support I need?', 'Can a family member help explain my questions?'],
  pub_191919191919: ['Will I need a referral before arranging a visit?', 'Who can explain which therapy options are relevant?'],
  pub_212121212121: ['Which earlier visit notes should I bring?', 'What should I clarify at my next conversation?'],
}

// Match the illustrative affiliations already used by the doctor profiles.
export function relatedServiceIds(specialties: readonly string[]): readonly string[] {
  if (specialties.includes('Heart care')) return ['pub_151515151515', 'pub_212121212121']
  if (specialties.includes('Family care')) return ['pub_141414141414', 'pub_212121212121']
  return []
}
