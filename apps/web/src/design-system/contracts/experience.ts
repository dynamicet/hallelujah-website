export const experienceLevels = [0, 1, 2, 3, 4] as const

export type ExperienceLevel = (typeof experienceLevels)[number]

export const protectedExperienceContexts = [
  'emergency',
  'urgent-guidance',
  'consequential-appointment',
  'error',
  'privacy-consent',
  'unavailable-expired',
  'unknown-outcome',
] as const

export type ProtectedExperienceContext = (typeof protectedExperienceContexts)[number]

export interface ProtectedExperiencePolicy {
  readonly allowsFunctionalFeedback: true
  readonly maxExpressiveLevel: 0
}

export const protectedExperiencePolicy = Object.freeze({
  allowsFunctionalFeedback: true,
  maxExpressiveLevel: 0,
}) satisfies ProtectedExperiencePolicy
