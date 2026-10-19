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
    appointment: { current: true, href: '#appointment-title', label: `Controlled Appointment${suffix}` },
    care: { href: '#appointment-request-form', label: `Synthetic request form${suffix}` },
    privacy: { href: '#appointment-privacy-title', label: `Controlled privacy boundary${suffix}` },
    states: { href: '#appointment-submit-title', label: `Request-state review${suffix}` },
    support: { href: '#appointment-support', label: `Synthetic support boundary${suffix}` },
  }
  const unavailable = state === 'workflow-unavailable'

  return {
    description: `Review a request-form composition without collecting, recording or sending any value. A request is not a confirmed booking${suffix}`,
    doctorOptions: [
      { disabled: true, label: 'Choose a synthetic doctor', value: '' },
      { label: `Dr Test Alpha — fictional record${suffix}`, value: 'doc_synthetic_alpha_0001' },
      { label: `Dr Test Beta — fictional record${suffix}`, value: 'doc_synthetic_beta_00002' },
    ],
    eyebrow: 'Controlled Appointment preview — synthetic and non-public',
    privacyDisclosure: `This local specimen makes no network request and stores no value. Do not enter a real name, telephone number, preferred date or health information${suffix}`,
    recipientLabel: `Patient Experience Team — synthetic recipient label${suffix}`,
    serviceOptions: [
      { disabled: true, label: 'Choose a synthetic service', value: '' },
      { label: `Synthetic Service Alpha — fictional record${suffix}`, value: 'svc_synthetic_alpha_0001' },
      { label: `Synthetic Service Beta — fictional record${suffix}`, value: 'svc_synthetic_beta_00002' },
    ],
    shell: {
      notice: 'Local preview · Hospital content, contacts and services are not published.',
      skipLinkLabel: 'Skip to main content',
      header: {
        brandName: 'Hallelujah Hospital',
        homeHref: '#appointment-title',
        homeLabel: 'Hallelujah Hospital controlled Appointment home',
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
        brandName: 'Hallelujah Hospital — controlled identity',
        description: 'Loopback-only Appointment preview. Collection, recipients, messaging providers and publication remain disabled.',
        groups: unavailable
          ? [{ label: 'Access and governance', links: [links.support, links.appointment] }]
          : [
              { label: 'Controlled request review', links: [links.care, links.privacy, links.states] },
              { label: 'Access and governance', links: [links.support, links.appointment] },
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
    warning: `This controlled English placeholder does not provide emergency instructions or a real contact route. Approved hospital wording is still required${suffix}`,
  }
}
