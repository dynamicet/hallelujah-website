import { EmergencyAction, LanguageSwitcher, type SiteShellProps } from '@/design-system/components'
import type { HomePageTemplateProps } from '@/design-system/templates'
import { hospitalContact } from './hospital-contact'
import { hospitalCollaborationLink, hospitalFooter } from './site-footer'

// All public pages use this configuration.
export function hospitalShellConfig(current: string): HomePageTemplateProps['shell'] {
  const navigationItems = [
    { href: '/', label: 'Home' },
    { href: '/doctors', label: 'Doctors' },
    { href: '/services', label: 'Services' },
    { href: '/appointment', label: 'Appointment' },
    { href: '/about', label: 'About Us' },
    { href: '/careers', label: 'Careers' },
  ].map((item) => ({ ...item, current: item.href === current || (item.href !== '/' && current.startsWith(`${item.href}/`)) }))
  return {
    showCallAction: current !== '/emergency',
    skipLinkLabel: 'Skip to main content',
    header: {
      contactTargets: { call: hospitalContact.hotlineHref },
      contactCurrent: current === '/contact',
      collaborationItem: { ...hospitalCollaborationLink, current: current === hospitalCollaborationLink.href },
      brandMark: <HospitalBrandMark />,
      brandName: 'Hallelujah Hospital', homeHref: '/', homeLabel: 'Hallelujah Hospital home',
      identityLanguage: 'en', menuLabel: 'Menu', navigationMode: 'responsive',
      primaryNavigationLabel: 'Primary navigation', navigationItems,
      searchItem: { href: '/doctors#directory-search-title', label: 'Search doctors' },
      emergencyAction: { compact: true, href: '/emergency', label: 'Emergency information' },
      languageSwitcher: { alternate: { available: false, label: 'አማርኛ', lang: 'am', reason: 'This page is unavailable in Amharic.' }, currentLabel: 'English', currentLang: 'en', label: 'Language' },
    },
    footer: { ...hospitalFooter, variant: current === '/' ? 'full' : 'compact' },
  }
}

function HospitalBrandMark() {
  // Bundled hospital identity; portraits are never inferred from this asset.
  // eslint-disable-next-line @next/next/no-img-element
  return <img src="/brand/hallelujah-emblem.png" width="50" height="45" alt="" />
}

export function hospitalShell(current: string): Omit<SiteShellProps, 'children'> {
  const shell = hospitalShellConfig(current)
  return {
    ...shell,
    header: {
      ...shell.header,
      emergencyAction: <EmergencyAction {...shell.header.emergencyAction} />,
      languageSwitcher: <LanguageSwitcher {...shell.header.languageSwitcher} />,
    },
  }
}
