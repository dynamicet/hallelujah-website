export const retiredVisitGuides = [
  { source: '/services/synthetic-service-121212121212', destination: '/services/synthetic-service-111111111111#care-team' },
  { source: '/services/synthetic-service-131313131313', destination: '/contact#before-you-travel' },
  { source: '/services/synthetic-service-191919191919', destination: '/contact#contact-reception' },
] as const

export function isRetiredVisitGuide(path: string): boolean {
  return retiredVisitGuides.some(({ source }) => source === path.replace(/\/$/u, ''))
}
