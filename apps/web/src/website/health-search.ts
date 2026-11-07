import type { HealthTopic } from '../demo/health-topics'

export const normalizeHealthQuery = (text: string) => text.normalize('NFKC').toLocaleLowerCase('en')
  .replaceAll(/[^\p{L}\p{N}]+/gu, ' ').trim()

export interface HealthMatch {
  readonly topic: HealthTopic
  readonly explanation?: string
}

// Search only the curated names and aliases, never infer a diagnosis from article text.
export function searchHealthTopics(topics: readonly HealthTopic[], query: string, letter = ''): HealthMatch[] {
  const term = normalizeHealthQuery(query)
  if (!term) return letter ? topics.filter((topic) => topic.name.startsWith(letter)).map((topic) => ({ topic })) : []
  const words = term.split(' ')
  return topics.flatMap((topic) => {
    const candidates = [topic.name, ...topic.aliases].flatMap((label, index) => {
      const value = normalizeHealthQuery(label)
      const tokens = value.split(' ')
      // All query words must match the same name or alias; unrelated aliases cannot combine.
      if (!words.every((word) => tokens.some((token) => token.startsWith(word)))) return []
      const score = value === term ? (index === 0 ? 0 : 1) : value.startsWith(term) ? (index === 0 ? 2 : 3) : (index === 0 ? 4 : 5)
      return [{ score, explanation: index ? `Matches “${label}”` : undefined }]
    }).sort((a, b) => a.score - b.score)
    return candidates.length ? [{ topic, ...candidates[0] }] : []
  }).sort((a, b) => a.score - b.score || a.topic.name.localeCompare(b.topic.name))
    .map(({ topic, explanation }) => ({ topic, explanation }))
}
