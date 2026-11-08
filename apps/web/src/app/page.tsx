import { WebsiteHome, DemoHeroArtwork, HomeCareContent, HomeDemoContactDetails, HomeInstitutionalContent } from '@home-experience'
import { HomePageTemplate } from '@/design-system/templates'
import { isLocalDemo } from '@/server/environment'
import { demoScenario } from '@/demo/scenarios'
import type { DemoSearchParams } from '@/demo/site'

const link = (id: string, label: string) => ({ href: `#home-${id}`, label })
const tasks = {
  appointment: { href: '/appointment', label: 'Request an appointment' },
  call: link('call', 'Call the hospital'),
  directions: link('directions', 'Locations and directions'),
  doctor: { href: '/doctors', label: 'Find a doctor' },
  emergency: { href: '/emergency', label: 'Emergency information' },
  service: { href: '/services', label: 'View all services' },
  search: { href: '/doctors#directory-search-title', label: 'Search doctors' },
}

export default async function HomePage({ searchParams }: { searchParams: DemoSearchParams }) {
  const localDemo = isLocalDemo()
  const scenario = localDemo
    ? demoScenario((await searchParams).demo, ['ready', 'partial', 'empty', 'unavailable'] as const, 'ready')
    : 'ready'
  if (localDemo && scenario === 'ready') return <WebsiteHome />
  return (
    <HomePageTemplate
      careContent={localDemo && scenario !== 'empty' ? <HomeCareContent partial={scenario === 'partial'} /> : undefined}
      description="Hallelujah General Hospital. Care for your health, with room for the person you are."
      demonstrationContactDetails={localDemo && scenario !== 'unavailable' ? <HomeDemoContactDetails /> : undefined}
      documents={[]}
      eyebrow="Welcome to Hallelujah"
      heroArtwork={localDemo ? <DemoHeroArtwork /> : undefined}
      institutionalContent={localDemo && scenario !== 'empty' ? <HomeInstitutionalContent /> : undefined}
      locale="en"
      now={new Date('2026-10-12T00:00:00Z')}
      searchDescription="Search the doctor directory by name or specialty."
      searchHeading="Find a doctor"
      searchAction={localDemo ? '/doctors' : undefined}
      showArrivalArtwork={localDemo && scenario !== 'unavailable'}
      shell={{
        skipLinkLabel: 'Skip to main content',
        header: {
          brandName: 'Hallelujah Hospital', homeHref: '/',
          homeLabel: 'Hallelujah Hospital home', identityLanguage: 'en', menuLabel: 'Menu',
          navigationMode: 'responsive',
          primaryNavigationLabel: 'Primary navigation',
          navigationItems: [
            { href: '/', label: 'Home', current: true },
            { href: '/doctors', label: 'Doctors' },
            { href: '/services', label: 'Services' },
            { href: '/appointment', label: 'Appointment' },
            { href: '/#home-directions', label: 'Directions' },
          ],
          searchItem: tasks.search,
          languageSwitcher: { alternate: { available: false, label: 'አማርኛ', lang: 'am', reason: 'This page is unavailable in Amharic.' }, currentLabel: 'English', currentLang: 'en', label: 'Language' },
          emergencyAction: { compact: true, href: tasks.emergency.href, label: tasks.emergency.label },
        },
        footer: {
          brandName: 'Hallelujah Hospital',
          navigationLabel: 'Footer navigation',
          groups: [{ label: 'Care and visits', links: [
            { href: '/', label: 'Home' },
            { href: '/doctors', label: 'Doctors' },
            { href: '/services', label: 'Services' },
            { href: '/appointment', label: 'Appointment' },
            { href: '/#home-directions', label: 'Directions' },
            { href: '/#home-call', label: 'Contact information' }, tasks.emergency,
          ] }],
        },
      }}
      tasks={tasks}
      tasksHeading="How can we help?"
      title="A whole life comes with you."
      showJourneyGuidance
      showSupportBand
    />
  )
}
