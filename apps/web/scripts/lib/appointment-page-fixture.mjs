// Review data only. Every value is synthetic and no fixture may enter a public route.
export const appointmentPageFixtureStates = [
  'controlled',
  'long-content',
  'validation',
  'pending',
  'known-failure',
  'unknown',
  'duplicate',
  'receipt',
  'delivery-warning',
  'workflow-unavailable',
]

const stateKinds = {
  controlled: 'editing',
  'delivery-warning': 'delivery-warning',
  duplicate: 'duplicate',
  'known-failure': 'known-failure',
  'long-content': 'editing',
  pending: 'pending',
  receipt: 'receipt',
  unknown: 'unknown',
  validation: 'validation',
  'workflow-unavailable': 'workflow-unavailable',
}

export function appointmentPageFixture(state = 'controlled') {
  if (!appointmentPageFixtureStates.includes(state)) {
    throw new Error('Unsupported Appointment page review state')
  }

  const expanded = state === 'long-content'
  const suffix = expanded
    ? ' — expanded synthetic wording for narrow-screen wrapping and text-reflow review'
    : ''
  const selectedCareRoute = state === 'validation'
    ? 'doctor'
    : ['pending', 'known-failure', 'unknown', 'duplicate', 'receipt', 'delivery-warning'].includes(state)
      ? 'service'
      : undefined

  const links = {
    appointment: { current: true, href: '#appointment-title', label: `Appointment${suffix}` },
    care: { href: '#appointment-request-form', label: `Request form${suffix}` },
    privacy: { href: '#appointment-privacy-title', label: `Privacy${suffix}` },
    states: { href: '#appointment-submit-title', label: `Request information${suffix}` },
    support: { href: '#appointment-support', label: `Support${suffix}` },
  }
  const unavailable = state === 'workflow-unavailable'

  return {
    description: `Online appointment requests are unavailable. No booking is confirmed${suffix}`,
    doctorOptions: [
      { disabled: true, label: 'Choose a doctor', value: '' },
      { label: `Dr Test Alpha${suffix}`, value: 'doc_synthetic_alpha_0001' },
      { label: `Dr Test Beta${suffix}`, value: 'doc_synthetic_beta_00002' },
    ],
    eyebrow: 'Appointment information',
    privacyDisclosure: `Do not enter personal or medical information. No appointment request will be sent${suffix}`,
    recipientLabel: `Patient Experience Team${suffix}`,
    serviceOptions: [
      { disabled: true, label: 'Choose a service', value: '' },
      { label: `Service Alpha${suffix}`, value: 'svc_synthetic_alpha_0001' },
      { label: `Service Beta${suffix}`, value: 'svc_synthetic_beta_00002' },
    ],
    shell: {
      skipLinkLabel: 'Skip to main content',
      header: {
        brandName: 'Hallelujah Hospital',
        homeHref: '#appointment-title',
        homeLabel: 'Hallelujah Hospital Appointment home',
        identityLanguage: 'en',
        menuLabel: 'Menu',
        navigationMode: expanded ? 'compact' : 'responsive',
        navigationItems: unavailable
          ? [{ ...links.appointment, label: 'Appointment' }, { ...links.support, label: 'Support' }]
          : [{ ...links.appointment, label: `Appointment${suffix}` }, { ...links.care, label: `Request form${suffix}` },
            { ...links.states, label: `Request status${suffix}` }, { ...links.support, label: `Support${suffix}` }],
        primaryNavigationLabel: 'Primary',
        searchItem: links.support,
      },
      footer: {
        brandName: 'Hallelujah Hospital',
        description: 'Find information for your care and visit.',
        groups: unavailable
          ? [{ label: 'Information', links: [links.support, links.appointment] }]
          : [
              { label: 'Appointment information', links: [links.care, links.privacy, links.states] },
              { label: 'Information', links: [links.support, links.appointment] },
            ],
        navigationLabel: 'Footer',
      },
    },
    state: {
      ...(state === 'validation' ? { errors: ['phone', 'privacy-acknowledged'] } : {}),
      interactive: state === 'controlled' || state === 'long-content',
      kind: stateKinds[state],
      ...(selectedCareRoute ? { selectedCareRoute } : {}),
      specimenReference: 'CONTROLLED-REQUEST-001',
    },
    title: `Request an appointment${suffix}`,
    warning: `This form cannot provide emergency help${suffix}`,
  }
}
