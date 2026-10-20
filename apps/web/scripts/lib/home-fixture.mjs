// Review data only; approval, live destination and hospital content gates remain closed.
export const homeFixtureStates = ['static', 'hero', 'story', 'media-failure', 'long-labels']
export function homeFixture(state = 'static') {
  if (!homeFixtureStates.includes(state)) throw new Error('Unsupported Home review state')
  const link = (id, label) => ({ href: `#home-${id}`, label })
  const tasks = {
    appointment: link('appointment', 'Request an appointment'),
    call: link('call', 'Call the hospital'),
    directions: link('directions', 'Locations and directions'),
    doctor: link('doctor', 'Find a doctor'),
    emergency: link('emergency', 'Emergency information'),
    service: link('service', 'Explore services'),
    search: link('search-status', 'Search availability'),
  }
  if (state === 'long-labels') {
    for (const task of Object.values(tasks)) task.label += ' — expanded English label / የቁጥጥር ምሳሌ (unreviewed shaping)'
  }
  return {
    description: 'Find a doctor, explore services, or review appointment information.',
    eyebrow: 'Care access, clearly organized',
    title: 'Find the next step for your care',
    tasksHeading: 'How can we help?',
    searchHeading: 'Search this website',
    searchDescription: 'Search is unavailable. Use the care routes above to continue.',
    tasks,
    shell: {
      skipLinkLabel: 'Skip to main content',
      header: {
        brandName: 'Hallelujah Hospital', homeHref: '#main-content',
        homeLabel: 'Hallelujah Hospital home', identityLanguage: 'en',
        menuLabel: 'Menu', primaryNavigationLabel: 'Primary',
        navigationMode: state === 'long-labels' ? 'compact' : 'responsive',
        navigationItems: [tasks.doctor, tasks.service, tasks.appointment, tasks.directions],
        searchItem: tasks.search,
      },
      footer: {
        brandName: 'Hallelujah Hospital',
        description: 'Find information for your care and visit.',
        navigationLabel: 'Footer', groups: [{ label: 'Care access', links: Object.values(tasks) }],
      },
    },
    ...(['hero', 'story', 'media-failure'].includes(state) ? { media: {
      placement: state === 'story' ? 'story' : 'hero',
      presentation: {
        authority: 'controlled-fixture', heading: 'abstract test film',
        posterDescription: 'A written still for abstract test media. It depicts no hospital people or facilities.',
        source: { kind: 'informative', src: state === 'media-failure' ? '/missing.webm' : '/fixtures/b01-012-abstract-motion.webm',
          captionsSrc: '/fixtures/b01-012-abstract-motion.vtt', transcriptHref: '#home-transcript' },
      },
    } } : {}),
  }
}

export const homeDestinationDescriptions = {
  emergency: ['Emergency information', 'Emergency contact information is unavailable.'],
  doctor: ['Find a doctor', 'The doctor directory is unavailable.'],
  service: ['Explore services', 'The service directory is unavailable.'],
  appointment: ['Request an appointment', 'Online appointment requests are unavailable. No request is submitted and no booking is confirmed.'],
  call: ['Call the hospital', 'Telephone contact information is unavailable.'],
  directions: ['Locations and directions', 'Location and arrival information is unavailable.'],
  'search-status': ['Search availability', 'Search is unavailable.'],
}
