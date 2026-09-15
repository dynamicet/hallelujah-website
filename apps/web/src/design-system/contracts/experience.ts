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

export const experienceAreas = [
  'shared-shell',
  'home-hero',
  'home-wayfinding',
  'about-story',
  'patient-stages',
  'arrival',
  'care-discovery',
  'appointment',
] as const

export type ExperienceArea = (typeof experienceAreas)[number]
export type ExpressiveLevel = 0 | 1 | 2 | 3

export const experienceAreaCeilings: Readonly<Record<ExperienceArea, ExpressiveLevel>> = {
  'shared-shell': 2,
  'home-hero': 3,
  'home-wayfinding': 3,
  'about-story': 3,
  'patient-stages': 3,
  arrival: 2,
  'care-discovery': 2,
  appointment: 1,
}

export function resolveExperienceLevel(
  area: ExperienceArea,
  requestedLevel: ExpressiveLevel,
  protectedContext?: ProtectedExperienceContext,
): ExpressiveLevel {
  if (protectedContext) return protectedExperiencePolicy.maxExpressiveLevel
  return Math.min(requestedLevel, experienceAreaCeilings[area]) as ExpressiveLevel
}
