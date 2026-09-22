// Review data only. Values are deliberately invalid/inert and cannot be used for care.
export const emergencyFixtureStates = ['controlled', 'long-content']

export function emergencyFixture(state = 'controlled') {
  if (!emergencyFixtureStates.includes(state)) throw new Error('Unsupported Emergency review state')

  const expanded = state === 'long-content'
  const suffix = expanded
    ? ' — expanded controlled-development wording for narrow-screen wrapping and reflow review'
    : ''

  const hospitalChoice = {
    audience: `Synthetic visitors directed to a fictional hospital route${suffix}`,
    displayValue: '+0 000 000 0001 — INVALID TEST VALUE',
    hours: `Synthetic always-visible schedule placeholder; no staffed hours are represented${suffix}`,
    label: `Hospital emergency route${suffix}`,
    limitations: `No service, coverage, response or availability is represented${suffix}`,
    purpose: `Review the hospital-route layout without identifying a real hospital service${suffix}`,
  }
  const publicChoice = {
    audience: `Synthetic visitors directed to a fictional public route${suffix}`,
    displayValue: '+0 000 000 0002 — INVALID TEST VALUE',
    hours: `Synthetic jurisdiction placeholder; no public service is represented${suffix}`,
    label: `Public emergency route${suffix}`,
    limitations: `No country, jurisdiction, dispatch service or response is represented${suffix}`,
    purpose: `Review the public-route distinction without publishing emergency advice${suffix}`,
  }

  const links = {
    home: { href: '#main-content', label: 'Controlled Emergency' },
    routes: { href: '#route-difference-title', label: `Route distinction${suffix}` },
    scope: { href: '#hospital-scope-title', label: `Hospital scope${suffix}` },
    directions: { href: '#where-to-go-title', label: `Arrival guidance${suffix}` },
    support: { href: '#non-emergency-support', label: `Non-emergency support${suffix}` },
  }

  return {
    arrival: {
      accessibleEntrance: `Synthetic step-free entrance beside Test Marker C; no real accessible route is represented${suffix}`,
      address: `SYNTHETIC SITE — 100 Test Avenue, Example District${suffix}`,
      entrance: `Synthetic Emergency Entrance C beneath the red TEST marker${suffix}`,
      parking: `Use the synthetic access lane and test parking zone; not real arrival guidance${suffix}`,
      publicTransport: `Exit at Test Stop B and follow synthetic signs; no real transport route is represented${suffix}`,
      steps: [
        `Begin at Synthetic Junction A${suffix}`,
        `Continue past Test Landmark B${suffix}`,
        `Enter through Synthetic Emergency Entrance C${suffix}`,
      ],
    },
    description: `Review the distinction between two fictional routes before the inert call placeholders. No value on this page can be used to obtain help${suffix}`,
    eyebrow: 'Controlled Emergency preview — synthetic and non-public',
    hospitalChoice,
    mapStatus: `Map loading is disabled. Complete synthetic text guidance remains visible${suffix}`,
    publicChoice,
    scope: {
      availability: `Synthetic availability placeholder; no hours or response are represented${suffix}`,
      limitations: `Adult, pediatric, ambulance and clinical scope remain withheld${suffix}`,
      owner: 'Controlled fixture owner — not a hospital approver',
      reviewedLabel: '22 September 2026 fixture review',
      reviewedOn: '2026-09-22',
      summary: `Synthetic scope copy reserves the governed content position without claiming any capability, patient group, service or operating status${suffix}`,
    },
    shell: {
      skipLinkLabel: 'Skip to main content',
      header: {
        brandName: 'Hallelujah Hospital — controlled identity',
        homeHref: '#main-content',
        menuLabel: 'Menu',
        navigationItems: [
          { current: true, ...links.home },
          links.routes,
          links.scope,
          links.directions,
          links.support,
        ],
        primaryNavigationLabel: 'Primary',
        searchItem: links.support,
      },
      footer: {
        brandName: 'Hallelujah Hospital — controlled identity',
        description: 'Loopback-only Emergency preview. Safety facts, calls, routes, providers and publication remain disabled.',
        groups: [
          { label: 'Controlled safety review', links: [links.routes, links.scope, links.directions] },
          { label: 'Access and governance', links: [links.support, links.home] },
        ],
        navigationLabel: 'Footer',
      },
    },
    support: `Non-emergency telephone, email and location actions remain withheld. This fixture accepts no contact or request${suffix}`,
    title: `Emergency help${suffix}`,
    warning: `Synthetic warning: delayed digital channels are not represented as emergency routes. Hospital-approved wording is still required${suffix}`,
  }
}
