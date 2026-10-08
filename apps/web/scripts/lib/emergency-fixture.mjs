// Review data only. Values are deliberately invalid/inert and cannot be used for care.
export const emergencyFixtureStates = [
  'controlled',
  'long-content',
  'required-content-withheld',
  'required-content-expired',
  'call-handoff-unsupported',
  'call-handoff-unsupported-injected',
  'required-arrival-unavailable',
  'optional-map-failed',
  'optional-map-blocked',
]

const controlledAsOf = '2026-09-23T12:00:00+03:00'

export function emergencySourceFixture({ expanded = false } = {}) {
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
    approval: 'approved',
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
    lifecycle: { expiresOn: '2026-10-23T12:00:00+03:00' },
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
      notice: 'Local preview · Hospital content, contacts and services are not published.',
      skipLinkLabel: 'Skip to main content',
      header: {
        brandName: 'Hallelujah Hospital',
        homeHref: '#main-content',
        homeLabel: 'Hallelujah Hospital controlled home',
        identityLanguage: 'en',
        menuLabel: 'Menu',
        navigationMode: expanded ? 'compact' : 'responsive',
        navigationItems: [
          { current: true, ...links.home, label: `Emergency${suffix}` },
          { ...links.routes, label: `Choices${suffix}` },
          { ...links.scope, label: `Scope${suffix}` },
          { ...links.directions, label: `Directions${suffix}` },
          { ...links.support, label: `Support${suffix}` },
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

export function resolveEmergencyFixture(record, controls = {}) {
  const {
    announcement = 'static',
    asOf = controlledAsOf,
    handoff = 'withheld',
    map = 'disabled',
  } = controls
  const expiresAt = Date.parse(record.lifecycle?.expiresOn ?? '')
  const evaluatedAt = Date.parse(asOf)

  // Expiry always dominates withholding, invalid required fields and lower interaction states.
  if (!Number.isFinite(expiresAt) || !Number.isFinite(evaluatedAt) || expiresAt <= evaluatedAt) {
    return failClosedFixture(record.shell, {
      description: 'The controlled record is outside its approved lifecycle. Every prior value is withheld together and no successor is inferred.',
      heading: 'Controlled Emergency information has expired',
      kind: 'expired',
      reason: 'required-content-expired',
      recoveryLabel: 'Review the controlled preview boundary',
    })
  }

  if (record.approval !== 'approved') {
    return failClosedFixture(record.shell, {
      description: 'Required approval is absent. Candidate and previously reviewed values are not rendered.',
      heading: 'Controlled Emergency information is withheld',
      kind: 'unavailable',
      reason: 'required-content-withheld',
      recoveryLabel: 'Review the controlled approval boundary',
    })
  }

  const missingPath = requiredEmergencyPaths.find((path) => !hasRequiredValue(record, path))
  if (missingPath) {
    const arrivalMissing = missingPath.startsWith('arrival.')
    return failClosedFixture(record.shell, {
      description: arrivalMissing
        ? 'A required controlled arrival fact is unavailable. No map or generic direction substitutes for it.'
        : 'A required controlled safety fact is unavailable. No value is guessed, retained or substituted.',
      heading: arrivalMissing
        ? 'Required controlled arrival information is unavailable'
        : 'Required controlled Emergency information is unavailable',
      kind: 'unavailable',
      reason: arrivalMissing ? 'required-arrival-unavailable' : 'required-content-withheld',
      recoveryLabel: 'Review the controlled content boundary',
    })
  }

  const state = handoff === 'unsupported'
    ? {
        announcement,
        description: 'Purpose and deliberately invalid display values remain readable. No card or surrounding space activates a dialer, and this state does not claim a call or service failed.',
        kind: 'call-handoff-unsupported',
      }
    : {
        announcement: 'static',
        kind: map === 'failed' ? 'map-failed' : map === 'blocked' ? 'map-blocked' : 'ready',
      }
  const mapStatus = map === 'failed'
    ? 'The optional synthetic map failed. Complete text directions and accessible-arrival guidance remain above.'
    : map === 'blocked'
      ? 'The optional synthetic map provider is blocked. Complete text directions remain available without a request or fallback link.'
      : 'Map loading is disabled. Complete synthetic text guidance remains visible.'
  const content = { ...record }
  delete content.approval
  delete content.lifecycle

  return { ...content, mapStatus, state }
}

export function emergencyFixture(state = 'controlled') {
  if (!emergencyFixtureStates.includes(state)) throw new Error('Unsupported Emergency review state')

  const record = emergencySourceFixture({ expanded: state === 'long-content' })
  const controls = {}
  if (state === 'required-content-withheld') record.approval = 'withheld'
  if (state === 'required-content-expired') {
    record.approval = 'withheld'
    record.arrival.entrance = ''
    record.lifecycle.expiresOn = '2026-09-22T12:00:00+03:00'
    controls.handoff = 'unsupported'
    controls.map = 'failed'
  }
  if (state === 'required-arrival-unavailable') record.arrival.entrance = ''
  if (state === 'call-handoff-unsupported' || state === 'call-handoff-unsupported-injected') {
    controls.handoff = 'unsupported'
  }
  if (state === 'call-handoff-unsupported-injected') controls.announcement = 'polite'
  if (state === 'optional-map-failed') controls.map = 'failed'
  if (state === 'optional-map-blocked') controls.map = 'blocked'
  return resolveEmergencyFixture(record, controls)
}

const requiredEmergencyPaths = [
  'arrival.accessibleEntrance',
  'arrival.address',
  'arrival.entrance',
  'arrival.parking',
  'arrival.publicTransport',
  'arrival.steps',
  'description',
  'eyebrow',
  'hospitalChoice.audience',
  'hospitalChoice.displayValue',
  'hospitalChoice.hours',
  'hospitalChoice.label',
  'hospitalChoice.limitations',
  'hospitalChoice.purpose',
  'publicChoice.audience',
  'publicChoice.displayValue',
  'publicChoice.hours',
  'publicChoice.label',
  'publicChoice.limitations',
  'publicChoice.purpose',
  'scope.availability',
  'scope.limitations',
  'scope.owner',
  'scope.reviewedLabel',
  'scope.reviewedOn',
  'scope.summary',
  'support',
  'title',
  'warning',
]

function failClosedFixture(shell, state) {
  return {
    eyebrow: 'Controlled Emergency preview — synthetic and non-public',
    shell: failClosedShell(shell),
    state: { announcement: 'static', ...state },
    title: 'Emergency information unavailable',
  }
}

function failClosedShell(shell) {
  const safeLink = { href: '#non-emergency-support', label: 'Controlled preview boundary' }
  return {
    ...shell,
    footer: {
      ...shell.footer,
      groups: [{ label: 'Controlled state recovery', links: [safeLink] }],
    },
    header: {
      ...shell.header,
      navigationItems: [{ current: true, href: '#main-content', label: 'Controlled Emergency' }, safeLink],
      searchItem: safeLink,
    },
  }
}

function hasRequiredValue(record, path) {
  const value = path.split('.').reduce((current, key) => current?.[key], record)
  if (Array.isArray(value)) return value.length > 0 && value.every(isNonEmptyString)
  return isNonEmptyString(value)
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0
}
