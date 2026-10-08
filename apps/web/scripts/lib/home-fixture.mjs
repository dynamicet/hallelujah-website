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
    description: 'Find a doctor, explore services, or review appointment information. This controlled preview has no live hospital actions.',
    eyebrow: 'Controlled Home preview — draft copy',
    title: 'Find the next step for your care',
    tasksHeading: 'How can we help?',
    searchHeading: 'Search this website',
    searchDescription: 'Search is unavailable in this preview. Use the task links above to review the available journeys.',
    tasks,
    shell: {
      notice: 'Local preview · Hospital content, contacts and services are not published.',
      skipLinkLabel: 'Skip to main content',
      header: {
        brandName: 'Hallelujah Hospital', homeHref: '#main-content',
        homeLabel: 'Hallelujah Hospital controlled home', identityLanguage: 'en',
        menuLabel: 'Menu', primaryNavigationLabel: 'Primary',
        navigationMode: state === 'long-labels' ? 'compact' : 'responsive',
        navigationItems: [tasks.doctor, tasks.service, tasks.appointment, tasks.directions],
        searchItem: tasks.search,
      },
      footer: {
        brandName: 'Hallelujah Hospital — controlled identity',
        description: 'Local preview only. Hospital content, contacts, media and route publication remain withheld.',
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
  emergency: ['Emergency information', 'Verified emergency guidance and telephone contacts are withheld pending hospital approval. This preview provides no urgent advice.'],
  doctor: ['Find a doctor', 'The doctor directory is not available in this preview. No clinician or availability is represented.'],
  service: ['Explore services', 'The service directory is not available in this preview. No clinical capability is represented.'],
  appointment: ['Request an appointment', 'Online appointment requests are unavailable. No request is submitted and no booking is confirmed.'],
  call: ['Call the hospital', 'Hospital telephone contacts are withheld until a canonical record is approved. No telephone link is active.'],
  directions: ['Locations and directions', 'Verified address, entrance and text directions are withheld pending hospital approval. No map or geolocation is enabled.'],
  'search-status': ['Search availability', 'Search is unavailable. This preview accepts no search queries.'],
}
