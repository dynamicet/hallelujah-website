import { EmergencyAction, LanguageSwitcher } from '@/design-system/components'
import { HomeContactTemplate } from '@/design-system/templates'

const link = (id: string, label: string) => ({ href: `#home-${id}`, label })
const tasks = {
  appointment: link('appointment', 'Request an appointment'),
  call: link('call', 'Call the hospital'),
  directions: link('directions', 'Locations and directions'),
  doctor: link('doctor', 'Find a doctor'),
  emergency: link('emergency', 'Emergency information'),
  service: link('service', 'Explore services'),
  search: link('search-status', 'Search availability'),
}

export default function HomePage() {
  return (
    <HomeContactTemplate
      description="Find a doctor, explore services, or review appointment information. Hospital content remains controlled until it is approved for publication."
      documents={[]}
      eyebrow="Care access, clearly organized"
      locale="en"
      now={new Date('2026-10-12T00:00:00Z')}
      searchDescription="Search is not available yet. Use the care routes above to continue."
      searchHeading="Search this website"
      shell={{
        notice: 'Local preview · Hospital content, contacts and services are not published.',
        skipLinkLabel: 'Skip to main content',
        header: {
          brandName: 'Hallelujah Hospital', homeHref: '#main-content',
          homeLabel: 'Hallelujah Hospital home', identityLanguage: 'en', menuLabel: 'Menu',
          navigationMode: 'responsive',
          primaryNavigationLabel: 'Primary navigation',
          navigationItems: [tasks.doctor, tasks.service, tasks.appointment, tasks.directions],
          searchItem: tasks.search,
          languageSwitcher: <LanguageSwitcher alternate={{ available: false, label: 'አማርኛ', lang: 'am', reason: 'An approved Amharic Home page is not available.' }} currentLabel="English" currentLang="en" label="Language" />,
          emergencyAction: <EmergencyAction compact href={tasks.emergency.href} label={tasks.emergency.label} />,
        },
        footer: {
          brandName: 'Hallelujah Hospital — controlled identity',
          description: 'Hospital content and contact details remain withheld until approved.',
          navigationLabel: 'Footer navigation',
          groups: [{ label: 'Care access', links: Object.values(tasks) }],
        },
      }}
      tasks={tasks}
      tasksHeading="How can we help?"
      title="Find the next step for your care"
      showJourneyGuidance
      showSupportBand
    />
  )
}
